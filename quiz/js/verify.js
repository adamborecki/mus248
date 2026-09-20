import { decodeStateCode, findStateCodes } from './state-code.js';
import { indexQuestions, parseResult } from './engine.js';
import { escapeHtml } from './html.js';

const byId = (id) => document.getElementById(id);
const REASONS = {
  missing: 'No quiz code found',
  incomplete: 'Code is cut off',
  checksum: 'Checksum failed: edited or damaged',
  format: 'Code could not be read',
  newer: 'Made by a newer app version',
};
const percent = ([right, asked]) => (asked ? `${right}/${asked} (${Math.round((right / asked) * 100)}%)` : '—');

async function loadJson(path) {
  const response = await fetch(path, { cache: 'no-cache' });
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}

async function main() {
  const [curriculum, bank] = await Promise.all([loadJson('../data/curriculum.json'), loadJson('../data/questions.json')]);
  const questions = indexQuestions(bank);
  const activityLabels = Object.fromEntries(curriculum.activities.map(({ id, label }) => [id, label]));
  const label = (skill) => bank.skills?.[skill] || skill;

  function check(sources) {
    const rows = sources.flatMap(({ name, text }) => {
      const codes = [...new Set(findStateCodes(text))];
      return codes.length ? codes.map((code) => ({ name, ...decodeStateCode(code) })) : [{ name, ok: false, reason: 'missing' }];
    });
    const valid = rows.filter((row) => row.ok);
    const codesById = {};
    valid.forEach(({ state, code }) => { (codesById[`${state.q}:${state.id}`] ||= new Set()).add(code); });

    const tableRows = rows.map((row) => {
      if (!row.ok) return `<tr class="bad"><td>${escapeHtml(row.name)}</td><td colspan="9">✗ ${REASONS[row.reason]}</td></tr>`;
      const { state } = row;
      const [coreCorrect, coreTotal, practiceDone, practiceTotal, points, max] = state.sc;
      const shared = codesById[`${state.q}:${state.id}`].size > 1;
      const activities = Object.entries(state.act || {}).map(([id, count]) => `${activityLabels[id] || id} ×${count >= 3 ? '3+' : count}`).join(', ');
      return `<tr${shared ? ' class="flag"' : ''}>
        <td>${escapeHtml(row.name)}</td><td>${state.q}</td><td>${escapeHtml(new Date(state.t).toLocaleString())}</td><td>${Number(state.n) || 1}</td>
        <td>${coreCorrect}/${coreTotal}</td><td>${practiceDone}/${practiceTotal}</td><td><strong>${points}/${max}</strong></td>
        <td class="wrap">${escapeHtml(activities || '—')}</td><td>${escapeHtml(state.id)}${shared ? ' ⚠︎ same ID, different code' : ''}</td><td>✓</td>
      </tr>`;
    }).join('');

    const tallies = {};
    [...new Map(valid.map((row) => [row.code, row.state])).values()].forEach((state) => {
      Object.entries(state.a || {}).forEach(([id, result]) => {
        const skill = questions[id]?.skill;
        if (!skill) return;
        const parsed = parseResult(result);
        // Bonus items are ungraded and optional, so they'd skew a miss rate the
        // class review list is meant to read as "how did everyone do".
        if (parsed.isBonus) return;
        const tally = (tallies[skill] ||= { c: [0, 0], p: [0, 0] });
        tally[parsed.roleKey][1] += 1;
        if (parsed.correct) tally[parsed.roleKey][0] += 1;
      });
    });
    const rate = ([right, asked]) => (asked ? right / asked : 2);
    const skillRows = Object.entries(tallies)
      .sort(([, a], [, b]) => rate(a.c) - rate(b.c) || rate(a.p) - rate(b.p))
      .map(([skill, tally]) => `<tr><td>${escapeHtml(label(skill))}</td><td>${percent(tally.c)}</td><td>${percent(tally.p)}</td></tr>`)
      .join('');

    byId('summary').textContent = `${valid.length} valid, ${rows.length - valid.length} with problems.`;
    byId('results').innerHTML = `
      <div class="table-wrap"><table>
        <thead><tr><th>Source</th><th>Quiz</th><th>Completed</th><th>Attempt</th><th>Core</th><th>Practice</th><th>Score</th><th>Activities</th><th>ID</th><th>Check</th></tr></thead>
        <tbody>${tableRows}</tbody>
      </table></div>
      ${skillRows ? `<h2>By skill</h2><p class="quiet">Correct answers across these submissions, weakest Core skills first.</p>
      <div class="table-wrap"><table>
        <thead><tr><th>Skill</th><th>Core</th><th>Practice</th></tr></thead>
        <tbody>${skillRows}</tbody>
      </table></div>` : ''}`;
  }

  byId('check').addEventListener('click', () => check([{ name: '', text: byId('codes').value }]));
  byId('files').addEventListener('change', async (event) => {
    const sources = await Promise.all([...event.target.files].map(async (file) => ({
      name: file.name,
      text: (await file.text()).replace(/<[^>]*>/g, ''),
    })));
    check(sources);
  });
}

main().catch((error) => {
  console.error(error);
  byId('summary').textContent = 'This page couldn’t load the quiz data. Refresh and try again.';
});
