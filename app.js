import { DOC_TYPES, docType, settingsChips, typeChip } from './catalog.js';

const byId = (id) => document.getElementById(id);

async function loadDirectory() {
  const activities = await fetch('data/activities.json').then((response) => response.json());

  const filter = byId('skill-filter');
  const typeFilter = byId('type-filter');
  const list = byId('activity-list');
  const count = byId('activity-count');
  const skills = [...new Set(activities.flatMap((activity) => activity.skills))].sort();
  skills.forEach((skill) => filter.add(new Option(skill, skill)));
  // Only the types the catalog actually holds — an empty "References" option would be a dead end.
  Object.entries(DOC_TYPES)
    .filter(([type]) => activities.some((activity) => docType(activity) === type))
    .forEach(([type, { plural }]) => typeFilter.add(new Option(plural[0].toUpperCase() + plural.slice(1), type)));

  const show = () => {
    const selectedSkill = filter.value;
    const selectedType = typeFilter.value;
    const visible = activities.filter((activity) => (selectedSkill === 'all' || activity.skills.includes(selectedSkill))
      && (selectedType === 'all' || docType(activity) === selectedType));
    const one = visible.length === 1;
    const noun = selectedType === 'all' ? (one ? 'item' : 'items') : (one ? DOC_TYPES[selectedType].label.toLowerCase() : DOC_TYPES[selectedType].plural);
    count.textContent = `${visible.length} ${noun}`;
    list.innerHTML = visible.map((activity) => {
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
    }).join('');
  };
  filter.addEventListener('change', show);
  typeFilter.addEventListener('change', show);
  show();
}

loadDirectory().catch(() => {
  byId('activity-list').innerHTML = '<p class="error">The activity directory could not be loaded. Please try again.</p>';
});
