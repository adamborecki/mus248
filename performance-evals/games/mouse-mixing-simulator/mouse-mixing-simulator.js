// 🐭 The Mouse's Mixing Simulator: a mouse sneaks into Salmon to sing and can't hear himself. Run
// the four cables (rig.js: Vocal Jazz's wedge chain), switch the mic on, and bring up the send and
// the amp until the wedge is loud enough to hear and not so loud it feeds back.
//
// Pick a cable, then tap the two things it goes between: the mouse walks through the hall to each
// one, dragging the cable behind him. A wrong cable or a wrong pair isn't plugged in: it costs
// points and says why. Each card's light shows how far the signal gets.

import { escapeHtml, mountGame, sound } from '../bank.js';
import { CABLES, GEAR, LINKS, MIXER_LAB, NO_LINK, SOURCE, STOPS } from './rig.js';

const QUIET = 20;   // wedge level (send × amp, 0–100) the mouse can hear himself at
const SQUEAL = 72;  // and where the wedge feeds back into his mic

const MOUSE = `<svg viewBox="0 0 64 64" role="img" aria-label="The mouse">
  <circle cx="19" cy="15" r="9" fill="#9a9aa5"/><circle cx="45" cy="15" r="9" fill="#9a9aa5"/>
  <circle cx="19" cy="15" r="5" fill="#f4b6c2"/><circle cx="45" cy="15" r="5" fill="#f4b6c2"/>
  <ellipse cx="32" cy="46" rx="14" ry="15" fill="#b4b4be"/><ellipse cx="32" cy="48" rx="8" ry="10" fill="#e6e6ec"/>
  <ellipse cx="32" cy="26" rx="14" ry="12" fill="#b4b4be"/>
  <circle cx="26" cy="23" r="2" fill="#1c1c1f"/><circle cx="38" cy="23" r="2" fill="#1c1c1f"/>
  <ellipse cx="32" cy="29" rx="2.2" ry="1.6" fill="#f4b6c2"/><ellipse class="mm-mouth" cx="32" cy="33.5" rx="2.5" ry="1" fill="#5a2a35"/>
  <path d="M19 42 Q10 40 12 31" stroke="#b4b4be" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M12 31 l-3 -1" stroke="#b4b4be" stroke-width="3" stroke-linecap="round"/>
  <path d="M45 42 Q52 40 49 33" stroke="#b4b4be" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M49 33 l3 -2" stroke="#b4b4be" stroke-width="3" stroke-linecap="round"/>
  <g class="mm-held"><rect x="46.5" y="27" width="4" height="12" rx="2" fill="#2a2a2e" transform="rotate(-18 48.5 33)"/><circle cx="46.2" cy="25" r="4" fill="#6a6a72"/></g>
  <path d="M18 58 Q4 62 8 50" stroke="#f4b6c2" stroke-width="2" fill="none" stroke-linecap="round"/>
  <text class="mm-note" x="52" y="16" font-size="12" fill="#ffd166">♪</text>
</svg>`;

const pairKey = (a, b) => {
  const order = GEAR.map((gear) => gear.id);
  return [a, b].sort((x, y) => order.indexOf(x) - order.indexOf(y)).join('|');
};
const gearName = (id) => GEAR.find((gear) => gear.id === id).name;
const cableOf = (id) => CABLES.find((cable) => cable.id === id);

// Easier mode: no decoy cable, the callout always says where the signal stops, and after a slip the
// next cable and the two things it goes between glow.
function start({ stage, finish, easy }) {
  const cables = CABLES.filter((cable) => !(easy && cable.decoy));
  const state = { cable: null, end: null, plugged: new Set(), mic: false, send: 0, amp: 0, slips: [], startedAt: performance.now(), done: false, squeals: 0, at: null, pos: { x: 0, y: 0 }, walking: false };

  const card = (gear) => `<div class="mm-card" data-gear="${gear.id}">
      <span class="mm-led" aria-hidden="true"></span>
      <button type="button" class="mm-plug" aria-label="${escapeHtml(gear.name)}, ${escapeHtml(gear.sub)}">
        <span class="mm-icon" aria-hidden="true">${gear.icon}</span>
        <span class="mm-name">${escapeHtml(gear.name)}</span><span class="mm-sub">${escapeHtml(gear.sub)}</span>
      </button>
      ${{
    mic: '<div class="mm-ctl"><button type="button" class="mm-switch" data-ctl="mic" aria-pressed="false">Mic: OFF</button></div>',
    x32: '<div class="mm-ctl"><label for="mm-send">SENDS ON FADERS: the mic\'s send to MIX 1</label><input id="mm-send" type="range" min="0" max="100" value="0" data-ctl="send"></div>',
    amp: '<div class="mm-ctl"><label for="mm-amp">CH A level knob</label><input id="mm-amp" type="range" min="0" max="100" value="0" data-ctl="amp"></div>',
    wedge: '<div class="mm-ctl"><span>How loud it is</span><div class="mm-meter" role="img" aria-label="Wedge level"><i></i></div></div>',
  }[gear.id] || ''}
    </div>`;
  const zone = (id, title) => `<section class="mm-zone mm-${id}"><h2>${title}</h2><div class="mm-row">${GEAR.filter((gear) => gear.zone === id).map(card).join('')}</div></section>`;

  stage.innerHTML = `
    <div class="gm-hud">
      <span class="mm-score"></span>
      <span class="mm-count"></span>
      <button type="button" class="gm-quit">Scurry off</button>
    </div>
    <div class="mm-hall">
      <svg class="mm-wires" aria-hidden="true"></svg>
      ${zone('foh', 'FOH · the back of the hall')}
      <div class="mm-seats" aria-hidden="true">${'💺'.repeat(24)}</div>
      ${zone('stage', 'The stage')}
      <div class="mm-mouse" aria-hidden="true">${MOUSE}</div>
    </div>
    <p class="mm-callout" aria-live="polite"></p>
    <div class="mm-tray" role="group" aria-label="Cables">
      ${cables.map((cable) => `<button type="button" class="mm-cable" data-cable="${cable.id}" aria-pressed="false" style="--c:${cable.color}"><i aria-hidden="true"></i>${escapeHtml(cable.name)}</button>`).join('')}
    </div>
    <ul class="mm-list" aria-label="Cables run so far">${LINKS.map((link) => `<li data-link="${link.id}">?</li>`).join('')}</ul>
    <div class="mm-after" hidden></div>`;

  const $ = (sel) => stage.querySelector(sel);
  const $$ = (sel) => [...stage.querySelectorAll(sel)];
  const cardOf = (id) => $(`.mm-card[data-gear="${id}"]`);
  const say = (text) => { $('.mm-callout').textContent = text; };
  const has = (id) => state.plugged.has(id);
  const level = () => Math.round((state.send * state.amp) / 100);

  // How many stages the mouse's voice gets through: 0 nothing … 5 out of the wedge.
  const reach = () => {
    if (!state.mic) return 0;
    if (!has('receiver-x32')) return 1;
    if (!has('x32-s32') || !state.send) return 2;
    if (!has('s32-amp')) return 3;
    if (!has('amp-wedge') || !state.amp) return 4;
    return 5;
  };
  const points = () => Math.max(0, 100 * state.plugged.size - 25 * state.slips.length);
  const nextLink = () => LINKS.find((link) => !has(link.id));

  const drawWires = () => {
    const hall = $('.mm-hall').getBoundingClientRect();
    const box = (id) => {
      const r = cardOf(id).getBoundingClientRect();
      return { l: r.left - hall.left, r: r.right - hall.left, t: r.top - hall.top, b: r.bottom - hall.top, cx: r.left - hall.left + r.width / 2, cy: r.top - hall.top + r.height / 2 };
    };
    // Same row: side to side through the gap. Different rows: out the bottom of the upper one.
    const run = (a, b) => {
      let [p, q] = [box(a), box(b)];
      if (p.b <= q.t || q.b <= p.t) {
        if (p.t > q.t) [p, q] = [q, p];
        const sag = (q.t - p.b) * 0.6 + 14;
        return `M${p.cx} ${p.b} C${p.cx} ${p.b + sag} ${q.cx} ${q.t - sag} ${q.cx} ${q.t}`;
      }
      if (p.l > q.l) [p, q] = [q, p];
      const y = Math.min(p.cy, q.cy);
      return `M${p.r} ${y} C${p.r + 10} ${y + 22} ${q.l - 10} ${y + 22} ${q.l} ${y}`;
    };
    const wires = LINKS.filter((link) => has(link.id)).map((link) => `<path d="${run(link.a, link.b)}" stroke="${cableOf(link.cable).color}"/>`);
    if (state.mic) wires.push(`<path class="mm-radio" d="${run('receiver', 'mic')}"/>`);
    // The cable in his paws: one end plugged in, the other following him across the hall.
    if (state.cable && state.end) {
      const from = box(state.end);
      const m = $('.mm-mouse').getBoundingClientRect();
      const [mx, my] = [m.left - hall.left + m.width / 2, m.top - hall.top + m.height * 0.7];
      wires.push(`<path d="M${from.cx} ${from.b - 6} Q${(from.cx + mx) / 2} ${Math.max(from.b, my) + 26} ${mx} ${my}" stroke="${cableOf(state.cable).color}"/>`);
    }
    $('.mm-wires').innerHTML = wires.join('');
  };

  // ----- the mouse on the floor -----
  const mouse = $('.mm-mouse');
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Where he stands for each piece of gear: at its top left corner. No gear: by the door.
  const spot = (id) => {
    const hall = $('.mm-hall').getBoundingClientRect();
    if (!id) return { x: 2, y: hall.height - 46 };
    const r = cardOf(id).getBoundingClientRect();
    return { x: r.left - hall.left - 14, y: r.top - hall.top - 20 };
  };
  const stand = (p) => { state.pos = p; mouse.style.transform = `translate(${p.x}px, ${p.y}px)`; };
  let trip = 0;
  // Walk to a piece of gear, then do `done`. A new walk cancels the one before it.
  const walkTo = (id, done) => {
    const [from, to] = [state.pos, spot(id)];
    const far = Math.hypot(to.x - from.x, to.y - from.y);
    const ms = still || far < 4 ? 0 : Math.min(1300, Math.max(220, far / 0.42));
    const mine = ++trip;
    state.at = id;
    state.walking = true;
    mouse.classList.add('mm-walking');
    if (Math.abs(to.x - from.x) > 4) mouse.classList.toggle('mm-left', to.x < from.x);
    mouse.style.transitionDuration = `${ms}ms`;
    stand(to);
    const follow = () => { if (mine === trip && state.walking) { drawWires(); requestAnimationFrame(follow); } };
    requestAnimationFrame(follow);
    setTimeout(() => {
      if (mine !== trip) return;
      state.walking = false;
      mouse.classList.remove('mm-walking');
      drawWires();
      if (done) done();
    }, ms + 30);
  };

  const draw = () => {
    const at = reach();
    const lit = { mic: state.mic, receiver: at >= 1, x32: at >= 2, s32: at >= 3, amp: at >= 4, wedge: at >= 5 };
    GEAR.forEach((gear) => {
      const el = cardOf(gear.id);
      el.classList.toggle('mm-on', lit[gear.id]);
      el.classList.toggle('mm-end', state.end === gear.id);
    });
    $$('.mm-cable').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.cable === state.cable)));
    const mic = $('[data-ctl="mic"]');
    mic.setAttribute('aria-pressed', String(state.mic));
    mic.textContent = state.mic ? 'Mic: ON' : 'Mic: OFF';
    mouse.classList.toggle('mm-has-mic', state.mic);
    const shown = at >= 5 ? level() : 0;
    $('.mm-meter i').style.width = `${shown}%`;
    $('.mm-meter').classList.toggle('mm-hot', shown >= SQUEAL);
    LINKS.forEach((link) => {
      const item = $(`.mm-list [data-link="${link.id}"]`);
      item.classList.toggle('mm-done', has(link.id));
      item.textContent = has(link.id) ? link.label : 'A cable still to run';
    });
    $('.mm-score').textContent = `${points()} pts`;
    $('.mm-count').textContent = `${state.plugged.size} of ${LINKS.length} cables`;
    drawWires();
  };

  const clearHints = () => $$('.mm-hint').forEach((el) => el.classList.remove('mm-hint'));
  const hint = () => {
    const link = nextLink();
    if (!easy || !link) return;
    [cardOf(link.a), cardOf(link.b), $(`.mm-cable[data-cable="${link.cable}"]`)].forEach((el) => el.classList.add('mm-hint'));
  };

  const slip = (ids, entry) => {
    state.slips.push(entry);
    ids.forEach((id) => {
      const el = cardOf(id);
      el.classList.remove('mm-buzz');
      void el.offsetWidth;
      el.classList.add('mm-buzz');
      setTimeout(() => el.classList.remove('mm-buzz'), 400);
    });
    sound.bad();
    say(`🚫 ${entry.why}`);
    hint();
  };

  // Where things stand, said out loud. Standard leaves the diagnosis to the lights.
  const status = () => {
    const at = reach();
    if (at === 5) {
      if (level() < QUIET) return say('🐭 "Is this thing on?" The wedge is barely there. The send sets how much of the mic goes to the wedge; the amp knob sets how loud the wedge is.');
      return;
    }
    if (!state.plugged.size && !state.mic) return say('🐭 "I can\'t hear myself!" Pick a cable, then tap the two things it goes between, and he\'ll walk it over.');
    if (easy || state.plugged.size === LINKS.length) return say(`🐭 ${STOPS[at]}`);
    say('Follow the green lights: where does the mouse\'s voice stop?');
  };

  const attempt = (a, b) => {
    const cable = cableOf(state.cable);
    const key = pairKey(a, b);
    const link = LINKS.find((candidate) => pairKey(candidate.a, candidate.b) === key);
    const tried = `${cable.name}: ${gearName(a)} ↔ ${gearName(b)}`;
    state.end = null;
    state.cable = null;  // every try starts by picking a cable, right or wrong
    clearHints();
    if (!link) {
      const no = NO_LINK[key];
      slip([a, b], { id: `mouse-${key.replace('|', '-')}`, prompt: `What goes between the ${gearName(a)} and the ${gearName(b)}?`, right: no.right, picked: tried, why: no.why });
    } else if (has(link.id)) {
      say('That one is already plugged in.');
    } else if (link.cable !== cable.id) {
      slip([a, b], { id: `mouse-${link.id}-${cable.id}`, prompt: `Which cable goes between the ${gearName(link.a)} and the ${gearName(link.b)}?`, right: link.label, picked: tried, why: (link.wrong || {})[cable.id] || link.why });
    } else {
      state.plugged.add(link.id);
      sound.blip(440 + state.plugged.size * 110, 80);
      say(`🔌 ${link.label}. ${link.why}`);
      draw();
      return check(false);
    }
    draw();
  };

  const tapGear = (id) => {
    if (state.done || state.walking) return;
    if (!state.cable) return walkTo(id, () => say(`🐭 At the ${gearName(id)}, empty-pawed. Pick a cable first, then tap the two things it goes between.`));
    if (state.end === id) { state.end = null; return draw(); }
    if (!state.end) {
      return walkTo(id, () => {
        state.end = id;
        say(`One end of the ${cableOf(state.cable).name} at the ${gearName(id)}. Where does he drag the other end?`);
        draw();
      });
    }
    walkTo(id, () => attempt(state.end, id));
  };

  // After anything changes: has he been heard, is it squealing, or where did the signal stop?
  const check = (talk = true) => {
    if (state.done) return;
    if (reach() === 5 && level() >= SQUEAL) {
      state.squeals += 1;
      state.slips.push({ id: 'mouse-feedback', prompt: 'The wedge is squealing. What happened?', right: 'Bring a wedge up slowly, and stop when the singer can hear it', picked: `Send ${state.send}, amp ${state.amp}: too loud`, why: 'Feedback: the wedge got so loud that the mic heard it, and around it went. Bring it up slowly.' });
      sound.blip(2400, 700, 'sine', 0.07);
      state.amp = 0;
      $('[data-ctl="amp"]').value = state.amp;
      say('😖 SQUEEEAL! Feedback: the wedge got so loud that the mic heard it. The amp is back at zero: bring it up slowly this time.');
      return draw();
    }
    if (reach() === 5 && level() >= QUIET) return complete();
    if (talk) status();
    draw();
  };

  const complete = () => {
    state.done = true;
    const seconds = Math.round((performance.now() - state.startedAt) / 1000);
    const bonus = Math.max(0, 120 - seconds);
    state.final = points() + 100 + bonus;
    draw();
    $('.mm-score').textContent = `${state.final} pts`;
    $('.mm-hall').classList.add('mm-live');
    // Back to center stage for the song.
    walkTo('mic', () => {
      mouse.classList.add('mm-sing');
      stage.querySelector('.mm-mouth')?.setAttribute('ry', '3');
    });
    $$('.mm-cable, .mm-plug, [data-ctl]').forEach((el) => { el.disabled = true; });
    $('.mm-tray').hidden = true;
    sound.good();
    say(state.slips.length ? '🐭🎶 "I can hear myself!" The mouse sings.' : '🐭🎶 "I can hear myself!" A clean rig, first try.');
    const after = $('.mm-after');
    after.innerHTML = `<p class="mm-flow">Wireless mic → receiver → XLR → X32 → MIX 1 → AES50 → S32 OUT 1 → XLR → NX3000 CH A → speakON → wedge</p>
      <p class="mm-why">Mics come in at the X32; everything goes out through the S32. XLR carries the mix at line level, speakON carries the amp's power, and the send sets how much of the mouse is in his wedge.</p>
      <p class="mm-src">From ${escapeHtml(SOURCE)} · <a href="${MIXER_LAB}" target="_blank" rel="noopener">Try the real chain in Mixer Lab ↗</a></p>
      <button type="button" class="gm-start mm-next">See your score</button>`;
    after.hidden = false;
    after.querySelector('.mm-next').addEventListener('click', () => end(state.slips.length ? 'The mouse can hear himself 🐭🎶' : 'A clean rig. The mouse takes a bow 🐭🎶', seconds));
    after.querySelector('.mm-next').focus();
  };

  const end = (headline, seconds = Math.round((performance.now() - state.startedAt) / 1000)) => {
    const won = state.final !== undefined;
    state.done = true;
    // One review card per kind of slip, however many times it happened.
    const seen = new Set();
    const misses = state.slips.filter((s) => !seen.has(s.id) && seen.add(s.id))
      .map((s) => ({ id: s.id, topic: 'salmon', prompt: s.prompt, choices: [s.right], answer: 0, picked: s.picked, explanation: s.why }));
    const steps = LINKS.length + 1;
    const made = state.plugged.size + (won ? 1 : 0);
    finish({ score: won ? state.final : points(), label: 'points', headline, misses, answered: made, correct: Math.max(0, made - misses.length),
      tally: `${state.plugged.size} of ${LINKS.length} cables run, ${won ? 'the wedge working' : 'the wedge still silent'}, ${state.slips.length} ${state.slips.length === 1 ? 'slip' : 'slips'}`,
      details: { cables: [...state.plugged], won, slips: state.slips.map((s) => s.id), squeals: state.squeals, seconds, steps } });
  };

  $$('.mm-cable').forEach((button) => button.addEventListener('click', () => {
    if (state.done || state.walking) return;
    state.cable = state.cable === button.dataset.cable ? null : button.dataset.cable;
    state.end = null;
    clearHints();
    say(state.cable ? `${cableOf(state.cable).name} in hand. Tap the two things it goes between.` : 'Cable put back.');
    draw();
  }));
  GEAR.forEach((gear) => cardOf(gear.id).querySelector('.mm-plug').addEventListener('click', () => tapGear(gear.id)));
  $('[data-ctl="mic"]').addEventListener('click', () => {
    if (state.walking) return;
    walkTo('mic', () => {
      state.mic = !state.mic;
      sound.blip(state.mic ? 990 : 330, 60);
      check();
    });
  });
  // The meter follows the slider as it moves; the verdict waits until the player lets go.
  [['send', '[data-ctl="send"]'], ['amp', '[data-ctl="amp"]']].forEach(([name, sel]) => {
    // He scurries over to whichever knob is being turned (unless he's mid-errand).
    const over = () => { const id = name === 'send' ? 'x32' : 'amp'; if (!state.done && !state.walking && state.at !== id) walkTo(id); };
    $(sel).addEventListener('pointerdown', over);
    $(sel).addEventListener('focus', over);
    $(sel).addEventListener('input', (event) => { state[name] = Number(event.target.value); draw(); });
    $(sel).addEventListener('change', (event) => { state[name] = Number(event.target.value); check(); });
  });
  $('.gm-quit').addEventListener('click', () => { if (state.final === undefined) end('The mouse scurried off, still unheard 🐭'); });
  // The cables are drawn from where the cards really are, so redraw when the layout moves.
  // He's placed the same way, so he moves with them.
  mouse.style.transitionDuration = '0ms';
  stand(spot(null));
  if (window.ResizeObserver) new ResizeObserver(() => {
    if (!$('.mm-hall')) return;
    if (!state.walking) { mouse.style.transitionDuration = '0ms'; stand(spot(state.at)); }
    drawWires();
  }).observe($('.mm-hall'));

  status();
  draw();
}

mountGame(document.getElementById('game'), {
  id: 'mouse-mixing-simulator',
  title: 'The Mouse\'s Mixing Simulator',
  emoji: '🐭',
  tagline: 'A mouse snuck into Salmon to sing, and he can\'t hear himself. Get his wedge working.',
  rules: [
    'The mouse has arms and opposable thumbs. What he doesn\'t have is a working <b>wedge</b>.',
    'Pick a cable, then tap the <b>two things it goes between</b>. He walks through the hall to each one, dragging the cable. Four cables, from the receiver at FOH to the wedge on stage.',
    'Switch the mic on, then bring up its <b>send</b> on the X32 and the <b>amp\'s knob</b>, slowly. Too loud and the wedge feeds back.',
    'The green lights show how far his voice gets. A wrong cable or a wrong pair costs points, and tells you why.',
  ],
  startLabel: 'Sneak in 🐭',
  useBank: false,
  modeBlurbs: {
    easier: 'Only the cables you need. The mouse says where his voice stops, and the next cable glows if you slip.',
    standard: 'A decoy cable in the bin, and no hints: read the green lights. Closest to the final.',
  },
  outro: `<p class="gm-note">This rig is Vocal Jazz's wedge chain, from the Salmon FOH lecture (Nov 2). The game idea came from a student in the class.
    Practice the real thing in Mixer Lab: <a href="${MIXER_LAB}" target="_blank" rel="noopener">Vocal Jazz in Salmon</a>.</p>`,
  start,
});
