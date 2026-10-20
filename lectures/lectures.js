// Shared by the lecture list (/lectures/) and each lecture page (/lectures/<id>/).
// data/lectures.json is the only place a lecture's date, week, and status live; the Markdown in
// content/lectures/ holds just the slides' text.

import { escapeHtml, renderMarkdown } from '../markdown.js';
import { openDeck } from './deck.js';
import { instructorView, isVisible, lectureView, setInstructorView } from './view.js';
import { hasBlanks } from './notes.js';
import { lectureText } from './text.js';
import { opensLabel, refresherOpen } from './refresher.js';
import { mountEmbeddedDeck, mountPresenter } from './presenter.js';

export { isVisible };

// A lecture with questions in it (**Q1 (…).**) gets a printable worksheet and an online fill-in,
// both generated from the same Markdown — so a future lecture gets them just by having questions.
export const hasQuestions = (markdown) => /^\*\*Q\d+/m.test(markdown);


const badge = (lecture) => (lecture.lecture
  ? `<span class="lecture-badge">Lecture ${String(lecture.lecture).padStart(2, '0')}</span>` : '');

const formatDate = (iso, options) => new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', options);

export function when(lecture, { long = false } = {}) {
  if (lecture.status === 'upcoming') return 'Upcoming';
  const date = lecture.date
    ? formatDate(lecture.date, long ? { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' } : { month: 'short', day: 'numeric' })
    : (lecture.dateNote || '');
  return [lecture.week && `Week ${lecture.week}`, date].filter(Boolean).join(' · ');
}

const row = (lecture) => {
  const hidden = isVisible(lecture) ? '' : ' · 🙈 hidden from students';
  const body = `<span class="activity-emoji" aria-hidden="true">${escapeHtml(lecture.emoji || '🎤')}</span>
    <span class="card-copy"><small>${badge(lecture)}${escapeHtml(when(lecture) + hidden)}</small><strong>${escapeHtml(lecture.title)}</strong>${lecture.summary ? `<small>${escapeHtml(lecture.summary)}</small>` : ''}</span>`;
  return lecture.contentFile
    ? `<a class="lecture-row" href="${escapeHtml(lecture.id)}/">${body}<span class="arrow" aria-hidden="true">→</span></a>`
    : `<div class="lecture-row lecture-row-quiet">${body}</div>`;
};

export async function mountList(root) {
  const instructor = instructorView();
  const lectures = (await fetch('../data/lectures.json').then((response) => response.json())).filter((lecture) => instructor || isVisible(lecture));
  const upcoming = lectures.filter((lecture) => lecture.status === 'upcoming');
  const past = lectures.filter((lecture) => lecture.status !== 'upcoming');
  root.innerHTML = (upcoming.length ? `<h2 class="section-title">Coming up</h2><div class="activity-grid">${upcoming.map(row).join('')}</div>` : '')
    + `<h2 class="section-title">Past lectures</h2><div class="activity-grid">${past.map(row).join('')}</div>`;
}

export async function mountLecture(root, id) {
  const lectures = await fetch('../../data/lectures.json').then((response) => response.json());
  const instructor = instructorView();
  const readable = lectures.filter((lecture) => lecture.contentFile && (instructor || isVisible(lecture)));
  const index = readable.findIndex((lecture) => lecture.id === id);
  const lecture = readable[index];
  if (!lecture) throw new Error(`No lecture ${id}`);
  const source = await fetch(`../../content/lectures/${lecture.contentFile}.md`).then((response) => {
    if (!response.ok) throw new Error(`No Markdown for ${id}`);
    return response.text();
  });
  const deck = {
    lecture,
    badge: lecture.lecture ? `Lecture ${String(lecture.lecture).padStart(2, '0')}` : (lecture.status === 'upcoming' ? 'Coming up' : ''),
    when: when(lecture, { long: true }),
  };
  // Presenter view (?presenter=1) and the deck inside it (?embed=deck): see presenter.js. Both show
  // only what students see, even on a device with instructor view on, since they're projected.
  const mode = new URLSearchParams(window.location.search);
  if (mode.get('embed') === 'deck') { mountEmbeddedDeck({ root, lecture, source, deck }); return; }
  if (mode.get('presenter') === '1') { mountPresenter({ root, lecture, source }); return; }
  // The page and slides show the lecture's text; its numbered questions are kept for the refresher.
  const markdown = lectureText(source, { instructor });
  const query = `?id=${encodeURIComponent(lecture.id)}`;
  // Blanks (==term==) give a lecture follow-along notes to print; numbered questions give it an
  // online refresher. Keys only show in instructor view.
  const blanks = hasBlanks(source);
  const questions = hasQuestions(lectureView(source));
  const extras = [
    blanks && `<a href="../notes/${query}">📝 Follow-along notes</a>`,
    // Before it opens, students get a grayed-out label, not a link; instructor view can always go in.
    questions && (refresherOpen(lecture) || instructor
      ? `<a href="../refresher/${query}">🔁 Online refresher${refresherOpen(lecture) ? '' : ` <small>opens ${escapeHtml(opensLabel(lecture))}</small>`}</a>`
      : `<span class="extra-locked" aria-disabled="true">🔁 Online refresher <small>opens ${escapeHtml(opensLabel(lecture))}</small></span>`),
    instructor && blanks && `<a href="../notes/key/${query}">🔑 Notes key</a>`,
    instructor && questions && `<a href="../worksheet/key/${query}">🔑 Refresher key</a>`,
  ].filter(Boolean).join('');
  // The list runs newest first, so the entry before this one is the newer lecture.
  const newer = readable[index - 1];
  const older = readable[index + 1];
  const link = (target, label) => (target
    ? `<a class="lecture-nav-link" href="../${escapeHtml(target.id)}/">${label}<span>${escapeHtml(target.title)}</span></a>`
    : '<span></span>');
  document.title = `${lecture.title} · MUS 248`;
  root.innerHTML = `
    <a class="back" href="../">← Lectures</a>
    <header class="activity-header"><span aria-hidden="true">${escapeHtml(lecture.emoji || '🎤')}</span><div>${badge(lecture)}<h1>${escapeHtml(lecture.title)}</h1><p>${escapeHtml(when(lecture, { long: true }))}${lecture.status === 'upcoming' ? ' · not presented yet' : ''}</p></div></header>
    ${instructor ? '<p class="instructor-banner">🧑‍🏫 Instructor view: notes and 🙈 hidden slides are showing. <a href="https://github.com/adamborecki/mus248/tree/main/content/instructor">📓 Instructor notes</a> <button type="button" data-instructor="off">Turn off</button></p>' : ''}
    <p class="lecture-present"><button type="button" class="present-main" data-present="slides"><span aria-hidden="true">▶</span> Present slides</button><button type="button" class="present-outline" data-present="outline"><span aria-hidden="true">🗺️</span> Outline</button><a class="present-presenter" href="?presenter=1"><span aria-hidden="true">🖥️</span> Presenter view</a></p>
    ${extras ? `<p class="lecture-extras">${extras}</p>` : ''}
    <article class="instructions">${renderMarkdown(markdown, { assetBase: '../../content/lectures/', blanks: instructor ? 'mark' : 'plain' })}</article>
    <nav class="lecture-nav" aria-label="More lectures">${link(older, '← Older')}${link(newer, 'Newer →')}</nav>
    <p class="instructor-switch"><button type="button" data-instructor="${instructor ? 'off' : 'on'}">${instructor ? 'Leave instructor view' : 'π'}</button></p>`;

  // The quiet switch at the very foot of the page (and the banner's Turn off) flip instructor view
  // and reload, so the page, deck, and links all rebuild from the right view of the Markdown.
  root.querySelectorAll('[data-instructor]').forEach((button) => button.addEventListener('click', () => {
    setInstructorView(button.dataset.instructor === 'on');
    const url = new URL(window.location.href);
    url.searchParams.delete('instructor');
    window.location.replace(url.toString());
  }));

  // The slides are the same Markdown, laid out as a deck. #slide-5 and #outline open it directly,
  // so a link can drop the class straight onto a slide.
  const article = root.querySelector('.instructions');
  const present = (startAt, overview, opener) => openDeck({
    ...deck,
    article,
    startAt,
    overview,
    onClose: () => { if (opener) opener.focus(); },
  });
  root.querySelectorAll('[data-present]').forEach((button) => button.addEventListener('click', () => {
    present(0, button.dataset.present === 'outline', button);
  }));
  const hash = window.location.hash;
  const slide = hash.match(/^#slide-(\d+)$/);
  if (slide) present(Number(slide[1]) - 1, false);
  else if (hash === '#outline') present(0, true);
  else if (hash === '#slides') present(0, false);
}
