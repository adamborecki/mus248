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

// A finer label inside a type. Reset procedures are checklists, so they keep the checklist type and
// get their own filter option and chip.
export const KINDS = {
  reset: { label: 'Reset procedure', plural: 'Reset procedures', emoji: '🔁' },
};

export const SETTINGS = [
  { key: 'home', label: 'At home', short: 'at home', emoji: '🏠' },
  { key: 'class', label: 'On campus, during class', short: 'during class', emoji: '🏫' },
  { key: 'outsideClass', label: 'On campus, outside class', short: 'outside class', emoji: '🔑' },
];

// "yes", "no", or "confirm" for one setting; a missing or unknown value reads as "confirm".
export const settingValue = (entry, key) => {
  const value = entry.settings && entry.settings[key];
  return ['yes', 'no'].includes(value) ? value : 'confirm';
};

// The front page's "Where" filter. Each option is one or more settings; an entry matches when any
// of them is "yes", and lands in "ask first" when none is "yes" but one is "confirm".
export const WHERE_OPTIONS = [
  { value: 'class', label: 'In class', short: 'in class', keys: ['class'] },
  { value: 'out', label: 'Out of class (home or campus)', short: 'out of class', keys: ['home', 'outsideClass'] },
  { value: 'home', label: 'At home', short: 'at home', keys: ['home'] },
  { value: 'campus', label: 'On campus (any time)', short: 'on campus', keys: ['class', 'outsideClass'] },
  { value: 'outsideClass', label: 'On campus, outside class', short: 'on campus outside class', keys: ['outsideClass'] },
];

export function whereMatch(entry, option) {
  const values = option.keys.map((key) => settingValue(entry, key));
  if (values.includes('yes')) return 'yes';
  return values.includes('confirm') ? 'confirm' : 'no';
}

const chip = (emoji, text, extra = '') => `<span class="chip${extra}"><span aria-hidden="true">${emoji}</span>${text}</span>`;

export const typeChip = (entry) => {
  const type = DOC_TYPES[docType(entry)];
  const kind = KINDS[entry.kind];
  return chip(type.emoji, type.label, ' chip-type') + (kind ? chip(kind.emoji, kind.label, ' chip-type') : '');
};

// No settings at all → nothing shown, exactly as before this field existed.
export function settingsChips(entry) {
  if (!entry.settings) return '';
  const yes = SETTINGS.filter((setting) => settingValue(entry, setting.key) === 'yes');
  const unsure = SETTINGS.filter((setting) => settingValue(entry, setting.key) === 'confirm');
  return yes.map((setting) => chip(setting.emoji, setting.label)).join('')
    + (unsure.length ? chip('❓', `Confirm with instructor: ${unsure.map((setting) => setting.short).join(', ')}`) : '');
}
