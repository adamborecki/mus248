// Fill in a lecture online: the follow-along blanks and the numbered questions, in lecture order,
// answered on a phone, with a completion code to paste into Canvas at the end.
//
// It's practice, not a test. A blank is checked against the ==term== it came from (case and
// punctuation don't matter); a miss says "not quite", and a second miss shows the answer. A wrong
// multiple-choice pick says "not that one" and lets you try again; the explanation shows once you
// find the right one. Written answers aren't auto-graded — you commit to an answer, then see the
// model one. Nothing leaves the device except what the student copies into Canvas themselves;
// progress is kept in this browser so a reload loses nothing.

import { blankTerms, escapeHtml, inline, isFence, joinWrappedLines } from '../markdown.js';
import { parseActivity } from '../worksheet.js';
import { instructorView, isVisible, lectureView } from './view.js';

const BLANK = /_{3,}/g;
const storageKey = (id) => `mus248:fill:${id}`;

const load = (id) => {
  try { return JSON.parse(window.localStorage.getItem(storageKey(id))) || {}; } catch { return {}; }
};
const save = (id, state) => {
  try { window.localStorage.setItem(storageKey(id), JSON.stringify(state)); } catch { /* keep going without it */ }
};

// The completion code says which lecture and how many items (blanks and multiple-choice
// questions) were right on the first try, plus four check characters. It's an honor-system code
// for a practice assignment — the check stops typos and casual guessing, not a determined student
// reading this file.
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export function checkChars(text) {
  let hash = 2166136261;
  for (const character of text) { hash ^= character.codePointAt(0); hash = Math.imul(hash, 16777619) >>> 0; }
  let out = '';
  for (let index = 0; index < 4; index += 1) { out += ALPHABET[hash % ALPHABET.length]; hash = Math.floor(hash / ALPHABET.length); }
  return out;
}
export const lectureTag = (lecture) => (lecture.lecture ? `L${String(lecture.lecture).padStart(2, '0')}` : lecture.id.replace(/[^a-z0-9]/gi, '').slice(-6).toUpperCase());
export const completionCode = (lecture, firstTry, total) => {
  const body = `M248-${lectureTag(lecture)}-${firstTry}of${total}`;
  return `${body}-${checkChars(`${lecture.id}|${body}`)}`;
};

// Blanks: every line of the student view with a ==term== in it (outside the 🌀 portals) is one
// card, labeled with the slide it's on. `order` is the line index in the same wrap-joined lines
// parseActivity numbers questions by, so the two interleave in lecture order.
export function blankLines(markdown) {
  const items = [];
  let where = '';
  let inPortal = false;
  let fenced = false;
  joinWrappedLines(lectureView(markdown)).split('\n').forEach((line, order) => {
    if (isFence(line)) { fenced = !fenced; return; }
    if (fenced) return;
    const heading = line.match(/^#{2,4}\s+(.+)$/);
    if (heading) { where = heading[1].replace(/^[^\p{L}\p{N}]+/u, '').trim(); return; }
    if (inPortal && line.trimStart().startsWith('>')) return;
    inPortal = /^>\s*🌀/u.test(line.trimStart());
    if (inPortal) return;
    const terms = blankTerms(line);
    if (!terms.length) return;
    items.push({ key: `b${items.length + 1}`, order, where, line: line.replace(/^\s*(?:[-*]|\d+\.)\s+/, '').replace(/^>\s*/, ''), terms });
  });
  return items;
}
const normalize = (text) => text.toLowerCase().normalize('NFKD').replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/^(the|a|an) /, '');
export const blankMatches = (typed, answer) => {
  const said = normalize(typed);
  const want = normalize(answer);
  return Boolean(said) && (said === want || said.replace(/s$/, '') === want.replace(/s$/, ''));
};

function blankCard(blank, answer = {}) {
  const terms = answer.terms || [];
  const done = blank.terms.every((term, at) => terms[at]?.done);
  let at = -1;
  const body = inline(blank.line, { blanks: 'blank' }).replace(/<span class="note-blank"[^>]*><\/span>/g, () => {
    at += 1;
    const term = terms[at] || {};
    if (term.done) return `<mark class="fill-term${term.revealed ? ' revealed' : ''}">${escapeHtml(term.revealed ? blank.terms[at] : term.value)}</mark>`;
    return `<input class="fill-input${term.tries ? ' missed' : ''}" data-at="${at}" value="${escapeHtml(term.value || '')}" `
      + `size="${Math.max(6, blank.terms[at].length)}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Blank ${at + 1}">`;
  });
  const missed = terms.some((term) => term && term.tries && !term.done);
  return `<li class="fill-card fill-blanks${done ? ' done' : ''}" data-blank="${blank.key}">`
    + `${blank.where ? `<em class="fill-where">${escapeHtml(blank.where)}</em>` : ''}`
    + `<p class="fill-line">${body}</p>`
    + (done ? `<p class="fill-feedback right">✅ ${terms.every((term) => term.tries === 0) ? 'All right, first try.' : 'Done.'}</p>`
      : `${missed ? '<p class="fill-feedback wrong">Not quite. Check the slide and try again; a second miss shows the answer.</p>' : ''}<button type="button" class="fill-check">Check</button>`)
    + '</li>';
}

function questionCard(question, answer) {
  const done = Boolean(answer && answer.done);
  const prompt = inline(question.prompt).replace(BLANK, '<span class="fill-blank"></span>');
  let body;
  if (question.options.length) {
    const tried = (answer && answer.tried) || [];
    body = `<div class="fill-options">${question.options.map((option) => {
      const state = done && option.correct ? ' right' : (tried.includes(option.letter) ? ' wrong' : '');
      return `<button type="button" class="fill-option${state}" data-letter="${escapeHtml(option.letter)}"${done || tried.includes(option.letter) ? ' disabled' : ''}>`
        + `<b>${escapeHtml(option.letter)})</b> ${inline(option.text)}</button>`;
    }).join('')}</div>`;
    const last = tried[tried.length - 1];
    const lastWrong = !done && last && !question.options.find((option) => option.letter === last).correct;
    body += done
      ? `<p class="fill-feedback right">✅ ${tried.length === 1 ? 'Yes, first try.' : 'Yes, that one.'}${question.note ? ` ${inline(question.note.replace(/^[a-z]\)\s*/i, ''))}` : ''}</p>`
      : (lastWrong ? '<p class="fill-feedback wrong">Oops, not that one. Try another.</p>' : '');
  } else {
    const value = (answer && answer.text) || '';
    body = done
      ? `<p class="fill-yours">You wrote: ${escapeHtml(value)}</p><p class="fill-feedback right">✅ ${inline(question.answer || '')}</p>`
      : `<textarea class="fill-text" rows="${question.type === 'short answer' ? 3 : 1}" placeholder="Your answer">${escapeHtml(value)}</textarea>`
        + '<button type="button" class="fill-check">Check my answer</button>';
  }
  return `<li class="fill-card${done ? ' done' : ''}" data-number="${question.number}">`
    + `${question.section ? `<em class="fill-where">${escapeHtml(question.section)}</em>` : ''}`
    + `<p class="fill-prompt"><span class="q-number">Q${question.number}</span> ${prompt}</p>${body}</li>`;
}

export async function mountFill(root) {
  const id = new URLSearchParams(window.location.search).get('id') || '';
  const instructor = instructorView();
  const lectures = await fetch('../../data/lectures.json').then((response) => response.json());
  const lecture = lectures.find((item) => item.id === id && item.contentFile && (instructor || isVisible(item)));
  if (!lecture) throw new Error(`No lecture ${id}`);
  const markdown = await fetch(`../../content/lectures/${lecture.contentFile}.md`).then((response) => {
    if (!response.ok) throw new Error(`No Markdown for ${id}`);
    return response.text();
  });
  const { questions } = parseActivity(lectureView(markdown));
  const blanks = blankLines(markdown);
  if (!questions.length && !blanks.length) throw new Error(`Nothing to fill in for ${id}`);
  const items = [
    ...blanks.map((blank) => ({ order: blank.order, blank })),
    ...questions.map((question) => ({ order: question.order, question })),
  ].sort((a, b) => a.order - b.order);
  const state = load(id);
  document.title = `${lecture.title} · fill in · MUS 248`;

  const choice = questions.filter((question) => question.options.length);
  const blankDone = (blank) => blank.terms.every((term, at) => state[blank.key]?.terms?.[at]?.done);
  const total = choice.length + blanks.reduce((sum, blank) => sum + blank.terms.length, 0);
  const firstTry = () => choice.filter((question) => state[question.number]?.done && state[question.number].tried?.length === 1).length
    + blanks.reduce((sum, blank) => sum + (state[blank.key]?.terms || []).filter((term) => term?.done && term.tries === 0).length, 0);
  const code = () => completionCode(lecture, firstTry(), total);

  const render = () => {
    const answered = questions.filter((question) => state[question.number]?.done).length + blanks.filter(blankDone).length;
    const finished = answered === questions.length + blanks.length;
    root.innerHTML = `
      <a class="back" href="../${escapeHtml(lecture.id)}/">← ${escapeHtml(lecture.title)}</a>
      <header class="activity-header"><span aria-hidden="true">✍️</span><div><h1>${escapeHtml(lecture.title)}</h1>
        <p>Fill in each blank from the slides, and answer the questions. A miss just says "not quite," so try again. ${answered} of ${questions.length + blanks.length} done.</p></div></header>
      <ol class="fill-list">${items.map((item) => (item.blank ? blankCard(item.blank, state[item.blank.key]) : questionCard(item.question, state[item.question.number]))).join('')}</ol>
      ${finished ? `<section class="fill-done"><h2>🎉 Done</h2>
        <p>Your completion code: <strong class="fill-code">${escapeHtml(code())}</strong></p>
        <p>Paste it into the Canvas assignment. <b>Copy for Canvas</b> copies the code and your answers together.</p>
        <p><button type="button" class="fill-copy">Copy for Canvas</button> <button type="button" class="fill-reset">Start over</button></p></section>`
        : '<p class="quiet">Finish every card to get your completion code.</p>'}
      ${instructor ? `<section class="fill-verify"><h2>🧑‍🏫 Check a code</h2><p><input class="fill-verify-input" placeholder="M248-…" autocomplete="off"> <span class="fill-verify-result"></span></p></section>` : ''}`;
    bind();
  };

  const report = () => {
    const lines = items.map((item) => {
      if (item.blank) {
        const terms = state[item.blank.key]?.terms || [];
        return `Blank ${item.blank.key.slice(1)}: ${item.blank.terms.map((term, at) => (terms[at]?.revealed ? `(shown: ${term})` : terms[at]?.value || '')).join(' / ')}`;
      }
      const { question } = item;
      const answer = state[question.number] || {};
      if (question.options.length) return `Q${question.number}: ${answer.tried?.length === 1 ? 'first try' : `${answer.tried?.length || 0} tries`}`;
      return `Q${question.number}: ${answer.text || ''}`;
    });
    return [`MUS 248 · ${lecture.title}`, `Completion code: ${code()}`, '', ...lines].join('\n');
  };

  const refocus = (selector) => {
    const card = root.querySelector(selector);
    if (!card) return;
    card.scrollIntoView({ block: 'nearest' });
    const next = card.querySelector('.fill-input');
    if (next) next.focus({ preventScroll: true });
  };

  function bind() {
    root.querySelectorAll('.fill-card[data-blank]').forEach((card) => {
      const blank = blanks.find((item) => item.key === card.dataset.blank);
      const answer = state[blank.key] || { terms: [] };
      const inputs = [...card.querySelectorAll('.fill-input')];
      inputs.forEach((input) => {
        input.addEventListener('input', () => {
          const at = Number(input.dataset.at);
          answer.terms[at] = { ...(answer.terms[at] || { tries: 0 }), value: input.value };
          state[blank.key] = answer;
          save(id, state);
        });
        input.addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); card.querySelector('.fill-check').click(); } });
      });
      const check = card.querySelector('.fill-check');
      if (!check) return;
      check.addEventListener('click', () => {
        if (inputs.every((input) => !input.value.trim())) { if (inputs[0]) inputs[0].focus(); return; }
        inputs.forEach((input) => {
          const at = Number(input.dataset.at);
          const term = answer.terms[at] || { tries: 0 };
          term.value = input.value.trim();
          if (!term.value) { answer.terms[at] = term; return; }
          if (blankMatches(term.value, blank.terms[at])) term.done = true;
          else {
            term.tries = (term.tries || 0) + 1;
            if (term.tries >= 2) { term.done = true; term.revealed = true; }
          }
          answer.terms[at] = term;
        });
        state[blank.key] = answer;
        save(id, state);
        render();
        refocus(`.fill-card[data-blank="${blank.key}"]${blankDone(blank) ? ' ~ .fill-card:not(.done)' : ''}`);
      });
    });
    root.querySelectorAll('.fill-card[data-number]').forEach((card) => {
      const number = Number(card.dataset.number);
      const question = questions.find((item) => item.number === number);
      card.querySelectorAll('.fill-option').forEach((button) => button.addEventListener('click', () => {
        const answer = state[number] || { tried: [] };
        answer.tried = [...(answer.tried || []), button.dataset.letter];
        answer.done = Boolean(question.options.find((option) => option.letter === button.dataset.letter).correct);
        state[number] = answer;
        save(id, state);
        render();
        refocus(`.fill-card[data-number="${number}"]`);
      }));
      const check = card.querySelector('.fill-check');
      const text = card.querySelector('.fill-text');
      if (check && text) {
        text.addEventListener('input', () => { state[number] = { text: text.value }; save(id, state); });
        check.addEventListener('click', () => {
          if (!text.value.trim()) { text.focus(); return; }
          state[number] = { text: text.value.trim(), done: true };
          save(id, state);
          render();
          refocus(`.fill-card[data-number="${number}"]`);
        });
      }
    });
    const copy = root.querySelector('.fill-copy');
    if (copy) {
      copy.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(report()); copy.textContent = 'Copied ✓'; } catch { window.prompt('Copy this into Canvas:', report()); }
      });
    }
    const reset = root.querySelector('.fill-reset');
    if (reset) {
      reset.addEventListener('click', () => {
        if (!window.confirm('Clear your answers and start over?')) return;
        Object.keys(state).forEach((key) => delete state[key]);
        save(id, state);
        render();
      });
    }
    const verify = root.querySelector('.fill-verify-input');
    if (verify) {
      verify.addEventListener('input', () => {
        const match = verify.value.trim().toUpperCase().match(/^(M248-[A-Z0-9]+-\d+OF\d+)-([A-Z0-9]{4})$/);
        const body = match && match[1].replace('OF', 'of');
        const ok = match && lectures.some((item) => item.contentFile && body.startsWith(`M248-${lectureTag(item)}-`) && checkChars(`${item.id}|${body}`) === match[2]);
        root.querySelector('.fill-verify-result').textContent = !verify.value.trim() ? '' : (ok ? '✅ valid' : '❌ not a valid code');
      });
    }
  }

  render();
}
