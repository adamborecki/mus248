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
      const action = activity.contentFile
        ? `<a class="activity-link" href="${activity.route}/">Open activity <span aria-hidden="true">→</span></a>`
        : activity.externalResource
          ? `<a class="activity-link" href="${activity.externalResource.url}" target="_blank" rel="noopener">Open instructions <span aria-hidden="true">↗</span></a>`
          : `<a class="activity-link" href="${activity.route}/">Open activity <span aria-hidden="true">→</span></a>`;
      const family = activity.family ? `<p class="activity-family">${activity.family}</p>` : '';
      return `<details class="activity-card">
        <summary>
          <span class="activity-emoji" aria-hidden="true">${activity.emoji}</span>
          <span class="card-copy"><strong>${activity.title}</strong><small>${activity.time}</small></span>
          <span class="arrow" aria-hidden="true">⌄</span>
        </summary>
        <div class="card-details">
          <p class="activity-meta"><span>${activity.skills.join(' · ')}</span><span>${activity.access}</span><span>Groups of ${activity.group}</span></p>
          ${family}
          <div class="card-actions">${action}</div>
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
