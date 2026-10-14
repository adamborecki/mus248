import { DOC_TYPES, KINDS, SETTINGS, SKILL_EMOJI, docType, groupLabel, settingsChips, typeChip, whereMatch, whereSummary } from './catalog.js';

const byId = (id) => document.getElementById(id);

async function loadDirectory() {
  const activities = await fetch('data/activities.json').then((response) => response.json());

  const filter = byId('skill-filter');
  const typeFilter = byId('type-filter');
  const whereBoxes = [...document.querySelectorAll('#where-picker input[type="checkbox"]')];
  const clear = byId('clear-filters');
  const list = byId('activity-list');
  const count = byId('activity-count');
  const skills = [...new Set(activities.flatMap((activity) => activity.skills))].sort();
  skills.forEach((skill) => filter.add(new Option(`${SKILL_EMOJI[skill] || '🛠️'} ${skill}`, skill)));
  // Only the types and kinds the catalog actually holds — an empty option would be a dead end.
  Object.entries(DOC_TYPES)
    .filter(([type]) => activities.some((activity) => docType(activity) === type))
    .forEach(([type, { plural, emoji }]) => {
      typeFilter.add(new Option(`${emoji} ${plural[0].toUpperCase()}${plural.slice(1)}`, type));
      Object.entries(KINDS)
        .filter(([kind]) => activities.some((activity) => docType(activity) === type && activity.kind === kind))
        .forEach(([kind, kindInfo]) => typeFilter.add(new Option(`  ↳ ${kindInfo.emoji} ${kindInfo.plural}`, `kind:${kind}`)));
    });

  const card = (activity) => {
    // Every card opens the activity's own page — never a direct external link — so the
    // Canvas discussion and after-activity steps are never skipped for external activities.
    const action = `<a class="activity-link" href="${activity.route}/">Open ${DOC_TYPES[docType(activity)].label.toLowerCase()} <span aria-hidden="true">→</span></a>`;
    // The worksheet link lives on the activity page itself ("Print the worksheet"), not here —
    // one primary action per card.
    const line = [activity.time, whereSummary(activity), activity.contentFile ? '' : 'External instructions ↗'].filter(Boolean).join(' · ');
    const family = activity.family ? `<p class="activity-family">${activity.family}</p>` : '';
    const skillChips = activity.skills.map((skill) => `<span class="chip"><span aria-hidden="true">${SKILL_EMOJI[skill] || '🛠️'}</span>${skill}</span>`).join('');
    const access = activity.access ? `<span class="chip"><span aria-hidden="true">📍</span>${activity.access}</span>` : '';
    const meta = `<div class="activity-meta">${typeChip(activity)}${skillChips}${settingsChips(activity)}${access}<span class="chip"><span aria-hidden="true">👥</span>${groupLabel(activity.group)}</span></div>`;
    return `<details class="activity-card">
      <summary>
        <span class="activity-emoji" aria-hidden="true">${activity.emoji}</span>
        <span class="card-copy"><strong>${activity.title}</strong><small>${line}</small></span>
        <span class="arrow" aria-hidden="true">⌄</span>
      </summary>
      <div class="card-details">
        ${meta}
        ${family}
        <div class="card-actions">${action}</div>
      </div>
    </details>`;
  };

  const show = () => {
    const selectedSkill = filter.value;
    const selectedType = typeFilter.value;
    const where = whereBoxes.filter((box) => box.checked).map((box) => box.value);
    const matchesType = (activity) => (selectedType === 'all'
      || (selectedType.startsWith('kind:') ? activity.kind === selectedType.slice(5) : docType(activity) === selectedType));
    const candidates = activities.filter((activity) => (selectedSkill === 'all' || activity.skills.includes(selectedSkill))
      && matchesType(activity));
    // A checked "Where" never hides an entry whose page doesn't say: those go in an "ask first" group.
    const visible = where.length ? candidates.filter((activity) => whereMatch(activity, where) === 'yes') : candidates;
    const askFirst = where.length ? candidates.filter((activity) => whereMatch(activity, where) === 'confirm') : [];
    count.textContent = `${visible.length} ${visible.length === 1 ? 'item' : 'items'}${askFirst.length ? ` · ${askFirst.length} to ask about` : ''}`;
    clear.hidden = !(where.length || selectedSkill !== 'all' || selectedType !== 'all');
    const said = SETTINGS.filter((setting) => where.includes(setting.key)).map((setting) => setting.short).join(' or ');
    list.innerHTML = visible.map(card).join('')
      + (askFirst.length ? `<h3 class="ask-first">Ask the instructor first <small>these pages don't say whether they can be done ${said}</small></h3>${askFirst.map(card).join('')}` : '');
  };
  [filter, typeFilter, ...whereBoxes].forEach((control) => control.addEventListener('change', show));
  clear.addEventListener('click', () => {
    filter.value = 'all';
    typeFilter.value = 'all';
    whereBoxes.forEach((box) => { box.checked = false; });
    show();
  });
  show();
}

loadDirectory().catch(() => {
  byId('activity-list').innerHTML = '<p class="error">The activity directory could not be loaded. Please try again.</p>';
});
