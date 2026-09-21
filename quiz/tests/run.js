// Run with: cd quiz && npm test   (or: node quiz/tests/run.js)
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { decodeStateCode, encodeStateCode, findStateCodes, sha256Hex } from '../js/state-code.js';
import { buildPayload, choiceOrder, parseResult, resolveScoring, reviewSkills, scoreAttempt, selectBonus, selectQuiz, shouldOfferBonus } from '../js/engine.js';

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

// ---------- Pre-flight: the things that must move before a quiz runs ----------
// These used to be a checklist in NEXT.md. A checklist gets skipped at 7:50am;
// a failing test does not.

const normalizeCode = (value) => String(value).trim().toLowerCase().replace(/\s+/g, '');
const quizzes = curriculum.quizzes || {};

test('every quiz that has run is still set up', () => {
  assert.ok(Object.keys(quizzes).length, 'curriculum.json needs a quizzes map, keyed by quiz number');
  assert.equal(curriculum.access_codes, undefined, 'access_codes is superseded by quizzes[n].access_code');
  assert.equal(curriculum.quiz_label, undefined, 'quiz_label now lives in quizzes[n].label');
  assert.equal(curriculum.quiz_version, undefined, 'quiz_version now lives in quizzes[n].version');
  assert.ok(quizzes[String(curriculum.quiz_number)],
    `quiz_number is ${curriculum.quiz_number} but quizzes has no entry for it — the quiz would refuse to open`);
});

test('each quiz entry is complete and self-consistent', () => {
  Object.entries(quizzes).forEach(([number, quiz]) => {
    assert.match(quiz.label || '', new RegExp(`\\b${number}\\b`),
      `quizzes["${number}"].label is "${quiz.label}", which doesn't name quiz ${number}`);
    assert.match(quiz.version || '', /^\d{4}-\d{2}-\d{2}$/,
      `quizzes["${number}"].version should be the date that quiz runs, got "${quiz.version}"`);
    assert.equal(typeof quiz.access_code, 'string',
      `quizzes["${number}"].access_code must be a string ("" means no code for that quiz)`);
  });
});

test('each access code opens exactly one quiz', () => {
  // The code selects which quiz runs, so a duplicate would make a makeup
  // ambiguous — and would mean an entry was copied forward unchanged.
  const seen = new Map();
  Object.entries(quizzes).forEach(([number, quiz]) => {
    const code = normalizeCode(quiz.access_code);
    if (!code) return;
    assert.ok(!seen.has(code),
      `Quiz ${number} and Quiz ${seen.get(code)} share an access code — which quiz should it open?`);
    seen.set(code, number);
  });
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
    assert.equal(typeof question.verified, 'boolean', `${question.id}: verified should be true/false`);
    assert.ok(Array.isArray(question.choices) && question.choices.length >= 2, `${question.id} choices`);
    assert.ok(question.answer_index >= 0 && question.answer_index < question.choices.length, `${question.id} answer_index`);
    assert.equal(new Set(question.choices).size, question.choices.length, `${question.id} repeated choice`);
    assert.ok(bank.skills[question.skill], `${question.id}: no label for skill ${question.skill}`);
    assert.ok(curriculum.skills[question.skill], `${question.id}: skill ${question.skill} missing from curriculum.json`);
    if (question.activity_gate) assert.ok(activityIds.has(question.activity_gate), `${question.id}: unknown activity ${question.activity_gate}`);
  });
});

test('curriculum and study deck reference things that exist', () => {
  assert.equal(new Set(deck.cards.map(({ id }) => id)).size, deck.cards.length, 'duplicate card id');
  deck.cards.forEach((card) => {
    assert.ok(bank.skills[card.skill], `card ${card.id}: unknown skill ${card.skill}`);
    assert.ok(curriculum.skills[card.skill], `card ${card.id}: skill ${card.skill} missing from curriculum.json`);
    assert.ok(deck.categories.includes(card.category), `card ${card.id}: unknown category ${card.category}`);
    assert.ok(card.front && card.back, `card ${card.id} needs front and back`);
    assert.equal(typeof card.verified, 'boolean', `card ${card.id}: verified should be true/false`);
  });
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

test('the graded set is a fixed 12, all Core, all verified, one per skill', () => {
  const selection = selectQuiz(base);
  assert.equal(selection.length, curriculum.targets.graded_questions);
  assert.equal(new Set(selection.map(({ id }) => id)).size, selection.length, 'a question was repeated');
  selection.forEach(({ id, role }) => {
    assert.equal(role, 'core', `${id} is graded but not Core`);
    assert.equal(curriculum.skills[byId[id].skill], 'core', `${id}'s skill is not Core`);
    assert.ok(byId[id].verified, `${id} is graded but not verified — an unchecked question must never cost marks`);
    assert.ok(!byId[id].draft, `${id} is a draft`);
  });
  const skills = selection.map(({ id }) => byId[id].skill);
  assert.equal(new Set(skills).size, skills.length, 'two graded questions covered the same skill');
});

test('the graded count stays fixed however many skills become Core', () => {
  // The whole point of a fixed count: promoting skills must not lengthen the quiz
  // past its own clock.
  const everythingCore = {
    ...curriculum,
    skills: Object.fromEntries(Object.keys(curriculum.skills).map((skill) => [skill, 'core'])),
  };
  const selection = selectQuiz({ ...base, curriculum: everythingCore });
  assert.equal(selection.length, curriculum.targets.graded_questions);
});

test('graded questions never ask about gear a student has not touched', () => {
  const none = selectQuiz(base);
  none.forEach(({ id }) => assert.equal(byId[id].activity_gate, null, `${id} is gated but no activity was reported`));

  const dante = selectQuiz({ ...base, activities: { dante: 2 } });
  dante.forEach(({ id }) => {
    const gate = byId[id].activity_gate;
    if (gate) assert.equal(gate, 'dante', `${id} is gated on ${gate}, which was not done`);
  });
  assert.equal(dante.length, curriculum.targets.graded_questions);
});

test('gated difficulty still climbs with repetitions', () => {
  const harder = { ...bank, questions: [...bank.questions, { ...byId.DANTE_MATRIX_001, id: 'TEST_L3', level: 3, verified: true }] };
  const reached = (count) => Array.from({ length: 30 }, (_, i) => selectQuiz({ curriculum, bank: harder, seed: `l3-${i}`, activities: { dante: count } }))
    .some((quiz) => quiz.some(({ id }) => id === 'TEST_L3'));
  assert.equal(reached(2), false, 'a level-3 question was offered after only 2 repetitions');
  assert.equal(reached(3), true, 'a level-3 question was never offered at 3+ repetitions');
});

test('ungated graded questions stay at the everyday level', () => {
  const selection = selectQuiz({ ...base, activities: { dante: 1 } });
  selection.filter(({ id }) => !byId[id].activity_gate)
    .forEach(({ id }) => assert.ok(byId[id].level <= (curriculum.max_common_level ?? 1), `${id} is level ${byId[id].level}`));
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

test('the grade is 4 for turning up plus 6 for knowing it', () => {
  const scoring = resolveScoring(curriculum);
  const selection = selectQuiz(base);
  const n = selection.length;
  const some = (reached, correct) => selection.slice(0, reached)
    .map(({ id, role }, i) => ({ id, role, choice: 0, correct: i < correct }));

  assert.equal(scoreAttempt(selection, some(n, n), scoring).points, 10, 'everything right should be full marks');
  assert.equal(scoreAttempt(selection, some(n, 0), scoring).points, 4, 'answering everything and getting it all wrong is the floor');
  assert.equal(scoreAttempt(selection, some(n, n / 2).slice(0, n), scoring).points, 7, 'half right should sit halfway between the floor and full marks');
  assert.equal(scoreAttempt(selection, [], scoring).points, 0, 'answering nothing earns nothing');
});

test('running out of time costs nobody a mark they had no chance to earn', () => {
  const scoring = resolveScoring(curriculum);
  const selection = selectQuiz(base);
  const cutOff = (reached, correct) => selection.slice(0, reached)
    .map(({ id, role }, i) => ({ id, role, choice: 0, correct: i < correct }));

  // Scored on what they reached: 6 of 12, all correct, is still full marks.
  assert.equal(scoreAttempt(selection, cutOff(6, 6), scoring).points, 10);
  assert.equal(scoreAttempt(selection, cutOff(6, 3), scoring).points, 7, 'half of what they reached is still half');
  assert.equal(scoreAttempt(selection, cutOff(6, 0), scoring).points, 4, 'the floor holds however far they got');
  assert.equal(scoreAttempt(selection, cutOff(6, 6), scoring).reached, 6);
});

test('bonus adds a little and is capped', () => {
  const scoring = resolveScoring(curriculum);
  const graded = selectQuiz(base);
  const n = graded.length;
  const bonus = Array.from({ length: 9 }, (_, i) => ({ id: `B${i}`, role: 'bonus' }));
  const selection = [...graded, ...bonus];
  const answers = (correctGraded, correctBonus) => [
    ...graded.map(({ id, role }, i) => ({ id, role, choice: 0, correct: i < correctGraded })),
    ...bonus.slice(0, correctBonus).map(({ id, role }) => ({ id, role, choice: 0, correct: true })),
  ];

  // A perfect graded score has no room left: bonus can never push it past 100%.
  assert.equal(scoreAttempt(selection, answers(n, 0), scoring).points, 10);
  assert.equal(scoreAttempt(selection, answers(n, 2), scoring).points, 10, 'bonus cannot push a perfect score past 100%');
  assert.equal(scoreAttempt(selection, answers(n, 9), scoring).points, 10, 'nine right should still stop at the cap');
  assert.equal(scoreAttempt(selection, answers(n, 9), scoring).extra, scoring.bonus_max);

  // Short of full marks, bonus helps recover — but the total still can't cross 10.
  assert.equal(scoreAttempt(selection, answers(n - 2, 0), scoring).points, 9, 'missing two graded questions costs marks');
  assert.equal(scoreAttempt(selection, answers(n - 2, 9), scoring).points, 9.5, 'max bonus recovers some of it, capped at bonus_max');
  assert.equal(scoreAttempt(selection, answers(n - 4, 9), scoring).points, 8.5, 'bonus can only help, never fully erase a bigger miss');
});

test('bonus never changes the denominator or the graded share', () => {
  const scoring = resolveScoring(curriculum);
  const graded = selectQuiz(base);
  const bonus = Array.from({ length: 6 }, (_, i) => ({ id: `B${i}`, role: 'bonus' }));
  const gradedAnswers = graded.map(({ id, role }, i) => ({ id, role, choice: 0, correct: i < 9 }));
  const alone = scoreAttempt(graded, gradedAnswers, scoring);
  // Getting every bonus WRONG must leave the mark exactly where it was.
  const withWrongBonus = scoreAttempt([...graded, ...bonus], [
    ...gradedAnswers, ...bonus.map(({ id, role }) => ({ id, role, choice: 0, correct: false })),
  ], scoring);
  assert.equal(withWrongBonus.points, alone.points, 'wrong bonus answers moved the grade');
  assert.equal(withWrongBonus.max, alone.max, 'bonus leaked into the denominator');
  assert.equal(withWrongBonus.reached, alone.reached, 'bonus counted as a graded question');
});

// 12 graded questions, a 6-minute expected pace and a 9-minute window: Quiz 2.
const paceCase = (over) => ({
  done: 3, graded: 12, expectedSeconds: 360, windowSeconds: 540,
  poolLeft: 5, currentIsBonus: false, ...over,
});

test('a bonus only goes to a student who is ahead of the pace', () => {
  // On pace for 12 in 6 minutes, question 3 lands at 90s.
  assert.equal(shouldOfferBonus(paceCase({ elapsed: 60 })), true, 'a student ahead of pace should get one');
  assert.equal(shouldOfferBonus(paceCase({ elapsed: 90 })), false, 'exactly on pace is not ahead');
  assert.equal(shouldOfferBonus(paceCase({ elapsed: 200 })), false, 'a student behind must never be interrupted');
});

test('a bonus is never offered if the graded questions would not still fit', () => {
  // At Quiz 2's numbers the expected pace (360s/20 = 18s a question) is well
  // inside the window (540s/20 = 27s), so anyone ahead of pace comfortably fits
  // and this guard should never block them. Assert that, so a future change to
  // the minutes cannot quietly start starving fast students of extras.
  [3, 6, 9].forEach((done) => {
    const slowestStillAhead = (done / 12) * 360 - 1;
    assert.equal(shouldOfferBonus(paceCase({ done, elapsed: slowestStillAhead })), true,
      `at 6/9 a student ahead of pace should still get a bonus at question ${done}`);
  });

  // It binds when the window is tight, or when slow bonus questions have already
  // dragged the student's average up — which is exactly when a bonus would start
  // costing them graded questions, and "ungraded" would become a lie.
  assert.equal(shouldOfferBonus(paceCase({ done: 3, elapsed: 85, windowSeconds: 400 })), false,
    'a tight window must stop extras before they eat the graded set');
  assert.equal(shouldOfferBonus(paceCase({ done: 3, elapsed: 85, windowSeconds: 250 })), false,
    'an inflated average must stop extras before they eat the graded set');
});

test('extras keep coming once the graded set is finished', () => {
  assert.equal(shouldOfferBonus(paceCase({ done: 12, elapsed: 300 })), true);
  assert.equal(shouldOfferBonus(paceCase({ done: 12, elapsed: 300, currentIsBonus: true })), true,
    'after the graded set, one bonus should lead straight to the next');
  assert.equal(shouldOfferBonus(paceCase({ done: 12, elapsed: 540 })), false, 'not once the window is over');
  assert.equal(shouldOfferBonus(paceCase({ done: 12, elapsed: 300, poolLeft: 0 })), false, 'nothing left to give');
});

test('bonus questions interleave rather than arriving in a block', () => {
  assert.equal(shouldOfferBonus(paceCase({ done: 3, elapsed: 40 })), true);
  assert.equal(shouldOfferBonus(paceCase({ done: 3, elapsed: 40, currentIsBonus: true })), false,
    'a bonus must not immediately trigger another while graded questions remain');
  assert.equal(shouldOfferBonus(paceCase({ done: 4, elapsed: 50 })), false, 'checked every few questions, not every one');
});

test('an untimed quiz never offers a bonus', () => {
  assert.equal(shouldOfferBonus(paceCase({ elapsed: 10, windowSeconds: 0, expectedSeconds: 0 })), false);
});

test('bonus questions are unseen and climb in difficulty', () => {
  const activities = { stereo: 2, dante: 1 };
  const selection = selectQuiz({ ...base, activities });
  const graded = new Set(selection.map(({ id }) => id));
  const bonus = selectBonus({ curriculum, bank, activities, exclude: [...graded], seed: 'b2' });
  assert.ok(bonus.every(({ id }) => !graded.has(id)), 'a bonus question repeated one from the graded set');
  assert.ok(bonus.every(({ role }) => role === 'bonus'));
  const levels = bonus.map(({ id }) => byId[id].level ?? 0);
  assert.deepEqual(levels, [...levels].sort((a, b) => a - b), `bonus levels should not go backwards: ${levels}`);
  const gated = bonus.map(({ id }) => byId[id].activity_gate).filter(Boolean);
  assert.ok(gated.every((gate) => (activities[gate] || 0) >= 1), 'bonus asked about gear the student hasn’t touched');
});

test('every Core skill has verified questions to draw on', () => {
  // The graded set is verified-only, so a Core skill with nothing verified can
  // never be tested — and one with a single verified question gives every student
  // the same item, which leaks. Fail on the first, warn on the second.
  const thin = [];
  Object.entries(curriculum.skills).filter(([, status]) => status === 'core').forEach(([skill]) => {
    const available = bank.questions.filter((question) => question.skill === skill
      && question.verified && !question.draft);
    assert.ok(available.length > 0, `Core skill "${skill}" has no verified question, so it can never be graded`);
    if (available.length < 2) thin.push(skill);
  });
  if (thin.length) console.log(`      (thin — only one verified question each: ${thin.join(', ')})`);
});

test('the graded set fits the time it is given', () => {
  const quiz = curriculum.quizzes[String(curriculum.quiz_number)];
  if (!quiz?.window_minutes) return;
  const count = curriculum.targets.graded_questions;
  const perQuestion = (quiz.window_minutes * 60) / count;
  assert.ok(perQuestion >= 20,
    `${count} questions in ${quiz.window_minutes} minutes is ${perQuestion.toFixed(0)}s each — too tight`);
  assert.ok(quiz.expected_minutes < quiz.window_minutes,
    'the expected pace should be inside the window, not equal to it');
  console.log(`      (${count} graded in ${quiz.expected_minutes}/${quiz.window_minutes} min = ${((quiz.expected_minutes * 60) / count).toFixed(0)}s expected, ${perQuestion.toFixed(0)}s allowed)`);
});

test('a Quiz 1 code from before per-question timing still reads correctly', () => {
  // Students paste last week's code into this week's quiz, so the old two-character
  // result shape has to keep parsing — including the missed-Core flag that drives
  // next week's spaced retrieval.
  const old = parseResult('c0');
  assert.ok(old.isCore && !old.correct, 'an old missed-Core result stopped reading as missed');
  assert.equal(old.choice, null);
  assert.equal(old.seconds, null);
  assert.ok(parseResult('p1').correct);
  assert.ok(!parseResult('p1').isCore);

  const selection = selectQuiz(base);
  const missed = selection.find(({ role }) => role === 'core');
  const prior = { a: { [missed.id]: 'c0' }, sk: {}, seen: [] };
  const week2 = { ...curriculum, quiz_number: 2 };
  const quiz2 = selectQuiz({ curriculum: week2, bank, seed: 'w2-old', activities: {}, prior });
  assert.ok(quiz2.length, 'selection failed on an old-format prior code');
});

test('per-question time and the chosen answer survive the round trip', () => {
  const selection = selectQuiz(base);
  const answers = answerAll(selection, () => false);
  const times = Object.fromEntries(selection.map(({ id }, i) => [id, i + 7]));
  const attempt = { ...attemptFor({ selection, answers }), times, elapsedSeconds: 372, capture: { pacing: 'rushed', note: 'x' } };
  const payload = buildPayload({ curriculum, bank, attempt, appVersion: 'test' });
  const state = decodeStateCode(encodeStateCode(payload)).state;
  assert.equal(state.el, 372, 'total elapsed time was lost');
  assert.equal(state.pc, 'r', 'the pacing tap was lost');
  assert.equal(state.fb, undefined, 'the free-text note must stay out of the pasted code');
  selection.forEach(({ id }, i) => {
    const parsed = parseResult(state.a[id]);
    assert.equal(parsed.seconds, i + 7, `time for ${id} was lost`);
    assert.equal(parsed.choice, answers[i].choice, `chosen answer for ${id} was lost`);
  });
});

test('the quiz is worth target_total_points in Canvas', () => {
  assert.equal(curriculum.target_total_points, 10, 'update this test if the point target changes');
  const scoring = resolveScoring(curriculum);
  assert.equal(scoring.participation_points + scoring.correct_points, curriculum.target_total_points,
    'participation and correctness should add up to the Canvas total');
  const selection = selectQuiz(base);
  assert.equal(scoreAttempt(selection, answerAll(selection), scoring).max, curriculum.target_total_points);

  // The legacy even split still works for a curriculum written before this change.
  const legacy = { target_total_points: 10, targets: { total_questions: 20 } };
  assert.deepEqual(resolveScoring(legacy), { core_correct: 0.5, practice_completed: 0.5 });
});

test('review list puts missed Core first, then bonus misses', () => {
  const graded = selectQuiz(base);
  const missedSkill = byId[graded[0].id].skill;
  const answers = [
    ...graded.map(({ id, role }) => ({ id, role, correct: byId[id].skill !== missedSkill })),
    // A bonus question they got wrong is still worth telling them about.
    { id: 'LIVE_MM_001', role: 'bonus', correct: false },
  ];
  const review = reviewSkills(answers, bank, curriculum);
  assert.equal(review[0], missedSkill, 'a missed Core skill should lead the list');
  assert.ok(review.includes('mains_monitors'), 'a missed bonus skill should still be reviewable');
  assert.ok(reviewSkills(answers, bank, curriculum).length <= curriculum.review_next_max);
});

test('Quiz 2 adapts to a pasted Quiz 1 code', () => {
  const quiz1 = selectQuiz({ ...base, activities: { stereo: 1 } });
  const missed = quiz1.find(({ id }) => byId[id].skill === 'phantom_power');
  const answers = answerAll(quiz1, (question) => question.skill !== 'phantom_power');
  const payload = buildPayload({ curriculum, bank, attempt: attemptFor({ selection: quiz1, answers, activities: { stereo: 1, daw: 0 } }), appVersion: 'test' });
  assert.deepEqual(payload.act, { stereo: 1 });
  assert.equal(payload.n, 1);
  const missedResult = parseResult(payload.a[missed.id]);
  assert.ok(missedResult.isCore && !missedResult.correct, `expected a missed Core result, got "${payload.a[missed.id]}"`);
  const prior = decodeStateCode(encodeStateCode(payload)).state;
  // Guarantee mains_monitors was practiced last week, regardless of whether quiz1's
  // random draw happened to include it — the assertion below is about the promotion
  // boost, not about quiz1's luck with an ever-growing Practice pool.
  prior.a.LIVE_MM_001 = 'p1';
  prior.sk.mains_monitors = '1';

  const week2 = { ...curriculum, quiz_number: 2 };
  for (let i = 0; i < 20; i += 1) {
    const quiz2 = selectQuiz({ curriculum: week2, bank, seed: `w2-${i}`, activities: { stereo: 1 }, prior });
    const phantom = quiz2.filter(({ id }) => byId[id].skill === 'phantom_power');
    // Only 12 of the Core skills are drawn each week, so a missed skill coming
    // back is the strongest guarantee the design makes — and it has to hold.
    assert.equal(phantom.length, 1, 'missed Core skill should come back');
    assert.notEqual(phantom[0].id, missed.id, 'missed skill should return as a different question');
  }

  const quiz2 = selectQuiz({ curriculum: week2, bank, seed: 'w2', activities: { stereo: 1 }, prior });
  const payload2 = buildPayload({ curriculum: week2, bank, attempt: attemptFor({ selection: quiz2, answers: answerAll(quiz2), activities: { stereo: 1 }, prior, quiz: 2 }), appVersion: 'test' });
  assert.equal(payload2.sk.phantom_power, '01');
  assert.ok(Object.keys(prior.a).every((id) => payload2.seen.includes(id)));
});

test('the Canvas code stays a reasonable length, even for a student who answers everything', () => {
  const graded = selectQuiz({ ...base, activities: { stereo: 2, dante: 1, x32compact: 1 } });
  const typical = buildPayload({ curriculum, bank, attempt: attemptFor({ selection: graded, answers: answerAll(graded) }), appVersion: '0.1.0' });
  const typicalCode = encodeStateCode(typical);
  assert.ok(typicalCode.length < 1500, `a graded-only code is ${typicalCode.length} characters`);

  // The worst case is a fast student who gets through the graded set and then
  // every bonus question the window allows. Students copy this into Canvas by
  // hand if the button fails, so it has to stay something a person can handle.
  const bonus = selectBonus({ curriculum, bank, activities: { stereo: 2, dante: 1, x32compact: 1 }, exclude: graded.map(({ id }) => id), seed: 'max' });
  const everything = [...graded, ...bonus];
  const full = buildPayload({ curriculum, bank, attempt: attemptFor({ selection: everything, answers: answerAll(everything) }), appVersion: '0.1.0' });
  const fullCode = encodeStateCode(full);
  assert.ok(fullCode.length < 3000, `answering all ${everything.length} questions gives a ${fullCode.length}-character code`);
  console.log(`      (code length: ${typicalCode.length} graded only, ${fullCode.length} with all ${bonus.length} bonus)`);
});

if (failures) {
  console.error(`\n${failures} test(s) failed`);
  process.exit(1);
}
console.log('\nAll tests passed');
