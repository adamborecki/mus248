// What a lecture gives students, slide by slide: follow-along blanks and refresher questions.
// Run with: node tools/lecture-report.mjs <lecture id>     (e.g. 2026-10-12-big-picture)
//
// Informational, like check-quiz-activity-links: it never fails. check-worksheets.mjs is what
// enforces the rules; this is for judging coverage while writing (does every section have
// questions? is any slide a wall of blanks?) and for spotting answer lines that aren't main points.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { notesMarkdown } from '../lectures/notes.js';
import { refresherQuestions } from '../lectures/refresher.js';
import { blankTerms, isFence } from '../markdown.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const id = process.argv[2];
const lectures = JSON.parse(readFileSync(join(root, 'data', 'lectures.json'), 'utf8'));
const lecture = lectures.find((item) => item.id === id);
if (!lecture || !lecture.contentFile) {
  console.log(`Usage: node tools/lecture-report.mjs <lecture id>\nLectures: ${lectures.filter((item) => item.contentFile).map((item) => item.id).join(', ')}`);
  process.exit(0);
}
const markdown = readFileSync(join(root, 'content', 'lectures', `${lecture.contentFile}.md`), 'utf8');

// Blanks per slide, as students see the notes (no 🙈 slides, notes, portals, or questions).
const slides = [];
let slide = { title: '(before the first slide)', blanks: [] };
let fenced = false;
notesMarkdown(markdown).split('\n').forEach((line) => {
  if (isFence(line)) { fenced = !fenced; return; }
  if (fenced) return;
  const heading = line.match(/^#{2,3}\s+(.+)$/);
  if (heading) { slides.push(slide); slide = { title: heading[1], level: line.startsWith('###') ? 3 : 2, blanks: [] }; return; }
  slide.blanks.push(...blankTerms(line));
});
slides.push(slide);

const questions = refresherQuestions(markdown);
const bySlide = new Map();
questions.forEach((question) => {
  const key = question.section || '';
  bySlide.set(key, [...(bySlide.get(key) || []), question]);
});

const short = (type) => ({ 'multiple choice': 'MC', 'fill in the blank': 'fill', 'short answer': 'short' }[type] || type);
console.log(`${lecture.title} (${id})\n`);
slides.filter((item) => item.level || item.blanks.length).forEach((item) => {
  if (item.level === 2) { console.log(`\n${item.title}`); return; }
  const qs = bySlide.get(item.title) || [];
  const blanks = item.blanks.length ? `${item.blanks.length} blank${item.blanks.length === 1 ? '' : 's'}` : '—';
  const asked = qs.map((question) => `Q${question.number} ${short(question.type)}`).join(', ');
  console.log(`  ${item.title.slice(0, 58).padEnd(58)} ${blanks.padEnd(10)} ${asked}`);
});

const totalBlanks = slides.reduce((sum, item) => sum + item.blanks.length, 0);
const counts = questions.reduce((all, question) => ({ ...all, [short(question.type)]: (all[short(question.type)] || 0) + 1 }), {});
console.log(`\nFollow-along blanks: ${totalBlanks}`);
console.log(`Refresher questions: ${questions.length} (${Object.entries(counts).map(([type, n]) => `${n} ${type}`).join(', ') || 'none'})`);

// Things worth a second look; none of them is an error.
const notes = [];
questions.forEach((question) => {
  if (/^[a-e]\)\s/i.test(question.note || '')) notes.push(`Q${question.number}: its ✅ Answer starts with a letter; write the main point instead ("A fork is your own copy…").`);
  if ((question.note || '').length < 25) notes.push(`Q${question.number}: its ✅ Answer is very short; the refresher shows it as "The main point".`);
  if (question.type === 'multiple choice' && question.options.length < 3) notes.push(`Q${question.number}: only ${question.options.length} options.`);
});
slides.filter((item) => item.level === 3 && item.blanks.length > 8).forEach((item) => notes.push(`"${item.title}": ${item.blanks.length} blanks on one slide is a lot to write during class.`));
if (notes.length) console.log(`\nWorth a look:\n${notes.map((note) => `  - ${note}`).join('\n')}`);
