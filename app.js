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
      return `<a class="activity-card" href="${activity.route}/">
        <span class="activity-emoji" aria-hidden="true">${activity.emoji}</span>
        <span class="card-copy"><strong>${activity.title}</strong><small>${activity.time}</small></span>
        <span class="arrow" aria-hidden="true">→</span>
      </a>`;
    }).join('');
  };
  filter.addEventListener('change', show);
  show();
}

loadDirectory().catch(() => {
  byId('activity-list').innerHTML = '<p class="error">The activity directory could not be loaded. Please try again.</p>';
});
