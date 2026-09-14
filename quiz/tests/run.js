// Run with: cd quiz && npm test   (or: node quiz/tests/run.js)
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { decodeStateCode, encodeStateCode, findStateCodes, sha256Hex } from '../js/state-code.js';
import { buildPayload, choiceOrder, reviewSkills, scoreAttempt, selectQuiz } from '../js/engine.js';

const load = (file) => JSON.parse(readFileSync(new URL(`../data/${file}`, import.meta.url), 'utf8'));
const curriculum = load('curriculum.json');
const bank = load('questions.json');
const deck = load('study-deck.json');
const byId = Object.fromEntries(bank.questions.map((question) => [question.id, question]));

let failures = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`ok    ${name}`);
  } catch (error) {
    failures += 1;
    console.error(`FAIL  ${name}\n${error.stack}`);
  }
}

const answerAll = (selection, isCorrect = () => true) => selection.map(({ id, role }) => {
  const question = byId[id];
  const correct = isCorrect(question, role);
  const choice = correct ? question.answer_index : (question.answer_index + 1) % question.choices.length;
  return { id, role, choice, correct };
});
const attemptFor = ({ selection, answers, activities = {}, prior = null, quiz = curriculum.quiz_number }) => ({
  quiz, quizVersion: 'test', learnerId: 'TEST01', seed: 'seed', activities, prior, selection, answers,
});

// ---------- Data files ----------

test('question bank is well-formed', () => {
  const ids = new Set();
  const activityIds = new Set(curriculum.activities.map(({ id }) => id));
  bank.questions.forEach((question) => {
    assert.ok(!ids.has(question.id), `duplicate id ${question.id}`);
    ids.add(question.id);
    ['skill', 'topic', 'type', 'prompt', 'explanation'].forEach((field) => assert.ok(question[field], `${question.id} missing ${field}`));
    assert.ok(Number.isInteger(question.level), `${question.id} level`);
    assert.ok(Array.isArray(question.choices) && question.choices.length >= 2, `${question.id} choices`);
    assert.ok(question.answer_index >= 0 && question.answer_index < question.choices.length, `${question.id} answer_index`);
    assert.equal(new Set(question.choices).size, question.choices.length, `${question.id} repeated choice`);
    assert.ok(bank.skills[question.skill], `${question.id}: no label for skill ${question.skill}`);
    assert.ok(curriculum.skills[question.skill], `${question.id}: skill ${question.skill} missing from curriculum.json`);
    if (question.activity_gate) assert.ok(activityIds.has(question.activity_gate), `${question.id}: unknown activity ${question.activity_gate}`);
  });
});

test('curriculum and study deck reference things that exist', () => {
  const cards = new Set(deck.cards.map(({ id }) => id));
  curriculum.study_cards.forEach((id) => assert.ok(cards.has(id), `study card ${id} not in study-deck.json`));
  deck.cards.forEach((card) => assert.ok(bank.skills[card.skill], `card ${card.id}: unknown skill ${card.skill}`));
  Object.entries(curriculum.skills).forEach(([skill, status]) => {
    assert.ok(['core', 'practice', 'inactive'].includes(status), `${skill}: bad status ${status}`);
    assert.ok(bank.skills[skill], `curriculum skill ${skill} has no label`);
  });
  (curriculum.coming_to_core || []).forEach((skill) => assert.ok(curriculum.skills[skill], `coming_to_core: ${skill}`));
});

// ---------- State code ----------

test('sha256 matches node:crypto', () => {
  const inputs = ['', 'abc', 'a'.repeat(55), 'a'.repeat(56), 'a'.repeat(64), 'a'.repeat(1000), 'MUS 248 — ünïcødé ✓ 🎙️'];
  inputs.forEach((input) => assert.equal(sha256Hex(input), createHash('sha256').update(input, 'utf8').digest('hex'), JSON.stringify(input)));
});

const samplePayload = { s: 1, app: '0.1.0', q: 1, v: 'x', id: 'ABC123', t: '2026-09-14T17:00:00.000Z', seed: 's', act: { stereo: 1 }, a: { AUD_CLIP_001: 'c1' }, sk: { clipping: '1' }, seen: [], sc: [1, 1, 0, 0, 1, 1] };

test('state code round-trips', () => {
  const code = encodeStateCode(samplePayload);
  assert.match(code, /^M248Q1\.v1\.[A-Za-z0-9_-]+\.[0-9a-f]{12}$/);
  const result = decodeStateCode(code);
  assert.ok(result.ok);
  assert.deepEqual(result.state, samplePayload);
});

test('code is found inside a whole pasted submission, even with line breaks', () => {
  const code = encodeStateCode(samplePayload);
  const wrapped = `MUS 248 Weekly Quiz 1: completed\nCore: 8/9\n\nQUIZ CODE\n${code.slice(0, 30)}\n  ${code.slice(30, 70)}​${code.slice(70)}\n`;
  const result = decodeStateCode(wrapped);
  assert.ok(result.ok);
  assert.equal(result.code, code);
  assert.deepEqual(findStateCodes(`${wrapped}\n\n${wrapped}`), [code, code]);
});

test('damaged, edited, and cut-off codes are rejected with a reason', () => {
  const code = encodeStateCode(samplePayload);
  const [head, quizVersion, body, sum] = code.split('.');
  const edited = `${head}.${quizVersion}.${body.slice(0, 20)}${body[20] === 'A' ? 'B' : 'A'}${body.slice(21)}.${sum}`;
  assert.equal(decodeStateCode(edited).reason, 'checksum');
  assert.equal(decodeStateCode(code.replace('M248Q1', 'M248Q2')).reason, 'checksum');
  assert.equal(decodeStateCode(code.slice(0, -4)).reason, 'incomplete');
  assert.equal(decodeStateCode(code.slice(0, 40)).reason, 'incomplete');
  assert.equal(decodeStateCode('hello').reason, 'missing');
  assert.equal(decodeStateCode('').reason, 'missing');
  assert.equal(decodeStateCode(code.replace('.v1.', '.v9.')).reason, 'newer');
});

// ---------- Selection ----------

const base = { curriculum, bank, seed: 'fixed-seed' };

test('Quiz 1 with no activities: 20 questions, 9 Core, all common, no drafts, no repeats', () => {
  const selection = selectQuiz(base);
  assert.equal(selection.length, 20);
  assert.equal(new Set(selection.map(({ id }) => id)).size, 20);
  assert.equal(selection.filter(({ role }) => role === 'core').length, 9);
  selection.forEach(({ id }) => {
    assert.equal(byId[id].activity_gate, null, `${id} is activity-gated`);
    assert.ok(!byId[id].draft, `${id} is a draft`);
  });
  const coreSkills = Object.entries(curriculum.skills).filter(([, status]) => status === 'core').map(([skill]) => skill);
  const selectedCoreSkills = new Set(selection.filter(({ role }) => role === 'core').map(({ id }) => byId[id].skill));
  coreSkills.forEach((skill) => assert.ok(selectedCoreSkills.has(skill), `Core skill ${skill} not covered`));
});

test('roles always come from curriculum.json', () => {
  for (let i = 0; i < 25; i += 1) {
    selectQuiz({ ...base, seed: `s${i}`, activities: { stereo: 2, dante: 1, x32compact: 1, 'live-looping': 1 } })
      .forEach(({ id, role }) => assert.equal(role, curriculum.skills[byId[id].skill]));
  }
});

test('activity questions appear only for students who did the activity', () => {
  const stereo = selectQuiz({ ...base, activities: { stereo: 1 } });
  const gated = stereo.filter(({ id }) => byId[id].activity_gate);
  assert.ok(gated.length >= 3 && gated.length <= curriculum.targets.activity_aware_questions);
  gated.forEach(({ id }) => {
    assert.equal(byId[id].activity_gate, 'stereo');
    assert.ok(byId[id].level <= 1);
  });
  assert.equal(stereo.length, 20);
});

test('several activities are spread across rather than one dominating', () => {
  const selection = selectQuiz({ ...base, activities: { stereo: 1, dante: 1, x32compact: 1, 'live-looping': 1 } });
  const gates = selection.map(({ id }) => byId[id].activity_gate).filter(Boolean);
  assert.equal(gates.length, 5);
  assert.equal(new Set(gates).size, 4);
});

test('an activity count of 3+ survives the code and unlocks up to level 3', () => {
  const selection = selectQuiz({ ...base, activities: { stereo: 3 } });
  const payload = buildPayload({ curriculum, bank, attempt: attemptFor({ selection, answers: answerAll(selection), activities: { stereo: 3, daw: 1 } }), appVersion: 'test' });
  assert.deepEqual(decodeStateCode(encodeStateCode(payload)).state.act, { stereo: 3, daw: 1 });
  const levelThree = { ...bank, questions: [...bank.questions, { ...byId.ST_PAN_002, id: 'TEST_L3', level: 3 }] };
  const picks = (count) => Array.from({ length: 30 }, (_, i) => selectQuiz({ curriculum, bank: levelThree, seed: `l3-${i}`, activities: { stereo: count } }))
    .some((quiz) => quiz.some(({ id }) => id === 'TEST_L3'));
  assert.equal(picks(2), false, 'level 3 offered after only 2 repetitions');
  assert.equal(picks(3), true, 'level 3 never offered at 3+');
});

test('level 2 questions need the activity twice', () => {
  const once = selectQuiz({ ...base, includeDrafts: true, activities: { stereo: 1 } });
  assert.ok(once.every(({ id }) => byId[id].level <= 1));
  const twice = Array.from({ length: 20 }, (_, i) => selectQuiz({ ...base, seed: `t${i}`, includeDrafts: true, activities: { stereo: 2 } }));
  assert.ok(twice.some((selection) => selection.some(({ id }) => byId[id].level === 2)), 'no level-2 question ever chosen for a repeat student');
});

test('same seed gives the same quiz; different seeds shuffle', () => {
  assert.deepEqual(selectQuiz(base), selectQuiz(base));
  assert.notDeepEqual(selectQuiz(base).map(({ id }) => id), selectQuiz({ ...base, seed: 'other' }).map(({ id }) => id));
});

test('choice order is a stable permutation', () => {
  bank.questions.forEach((question) => {
    const order = choiceOrder(question, 'seed');
    assert.deepEqual([...order].sort(), question.choices.map((_, i) => i));
    assert.deepEqual(order, choiceOrder(question, 'seed'));
  });
  const firsts = new Set(Array.from({ length: 30 }, (_, i) => choiceOrder(byId.AUD_CLIP_001, `s${i}`)[0]));
  assert.ok(firsts.size > 1, 'correct answer is always in the same position');
});

test('a tiny bank does not crash', () => {
  const tiny = { ...bank, questions: bank.questions.slice(0, 3) };
  assert.equal(selectQuiz({ curriculum, bank: tiny, seed: 'x' }).length, 3);
});

// ---------- Scoring, review, next-week state ----------

test('Practice gets full credit even when wrong; Core only when right', () => {
  const selection = selectQuiz(base);
  const score = scoreAttempt(selection, answerAll(selection, () => false), curriculum.scoring);
  assert.deepEqual(score, { coreCorrect: 0, coreTotal: 9, practiceDone: 11, practiceTotal: 11, points: 11, max: 20 });
  const perfect = scoreAttempt(selection, answerAll(selection), curriculum.scoring);
  assert.equal(perfect.points, 20);
});

test('review list puts missed Core first and respects the limit', () => {
  const selection = selectQuiz(base);
  const answers = answerAll(selection, (question) => !['phantom_power', 'mains_monitors'].includes(question.skill));
  const review = reviewSkills(answers, bank, curriculum);
  assert.equal(review[0], 'phantom_power');
  assert.ok(review.includes('mains_monitors'));
  assert.ok(reviewSkills(answerAll(selection, () => false), bank, curriculum).length <= curriculum.review_next_max);
});

test('Quiz 2 adapts to a pasted Quiz 1 code', () => {
  const quiz1 = selectQuiz({ ...base, activities: { stereo: 1 } });
  const missed = quiz1.find(({ id }) => byId[id].skill === 'phantom_power');
  const answers = answerAll(quiz1, (question) => question.skill !== 'phantom_power');
  const payload = buildPayload({ curriculum, bank, attempt: attemptFor({ selection: quiz1, answers, activities: { stereo: 1, daw: 0 } }), appVersion: 'test' });
  assert.deepEqual(payload.act, { stereo: 1 });
  assert.equal(payload.n, 1);
  assert.equal(payload.a[missed.id], 'c0');
  const prior = decodeStateCode(encodeStateCode(payload)).state;

  const week2 = { ...curriculum, quiz_number: 2, skills: { ...curriculum.skills, mains_monitors: 'core' } };
  for (let i = 0; i < 20; i += 1) {
    const quiz2 = selectQuiz({ curriculum: week2, bank, seed: `w2-${i}`, activities: { stereo: 1 }, prior });
    const phantom = quiz2.filter(({ id }) => byId[id].skill === 'phantom_power');
    assert.equal(phantom.length, 1, 'missed Core skill should come back');
    assert.notEqual(phantom[0].id, missed.id, 'missed skill should return as a different question');
    assert.ok(quiz2.some(({ id, role }) => byId[id].skill === 'mains_monitors' && role === 'core'), 'newly promoted skill should appear as Core');
  }

  const quiz2 = selectQuiz({ curriculum: week2, bank, seed: 'w2', activities: { stereo: 1 }, prior });
  const payload2 = buildPayload({ curriculum: week2, bank, attempt: attemptFor({ selection: quiz2, answers: answerAll(quiz2), activities: { stereo: 1 }, prior, quiz: 2 }), appVersion: 'test' });
  assert.equal(payload2.sk.phantom_power, '01');
  assert.ok(Object.keys(prior.a).every((id) => payload2.seen.includes(id)));
});

test('the Canvas code stays a reasonable length', () => {
  const selection = selectQuiz({ ...base, activities: { stereo: 2, dante: 1, x32compact: 1 } });
  const payload = buildPayload({ curriculum, bank, attempt: attemptFor({ selection, answers: answerAll(selection) }), appVersion: '0.1.0' });
  const code = encodeStateCode(payload);
  assert.ok(code.length < 2000, `code is ${code.length} characters`);
  console.log(`      (Quiz 1 code length: ${code.length} characters)`);
});

if (failures) {
  console.error(`\n${failures} test(s) failed`);
  process.exit(1);
}
console.log('\nAll tests passed');
