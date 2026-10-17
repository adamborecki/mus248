/**
 * Sushi backend: Google Apps Script bound to the Sushi Google Sheet.
 *
 * SOURCE OF TRUTH: sushi/backend/Code.gs in the public adamborecki/mus248 repo. Edit it there,
 * then paste the whole file into the Sheet's Apps Script project and redeploy. The steps are in
 * sushi/backend/README.md.
 *
 * THE REPO IS PUBLIC. Nothing private goes in this file: no email addresses, no spreadsheet
 * id, no names, no codes. Private settings live in Script Properties (Project Settings → Script
 * Properties):
 *   ADMIN_EMAIL        optional. Gets an email when someone calls the chef.
 *   NOTIFY_SUBMITTED   optional, "true" to also email when a plate is waiting for verification.
 *   SPREADSHEET_ID     written by setupSushi(). Only used if the web app can't see its own Sheet.
 *
 * The same file runs in three places, so keep it plain Apps Script (no libraries, no modules):
 *   1. Google, as the live web app.
 *   2. sushi/tests/run.mjs, in Node, against the fake services in sushi/fake-google.js.
 *   3. The browser demo (sushi/?demo=1), against those same fakes. The demo is this exact code.
 *
 * Map of this file:
 *   Vocabulary ......... statuses, enums, column lists (which column is public is decided HERE)
 *   Web app ............ doGet / doPost, JSONP, error envelope
 *   Public feed ........ publicTask_ (THE allowlist serializer) and publicFeed_
 *   Mutations .......... claim / release / help / resume / complete: locked, deduped, logged
 *   Admin .............. adminAction_ (verify, send back, clear, reopen, disable, enable)
 *   Recurrence ......... ensureRecurringTasks_ and the weekly/monthly window math
 *   Upkeep ............. new-row ids, throttled maintenance, caches
 *   Sheet setup + menu . setupSushi, onOpen, the Sushi Admin menu handlers
 */

var SUSHI_API_VERSION = 1;

// ============================================================================
// Vocabulary
// ============================================================================

var STATUS = {
  AVAILABLE: 'available',        // On the Belt
  CLAIMED: 'claimed',            // At someone's table
  HELP: 'help_requested',        // Called the chef; still theirs
  SUBMITTED: 'submitted',        // Finished, waiting for Adam to verify
  COMPLETED: 'completed'         // Cleared
};
var STATUSES = [STATUS.AVAILABLE, STATUS.CLAIMED, STATUS.HELP, STATUS.SUBMITTED, STATUS.COMPLETED];

// Every legal move. A request can only ever name an ACTION; the server picks the next status.
// Admin moves (verify, send_back, clear, reopen) are in adminAction_ and only run from the Sheet.
var TRANSITIONS = {
  claim:    { from: [STATUS.AVAILABLE] },
  release:  { from: [STATUS.CLAIMED, STATUS.HELP], to: STATUS.AVAILABLE },
  help:     { from: [STATUS.CLAIMED, STATUS.HELP], to: STATUS.HELP },
  resume:   { from: [STATUS.HELP], to: STATUS.CLAIMED },
  complete: { from: [STATUS.CLAIMED, STATUS.HELP] }   // → completed (self) or submitted (admin)
};
var CLAIMANT_ACTIONS = ['release', 'help', 'resume', 'complete'];

var CATEGORIES = ['Maintenance', 'Data Management', 'Post Production', 'Audio Capture', 'Video Capture', 'Live Sound'];
var EFFORTS = ['small', 'medium', 'large', 'boat'];
var URGENCIES = ['normal', 'due_soon', 'urgent'];
var NOTE_MODES = ['none', 'optional', 'required'];
var VERIFICATION_MODES = ['self', 'admin'];
var RECURRENCE_KINDS = ['weekly', 'monthly', 'manual'];
var SOURCE_TYPES = ['manual', 'recurring', 'gig', 'other'];
var WORK_MODES = ['MUS 248', 'Student employee', 'Other'];
var YES_NO = ['yes', 'no'];   // the `active` column. A dropdown, not a checkbox: inserted checkboxes read as FALSE, so a hand-typed row would start switched off.

var LIMITS = { name: 60, note: 500 };
var DUE_SOON_MS = 48 * 3600 * 1000;
var DAY_MS = 24 * 3600 * 1000;

// Column order is what Adam sees. The columns he edits most come first; claim data, private
// context, and internals follow. Columns are always found by header NAME, so reordering them in
// the Sheet (or adding your own columns) is safe. `p: true` marks a column the public feed is
// built from. That flag only drives the header colour and the privacy check: the feed itself is
// built field by field in publicTask_, never by copying columns.
var TASK_COLUMNS = [
  { name: 'task_id', p: true, width: 90, note: 'Filled in automatically. Leave blank on a new row.' },
  { name: 'active', p: false, width: 60, note: 'yes / no. Set no to take a task off the belt without deleting it. Blank counts as yes.' },
  { name: 'status', p: true, width: 120, note: 'available · claimed · help_requested · submitted · completed. Use the Sushi Admin menu to change it rather than typing.' },
  { name: 'public_title', p: true, width: 260, note: 'PUBLIC. Short and specific: "Clean OH B01 keyboards". Anyone on the internet can read it.' },
  { name: 'urgency', p: true, width: 90, note: 'normal · due_soon · urgent. A due date within 48 hours shows as due soon on its own.' },
  { name: 'due_at', p: true, width: 120, note: 'PUBLIC. Optional date (and time). A date with no time means the end of that day.' },
  { name: 'public_location', p: true, width: 150, note: 'PUBLIC. A room name or "Anywhere". Never a door or access code.' },
  { name: 'category', p: true, width: 130, note: 'Maintenance · Data Management · Post Production · Audio Capture · Video Capture · Live Sound' },
  { name: 'effort_size', p: true, width: 80, note: 'Plate size = time. small 5–10 min · medium 10–25 · large 25–60 · boat 60+ / multi-part.' },
  { name: 'estimated_minutes', p: true, width: 90, note: 'Optional. A number ("15") or a range ("10-20").' },
  { name: 'public_description', p: true, width: 320, note: 'PUBLIC. What the job is, in plain language.' },
  { name: 'before_you_take', p: true, width: 260, note: 'PUBLIC. Access, prerequisites, safety, "ask Adam first". One item per line. No codes.' },
  { name: 'definition_of_done', p: true, width: 260, note: 'PUBLIC. One item per line.' },
  { name: 'note_mode', p: true, width: 90, note: 'none · optional · required: the note asked for when finishing.' },
  { name: 'verification_mode', p: true, width: 100, note: 'self (finishing clears it) · admin (it waits for you to Verify).' },
  { name: 'public_event_label', p: true, width: 160, note: 'PUBLIC. Optional event name, only if the event is public. Use a generic title otherwise.' },
  { name: 'actor_name', p: false, width: 140, note: 'PRIVATE. Name typed by whoever claimed it. Not verified identity.' },
  { name: 'actor_mode', p: false, width: 110, note: 'PRIVATE. MUS 248 · Student employee · Other.' },
  { name: 'claimed_at', p: false, width: 130, note: 'When it was claimed.' },
  { name: 'help_note', p: false, width: 220, note: 'PRIVATE. Latest Call the Chef note.' },
  { name: 'completion_note', p: false, width: 220, note: 'PRIVATE. Note sent with Finished Eating.' },
  { name: 'completed_at', p: true, width: 130, note: 'When it was cleared.' },
  { name: 'verified_at', p: false, width: 130, note: 'When it was verified (or self-cleared).' },
  { name: 'verified_by', p: false, width: 100, note: 'PRIVATE. "self" or "admin".' },
  { name: 'admin_note', p: false, width: 220, note: 'PRIVATE. Yours. Never shown to anyone.' },
  { name: 'private_context', p: false, width: 220, note: 'PRIVATE. Real event name, contacts, anything that must not be public.' },
  { name: 'source_type', p: false, width: 90, note: 'manual · recurring · gig · other.' },
  { name: 'private_source_ref', p: false, width: 140, note: 'PRIVATE. Gig id, calendar link, Drive link: whatever this task came from.' },
  { name: 'template_id', p: false, width: 90, note: 'Set when a recurring template made this task.' },
  { name: 'recurrence_key', p: false, width: 140, hidden: true, note: 'template_id@window start. Stops a week from being made twice.' },
  { name: 'claim_id', p: true, width: 120, hidden: true, note: 'Random id for the current claim. Public on purpose: it is how a phone recognises its own plate.' },
  { name: 'claim_secret_hash', p: false, width: 120, hidden: true, note: 'PRIVATE. Hash of the claimant phone\'s secret. Never edit.' },
  { name: 'evidence_ref', p: false, width: 120, hidden: true, note: 'Reserved for photo evidence later. Unused in v1.' },
  { name: 'created_at', p: false, width: 130, note: 'Filled in automatically.' },
  { name: 'updated_at', p: false, width: 130, note: 'Filled in automatically.' }
];

var TEMPLATE_COLUMNS = [
  { name: 'template_id', p: false, width: 90, note: 'Filled in automatically. Leave blank on a new row.' },
  { name: 'active', p: false, width: 60, note: 'yes / no. Set no to stop making new tasks from this template. Blank counts as yes.' },
  { name: 'public_title', p: true, width: 260, note: 'PUBLIC. Copied onto each task this makes.' },
  { name: 'recurrence_kind', p: false, width: 100, note: 'weekly · monthly · manual (manual = only when you pick "Make a task from selected template").' },
  { name: 'recurrence_value', p: false, width: 100, note: 'weekly: the day it appears (Mon…Sun). monthly: day of month 1–28.' },
  { name: 'urgency_default', p: true, width: 90, note: 'normal · due_soon · urgent' },
  { name: 'public_location', p: true, width: 150, note: 'PUBLIC.' },
  { name: 'category', p: true, width: 130, note: 'Same list as Tasks.' },
  { name: 'effort_size', p: true, width: 80, note: 'small · medium · large · boat' },
  { name: 'estimated_minutes', p: true, width: 90, note: 'Optional. "15" or "10-20".' },
  { name: 'public_description', p: true, width: 320, note: 'PUBLIC.' },
  { name: 'before_you_take', p: true, width: 260, note: 'PUBLIC. One item per line.' },
  { name: 'definition_of_done', p: true, width: 260, note: 'PUBLIC. One item per line.' },
  { name: 'note_mode', p: true, width: 90, note: 'none · optional · required' },
  { name: 'verification_mode', p: true, width: 100, note: 'self · admin' },
  { name: 'public_event_label', p: true, width: 160, note: 'PUBLIC. Optional.' },
  { name: 'source_type', p: false, width: 90, note: 'Usually recurring.' },
  { name: 'private_context', p: false, width: 220, note: 'PRIVATE. Copied onto each task.' },
  { name: 'private_source_ref', p: false, width: 140, note: 'PRIVATE. Copied onto each task.' },
  { name: 'last_materialized_key', p: false, width: 160, note: 'The most recent window a task was made for.' },
  { name: 'created_at', p: false, width: 130, note: 'Filled in automatically.' },
  { name: 'updated_at', p: false, width: 130, note: 'Filled in automatically.' }
];

var EVENT_COLUMNS = [
  { name: 'timestamp', width: 140 }, { name: 'event_type', width: 110 }, { name: 'task_id', width: 90 },
  { name: 'old_status', width: 110 }, { name: 'new_status', width: 110 }, { name: 'actor_name', width: 140 },
  { name: 'actor_mode', width: 110 }, { name: 'note', width: 260 }, { name: 'template_id', width: 90 },
  { name: 'claim_id', width: 120 }, { name: 'request_id', width: 120 }, { name: 'event_id', width: 120 },
  { name: 'metadata_json', width: 200 }
];

var CONFIG_DEFAULTS = [
  ['kitchen_open', 'yes', 'yes / no. Set no to pause the belt: people can still look, but nobody can take or finish plates.'],
  ['kitchen_message', '', 'PUBLIC. Optional one-line notice shown at the top of /sushi/.'],
  ['recent_days', 14, 'How many days cleared plates stay visible in "Recently cleared".']
];

var SHEET_NAMES = { tasks: 'Tasks', templates: 'Templates', events: 'Events', config: 'Config', start: 'Start here' };

// ============================================================================
// Web app
// ============================================================================

/** Public reads. ?action=list (default), ?action=receipt&request_id=…, ?action=ping. JSONP via ?callback=. */
function doGet(e) {
  var params = (e && e.parameter) || {};
  var result;
  try {
    var action = String(params.action || 'list');
    if (action === 'list') result = listTasks_();
    else if (action === 'receipt') result = receipt_(params.request_id);
    else if (action === 'ping') result = { ok: true, api: SUSHI_API_VERSION, now: now_().toISOString() };
    else result = fail_('invalid', 'Unknown action.');
  } catch (err) {
    result = errorResult_(err);
  }
  return respond_(result, params.callback);
}

/**
 * Mutations. The body is JSON, sent as text/plain so the browser does not preflight it. A form
 * post with a `payload` field also works, for a fallback transport.
 */
function doPost(e) {
  var result;
  try {
    var raw = (e && e.postData && e.postData.contents) || '';
    if (e && e.parameter && e.parameter.payload) raw = e.parameter.payload;
    var body;
    try { body = JSON.parse(raw); } catch (parseError) { body = null; }
    result = body && typeof body === 'object' ? handleMutation_(body) : fail_('invalid', 'The request was not readable.');
  } catch (err) {
    result = errorResult_(err);
  }
  return respond_(result, null);
}

function respond_(result, callback) {
  var json = JSON.stringify(result);
  if (callback !== undefined && callback !== null && callback !== '') {
    // JSONP: the callback name is the only caller-controlled text echoed as code, so it is held
    // to a plain identifier.
    if (!/^[A-Za-z_$][A-Za-z0-9_$]{0,63}$/.test(String(callback))) {
      return ContentService.createTextOutput(JSON.stringify(fail_('invalid', 'Bad callback name.')))
        .setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService.createTextOutput(callback + '(' + json + ');').setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function now_() { return new Date(); }

function ok_(extra) {
  var out = { ok: true };
  Object.keys(extra || {}).forEach(function (k) { out[k] = extra[k]; });
  return out;
}

function fail_(code, message, extra) {
  var out = { ok: false, code: code, message: message };
  Object.keys(extra || {}).forEach(function (k) { out[k] = extra[k]; });
  return out;
}

function sushiError_(code, message) {
  var err = new Error(message);
  err.sushiCode = code;
  return err;
}

function errorResult_(err) {
  if (err && err.sushiCode) return fail_(err.sushiCode, err.message);
  console.error(err && err.stack ? err.stack : err);
  return fail_('server_error', 'Something went wrong in the kitchen. Nothing was changed on purpose; refresh and check.');
}

// ============================================================================
// Public feed
// ============================================================================

/**
 * THE allowlist serializer. Every key the public feed carries is written out here, one by one.
 * To publish a new field: add it here, add it to PUBLIC_TASK_KEYS, and update the privacy test
 * in sushi/tests/run.mjs. Never spread or copy a row object into the output.
 */
function publicTask_(t, now) {
  var status = STATUSES.indexOf(str_(t.status)) >= 0 ? str_(t.status) : STATUS.AVAILABLE;
  var minutes = parseMinutes_(t.estimated_minutes);
  var held = status !== STATUS.AVAILABLE;
  return {
    id: str_(t.task_id),
    title: str_(t.public_title),
    description: str_(t.public_description),
    location: str_(t.public_location),
    category: str_(t.category),
    effort: enumOr_(t.effort_size, EFFORTS, 'medium'),
    minutes_min: minutes.min,
    minutes_max: minutes.max,
    urgency: effectiveUrgency_(t.urgency, dueDate_(t.due_at), now),
    due_at: isoOrNull_(dueDate_(t.due_at)),
    before_you_take: lines_(t.before_you_take),
    definition_of_done: lines_(t.definition_of_done),
    note_mode: enumOr_(t.note_mode, NOTE_MODES, 'optional'),
    verification: enumOr_(t.verification_mode, VERIFICATION_MODES, 'self'),
    event_label: str_(t.public_event_label),
    recurring: str_(t.template_id) !== '',
    status: status,
    claim_id: held ? str_(t.claim_id) : '',
    completed_at: status === STATUS.COMPLETED ? isoOrNull_(asDate_(t.completed_at)) : null
  };
}

// The exact key set publicTask_ produces. The tests compare against it.
var PUBLIC_TASK_KEYS = ['id', 'title', 'description', 'location', 'category', 'effort', 'minutes_min', 'minutes_max',
  'urgency', 'due_at', 'before_you_take', 'definition_of_done', 'note_mode', 'verification', 'event_label',
  'recurring', 'status', 'claim_id', 'completed_at'];

function listTasks_() {
  var cache = CacheService.getScriptCache();
  maybeRunUpkeep_();
  var cached = cache.get('public_feed');
  if (cached) return JSON.parse(cached);
  var feed = publicFeed_(now_());
  // CacheService refuses values over 100 KB; a big feed just skips the cache.
  try { cache.put('public_feed', JSON.stringify(feed), 20); } catch (err) { /* uncached is fine */ }
  return feed;
}

function publicFeed_(now) {
  var config = config_();
  var recentMs = config.recent_days * DAY_MS;
  var open = [];
  var cleared = [];
  table_(SHEET_NAMES.tasks).rows.forEach(function (t) {
    if (!isActive_(t.active) || !str_(t.task_id) || !str_(t.public_title)) return;
    var status = str_(t.status);
    if (STATUSES.indexOf(status) < 0) return;
    if (status === STATUS.COMPLETED) {
      var at = asDate_(t.completed_at);
      if (at && now.getTime() - at.getTime() <= recentMs) cleared.push(publicTask_(t, now));
      return;
    }
    open.push(publicTask_(t, now));
  });
  cleared.sort(function (a, b) { return String(b.completed_at).localeCompare(String(a.completed_at)); });
  return {
    ok: true,
    api: SUSHI_API_VERSION,
    now: now.toISOString(),
    kitchen: { open: config.kitchen_open, message: config.kitchen_message },
    tasks: open.concat(cleared.slice(0, 40))
  };
}

function invalidateFeed_() {
  CacheService.getScriptCache().remove('public_feed');
}

// ============================================================================
// Mutations
// ============================================================================

function handleMutation_(body) {
  var request = validateMutation_(body);
  if (!request.ok) {
    storeReceipt_(body && body.request_id, request);
    return request;
  }
  var config = config_();
  if (!config.kitchen_open) {
    var closed = fail_('kitchen_closed', config.kitchen_message || 'The kitchen is closed right now. Nothing can be taken or finished.');
    storeReceipt_(request.request_id, closed);
    return closed;
  }

  var notify = null;
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
    var busy = fail_('busy', 'The kitchen is busy. Try again in a moment.');
    storeReceipt_(request.request_id, busy);
    return busy;
  }
  var result;
  try {
    result = applyMutationLocked_(request);
    notify = result._notify || null;
    delete result._notify;
  } finally {
    lock.releaseLock();
  }
  storeReceipt_(request.request_id, result);
  if (result.ok && !result.duplicate) invalidateFeed_();
  // Email goes out after the lock is released and after state is written, so a mail failure can
  // never undo or corrupt a claim.
  if (notify) sendNotification_(notify);
  return result;
}

function validateMutation_(body) {
  var action = String(body.action || '');
  if (action !== 'claim' && CLAIMANT_ACTIONS.indexOf(action) < 0) return fail_('invalid', 'Unknown action.');
  var requestId = String(body.request_id || '');
  if (!isUuid_(requestId)) return fail_('invalid', 'Missing or malformed request id.');
  var taskId = String(body.task_id || '');
  if (!/^[A-Za-z0-9_-]{1,40}$/.test(taskId)) return fail_('invalid', 'Missing or malformed task id.');
  var claimId = String(body.claim_id || '');
  if (!isUuid_(claimId)) return fail_('invalid', 'Missing or malformed claim id.');
  var secret = String(body.claim_secret || '');
  if (!/^[A-Za-z0-9_-]{32,128}$/.test(secret)) return fail_('invalid', 'Missing or malformed claim secret.');

  var request = { ok: true, action: action, request_id: requestId, task_id: taskId, claim_id: claimId, claim_secret: secret };

  if (action === 'claim') {
    var name = cleanText_(body.actor_name, LIMITS.name, true);
    if (name === null) return fail_('invalid', 'Names can be up to ' + LIMITS.name + ' characters.');
    if (!name) return fail_('invalid', 'Add your name first.');
    var mode = String(body.actor_mode || '');
    if (WORK_MODES.indexOf(mode) < 0) return fail_('invalid', 'Pick how you are doing this work.');
    request.actor_name = name;
    request.actor_mode = mode;
  }
  if (action === 'help' || action === 'complete') {
    var note = cleanText_(body.note, LIMITS.note, false);
    if (note === null) return fail_('invalid', 'Notes can be up to ' + LIMITS.note + ' characters.');
    request.note = note;
  }
  return request;
}

function applyMutationLocked_(req) {
  var now = now_();
  if (findAppliedRequest_(req.request_id)) {
    // A retry of something that already worked (double tap, lost reply). Report success without
    // applying it twice.
    var current = findTask_(table_(SHEET_NAMES.tasks), req.task_id);
    return ok_({ duplicate: true, task: current ? publicTask_(current, now) : null });
  }
  var limited = rateLimited_(req.task_id);
  if (limited) return limited;

  var tasks = table_(SHEET_NAMES.tasks);
  var t = findTask_(tasks, req.task_id);
  if (!t || !isActive_(t.active)) return fail_('not_found', 'That plate isn\'t on the belt anymore.');
  var from = str_(t.status) || STATUS.AVAILABLE;

  if (req.action === 'claim') {
    if (from !== STATUS.AVAILABLE) {
      // The same phone retrying its own claim with a fresh request id is still a success.
      if (str_(t.claim_id) === req.claim_id && hashMatches_(t, req)) return ok_({ duplicate: true, task: publicTask_(t, now) });
      return fail_('conflict', 'Someone else just took this plate.', { task: publicTask_(t, now) });
    }
    setFields_(tasks, t, {
      status: STATUS.CLAIMED,
      claim_id: req.claim_id,
      claim_secret_hash: secretHash_(req.claim_id, req.claim_secret),
      actor_name: sheetSafe_(req.actor_name),
      actor_mode: req.actor_mode,
      claimed_at: now,
      help_note: '', completion_note: '', completed_at: '', verified_at: '', verified_by: '',
      updated_at: now
    });
    logEvent_({ type: 'claim', task: t, from: from, to: STATUS.CLAIMED, actorName: req.actor_name, actorMode: req.actor_mode, claimId: req.claim_id, requestId: req.request_id });
    return ok_({ task: publicTask_(t, now) });
  }

  // Everything else belongs to whoever holds the claim.
  if (str_(t.claim_id) !== req.claim_id || !hashMatches_(t, req)) {
    return fail_('not_yours', 'This plate isn\'t on your table anymore. Refresh to see where it went.', { task: publicTask_(t, now) });
  }
  var rule = TRANSITIONS[req.action];
  if (rule.from.indexOf(from) < 0) {
    return fail_('wrong_state', 'That can\'t happen from here: this plate is ' + statusWords_(from) + '.', { task: publicTask_(t, now) });
  }
  var actorName = str_(t.actor_name);
  var actorMode = str_(t.actor_mode);
  var base = { task: t, from: from, actorName: actorName, actorMode: actorMode, claimId: req.claim_id, requestId: req.request_id };

  if (req.action === 'release') {
    setFields_(tasks, t, clearedClaimFields_(now));
    logEvent_(merge_(base, { type: 'release', to: STATUS.AVAILABLE }));
    return ok_({ task: publicTask_(t, now) });
  }

  if (req.action === 'help') {
    setFields_(tasks, t, { status: STATUS.HELP, help_note: sheetSafe_(req.note), updated_at: now });
    logEvent_(merge_(base, { type: 'help', to: STATUS.HELP, note: req.note }));
    var help = ok_({ task: publicTask_(t, now) });
    help._notify = { kind: 'help', task: copyRow_(t), note: req.note };
    return help;
  }

  if (req.action === 'resume') {
    setFields_(tasks, t, { status: STATUS.CLAIMED, updated_at: now });
    logEvent_(merge_(base, { type: 'resume', to: STATUS.CLAIMED }));
    return ok_({ task: publicTask_(t, now) });
  }

  // complete
  var noteMode = enumOr_(t.note_mode, NOTE_MODES, 'optional');
  var note = noteMode === 'none' ? '' : req.note;
  if (noteMode === 'required' && !note) return fail_('note_required', 'This plate needs a short note before it\'s finished.');
  var needsAdmin = enumOr_(t.verification_mode, VERIFICATION_MODES, 'self') === 'admin';
  var to = needsAdmin ? STATUS.SUBMITTED : STATUS.COMPLETED;
  var changes = { status: to, completion_note: sheetSafe_(note), updated_at: now };
  if (!needsAdmin) { changes.completed_at = now; changes.verified_at = now; changes.verified_by = 'self'; }
  setFields_(tasks, t, changes);
  logEvent_(merge_(base, { type: needsAdmin ? 'submit' : 'complete', to: to, note: note }));
  var done = ok_({ task: publicTask_(t, now) });
  if (needsAdmin) done._notify = { kind: 'submitted', task: copyRow_(t), note: note };
  return done;
}

function clearedClaimFields_(now) {
  return {
    status: STATUS.AVAILABLE, claim_id: '', claim_secret_hash: '', actor_name: '', actor_mode: '',
    claimed_at: '', help_note: '', completion_note: '', completed_at: '', verified_at: '', verified_by: '',
    updated_at: now
  };
}

function hashMatches_(t, req) {
  var stored = str_(t.claim_secret_hash);
  return stored !== '' && stored === secretHash_(req.claim_id, req.claim_secret);
}

function secretHash_(claimId, secret) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, 'sushi-claim:' + claimId + ':' + secret, Utilities.Charset.UTF_8);
  return bytes.map(function (b) { var v = (b + 256) % 256; return (v < 16 ? '0' : '') + v.toString(16); }).join('');
}

/** Was this request id already applied? Checked inside the lock, so it can't race itself. */
function findAppliedRequest_(requestId) {
  if (CacheService.getScriptCache().get('applied:' + requestId)) return true;
  var sheet = book_().getSheetByName(SHEET_NAMES.events);
  if (!sheet) return false;
  var last = sheet.getLastRow();
  if (last < 2) return false;
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(function (h) { return String(h).trim(); });
  var col = headers.indexOf('request_id');
  if (col < 0) return false;
  var start = Math.max(2, last - 1999);
  var ids = sheet.getRange(start, col + 1, last - start + 1, 1).getValues();
  for (var i = ids.length - 1; i >= 0; i--) if (String(ids[i][0]) === requestId) return true;
  return false;
}

/** Receipts let a phone that couldn't read the reply (CORS, lost connection) learn what happened. */
function storeReceipt_(requestId, result) {
  if (!isUuid_(String(requestId || ''))) return;
  var receipt = { request_id: String(requestId), ok: !!result.ok, code: result.code || 'ok', message: result.message || '',
    duplicate: !!result.duplicate, task: result.task || null, at: now_().toISOString() };
  var cache = CacheService.getScriptCache();
  try { cache.put('receipt:' + requestId, JSON.stringify(receipt), 21600); } catch (err) { /* the Events log still answers */ }
  if (result.ok) cache.put('applied:' + requestId, '1', 21600);
}

function receipt_(requestId) {
  requestId = String(requestId || '');
  if (!isUuid_(requestId)) return fail_('invalid', 'Missing or malformed request id.');
  var cached = CacheService.getScriptCache().get('receipt:' + requestId);
  if (cached) return ok_({ receipt: JSON.parse(cached) });
  // The cache is best-effort. The Events log is not: if it holds the request, it worked.
  if (findAppliedRequest_(requestId)) return ok_({ receipt: { request_id: requestId, ok: true, code: 'ok', message: '', duplicate: false, task: null } });
  return ok_({ receipt: null });
}

/** Cheap abuse brake: per-task and overall mutation counts per minute. Runs inside the lock. */
function rateLimited_(taskId) {
  var cache = CacheService.getScriptCache();
  var minute = Math.floor(now_().getTime() / 60000);
  var keys = ['rate:all:' + minute, 'rate:task:' + taskId + ':' + minute];
  var limits = [120, 12];
  for (var i = 0; i < keys.length; i++) {
    var count = Number(cache.get(keys[i]) || 0) + 1;
    cache.put(keys[i], String(count), 120);
    if (count > limits[i]) return fail_('rate_limited', 'Too many requests at once. Wait a minute and try again.');
  }
  return null;
}

// ============================================================================
// Admin (Sheet only: called from the Sushi Admin menu, never from the web)
// ============================================================================

/**
 * kind: verify (submitted → completed) · send_back (submitted → claimed) ·
 *       clear (claimed / help_requested / submitted → available, claim wiped) ·
 *       reopen (completed → available) · disable · enable
 */
function adminAction_(taskId, kind, note) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) return fail_('busy', 'Another change is in progress. Try again.');
  var result;
  try {
    var now = now_();
    var tasks = table_(SHEET_NAMES.tasks);
    var t = findTask_(tasks, taskId);
    if (!t) return fail_('not_found', 'No task with id ' + taskId + '.');
    var from = str_(t.status) || STATUS.AVAILABLE;
    var allowed = {
      verify: [STATUS.SUBMITTED],
      send_back: [STATUS.SUBMITTED],
      clear: [STATUS.CLAIMED, STATUS.HELP, STATUS.SUBMITTED],
      reopen: [STATUS.COMPLETED],
      disable: STATUSES,
      enable: STATUSES
    }[kind];
    if (!allowed) return fail_('invalid', 'Unknown admin action ' + kind + '.');
    if (allowed.indexOf(from) < 0) return fail_('wrong_state', 'Task ' + taskId + ' is ' + from + '; "' + kind + '" needs ' + allowed.join(' or ') + '.');
    var event = { task: t, from: from, actorName: 'admin', actorMode: 'admin', claimId: str_(t.claim_id), note: note || '' };
    if (kind === 'verify') {
      setFields_(tasks, t, { status: STATUS.COMPLETED, completed_at: now, verified_at: now, verified_by: 'admin', updated_at: now });
      logEvent_(merge_(event, { type: 'verify', to: STATUS.COMPLETED }));
    } else if (kind === 'send_back') {
      setFields_(tasks, t, { status: STATUS.CLAIMED, updated_at: now });
      logEvent_(merge_(event, { type: 'send_back', to: STATUS.CLAIMED }));
    } else if (kind === 'clear' || kind === 'reopen') {
      setFields_(tasks, t, clearedClaimFields_(now));
      logEvent_(merge_(event, { type: kind === 'clear' ? 'admin_clear' : 'admin_reopen', to: STATUS.AVAILABLE }));
    } else {
      setFields_(tasks, t, { active: kind === 'enable' ? 'yes' : 'no', updated_at: now });
      logEvent_(merge_(event, { type: kind, to: from }));
    }
    result = ok_({ task: publicTask_(t, now) });
  } finally {
    lock.releaseLock();
  }
  invalidateFeed_();
  return result;
}

// ============================================================================
// Recurrence
// ============================================================================

/**
 * Makes sure each active weekly/monthly template has a task for the current window. The task's
 * recurrence_key (template_id@window-start) makes this safe to run any number of times. A still
 * untouched task from an earlier window is retired (active = FALSE, event "superseded"); a claimed
 * one is left alone, because claims never expire on their own.
 * Caller must hold the script lock.
 */
function ensureRecurringTasks_(now) {
  var templates = table_(SHEET_NAMES.templates);
  var tasks = table_(SHEET_NAMES.tasks);
  var made = 0;
  templates.rows.forEach(function (tpl) {
    if (!str_(tpl.template_id) || !str_(tpl.public_title) || !isActive_(tpl.active)) return;
    var kind = str_(tpl.recurrence_kind).toLowerCase();
    if (kind !== 'weekly' && kind !== 'monthly') return;
    var win = recurrenceWindow_(kind, tpl.recurrence_value, now);
    var key = str_(tpl.template_id) + '@' + win.key;
    var exists = tasks.rows.some(function (t) { return str_(t.recurrence_key) === key; });
    if (exists) return;
    tasks.rows.forEach(function (t) {
      if (str_(t.template_id) === str_(tpl.template_id) && str_(t.recurrence_key) !== key &&
          isActive_(t.active) && str_(t.status) === STATUS.AVAILABLE) {
        setFields_(tasks, t, { active: 'no', updated_at: now });
        logEvent_({ type: 'superseded', task: t, from: STATUS.AVAILABLE, to: STATUS.AVAILABLE, actorName: 'system', actorMode: 'system', metadata: { replaced_by_window: win.key } });
      }
    });
    taskFromTemplate_(tasks, tpl, now, { recurrence_key: key, due_at: win.due, source_type: 'recurring' });
    setFields_(templates, tpl, { last_materialized_key: key, updated_at: now });
    made += 1;
  });
  return made;
}

/** Copies a template's public and private fields into a new available task. Caller holds the lock. */
function taskFromTemplate_(tasks, tpl, now, extra) {
  var row = {
    task_id: newId_('S', tasks, 'task_id'),
    active: 'yes',
    status: STATUS.AVAILABLE,
    public_title: str_(tpl.public_title),
    urgency: enumOr_(tpl.urgency_default, URGENCIES, 'normal'),
    due_at: extra.due_at || '',
    public_location: str_(tpl.public_location),
    category: str_(tpl.category),
    effort_size: enumOr_(tpl.effort_size, EFFORTS, 'medium'),
    estimated_minutes: str_(tpl.estimated_minutes),
    public_description: str_(tpl.public_description),
    before_you_take: str_(tpl.before_you_take),
    definition_of_done: str_(tpl.definition_of_done),
    note_mode: enumOr_(tpl.note_mode, NOTE_MODES, 'optional'),
    verification_mode: enumOr_(tpl.verification_mode, VERIFICATION_MODES, 'self'),
    public_event_label: str_(tpl.public_event_label),
    private_context: str_(tpl.private_context),
    source_type: extra.source_type || enumOr_(tpl.source_type, SOURCE_TYPES, 'manual'),
    private_source_ref: str_(tpl.private_source_ref),
    template_id: str_(tpl.template_id),
    recurrence_key: extra.recurrence_key || '',
    created_at: now,
    updated_at: now
  };
  var t = appendObject_(tasks, row);
  logEvent_({ type: 'create', task: t, from: '', to: STATUS.AVAILABLE, actorName: 'system', actorMode: 'system', metadata: { from_template: str_(tpl.template_id), window: extra.recurrence_key || 'manual' } });
  return t;
}

/** weekly: value is the day it appears (Mon…Sun). monthly: day of month, 1–28. Times are the script's time zone. */
function recurrenceWindow_(kind, value, now) {
  var today = localYmd_(now);
  var startYmd;
  var endYmd;
  if (kind === 'weekly') {
    var target = weekdayNumber_(value);
    var dow = Number(Utilities.formatDate(now, tz_(), 'u')); // 1 = Monday … 7 = Sunday
    startYmd = addDaysYmd_(today, -((dow - target + 7) % 7));
    endYmd = addDaysYmd_(startYmd, 7);
  } else {
    var day = Math.min(28, Math.max(1, parseInt(value, 10) || 1));
    var parts = today.split('-').map(Number);
    var year = parts[0];
    var month = parts[1];
    if (parts[2] < day) { month -= 1; if (month < 1) { month = 12; year -= 1; } }
    startYmd = ymdString_(year, month, day);
    var nextMonth = month === 12 ? 1 : month + 1;
    endYmd = ymdString_(month === 12 ? year + 1 : year, nextMonth, day);
  }
  // Due the evening before the next window opens.
  return { key: startYmd, start: localMidnight_(startYmd), due: new Date(localMidnight_(endYmd).getTime() - 60000) };
}

function weekdayNumber_(value) {
  var s = str_(value).toLowerCase().slice(0, 3);
  var names = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  var i = names.indexOf(s);
  if (i >= 0) return i + 1;
  var n = parseInt(s, 10);
  return n >= 1 && n <= 7 ? n : 1;
}

function tz_() { return Session.getScriptTimeZone() || 'America/Los_Angeles'; }
function localYmd_(date) { return Utilities.formatDate(date, tz_(), 'yyyy-MM-dd'); }
function ymdString_(y, m, d) { return y + '-' + (m < 10 ? '0' : '') + m + '-' + (d < 10 ? '0' : '') + d; }

function addDaysYmd_(ymd, days) {
  var p = ymd.split('-').map(Number);
  return new Date(Date.UTC(p[0], p[1] - 1, p[2] + days)).toISOString().slice(0, 10);
}

/** The instant local midnight starts on ymd, in the script's time zone. */
function localMidnight_(ymd) {
  var p = ymd.split('-').map(Number);
  var noon = new Date(Date.UTC(p[0], p[1] - 1, p[2], 12));
  var z = Utilities.formatDate(noon, tz_(), 'Z'); // e.g. -0700
  var offsetMin = (z.charAt(0) === '-' ? -1 : 1) * (Number(z.slice(1, 3)) * 60 + Number(z.slice(3, 5)));
  return new Date(Date.UTC(p[0], p[1] - 1, p[2]) - offsetMin * 60000);
}

// ============================================================================
// Upkeep: ids for hand-added rows, recurring tasks. Throttled so reads stay fast.
// ============================================================================

function maybeRunUpkeep_() {
  var cache = CacheService.getScriptCache();
  if (cache.get('upkeep_done')) return;
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(3000)) return; // someone is mid-change; the next read will do it
  try {
    runUpkeepLocked_(now_());
    cache.put('upkeep_done', '1', 300);
  } finally {
    lock.releaseLock();
  }
  invalidateFeed_();
}

/** Run from the menu or an hourly trigger. Same work as the throttled read-time upkeep. */
function runUpkeep() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) return 0;
  var made;
  try { made = runUpkeepLocked_(now_()); } finally { lock.releaseLock(); }
  invalidateFeed_();
  return made;
}

function runUpkeepLocked_(now) {
  normalizeNewRows_(now);
  return ensureRecurringTasks_(now);
}

/** A row Adam typed by hand (title, no id) gets an id, a status, timestamps, and a "create" event. */
function normalizeNewRows_(now) {
  var tasks = table_(SHEET_NAMES.tasks);
  tasks.rows.forEach(function (t) {
    if (str_(t.task_id) || !str_(t.public_title)) return;
    var changes = { task_id: newId_('S', tasks, 'task_id'), updated_at: now };
    if (STATUSES.indexOf(str_(t.status)) < 0) changes.status = STATUS.AVAILABLE;
    if (str_(t.active) === '') changes.active = 'yes';
    if (!asDate_(t.created_at)) changes.created_at = now;
    if (!str_(t.source_type)) changes.source_type = 'manual';
    setFields_(tasks, t, changes);
    logEvent_({ type: 'create', task: t, from: '', to: str_(t.status), actorName: 'admin', actorMode: 'admin', metadata: { by: 'sheet row' } });
  });
  var templates = table_(SHEET_NAMES.templates);
  templates.rows.forEach(function (tpl) {
    if (str_(tpl.template_id) || !str_(tpl.public_title)) return;
    var changes = { template_id: newId_('W', templates, 'template_id'), updated_at: now };
    if (str_(tpl.active) === '') changes.active = 'yes';
    if (!asDate_(tpl.created_at)) changes.created_at = now;
    setFields_(templates, tpl, changes);
  });
}

// ============================================================================
// Notifications
// ============================================================================

function sendNotification_(notify) {
  try {
    var props = PropertiesService.getScriptProperties();
    var to = props.getProperty('ADMIN_EMAIL');
    if (!to) return false;
    if (notify.kind === 'submitted' && props.getProperty('NOTIFY_SUBMITTED') !== 'true') return false;
    if (MailApp.getRemainingDailyQuota() < 1) return false;
    var t = notify.task;
    var heading = notify.kind === 'help' ? 'Help requested' : 'Waiting for verification';
    var lines = [
      heading + ' on a Sushi task.', '',
      'Task: ' + str_(t.public_title) + ' (' + str_(t.task_id) + ')',
      'Where: ' + (str_(t.public_location) || '—'),
      'Who: ' + (str_(t.actor_name) || '—') + ' · ' + (str_(t.actor_mode) || '—'),
      'Note: ' + (notify.note || '(none)')
    ];
    if (str_(t.private_context)) lines.push('Private context: ' + str_(t.private_context));
    lines.push('', 'Sheet: ' + book_().getUrl());
    MailApp.sendEmail({ to: to, subject: 'Sushi · ' + heading + ' · ' + str_(t.public_title), body: lines.join('\n') });
    return true;
  } catch (err) {
    console.warn('Sushi notification failed: ' + err);
    return false;
  }
}

// ============================================================================
// Sheet helpers
// ============================================================================

function book_() {
  var ss = null;
  try { ss = SpreadsheetApp.getActiveSpreadsheet(); } catch (err) { ss = null; }
  if (!ss) {
    var id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
    if (!id) throw sushiError_('not_configured', 'The kitchen sheet is not set up yet.');
    ss = SpreadsheetApp.openById(id);
  }
  return ss;
}

function table_(name) {
  var sheet = book_().getSheetByName(name);
  if (!sheet) throw sushiError_('not_configured', 'The ' + name + ' tab is missing. Run Sushi Admin → Set up / repair.');
  var values = sheet.getDataRange().getValues();
  var headers = (values[0] || []).map(function (h) { return String(h).trim(); });
  var index = {};
  headers.forEach(function (h, i) { if (h && index[h] === undefined) index[h] = i; });
  var rows = [];
  for (var r = 1; r < values.length; r++) {
    var row = { _row: r + 1 };
    headers.forEach(function (h, i) { if (h && !(h in row)) row[h] = values[r][i]; });
    rows.push(row);
  }
  return { name: name, sheet: sheet, headers: headers, index: index, rows: rows };
}

/** Writes only the named cells, so a formula or note in a column Sushi doesn't own survives. */
function setFields_(table, row, changes) {
  Object.keys(changes).forEach(function (key) {
    var col = table.index[key];
    if (col === undefined) throw sushiError_('server_error', 'The ' + table.name + ' tab has no "' + key + '" column. Run Sushi Admin → Set up / repair.');
    table.sheet.getRange(row._row, col + 1).setValue(changes[key]);
    row[key] = changes[key];
  });
}

function appendObject_(table, obj) {
  var values = table.headers.map(function (h) { return h && obj[h] !== undefined ? obj[h] : ''; });
  table.sheet.appendRow(values);
  var row = { _row: table.sheet.getLastRow() };
  table.headers.forEach(function (h, i) { if (h) row[h] = values[i]; });
  table.rows.push(row);
  return row;
}

function findTask_(tasks, taskId) {
  for (var i = 0; i < tasks.rows.length; i++) if (str_(tasks.rows[i].task_id) === taskId) return tasks.rows[i];
  return null;
}

function logEvent_(ev) {
  var sheet = book_().getSheetByName(SHEET_NAMES.events);
  if (!sheet) throw sushiError_('not_configured', 'The Events tab is missing. Run Sushi Admin → Set up / repair.');
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(function (h) { return String(h).trim(); });
  var t = ev.task || {};
  var record = {
    event_id: Utilities.getUuid(),
    request_id: ev.requestId || '',
    timestamp: now_(),
    task_id: str_(t.task_id),
    template_id: str_(t.template_id),
    event_type: ev.type,
    old_status: ev.from || '',
    new_status: ev.to || '',
    actor_name: sheetSafe_(ev.actorName || ''),
    actor_mode: ev.actorMode || '',
    claim_id: ev.claimId || '',
    note: sheetSafe_(ev.note || ''),
    metadata_json: ev.metadata ? JSON.stringify(ev.metadata) : ''
  };
  sheet.appendRow(headers.map(function (h) { return record[h] !== undefined ? record[h] : ''; }));
}

function config_() {
  var out = { kitchen_open: true, kitchen_message: '', recent_days: 14 };
  var sheet = book_().getSheetByName(SHEET_NAMES.config);
  if (!sheet) return out;
  sheet.getDataRange().getValues().forEach(function (row) {
    var key = str_(row[0]);
    if (key === 'kitchen_open') out.kitchen_open = isActive_(row[1]);
    if (key === 'kitchen_message') out.kitchen_message = str_(row[1]).slice(0, 200);
    if (key === 'recent_days') out.recent_days = Math.min(90, Math.max(0, Number(row[1]) || 14));
  });
  return out;
}

function newId_(prefix, table, column) {
  var alphabet = '23456789ABCDEFGHJKMNPQRSTVWXYZ';
  var taken = {};
  table.rows.forEach(function (r) { taken[str_(r[column])] = true; });
  for (var attempt = 0; attempt < 50; attempt++) {
    var hex = Utilities.getUuid().replace(/-/g, '');
    var id = prefix + '-';
    for (var i = 0; i < 5; i++) id += alphabet.charAt(parseInt(hex.substr(i * 2, 2), 16) % alphabet.length);
    if (!taken[id]) return id;
  }
  throw sushiError_('server_error', 'Could not make a unique id.');
}

// ============================================================================
// Small value helpers
// ============================================================================

function str_(v) {
  if (v === null || v === undefined) return '';
  if (v instanceof Date) return v.toISOString();
  return String(v).trim();
}

function isActive_(v) {
  if (v === false) return false;
  var s = str_(v).toLowerCase();
  return !(s === 'false' || s === 'no' || s === '0' || s === 'n');
}

function enumOr_(v, allowed, fallback) {
  var s = str_(v);
  return allowed.indexOf(s) >= 0 ? s : fallback;
}

function asDate_(v) {
  if (v instanceof Date) return isNaN(v.getTime()) ? null : v;
  var s = str_(v);
  if (!s) return null;
  var d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

/** A due date typed without a time (local midnight) means the end of that day. */
function dueDate_(v) {
  var d = asDate_(v);
  if (!d) return null;
  if (Utilities.formatDate(d, tz_(), 'HH:mm:ss') === '00:00:00') return new Date(d.getTime() + DAY_MS - 60000);
  return d;
}

function isoOrNull_(d) { return d ? d.toISOString() : null; }

function effectiveUrgency_(stored, due, now) {
  var u = enumOr_(stored, URGENCIES, 'normal');
  if (u === 'urgent') return 'urgent';
  if (due && due.getTime() - now.getTime() <= DUE_SOON_MS) return 'due_soon';
  return u;
}

function parseMinutes_(v) {
  var nums = (str_(v).match(/\d+/g) || []).map(Number).filter(function (n) { return n > 0 && n < 10000; });
  if (!nums.length) return { min: null, max: null };
  return { min: Math.min.apply(null, nums.slice(0, 2)), max: Math.max.apply(null, nums.slice(0, 2)) };
}

function lines_(v) {
  return str_(v).split(/\r?\n/).map(function (line) { return line.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, '').trim(); })
    .filter(function (line) { return line !== ''; });
}

/** Trims and strips control characters. Returns null when too long. Single-line text also folds whitespace. */
function cleanText_(v, max, singleLine) {
  var s = String(v === null || v === undefined ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
  s = singleLine ? s.replace(/\s+/g, ' ').trim() : s.replace(/\r\n?/g, '\n').trim();
  return s.length > max ? null : s;
}

/** Typed text is never allowed to become a Sheet formula. */
function sheetSafe_(s) {
  s = String(s || '');
  return /^[=+\-@]/.test(s) ? '\'' + s : s;
}

function isUuid_(s) { return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(s); }

function statusWords_(status) {
  return { available: 'on the belt', claimed: 'at someone\'s table', help_requested: 'waiting on the chef',
    submitted: 'waiting for Adam', completed: 'already cleared' }[status] || status;
}

function merge_(a, b) {
  var out = {};
  Object.keys(a).forEach(function (k) { out[k] = a[k]; });
  Object.keys(b).forEach(function (k) { out[k] = b[k]; });
  return out;
}

function copyRow_(row) { return merge_(row, {}); }

// ============================================================================
// Sheet setup and the Sushi Admin menu
// ============================================================================

/**
 * Creates or repairs the tabs, headers, validation, and formatting. Safe to run again: it only
 * adds missing tabs and columns, never deletes or reorders anything, and never touches data.
 */
function setupSushi() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', ss.getId());
  var tasks = ensureTab_(ss, SHEET_NAMES.tasks, TASK_COLUMNS, 4);
  var templates = ensureTab_(ss, SHEET_NAMES.templates, TEMPLATE_COLUMNS, 3);
  var events = ensureTab_(ss, SHEET_NAMES.events, EVENT_COLUMNS, 3);
  // Append-only history: warn (not block) anyone about to hand-edit it.
  if (!events.getProtections(SpreadsheetApp.ProtectionType.SHEET).length) {
    events.protect().setDescription('Sushi history is append-only. Fix the task row instead.').setWarningOnly(true);
  }
  var config = ss.getSheetByName(SHEET_NAMES.config) || ss.insertSheet(SHEET_NAMES.config);
  if (config.getLastRow() === 0) {
    config.getRange(1, 1, CONFIG_DEFAULTS.length, 3).setValues(CONFIG_DEFAULTS);
    config.getRange(1, 1, CONFIG_DEFAULTS.length, 1).setFontWeight('bold');
    config.setColumnWidth(1, 150); config.setColumnWidth(2, 260); config.setColumnWidth(3, 480);
  }
  writeStartHere_(ss);

  validate_(tasks, 'active', YES_NO);
  validate_(tasks, 'status', STATUSES);
  validate_(tasks, 'urgency', URGENCIES);
  validate_(tasks, 'category', CATEGORIES, true);
  validate_(tasks, 'effort_size', EFFORTS);
  validate_(tasks, 'note_mode', NOTE_MODES);
  validate_(tasks, 'verification_mode', VERIFICATION_MODES);
  validate_(tasks, 'source_type', SOURCE_TYPES);
  validate_(templates, 'active', YES_NO);
  validate_(templates, 'recurrence_kind', RECURRENCE_KINDS);
  validate_(templates, 'urgency_default', URGENCIES);
  validate_(templates, 'category', CATEGORIES, true);
  validate_(templates, 'effort_size', EFFORTS);
  validate_(templates, 'note_mode', NOTE_MODES);
  validate_(templates, 'verification_mode', VERIFICATION_MODES);
  validate_(templates, 'source_type', SOURCE_TYPES);
  statusColours_(tasks);

  if (tasks.getLastRow() < 2 && templates.getLastRow() < 2) addExamples_();
  invalidateFeed_();
  CacheService.getScriptCache().remove('upkeep_done');
  try { SpreadsheetApp.getUi().alert('Sushi is set up. Next: Deploy → New deployment → Web app (see sushi/backend/README.md).'); } catch (err) { /* run from the editor: no UI */ }
  return true;
}

function ensureTab_(ss, name, columns, frozenCols) {
  var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  var lastCol = sheet.getLastColumn();
  var existing = lastCol ? sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) { return String(h).trim(); }) : [];
  columns.forEach(function (c) {
    if (existing.indexOf(c.name) >= 0) return;
    existing.push(c.name);
    sheet.getRange(1, existing.length).setValue(c.name);
  });
  var header = sheet.getRange(1, 1, 1, existing.length);
  header.setFontWeight('bold').setVerticalAlignment('middle');
  sheet.setFrozenRows(1);
  if (frozenCols) sheet.setFrozenColumns(Math.min(frozenCols, existing.length));
  columns.forEach(function (c) {
    var col = existing.indexOf(c.name) + 1;
    var cell = sheet.getRange(1, col);
    if (c.note) cell.setNote(c.note);
    if (c.p !== undefined) cell.setBackground(c.p ? '#d9ead3' : '#f4cccc'); // green = public, red = private
    if (c.width) sheet.setColumnWidth(col, c.width);
    if (c.hidden) sheet.hideColumns(col);
  });
  if (!sheet.getFilter() && sheet.getMaxRows() > 1) {
    try { sheet.getRange(1, 1, sheet.getMaxRows(), existing.length).createFilter(); } catch (err) { /* a filter already covers part of the sheet */ }
  }
  return sheet;
}

function validate_(sheet, column, list, allowOthers) {
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(function (h) { return String(h).trim(); });
  var col = headers.indexOf(column) + 1;
  if (!col) return;
  var range = sheet.getRange(2, col, Math.max(1, sheet.getMaxRows() - 1), 1);
  range.setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(list, true).setAllowInvalid(!!allowOthers).build());
}

function statusColours_(sheet) {
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(function (h) { return String(h).trim(); });
  var statusCol = columnLetter_(headers.indexOf('status') + 1);
  var urgencyCol = columnLetter_(headers.indexOf('urgency') + 1);
  var range = sheet.getRange(2, 1, Math.max(1, sheet.getMaxRows() - 1), headers.length);
  var rule = function (formula, colour) {
    return SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied(formula).setBackground(colour).setRanges([range]).build();
  };
  sheet.setConditionalFormatRules([
    rule('=$' + statusCol + '2="help_requested"', '#fce5cd'),
    rule('=$' + statusCol + '2="submitted"', '#fff2cc'),
    rule('=$' + statusCol + '2="claimed"', '#e7eefc'),
    rule('=$' + statusCol + '2="completed"', '#eeeeee'),
    rule('=$' + urgencyCol + '2="urgent"', '#f9d6d5')
  ]);
}

function columnLetter_(n) {
  var s = '';
  while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); }
  return s;
}

function writeStartHere_(ss) {
  var sheet = ss.getSheetByName(SHEET_NAMES.start);
  if (sheet) return;
  sheet = ss.insertSheet(SHEET_NAMES.start, 0);
  var lines = [
    ['🍣 Sushi kitchen'],
    ['This Sheet is the live data behind /sushi/ on the MUS 248 site. Code lives in the repo (sushi/backend/Code.gs); tasks live here.'],
    [''],
    ['Add a one-off task: Tasks tab → type a public_title (and the other green columns) on a new row. Leave task_id blank; it fills in within a few minutes, or use Sushi Admin → Fill in new rows now.'],
    ['Add repeating work: Templates tab → one row, recurrence_kind weekly or monthly. Tasks appear on their own.'],
    ['Something done on request (e.g. extra SD-card clears before a busy weekend): Templates row with recurrence_kind manual, then select it and use Sushi Admin → Make a task from selected template.'],
    ['Verify / send back / clear a claim / reopen: click any cell in the task\'s row on Tasks, then use the Sushi Admin menu.'],
    ['History: the Events tab is append-only. Never edit or delete it; fix the task row instead.'],
    [''],
    ['Green headers are PUBLIC: anyone on the internet can read them through the app. Red headers stay private.'],
    ['Never put door codes, access codes, passwords, or anything about an unreleased event in a green column. Use private_context.'],
    ['Before trusting a change: Sushi Admin → Run privacy check.']
  ];
  sheet.getRange(1, 1, lines.length, 1).setValues(lines).setWrap(true);
  sheet.getRange(1, 1).setFontSize(16).setFontWeight('bold');
  sheet.setColumnWidth(1, 820);
}

function addExamples_() {
  var now = now_();
  var tasks = table_(SHEET_NAMES.tasks);
  var templates = table_(SHEET_NAMES.templates);
  appendObject_(tasks, {
    task_id: newId_('S', tasks, 'task_id'), active: 'no', status: STATUS.AVAILABLE,
    public_title: 'Example: dust the OH B01 workstation monitors', urgency: 'normal', public_location: 'OH B01',
    category: 'Maintenance', effort_size: 'small', estimated_minutes: '10',
    public_description: 'An example row. Set active to yes to put it on the belt, or delete it.',
    before_you_take: 'Microfiber cloth only, no spray on the screens.',
    definition_of_done: 'Every monitor in the room wiped\nCloth back in the drawer',
    note_mode: 'optional', verification_mode: 'self', source_type: 'manual', created_at: now, updated_at: now
  });
  appendObject_(templates, {
    template_id: newId_('W', templates, 'template_id'), active: 'no', public_title: 'Example: weekly SD-card readiness check',
    recurrence_kind: 'weekly', recurrence_value: 'Mon', urgency_default: 'normal', public_location: 'BH 208/209',
    category: 'Data Management', effort_size: 'small', estimated_minutes: '10-15',
    public_description: 'An example template. Set active to yes and a task appears every Monday.',
    before_you_take: 'Only cards already offloaded and marked as safe to clear.',
    definition_of_done: 'Every card checked for free space\nAny card that is not empty reported in the note',
    note_mode: 'required', verification_mode: 'admin', source_type: 'recurring', created_at: now, updated_at: now
  });
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Sushi Admin')
    .addItem('✅ Verify selected task', 'menuVerify')
    .addItem('↩️ Send selected task back to its claimant', 'menuSendBack')
    .addItem('🧹 Clear selected claim (back on the belt)', 'menuClear')
    .addItem('♻️ Reopen selected cleared task', 'menuReopen')
    .addItem('⏸️ Disable selected task', 'menuDisable')
    .addSeparator()
    .addItem('➕ Make a task from selected template', 'menuFromTemplate')
    .addItem('🔁 Fill in new rows + recurring tasks now', 'menuUpkeep')
    .addSeparator()
    .addItem('🔎 Preview the public feed', 'menuPreviewFeed')
    .addItem('🛡️ Run privacy check', 'menuPrivacyCheck')
    .addItem('✉️ Send a test notification email', 'menuTestEmail')
    .addItem('⏰ Install hourly upkeep trigger', 'menuInstallTrigger')
    .addItem('⚙️ Set up / repair tabs', 'setupSushi')
    .addToUi();
}

/** Simple trigger: a hand edit should show up on the next read, not after the cache expires. */
function onEdit() {
  try {
    var cache = CacheService.getScriptCache();
    cache.remove('public_feed');
    cache.remove('upkeep_done');
  } catch (err) { /* simple triggers may not have the cache; the 20 s expiry covers it */ }
}

function menuVerify() { menuAdmin_('verify', 'Verify'); }
function menuSendBack() { menuAdmin_('send_back', 'Send back'); }
function menuClear() { menuAdmin_('clear', 'Clear the claim on'); }
function menuReopen() { menuAdmin_('reopen', 'Reopen'); }
function menuDisable() { menuAdmin_('disable', 'Disable'); }

function menuAdmin_(kind, verb) {
  var ui = SpreadsheetApp.getUi();
  var picked = selectedRow_(SHEET_NAMES.tasks, 'task_id');
  if (!picked) { ui.alert('Click a cell in the task\'s row on the Tasks tab first.'); return; }
  var t = picked.row;
  var who = str_(t.actor_name) ? '\nClaimed by: ' + str_(t.actor_name) + ' (' + str_(t.actor_mode) + ')' : '';
  var answer = ui.alert(verb + ' ' + str_(t.task_id) + '?', str_(t.public_title) + '\nStatus: ' + str_(t.status) + who, ui.ButtonSet.OK_CANCEL);
  if (answer !== ui.Button.OK) return;
  var note = '';
  if (kind === 'send_back' || kind === 'clear') {
    var prompt = ui.prompt('Optional note for the Events log (private)', ui.ButtonSet.OK_CANCEL);
    if (prompt.getSelectedButton() !== ui.Button.OK) return;
    note = prompt.getResponseText();
  }
  var result = adminAction_(str_(t.task_id), kind, note);
  ui.alert(result.ok ? 'Done. ' + str_(t.task_id) + ' is now ' + result.task.status + '.' : result.message);
}

function menuFromTemplate() {
  var ui = SpreadsheetApp.getUi();
  var picked = selectedRow_(SHEET_NAMES.templates, 'template_id');
  if (!picked) { ui.alert('Click a cell in the template\'s row on the Templates tab first. (New row? Run "Fill in new rows" so it gets an id.)'); return; }
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) { ui.alert('Another change is in progress. Try again.'); return; }
  var t;
  try {
    t = taskFromTemplate_(table_(SHEET_NAMES.tasks), picked.row, now_(), { source_type: enumOr_(picked.row.source_type, SOURCE_TYPES, 'manual') });
  } finally { lock.releaseLock(); }
  invalidateFeed_();
  ui.alert('Made ' + str_(t.task_id) + ': ' + str_(t.public_title) + '. Set a due date or urgency on the Tasks tab if it needs one.');
}

function menuUpkeep() {
  CacheService.getScriptCache().remove('upkeep_done');
  var made = runUpkeep();
  SpreadsheetApp.getUi().alert('Done. ' + made + ' recurring task(s) made; new rows have ids.');
}

function menuPreviewFeed() {
  invalidateFeed_();
  var json = JSON.stringify(publicFeed_(now_()), null, 2);
  var html = HtmlService.createHtmlOutput('<p style="font:13px sans-serif">This is everything the public app can read. If anything here should be private, move it to a red column.</p><pre style="font:12px monospace;white-space:pre-wrap">' +
    json.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</pre>').setWidth(760).setHeight(560);
  SpreadsheetApp.getUi().showModalDialog(html, 'Public feed');
}

function menuPrivacyCheck() {
  var report = privacyReport_();
  SpreadsheetApp.getUi().alert(report.ok ? 'Privacy check passed' : 'Privacy check found problems', report.lines.join('\n'), SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Looks for private values leaking into the public feed, and for things that should never be in
 * a public column at all (emails, Google Drive/Docs links, words like "code" next to digits).
 */
function privacyReport_() {
  var feed = JSON.stringify(publicFeed_(now_()));
  var lines = [];
  // Values that identify a person or carry private context. Enum-like private columns (actor_mode,
  // verified_by) are left out: their values ("Other", "self") legitimately appear in public text.
  var sensitive = ['actor_name', 'help_note', 'completion_note', 'admin_note', 'private_context', 'private_source_ref', 'claim_secret_hash', 'evidence_ref'];
  table_(SHEET_NAMES.tasks).rows.forEach(function (t) {
    sensitive.forEach(function (name) {
      var value = str_(t[name]);
      if (value.length < 3) return;
      var escaped = JSON.stringify(value).slice(1, -1).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (new RegExp('(^|[^A-Za-z0-9])' + escaped + '($|[^A-Za-z0-9])').test(feed)) {
        lines.push(str_(t.task_id) + ': the private ' + name + ' value appears in the public feed.');
      }
    });
  });
  var risky = [
    [/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i, 'an email address'],
    [/(docs|drive|sheets)\.google\.com/i, 'a Google Docs/Drive link'],
    [/\b(door|access|lock|alarm|gate|keypad)\s*(code|combo|combination)\b/i, 'an access code mention'],
    [/\b(password|passcode|stream key)\b/i, 'a password or key mention']
  ];
  JSON.parse(feed).tasks.forEach(function (task) {
    var text = [task.title, task.description, task.location, task.event_label].concat(task.before_you_take, task.definition_of_done).join(' \n ');
    risky.forEach(function (r) { if (r[0].test(text)) lines.push(task.id + ': public text contains ' + r[1] + '.'); });
  });
  var feedKeys = JSON.parse(feed).tasks.length ? Object.keys(JSON.parse(feed).tasks[0]) : [];
  feedKeys.forEach(function (k) { if (PUBLIC_TASK_KEYS.indexOf(k) < 0) lines.push('The feed has an unexpected field: ' + k); });
  if (!lines.length) lines.push('No private values or risky text found in ' + JSON.parse(feed).tasks.length + ' public task(s).');
  return { ok: lines.length === 1 && lines[0].indexOf('No private') === 0, lines: lines };
}

function menuTestEmail() {
  var to = PropertiesService.getScriptProperties().getProperty('ADMIN_EMAIL');
  var ui = SpreadsheetApp.getUi();
  if (!to) { ui.alert('Set ADMIN_EMAIL in Project Settings → Script Properties first.'); return; }
  var sent = sendNotification_({ kind: 'help', task: { task_id: 'TEST', public_title: 'Test notification', public_location: '—', actor_name: 'nobody', actor_mode: '—' }, note: 'If you can read this, help emails work.' });
  ui.alert(sent ? 'Sent. Check your inbox.' : 'Not sent. See Executions in the Apps Script editor for the error.');
}

function menuInstallTrigger() {
  var exists = ScriptApp.getProjectTriggers().some(function (tr) { return tr.getHandlerFunction() === 'runUpkeep'; });
  if (!exists) ScriptApp.newTrigger('runUpkeep').timeBased().everyHours(1).create();
  SpreadsheetApp.getUi().alert(exists ? 'The hourly trigger was already installed.' : 'Installed. Recurring tasks now appear within the hour even if nobody opens the app.');
}

function selectedRow_(sheetName, idColumn) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  if (!sheet || sheet.getName() !== sheetName) return null;
  var r = sheet.getActiveRange() ? sheet.getActiveRange().getRow() : 0;
  if (r < 2) return null;
  var table = table_(sheetName);
  var row = table.rows[r - 2];
  if (!row || !str_(row[idColumn])) return null;
  return { table: table, row: row };
}
