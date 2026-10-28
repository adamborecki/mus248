// Presenter view: ?presenter=1 on any lecture page. Made for the classroom computer, projected on
// its one screen, so it shows only what students see (no 🧑‍🏫 notes, no 🙈 slides):
//
//   left    every slide as a thumbnail: the current one boxed, it and the next one larger
//   middle  the slide deck itself, in an iframe of this same page (?embed=deck)
//   right   the follow-along notes as printed, filled in up to the current slide
//
// Shift+X marks the current slide skipped (struck through on the deck and the notes, so the class
// crosses it off); Shift+X again undoes it. Shift+E edits the current slide's text. Edits are a
// scratchpad for after class: they change the deck on this computer only, and the notes column
// keeps the printed text with a "write this in the margin" box. Changes (📤) copies them for an
// email or opens a GitHub issue, for someone to fold into the Markdown by hand. Nothing here
// changes what the server serves.
//
// The slide, the skips, and the edits are kept in localStorage per lecture, so closing the tab (or
// the deck reloading after an edit) loses nothing.
//
// The divider between deck and notes drags (double-click puts it back), A−/A+ size the notes text,
// and 📄 sizes it to break lines exactly where the printed notes do, so you see what students see.
// That layout is kept per computer, not per lecture.

import { escapeHtml, inline, isFence, renderMarkdown } from '../markdown.js';
import { openDeck } from './deck.js';
import { notesMarkdown } from './notes.js';
import { lectureText } from './text.js';
import { courseOf } from './view.js';

const REPO = 'https://github.com/adamborecki/mus248';
const storageKey = (id) => `mus248:presenter:${id}`;
const fresh = () => ({ slide: 0, skipped: [], edits: {} });

export function loadState(id) {
  try {
    return { ...fresh(), ...JSON.parse(window.localStorage.getItem(storageKey(id))) };
  } catch {
    return fresh();
  }
}
function saveState(id, state) {
  try { window.localStorage.setItem(storageKey(id), JSON.stringify(state)); } catch { /* nowhere to keep it */ }
}

const LAYOUT_KEY = 'mus248:presenter-layout';
const loadLayout = () => {
  try { return { width: null, size: null, ...JSON.parse(window.localStorage.getItem(LAYOUT_KEY)) }; } catch { return { width: null, size: null }; }
};
const saveLayout = (layout) => {
  try { window.localStorage.setItem(LAYOUT_KEY, JSON.stringify(layout)); } catch { /* nowhere to keep it */ }
};
// One column of the printed notes (notes.css): letter paper, .5in margins, two columns .3in apart,
// 9pt text. (8.5 − 1 − .3) / 2 = 3.6in = 259.2pt, so a line holds 28.8em of text.
const PAPER_EMS = 28.8;
const NOTES_SIZE = 15;

// The lecture's text split the way the deck splits it: block 0 is everything before the first
// heading (it goes on the title slide), then one block per ## or ### heading. Deck slide n is block
// n, and the deck adds one more slide at the end ("That's the lecture!").
export function slideBlocks(markdown) {
  const blocks = [[]];
  let fenced = false;
  markdown.split('\n').forEach((line) => {
    if (isFence(line)) fenced = !fenced;
    else if (!fenced && /^#{2,3}\s/.test(line)) blocks.push([]);
    blocks[blocks.length - 1].push(line);
  });
  return blocks.map((lines) => lines.join('\n').trimEnd());
}

// An edit replaces one block, and only while that block still reads the way it did when it was
// edited. If the lecture has changed since, the edit is left out (and the export says so).
export function applyEdits(markdown, edits = {}) {
  return slideBlocks(markdown)
    .map((block, at) => (edits[at] && edits[at].before === block ? edits[at].after : block))
    .join('\n\n');
}

// One edit, one slide: a new ## or ### line would add a slide and shift every number after it.
export function editProblem(text, at) {
  const headings = slideBlocks(text).length - 1;
  if (at === 0) return headings ? 'The title slide can\'t have a ## or ### heading in it.' : '';
  if (!/^#{2,3}\s/.test(text.trimStart())) return 'Keep the slide\'s heading (its ## or ### line) as the first line.';
  return headings > 1 ? 'One slide at a time: a second ## or ### line would make a new slide.' : '';
}

const headingText = (block) => (block.match(/^#{2,3}\s+(.*)$/m) || [])[1] || '';
const bodyOf = (block) => block.replace(/^#{2,3}\s.*$/m, '').trim();

// What changed, line by line, for the margin box and the export.
function lineChanges(before, after) {
  const was = new Set(before.split('\n').map((line) => line.trim()).filter(Boolean));
  const now = new Set(after.split('\n').map((line) => line.trim()).filter(Boolean));
  return { added: [...now].filter((line) => !was.has(line)), removed: [...was].filter((line) => !now.has(line)) };
}

// ---------- inside the iframe: the deck alone ----------

export function mountEmbeddedDeck({ root, lecture, source, deck }) {
  const state = loadState(lecture.id);
  document.documentElement.classList.add('deck-embedded');
  const article = document.createElement('article');
  article.innerHTML = renderMarkdown(applyEdits(lectureText(source), state.edits), { assetBase: '../../content/lectures/' });
  root.replaceChildren();
  const tell = (message) => window.parent.postMessage({ source: 'mus248-deck', ...message }, window.location.origin);
  const startAt = Number((window.location.hash.match(/^#slide-(\d+)$/) || [])[1] || 1) - 1;
  const slides = openDeck({ ...deck, article, startAt, embedded: true, onChange: (index, mode) => tell({ type: 'slide', index, mode }) });
  slides.setSkipped(new Set(state.skipped));
  window.addEventListener('message', (event) => {
    if (event.origin !== window.location.origin || !event.data || event.data.source !== 'mus248-presenter') return;
    if (event.data.type === 'go') slides.go(event.data.index, { maxPace: 0.5 });
    if (event.data.type === 'skipped') slides.setSkipped(new Set(event.data.skipped));
  });
  // The presenter's own keys work even while the deck has the focus.
  document.addEventListener('keydown', (event) => {
    if (event.shiftKey && (event.code === 'KeyX' || event.code === 'KeyE')) { event.preventDefault(); tell({ type: 'key', key: event.code }); }
    else if (!event.shiftKey && event.code === 'KeyF') tell({ type: 'key', key: 'KeyF' });
  });
}

// ---------- the presenter page ----------

export function mountPresenter({ root, lecture, source }) {
  const id = lecture.id;
  let state = loadState(id);
  const original = lectureText(source);
  const blocks = slideBlocks(original);
  const total = blocks.length + 1;
  const last = total - 1;
  let current = Math.max(0, Math.min(state.slide || 0, last));

  // The deck's colors: the same formula deck.js uses, so a thumbnail matches its slide.
  const hueBase = ((lecture.lecture || lecture.title.length) * 47 + 205) % 360;
  let sections = 0;
  const hues = blocks.map((block, at) => {
    if (at === 0) return hueBase;
    if (/^##\s/.test(block) || !sections) sections += 1;
    return (hueBase + (sections - 1) * 38) % 360;
  });
  hues.push((hueBase + 120) % 360);

  const live = (at) => (state.edits[at] && state.edits[at].before === blocks[at] ? state.edits[at].after : blocks[at]);
  const titleOf = (at) => (at === 0 ? escapeHtml(lecture.title) : at === last ? '🎉 That\'s the lecture!' : inline(headingText(live(at))));
  const plainTitle = (at) => (at === 0 ? lecture.title : at === last ? 'End' : headingText(live(at)).replace(/[*`]/g, ''));

  document.title = `${lecture.title} · Presenter · ${courseOf(lecture)}`;
  document.documentElement.classList.add('presenter-open');
  root.innerHTML = `
    <div class="pv">
      <nav class="pv-thumbs" aria-label="Slides"></nav>
      <div class="pv-stage">
        <iframe class="pv-deck" title="Slides"></iframe>
        <form class="pv-editor" hidden>
          <label for="pv-edit-text"></label>
          <textarea id="pv-edit-text" spellcheck="true"></textarea>
          <p class="pv-editor-error" role="alert"></p>
          <p class="pv-editor-actions">
            <button type="submit" class="pv-primary">Save <small>⌘↵</small></button>
            <button type="button" data-pv="cancel">Cancel <small>Esc</small></button>
            <button type="button" data-pv="revert">Undo my edits to this slide</button>
            <small>Saved on this computer only. The printed notes don't change: this slide gets a
            "write this in the margin" box instead.</small>
          </p>
        </form>
      </div>
      <aside class="pv-notes" aria-label="Follow-along notes">
        <div class="pv-resize" role="separator" aria-orientation="vertical" aria-label="Resize the notes column" tabindex="0" title="Drag to resize · double-click to put it back"></div>
        <div class="pv-bar">
          <strong class="pv-count"></strong>
          <button type="button" data-pv="skip" title="Shift+X">✂️ Skip</button>
          <button type="button" data-pv="edit" title="Shift+E">✏️ Edit</button>
          <button type="button" data-pv="changes">📤 Changes</button>
          <button type="button" data-pv="full" title="F" aria-label="Full screen">⛶</button>
          <a href="./" title="Leave presenter view" aria-label="Leave presenter view">✕</a>
        </div>
        <div class="pv-notes-body"></div>
        <div class="pv-zoom" role="group" aria-label="Notes text size">
          <button type="button" data-pv="smaller" title="Smaller notes text" aria-label="Smaller notes text">A−</button>
          <button type="button" data-pv="bigger" title="Bigger notes text" aria-label="Bigger notes text">A+</button>
          <button type="button" data-pv="paper" title="Same line breaks as the printed notes">📄 Fit to paper</button>
        </div>
      </aside>
    </div>
    <div class="pv-modal" hidden role="dialog" aria-modal="true" aria-label="Changes from class">
      <div class="pv-modal-card">
        <h2>📤 Changes from class</h2>
        <p>Skips and edits are saved on this computer only. Send them to yourself, then fold them into
        the lecture Markdown by hand.</p>
        <textarea readonly class="pv-export"></textarea>
        <p class="pv-modal-actions">
          <button type="button" class="pv-primary" data-pv="copy">📋 Copy (for an email)</button>
          <a class="pv-issue" target="_blank" rel="noopener">Open a GitHub issue</a>
          <button type="button" data-pv="clear">🗑️ Clear all</button>
          <button type="button" data-pv="close">Close</button>
        </p>
        <p class="pv-modal-note"></p>
      </div>
    </div>
    <p class="pv-toast" aria-live="polite"></p>`;

  const thumbs = root.querySelector('.pv-thumbs');
  const frame = root.querySelector('.pv-deck');
  const notes = root.querySelector('.pv-notes-body');
  const editor = root.querySelector('.pv-editor');
  const editText = editor.querySelector('textarea');
  const modal = root.querySelector('.pv-modal');
  const toast = root.querySelector('.pv-toast');
  let toastTimer;
  const say = (text) => {
    toast.textContent = text;
    toast.classList.add('shown');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('shown'), 2600);
  };
  const save = () => { state.slide = current; saveState(id, state); };

  // ----- layout: the divider and the notes' text size -----
  const pv = root.querySelector('.pv');
  const handle = root.querySelector('.pv-resize');
  const layout = loadLayout();
  // Keep at least 600px for the thumbnails and the deck, and enough notes to read.
  const clampWidth = (width) => Math.round(Math.max(240, Math.min(width, window.innerWidth - 254 - 360)));
  // The notes' text runs the column's width less its padding (18px a side) and the current-slide bar.
  const paperSize = () => Math.max(8, (notes.clientWidth - 40) / PAPER_EMS);
  const notesSize = () => (layout.size === 'paper' ? paperSize() : (layout.size || NOTES_SIZE));
  const applyLayout = () => {
    if (layout.width) pv.style.setProperty('--pv-notes-w', `${clampWidth(layout.width)}px`);
    else pv.style.removeProperty('--pv-notes-w');
    notes.style.fontSize = `${notesSize().toFixed(2)}px`;
    root.querySelector('[data-pv="paper"]').setAttribute('aria-pressed', String(layout.size === 'paper'));
  };
  const relayout = () => { applyLayout(); saveLayout(layout); show({ scroll: true }); };
  const zoom = (by) => {
    layout.size = Math.round(Math.max(9, Math.min(40, notesSize() * by)) * 10) / 10;
    relayout();
  };
  handle.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    handle.setPointerCapture(event.pointerId);
    pv.classList.add('is-resizing');
    const move = (moved) => { layout.width = clampWidth(pv.getBoundingClientRect().right - moved.clientX); applyLayout(); };
    const done = () => {
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', done);
      handle.removeEventListener('pointercancel', done);
      pv.classList.remove('is-resizing');
      relayout();
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', done);
    handle.addEventListener('pointercancel', done);
  });
  handle.addEventListener('dblclick', () => { layout.width = null; relayout(); });
  handle.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    event.stopPropagation();
    layout.width = clampWidth(root.querySelector('.pv-notes').offsetWidth + (event.key === 'ArrowLeft' ? 20 : -20));
    relayout();
  });
  window.addEventListener('resize', () => { if (layout.size === 'paper') applyLayout(); });
  const tellDeck = (message) => { if (frame.contentWindow) frame.contentWindow.postMessage({ source: 'mus248-presenter', ...message }, window.location.origin); };

  // ----- thumbnails -----
  const drawThumbs = () => {
    thumbs.innerHTML = Array.from({ length: total }, (_, at) => {
      const body = at === 0
        ? `<p>${escapeHtml(lecture.date || '')}</p>`
        : at === last ? '' : renderMarkdown(bodyOf(live(at)), { assetBase: '../../content/lectures/' });
      const kind = at === 0 || at === last || /^##\s/.test(blocks[at] || '') ? ' pv-thumb-card' : '';
      return `<button type="button" class="pv-thumb${kind}" data-slide="${at}" style="--hue:${hues[at]}">
        <span class="pv-thumb-num">${at + 1}</span>
        <span class="pv-thumb-face"><span class="pv-thumb-inner"><strong class="pv-thumb-title">${titleOf(at)}</strong>${body}</span></span>
      </button>`;
    }).join('');
    // Thumbnails are for looking, not tabbing through: nothing inside one is a link.
    thumbs.querySelectorAll('a, button button').forEach((node) => node.replaceWith(...node.childNodes));
  };
  thumbs.addEventListener('click', (event) => {
    const thumb = event.target.closest('.pv-thumb');
    if (thumb) go(Number(thumb.dataset.slide));
  });

  // ----- notes: the printed text, grouped by slide -----
  const drawNotes = () => {
    const holder = document.createElement('div');
    holder.innerHTML = renderMarkdown(notesMarkdown(source), { assetBase: '../../content/lectures/', blanks: 'mark' });
    notes.innerHTML = `<p class="pv-notes-title">📝 Follow-along notes</p>`;
    let group = document.createElement('section');
    group.dataset.slide = '0';
    let count = 0;
    [...holder.children].forEach((node) => {
      if (node.tagName === 'H2' || node.tagName === 'H3') {
        notes.append(group);
        count += 1;
        group = document.createElement('section');
        group.dataset.slide = String(count);
      }
      group.append(node);
    });
    notes.append(group);
    Object.entries(state.edits).forEach(([at, edit]) => {
      if (edit.before !== blocks[at]) return;
      const target = notes.querySelector(`section[data-slide="${at}"]`);
      if (!target) return;
      const { added, removed } = lineChanges(edit.before, edit.after);
      const box = document.createElement('div');
      box.className = 'pv-margin';
      box.innerHTML = (added.length ? `<strong>✏️ Write this in the margin:</strong>${renderMarkdown(added.join('\n\n'), { blanks: 'mark' })}` : '')
        + (removed.length ? `<strong>✂️ Cross out:</strong>${renderMarkdown(removed.join('\n\n'), { blanks: 'mark' })}` : '');
      const heading = target.querySelector('h2, h3');
      if (heading) heading.after(box); else target.prepend(box);
    });
  };

  // ----- where we are -----
  const show = ({ scroll = true } = {}) => {
    const skipped = new Set(state.skipped);
    root.querySelector('.pv-count').textContent = `${current + 1} / ${total}`;
    root.querySelector('[data-pv="skip"]').setAttribute('aria-pressed', String(skipped.has(current)));
    const changes = state.skipped.length + Object.keys(state.edits).length;
    root.querySelector('[data-pv="changes"]').textContent = changes ? `📤 Changes (${changes})` : '📤 Changes';
    thumbs.querySelectorAll('.pv-thumb').forEach((thumb) => {
      const at = Number(thumb.dataset.slide);
      thumb.classList.toggle('is-current', at === current);
      thumb.classList.toggle('is-next', at === current + 1);
      thumb.classList.toggle('is-skipped', skipped.has(at));
      thumb.classList.toggle('is-edited', Boolean(state.edits[at]));
      if (at === current) thumb.setAttribute('aria-current', 'true'); else thumb.removeAttribute('aria-current');
    });
    notes.querySelectorAll('section[data-slide]').forEach((group) => {
      const at = Number(group.dataset.slide);
      group.classList.toggle('is-past', at < current);
      group.classList.toggle('is-current', at === current);
      group.classList.toggle('is-future', at > current);
      group.classList.toggle('is-skipped', skipped.has(at));
    });
    if (!scroll) return;
    const thumb = thumbs.querySelector('.pv-thumb.is-current');
    if (thumb) thumbs.scrollTo({ top: Math.max(0, thumb.offsetTop - thumbs.clientHeight * 0.25), behavior: 'smooth' });
    // Someone is always still writing the last slide or two, so the current slide never jumps to
    // the top: up to two slides above it stay in view, as long as it stays in the top half.
    const at = Math.min(current, last - 1);
    const group = notes.querySelector(`section[data-slide="${at}"]`);
    if (group) {
      const lowest = group.offsetTop - notes.clientHeight * 0.45;
      const earlier = [2, 1].map((back) => notes.querySelector(`section[data-slide="${at - back}"]`)).find((item) => item && item.offsetTop >= lowest);
      notes.scrollTo({ top: Math.max(0, earlier ? earlier.offsetTop - 12 : lowest), behavior: 'smooth' });
    }
  };

  const go = (at) => {
    const next = Math.max(0, Math.min(at, last));
    tellDeck({ type: 'go', index: next });
    frame.focus();
  };

  // The deck lives in the iframe and reports every move; it reloads (at the same slide) after an
  // edit, since it's built from the text when it opens.
  const loadDeck = () => {
    frame.src = `./?embed=deck&v=${Date.now()}#slide-${current + 1}`;
  };
  frame.addEventListener('load', () => frame.focus());
  window.addEventListener('message', (event) => {
    if (event.origin !== window.location.origin || event.source !== frame.contentWindow || !event.data || event.data.source !== 'mus248-deck') return;
    if (event.data.type === 'slide' && event.data.index !== current) {
      current = event.data.index;
      save();
      show();
    }
    if (event.data.type === 'key') key(event.data.key);
  });

  // ----- skip -----
  const toggleSkip = () => {
    const skipped = new Set(state.skipped);
    if (skipped.has(current)) { skipped.delete(current); say('Not skipped any more'); }
    else { skipped.add(current); say('✂️ Skipped: cross it off. Shift+X again to undo.'); }
    state.skipped = [...skipped].sort((a, b) => a - b);
    save();
    tellDeck({ type: 'skipped', skipped: state.skipped });
    show({ scroll: false });
  };

  // ----- edit -----
  let editing = null;
  const openEditor = () => {
    if (current === last) { say('The end slide has no text to edit.'); return; }
    editing = current;
    editor.querySelector('label').textContent = `✏️ Slide ${current + 1}: ${plainTitle(current)}`;
    editText.value = live(current);
    editor.querySelector('.pv-editor-error').textContent = '';
    editor.hidden = false;
    editText.focus();
  };
  const closeEditor = () => {
    editor.hidden = true;
    editing = null;
    frame.focus();
  };
  const commitEdit = (text) => {
    const at = editing;
    const after = text.trimEnd();
    if (after === blocks[at]) delete state.edits[at];
    else state.edits[at] = { before: blocks[at], after, title: headingText(blocks[at]) || lecture.title, at: new Date().toISOString() };
    save();
    closeEditor();
    drawThumbs();
    drawNotes();
    show();
    loadDeck();
    say(state.edits[at] ? '✏️ Saved on this computer. It\'s in 📤 Changes.' : 'Back to the original text');
  };
  editor.addEventListener('submit', (event) => {
    event.preventDefault();
    const problem = editProblem(editText.value, editing);
    if (problem) { editor.querySelector('.pv-editor-error').textContent = problem; return; }
    commitEdit(editText.value);
  });
  editor.querySelector('[data-pv="cancel"]').addEventListener('click', closeEditor);
  editor.querySelector('[data-pv="revert"]').addEventListener('click', () => commitEdit(blocks[editing]));
  editText.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { event.preventDefault(); closeEditor(); }
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) { event.preventDefault(); editor.requestSubmit(); }
  });

  // ----- export -----
  const fence = (text) => `~~~~\n${text}\n~~~~`;
  const exportText = () => {
    const lines = [
      `Presenter view changes: ${lecture.title}`,
      `${[lecture.lecture && `Lecture ${String(lecture.lecture).padStart(2, '0')}`, lecture.date].filter(Boolean).join(' · ')}`,
      `Source: content/lectures/${lecture.contentFile}.md`,
      `Page: https://adamborecki.github.io/mus248/lectures/${id}/`,
      '',
    ];
    if (state.skipped.length) {
      lines.push('Skipped in class:', ...state.skipped.map((at) => `- Slide ${at + 1}: ${plainTitle(at)}`), '');
    }
    Object.entries(state.edits).sort(([a], [b]) => a - b).forEach(([at, edit]) => {
      const stale = edit.before !== blocks[at];
      lines.push(`## Slide ${Number(at) + 1}: ${edit.title}${stale ? ' (the lecture has changed since this edit, so it is not showing)' : ''}`, '', 'Before:', fence(edit.before), '', 'After:', fence(edit.after), '');
    });
    if (lines.length === 5) lines.push('No skips or edits yet.');
    return lines.join('\n');
  };
  // A pre-filled issue travels in the address, which browsers and GitHub cut off past a few
  // thousand characters; the copy button always has the whole thing.
  const issueUrl = (text) => {
    const title = `Lecture edits from class: ${lecture.title}`;
    let body = text;
    const url = () => `${REPO}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
    let cut = false;
    while (url().length > 7000) { body = body.slice(0, Math.floor(body.length * 0.85)); cut = true; }
    if (cut) body += '\n\n… cut short to fit the link. Paste the full text from presenter view\'s 📋 Copy.';
    return { href: url(), cut };
  };
  const openChanges = () => {
    const text = exportText();
    modal.querySelector('.pv-export').value = text;
    const { href, cut } = issueUrl(text);
    modal.querySelector('.pv-issue').href = href;
    modal.querySelector('.pv-modal-note').textContent = `${cut ? 'The GitHub issue link holds only part of this; paste the rest from 📋 Copy. ' : ''}Not signed in to GitHub on this computer? Copy it and email it to yourself instead.`;
    modal.hidden = false;
    modal.querySelector('[data-pv="copy"]').focus();
  };
  const closeChanges = () => { modal.hidden = true; frame.focus(); };
  modal.addEventListener('click', async (event) => {
    const action = event.target.closest('[data-pv]')?.dataset.pv;
    if (event.target === modal || action === 'close') closeChanges();
    if (action === 'copy') {
      const area = modal.querySelector('.pv-export');
      try { await navigator.clipboard.writeText(area.value); say('📋 Copied'); } catch { area.select(); say('Selected: press ⌘C to copy'); }
    }
    if (action === 'clear' && window.confirm('Clear every skip and edit for this lecture, on this computer? Copy them first if you still need them.')) {
      state = { ...fresh(), slide: current };
      save();
      closeChanges();
      drawThumbs();
      drawNotes();
      show({ scroll: false });
      loadDeck();
      say('Cleared');
    }
  });

  // ----- keys -----
  const toggleFull = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
  };
  function key(code) {
    if (!modal.hidden || !editor.hidden) return;
    if (code === 'KeyX') toggleSkip();
    else if (code === 'KeyE') openEditor();
    else if (code === 'KeyF') toggleFull();
  }
  document.addEventListener('keydown', (event) => {
    if (!modal.hidden && event.key === 'Escape') { closeChanges(); return; }
    if (event.target.closest('textarea, input')) return;
    if (event.shiftKey && (event.code === 'KeyX' || event.code === 'KeyE')) { event.preventDefault(); key(event.code); return; }
    if (!modal.hidden || !editor.hidden) return;
    if (event.code === 'KeyF' && !event.shiftKey && !event.metaKey && !event.ctrlKey) key('KeyF');
    else if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key) && !event.target.closest('button, a')) { event.preventDefault(); go(current + 1); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) { event.preventDefault(); go(current - 1); }
  });
  root.querySelector('.pv-bar').addEventListener('click', (event) => {
    const action = event.target.closest('[data-pv]')?.dataset.pv;
    if (action === 'skip') toggleSkip();
    if (action === 'edit') openEditor();
    if (action === 'changes') openChanges();
    if (action === 'full') toggleFull();
  });
  root.querySelector('.pv-zoom').addEventListener('click', (event) => {
    const action = event.target.closest('[data-pv]')?.dataset.pv;
    if (action === 'smaller') zoom(1 / 1.1);
    if (action === 'bigger') zoom(1.1);
    if (action === 'paper') { layout.size = 'paper'; relayout(); }
  });

  drawThumbs();
  drawNotes();
  applyLayout();
  show();
  loadDeck();
}
