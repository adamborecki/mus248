// Shared by the lecture list (/lectures/) and each lecture page (/lectures/<id>/).
// data/lectures.json is the only place a lecture's date, week, and status live; the Markdown in
// content/lectures/ holds just the slides' text.

import { escapeHtml, renderMarkdown } from '../markdown.js';
import { openDeck } from './deck.js';

// A lecture with `hiddenUntil` (an ISO time with its UTC offset) stays off the list and its page
// until then. This only hides it on the site: the Markdown is still public in the repo.
export const isVisible = (lecture, now = Date.now()) => !lecture.hiddenUntil || now >= Date.parse(lecture.hiddenUntil);

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
  const body = `<span class="activity-emoji" aria-hidden="true">${escapeHtml(lecture.emoji || '🎤')}</span>
    <span class="card-copy"><small>${badge(lecture)}${escapeHtml(when(lecture))}</small><strong>${escapeHtml(lecture.title)}</strong>${lecture.summary ? `<small>${escapeHtml(lecture.summary)}</small>` : ''}</span>`;
  return lecture.contentFile
    ? `<a class="lecture-row" href="${escapeHtml(lecture.id)}/">${body}<span class="arrow" aria-hidden="true">→</span></a>`
    : `<div class="lecture-row lecture-row-quiet">${body}</div>`;
};

export async function mountList(root) {
  const lectures = (await fetch('../data/lectures.json').then((response) => response.json())).filter((lecture) => isVisible(lecture));
  const upcoming = lectures.filter((lecture) => lecture.status === 'upcoming');
  const past = lectures.filter((lecture) => lecture.status !== 'upcoming');
  root.innerHTML = (upcoming.length ? `<h2 class="section-title">Coming up</h2><div class="activity-grid">${upcoming.map(row).join('')}</div>` : '')
    + `<h2 class="section-title">Past lectures</h2><div class="activity-grid">${past.map(row).join('')}</div>`;
}

export async function mountLecture(root, id) {
  const lectures = await fetch('../../data/lectures.json').then((response) => response.json());
  const readable = lectures.filter((lecture) => lecture.contentFile && isVisible(lecture));
  const index = readable.findIndex((lecture) => lecture.id === id);
  const lecture = readable[index];
  if (!lecture) throw new Error(`No lecture ${id}`);
  const markdown = await fetch(`../../content/lectures/${lecture.contentFile}.md`).then((response) => {
    if (!response.ok) throw new Error(`No Markdown for ${id}`);
    return response.text();
  });
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
    <p class="lecture-present"><button type="button" class="present-main" data-present="slides"><span aria-hidden="true">▶</span> Present slides</button><button type="button" class="present-outline" data-present="outline"><span aria-hidden="true">🗺️</span> Outline</button></p>
    <article class="instructions">${renderMarkdown(markdown, { assetBase: '../../content/lectures/' })}</article>
    <nav class="lecture-nav" aria-label="More lectures">${link(older, '← Older')}${link(newer, 'Newer →')}</nav>`;

  // The slides are the same Markdown, laid out as a deck. #slide-5 and #outline open it directly,
  // so a link can drop the class straight onto a slide.
  const article = root.querySelector('.instructions');
  const present = (startAt, overview, opener) => openDeck({
    article,
    lecture,
    badge: lecture.lecture ? `Lecture ${String(lecture.lecture).padStart(2, '0')}` : (lecture.status === 'upcoming' ? 'Coming up' : ''),
    when: when(lecture, { long: true }),
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
