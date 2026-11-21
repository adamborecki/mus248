// 🔨 Whack-a-Mic: the wireless mics keep popping up out of the stage. Each one carries a letter,
// A–D; whack the one with the right answer's letter. Whack a wrong letter and you lose a hammer.
// Letting a mic drop back down costs nothing, so there is always time to read: the right letter
// is guaranteed to come back within a few pops.

import { escapeHtml, mountGame, sound, teach } from '../bank.js';

const LETTERS = ['A', 'B', 'C', 'D'];
const HOLES = 6;
// Easier mode: more hammers, and the mics pop slower and stay up longer; a miss stops to teach.
const TUNING = {
  standard: { lives: 3, every: 850, up: 1500 },
  easier: { lives: 5, every: 1300, up: 2600 },
};

function start({ deck, stage, finish, easy }) {
  const tune = TUNING[easy ? 'easier' : 'standard'];
  const state = { score: 0, lives: tune.lives, streak: 0, answered: 0, correct: 0, q: null, askedAt: 0, sinceRight: 0, paused: true, done: false, misses: [], timer: 0, drops: [] };

  stage.innerHTML = `
    <div class="gm-hud">
      <span class="wm-score">0 pts</span>
      <span class="wm-lives" aria-label="Hammers"></span>
      <span class="wm-streak"></span>
      <button type="button" class="gm-quit">Strike the stage</button>
    </div>
    <div class="qz-card"><p class="qz-prompt"></p><ol class="qz-choices"></ol></div>
    <div class="wm-field" role="group" aria-label="Mics pop up here: tap the one with the right letter">
      ${Array.from({ length: HOLES }, (_, i) => `<div class="wm-hole"><button type="button" class="wm-mole" data-hole="${i}" tabindex="-1" aria-hidden="true"></button></div>`).join('')}
    </div>
    <div class="gm-teachbox"></div>`;

  const $ = (sel) => stage.querySelector(sel);
  const moles = [...stage.querySelectorAll('.wm-mole')];

  const hud = () => {
    $('.wm-score').textContent = `${state.score} pts`;
    $('.wm-lives').textContent = '🔨'.repeat(state.lives) + '·'.repeat(tune.lives - state.lives);
    $('.wm-streak').textContent = state.streak > 1 ? `🔥 ×${Math.min(state.streak, 5)}` : '';
  };

  const down = (mole) => { mole.classList.remove('wm-up', 'wm-bonk'); delete mole.dataset.letter; };
  const clearField = () => { state.drops.forEach(clearTimeout); state.drops = []; moles.forEach(down); };

  const pop = () => {
    if (state.paused || state.done) return;
    const free = moles.filter((mole) => !mole.classList.contains('wm-up'));
    if (!free.length) return;
    const showing = moles.filter((mole) => mole.classList.contains('wm-up')).map((mole) => Number(mole.dataset.letter));
    // The right letter turns up about one pop in three, and never stays away more than three pops.
    let letter;
    if (!showing.includes(state.q.answer) && (state.sinceRight >= 3 || Math.random() < 0.35)) letter = state.q.answer;
    else {
      const others = LETTERS.map((_, i) => i).filter((i) => i !== state.q.answer && !showing.includes(i));
      letter = others.length ? others[Math.floor(Math.random() * others.length)] : state.q.answer;
      if (showing.includes(letter)) return;
    }
    state.sinceRight = letter === state.q.answer ? 0 : state.sinceRight + 1;
    const mole = free[Math.floor(Math.random() * free.length)];
    mole.dataset.letter = String(letter);
    mole.textContent = LETTERS[letter];
    mole.className = `wm-mole wm-c${letter} wm-up`;
    state.drops.push(setTimeout(() => { if (!mole.classList.contains('wm-bonk')) down(mole); }, tune.up));
  };

  const ask = () => {
    if (state.done) return;
    clearField();
    state.q = deck.deal();
    state.sinceRight = 0;
    state.askedAt = performance.now();
    $('.qz-prompt').textContent = state.q.prompt;
    $('.qz-choices').innerHTML = state.q.choices.map((choice, i) => `<li class="qz-static"><b class="wm-c${i}">${LETTERS[i]}</b><span>${escapeHtml(choice)}</span></li>`).join('');
    state.paused = false;
  };

  const whack = (mole) => {
    if (state.paused || state.done || !mole.classList.contains('wm-up')) return;
    state.paused = true;
    const q = state.q;
    const picked = Number(mole.dataset.letter);
    mole.classList.add('wm-bonk');
    state.answered += 1;
    stage.querySelectorAll('.qz-choices li').forEach((li, i) => li.classList.add(i === q.answer ? 'qz-right' : i === picked ? 'qz-wrong' : 'qz-dim'));
    if (picked === q.answer) {
      state.correct += 1;
      state.streak += 1;
      const seconds = (performance.now() - state.askedAt) / 1000;
      const points = Math.round(Math.max(40, 150 - seconds * 6)) * Math.min(state.streak, 5);
      state.score += points;
      sound.good();
      hud();
      setTimeout(ask, 900);
    } else {
      state.streak = 0;
      state.lives -= 1;
      state.misses.push({ ...q, picked: q.choices[picked] });
      stage.classList.remove('gm-shake'); void stage.offsetWidth; stage.classList.add('gm-shake');
      sound.bad();
      hud();
      const after = () => { if (state.done) return; if (state.lives <= 0) end('Out of hammers 🔨'); else ask(); };
      if (easy) setTimeout(() => { if (!state.done) { clearField(); teach($('.gm-teachbox'), q, after); } }, 700);
      else setTimeout(after, 2400);
    }
  };

  const onKey = (event) => {
    if (event.target.closest && event.target.closest('.gm-teach, select, input')) return;
    const letter = 'abcd'.indexOf(event.key.toLowerCase());
    if (letter < 0 || event.key.length !== 1) return;
    const mole = moles.find((m) => m.classList.contains('wm-up') && Number(m.dataset.letter) === letter);
    if (mole) whack(mole);
    event.preventDefault();
  };
  const end = (headline) => {
    if (state.done) return;
    state.done = true;
    clearInterval(state.timer);
    clearField();
    window.removeEventListener('keydown', onKey);
    finish({ score: state.score, label: 'points', headline, misses: state.misses, answered: state.answered, correct: state.correct });
  };

  moles.forEach((mole) => mole.addEventListener('pointerdown', (event) => { event.preventDefault(); whack(mole); }));
  window.addEventListener('keydown', onKey);
  $('.gm-quit').addEventListener('click', () => end('You struck the stage'));
  hud();
  ask();
  state.timer = setInterval(pop, tune.every);
}

mountGame(document.getElementById('game'), {
  id: 'whack-a-mic',
  title: 'Whack-a-Mic',
  emoji: '🔨',
  tagline: 'The wireless mics keep popping out of the stage. Whack the right one.',
  rules: [
    'A question appears with answers <b>A–D</b>. Mics pop up, each carrying a letter.',
    'Whack (tap, or press A–D) the mic with the <b>right answer\'s letter</b>.',
    'Take your time reading: letting a mic drop costs nothing, and the right letter always comes back.',
    'Whack a wrong letter and you lose a hammer. Faster whacks and streaks score more.',
  ],
  modeBlurbs: {
    easier: 'Simpler questions, 5 hammers, slower mics. A wrong whack stops to show you why.',
    standard: 'Every question a quiz can ask, 3 hammers, quick mics. Closest to the final.',
  },
  startLabel: 'Grab the hammer 🔨',
  start,
});
