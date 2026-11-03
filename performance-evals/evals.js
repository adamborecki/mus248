// Performance evals: the midterm and the final, each one Markdown file in content/performance-evals/.
// The page (/performance-evals/) and the printed sheet (/performance-evals/sheet/?id=midterm) both
// come from that file, the same way a worksheet comes from its activity, so the two can't drift.
// midterm.md's header comment lists the conventions.

import { escapeHtml, inline, joinWrappedLines, renderMarkdown } from '../markdown.js';
import { parseFrontmatter, renderQr } from '../worksheet.js';
import { crumbs } from '../crumbs.js';

export const EVALS = ['midterm', 'final'];

const COMMENT = /<!--[\s\S]*?-->\s*/g;
const BLANK = /_{3,}/g;
const ONLY_BLANK = /^_{3,}$/;
const GOAL = /^\*\*Goal:\*\*\s*(.*)$/;
const SOURCE = /^📖/u;
const words = (heading) => heading.replace(/^[^\p{L}\p{N}]+/u, '').trim().toLowerCase();
export const stationSlug = (heading) => words(heading).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// "- [ ] Says which card goes in the H6 ✅ 8 GB": the part after ✅ is what the checker looks for.
// Only the answer key (?checker=1, which the checker uses) shows it; the page and the student's sheet stop at the ✅.
const ANSWER = /\s*✅\s*(.*)$/u;
const withoutAnswer = (line) => line.replace(ANSWER, '');

// Split into the intro and one entry per ## section. A section is "how it works" (page only),
// "about you" (the name lines on the sheet), or a station.
export function parseEval(markdown) {
  const front = parseFrontmatter(markdown);
  const body = joinWrappedLines(markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\s*/, '').replace(COMMENT, ''));
  const sections = [];
  const intro = [];
  body.split('\n').forEach((line) => {
    const heading = line.match(/^##\s+(.+)$/);
    if (heading) {
      const kind = { 'how it works': 'how', 'about you': 'about' }[words(heading[1])] || 'station';
      sections.push({ heading: heading[1].trim(), kind, lines: [] });
    } else if (sections.length) sections[sections.length - 1].lines.push(line);
    else intro.push(line);
  });
  sections.forEach((section) => {
    const goal = section.lines.map((line) => line.match(GOAL)).find(Boolean);
    section.goal = goal ? goal[1].trim() : '';
    section.items = section.lines.filter((line) => /^(?:-\s+\[[ xX]\]|\d+\.)\s/.test(line.trim())).length;
  });
  return { front, intro: intro.join('\n').trim(), sections };
}

// ---------- the page ----------

// A short status for a closed card, so the list reads at a glance: how many items a station has, or
// that it isn't written yet.
function cardStatus(section) {
  if (section.kind === 'how') return `${section.items} steps`;
  const pending = section.lines.some((line) => line.includes('🚧'));
  if (!section.items) return '🚧 Not written yet';
  return `${pending ? '🚧 Draft · ' : ''}${section.items} ${section.items === 1 ? 'item' : 'items'}`;
}

// The intro, then one closed card per section (the hub's activity card): emoji, title, and goal
// on the outside, everything else inside. The name lines are for paper only.
export function renderEvalPage(markdown, { assetBase = '../content/performance-evals/', id = '' } = {}) {
  const parsed = parseEval(markdown);
  const options = { assetBase };
  const cards = parsed.sections.filter((section) => section.kind !== 'about').map((section) => {
    const [, emoji = '', title = section.heading] = section.heading.match(/^([^\p{L}\p{N}]*)(.*)$/u) || [];
    const body = section.lines.filter((line) => !GOAL.test(line)).map(withoutAnswer).join('\n');
    const goal = section.kind === 'how' ? 'The procedure, start to finish' : section.goal;
    const slug = stationSlug(section.heading);
    const anchor = id && `${id}-${slug}`;
    const prints = id && section.kind === 'station' && section.items
      ? `<p class="ev-print ev-station-print"><a href="sheet/?id=${id}&amp;station=${slug}"><span aria-hidden="true">🖨️</span> This station's sheet</a>`
        + `<a href="sheet/?id=${id}&amp;station=${slug}&amp;checker=1"><span aria-hidden="true">✅</span> Answer key</a></p>`
      : '';
    return `<details class="activity-card ev-card"${anchor ? ` id="${anchor}"` : ''}>
        <summary>
          <span class="activity-emoji" aria-hidden="true">${escapeHtml(emoji.trim() || '•')}</span>
          <span class="card-copy"><strong>${inline(title.trim(), options)}</strong>${goal ? `<small>${inline(goal, options)}</small>` : ''}</span>
          <span class="chip ev-status">${escapeHtml(cardStatus(section))}</span>
          <span class="arrow" aria-hidden="true">⌄</span>
        </summary>
        <div class="card-details instructions">${prints}${renderMarkdown(body, options)}</div>
      </details>`;
  }).join('');
  return `${renderMarkdown(parsed.intro, options)}<div class="activity-grid ev-grid">${cards}</div>`;
}

// ---------- the sheet ----------

const rule = '<span class="rule"></span>';
const writable = (text) => inline(text).replace(BLANK, '<span class="blank"></span>');
const field = (label) => `<span>${inline(label)} ${rule}</span>`;

// A station's lines, in order. A ### heading starts a part (Audio, Video…) with its own list; a part
// with nothing to tick yet prints as "Not written yet" so the paper shows what's coming.
function renderStation(section, { checker = false, signed = false } = {}) {
  const parts = [];
  let list = null;
  let partItems = null;
  const open = (kind) => {
    if (list === kind) return;
    if (list) parts.push(list === 'lines' ? '</ol>' : '</ul>');
    list = kind;
    if (kind) parts.push(kind === 'lines' ? '<ol class="ev-lines">' : '<ul class="ticks">');
  };
  const closePart = () => {
    open(null);
    if (partItems === 0) parts.push('<p class="ev-prompt ev-pending">Not written yet.</p>');
  };
  const tickHtml = (text) => {
    const answer = text.match(ANSWER);
    return writable(withoutAnswer(text)) + (checker && answer && answer[1] ? ` <span class="ev-answer">${inline(answer[1])}</span>` : '');
  };
  section.lines.forEach((raw) => {
    const line = raw.trim();
    if (!line || GOAL.test(line) || SOURCE.test(line) || line.startsWith('>')) return;
    const part = line.match(/^###\s+(.+)$/);
    const tick = line.match(/^-\s+\[[ xX]\]\s+(.+)$/);
    const numbered = line.match(/^(\d+)\.\s+(.+)$/);
    if (part) { closePart(); partItems = 0; parts.push(`<h3 class="ev-part">${inline(part[1])}</h3>`); return; }
    if (tick || numbered) partItems = partItems === null ? null : partItems + 1;
    if (tick) { open('ticks'); parts.push(`<li>${tickHtml(tick[1])}</li>`); return; }
    if (numbered) {
      open('lines');
      const text = withoutAnswer(numbered[2]).replace(/\s*_{3,}\s*$/, '');
      parts.push(`<li><b>${numbered[1]}.</b>${ONLY_BLANK.test(numbered[2]) ? '' : ` ${writable(text)}`}${rule}</li>`);
      return;
    }
    open(null);
    if (ONLY_BLANK.test(line)) parts.push(`<p class="ev-rule">${rule}</p>`);
    else parts.push(`<p class="ev-prompt">${writable(withoutAnswer(line).replace(/^-\s+/, ''))}</p>`);
  });
  closePart();
  const empty = !section.items;
  return `<section class="ws-block ev-station">
      <h2>${inline(section.heading)}${section.goal ? `<small>${inline(section.goal)}</small>` : ''}</h2>
      <p class="name-line">${field('Date')}${field('Total time to complete')}</p>
      ${empty ? '<p class="ev-prompt ev-pending">Not written yet.</p>' : parts.join('')}
      <p class="name-line ev-notes">${field('Additional notes')}${signed ? field('Checked by') : ''}</p>
    </section>`;
}

// options.station prints one station (its slug); options.checker adds what to look for.
export function renderEvalSheet(markdown, id, { station = '', checker = false } = {}) {
  const { front, sections } = parseEval(markdown);
  const stations = sections.filter((section) => section.kind === 'station'
    && (!station || stationSlug(section.heading) === station));
  const signed = String(front.checkedBy) === 'true';
  const title = `MUS 248 ${front.title || id}`;
  const draft = front.status === 'draft';
  const about = sections.find((section) => section.kind === 'about');
  const fields = about
    ? about.lines.map((line) => line.trim().match(/^-\s+(.+?)\s*_{3,}\s*$/)).filter(Boolean).map((match) => field(match[1])).join('')
    : field('Name');
  const meta = [front.revised && `🕓 Rev. ${front.revised}`, 'Performance eval'].filter(Boolean).join(' · ');
  return `
    <header class="ws-head">
      <div class="ws-headrow">
        <div class="ws-title"><span class="ws-emoji" aria-hidden="true">${escapeHtml(front.emoji || '🏅')}</span>
          <div><h1>${escapeHtml(title)} <span class="${checker ? 'key-tag' : 'ws-tag'}">${checker ? 'Answer key' : draft ? 'Draft' : 'Eval sheet'}</span></h1>
          <p class="ws-meta">${escapeHtml(meta)}</p></div>
        </div>
        ${renderQr(`performance-evals/#${id}${station ? `-${station}` : ''}`, title, 'Scan for how it works')}
      </div>
      ${checker ? '<p class="key-banner">Answer key: what to look for is printed after each item. Practice with it, and the checker uses it; the real test uses the sheet without answers.</p>' : ''}
      ${draft && !checker ? '<p class="key-banner">Draft: still being written. Not the sheet you\'ll get.</p>' : ''}
      <p class="name-line ev-about">${fields}</p>
    </header>
    ${stations.map((section) => renderStation(section, { checker, signed })).join('')}
    <footer class="ws-foot">Generated from <code>content/performance-evals/${escapeHtml(id)}.md</code>. Edit that, not this page.</footer>
  `;
}

// ---------- mounting ----------

const fetchEval = (base, id) => fetch(`${base}content/performance-evals/${id}.md`).then((response) => {
  if (!response.ok) throw new Error(`No eval ${id}`);
  return response.text();
});

async function mountPage(root) {
  const sources = await Promise.all(EVALS.map((id) => fetchEval('../', id)));
  root.innerHTML = EVALS.map((id, index) => {
    const { front } = parseEval(sources[index]);
    const draft = front.status === 'draft';
    return `<section class="ev-eval" id="${id}">
        <h2 class="section-title">${escapeHtml(front.emoji || '')} ${escapeHtml(front.title || id)}${draft ? ' <span class="ev-draft">Draft</span>' : ''}</h2>
        <p class="ev-print"><a href="sheet/?id=${id}"><span aria-hidden="true">🖨️</span> ${draft ? 'Preview' : 'Print'} the ${escapeHtml((front.title || id).toLowerCase())} sheet</a>
          ${front.revised ? `<span class="quiet">Rev. ${escapeHtml(front.revised)}</span>` : ''}</p>
        <div class="ev-intro">${renderEvalPage(sources[index], { id })}</div>
      </section>`;
  }).join('');
  // A link to one station (#final-data-transfer) opens that card.
  const target = window.location.hash && document.getElementById(window.location.hash.slice(1));
  if (target) {
    if (target.tagName === 'DETAILS') target.open = true;
    target.scrollIntoView();
  }
}

async function mountSheet(root) {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get('id');
  const id = EVALS.includes(requested) ? requested : 'midterm';
  const station = params.get('station') || '';
  const checker = params.get('checker') === '1';
  const markdown = await fetchEval('../../', id);
  const { front } = parseEval(markdown);
  const label = `${front.title || id} ${checker ? 'answer key' : 'sheet'}`;
  document.title = `${label} · MUS 248`;
  root.innerHTML = crumbs([['Performance Evals', `performance-evals/#${id}${station ? `-${station}` : ''}`], [label]])
    + renderEvalSheet(markdown, id, { station, checker })
    + '<p class="no-print print-cue"><button type="button" class="print-button">Print this sheet</button></p>';
  root.querySelector('.print-button').addEventListener('click', () => window.print());
}

if (typeof document !== 'undefined') {
  const page = document.getElementById('evals');
  const sheet = document.getElementById('eval-sheet');
  if (page) mountPage(page).catch(() => { page.innerHTML = '<p class="quiet">The evals could not be loaded.</p>'; });
  if (sheet) mountSheet(sheet).catch(() => { sheet.innerHTML = '<p class="error">This sheet could not be generated.</p>'; });
}
