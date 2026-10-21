// The online refresher: a lecture's numbered questions, done on a phone the week after, handed in
// on Canvas as a "deliverable" (a readable summary plus a JSON receipt with a checksum, the same
// shape as camera-lab's Finish page).
//
// It's formative, not a test. Every question allows three tries; then the answer shows. Whether
// right, shown, or written, each question ends on its main point (the ✅ Answer line). Kinds:
//   multiple choice      pick until right; three wrong picks show the right one
//   fill in the blank    the answer is marked in the prompt, ==context window==, and typed
//                        answers are checked against it (case, punctuation, a plural s, and a
//                        leading "the" don't matter; ==repo|repository== accepts either)
//   short answer         written, not graded; submitting shows the main point
// It records tries, clicks, and active time per question, for the instructor to see where people
// got stuck. Nothing leaves the browser except what the student pastes into Canvas.

import { blankShown, escapeHtml, inline } from '../markdown.js';
import { parseActivity } from '../worksheet.js';
import { instructorView, isVisible, lectureView, numberSlides } from './view.js';

export const SCHEMA = 'mus248-refresher-v1';
export const MAX_TRIES = 3;
const IDLE_CAP_MS = 120000; // a gap longer than this counts as two minutes, not an hour away

const normalize = (text) => text.toLowerCase().normalize('NFKD').replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/^(the|a|an) /, '');
export const blankMatches = (typed, term) => {
  const said = normalize(typed);
  if (!said) return false;
  return term.split('|').some((answer) => {
    const want = normalize(answer);
    return said === want || said.replace(/s$/, '') === want.replace(/s$/, '');
  });
};

// The lecture's questions, numbered by the slides they sit on.
export const refresherQuestions = (markdown) => parseActivity(numberSlides(lectureView(markdown))).questions;

// The refresher is for remembering, not for right after class: by default it opens at 7:00 AM
// Pacific on the Monday a week after the lecture (its date + 7 days, so about 12 hours short of a
// full week after a 7 PM class). `refresherOpens` on the lecture in data/lectures.json (an ISO time
// with its offset) overrides that. A lecture with no date opens right away. Instructor view always
// opens it, to look ahead.
export function refresherOpensAt(lecture) {
  if (lecture.refresherOpens) return new Date(lecture.refresherOpens);
  if (!lecture.date) return null;
  const day = new Date(`${lecture.date}T12:00:00Z`);
  day.setUTCDate(day.getUTCDate() + 7);
  const ymd = day.toISOString().slice(0, 10);
  // 7:00 AM in Los Angeles, whichever of PDT or PST that day is in.
  const hourThere = (at) => Number(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', hourCycle: 'h23' }).format(at));
  const daylight = new Date(`${ymd}T07:00:00-07:00`);
  return hourThere(daylight) === 7 ? daylight : new Date(`${ymd}T07:00:00-08:00`);
}
export const refresherOpen = (lecture, now = Date.now()) => { const at = refresherOpensAt(lecture); return !at || now >= at.getTime(); };
export const opensLabel = (lecture) => refresherOpensAt(lecture)?.toLocaleString('en-US', { timeZone: 'America/Los_Angeles', weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

export const mainPoint = (question) => (question.note || '').replace(/^[a-z]\)\s*/i, '');

export async function sha256Hex(text) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

// The deliverable: a summary to read, then the receipt to keep. Exported so the checker can prove
// its shape without a browser.
export function deliverable(lecture, questions, state, feedback = '') {
  const items = questions.map((question) => {
    const item = state.items[question.number] || {};
    const answer = question.options.length
      ? (item.picked || []).join(', ')
      : (question.terms.length ? (item.values || []).join(' / ') : (item.text || ''));
    return {
      q: question.number,
      type: question.type,
      slide: question.section || '',
      status: item.status || 'skipped',
      tries: item.tries || 0,
      clicks: item.clicks || 0,
      seconds: Math.round((item.ms || 0) / 1000),
      answer,
    };
  });
  const done = items.filter((item) => item.status !== 'skipped').length;
  const firstTry = items.filter((item) => item.status === 'right' && item.tries === 0).length;
  const minutes = Math.round((items.reduce((sum, item) => sum + item.seconds, 0) / 60) * 10) / 10;
  const describe = (item) => {
    if (item.status === 'skipped') return 'skipped';
    if (item.status === 'answered') return `answered: "${item.answer}"`;
    if (item.status === 'revealed') return `answer shown after ${item.tries} tries`;
    return item.tries ? `right after ${item.tries} miss${item.tries > 1 ? 'es' : ''}` : 'right on the first try';
  };
  const lines = [
    `MUS 248 online refresher: ${lecture.title}`,
    `Done ${done} of ${items.length} · right on the first try: ${firstTry} · about ${minutes} min`,
    ...items.map((item) => `Q${item.q} (${item.type}): ${describe(item)} · ${item.clicks} click${item.clicks === 1 ? '' : 's'} · ${item.seconds}s`),
    ...(feedback.trim() ? [`Feedback: ${feedback.trim()}`] : []),
  ];
  const payload = {
    schema: SCHEMA,
    lecture: { id: lecture.id, title: lecture.title },
    sessionId: state.sessionId,
    startedAt: state.startedAt,
    generatedAt: new Date().toISOString(),
    done,
    total: items.length,
    firstTry,
    activeMinutes: minutes,
    items,
    feedback: feedback.trim(),
  };
  return { lines, payload };
}

const storageKey = (id) => `mus248:refresher:${id}`;
const freshState = () => ({
  sessionId: (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2)),
  startedAt: new Date().toISOString(),
  items: {},
  feedback: '',
});
const load = (id) => {
  try { return JSON.parse(window.localStorage.getItem(storageKey(id))) || freshState(); } catch { return freshState(); }
};
const save = (id, state) => {
  try { window.localStorage.setItem(storageKey(id), JSON.stringify(state)); } catch { /* keep going without it */ }
};

function card(question, item = {}) {
  const status = item.status;
  const tries = item.tries || 0;
  const left = MAX_TRIES - tries;
  const point = mainPoint(question);
  const pointHtml = point ? `<p class="fill-point"><b>The main point:</b> ${inline(point)}</p>` : '';
  let prompt;
  let body = '';
  if (question.options.length) {
    prompt = inline(question.prompt);
    const picked = item.picked || [];
    body = `<div class="fill-options">${question.options.map((option) => {
      const shown = status && option.correct;
      const wrong = picked.includes(option.letter) && !option.correct;
      return `<button type="button" class="fill-option${shown ? ' right' : ''}${wrong ? ' wrong' : ''}" data-letter="${escapeHtml(option.letter)}"${status || wrong ? ' disabled' : ''}>`
        + `<b>${escapeHtml(option.letter)})</b> ${inline(option.text)}</button>`;
    }).join('')}</div>`;
    if (status === 'right') body += `<p class="fill-feedback right">✅ ${tries ? 'Yes, that one.' : 'Yes, first try.'}</p>${pointHtml}`;
    else if (status === 'revealed') body += `<p class="fill-feedback shown">That's three tries, so here's the answer.</p>${pointHtml}`;
    else if (tries) body += `<p class="fill-feedback wrong">Not that one. ${left} ${left === 1 ? 'try' : 'tries'} left.</p>`;
  } else if (question.terms.length) {
    const values = item.values || [];
    let at = -1;
    prompt = inline(question.prompt, { blanks: 'blank' }).replace(/<span class="note-blank"[^>]*><\/span>/g, () => {
      at += 1;
      const term = question.terms[at];
      if (status) return `<mark class="fill-term${status === 'revealed' ? ' revealed' : ''}">${escapeHtml(status === 'revealed' ? blankShown(term) : values[at] || blankShown(term))}</mark>`;
      const missed = tries && !blankMatches(values[at] || '', term);
      return `<input class="fill-input${missed ? ' missed' : ''}" data-at="${at}" value="${escapeHtml(values[at] || '')}" size="${Math.max(6, blankShown(term).length)}"`
        + ' autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Your answer">';
    });
    if (status === 'right') body = `<p class="fill-feedback right">✅ ${tries ? 'Yes, you got it.' : 'Yes, first try.'}</p>${pointHtml}`;
    else if (status === 'revealed') body = `<p class="fill-feedback shown">That's three tries, so here's the answer.</p>${pointHtml}`;
    else body = `${tries ? `<p class="fill-feedback wrong">Not quite. ${left} ${left === 1 ? 'try' : 'tries'} left.</p>` : ''}<button type="button" class="fill-check">Check</button>`;
  } else {
    prompt = inline(question.prompt);
    body = status
      ? `<p class="fill-yours">You wrote: ${escapeHtml(item.text || '')}</p>${pointHtml}`
      : `<textarea class="fill-text" rows="3" placeholder="Your answer">${escapeHtml(item.text || '')}</textarea><button type="button" class="fill-check">Done</button>`;
  }
  return `<li class="fill-card${status ? ' done' : ''}" id="q${question.number}" data-number="${question.number}">`
    + `${question.section ? `<em class="fill-where">${escapeHtml(question.section)}</em>` : ''}`
    + `<p class="fill-prompt"><span class="q-number">Q${question.number}</span> ${prompt}</p>${body}</li>`;
}

export async function mountRefresher(root) {
  const id = new URLSearchParams(window.location.search).get('id') || '';
  const instructor = instructorView();
  const lectures = await fetch('../../data/lectures.json').then((response) => response.json());
  const lecture = lectures.find((item) => item.id === id && item.contentFile && (instructor || isVisible(item)));
  if (!lecture) throw new Error(`No lecture ${id}`);
  const markdown = await fetch(`../../content/lectures/${lecture.contentFile}.md`).then((response) => {
    if (!response.ok) throw new Error(`No Markdown for ${id}`);
    return response.text();
  });
  const questions = refresherQuestions(markdown);
  if (!questions.length) throw new Error(`No refresher for ${id}`);
  // "refresherDraft": true in data/lectures.json: the questions are still being written.
  if (!instructor && (lecture.refresherDraft || !refresherOpen(lecture))) {
    const when = lecture.refresherDraft
      ? 'The online refresher for this lecture is still being written.'
      : `The online refresher opens <b>${escapeHtml(opensLabel(lecture))}</b> (Pacific time). It's for remembering, so it waits about a week after the lecture.`;
    root.innerHTML = `<a class="back" href="../${escapeHtml(lecture.id)}/">← ${escapeHtml(lecture.title)}</a>
      <header class="activity-header"><span aria-hidden="true">🔁</span><div><h1>${escapeHtml(lecture.title)}</h1>
        <p>${when}</p></div></header>`;
    return;
  }
  const state = load(id);
  state.items = state.items || {};
  document.title = `${lecture.title} · online refresher · MUS 248`;

  // Active time: the gap since the last interaction is credited to the question last touched,
  // while the page is visible, capped so a phone left on a table doesn't count as study time.
  let active = null;
  let lastTick = performance.now();
  const tick = () => {
    const now = performance.now();
    if (active && document.visibilityState === 'visible') {
      const item = state.items[active] || (state.items[active] = {});
      item.ms = (item.ms || 0) + Math.min(now - lastTick, IDLE_CAP_MS);
    }
    lastTick = now;
  };
  document.addEventListener('visibilitychange', () => { tick(); save(id, state); });
  const touch = (number) => {
    tick();
    active = number;
    const item = state.items[number] || (state.items[number] = {});
    item.clicks = (item.clicks || 0) + 1;
    return item;
  };

  const render = (focus) => {
    const done = questions.filter((question) => state.items[question.number]?.status).length;
    root.innerHTML = `
      <a class="back" href="../${escapeHtml(lecture.id)}/">← ${escapeHtml(lecture.title)}</a>
      <header class="activity-header"><span aria-hidden="true">🔁</span><div><h1>${escapeHtml(lecture.title)}</h1>
        ${instructor && lecture.refresherDraft ? '<p class="instructor-banner">🧑‍🏫 Instructor view: this refresher is marked <code>refresherDraft</code>, so students can\'t open it yet. Remove that from data/lectures.json when it\'s ready.</p>' : ''}
        ${instructor && !refresherOpen(lecture) ? `<p class="instructor-banner">🧑‍🏫 Instructor view: students can open this from ${escapeHtml(opensLabel(lecture))}.</p>` : ''}
        <p>Online refresher · ${done} of ${questions.length} done. Three tries each, then the answer shows. When you're
          finished, copy the Canvas deliverable at the bottom.</p></div></header>
      <ol class="fill-list">${questions.map((question) => card(question, state.items[question.number])).join('')}</ol>
      <section class="fill-done">
        <label class="fill-feedback-label" for="refresher-feedback">Anything confusing in the lecture or this refresher? <span class="quiet">(optional)</span></label>
        <textarea id="refresher-feedback" class="fill-text" rows="2">${escapeHtml(state.feedback || '')}</textarea>
        <div class="refresher-warning" hidden></div>
        <p><button type="button" class="fill-copy">📋 Copy Canvas deliverable</button> <button type="button" class="fill-reset">Start over</button></p>
        <p class="copy-status quiet" aria-live="polite"></p>
        <pre class="refresher-receipt" hidden></pre>
      </section>`;
    bind();
    if (focus) {
      const target = root.querySelector(focus);
      if (target) { target.scrollIntoView({ block: 'nearest' }); const input = target.querySelector('.fill-input, .fill-text'); if (input) input.focus({ preventScroll: true }); }
    }
  };

  // Finishing a question moves you (and the clock) on to the next one still open, so reading time
  // counts toward the question being read.
  const next = (number) => {
    const later = questions.find((question) => question.number > number && !state.items[question.number]?.status);
    tick();
    active = later ? later.number : null;
    return later ? `#q${later.number}` : `#q${number}`;
  };

  const copyDeliverable = async () => {
    tick();
    state.feedback = root.querySelector('#refresher-feedback').value;
    save(id, state);
    const { lines, payload } = deliverable(lecture, questions, state, state.feedback);
    const final = { ...payload, checksum: `sha256:${await sha256Hex(JSON.stringify(payload))}` };
    const text = `${lines.join('\n')}\n\n${JSON.stringify(final, null, 2)}`;
    const receipt = root.querySelector('.refresher-receipt');
    const status = root.querySelector('.copy-status');
    receipt.textContent = text;
    receipt.hidden = false;
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = 'Copied. Paste it into the Canvas assignment.';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(receipt);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      status.textContent = 'Couldn\'t copy automatically: the text is selected, so press Copy (or Cmd/Ctrl+C).';
    }
  };

  function bind() {
    root.querySelectorAll('.fill-card').forEach((element) => {
      const number = Number(element.dataset.number);
      const question = questions.find((item) => item.number === number);
      element.querySelectorAll('.fill-option').forEach((button) => button.addEventListener('click', () => {
        const item = touch(number);
        const option = question.options.find((choice) => choice.letter === button.dataset.letter);
        item.picked = [...(item.picked || []), option.letter];
        if (option.correct) item.status = 'right';
        else {
          item.tries = (item.tries || 0) + 1;
          if (item.tries >= MAX_TRIES) item.status = 'revealed';
        }
        save(id, state);
        render(item.status ? next(number) : `#q${number}`);
      }));
      const inputs = [...element.querySelectorAll('.fill-input')];
      inputs.forEach((input) => {
        input.addEventListener('focus', () => { tick(); active = number; });
        input.addEventListener('input', () => {
          const item = state.items[number] || (state.items[number] = {});
          item.values = item.values || [];
          item.values[Number(input.dataset.at)] = input.value;
          save(id, state);
        });
        input.addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); element.querySelector('.fill-check').click(); } });
      });
      const text = element.querySelector('.fill-text');
      if (text) {
        text.addEventListener('focus', () => { tick(); active = number; });
        text.addEventListener('input', () => { (state.items[number] || (state.items[number] = {})).text = text.value; save(id, state); });
      }
      const check = element.querySelector('.fill-check');
      if (!check) return;
      check.addEventListener('click', () => {
        if (text) {
          if (!text.value.trim()) { text.focus(); return; }
          const item = touch(number);
          item.text = text.value.trim();
          item.status = 'answered';
        } else {
          const values = inputs.map((input) => input.value.trim());
          if (values.every((value) => !value)) { if (inputs[0]) inputs[0].focus(); return; }
          const item = touch(number);
          item.values = values;
          if (question.terms.every((term, at) => blankMatches(values[at] || '', term))) item.status = 'right';
          else {
            item.tries = (item.tries || 0) + 1;
            if (item.tries >= MAX_TRIES) item.status = 'revealed';
          }
        }
        save(id, state);
        render(state.items[number].status ? next(number) : `#q${number}`);
      });
    });

    root.querySelector('#refresher-feedback').addEventListener('input', (event) => { state.feedback = event.target.value; save(id, state); });

    // Nothing has to be finished to hand it in, but nothing gets skipped by accident either.
    root.querySelector('.fill-copy').addEventListener('click', () => {
      const missing = questions.filter((question) => !state.items[question.number]?.status);
      const warning = root.querySelector('.refresher-warning');
      if (!missing.length || warning.dataset.confirmed === 'true') { copyDeliverable(); return; }
      const list = missing.map((question) => `Q${question.number}`).join(', ');
      warning.hidden = false;
      warning.innerHTML = `<p>Oops: you haven't finished ${missing.length === 1 ? 'one question' : `${missing.length} questions`} (${list}).</p>`
        + `<p><button type="button" data-go-back>Go back to Q${missing[0].number}</button> <button type="button" data-anyway>Copy it anyway</button></p>`;
      warning.querySelector('[data-go-back]').addEventListener('click', () => {
        warning.hidden = true;
        const target = root.querySelector(`#q${missing[0].number}`);
        target.scrollIntoView({ block: 'center' });
        const input = target.querySelector('.fill-input, .fill-text, .fill-option:not([disabled])');
        if (input) input.focus({ preventScroll: true });
      });
      warning.querySelector('[data-anyway]').addEventListener('click', () => { warning.dataset.confirmed = 'true'; warning.hidden = true; copyDeliverable(); });
    });
    root.querySelector('.fill-reset').addEventListener('click', () => {
      if (!window.confirm('Clear your answers and start over? Your tries and time start over too.')) return;
      Object.assign(state, freshState());
      save(id, state);
      render();
    });
  }

  render();
}
