// What a lecture's Markdown shows depends on who is looking.
//
// Two markers keep instructor-only material in the same file as the slides, without students
// seeing it on the page, in the deck, on the worksheet, or in the online fill-in:
//   ### 3. 🙈 Title      a hidden slide (or ## section): kept in the file, left out for students
//   > 🧑‍🏫 Note…          an instructor note: shown only in instructor view
// Instructor view is a convenience, not a lock — the Markdown is public in the repo either way.
// No secrets go in a note, any more than anywhere else on this site.

// A lecture with `hiddenUntil` (an ISO time with its UTC offset) stays off the list, its page, its
// worksheet, and its fill-in until then — except in instructor view. This only hides it on the
// site: the Markdown is still public in the repo.
export const isVisible = (lecture, now = Date.now()) => !lecture.hiddenUntil || now >= Date.parse(lecture.hiddenUntil);

// A guest lecture ("guest": "the course it's for") is one given to another class on this same
// engine. It never appears on this course's lecture list or in its Older/Newer links (instructor
// view lists it on its own), but once visible its page, slides, and notes open for anyone with the
// link, so that class can be sent it. Add `hiddenUntil` to keep even the link instructor-only.
export const isGuest = (lecture) => Boolean(lecture.guest);
export const courseOf = (lecture) => lecture.guest || 'MUS 248';

const HIDDEN_HEADING = /^(#{2,3})\s+(?:\d+\.\s+)?🙈/u;
const NOTE = /^>\s*🧑‍🏫/u;
const HEADING = /^(#{2,6})\s/;

export const isHiddenHeading = (line) => HIDDEN_HEADING.test(line);

export function lectureView(markdown, { instructor = false } = {}) {
  if (instructor) return markdown;
  const kept = [];
  let hiddenLevel = 0;
  let inNote = false;
  let fenced = false;
  markdown.split('\n').forEach((line) => {
    // Inside a code block nothing is a marker: a 🙈 or 🧑‍🏫 there is just text being shown.
    if (line.trim().startsWith('```')) fenced = !fenced;
    if (fenced || line.trim().startsWith('```')) { if (!hiddenLevel) kept.push(line); return; }
    const heading = line.match(HEADING);
    // A hidden ### slide ends at the next ## or ###; a hidden ## section at the next ##.
    if (hiddenLevel && heading && heading[1].length <= hiddenLevel) hiddenLevel = 0;
    if (hiddenLevel) return;
    const hidden = line.match(HIDDEN_HEADING);
    if (hidden) { hiddenLevel = hidden[1].length; return; }
    // A note runs for every quoted line after its 🧑‍🏫, like any wrapped blockquote.
    if (inNote && line.trimStart().startsWith('>')) return;
    inNote = false;
    if (NOTE.test(line.trimStart())) { inNote = true; return; }
    kept.push(line);
  });
  return kept.join('\n');
}

// Instructor view is switched on with ?instructor=1 (or the quiet link at the foot of a lecture)
// and off with ?instructor=0, and remembered on this device. Storage can be missing or throw
// (private mode, previews), so a failure just means "off".
const KEY = 'mus248:instructor-view';

export function instructorView() {
  if (typeof window === 'undefined') return false;
  const asked = new URLSearchParams(window.location.search).get('instructor');
  try {
    if (asked === '1') window.localStorage.setItem(KEY, '1');
    if (asked === '0') window.localStorage.removeItem(KEY);
    return window.localStorage.getItem(KEY) === '1';
  } catch {
    return asked === '1';
  }
}

export function setInstructorView(on) {
  try {
    if (on) window.localStorage.setItem(KEY, '1');
    else window.localStorage.removeItem(KEY);
  } catch { /* nothing to remember it in */ }
}

// Slides number themselves like sections of a code: under "## 2. A Finished Example" the slides
// read 2.1, 2.2, 2.3… so adding one never means renumbering by hand. Only lectures whose ##
// sections start with a number get this; a number typed on a ### heading is replaced. 🙈 slides
// aren't counted, so a slide has the same number in instructor view and for students.
export function numberSlides(markdown) {
  let section = null;
  let count = 0;
  let fenced = false;
  return markdown.split('\n').map((line) => {
    if (line.trim().startsWith('```')) { fenced = !fenced; return line; }
    if (fenced) return line;
    const h2 = line.match(/^##\s+(.*)$/);
    if (h2) { section = (h2[1].match(/^(\d+)\.\s/) || [])[1] || null; count = 0; return line; }
    const h3 = line.match(/^###\s+(.*)$/);
    if (!h3 || !section) return line;
    const title = h3[1].replace(/^\d+(?:\.\d+)?\.?\s+/, '');
    if (/^🙈/u.test(title)) return `### ${title}`;
    count += 1;
    return `### ${section}.${count} ${title}`;
  }).join('\n');
}
