// Moves edits between the quiz content-editor artifact and the repo.
//
//   node tools/editor-sync.mjs apply <export-dir> --baseline <editor.html|baseline.json> [--write] [--hold ID.field,...]
//   node tools/editor-sync.mjs baseline > baseline.json
//
// The editor saves to its own database, not to git. <export-dir> is that database exported by
// Claude (ArtifactData `list` with out_dir): <dir>/questions/*.json and <dir>/skills/*.json.
// `apply` is a dry run unless --write is given. It merges field by field into
// quiz/data/questions.json and quiz/data/curriculum.json, never replacing a whole file, because
// the repo may have moved on since the editor was last published.
//
// A stored question holds every field, edited or not, so an old one would silently revert
// something changed in the repo since. --baseline is what the editor started from (its published
// HTML, read back with the Artifact tool, or the output of `baseline`): a field is applied only
// if the editor changed it, and if the repo changed it too the field is reported as a CONFLICT
// and left alone. Without --baseline every differing field is applied, so use it only when
// nothing else has touched these files.
//
// Never applied: `note` (an instruction to Claude, and this repo is public), deleted questions,
// and questions whose id is not in the repo yet. Those are listed so a person decides.
// `baseline` prints the editor's starting data from the repo; put it in the page's BASELINE
// when republishing, and the page's "not in the repo yet" count starts from zero.

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const path = (...p) => join(root, 'quiz', 'data', ...p);
const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));

const [command, ...args] = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name) => (args.indexOf(name) >= 0 ? args[args.indexOf(name) + 1] : undefined);
const hold = new Set((option('--hold') ?? '').split(',').filter(Boolean));
const baselinePath = option('--baseline');
const baseline = baselinePath && (() => {
  const text = readFileSync(baselinePath, 'utf8');
  return JSON.parse(baselinePath.endsWith('.html') ? text.match(/const BASELINE = (\{.*\});\n/)[1] : text);
})();
const baseQuestions = new Map((baseline?.questions ?? []).map((q) => [q.id, q]));

const bank = readJson(path('questions.json'));
const deck = readJson(path('study-deck.json'));
const curriculumText = readFileSync(path('curriculum.json'), 'utf8');
const curriculum = JSON.parse(curriculumText);

if (command === 'baseline') {
  const skills = Object.fromEntries(Object.entries(curriculum.skills).map(([key, status]) => [
    key, { label: bank.skills[key] ?? key, status },
  ]));
  const questions = bank.questions.map((q) => ({
    id: q.id, skill: q.skill, level: q.level, gate: q.activity_gate ?? null, prompt: q.prompt,
    choices: [...q.choices], answer: q.answer_index, explanation: q.explanation,
    draft: Boolean(q.draft), verified: Boolean(q.verified),
  }));
  const cards = deck.cards.map((c) => ({ ...c, verified: Boolean(c.verified) }));
  process.stdout.write(JSON.stringify({
    skills, questions, cards, activities: curriculum.activities, categories: deck.categories,
  }));
} else if (command === 'apply') {
  const dir = args[0];
  if (!dir) throw new Error('usage: apply <export-dir> --baseline <file> [--write] [--hold ID.field,...]');
  if (!baseline) console.log('WARNING: no --baseline, so stale editor fields can overwrite newer repo changes.\n');
  const docs = (kind) => {
    try {
      return readdirSync(join(dir, kind)).filter((f) => f.endsWith('.json')).map((f) => {
        const raw = readJson(join(dir, kind, f));
        return [f.slice(0, -5), raw.data ?? raw];
      });
    } catch { return []; }
  };
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const byId = new Map(bank.questions.map((q) => [q.id, q]));
  const changes = [];
  const skipped = [];
  let newText = curriculumText;

  for (const [id, doc] of docs('questions')) {
    const q = byId.get(id);
    if (!q) { skipped.push(`${id}: not in the repo yet (new question) — needs a decision`); continue; }
    if (doc.deleted) { skipped.push(`${id}: deleted in the editor — not removed here`); continue; }
    const wanted = {
      prompt: doc.prompt, explanation: doc.explanation, choices: doc.choices, level: doc.level,
      skill: doc.skill, answer_index: doc.answer, activity_gate: doc.gate ?? null,
      verified: Boolean(doc.verified),
    };
    if (doc.draft || 'draft' in q) wanted.draft = Boolean(doc.draft);
    for (const [field, value] of Object.entries(wanted)) {
      const label = field === 'answer_index' ? 'answer' : field === 'activity_gate' ? 'gate' : field;
      const current = field === 'activity_gate' ? (q[field] ?? null) : field === 'draft' ? Boolean(q.draft) : q[field];
      if (value === undefined || same(current, value)) continue;
      const base = baseQuestions.get(id);
      if (base) {
        const started = label === 'gate' ? (base.gate ?? null) : base[label];
        if (same(started, value)) continue; // the editor never changed this field
        if (!same(started, current)) { skipped.push(`${id}.${label}: CONFLICT, the repo changed it since the editor was published`); continue; }
      }
      if (hold.has(`${id}.${label}`)) { skipped.push(`${id}.${label}: held back`); continue; }
      changes.push({ id, field: label, from: current, to: value });
      if (flag('--write')) q[field] = value;
    }
  }

  for (const [key, doc] of docs('skills')) {
    const now = curriculum.skills[key];
    if (now === undefined) { skipped.push(`skill ${key}: not in curriculum.json — needs a decision`); continue; }
    const started = baseline?.skills?.[key];
    if (started && doc.status === started.status && (doc.label ?? started.label) === started.label) continue;
    if (started && started.status !== now && doc.status !== now) { skipped.push(`skill ${key}: CONFLICT, the repo changed it since the editor was published`); continue; }
    if (doc.status !== now && !hold.has(`${key}.status`)) {
      changes.push({ id: key, field: 'status', from: now, to: doc.status });
      newText = newText.replace(`"${key}": "${now}"`, `"${key}": "${doc.status}"`);
    }
    if (doc.label !== undefined && doc.label !== (bank.skills[key] ?? key) && !hold.has(`${key}.label`)) {
      changes.push({ id: key, field: 'label', from: bank.skills[key], to: doc.label });
      if (flag('--write')) bank.skills[key] = doc.label;
    }
  }

  const show = (v) => (typeof v === 'string' ? JSON.stringify(v.length > 90 ? `${v.slice(0, 87)}...` : v) : JSON.stringify(v));
  changes.forEach((c) => console.log(`${c.id}.${c.field}: ${show(c.from)}  ->  ${show(c.to)}`));
  skipped.forEach((s) => console.log(`SKIPPED  ${s}`));
  console.log(`\n${changes.length} change${changes.length === 1 ? '' : 's'}, ${skipped.length} skipped.`);

  if (flag('--write')) {
    writeFileSync(path('questions.json'), `${JSON.stringify(bank, null, 2)}\n`);
    writeFileSync(path('curriculum.json'), newText);
    console.log('Wrote quiz/data/questions.json and quiz/data/curriculum.json.');
  } else {
    console.log('Dry run. Add --write to apply.');
  }
} else {
  console.error('usage: editor-sync.mjs apply <export-dir> --baseline <file> [--write] [--hold ID.field,...] | baseline');
  process.exit(1);
}
