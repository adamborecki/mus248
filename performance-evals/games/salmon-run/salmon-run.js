// 🐟 Salmon Run: swim upstream through the gate with the right answer. Wrong gate, the bear eats.
// A row of four lettered gates floats down the river while you read; pick a lane (tap an answer,
// tap the river, arrows, 1–4 or A–D) and either wait for the gate or hit Leap for a time bonus.

import { escapeHtml, mountGame, sound } from '../bank.js';

const LETTERS = ['A', 'B', 'C', 'D'];
const LIVES = 3;

function start({ deck, stage, finish }) {
  const state = { score: 0, lives: LIVES, streak: 0, speed: 1, lane: 1, q: null, p: 0, duration: 10, leaping: false, done: false, misses: [], last: 0, raf: 0, resolving: false };

  stage.innerHTML = `
    <div class="gm-hud">
      <span class="sr-score">0 pts</span>
      <span class="sr-lives" aria-label="Lives"></span>
      <span class="sr-streak"></span>
      <button type="button" class="gm-quit">End run</button>
    </div>
    <div class="sr-card">
      <p class="sr-prompt"></p>
      <ol class="sr-choices"></ol>
    </div>
    <div class="sr-river" role="group" aria-label="River: tap a lane to swim there">
      ${LETTERS.map((_, i) => `<div class="sr-lane" data-lane="${i}"></div>`).join('')}
      <div class="sr-gates">${LETTERS.map((letter, i) => `<div class="sr-gate sr-c${i}">${letter}</div>`).join('')}</div>
      <div class="sr-fish" aria-hidden="true"><span>🐟</span></div>
      <div class="sr-bear" aria-hidden="true">🐻</div>
    </div>
    <div class="sr-controls">
      <button type="button" class="sr-move" data-dir="-1" aria-label="Swim left">◀</button>
      <button type="button" class="sr-leap">Leap! <small>(space)</small></button>
      <button type="button" class="sr-move" data-dir="1" aria-label="Swim right">▶</button>
    </div>`;

  const $ = (sel) => stage.querySelector(sel);
  const river = $('.sr-river');
  const gates = $('.sr-gates');
  const fish = $('.sr-fish');

  const hud = () => {
    $('.sr-score').textContent = `${state.score} pts`;
    $('.sr-lives').textContent = '🐟'.repeat(state.lives) + '🦴'.repeat(LIVES - state.lives);
    $('.sr-streak').textContent = state.streak > 1 ? `🔥 ×${state.streak}` : '';
  };

  const moveTo = (lane) => {
    if (state.resolving || state.done) return;
    state.lane = Math.max(0, Math.min(LETTERS.length - 1, lane));
    fish.style.left = `${(state.lane + 0.5) * 25}%`;
    stage.querySelectorAll('.sr-choices li').forEach((li, i) => li.classList.toggle('sr-picked', i === state.lane));
  };

  const pop = (text, color) => {
    const el = document.createElement('div');
    el.className = 'gm-pop';
    el.textContent = text;
    el.style.color = color;
    el.style.left = fish.style.left;
    el.style.bottom = '4.5rem';
    el.style.transform = 'translateX(-50%)';
    river.appendChild(el);
    setTimeout(() => el.remove(), 950);
  };

  const next = () => {
    if (state.done) return;
    state.q = deck.deal();
    state.p = 0;
    state.leaping = false;
    state.resolving = false;
    const chars = state.q.prompt.length + state.q.choices.join('').length;
    // Reading time: generous at first (about 4 s plus 28 characters a second), shrinking as the streak grows.
    state.duration = (4 + chars / 28) * state.speed;
    $('.sr-prompt').textContent = state.q.prompt;
    $('.sr-choices').innerHTML = state.q.choices.map((choice, i) => `<li><button type="button" data-lane="${i}"><b class="sr-c${i}">${LETTERS[i]}</b><span>${escapeHtml(choice)}</span></button></li>`).join('');
    stage.querySelectorAll('.sr-choices button').forEach((button) => button.addEventListener('click', () => moveTo(Number(button.dataset.lane))));
    gates.querySelectorAll('.sr-gate').forEach((gate) => gate.classList.remove('sr-open', 'sr-shut'));
    river.classList.remove('sr-chomp');
    moveTo(state.lane);
    state.last = performance.now();
  };

  const resolve = () => {
    state.resolving = true;
    const q = state.q;
    const right = state.lane === q.answer;
    const timeLeft = state.leaping ? Math.max(0, 1 - state.leapAt) : 0;
    gates.querySelectorAll('.sr-gate').forEach((gate, i) => gate.classList.add(i === q.answer ? 'sr-open' : 'sr-shut'));
    stage.querySelectorAll('.sr-choices li').forEach((li, i) => li.classList.add(i === q.answer ? 'sr-right' : (i === state.lane ? 'sr-wrong' : 'sr-dim')));
    if (right) {
      state.streak += 1;
      const points = Math.round((100 + 200 * timeLeft) * Math.min(state.streak, 5));
      state.score += points;
      state.speed = Math.max(0.45, state.speed * 0.94);
      fish.classList.remove('sr-jump');
      void fish.offsetWidth;
      fish.classList.add('sr-jump');
      pop(`+${points}`, 'var(--good)');
      sound.good();
    } else {
      state.streak = 0;
      state.lives -= 1;
      state.misses.push({ ...q, picked: q.choices[state.lane] });
      river.classList.add('sr-chomp');
      $('.sr-bear').style.left = fish.style.left;
      stage.classList.remove('gm-shake');
      void stage.offsetWidth;
      stage.classList.add('gm-shake');
      pop('CHOMP', 'var(--bad)');
      sound.bad();
    }
    hud();
    setTimeout(() => {
      if (state.lives <= 0) return end('The bear got you 🐻');
      next();
    }, right ? 1100 : 2600);
  };

  const tick = (now) => {
    if (state.done) return;
    const dt = Math.min(0.1, (now - state.last) / 1000);
    state.last = now;
    if (!state.resolving && state.q) {
      state.p += state.leaping ? dt * 2.5 : dt / state.duration;
      if (state.p >= 1) { state.p = 1; resolve(); }
      const travel = river.clientHeight - gates.offsetHeight - fish.offsetHeight - 8;
      gates.style.transform = `translateY(${state.p * travel}px)`;
    }
    state.raf = requestAnimationFrame(tick);
  };

  const leap = () => {
    if (state.resolving || state.leaping || state.done) return;
    state.leaping = true;
    state.leapAt = state.p;
  };

  const end = (headline) => {
    if (state.done) return;
    state.done = true;
    cancelAnimationFrame(state.raf);
    window.removeEventListener('keydown', onKey);
    finish({ score: state.score, label: 'points', headline, misses: state.misses });
  };

  const onKey = (event) => {
    if (event.target.closest && event.target.closest('select, input, textarea')) return;
    const key = event.key.toLowerCase();
    if (key === 'arrowleft') moveTo(state.lane - 1);
    else if (key === 'arrowright') moveTo(state.lane + 1);
    else if ('1234'.includes(key) && key.length === 1) moveTo(Number(key) - 1);
    else if ('abcd'.includes(key) && key.length === 1) moveTo('abcd'.indexOf(key));
    else if (key === ' ' || key === 'enter' || key === 'arrowup') leap();
    else return;
    event.preventDefault();
  };

  stage.querySelectorAll('.sr-lane').forEach((lane) => lane.addEventListener('click', () => {
    const target = Number(lane.dataset.lane);
    if (target === state.lane) leap(); else moveTo(target);
  }));
  stage.querySelectorAll('.sr-move').forEach((button) => button.addEventListener('click', () => moveTo(state.lane + Number(button.dataset.dir))));
  $('.sr-leap').addEventListener('click', leap);
  $('.gm-quit').addEventListener('click', () => end('You climbed out of the river'));
  window.addEventListener('keydown', onKey);

  hud();
  next();
  state.raf = requestAnimationFrame(tick);
}

mountGame(document.getElementById('game'), {
  id: 'salmon-run',
  title: 'Salmon Run',
  emoji: '🐟',
  tagline: 'Swim upstream to Salmon Hall. Pick the wrong gate and the bear gets lunch.',
  rules: [
    'A question appears with answers <b>A–D</b>. A row of gates floats down the river toward you.',
    'Swim into the lane of the right answer: tap an answer, tap a lane, or use ← → / 1–4 / A–D.',
    'Sure already? Hit <b>Leap!</b> (space, or tap your lane again) for a speed bonus.',
    'Streaks multiply your points (up to ×5), and the river speeds up. Three wrong gates and you\'re bear food.',
  ],
  startLabel: 'Swim! 🐟',
  start,
});
