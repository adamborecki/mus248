# Handoff: Musco Big Band / Jazz Combo multitrack (fall 2026)

Written Nov 10, 2026, from the instructor's dictated walkthrough and ~17 photos taken at the
Big Band / Jazz Combo concert setup at Musco (input list dated 10/30/2026; the Logic project folder
is named `261029 Jazz Combo Big Band`). This is the raw source for:

- **Lecture 11, section 4** (`content/lectures/other-gigs-musco-l20.md`, "Musco: Big Band and Jazz
  Combo"). Its **(confirm)** placeholders are answered under "For the lecture" below.
- **A new gig checklist** (`musco-multitrack-gig-checklist`), being built from this file.

Public repo: no MAC addresses, IPs, or desktop file listings here. **Albert** (ch 35) is the
director; the instructor said his name can stay.

## The big picture

- A normal Musco gig is the **multicam** crew in the booth ([Musco Gig Checklist](../activities/musco-gig-checklist.md)).
  Big Band and Jazz Combo (about two concerts a year) are multicam **as normal, plus a live
  multitrack recording** with a mix you can use later.
- **Upstairs: the DiGiCo** (Dante devices `DiGiCo-338-…`, `DiGiCo-225-…`; 338/225 are very likely
  DiGiCo Quantum 338/225 console models, not room numbers: **unconfirmed**). It runs the live show.
- **Basement: the recording room.** A Yamaha **CL5**, the room's computer
  (`MUSCO-RecordingStudio-MacPro`, Logic), studio monitors, and a drawer where a laptop sits.
- **Everything travels on one Dante network** for the whole building: the stage mics, the mains,
  the monitor mixes. **Dante Controller on any of these computers can change the live show's
  routing.** One wrong click on the wrong receiver can wreck the concert. This is the #1 safety
  point: arrive early, set up early, and only ever touch the recording computer's receiver rows.
- **New this semester: the CL5 writes the mix.** The CL5's fader moves go out as MIDI into Logic and
  get recorded as **automation** (Latch). So the engineer on the CL5 in the basement isn't just
  mixing for themselves; their moves become a real mix of the multitrack that can be used later.

## Signal flow

```
Stage mics ─ sub snake boxes 1–3 (+ one home run) ─ DiGiCo (upstairs)
   └─ Dante: DiGiCo-338-Slot2, channels 01–40, one-to-one ("338- Dante 01–40" on the input list)
Room mics (ORTF pair) ─ Dante: Booth01VSubMix 01/02 ─ receiver channels 39/40

Dante receivers (basement):
  1. Y001-Yamaha-CL5-…            the CL5. 01–16 ← Slot2 01–16 (seen); 39/40 ← Booth01VSubMix 01/02
  2. MUSCO-RecordingStudio-MacPro  the room's computer, Dante Virtual Soundcard (DVS) → Logic
  3. The department MacBook Pro    DVS → Logic (the one used this time; shows up as MUS-SHARED-DP)

CL5 MIDI OUT (5-pin DIN) ─ USB MIDI interface ─ USB-C dongle ─ MacBook ─ Logic (fader automation)
```

- Primary Leader Clock: `DiGiCo-338-Slot1`.
- Devices on the network (Dante Controller, Oct 29/30): Booth01VSubMix, CCArcadi-210960,
  DiGiCo-225-Slot1, DiGiCo-338-Slot1, DiGiCo-338-Slot2, DiGiCo-338-Transform,
  MUSCO-Booth-Projection, MUSCO-FOH-AUDIOBACKUP, MUSCO-RecordingStudio-MacPro,
  Y001-Yamaha-CL5-…, Y004-Yamaha-Tio1608-D-…, Y007-Shure-AD4Q-…, plus the laptop once DVS starts.
- The CL5 also receives 41–45 from `DiGiCo-338-Slot1` (not on the input list; unknown purpose).

## Input list (one list for the whole show, set for Big Band)

Every channel's Dante output is the same number as its channel ("338- Dante 01" … "40").

| CH | Source | Mic | Stand | Sub snake |
|---|---|---|---|---|
| 1 | Kick | B-52 | Short boom | Box 1-1 |
| 2 | Snare | SM57 | Short boom | Box 1-2 |
| 3 | Hat | AKG 391 | Short boom | Box 1-3 |
| 4 | OH L | AKG 391 | Tall boom | Box 1-4 |
| 5 | OH R | AKG 391 | Tall boom | Box 1-5 |
| 6 | Bass | DI | | Box 1-6 |
| 7 | Guitar | 609 | | Box 1-7 |
| 8–12 | Sax 1–5 | 421 | Short boom | Box 1-8 … 1-12 |
| 13–15 | Bone 1–3 | SM57 | Tall boom | Box 2-1 … 2-3 |
| 16–20 | Trumpet 1–5 | SM57 | Tall boom | Box 2-4 … 2-8 |
| 21 | Piano L | 414 | | Box 3-1 |
| 22 | Piano H | 414 | | Box 3-2 |
| 23 | Key L | DI | | Box 3-3 |
| 24 | Key R | DI | | Box 3-4 |
| 25–28 | Perc | KSM44 | Tall boom | Box 3-5 … 3-8 |
| 29 | Solo | 421 | Tall boom | Home run |
| 30 | — | | | |
| 31–34 | HH 01–04 | SM58 | Tall boom | |
| 35 | HH 05 Albert | | | |
| 36–38 | — | | | |
| 39 | ORTF L | | | (Booth01VSubMix 01) |
| 40 | ORTF R | | | (Booth01VSubMix 02) |

- The printed sheet labels row 39 as a second "38". The Dante routing agrees with the
  sheet's order, and the instructor said to go with that: **ORTF is 39/40**.
- Mic names are as printed (the sheet has no brands); not yet checked against the mic locker.
- **Jazz Combo uses the same input list.** The combo sits in different chairs but on the same
  mics, so you have to know which combo player is on which big band channel, as if it were labeled
  that way. Nobody has written the combo's chair map yet.

## The recording computer: plan A and the backup

- **Plan A this time was the department's new MacBook Pro**, bought for the music department: new,
  fast processor, fast internal storage, very reliable. It sat in the drawer next to the CL5 and
  **recorded the whole concert without trouble**. The MIDI link was working on it by the second half.
- The **instructor's personal laptop** was the backup (on the shelf).
- The room's **Mac Pro misbehaved** this time: its Dante Controller showed "Retrieving model
  information - please wait", "Error: Cannot retrieve Device Latency", and 0 receivers, and the
  laptop's Dante Controller showed it in red. Cause unknown. The same steps apply to it when it works.

### Connecting the laptop

- **Bring one USB-C dongle that has both Ethernet and USB-A.** Ethernet is the Dante connection;
  USB-A is for the MIDI interface. One dongle, both jobs. Allow the accessory when macOS asks.
- Behind the desk there are **three yellow Ethernet cables**: one to the Mac Pro, one to the CL5,
  and one **spare**. The spare goes to the laptop. (Which is which isn't labeled: confirm on site,
  never unplug the other two.)
- DVS warns that the dongle's chip (AX88179A) only links at **480 Mbps** (USB 2 speed; 1 Gbps is
  recommended). It worked fine for 40 channels. Expect the warning; it isn't the failure.
- **Dante Virtual Soundcard and Dante Controller up to date** on both computers. Update well before
  the gig if you can; on the day only if you have to.
- First launch of Dante Controller: "Configure Dante Interfaces in unmanaged mode" → Use shared
  Dante interface, Primary = the dongle's interface (`en8` on that laptop), Secondary = None.

### Dante Controller: subscribe the recording computer only

- Find your own computer first: **⌘D** opens Device View; the dropdown names each device. The
  receiver row with the computer's name is the only row you touch.
- Use **Filter Receivers** (type part of the computer's name, e.g. "studio") so the other
  receivers aren't even on screen.
- Subscribe its channels to `DiGiCo-338-Slot2` one-to-one (01→01, 02→02 …), and 39/40 to
  `Booth01VSubMix` 01/02. White squares are subscriptions still being made; green checks are done.

### Logic

- New empty project → **Audio → Mic or Line**, **40 tracks**, Input 1, **Ascending** on (inputs
  1–40), **mono** inputs, **Input Monitoring** and **Record Enable** on, output Stereo Output.
- Settings → Audio → Devices: Input = **Dante Virtual Soundcard**; Output = the computer's speakers
  or headphones; I/O buffer **1024** (Logic showed ~49 ms round trip on the Mac Pro, ~63 ms on the
  laptop; latency doesn't matter for recording only).
- **Save before the test recording**, with a good name (date + ensemble, e.g.
  `261029 Jazz Combo Big Band`), organized as a **Folder, not a Package**, "Copy audio files" on.
  This time it went on the Desktop, "which isn't great". A better standard location is still open.
- Do a **test recording** of every track before the doors open.
- **Waveform zoom** in Logic is worth showing: it makes quiet tracks readable without changing them.
  (No photo yet; exact button not documented.)

## CL5 → MIDI → Logic automation (new, worth keeping)

Took real time to get working this gig. Plan extra setup time and a practice run, and be careful:
hopefully the setup is saved and won't change, but check it.

**Hardware:** CL5 **MIDI** 5-pin DIN port → USB MIDI interface → the USB-A on the same dongle as
the Ethernet. (Which CL5 port, OUT or IN, isn't stated; it must be OUT for faders → Logic.)

**On the CL5:** **SETUP → MIDI/GPI**. By default it sends high-resolution faders, **Fader H and
Fader L** for each channel. **Turn off all the Fader L entries; use only Fader H.** MIDI channel:
left at the default.

- What happened: **channels 1–31 went straight out, and channels 32–40 started at 64** and went up.
  Nobody knew why. Likely reason (unverified): in MIDI, controller numbers **32–63 are reserved as
  the fine (LSB) half of 0–31**, which is exactly what Fader L sends. A CC table that leaves room for
  them has to skip to 64 after 31.

**In Logic (Learn):**

1. Move a fader in Logic, then **⌘L** (Learn).
2. Move the matching fader on the CL5.
3. In the assignment, make sure it's **Fader Bank 1**, not **Selected** fader.
4. Go to fader **31** in Logic, move it, move CL5 fader 31, then turn Learn off. Logic filled in
   the ones between on its own ("it would learn all of the stuff").
5. Repeat for the next block (32–40, the ones that start at 64).

**Automation:** every track's automation mode on **Latch** before recording; that's essential.
After the concert, switch them back to **Read**.

**Not checked:** whether 0 dB on the CL5 lands at 0 dB in Logic (the two fader curves likely
differ). It's a starting mix, not a calibrated one.

## For the lecture (answers to section 4's (confirm) lines)

- **How the multitrack is captured downstairs:** Dante → Dante Virtual Soundcard on a computer in
  the basement → Logic, 40 tracks. This time on the department MacBook Pro in the drawer next to the
  CL5, because the room's Mac Pro wouldn't talk to Dante.
- **What the CL5 is mixing:** its fader moves are recorded into Logic as automation, so the live
  mix in the basement becomes a usable mix of the multitrack. (Whether the CL5's audio also feeds
  anything else, e.g. the stream, wasn't said.)
- **How the CL5 connects to the CL3 in OH 207:** not covered in this walkthrough. Still open.
- Teaching beats that came up: the Dante network is the whole building (danger); one input list,
  two ensembles; Folder not Package; Latch then Read; the MIDI 1–31 / 64+ puzzle.

## Still open

- Which CL5 MIDI port (OUT, presumably) and which MIDI interface to bring.
- Is the CL5 MIDI/GPI setup saved on the console? Is there a Logic template with the controller
  assignments, so the next crew doesn't redo Learn?
- What broke on the Mac Pro.
- Where the Logic project should be saved (not the Desktop) and how it leaves the room.
- The Jazz Combo chair map.
- Concert date: input list says 10/30, project folder says 261029.
- Exact Logic path for waveform zoom.
