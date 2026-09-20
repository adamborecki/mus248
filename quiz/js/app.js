import { buildPayload, choiceOrder, indexQuestions, randomId, reviewSkills, selectQuiz, statusOf } from './engine.js';
import { escapeHtml } from './html.js';
import { decodeStateCode, encodeStateCode, findStateCodes } from './state-code.js';

const APP_VERSION = '0.2.0';
const ATTEMPT_KEY = 'mus248-quiz:attempt';
const LAST_CODE_KEY = 'mus248-quiz:last-code';
const ATTEMPTS_KEY = 'mus248-quiz:attempts';
const UNLOCK_KEY = 'mus248-quiz:unlocked';
const params = new URLSearchParams(location.search);
const DEBUG = params.has('debug');
const ACTIVITY_CHOICES = [[0, '0'], [1, '1'], [2, '2'], [3, '3+']];
const PRIOR_ERRORS = {
  missing: 'We couldn’t find a quiz code in that text. Codes start with M248Q.',
  incomplete: 'That code looks cut off. Copy the whole thing, all the way to the end, and try again.',
  checksum: 'That code doesn’t check out. Part of it may be missing or changed. Try copying it again.',
  format: 'That code couldn’t be read. Try copying it again.',
  newer: 'That code came from a newer version of the quiz. Refresh this page and try again.',
};

const app = document.getElementById('app');
const on = (selector, event, handler) => app.querySelector(selector)?.addEventListener(event, handler);

// localStorage can be missing (private browsing); the quiz still works, it just can't resume.
const storage = {
  read(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
  write(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* no resume */ } },
  remove(key) { try { localStorage.removeItem(key); } catch { /* nothing saved */ } },
};

let data;
let attempt = null;
let setup = null;
let announcedQuiz = null;

const isMakeup = () => announcedQuiz !== null && data.curriculum.quiz_number !== announcedQuiz;

const save = () => storage.write(ATTEMPT_KEY, attempt);
const label = (skill) => data.bank.skills?.[skill] || skill.replace(/_/g, ' ');
const timesLabel = (count) => (count >= 3 ? '3+' : String(count));
const formatDate = (iso) => new Date(iso).toLocaleString('en-US', {
  weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
});
const badge = (role) => (role === 'core'
  ? '<span class="badge core">🟢 Core — graded</span>'
  : '<span class="badge practice">🟡 Practice — full credit this week</span>');
const progressBar = (done, total) => `<div class="progress" aria-hidden="true"><span style="width:${total ? (done / total) * 100 : 0}%"></span></div>`;

function show(html, { focus = 'h2', scroll = true } = {}) {
  app.innerHTML = html + (DEBUG ? debugPanel() : '');
  if (scroll) window.scrollTo(0, 0);
  if (focus) app.querySelector(focus)?.focus({ preventScroll: scroll });
}

async function loadJson(path) {
  const response = await fetch(path, { cache: 'no-cache' });
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}

// Not real security — a normalized string compared in the browser. It only
// keeps the quiz from being stumbled into; don't rely on it for anything more.
const normalizeCode = (value) => String(value ?? '').trim().toLowerCase().replace(/\s+/g, '');

// Each quiz has its own entry in `quizzes` — label, date, and access code. The
// code doesn't just unlock the week, it SELECTS it: entering Quiz 1's code runs
// Quiz 1. That is what makes a makeup possible. Without it the site serves only
// whatever quiz_number says, and a student who missed a week can never sit that
// week's quiz no matter which code they are given.
//
// To close a makeup window, delete that quiz's entry — its code stops working.
const quizConfig = (curriculum, number) => curriculum.quizzes?.[String(number)];

// The quiz number a code opens, or null if it opens nothing.
function quizForCode(curriculum, value) {
  const code = normalizeCode(value);
  if (!code) return null;
  const match = Object.entries(curriculum.quizzes || {})
    .find(([, quiz]) => normalizeCode(quiz.access_code) === code);
  return match ? Number(match[0]) : null;
}

// Everything downstream reads curriculum.quiz_number/_label/_version, so pointing
// those at the chosen quiz is all it takes to run an earlier one.
function applyQuiz(number) {
  const { curriculum } = data;
  const config = quizConfig(curriculum, number) || {};
  curriculum.quiz_number = number;
  curriculum.quiz_label = config.label || `Quiz ${number}`;
  curriculum.quiz_version = config.version || '';
  const makeup = isMakeup();
  document.getElementById('quiz-label').textContent = `Weekly Quiz · ${curriculum.quiz_label}${makeup ? ' · makeup' : ''}`;
  document.title = `${curriculum.quiz_label}${makeup ? ' (makeup)' : ''} · MUS 248`;
}

function enterQuiz(number) {
  applyQuiz(number);
  storage.write(UNLOCK_KEY, { quiz: number, code: normalizeCode(quizConfig(data.curriculum, number).access_code) });
  afterUnlock();
}

// Loud on purpose. A student seeing this is the signal that the week's setup was
// missed — far better than a class quietly taking the wrong quiz.
function renderNoCodeSet(curriculum) {
  show(`
    <section class="step">
      <h2 tabindex="-1">This quiz isn’t open yet</h2>
      <p>Quiz ${escapeHtml(String(curriculum.quiz_number))} has not been set up, so it can’t be started.</p>
      <p class="quiet">Tell your instructor you saw this — they’ll know what it means. Nothing is wrong on your end,
        and nothing you do here counts against you.</p>
      <p class="quiet small">In the meantime the <a href="../study/">study cards</a> are always open.</p>
    </section>`);
}

function renderGate() {
  show(`
    <section class="step">
      <h2 tabindex="-1">Enter this week’s access code</h2>
      <p class="quiet">Ask your instructor for the ${escapeHtml(data.curriculum.quiz_label)} access code.</p>
      <p class="quiet small">Making up an earlier quiz? Enter <em>that</em> quiz’s code instead and you’ll take that one.</p>
      <label class="field" for="access-code">Access code</label>
      <input id="access-code" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false">
      <div class="row"><button class="btn primary wide" id="unlock">Continue →</button></div>
      <p class="status" id="access-status" role="status"></p>
    </section>`, { focus: '#access-code' });
  const input = app.querySelector('#access-code');
  const tryUnlock = () => {
    const opens = quizForCode(data.curriculum, input.value);
    if (opens !== null) {
      enterQuiz(opens);
    } else {
      const status = app.querySelector('#access-status');
      status.className = 'status error';
      status.textContent = 'That code doesn’t match. Check with your instructor and try again.';
      input.select();
    }
  };
  on('#unlock', 'click', tryUnlock);
  input.addEventListener('keydown', (event) => { if (event.key === 'Enter') tryUnlock(); });
}

function afterUnlock() {
  const saved = storage.read(ATTEMPT_KEY);
  const usable = saved?.quiz === data.curriculum.quiz_number
    && (saved.phase === 'done' || saved.selection.every(({ id }) => data.byId[id]));
  if (usable) {
    attempt = saved;
    return attempt.phase === 'done' ? renderResults() : renderResume();
  }
  startFresh();
}

async function init() {
  const [curriculum, bank, deck] = await Promise.all(
    ['data/curriculum.json', 'data/questions.json', 'data/study-deck.json'].map(loadJson),
  );
  data = { curriculum, bank, deck, byId: indexQuestions(bank) };

  const announced = quizConfig(curriculum, curriculum.quiz_number);
  if (!announced) return renderNoCodeSet(curriculum);
  announcedQuiz = curriculum.quiz_number;
  applyQuiz(announcedQuiz);

  // A week with no code is open to anyone with the link.
  if (!normalizeCode(announced.access_code)) return afterUnlock();

  const fromUrl = quizForCode(curriculum, params.get('code'));
  if (fromUrl !== null) return enterQuiz(fromUrl);

  // A saved unlock only resumes the announced quiz. Sitting an earlier one is a
  // deliberate act, so a makeup asks for its code every time.
  const saved = storage.read(UNLOCK_KEY);
  if (saved?.quiz === announcedQuiz && quizForCode(curriculum, saved.code) === announcedQuiz) {
    return afterUnlock();
  }
  renderGate();
}

function startFresh() {
  storage.remove(ATTEMPT_KEY);
  attempt = null;
  setup = { prior: null, priorMode: null, priorStatus: null, message: '', code: '', activities: {} };
  renderStart();
}

// ---------- Start: previous code + activities ----------

// Quiz 1 has no earlier quiz, so there is no code to ask about.
const asksForCode = () => data.curriculum.quiz_number > 1;

function missingSteps() {
  const missing = [];
  if (asksForCode() && setup.priorMode !== 'none' && setup.priorStatus !== 'loaded') {
    missing.push(setup.priorMode === 'have'
      ? 'Step 1: paste a code that checks out, or choose “I don’t have it.”'
      : 'Step 1: choose “I have my code” or “I don’t have it.”');
  }
  const left = data.curriculum.activities.filter(({ id }) => !Number.isInteger(setup.activities[id])).length;
  if (left) missing.push(`${asksForCode() ? 'Step 2: ' : ''}answer ${left} more ${left === 1 ? 'activity' : 'activities'}.`);
  return missing.map((line) => line[0].toUpperCase() + line.slice(1)).join(' ');
}

function renderStart(options) {
  const { curriculum } = data;
  const askCode = asksForCode();
  const last = storage.read(LAST_CODE_KEY);
  const offerSaved = last?.code && last.quiz < curriculum.quiz_number && setup.priorStatus !== 'loaded';
  const statusClass = { loaded: 'ok', error: 'error' }[setup.priorStatus] || 'quiet';
  const stepNumber = (n) => (askCode ? `<span class="step-number">${n}</span>` : '');
  const option = (mode, text) => `<button class="option${setup.priorMode === mode ? ' is-on' : ''}" id="mode-${mode}" aria-pressed="${setup.priorMode === mode}">${text}</button>`;
  const activityRows = curriculum.activities.map(({ id, label: name }) => `
    <div class="activity" role="radiogroup" aria-labelledby="act-${id}-label">
      <span class="activity-name" id="act-${id}-label">${escapeHtml(name)}</span>
      <div class="segmented">
        ${ACTIVITY_CHOICES.map(([value, text]) => `<label><input type="radio" name="act-${id}" value="${value}"${setup.activities[id] === value ? ' checked' : ''} aria-label="${text === '3+' ? '3 or more' : text} times"><span>${text}</span></label>`).join('')}
      </div>
    </div>`).join('');
  const missing = missingSteps();

  show(`
    ${isMakeup() ? `<p class="notice makeup">You’re taking <strong>${escapeHtml(curriculum.quiz_label)}</strong> as a makeup. Submit it to that quiz’s Canvas assignment, not this week’s.</p>` : ''}
    <p class="notice">Want to review first? The <a href="../study/">study cards</a> are sorted by topic and marked Core or Practice.</p>
    ${askCode ? `
    <section class="step">
      <h2 tabindex="-1">${stepNumber(1)}Last quiz’s code</h2>
      <p class="quiet">Your Canvas submission from last week ends with a quiz code. Pasting it lets this quiz pick up where you left off — any earlier quiz’s code works, not only last week’s. No code is fine too; it doesn’t affect your score.</p>
      <div class="choice-pair" role="group" aria-label="Do you have last quiz’s code?">
        ${option('have', 'I have my code')}
        ${option('none', 'I don’t have it')}
      </div>
      ${setup.priorMode === 'have' ? `
        ${offerSaved ? `<p class="notice">Your Quiz ${Number(last.quiz)} code is saved on this device. <button class="text-button" id="use-saved">Use it</button></p>` : ''}
        <label class="field" for="prior-code">Paste your code (or your whole Canvas submission)</label>
        <textarea id="prior-code" rows="3" spellcheck="false" autocomplete="off" placeholder="M248Q…">${escapeHtml(setup.code)}</textarea>
        <div class="row"><button class="btn secondary" id="load-prior">Check code</button></div>` : ''}
      <p class="status ${statusClass}" id="prior-status" role="status">${escapeHtml(setup.message)}</p>
    </section>` : ''}
    <section class="step">
      <h2 tabindex="-1">${stepNumber(2)}Activities you’ve done</h2>
      <p class="quiet">${setup.priorStatus === 'loaded'
        ? 'Filled in from your last quiz. Update anything you’ve done since.'
        : 'How many times have you done each one this semester? Count today too.'}</p>
      ${activityRows}
    </section>
    <div class="start">
      <button class="btn primary wide big" id="start"${missing ? ' disabled' : ''}>Continue →</button>
      <p class="quiet small center" id="start-hint">${escapeHtml(missing)}</p>
    </div>`, options);

  on('#mode-have', 'click', () => {
    if (setup.priorMode !== 'have') setup.message = '';
    setup.priorMode = 'have';
    renderStart({ focus: '#prior-code', scroll: false });
  });
  on('#mode-none', 'click', () => {
    Object.assign(setup, {
      priorMode: 'none',
      prior: null,
      priorStatus: null,
      message: 'Okay — same quiz, same points. It just won’t bring back the skills you missed last time. '
        + 'If you want that, your code is at the end of your Canvas submission from that week.',
    });
    renderStart({ focus: null, scroll: false });
  });
  const codeBox = app.querySelector('#prior-code');
  codeBox?.addEventListener('input', () => {
    setup.code = codeBox.value;
    if (findStateCodes(codeBox.value).length) loadPrior(codeBox.value);
  });
  on('#load-prior', 'click', () => loadPrior(codeBox.value));
  on('#use-saved', 'click', () => { setup.code = last.code; loadPrior(last.code); });
  app.querySelectorAll('.segmented input').forEach((input) => input.addEventListener('change', () => {
    setup.activities[input.name.slice(4)] = Number(input.value);
    const stillMissing = missingSteps();
    app.querySelector('#start').disabled = Boolean(stillMissing);
    app.querySelector('#start-hint').textContent = stillMissing;
  }));
  on('#start', 'click', startAttempt);
}

function loadPrior(text) {
  const { curriculum } = data;
  const result = decodeStateCode(text);
  setup.prior = null;
  if (!text.trim()) {
    setup.priorStatus = 'error';
    setup.message = 'Paste your code first, or choose “I don’t have it.”';
  } else if (!result.ok) {
    setup.priorStatus = 'error';
    setup.message = `${PRIOR_ERRORS[result.reason]} Or choose “I don’t have it” to continue without it.`;
  } else if (result.state.q >= curriculum.quiz_number) {
    setup.priorStatus = 'error';
    setup.message = `That code is from Quiz ${result.state.q}. Paste the code from an earlier quiz, or choose “I don’t have it.”`;
  } else {
    setup.prior = result.state;
    setup.priorStatus = 'loaded';
    setup.message = `Previous quiz loaded ✓ (Quiz ${result.state.q}, ${formatDate(result.state.t)})`;
    curriculum.activities.forEach(({ id }) => {
      if (!Number.isInteger(setup.activities[id])) setup.activities[id] = Math.min(result.state.act?.[id] || 0, 3);
    });
  }
  renderStart({ focus: null, scroll: false });
}

function startAttempt() {
  const { curriculum, bank } = data;
  const seed = randomId(8);
  const activities = { ...setup.activities };
  // Counts attempts per quiz on this device, so retakes show up in the submission.
  const attempts = storage.read(ATTEMPTS_KEY) || {};
  attempts[curriculum.quiz_number] = (attempts[curriculum.quiz_number] || 0) + 1;
  storage.write(ATTEMPTS_KEY, attempts);
  const selection = selectQuiz({
    curriculum,
    bank,
    activities,
    prior: setup.prior,
    seed,
    includeDrafts: Boolean(curriculum.include_drafts || (DEBUG && params.has('drafts'))),
  });
  attempt = {
    quiz: curriculum.quiz_number,
    quizVersion: curriculum.quiz_version,
    startedAt: new Date().toISOString(),
    learnerId: setup.prior?.id || randomId(6),
    seed,
    deviceAttempt: attempts[curriculum.quiz_number],
    activities,
    prior: setup.prior,
    selection,
    answers: [],
    index: 0,
    phase: 'intro',
  };
  save();
  renderIntro();
}

function renderResume() {
  const where = attempt.phase === 'quiz'
    ? `question ${attempt.index + 1} of ${attempt.selection.length}`
    : 'the start of the quiz';
  show(`
    <section class="stage">
      <h2 tabindex="-1">Pick up where you left off?</h2>
      <p>You have an unfinished ${escapeHtml(data.curriculum.quiz_label)} on this device. You were at ${where}.</p>
      <div class="row">
        <button class="btn primary" id="resume">Resume</button>
        <button class="btn secondary" id="restart">Start over</button>
      </div>
    </section>`);
  on('#resume', 'click', () => (attempt.phase === 'quiz' ? renderQuestion() : renderIntro()));
  on('#restart', 'click', () => {
    if (confirm('Start over? Your answers so far on this device will be cleared.')) startFresh();
  });
}

function renderIntro() {
  const total = attempt.selection.length;
  const core = attempt.selection.filter(({ role }) => role === 'core').length;
  show(`
    <section class="stage">
      <h2 tabindex="-1">Two kinds of questions</h2>
      <div class="kind">${badge('core')}<p>Graded for correctness. This is material you’re expected to know by now.</p></div>
      <div class="kind">${badge('practice')}<p>Full credit for answering. These help you learn material that may become Core on a future quiz.</p></div>
      <p>${total} questions, ${core} of them Core. After each one you’ll see the answer and a short explanation.</p>
      <button class="btn primary wide big" id="begin">Start the quiz →</button>
    </section>`);
  on('#begin', 'click', () => {
    attempt.phase = 'quiz';
    save();
    renderQuestion();
  });
}

// ---------- Questions ----------

function feedback(question, role, answer) {
  const correctText = escapeHtml(question.choices[question.answer_index]);
  const explanation = escapeHtml(question.explanation);
  if (answer.correct) {
    return `<div class="feedback good" tabindex="-1"><h3>✓ Correct${role === 'core' ? '' : ' · Practice complete'}</h3><p>${explanation}</p></div>`;
  }
  if (role === 'core') {
    return `<div class="feedback miss" tabindex="-1"><h3>Not quite. The answer is: ${correctText}</h3><p>${explanation}</p></div>`;
  }
  return `<div class="feedback practice" tabindex="-1"><h3>Practice complete</h3>
    <p><strong>The answer is: ${correctText}.</strong> ${explanation}</p></div>`;
}

function renderQuestion(options) {
  const i = attempt.index;
  const { id, role } = attempt.selection[i];
  const question = data.byId[id];
  const answer = attempt.answers[i];
  const total = attempt.selection.length;
  const isLast = i === total - 1;
  const choiceClass = (index) => {
    if (!answer) return '';
    if (index === question.answer_index) return 'is-answer';
    if (index === answer.choice) return role === 'core' ? 'is-wrong' : 'is-chosen';
    return 'is-dim';
  };

  show(`
    <section class="stage">
      <p class="eyebrow"><span>Question ${i + 1} of ${total}</span></p>
      ${progressBar(i + (answer ? 1 : 0), total)}
      ${badge(role)}
      <h2 class="prompt" tabindex="-1">${escapeHtml(question.prompt)}</h2>
      <fieldset class="choices${answer ? ' is-locked' : ''}"${answer ? ' disabled' : ''}>
        <legend class="sr-only">Choose one answer</legend>
        ${choiceOrder(question, attempt.seed).map((index, k) => `
          <label class="choice ${choiceClass(index)}">
            <input class="sr-only" type="radio" name="choice" value="${index}"${answer?.choice === index ? ' checked' : ''}>
            <span class="choice-letter" aria-hidden="true">${'ABCDEFGH'[k]}</span>
            <span class="choice-text">${escapeHtml(question.choices[index])}</span>
          </label>`).join('')}
      </fieldset>
      ${answer ? feedback(question, role, answer) : ''}
      <div class="row">
        ${answer
          ? `<button class="btn primary wide" id="next">${isLast ? 'See results →' : 'Next question →'}</button>`
          : '<button class="btn primary wide" id="check" disabled>Check answer</button>'}
      </div>
      ${DEBUG && !answer ? '<p class="center"><button class="text-button" id="debug-autofill">Debug: answer the rest randomly</button></p>' : ''}
    </section>`, options);

  app.querySelectorAll('.choice input').forEach((input) => input.addEventListener('change', () => {
    app.querySelectorAll('.choice').forEach((choice) => choice.classList.toggle('is-selected', choice.contains(input)));
    app.querySelector('#check').disabled = false;
  }));
  on('#check', 'click', () => {
    const picked = app.querySelector('.choice input:checked');
    if (!picked) return;
    const choice = Number(picked.value);
    attempt.answers[i] = { id, role, choice, correct: choice === question.answer_index };
    save();
    renderQuestion({ focus: '.feedback', scroll: false });
  });
  on('#next', 'click', () => {
    if (isLast) return finish();
    attempt.index += 1;
    save();
    renderQuestion();
  });
  on('#debug-autofill', 'click', () => {
    attempt.selection.forEach((item, k) => {
      if (attempt.answers[k]) return;
      const q = data.byId[item.id];
      const choice = Math.floor(Math.random() * q.choices.length);
      attempt.answers[k] = { id: item.id, role: item.role, choice, correct: choice === q.answer_index };
    });
    finish();
  });
}

function finish() {
  const payload = buildPayload({ curriculum: data.curriculum, bank: data.bank, attempt, appVersion: APP_VERSION });
  attempt.payload = payload;
  attempt.code = encodeStateCode(payload);
  attempt.phase = 'done';
  save();
  storage.write(LAST_CODE_KEY, { quiz: attempt.quiz, code: attempt.code });
  renderResults();
}

// ---------- Results + Canvas submission ----------

function submissionText(review) {
  const { payload, code } = attempt;
  const [coreCorrect, coreTotal, practiceDone, practiceTotal, points, max] = payload.sc;
  const activities = data.curriculum.activities
    .filter(({ id }) => payload.act[id])
    .map(({ id, label: name }) => `${name} ×${timesLabel(payload.act[id])}`);
  return [
    `MUS 248 Weekly Quiz ${payload.q}: completed`,
    `Completed: ${formatDate(payload.t)}`,
    `Attempt on this device: ${payload.n || 1}`,
    `App version: ${payload.app}`,
    '',
    'RESULTS',
    `Core: ${coreCorrect}/${coreTotal} correct`,
    `Practice: ${practiceDone}/${practiceTotal} completed`,
    `Quiz score: ${points}/${max}`,
    '',
    'REVIEW NEXT',
    ...(review.length ? review.map((skill) => `- ${label(skill)}`) : ['- Nothing missed']),
    '',
    'ACTIVITIES (self-reported)',
    activities.length ? activities.join(', ') : 'None yet',
    '',
    'QUIZ CODE (paste this into next week’s quiz)',
    code,
  ].join('\n');
}

function reviewItem(skill) {
  const cards = data.deck.cards.filter((card) => card.skill === skill).slice(0, 2);
  const missed = attempt.answers.find((answer) => answer && !answer.correct && data.byId[answer.id]?.skill === skill);
  const detail = cards.length
    ? cards.map((card) => `${card.front}: ${card.back}`).join(' ')
    : data.byId[missed?.id]?.explanation || '';
  return `<li><strong>${escapeHtml(label(skill))}</strong><span class="quiet">${escapeHtml(detail)}</span></li>`;
}

function answerList() {
  return attempt.selection.map(({ id, role }, i) => {
    const question = data.byId[id];
    const answer = attempt.answers[i];
    if (!question || !answer) return '';
    const mark = answer.correct ? '✓' : '✗';
    return `<div class="answer-item">
      ${badge(role)}
      <p class="answer-prompt">${i + 1}. ${escapeHtml(question.prompt)}</p>
      <p>Your answer: ${escapeHtml(question.choices[answer.choice])} <span aria-label="${answer.correct ? 'correct' : 'incorrect'}">${mark}</span></p>
      ${answer.correct ? '' : `<p>Answer: <strong>${escapeHtml(question.choices[question.answer_index])}</strong></p>`}
      <p class="quiet">${escapeHtml(question.explanation)}</p>
    </div>`;
  }).join('');
}

async function copySubmission() {
  const box = app.querySelector('#submission');
  const status = app.querySelector('#copy-status');
  let copied = false;
  try {
    await navigator.clipboard.writeText(box.value);
    copied = true;
  } catch {
    box.focus();
    box.select();
    try { copied = document.execCommand('copy'); } catch { copied = false; }
  }
  status.className = `status ${copied ? 'ok' : 'error'}`;
  status.textContent = copied
    ? 'Copied ✓ Paste this into Canvas.'
    : 'Couldn’t copy automatically. Select all the text in the box below and copy it.';
}

function renderResults() {
  const { curriculum, bank } = data;
  const [coreCorrect, coreTotal, practiceDone, practiceTotal, points, max] = attempt.payload.sc;
  const review = reviewSkills(attempt.answers, bank, curriculum);
  const soon = (curriculum.coming_to_core || [])
    .filter((skill) => statusOf(curriculum, skill) === 'practice' && !review.includes(skill));

  show(`
    <section class="stage">
      <h2 tabindex="-1">Quiz ${attempt.quiz} complete</h2>
      <div class="score-grid">
        <div class="score"><strong>${coreCorrect}/${coreTotal}</strong><span>Core correct</span></div>
        <div class="score"><strong>${practiceDone}/${practiceTotal}</strong><span>Practice done</span></div>
        <div class="score total"><strong>${points}/${max}</strong><span>Quiz score</span></div>
      </div>
    </section>
    <section class="step">
      <h2>Submit on Canvas</h2>
      <p>Copy this and paste it into the Canvas quiz assignment. Next week the quiz will ask for it again, so it can pick up where you left off.</p>
      <button class="btn primary wide big" id="copy">Copy Canvas submission</button>
      <p class="status" id="copy-status" role="status"></p>
      <label class="sr-only" for="submission">Canvas submission text</label>
      <textarea id="submission" class="submission" readonly rows="12">${escapeHtml(submissionText(review))}</textarea>
    </section>
    <section class="step">
      <h2>Review next</h2>
      ${review.length ? `<ul class="review-list">${review.map(reviewItem).join('')}</ul>` : '<p>Nothing missed. Nice work.</p>'}
      ${soon.length ? `<p class="quiet">Likely to become Core soon: ${soon.map((skill) => escapeHtml(label(skill))).join(', ')}.</p>` : ''}
      <p><a class="text-link" href="../study/">Open the study cards →</a></p>
    </section>
    <section class="step">
      <details class="answers"><summary>See all ${attempt.selection.length} questions and answers</summary>${answerList()}</details>
    </section>
    <p class="center"><button class="text-button" id="new-attempt">Start a new quiz on this device</button></p>`);

  on('#copy', 'click', copySubmission);
  app.querySelector('#submission').addEventListener('focus', (event) => event.target.select());
  on('#new-attempt', 'click', () => {
    if (confirm('This clears the results saved on this device. Copy your Canvas submission first if you haven’t yet. Continue?')) startFresh();
  });
}

// ---------- ?debug=1 ----------

function debugPanel() {
  const describe = ({ id, role }) => {
    const question = data.byId[id];
    return `${role.padEnd(8)} ${id}  ${question?.skill} L${question?.level}${question?.activity_gate ? ` gate=${question.activity_gate}` : ''}${question?.draft ? ' DRAFT' : ''}`;
  };
  const info = {
    quiz: data.curriculum.quiz_number,
    quiz_version: data.curriculum.quiz_version,
    setup,
    attempt: attempt && { ...attempt, selection: attempt.selection.map(describe) },
    skills: data.curriculum.skills,
  };
  return `<details class="debug" open><summary>Debug</summary><pre>${escapeHtml(JSON.stringify(info, null, 2))}</pre></details>`;
}

init().catch((error) => {
  console.error(error);
  app.innerHTML = '<p class="status error">The quiz couldn’t load. Check your connection and refresh the page.</p>';
});
