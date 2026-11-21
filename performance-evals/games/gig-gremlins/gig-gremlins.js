// 👹 Gig Gremlins: six gremlins are wrecking the gig, one after another. A right answer lands a
// hit (three in a row is a critical hit, worth two); a wrong one costs you a heart. Beat a gremlin
// and you get a heart back. Clear all six and the show goes on.
// The gremlins and their taunts are jokes, not instructions: everything a student learns here comes
// from the quiz question and its explanation.

import { escapeHtml, mountGame, sound, teach } from '../bank.js';

const GREMLINS = [
  { emoji: '🐝', name: 'The Hum', taunt: 'Bzzzzzzzzzzzzzzzz.', hp: 3 },
  { emoji: '🧟', name: 'Dead Battery Dave', taunt: 'I was fine at soundcheck…', hp: 3 },
  { emoji: '🐙', name: 'The Cable Kraken', taunt: 'Which one of these was yours?', hp: 4 },
  { emoji: '👻', name: 'The Phantom', taunt: 'Boo. Did somebody turn me on?', hp: 4 },
  { emoji: '🦖', name: 'Latency Rex', taunt: 'Rooooar. (…roooooar.)', hp: 5 },
  { emoji: '👹', name: 'The Feedback Banshee', taunt: 'EEEEEEEEEEEEEEEEEEEE!', hp: 6 },
];
// Easier mode: more hearts, and a wrong answer stops to teach.
const TUNING = { standard: { hearts: 4 }, easier: { hearts: 6 } };

function start({ deck, stage, finish, easy }) {
  const maxHearts = TUNING[easy ? 'easier' : 'standard'].hearts;
  const state = { boss: 0, hp: GREMLINS[0].hp, hearts: maxHearts, streak: 0, hits: 0, beaten: 0, answered: 0, correct: 0, q: null, locked: false, done: false, misses: [] };

  stage.innerHTML = `
    <div class="gm-hud">
      <span class="gg-score">0 pts</span>
      <span class="gg-hearts" aria-label="Hearts"></span>
      <span class="gg-streak"></span>
      <button type="button" class="gm-quit">Run away</button>
    </div>
    <div class="gg-arena">
      <div><p class="gg-name"></p><p class="gg-taunt"></p><div class="gg-hp" aria-label="Gremlin health"><i></i></div></div>
      <div class="gg-boss" aria-hidden="true"></div>
    </div>
    <p class="gg-callout" aria-live="polite"></p>
    <div class="qz-card"><p class="qz-prompt"></p><ol class="qz-choices"></ol></div>
    <div class="gm-teachbox"></div>`;

  const $ = (sel) => stage.querySelector(sel);
  const score = () => state.hits * 100 + state.beaten * 500;
  const animate = (name) => { const el = $('.gg-boss'); el.classList.remove('gg-hit', 'gg-attack'); void el.offsetWidth; el.classList.add(name); };

  const hud = () => {
    const g = GREMLINS[state.boss];
    $('.gg-score').textContent = `${score()} pts`;
    $('.gg-hearts').textContent = '❤️'.repeat(state.hearts) + '🖤'.repeat(maxHearts - state.hearts);
    $('.gg-streak').textContent = state.streak >= 3 ? `🔥 ${state.streak} in a row · crits!` : (state.streak === 2 ? '🔥 2 in a row · one more to crit' : '');
    $('.gg-name').textContent = `${g.name} · gremlin ${state.boss + 1} of ${GREMLINS.length}`;
    $('.gg-hp i').style.width = `${Math.max(0, (state.hp / g.hp) * 100)}%`;
  };

  const enter = () => {
    const g = GREMLINS[state.boss];
    state.hp = g.hp;
    const el = $('.gg-boss');
    el.className = 'gg-boss';
    el.textContent = g.emoji;
    $('.gg-taunt').textContent = `“${g.taunt}”`;
    hud();
    ask();
  };

  const ask = () => {
    if (state.done) return;
    state.q = deck.deal();
    state.locked = false;
    $('.qz-prompt').textContent = state.q.prompt;
    $('.qz-choices').innerHTML = state.q.choices.map((choice, i) => `<li><button type="button" data-i="${i}"><b>${i + 1}</b><span>${escapeHtml(choice)}</span></button></li>`).join('');
    stage.querySelectorAll('.qz-choices button').forEach((button) => button.addEventListener('click', () => answer(Number(button.dataset.i))));
  };

  const answer = (picked) => {
    if (state.locked || state.done || !state.q) return;
    state.locked = true;
    const q = state.q;
    state.answered += 1;
    stage.querySelectorAll('.qz-choices button').forEach((button, i) => { button.disabled = true; button.classList.add(i === q.answer ? 'qz-right' : i === picked ? 'qz-wrong' : 'qz-dim'); });
    if (picked === q.answer) {
      state.correct += 1;
      state.streak += 1;
      const crit = state.streak >= 3;
      state.hp -= crit ? 2 : 1;
      state.hits += crit ? 2 : 1;
      animate('gg-hit');
      $('.gg-callout').textContent = crit ? '💥 CRITICAL HIT!' : '👊 Hit!';
      sound.good();
      hud();
      if (state.hp <= 0) {
        state.beaten += 1;
        state.hearts = Math.min(maxHearts, state.hearts + 1);
        $('.gg-boss').classList.add('gg-dead');
        $('.gg-callout').textContent = `${GREMLINS[state.boss].name} is gone! +500, and a heart back ❤️`;
        hud();
        setTimeout(() => {
          if (state.done) return;
          if (state.boss === GREMLINS.length - 1) return end('Every gremlin gone. The show goes on! 🎉');
          state.boss += 1;
          enter();
        }, 1300);
      } else setTimeout(ask, 800);
    } else {
      state.streak = 0;
      state.hearts -= 1;
      state.misses.push({ ...q, picked: q.choices[picked] });
      animate('gg-attack');
      stage.classList.remove('gm-shake'); void stage.offsetWidth; stage.classList.add('gm-shake');
      $('.gg-callout').textContent = `${GREMLINS[state.boss].name} got you! −1 ❤️`;
      sound.bad();
      hud();
      const after = () => { if (state.done) return; if (state.hearts <= 0) end(`${GREMLINS[state.boss].name} wrecked the gig`); else ask(); };
      if (easy) setTimeout(() => { if (!state.done) teach($('.gm-teachbox'), q, after); }, 700);
      else setTimeout(after, 2200);
    }
  };

  const onKey = (event) => {
    if (event.target.closest && event.target.closest('.gm-teach')) return;
    if ('1234'.includes(event.key) && event.key.length === 1) { answer(Number(event.key) - 1); event.preventDefault(); }
  };
  const end = (headline) => {
    if (state.done) return;
    state.done = true;
    window.removeEventListener('keydown', onKey);
    finish({ score: score(), label: 'points', headline, misses: state.misses, answered: state.answered, correct: state.correct, details: { gremlinsBeaten: state.beaten, of: GREMLINS.length } });
  };
  window.addEventListener('keydown', onKey);
  $('.gm-quit').addEventListener('click', () => end('You ran away from the gig'));
  enter();
}

mountGame(document.getElementById('game'), {
  id: 'gig-gremlins',
  title: 'Gig Gremlins',
  emoji: '👹',
  tagline: 'Six gremlins are wrecking the gig. Answer right to fight back.',
  rules: [
    'Each gremlin has a health bar. A right answer (tap, or keys 1–4) lands a hit.',
    'Three right in a row and every hit is a <b>critical hit</b>, worth two.',
    'A wrong answer costs you a heart. Beat a gremlin for +500 and a heart back.',
    'Clear all six, ending with the Feedback Banshee, and the show goes on.',
  ],
  modeBlurbs: {
    easier: 'Simpler questions and 6 hearts. A wrong answer stops to show you why.',
    standard: 'Every question a quiz can ask, and 4 hearts. Closest to the final.',
  },
  startLabel: 'Fight! 👊',
  start,
});
