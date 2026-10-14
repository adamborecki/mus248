// Labels for the catalog's optional metadata, shared by the front page and the activity page.
//
// Both fields are optional so older entries keep working unchanged:
//   type      "activity" (the default) · "checklist" · "reference"
//   settings  { home, class, outsideClass } — each "yes", "no", or "confirm".
//             A missing key, or any other value, reads as "confirm": where a source doesn't say,
//             the page says to ask rather than guessing at access.

export const DOC_TYPES = {
  activity: { label: 'Activity', plural: 'activities', emoji: '🎯' },
  checklist: { label: 'Checklist', plural: 'checklists', emoji: '📋' },
  reference: { label: 'Reference', plural: 'references', emoji: '📖' },
};

export const docType = (entry) => (DOC_TYPES[entry.type] ? entry.type : 'activity');

export const SETTINGS = [
  { key: 'home', label: 'At home', short: 'at home', emoji: '🏠' },
  { key: 'class', label: 'On campus, during class', short: 'during class', emoji: '🏫' },
  { key: 'outsideClass', label: 'On campus, outside class', short: 'outside class', emoji: '🔑' },
];

const chip = (emoji, text, extra = '') => `<span class="chip${extra}"><span aria-hidden="true">${emoji}</span>${text}</span>`;

export const typeChip = (entry) => {
  const type = DOC_TYPES[docType(entry)];
  return chip(type.emoji, type.label, ' chip-type');
};

// No settings at all → nothing shown, exactly as before this field existed.
export function settingsChips(entry) {
  if (!entry.settings) return '';
  const value = (key) => (['yes', 'no'].includes(entry.settings[key]) ? entry.settings[key] : 'confirm');
  const yes = SETTINGS.filter((setting) => value(setting.key) === 'yes');
  const unsure = SETTINGS.filter((setting) => value(setting.key) === 'confirm');
  return yes.map((setting) => chip(setting.emoji, setting.label)).join('')
    + (unsure.length ? chip('❓', `Confirm with instructor: ${unsure.map((setting) => setting.short).join(', ')}`) : '');
}
