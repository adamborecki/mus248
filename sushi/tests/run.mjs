// Sushi tests. Run with:  node sushi/tests/run.mjs   (Node 18+, no dependencies)
//
// The backend tests run the real sushi/backend/Code.gs against the fake Google services in
// sushi/fake-google.js. The client tests drive the real client.js against that same backend
// through fake transports that can drop requests or lose replies.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadBackend } from '../fake-google.js';
import { SushiClient, UnreadableReply, createStore } from '../client.js';
import {
  dueLabel, escapeHtml, matchesFilters, minutesLabel, reconcileClaims, sortTasks, splitFeed, statusText,
} from '../logic.js';
import { SUSHI_CONFIG } from '../config.js';

const here = dirname(fileURLToPath(import.meta.url));
const sushiDir = join(here, '..');
const repoRoot = join(sushiDir, '..');
const SOURCE = readFileSync(join(sushiDir, 'backend', 'Code.gs'), 'utf8');
const uuid = () => crypto.randomUUID();
const secret = () => crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');

// ---------------------------------------------------------------------------
// A kitchen: the backend on a fresh fake Sheet, with a movable clock.
// ---------------------------------------------------------------------------

function kitchen({ now = new Date('2026-10-14T19:00:00Z'), props = {} } = {}) { // a Wednesday, noon in LA
  let clock = new Date(now);
  const { backend, google } = loadBackend(SOURCE, { now: () => clock, scriptProperties: props });
  google.setClock(() => clock);
  backend.setupSushi();
  const tasks = () => backend.table_('Tasks');
  const k = {
    backend, google,
    get now() { return clock; },
    advance(ms) { clock = new Date(clock.getTime() + ms); },
    setNow(d) { clock = new Date(d); },
    addTask(fields = {}) {
      const t = tasks();
      return backend.appendObject_(t, {
        task_id: backend.newId_('S', t, 'task_id'), active: 'yes', status: 'available', public_title: 'Clean keyboards',
        public_location: 'OH B01', category: 'Maintenance', effort_size: 'small', urgency: 'normal', note_mode: 'optional',
        verification_mode: 'self', created_at: clock, updated_at: clock, ...fields,
      }).task_id;
    },
    addTemplate(fields = {}) {
      const t = backend.table_('Templates');
      return backend.appendObject_(t, {
        template_id: backend.newId_('W', t, 'template_id'), active: 'yes', public_title: 'Weekly check', recurrence_kind: 'weekly',
        recurrence_value: 'Mon', category: 'Data Management', effort_size: 'small', note_mode: 'optional', verification_mode: 'self', ...fields,
      }).template_id;
    },
    post(body) { return JSON.parse(backend.doPost({ postData: { contents: JSON.stringify(body) } }).getContent()); },
    get(params = {}) { return JSON.parse(backend.doGet({ parameter: params }).getContent()); },
    feed() { google.cache.remove('public_feed'); return k.get(); },
    row(id) { return tasks().rows.find((r) => r.task_id === id); },
    events(id) { return backend.table_('Events').rows.filter((e) => !id || e.task_id === id); },
    claim(taskId, extra = {}) {
      const body = { action: 'claim', request_id: uuid(), task_id: taskId, claim_id: uuid(), claim_secret: secret(), actor_name: 'Test Person', actor_mode: 'MUS 248', ...extra };
      return { body, result: k.post(body) };
    },
    act(claim, action, extra = {}) {
      return k.post({ action, request_id: uuid(), task_id: claim.task_id, claim_id: claim.claim_id, claim_secret: claim.claim_secret, ...extra });
    },
  };
  return k;
}

const DAY = 864e5;

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

test('setup makes every tab with its headers, and running it again changes nothing', () => {
  const k = kitchen();
  const names = k.google.spreadsheet.getSheets().map((s) => s.getName());
  ['Start here', 'Tasks', 'Templates', 'Events', 'Config'].forEach((n) => assert.ok(names.includes(n), n));
  const headers = () => k.backend.table_('Tasks').headers.filter(Boolean);
  const before = headers();
  assert.deepEqual(before, k.backend.TASK_COLUMNS.map((c) => c.name));
  k.backend.setupSushi();
  assert.deepEqual(headers(), before);
  assert.equal(k.backend.table_('Tasks').rows.length, 1, 'examples are added once, on an empty sheet');
  assert.equal(String(k.backend.table_('Tasks').rows[0].active), 'no', 'example rows start switched off');
  assert.equal(k.feed().tasks.length, 0, 'switched-off examples never reach the public');
});

test('setup repairs a missing column without touching existing data', () => {
  const k = kitchen();
  const sheet = k.google.spreadsheet.getSheetByName('Tasks');
  const col = sheet.data[0].indexOf('admin_note');
  sheet.data.forEach((row) => row.splice(col, 1));
  k.backend.setupSushi();
  const t = k.backend.table_('Tasks');
  assert.ok(t.headers.includes('admin_note'));
  assert.equal(t.rows.length, 1);
});

// ---------------------------------------------------------------------------
// Privacy: the public feed is an allowlist
// ---------------------------------------------------------------------------

const PRIVATE_FIELDS = ['actor_name', 'actor_mode', 'help_note', 'completion_note', 'admin_note', 'private_context',
  'private_source_ref', 'claim_secret_hash', 'verified_by', 'evidence_ref', 'template_id', 'recurrence_key', 'source_type'];

test('no private column ever appears in the public feed, in any status', () => {
  const k = kitchen();
  ['available', 'claimed', 'help_requested', 'submitted', 'completed'].forEach((status) => {
    const fields = { status, completed_at: k.now, claim_id: uuid() };
    PRIVATE_FIELDS.forEach((f) => { fields[f] = `SENTINEL_${f}_${status}`; });
    k.addTask({ public_title: `Task ${status}`, ...fields });
  });
  const json = JSON.stringify(k.feed());
  assert.doesNotMatch(json, /SENTINEL_/);
  const feed = JSON.parse(json);
  assert.equal(feed.tasks.length, 5);
  feed.tasks.forEach((t) => assert.deepEqual(Object.keys(t).sort(), [...k.backend.PUBLIC_TASK_KEYS].sort()));
  assert.deepEqual(Object.keys(feed).sort(), ['api', 'kitchen', 'now', 'ok', 'tasks']);
  assert.ok(k.backend.privacyReport_().ok);
});

test('a real claim leaks neither the name, the mode, the note, nor the secret hash', () => {
  const k = kitchen();
  const id = k.addTask({ verification_mode: 'admin' });
  const { body } = k.claim(id, { actor_name: 'Zebulon Quixote', actor_mode: 'Student employee' });
  k.act(body, 'help', { note: 'the drawer is jammed shut' });
  k.act(body, 'complete', { note: 'finished despite the drawer' });
  const json = JSON.stringify(k.feed());
  assert.doesNotMatch(json, /Zebulon|Quixote|Student employee|drawer/);
  assert.doesNotMatch(json, new RegExp(k.row(id).claim_secret_hash));
  assert.doesNotMatch(json, new RegExp(body.claim_secret));
  assert.match(json, new RegExp(body.claim_id), 'the claim id is public on purpose');
});

test('the privacy check catches private text copied into a public column, and risky public text', () => {
  const k = kitchen();
  k.addTask({ private_context: 'unreleased gala at the mansion', public_description: 'Edit the unreleased gala at the mansion' });
  k.addTask({ public_title: 'Ask someone@example.com for the door code' });
  const report = k.backend.privacyReport_();
  assert.equal(report.ok, false);
  assert.ok(report.lines.some((l) => l.includes('private_context')));
  assert.ok(report.lines.some((l) => l.includes('email')));
  assert.ok(report.lines.some((l) => l.includes('access code')));
});

test('inactive tasks, rows without ids, and old cleared plates stay off the feed', () => {
  const k = kitchen();
  k.addTask({ public_title: 'Off', active: 'no' });
  k.addTask({ public_title: 'Old', status: 'completed', completed_at: new Date(k.now.getTime() - 30 * DAY) });
  k.addTask({ public_title: 'Recent', status: 'completed', completed_at: new Date(k.now.getTime() - 2 * DAY) });
  k.addTask({ public_title: 'Weird status', status: 'eaten' });
  const titles = k.feed().tasks.map((t) => t.title);
  assert.deepEqual(titles, ['Recent']);
});

// ---------------------------------------------------------------------------
// Claims: concurrency, idempotency, ownership
// ---------------------------------------------------------------------------

test('two phones cannot both claim the same plate', () => {
  const k = kitchen();
  const id = k.addTask();
  const first = k.claim(id, { actor_name: 'First' });
  const second = k.claim(id, { actor_name: 'Second' });
  assert.equal(first.result.ok, true);
  assert.equal(second.result.ok, false);
  assert.equal(second.result.code, 'conflict');
  assert.equal(k.row(id).actor_name, 'First');
  assert.equal(k.row(id).claim_id, first.body.claim_id);
  assert.equal(k.events(id).filter((e) => e.event_type === 'claim').length, 1);
});

test('a repeated request is applied once (double tap, retry after a lost reply)', () => {
  const k = kitchen();
  const id = k.addTask();
  const { body } = k.claim(id);
  const again = k.post(body);
  assert.equal(again.ok, true);
  assert.equal(again.duplicate, true);
  const done = { action: 'complete', request_id: uuid(), task_id: id, claim_id: body.claim_id, claim_secret: body.claim_secret };
  assert.equal(k.post(done).ok, true);
  assert.equal(k.post(done).duplicate, true, 'retrying the completion does not complete twice');
  k.google.cache.remove(`applied:${done.request_id}`);
  assert.equal(k.post(done).duplicate, true, 'the Events log still dedupes once the cache has expired');
  assert.equal(k.events(id).filter((e) => e.event_type === 'complete').length, 1);
});

test('the same phone re-sending its claim under a new request id still succeeds', () => {
  const k = kitchen();
  const id = k.addTask();
  const { body } = k.claim(id);
  const resend = k.post({ ...body, request_id: uuid() });
  assert.equal(resend.ok, true);
  assert.equal(k.events(id).filter((e) => e.event_type === 'claim').length, 1);
});

test('one phone cannot finish, release, or call the chef on another phone\'s claim', () => {
  const k = kitchen();
  const id = k.addTask();
  const { body } = k.claim(id);
  const forged = [
    { ...body, claim_secret: secret() },                 // knows the public claim id, not the secret
    { ...body, claim_id: uuid() },                       // has a secret, wrong claim
  ];
  forged.forEach((claim) => ['complete', 'release', 'help', 'resume'].forEach((action) => {
    const r = k.act(claim, action, { note: 'x' });
    assert.equal(r.ok, false);
    assert.equal(r.code, 'not_yours', `${action} with a forged claim`);
  }));
  assert.equal(k.row(id).status, 'claimed');
});

test('claim → call the chef → resume → finish (self-verified)', () => {
  const k = kitchen();
  const id = k.addTask();
  const { body } = k.claim(id);
  assert.equal(k.act(body, 'help', { note: 'which wipes?' }).task.status, 'help_requested');
  assert.equal(k.row(id).help_note, 'which wipes?');
  assert.equal(k.feed().tasks[0].status, 'help_requested');
  assert.equal(k.act(body, 'resume').task.status, 'claimed');
  const done = k.act(body, 'complete', { note: 'all clean' });
  assert.equal(done.task.status, 'completed');
  assert.equal(k.row(id).verified_by, 'self');
  assert.deepEqual(k.events(id).map((e) => e.event_type), ['claim', 'help', 'resume', 'complete']);
});

test('finishing straight from help_requested is allowed', () => {
  const k = kitchen();
  const id = k.addTask();
  const { body } = k.claim(id);
  k.act(body, 'help');
  assert.equal(k.act(body, 'complete').task.status, 'completed');
});

test('claim → put it back: the plate returns to the belt with the claim wiped, and someone else can take it', () => {
  const k = kitchen();
  const id = k.addTask();
  const { body } = k.claim(id);
  assert.equal(k.act(body, 'release').task.status, 'available');
  const row = k.row(id);
  ['claim_id', 'claim_secret_hash', 'actor_name', 'actor_mode'].forEach((f) => assert.equal(row[f], '', f));
  assert.equal(k.act(body, 'complete').code, 'not_yours', 'a released claim is dead');
  assert.equal(k.claim(id).result.ok, true);
});

test('admin-verified plate: finish → waiting for Adam → verified; send back; clear', () => {
  const k = kitchen();
  const id = k.addTask({ verification_mode: 'admin' });
  const { body } = k.claim(id);
  assert.equal(k.act(body, 'complete').task.status, 'submitted');
  assert.equal(k.row(id).completed_at, '');
  assert.equal(k.act(body, 'complete').code, 'wrong_state', 'cannot finish twice');
  assert.equal(k.backend.adminAction_(id, 'send_back').task.status, 'claimed');
  assert.equal(k.act(body, 'complete').task.status, 'submitted', 'the claimant can resubmit after a send-back');
  assert.equal(k.backend.adminAction_(id, 'verify').task.status, 'completed');
  assert.equal(k.row(id).verified_by, 'admin');
  assert.equal(k.backend.adminAction_(id, 'verify').code, 'wrong_state');
  assert.equal(k.backend.adminAction_(id, 'reopen').task.status, 'available');

  const other = k.addTask();
  const c = k.claim(other).body;
  assert.equal(k.backend.adminAction_(other, 'clear', 'abandoned').task.status, 'available');
  assert.equal(k.act(c, 'release').code, 'not_yours');
  assert.ok(k.events(other).some((e) => e.event_type === 'admin_clear' && e.note === 'abandoned'));
  k.backend.adminAction_(other, 'disable');
  assert.equal(k.feed().tasks.some((t) => t.id === other), false);
});

test('note rules: required is enforced, none drops the note', () => {
  const k = kitchen();
  const req = k.addTask({ note_mode: 'required' });
  const a = k.claim(req).body;
  assert.equal(k.act(a, 'complete', { note: '   ' }).code, 'note_required');
  assert.equal(k.row(req).status, 'claimed');
  assert.equal(k.act(a, 'complete', { note: 'done it' }).ok, true);
  const none = k.addTask({ note_mode: 'none' });
  const b = k.claim(none).body;
  k.act(b, 'complete', { note: 'ignored' });
  assert.equal(k.row(none).completion_note, '');
});

test('illegal moves are refused, and a client cannot name a status', () => {
  const k = kitchen();
  const id = k.addTask();
  const { body } = k.claim(id);
  assert.equal(k.act(body, 'resume').code, 'wrong_state', 'resume needs help_requested');
  assert.equal(k.post({ ...body, action: 'set_status', status: 'completed', request_id: uuid() }).code, 'invalid');
  assert.equal(k.post({ ...body, action: 'claim', request_id: uuid(), claim_id: uuid(), status: 'available' }).code, 'conflict');
  assert.equal(k.row(id).status, 'claimed');
});

test('input validation: ids, names, modes, notes, and unreadable bodies', () => {
  const k = kitchen();
  const id = k.addTask();
  const base = { action: 'claim', request_id: uuid(), task_id: id, claim_id: uuid(), claim_secret: secret(), actor_name: 'A', actor_mode: 'MUS 248' };
  const bad = [
    { ...base, request_id: 'nope' }, { ...base, task_id: 'has spaces' }, { ...base, claim_id: '1' },
    { ...base, claim_secret: 'short' }, { ...base, actor_name: '' }, { ...base, actor_name: 'x'.repeat(61) },
    { ...base, actor_mode: 'Professor' }, { ...base, action: 'eat' },
  ];
  bad.forEach((body) => assert.equal(k.post({ ...body, request_id: body.request_id === 'nope' ? 'nope' : uuid() }).code, 'invalid', JSON.stringify(body).slice(0, 80)));
  assert.equal(JSON.parse(k.backend.doPost({ postData: { contents: 'not json' } }).getContent()).code, 'invalid');
  assert.equal(JSON.parse(k.backend.doPost({}).getContent()).code, 'invalid');
  const claimed = k.claim(id).body;
  assert.equal(k.act(claimed, 'help', { note: 'n'.repeat(501) }).code, 'invalid');
  assert.equal(k.row(id).status, 'claimed');
  // The form-post fallback carries the same JSON in a `payload` field.
  const other = k.addTask();
  const form = { action: 'claim', request_id: uuid(), task_id: other, claim_id: uuid(), claim_secret: secret(), actor_name: 'Form', actor_mode: 'Other' };
  assert.equal(JSON.parse(k.backend.doPost({ parameter: { payload: JSON.stringify(form) } }).getContent()).ok, true);
});

test('typed text can never become a Sheet formula', () => {
  const k = kitchen();
  const id = k.addTask();
  const { body } = k.claim(id, { actor_name: '=IMPORTXML("http://x")' });
  k.act(body, 'complete', { note: '+1 more thing' });
  assert.equal(k.row(id).actor_name, '\'=IMPORTXML("http://x")');
  assert.equal(k.row(id).completion_note, '\'+1 more thing');
});

test('a held lock means "busy", changes nothing, and a retry later works', () => {
  const k = kitchen();
  const id = k.addTask();
  k.google.lock.heldElsewhere = true;
  const { body, result } = k.claim(id);
  assert.equal(result.code, 'busy');
  assert.equal(k.row(id).status, 'available');
  assert.equal(k.get({ action: 'receipt', request_id: body.request_id }).receipt.code, 'busy');
  k.google.lock.heldElsewhere = false;
  assert.equal(k.post(body).ok, true, 'the same request id can be retried after a failure');
});

test('receipts report what happened, and fall back to the Events log', () => {
  const k = kitchen();
  const id = k.addTask();
  const { body } = k.claim(id);
  const r = k.get({ action: 'receipt', request_id: body.request_id }).receipt;
  assert.equal(r.ok, true);
  assert.equal(r.task.status, 'claimed');
  assert.doesNotMatch(JSON.stringify(r), /Test Person/);
  assert.equal(k.get({ action: 'receipt', request_id: uuid() }).receipt, null);
  k.google.cache.remove(`receipt:${body.request_id}`);
  k.google.cache.remove(`applied:${body.request_id}`);
  assert.equal(k.get({ action: 'receipt', request_id: body.request_id }).receipt.ok, true);
  assert.equal(k.get({ action: 'receipt', request_id: 'x' }).code, 'invalid');
});

test('JSONP wraps only a plain callback name', () => {
  const k = kitchen();
  const out = k.backend.doGet({ parameter: { action: 'ping', callback: 'cb_1' } });
  assert.equal(out.getMimeType(), 'application/javascript');
  assert.match(out.getContent(), /^cb_1\(\{"ok":true/);
  const evil = k.backend.doGet({ parameter: { callback: 'alert(1);x' } });
  assert.equal(evil.getMimeType(), 'application/json');
  assert.equal(JSON.parse(evil.getContent()).code, 'invalid');
});

test('the feed reflects a mutation immediately (the cache is invalidated)', () => {
  const k = kitchen();
  const id = k.addTask();
  assert.equal(k.get().tasks[0].status, 'available');
  k.claim(id);
  assert.equal(k.get().tasks[0].status, 'claimed');
});

test('rapid repeats on one plate hit the rate limit', () => {
  const k = kitchen();
  const id = k.addTask();
  const { body } = k.claim(id);
  const codes = Array.from({ length: 14 }, () => k.act(body, 'help', { note: 'spam' }).code || 'ok');
  assert.ok(codes.includes('rate_limited'));
  k.advance(61000);
  assert.equal(k.act(body, 'resume').ok, true);
});

test('a closed kitchen refuses changes but still shows the belt', () => {
  const k = kitchen();
  const id = k.addTask();
  k.google.spreadsheet.getSheetByName('Config').data[0][1] = 'no';
  k.google.spreadsheet.getSheetByName('Config').data[1][1] = 'Back Monday.';
  const feed = k.feed();
  assert.deepEqual(feed.kitchen, { open: false, message: 'Back Monday.' });
  assert.equal(feed.tasks.length, 1);
  assert.equal(k.claim(id).result.code, 'kitchen_closed');
});

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

test('call the chef emails Adam once, privately, and only when an address is set', () => {
  const k = kitchen({ props: { ADMIN_EMAIL: 'admin@example.invalid' } });
  const id = k.addTask({ private_context: 'the real gig name' });
  const { body } = k.claim(id, { actor_name: 'Test Claimant' });
  const help = { action: 'help', request_id: uuid(), task_id: id, claim_id: body.claim_id, claim_secret: body.claim_secret, note: 'stuck on the cart' };
  k.post(help);
  k.post(help); // retry of the same request: no second email
  assert.equal(k.google.mail.length, 1);
  assert.match(k.google.mail[0].body, /Test Claimant/);
  assert.match(k.google.mail[0].body, /stuck on the cart/);
  assert.match(k.google.mail[0].body, /the real gig name/);

  const quiet = kitchen();
  const qid = quiet.addTask();
  quiet.act(quiet.claim(qid).body, 'help');
  assert.equal(quiet.google.mail.length, 0);
});

test('a failing mail service never breaks the help request', () => {
  const k = kitchen({ props: { ADMIN_EMAIL: 'admin@example.invalid' } });
  k.google.setMailFails(true);
  const id = k.addTask();
  const r = k.act(k.claim(id).body, 'help');
  assert.equal(r.ok, true);
  assert.equal(k.row(id).status, 'help_requested');
});

test('"waiting for verification" emails only when NOTIFY_SUBMITTED is on', () => {
  const off = kitchen({ props: { ADMIN_EMAIL: 'admin@example.invalid' } });
  off.act(off.claim(off.addTask({ verification_mode: 'admin' })).body, 'complete');
  assert.equal(off.google.mail.length, 0);
  const on = kitchen({ props: { ADMIN_EMAIL: 'admin@example.invalid', NOTIFY_SUBMITTED: 'true' } });
  on.act(on.claim(on.addTask({ verification_mode: 'admin' })).body, 'complete');
  assert.equal(on.google.mail.length, 1);
});

// ---------------------------------------------------------------------------
// Recurrence, hand-typed rows, urgency
// ---------------------------------------------------------------------------

test('a weekly template makes exactly one task per week, and retires last week\'s untouched one', () => {
  const k = kitchen(); // Wed Oct 14 2026, LA
  const tpl = k.addTemplate({ recurrence_value: 'Mon', private_context: 'private bit' });
  k.backend.runUpkeep();
  k.backend.runUpkeep();
  let made = k.backend.table_('Tasks').rows.filter((r) => r.template_id === tpl);
  assert.equal(made.length, 1);
  assert.equal(made[0].recurrence_key, `${tpl}@2026-10-12`);
  assert.equal(made[0].private_context, 'private bit');
  assert.equal(new Date(made[0].due_at).toISOString(), '2026-10-19T06:59:00.000Z', 'due Sunday 11:59 PM in LA');
  assert.equal(k.feed().tasks.find((t) => t.id === made[0].task_id).recurring, true);

  k.advance(7 * DAY);
  k.backend.runUpkeep();
  made = k.backend.table_('Tasks').rows.filter((r) => r.template_id === tpl);
  assert.equal(made.length, 2);
  assert.equal(String(made[0].active), 'no', 'last week\'s untouched task is retired');
  assert.ok(k.events(made[0].task_id).some((e) => e.event_type === 'superseded'));
  assert.equal(k.feed().tasks.filter((t) => t.title === 'Weekly check').length, 1);
});

test('a claimed task from last week is never retired: claims don\'t expire', () => {
  const k = kitchen();
  k.addTemplate();
  k.backend.runUpkeep();
  const first = k.backend.table_('Tasks').rows[1].task_id;
  k.claim(first);
  k.advance(7 * DAY);
  k.backend.runUpkeep();
  assert.equal(String(k.row(first).active), 'yes');
  assert.equal(k.row(first).status, 'claimed');
  assert.equal(k.feed().tasks.filter((t) => t.title === 'Weekly check').length, 2);
});

test('recurrence windows: weekly on the day itself, monthly across a year boundary', () => {
  const k = kitchen();
  const monday = k.backend.recurrenceWindow_('weekly', 'Mon', new Date('2026-10-12T15:00:00Z'));
  assert.equal(monday.key, '2026-10-12');
  const sunday = k.backend.recurrenceWindow_('weekly', 'Mon', new Date('2026-10-19T06:30:00Z')); // still Sunday night in LA
  assert.equal(sunday.key, '2026-10-12');
  const jan = k.backend.recurrenceWindow_('monthly', '15', new Date('2027-01-03T20:00:00Z'));
  assert.equal(jan.key, '2026-12-15');
  assert.equal(new Date(jan.due).toISOString(), '2027-01-15T07:59:00.000Z');
  assert.equal(k.backend.recurrenceWindow_('monthly', '31', new Date('2026-10-30T20:00:00Z')).key, '2026-10-28', 'days clamp to 28');
});

test('a manual template only makes tasks on request; inactive templates make none', () => {
  const k = kitchen();
  k.addTemplate({ recurrence_kind: 'manual' });
  k.addTemplate({ public_title: 'Paused', active: 'no' });
  k.backend.runUpkeep();
  assert.equal(k.backend.table_('Tasks').rows.filter((r) => r.template_id).length, 0);
});

test('a row typed by hand gets an id, a status, and a create event on the next read', () => {
  const k = kitchen();
  const sheet = k.google.spreadsheet.getSheetByName('Tasks');
  const headers = sheet.data[0];
  sheet.appendRow(headers.map((h) => ({ public_title: 'Hand typed', public_location: 'BH 208/209' }[h] || '')));
  k.google.cache.remove('upkeep_done');
  const feed = k.get();
  const t = feed.tasks.find((x) => x.title === 'Hand typed');
  assert.ok(t);
  assert.match(t.id, /^S-[2-9A-Z]{5}$/);
  assert.equal(t.status, 'available');
  assert.equal(String(k.row(t.id).active), 'yes');
  assert.ok(k.events(t.id).some((e) => e.event_type === 'create'));
});

test('urgency: a near due date reads as due soon, urgent stays urgent, a bare date means end of day', () => {
  const k = kitchen();
  k.addTask({ public_title: 'Soon', due_at: new Date(k.now.getTime() + DAY) });
  k.addTask({ public_title: 'Later', due_at: new Date(k.now.getTime() + 5 * DAY) });
  k.addTask({ public_title: 'Hot', urgency: 'urgent', due_at: new Date(k.now.getTime() + 9 * DAY) });
  k.addTask({ public_title: 'Bare date', due_at: new Date('2026-10-20T07:00:00Z') }); // midnight in LA
  const by = Object.fromEntries(k.feed().tasks.map((t) => [t.title, t]));
  assert.equal(by.Soon.urgency, 'due_soon');
  assert.equal(by.Later.urgency, 'normal');
  assert.equal(by.Hot.urgency, 'urgent');
  assert.equal(by['Bare date'].due_at, '2026-10-21T06:59:00.000Z');
});

// ---------------------------------------------------------------------------
// The client: confirmation, failure honesty, My Table
// ---------------------------------------------------------------------------

function memoryStorage() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k), map: m };
}

function directTransport(k, faults = {}) {
  return {
    faults,
    async get(params) { if (faults.offline) throw new TypeError('Failed to fetch'); return k.get(params); },
    async post(body) {
      if (faults.offline) throw new TypeError('Failed to fetch');
      const f = faults.next; faults.next = null;
      if (f === 'drop') throw new TypeError('Failed to fetch');
      const out = k.post(body);
      if (f === 'lose-reply') throw new UnreadableReply();
      return out;
    },
  };
}

function phone(k, { storage = memoryStorage(), faults = {}, name = 'Phone Tester' } = {}) {
  const client = new SushiClient({ transport: directTransport(k, faults), store: createStore(storage), namespace: 'live', confirmDelays: [0, 0], sleep: async () => {} });
  if (name) client.profile = { name, mode: 'MUS 248' };
  return { client, storage, faults };
}

test('client: claim → My Table, recognised only by this device\'s claim id', async () => {
  const k = kitchen();
  const id = k.addTask();
  const a = phone(k);
  const b = phone(k, { name: 'Other' });
  await a.client.refresh();
  const r = await a.client.claim(k.feed().tasks[0]);
  assert.equal(r.ok, true);
  const feed = (await a.client.refresh()).feed;
  assert.deepEqual(splitFeed(feed.tasks, a.client.myClaimIds()).mine.map((t) => t.id), [id]);
  await b.client.refresh();
  const theirs = splitFeed(feed.tasks, b.client.myClaimIds());
  assert.equal(theirs.mine.length, 0);
  assert.deepEqual(theirs.taken.map((t) => t.id), [id]);
  assert.equal(statusText(theirs.taken[0], false).short, 'Taken');
});

test('client: claims and profile survive a reload (same storage, new client)', async () => {
  const k = kitchen();
  k.addTask();
  const a = phone(k);
  await a.client.claim(k.feed().tasks[0]);
  const reloaded = phone(k, { storage: a.storage, name: null });
  assert.equal(reloaded.client.profile.name, 'Phone Tester');
  const feed = (await reloaded.client.refresh()).feed;
  assert.equal(splitFeed(feed.tasks, reloaded.client.myClaimIds()).mine.length, 1);
});

test('client: losing the race is reported as a conflict and leaves nothing on my table', async () => {
  const k = kitchen();
  k.addTask();
  const a = phone(k);
  const b = phone(k, { name: 'Other' });
  const stale = k.feed().tasks[0];
  assert.equal((await b.client.claim(stale)).ok, true);
  const r = await a.client.claim(stale);
  assert.equal(r.ok, false);
  assert.equal(r.code, 'conflict');
  assert.deepEqual(a.client.claims, {});
});

test('client: a double tap sends one request', async () => {
  const k = kitchen();
  const id = k.addTask();
  const a = phone(k);
  const task = k.feed().tasks[0];
  const [one, two] = await Promise.all([a.client.claim(task), a.client.claim(task)]);
  assert.deepEqual([one.ok, two.code], [true, 'in_flight']);
  assert.equal(k.events(id).filter((e) => e.event_type === 'claim').length, 1);
});

test('client: a lost reply is confirmed through the receipt, not assumed', async () => {
  const k = kitchen();
  k.addTask();
  const a = phone(k);
  a.faults.next = 'lose-reply';
  const r = await a.client.claim(k.feed().tasks[0]);
  assert.equal(r.ok, true);
  assert.equal(r.confirmedBy, 'receipt');
  assert.equal(Object.values(a.client.claims)[0].pending, false);
});

test('client: a request that never arrived is "unconfirmed", never success, and fades after the grace period', async () => {
  const k = kitchen();
  const id = k.addTask();
  const a = phone(k);
  a.faults.next = 'drop';
  const r = await a.client.claim(k.feed().tasks[0]);
  assert.equal(r.ok, false);
  assert.equal(r.code, 'unconfirmed');
  assert.equal(k.row(id).status, 'available');
  assert.equal(a.client.claims[id].pending, true, 'kept briefly, in case the request lands late');
  const later = reconcileClaims(a.client.claims, k.feed().tasks, Date.now() + 5 * 60000);
  assert.deepEqual(later.claims, {});
  assert.equal(later.notices.length, 0, 'an unconfirmed claim disappears quietly');
});

test('client: a lost finish is not shown as finished', async () => {
  const k = kitchen();
  const id = k.addTask();
  const a = phone(k);
  const task = k.feed().tasks[0];
  await a.client.claim(task);
  a.faults.next = 'drop';
  const r = await a.client.complete(task, 'done');
  assert.equal(r.code, 'unconfirmed');
  assert.equal(k.row(id).status, 'claimed');
  assert.ok(a.client.claims[id], 'still at my table');
});

test('client: backend errors are failures, not successes', async () => {
  const k = kitchen();
  const id = k.addTask({ note_mode: 'required' });
  const a = phone(k);
  const task = k.feed().tasks[0];
  await a.client.claim(task);
  const r = await a.client.complete(task, '');
  assert.deepEqual([r.ok, r.code], [false, 'note_required']);
  assert.ok(a.client.claims[id]);
  k.google.lock.heldElsewhere = true;
  assert.equal((await a.client.complete(task, 'x')).code, 'busy');
});

test('client: offline shows the cached belt as stale and never touches claims', async () => {
  const k = kitchen();
  k.addTask();
  const a = phone(k);
  await a.client.claim(k.feed().tasks[0]);
  await a.client.refresh();
  const claims = a.client.claims;
  a.faults.offline = true;
  const r = await a.client.refresh();
  assert.equal(r.ok, false);
  assert.equal(r.stale, true);
  assert.equal(r.feed.tasks.length, 1);
  assert.deepEqual(a.client.claims, claims);
  const fresh = phone(k, { faults: { offline: true } });
  assert.equal((await fresh.client.refresh()).feed, null, 'no cache yet: nothing to show, nothing invented');
});

test('client: release, help, verification, and an admin clear all land in the right place', async () => {
  const k = kitchen();
  const self = k.addTask({ public_title: 'Self' });
  const admin = k.addTask({ public_title: 'Admin', verification_mode: 'admin' });
  const cleared = k.addTask({ public_title: 'Cleared by Adam' });
  const a = phone(k);
  const find = (id) => k.feed().tasks.find((t) => t.id === id);
  for (const id of [self, admin, cleared]) assert.equal((await a.client.claim(find(id))).ok, true);

  assert.equal((await a.client.help(find(self), 'help')).task.status, 'help_requested');
  assert.equal((await a.client.complete(find(self), '')).task.status, 'completed');
  assert.equal(a.client.claims[self], undefined);
  assert.equal(a.client.history[0].id, self);

  assert.equal((await a.client.complete(find(admin), '')).task.status, 'submitted');
  k.backend.adminAction_(cleared, 'clear');
  const first = await a.client.refresh();
  assert.ok(first.notices.some((n) => n.kind === 'lost' && n.taskId === cleared), 'told once that Adam cleared it');
  assert.equal(a.client.claims[cleared], undefined);
  assert.equal(a.client.claims[admin].status, 'submitted');
  k.backend.adminAction_(admin, 'verify');
  const after = await a.client.refresh();
  assert.ok(after.notices.some((n) => n.kind === 'verified' && n.taskId === admin));
  assert.equal(after.notices.filter((n) => n.kind === 'lost').length, 0, 'and not told again');
  assert.deepEqual(a.client.claims, {});
  assert.ok(a.client.history.some((h) => h.id === admin));

  const r = k.addTask({ public_title: 'Released' });
  await a.client.claim(find(r));
  assert.equal((await a.client.release(find(r))).task.status, 'available');
  assert.equal(a.client.claims[r], undefined);
});

test('client: a phone without a profile is asked for a name before claiming', async () => {
  const k = kitchen();
  k.addTask();
  const a = phone(k, { name: null });
  const r = await a.client.claim(k.feed().tasks[0]);
  assert.equal(r.code, 'no_profile');
  assert.deepEqual(a.client.claims, {});
});

test('client: broken localStorage does not break the client', async () => {
  const k = kitchen();
  k.addTask();
  const broken = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); }, removeItem() { throw new Error('denied'); } };
  const a = phone(k, { storage: broken, name: null });
  assert.equal((await a.client.refresh()).ok, true);
});

// ---------------------------------------------------------------------------
// Display logic
// ---------------------------------------------------------------------------

test('logic: plate time labels, sorting, filtering, escaping', () => {
  assert.equal(minutesLabel({ minutes_min: 10, minutes_max: 20 }), '10–20 min');
  assert.equal(minutesLabel({ minutes_min: 15, minutes_max: 15 }), '~15 min');
  assert.equal(minutesLabel({ effort: 'boat', minutes_min: null, minutes_max: null }), 'a project, 60+ min');
  const t = (title, extra) => ({ title, urgency: 'normal', effort: 'medium', due_at: null, location: 'A', category: 'Maintenance', ...extra });
  const sorted = sortTasks([t('c'), t('b', { urgency: 'urgent' }), t('a', { due_at: '2026-10-20T00:00:00Z' }), t('d', { urgency: 'due_soon' }), t('e', { effort: 'small' })]);
  assert.deepEqual(sorted.map((x) => x.title), ['b', 'd', 'a', 'e', 'c']);
  assert.equal(matchesFilters(t('x'), { location: 'B' }), false);
  assert.equal(matchesFilters(t('x'), { urgentOnly: true }), false);
  assert.equal(matchesFilters(t('x', { urgency: 'due_soon' }), { urgentOnly: true, effort: 'medium', location: 'A' }), true);
  assert.equal(escapeHtml('<img src=x onerror="a">&\''), '&lt;img src=x onerror=&quot;a&quot;&gt;&amp;&#39;');
});

test('logic: due labels', () => {
  const now = new Date(2026, 9, 14, 12, 0);
  const at = (d, h, m) => ({ due_at: new Date(2026, 9, d, h, m).toISOString() });
  assert.equal(dueLabel(at(14, 23, 59), now), 'Due today');
  assert.equal(dueLabel(at(15, 23, 59), now), 'Due tomorrow');
  assert.match(dueLabel(at(15, 17, 0), now), /^Due tomorrow, 5:00/);
  assert.match(dueLabel(at(20, 23, 59), now), /^Due Tue, Oct 20$/);
  assert.match(dueLabel(at(12, 23, 59), now), /^Overdue since Oct 12$/);
  assert.equal(dueLabel({ due_at: null }, now), '');
});

// ---------------------------------------------------------------------------
// Repo hygiene: this folder is public
// ---------------------------------------------------------------------------

const files = (dir) => readdirSync(dir).flatMap((name) => {
  const path = join(dir, name);
  return statSync(path).isDirectory() ? files(path) : [path];
});

test('config.js holds nothing but an empty or well-formed Apps Script /exec URL', () => {
  assert.ok(SUSHI_CONFIG.apiUrl === '' || /^https:\/\/script\.google\.com\/(a\/[^/]+\/)?macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(SUSHI_CONFIG.apiUrl), SUSHI_CONFIG.apiUrl);
  assert.deepEqual(Object.keys(SUSHI_CONFIG).sort(), ['apiUrl', 'pollSeconds']);
});

test('no email address, spreadsheet link, Drive link, or key in any Sushi file', () => {
  const allowedEmails = /@example\.(invalid|com)\b/;
  files(sushiDir).filter((f) => /\.(js|mjs|gs|json|html|css|md|svg)$/.test(f)).forEach((file) => {
    const text = readFileSync(file, 'utf8');
    const where = relative(repoRoot, file);
    (text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) || [])
      .filter((m) => !allowedEmails.test(m) && !/^noreply@/.test(m))
      .forEach((m) => assert.fail(`${where}: email-like text "${m}"`));
    assert.doesNotMatch(text, /docs\.google\.com\/spreadsheets\/d\/[A-Za-z0-9_-]{20,}/, `${where}: spreadsheet link`);
    assert.doesNotMatch(text, /drive\.google\.com\/(drive\/folders|file\/d)\//, `${where}: Drive link`);
    assert.doesNotMatch(text, /AIza[0-9A-Za-z_-]{30,}/, `${where}: Google API key`);
  });
});

test('every URL in the Sushi page is relative, so branch previews work', () => {
  const html = readFileSync(join(sushiDir, 'index.html'), 'utf8');
  const urls = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  urls.forEach((u) => assert.ok(!u.startsWith('/') && !/^https?:/.test(u), `absolute URL in index.html: ${u}`));
  files(sushiDir).filter((f) => f.endsWith('.js')).forEach((file) => {
    const text = readFileSync(file, 'utf8');
    assert.doesNotMatch(text, /fetch\(\s*['"`]\//, `${relative(repoRoot, file)}: root-relative fetch`);
  });
});

test('the home page links to Sushi', () => {
  assert.match(readFileSync(join(repoRoot, 'index.html'), 'utf8'), /href="sushi\/"/);
});
