// What a lecture's Markdown shows depends on who is looking.
//
// Two markers keep instructor-only material in the same file as the slides, without students
// seeing it on the page, in the deck, on the worksheet, or in the online fill-in:
//   ### 3. 🙈 Title      a hidden slide (or ## section): kept in the file, left out for students
//   > 🧑‍🏫 Note…          an instructor note: shown only in instructor view
// Instructor view is a convenience, not a lock — the Markdown is public in the repo either way.
// No secrets go in a note, any more than anywhere else on this site.

const HIDDEN_HEADING = /^(#{2,3})\s+(?:\d+\.\s+)?🙈/u;
const NOTE = /^>\s*🧑‍🏫/u;
const HEADING = /^(#{2,6})\s/;

export const isHiddenHeading = (line) => HIDDEN_HEADING.test(line);

export function lectureView(markdown, { instructor = false } = {}) {
  if (instructor) return markdown;
  const kept = [];
  let hiddenLevel = 0;
  let inNote = false;
  markdown.split('\n').forEach((line) => {
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
