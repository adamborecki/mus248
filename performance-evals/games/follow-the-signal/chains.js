// Salmon signal paths for Follow the Signal. Every hop and every decoy comes from a page students
// already have, named in `source`. Don't add a hop that isn't written down in one of those pages:
// a chain here is something a student will repeat in the room. If a source changes, change it here.
//
//   lecture   content/lectures/2026-11-02-salmon-foh.md, section 3 (Salmon FOH: Signal Flow and Gain Staging)
//   cme       content/activities/cme-gig-checklist.md (its I/O tables and the wedge steps)
//
// Salmon has TWO racks with a Crown amp in them, so every rack hop says which rack:
//   Mains rack  the hall's own, permanent: the Mix5 on top, a Crown inside for the installed speakers
//   Amp rack    the NX3000, two KM750s, and a Crown at the bottom (CME's downstage Yamahas)
//
// hops: the path in order, source first. decoys: real Salmon gear that is NOT on this path (each one
// is the wrong answer to a question in the same source). why: the one-line point, shown after the chain.

export const CHAINS = [
  {
    id: 'vj-wedges',
    gig: 'Vocal Jazz',
    title: 'The singers\' wedges',
    hops: ['MIX 1', 'S32 OUT 1', 'XLR (line level)', 'Amp rack: NX3000 CH A', 'speakON (amp power)', 'Three wedges, daisy-chained'],
    decoys: ['Amp rack: KM750 CH A', '1/4" instrument cable'],
    why: 'One mix, one amp channel, three wedges in a daisy chain. XLR carries the mix at line level; speakON carries the amp\'s power.',
    source: 'lecture: Outputs: Vocal Jazz wedges',
    lab: 'x32-vj-chain',
  },
  {
    id: 'vj-mains',
    gig: 'Vocal Jazz',
    title: 'A wireless singer to the hall\'s speakers',
    hops: ['Wireless handheld', 'Its receiver', 'X32 rear panel (LOCAL input)', 'MAIN L/R', 'AES50 (one Cat5e)', 'S32 OUT 15/16', 'Mains rack: the Mix5', 'Mains rack: its Crown', 'The hall\'s installed speakers'],
    decoys: ['S32 IN 25–32', 'Amp rack: its Crown'],
    why: 'Mics come in at the X32; everything goes out through the S32 over AES50. The hall\'s own mains rack has the Mix5 on top and its own Crown inside. The amp rack\'s Crown is a different amp, for CME\'s downstage speakers.',
    source: 'lecture: Using AES50 · Inputs: LOCAL vs. AES50 · Outputs: the mains · cme: The hall\'s speakers down, and its notes (the Mix5\'s MAIN OUT feeds the Crown at the rack\'s bottom)',
    lab: 'x32-vj-link',
  },
  {
    id: 'cme-bass',
    gig: 'CME',
    title: 'The bass, into the X32',
    hops: ['Bass', 'DI', 'Sub snake 5', 'S32 IN 29', 'AES50 (one Cat5e)', 'X32 CH 29 (AES50 A)'],
    decoys: ['X32 rear panel (LOCAL input)', 'Mains rack: the Mix5'],
    why: 'CME\'s band comes in on the sub snake to S32 IN 25–32, and reaches the X32 over AES50. That\'s why CH 25–32 are set to AES50 A.',
    source: 'cme: the S32 input table (CH 29: bass, through a DI) · lecture: Inputs: LOCAL vs. AES50',
    lab: 'x32-cme-tour',
  },
  {
    id: 'cme-mains',
    gig: 'CME',
    title: 'The band\'s own mains',
    hops: ['MAIN L/R', 'AES50 (one Cat5e)', 'S32 OUT 13/14', 'Amp rack: its Crown', 'Two Yamaha speakers, downstage'],
    decoys: ['Mains rack: its Crown', 'Mains rack: the Mix5'],
    why: 'Downstage of the band, every open mic is behind the speakers: much less feedback. These run on the amp rack\'s Crown. The hall\'s own speakers, on the mains rack\'s Crown, get turned down at the Mix5.',
    source: 'lecture: Outputs: the mains · cme: the S32 output table (OUT 13, 14)',
    lab: 'x32-cme-tour',
  },
  {
    id: 'cme-wedge-1',
    gig: 'CME',
    title: 'Wedge 1 (house left, passive)',
    hops: ['MIX 9', 'S32 OUT 9', 'Amp rack: KM750 CH A', '1/4" speaker cable', 'Wedge 1 (passive)'],
    decoys: ['1/4" instrument cable', 'Amp rack: NX3000 CH A'],
    why: 'Each CME wedge has its own mix, so each gets its own amp channel. Speaker cable (thick) is not instrument cable (thin): same plug, different job.',
    source: 'lecture: Outputs: CME wedges · cme: the passive wedge step',
    lab: 'x32-cme-tour',
  },
  {
    id: 'cme-wedge-3',
    gig: 'CME',
    title: 'Wedge 3 (house right, active)',
    hops: ['MIX 11', 'S32 OUT 11', 'XLR', 'Wedge 3 (active: its own power and VOLUME)'],
    decoys: ['Amp rack: KM750 CH B', 'speakON'],
    why: 'An active wedge has its amp inside: XLR straight in, plus its own IEC power cable and VOLUME knob.',
    source: 'lecture: Outputs: CME wedges · cme: the active wedge step',
    lab: 'x32-cme-tour',
  },
  {
    id: 'gain-house',
    gig: 'Gain staging',
    title: 'A voice into the house',
    hops: ['GAIN (preamp)', 'Channel fader', 'MAIN master', 'Amp level knob (set once)', 'Speaker'],
    decoys: ['Send level', 'MIX master'],
    why: 'GAIN is how hot it comes in, the fader is the mix in the mains, the master is how much of the mix leaves. Every stage up and unmuted, or nothing comes out.',
    source: 'lecture: Gain staging: the whole chain',
    lab: 'x32-vj-gain',
  },
  {
    id: 'gain-wedge',
    gig: 'Gain staging',
    title: 'A voice into a wedge',
    hops: ['GAIN (preamp)', 'Send level', 'MIX master', 'Amp level knob (set once)', 'Wedge'],
    decoys: ['MAIN master'],
    why: 'The fader sets the mains; the send sets each wedge. On the X32: SENDS ON FADERS.',
    source: 'lecture: Gain staging: the whole chain',
    lab: 'x32-vj-send',
  },
];

export const MIXER_LAB = 'https://adamborecki.github.io/mixer-lab/#/';
