// 🔌 Patch Panic: doors open in 90 seconds and the stage box isn't patched. Each input is a
// question, each mixer channel an answer; tap one, then its match, to run a cable. Right patches
// add time, wrong ones spark and cost time. Clear the board and a new one rolls in.

import { escapeHtml, mountGame, shuffle, sound } from '../bank.js';

const COLORS = ['#e8453c', '#f2a900', '#2ea44f', '#2f74c0', '#8a4fd8'];
const START_SECONDS = 90;

function start({ deck, stage, finish }) {
  const state = { time: START_SECONDS, score: 0, board: 0, pairs: [], picked: null, done: false, misses: [], missedIds: new Set(), last: 0, raf: 0 };

  stage.innerHTML = `
    <div class="gm-hud">
      <span class="pp-score">0 patched</span>
      <span class="pp-time" aria-live="off">⏱ 90</span>
      <span class="pp-board">Board 1</span>
      <button type="button" class="gm-quit">Call it</button>
    </div>
    <p class="pp-hint">Tap a stage-box input, then the mixer channel it belongs to.</p>
    <div class="pp-board-wrap">
      <div class="pp-col pp-left"><h2>🎤 Stage box</h2><div class="pp-jacks pp-ins"></div></div>
      <div class="pp-col pp-right"><h2>🎛️ Mixer</h2><div class="pp-jacks pp-outs"></div></div>
      <svg class="pp-cables" aria-hidden="true"></svg>
    </div>`;

  const $ = (sel) => stage.querySelector(sel);
  const wrap = $('.pp-board-wrap');
  const svg = $('.pp-cables');

  const hud = () => {
    $('.pp-score').textContent = `${state.score} patched`;
    const t = $('.pp-time');
    t.textContent = `⏱ ${Math.ceil(state.time)}`;
    t.classList.toggle('pp-low', state.time < 15);
    $('.pp-board').textContent = `Board ${state.board}`;
  };

  // Questions from different skills with different right answers, so no two outputs could both be right.
  const dealBoard = () => {
    const count = window.innerWidth < 560 ? 3 : 4;
    const pairs = [];
    let guard = 0;
    while (pairs.length < count && guard < 60) {
      guard += 1;
      const q = deck.deal(pairs.map((p) => p.skill));
      const answer = q.choices[q.answer];
      if (pairs.some((p) => p.skill === q.skill || p.choices[p.answer] === answer)) continue;
      pairs.push(q);
    }
    state.pairs = pairs.map((q, i) => ({ ...q, n: i, color: COLORS[i % COLORS.length], done: false }));
    state.picked = null;
    state.board += 1;
    const outs = shuffle(state.pairs.map((p) => p.n));
    $('.pp-ins').innerHTML = state.pairs.map((p, i) => `<button type="button" class="pp-jack pp-in" data-n="${p.n}"><span class="pp-num">${i + 1}</span><span class="pp-text">${escapeHtml(p.prompt)}</span><span class="pp-dot"></span></button>`).join('');
    $('.pp-outs').innerHTML = outs.map((n, i) => `<button type="button" class="pp-jack pp-out" data-n="${n}"><span class="pp-dot"></span><span class="pp-num">CH ${i + 1}</span><span class="pp-text">${escapeHtml(state.pairs[n].choices[state.pairs[n].answer])}</span></button>`).join('');
    stage.querySelectorAll('.pp-jack').forEach((jack) => jack.addEventListener('click', () => tap(jack)));
    drawCables();
    hud();
  };

  const center = (el) => {
    const box = wrap.getBoundingClientRect();
    const dot = el.querySelector('.pp-dot').getBoundingClientRect();
    return [dot.left + dot.width / 2 - box.left, dot.top + dot.height / 2 - box.top];
  };

  const cablePath = ([x1, y1], [x2, y2]) => {
    const sag = 30 + Math.abs(y2 - y1) * 0.15;
    return `M${x1},${y1} C${x1 + 40},${y1 + sag} ${x2 - 40},${y2 + sag} ${x2},${y2}`;
  };

  const drawCables = (spark) => {
    svg.setAttribute('width', wrap.clientWidth);
    svg.setAttribute('height', wrap.clientHeight);
    const lines = state.pairs.filter((p) => p.done).map((p) => {
      const a = center(stage.querySelector(`.pp-in[data-n="${p.n}"]`));
      const b = center(stage.querySelector(`.pp-out[data-n="${p.n}"]`));
      return `<path d="${cablePath(a, b)}" stroke="#000" stroke-opacity=".35" stroke-width="9" fill="none" stroke-linecap="round"/>`
        + `<path class="pp-cable" d="${cablePath(a, b)}" stroke="${p.color}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    });
    if (spark) lines.push(`<path class="pp-spark" d="${cablePath(spark[0], spark[1])}" stroke="var(--bad)" stroke-width="4" stroke-dasharray="6 6" fill="none"/>`
      + `<text x="${(spark[0][0] + spark[1][0]) / 2}" y="${(spark[0][1] + spark[1][1]) / 2 + 10}" text-anchor="middle" font-size="30">⚡</text>`);
    svg.innerHTML = lines.join('');
  };

  const pop = (text, color, el) => {
    const box = wrap.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const p = document.createElement('div');
    p.className = 'gm-pop';
    p.textContent = text;
    p.style.color = color;
    p.style.left = `${r.left - box.left + r.width / 2}px`;
    p.style.top = `${r.top - box.top}px`;
    wrap.appendChild(p);
    setTimeout(() => p.remove(), 950);
  };

  const tap = (jack) => {
    if (state.done || jack.classList.contains('pp-locked')) return;
    const side = jack.classList.contains('pp-in') ? 'in' : 'out';
    if (!state.picked || state.picked.side === side) {
      stage.querySelectorAll('.pp-selected').forEach((el) => el.classList.remove('pp-selected'));
      if (state.picked && state.picked.el === jack) { state.picked = null; return; }
      state.picked = { side, el: jack };
      jack.classList.add('pp-selected');
      sound.blip(520, 50);
      return;
    }
    const inJack = side === 'in' ? jack : state.picked.el;
    const outJack = side === 'out' ? jack : state.picked.el;
    state.picked.el.classList.remove('pp-selected');
    state.picked = null;
    const pair = state.pairs[Number(inJack.dataset.n)];
    const picked = state.pairs[Number(outJack.dataset.n)];
    if (pair.n === picked.n) {
      pair.done = true;
      state.score += 1;
      state.time += 4;
      [inJack, outJack].forEach((el) => { el.classList.add('pp-locked'); el.style.setProperty('--cable', pair.color); });
      drawCables();
      pop('+4s', 'var(--good)', outJack);
      sound.good();
      if (state.pairs.every((p) => p.done)) {
        state.time += 6;
        pop('Board clear! +6s', 'var(--good)', $('.pp-board'));
        setTimeout(() => { if (!state.done) dealBoard(); }, 700);
      }
    } else {
      state.time = Math.max(0, state.time - 6);
      if (!state.missedIds.has(pair.id)) {
        state.missedIds.add(pair.id);
        state.misses.push({ ...pair, picked: picked.choices[picked.answer] });
      }
      drawCables([center(inJack), center(outJack)]);
      setTimeout(() => { if (!state.done) drawCables(); }, 600);
      [inJack, outJack].forEach((el) => { el.classList.remove('pp-buzz'); void el.offsetWidth; el.classList.add('pp-buzz'); });
      pop('−6s', 'var(--bad)', outJack);
      sound.bad();
    }
    hud();
  };

  const tick = (now) => {
    if (state.done) return;
    state.time = Math.max(0, state.time - Math.min(0.1, (now - state.last) / 1000));
    state.last = now;
    hud();
    if (state.time <= 0) return end('Doors are open. Out of time! 🚪');
    state.raf = requestAnimationFrame(tick);
  };

  const onResize = () => drawCables();
  const end = (headline) => {
    if (state.done) return;
    state.done = true;
    cancelAnimationFrame(state.raf);
    window.removeEventListener('resize', onResize);
    finish({ score: state.score, label: state.score === 1 ? 'cable patched' : 'cables patched', headline, misses: state.misses });
  };

  window.addEventListener('resize', onResize);
  $('.gm-quit').addEventListener('click', () => end('You called it early'));
  dealBoard();
  state.last = performance.now();
  state.raf = requestAnimationFrame(tick);
}

mountGame(document.getElementById('game'), {
  id: 'patch-panic',
  title: 'Patch Panic',
  emoji: '🔌',
  tagline: 'Doors open in 90 seconds and nothing is patched.',
  rules: [
    'Each stage-box input is a question. Each mixer channel is an answer.',
    'Tap an input, then the channel it belongs to (either order works) to run a cable.',
    'Right patch: <b>+4 s</b>. Wrong patch: it sparks, <b>−6 s</b>. Clear the board: <b>+6 s</b> and a new one.',
    'Keep patching until the clock runs out.',
  ],
  startLabel: 'Load in 🔌',
  start,
});
