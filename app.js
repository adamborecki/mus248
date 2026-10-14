import { DOC_TYPES, KINDS, WHERE_OPTIONS, docType, settingsChips, typeChip, whereMatch } from './catalog.js';

const byId = (id) => document.getElementById(id);

async function loadDirectory() {
  const activities = await fetch('data/activities.json').then((response) => response.json());

  const filter = byId('skill-filter');
  const typeFilter = byId('type-filter');
  const whereFilter = byId('where-filter');
  const list = byId('activity-list');
  const count = byId('activity-count');
  const skills = [...new Set(activities.flatMap((activity) => activity.skills))].sort();
  skills.forEach((skill) => filter.add(new Option(skill, skill)));
  // Only the types the catalog actually holds — an empty "References" option would be a dead end.
  Object.entries(DOC_TYPES)
    .filter(([type]) => activities.some((activity) => docType(activity) === type))
    .forEach(([type, { plural }]) => typeFilter.add(new Option(plural[0].toUpperCase() + plural.slice(1), type)));
  Object.entries(KINDS)
    .filter(([kind]) => activities.some((activity) => activity.kind === kind))
    .forEach(([kind, { plural }]) => typeFilter.add(new Option(`↳ ${plural}`, `kind:${kind}`)));
  WHERE_OPTIONS.forEach((option) => whereFilter.add(new Option(option.label, option.value)));

  const show = () => {
    const selectedSkill = filter.value;
    const selectedType = typeFilter.value;
    const where = WHERE_OPTIONS.find((option) => option.value === whereFilter.value);
    const matchesType = (activity) => (selectedType === 'all'
      || (selectedType.startsWith('kind:') ? activity.kind === selectedType.slice(5) : docType(activity) === selectedType));
    const candidates = activities.filter((activity) => (selectedSkill === 'all' || activity.skills.includes(selectedSkill))
      && matchesType(activity));
    // "Where" never hides an entry whose page doesn't say: those go in an "ask first" group below.
    const visible = where ? candidates.filter((activity) => whereMatch(activity, where) === 'yes') : candidates;
    const askFirst = where ? candidates.filter((activity) => whereMatch(activity, where) === 'confirm') : [];
    count.textContent = `${visible.length} ${visible.length === 1 ? 'item' : 'items'}${askFirst.length ? ` · ${askFirst.length} to ask about` : ''}`;
    const card = (activity) => {
      // Every card opens the activity's own page — never a direct external link — so the
      // Canvas discussion and after-activity steps are never skipped for external activities.
      const action = `<a class="activity-link" href="${activity.route}/">Open activity <span aria-hidden="true">→</span></a>`;
      // The worksheet link lives on the activity page itself ("Print the worksheet"), not here —
      // one primary action per card.
      const source = activity.contentFile ? 'In-app instructions' : 'External instructions ↗';
      const family = activity.family ? `<p class="activity-family">${activity.family}</p>` : '';
      const skillChips = activity.skills.map((skill) => `<span class="chip"><span aria-hidden="true">🛠️</span>${skill}</span>`).join('');
      const meta = `<div class="activity-meta">${typeChip(activity)}${skillChips}${settingsChips(activity)}<span class="chip"><span aria-hidden="true">📍</span>${activity.access}</span><span class="chip"><span aria-hidden="true">👥</span>Groups of ${activity.group}</span></div>`;
      return `<details class="activity-card">
        <summary>
          <span class="activity-emoji" aria-hidden="true">${activity.emoji}</span>
          <span class="card-copy"><strong>${activity.title}</strong><small>${docType(activity) === 'activity' ? '' : `${DOC_TYPES[docType(activity)].label} · `}${activity.time} · ${source}</small></span>
          <span class="arrow" aria-hidden="true">⌄</span>
        </summary>
        <div class="card-details">
          ${meta}
          ${family}
          <div class="card-actions">${action}</div>
        </div>
      </details>`;
    };
    list.innerHTML = visible.map(card).join('')
      + (askFirst.length ? `<h3 class="ask-first">Ask the instructor first <small>these pages don't say whether they can be done ${where.short}</small></h3>${askFirst.map(card).join('')}` : '');
  };
  filter.addEventListener('change', show);
  typeFilter.addEventListener('change', show);
  whereFilter.addEventListener('change', show);
  show();
}

loadDirectory().catch(() => {
  byId('activity-list').innerHTML = '<p class="error">The activity directory could not be loaded. Please try again.</p>';
});
