// The slide-deck view of a lecture: the same Markdown as the text page, laid out on one big canvas
// that a camera flies across. Zoom in to present a slide; zoom out (O, pinch, or 🗺️) to see the
// whole lecture as an outline, where related slides nest under the slide that introduces them.
//
// No framework, no build step, no library: transforms and a little canvas confetti.

const SLIDE_PREFIX = /^Slide\s+(\d+)\s*[:.]\s*/i;
const LEADING_EMOJI = /^(\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic})*)\s*/u;
const UNNUMBERED_KEY = /^([^:]{3,40}):\s/;
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const norm = (text) => text.toLowerCase().replace(/^\d+\.\s*/, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();

// ---------- 1. the rendered page → slides ----------

function splitSlides(article) {
  const intro = [];
  const sections = [];
  let section = null;
  let slide = null;
  [...article.children].forEach((node) => {
    if (node.tagName === 'H2' || node.tagName === 'H3') {
      const raw = node.textContent.trim();
      const number = (raw.match(SLIDE_PREFIX) || [])[1];
      const entry = {
        kind: node.tagName === 'H2' ? 'section' : 'slide',
        number: number ? Number(number) : null,
        title: node.innerHTML.replace(SLIDE_PREFIX, ''),
        text: raw.replace(SLIDE_PREFIX, ''),
        nodes: [],
      };
      if (entry.kind === 'section') {
        section = { slide: entry, slides: [] };
        sections.push(section);
      } else {
        if (!section) { section = { slide: null, slides: [] }; sections.push(section); }
        section.slides.push(entry);
      }
      slide = entry;
      return;
    }
    (slide ? slide.nodes : intro).push(node.cloneNode(true));
  });
  return { intro, sections };
}

// ---------- 2. slides → an outline tree ----------
//
// Slides that share a key group under the first of them: the same number ("3. Musco Center…",
// "3. Musco: Standard…"), or the same "Topic:" prefix ("Electricity: AC vs DC", "Electricity:
// Power Adapters"). A slide whose numbered list names later slides becomes their parent, so "The 7
// Gig Families" holds the seven families, and "Standard Gear Kit: …" lands under family 4 because
// that is the family the list calls "Standard Gear Kit recordings".

function keyOf(slide) {
  const numbered = slide.text.match(/^(\d+)\.\s/);
  if (numbered) return `#${numbered[1]}`;
  const topic = slide.text.replace(LEADING_EMOJI, '').match(UNNUMBERED_KEY);
  return topic ? `:${norm(topic[1])}` : `=${norm(slide.text)}`;
}

function agendaItems(slide) {
  const list = slide.nodes.find((node) => node.tagName === 'OL');
  if (!list) return null;
  const items = [...list.children].map((item) => norm(item.textContent)).filter((item) => item.length >= 4);
  return items.length >= 3 ? items : null;
}

const matches = (title, item) => {
  const length = Math.min(14, item.length, title.length);
  return length >= 4 && (title.startsWith(item.slice(0, length)) || item.startsWith(title.slice(0, length)));
};

function outline(slides) {
  slides.forEach((slide) => { slide.key = keyOf(slide); });
  slides.forEach((slide, index) => {
    const items = agendaItems(slide);
    if (!items) return;
    let hits = 0;
    slides.slice(index + 1).forEach((later) => {
      const at = items.findIndex((item) => matches(norm(later.text), item));
      if (at >= 0 && !/^#/.test(later.key)) { later.key = `#${at + 1}`; hits += 1; }
      else if (at >= 0) hits += 1;
    });
    if (hits >= 2) slide.agenda = true;
  });

  const units = [];
  slides.forEach((slide) => {
    const last = units[units.length - 1];
    if (last && last.key === slide.key) last.kids.push({ slide, kids: [] });
    else units.push({ key: slide.key, slide, kids: [] });
  });

  // An agenda slide adopts the run of numbered units right after it.
  const roots = [];
  for (let index = 0; index < units.length; index += 1) {
    const unit = units[index];
    roots.push(unit);
    if (!unit.slide.agenda) continue;
    while (units[index + 1] && /^#/.test(units[index + 1].key)) {
      unit.kids.push(units[index + 1]);
      index += 1;
    }
  }
  return roots;
}

// ---------- 3. the tree → positions on the canvas ----------

const CHILD = 0.42;

function measure(node, scale, size) {
  const kids = node.kids.map((kid) => measure(kid, scale * CHILD, size));
  const gap = size.w * scale * 0.08;
  const row = kids.reduce((sum, kid) => sum + kid.w, 0) + gap * Math.max(0, kids.length - 1);
  node.box = {
    scale,
    kids,
    row,
    gap,
    w: Math.max(size.w * scale, row),
    h: size.h * scale + (kids.length ? gap * 1.6 + Math.max(...kids.map((kid) => kid.h)) : 0),
  };
  node.kids.forEach((kid, at) => { kid.box = kids[at]; });
  return node.box;
}

function place(node, x, y, size, unit) {
  const { box } = node;
  node.slide.pos = { x: x + (box.w - size.w * box.scale) / 2, y, scale: box.scale, unit };
  let left = x + (box.w - box.row) / 2;
  node.kids.forEach((kid) => {
    place(kid, left, y + size.h * box.scale + box.gap * 1.6, size, unit);
    left += kid.box.w + box.gap;
  });
}

function layout(deck, size) {
  const gap = size.w * 0.32;
  let y = 0;
  let unitId = 0;
  const rows = [];
  // The title opens the canvas at a larger scale; each section is a band of wrapped rows below it.
  const titleNode = { slide: deck.title, kids: [] };
  measure(titleNode, 1.5, size);
  place(titleNode, 0, y, size, (unitId += 1));
  rows.push(titleNode.box.w);
  y += titleNode.box.h + gap;
  deck.sections.forEach((section) => {
    const nodes = section.roots.map((root) => { measure(root, 1, size); return root; });
    if (section.slide) {
      const head = { slide: section.slide, kids: [] };
      measure(head, 1.15, size);
      nodes.unshift(head);
    }
    // Wide rows, so the zoomed-out outline roughly matches the screen's shape.
    const maxRow = Math.max(size.w * (size.h > size.w ? 4.2 : 5.2), ...nodes.map((node) => node.box.w));
    let x = 0;
    let rowH = 0;
    nodes.forEach((node) => {
      if (x > 0 && x + node.box.w > maxRow) { rows.push(x - gap); x = 0; y += rowH + gap; rowH = 0; }
      place(node, x, y, size, (unitId += 1));
      x += node.box.w + gap;
      rowH = Math.max(rowH, node.box.h);
    });
    rows.push(x - gap);
    y += rowH + gap * 1.4;
  });
  const endNode = { slide: deck.end, kids: [] };
  measure(endNode, 1.3, size);
  const width = Math.max(...rows);
  place(endNode, (width - endNode.box.w) / 2, y, size, (unitId += 1));
  // Center the title over the canvas, now that its width is known.
  deck.title.pos.x = (width - size.w * 1.5) / 2;
  return { w: width, h: y + endNode.box.h };
}

// ---------- 4. the deck itself ----------

const ENTRANCES = ['rise', 'left', 'right', 'pop'];
const EMOJI_FIELD = ['🎙️', '🎚️', '🎧', '📹', '🔊', '💾', '🎛️', '🎬', '🎼', '📡', '🔌', '🎵'];

function slideHtml(slide, index, total) {
  const title = slide.title.replace(LEADING_EMOJI, (match, emoji) => `<span class="deck-emoji">${emoji}</span> `);
  const deco = (slide.text.match(LEADING_EMOJI) || [])[1] || '';
  return `<div class="deck-card">
    ${slide.kind === 'slide' || slide.kind === 'section' ? `<span class="deck-num">${index + 1}<small>/${total}</small></span>` : ''}
    ${slide.badge ? `<span class="deck-badge">${slide.badge}</span>` : ''}
    ${title ? `<h2 class="deck-title">${title}</h2>` : ''}
    <div class="deck-body"></div>
    ${deco ? `<span class="deck-deco" aria-hidden="true">${deco}</span>` : ''}
  </div>`;
}

function confetti(host) {
  if (reduceMotion()) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'deck-confetti';
  host.append(canvas);
  const ratio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  const context = canvas.getContext('2d');
  context.scale(ratio, ratio);
  const colors = ['#ff5d8f', '#ffd166', '#06d6a0', '#4cc9f0', '#9b5de5', '#f15bb5'];
  const symbols = ['🎉', '🎶', '🎚️', '⭐'];
  const pieces = Array.from({ length: 170 }, (_, at) => ({
    x: window.innerWidth / 2 + (Math.random() - 0.5) * 160,
    y: window.innerHeight * 0.6,
    vx: (Math.random() - 0.5) * 17,
    vy: -Math.random() * 17 - 7,
    size: Math.random() * 7 + 5,
    angle: Math.random() * 6.3,
    spin: (Math.random() - 0.5) * 0.35,
    color: colors[at % colors.length],
    emoji: at % 12 === 0 ? symbols[(at / 12) % symbols.length] : '',
  }));
  const start = performance.now();
  const frame = (now) => {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    pieces.forEach((piece) => {
      piece.vy += 0.42;
      piece.vx *= 0.985;
      piece.x += piece.vx;
      piece.y += piece.vy;
      piece.angle += piece.spin;
      context.save();
      context.translate(piece.x, piece.y);
      context.rotate(piece.angle);
      if (piece.emoji) {
        context.font = `${piece.size * 3.2}px serif`;
        context.fillText(piece.emoji, 0, 0);
      } else {
        context.fillStyle = piece.color;
        context.fillRect(-piece.size / 2, -piece.size / 4, piece.size, piece.size / 2);
      }
      context.restore();
    });
    if (now - start < 3400) requestAnimationFrame(frame);
    else canvas.remove();
  };
  requestAnimationFrame(frame);
}

export function openDeck({ article, lecture, badge, when, startAt = 0, overview = false, onClose }) {
  const parsed = splitSlides(article);
  const hueBase = ((lecture.lecture || lecture.title.length) * 47 + 205) % 360;
  const deck = {
    title: {
      kind: 'title',
      badge,
      title: lecture.title,
      text: lecture.title,
      nodes: [
        Object.assign(document.createElement('p'), { className: 'deck-when', textContent: when }),
        ...parsed.intro.map((node) => { node.classList.add('deck-small'); return node; }),
      ],
      deco: lecture.emoji || '🎤',
    },
    sections: parsed.sections.map((section) => ({ slide: section.slide, roots: outline(section.slides) })),
    end: { kind: 'end', title: '🎉 That\'s the lecture!', text: 'end', nodes: [] },
  };
  // Present in the deck's own order; the outline only decides where each slide sits on the canvas.
  const ordered = [deck.title];
  parsed.sections.forEach((section, at) => {
    const hue = (hueBase + at * 38) % 360;
    [section.slide, ...section.slides].filter(Boolean).forEach((slide) => { slide.hue = hue; ordered.push(slide); });
  });
  ordered.push(deck.end);
  deck.title.hue = hueBase;
  deck.end.hue = (hueBase + 120) % 360;
  const slides = ordered;

  const root = document.createElement('div');
  root.className = 'deck';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', `${lecture.title} — slides`);
  root.tabIndex = -1;
  root.style.setProperty('--hue', hueBase);
  root.innerHTML = `
    <div class="deck-sky" aria-hidden="true"><div class="deck-glow"></div><div class="deck-field"></div></div>
    <div class="deck-stage"><div class="deck-world"></div><div class="deck-spot"></div></div>
    <div class="deck-progress" aria-hidden="true"><span></span></div>
    <nav class="deck-bar" aria-label="Slide controls">
      <button type="button" data-go="prev" aria-label="Previous slide">◀</button>
      <span class="deck-count" aria-hidden="true"></span>
      <button type="button" data-go="next" aria-label="Next slide">▶</button>
      <button type="button" data-go="overview" aria-label="Outline: zoom out to see every slide" title="Outline (O)">🗺️</button>
      ${root.requestFullscreen ? '<button type="button" data-go="full" aria-label="Full screen" title="Full screen (F)">⛶</button>' : ''}
      <button type="button" data-go="close" aria-label="Close slides" title="Close (Esc)">✕</button>
    </nav>
    <p class="deck-live" aria-live="polite"></p>
    <p class="deck-hint" aria-hidden="true">← → to move · <b>O</b> or pinch for the outline · <b>Esc</b> to close</p>`;
  document.body.append(root);
  const stage = root.querySelector('.deck-stage');
  const world = root.querySelector('.deck-world');
  const spotLayer = root.querySelector('.deck-spot');
  const field = root.querySelector('.deck-field');
  const live = root.querySelector('.deck-live');
  const count = root.querySelector('.deck-count');
  const progress = root.querySelector('.deck-progress span');
  field.innerHTML = Array.from({ length: 34 }, (_, at) => {
    const emoji = at % 5 === 0 ? (lecture.emoji || '🎤') : EMOJI_FIELD[(at * 7 + (lecture.lecture || 0)) % EMOJI_FIELD.length];
    return `<span style="left:${(at * 37) % 100}%;top:${(at * 61) % 100}%;font-size:${1.4 + ((at * 13) % 5) * 0.55}rem;animation-delay:${-(at % 9)}s">${emoji}</span>`;
  }).join('');

  // The control bar keeps its own strip at the bottom, so it never covers a slide.
  const BAR = 76;
  const view = () => ({ w: stage.clientWidth, h: Math.max(200, stage.clientHeight - BAR) });
  let size;
  let canvasSize;
  const build = () => {
    const { w: vw, h: vh } = view();
    const portrait = vh > vw;
    const w = portrait ? 760 : 1280;
    size = { w, h: Math.round(Math.min(Math.max(w * (vh / vw), w * 0.5), w * 2.1)) };
    root.classList.toggle('portrait', portrait);
    canvasSize = layout(deck, size);
    world.style.width = `${canvasSize.w}px`;
    world.style.height = `${canvasSize.h}px`;
    world.innerHTML = '';
    slides.forEach((slide, at) => {
      const element = document.createElement('section');
      element.className = `deck-slide kind-${slide.kind} enter-${ENTRANCES[at % ENTRANCES.length]}${slide.nodes.length ? '' : ' empty'}`;
      element.style.cssText = `left:${slide.pos.x}px;top:${slide.pos.y}px;width:${size.w}px;height:${size.h}px;transform:scale(${slide.pos.scale});--slide-hue:${slide.hue ?? hueBase}`;
      element.dataset.index = at;
      element.innerHTML = slideHtml(slide, at, slides.length);
      const body = element.querySelector('.deck-body');
      slide.nodes.forEach((node) => body.append(node.cloneNode(true)));
      if (slide.kind === 'title') element.querySelector('.deck-card').insertAdjacentHTML('beforeend', `<span class="deck-hero" aria-hidden="true">${slide.deco}</span>`);
      if (slide.kind === 'end') {
        body.innerHTML = `<p>${slides.length - 2} slides. Want the big picture again?</p>
          <p class="deck-end-actions"><button type="button" data-go="overview">🗺️ See the outline</button> <button type="button" data-go="first">↺ Start over</button> <button type="button" data-go="close">📄 Back to the text</button></p>`;
      }
      // Stagger each block's entrance.
      [...body.children].forEach((child, order) => child.style.setProperty('--order', order + 1));
      world.append(element);
      slide.element = element;
    });
    // Size the type to the card: short slides read big, long ones shrink until they fit.
    const largest = size.h > size.w ? 1.5 : 1.3;
    slides.forEach((slide) => {
      const body = slide.element.querySelector('.deck-body');
      let fit = slide.kind === 'slide' && !slide.element.classList.contains('empty') ? largest : 1;
      slide.element.style.setProperty('--fit', fit);
      while (body.scrollHeight > body.clientHeight + 2 && fit > 0.5) {
        fit -= 0.06;
        slide.element.style.setProperty('--fit', fit.toFixed(2));
      }
      slide.element.classList.toggle('scrolls', body.scrollHeight > body.clientHeight + 2);
    });
  };

  // ---------- camera ----------
  let current = Math.max(0, Math.min(startAt, slides.length - 1));
  let mode = overview ? 'overview' : 'present';
  let timers = [];
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
  const boxOf = (slide) => ({ x: slide.pos.x, y: slide.pos.y, w: size.w * slide.pos.scale, h: size.h * slide.pos.scale });
  const union = (a, b) => {
    const x = Math.min(a.x, b.x);
    const y = Math.min(a.y, b.y);
    return { x, y, w: Math.max(a.x + a.w, b.x + b.w) - x, h: Math.max(a.y + a.h, b.y + b.h) - y };
  };
  // The canvas only ever zooms OUT, and its painted area is capped. iOS Safari kills a tab whose
  // transformed layer gets too big (a tall canvas zoomed past 1× is hundreds of megabytes), so the
  // presented slide is a separate screen-sized card that flies out of its spot on the canvas.
  // In device pixels (a 3× iPhone paints 9 pixels per CSS pixel): about 24 MB of layer at most.
  const MAX_PAINTED = 6e6;
  const zoomCap = () => {
    const density = Math.min(window.devicePixelRatio || 1, 3);
    return Math.min(1, Math.sqrt(MAX_PAINTED / (canvasSize.w * canvasSize.h)) / density);
  };
  let cam = { tx: 0, ty: 0, zoom: 1 };
  const apply = (tx, ty, zoom, duration) => {
    cam = { tx, ty, zoom };
    const time = reduceMotion() ? 0 : duration;
    world.style.transitionDuration = `${time}ms`;
    field.style.transitionDuration = `${time}ms`;
    world.style.transform = `translate(${tx}px, ${ty}px) scale(${zoom})`;
    // Parallax: the emoji field drifts a fraction of the camera's travel.
    field.style.transform = `translate(${(tx * 0.06) % 400}px, ${(ty * 0.06) % 400}px)`;
  };
  const camera = (box, duration, margin = 0.95) => {
    const area = view();
    const zoom = Math.min(Math.min(area.w / box.w, area.h / box.h) * margin, zoomCap());
    apply((area.w - box.w * zoom) / 2 - box.x * zoom, (area.h - box.h * zoom) / 2 - box.y * zoom + 6, zoom, duration);
  };

  // ---------- the outline as a map: pinch, drag, scroll ----------
  // Zooming in is capped (see zoomCap), so pinching past the cap means "open this one": the slide
  // under your fingers (or the cursor) is presented.
  let fitZoom = 1;
  const wholeCanvas = () => ({ x: 0, y: 0, w: canvasSize.w, h: canvasSize.h });
  const clampPan = (tx, ty, zoom) => {
    const area = view();
    const pad = 48;
    const axis = (offset, length, room) => (length + pad * 2 <= room ? (room - length) / 2 : Math.min(pad, Math.max(room - length - pad, offset)));
    return [axis(tx, canvasSize.w * zoom, area.w), axis(ty, canvasSize.h * zoom, area.h)];
  };
  const panBy = (dx, dy) => { const [tx, ty] = clampPan(cam.tx + dx, cam.ty + dy, cam.zoom); apply(tx, ty, cam.zoom, 0); };
  const slideAt = (px, py) => {
    const x = (px - cam.tx) / cam.zoom;
    const y = (py - cam.ty) / cam.zoom;
    let best = 0;
    let bestDistance = Infinity;
    slides.forEach((slide, at) => {
      const box = boxOf(slide);
      const dx = Math.max(box.x - x, 0, x - (box.x + box.w));
      const dy = Math.max(box.y - y, 0, y - (box.y + box.h));
      const distance = Math.hypot(dx, dy);
      if (distance < bestDistance) { best = at; bestDistance = distance; }
    });
    return best;
  };
  // Keep the canvas point under (px, py) under it while the zoom changes.
  const zoomAt = (px, py, wanted, from = cam, to = { x: px, y: py }) => {
    if (wanted > zoomCap() * 1.3) { go(slideAt(px, py)); return; }
    const zoom = Math.max(fitZoom * 0.8, Math.min(zoomCap(), wanted));
    const x = (px - from.tx) / from.zoom;
    const y = (py - from.ty) / from.zoom;
    const [tx, ty] = clampPan(to.x - x * zoom, to.y - y * zoom, zoom);
    apply(tx, ty, zoom, 0);
  };

  // Where a canvas slide sits on screen right now, relative to the stage.
  const rectOf = (slide) => {
    const stageRect = stage.getBoundingClientRect();
    const rect = slide.element.getBoundingClientRect();
    return { x: rect.left - stageRect.left, y: rect.top - stageRect.top, scale: rect.width / size.w };
  };
  const fullRect = () => {
    const area = view();
    const scale = Math.min(area.w / size.w, area.h / size.h) * 0.96;
    return { x: (area.w - size.w * scale) / 2, y: (area.h - size.h * scale) / 2 + 6, scale };
  };
  const place = (card, rect) => { card.style.transform = `translate(${rect.x}px, ${rect.y}px) scale(${rect.scale})`; };

  // How fast a move should be depends on what you're doing. After a pause (or the first slide) it's
  // the full flight across the canvas; keep pressing and it gets quicker; hunt for a slide and each
  // step is near-instant. 1 = full, 0.5 = brisk, 0 = quick.
  let lastMove = 0;
  const tempo = () => {
    const now = performance.now();
    const gap = now - lastMove;
    lastMove = now;
    if (reduceMotion()) return 0;
    return gap > 6000 ? 1 : (gap > 1500 ? 0.5 : 0);
  };

  let spot = null;
  const dropSpot = (into, duration = 380) => {
    const card = spot;
    spot = null;
    if (!card) return;
    if (reduceMotion() || !into) { card.remove(); return; }
    card.classList.remove('play');
    card.style.transitionDuration = `${duration}ms`;
    if (into === 'away') { card.style.opacity = '0'; card.style.transform += ' scale(0.92)'; }
    else { place(card, into); card.style.opacity = '0.4'; }
    setTimeout(() => card.remove(), duration + 20);
  };
  const raiseSpot = (slide, from, { pace = 1, direction = 1 } = {}) => {
    const card = slide.element.cloneNode(true);
    card.classList.add('spot');
    card.removeAttribute('data-index');
    card.style.left = '0';
    card.style.top = '0';
    if (!pace) { card.classList.add('quick'); card.style.setProperty('--dir', direction); }
    spotLayer.append(card);
    spot = card;
    const done = () => {
      card.classList.add('play');
      if (slide.kind === 'end') confetti(root);
    };
    if (reduceMotion() || !from) { place(card, fullRect()); done(); return; }
    place(card, from);
    void card.offsetWidth; // start from the canvas position
    card.style.transitionDuration = `${560 * pace}ms`;
    place(card, fullRect());
    timers.push(setTimeout(done, 260 * pace));
  };

  const announce = () => {
    const slide = slides[current];
    slides.forEach((item, at) => item.element.classList.toggle('is-current', at === current));
    count.textContent = typed ? `→ ${typed}` : `${current + 1} / ${slides.length}`;
    root.querySelector('.deck-bar [data-go="overview"]').setAttribute('aria-pressed', String(mode === 'overview'));
    progress.style.width = `${(current / (slides.length - 1)) * 100}%`;
    root.style.setProperty('--hue', slide.hue ?? hueBase);
    live.textContent = mode === 'overview' ? 'Outline of every slide. Choose one to present it.' : `Slide ${current + 1} of ${slides.length}: ${slide.text}`;
    const hash = mode === 'overview' ? '#outline' : `#slide-${current + 1}`;
    window.history.replaceState(null, '', hash);
  };

  const go = (target, { fly = true, maxPace = 1 } = {}) => {
    clearTimers();
    const next = Math.max(0, Math.min(target, slides.length - 1));
    const direction = next < current ? -1 : 1;
    const fromOutline = mode === 'overview';
    const pace = fly ? Math.min(tempo(), maxPace) : 0;
    const to = slides[next];
    current = next;
    mode = 'present';
    root.classList.remove('overview');
    root.classList.add('presenting');
    root.style.setProperty('--tempo', pace || 1);
    announce();
    if (!pace) {
      // Quick: no flight. The card swaps in place with a short slide from the side you're heading.
      dropSpot(null);
      camera(boxOf(to), 0, 0.55);
      raiseSpot(to, null, { pace: fly && !reduceMotion() && !fromOutline ? 0 : 1, direction });
      return;
    }
    // The old card steps back, the camera glides to the new slide's spot on the canvas, and the
    // new card rises out of it.
    dropSpot('away', 380 * pace);
    camera(boxOf(to), 620 * pace, 0.55);
    timers.push(setTimeout(() => raiseSpot(to, rectOf(to), { pace }), 600 * pace));
  };

  // Opening the outline means you're looking for something, so it's always brisk.
  const showOverview = () => {
    clearTimers();
    mode = 'overview';
    root.classList.remove('presenting');
    root.classList.add('overview');
    const leaving = slides[current];
    const shrinking = Boolean(spot) && !reduceMotion();
    // Shrink the card back into its place, then pull back to the whole lecture.
    dropSpot(shrinking ? rectOf(leaving) : null, 220);
    timers.push(setTimeout(() => overviewCamera(420), shrinking ? 200 : 0));
    announce();
    showHint('Pinch or scroll to zoom · drag to move · tap a slide');
  };
  // The outline opens on the whole lecture — unless that would make it a sliver (a long lecture on a
  // phone held upright). Then it opens as wide as the screen, on the current slide, and reads like a
  // list you drag through; pinching in still shows everything.
  function overviewCamera(duration) {
    const area = view();
    fitZoom = Math.min(Math.min(area.w / canvasSize.w, area.h / canvasSize.h) * 0.96, zoomCap());
    const widthZoom = Math.min((area.w / canvasSize.w) * 0.96, zoomCap());
    if (widthZoom < fitZoom * 1.6) { camera(wholeCanvas(), duration, 0.96); return; }
    const box = boxOf(slides[current]);
    const [tx, ty] = clampPan((area.w - canvasSize.w * widthZoom) / 2, area.h / 2 - (box.y + box.h / 2) * widthZoom, widthZoom);
    apply(tx, ty, widthZoom, duration);
  }
  // In the outline, the arrow keys move the highlight; Enter presents it.
  const select = (target) => {
    current = Math.max(0, Math.min(target, slides.length - 1));
    announce();
    const box = boxOf(slides[current]);
    const area = view();
    const left = cam.tx + box.x * cam.zoom;
    const top = cam.ty + box.y * cam.zoom;
    const width = box.w * cam.zoom;
    const height = box.h * cam.zoom;
    if (left < 0 || top < 0 || left + width > area.w || top + height > area.h) {
      const [tx, ty] = clampPan(area.w / 2 - (box.x + box.w / 2) * cam.zoom, area.h / 2 - (box.y + box.h / 2) * cam.zoom, cam.zoom);
      apply(tx, ty, cam.zoom, 200);
    }
  };

  const close = () => {
    clearTimers();
    document.removeEventListener('keydown', onKey);
    window.removeEventListener('resize', onResize);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    root.remove();
    document.documentElement.classList.remove('deck-open');
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    if (onClose) onClose();
  };

  // ---------- input ----------
  // Type a slide number and press Enter to jump straight there.
  let typed = '';
  let typedTimer;
  const onKey = (event) => {
    if (event.target.closest && event.target.closest('input, textarea, select')) return;
    const key = event.key;
    if (/^[0-9]$/.test(key) && !event.metaKey && !event.ctrlKey && !event.altKey) {
      typed = (typed + key).slice(-3);
      clearTimeout(typedTimer);
      typedTimer = setTimeout(() => { typed = ''; announce(); }, 2000);
      announce();
      return;
    }
    if (key === 'Enter' && typed) {
      event.preventDefault();
      const target = Number(typed) - 1;
      typed = '';
      clearTimeout(typedTimer);
      go(target, { maxPace: 0.5 });
      return;
    }
    if (mode === 'overview' && ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(key)) {
      event.preventDefault();
      select(current + (key === 'ArrowRight' || key === 'ArrowDown' ? 1 : -1));
      return;
    }
    if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(key) && !(['Enter', ' '].includes(key) && event.target.closest('button, a, summary'))) {
      event.preventDefault();
      if (mode === 'overview') go(current, { maxPace: 0.5 }); else go(current + 1);
    } else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(key)) {
      event.preventDefault();
      go(current - 1);
    } else if (key === 'Home') go(0);
    else if (key === 'End') go(slides.length - 1);
    else if (key === 'o' || key === 'O' || key === 'z' || key === 'Z') { if (mode === 'overview') go(current); else showOverview(); }
    else if (key === 'f' || key === 'F') toggleFull();
    else if (key === 'Escape') { if (mode === 'present' && !document.fullscreenElement) showOverview(); else if (mode === 'overview') close(); }
  };
  const toggleFull = () => {
    if (!root.requestFullscreen) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else root.requestFullscreen().catch(() => {});
  };

  root.addEventListener('click', (event) => {
    const button = event.target.closest('[data-go]');
    if (button) {
      const action = button.dataset.go;
      if (action === 'prev') go(current - 1);
      else if (action === 'next') go(current + 1);
      else if (action === 'overview') { if (mode === 'overview') go(current); else showOverview(); }
      else if (action === 'full') toggleFull();
      else if (action === 'first') go(0);
      else if (action === 'close') close();
      return;
    }
    // Links, power-ups, and anything else you can press on a slide do their own thing.
    if (event.target.closest('a, summary, details, button, input, textarea, select')) return;
    const picked = event.target.closest('.deck-slide');
    if (mode === 'overview') {
      if (picked && !dragged) go(Number(picked.dataset.index), { maxPace: 0.5 });
      return;
    }
    if (dragged || window.getSelection().toString()) return;
    // Tap the left third to go back, anywhere else to go on.
    if (event.clientX < window.innerWidth / 3) go(current - 1); else go(current + 1);
  });

  // Swipe to move; pinch (or a trackpad pinch) to zoom out to the outline and back in.
  // In the outline: one finger (or the mouse) drags the map, two fingers pinch-zoom it, and
  // pinching past the closest zoom opens the slide under your fingers.
  const pointers = new Map();
  let startSpread = 0;
  let startMid = null;
  let startCam = null;
  let swipeStart = null;
  let lastPoint = null;
  let dragged = false;
  const local = (x, y) => { const rect = stage.getBoundingClientRect(); return { x: x - rect.left, y: y - rect.top }; };
  const pinchState = () => {
    const [a, b] = [...pointers.values()];
    return { spread: Math.hypot(a.x - b.x, a.y - b.y), mid: local((a.x + b.x) / 2, (a.y + b.y) / 2) };
  };
  stage.addEventListener('pointerdown', (event) => {
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    dragged = false;
    if (pointers.size === 1) { swipeStart = { x: event.clientX, y: event.clientY }; lastPoint = swipeStart; }
    if (pointers.size === 2) {
      const pinch = pinchState();
      startSpread = pinch.spread;
      startMid = pinch.mid;
      startCam = { ...cam };
    }
  });
  stage.addEventListener('pointermove', (event) => {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 2 && startSpread) {
      const pinch = pinchState();
      const spread = pinch.spread / startSpread;
      if (mode === 'present') {
        if (spread < 0.7) { showOverview(); startSpread = 0; dragged = true; }
        return;
      }
      if (Math.abs(spread - 1) > 0.03 || Math.hypot(pinch.mid.x - startMid.x, pinch.mid.y - startMid.y) > 6) dragged = true;
      zoomAt(startMid.x, startMid.y, startCam.zoom * spread, startCam, pinch.mid);
      if (mode !== 'overview') startSpread = 0;
      return;
    }
    if (pointers.size === 1 && mode === 'overview' && lastPoint) {
      const dx = event.clientX - lastPoint.x;
      const dy = event.clientY - lastPoint.y;
      lastPoint = { x: event.clientX, y: event.clientY };
      if (!dragged && Math.hypot(event.clientX - swipeStart.x, event.clientY - swipeStart.y) < 8) return;
      dragged = true;
      panBy(dx, dy);
    }
  });
  const release = (event) => {
    if (pointers.size === 1 && swipeStart && mode === 'present') {
      const dx = event.clientX - swipeStart.x;
      const dy = event.clientY - swipeStart.y;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) { dragged = true; go(current + (dx < 0 ? 1 : -1)); }
    }
    pointers.delete(event.pointerId);
    // Lifting one finger of a pinch leaves the other one dragging from where it is now.
    if (pointers.size === 1) { startSpread = 0; const [rest] = [...pointers.values()]; lastPoint = rest; swipeStart = rest; }
    if (!pointers.size) { swipeStart = null; lastPoint = null; startSpread = 0; setTimeout(() => { dragged = false; }, 0); }
  };
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);
  // A trackpad pinch arrives as ctrl + wheel. In the outline it zooms around the cursor and a plain
  // scroll pans; on a slide, pinching out opens the outline and scrolling is left to long slides.
  stage.addEventListener('wheel', (event) => {
    if (mode === 'present') {
      if (!event.ctrlKey) return;
      event.preventDefault();
      if (event.deltaY > 2) showOverview();
      return;
    }
    event.preventDefault();
    const point = local(event.clientX, event.clientY);
    if (event.ctrlKey) zoomAt(point.x, point.y, cam.zoom * Math.exp(-event.deltaY * 0.01));
    else panBy(-event.deltaX, -event.deltaY);
  }, { passive: false });

  let resizeTimer;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      build();
      if (mode === 'overview') showOverview(); else go(current, { fly: false });
    }, 150);
  };

  let hintTimer;
  const hintsShown = new Set();
  function showHint(text) {
    if (hintsShown.has(text)) return;
    hintsShown.add(text);
    const hint = root.querySelector('.deck-hint');
    hint.textContent = text;
    hint.classList.remove('gone');
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => hint.classList.add('gone'), 4200);
  }

  document.documentElement.classList.add('deck-open');
  document.addEventListener('keydown', onKey);
  window.addEventListener('resize', onResize);
  build();
  // Arrive from the outline, so the first thing anyone sees is the whole lecture zooming in.
  camera({ x: 0, y: 0, w: canvasSize.w, h: canvasSize.h }, 0, 0.96);
  root.focus();
  hintsShown.add('first');
  hintTimer = setTimeout(() => root.querySelector('.deck-hint').classList.add('gone'), 4200);
  fitZoom = cam.zoom;
  if (overview) requestAnimationFrame(() => showOverview());
  else timers.push(setTimeout(() => go(current), reduceMotion() ? 0 : 450));
  return { go, showOverview, close, slides };
}
