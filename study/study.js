// Flashcards for the current quiz. The card set is quiz/data/curriculum.json → study_cards.
import { escapeHtml } from '../quiz/js/html.js';

const root = document.getElementById('study');
const on = (selector, handler) => root.querySelector(selector)?.addEventListener('click', handler);
let cards = [];
let queue = [];
let done = 0;

async function loadJson(path) {
  const response = await fetch(path, { cache: 'no-cache' });
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}

function show(html, focus = 'h2') {
  root.innerHTML = html;
  window.scrollTo(0, 0);
  root.querySelector(focus)?.focus({ preventScroll: true });
}

function restart() {
  queue = [...cards];
  done = 0;
  renderCard();
}

function renderCard(revealed = false) {
  if (!queue.length) return renderDone();
  const card = queue[0];
  const total = done + queue.length;
  show(`
    <section class="stage">
      <h2 class="eyebrow" tabindex="-1"><span>Study cards</span><span>${done + 1} of ${total}</span></h2>
      <div class="progress" aria-hidden="true"><span style="width:${(done / total) * 100}%"></span></div>
      <button class="flashcard${revealed ? ' is-revealed' : ''}" id="flip" aria-expanded="${revealed}">
        <span class="flashcard-front">${escapeHtml(card.front)}</span>
        ${revealed ? `<span class="flashcard-back">${escapeHtml(card.back)}</span>` : '<span class="flashcard-hint">Tap to reveal</span>'}
      </button>
      <div class="row split"${revealed ? '' : ' hidden'}>
        <button class="btn secondary" id="again">Review again</button>
        <button class="btn primary" id="got">Got it</button>
      </div>
      <p class="center"><button class="text-button" id="list">See all cards as a list</button></p>
    </section>`, revealed ? '#got' : 'h2');

  on('#flip', () => renderCard(!revealed));
  on('#got', () => {
    queue.shift();
    done += 1;
    renderCard();
  });
  on('#again', () => {
    queue.push(queue.shift());
    renderCard();
  });
  on('#list', renderList);
}

function renderDone() {
  show(`
    <section class="stage">
      <h2 tabindex="-1">That’s all ${cards.length} cards</h2>
      <p>Go through them again, or head to the quiz when you’re ready.</p>
      <div class="row split">
        <button class="btn secondary" id="restart">Go through again</button>
        <a class="btn primary" href="../quiz/">Take the quiz →</a>
      </div>
      <p class="center"><button class="text-button" id="list">See all cards as a list</button></p>
    </section>`);
  on('#restart', restart);
  on('#list', renderList);
}

function renderList() {
  show(`
    <section class="stage">
      <h2 tabindex="-1">All study cards</h2>
      <dl class="card-list">${cards.map((card) => `<dt>${escapeHtml(card.front)}</dt><dd>${escapeHtml(card.back)}</dd>`).join('')}</dl>
      <div class="row split">
        <button class="btn secondary" id="restart">Flashcards</button>
        <a class="btn primary" href="../quiz/">Take the quiz →</a>
      </div>
    </section>`);
  on('#restart', restart);
}

async function init() {
  const [curriculum, deck] = await Promise.all([loadJson('../quiz/data/curriculum.json'), loadJson('../quiz/data/study-deck.json')]);
  const byId = Object.fromEntries(deck.cards.map((card) => [card.id, card]));
  cards = curriculum.study_cards.map((id) => byId[id]).filter(Boolean);
  document.getElementById('study-label').textContent = `Study cards · ${curriculum.quiz_label}`;
  document.title = `Study Cards · ${curriculum.quiz_label} · MUS 248`;
  restart();
}

init().catch((error) => {
  console.error(error);
  root.innerHTML = '<p class="status error">The study cards couldn’t load. Check your connection and refresh the page.</p>';
});
