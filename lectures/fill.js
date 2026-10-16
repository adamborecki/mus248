// Fill in a lecture online: the same questions as the printed worksheet, answered on a phone, with
// a completion code to paste into Canvas at the end.
//
// It's practice, not a test. A wrong multiple-choice pick says "not that one" and lets you try
// again; the explanation shows once you find the right one. Written answers aren't auto-graded —
// you commit to an answer, then see the model one. Nothing leaves the device except what the
// student copies into Canvas themselves; progress is kept in this browser so a reload loses
// nothing.

import { escapeHtml, inline } from '../markdown.js';
import { parseActivity } from '../worksheet.js';
import { instructorView, lectureView } from './view.js';

const BLANK = /_{3,}/g;
const storageKey = (id) => `mus248:fill:${id}`;

const load = (id) => {
  try { return JSON.parse(window.localStorage.getItem(storageKey(id))) || {}; } catch { return {}; }
};
const save = (id, state) => {
  try { window.localStorage.setItem(storageKey(id), JSON.stringify(state)); } catch { /* keep going without it */ }
};

// The completion code says which lecture and how many multiple-choice questions were right on the
// first try, plus four check characters. It's an honor-system code for a practice assignment — the
// check stops typos and casual guessing, not a determined student reading this file.
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
  const lecture = lectures.find((item) => item.id === id && item.contentFile);
  if (!lecture) throw new Error(`No lecture ${id}`);
  const markdown = await fetch(`../../content/lectures/${lecture.contentFile}.md`).then((response) => {
    if (!response.ok) throw new Error(`No Markdown for ${id}`);
    return response.text();
  });
  const { questions } = parseActivity(lectureView(markdown));
  const state = load(id);
  document.title = `${lecture.title} · fill in · MUS 248`;

  const choice = questions.filter((question) => question.options.length);
  const code = () => completionCode(lecture,
    choice.filter((question) => state[question.number]?.done && state[question.number].tried?.length === 1).length, choice.length);

  const render = () => {
    const answered = questions.filter((question) => state[question.number] && state[question.number].done).length;
    const finished = answered === questions.length;
    root.innerHTML = `
      <a class="back" href="../${escapeHtml(lecture.id)}/">← ${escapeHtml(lecture.title)}</a>
      <header class="activity-header"><span aria-hidden="true">✍️</span><div><h1>${escapeHtml(lecture.title)}</h1>
        <p>Fill it in. Wrong picks just say "not that one," so try again. ${answered} of ${questions.length} done.</p></div></header>
      <ol class="fill-list">${questions.map((question) => questionCard(question, state[question.number])).join('')}</ol>
      ${finished ? `<section class="fill-done"><h2>🎉 Done</h2>
        <p>Your completion code: <strong class="fill-code">${escapeHtml(code())}</strong></p>
        <p>Paste it into the Canvas assignment. <b>Copy for Canvas</b> copies the code and your answers together.</p>
        <p><button type="button" class="fill-copy">Copy for Canvas</button> <button type="button" class="fill-reset">Start over</button></p></section>`
        : '<p class="quiet">Answer every question to get your completion code.</p>'}
      ${instructor ? `<section class="fill-verify"><h2>🧑‍🏫 Check a code</h2><p><input class="fill-verify-input" placeholder="M248-…" autocomplete="off"> <span class="fill-verify-result"></span></p></section>` : ''}`;
    bind();
  };

  const report = () => {
    const lines = questions.map((question) => {
      const answer = state[question.number] || {};
      if (question.options.length) return `Q${question.number}: ${answer.tried?.length === 1 ? 'first try' : `${answer.tried?.length || 0} tries`}`;
      return `Q${question.number}: ${answer.text || ''}`;
    });
    return [`MUS 248 · ${lecture.title}`, `Completion code: ${code()}`, '', ...lines].join('\n');
  };

  function bind() {
    root.querySelectorAll('.fill-card').forEach((card) => {
      const number = Number(card.dataset.number);
      const question = questions.find((item) => item.number === number);
      card.querySelectorAll('.fill-option').forEach((button) => button.addEventListener('click', () => {
        const answer = state[number] || { tried: [] };
        answer.tried = [...(answer.tried || []), button.dataset.letter];
        answer.done = Boolean(question.options.find((option) => option.letter === button.dataset.letter).correct);
        state[number] = answer;
        save(id, state);
        render();
        root.querySelector(`.fill-card[data-number="${number}"]`).scrollIntoView({ block: 'nearest' });
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
          root.querySelector(`.fill-card[data-number="${number}"]`).scrollIntoView({ block: 'nearest' });
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
