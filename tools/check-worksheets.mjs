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

const directory = JSON.parse(read('data', 'activities.json'));
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

console.table(rows);
const total = (field) => rows.reduce((sum, row) => sum + row[field], 0);
console.log(`${rows.length} worksheets · ${total('checkpoints')} checkpoints · ${total('questions')} questions · ${total('terms')} key terms`);

if (failures) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log('\nAll worksheet checks passed');
