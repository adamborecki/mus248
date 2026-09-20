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

function parseQuestion(lines, index, section) {
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

export function parseActivity(markdown) {
  const frontmatter = parseFrontmatter(markdown);
  const lines = joinWrappedLines(markdown.replace(FRONTMATTER, '')).split('\n');
  const result = {
    frontmatter, done: [], keyTerms: [], alsoKnow: [], beforeYouLeave: [], checkpoints: [], questions: [],
  };
  let section = '';
  let label = '';

  lines.forEach((line, index) => {
    const heading = line.match(/^(#{2,4})\s+(.+)$/);
    if (heading) {
      label = heading[2].replace(/^[^\p{L}\p{N}]+/u, '').trim();
      if (heading[1].length === 2) section = slug(heading[2]);
      return;
    }

    const question = parseQuestion(lines, index, label);
    if (question) { result.questions.push(question); return; }

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
    if (checkpoint) result.checkpoints.push({ text: checkpointText(checkpoint[1]), section: label });
  });

  return result;
}

// ---------- rendering ----------

const writable = (text) => inline(text).replace(BLANK, '<span class="blank"></span>');
const rule = (count = 1) => '<span class="rule"></span>'.repeat(count);

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
  return `<li class="question">${prompt}${body}${key}</li>`;
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

  const meta = [time && `⏱ ${time}`, group && `👥 Groups of ${group}`].filter(Boolean).join(' · ');
  // Rounds only get their own box on activities that actually repeat.
  const rounds = String(front.roundsSupported) === 'true' ? `<span>Round ${rule()}</span>` : '';
  const nameLine = showAnswers
    ? '<p class="key-banner">Answer key — instructor copy. Do not hand out.</p>'
    : `<p class="name-line"><span>Name ${rule()}</span><span>Date ${rule()}</span>${rounds}</p>`;

  const block = (heading, hint, inner) => (inner
    ? `<section class="ws-block"><h2>${escapeHtml(heading)}${hint ? `<small>${escapeHtml(hint)}</small>` : ''}</h2>${inner}</section>`
    : '');

  const done = block('Definition of done', 'tick each one before you pack up',
    activity.done.length ? `<ul class="ticks">${activity.done.map((item) => `<li>${inline(item)}</li>`).join('')}</ul>` : '');

  const terms = block('Key terms', 'write what each one means',
    activity.keyTerms.length
      ? `<ul class="terms">${activity.keyTerms.map((term) => `<li><b>${inline(term)}</b>${rule()}</li>`).join('')}</ul>${
        activity.alsoKnow.length ? `<p class="also">Also know: ${activity.alsoKnow.map((term) => inline(term)).join(' · ')}</p>` : ''}`
      : '');

  let previous = null;
  const checkpoints = block('Checkpoints', 'tick as you hit them',
    activity.checkpoints.length
      ? `<ul class="ticks">${activity.checkpoints.map(({ text, section }) => {
        const tag = section && section !== previous ? `<em class="where">${escapeHtml(section)}</em>` : '';
        previous = section;
        return `<li>${tag}${inline(text)}</li>`;
      }).join('')}</ul>`
      : '');

  const questions = block('Questions', showAnswers ? '' : 'circle or fill in',
    activity.questions.length
      ? `<ol class="questions">${activity.questions.map((question) => renderQuestion(question, showAnswers)).join('')}</ol>`
      : '');

  const leave = block('Before you leave', '',
    activity.beforeYouLeave.length
      ? `<ul class="prompts">${activity.beforeYouLeave.map((item) => `<li>${inline(item)}${rule(2)}</li>`).join('')}</ul>`
      : '');

  return `
    <header class="ws-head">
      <div class="ws-title"><span class="ws-emoji" aria-hidden="true">${escapeHtml(emoji)}</span>
        <div><h1>${escapeHtml(title)}${showAnswers ? ' <span class="key-tag">Answer key</span>' : ''}</h1>
        <p class="ws-meta">MUS 248${meta ? ` · ${meta}` : ''}</p></div>
      </div>
      ${nameLine}
    </header>
    ${done}${terms}${checkpoints}${questions}${leave}
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
