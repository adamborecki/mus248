import { renderMarkdown } from './markdown.js';
import { enableImageZoom } from './image-zoom.js';
import { parseFrontmatter, renderFormSection } from './worksheet.js';
import { DOC_TYPES, KINDS, SECTIONS, docType, groupLabel, settingsChips } from './catalog.js';
import { catalogCrumbs, crumbs } from './crumbs.js';

// Opt-in credit by GitHub username only, never a real name (see CLAUDE.md).
const GITHUB_USER = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/;

// Previous and next in the same family (catalog order), so a series like Post Mini 1–4 or the
// Salmon pages reads in order without going back to the hub. A family with its own section page
// links to it.
function familyNav(activity, activities) {
  const family = activities.filter((item) => item.family && item.family === activity.family);
  const index = family.findIndex((item) => item.id === activity.id);
  if (family.length < 2 || index < 0) return '';
  const section = SECTIONS[activity.family];
  const name = section ? `<a href="../${section.route}/">${activity.family}</a>` : activity.family;
  const step = (item, rel, arrow) => (item
    ? `<a class="family-step family-${rel}" href="../${item.route}/" rel="${rel}"><small>${rel === 'prev' ? `${arrow} Previous` : `Next ${arrow}`}</small><span><span aria-hidden="true">${item.emoji}</span> ${item.title}</span></a>`
    : '<span class="family-step family-empty" aria-hidden="true"></span>');
  return `<nav class="family-nav no-print" aria-label="More in ${activity.family}">
      <p class="family-title">${index + 1} of ${family.length} in ${name}</p>
      <div class="family-steps">${step(family[index - 1], 'prev', '←')}${step(family[index + 1], 'next', '→')}</div>
    </nav>`;
}

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
  let contributors = [];
  if (activity.contentFile) {
    const response = await fetch(`../content/activities/${activity.contentFile}.md`);
    if (response.ok) {
      const markdown = await response.text();
      contributors = [].concat(parseFrontmatter(markdown).contributors || []).filter((name) => GITHUB_USER.test(name));
      instructions = renderMarkdown(markdown, { assetBase: '../content/activities/', numbered: docType(activity) === 'checklist' });
    }
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

  // The activities that used to have a Canvas discussion keep their after-activity steps; the
  // discussion itself is gone, replaced by the Repo Improvement form that ends every page.
  const afterActivity = semester.afterActivity;
  const steps = discussion && afterActivity ? `
    <section class="completion">
      <h2>${afterActivity.heading}</h2>
      <p class="quiet">${afterActivity.note}</p>
      <ol class="submission-steps">${afterActivity.steps.map((step) => `<li>${step}</li>`).join('')}</ol>
    </section>` : '';
  const form = renderFormSection();
  const completion = steps + form;

  const chips = settingsChips(activity);
  const settings = chips ? `<p class="activity-settings" aria-label="Where this can be done">${chips}</p>` : '';

  document.title = `${activity.title} · MUS 248`;
  document.getElementById('activity').innerHTML = `
    ${crumbs([...catalogCrumbs(activity, activities), [activity.title]])}
    <header class="activity-header"><span aria-hidden="true">${activity.emoji}</span><div><h1>${activity.title}</h1><p>${docType(activity) === 'activity' ? '' : `${DOC_TYPES[docType(activity)].emoji} ${DOC_TYPES[docType(activity)].label} · `}${KINDS[activity.kind] ? `${KINDS[activity.kind].emoji} ${KINDS[activity.kind].label} · ` : ''}${[activity.time, activity.access, groupLabel(activity.group)].filter(Boolean).join(' · ')}${external ? ' · Instructions hosted externally' : ''}</p>${settings}</div></header>
    ${worksheet}
    <article class="instructions${docType(activity) === 'checklist' ? ' numbered' : ''}">${instructions}</article>
    ${contributors.length ? `<p class="contributors"><span aria-hidden="true">🙌</span> Improved with help from ${contributors.map((name) => `<a href="https://github.com/${name}" rel="noopener">@${name}</a>`).join(', ')}</p>` : ''}
    ${familyNav(activity, activities)}
    ${completion}
  `;
  // Lets a page add interactive pieces to its rendered instructions (Repo Improvement's
  // starter kit) without the shared renderer knowing about them.
  enableImageZoom(document.getElementById('activity'));
  document.body.dataset.rendered = 'true';
  document.dispatchEvent(new CustomEvent('activity:rendered', { detail: { activity } }));
}

loadActivity().catch(() => {
  document.getElementById('activity').innerHTML = '<p>Activity unavailable.</p>';
});
