// Shared plumbing for the final-exam practice games (/performance-evals/games/<game>/).
// Every game draws from the quiz's own question bank (quiz/data/questions.json), so there is
// nothing to author here: new quiz questions show up in the games on their own. Each game gets: a
// lobby (mode, topic, best score), a deck that deals questions with their choices shuffled, and an
// end screen that reviews every miss with its explanation.
//
// Two modes, both judged by the quiz engine's own rules (tierOf, from quiz/js/engine.js):
//   standard  everything a quiz can ask: no drafts, nothing on an inactive (untaught) skill, every
//             level, including the level 2-3 troubleshooting ones the weekly graded set leaves out.
//   easier    the essentials, simpler questions: level 0-1 (recognition and recall) on Core skills,
//             plus the Salmon signal-flow skills, which are Practice but essential. Games also slow
//             down, forgive more, and stop to teach after a miss.

import { crumbs } from '../../crumbs.js';
import { tierOf } from '../../quiz/js/engine.js';
import { loadSkillSources } from '../helpful.js';
import { sha256Hex } from '../../lectures/refresher.js';

const BANK_URL = new URL('../../quiz/data/questions.json', import.meta.url);
const CURRICULUM_URL = new URL('../../quiz/data/curriculum.json', import.meta.url);

export const MODES = {
  easier: {
    label: '🌱 Easier', blurb: 'The essentials, simpler questions, slower pace. A miss stops to show you why.',
  },
  standard: {
    label: '🎯 Standard', blurb: 'Every question a quiz can ask, harder ones included, at full speed. Closest to the final.',
  },
};
const MODE_IDS = Object.keys(MODES);

// A preset across topics: the skills behind Salmon's routing and gain staging (the Salmon FOH lecture,
// its gig checklists, and Mixer Lab's Salmon scenarios). Listed first in every game's topic picker.
export const SALMON_FLOW = 'salmon-flow';
const SALMON_FLOW_SKILLS = ['signal_flow', 'live_signal_flow', 'gain_chain', 'sends_on_fader', 'buses', 'stage_box_snake',
  'salmon_audio_setup', 'salmon_aes50', 'salmon_mains', 'salmon_wedges', 'salmon_gains', 'salmon_gig_compare', 'wedge_check'];
const isSalmonFlow = (q) => SALMON_FLOW_SKILLS.includes(q.skill);
const inTopic = (q, topic) => topic === 'all' || (topic === SALMON_FLOW ? SALMON_FLOW_SKILLS.includes(q.skill) : q.topic === topic);

// The bank's topic ids, as students read them. Anything new falls back to Title Case.
const TOPIC_LABELS = {
  audio_fundamentals: 'Audio basics', professionalism: 'The job', live_sound: 'Live sound',
  video_fundamentals: 'Video', stereo_capture: 'Stereo recording', dante: 'Dante',
  live_looping: 'Live looping', power: 'Power', zoom_f8: 'Zoom F8', final_cut: 'Final Cut',
  data_management: 'Data management', salmon: 'Salmon gigs', gigs: 'Gigs & venues', vibecoding: 'Vibecoding',
  [SALMON_FLOW]: '🐟 Salmon signal flow',
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

const getJson = (url) => fetch(url, { cache: 'no-cache' }).then((response) => {
  if (!response.ok) throw new Error(`Could not load ${url}`);
  return response.json();
});

// Which questions each mode may deal. `curriculum` is quiz/data/curriculum.json; exported so the
// checker can hold the pools to the same rules the page uses.
export function modePools(questions, curriculum) {
  const usable = questions.filter((q) => Array.isArray(q.choices) && q.choices.length >= 2
    && Number.isInteger(q.answer_index) && q.choices[q.answer_index] !== undefined);
  const standard = usable.filter((q) => !q.draft && tierOf(curriculum, q) !== 'inactive');
  const easier = standard.filter((q) => (q.level ?? 0) <= 1 && (tierOf(curriculum, q) === 'core' || isSalmonFlow(q)));
  return { standard, easier };
}

let bankPromise = null;
export function loadBank() {
  bankPromise ||= Promise.all([getJson(BANK_URL), getJson(CURRICULUM_URL)])
    .then(([bank, curriculum]) => modePools(bank.questions, curriculum));
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

// ---------- the Canvas deliverable ----------

// Every run ends in a Canvas deliverable, the online refresher's shape: a summary to read, then a
// JSON receipt with a SHA-256 checksum of the payload (same sha256Hex, same "sha256:" prefix).
// Exported so the checker can prove its shape without a browser.
export const DELIVERABLE_SCHEMA = 'mus248-games-v1';
export function gameDeliverable({ game, mode, topic, options = {}, run, result }) {
  const { score, label = 'points', headline = '', misses = [], answered = 0, correct = 0, practice = '', details, tally } = result;
  const seconds = Math.max(0, Math.round((Date.parse(run.finishedAt) - Date.parse(run.startedAt)) / 1000));
  const minutes = Math.round((seconds / 60) * 10) / 10;
  const on = Object.keys(options).filter((key) => options[key]);
  const where = [MODES[mode].label, ...(game.useBank === false ? [] : [topic === 'all' ? 'All topics' : topicLabel(topic)]), ...on.map((key) => (game.options || []).find((o) => o.id === key)?.label || key)];
  const lines = [
    `MUS 248 practice game: ${game.title} (${where.join(' · ')})`,
    `${score} ${label} · ${tally || `${answered} answered, ${correct} right`} · about ${minutes} min${headline ? ` · ended: ${headline}` : ''}`,
    misses.length ? `Missed (${misses.length}): ${misses.map((m) => m.id).join(', ')}` : 'Missed: none',
  ];
  const payload = {
    schema: DELIVERABLE_SCHEMA,
    game: { id: game.id, title: game.title },
    mode,
    topic,
    options: on,
    practice: Boolean(practice),
    sessionId: run.sessionId,
    startedAt: run.startedAt,
    generatedAt: run.finishedAt,
    activeMinutes: minutes,
    score,
    answered,
    correct,
    missed: misses.map((m) => ({ id: m.id, picked: m.picked ?? null })),
    ...(details ? { details } : {}),
  };
  return { lines, payload };
}

async function deliverableText(info) {
  const { lines, payload } = gameDeliverable(info);
  const final = { ...payload, checksum: `sha256:${await sha256Hex(JSON.stringify(payload))}` };
  return `${lines.join('\n')}\n\n${JSON.stringify(final, null, 2)}`;
}

// Best scores are kept per mode, as "mode|topic". Keys from before modes existed (just the topic)
// were standard games.
function bestFor(best = {}, mode) {
  const out = {};
  Object.entries(best || {}).forEach(([key, score]) => {
    const [m, t] = key.includes('|') ? key.split('|') : ['standard', key];
    if (m === mode) out[t] = Math.max(out[t] || 0, score);
  });
  return out;
}

// Easier mode's teaching card after a miss: the right answer and why, until the player taps Got it.
export function teach(container, q, onDone) {
  container.innerHTML = `<div class="gm-teach" role="status">
      <p class="gm-teach-head">Not quite. Here's the idea:</p>
      <p class="gm-right">✓ ${escapeHtml(q.choices[q.answer])}</p>
      ${q.explanation ? `<p class="gm-why">${escapeHtml(q.explanation)}</p>` : ''}
      <button type="button" class="gm-gotit">Got it ▶</button>
    </div>`;
  const button = container.querySelector('.gm-gotit');
  const done = () => { container.innerHTML = ''; onDone(); };
  button.addEventListener('click', done, { once: true });
  button.focus({ preventScroll: true });
  container.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
}

// ---------- the frame every game shares ----------

// Mounts the lobby into root and calls start({ deck, topic, mode, easy, stage, finish }) when the
// player hits Start. The game calls the `finish` it was handed with { score, label, misses } to show the end screen.
export async function mountGame(root, game) {
  const prefs = loadPrefs(game.id);
  sound.on = Boolean(prefs.sound);
  document.title = `${game.title} · MUS 248`;
  const trail = crumbs([['Performance Evals', 'performance-evals/#final'], [game.title]]);
  root.innerHTML = `${trail}<div class="gm-stage" data-game="${game.id}"><p class="quiet">Loading the question bank…</p></div>`;
  const stage = root.querySelector('.gm-stage');
  let pools = { standard: [], easier: [] };
  if (game.useBank !== false) try { pools = await loadBank(); } catch {
    stage.innerHTML = '<p class="quiet">The question bank could not be loaded. Check your connection and reload.</p>';
    return;
  }
  // ?mode=easier in a link picks the mode (and remembers it), so a student can be sent straight there.
  const asked = new URLSearchParams(window.location.search).get('mode');
  if (MODE_IDS.includes(asked)) savePrefs(game.id, { mode: asked });
  const currentMode = () => (MODE_IDS.includes(loadPrefs(game.id).mode) ? loadPrefs(game.id).mode : 'standard');

  const lobby = () => {
    const mode = currentMode();
    const questions = pools[mode];
    const counts = {};
    questions.forEach((q) => { counts[q.topic] = (counts[q.topic] || 0) + 1; });
    const topics = Object.keys(counts).sort((a, b) => topicLabel(a).localeCompare(topicLabel(b)));
    counts[SALMON_FLOW] = questions.filter((q) => inTopic(q, SALMON_FLOW)).length;
    const best = bestFor(loadPrefs(game.id).best, mode);
    const saved = loadPrefs(game.id).topic;
    const topic = saved && counts[saved] ? saved : 'all';
    stage.innerHTML = `
      <section class="gm-lobby">
        <div class="gm-hero" aria-hidden="true">${game.emoji}</div>
        <h1>${escapeHtml(game.title)}</h1>
        <p class="gm-tagline">${game.tagline}</p>
        <ol class="gm-rules">${game.rules.map((rule) => `<li>${rule}</li>`).join('')}</ol>
        <fieldset class="gm-modes"><legend>Mode</legend>
          ${MODE_IDS.map((id) => `<label class="gm-mode"><input type="radio" name="gm-mode" value="${id}"${id === mode ? ' checked' : ''}>
            <span><strong>${MODES[id].label}</strong><small>${escapeHtml((game.modeBlurbs || {})[id] || MODES[id].blurb)}</small></span></label>`).join('')}
        </fieldset>
        <div class="gm-setup">
          ${game.useBank === false ? '' : `<label>Topic <select class="gm-topic">
            <option value="all">All topics (${questions.length})</option>
            ${counts[SALMON_FLOW] ? `<option value="${SALMON_FLOW}"${topic === SALMON_FLOW ? ' selected' : ''}>${topicLabel(SALMON_FLOW)} (${counts[SALMON_FLOW]})</option>` : ''}
            ${topics.map((t) => `<option value="${escapeHtml(t)}"${t === topic ? ' selected' : ''}>${escapeHtml(topicLabel(t))} (${counts[t]})</option>`).join('')}
          </select></label>`}
          ${(game.options || []).map((option) => `<label class="gm-option"><input type="checkbox" data-option="${option.id}"${(loadPrefs(game.id).options || {})[option.id] ? ' checked' : ''}><span>${escapeHtml(option.label)}<small>${escapeHtml(option.hint)}</small></span></label>`).join('')}
          <label class="gm-sound"><input type="checkbox"${sound.on ? ' checked' : ''}> Sound</label>
        </div>
        <button type="button" class="gm-start">${escapeHtml(game.startLabel || 'Start')}</button>
        <p class="gm-helpful"><a href="../../#final-helpful-stuff">📚 Helpful stuff: lectures, notes, and checklists</a></p>
        <p class="gm-best">${Object.keys(best).length ? `🏆 Best (${escapeHtml(MODES[mode].label.replace(/^\S+\s/, ''))}): ${Object.entries(best).map(([t, s]) => `${escapeHtml(t === 'all' ? 'All topics' : topicLabel(t))} ${s}`).join(' · ')}` : `🏆 No ${escapeHtml(MODES[mode].label.replace(/^\S+\s/, '').toLowerCase())} best score yet on this device.`}</p>
      </section>`;
    stage.querySelectorAll('.gm-modes input').forEach((input) => input.addEventListener('change', () => {
      savePrefs(game.id, { mode: input.value });
      lobby();
      stage.querySelector(`.gm-modes input[value="${input.value}"]`).focus();
    }));
    stage.querySelector('.gm-sound input').addEventListener('change', (event) => {
      sound.on = event.target.checked;
      savePrefs(game.id, { sound: sound.on });
      sound.good();
    });
    stage.querySelector('.gm-start').addEventListener('click', () => {
      const chosen = stage.querySelector('.gm-topic')?.value || 'all';
      // A game's own options (game.options, e.g. Salmon Run's Leisure swim), remembered per device.
      const options = {};
      stage.querySelectorAll('[data-option]').forEach((box) => { options[box.dataset.option] = box.checked; });
      savePrefs(game.id, { topic: chosen, options });
      const pool = questions.filter((q) => inTopic(q, chosen));
      stage.innerHTML = '';
      stage.dataset.mode = mode;
      const run = { sessionId: (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2)), startedAt: new Date().toISOString() };
      game.start({ deck: makeDeck(pool), topic: chosen, mode, easy: mode === 'easier', options, stage,
        finish: (result) => finish(mode, chosen, result, { options, run: { ...run, finishedAt: new Date().toISOString() } }) });
    });
  };

  // A run with `practice` set (no clock, nothing to lose) is never a best score.
  const finish = (mode, topic, result, { options = {}, run } = {}) => {
    const { score, label = 'points', headline = 'Game over', misses = [], practice = '' } = result;
    const all = loadPrefs(game.id).best || {};
    const key = `${mode}|${topic}`;
    const record = !practice && score > (bestFor(all, mode)[topic] || 0);
    if (record) savePrefs(game.id, { best: { ...all, [key]: score } });
    stage.innerHTML = `
      <section class="gm-over">
        <h1>${escapeHtml(headline)}</h1>
        <p class="gm-final"><strong>${score}</strong> ${escapeHtml(label)}${record && score > 0 ? ' <span class="gm-record">🏆 New best!</span>' : ''}</p>
        <p class="gm-mode-tag">${MODES[mode].label} mode${practice ? ` · ${escapeHtml(practice)}` : ''}${mode === 'easier' && !practice ? ' · ready for more? Switch to Standard in the lobby.' : ''}</p>
        <div class="gm-again"><button type="button" class="gm-start">Play again</button>
          <a href="../../#final">All games</a></div>
        ${run ? `<div class="gm-deliver">
          <button type="button" class="gm-copy">📋 Copy Canvas deliverable</button>
          <p class="gm-copy-status" aria-live="polite">Doing this for homework? Copy this run's deliverable and paste it into the Canvas assignment.</p>
          <pre class="gm-receipt" hidden></pre>
        </div>` : ''}
        ${misses.length ? `<h2>Worth another look (${misses.length})</h2>
          <ol class="gm-misses">${misses.map((m) => `<li>
            <p class="gm-q">${escapeHtml(m.prompt)}</p>
            ${m.picked !== undefined && m.picked !== null ? `<p class="gm-wrong">✗ ${escapeHtml(m.picked)}</p>` : ''}
            <p class="gm-right">✓ ${escapeHtml(m.choices[m.answer])}</p>
            ${m.explanation ? `<p class="gm-why">${escapeHtml(m.explanation)}</p>` : ''}
            ${m.skill ? `<p class="gm-src" data-skill="${escapeHtml(m.skill)}"></p>` : ''}
            <p class="gm-tag">${escapeHtml(topicLabel(m.topic))} · ${escapeHtml(m.id)}</p></li>`).join('')}</ol>`
        : '<p class="quiet">No misses. Nothing to review!</p>'}
        ${game.outro || ''}
        ${game.useBank === false ? '' : `<p class="gm-note">These come straight from the quiz question bank, including questions that haven't been checked yet.
          One looks wrong? Tell us with <a data-feedback href="#">🛠️ Repo improvements</a> and mention its id.</p>`}
      </section>`;
    stage.querySelector('.gm-start').addEventListener('click', lobby);
    stage.querySelector('.gm-start').focus();
    const copy = stage.querySelector('.gm-copy');
    if (copy) copy.addEventListener('click', async () => {
      const receipt = stage.querySelector('.gm-receipt');
      const status = stage.querySelector('.gm-copy-status');
      const text = await deliverableText({ game, mode, topic, options, run, result });
      receipt.textContent = text;
      receipt.hidden = false;
      try {
        await navigator.clipboard.writeText(text);
        status.textContent = 'Copied. Paste it into the Canvas assignment.';
      } catch {
        const range = document.createRange();
        range.selectNodeContents(receipt);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        status.textContent = 'Couldn\'t copy automatically: the text is selected, so press Copy (or Cmd/Ctrl+C).';
      }
    });
    // Each miss links to where its skill was taught. A source marked unconfirmed in
    // quiz/data/skill-sources.json is a guess, so it says "Probably from" instead of "Review".
    if (stage.querySelector('.gm-src')) {
      loadSkillSources().then((sourceOf) => {
        stage.querySelectorAll('.gm-src').forEach((slot) => {
          const source = sourceOf(slot.dataset.skill);
          if (!source) { slot.remove(); return; }
          slot.innerHTML = `📖 ${source.confirmed ? 'Review' : 'Probably from'}: <a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a>`;
        });
      }).catch(() => stage.querySelectorAll('.gm-src').forEach((slot) => slot.remove()));
    }
    import('../../feedback.js').then(({ REPO_IMPROVEMENT_FORM }) => {
      stage.querySelectorAll('a[data-feedback]').forEach((link) => { link.href = REPO_IMPROVEMENT_FORM; link.target = '_blank'; link.rel = 'noopener'; });
    }).catch(() => {});
    window.scrollTo(0, 0);
  };

  lobby();
}
