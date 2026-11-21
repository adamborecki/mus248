// 📖 Speed Read: the question flashes by one word at a time, then it's gone and only the answers
// are left. A right answer speeds the next question up; a wrong one slows it down and costs a
// pair of glasses. The score is the fastest speed a question was read at and still answered right.
//
// It's reading practice, not a promise: flashing words faster costs comprehension, and the game is
// built to make that felt. What it trains is catching the one word a question turns on ("not",
// "first", a channel number) on a single pass.

import { escapeHtml, mountGame, sound, teach } from '../bank.js';

// Easier mode: starts slower, climbs and falls more gently, one more pair of glasses, and a
// question can be flashed again as often as you like for free.
const TUNING = {
  standard: { start: 300, step: 25, drop: 50, lives: 3, replays: 1, replayCost: 25 },
  easier: { start: 200, step: 20, drop: 40, lives: 4, replays: Infinity, replayCost: 0 },
};
const MIN_WPM = 120;
const MAX_WPM = 900;

// How long a word stays up, as a multiple of the base 60000 / wpm: long words, numbers, and the
// end of a clause or sentence get longer, so the nominal speed is a little kinder than it sounds.
export function wordWeight(word) {
  let weight = 1;
  if (word.length > 8) weight += 0.3;
  if (/\d/.test(word)) weight += 0.4;
  if (/[,;:]["”’')\]]*$/.test(word)) weight += 0.5;
  else if (/[.?!]["”’')\]]*$/.test(word)) weight += 1;
  return weight;
}

// The letter the eye should land on: a little left of the middle, further in for longer words.
export function pivotIndex(word) {
  const lead = (word.match(/^[^\p{L}\p{N}]+/u) || [''])[0].length;
  const core = word.slice(lead).replace(/[^\p{L}\p{N}]+$/u, '').length;
  const at = core <= 1 ? 0 : core <= 5 ? 1 : core <= 9 ? 2 : core <= 13 ? 3 : 4;
  return Math.min(word.length - 1, lead + at);
}

function start({ deck, stage, finish, easy }) {
  const tune = TUNING[easy ? 'easier' : 'standard'];
  const state = {
    wpm: tune.start, top: 0, lives: tune.lives, right: 0, answered: 0, replays: 0, replaysThis: 0,
    q: null, words: [], phase: 'idle', timer: 0, interrupted: false, done: false, misses: [],
  };

  stage.innerHTML = `
    <div class="gm-hud">
      <span class="sr-speed"></span>
      <span class="sr-top"></span>
      <span class="sr-lives" aria-label="Glasses left"></span>
      <button type="button" class="gm-quit">Close the book</button>
    </div>
    <div class="sr-reader" aria-hidden="true">
      <div class="sr-word"></div>
      <div class="sr-progress"><i></i></div>
    </div>
    <p class="sr-status" aria-live="polite"></p>
    <div class="sr-card" hidden>
      <p class="sr-prompt" hidden></p>
      <div class="sr-choices"></div>
      <div class="sr-actions"></div>
    </div>
    <div class="gm-teachbox"></div>`;

  const $ = (sel) => stage.querySelector(sel);
  const wordBox = $('.sr-word');

  const hud = () => {
    $('.sr-speed').textContent = `⚡ ${state.wpm} wpm`;
    $('.sr-top').textContent = state.top ? `🏁 top ${state.top}` : '';
    $('.sr-lives').textContent = '👓'.repeat(state.lives) || '—';
  };

  // One word, placed so its pivot letter sits on the guide marks and the eye never has to move.
  const paint = (word) => {
    const at = pivotIndex(word);
    wordBox.style.fontSize = word.length > 13 ? `${13 / word.length}em` : '';
    wordBox.innerHTML = `<span class="sr-token">${escapeHtml(word.slice(0, at))}<b>${escapeHtml(word[at])}</b>${escapeHtml(word.slice(at + 1))}</span>`;
    const token = wordBox.firstChild;
    const pivot = token.querySelector('b');
    token.style.transform = `translateX(${-(pivot.offsetLeft + pivot.offsetWidth / 2)}px)`;
  };

  const progress = (fraction) => { $('.sr-progress i').style.width = `${Math.round(fraction * 100)}%`; };

  // Flash the question: a beat on the focus dot, each word in turn, then the answers.
  const flash = () => {
    clearTimeout(state.timer);
    state.phase = 'flash';
    state.interrupted = false;
    $('.sr-card').hidden = true;
    $('.sr-status').textContent = `Reading at ${state.wpm} wpm…`;
    wordBox.style.fontSize = '';
    wordBox.innerHTML = '<span class="sr-token sr-dot">●</span>';
    wordBox.firstChild.style.transform = 'translateX(-50%)';
    progress(0);
    const base = 60000 / state.wpm;
    let i = 0;
    const next = () => {
      if (state.done) return;
      if (i >= state.words.length) return ask();
      paint(state.words[i]);
      progress((i + 1) / state.words.length);
      const wait = base * wordWeight(state.words[i]);
      i += 1;
      state.timer = setTimeout(next, wait);
    };
    state.timer = setTimeout(next, 750);
  };

  const canReplay = () => state.replaysThis < tune.replays && state.wpm - tune.replayCost >= MIN_WPM;

  // The question is gone: only the answers are left.
  const ask = () => {
    state.phase = 'ask';
    const q = state.q;
    wordBox.style.fontSize = '';
    wordBox.innerHTML = '<span class="sr-token sr-dot">?</span>';
    wordBox.firstChild.style.transform = 'translateX(-50%)';
    $('.sr-status').textContent = 'What did it ask? Pick the answer.';
    $('.sr-prompt').hidden = true;
    $('.sr-choices').innerHTML = q.choices.map((choice, n) => `<button type="button" data-i="${n}"><b>${n + 1}</b> ${escapeHtml(choice)}</button>`).join('');
    stage.querySelectorAll('.sr-choices button').forEach((button) => button.addEventListener('click', () => answer(Number(button.dataset.i))));
    $('.sr-actions').innerHTML = canReplay()
      ? `<button type="button" class="sr-replay">🔁 Flash it again${tune.replayCost ? ` (−${tune.replayCost} wpm)` : ''}</button>`
      : '';
    $('.sr-replay')?.addEventListener('click', replay);
    $('.sr-card').hidden = false;
  };

  const replay = () => {
    if (state.phase !== 'ask' || !canReplay()) return;
    state.replaysThis += 1;
    state.replays += 1;
    state.wpm -= tune.replayCost;
    hud();
    flash();
  };

  const show = () => {
    state.q = deck.deal();
    state.words = state.q.prompt.trim().split(/\s+/);
    state.replaysThis = 0;
    hud();
    flash();
  };

  const answer = (picked) => {
    if (state.phase !== 'ask' || state.done) return;
    const q = state.q;
    if (picked < 0 || picked >= q.choices.length) return;
    state.phase = 'review';
    state.answered += 1;
    const buttons = [...stage.querySelectorAll('.sr-choices button')];
    buttons.forEach((button, n) => { button.disabled = true; button.classList.add(n === q.answer ? 'sr-right' : n === picked ? 'sr-wrong' : 'sr-dim'); });
    $('.sr-actions').innerHTML = '';
    // Now the whole question, to check it against what you thought you read.
    $('.sr-prompt').textContent = q.prompt;
    $('.sr-prompt').hidden = false;
    if (picked === q.answer) {
      state.right += 1;
      state.top = Math.max(state.top, state.wpm);
      $('.sr-status').textContent = `Got it at ${state.wpm} wpm. Faster…`;
      state.wpm = Math.min(MAX_WPM, state.wpm + tune.step);
      sound.good();
      hud();
      state.timer = setTimeout(() => { if (!state.done) show(); }, 1300);
      return;
    }
    state.lives -= 1;
    state.misses.push({ ...q, picked: q.choices[picked] });
    $('.sr-status').textContent = `Missed at ${state.wpm} wpm. Here's what it said:`;
    state.wpm = Math.max(MIN_WPM, state.wpm - tune.drop);
    stage.classList.remove('gm-shake');
    void stage.offsetWidth;
    stage.classList.add('gm-shake');
    sound.bad();
    hud();
    const after = () => { if (state.done) return; if (state.lives <= 0) end(); else show(); };
    if (easy) { teach($('.gm-teachbox'), q, after); return; }
    $('.sr-actions').innerHTML = `<button type="button" class="sr-next">${state.lives <= 0 ? 'See how you did ▶' : 'Next ▶'}</button>`;
    $('.sr-next').addEventListener('click', after, { once: true });
    $('.sr-next').focus({ preventScroll: true });
  };

  const end = (headline) => {
    if (state.done) return;
    state.done = true;
    clearTimeout(state.timer);
    window.removeEventListener('keydown', onKey);
    document.removeEventListener('visibilitychange', onVisibility);
    finish({
      score: state.top, label: 'wpm top speed',
      headline: headline || 'You lost the thread 📖',
      misses: state.misses, answered: state.answered, correct: state.right,
      details: { startWpm: tune.start, endWpm: state.wpm, replays: state.replays },
    });
  };

  const onKey = (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key.length === 1 && '1234'.includes(event.key)) { answer(Number(event.key) - 1); event.preventDefault(); }
    else if (event.key.toLowerCase() === 'r') replay();
  };
  // A background tab throttles timers, so words would be skipped: flash the question again, free.
  const onVisibility = () => {
    if (document.hidden) {
      if (state.phase === 'flash') { clearTimeout(state.timer); state.interrupted = true; }
    } else if (state.interrupted && !state.done) flash();
  };
  window.addEventListener('keydown', onKey);
  document.addEventListener('visibilitychange', onVisibility);
  $('.gm-quit').addEventListener('click', () => end('You closed the book'));

  show();
}

if (typeof document !== 'undefined') mountGame(document.getElementById('game'), {
  id: 'speed-read',
  title: 'Speed Read',
  emoji: '📖',
  tagline: 'The question flashes by one word at a time. Read it once, then answer.',
  rules: [
    'Keep your eyes on the colored letter. The question flashes past one word at a time, then it\'s gone.',
    'Pick the answer (tap, or keys 1–4). Right: the next one comes <b>faster</b>. Wrong: slower, and you lose a pair of 👓.',
    'Not sure what it said? <b>🔁 Flash it again</b> (key R).',
    'Your score is the fastest speed you read a question at and still got it right. Out of glasses, and it\'s over.',
    'It turns on one word: <i>not</i>, <i>first</i>, a number. That\'s the practice, on any exam: read the whole question.',
  ],
  modeBlurbs: {
    easier: 'Simpler questions, starting at 200 words a minute, four pairs of glasses. Flash a question again as often as you like, and a miss stops to show you why.',
    standard: 'Every question a quiz can ask, starting at 300 words a minute, three pairs of glasses. One replay a question, and it costs 25 wpm.',
  },
  startLabel: 'Start reading 📖',
  start,
});
