---
id: x32-wireless-mics
title: "X32 Compact: Wireless Mics (OH B01)"
emoji: "🎤"
coreSkillAreas:
  - Live Sound
status: In Development
revised: "2026-10-14"
estimatedTime: "Not yet timed"
access:
  mode: "In class / on campus"
  location: "OH B01: the X32 Compact at the front of the classroom and its Phenyx Pro PTU-6000 receiver."
  supervision: "Use only the OH B01 system's own mics, receiver, and cables."
groupSize:
  minimum: 1
  ideal: "2"
  maximum: 3
  solo: true
activityFamily: "X32 Compact"
level: "Phenyx Pro PTU-6000 · 3 handhelds"
roundsSupported: false
---

> 🧪 **Status: In Development.** Condensed from Part 2 and Steps 12–14 of the instructor's *OH B01 —
> X32 Compact PA Setup & Dante Practice System* doc (imported at
> `content/activities/_source/x32compact.txt`). The receiver's control names haven't been checked
> against the unit yet; see **Technical verification**.

## 🎯 What you'll practice

- 🎤 Pairing three wireless handhelds to their own receiver channels, one at a time.
- 🔎 Proving each link works **at the receiver first**, before blaming the mixer.
- 🎚️ Getting all three mics into the X32 at a healthy gain and out to Main L/R.

## 🗝️ Key terms

**receiver channel** · **frequency scan** · **IR sync** · **local input** · **input gain** · Main L/R

## 📍 Logistics

**Where:** OH B01, at the X32 Compact and the **Phenyx Pro PTU-6000** receiver.

**Before this:** the console is in a known state. If your exercise starts from defaults, run the
[X32 Compact Reset](../../x32compact-reset/) first.

## 🧰 Equipment and materials

- [ ] Phenyx Pro PTU-6000 wireless receiver
- [ ] 3 Phenyx wireless handheld mics
- [ ] 6 AA batteries (2 per mic)
- [ ] 3 XLR cables (receiver → X32)

## ⚠️ Safety before you start

- 🔇 Speakers and the power amp stay **OFF** until the mics are in and the levels are low.
  Speakers on **last**, off **first**.
- 🎤 Pair and test **one microphone at a time**.

## 🧭 Signal flow

Mic → receiver channel → XLR → X32 local input → channel → Main L/R → outputs 7 & 8 → speakers

## 🚀 Procedure

### 1. Connect the receiver

- Receiver **Ch 1** → X32 **Input 1**
- Receiver **Ch 2** → X32 **Input 2**
- Receiver **Ch 3** → X32 **Input 3**

🚩 **Checkpoint.** Three XLRs run from receiver channels 1–3 to X32 inputs 1–3, in order.

### 2. Batteries and power

Put 2 AA batteries in each mic. Turn on the PTU-6000.

### 3. Pair Mic 1

1. Select **Channel 1** on the PTU-6000 and confirm that's the channel you're editing.
2. Start a **frequency scan** with the receiver's **SET** control, and wait for it to finish.
3. Turn on Mic 1. Hold its **IR window** close to and facing the receiver's IR window, start
   **IR sync**, and wait for it to complete.
4. Speak into Mic 1.

🚩 **Checkpoint.** Speaking into Mic 1 shows activity on receiver Channel 1.

### 4. Pair Mics 2 and 3

Repeat step 3, one mic at a time: Mic 2 → receiver Ch 2, Mic 3 → receiver Ch 3.

🚩 **Checkpoint.** Each mic shows activity on its own receiver channel, and only that one.

### 5. Into the X32

1. Confirm X32 channels 1–3 take **Local** inputs 1–3. Leave channels 9–16 alone; the
   [Dante stems](../../x32-dante-stems/) exercise uses them.
2. One channel at a time: speak into the mic, watch the channel meter, and set **input gain** for
   a healthy signal that doesn't clip.
3. Assign channels 1–3 to **Main L/R**, unmuted, faders at reasonable levels, Main master low.
4. Speakers on last, then bring Main up slowly.

🚩 **Checkpoint.** All three mics are audible through the main speakers at a healthy, unclipped level.

**Q1 (multiple choice).** Mic 2 shows activity on receiver Channel 2, but X32 channel 2's meter
doesn't move. Where do you look first?

- a) Mic 2's batteries
- b) The receiver's frequency scan
- ✅ c) The XLR from receiver Ch 2, the X32 input, its routing, and its gain
- d) The main speakers

## 🛠️ Troubleshooting

Follow the signal path and find the exact point where the signal disappears.

- **No activity at the receiver:** batteries, frequency, pairing, the mic itself.
- **Activity at the receiver, nothing on the X32:** XLR cable, X32 input, input routing, which
  channel you're looking at, gain.

## ✅ Definition of done

- 🚩 Each mic is paired to its own receiver channel and verified there first.
- 🚩 Channels 1–3 show healthy, unclipped signal on the X32.
- 🚩 All three mics play through Main L/R.
- 🚩 Speakers went on last and come off first.

## 💭 Before you leave

- Where would you look first if one mic dropped out mid-show, and why there?

## ⚙️ Technical verification

- **PTU-6000 controls.** The doc says "use the appropriate SET control" to scan and to start IR
  sync. Exact button names and menu steps aren't checked against the receiver.
- **Does pairing survive power-off?** Not stated. Do the mics need re-syncing every session?
- **Channels 1–3 on Local 1–3** is the X32 default after a factory reset (per the doc). Not checked
  for a console that wasn't reset.
- **Speakers.** OH B01's pantry holds both M-Audio AV40 and DX4 pairs (instructor). The X32 doc's
  system uses the AV40s as Main L/R.

## 🤖 AI use disclosure

Condensed by AI (Claude, via Claude Code) from the instructor's imported X32 Compact doc, keeping
its steps and order. Wording was shortened at the instructor's direction ("very verbose and old but
maybe good info"). One question was added. Nothing was tested on the gear.
