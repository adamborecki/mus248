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
        <td>${coreCorrect}/${state.rc ?? coreTotal}${state.rc != null && state.rc < coreTotal ? ` of ${coreTotal}` : ''}</td>
        <td>${state.bn ? `${state.bn[1]}/${state.bn[0]}${state.xc ? ` +${state.xc}` : ''}` : (practiceTotal ? `${practiceDone}/${practiceTotal}` : '—')}</td>
        <td><strong>${points}/${max}</strong></td>
        <td class="wrap">${escapeHtml(activities || '—')}</td><td>${escapeHtml(state.id)}${shared ? ' ⚠︎ same ID, different code' : ''}</td><td>✓</td>
      </tr>`;
    }).join('');

    const tallies = {};
    [...new Map(valid.map((row) => [row.code, row.state])).values()].forEach((state) => {
      Object.entries(state.a || {}).forEach(([id, result]) => {
        const skill = questions[id]?.skill;
        if (!skill) return;
        const parsed = parseResult(result);
        // Graded and bonus are counted separately. A bonus miss rate is real data
        // worth seeing, but it must not be mixed into "how did the class do on the
        // material we actually hold them to" — different students see different
        // numbers of bonus questions.
        const tally = (tallies[skill] ||= { c: [0, 0], b: [0, 0] });
        const bucket = parsed.isBonus ? 'b' : 'c';
        tally[bucket][1] += 1;
        if (parsed.correct) tally[bucket][0] += 1;
      });
    });
    const rate = ([right, asked]) => (asked ? right / asked : 2);
    const skillRows = Object.entries(tallies)
      .sort(([, a], [, b]) => rate(a.c) - rate(b.c) || rate(a.b) - rate(b.b))
      .map(([skill, tally]) => `<tr><td>${escapeHtml(label(skill))}</td><td>${percent(tally.c)}</td><td>${percent(tally.b)}</td></tr>`)
      .join('');

    byId('summary').textContent = `${valid.length} valid, ${rows.length - valid.length} with problems.`;
    byId('results').innerHTML = `
      <div class="table-wrap"><table>
        <thead><tr><th>Source</th><th>Quiz</th><th>Completed</th><th>Attempt</th><th>Graded</th><th>Bonus</th><th>Score</th><th>Activities</th><th>ID</th><th>Check</th></tr></thead>
        <tbody>${tableRows}</tbody>
      </table></div>
      ${skillRows ? `<h2>By skill</h2><p class="quiet">Correct answers across these submissions, weakest graded skills first. Bonus is counted separately because students see different numbers of them.</p>
      <div class="table-wrap"><table>
        <thead><tr><th>Skill</th><th>Graded</th><th>Bonus</th></tr></thead>
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
