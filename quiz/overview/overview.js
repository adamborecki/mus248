// Quiz overview, instructor view only: every access code at a glance, and what the quiz can and
// can't ask, from whole lectures down to single questions. It reads the same data files the quiz
// does and decides "graded or bonus" with the engine's own tierOf, so it can't drift from the quiz.
//
// It's a view, not a lock: the codes are in quiz/data/curriculum.json, which is public anyway.

import { instructorView } from '../../lectures/view.js';
import { isQuizOpen, servedQuiz, tierOf } from '../js/engine.js';

const app = document.getElementById('app');
const esc = (text) => String(text ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const load = (path) => fetch(path).then((response) => {
  if (!response.ok) throw new Error(`${path}: ${response.status}`);
  return response.json();
});

if (!instructorView()) {
  app.innerHTML = '<h2>Instructor view only</h2>';
} else {
  main().catch((error) => {
    app.innerHTML = `<p class="notice">The quiz data didn’t load (${esc(error.message)}). Check your connection and refresh.</p>`;
  });
}

async function main() {
  const [curriculum, bank, deck, sourceFile, lectures] = await Promise.all([
    load('../data/curriculum.json'), load('../data/questions.json'), load('../data/study-deck.json'),
    load('../data/skill-sources.json'), load('../../data/lectures.json'),
  ]);
  const sources = sourceFile.skills;
  const maxLevel = curriculum.max_common_level ?? 1;
  const activityLabel = Object.fromEntries(curriculum.activities.map(({ id, label }) => [id, label]));
  const lectureById = Object.fromEntries(lectures.map((lecture) => [lecture.id, lecture]));
  const label = (skill) => bank.skills[skill] || skill;
  const status = (skill) => curriculum.skills[skill] || 'inactive';

  // ---- one question: graded, bonus, or not served, and why ----
  function roleOf(q) {
    if (q.draft) return { role: 'off', why: 'Draft: not served' };
    const tier = tierOf(curriculum, q);
    if (tier === 'inactive') return { role: 'off', why: 'Skill is Off' };
    const gate = q.activity_gate ? activityLabel[q.activity_gate] || q.activity_gate : null;
    const times = Math.max(1, Math.min(q.level, 3));
    const needs = gate ? ` · needs ${gate}${times > 1 ? ` ${times === 3 ? '3+' : times}×` : ''}` : '';
    if (tier === 'core' && q.verified && (gate || q.level <= maxLevel)) {
      return { role: 'graded', why: gate ? `Can be graded${needs}` : 'Can be graded' };
    }
    const why = tier === 'practice' ? 'Practice skill' : !q.verified ? 'Not verified yet' : `Level ${q.level}: graded set stops at ${maxLevel}`;
    return { role: 'bonus', why: `Bonus · ${why}${needs}` };
  }
  const questions = bank.questions.map((q) => ({ ...q, ...roleOf(q) }));

  // ---- one skill ----
  const cardsBySkill = {};
  deck.cards.forEach((card) => { (cardsBySkill[card.skill] ||= []).push(card); });
  const skills = Object.keys(curriculum.skills).map((key) => {
    const qs = questions.filter((q) => q.skill === key);
    const graded = qs.filter((q) => q.role === 'graded');
    const st = status(key);
    const kind = st === 'inactive' ? 'off'
      : st === 'core' ? (graded.some((q) => !q.activity_gate) ? 'graded' : graded.length ? 'graded-activity' : 'core-empty')
        : 'bonus';
    return {
      key, label: label(key), status: st, kind, questions: qs, graded, cards: cardsBySkill[key] || [],
      verified: qs.filter((q) => q.verified && !q.draft).length, source: sources[key] || {},
    };
  });
  const KIND_TEXT = { graded: 'Graded', 'graded-activity': 'Graded if they did the activity', 'core-empty': 'Core, but nothing gradable', bonus: 'Bonus only', off: 'Off' };

  // ---- groups: lectures in date order, then activities ----
  const groups = [];
  lectures.filter((lecture) => skills.some((s) => s.source.lecture === lecture.id))
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))
    .forEach((lecture) => groups.push({
      id: `l-${lecture.id}`,
      title: lecture.title,
      eyebrow: `Lecture ${String(lecture.lecture ?? '').padStart(2, '0')} · ${formatDate(lecture.date)}`,
      skills: skills.filter((s) => s.source.lecture === lecture.id),
    }));
  curriculum.activities.filter(({ id }) => skills.some((s) => s.source.activity === id)).forEach(({ id, label: name }) => groups.push({
    id: `a-${id}`, title: name, eyebrow: 'Activity', skills: skills.filter((s) => s.source.activity === id),
  }));

  // ---- quizzes ----
  const quizzes = Object.entries(curriculum.quizzes).map(([number, quiz]) => ({ number: Number(number), ...quiz }))
    .sort((a, b) => b.number - a.number);
  const sourceOf = (skill) => {
    const src = sources[skill] || {};
    return src.lecture ? lectureById[src.lecture]?.title || src.lecture : activityLabel[src.activity] || src.activity || '';
  };

  const pool = {
    gradedSkills: skills.filter((s) => s.kind === 'graded').length,
    activitySkills: skills.filter((s) => s.kind === 'graded-activity').length,
    graded: questions.filter((q) => q.role === 'graded').length,
    bonus: questions.filter((q) => q.role === 'bonus').length,
    drafts: questions.filter((q) => q.draft).length,
    offSkill: questions.filter((q) => !q.draft && q.role === 'off').length,
    unconfirmed: skills.filter((s) => !s.source.confirmed).length,
  };
  const served = servedQuiz(curriculum);
  let selected = served;

  function quizCard(quiz) {
    const now = quiz.number === served;
    const future = !isQuizOpen(quiz);
    const badge = now ? '<span class="badge core">Served now</span>'
      : future ? `<span class="badge bonus">Opens ${esc(opensText(quiz.opens))}</span>`
        : '<span class="badge plain">Code still works · shows “makeup”</span>';
    const fresh = quiz.new_skills || [];
    const bySource = {};
    fresh.forEach((skill) => { (bySource[sourceOf(skill)] ||= []).push(skill); });
    const clock = quiz.expected_minutes ? `${quiz.expected_minutes} min expected · ${quiz.window_minutes} min window` : 'Untimed';
    return `<article class="qz${now ? ' is-now' : ''}${quiz.number === selected ? ' is-selected' : ''}" data-quiz="${quiz.number}">
      <div class="qz-top"><h3>${esc(quiz.label)}</h3>${badge}</div>
      <p class="qz-date">${esc(formatDate(quiz.version))}</p>
      <p class="qz-code"><code>${esc(quiz.access_code || '(no code)')}</code>${quiz.access_code ? `<button type="button" class="text-button" data-copy="${esc(quiz.access_code)}">Copy</button>` : ''}</p>
      <p class="quiet small">${esc(clock)}</p>
      <p class="small">${fresh.length ? `First in the bonus queue: ${Object.entries(bySource).map(([src, list]) => `<strong>${esc(src)}</strong> (${list.length} skill${list.length === 1 ? '' : 's'})`).join(', ')}` : '<span class="quiet">No new skills listed</span>'}</p>
      <div class="qz-actions">
        <button type="button" class="btn secondary small-btn" data-select="${quiz.number}" aria-pressed="${quiz.number === selected}">${quiz.number === selected ? 'Shown on the map' : 'Show on the map'}</button>
        ${quiz.access_code ? `<a class="text-button" href="../?code=${encodeURIComponent(quiz.access_code)}&debug=1&window=0.5&expected=0.2">Rehearse ↗</a>` : ''}
      </div>
    </article>`;
  }

  function questionRow(q) {
    return `<li class="qrow ${q.role}">
      <div class="qrow-top"><span class="badge ${q.role === 'graded' ? 'core' : q.role === 'bonus' ? 'bonus' : 'off'}">${esc(q.why)}</span>${q.verified || q.why.includes('Not verified') ? '' : '<span class="badge miss">Unverified</span>'}<span class="qid">${esc(q.id)} · L${q.level}</span></div>
      <p class="qprompt">${esc(q.prompt)}</p>
      <p class="qanswer">✓ ${esc(q.choices[q.answer_index])}</p>
    </li>`;
  }
  function skillBlock(s, newSet) {
    const isNew = newSet.has(s.key);
    return `<details class="skill k-${s.kind}${isNew ? ' is-new' : ''}" data-skill="${esc(s.key)}">
      <summary>
        <span class="skill-name">${esc(s.label)}${isNew ? ' <span class="badge new">New this quiz</span>' : ''}</span>
        <span class="skill-meta"><span class="badge ${s.kind.startsWith('graded') ? 'core' : s.kind === 'bonus' ? 'practice' : 'off'}">${esc(KIND_TEXT[s.kind])}</span>
        <span class="quiet small">${s.verified}/${s.questions.length} verified · ${s.cards.length} card${s.cards.length === 1 ? '' : 's'}${s.source.confirmed ? '' : ' · source unconfirmed'}</span></span>
      </summary>
      <div class="skill-body">
        <p class="quiet small"><code>${esc(s.key)}</code> · status <strong>${esc(s.status)}</strong> · ${s.graded.length} gradable question${s.graded.length === 1 ? '' : 's'}</p>
        ${s.questions.length ? `<ol class="qlist">${s.questions.map(questionRow).join('')}</ol>` : '<p class="quiet small">No questions yet.</p>'}
        ${s.cards.length ? `<p class="cards-head">Study cards</p><ul class="clist">${s.cards.map((c) => `<li><strong>${esc(c.front)}</strong> <span class="quiet">${esc(c.back)}</span>${c.verified ? '' : ' <span class="badge miss">Unverified</span>'}</li>`).join('')}</ul>` : ''}
      </div>
    </details>`;
  }
  function groupBlock(g, newSet) {
    const count = (kind) => g.skills.filter((s) => s.kind === kind).length;
    const qs = g.skills.flatMap((s) => s.questions);
    const hasNew = g.skills.some((s) => newSet.has(s.key));
    const bar = ['graded', 'graded-activity', 'bonus', 'off'].map((k) => {
      const n = count(k);
      return n ? `<span class="seg seg-${k}" style="flex:${n}" title="${esc(KIND_TEXT[k])}: ${n}"></span>` : '';
    }).join('');
    return `<details class="group${hasNew ? ' has-new' : ''}" data-group="${esc(g.id)}">
      <summary>
        <span class="g-eyebrow">${esc(g.eyebrow)}${hasNew ? ' · <strong>new this quiz</strong>' : ''}</span>
        <span class="g-title">${esc(g.title)}</span>
        <span class="g-bar" aria-hidden="true">${bar}</span>
        <span class="g-meta quiet small">${g.skills.length} skills: ${count('graded') + count('graded-activity')} graded, ${count('bonus')} bonus only${count('off') ? `, ${count('off')} off` : ''} · ${qs.filter((q) => q.verified && !q.draft).length}/${qs.length} questions verified · ${g.skills.reduce((n, s) => n + s.cards.length, 0)} cards</span>
      </summary>
      <div class="g-body">${g.skills.map((s) => skillBlock(s, newSet)).join('')}</div>
    </details>`;
  }

  function render() {
    const quiz = curriculum.quizzes[String(selected)] || {};
    const newSet = new Set(quiz.new_skills || []);
    const open = new Set([...app.querySelectorAll('details[open]')].map((d) => d.dataset.group || d.dataset.skill));
    app.innerHTML = `
      <section class="intro">
        <h2>Access codes</h2>
        <p class="quiet">The code picks the quiz. The site serves <strong>Quiz ${served}</strong> now; an earlier code still runs its quiz, labeled “makeup”, and a quiz with an opening time can’t be started before then (except with Rehearse). Every code draws from the same questions as they stand today. Quizzes differ only in date, clock, and which skills go first in the bonus queue.</p>
      </section>
      <div class="qz-grid">${quizzes.map(quizCard).join('')}</div>

      <section class="pool">
        <h2>What any quiz can ask today</h2>
        <dl class="pool-grid">
          <div><dt>${curriculum.targets?.graded_questions ?? '?'}</dt><dd><strong>graded</strong> questions per student, one each from ${pool.gradedSkills} Core skills (${pool.graded} verified questions to choose from)${pool.activitySkills ? `, plus ${pool.activitySkills} Core skill${pool.activitySkills === 1 ? '' : 's'} graded only for students who did the activity` : ''}.</dd></div>
          <div><dt>${pool.bonus}</dt><dd><strong>bonus</strong> questions for students ahead of pace: Practice skills, unverified questions, harder levels. Extra credit only. This quiz’s new skills come first.</dd></div>
          <div><dt>${pool.drafts + pool.offSkill}</dt><dd><strong>never served</strong>: ${pool.drafts} drafts${pool.offSkill ? ` and ${pool.offSkill} on Off skills` : ''}.</dd></div>
        </dl>
      </section>

      <section class="map">
        <div class="map-head">
          <h2>By lecture and activity</h2>
          <div class="zoom" role="group" aria-label="How much to show">
            <button type="button" class="chip" data-zoom="0">Lectures</button>
            <button type="button" class="chip" data-zoom="1">Skills</button>
            <button type="button" class="chip" data-zoom="2">Questions</button>
          </div>
        </div>
        <p class="legend small"><span class="seg seg-graded"></span>Graded <span class="seg seg-graded-activity"></span>Graded with activity <span class="seg seg-bonus"></span>Bonus only <span class="seg seg-off"></span>Off
          ${pool.unconfirmed ? ` · <span class="quiet">${pool.unconfirmed} skills’ source lecture is a guess (quiz/data/skill-sources.json)</span>` : ''}</p>
        <p class="quiet small">Showing <strong>${esc(quiz.label || '')}</strong>: its new skills are marked.</p>
        ${groups.map((g) => groupBlock(g, newSet)).join('')}
      </section>`;
    app.querySelectorAll('details').forEach((d) => {
      if (open.has(d.dataset.group || d.dataset.skill)) d.open = true;
    });
  }

  app.addEventListener('click', async (event) => {
    const copy = event.target.closest('[data-copy]');
    if (copy) {
      try { await navigator.clipboard.writeText(copy.dataset.copy); copy.textContent = 'Copied'; } catch { copy.textContent = 'Select it'; }
      setTimeout(() => { copy.textContent = 'Copy'; }, 1500);
      return;
    }
    const pick = event.target.closest('[data-select]');
    if (pick) {
      selected = Number(pick.dataset.select);
      render();
      const firstNew = app.querySelector('details.group.has-new');
      if (firstNew) { firstNew.open = true; firstNew.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      return;
    }
    const zoom = event.target.closest('[data-zoom]');
    if (zoom) {
      const level = Number(zoom.dataset.zoom);
      app.querySelectorAll('details.group').forEach((d) => { d.open = level >= 1; });
      app.querySelectorAll('details.skill').forEach((d) => { d.open = level >= 2; });
    }
  });

  render();
}

function opensText(iso) {
  return new Date(iso).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function formatDate(iso) {
  if (!iso) return '';
  const date = new Date(`${iso}T12:00:00`);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}
