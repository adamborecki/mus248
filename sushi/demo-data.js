// Practice plates for the demo kitchen (/sushi/?demo=1). Fictional and generic on purpose:
// nothing here is a real instruction, and the "other diners" are made up. Live tasks come from
// Adam's Sheet, never from this file.

const HOUR = 3600 * 1000;
const DAY = 24 * HOUR;

const TASKS = [
  {
    public_title: 'Clear the SD cards for Saturday', urgency: 'urgent', due: 1.2 * DAY, public_location: 'BH 208/209',
    category: 'Data Management', effort_size: 'small', estimated_minutes: '10',
    public_description: 'Two recordings this weekend need empty cards. Check each card in the demo case and clear the ones already marked as offloaded.',
    before_you_take: 'Only clear a card whose media is marked as offloaded.\nNot sure? Call the Chef instead of guessing.',
    definition_of_done: 'Every card in the case checked\nCleared cards back in the case\nAny card you did not clear named in your note',
    note_mode: 'required', verification_mode: 'admin', private_context: 'Demo private context: never shown in the app.',
  },
  {
    public_title: 'Wipe down the OH B01 keyboards', public_location: 'OH B01', category: 'Maintenance', effort_size: 'small',
    estimated_minutes: '5-10', public_description: 'Wipe each workstation keyboard and mouse.',
    before_you_take: 'Use the wipes in the room; nothing sprayed directly on a keyboard.',
    definition_of_done: 'Every keyboard and mouse in the room wiped\nWipes container closed',
    note_mode: 'none', verification_mode: 'self',
  },
  {
    public_title: 'Straighten the cable storage', public_location: 'BH 208/209', category: 'Maintenance', effort_size: 'medium',
    estimated_minutes: '20', due: 2.5 * DAY,
    public_description: 'Re-coil any cable put away badly and hang it with its own length.',
    before_you_take: 'Over-under coiling. If you don\'t know it yet, do the Cable Safari activity first.',
    definition_of_done: 'No knotted or tangled cable left\nEach hook holds one length of cable',
    note_mode: 'optional', verification_mode: 'self',
  },
  {
    public_title: 'Check the batteries in the demo mic kit', public_location: 'OH B01', category: 'Live Sound', effort_size: 'small',
    estimated_minutes: '10', public_description: 'Test each battery and move weak ones to the recycling box.',
    before_you_take: 'Ask Adam first if the kit is signed out.',
    definition_of_done: 'Every battery tested\nWeak ones in the recycling box\nHow many fresh ones are left, in your note',
    note_mode: 'required', verification_mode: 'self',
  },
  {
    public_title: 'Salmon recording: data transfer', public_event_label: 'Salmon Recital Hall', public_location: 'BH 208/209',
    category: 'Data Management', effort_size: 'medium', estimated_minutes: '15-25', due: 3 * DAY,
    public_description: 'Copy the recording\'s audio and video files to the course archive and confirm the copy is complete.',
    before_you_take: 'You need archive access. Ask Adam first if you have not done a transfer before.',
    definition_of_done: 'Every file copied\nFile count and total size match on both sides\nOriginal media left untouched',
    note_mode: 'required', verification_mode: 'admin', source_type: 'gig', private_source_ref: 'demo-gig-ref',
  },
  {
    public_title: 'Music at Noon: audio edit', public_event_label: 'Music at Noon', public_location: 'Anywhere with a DAW',
    category: 'Post Production', effort_size: 'boat', estimated_minutes: '90-150',
    public_description: 'Edit the concert audio into one file per piece, with clean starts and ends.',
    before_you_take: 'Finish the DAW training circuit first.',
    definition_of_done: 'One file per piece\nNo clipped applause or cut-off reverb tails\nExports named as the brief asks',
    note_mode: 'optional', verification_mode: 'admin', source_type: 'gig',
  },
  {
    public_title: 'QC an exported concert video', public_location: 'Anywhere', category: 'Post Production', effort_size: 'large',
    estimated_minutes: '30-45', public_description: 'Watch the export end to end and note anything wrong with sync, levels, or framing.',
    before_you_take: 'Headphones, not laptop speakers.',
    definition_of_done: 'Watched start to finish\nTimecodes of any problem in your note, or "none found"',
    note_mode: 'required', verification_mode: 'self',
  },
  {
    public_title: 'Reset the Salmon booth after the weekend', public_location: 'Salmon Recital Hall', category: 'Audio Capture',
    effort_size: 'medium', estimated_minutes: '20', due: 4 * DAY,
    public_description: 'Put the booth back to its standard state for the next user.',
    before_you_take: 'Booth access needed. Follow the room\'s reset checklist.',
    definition_of_done: 'Booth matches the reset checklist',
    note_mode: 'optional', verification_mode: 'self',
  },
  {
    public_title: 'Multicam pass on the studio session', public_location: 'Anywhere with an editor', category: 'Video Capture',
    effort_size: 'boat', estimated_minutes: '120', public_description: 'Cut between the camera angles for the full session.',
    before_you_take: 'Ask Adam first: this one needs project files.', definition_of_done: 'Full multicam cut exported for review',
    note_mode: 'optional', verification_mode: 'admin',
  },
];

// Plates "other diners" are holding, so the demo shows what someone else's claim looks like.
const OTHERS = [
  { public_title: 'Dust the Musco booth monitors', public_location: 'Musco Center', category: 'Maintenance', effort_size: 'small', then: 'claim' },
  { public_title: 'Archive last month\'s projects', public_location: 'Anywhere', category: 'Data Management', effort_size: 'large', verification_mode: 'admin', then: 'submit' },
  { public_title: 'Label the new XLR cables', public_location: 'BH 208/209', category: 'Maintenance', effort_size: 'medium', then: 'complete' },
  { public_title: 'Export stems for the jazz combo', public_location: 'Anywhere', category: 'Post Production', effort_size: 'medium', then: 'complete' },
];

const TEMPLATES = [
  {
    public_title: 'Weekly SD-card readiness check', recurrence_kind: 'weekly', recurrence_value: 'Mon', public_location: 'BH 208/209',
    category: 'Data Management', effort_size: 'small', estimated_minutes: '10-15',
    public_description: 'Make sure every card in the case is ready for the week\'s recordings.',
    before_you_take: 'Look only; clearing a card is a separate plate.', definition_of_done: 'Every card checked\nAnything not ready, named in your note',
    note_mode: 'required', verification_mode: 'self',
  },
  {
    public_title: 'Monthly workstation tidy', recurrence_kind: 'monthly', recurrence_value: '1', public_location: 'OH B01',
    category: 'Maintenance', effort_size: 'medium', estimated_minutes: '20',
    public_description: 'Empty the desktop downloads folders and put away anything left on the desks.',
    before_you_take: 'Never delete anything outside a Downloads folder.', definition_of_done: 'Every workstation tidied',
    note_mode: 'optional', verification_mode: 'self',
  },
];

/** Due dates land at the end of a day, like the ones Adam types (a date with no time). */
const endOfDay = (now, offset) => { const d = new Date(now.getTime() + offset); d.setHours(23, 59, 0, 0); return d; };

/** Fills a freshly set-up fake Sheet. `post` sends a mutation through the real doPost. */
export function seedDemo(backend, now = new Date()) {
  const tasks = backend.table_('Tasks');
  const make = (row) => backend.appendObject_(tasks, {
    task_id: backend.newId_('S', tasks, 'task_id'), active: 'yes', status: 'available', urgency: 'normal',
    note_mode: 'optional', verification_mode: 'self', source_type: 'manual', created_at: now, updated_at: now,
    ...row, due_at: row.due ? endOfDay(now, row.due) : '', due: undefined, then: undefined,
  });
  TASKS.forEach(make);

  const templates = backend.table_('Templates');
  TEMPLATES.forEach((row) => backend.appendObject_(templates, {
    template_id: backend.newId_('W', templates, 'template_id'), active: 'yes', urgency_default: 'normal', source_type: 'recurring',
    created_at: now, updated_at: now, ...row,
  }));

  const post = (body) => JSON.parse(backend.doPost({ postData: { contents: JSON.stringify(body) } }).getContent());
  OTHERS.forEach((row) => {
    const t = make(row);
    const claim = otherDinerClaim(t.task_id);
    post(claim);
    if (row.then !== 'claim') post({ ...claim, action: 'complete', request_id: crypto.randomUUID(), note: 'Demo note.' });
  });
  backend.runUpkeep();
}

/** A claim by a made-up other device: its secret is thrown away, so this browser can never act on it. */
export function otherDinerClaim(taskId) {
  const secret = Array.from(crypto.getRandomValues(new Uint8Array(24)), (b) => b.toString(16).padStart(2, '0')).join('');
  return {
    action: 'claim', request_id: crypto.randomUUID(), task_id: taskId, claim_id: crypto.randomUUID(), claim_secret: secret,
    actor_name: 'Demo diner', actor_mode: 'Other',
  };
}
