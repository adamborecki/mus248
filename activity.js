import { renderMarkdown } from './markdown.js';

async function loadActivity() {
  const root = document.body.dataset.activityId;
  const [activities, semester] = await Promise.all([
    fetch('../data/activities.json').then((response) => response.json()),
    fetch('../data/semesters/fall-2026.json').then((response) => response.json()),
  ]);
  const activity = activities.find((item) => item.id === root);
  if (!activity) throw new Error('Activity not found');
  const discussion = semester.discussions.find((item) => item.activityIds.includes(activity.id));
  let instructions = '';

  let external = false;
  if (activity.contentFile) {
    const response = await fetch(`../content/activities/${activity.contentFile}.md`);
    if (response.ok) instructions = renderMarkdown(await response.text(), { assetBase: '../content/activities/' });
  }
  if (!instructions && activity.externalResource) {
    external = true;
    instructions = `<p class="quiet">This activity's instructions are hosted outside this site and will open in a new tab.</p><p><a class="primary-link" href="${activity.externalResource.url}" target="_blank" rel="noopener">${activity.externalResource.label} <span aria-hidden="true">↗</span></a></p>`;
  }
  if (!instructions) instructions = '<p class="quiet">Instructions are being moved here.</p>';

  // The worksheet is generated from this same Markdown file, so it exists exactly
  // when in-app instructions do.
  const worksheet = activity.contentFile
    ? `<p class="worksheet-cue"><a class="worksheet-cta" href="worksheet/"><span aria-hidden="true">🖨️</span> Print the worksheet</a>
       <span class="quiet">The page to write on while you work — checkpoints, key terms, and this activity's questions.</span></p>`
    : '';

  const afterActivity = semester.afterActivity;
  const completion = discussion && afterActivity ? `
    <section class="completion">
      <h2>${afterActivity.heading}</h2>
      <p class="quiet">${afterActivity.note}</p>
      <ol class="submission-steps">${afterActivity.steps.map((step) => `<li>${step}</li>`).join('')}</ol>
      <a class="canvas-link" href="${discussion.url}" target="_blank" rel="noopener">Canvas discussion <span aria-hidden="true">↗</span></a>
    </section>` : '';

  document.title = `${activity.title} · MUS 248`;
  document.getElementById('activity').innerHTML = `
    <a class="back" href="../">← Activities</a>
    <header class="activity-header"><span aria-hidden="true">${activity.emoji}</span><div><h1>${activity.title}</h1><p>${activity.time} · ${activity.access} · Groups of ${activity.group}${external ? ' · Instructions hosted externally' : ''}</p></div></header>
    ${worksheet}
    <article class="instructions">${instructions}</article>
    ${completion}
  `;
}

loadActivity().catch(() => {
  document.getElementById('activity').innerHTML = '<p>Activity unavailable.</p>';
});
