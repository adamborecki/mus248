// Follow-along notes: the lecture itself, printed, with every ==term== turned into a blank to fill
// in while the slides (which highlight the term) are up. The key prints the same page filled in.
//
// It's the lecture's text as students see it (no 🙈 slides, no 🧑‍🏫 notes, no numbered questions,
// which are the online refresher's), minus the 🌀 portals, which are for exploring on a screen.

import { blankTerms, escapeHtml, isFence, renderMarkdown } from '../markdown.js';
import { renderFormBlock, renderQr } from '../worksheet.js';
import { LECTURE_FORM_NOTE } from '../feedback.js';
import { instructorView, isVisible } from './view.js';
import { lectureText } from './text.js';

export function notesMarkdown(markdown) {
  const kept = [];
  let inPortal = false;
  lectureText(markdown).split('\n').forEach((line) => {
    if (inPortal && line.trimStart().startsWith('>')) return;
    inPortal = false;
    if (/^>\s*🌀/u.test(line.trimStart())) { inPortal = true; return; }
    kept.push(line);
  });
  return kept.join('\n');
}

// Every blank on the notes, in order. A ==term== inside a ``` code block is being shown, not asked.
export function notesBlanks(markdown) {
  const terms = [];
  let fenced = false;
  notesMarkdown(markdown).split('\n').forEach((line) => {
    if (isFence(line)) { fenced = !fenced; return; }
    if (!fenced) terms.push(...blankTerms(line));
  });
  return terms;
}
export const hasBlanks = (markdown) => notesBlanks(markdown).length > 0;

export function renderNotes(markdown, lecture, { key = false } = {}) {
  const date = lecture.date
    ? new Date(`${lecture.date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    : '';
  const meta = [lecture.lecture ? `Lecture ${String(lecture.lecture).padStart(2, '0')}` : '', date].filter(Boolean).join(' · ');
  const nameLine = key
    ? '<p class="key-banner">Answer key — instructor copy. Do not hand out.</p>'
    : '<p class="name-line"><span>Name <span class="rule"></span></span><span>Date <span class="rule"></span></span></p>';
  return `
    <header class="ws-head">
      <div class="ws-headrow">
        <div class="ws-title"><span class="ws-emoji" aria-hidden="true">${escapeHtml(lecture.emoji || '🎤')}</span>
          <div><h1>${escapeHtml(lecture.title)} <span class="${key ? 'key-tag' : 'ws-tag'}">${key ? 'Notes key' : 'Follow-along notes'}</span></h1>
          <p class="ws-meta">MUS 248${meta ? ` · ${meta}` : ''} · fill each blank from the slides</p></div>
        </div>
        ${renderQr(`lectures/${lecture.id}`, lecture.title, 'Scan for the slides')}
      </div>
      ${nameLine}
      ${key ? '' : '<p class="notes-photo">📸 When you\'re done, take photos of these notes and submit them on Canvas.</p>'}
    </header>
    <article class="notes-body">${renderMarkdown(notesMarkdown(markdown), { blanks: key ? 'mark' : 'blank' })}</article>
    ${key ? '' : renderFormBlock(LECTURE_FORM_NOTE)}
    <footer class="ws-foot">Generated from <code>content/lectures/${escapeHtml(lecture.contentFile)}.md</code> — edit the lecture, not this page.</footer>`;
}

// Room to write: a couple of lines under each short-answer question and each "Before you leave"
// prompt. Done on the rendered page, where the structure is easy to see.
function addWritingRoom(root) {
  root.querySelectorAll('.notes-body p').forEach((paragraph) => {
    if (/^Q\d+\s*\(short answer\)/i.test(paragraph.textContent.trim())) {
      paragraph.insertAdjacentHTML('afterend', '<p class="answer-lines"><span class="rule"></span><span class="rule"></span></p>');
    }
  });
  root.querySelectorAll('.notes-body h2').forEach((heading) => {
    if (!/before you leave/i.test(heading.textContent)) return;
    const list = heading.nextElementSibling;
    if (list && list.tagName === 'UL') list.classList.add('prompts-write');
  });
}

export async function mountNotes(root) {
  const base = document.body.dataset.base || '../../';
  const key = document.body.dataset.notesKey === 'true';
  const id = new URLSearchParams(window.location.search).get('id') || '';
  const lectures = await fetch(`${base}data/lectures.json`).then((response) => response.json());
  const lecture = lectures.find((item) => item.id === id && item.contentFile && (isVisible(item) || instructorView()));
  if (!lecture) throw new Error(`No lecture ${id}`);
  const markdown = await fetch(`${base}content/lectures/${lecture.contentFile}.md`).then((response) => {
    if (!response.ok) throw new Error(`No Markdown for ${id}`);
    return response.text();
  });
  document.title = `${lecture.title} · ${key ? 'notes key' : 'follow-along notes'} · MUS 248`;
  root.innerHTML = `<a class="back no-print" href="${base}lectures/${escapeHtml(lecture.id)}/">← ${escapeHtml(lecture.title)}</a>`
    + renderNotes(markdown, lecture, { key })
    + `<p class="no-print print-cue"><button type="button" class="print-button">Print ${key ? 'the key' : 'these notes'}</button>${
      key ? ` <a href="${base}lectures/worksheet/key/?id=${encodeURIComponent(lecture.id)}">Question answers →</a>` : ''}</p>`;
  addWritingRoom(root);
  root.querySelector('.print-button').addEventListener('click', () => window.print());
}
