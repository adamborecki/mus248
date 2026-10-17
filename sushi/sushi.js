// Sushi page controller. Renders the belt, My Table, and the task sheet; turns taps into client
// calls. All text from the Sheet goes through escapeHtml: nothing from the backend is ever
// rendered as HTML.

import { SUSHI_CONFIG } from './config.js';
import {
  DEFAULT_FILTERS, EFFORT, WORK_MODES, activeFilterCount, dueLabel, effortLabel, escapeHtml as h, isOverdue,
  matchesFilters, minutesLabel, optionsFor, pieceFor, splitFeed, statusText,
} from './logic.js';
import { SushiClient, createStore } from './client.js';

const $ = (selector, root = document) => root.querySelector(selector);
const store = createStore();
const params = new URLSearchParams(location.search);
const API_PATTERN = /^https:\/\/script\.google\.com\/(a\/[^/]+\/)?macros\/s\/[A-Za-z0-9_-]+\/exec$/;
const configured = API_PATTERN.test(SUSHI_CONFIG.apiUrl || '');
const MODE = params.has('demo') ? 'demo' : configured ? 'live' : 'unconfigured';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

const state = {
  feed: null,
  fetchedAt: null,
  stale: false,
  error: '',
  errorCode: '',
  loaded: false,
  refreshing: false,
  filters: { ...DEFAULT_FILTERS, ...store.get('sushi.filters', {}) },
  welcomeDismissed: store.get('sushi.welcomeDismissed', false),
  pendingTake: null,
  dialog: { taskId: null, panel: 'view', busy: false, error: '', draft: '', key: '', focus: false, last: null },
};

let client = null;
let transport = null;

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

async function boot() {
  renderModeOptions();
  wireEvents();
  if (MODE === 'unconfigured') { renderUnconfigured(); return; }
  try {
    transport = MODE === 'demo'
      ? await (await import('./mock.js')).createDemoTransport({ store })
      : (await import('./api.js')).createLiveTransport(SUSHI_CONFIG.apiUrl);
  } catch (error) {
    state.loaded = true;
    state.stale = true;
    state.error = error.message;
    render();
    return;
  }
  client = new SushiClient({ transport, store, namespace: MODE });
  // The demo kitchen is reachable from the console (and sushi/tests/browser.mjs). Never in live mode.
  if (MODE === 'demo') window.sushiDemo = { transport, client, refresh: () => refresh() };
  render();
  await refresh();
  openFromHash();
  const every = Math.max(20, Number(SUSHI_CONFIG.pollSeconds) || 60) * 1000;
  setInterval(() => { if (document.visibilityState === 'visible' && !state.dialog.busy) refresh(); }, every);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && Date.now() - Date.parse(state.fetchedAt || 0) > 30000) refresh();
  });
}

async function refresh() {
  if (!client || state.refreshing) return;
  state.refreshing = true;
  renderRefreshing();
  const result = await client.refresh();
  state.refreshing = false;
  state.loaded = true;
  if (result.ok) {
    Object.assign(state, { feed: result.feed, fetchedAt: result.fetchedAt, stale: false, error: '', errorCode: '' });
    (result.notices || []).forEach((notice) => toast(notice.text, notice.kind === 'lost' ? 'warn' : 'ok', 9000));
  } else {
    Object.assign(state, { stale: true, error: result.error, errorCode: result.code || '' });
    if (result.feed) Object.assign(state, { feed: result.feed, fetchedAt: result.fetchedAt });
  }
  render();
}

// ---------------------------------------------------------------------------
// Derived state
// ---------------------------------------------------------------------------

const allTasks = () => (state.feed && state.feed.tasks) || [];
const taskById = (id) => allTasks().find((t) => t.id === id) || null;
const myClaimIds = () => (client ? client.myClaimIds() : []);
const isMine = (task) => Boolean(task && task.claim_id && myClaimIds().includes(task.claim_id));
const kitchen = () => (state.feed && state.feed.kitchen) || { open: true, message: '' };

/** Why actions are paused right now, or '' if they aren't. */
function pausedReason() {
  if (!client) return 'The kitchen isn\'t connected.';
  if (state.stale) return 'Can\'t reach the kitchen right now, so taking and finishing plates is paused.';
  if (!kitchen().open) return kitchen().message || 'The kitchen is closed right now.';
  return '';
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

function render() {
  $('#app').setAttribute('aria-busy', String(!state.loaded));
  renderProfileChip();
  renderBanners();
  renderWelcome();
  renderFilters();
  renderLists();
  renderDialog();
  renderStatusLine();
  renderRefreshing();
}

function renderProfileChip() {
  const profile = client ? client.profile : store.get('sushi.profile', null);
  $('#profile-label').textContent = profile ? `${profile.name} · ${profile.mode}` : 'Add your name';
  $('#profile-button').classList.toggle('needs-setup', !profile);
}

function renderBanners() {
  const parts = [];
  if (MODE === 'demo') {
    const faults = transport && transport.faults;
    parts.push(`<div class="banner demo" role="note">
      <p><strong><span aria-hidden="true">🧪</span> Demo kitchen.</strong> Practice plates, saved only in this browser. Nothing here reaches Adam. <a href="./">Leave the demo</a></p>
      <details class="demo-tools">
        <summary>Demo tools</summary>
        <p class="fine">Pretend to be someone else, or make the network misbehave, to see how Sushi copes.</p>
        <div class="demo-buttons">
          <button type="button" class="button small" data-action="demo-someone">Someone else takes a plate</button>
          <button type="button" class="button small" data-action="demo-verify">Adam verifies waiting plates</button>
          <button type="button" class="button small" data-action="demo-clear">Adam clears my claims</button>
          <button type="button" class="button small" data-action="demo-drop" aria-pressed="${faults && faults.next === 'drop'}">Next action never arrives</button>
          <button type="button" class="button small" data-action="demo-lose" aria-pressed="${faults && faults.next === 'lose-reply'}">Next reply gets lost</button>
          <label class="demo-offline"><input type="checkbox" data-action="demo-offline" ${faults && faults.offline ? 'checked' : ''}> Kitchen unreachable</label>
          <button type="button" class="button small quiet" data-action="demo-reset">Reset the demo</button>
        </div>
      </details>
    </div>`);
  }
  if (client && state.stale && state.loaded) {
    const when = state.fetchedAt ? `Showing the belt from ${timeOf(state.fetchedAt)}, which may be out of date.` : 'There is no saved copy of the belt on this device yet.';
    const notSetUp = state.errorCode === 'not_configured';
    parts.push(`<div class="banner warn" role="alert">
      <p><strong><span aria-hidden="true">⚠️</span> ${notSetUp ? 'The kitchen sheet isn\'t set up yet.' : 'Couldn\'t reach the kitchen.'}</strong> ${h(when)} Taking and finishing plates is paused until it's back.</p>
      <p class="fine">${h(state.error)}</p>
      <button type="button" class="button small" data-action="refresh">Try again</button>
    </div>`);
  }
  if (state.feed && !kitchen().open) {
    parts.push(`<div class="banner closed" role="note"><p><strong><span aria-hidden="true">🚪</span> Kitchen closed.</strong> ${h(kitchen().message || 'You can look, but nobody can take or finish plates right now.')}</p></div>`);
  } else if (state.feed && kitchen().message) {
    parts.push(`<div class="banner info" role="note"><p><span aria-hidden="true">📣</span> ${h(kitchen().message)}</p></div>`);
  }
  const html = parts.join('');
  const banners = $('#banners');
  // Re-rendering would collapse an open Demo tools panel; keep it open.
  const wasOpen = Boolean($('.demo-tools[open]', banners));
  if (banners.dataset.html !== html) {
    banners.innerHTML = html;
    banners.dataset.html = html;
    if (wasOpen && $('.demo-tools', banners)) $('.demo-tools', banners).open = true;
  }
}

function renderWelcome() {
  const show = Boolean(client) && !client.profile && !state.welcomeDismissed;
  $('#welcome').hidden = !show;
}

function renderFilters() {
  const f = state.filters;
  const open = allTasks().filter((t) => t.status !== 'completed');
  fillSelect($('#filters [name=location]'), 'Anywhere', optionsFor(open, 'location'), f.location);
  fillSelect($('#filters [name=category]'), 'All kinds', optionsFor(open, 'category'), f.category);
  $('#filters [name=effort]').value = f.effort;
  $('#filters [name=urgentOnly]').checked = f.urgentOnly;
  $(`#filters [name=show][value="${f.show}"]`).checked = true;
  $('#clear-filters').hidden = activeFilterCount(f) === 0;
}

function fillSelect(select, allLabel, values, selected) {
  const list = values.includes(selected) || selected === 'all' ? values : [...values, selected];
  const html = [`<option value="all">${h(allLabel)}</option>`, ...list.map((v) => `<option value="${h(v)}">${h(v)}</option>`)].join('');
  if (select.dataset.html !== html) { select.innerHTML = html; select.dataset.html = html; }
  select.value = selected;
}

function renderLists() {
  const tasks = allTasks();
  const split = splitFeed(tasks, myClaimIds());
  const f = state.filters;
  const showTable = f.show !== 'belt';
  const showBelt = f.show !== 'table';

  // My Table
  const tableSection = $('#table-section');
  tableSection.hidden = !state.loaded || !showTable || (split.mine.length === 0 && f.show !== 'table');
  $('#table-count').textContent = split.mine.length ? `${split.mine.length} ${split.mine.length === 1 ? 'plate' : 'plates'}` : '';
  setHtml($('#table-list'), split.mine.length
    ? split.mine.map((t) => card(t, { mine: true })).join('')
    : '<li class="empty-inline">Nothing on your table. Take a plate from the belt.</li>');

  // The belt
  const belt = split.belt.filter((t) => matchesFilters(t, f));
  $('#belt-section').hidden = !showBelt;
  if (!state.loaded) {
    setHtml($('#belt-list'), Array.from({ length: 4 }, () => '<li class="plate-card skeleton" aria-hidden="true"><span class="plate"></span><span class="plate-body"><span class="bar"></span><span class="bar short"></span></span></li>').join(''));
    $('#belt-count').textContent = 'Loading…';
  } else {
    setHtml($('#belt-list'), belt.map((t) => card(t, {})).join(''));
    const filtered = belt.length !== split.belt.length;
    $('#belt-count').textContent = `${belt.length} ${belt.length === 1 ? 'plate' : 'plates'}${filtered ? ` of ${split.belt.length}` : ''}`;
  }
  const empty = $('#belt-empty');
  empty.hidden = !state.loaded || belt.length > 0;
  if (state.loaded && !belt.length) {
    empty.innerHTML = split.belt.length
      ? 'No plates match those filters. <button type="button" class="text-button" data-action="clear-filters">Clear filters</button>'
      : (state.feed ? 'The belt is empty right now. New plates appear as work comes up, so check back soon.' : 'No plates to show yet.');
  }
  $('#belt').hidden = state.loaded && !belt.length;
  requestAnimationFrame(updateNudges);

  // Taken by others
  const taken = split.taken.filter((t) => matchesFilters(t, f));
  $('#taken-section').hidden = !taken.length || !showBelt;
  $('#taken-count').textContent = `(${taken.length})`;
  setHtml($('#taken-list'), taken.map((t) => card(t, { compact: true })).join(''));

  // History
  const mine = client ? client.history : [];
  setHtml($('#my-history'), mine.length
    ? mine.slice(0, 15).map((e) => `<li><span aria-hidden="true">✓</span> ${h(e.title)} <time datetime="${h(e.at)}">${h(dateOf(e.at))}</time></li>`).join('')
    : '<li class="empty-inline">Nothing yet. Plates you finish on this device show up here.</li>');
  setHtml($('#cleared-list'), split.cleared.length
    ? split.cleared.slice(0, 20).map((t) => `<li><span aria-hidden="true">${pieceFor(t.category)}</span> ${h(t.title)} <time datetime="${h(t.completed_at || '')}">${h(dateOf(t.completed_at))}</time></li>`).join('')
    : '<li class="empty-inline">Nothing cleared in the last couple of weeks.</li>');
}

function setHtml(el, html) {
  if (el.dataset.html === html) return;
  el.innerHTML = html;
  el.dataset.html = html;
}

/** One plate. The whole card is a button that opens the details; it never claims anything. */
function card(task, { mine = false, compact = false }) {
  const status = statusText(task, mine);
  const flags = [];
  if (task.urgency === 'urgent') flags.push('<span class="flag urgent"><span aria-hidden="true">⚡</span> Urgent</span>');
  else if (task.urgency === 'due_soon') flags.push('<span class="flag soon"><span aria-hidden="true">⏰</span> Due soon</span>');
  const due = dueLabel(task);
  if (due) flags.push(`<span class="flag due${isOverdue(task) ? ' overdue' : ''}">${h(due)}</span>`);
  return `<li class="plate-card tone-${status.tone} urgency-${h(task.urgency)}${compact ? ' compact' : ''}">
    <button type="button" class="plate-open" data-action="open-task" data-task="${h(task.id)}">
      ${plate(task)}
      <span class="plate-body">
        ${flags.length ? `<span class="flags">${flags.join('')}</span>` : ''}
        <span class="plate-title">${h(task.title)}</span>
        <span class="plate-meta"><span><span aria-hidden="true">📍</span> ${h(task.location || 'Anywhere')}</span><span><span aria-hidden="true">⏱</span> ${h(minutesLabel(task))}</span></span>
        <span class="plate-kind">${h(task.category || 'General')} · ${h(effortLabel(task))}</span>
        <span class="status-pill tone-${status.tone}">${h(status.short)}</span>
      </span>
    </button>
  </li>`;
}

function plate(task, big = false) {
  const effort = EFFORT[task.effort] ? task.effort : 'medium';
  return `<span class="plate effort-${effort}${big ? ' big' : ''}" aria-hidden="true"><span class="piece">${pieceFor(task.category)}</span></span>`;
}

function renderStatusLine() {
  const bits = [];
  bits.push(MODE === 'demo' ? 'Demo kitchen' : MODE === 'live' ? 'Live kitchen' : 'Not connected');
  if (state.fetchedAt) bits.push(`${state.stale ? 'last updated' : 'updated'} ${timeOf(state.fetchedAt)}`);
  if (transport && transport.readMode === 'jsonp') bits.push('reading via JSONP');
  $('#status-line').textContent = bits.join(' · ');
}

function renderRefreshing() {
  $('#refresh').classList.toggle('spinning', state.refreshing && !reducedMotion.matches);
  $('#refresh').disabled = state.refreshing || !client;
}

function renderUnconfigured() {
  state.loaded = true;
  $('#app').setAttribute('aria-busy', 'false');
  $('#app').innerHTML = `<section class="closed-card">
    ${plate({ category: 'Maintenance', effort: 'medium' }, true)}
    <h2>The kitchen opens soon</h2>
    <p>Sushi is built, but it isn't connected to Adam's task sheet yet, so there's no real work on the belt.</p>
    <p><a class="button primary" href="?demo=1">Look around the demo kitchen</a></p>
    <p class="fine">The demo uses practice plates saved only in your browser. Nothing you do there reaches anyone.</p>
  </section>`;
  renderProfileChip();
  renderStatusLine();
}

// ---------------------------------------------------------------------------
// The task sheet (dialog)
// ---------------------------------------------------------------------------

function openTask(id, panel = 'view') {
  const task = taskById(id);
  if (!task) { toast('That plate isn\'t on the belt anymore.', 'warn'); return; }
  Object.assign(state.dialog, { taskId: id, panel, busy: false, error: '', draft: '', key: '', focus: true, last: task });
  const dialog = $('#task-dialog');
  if (!dialog.open) dialog.showModal();
  if (location.hash !== `#${id}`) history.replaceState(null, '', `#${id}`);
  renderDialog();
}

function closeTask() {
  const dialog = $('#task-dialog');
  if (dialog.open) dialog.close();
}

function setPanel(panel) {
  Object.assign(state.dialog, { panel, error: '', focus: true });
  renderDialog();
}

function renderDialog() {
  const d = state.dialog;
  if (!d.taskId || !$('#task-dialog').open) return;
  const live = taskById(d.taskId);
  const task = live || d.last;
  if (live) d.last = live;
  const mine = isMine(task);
  const paused = pausedReason();
  const profile = client && client.profile;
  const key = JSON.stringify([task.id, task.status, task.claim_id, mine, Boolean(live), d.panel, d.busy, d.error, paused, profile && profile.name, profile && profile.mode]);
  if (key === d.key) return;
  d.key = key;
  // Keep what someone has typed across a re-render.
  const typed = $('#task-note');
  if (typed) d.draft = typed.value;

  const status = statusText(task, mine);
  const due = dueLabel(task);
  const list = (items) => `<ul>${items.map((item) => `<li>${h(item)}</li>`).join('')}</ul>`;
  const finishWords = {
    none: 'No note needed: just tap Finished Eating.',
    optional: 'You can add a short note when you finish.',
    required: 'You\'ll need to add a short note when you finish.',
  }[task.note_mode] || '';
  const verifyWords = task.verification === 'admin'
    ? 'Adam checks this one before it\'s cleared.'
    : 'Finishing clears it straight away.';

  $('#task-dialog-body').innerHTML = `
    <div class="sheet-head">
      ${plate(task, true)}
      <div class="sheet-title">
        <h2 id="task-dialog-title">${h(task.title)}</h2>
        <p class="sheet-status"><span class="status-pill tone-${status.tone}">${h(status.short)}</span>
          ${task.urgency === 'urgent' ? '<span class="flag urgent"><span aria-hidden="true">⚡</span> Urgent</span>' : ''}
          ${task.urgency === 'due_soon' ? '<span class="flag soon"><span aria-hidden="true">⏰</span> Due soon</span>' : ''}</p>
      </div>
      <button type="button" class="icon-button close" data-action="close-task" aria-label="Close">✕</button>
    </div>
    ${live ? '' : '<p class="notice warn">This plate is no longer on the belt. It may have been finished or taken down.</p>'}
    <dl class="facts">
      <div><dt>Where</dt><dd>${h(task.location || 'Anywhere')}</dd></div>
      <div><dt>Time</dt><dd>${h(minutesLabel(task))} · ${h(effortLabel(task))}</dd></div>
      <div><dt>Kind</dt><dd>${h(task.category || 'General')}${task.recurring ? ' · repeats' : ''}</dd></div>
      ${due ? `<div><dt>Due</dt><dd class="${isOverdue(task) ? 'overdue' : ''}">${h(due.replace(/^Due /, ''))}</dd></div>` : ''}
      ${task.event_label ? `<div><dt>Event</dt><dd>${h(task.event_label)}</dd></div>` : ''}
    </dl>
    ${task.description ? `<p class="description">${h(task.description)}</p>` : ''}
    ${task.before_you_take.length ? `<section class="callout before"><h3><span aria-hidden="true">👀</span> Before you take it</h3>${list(task.before_you_take)}</section>` : ''}
    ${task.definition_of_done.length ? `<section class="callout done"><h3><span aria-hidden="true">✅</span> Definition of done</h3>${list(task.definition_of_done)}</section>` : ''}
    <p class="finish-rules"><span aria-hidden="true">📝</span> ${h(finishWords)} ${h(verifyWords)}</p>
    <div class="sheet-actions-area" aria-live="polite">${live ? actionsHtml(task, mine, status, paused) : ''}</div>`;

  const note = $('#task-note');
  if (note) note.value = d.draft;
  if (d.focus) {
    d.focus = false;
    const target = $('#task-note') || $('#task-dialog-body .sheet-actions-area .button.primary:not([disabled])') || $('#task-dialog-body .close');
    if (target) target.focus({ preventScroll: true });
  }
}

function actionsHtml(task, mine, status, paused) {
  const d = state.dialog;
  const busy = d.busy ? 'disabled aria-disabled="true"' : '';
  const err = d.error ? `<p class="form-error" role="alert">${h(d.error)}</p>` : '';
  const pausedNote = paused ? `<p class="notice">${h(paused)}</p>` : '';
  // Cancel-type buttons stay usable while actions are paused; only a request in flight locks them.
  const button = (action, label, cls = '', busyLabel = '') => {
    const locked = busy || (paused && action !== 'cancel-panel' ? 'disabled' : '');
    return `<button type="button" class="button ${cls}" data-action="${action}" ${locked}>${h(d.busy && busyLabel ? busyLabel : label)}</button>`;
  };
  const profile = client.profile;

  if (d.panel === 'confirm-claim' && task.status === 'available') {
    return `${err}<div class="confirm">
      <p>Take this plate as <strong>${h(profile ? profile.name : '')}</strong> (${h(profile ? profile.mode : '')})? It stays at your table until you finish it or put it back.</p>
      <p class="fine">Not you? <button type="button" class="text-button" data-action="open-profile">Change name</button></p>
      <div class="sheet-actions">${button('confirm-take', 'Yes, take the plate', 'primary', 'Taking…')}${button('cancel-panel', 'Not yet', 'quiet')}</div></div>${pausedNote}`;
  }
  if ((d.panel === 'help' || d.panel === 'complete') && mine) {
    const helpMode = d.panel === 'help';
    const required = !helpMode && task.note_mode === 'required';
    const noNote = !helpMode && task.note_mode === 'none';
    const label = helpMode ? 'What\'s in the way? (optional)' : required ? 'Your note (required)' : 'Anything Adam should know? (optional)';
    const hint = helpMode ? 'Only Adam sees this. The plate stays yours.' : 'Only Adam sees this.';
    return `${err}<form class="note-form" data-form="${d.panel}">
      ${noNote ? '' : `<label class="field"><span class="field-label">${h(label)}</span>
        <textarea id="task-note" name="note" rows="3" maxlength="500" ${required ? 'required' : ''}></textarea>
        <span class="field-hint">${h(hint)} 500 characters max.</span></label>`}
      ${!helpMode && task.definition_of_done.length ? '<p class="fine">Check the definition of done above before you send it.</p>' : ''}
      <div class="sheet-actions">
        ${helpMode ? button('submit-help', 'Call the Chef', 'primary', 'Calling…') : button('submit-finish', task.verification === 'admin' ? 'Finished Eating · send to Adam' : 'Finished Eating', 'primary', 'Sending…')}
        ${button('cancel-panel', 'Cancel', 'quiet')}
      </div></form>${pausedNote}`;
  }
  if (d.panel === 'confirm-release' && mine) {
    return `${err}<div class="confirm"><p>Put this plate back on the belt? Anyone can take it after you.</p>
      <div class="sheet-actions">${button('confirm-release', 'Put it back', 'primary', 'Putting it back…')}${button('cancel-panel', 'Keep it', 'quiet')}</div></div>${pausedNote}`;
  }

  // The default view for each state.
  if (task.status === 'available') {
    return `${err}<div class="sheet-actions">${button('take', 'Take the Plate', 'primary')}</div>
      <p class="fine">Opening a plate never takes it. Taking it puts it at your table; nobody else sees your name.</p>${pausedNote}`;
  }
  if (mine && task.status === 'claimed') {
    return `${err}<p class="notice mine">${h(status.long)}</p>
      <div class="sheet-actions">${button('finish', 'Finished Eating', 'primary')}${button('call-chef', 'Call the Chef')}${button('put-back', 'Put It Back', 'quiet')}</div>${pausedNote}`;
  }
  if (mine && task.status === 'help_requested') {
    return `${err}<p class="notice help"><span aria-hidden="true">🔔</span> ${h(status.long)}</p>
      <div class="sheet-actions">${button('finish', 'Finished Eating', 'primary')}${button('resume', 'I\'m unstuck', '', 'Updating…')}${button('put-back', 'Put It Back', 'quiet')}</div>${pausedNote}`;
  }
  return `${err}<p class="notice ${status.tone}">${h(status.long)}</p>`;
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

const OUTCOMES = {
  claim: (r) => ['It\'s on your table. It stays yours until you finish it or put it back.', 'ok', r],
  help: () => ['The chef has been called. The plate is still yours.', 'ok'],
  resume: () => ['Back at it.', 'ok'],
  release: () => ['Back on the belt. Thanks for letting someone else have it.', 'ok'],
  complete: (r) => (r.task && r.task.status === 'submitted'
    ? ['Sent to Adam. It clears once he has checked it.', 'ok']
    : ['Cleared. Thank you!', 'ok']),
};

async function runAction(kind, fn) {
  const d = state.dialog;
  if (d.busy) return;
  d.busy = true;
  d.error = '';
  renderDialog();
  let result;
  try { result = await fn(); } catch (error) { result = { ok: false, code: 'error', message: error.message || String(error) }; }
  d.busy = false;
  if (result.code === 'in_flight') { renderDialog(); return; }
  // A task in the reply is the backend's own word for the new state, so show it right away.
  if (result.task && state.feed) {
    state.feed = { ...state.feed, tasks: allTasks().some((t) => t.id === result.task.id)
      ? allTasks().map((t) => (t.id === result.task.id ? result.task : t)) : [...allTasks(), result.task] };
  }
  if (result.ok) {
    d.panel = 'view';
    d.draft = '';
    const [text, tone] = OUTCOMES[kind](result);
    toast(text, tone);
  } else {
    if (['conflict', 'not_yours', 'wrong_state', 'not_found'].includes(result.code)) d.panel = 'view';
    d.error = result.message || 'That didn\'t work.';
    if (result.code === 'unconfirmed') toast('Couldn\'t confirm that with the kitchen. Check the belt in a moment.', 'warn', 8000);
  }
  d.focus = true;
  render();
  await refresh(); // re-read: the belt is the final word
}

function currentTask() { return taskById(state.dialog.taskId); }

const ACTIONS = {
  'open-task': (el) => openTask(el.dataset.task),
  'close-task': () => closeTask(),
  'cancel-panel': () => setPanel('view'),
  take: () => {
    if (!client.profile) { state.pendingTake = state.dialog.taskId; openProfile(); return; }
    setPanel('confirm-claim');
  },
  'confirm-take': () => { const t = currentTask(); if (t) runAction('claim', () => client.claim(t)); },
  finish: () => setPanel('complete'),
  'call-chef': () => setPanel('help'),
  'put-back': () => setPanel('confirm-release'),
  'confirm-release': () => { const t = currentTask(); if (t) runAction('release', () => client.release(t)); },
  resume: () => { const t = currentTask(); if (t) runAction('resume', () => client.resume(t)); },
  'submit-help': () => submitNote('help'),
  'submit-finish': () => submitNote('complete'),
  refresh: () => refresh(),
  'clear-filters': () => { state.filters = { ...DEFAULT_FILTERS, show: state.filters.show }; saveFilters(); render(); },
  'open-profile': () => openProfile(),
  'close-profile': () => $('#profile-dialog').close(),
  'forget-profile': () => {
    client.profile = null;
    store.remove('sushi.profile');
    $('#profile-dialog').close();
    toast('Forgotten on this device. Plates already at your table stay there.', 'ok');
    render();
  },
  'dismiss-welcome': () => { state.welcomeDismissed = true; store.set('sushi.welcomeDismissed', true); render(); },
  'demo-someone': () => { const title = transport.someoneTakesOne(); toast(title ? `Someone else took “${title}”.` : 'Nothing left on the belt to take.', 'ok'); refresh(); },
  'demo-verify': () => { const n = transport.adamVerifiesAll(); toast(n ? `Adam verified ${n} plate${n === 1 ? '' : 's'}.` : 'Nothing is waiting for Adam.', 'ok'); refresh(); },
  'demo-clear': () => { const n = transport.adamClearsMine(Object.keys(client.claims)); toast(n ? `Adam cleared ${n} of your claims.` : 'Nothing at your table to clear.', 'ok'); refresh(); },
  'demo-drop': () => { transport.faults.next = transport.faults.next === 'drop' ? null : 'drop'; render(); },
  'demo-lose': () => { transport.faults.next = transport.faults.next === 'lose-reply' ? null : 'lose-reply'; render(); },
  'demo-offline': (el) => { transport.faults.offline = el.checked; refresh(); },
  'demo-reset': () => {
    transport.reset();
    store.remove(`sushi.demo.claims`);
    store.remove(`sushi.demo.history`);
    store.remove(`sushi.demo.cache`);
    toast('Demo kitchen reset.', 'ok');
    refresh();
  },
};

function submitNote(kind) {
  const task = currentTask();
  if (!task) return;
  const field = $('#task-note');
  const note = field ? field.value.trim() : '';
  if (kind === 'complete' && task.note_mode === 'required' && !note) {
    state.dialog.error = 'This plate needs a short note before it\'s finished.';
    state.dialog.key = '';
    renderDialog();
    $('#task-note').focus();
    return;
  }
  state.dialog.draft = field ? field.value : '';
  runAction(kind, () => (kind === 'help' ? client.help(task, note) : client.complete(task, note)));
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

function renderModeOptions() {
  $('#mode-options').innerHTML = WORK_MODES.map((m, i) => `<label class="mode-option">
    <input type="radio" name="mode" value="${h(m.value)}" ${i === 0 ? 'required' : ''}>
    <span><strong>${h(m.label)}</strong><small>${h(m.hint)}</small></span></label>`).join('');
}

function openProfile() {
  const profile = store.get('sushi.profile', null);
  const form = $('#profile-form');
  form.elements.name.value = profile ? profile.name : '';
  [...form.querySelectorAll('[name=mode]')].forEach((input) => { input.checked = Boolean(profile && profile.mode === input.value); });
  $('#forget-profile').hidden = !profile;
  $('#profile-error').textContent = '';
  const dialog = $('#profile-dialog');
  if (!dialog.open) dialog.showModal();
  form.elements.name.focus();
}

function saveProfile(event) {
  event.preventDefault();
  const form = $('#profile-form');
  const name = form.elements.name.value.replace(/\s+/g, ' ').trim();
  const mode = (form.querySelector('[name=mode]:checked') || {}).value;
  if (!name) { $('#profile-error').textContent = 'Add your name.'; form.elements.name.focus(); return; }
  if (name.length > 60) { $('#profile-error').textContent = 'Keep it under 60 characters.'; return; }
  if (!mode) { $('#profile-error').textContent = 'Pick how you\'re doing this work.'; return; }
  store.set('sushi.profile', { name, mode });
  $('#profile-dialog').close();
  toast(`Hi, ${name}.`, 'ok');
  render();
  if (state.pendingTake) {
    const id = state.pendingTake;
    state.pendingTake = null;
    if ($('#task-dialog').open && state.dialog.taskId === id) setPanel('confirm-claim');
    else openTask(id, 'confirm-claim');
  }
}

// ---------------------------------------------------------------------------
// Events, filters, small helpers
// ---------------------------------------------------------------------------

function wireEvents() {
  document.addEventListener('click', (event) => {
    const el = event.target.closest('[data-action]');
    if (!el || el.disabled) return;
    if (el.matches('input[type=checkbox]')) return; // handled on change
    const action = ACTIONS[el.dataset.action];
    if (action) { event.preventDefault(); action(el); }
  });
  document.addEventListener('change', (event) => {
    const el = event.target.closest('input[type=checkbox][data-action]');
    if (el && ACTIONS[el.dataset.action]) ACTIONS[el.dataset.action](el);
  });
  document.addEventListener('submit', (event) => {
    const form = event.target.closest('.note-form');
    if (!form) return;
    event.preventDefault();
    submitNote(form.dataset.form === 'help' ? 'help' : 'complete');
  });
  $('#profile-form').addEventListener('submit', saveProfile);
  // A save consumes pendingTake before this fires; any other close (cancel, backdrop) abandons it.
  $('#profile-dialog').addEventListener('close', () => { state.pendingTake = null; });

  const taskDialog = $('#task-dialog');
  taskDialog.addEventListener('close', () => {
    Object.assign(state.dialog, { taskId: null, panel: 'view', error: '', draft: '', key: '' });
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  });
  [taskDialog, $('#profile-dialog')].forEach((dialog) => dialog.addEventListener('click', (event) => {
    if (event.target === dialog && !state.dialog.busy) dialog.close(); // tap on the backdrop
  }));
  taskDialog.addEventListener('cancel', (event) => { if (state.dialog.busy) event.preventDefault(); });

  $('#filters').addEventListener('change', (event) => {
    const { name, value, checked, type } = event.target;
    if (!name) return;
    state.filters = { ...state.filters, [name]: type === 'checkbox' ? checked : value };
    saveFilters();
    render();
  });
  $('#filters').addEventListener('submit', (event) => event.preventDefault());
  $('#refresh').addEventListener('click', () => refresh());
  document.querySelectorAll('.belt-nudge').forEach((button) => button.addEventListener('click', () => {
    const track = $('#belt-list');
    track.scrollBy({ left: Number(button.dataset.nudge) * track.clientWidth * 0.8, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  }));
  $('#belt-list').addEventListener('scroll', () => requestAnimationFrame(updateNudges), { passive: true });
  addEventListener('resize', () => requestAnimationFrame(updateNudges));
  addEventListener('hashchange', openFromHash);
  $('#profile-button').addEventListener('click', openProfile);
}

function openFromHash() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (id && /^[A-Za-z0-9_-]{1,40}$/.test(id) && taskById(id) && state.dialog.taskId !== id) openTask(id);
}

function updateNudges() {
  const track = $('#belt-list');
  const overflow = track.scrollWidth > track.clientWidth + 4 && getComputedStyle(track).overflowX !== 'visible';
  $('.belt-nudge.prev').hidden = !overflow || track.scrollLeft < 8;
  $('.belt-nudge.next').hidden = !overflow || track.scrollLeft + track.clientWidth > track.scrollWidth - 8;
}

function saveFilters() { store.set('sushi.filters', state.filters); }

let toastTimer = null;
function toast(text, tone = 'ok', ms = 5000) {
  const el = $('#toast');
  // An open modal dialog sits in the top layer, above everything in <body>. Put the toast inside
  // it so the message isn't hidden behind the backdrop.
  const host = [...document.querySelectorAll('dialog[open]')].pop() || document.body;
  if (el.parentElement !== host) host.append(el);
  el.textContent = text;
  el.className = `toast ${tone}`;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, ms);
}

function timeOf(iso) { return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); }
function dateOf(iso) { return iso ? new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''; }

boot();
