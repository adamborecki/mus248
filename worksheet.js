// Generates a printable worksheet from an activity's own Markdown.
//
// The activity page is the textbook: every instruction, table, and troubleshooting
// tree. The worksheet is the workbook: the checkpoints to tick, the terms to
// define, and the questions to answer, on one page a student can hold at a mic
// stand. Both come out of the same file, so the paper can never drift from the
// page — which is what turned the last hand-maintained version into paperwork.
//
// Deliberately NOT carried over: the step-by-step procedure, photos, and
// troubleshooting. Those stay on the phone. Nobody should copy screen to paper.

import { ANSWER_LINE, FRONTMATTER, OPTION, escapeHtml, inline, joinWrappedLines } from './markdown.js';
import qrcode from './qrcode-generator.js';

// Printed worksheets leave the site — the QR has to carry an absolute URL, not a relative one.
const SITE_ORIGIN = 'https://adamborecki.github.io/248';

const BLANK = /_{3,}/g;
const QUESTION = /^\*\*Q(\d+)\s*(?:\(([^)]*)\))?\s*[.:]\*\*\s*(.*)$/;
const CHECKPOINT = /^\s*(?:[-*]\s+)?(?:>\s*)?🚩\s*(.*)$/;
const CHECKPOINT_LABEL = /^\*\*((?:final\s+|last\s+)?checkpoint[^*]*?)\s*\*\*\s*/i;

// Headings carry a leading emoji ("## ✅ Definition of done"); match on the words.
const slug = (heading) => heading.replace(/^[^\p{L}\p{N}]+/u, '').trim().toLowerCase();

const unquote = (value) => value.trim()
  .replace(/\s+#\s.*$/, '')
  .replace(/^"(.*)"$/, '$1')
  .replace(/^'(.*)'$/, '$1')
  .trim();

export function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const data = {};
  let key = null;
  match[1].split('\n').forEach((line) => {
    if (!line.trim()) return;
    const top = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (top) {
      key = top[1];
      data[key] = top[2].trim() ? unquote(top[2]) : null;
      return;
    }
    if (!key) return;
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item) {
      if (!Array.isArray(data[key])) data[key] = [];
      data[key].push(unquote(item[1]));
      return;
    }
    const nested = line.match(/^\s+([A-Za-z][\w-]*):\s*(.*)$/);
    if (nested) {
      if (data[key] === null || typeof data[key] !== 'object' || Array.isArray(data[key])) data[key] = {};
      data[key][nested[1]] = unquote(nested[2]);
    }
  });
  return data;
}

// Checkpoints come in two shapes — "🚩 **Checkpoint.** You should now see…" and a
// blockquoted "> 🚩 You will set the house default twice…". Drop the label, keep
// the sentence; when the label is all there is, the label becomes the sentence.
function checkpointText(raw) {
  const label = raw.match(CHECKPOINT_LABEL);
  if (!label) return raw.trim();
  const rest = raw.replace(CHECKPOINT_LABEL, '').trim();
  return rest || `${label[1].replace(/[.:]$/, '')}.`;
}

function parseQuestion(lines, index, section, order) {
  const match = lines[index].match(QUESTION);
  if (!match) return null;
  const question = {
    number: Number(match[1]),
    type: (match[2] || '').trim().toLowerCase(),
    prompt: match[3].trim(),
    options: [],
    answer: null,
    note: null,
    section,
    order,
  };
  // A prompt may wrap; its options and its ✅ answer follow, separated by at most
  // a blank line. Anything else — a heading, a checkpoint, the next paragraph or
  // the next question — ends the block.
  let mode = 'prompt';
  for (let scan = index + 1; scan < lines.length; scan += 1) {
    const line = lines[scan].trim();
    if (!line) {
      if (mode === 'answer') break;
      if (mode === 'prompt') mode = 'gap';
      else if (mode === 'options') mode = 'gap-after-options';
      continue;
    }
    if (/^(#{1,6}\s|>|\||🚩|🔄|\d+\.\s)/.test(line) || QUESTION.test(line)) break;
    const answer = line.match(ANSWER_LINE);
    if (answer) { question.note = answer[1].trim(); mode = 'answer'; continue; }
    const option = line.match(OPTION);
    if (option) {
      question.options.push({ letter: option[2].toLowerCase(), text: option[3].trim(), correct: Boolean(option[1]) });
      mode = 'options';
      continue;
    }
    if (mode === 'prompt') { question.prompt = `${question.prompt} ${line}`.trim(); continue; }
    if (mode === 'answer') { question.note = `${question.note} ${line}`.trim(); continue; }
    break;
  }
  if (!question.type) question.type = question.options.length ? 'multiple choice' : 'short answer';
  const marked = question.options.find((option) => option.correct);
  question.answer = question.note || (marked ? `${marked.letter}) ${marked.text}` : null);
  question.blanks = (question.prompt.match(BLANK) || []).length;
  return question;
}

// Groups whose worksheet content lives under one heading rather than scattered
// through the activity — they enter the flow once, at that heading's position.
const GROUPS = { 'key terms': 'keyTerms', 'definition of done': 'done', 'before you leave': 'beforeYouLeave' };

export function parseActivity(markdown) {
  const frontmatter = parseFrontmatter(markdown);
  const lines = joinWrappedLines(markdown.replace(FRONTMATTER, '')).split('\n');
  const result = {
    frontmatter, done: [], keyTerms: [], alsoKnow: [], beforeYouLeave: [], checkpoints: [], questions: [], flow: [],
  };
  let section = '';
  let label = '';

  lines.forEach((line, index) => {
    const heading = line.match(/^(#{2,4})\s+(.+)$/);
    if (heading) {
      label = heading[2].replace(/^[^\p{L}\p{N}]+/u, '').trim();
      if (heading[1].length === 2) {
        section = slug(heading[2]);
        if (GROUPS[section]) result.flow.push({ type: 'group', key: GROUPS[section], order: index });
      }
      return;
    }

    const question = parseQuestion(lines, index, label, index);
    if (question) {
      result.questions.push(question);
      result.flow.push({ type: 'question', question, order: index });
      return;
    }

    const bullet = line.match(/^\s*[-*]\s+(.+)$/);
    const isOption = bullet && OPTION.test(line.trim());

    if (section === 'definition of done') {
      // These are already 🚩-marked in the source; they are the done list, not a
      // second copy of the in-activity checkpoints.
      if (bullet && !isOption && !ANSWER_LINE.test(line.trim())) {
        result.done.push(bullet[1].replace(/^🚩\s*/, '').replace(/^\[[ xX]\]\s*/, '').trim());
      }
      return;
    }

    if (section === 'key terms') {
      if (!line.trim() || bullet) return;
      line.split('·').map((term) => term.trim()).filter(Boolean).forEach((term) => {
        const primary = term.match(/^\*\*(.+)\*\*$/);
        if (primary) result.keyTerms.push(primary[1].trim());
        else result.alsoKnow.push(term.replace(/\*\*/g, '').trim());
      });
      return;
    }

    if (section === 'before you leave' && bullet && !isOption) {
      result.beforeYouLeave.push(bullet[1].trim());
      return;
    }

    const checkpoint = line.match(CHECKPOINT);
    if (checkpoint) {
      const entry = { text: checkpointText(checkpoint[1]), section: label, order: index };
      result.checkpoints.push(entry);
      result.flow.push({ type: 'checkpoint', checkpoint: entry, order: index });
    }
  });

  result.flow.sort((a, b) => a.order - b.order);
  return result;
}

// ---------- rendering ----------

const writable = (text) => inline(text).replace(BLANK, '<span class="blank"></span>');
const rule = (count = 1) => '<span class="rule"></span>'.repeat(count);

// Links a printed worksheet back to its activity page — the phone has the procedure, photos, and
// troubleshooting the paper deliberately leaves out.
function renderQr(route, title) {
  if (!route) return '';
  const url = `${SITE_ORIGIN}/${route}/`;
  const qr = qrcode(0, 'M');
  qr.addData(url);
  qr.make();
  const svg = qr.createSvgTag({
    cellSize: 4,
    margin: 4,
    scalable: true,
    alt: `QR code linking to the ${title} activity page`,
    title: `${title} — ${url}`,
  });
  // Break opportunities after each slash, so a long URL wraps at path boundaries instead of
  // wherever the browser's default line-breaking happens to land mid-word.
  const displayUrl = escapeHtml(url.replace(/^https?:\/\//, '')).replace(/\//g, '/<wbr>');
  return `<div class="ws-qr"><span class="ws-qr-cue">Scan for full instructions</span>${svg}<span class="ws-qr-url">${displayUrl}</span></div>`;
}

function renderQuestion(question, showAnswers) {
  const number = `<span class="q-number">Q${question.number}</span>`;
  const prompt = `<p class="q-prompt">${number}${writable(question.prompt)}</p>`;
  let body = '';

  if (question.options.length) {
    body = `<ol class="options">${question.options.map((option) => {
      const correct = showAnswers && option.correct ? ' correct' : '';
      return `<li class="option${correct}"><span class="letter" aria-hidden="true">${escapeHtml(option.letter)}</span><span>${inline(option.text)}</span></li>`;
    }).join('')}</ol>`;
  } else if (!question.blanks) {
    body = `<p class="answer-lines">${rule(2)}</p>`;
  }

  const spelledOut = question.note || (question.options.length ? '' : question.answer);
  const unanswered = '<span class="unmarked">no answer marked in the source</span>';
  const key = showAnswers && (spelledOut || !question.answer)
    ? `<p class="key-answer"><span aria-hidden="true">✅</span> ${spelledOut ? inline(spelledOut) : unanswered}</p>`
    : '';
  return `${prompt}${body}${key}`;
}

export function renderWorksheet(activity, options = {}) {
  const { showAnswers = false, directory = {} } = options;
  const front = activity.frontmatter || {};
  const title = front.title || directory.title || 'Activity';
  const emoji = front.emoji || directory.emoji || '📄';
  const sizes = front.groupSize || {};
  const range = sizes.minimum && sizes.maximum && String(sizes.minimum) !== String(sizes.maximum)
    ? `${sizes.minimum}–${sizes.maximum}`
    : sizes.ideal;
  const group = range || directory.group || '';
  const time = front.estimatedTime || directory.time || '';
  const revised = front.revised || '';

  // The revision date is what tells a printed copy apart from a newer one once the activity
  // changes — it comes first so it survives even if the rest of the meta line has to wrap away.
  const meta = [revised && `🕓 Rev. ${revised}`, time && `⏱ ${time}`, group && `👥 Groups of ${group}`]
    .filter(Boolean).join(' · ');
  // Rounds only get their own box on activities that actually repeat.
  const rounds = String(front.roundsSupported) === 'true' ? `<span>Round ${rule()}</span>` : '';
  const nameLine = showAnswers
    ? '<p class="key-banner">Answer key — instructor copy. Do not hand out.</p>'
    : `<p class="name-line"><span>Name ${rule()}</span><span>Date ${rule()}</span>${rounds}</p>`;

  const block = (heading, hint, inner) => (inner
    ? `<section class="ws-block"><h2>${escapeHtml(heading)}${hint ? `<small>${escapeHtml(hint)}</small>` : ''}</h2>${inner}</section>`
    : '');

  const renderGroup = (key) => {
    if (key === 'done') {
      return block('Definition of done', 'tick each one before you pack up',
        activity.done.length ? `<ul class="ticks">${activity.done.map((item) => `<li>${inline(item)}</li>`).join('')}</ul>` : '');
    }
    if (key === 'keyTerms') {
      return block('Key terms', 'write what each one means',
        activity.keyTerms.length
          ? `<ul class="terms">${activity.keyTerms.map((term) => `<li><b>${inline(term)}</b>${rule()}</li>`).join('')}</ul>${
            activity.alsoKnow.length ? `<p class="also">Also know: ${activity.alsoKnow.map((term) => inline(term)).join(' · ')}</p>` : ''}`
          : '');
    }
    return block('Before you leave', '',
      activity.beforeYouLeave.length
        ? `<ul class="prompts">${activity.beforeYouLeave.map((item) => `<li>${inline(item)}${rule(2)}</li>`).join('')}</ul>`
        : '');
  };

  // Checkpoints and questions interleave in the order they occur in the source,
  // so the worksheet follows the same path as the real instructions instead of
  // pulling them into two lists disconnected from where they happen. A run
  // breaks — and a fresh "As you go" block opens — whenever a Key terms,
  // Definition of done, or Before you leave block falls between them.
  let flowOpen = false;
  let previousWhere = null;
  const parts = [];
  const closeFlow = () => {
    if (flowOpen) parts.push('</ul></section>');
    flowOpen = false;
    previousWhere = null;
  };

  (activity.flow || []).forEach((entry) => {
    if (entry.type === 'group') {
      closeFlow();
      const rendered = renderGroup(entry.key);
      if (rendered) parts.push(rendered);
      return;
    }
    const item = entry.type === 'checkpoint' ? entry.checkpoint : entry.question;
    if (!flowOpen) {
      parts.push('<section class="ws-block ws-flow-block"><h2>As you go'
        + `${showAnswers ? '' : '<small>tick checkpoints, answer questions</small>'}</h2><ul class="flow">`);
      flowOpen = true;
    }
    const tag = item.section && item.section !== previousWhere ? `<em class="where">${escapeHtml(item.section)}</em>` : '';
    previousWhere = item.section;
    if (entry.type === 'checkpoint') {
      parts.push(`<li class="tick">${tag}${inline(item.text)}</li>`);
    } else {
      parts.push(`<li class="question">${tag}${renderQuestion(item, showAnswers)}</li>`);
    }
  });
  closeFlow();

  const route = directory.route || front.id || directory.id || '';

  return `
    <header class="ws-head">
      <div class="ws-headrow">
        <div class="ws-title"><span class="ws-emoji" aria-hidden="true">${escapeHtml(emoji)}</span>
          <div><h1>${escapeHtml(title)} <span class="${showAnswers ? 'key-tag' : 'ws-tag'}">${showAnswers ? 'Answer key' : 'Worksheet'}</span></h1>
          <p class="ws-meta">MUS 248${meta ? ` · ${meta}` : ''}</p></div>
        </div>
        ${renderQr(route, title)}
      </div>
      ${nameLine}
    </header>
    ${parts.join('')}
    <footer class="ws-foot">Generated from <code>content/activities/${escapeHtml(front.id || directory.id || '')}.md</code> — edit the activity, not this page.</footer>
  `;
}

// ---------- page ----------

async function mount(root) {
  const id = document.body.dataset.activityId;
  const base = document.body.dataset.base || '../../';
  const showAnswers = document.body.dataset.worksheetKey === 'true';
  const [directory, markdown] = await Promise.all([
    fetch(`${base}data/activities.json`).then((response) => response.json()),
    fetch(`${base}content/activities/${id}.md`).then((response) => {
      if (!response.ok) throw new Error(`No Markdown for ${id}`);
      return response.text();
    }),
  ]);
  const entry = directory.find((item) => item.id === id) || {};
  const activity = parseActivity(markdown);
  const title = (activity.frontmatter && activity.frontmatter.title) || entry.title || id;
  document.title = `${title} worksheet${showAnswers ? ' — answer key' : ''} · MUS 248`;
  root.innerHTML = `<a class="back no-print" href="${base}${entry.route || id}/">← ${escapeHtml(title)}</a>`
    + renderWorksheet(activity, { showAnswers, directory: entry })
    + '<p class="no-print print-cue"><button type="button" class="print-button">Print this worksheet</button></p>';
  const button = root.querySelector('.print-button');
  if (button) button.addEventListener('click', () => window.print());
}

if (typeof document !== 'undefined') {
  const root = document.getElementById('worksheet');
  if (root) {
    mount(root).catch(() => {
      root.innerHTML = '<p class="error">This worksheet could not be generated. The activity may not have been migrated to Markdown yet.</p>';
    });
  }
}
