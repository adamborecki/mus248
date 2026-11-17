// ⚡ Follow the Signal: you ARE the signal. Each round is one real Salmon path (chains.js, every hop
// from the Salmon FOH lecture or the CME gig checklist); tap the hops in order, from the source to
// the speaker, and dodge the decoys: real Salmon gear that isn't on this path.

import { escapeHtml, mountGame, shuffle, sound } from '../bank.js';
import { CHAINS, MIXER_LAB } from './chains.js';

// Easier mode: no decoys, the first hop is placed for you, and after a slip the right next tile glows.
function start({ stage, finish, easy }) {
  const rounds = shuffle(CHAINS);
  const state = { round: 0, score: 0, placed: 0, mistakes: [], startedAt: 0, done: false, misses: [], clean: 0 };

  stage.innerHTML = `
    <div class="gm-hud">
      <span class="fs-score">0 pts</span>
      <span class="fs-round"></span>
      <button type="button" class="gm-quit">Unplug</button>
    </div>
    <div class="fs-scene">
      <p class="fs-gig"></p>
      <h2 class="fs-title"></h2>
      <ol class="fs-track" aria-label="Your path so far"></ol>
    </div>
    <p class="fs-callout" aria-live="polite"></p>
    <div class="fs-tray"></div>
    <div class="fs-after" hidden></div>`;

  const $ = (sel) => stage.querySelector(sel);
  const chain = () => rounds[state.round];

  const hud = () => {
    $('.fs-score').textContent = `${state.score} pts`;
    $('.fs-round').textContent = `Path ${state.round + 1} of ${rounds.length}`;
  };

  const drawTrack = () => {
    const c = chain();
    const placed = c.hops.slice(0, state.placed);
    const arrow = '<li class="fs-arrow" aria-hidden="true">→</li>';
    $('.fs-track').innerHTML = placed.map((hop, i) => `<li class="fs-hop${i === placed.length - 1 ? ' fs-new' : ''}" style="--i:${i}">${escapeHtml(hop)}</li>`).join(arrow)
      + (state.placed < c.hops.length ? `${placed.length ? arrow : ''}<li class="fs-spark" aria-hidden="true">⚡</li>` : '');
  };

  const showRound = () => {
    const c = chain();
    state.placed = easy ? 1 : 0;
    state.mistakes = [];
    state.startedAt = performance.now();
    $('.fs-gig').textContent = c.gig;
    $('.fs-title').textContent = c.title;
    $('.fs-callout').textContent = easy ? `It starts at ${c.hops[0]}. Where does it go next?` : 'Where does the signal start?';
    $('.fs-after').hidden = true;
    $('.fs-scene').classList.remove('fs-live');
    const hops = c.hops.map((hop, i) => ({ text: hop, step: i })).filter((tile) => tile.step >= state.placed);
    const tiles = shuffle([...hops, ...(easy ? [] : c.decoys.map((text) => ({ text, step: -1 })))]);
    $('.fs-tray').innerHTML = tiles.map((tile) => `<button type="button" class="fs-tile" data-step="${tile.step}">${escapeHtml(tile.text)}</button>`).join('');
    stage.querySelectorAll('.fs-tile').forEach((tile) => tile.addEventListener('click', () => tap(tile)));
    drawTrack();
    hud();
  };

  const buzz = (tile, message) => {
    tile.classList.remove('fs-buzz');
    void tile.offsetWidth;
    tile.classList.add('fs-buzz');
    $('.fs-callout').textContent = message;
    sound.bad();
    if (easy) stage.querySelector(`.fs-tile[data-step="${state.placed}"]`)?.classList.add('fs-hint');
  };

  const tap = (tile) => {
    if (state.done || tile.disabled) return;
    const c = chain();
    const step = Number(tile.dataset.step);
    if (step === state.placed) {
      tile.disabled = true;
      tile.classList.add('fs-used');
      stage.querySelectorAll('.fs-hint').forEach((hinted) => hinted.classList.remove('fs-hint'));
      state.placed += 1;
      sound.blip(440 + state.placed * 90, 70);
      drawTrack();
      if (state.placed === c.hops.length) complete();
      else $('.fs-callout').textContent = ['Zzzap. Next hop?', 'Still flowing…', 'And then?', 'Keep going ⚡'][state.placed % 4];
      return;
    }
    if (step < 0) {
      state.mistakes.push(`${tile.textContent} (not on this path)`);
      tile.disabled = true;
      tile.classList.add('fs-decoy');
      buzz(tile, `🚫 ${tile.textContent} isn't on this path.`);
    } else {
      state.mistakes.push(`${tile.textContent} (too early)`);
      buzz(tile, `Not yet. Something comes before ${tile.textContent}.`);
    }
  };

  const complete = () => {
    const c = chain();
    const seconds = (performance.now() - state.startedAt) / 1000;
    const points = Math.max(20, 100 - 25 * state.mistakes.length) + Math.round(Math.max(0, 50 - seconds * 2));
    state.score += points;
    if (!state.mistakes.length) state.clean += 1;
    else state.misses.push({ id: c.id, topic: 'salmon', prompt: `${c.gig}: ${c.title}`, choices: [c.hops.join(' → ')], answer: 0, picked: state.mistakes.join(' · '), explanation: c.why });
    $('.fs-scene').classList.add('fs-live');
    $('.fs-callout').textContent = state.mistakes.length ? `🔊 Sound! +${points}` : `🔊 Clean path! +${points}`;
    sound.good();
    $('.fs-tray').innerHTML = '';
    const last = state.round === rounds.length - 1;
    const after = $('.fs-after');
    // Photos resolve against this page, so chains.js names them relative to it.
    const photo = c.photo
      ? `<figure class="fs-photo"><a href="${escapeHtml(c.photo.src)}" target="_blank" rel="noopener"><img src="${escapeHtml(c.photo.src)}" alt="${escapeHtml(c.photo.caption)}" loading="lazy"></a><figcaption>${escapeHtml(c.photo.caption)}</figcaption></figure>`
      : '';
    after.innerHTML = `<p class="fs-why">${escapeHtml(c.why)}</p>${photo}
      <p class="fs-src">From ${escapeHtml(c.source)} · <a href="${MIXER_LAB}${escapeHtml(c.lab)}" target="_blank" rel="noopener">Try it in Mixer Lab ↗</a></p>
      <button type="button" class="gm-start fs-next">${last ? 'See your score' : 'Next path ⚡'}</button>`;
    after.hidden = false;
    after.querySelector('.fs-next').addEventListener('click', () => {
      if (last) return end(state.clean === rounds.length ? 'Every path clean. You are the signal ⚡' : 'All paths traced ⚡');
      state.round += 1;
      showRound();
    });
    after.querySelector('.fs-next').focus();
    hud();
  };

  const end = (headline) => {
    if (state.done) return;
    state.done = true;
    finish({ score: state.score, label: 'points', headline, misses: state.misses });
  };

  $('.gm-quit').addEventListener('click', () => end('Unplugged mid-gig 🔌'));
  showRound();
}

mountGame(document.getElementById('game'), {
  id: 'follow-the-signal',
  title: 'Follow the Signal',
  emoji: '⚡',
  tagline: 'You are the signal. Get from the mic to the speaker in Salmon without getting lost.',
  rules: [
    'Each round is one real Salmon path: Vocal Jazz, CME, or the gain chain.',
    'Tap the hops <b>in order</b>, from where the signal starts to where it comes out.',
    'Watch for decoys: real Salmon gear that isn\'t on this path. Tapping one costs points.',
    'Clean, fast paths score the most. Each one ends with why it works, and a Mixer Lab scenario to try it.',
  ],
  startLabel: 'Plug in ⚡',
  useBank: false,
  modeBlurbs: {
    easier: 'No decoys, the first hop is placed for you, and the right next hop glows if you slip.',
    standard: 'Decoys included: real Salmon gear that belongs somewhere else. Closest to the final.',
  },
  outro: `<p class="gm-note">Every path comes from the Salmon FOH lecture (Nov 2) and the CME Gig Checklist.
    Practice the real thing in Mixer Lab: <a href="${MIXER_LAB}x32-cme-tour" target="_blank" rel="noopener">CME in Salmon</a>
    · <a href="${MIXER_LAB}x32-vj-link" target="_blank" rel="noopener">Vocal Jazz in Salmon</a>.</p>`,
  start,
});
