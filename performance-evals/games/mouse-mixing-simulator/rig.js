// The rig for the Mouse's Mixing Simulator: one wireless singer into one wedge, in Salmon. It is
// Vocal Jazz's wedge chain, so every piece of gear, cable, and "why not" comes from a page students
// already have. Don't add gear or a cable that isn't written down in one of them: a player repeats
// this in the room.
//
//   lecture   content/lectures/2026-11-02-salmon-foh.md: Using AES50 · Inputs: LOCAL vs. AES50 ·
//             Outputs: Vocal Jazz wedges · Gain staging: the whole chain
//   wireless  content/activities/x32-wireless-mics.md (receiver → XLR → X32 local input)
//   cme       content/activities/cme-gig-checklist.md (an instrument cable is not a speaker cable)
//
// The game idea (a mouse who can't hear himself sing) and the signal flow came from a student.

export const MIXER_LAB = 'https://adamborecki.github.io/mixer-lab/#/x32-vj-chain';

// zone: where the gear sits in the hall. Listed in the order the cards are drawn.
export const GEAR = [
  { id: 'receiver', zone: 'foh', icon: '📡', name: 'Wireless receiver', sub: 'FOH wireless rack' },
  { id: 'x32', zone: 'foh', icon: '🎛️', name: 'X32 mixer', sub: 'FOH' },
  { id: 'mic', zone: 'stage', icon: '🎤', name: 'Wireless mic', sub: 'on its stand' },
  { id: 's32', zone: 'stage', icon: '🗄️', name: 'S32 stage box', sub: 'stage-side rack' },
  { id: 'amp', zone: 'stage', icon: '🔋', name: 'NX3000 amp', sub: 'amp rack · CH A' },
  { id: 'wedge', zone: 'stage', icon: '🔈', name: 'Wedge', sub: 'passive, on the floor' },
];

export const CABLES = [
  { id: 'xlr', name: 'XLR', color: '#7c5cff' },
  { id: 'aes50', name: 'AES50 (Cat5e)', color: '#1f9d55' },
  { id: 'speakon', name: 'speakON', color: '#f29900' },
  { id: 'instrument', name: '1/4" instrument cable', color: '#d93025', decoy: true },
];

// The four cables that have to be run, in signal order. wrong: what to say for each wrong cable.
export const LINKS = [
  {
    id: 'receiver-x32', a: 'receiver', b: 'x32', cable: 'xlr', label: 'Receiver → X32 (LOCAL input): XLR',
    why: 'Salmon\'s wireless receivers plug into the X32\'s own rear panel with XLR. That\'s why those channels are on LOCAL inputs.',
  },
  {
    id: 'x32-s32', a: 'x32', b: 's32', cable: 'aes50', label: 'X32 → S32: AES50 (one Cat5e)',
    why: 'One Cat5e between the X32 and the S32: AES50. No AES50 link, and every meter moves but every speaker is silent.',
  },
  {
    id: 's32-amp', a: 's32', b: 'amp', cable: 'xlr', label: 'S32 OUT 1 → NX3000 CH A: XLR',
    why: 'XLR carries the wedge mix at line level, from S32 OUT 1 to the amp\'s CH A input.',
    wrong: { speakon: 'speakON carries an amp\'s power out to a speaker. Going into the amp, the mix is at line level: XLR.' },
  },
  {
    id: 'amp-wedge', a: 'amp', b: 'wedge', cable: 'speakon', label: 'NX3000 CH A → wedge: speakON',
    why: 'speakON carries the amp\'s power to the wedge. XLR is for line level, and an instrument cable is never a speaker cable.',
    wrong: {
      instrument: 'An instrument cable is not a speaker cable: it\'s too thin for an amp\'s power. This amp\'s output is speakON.',
      xlr: 'XLR carries line level. The amp\'s power goes down a speakON.',
    },
  },
];

// Two pieces of gear that never get a cable between them, and why. Keys are in GEAR order.
export const NO_LINK = {
  'receiver|mic': { right: 'No cable: a wireless mic reaches its receiver by radio', why: 'It\'s a wireless mic. No cable: switch it on and it reaches its receiver by radio.' },
  'x32|mic': { right: LINKS[0].label, why: 'The mic is wireless. Its receiver is what gets a cable to the X32.' },
  'mic|s32': { right: LINKS[0].label, why: 'The mic is wireless, and its receiver lives at FOH, plugged into the X32. Nothing from the mic goes into the S32.' },
  'mic|amp': { right: LINKS[0].label, why: 'The mic has to go through the mixer first, or nobody can mix it.' },
  'mic|wedge': { right: LINKS[0].label, why: 'The mic has to go through the mixer first, or nobody can mix it.' },
  'receiver|s32': { right: LINKS[0].label, why: 'Salmon\'s wireless receivers plug into the X32\'s own rear panel (LOCAL inputs), not into the S32.' },
  'receiver|amp': { right: LINKS[0].label, why: 'The receiver goes into the mixer first. Skip the X32 and there\'s no mix to control.' },
  'receiver|wedge': { right: LINKS[0].label, why: 'The receiver goes into the mixer first. Skip the X32 and there\'s no mix to control.' },
  'x32|amp': { right: LINKS[1].label, why: 'In Salmon everything goes out through the S32. The X32 reaches it over AES50.' },
  'x32|wedge': { right: LINKS[1].label, why: 'In Salmon everything goes out through the S32. The X32 reaches it over AES50.' },
  's32|wedge': { right: LINKS[2].label, why: 'This wedge is passive: it needs an amp\'s power. S32 OUT 1 is line level, so it goes to the amp first.' },
};

// Where the signal has stopped, by how many stages it has passed (see reach() in the game).
export const STOPS = [
  'No signal at all. Is the mic switched on?',
  'The receiver hears the mic, but nothing reaches the X32.',
  'The X32\'s meter is moving, but nothing leaves the mixer for the stage. (Two things have to be true.)',
  'The S32 has the mix on OUT 1, but the amp gets nothing.',
  'The amp has signal, but the wedge is silent. (Two things have to be true.)',
];

export const SOURCE = 'the Salmon FOH lecture (Nov 2): Using AES50 · Inputs: LOCAL vs. AES50 · Outputs: Vocal Jazz wedges · Gain staging';
