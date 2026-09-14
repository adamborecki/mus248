import { buildPayload, choiceOrder, indexQuestions, randomId, reviewSkills, selectQuiz, statusOf } from './engine.js';
import { decodeStateCode, encodeStateCode } from './state-code.js';

const APP_VERSION = '0.1.0';
const ATTEMPT_KEY = 'mus248-quiz:attempt';
const LAST_CODE_KEY = 'mus248-quiz:last-code';
const ATTEMPTS_KEY = 'mus248-quiz:attempts';
const params = new URLSearchParams(location.search);
const DEBUG = params.has('debug');
const ACTIVITY_CHOICES = [[0, 'Not yet'], [1, 'Once'], [2, '2+ times']];
const PRIOR_ERRORS = {
  missing: 'We couldn’t find a quiz code in that text. Codes start with M248Q.',
  incomplete: 'That code looks cut off. Copy the whole thing, all the way to the end, and try again.',
  checksum: 'That code doesn’t check out. Part of it may be missing or changed. Try copying it again.',
  format: 'That code couldn’t be read. Try copying it again.',
  newer: 'That code came from a newer version of the quiz. Refresh this page and try again.',
};

const app = document.getElementById('app');
const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
}[character]));
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

const save = () => storage.write(ATTEMPT_KEY, attempt);
const label = (skill) => data.bank.skills?.[skill] || skill.replace(/_/g, ' ');
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

async function init() {
  const [curriculum, bank, deck] = await Promise.all(
    ['data/curriculum.json', 'data/questions.json', 'data/study-deck.json'].map(loadJson),
  );
  data = { curriculum, bank, deck, byId: indexQuestions(bank), cardsById: Object.fromEntries(deck.cards.map((card) => [card.id, card])) };
  document.getElementById('quiz-label').textContent = `Weekly Quiz · ${curriculum.quiz_label}`;
  document.title = `${curriculum.quiz_label} · MUS 248`;

  const saved = storage.read(ATTEMPT_KEY);
  const usable = saved?.quiz === curriculum.quiz_number
    && (saved.phase === 'done' || saved.selection.every(({ id }) => data.byId[id]));
  if (usable) {
    attempt = saved;
    return attempt.phase === 'done' ? renderResults() : renderResume();
  }
  startFresh();
}

function startFresh() {
  storage.remove(ATTEMPT_KEY);
  attempt = null;
  setup = { prior: null, priorStatus: null, message: '', code: '', activities: {} };
  renderStart();
}

// ---------- Start: previous code + activities ----------

const isSetupReady = () => ['loaded', 'none'].includes(setup.priorStatus)
  && data.curriculum.activities.every(({ id }) => Number.isInteger(setup.activities[id]));

function renderStart(options) {
  const { curriculum } = data;
  const firstQuiz = curriculum.quiz_number === 1;
  const last = storage.read(LAST_CODE_KEY);
  const offerSaved = last?.code && last.quiz < curriculum.quiz_number && setup.priorStatus !== 'loaded';
  const statusClass = { loaded: 'ok', error: 'error', none: 'quiet' }[setup.priorStatus] || '';
  const activityRows = curriculum.activities.map(({ id, label: name }) => `
    <div class="activity" role="radiogroup" aria-labelledby="act-${id}-label">
      <span class="activity-name" id="act-${id}-label">${escapeHtml(name)}</span>
      <div class="segmented">
        ${ACTIVITY_CHOICES.map(([value, text]) => `<label><input type="radio" name="act-${id}" value="${value}"${setup.activities[id] === value ? ' checked' : ''}><span>${text}</span></label>`).join('')}
      </div>
    </div>`).join('');

  show(`
    <section class="step">
      <h2 tabindex="-1"><span class="step-number">1</span>Previous quiz code</h2>
      <p class="quiet">${firstQuiz
        ? 'This is the first quiz, so you probably don’t have one yet.'
        : 'Paste the code from your last quiz’s Canvas submission. Pasting the whole submission works too.'}</p>
      ${offerSaved ? `<p class="notice">Your Quiz ${Number(last.quiz)} code is saved on this device. <button class="text-button" id="use-saved">Use it</button></p>` : ''}
      <label class="sr-only" for="prior-code">Previous quiz code</label>
      <textarea id="prior-code" rows="3" spellcheck="false" autocomplete="off" placeholder="M248Q…">${escapeHtml(setup.code)}</textarea>
      <div class="row">
        <button class="btn secondary" id="load-prior">Load previous quiz</button>
        <button class="btn ${setup.priorStatus === 'none' ? 'primary' : 'secondary'}" id="no-prior" aria-pressed="${setup.priorStatus === 'none'}">I don’t have one yet</button>
      </div>
      <p class="status ${statusClass}" id="prior-status" role="status">${escapeHtml(setup.message)}</p>
    </section>
    <section class="step">
      <h2><span class="step-number">2</span>Activities you’ve done</h2>
      <p class="quiet">${setup.priorStatus === 'loaded'
        ? 'Filled in from your last quiz. Update anything you’ve done since.'
        : 'Count every time this semester, including today. This decides which questions you see.'}</p>
      ${activityRows}
    </section>
    <div class="start">
      <button class="btn primary wide big" id="start"${isSetupReady() ? '' : ' disabled'}>Start study cards →</button>
      <p class="quiet small center" id="start-hint">${isSetupReady() ? '' : 'Finish steps 1 and 2 to start.'}</p>
    </div>`, options);

  const codeBox = app.querySelector('#prior-code');
  codeBox.addEventListener('input', () => { setup.code = codeBox.value; });
  on('#load-prior', 'click', () => loadPrior(codeBox.value));
  on('#use-saved', 'click', () => { setup.code = last.code; loadPrior(last.code); });
  on('#no-prior', 'click', () => {
    setup.prior = null;
    setup.priorStatus = 'none';
    setup.message = firstQuiz ? 'No problem. On to step 2.' : 'Okay. This quiz won’t adapt to last week, and that’s fine.';
    renderStart({ focus: null, scroll: false });
  });
  app.querySelectorAll('.segmented input').forEach((input) => input.addEventListener('change', () => {
    setup.activities[input.name.slice(4)] = Number(input.value);
    const ready = isSetupReady();
    app.querySelector('#start').disabled = !ready;
    app.querySelector('#start-hint').textContent = ready ? '' : 'Finish steps 1 and 2 to start.';
  }));
  on('#start', 'click', startAttempt);
}

function loadPrior(text) {
  const { curriculum } = data;
  const result = decodeStateCode(text);
  setup.prior = null;
  if (!text.trim()) {
    setup.priorStatus = 'error';
    setup.message = 'Paste a code first, or choose “I don’t have one yet.”';
  } else if (!result.ok) {
    setup.priorStatus = 'error';
    setup.message = `${PRIOR_ERRORS[result.reason]} You can also continue without it.`;
  } else if (result.state.q >= curriculum.quiz_number) {
    setup.priorStatus = 'error';
    setup.message = `That code is from Quiz ${result.state.q}. Paste the code from an earlier quiz, or continue without one.`;
  } else {
    setup.prior = result.state;
    setup.priorStatus = 'loaded';
    setup.message = `Previous quiz loaded ✓ (Quiz ${result.state.q}, ${formatDate(result.state.t)})`;
    curriculum.activities.forEach(({ id }) => {
      if (!Number.isInteger(setup.activities[id])) setup.activities[id] = Math.min(result.state.act?.[id] || 0, 2);
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
    phase: 'deck',
    deck: { queue: curriculum.study_cards.filter((id) => data.cardsById[id]), done: 0 },
  };
  save();
  renderDeck();
}

function renderResume() {
  const where = attempt.phase === 'quiz'
    ? `question ${attempt.index + 1} of ${attempt.selection.length}`
    : 'the study cards';
  show(`
    <section class="stage">
      <h2 tabindex="-1">Pick up where you left off?</h2>
      <p>You have an unfinished ${escapeHtml(data.curriculum.quiz_label)} on this device. You were on ${where}.</p>
      <div class="row">
        <button class="btn primary" id="resume">Resume</button>
        <button class="btn secondary" id="restart">Start over</button>
      </div>
    </section>`);
  on('#resume', 'click', () => ({ deck: renderDeck, intro: renderIntro, quiz: renderQuestion }[attempt.phase] || renderDeck)());
  on('#restart', 'click', () => {
    if (confirm('Start over? Your answers so far on this device will be cleared.')) startFresh();
  });
}

// ---------- Study cards ----------

function renderDeck(revealed = false) {
  const { queue, done } = attempt.deck;
  if (!queue.length) {
    attempt.phase = 'intro';
    save();
    return renderIntro();
  }
  const card = data.cardsById[queue[0]];
  const total = done + queue.length;
  show(`
    <section class="stage">
      <h2 class="eyebrow" tabindex="-1"><span>Study cards</span><span>${done + 1} of ${total}</span></h2>
      ${progressBar(done, total)}
      <button class="flashcard${revealed ? ' is-revealed' : ''}" id="flip" aria-expanded="${revealed}">
        <span class="flashcard-front">${escapeHtml(card.front)}</span>
        ${revealed ? `<span class="flashcard-back">${escapeHtml(card.back)}</span>` : '<span class="flashcard-hint">Tap to reveal</span>'}
      </button>
      <div class="row split"${revealed ? '' : ' hidden'}>
        <button class="btn secondary" id="again">Review again</button>
        <button class="btn primary" id="got">Got it</button>
      </div>
      <p class="center"><button class="text-button" id="skip-deck">Skip to the quiz</button></p>
    </section>`, { focus: revealed ? '#got' : 'h2' });

  on('#flip', 'click', () => renderDeck(!revealed));
  on('#got', 'click', () => {
    queue.shift();
    attempt.deck.done += 1;
    save();
    renderDeck();
  });
  on('#again', 'click', () => {
    queue.push(queue.shift());
    save();
    renderDeck();
  });
  on('#skip-deck', 'click', () => {
    attempt.deck.queue = [];
    renderDeck();
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
  if (role === 'core') {
    return answer.correct
      ? `<div class="feedback good" tabindex="-1"><h3>✓ Correct</h3><p>${explanation}</p></div>`
      : `<div class="feedback miss" tabindex="-1"><h3>Not quite. The answer is: ${correctText}</h3><p>${explanation}</p></div>`;
  }
  return `<div class="feedback practice" tabindex="-1"><h3>Practice complete${answer.correct ? ' · You got it' : ''}</h3>
    <p>${answer.correct ? '' : `<strong>Answer: ${correctText}.</strong> `}${explanation}</p></div>`;
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
    .map(({ id, label: name }) => `${name} ×${payload.act[id] >= 2 ? '2+' : 1}`);
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
  const cards = data.deck.cards.filter((card) => card.skill === skill);
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
