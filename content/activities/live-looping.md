---
id: live-looping
title: Live Looping Rig
emoji: "🔁"
coreSkillAreas:
  - Audio Capture
  - Live Sound
status: In Development
revised: "2026-09-20"
estimatedTime: "45–55 minutes"
access:
  mode: On campus
  location: "The rig lives at the B205D station. Everything you need is at the station."
  supervision: "None required."
groupSize:
  minimum: 2
  ideal: "2–3"
  maximum: 3
  solo: false
activityFamily: ""
level: "G3X · RC-30 · MicroKorg · B205D"
roundsSupported: true
---

## 🎚️ Core skill area

**Live Sound** and **Audio Capture** — building a performance rig one signal path at a time.

## 🌍 Why this matters

A live-looping rig is five boxes that all have to be right at once. When it does not make sound,
the temptation is to start wiggling cables everywhere. That never finds the fault.

The discipline this activity teaches is the one that scales to a whole recital: **add one path,
prove it, then add the next.** If you build the rig in that order, a failure can only be in the
thing you just added, and you find it in seconds instead of tearing the whole rig down.

## 🎯 What you'll practice

- 🔌 Build and test a small live-performance audio system one signal path at a time.
- 🧭 Identify the input, output, cable type, and B205D channel for each major connection.
- 🔁 Record and play back a loop while continuing to hear live guitar or uke.
- 🔇 Bring up the most feedback-prone path last, and know what to reach for when it howls.

## 🗝️ Key terms

**signal path** · **loop / looper** · **PRE vs POST** · **balanced output** · **1/4-inch TS** ·
**XLR** · **TS-to-RCA** · **center-positive / center-negative** · **feedback** · **vocoder** ·
**gain staging** · mix bus · monitor position

## 📍 Logistics

**Estimated time:** 45–55 minutes.

**Where:** The B205D station. The rig, its power supplies, and the cables all live there.

**Group size:** Minimum 2 · ideal 2–3 · maximum 3. This one is not a solo activity — someone has
to watch levels while someone else patches.

**Roles:** Rotate at each **🔄 Switch roles** instruction.

- **Patch operator** — makes the physical connections.
- **Signal tracer** — follows the signal and answers the check questions.
- **Level and safety operator** — watches power supplies and levels while anyone patches.

## 🧰 Equipment and materials

- [ ] Guitar or uke
- [ ] Zoom G3X
- [ ] Boss RC-30
- [ ] MicroKorg
- [ ] Behringer B205D
- [ ] Wireless headset system (bodypack + receiver)
- [ ] Zoom V3
- [ ] The device-specific power supplies
- [ ] The cables listed at the station
- [ ] This page on your phone

## ⚠️ Safety and handling — read this before you touch anything

> ⚠️ **Never swap the two 9V adapters.** The MicroKorg uses its tested center-positive Korg
> adapter. The Boss RC-30 uses a center-negative Boss PSA-type adapter. The wrong adapter can
> destroy the pedal. Stop and ask if anything is unclear.

Before patching or powering up, turn B205D **Channel 3, Channel 2, Channel 1, and MAIN LEVEL
fully down.** Leave phantom power off. Keep the vocal path off until the instrumental paths work.

🚩 **Checkpoint.** Before any power comes on: all three channel faders and MAIN LEVEL are at
zero, phantom power is off, and each power supply is sitting with its own device.

## 🧭 Signal flow

### Live instrument

1. Guitar or uke → G3X INPUT with a 1/4-inch instrument cable.
2. G3X OUTPUT L/MONO → B205D Channel 3 Right with the red 1/4-inch TS-to-RCA leg.
3. G3X BALANCED OUT → RC-30 MIC IN with XLR. Set the G3X balanced output to **PRE**.
4. RC-30 OUTPUT L/MONO → B205D Channel 2 with 1/4-inch TS.

### MicroKorg

MicroKorg L/MONO OUTPUT → B205D Channel 3 Left with the gray 1/4-inch TS-to-RCA leg.

### Vocal path

Headset → wireless bodypack → wireless receiver XLR OUT → Zoom V3 MIC IN → Zoom V3 OUTPUT
L/MONO → B205D Channel 1.

The MicroKorg vocoder mic connects directly to the MicroKorg audio input; it does not pass
through the Zoom V3.

## 🚀 Build and test

### 1. Identify the paths

With everything off, locate G3X INPUT, OUTPUT L/MONO, BALANCED OUT, and PRE/POST; RC-30 MIC IN
and OUTPUT L/MONO; MicroKorg L/MONO OUTPUT; and the three B205D channels.

**Q1 (multiple choice).** Which device combines the completed performance mix and produces sound
in the room?

- a) Zoom G3X
- ✅ b) Behringer B205D
- c) Boss RC-30
- d) Zoom V3

### 2. Live instrument first

Connect guitar or uke to the G3X, then G3X OUTPUT L/MONO to B205D Channel 3 Right. Power the G3X
and B205D, raise the B205D cautiously, and confirm the live effected instrument is audible before
adding anything else.

**Q2 (fill in the blank).** At this point in the build, sound should be arriving on B205D Channel
______, on the ______ side.

✅ **Answer.** Channel 3, on the Right side (the red TS-to-RCA leg).

🚩 **Checkpoint.** You can hear the live, effected instrument through the B205D with only one
path connected. Do not add anything until this is true.

🔄 **Switch roles.**

### 3. Add MicroKorg

Verify the MicroKorg power supply. Turn its internal speaker off, connect L/MONO OUTPUT to
Channel 3 Left, select a sustained pad or drone, and hear it alongside the live instrument.

**Q3 (short answer).** Why can two sources share Channel 3 in this rig?

✅ **Answer.** Channel 3 is a stereo channel: the guitar lands on its Right input and the
MicroKorg on its Left, so the two sources use different inputs of the same fader.

🚩 **Checkpoint.** Pad and live instrument are audible at the same time, and you can name which
side of Channel 3 each one is arriving on.

### 4. Add the loop path

With Channel 2 fully down, connect G3X BALANCED OUT to RC-30 MIC IN and RC-30 OUTPUT L/MONO to
Channel 2. Use an available RC-30 memory, record a short loop, and play live instrument over it.

**Q4 (short answer).** Why is the G3X balanced output set to PRE?

✅ **Answer.** PRE taps the signal before the G3X output volume control, so riding the G3X volume
for the room does not change the level being sent into the looper.

**Q5 (multiple choice).** The loop comes back much louder than your live instrument. Which
control should you try first?

- a) MAIN LEVEL on the B205D
- ✅ b) B205D Channel 2, the looper's own channel
- c) The guitar's volume knob
- d) The G3X foot volume

🚩 **Checkpoint.** A recorded loop plays back while you play live over the top of it, and the two
sit at a usable balance.

🔄 **Switch roles.**

### 5. Add vocals last

Keep Channel 1 fully down. Connect the headset, wireless receiver, Zoom V3, and Channel 1. Raise
the level only as far as needed. If feedback begins, lower Channel 1 immediately, then check
microphone and monitor position.

**Q6 (multiple choice).** Which channel is deliberately tested last because it is the most
feedback-prone?

- ✅ a) Channel 1, the vocal path
- b) Channel 2, the looper
- c) Channel 3, the instruments
- d) MAIN LEVEL

🚩 **Checkpoint.** The headset vocal is audible without feedback, and everyone in the group knows
that Channel 1 is the fader to grab if it starts to howl.

### 6. Prove the rig works

Demonstrate, in order:

1. A MicroKorg pad or drone.
2. Live effected guitar or uke.
3. A short RC-30 loop with live instrument over it.
4. A cautious headset/V3 vocal test.

If the rig is stable and time allows, test the MicroKorg vocoder briefly. Keep it away from the
B205D monitor and stop immediately if feedback begins.

🚩 **Final checkpoint.** All four demonstrations played back to back without re-patching anything.

## ✅ Definition of done

- 🚩 Every path built and proved **one at a time**, in the order above — not all at once.
- 🚩 The live instrument, the MicroKorg, the loop, and the vocal are each audible through the B205D.
- 🚩 A loop recorded on the RC-30 and played back while you play live over it.
- 🚩 All four demonstrations performed in order without re-patching.
- 🚩 The rig reset and left the way you would want to find it.

## 🛠️ Troubleshooting

Work in order. Do not skip to the exotic explanation.

**IF there is no live instrument:**
→ Check instrument volume, G3X foot volume, G3X OUTPUT L/MONO, Channel 3, and MAIN LEVEL.

**IF there is no loop playback:**
→ Check G3X BALANCED OUT → RC-30 MIC IN, RC-30 OUTPUT L/MONO → Channel 2, the RC-30 loop output,
and Channel 2.

**IF the MicroKorg is silent:**
→ Check master volume, power supply, L/MONO OUTPUT, and the gray/left Channel 3 connection.

**IF you get feedback or an incorrect vocal sound:**
→ Lower Channel 1 first. Then check monitor/microphone placement, wireless connection, Zoom V3
input/output, and Channel 1.

## 🧹 Finish, reset, put away

1. Stop the RC-30 loop and rhythm.
2. Turn Channel 1, Channel 2, Channel 3, and MAIN LEVEL down.
3. Power down deliberately.
4. Keep each power supply with its device — especially the two 9V adapters.
5. Leave the rig organized for the next group.

## 💭 Before you leave

- What is the **one** thing you would check first if this rig made no sound at all?
- Which path took you longest to get working, and what finally fixed it?

## ⚙️ Technical verification

**Last verified:** transcribed from the instructor's station notes and reorganized into the
standard MUS 248 activity structure. The connections were not re-checked against the rig during
this conversion.

- Confirm the red leg goes to Channel 3 **Right** and the gray leg to Channel 3 **Left**, and
  that the answer to Q2 matches the station's actual cabling.
- Confirm the RC-30 is fed from the G3X **BALANCED OUT** set to **PRE** rather than POST.
- Confirm the wireless receiver's XLR OUT is the intended feed into the Zoom V3 MIC IN.

## 🤖 AI use disclosure

Based on the instructor's own B205D live-looping station notes. The structure, checkpoints,
troubleshooting order, and the question set were AI-drafted from those notes and are pending
instructor review. The signal-flow details come from the instructor.
