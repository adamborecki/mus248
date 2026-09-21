// Question selection, scoring, and next-week state. Pure functions with no DOM
// or storage, so the browser and the tests run exactly the same logic.

import { STATE_SCHEMA } from './state-code.js';

const HISTORY_LENGTH = 5;
const SEEN_LIMIT = 40;
const ID_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

// One answer, packed into the pasted code: role, right/wrong, which choice was
// picked, and how long it took. Quiz 1 codes hold only the first two characters,
// so both shapes have to parse — students paste last week's code into this week's
// quiz, and a code from before this change must keep working.
export const encodeResult = ({ role, correct, choice, seconds }) => [
  role === 'core' ? 'c' : role === 'bonus' ? 'b' : 'p',
  correct ? '1' : '0',
  Number.isInteger(choice) ? choice.toString(36) : '0',
  Number.isFinite(seconds) ? Math.min(Math.max(0, Math.round(seconds)), 46655).toString(36) : '',
].join('');

export function parseResult(value) {
  const text = String(value ?? '');
  return {
    roleKey: text[0] === 'c' || text[0] === 'b' ? text[0] : 'p',
    isCore: text[0] === 'c',
    isBonus: text[0] === 'b',
    correct: text[1] === '1',
    choice: text.length > 2 ? Number.parseInt(text[2], 36) : null,
    seconds: text.length > 3 ? Number.parseInt(text.slice(3), 36) : null,
  };
}

export const statusOf = (curriculum, skill) => curriculum.skills?.[skill] || 'inactive';
export const indexQuestions = (bank) => Object.fromEntries(bank.questions.map((question) => [question.id, question]));

export function hashString(text) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

// mulberry32: small seeded PRNG so a saved seed always reproduces the same quiz.
export function createRng(seed) {
  let state = hashString(String(seed));
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle(items, rng) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function randomId(length = 6) {
  const values = new Uint32Array(length);
  if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(values);
  else values.forEach((_, i) => { values[i] = Math.floor(Math.random() * 2 ** 32); });
  return Array.from(values, (value) => ID_ALPHABET[value % ID_ALPHABET.length]).join('');
}

// Activity-gated questions need the activity once; a level-N variant needs it N times (3 = "3+").
function isEligible(question, curriculum, activities, includeDrafts) {
  if (question.draft && !includeDrafts) return false;
  if (statusOf(curriculum, question.skill) === 'inactive') return false;
  if (!question.activity_gate) return question.level <= (curriculum.max_common_level ?? 1);
  const count = activities[question.activity_gate] || 0;
  return count >= 1 && question.level <= Math.min(count, 3);
}

// What last week's code tells us. With no code, everything here is empty and
// selection is purely curriculum + activities: no invented adaptation.
export function readPrior(prior, bank) {
  const byId = indexQuestions(bank);
  const context = { seen: new Set(prior?.seen || []), missedCore: new Set(), practicedOnly: new Set(), history: { ...(prior?.sk || {}) } };
  const roles = {};
  Object.entries(prior?.a || {}).forEach(([id, result]) => {
    context.seen.add(id);
    const skill = byId[id]?.skill;
    if (!skill) return;
    const parsed = parseResult(result);
    (roles[skill] ||= new Set()).add(parsed.roleKey);
    if (parsed.isCore && !parsed.correct) context.missedCore.add(skill);
  });
  Object.entries(roles).forEach(([skill, kinds]) => { if (!kinds.has('c')) context.practicedOnly.add(skill); });
  return context;
}

function priority(question, context, curriculum, activities) {
  const { skill } = question;
  const history = context.history[skill] || '';
  let score = context.rng() * 10;
  if (context.missedCore.has(skill)) score += 100;
  else if (history.endsWith('0')) score += 40;
  if (context.practicedOnly.has(skill) && statusOf(curriculum, skill) === 'core') score += 60;
  if (history.endsWith('11')) score -= 20;
  if (context.seen.has(question.id)) score -= 60;
  const repetitions = question.activity_gate ? activities[question.activity_gate] || 0 : 0;
  score += repetitions >= 2 ? question.level * 8 : -question.level * 4;
  return score;
}

// Greedy pick that covers as many skills (and activities) as possible before doubling up.
function pick(pool, count, tally, score) {
  const candidates = pool.map((question) => ({ question, base: score(question) }));
  const adjusted = ({ question, base }) => base
    - 1000 * (tally.skill[question.skill] || 0)
    - 300 * (question.activity_gate ? tally.gate[question.activity_gate] || 0 : 0);
  const chosen = [];
  while (chosen.length < count && candidates.length) {
    let best = 0;
    candidates.forEach((candidate, i) => { if (adjusted(candidate) > adjusted(candidates[best])) best = i; });
    const [{ question }] = candidates.splice(best, 1);
    chosen.push(question);
    tally.skill[question.skill] = (tally.skill[question.skill] || 0) + 1;
    if (question.activity_gate) tally.gate[question.activity_gate] = (tally.gate[question.activity_gate] || 0) + 1;
  }
  return chosen;
}

function spreadSkills(questions) {
  const out = [...questions];
  for (let i = 1; i < out.length; i += 1) {
    if (out[i].skill !== out[i - 1].skill) continue;
    const j = out.findIndex((question, k) => k > i && question.skill !== out[i - 1].skill);
    if (j > -1) [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Returns [{ id, role }]. Role comes from the instructor's weekly curriculum only;
// student history changes which variants appear, never what counts as Core.
export function selectQuiz({ curriculum, bank, activities = {}, prior = null, seed, includeDrafts = false }) {
  const targets = curriculum.targets || {};
  const rng = createRng(`${seed}:select`);
  const context = { ...readPrior(prior, bank), rng };
  const status = (question) => statusOf(curriculum, question.skill);
  const score = (question) => priority(question, context, curriculum, activities);

  // A fixed number of graded questions, Core only, and only ones the instructor
  // has verified: an AI-drafted question nobody has checked must never cost a
  // student marks. Everything else — Practice skills, unverified items, harder
  // levels — becomes bonus material instead. The count stays the same however
  // many skills become Core, so the quiz never outgrows its own clock.
  if (targets.graded_questions) {
    const pool = gradedPool({ curriculum, bank, activities, includeDrafts });
    const chosen = pick(pool, targets.graded_questions, { skill: {}, gate: {} }, score);
    return spreadSkills(shuffle(chosen, rng)).map((question) => ({ id: question.id, role: 'core' }));
  }

  // Legacy shape, kept so a curriculum written before the fixed graded set still
  // builds the quiz it used to.
  const eligible = bank.questions.filter((question) => isEligible(question, curriculum, activities, includeDrafts));
  const common = eligible.filter((question) => !question.activity_gate);
  const tally = { skill: {}, gate: {} };
  const chosen = pick(eligible.filter((question) => question.activity_gate), targets.activity_aware_questions, tally, score);
  const coreNeeded = targets.core_questions - chosen.filter((question) => status(question) === 'core').length;
  chosen.push(...pick(common.filter((question) => status(question) === 'core'), coreNeeded, tally, score));
  chosen.push(...pick(common.filter((question) => status(question) === 'practice'), targets.total_questions - chosen.length, tally, score));
  const used = new Set(chosen.map((question) => question.id));
  chosen.push(...pick(eligible.filter((question) => !used.has(question.id)), targets.total_questions - chosen.length, tally, score));

  return spreadSkills(shuffle(chosen, rng)).map((question) => ({ id: question.id, role: status(question) }));
}

// What may be graded: eligible, Core, and verified.
export function gradedPool({ curriculum, bank, activities = {}, includeDrafts = false }) {
  return bank.questions.filter((question) => isEligible(question, curriculum, activities, includeDrafts)
    && statusOf(curriculum, question.skill) === 'core'
    && (question.verified || includeDrafts));
}

// Extras for a student who is ahead of the pace, drawn from everything the graded
// set didn't use: Practice skills, questions not yet verified, and the harder
// levels the graded set deliberately excludes. They carry only a small capped
// bonus, so a fast reader gets more practice without out-ranking a careful one.
//
// Order: what this student got wrong in earlier weeks comes back first, because a
// second look at a miss is worth more than a fresh question. Within that, a
// different question on the skill beats an exact repeat — but an exact repeat is
// allowed rather than letting a thin skill go unrevisited. Then difficulty climbs
// as the window runs on.
export function selectBonus({
  curriculum, bank, activities = {}, prior = null, exclude = [], seed, limit = 30, includeDrafts = false,
}) {
  const rng = createRng(`${seed}:bonus`);
  const used = new Set(exclude);
  const context = readPrior(prior, bank);
  const eligible = bank.questions.filter((question) => !used.has(question.id)
    && (includeDrafts || !question.draft)
    && statusOf(curriculum, question.skill) !== 'inactive'
    && (!question.activity_gate || (activities[question.activity_gate] || 0) >= 1));

  const wasMissed = (question) => context.missedCore.has(question.skill)
    || (context.history[question.skill] || '').endsWith('0');
  const rank = (question) => [
    wasMissed(question) ? 0 : 1,
    context.seen.has(question.id) ? 1 : 0,
    question.level ?? 0,
  ];
  const ordered = shuffle(eligible, rng).sort((a, b) => {
    const left = rank(a);
    const right = rank(b);
    return left[0] - right[0] || left[1] - right[1] || left[2] - right[2];
  });
  return ordered.slice(0, limit).map((question) => ({ id: question.id, role: 'bonus' }));
}

// Should this student be handed a bonus question right now?
//
// Two things have to be true. They must be ahead of the expected pace — that is
// what keeps extras away from anyone at risk of running out of time. And the
// graded questions they have left must still fit in the window AFTER the bonus,
// at the pace they have actually been working at.
//
// The second test matters because a bonus costs window time, and the window is
// what the graded set has to fit inside. Without it, a student who starts fast,
// collects extras and then slows down can be cut off before finishing the graded
// set and lose real points.
export function shouldOfferBonus({
  done, graded, elapsed, expectedSeconds, windowSeconds,
  poolLeft, currentIsBonus, checkEvery = 3, safety = 0.75,
}) {
  if (!poolLeft || !windowSeconds || elapsed >= windowSeconds) return false;
  // Nothing left to protect once the graded set is done: keep them coming.
  if (done >= graded) return true;
  if (!expectedSeconds) return false;
  // A bonus doesn't advance the graded count, so without this the same check
  // passes again and again and the extras arrive as one block.
  if (currentIsBonus) return false;
  if (done <= 0 || done % checkEvery !== 0) return false;
  if (elapsed >= (done / graded) * expectedSeconds) return false;

  const perQuestion = elapsed / done;
  const needed = (graded - done + 1) * perQuestion;
  return needed <= (windowSeconds - elapsed) * safety;
}

export function choiceOrder(question, seed) {
  const indexes = question.choices.map((_, i) => i);
  return question.shuffle === false ? indexes : shuffle(indexes, createRng(`${seed}:${question.id}`));
}

// How the 10 points are made up. Participation is spread across the graded
// questions a student actually reaches, correctness across the ones they get
// right, and bonus questions add a small capped amount on top.
//
// Falls back to the old even-split shape so a curriculum written before this
// change still scores the way it used to.
export function resolveScoring(curriculum) {
  const scoring = curriculum.scoring || {};
  if (scoring.participation_points != null || scoring.correct_points != null) {
    return {
      participation_points: scoring.participation_points ?? 0,
      correct_points: scoring.correct_points ?? 0,
      bonus_per_correct: scoring.bonus_per_correct ?? 0,
      bonus_max: scoring.bonus_max ?? 0,
      total_points: curriculum.target_total_points
        ?? (scoring.participation_points ?? 0) + (scoring.correct_points ?? 0),
    };
  }
  if (curriculum.scoring) return curriculum.scoring;
  const total = curriculum.targets?.total_questions;
  if (curriculum.target_total_points != null && total) {
    const perQuestion = curriculum.target_total_points / total;
    return { core_correct: perQuestion, practice_completed: perQuestion };
  }
  return {};
}

export function scoreAttempt(selection, answers, scoring = {}) {
  const given = answers.filter(Boolean);
  // Bonus questions sit outside the graded set entirely. They can add a small
  // capped amount on top, but they are never part of the denominator, so no one
  // can raise their own ceiling by reading faster than the person next to them.
  const graded = selection.filter((item) => item.role !== 'bonus');
  const gradedTotal = graded.length;
  const coreTotal = graded.filter((item) => item.role === 'core').length;
  const practiceTotal = gradedTotal - coreTotal;
  const isGraded = (answer) => answer.role !== 'bonus';
  const reached = given.filter(isGraded).length;
  const coreCorrect = given.filter((answer) => answer.role === 'core' && answer.correct).length;
  const gradedCorrect = given.filter((answer) => isGraded(answer) && answer.correct).length;
  const practiceDone = given.filter((answer) => answer.role === 'practice').length;
  const bonusDone = given.filter((answer) => answer.role === 'bonus').length;
  const bonusCorrect = given.filter((answer) => answer.role === 'bonus' && answer.correct).length;
  const round = (n) => Math.round(n * 100) / 100;

  if (scoring.participation_points == null && scoring.correct_points == null) {
    // Legacy even split, kept so older curricula score unchanged.
    const corePoints = scoring.core_correct ?? 1;
    const practicePoints = scoring.practice_completed ?? 1;
    return {
      coreCorrect, coreTotal, practiceDone, practiceTotal, bonusDone, bonusCorrect,
      reached,
      points: round(coreCorrect * corePoints + practiceDone * practicePoints),
      max: round(coreTotal * corePoints + practiceTotal * practicePoints),
    };
  }

  const totalPoints = scoring.total_points ?? 10;
  const perParticipation = gradedTotal ? scoring.participation_points / gradedTotal : 0;
  const perCorrect = gradedTotal ? scoring.correct_points / gradedTotal : 0;
  const earned = reached * perParticipation + gradedCorrect * perCorrect;
  // Scored on what they reached, so running out of time costs nobody a mark they
  // had no chance to earn. Someone cut off at 6 of 12, all correct, gets 100%.
  const possible = reached * (perParticipation + perCorrect);
  const share = possible ? earned / possible : 0;
  const extra = Math.min(bonusCorrect * (scoring.bonus_per_correct ?? 0), scoring.bonus_max ?? 0);

  return {
    coreCorrect, coreTotal, practiceDone, practiceTotal, bonusDone, bonusCorrect,
    reached,
    extra: round(extra),
    // Bonus can only help someone recover points they missed on the graded set —
    // it never lifts a perfect score past the total, so nobody scores over 100%.
    points: round(Math.min(share * totalPoints + extra, totalPoints)),
    max: round(totalPoints),
  };
}

// Missed Core skills first, then anything else they got wrong — skills headed for
// Core first. Bonus counts here even though it barely counts for marks: a student
// wants to know what they got wrong, not what it was worth.
export function reviewSkills(answers, bank, curriculum, limit = curriculum.review_next_max ?? 4) {
  const byId = indexQuestions(bank);
  const soon = new Set(curriculum.coming_to_core || []);
  const missed = (match) => [...new Set(answers
    .filter((answer) => answer && match(answer.role) && !answer.correct)
    .map((answer) => byId[answer.id]?.skill)
    .filter(Boolean))];
  const rest = missed((role) => role !== 'core').sort((a, b) => soon.has(b) - soon.has(a));
  return [...new Set([...missed((role) => role === 'core'), ...rest])].slice(0, limit);
}

// Compact keys keep the pasted code short. See README for the field list.
export function buildPayload({ curriculum, bank, attempt, appVersion, completedAt = new Date().toISOString() }) {
  const byId = indexQuestions(bank);
  const { prior } = attempt;
  const answers = attempt.answers.filter(Boolean);
  const results = {};
  const history = { ...(prior?.sk || {}) };
  answers.forEach(({ id, role, correct, choice }) => {
    results[id] = encodeResult({ role, correct, choice, seconds: attempt.times?.[id] });
    const skill = byId[id]?.skill;
    if (skill) history[skill] = `${history[skill] || ''}${correct ? 1 : 0}`.slice(-HISTORY_LENGTH);
  });
  const seen = [...new Set([...Object.keys(prior?.a || {}), ...(prior?.seen || [])])].slice(0, SEEN_LIMIT);
  const activities = Object.fromEntries(Object.entries(attempt.activities || {}).filter(([, count]) => count > 0));
  const score = scoreAttempt(attempt.selection, answers, resolveScoring(curriculum));
  return {
    s: STATE_SCHEMA,
    app: appVersion,
    q: attempt.quiz,
    v: attempt.quizVersion,
    id: attempt.learnerId,
    t: completedAt,
    seed: attempt.seed,
    n: attempt.deviceAttempt || 1,
    act: activities,
    a: results,
    sk: history,
    seen,
    sc: [score.coreCorrect, score.coreTotal, score.practiceDone, score.practiceTotal, score.points, score.max],
    // Timing and the pacing tap. `el` is the whole graded run in seconds; the
    // per-question times ride inside each `a` value. The free-text note is
    // deliberately NOT here — it belongs in the readable submission, where a
    // person reads it, rather than bloating a code students have to paste.
    ...(Number.isFinite(attempt.elapsedSeconds) ? { el: attempt.elapsedSeconds } : {}),
    ...(attempt.capture?.pacing ? { pc: attempt.capture.pacing[0] } : {}),
    ...(score.bonusDone ? { bn: [score.bonusDone, score.bonusCorrect] } : {}),
    ...(score.extra ? { xc: score.extra } : {}),
    ...(score.reached != null ? { rc: score.reached } : {}),
  };
}
