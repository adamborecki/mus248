> 🤖 **AI use:** imported from the lecture deck *MUS248 Live Sound 4 parts.pptx* (Part 3), then
> reorganized into numbered sections, with follow-along blanks and new slides (DI or no DI, stage
> box vs. snake, pre- vs. post-fader, line check vs. sound check) written with Claude Code from the
> instructor's notes on Oct 26.

> 🧑‍🏫 Moved up to Oct 26 (lecture 09). Follow-along blanks are in, so notes print from 📝.
> Refresher questions were written Nov 2 from the delivered text (the refresher opens Nov 2,
> 7:00 AM).

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

**Previously:** One channel can feed more than one ==destination==.

**Today:** Build a system that is organized, audible, and understandable to the next person.

### The Question for Today

A working system is not enough.

Can another ==engineer== quickly tell:

- What each channel is?
- Where each cable goes?
- Which output feeds which speaker?
- What has ==changed== since the last setup?

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

Source → microphone / ==DI== → stage cable → mixer input → channel → buses → outputs → speakers

The ==physical patch== and the mixer's internal ==routing== both matter.

**Q1 (multiple choice).** In a live system, which two things both have to be right for a source to reach the speakers?

- a) The microphone brand and the speaker brand
- ✅ b) The physical patch and the mixer's internal routing
- c) The fader position and the meter color

✅ **Answer.** The cables on stage (the physical patch) and where the mixer sends each channel
(routing) are both part of the path. A mistake in either one breaks it.

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

**Q2 (multiple choice).** Before you connect any source, what two questions do you ask?

- a) How long is the cable, and what color is it?
- ✅ b) What kind of signal does it produce, and what input does the mixer expect?
- c) How loud is it, and who owns it?

✅ **Answer.** Match the source's signal to the input the mixer expects before plugging anything
in. A stereo laptop or phone, for example, needs two channels: left and right.

### Stage Box vs. DI Box vs. Snake

Three different things that all live on stage:

| | What it is | How many channels | Does it change the signal? |
|---|---|---|---|
| **==DI box==** | Converts one instrument or line source into a balanced, mic-level signal | Usually 1 or 2 | **Yes** |
| **==Snake==** (analog) | Many cables in one jacket: a box of XLR jacks on stage, separate tails at the mixer | 8 to 48+ | No: just long cables |
| **Digital ==stage box==** | Mic preamps and converters on stage; sends everything to the mixer over one ==network== cable (AES50, Dante) | 8 to 32+ | Yes: digitizes it, gain set from the console |

A DI plugs **into** a snake or stage box. It doesn't replace either one.

People also call the stage end of an analog snake a "stage box." Ask which one they mean.

**Q3 (multiple choice).** Which one is just many cables in one jacket, and doesn't change the signal?

- a) A DI box
- ✅ b) An analog snake
- c) A digital stage box

✅ **Answer.** An analog snake is just long cables. A DI box converts a source; it plugs **into** a
snake or stage box and doesn't replace either one.

**Q4 (multiple choice).** How does a digital stage box get its signals to the mixer?

- a) One XLR tail per channel
- ✅ b) One network cable (AES50 or Dante)
- c) A ground lift switch

✅ **Answer.** A digital stage box has the mic preamps and converters on stage, sends everything over
one network cable, and its gain is set from the console.

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

**Q5 (fill in the blank).** A DI box converts an ==unbalanced== source to a balanced connection.

✅ **Answer.** A DI turns an unbalanced source into a balanced, low-impedance signal a mixer input
can use, which helps long cable runs reject noise. It's more than an adapter.

**Q6 (multiple choice).** Which kind of DI needs phantom power or a battery?

- ✅ a) An active DI
- b) A passive DI
- c) Both kinds

✅ **Answer.** An active DI needs phantom power or a battery. A passive DI needs neither.

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

**Q7 (multiple choice).** Which source most needs a DI box?

- ✅ a) A bass with passive pickups
- b) An audio interface's balanced line outputs
- c) A dynamic microphone

✅ **Answer.** Passive pickups are high impedance; into a mic input they sound thin and quiet.
Balanced line outputs can often go straight into the stage box with the gain turned down.

**Q8 (multiple choice).** A laptop's headphone jack goes straight into the stage box with no DI, and
it hums. What's the fix?

- a) Turn up the gain
- ✅ b) Add a DI and use its ground lift
- c) Use a longer cable

✅ **Answer.** A headphone jack is unbalanced. A short run may work without a DI, but if it hums,
a DI with its ground lift switch is the fix. Bring DIs anyway, and line check every source.

## 2. Organize and Label

### Channel Organization

Channel order should help you work quickly.

A common live-sound layout groups ==similar== sources together:

1. ==Drums== / percussion
2. Bass
3. Guitars
4. Keys / playback
5. Lead vocal
6. Backing vocals
7. Special sources

The exact order can vary. The useful habit is ==consistency==.

**Q9 (fill in the blank).** Channel order can vary from gig to gig. The useful habit is
==consistency|consistent==.

✅ **Answer.** Group similar sources together and keep the same order every time, so you can find
any channel quickly.

### Drums Come First

Inside the drums, the order is almost always the same:

1. ==Kick==
2. ==Snare== (top, then bottom if there is one)
3. Hi-hat
4. ==Toms== (high to low)
5. ==Overheads== (left, then right)

**Kick first, snare second, overheads last.** Most input lists start this way, so most engineers
can find the kick on channel 1 without looking.

**Q10 (multiple choice).** On most input lists, what is on channel 1?

- a) Lead vocal
- ✅ b) Kick
- c) Overhead left

✅ **Answer.** Kick first, snare second, overheads last. Because most input lists start this way,
most engineers can find the kick on channel 1 without looking.

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

**Q11 (multiple choice).** What's the rule for deciding what to label?

- a) Label every cable, knob, and case
- ✅ b) Label what someone can't figure out in five seconds
- c) Label only the speakers

✅ **Answer.** Label what the next person can't figure out in five seconds: always channel names,
stage box inputs in use, and which output feeds which speaker. Shared gear gets more.

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

**Q12 (multiple choice).** When you set input gain, how loud should the source be performing?

- a) Quietly, to protect the speakers
- ✅ b) At realistic volume
- c) As loud as it can possibly play

✅ **Answer.** Gain staging sets usable levels at every point in the system. Set gain with the
source at realistic volume, then watch for clipping at every stage.

### Gain Versus Channel Fader

**Gain / Trim:** Sets the level ==early== in the channel path.

- Too low: ==Noise== becomes more noticeable. You may need excessive fader/output level.
- Too high: The preamp or channel can ==clip== before the fader can fix it.

**Channel Fader / Level:** Sets how much of that prepared channel enters a ==destination== mix.

**Q13 (multiple choice).** A channel's input gain is set so high that it clips. Can the channel fader
fix it?

- a) Yes: pull the fader down
- ✅ b) No: it clips before the fader
- c) Yes, as long as the Main fader is low

✅ **Answer.** Gain sets the level early in the channel, so too much clips before the fader can
help (too little brings noise). The fader only sets how much goes to a destination mix.

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

**Q14 (multiple choice).** The monitor sends are pre-fader. FOH pulls the vocal's channel fader down.
What happens to the singer's monitor mix?

- ✅ a) Nothing changes
- b) It gets quieter
- c) It gets louder

✅ **Answer.** A pre-fader send ignores the channel fader, so the monitor mix stays put. That's why
monitor sends are often pre-fader. Effects sends are usually post-fader.

**Q15 (multiple choice).** With pre-fader monitor sends, FOH turns up a channel's gain mid-show. What
changes?

- a) Only the Main mix
- b) Only that channel's monitor mix
- ✅ c) Main, the monitor mix, and every other send

✅ **Answer.** Gain is upstream of everything. Touching it during a show changes every mix at once,
including the performers' monitors.

## 4. Line Check and Sound Check

### Line Check vs. Sound Check

**==Line check==:** fast. Does every input arrive on the right channel, with signal? Nothing
muted, broken, or mis-patched. ==Minutes==, not an hour.

**==Sound check==:** slower. Properly setting gain, tone, and monitor mixes with the ==performers==
playing.

A sound check is still **not a ==rehearsal==**. It's for the system, not for running the set.

| | Line check | Sound check |
|---|---|---|
| Question | Is everything there? | Does it sound right? |
| Who plays | Anyone: a tech, a "check," a few notes | The performers, at show volume |
| Time | A few minutes | Longer |
| When | Every time, even right before doors | When there's time for it |

**Q16 (multiple choice).** Which one is a line check?

- ✅ a) A fast check that every input arrives on the right channel, with signal
- b) The performers playing at show volume while you set gain, tone, and monitor mixes
- c) Running the set once before doors

✅ **Answer.** A line check takes minutes: is everything there? A sound check is slower and sets
gain, tone, and monitors with the performers. Neither one is a rehearsal.

**Q17 (multiple choice).** Doors open in ten minutes and there's no time for a sound check. What do you
still do?

- a) Skip checking and trust the patch
- ✅ b) A line check
- c) A full rehearsal

✅ **Answer.** A line check happens every time, even right before doors. A sound check happens when
there's time for it.

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

**Q18 (multiple choice).** During a line check, a source shows up on the wrong channel. When do you fix
it?

- a) After every source has been checked
- ✅ b) Right away, before moving on to the next source
- c) During the sound check

✅ **Answer.** The last step of each source's line check is to label or correct the issue before
moving on. Then confirm Main and the monitors it needs.

### Example Line Check

- **Vocal Jazz or A cappella:** Each person says "==check==."
- **Band:** Each instrument plays a few ==notes==.
- **Laptop or playback:** A few seconds of the actual track, both ==left and right==.

**Q19 (multiple choice).** How do you line check a laptop playing a backing track?

- a) Someone says "check" into it
- ✅ b) Play a few seconds of the actual track, and check both left and right
- c) Play the loudest part of the whole set

✅ **Answer.** Play a few seconds of the real track and confirm both left and right arrive. A
stereo source is two channels.

## 5. Mistakes and Resets

### Common Patching Mistakes

- Plugging line-level playback into a mic path without managing ==level==.
- Treating XLR as a signal type instead of a ==connector==.
- Forgetting that a stereo source needs left and right planning.
- Connecting a mixer output directly to a ==passive== speaker.
- Using the wrong ==power supply== because the plug fits.
- Sending a source to the wrong channel or wrong monitor.
- Leaving unlabeled mystery cables for the next person.

**Q20 (fill in the blank).** XLR is a ==connector==, not a signal type.

✅ **Answer.** The same XLR cable can carry a mic-level or a line-level signal. Know what's on it,
and manage the level when line-level playback goes into a mic path.

**Q21 (multiple choice).** Which one is a common patching mistake?

- ✅ a) Connecting a mixer output directly to a passive speaker
- b) Patching a DI into the stage box
- c) Putting the kick on channel 1

✅ **Answer.** A passive speaker has no amp inside, so a mixer output alone can't drive it. Also on
the list: using a power supply because the plug fits, and leaving mystery cables.

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

**Q22 (multiple choice).** Resetting a station: what gets turned off first?

- ✅ a) The amplified speakers
- b) The mixer
- c) The stage box

✅ **Answer.** Amplified speakers go off first. Mute channels, Aux, and Main (lower them only if you
know where they belong, such as a saved scene), and never overwrite a shared scene.

## 6. Summary

### Summary of Important Things

From a patch plan, you should be able to:

1. Patch a microphone.
2. Patch a DI or line-level source (and say whether it needs the DI).
3. ==Label== the channels.
4. Set ==gain== for each source.
5. Complete a short ==line check==.
6. Send the needed sources to Main and Aux destinations.
7. Explain the entire ==signal path==.

**Q23 (short answer).** A bass with passive pickups is playing through the house speakers. Trace its
signal path from the instrument to the speakers.

✅ **Answer.** Bass → DI box (passive pickups need one) → stage cable into the snake or stage box →
mixer input (gain) → channel (fader) → buses (Main, plus any aux sends) → outputs → speakers.

### Coming Up: Live Sound Part 4

Live Sound 4 combines the full system:

- Troubleshooting signal flow
- Main mix versus monitor mix versus recording feed
- Stereo board feeds and multitrack feeds
- Finding the actual ==fault==
- Resetting and handing off a working rig

## 🗝️ Key terms

**DI box** · **snake** · **stage box** · **balanced / unbalanced** · **impedance** · **ground lift**
· **gain staging** · **gain / trim** · **clipping** · **pre-fader / post-fader** · **PFL / AFL** ·
**line check** · **sound check** · **scene**

## 💭 Before you leave

- Name one source you'd plug straight into the stage box, and one that needs a DI. Why?
- Mid-show, the singer says their monitor got louder. What did FOH probably touch?
