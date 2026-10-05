// Study cards. Every card whose skill is active in quiz/data/curriculum.json appears,
// grouped by category and tagged Core or Practice. Students see both by default and can
// narrow to just Core or just Practice; the topic chips work within that choice.
// With a quiz code saved on the device (pasted here, on the quiz's first screen, or earned
// by taking the quiz) a fourth level appears: Missed — the cards for skills the student
// got wrong, most recent quiz first. The code never leaves the browser.
import { missedSkills } from '../quiz/js/engine.js';
import { escapeHtml } from '../quiz/js/html.js';
import { mountCodeBox, savedState } from '../quiz/js/saved-code.js';

const root = document.getElementById('study');
let body = root;
const state = { cards: [], categories: [], missed: [], category: 'All', level: 'all', order: [], index: 0, revealed: false, view: 'cards', shuffled: false };
const LEVELS = [['all', 'All'], ['core', 'Core'], ['practice', 'Practice'], ['missed', 'Missed']];
const LEVEL_NOTES = {
  all: 'Core cards are graded on the quiz. Practice cards get full credit and may become Core.',
  core: 'Core: graded on the quiz.',
  practice: 'Practice: full credit on the quiz this week, and may become Core.',
  missed: 'Missed: skills you got wrong on your quiz code, newest first. Answer one right on a later quiz and it drops off.',
};
let statusOf = () => 'inactive';
let skillLabels = {};
let curriculum = null;
let bank = null;
let deck = null;

async function loadJson(path) {
  const response = await fetch(path, { cache: 'no-cache' });
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const isMissed = (card) => state.missed.includes(card.skill);
const inLevel = (card) => state.level === 'all' || (state.level === 'missed' ? isMissed(card) : statusOf(card.skill) === state.level);
const missedTag = (card) => (isMissed(card) ? '<span class="badge missed">↺ Missed</span>' : '');
const inCategory = (card) => state.category === 'All' || card.category === state.category;
const visible = (card) => inLevel(card) && inCategory(card);
const badge = (card) => (statusOf(card.skill) === 'core'
  ? '<span class="badge core">Core</span>'
  : '<span class="badge practice">Practice</span>');

function rebuild() {
  const cards = state.cards.filter(visible);
  // In Missed, the most recent quiz's misses lead — unless the student shuffled.
  if (state.level === 'missed') cards.sort((a, b) => state.missed.indexOf(a.skill) - state.missed.indexOf(b.skill));
  state.order = state.shuffled ? shuffle(cards) : cards;
  state.index = 0;
  state.revealed = false;
  render();
}

function setCategory(category) {
  state.category = category;
  rebuild();
}

// Switching level keeps the chosen topic when it still has cards, otherwise falls back to All topics.
function setLevel(level) {
  state.level = level;
  if (state.category !== 'All' && !state.cards.some((card) => inLevel(card) && card.category === state.category)) state.category = 'All';
  rebuild();
}

function move(step) {
  if (state.view !== 'cards') return;
  const last = state.order.length - 1;
  state.index = step > 0 && state.index === last ? 0 : Math.max(0, Math.min(last, state.index + step));
  state.revealed = false;
  render('#flip');
}

function cardView() {
  const card = state.order[state.index];
  const total = state.order.length;
  const isLast = state.index === total - 1;
  return `
    <section class="stage">
      <p class="eyebrow"><span>${escapeHtml(card.category)}${isMissed(card) ? ' · <strong>missed</strong>' : ''}</span><span>${state.index + 1} of ${total}</span></p>
      <div class="progress" aria-hidden="true"><span style="width:${((state.index + 1) / total) * 100}%"></span></div>
      <button class="flashcard${state.revealed ? ' is-revealed' : ''}" id="flip" aria-expanded="${state.revealed}">
        ${badge(card)}
        <span class="flashcard-front">${escapeHtml(card.front)}</span>
        ${state.revealed ? `<span class="flashcard-back">${escapeHtml(card.back)}</span>` : '<span class="flashcard-hint">Tap to reveal</span>'}
      </button>
      <div class="row split">
        <button class="btn secondary" id="prev"${state.index === 0 ? ' disabled' : ''}>← Previous</button>
        <button class="btn primary" id="next">${isLast ? 'Start over ↺' : 'Next →'}</button>
      </div>
      <p class="quiet small center">Swipe or use the arrow keys to move between cards.</p>
    </section>`;
}

function listView() {
  return `
    <section class="stage">
      <dl class="card-list">${state.cards.filter(visible).map((card) => `
        <div class="card-row"><dt>${escapeHtml(card.front)} ${badge(card)} ${missedTag(card)}</dt><dd>${escapeHtml(card.back)}</dd></div>`).join('')}
      </dl>
    </section>`;
}

function render(focus) {
  const levelCount = (level) => state.cards.filter((card) => level === 'all' || (level === 'missed' ? isMissed(card) : statusOf(card.skill) === level)).length;
  const levelButtons = LEVELS.filter(([level]) => level !== 'missed' || state.missed.length).map(([level, text]) => {
    const n = levelCount(level);
    return `<button type="button" class="level-option" data-level="${level}" aria-pressed="${level === state.level}"${n === 0 ? ' disabled' : ''}>${text} <span>${n}</span></button>`;
  }).join('');
  const topicCards = state.cards.filter(inLevel);
  const count = (category) => (category === 'All' ? topicCards.length : topicCards.filter((card) => card.category === category).length);
  const chips = ['All', ...state.categories].filter((category) => category === 'All' || count(category) > 0).map((category) => `
    <button class="chip${category === state.category ? ' is-on' : ''}" data-category="${escapeHtml(category)}" aria-pressed="${category === state.category}">${escapeHtml(category)} <span>${count(category)}</span></button>`).join('');
  body.innerHTML = `
    <div class="level-toggle" role="group" aria-label="Which cards to study">${levelButtons}</div>
    <p class="quiet small level-note">${LEVEL_NOTES[state.level]}</p>
    <nav class="chips" aria-label="Card topics">${chips}</nav>
    <div class="study-tools">
      <button class="text-button" id="toggle-view">${state.view === 'list' ? 'Show as flashcards' : 'Show as a list'}</button>
      ${state.view === 'cards' ? `<button class="text-button" id="shuffle" aria-pressed="${state.shuffled}">${state.shuffled ? 'Shuffled ✓' : 'Shuffle'}</button>` : ''}
      <a class="text-link" href="../quiz/">Take the quiz →</a>
    </div>
    ${state.level === 'missed' ? noCardNote() : ''}
    ${state.order.length === 0 ? '<p class="quiet">No cards match.</p>' : state.view === 'list' ? listView() : cardView()}`;
  if (focus) body.querySelector(focus)?.focus({ preventScroll: true });
}

root.addEventListener('click', (event) => {
  const levelButton = event.target.closest('[data-level]');
  if (levelButton) return setLevel(levelButton.dataset.level);
  const chip = event.target.closest('[data-category]');
  if (chip) return setCategory(chip.dataset.category);
  const id = event.target.closest('button')?.id;
  if (id === 'flip') {
    state.revealed = !state.revealed;
    render('#flip');
  } else if (id === 'next') move(1);
  else if (id === 'prev') move(-1);
  else if (id === 'toggle-view') {
    state.view = state.view === 'list' ? 'cards' : 'list';
    render();
  } else if (id === 'shuffle') {
    state.shuffled = !state.shuffled;
    rebuild();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.target.closest?.('input, textarea, select')) return;
  if (event.key === 'ArrowRight') move(1);
  if (event.key === 'ArrowLeft') move(-1);
});

// Horizontal swipe on the card moves between cards; a tap still flips it.
let touchStartX = null;
root.addEventListener('touchstart', (event) => {
  touchStartX = event.target.closest('#flip') ? event.touches[0].clientX : null;
}, { passive: true });
root.addEventListener('touchend', (event) => {
  if (touchStartX === null) return;
  const dx = event.changedTouches[0].clientX - touchStartX;
  touchStartX = null;
  if (Math.abs(dx) > 60) {
    event.preventDefault();
    move(dx < 0 ? 1 : -1);
  }
});

// A missed skill can lack a card (not every skill has one yet); say so rather than
// let the count in the code summary and the cards on screen quietly disagree.
function noCardNote() {
  const covered = new Set(state.cards.map((card) => card.skill));
  const bare = state.missed.filter((skill) => !covered.has(skill));
  return bare.length ? `<p class="quiet small">No study card yet for: ${bare.map((skill) => escapeHtml(skillLabels[skill] || skill.replace(/_/g, ' '))).join(', ')}.</p>` : '';
}

// Active skills only: a skill an instructor has switched off has no cards and no quiz questions.
function loadMissed(code) {
  state.missed = code ? missedSkills(code, bank).filter((skill) => statusOf(skill) !== 'inactive') : [];
}

function codeSummary(code) {
  const missed = missedSkills(code, bank).filter((skill) => statusOf(skill) !== 'inactive');
  return missed.length
    ? `<p>${missed.length} ${missed.length === 1 ? 'skill' : 'skills'} to review. They’re under <strong>Missed</strong> below.</p>`
    : '<p>Nothing to review from that quiz. Nice work.</p>';
}

function describeCode(code) {
  document.getElementById('code-heading').textContent = code
    ? `Your quiz code · ${state.missed.length} ${state.missed.length === 1 ? 'skill' : 'skills'} to review`
    : 'Paste your past quiz code (optional)';
}

function applyCode(code) {
  loadMissed(code);
  describeCode(code);
  // New code: jump to what it says to study. Forgotten code: leave the Missed level behind.
  state.level = state.missed.length ? 'missed' : (state.level === 'missed' ? 'all' : state.level);
  state.category = 'All';
  rebuild();
}

async function init() {
  [curriculum, bank, deck] = await Promise.all(['../quiz/data/curriculum.json', '../quiz/data/questions.json', '../quiz/data/study-deck.json'].map(loadJson));
  statusOf = (skill) => curriculum.skills?.[skill] || 'inactive';
  skillLabels = bank.skills || {};
  state.cards = deck.cards.filter((card) => statusOf(card.skill) !== 'inactive');
  state.categories = deck.categories.filter((category) => state.cards.some((card) => card.category === category));
  // The label lives in the quizzes map, keyed by the announced quiz number.
  const quizLabel = curriculum.quizzes?.[String(curriculum.quiz_number)]?.label || `Quiz ${curriculum.quiz_number}`;
  document.getElementById('study-label').textContent = `Study cards · ${quizLabel}`;
  document.title = `Study Cards · ${quizLabel} · MUS 248`;

  root.innerHTML = `
    <details class="code-details" id="code-details">
      <summary id="code-heading"></summary>
      <div id="code-panel"></div>
    </details>
    <div id="study-body"></div>`;
  body = root.querySelector('#study-body');
  const code = savedState();
  mountCodeBox(root.querySelector('#code-panel'), {
    summarize: codeSummary,
    onChange: (next) => applyCode(next),
  });
  loadMissed(code);
  describeCode(code);
  state.level = state.missed.length ? 'missed' : 'all';
  setCategory('All');
}

init().catch((error) => {
  console.error(error);
  root.innerHTML = '<p class="status error">The study cards couldn’t load. Check your connection and refresh the page.</p>';
});
