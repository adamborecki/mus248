const byId = (id) => document.getElementById(id);

async function loadDirectory() {
  const activities = await fetch('data/activities.json').then((response) => response.json());

  const filter = byId('skill-filter');
  const list = byId('activity-list');
  const count = byId('activity-count');
  const skills = [...new Set(activities.flatMap((activity) => activity.skills))].sort();
  skills.forEach((skill) => filter.add(new Option(skill, skill)));

  const show = () => {
    const selectedSkill = filter.value;
    const visible = activities.filter((activity) => selectedSkill === 'all' || activity.skills.includes(selectedSkill));
    count.textContent = `${visible.length} ${visible.length === 1 ? 'activity' : 'activities'}`;
    list.innerHTML = visible.map((activity) => {
      const source = activity.externalResource
        ? `<a class="source-link" href="${activity.externalResource.url}" target="_blank" rel="noopener">${activity.externalResource.label} <span aria-hidden="true">↗</span></a>`
        : '';
      const family = activity.family ? `<span>${activity.family} · levels and variants welcome</span>` : '';
      return `<details class="activity-card">
        <summary>
          <span class="activity-emoji" aria-hidden="true">${activity.emoji}</span>
          <span class="card-copy"><strong>${activity.title}</strong><small>${activity.time}</small></span>
          <span class="arrow" aria-hidden="true">⌄</span>
        </summary>
        <div class="card-details">
          <p>${activity.skills.join(' · ')}<br>${activity.access} · ${activity.group}</p>
          ${family ? `<p>${family}</p>` : ''}
          <div class="card-actions"><a class="activity-link" href="${activity.route}/">Open activity <span aria-hidden="true">→</span></a>${source}</div>
        </div>
      </details>`;
    }).join('');
  };
  filter.addEventListener('change', show);
  show();
}

loadDirectory().catch(() => {
  byId('activity-list').innerHTML = '<p class="error">The activity directory could not be loaded. Please try again.</p>';
});
