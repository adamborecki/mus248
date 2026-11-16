// Shared plumbing for the final-exam practice games (/performance-evals/games/<game>/).
// Every game draws from the quiz's own question bank (quiz/data/questions.json, the whole bank,
// verified or not), so there is nothing to author here: new quiz questions show up in the games
// on their own. Each game gets: a lobby (topic picker + best score), a deck that deals questions
// with their choices shuffled, and an end screen that reviews every miss with its explanation.

import { crumbs } from '../../crumbs.js';

const BANK_URL = new URL('../../quiz/data/questions.json', import.meta.url);

// The bank's topic ids, as students read them. Anything new falls back to Title Case.
const TOPIC_LABELS = {
  audio_fundamentals: 'Audio basics', professionalism: 'The job', live_sound: 'Live sound',
  video_fundamentals: 'Video', stereo_capture: 'Stereo recording', dante: 'Dante',
  live_looping: 'Live looping', power: 'Power', zoom_f8: 'Zoom F8', final_cut: 'Final Cut',
  data_management: 'Data management', salmon: 'Salmon gigs', gigs: 'Gigs & venues', vibecoding: 'Vibecoding',
};
export const topicLabel = (id) => TOPIC_LABELS[id] || id.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export const escapeHtml = (text) => String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

let bankPromise = null;
export function loadBank() {
  bankPromise ||= fetch(BANK_URL, { cache: 'no-cache' }).then((response) => {
    if (!response.ok) throw new Error('Could not load the question bank');
    return response.json();
  }).then((bank) => bank.questions.filter((q) => Array.isArray(q.choices) && q.choices.length >= 2
    && Number.isInteger(q.answer_index) && q.choices[q.answer_index] !== undefined));
  return bankPromise;
}

// A dealer over the chosen questions: never repeats until it has used them all, and hands each one
// out with its choices shuffled and the correct one's new position as `answer`.
export function makeDeck(questions) {
  let pile = [];
  const deal = (avoidSkills = []) => {
    if (!pile.length) pile = shuffle(questions);
    let at = pile.findIndex((q) => !avoidSkills.includes(q.skill));
    if (at < 0) at = 0;
    const [q] = pile.splice(at, 1);
    const order = shuffle(q.choices.map((_, i) => i));
    return {
      id: q.id, skill: q.skill, topic: q.topic, prompt: q.prompt, explanation: q.explanation || '',
      choices: order.map((i) => q.choices[i]), answer: order.indexOf(q.answer_index),
    };
  };
  return { deal, size: questions.length };
}

// ---------- storage (per device, best effort) ----------

const KEY = (game) => `mus248-games-${game}`;
export function loadPrefs(game) {
  try { return JSON.parse(localStorage.getItem(KEY(game)) || '{}') || {}; } catch { return {}; }
}
export function savePrefs(game, prefs) {
  try { localStorage.setItem(KEY(game), JSON.stringify({ ...loadPrefs(game), ...prefs })); } catch { /* private mode: fine */ }
}

// ---------- sound (off by default, tiny synth blips) ----------

let audio = null;
export const sound = {
  on: false,
  context() {
    if (!this.on) return null;
    try { audio ||= new (window.AudioContext || window.webkitAudioContext)(); return audio; } catch { return null; }
  },
  blip(freq = 660, ms = 90, type = 'square', gain = 0.05) {
    if (!this.on) return;
    try {
      audio ||= new (window.AudioContext || window.webkitAudioContext)();
      const osc = audio.createOscillator();
      const amp = audio.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      amp.gain.setValueAtTime(gain, audio.currentTime);
      amp.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + ms / 1000);
      osc.connect(amp).connect(audio.destination);
      osc.start();
      osc.stop(audio.currentTime + ms / 1000);
    } catch { /* no audio: silent game */ }
  },
  good() { this.blip(880, 80); setTimeout(() => this.blip(1320, 120), 70); },
  bad() { this.blip(140, 260, 'sawtooth', 0.06); },
};

// ---------- the frame every game shares ----------

// Mounts the lobby into root and calls start({ deck, topic, root: stage }) when the player hits
// Start. The game calls the `finish` it was handed with { score, label, misses } to show the end screen.
export async function mountGame(root, game) {
  const prefs = loadPrefs(game.id);
  sound.on = Boolean(prefs.sound);
  document.title = `${game.title} · MUS 248`;
  const trail = crumbs([['Performance Evals', 'performance-evals/#final'], [game.title]]);
  root.innerHTML = `${trail}<div class="gm-stage" data-game="${game.id}"><p class="quiet">Loading the question bank…</p></div>`;
  const stage = root.querySelector('.gm-stage');
  let questions;
  try { questions = await loadBank(); } catch {
    stage.innerHTML = '<p class="quiet">The question bank could not be loaded. Check your connection and reload.</p>';
    return;
  }
  const counts = {};
  questions.forEach((q) => { counts[q.topic] = (counts[q.topic] || 0) + 1; });
  const topics = Object.keys(counts).sort((a, b) => topicLabel(a).localeCompare(topicLabel(b)));

  const lobby = () => {
    const best = loadPrefs(game.id).best || {};
    const topic = loadPrefs(game.id).topic && counts[loadPrefs(game.id).topic] ? loadPrefs(game.id).topic : 'all';
    stage.innerHTML = `
      <section class="gm-lobby">
        <div class="gm-hero" aria-hidden="true">${game.emoji}</div>
        <h1>${escapeHtml(game.title)}</h1>
        <p class="gm-tagline">${game.tagline}</p>
        <ol class="gm-rules">${game.rules.map((rule) => `<li>${rule}</li>`).join('')}</ol>
        <div class="gm-setup">
          <label>Topic <select class="gm-topic">
            <option value="all">All topics (${questions.length})</option>
            ${topics.map((t) => `<option value="${escapeHtml(t)}"${t === topic ? ' selected' : ''}>${escapeHtml(topicLabel(t))} (${counts[t]})</option>`).join('')}
          </select></label>
          <label class="gm-sound"><input type="checkbox"${sound.on ? ' checked' : ''}> Sound</label>
        </div>
        <button type="button" class="gm-start">${escapeHtml(game.startLabel || 'Start')}</button>
        <p class="gm-best">${Object.keys(best).length ? `🏆 Best: ${Object.entries(best).map(([t, s]) => `${escapeHtml(t === 'all' ? 'All topics' : topicLabel(t))} ${s}`).join(' · ')}` : '🏆 No best score yet on this device.'}</p>
      </section>`;
    stage.querySelector('.gm-sound input').addEventListener('change', (event) => {
      sound.on = event.target.checked;
      savePrefs(game.id, { sound: sound.on });
      sound.good();
    });
    stage.querySelector('.gm-start').addEventListener('click', () => {
      const chosen = stage.querySelector('.gm-topic').value;
      savePrefs(game.id, { topic: chosen });
      const pool = chosen === 'all' ? questions : questions.filter((q) => q.topic === chosen);
      stage.innerHTML = '';
      game.start({ deck: makeDeck(pool), topic: chosen, stage, finish: (result) => finish(chosen, result) });
    });
    stage.querySelector('.gm-start').focus();
  };

  const finish = (topic, { score, label = 'points', headline = 'Game over', misses = [] }) => {
    const all = loadPrefs(game.id).best || {};
    const record = score > (all[topic] || 0);
    if (record) savePrefs(game.id, { best: { ...all, [topic]: score } });
    stage.innerHTML = `
      <section class="gm-over">
        <h1>${escapeHtml(headline)}</h1>
        <p class="gm-final"><strong>${score}</strong> ${escapeHtml(label)}${record && score > 0 ? ' <span class="gm-record">🏆 New best!</span>' : ''}</p>
        <div class="gm-again"><button type="button" class="gm-start">Play again</button>
          <a href="../../#final">All games</a></div>
        ${misses.length ? `<h2>Worth another look (${misses.length})</h2>
          <ol class="gm-misses">${misses.map((m) => `<li>
            <p class="gm-q">${escapeHtml(m.prompt)}</p>
            ${m.picked !== undefined && m.picked !== null ? `<p class="gm-wrong">✗ ${escapeHtml(m.picked)}</p>` : ''}
            <p class="gm-right">✓ ${escapeHtml(m.choices[m.answer])}</p>
            ${m.explanation ? `<p class="gm-why">${escapeHtml(m.explanation)}</p>` : ''}
            <p class="gm-tag">${escapeHtml(topicLabel(m.topic))} · ${escapeHtml(m.id)}</p></li>`).join('')}</ol>`
        : '<p class="quiet">No misses. Nothing to review!</p>'}
        <p class="gm-note">These come straight from the quiz question bank, including questions that haven't been checked yet.
          One looks wrong? Tell us with <a data-feedback href="#">🛠️ Repo improvements</a> and mention its id.</p>
      </section>`;
    stage.querySelector('.gm-start').addEventListener('click', lobby);
    stage.querySelector('.gm-start').focus();
    import('../../feedback.js').then(({ REPO_IMPROVEMENT_FORM }) => {
      stage.querySelectorAll('a[data-feedback]').forEach((link) => { link.href = REPO_IMPROVEMENT_FORM; link.target = '_blank'; link.rel = 'noopener'; });
    }).catch(() => {});
    window.scrollTo(0, 0);
  };

  lobby();
}
