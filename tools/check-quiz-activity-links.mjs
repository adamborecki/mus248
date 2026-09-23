// Flags activities.json entries the quiz doesn't know about.
// Run with: node tools/check-quiz-activity-links.mjs
//
// data/activities.json (the site's activity list) and quiz/data/curriculum.json's
// own "activities" array (what students self-report against, and what
// activity_gate on a question matches) are two separate, hand-maintained
// lists. Adding an activity to one does not add it to the other. This is
// informational only — it does not fail the build — because plenty of
// activities are deliberately never gated in the quiz, and several site
// activities deliberately collapse into one quiz activity id (the four
// dante-* activities all gate under "dante").

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (...parts) => JSON.parse(readFileSync(join(root, ...parts), 'utf8'));

const directory = read('data', 'activities.json');
const curriculum = read('quiz', 'data', 'curriculum.json');
const questionsFile = read('quiz', 'data', 'questions.json');
const questions = Array.isArray(questionsFile) ? questionsFile : questionsFile.questions;

const curriculumIds = curriculum.activities.map((activity) => activity.id);
const gateIds = new Set(questions.map((question) => question.activity_gate).filter(Boolean));
const knownStems = new Set([...curriculumIds, ...gateIds]);

// An activity id is "known" to the quiz if it matches a stem exactly, or is
// a family member of one (dante-broadcast belongs to the "dante" stem).
const isKnown = (id) => [...knownStems].some((stem) => id === stem || id.startsWith(`${stem}-`));

const unlinked = directory
  .map((activity) => activity.id)
  .filter((id) => !isKnown(id));

if (unlinked.length === 0) {
  console.log('Every activity in data/activities.json has a matching quiz activity id or gate.');
} else {
  console.log('Activities with no matching entry in quiz/data/curriculum.json "activities" or activity_gate:');
  unlinked.forEach((id) => console.log(`  - ${id}`));
  console.log('\nThis is informational, not a failure: not every activity needs quiz questions.');
  console.log('If this one should, add it to curriculum.json\'s "activities" list and/or gate questions on it.');
}
