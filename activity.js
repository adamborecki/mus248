const escapeHtml = (value) => value.replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
}[character]));

const inline = (value) => escapeHtml(value)
  .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2">$1</a>')
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

function renderMarkdown(markdown) {
  const lines = markdown.replace(/^---[\s\S]*?---\s*/, '').split('\n');
  const output = [];
  let list = null;
  const closeList = () => { if (list) { output.push(`</${list}>`); list = null; } };
  const cells = (line) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());
  const isDivider = (line) => line.includes('|') && /^\|?[\s:|-]*-[\s:|-]*\|?$/.test(line.trim());
  const row = (values, tag) => `<tr>${values.map((value) => `<${tag}>${inline(value)}</${tag}>`).join('')}</tr>`;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const heading = line.match(/^(#{2,4})\s+(.+)$/);
    const bullet = line.match(/^[-*]\s+(.+)$/);
    const numbered = line.match(/^\d+\.\s+(.+)$/);
    const quote = line.match(/^>\s?(.+)$/);

    if (line.trim().startsWith('|') && isDivider(lines[index + 1] || '')) {
      closeList();
      const head = cells(line);
      const body = [];
      index += 2;
      while (index < lines.length && lines[index].trim().startsWith('|')) { body.push(cells(lines[index])); index += 1; }
      index -= 1;
      output.push(`<div class="table-scroll"><table><thead>${row(head, 'th')}</thead><tbody>${body.map((values) => row(values, 'td')).join('')}</tbody></table></div>`);
    }
    else if (heading) { closeList(); output.push(`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`); }
    else if (bullet) {
      if (list !== 'ul') { closeList(); list = 'ul'; output.push('<ul>'); }
      const task = bullet[1].match(/^\[([ xX])\]\s+(.+)$/);
      output.push(task
        ? `<li class="task"><span aria-hidden="true">${task[1] === ' ' ? '☐' : '☑'}</span> ${inline(task[2])}</li>`
        : `<li>${inline(bullet[1])}</li>`);
    }
    else if (numbered) { if (list !== 'ol') { closeList(); list = 'ol'; output.push('<ol>'); } output.push(`<li>${inline(numbered[1])}</li>`); }
    else if (quote) { closeList(); output.push(`<aside>${inline(quote[1])}</aside>`); }
    else if (!line.trim()) { closeList(); }
    else { closeList(); output.push(`<p>${inline(line)}</p>`); }
  }
  closeList();
  return output.join('');
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
  if (activity.contentFile) {
    const response = await fetch(`../content/activities/${activity.contentFile}.md`);
    if (response.ok) instructions = renderMarkdown(await response.text());
  }
  if (!instructions && activity.externalResource) {
    external = true;
    instructions = `<p class="quiet">This activity's instructions are hosted outside this site and will open in a new tab.</p><p><a class="primary-link" href="${activity.externalResource.url}" target="_blank" rel="noopener">${activity.externalResource.label} <span aria-hidden="true">↗</span></a></p>`;
  }
  if (!instructions) instructions = '<p class="quiet">Instructions are being moved here.</p>';

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
    <article class="instructions">${instructions}</article>
    ${completion}
  `;
}

loadActivity().catch(() => {
  document.getElementById('activity').innerHTML = '<p>Activity unavailable.</p>';
});
