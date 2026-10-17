// Pure Sushi logic: vocabulary, sorting, filtering, and "which plates are mine". No DOM, no
// network, no storage, so sushi/tests/run.mjs can test all of it in Node.

export const EFFORT = {
  small: { label: 'Small plate', range: 'about 5–10 min', order: 1 },
  medium: { label: 'Medium plate', range: 'about 10–25 min', order: 2 },
  large: { label: 'Large plate', range: 'about 25–60 min', order: 3 },
  boat: { label: 'Sushi boat', range: 'a project, 60+ min', order: 4 },
};

// The piece on the plate says what kind of work it is. Categories are data (the Sheet), so an
// unknown one still gets a plate.
export const CATEGORY_PIECE = {
  'Maintenance': '🍣',
  'Data Management': '🍙',
  'Post Production': '🍤',
  'Audio Capture': '🍥',
  'Video Capture': '🍡',
  'Live Sound': '🥟',
};
export const pieceFor = (category) => CATEGORY_PIECE[category] || '🍣';

export const WORK_MODES = [
  { value: 'MUS 248', label: 'MUS 248', hint: 'class participation' },
  { value: 'Student employee', label: 'Student employee', hint: 'paid hours' },
  { value: 'Other', label: 'Other', hint: 'staff, volunteer, anything else' },
];

const URGENCY_RANK = { urgent: 0, due_soon: 1, normal: 2 };

/** What a status means, in words, from where the viewer sits. Metaphor always comes with plain language. */
export function statusText(task, mine) {
  switch (task.status) {
    case 'available': return { short: 'On the belt', long: 'Available: nobody has taken it yet.', tone: 'available' };
    case 'claimed': return mine
      ? { short: 'At your table', long: 'You took this plate. Finish it, call the chef, or put it back.', tone: 'mine' }
      : { short: 'Taken', long: 'Someone is working on this one.', tone: 'taken' };
    case 'help_requested': return mine
      ? { short: 'Chef called', long: 'You asked Adam for help. It\'s still yours: carry on when you can.', tone: 'help' }
      : { short: 'Taken', long: 'Someone is working on this one.', tone: 'taken' };
    case 'submitted': return mine
      ? { short: 'Waiting for Adam', long: 'You finished it. Adam checks this kind of plate before it\'s cleared.', tone: 'waiting' }
      : { short: 'Being checked', long: 'Finished, and waiting for Adam to check it.', tone: 'taken' };
    case 'completed': return { short: 'Cleared', long: 'Done and cleared.', tone: 'done' };
    default: return { short: task.status, long: task.status, tone: 'taken' };
  }
}

/** "~15 min", "10–20 min", or the plate's general range when no estimate was given. */
export function minutesLabel(task) {
  const { minutes_min: min, minutes_max: max } = task;
  if (min && max && min !== max) return `${min}–${max} min`;
  if (min || max) return `~${min || max} min`;
  return (EFFORT[task.effort] || EFFORT.medium).range;
}

export function effortLabel(task) { return (EFFORT[task.effort] || EFFORT.medium).label; }

/** "Due today, 5:00 PM" · "Due tomorrow" · "Due Fri, Oct 23" · "Overdue since Oct 20" */
export function dueLabel(task, now = new Date(), locale = undefined) {
  if (!task.due_at) return '';
  const due = new Date(task.due_at);
  if (Number.isNaN(due.getTime())) return '';
  const day = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((day(due) - day(now)) / 86400000);
  const endOfDay = due.getHours() === 23 && due.getMinutes() === 59;
  const time = endOfDay ? '' : `, ${due.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' })}`;
  const date = due.toLocaleDateString(locale, { weekday: 'short', month: 'short', day: 'numeric' });
  if (due.getTime() < now.getTime()) return `Overdue since ${due.toLocaleDateString(locale, { month: 'short', day: 'numeric' })}`;
  if (days === 0) return `Due today${time}`;
  if (days === 1) return `Due tomorrow${time}`;
  return `Due ${date}${time}`;
}

export function isOverdue(task, now = new Date()) {
  return Boolean(task.due_at) && new Date(task.due_at).getTime() < now.getTime() && task.status !== 'completed';
}

/** Urgent first, then due soon, then the nearest due date, then the smallest plate. */
export function sortTasks(tasks) {
  return [...tasks].sort((a, b) => (URGENCY_RANK[a.urgency] ?? 2) - (URGENCY_RANK[b.urgency] ?? 2)
    || (a.due_at ? Date.parse(a.due_at) : Infinity) - (b.due_at ? Date.parse(b.due_at) : Infinity)
    || ((EFFORT[a.effort] || EFFORT.medium).order - (EFFORT[b.effort] || EFFORT.medium).order)
    || a.title.localeCompare(b.title));
}

export const DEFAULT_FILTERS = { show: 'all', location: 'all', category: 'all', effort: 'all', urgentOnly: false };

export function matchesFilters(task, filters) {
  const f = { ...DEFAULT_FILTERS, ...filters };
  if (f.location !== 'all' && task.location !== f.location) return false;
  if (f.category !== 'all' && task.category !== f.category) return false;
  if (f.effort !== 'all' && task.effort !== f.effort) return false;
  if (f.urgentOnly && task.urgency === 'normal') return false;
  return true;
}

export function activeFilterCount(filters) {
  const f = { ...DEFAULT_FILTERS, ...filters };
  return ['location', 'category', 'effort'].filter((k) => f[k] !== 'all').length + (f.urgentOnly ? 1 : 0);
}

/**
 * Splits the public feed for display. "Mine" is decided only by matching claim ids this browser
 * stored when it claimed. The feed never says who holds a plate.
 */
export function splitFeed(tasks, myClaimIds) {
  const mine = new Set(myClaimIds);
  const isMine = (t) => Boolean(t.claim_id) && mine.has(t.claim_id);
  return {
    mine: sortTasks(tasks.filter((t) => t.status !== 'completed' && t.status !== 'available' && isMine(t))),
    belt: sortTasks(tasks.filter((t) => t.status === 'available')),
    taken: sortTasks(tasks.filter((t) => ['claimed', 'help_requested', 'submitted'].includes(t.status) && !isMine(t))),
    cleared: tasks.filter((t) => t.status === 'completed'),
  };
}

/** Distinct values for a filter menu, in a stable order. */
export function optionsFor(tasks, field) {
  return [...new Set(tasks.map((t) => t[field]).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

/**
 * Brings this browser's remembered claims in line with the latest feed.
 *
 * claims: { [taskId]: { claim_id, claim_secret, title, at, pending } }
 * Returns the claims to keep, any plates that finished (for local history), and notices to show.
 * A pending claim (sent but not confirmed) is kept for a short grace period so a slow reply can
 * still land; after that, if the feed doesn't show it, it never happened.
 */
export function reconcileClaims(claims, tasks, now = Date.now(), graceMs = 120000) {
  const byId = new Map(tasks.map((t) => [t.id, t]));
  const keep = {};
  const finished = [];
  const notices = [];
  Object.entries(claims || {}).forEach(([taskId, claim]) => {
    const task = byId.get(taskId);
    const ours = task && task.claim_id && task.claim_id === claim.claim_id;
    if (ours && task.status === 'completed') {
      finished.push({ id: taskId, title: task.title, at: task.completed_at || new Date(now).toISOString() });
      if (claim.status === 'submitted') notices.push({ kind: 'verified', taskId, text: `Adam cleared “${task.title}”. Thanks!` });
      return;
    }
    if (ours) { keep[taskId] = { ...claim, pending: false, status: task.status }; return; }
    const young = now - Date.parse(claim.at || 0) < graceMs;
    if (claim.pending && young) { keep[taskId] = claim; return; }
    if (!claim.pending) {
      notices.push({ kind: 'lost', taskId, text: `“${claim.title}” is no longer on your table (Adam may have cleared or reopened it).` });
    }
  });
  return { claims: keep, finished, notices };
}

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/** Random claim secret: 32 bytes, base64url. Only ever stored in this browser and sent to the backend. */
export function newSecret() {
  const bytes = new Uint8Array(32);
  globalThis.crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function newId() { return globalThis.crypto.randomUUID(); }
