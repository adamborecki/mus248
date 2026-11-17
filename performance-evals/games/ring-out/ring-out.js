// 🔊 Ring Out!: the room is feeding back and only right answers pull the ringing band down.
// The feedback meter climbs on its own, faster every notch. A right answer notches the ringing
// frequency on the graphic EQ and drops the meter; a wrong one makes it howl. Hit 100% and the
// speakers blow.

import { escapeHtml, mountGame, sound, teach } from '../bank.js';

const BANDS = ['63', '125', '250', '500', '800', '1.2k', '2k', '2.5k', '3.15k', '4k', '6.3k', '8k', '12k'];
const spoken = (i) => (BANDS[i].endsWith('k') ? `${BANDS[i].slice(0, -1)} kHz` : `${BANDS[i]} Hz`);
const HZ = [63, 125, 250, 500, 800, 1200, 2000, 2500, 3150, 4000, 6300, 8000, 12000];

// Easier mode: the room rings slower and gets worse more gently, a miss howls less, and it stops
// to teach the right answer before the next question.
const TUNING = {
  standard: { rate: 3.2, growth: 1.07, howl: 18 },
  easier: { rate: 1.8, growth: 1.035, howl: 10 },
};

function start({ deck, stage, finish, easy }) {
  const tune = TUNING[easy ? 'easier' : 'standard'];
  const state = { answered: 0, level: 25, rate: tune.rate, notches: 0, combo: 0, ring: 6, cuts: BANDS.map(() => 0), q: null, paused: false, done: false, misses: [], last: 0, raf: 0, tone: null };

  stage.innerHTML = `
    <div class="gm-hud">
      <span class="ro-notches">0 notched</span>
      <span class="ro-combo"></span>
      <button type="button" class="gm-quit">Walk out</button>
    </div>
    <div class="ro-rack">
      <div class="ro-meter" aria-label="Feedback level"><div class="ro-fill"></div><span class="ro-pct">25%</span></div>
      <div class="ro-eq" aria-hidden="true">
        ${BANDS.map((band, i) => `<div class="ro-band" data-i="${i}"><div class="ro-spec"></div><div class="ro-slot"><div class="ro-knob"></div></div><small>${band}</small></div>`).join('')}
      </div>
    </div>
    <p class="ro-callout" aria-live="polite"></p>
    <div class="ro-card">
      <p class="ro-prompt"></p>
      <div class="ro-choices"></div>
    </div>
    <div class="gm-teachbox"></div>`;

  const $ = (sel) => stage.querySelector(sel);
  const bands = [...stage.querySelectorAll('.ro-band')];

  const hud = () => {
    $('.ro-notches').textContent = `${state.notches} notched`;
    $('.ro-combo').textContent = state.combo > 1 ? `⚡ combo ×${state.combo}` : '';
  };

  const pickRing = () => {
    let next = state.ring;
    while (next === state.ring) next = Math.floor(Math.random() * BANDS.length);
    state.ring = next;
    $('.ro-callout').textContent = `It's ringing at ${spoken(state.ring)}!`;
  };

  // The squeal itself: a quiet sine at the ringing band that gets louder with the meter. Sound is off by default.
  const updateTone = () => {
    const ctx = sound.context();
    if (!ctx) return;
    if (!state.tone) {
      const osc = ctx.createOscillator();
      const amp = ctx.createGain();
      amp.gain.value = 0;
      osc.connect(amp).connect(ctx.destination);
      osc.start();
      state.tone = { osc, amp };
    }
    state.tone.osc.frequency.setTargetAtTime(HZ[state.ring] * (1 + Math.sin(performance.now() / 90) * 0.004), ctx.currentTime, 0.02);
    const loud = state.paused || state.done ? 0 : Math.max(0, (state.level - 40) / 60) ** 2 * 0.035;
    state.tone.amp.gain.setTargetAtTime(loud, ctx.currentTime, 0.05);
  };

  const draw = (now) => {
    const level = state.level;
    $('.ro-fill').style.height = `${level}%`;
    $('.ro-fill').style.background = level > 75 ? 'var(--bad)' : level > 50 ? 'var(--warn)' : 'var(--good)';
    $('.ro-pct').textContent = `${Math.round(level)}%`;
    stage.querySelector('.ro-rack').classList.toggle('ro-danger', level > 75);
    bands.forEach((band, i) => {
      const noise = 12 + 18 * Math.abs(Math.sin(now / (260 + i * 37) + i));
      const height = i === state.ring ? Math.min(100, 30 + level * 0.75) : Math.max(4, noise - state.cuts[i] * 2);
      band.querySelector('.ro-spec').style.height = `${height}%`;
      band.classList.toggle('ro-ringing', i === state.ring);
      band.querySelector('.ro-knob').style.top = `${50 + state.cuts[i] * 3.5}%`;
    });
  };

  const show = () => {
    state.q = deck.deal();
    $('.ro-prompt').textContent = state.q.prompt;
    $('.ro-choices').innerHTML = state.q.choices.map((choice, i) => `<button type="button" data-i="${i}"><b>${i + 1}</b> ${escapeHtml(choice)}</button>`).join('');
    stage.querySelectorAll('.ro-choices button').forEach((button) => button.addEventListener('click', () => answer(Number(button.dataset.i))));
    state.paused = false;
  };

  const answer = (picked) => {
    if (state.paused || state.done) return;
    state.paused = true;
    state.answered += 1;
    const q = state.q;
    const buttons = [...stage.querySelectorAll('.ro-choices button')];
    buttons.forEach((button, i) => { button.disabled = true; button.classList.add(i === q.answer ? 'ro-right' : i === picked ? 'ro-wrong' : 'ro-dim'); });
    if (picked === q.answer) {
      state.combo += 1;
      state.notches += 1;
      state.cuts[state.ring] = Math.min(12, state.cuts[state.ring] + 6);
      state.level = Math.max(0, state.level - (22 + 4 * Math.min(state.combo, 5)));
      state.rate *= tune.growth;
      $('.ro-callout').textContent = `Notched ${spoken(state.ring)} ✂️`;
      sound.good();
      setTimeout(() => { pickRing(); show(); }, 650);
    } else {
      state.combo = 0;
      state.level = Math.min(100, state.level + tune.howl);
      state.misses.push({ ...q, picked: q.choices[picked] });
      $('.ro-callout').textContent = 'EEEEEEEEEE 🙉';
      stage.classList.remove('gm-shake');
      void stage.offsetWidth;
      stage.classList.add('gm-shake');
      sound.bad();
      const after = () => { if (!state.done) { if (state.level >= 100) end(); else show(); } };
      if (easy) setTimeout(() => { if (!state.done) teach($('.gm-teachbox'), q, after); }, 700);
      else setTimeout(after, 2200);
    }
    hud();
  };

  const tick = (now) => {
    if (state.done) return;
    const dt = Math.min(0.1, Math.max(0, (now - state.last) / 1000));
    state.last = now;
    if (!state.paused) state.level = Math.min(100, state.level + state.rate * dt);
    draw(now);
    updateTone();
    if (state.level >= 100 && !state.paused) return end();
    state.raf = requestAnimationFrame(tick);
  };

  const end = (headline = 'FEEDBACK! 🔊💥 The front row is covering their ears.') => {
    if (state.done) return;
    state.done = true;
    cancelAnimationFrame(state.raf);
    window.removeEventListener('keydown', onKey);
    if (state.tone) { try { state.tone.osc.stop(); } catch { /* already stopped */ } }
    finish({ score: state.notches, label: state.notches === 1 ? 'frequency notched' : 'frequencies notched', headline, misses: state.misses, answered: state.answered, correct: state.notches });
  };

  const onKey = (event) => {
    if ('1234'.includes(event.key) && event.key.length === 1) { answer(Number(event.key) - 1); event.preventDefault(); }
  };
  window.addEventListener('keydown', onKey);
  $('.gm-quit').addEventListener('click', () => end('You walked out of soundcheck'));

  hud();
  pickRing();
  show();
  state.last = performance.now();
  state.raf = requestAnimationFrame(tick);
}

mountGame(document.getElementById('game'), {
  id: 'ring-out',
  title: 'Ring Out!',
  emoji: '🔊',
  tagline: 'The room is feeding back. Every right answer notches the ringing frequency.',
  rules: [
    'The feedback meter climbs on its own, and a little faster after every notch.',
    'Answer right (tap, or keys 1–4) to cut the ringing band on the EQ and pull the meter down. Combos cut deeper.',
    'Answer wrong and it howls: the meter jumps up.',
    'Reach 100% and the speakers blow. Turn on Sound if you want to hear it (headphones: it does squeal).',
  ],
  modeBlurbs: {
    easier: 'Simpler questions, and the room rings slowly. A wrong answer stops to show you why.',
    standard: 'Every question a quiz can ask, and the feedback builds fast. Closest to the final.',
  },
  startLabel: 'Unmute the mics 🎤',
  start,
});
