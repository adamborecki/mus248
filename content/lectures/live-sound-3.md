> 🤖 **AI use:** imported from the lecture deck *MUS248 Live Sound 4 parts.pptx* (Part 3), then
> reorganized into numbered sections, with follow-along blanks and new slides (DI or no DI, stage
> box vs. snake, pre- vs. post-fader, line check vs. sound check) written with Claude Code from the
> instructor's notes on Oct 26.

> 🧑‍🏫 Moved up to Oct 26 (lecture 09); Vibecoding 2 is now Nov 2. Follow-along blanks are in, so
> notes print from 📝. No refresher questions yet: they get written from the final text (the
> refresher opens Nov 2, 7:00 AM).

## 📣 Announcements

### Homework review

**Today:** Week 10 · Class 9

**After today:** 5 classes (4 + 1 meeting in finals week)

Everything due this week, with due dates: **see Canvas**.

- **Follow-along notes:** photos of today's notes, on Canvas
- **Online refresher for Vibecoding 1:** open since this morning. Copy the Canvas deliverable into
  the Canvas assignment
- **Finished an activity or a checklist?** Fill out the Repo Improvement form

> 🧑‍🏫 Check this list against Canvas before class: is there a quiz tonight?

## 🎤 Lecture: Live Sound Part 3 — System Workflow: Patching, Gain Staging, and Line Check

### Live Sound Part 3: System Workflow

**Previously:** One channel can feed more than one destination.

**Today:** Build a system that is organized, audible, and understandable to the next person.

### The Question for Today

A working system is not enough.

Can another engineer quickly tell:

- What each channel is?
- Where each cable goes?
- Which output feeds which speaker?
- What has changed since the last setup?

### Today

1. From Stage to Mixer
2. Organize and Label
3. Gain Staging
4. Line Check and Sound Check
5. Mistakes and Resets
6. Summary

## 1. From Stage to Mixer

### The Live Signal Path

A typical live path:

Source → microphone / DI → stage cable → mixer input → channel → buses → outputs → speakers

The ==physical patch== and the mixer's internal ==routing== both matter.

### Inputs Start at the Source

Common source types:

- ==Dynamic== microphone
- ==Condenser== microphone
- Instrument through a DI
- Keyboard or playback device at line level
- Stereo laptop/phone playback (two channels: left and right)
- Wireless receiver output

Ask two questions before connecting anything:

1. What kind of ==signal== does this source produce?
2. What ==input== does the mixer expect?

### Stage Box vs. DI Box vs. Snake

Three different things that all live on stage:

| | What it is | How many channels | Does it change the signal? |
|---|---|---|---|
| **==DI box==** | Converts one instrument or line source into a balanced, mic-level signal | Usually 1 or 2 | **Yes** |
| **==Snake==** (analog) | Many cables in one jacket: a box of XLR jacks on stage, separate tails at the mixer | 8 to 48+ | No: just long cables |
| **Digital ==stage box==** | Mic preamps and converters on stage; sends everything to the mixer over one ==network== cable (AES50, Dante) | 8 to 32+ | Yes: digitizes it, gain set from the console |

A DI plugs **into** a snake or stage box. It doesn't replace either one.

People also call the stage end of an analog snake a "stage box." Ask which one they mean.

> 🧑‍🏫 Salmon's X32 uses an S32 and an SD8 stage box on AES50 (see the Electroacoustic Showcase
> gig checklist). The Dante lecture (Sep 14) is the other networked example.

### DI Boxes

A DI box helps connect an instrument or unbalanced source to a mixer.

Typical path: Instrument → DI → XLR mic input on mixer (or snake / stage box)

A DI often:

- Converts an ==unbalanced== source to a ==balanced== connection.
- Provides a low-==impedance== signal suitable for a mixer input.
- Helps long cable runs reject noise.
- May need ==phantom== power or a battery if it is **active**. A **passive** DI needs neither.
- Often has a ==ground lift== switch for hum.

A DI is not simply "an adapter that makes a guitar fit."

### Do You Need a DI Box?

**Usually, a DI is a good idea.** But it isn't always required.

- **Passive guitar or bass ==pickups==:** yes. They're high impedance, and a mic input makes them
  thin and quiet.
- **Audio interface ==line outputs== (TRS or XLR):** often already balanced and low impedance. They
  can go straight into the stage box with the ==gain== turned down.
- **Laptop or phone headphone jack:** unbalanced. A short run may work without a DI; if it ==hums==,
  the DI (with ground lift) is the fix.

**Real example:** at the Electroacoustic Showcase, several laptops and audio interfaces went
straight into the stage box, no DI, and sounded fine.

It won't always work. Bring DIs anyway, and line check every source.

## 2. Organize and Label

### Channel Organization

Channel order should help you work quickly.

A common live-sound layout groups similar sources together:

1. Drums / percussion
2. Bass
3. Guitars
4. Keys / playback
5. Lead vocal
6. Backing vocals
7. Special sources

The exact order can vary. The useful habit is ==consistency==.

### Drums Come First

Inside the drums, the order is almost always the same:

1. ==Kick==
2. ==Snare== (top, then bottom if there is one)
3. Hi-hat
4. Toms (high to low)
5. ==Overheads== (left, then right)

**Kick first, snare second, overheads last.** Most input lists start this way, so most engineers
can find the kick on channel 1 without looking.

### Label What the Next Person Needs

Not everything needs a label. Label what someone **can't figure out in five seconds**.

**Always:**

- ==Channel names== on the console (the digital name and/or console tape)
- Inputs on the snake or stage box that are in use
- Which ==output== feeds which speaker or monitor

**Great ideas when gear is shared:**

- Performer or ==monitor position==
- Power supplies that look alike (keep each with its device)
- Cable ownership or storage location

A clear label saves more time than an impressive ==memory==.

## 3. Gain Staging

### Gain Staging

Gain staging means setting usable ==levels== at every major point in the system.

A basic sequence:

1. Start channel and output levels low.
2. Make the source perform at ==realistic== volume.
3. Set input ==gain/trim== for a healthy meter level.
4. Set channel level for the mix.
5. Set Main and Aux output levels for the room or monitor.
6. Watch for ==clipping== at every stage.

Gain and fader are not interchangeable controls.

### Gain Versus Channel Fader

**Gain / Trim:** Sets the level ==early== in the channel path.

- Too low: ==Noise== becomes more noticeable. You may need excessive fader/output level.
- Too high: The preamp or channel can ==clip== before the fader can fix it.

**Channel Fader / Level:** Sets how much of that prepared channel enters a ==destination== mix.

### Reminder: Pre-Fader vs. Post-Fader

A send taps the channel either ==before== or ==after== the channel fader.

- **Pre-fader:** ignores the fader. Monitor sends are often pre-fader.
- **Post-fader:** follows the fader. Common for effects sends.

With pre-fader monitor sends:

- Change the **fader** (the Main level): the monitor mix ==doesn't change==.
- Change the **gain/trim**: the monitor mix ==changes==. So do Main and every other send.

Gain is ==upstream== of everything. Touching it during a show changes every mix at once, including
the performers' monitors.

**Same idea for listening:** **PFL** (pre-fader listen) hears the channel before the fader;
**AFL** (after-fader listen) hears it after.

## 4. Line Check and Sound Check

### Line Check vs. Sound Check

**==Line check==:** fast. Does every input arrive on the right channel, with signal? Nothing
muted, broken, or mis-patched. Minutes, not an hour.

**==Sound check==:** slower. Properly setting gain, tone, and monitor mixes with the performers
playing.

A sound check is still **not a ==rehearsal==**. It's for the system, not for running the set.

| | Line check | Sound check |
|---|---|---|
| Question | Is everything there? | Does it sound right? |
| Who plays | Anyone: a tech, a "check," a few notes | The performers, at show volume |
| Time | A few minutes | Longer |
| When | Every time, even right before doors | When there's time for it |

### A Line Check Is Not a Concert

A line check answers: Does every source arrive on the expected channel and make usable signal?

A basic line-check sequence:

1. Identify the source.
2. Confirm the expected ==channel==.
3. Ask for signal.
4. Check ==meter/PFL==.
5. Confirm Main and required ==monitor== destinations.
6. ==Label== or correct the issue before moving on.

Setting gain properly (and tone, and monitor mixes) is the sound check.

### Example Line Check

- **Vocal Jazz or A cappella:** Each person says "==check==."
- **Band:** Each instrument plays a few notes.
- **Laptop or playback:** A few seconds of the actual track, both left and right.

## 5. Mistakes and Resets

### Common Patching Mistakes

- Plugging line-level playback into a mic path without managing ==level==.
- Treating XLR as a signal type instead of a ==connector==.
- Forgetting that a stereo source needs left and right planning.
- Connecting a mixer output directly to a ==passive== speaker.
- Using the wrong ==power supply== because the plug fits.
- Sending a source to the wrong channel or wrong monitor.
- Leaving unlabeled mystery cables for the next person.

### A Good Reset Is Part of the Job

Before leaving a station:

- Turn ==amplified speakers== off **first**.
- ==Mute== channels, Aux, and Main. Lower them only if you know where they belong (for example,
  saved in a ==scene==).
- Disconnect and coil cables correctly.
- Return equipment to its home location.
- Keep matching power supplies with their devices.
- Do not ==overwrite== shared console scenes.
- Leave clear labels or notes for the next person.

A clean reset makes the next setup safer and faster.

## 6. Summary

### Summary of Important Things

From a patch plan, you should be able to:

1. Patch a microphone.
2. Patch a DI or line-level source (and say whether it needs the DI).
3. Label the channels.
4. Set gain for each source.
5. Complete a short line check.
6. Send the needed sources to Main and Aux destinations.
7. Explain the entire ==signal path==.

### Coming Up: Live Sound Part 4

Live Sound 4 combines the full system:

- Troubleshooting signal flow
- Main mix versus monitor mix versus recording feed
- Stereo board feeds and multitrack feeds
- Finding the actual fault
- Resetting and handing off a working rig

## 🗝️ Key terms

**DI box** · **snake** · **stage box** · **balanced / unbalanced** · **impedance** · **ground lift**
· **gain staging** · **gain / trim** · **clipping** · **pre-fader / post-fader** · **PFL / AFL** ·
**line check** · **sound check** · **scene**

## 💭 Before you leave

- Name one source you'd plug straight into the stage box, and one that needs a DI. Why?
- Mid-show, the singer says their monitor got louder. What did FOH probably touch?
