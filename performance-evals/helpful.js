// "Where do I review this?" for the final: links to every lecture so far (with its notes and
// refresher when they exist), and, for any quiz skill, the lecture or activity that taught it.
// Used by the final's Helpful stuff card (evals.js) and the games' miss review (games/bank.js).
//
// Nothing here is hand-maintained: lectures come from data/lectures.json, and a skill's source from
// quiz/data/skill-sources.json. Whether a lecture has notes or an open refresher is decided by the
// same helpers the lecture page uses, so this never offers a link that page would lock.

import { escapeHtml } from '../markdown.js';
import { isGuest, isVisible } from '../lectures/view.js';
import { hasBlanks } from '../lectures/notes.js';
import { opensLabel, refresherOpen } from '../lectures/refresher.js';

const ROOT = new URL('../', import.meta.url);
const href = (path) => new URL(path, ROOT).href;
const getJson = (path) => fetch(href(path), { cache: 'no-cache' }).then((response) => {
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
});
const hasQuestions = (markdown) => /^\*\*Q\d+/m.test(markdown);

// The quiz's activity ids (quiz/data/curriculum.json `activities`) as site pages. Most are the page
// itself; "dante" is the Dante family on the Activities hub, and "salmon" is the gig checklist its
// label names ("Salmon Recital Hall (A/V capture, gig checklist)").
export const ACTIVITY_PAGES = {
  dante: ['activities/#dante-activities', 'Dante activities'],
  salmon: ['salmon-gig-checklist/', 'Salmon Gig Checklist'],
};

// Lectures a student can open, already given, newest first.
const studentLectures = (lectures) => lectures
  .filter((lecture) => lecture.status === 'delivered' && lecture.contentFile && !isGuest(lecture) && isVisible(lecture))
  .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

export const lectureLabel = (lecture) => `${lecture.lecture ? `Lecture ${lecture.lecture} · ` : ''}${lecture.title}`;

let sources = null;
// { lecture or activity, confirmed } for a skill, as a link: { url, label, confirmed }, or null when
// it has none a student can open (a hidden or future lecture, or no entry).
export function loadSkillSources() {
  sources ||= Promise.all([getJson('data/lectures.json'), getJson('quiz/data/skill-sources.json'), getJson('data/activities.json'), getJson('quiz/data/curriculum.json')])
    .then(([lectures, skillSources, activities, curriculum]) => {
      const open = new Map(studentLectures(lectures).map((lecture) => [lecture.id, lecture]));
      const pages = new Map((Array.isArray(activities) ? activities : activities.activities || []).map((a) => [a.id, a.title]));
      const quizLabels = new Map((curriculum.activities || []).map((a) => [a.id, a.label]));
      return (skill) => {
        const source = skillSources.skills?.[skill];
        if (!source) return null;
        if (source.lecture) {
          const lecture = open.get(source.lecture);
          return lecture ? { url: href(`lectures/${lecture.id}/`), label: lectureLabel(lecture), confirmed: Boolean(source.confirmed) } : null;
        }
        if (source.activity) {
          const [path, label] = ACTIVITY_PAGES[source.activity]
            || (pages.has(source.activity) ? [`${source.activity}/`, pages.get(source.activity)] : []);
          return path ? { url: href(path), label: label || quizLabels.get(source.activity) || source.activity, confirmed: Boolean(source.confirmed) } : null;
        }
        return null;
      };
    });
  return sources;
}

// One line per lecture so far: the lecture, then its notes and refresher when it has them.
export async function renderLectureLinks() {
  const lectures = studentLectures(await getJson('data/lectures.json'));
  const texts = await Promise.all(lectures.map((lecture) => fetch(href(`content/lectures/${lecture.contentFile}.md`))
    .then((response) => (response.ok ? response.text() : '')).catch(() => '')));
  const items = lectures.map((lecture, i) => {
    const query = `?id=${encodeURIComponent(lecture.id)}`;
    const extras = [];
    if (hasBlanks(texts[i])) extras.push(`<a href="${href(`lectures/notes/${query}`)}">📝 Notes</a>`);
    if (hasQuestions(texts[i]) && !lecture.refresherDraft) {
      extras.push(refresherOpen(lecture)
        ? `<a href="${href(`lectures/refresher/${query}`)}">🔁 Refresher</a>`
        : `<span class="quiet">🔁 Refresher opens ${escapeHtml(opensLabel(lecture))}</span>`);
    }
    return `<li><a class="ev-lecture" href="${href(`lectures/${lecture.id}/`)}">${escapeHtml(lecture.emoji || '🎤')} ${escapeHtml(lectureLabel(lecture))}</a>`
      + `${extras.length ? `<span class="ev-lecture-extras">${extras.join('')}</span>` : ''}</li>`;
  });
  return items.length ? `<h3>Every lecture so far</h3><ul class="ev-lectures">${items.join('')}</ul>` : '';
}
