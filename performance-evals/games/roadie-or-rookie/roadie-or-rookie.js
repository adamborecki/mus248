// 🤘 Roadie or Rookie?: a question and ONE answer somebody gave. Is it the roadie's (right) or the
// rookie's (wrong)? Swipe right or left (or tap, or use the arrow keys) before the clock runs out.
// Half the answers shown are the question's correct one; the rest are one of its own wrong choices.
// Every verdict shows the real answer, so a "rookie" card still teaches the right one.

import { escapeHtml, mountGame, sound, teach } from '../bank.js';

// Easier mode: a longer clock, no time penalty, and a wrong call stops to teach.
const TUNING = { standard: { seconds: 75, penalty: 5 }, easier: { seconds: 120, penalty: 0 } };

function start({ deck, stage, finish, easy }) {
  const tune = TUNING[easy ? 'easier' : 'standard'];
  const state = { time: tune.seconds, score: 0, streak: 0, answered: 0, correct: 0, q: null, shown: 0, truth: false, paused: false, done: false, misses: [], last: 0, raf: 0, drag: null };

  stage.innerHTML = `
    <div class="gm-hud">
      <span class="rr-score">0 pts</span>
      <span class="rr-time">⏱ ${tune.seconds}</span>
      <span class="rr-streak"></span>
      <button type="button" class="gm-quit">Clock out</button>
    </div>
    <div class="rr-zone">
      <div class="rr-swipe">
        <p class="rr-q"></p>
        <p class="rr-says">Somebody says:</p>
        <p class="rr-claim"></p>
      </div>
    </div>
    <div class="rr-buttons">
      <button type="button" class="rr-nope">← 🐣 Rookie<small>that's wrong</small></button>
      <button type="button" class="rr-yep">🤘 Roadie →<small>that's right</small></button>
    </div>
    <p class="rr-verdict" aria-live="polite"></p>
    <div class="gm-teachbox"></div>`;

  const $ = (sel) => stage.querySelector(sel);
  const card = $('.rr-swipe');

  const hud = () => {
    $('.rr-score').textContent = `${state.score} pts`;
    const t = $('.rr-time');
    t.textContent = `⏱ ${Math.ceil(state.time)}`;
    t.classList.toggle('rr-low', state.time < 10);
    $('.rr-streak').textContent = state.streak > 1 ? `🔥 ×${Math.min(state.streak, 5)}` : '';
  };
  const buttons = (on) => stage.querySelectorAll('.rr-buttons button').forEach((button) => { button.disabled = !on; });

  const next = () => {
    if (state.done) return;
    state.q = deck.deal();
    state.truth = Math.random() < 0.5;
    const wrong = state.q.choices.map((_, i) => i).filter((i) => i !== state.q.answer);
    state.shown = state.truth ? state.q.answer : wrong[Math.floor(Math.random() * wrong.length)];
    $('.rr-q').textContent = state.q.prompt;
    $('.rr-claim').textContent = `“${state.q.choices[state.shown]}”`;
    card.className = 'rr-swipe';
    card.style.transform = '';
    card.style.opacity = '';
    state.paused = false;
    buttons(true);
    state.last = performance.now();
  };

  const judge = (saysRight) => {
    if (state.paused || state.done || !state.q) return;
    state.paused = true;
    buttons(false);
    const q = state.q;
    const good = saysRight === state.truth;
    state.answered += 1;
    card.classList.add(saysRight ? 'rr-yes' : 'rr-no');
    card.style.transform = `translateX(${saysRight ? 120 : -120}%) rotate(${saysRight ? 14 : -14}deg)`;
    card.style.opacity = '0';
    const real = `Real answer: ${q.choices[q.answer]}`;
    if (good) {
      state.correct += 1;
      state.streak += 1;
      state.score += 100 * Math.min(state.streak, 5);
      $('.rr-verdict').innerHTML = `✅ ${state.truth ? 'Yes, a roadie\'s answer.' : 'Right, that was a rookie.'}<small>${escapeHtml(real)}</small>`;
      sound.good();
      hud();
      setTimeout(() => { $('.rr-verdict').textContent = ''; next(); }, state.truth ? 700 : 1700);
    } else {
      state.streak = 0;
      state.time = Math.max(0, state.time - tune.penalty);
      state.misses.push({ ...q, picked: `Called “${q.choices[state.shown]}” ${saysRight ? 'right' : 'wrong'}` });
      $('.rr-verdict').innerHTML = `❌ ${state.truth ? 'That one was actually right.' : 'Nope, that was a rookie answer.'}${tune.penalty ? ` −${tune.penalty}s` : ''}<small>${escapeHtml(real)}</small>`;
      stage.classList.remove('gm-shake'); void stage.offsetWidth; stage.classList.add('gm-shake');
      sound.bad();
      hud();
      const after = () => { if (state.done) return; $('.rr-verdict').textContent = ''; if (state.time <= 0) end(); else next(); };
      if (easy) setTimeout(() => { if (!state.done) teach($('.gm-teachbox'), q, after); }, 600);
      else setTimeout(after, 2400);
    }
  };

  // Drag the card sideways; let go past a third of its width to call it.
  card.addEventListener('pointerdown', (event) => {
    if (state.paused || state.done) return;
    state.drag = { x: event.clientX, dx: 0 };
    card.classList.add('rr-drag');
    card.setPointerCapture?.(event.pointerId);
  });
  card.addEventListener('pointermove', (event) => {
    if (!state.drag) return;
    state.drag.dx = event.clientX - state.drag.x;
    card.style.transform = `translateX(${state.drag.dx}px) rotate(${state.drag.dx / 22}deg)`;
    card.classList.toggle('rr-yes', state.drag.dx > 40);
    card.classList.toggle('rr-no', state.drag.dx < -40);
  });
  const drop = () => {
    if (!state.drag) return;
    const { dx } = state.drag;
    state.drag = null;
    card.classList.remove('rr-drag');
    if (Math.abs(dx) > Math.min(110, card.offsetWidth / 3)) judge(dx > 0);
    else { card.style.transform = ''; card.classList.remove('rr-yes', 'rr-no'); }
  };
  card.addEventListener('pointerup', drop);
  card.addEventListener('pointercancel', drop);

  const tick = (now) => {
    if (state.done) return;
    const dt = Math.min(0.1, Math.max(0, (now - state.last) / 1000));
    state.last = now;
    if (!state.paused) {
      state.time = Math.max(0, state.time - dt);
      hud();
      if (state.time <= 0) return end();
    }
    state.raf = requestAnimationFrame(tick);
  };

  const onKey = (event) => {
    if (event.target.closest && event.target.closest('.gm-teach')) return;
    if (event.key === 'ArrowRight') judge(true);
    else if (event.key === 'ArrowLeft') judge(false);
    else return;
    event.preventDefault();
  };
  const end = (headline = 'Time! Load-out. ⏱') => {
    if (state.done) return;
    state.done = true;
    cancelAnimationFrame(state.raf);
    window.removeEventListener('keydown', onKey);
    finish({ score: state.score, label: 'points', headline, misses: state.misses, answered: state.answered, correct: state.correct });
  };

  window.addEventListener('keydown', onKey);
  $('.rr-yep').addEventListener('click', () => judge(true));
  $('.rr-nope').addEventListener('click', () => judge(false));
  $('.gm-quit').addEventListener('click', () => end('You clocked out early'));
  hud();
  next();
  state.raf = requestAnimationFrame(tick);
}

mountGame(document.getElementById('game'), {
  id: 'roadie-or-rookie',
  title: 'Roadie or Rookie?',
  emoji: '🤘',
  tagline: 'One question, one answer somebody gave. Would a roadie say that, or a rookie?',
  rules: [
    'You see a question and <b>one</b> answer. Decide: is that answer right?',
    'Swipe (or tap, or press →) <b>🤘 Roadie</b> if it\'s right, ← <b>🐣 Rookie</b> if it\'s wrong.',
    'Every call shows you the real answer. Streaks multiply your points, up to ×5.',
    'Keep going until the clock runs out.',
  ],
  modeBlurbs: {
    easier: 'Simpler questions, 120 seconds, no time penalty. A wrong call stops to show you why.',
    standard: 'Every question a quiz can ask, 75 seconds, and a wrong call costs 5 s. Closest to the final.',
  },
  startLabel: 'Soundcheck 🤘',
  start,
});
