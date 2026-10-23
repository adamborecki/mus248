// Proves the worksheet generator against the real activity files.
// Run with: node tools/check-worksheets.mjs
//
// The point of a generated worksheet is that it cannot drift from the activity
// it came from. This is what catches the drift.

import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { inline, joinWrappedLines, renderMarkdown } from '../markdown.js';
import { parseActivity, renderWorksheet } from '../worksheet.js';
import { deckMarkdown, unzip } from './pptx-to-lecture.mjs';
import { lectureView } from '../lectures/view.js';
import { blankMatches, deliverable, refresherOpensAt, refresherQuestions, SCHEMA } from '../lectures/refresher.js';
import { notesBlanks, notesMarkdown, renderNotes } from '../lectures/notes.js';
import { lectureText } from '../lectures/text.js';
import { numberSlides } from '../lectures/view.js';
import { applyEdits, editProblem, slideBlocks } from '../lectures/presenter.js';
import { renderFormBlock, stripQuestions } from '../worksheet.js';
import { REPO_IMPROVEMENT_FORM } from '../feedback.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (...parts) => readFileSync(join(root, ...parts), 'utf8');

let failures = 0;
const fail = (message) => { failures += 1; console.error(`FAIL  ${message}`); };
const check = (condition, message) => { if (!condition) fail(message); };

// A hard-wrapped source file has to render the same as an unwrapped one, or a
// wrapped checkpoint reaches the worksheet as half a sentence.
const wrapped = joinWrappedLines(['A paragraph that', 'wraps.', '', '- a bullet that', '  wraps too', '', '> a quote that', '> wraps'].join('\n')).split('\n');
check(wrapped[0] === 'A paragraph that wraps.', `wrapped paragraph joined as: ${wrapped[0]}`);
check(wrapped[2] === '- a bullet that wraps too', `wrapped bullet joined as: ${wrapped[2]}`);
check(wrapped[4] === '> a quote that wraps', `wrapped quote joined as: ${wrapped[4]}`);
check(joinWrappedLines('| a | b |\n| 1 | 2 |') === '| a | b |\n| 1 | 2 |', 'table rows must not be joined');
check(joinWrappedLines('## Heading\ntext').split('\n').length === 2, 'a heading must not absorb the next line');

// Emphasis has to survive into the page rather than arriving as literal asterisks.
check(renderMarkdown('a *word* here').includes('<em>word</em>'), 'single-asterisk emphasis did not render');
check(renderMarkdown('a **word** here').includes('<strong>word</strong>'), 'bold stopped rendering');
check(!renderMarkdown('**bold** and *italic*').includes('*'), 'an asterisk survived into the rendered page');
// Inline code is literal: a page that teaches Markdown has to be able to show `**bold**`.
check(renderMarkdown('type `**bold**` here').includes('<code>**bold**</code>'), 'inline code lost its asterisks to bold');
check(renderMarkdown('**`NO DISK`**').includes('<strong><code>NO DISK</code></strong>'), 'bold around inline code stopped rendering');

check(/^https:\/\/forms\.gle\/[A-Za-z0-9]+$/.test(REPO_IMPROVEMENT_FORM) && renderFormBlock().includes('<svg'), 'the Repo Improvement form link or its QR code is broken');

// The refresher opens 7:00 AM Pacific the Monday after next: PDT before Nov 1, PST after; an override wins; no date, no wait.
check(refresherOpensAt({ date: '2026-10-19' }).toISOString() === '2026-10-26T14:00:00.000Z', 'refresher opening time (PDT) is wrong');
check(refresherOpensAt({ date: '2026-11-02' }).toISOString() === '2026-11-09T15:00:00.000Z', 'refresher opening time (PST) is wrong');
check(refresherOpensAt({ date: '2026-10-19', refresherOpens: '2026-10-20T09:00:00-07:00' }).toISOString() === '2026-10-20T16:00:00.000Z' && refresherOpensAt({}) === null,
  'refresherOpens override or the no-date case is wrong');

// A fenced code block shows its lines exactly: no wrapping, no formatting, no blanks, no questions.
const fencedSample = ['Before', '```', '## Gear list', '**phantom power**', '- XLR', '==not blank==', '```', 'After'].join('\n');
check(renderMarkdown(fencedSample).includes('<pre class="code-block"><code>## Gear list\n**phantom power**\n- XLR\n==not blank==</code></pre>'),
  'a ``` code block did not render its lines exactly');
check(!renderMarkdown(fencedSample).includes('<h2>'), 'a heading inside a code block rendered as a heading');
check(parseActivity(['```', '**Q1 (short answer).** Not a question', '```'].join('\n')).questions.length === 0, 'a question inside a code block was parsed');
check(notesBlanks(fencedSample).length === 0, 'a ==blank== inside a code block was collected');

// Portals collapse; instructor notes are marked so they look different when instructor view shows them.
check(/<details class="portal"><summary>.*Peek<\/summary><p>Hidden text<\/p><\/details>/.test(renderMarkdown('> 🌀 **Peek.** Hidden text')),
  'a > 🌀 portal did not render as a collapsed details block');

// ==term== is a follow-along blank: highlighted on the page, a blank on the notes, filled on the key.
check(renderMarkdown('a ==mix bus== here') === '<p>a mix bus here</p>', '==term== should read as plain text on the page');
check(renderMarkdown('a ==mix bus|bus== here', { blanks: 'mark' }).includes('<mark class="key-term">mix bus</mark>'), 'instructor view should highlight ==term== (first answer only)');
check(/class="note-blank"/.test(renderMarkdown('a ==mix bus== here', { blanks: 'blank' })) && !renderMarkdown('a ==mix bus== here', { blanks: 'blank' }).includes('mix bus'),
  'the notes render of ==term== is not a blank, or leaks the term');
check(renderMarkdown('`==not a blank==`').includes('<code>==not a blank==</code>'), '==…== inside code turned into a blank');
check(blankMatches('The Context Window!', 'context window') && blankMatches('repos', 'repo') && blankMatches('repository', 'repo|repository') && !blankMatches('', 'repo') && !blankMatches('fork', 'merge'),
  'blank answer matching is too strict or too loose');
const notesSample = notesMarkdown(['### S', 'One ==alpha== two', '> 🌀 **Portal.** ==beta== inside', '> 🧑‍🏫 ==gamma== note'].join('\n'));
check(notesSample.includes('==alpha==') && !/beta|gamma/.test(notesSample), 'follow-along notes kept a portal or an instructor note');
check(notesBlanks(['### S', 'One ==alpha== and ==beta==', '> 🌀 **P.** ==skip=='].join('\n')).join('+') === 'alpha+beta',
  'the notes did not collect the blanks (or collected one from a portal)');

// Slides number themselves under a numbered section (2.1, 2.2…), skipping 🙈 slides, replacing typed numbers.
check(numberSlides(['## 2. Part', '### Alpha', '### 🙈 Hidden', '### 2. Beta', '## Key terms', '### Gamma'].join('\n'))
  === ['## 2. Part', '### 2.1 Alpha', '### 🙈 Hidden', '### 2.2 Beta', '## Key terms', '### Gamma'].join('\n'), 'slide numbering is wrong');

// Numbered questions belong to the refresher: off the page, the slides, and the notes, nothing else lost.
const withQuestion = ['### S', 'Before.', '', '**Q1 (multiple choice).** Pick?', '', '- ✅ a) Yes', '- b) No', '', '✅ **Answer.** Yes.', '', 'After.'].join('\n');
check(!stripQuestions(withQuestion).includes('Q1') && !stripQuestions(withQuestion).includes('a) Yes') && /Before\.[\s\S]*After\./.test(stripQuestions(withQuestion)),
  'stripQuestions removed too much or too little');

// The refresher's deliverable: every question accounted for, skipped ones included, in the receipt's schema.
const sampleQuestions = refresherQuestions(['## 1. A', '### One', '**Q1 (multiple choice).** Pick?', '', '- ✅ a) Yes', '- b) No', '',
  '✅ **Answer.** Yes, because.', '', '**Q2 (fill in the blank).** It is a ==repo|repository==.', '', '✅ **Answer.** A repo holds it all.'].join('\n'));
check(sampleQuestions.length === 2 && sampleQuestions[0].section === '1.1 One' && sampleQuestions[1].terms[0] === 'repo|repository',
  'the refresher did not find its questions, their slide, or a fill-in answer');
const sampleDeliverable = deliverable({ id: 'x', title: 'X' }, sampleQuestions, { sessionId: 's', startedAt: 't', items: { 1: { status: 'right', tries: 1, clicks: 2, ms: 3000, picked: ['b', 'a'], peeks: 1 } } });
check(sampleDeliverable.payload.schema === SCHEMA && sampleDeliverable.payload.items.map((item) => item.status).join() === 'right,skipped'
  && sampleDeliverable.payload.items[0].tries === 1 && sampleDeliverable.payload.items[0].seconds === 3 && sampleDeliverable.lines.some((line) => /Q2 .*skipped/.test(line))
  && sampleDeliverable.payload.items[0].peeks === 1 && sampleDeliverable.payload.items[1].peeks === 0 && sampleDeliverable.lines.some((line) => /Q1 .*👀 peeked/.test(line)),
  'the refresher deliverable is missing a question, a status, its tries and time, or its peeks');
check(renderMarkdown('> 🧑‍🏫 Note').includes('class="instructor-note"'), 'an instructor note is not marked');

// The student view of a lecture drops 🙈 slides and 🧑‍🏫 notes, and nothing else.
const viewSample = ['## A', '### 1. Kept', 'text', '> 🧑‍🏫 a note', '> that wraps', 'after', '### 1. 🙈 Gone', 'secret', '### Back', '## 🙈 Gone too', '### inside', 'x', '## B'].join('\n');
const studentSample = lectureView(viewSample);
check(!/secret|a note|that wraps|Gone|inside/.test(studentSample), `student view kept hidden material:\n${studentSample}`);
check(['### 1. Kept', 'text', 'after', '### Back', '## B'].every((line) => studentSample.split('\n').includes(line)), 'student view dropped visible material');
check(lectureView(viewSample, { instructor: true }) === viewSample, 'instructor view must be the whole file');



// Links written relative to the Markdown resolve against the same base as images, so a page can
// link to another page and still work at the site root and under a branch preview.
check(renderMarkdown('[kit](../../x/a.md)', { assetBase: '../content/activities/' }).includes('href="../content/activities/../../x/a.md"'),
  'a relative link was not resolved against the asset base');
check(renderMarkdown('[site](https://example.com/a)', { assetBase: '../c/' }).includes('href="https://example.com/a"'),
  'an absolute link was rewritten');

const directory = JSON.parse(read('data', 'activities.json'));

// Optional catalog metadata (see catalog.js). Missing is fine — older entries default to an
// activity with no where-you-can-do-it labels — but a typo must not silently fall back.
const TYPES = ['activity', 'checklist', 'reference'];
const SETTING_KEYS = ['home', 'class', 'outsideClass'];
directory.forEach((entry) => {
  if ('type' in entry) check(TYPES.includes(entry.type), `${entry.id}: unknown type "${entry.type}"`);
  if ('kind' in entry) {
    check(['gig', 'reset'].includes(entry.kind), `${entry.id}: unknown kind "${entry.kind}"`);
    check(entry.type === 'checklist', `${entry.id}: kind "${entry.kind}" is a kind of checklist, so it needs "type": "checklist"`);
  }
  if ('settings' in entry) {
    Object.entries(entry.settings).forEach(([key, value]) => {
      check(SETTING_KEYS.includes(key), `${entry.id}: unknown setting "${key}"`);
      check(['yes', 'no', 'confirm'].includes(value), `${entry.id}: setting ${key} is "${value}" — use yes, no, or confirm`);
    });
  }
});

// Repo Improvement's starter menu names exact headings in other pages. A renamed heading has to
// fail here, not leave students hunting for a section that no longer exists.
const menu = JSON.parse(read('repo-improvement', 'starter-menu.json'));
menu.items.forEach((item) => {
  const entry = directory.find((candidate) => candidate.id === item.id);
  if (!entry || !entry.contentFile) { fail(`starter menu: ${item.id} is not a catalog page with a contentFile`); return; }
  check(['desk', 'sim', 'hands-on'].includes(item.test), `starter menu: ${item.id} test is "${item.test}"`);
  const headings = read('content', 'activities', `${entry.contentFile}.md`).split('\n')
    .filter((line) => line.startsWith('## ')).map((line) => line.slice(3).trim());
  item.sections.forEach((section) => check(headings.includes(section), `starter menu: ${item.id} has no "## ${section}" heading`));
});
(menu.external || []).forEach((item) => {
  check(/^https:\/\//.test(item.url), `starter menu: external "${item.title}" needs an https URL`);
  check(['desk', 'sim', 'hands-on'].includes(item.test), `starter menu: external "${item.title}" test is "${item.test}"`);
  check(Boolean(item.source && item.focus), `starter menu: external "${item.title}" needs a source and a focus`);
});
// Its one download exists, decodes as UTF-8, and is linked from the activity page.
const starterFile = join(root, 'repo-improvement', 'downloads', 'PROJECT_STARTER.md');
if (!existsSync(starterFile)) fail('repo-improvement/downloads/PROJECT_STARTER.md is missing');
else {
  try { new TextDecoder('utf-8', { fatal: true }).decode(readFileSync(starterFile)); } catch { fail('PROJECT_STARTER.md is not valid UTF-8'); }
  check(read('content', 'activities', 'repo-improvement.md').includes('(../../repo-improvement/downloads/PROJECT_STARTER.md)'),
    'repo-improvement.md does not link PROJECT_STARTER.md');
}
// The generator is driven by the directory, never by globbing the folder — so
// _template.md and WORKSHEETS.md are never mistaken for activities.
const generated = directory.filter((activity) => activity.contentFile);

check(generated.length > 0, 'no activities declare a contentFile');

const rows = [];
generated.forEach((activity) => {
  const file = join('content', 'activities', `${activity.contentFile}.md`);
  if (!existsSync(join(root, file))) { fail(`${activity.id}: ${file} is missing`); return; }

  const markdown = read(file);
  const parsed = parseActivity(markdown);
  const { id } = activity;

  // Routes exist for both renders.
  check(existsSync(join(root, activity.route, 'worksheet', 'index.html')), `${id}: no ${activity.route}/worksheet/ page`);
  check(existsSync(join(root, activity.route, 'worksheet', 'key', 'index.html')), `${id}: no ${activity.route}/worksheet/key/ page`);
  const key = read(activity.route, 'worksheet', 'key', 'index.html');
  check(/name="robots"[^>]*noindex/.test(key), `${id}: the answer key is not noindex`);

  // A sentence that was wrapped in the source has to arrive whole.
  [...parsed.checkpoints.map((checkpoint) => ['checkpoint', checkpoint.text]),
    ...parsed.done.map((item) => ['definition of done item', item])]
    .forEach(([kind, text]) => {
      check(/[.!?:)"']$/.test(text.trim()), `${activity.id}: a ${kind} ends mid-sentence — "${text.slice(-45)}"`);
    });

  // There has to be something to write on.
  check(parsed.questions.length + parsed.checkpoints.length + parsed.done.length > 0,
    `${id}: the worksheet would come out empty — no questions, checkpoints, or definition of done`);

  // Opt-in credit is a GitHub username, never a real name (see CLAUDE.md).
  [].concat(parsed.frontmatter.contributors || []).forEach((name) => {
    check(/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/.test(name), `${id}: contributor "${name}" is not a GitHub username`);
  });

  // A checklist's printed step numbers have to be the ones its page shows.
  if (activity.type === 'checklist') {
    const numberedPage = renderMarkdown(markdown, { numbered: true });
    parsed.checkpoints.filter((checkpoint) => checkpoint.id).forEach((checkpoint) => {
      check(numberedPage.includes(`<span class="step-id">${checkpoint.id}</span>`), `${id}: worksheet step ${checkpoint.id} is not on the page`);
    });
    check(parsed.checkpoints.some((checkpoint) => checkpoint.id), `${id}: a checklist with no numbered steps`);
  }

  // Questions keep the shape the generator relies on.
  parsed.questions.forEach((question) => {
    const where = `${id} Q${question.number}`;
    check(Boolean(question.prompt), `${where}: empty prompt`);
    if (question.type === 'multiple choice') {
      check(question.options.length >= 2, `${where}: multiple choice with ${question.options.length} option(s)`);
      check(question.options.filter((option) => option.correct).length === 1,
        `${where}: needs exactly one option marked "- ✅ x) …"`);
    } else {
      check(question.options.length === 0, `${where}: "${question.type}" should have no option list`);
    }
    check(Boolean(question.answer), `${where}: no correct answer marked, so the answer key cannot generate`);
  });
  const numbers = parsed.questions.map((question) => question.number);
  check(numbers.every((number, index) => number === index + 1),
    `${id}: questions are numbered ${numbers.join(',')} — expected 1..${numbers.length}`);

  // Neither student render may leak the key.
  const page = renderMarkdown(markdown);
  check(!/<li>\s*✅/.test(page), `${id}: the activity page still shows a ✅ on an option`);
  check(!/✅\s*<strong>Answers?/i.test(page), `${id}: the activity page still shows an ✅ **Answer.** line`);

  const student = renderWorksheet(parsed, { directory: activity });
  check(student.includes(REPO_IMPROVEMENT_FORM) && student.includes('Scan for the form'), `${id}: the worksheet is missing the Repo Improvement form`);
  check(!student.includes('class="option correct"'), `${id}: the worksheet marks the correct option`);
  check(!student.includes('class="key-answer"'), `${id}: the worksheet carries the answer block`);
  check(/Name <span class="rule">/.test(student), `${id}: the worksheet has no name line`);
  parsed.questions.filter((question) => question.options.length === 0).forEach((question) => {
    // A free-text answer only ever appears in the ✅ line, so seeing it on the
    // student page means the key leaked.
    check(!student.includes(inline(question.answer)), `${id} Q${question.number}: its written answer leaked onto the worksheet`);
  });

  // The key render does show them.
  const keyHtml = renderWorksheet(parsed, { showAnswers: true, directory: activity });
  check(!keyHtml.includes('ws-form'), `${id}: the answer key should not carry the Repo Improvement form`);
  check(!keyHtml.includes('no answer marked in the source'), `${id}: the answer key has unmarked questions`);
  check(!/Name <span class="rule">/.test(keyHtml), `${id}: the answer key should not carry a student name line`);
  check(keyHtml.includes('Answer key'), `${id}: the answer key is not labelled`);
  parsed.questions.forEach((question) => {
    check(keyHtml.includes(inline(question.answer).slice(0, 30)) || question.options.some((option) => option.correct),
      `${id} Q${question.number}: its answer is missing from the key`);
  });

  rows.push({
    activity: id,
    done: parsed.done.length,
    terms: parsed.keyTerms.length,
    checkpoints: parsed.checkpoints.length,
    questions: parsed.questions.length,
    leave: parsed.beforeYouLeave.length,
  });
});

// Lectures: data/lectures.json is the catalog; each readable lecture needs its Markdown and its
// /lectures/<id>/ page. The site is public, so the things redacted on import must stay out.
// Presenter view: the text splits into one block per slide (block 0 is the title slide's), an
// edit replaces its block only while that block is unchanged, and an edit can't add a slide.
const pvSample = ['Intro', '## 1. A', 'text', '```', '## not a slide', '```', '### 1.1 B', 'more'].join('\n');
check(slideBlocks(pvSample).length === 3 && slideBlocks(pvSample)[1].includes('## not a slide'), 'presenter: slideBlocks split the text wrong (or split inside a code block)');
check(applyEdits(pvSample, { 2: { before: '### 1.1 B\nmore', after: '### 1.1 B\nchanged' } }).endsWith('changed')
  && applyEdits(pvSample, { 2: { before: 'stale', after: 'nope' } }) === slideBlocks(pvSample).join('\n\n'), 'presenter: applyEdits applied a stale edit or skipped a good one');
check(!editProblem('### B\nok', 2) && editProblem('### B\n### C', 2) && editProblem('no heading', 2) && editProblem('## X', 0), 'presenter: editProblem let an edit add or drop a slide');

const lectures = JSON.parse(read('data', 'lectures.json'));
const quizCodes = Object.values(JSON.parse(read('quiz', 'data', 'curriculum.json')).quizzes || {})
  .map((quiz) => quiz.access_code).filter(Boolean);
check(new Set(lectures.map((lecture) => lecture.id)).size === lectures.length, 'lectures: duplicate id');
const numbered = lectures.filter((lecture) => lecture.lecture).map((lecture) => lecture.lecture);
check(new Set(numbered).size === numbered.length, 'lectures: two lectures share a LECTURE number');
lectures.forEach((lecture) => {
  const where = `lecture ${lecture.id}`;
  check(['delivered', 'upcoming', 'no-class'].includes(lecture.status), `${where}: unknown status "${lecture.status}"`);
  check(lecture.date === null || /^\d{4}-\d{2}-\d{2}$/.test(lecture.date), `${where}: date must be YYYY-MM-DD or null`);
  if ('refresherDraft' in lecture) check(typeof lecture.refresherDraft === 'boolean', `${where}: refresherDraft must be true or false`);
  if ('hiddenUntil' in lecture) {
    check(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?[+-]\d{2}:\d{2}$/.test(lecture.hiddenUntil) && !Number.isNaN(Date.parse(lecture.hiddenUntil)),
      `${where}: hiddenUntil needs a full time with its UTC offset, like 2026-10-19T22:00:00-07:00`);
  }
  if (!lecture.contentFile) return;
  const file = join('content', 'lectures', `${lecture.contentFile}.md`);
  if (!existsSync(join(root, file))) { fail(`${where}: ${file} is missing`); return; }
  const page = join('lectures', lecture.id, 'index.html');
  check(existsSync(join(root, page)) && read(page).includes(`data-lecture-id="${lecture.id}"`), `${where}: no ${page} for it`);
  const text = read(file);
  quizCodes.forEach((code) => check(!text.toLowerCase().includes(code.toLowerCase()), `${where}: contains a quiz access code`));
  // The Repo Improvement form is public on purpose (feedback.js); any other form or Drive link is not.
  check(!/forms\.gle|docs\.google\.com\/forms|drive\.google\.com\/drive\/folders/.test(text.split(REPO_IMPROVEMENT_FORM).join('').split(REPO_IMPROVEMENT_FORM.replace(/^https:\/\//, '')).join('')), `${where}: contains a form or Drive folder link`);

  // A lecture's page, slides, and notes come from the student view of its text, with its numbered
  // questions taken out (they're the online refresher's); none may hide in a 🙈 slide.
  const student = lectureView(text);
  check(!/🧑‍🏫/u.test(student), `${where}: an instructor note survived into the student view`);
  // Every week opens the same way: an upcoming lecture's first section is 📣 Announcements, and its
  // first slide is the Homework review (a "see Canvas" placeholder is fine). Delivered lectures are
  // left as they were. content/lectures/_template.md has the shape.
  if (lecture.status === 'upcoming') {
    const headings = student.split('\n').filter((line) => /^#{2,3}\s/.test(line));
    check(/^##\s+📣 Announcements/u.test(headings[0] || '') && /^###\s+Homework review/.test(headings[1] || ''),
      `${where}: an upcoming lecture opens with "## 📣 Announcements" and its first slide "### Homework review" (see content/lectures/_template.md)`);
    // Once it has a date, the Homework review says where we are: "**Today:** Week 10 · Class 9" and
    // "**After today:** 5 classes (4 + 1 meeting in finals week)". An undated draft can't know yet.
    if (lecture.date) {
      const review = (student.split(/^###\s+Homework review\s*$/m)[1] || '').split(/^#{2,3}\s/m)[0];
      check(/^\*\*Today:\*\* Week \d+ · Class \d+\s*$/m.test(review) && /^\*\*After today:\*\* \d+ classes? \(\d+ \+ 1 meeting in finals week\)\s*$/m.test(review),
        `${where}: the Homework review opens with "**Today:** Week n · Class n" and "**After today:** y classes (x + 1 meeting in finals week)", each its own line (see content/lectures/_template.md)`);
      const today = review.match(/Week (\d+) · Class (\d+)/);
      if (today) check(Number(today[1]) === lecture.week && Number(today[2]) === lecture.lecture, `${where}: "Today" says Week ${today[1]} · Class ${today[2]}, but data/lectures.json has week ${lecture.week}, lecture ${lecture.lecture}`);
    }
  }
  const parsed = parseActivity(student);
  check(parseActivity(text).questions.length === parsed.questions.length, `${where}: a question sits in a 🙈 hidden slide, so students would never see it`);
  const lecturePage = renderMarkdown(lectureText(text));
  // Presenter view maps deck slide n to text block n and to the nth heading on the notes.
  const slideCount = (lecturePage.match(/<h[23][ >]/g) || []).length;
  check(slideBlocks(lectureText(text)).length - 1 === slideCount && (renderMarkdown(notesMarkdown(text)).match(/<h[23][ >]/g) || []).length === slideCount,
    `${where}: presenter view's slides, text blocks, and notes headings don't line up`);
  check(!/\bQ\d+ \((multiple choice|short answer|fill in the blank)\)/.test(lecturePage), `${where}: a refresher question shows on the page or slides`);
  if (parsed.questions.length) check(!/<li>\s*✅/.test(lecturePage) && !/✅\s*<strong>Answers?/i.test(lecturePage), `${where}: the lecture page shows an answer`);

  // Follow-along blanks: each one a short, plain term, and none left as literal ==…== on the notes.
  const blanks = notesBlanks(text);
  blanks.forEach((term) => {
    check(term.length <= 40 && !/[*`[\]]/.test(term), `${where}: blank "${term}" should be a short plain term (no formatting, 40 characters at most)`);
  });
  if (blanks.length) {
    const notes = renderNotes(text, lecture);
    check(!notes.replace(/<pre[\s\S]*?<\/pre>/g, '').includes('=='), `${where}: the follow-along notes still show a literal == (outside a code block)`);
    check(!notes.includes('key-term'), `${where}: the follow-along notes show a filled-in blank`);
    check(notes.includes('ws-form') && !renderNotes(text, lecture, { key: true }).includes('ws-form'),
      `${where}: the follow-along notes should end with the Repo Improvement form (and the key shouldn't)`);
  }

  // The refresher: questions shaped like an activity's, every fill-in with its answer marked.
  const questions = refresherQuestions(text);
  questions.forEach((question) => {
    const at = `${where} Q${question.number}`;
    if (question.type === 'multiple choice') {
      check(question.options.length >= 2 && question.options.filter((option) => option.correct).length === 1, `${at}: needs 2+ options and exactly one ✅`);
    } else {
      check(question.options.length === 0, `${at}: "${question.type}" should have no option list`);
    }
    if (question.type === 'fill in the blank') check(question.terms.length > 0, `${at}: a refresher fill-in needs its answer marked in the prompt, like ==context window==`);
    check(Boolean(question.note), `${at}: needs a ✅ **Answer.** line: the main point the refresher shows`);
  });
  const order = questions.map((question) => question.number);
  check(order.every((number, index) => number === index + 1), `${where}: questions are numbered ${order.join(',')} — expected 1..${order.length}`);
  if (questions.length) {
    const sheet = renderWorksheet(parseActivity(student), { directory: { id: lecture.id, title: lecture.title, route: `lectures/${lecture.id}`, source: file } });
    const prompts = [...sheet.matchAll(/<p class="q-prompt">([\s\S]*?)<\/p>/g)].map((match) => match[1]);
    check(!sheet.includes('class="option correct"') && !sheet.includes('class="key-answer"') && !questions.some((question, at) => question.terms.some((term) => (prompts[at] || '').includes(`>${term.split('|')[0]}<`) || (prompts[at] || '').includes(` ${term.split('|')[0]}.`))),
      `${where}: the refresher key's student copy leaks an answer`);
  }
  if (blanks.length || questions.length) {
    rows.push({ activity: `lecture ${lecture.id}`, done: 0, terms: parsed.keyTerms.length, checkpoints: 0, questions: questions.length, leave: parsed.beforeYouLeave.length, blanks: blanks.length });
  }
});

// The lecture template stays a working lecture: it has a blank, both kinds of question, and the
// Homework review slide in the right place.
const lectureTemplate = read('content', 'lectures', '_template.md');
check(notesBlanks(lectureTemplate).length > 0 && refresherQuestions(lectureTemplate).length === 2
  && /^## 📣 Announcements\n\n### Homework review/mu.test(lectureView(lectureTemplate)), 'content/lectures/_template.md no longer parses as a lecture');

// PowerPoint → lecture Markdown, against a tiny deck whose slide files are deliberately out of order.
const converted = deckMarkdown(unzip(readFileSync(join(root, 'tools', 'fixtures', 'tiny-deck.pptx'))), 'tiny-deck.pptx');
['### Slide 1: Agenda', '### Slide 2: Gain & Signal Flow', '- ↳ Watch the meter', '| MIC | Very small |', '🖼️ Image in original slide']
  .forEach((expected) => check(converted.includes(expected), `pptx-to-lecture: output is missing "${expected}"`));
check(converted.indexOf('Slide 1: Agenda') < converted.indexOf('Slide 2: Gain'), 'pptx-to-lecture: slides out of presentation order');
check(renderMarkdown(converted).includes('<table>'), 'pptx-to-lecture: the table does not render');

console.table(rows);
const total = (field) => rows.reduce((sum, row) => sum + row[field], 0);
console.log(`${rows.length} worksheets · ${total('checkpoints')} checkpoints · ${total('questions')} questions · ${total('terms')} key terms`);

if (failures) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log('\nAll worksheet checks passed');
