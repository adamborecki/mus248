// The quiz code a student has pasted or earned, kept on this device and shared by
// the quiz and the study cards (same origin, same key). The code is already
// portable and public-by-design (see state-code.js); this just saves the retyping.
// localStorage can be missing (private browsing) — everything here degrades to
// "nothing saved" rather than throwing.

import { decodeStateCode, findStateCodes } from './state-code.js';
import { escapeHtml } from './html.js';

export const LAST_CODE_KEY = 'mus248-quiz:last-code';

export const CODE_ERRORS = {
  missing: 'We couldn’t find a quiz code in that text. Codes start with M248Q.',
  incomplete: 'That code looks cut off. Copy the whole thing, all the way to the end, and try again.',
  checksum: 'That code doesn’t check out. Part of it may be missing or changed. Try copying it again.',
  format: 'That code couldn’t be read. Try copying it again.',
  newer: 'That code came from a newer version of the quiz. Refresh this page and try again.',
};

export function readSavedCode() {
  try {
    const saved = JSON.parse(localStorage.getItem(LAST_CODE_KEY));
    return saved?.code ? saved : null;
  } catch { return null; }
}

export function writeSavedCode(quiz, code) {
  try { localStorage.setItem(LAST_CODE_KEY, JSON.stringify({ quiz, code })); } catch { /* not saved */ }
}

export function forgetSavedCode() {
  try { localStorage.removeItem(LAST_CODE_KEY); } catch { /* nothing saved */ }
}

// The saved code, decoded — or null if none is saved or it no longer reads.
export function savedState() {
  const saved = readSavedCode();
  const result = saved ? decodeStateCode(saved.code) : null;
  return result?.ok ? result.state : null;
}

// A paste box that works any time, with no access code: it checks the code the
// moment it lands, saves it, and tells the caller. `onChange(state | null)` fires
// when a code is loaded or forgotten. `summarize(state)` returns the HTML shown
// after a good paste (e.g. "3 skills to review" and a link).
export function mountCodeBox(root, { summarize = () => '', onChange = () => {} } = {}) {
  const when = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  function draw(state) {
    root.innerHTML = state ? `
      <p class="status ok" role="status">Quiz ${Number(state.q)} code saved on this device ✓ <span class="quiet">(${escapeHtml(when(state.t))})</span></p>
      ${summarize(state)}
      <p class="small"><button class="text-button" data-act="replace">Paste a different code</button> · <button class="text-button" data-act="forget">Forget it</button></p>`
      : `
      <label class="field" for="code-box">Paste your code (or your whole Canvas submission)</label>
      <textarea id="code-box" rows="3" spellcheck="false" autocomplete="off" placeholder="M248Q…"></textarea>
      <p class="status quiet" role="status"></p>`;
    const box = root.querySelector('#code-box');
    const status = root.querySelector('.status');
    const complain = (reason) => { status.className = 'status error'; status.textContent = CODE_ERRORS[reason]; };
    // Check on paste, as the quiz's own Step 1 does. A half-pasted code stays
    // quiet until the box loses focus, so nobody is scolded mid-paste.
    box?.addEventListener('input', () => {
      if (!findStateCodes(box.value).length) return;
      const result = decodeStateCode(box.value);
      if (!result.ok) return complain(result.reason);
      writeSavedCode(result.state.q, result.code);
      draw(result.state);
      onChange(result.state);
    });
    box?.addEventListener('change', () => {
      if (box.value.trim() && !findStateCodes(box.value).length) complain(decodeStateCode(box.value).reason);
    });
    root.querySelector('[data-act="replace"]')?.addEventListener('click', () => { draw(null); root.querySelector('#code-box').focus(); });
    root.querySelector('[data-act="forget"]')?.addEventListener('click', () => { forgetSavedCode(); draw(null); onChange(null); });
  }

  draw(savedState());
}
