---
id: live-looping
title: Live Looping Rig
coreSkillAreas:
  - Audio Capture
  - Live Sound
status: In Development
estimatedTime: 45–55 minutes
---

## What you will practice

- Build and test a small live-performance audio system one signal path at a time.
- Identify the input, output, cable type, and B205D channel for each major connection.
- Record and play back a simple loop while continuing to hear live guitar or uke.

## Roles

Work in pairs or groups of three. Rotate at each **🔄 Switch roles** instruction.

- **Patch operator:** makes the physical connections.
- **Signal tracer:** follows the signal and answers the check questions.
- **Level and safety operator:** watches power supplies and levels while anyone patches.

## Before you begin

You need guitar or uke, Zoom G3X, Boss RC-30, MicroKorg, Behringer B205D, wireless headset system, Zoom V3, the device-specific power supplies, and the cables listed at the station.

> ⚠️ Never swap the two 9V adapters. The MicroKorg uses its tested center-positive Korg adapter. The Boss RC-30 uses a center-negative Boss PSA-type adapter. Stop and ask if anything is unclear.

Before patching or powering up, turn B205D Channel 3, Channel 2, Channel 1, and MAIN LEVEL fully down. Leave phantom power off. Keep the vocal path off until the instrumental paths work.

## Signal flow

### Live instrument

1. Guitar or uke → G3X INPUT with a 1/4-inch instrument cable.
2. G3X OUTPUT L/MONO → B205D Channel 3 Right with the red 1/4-inch TS-to-RCA leg.
3. G3X BALANCED OUT → RC-30 MIC IN with XLR. Set the G3X balanced output to **PRE**.
4. RC-30 OUTPUT L/MONO → B205D Channel 2 with 1/4-inch TS.

### MicroKorg

MicroKorg L/MONO OUTPUT → B205D Channel 3 Left with the gray 1/4-inch TS-to-RCA leg.

### Vocal path

Headset → wireless bodypack → wireless receiver XLR OUT → Zoom V3 MIC IN → Zoom V3 OUTPUT L/MONO → B205D Channel 1.

The MicroKorg vocoder mic connects directly to the MicroKorg audio input; it does not pass through the Zoom V3.

## Build and test

### 1. Identify the paths

With everything off, locate G3X INPUT, OUTPUT L/MONO, BALANCED OUT, and PRE/POST; RC-30 MIC IN and OUTPUT L/MONO; MicroKorg L/MONO OUTPUT; and the three B205D channels.

**Q1.** Which device combines the completed performance mix and produces sound in the room?

- A. Zoom G3X
- B. Boss RC-30
- C. Behringer B205D

### 2. Live instrument first

Connect guitar or uke to the G3X, then G3X OUTPUT L/MONO to B205D Channel 3 Right. Power the G3X and B205D, raise the B205D cautiously, and confirm the live effected instrument is audible before adding anything else.

**Q2.** Which B205D channel should produce sound at this point?

🔄 **Switch roles.**

### 3. Add MicroKorg

Verify the MicroKorg power supply. Turn its internal speaker off, connect L/MONO OUTPUT to Channel 3 Left, select a sustained pad or drone, and hear it alongside the live instrument.

**Q3.** Why can two sources share Channel 3 in this rig?

### 4. Add the loop path

With Channel 2 fully down, connect G3X BALANCED OUT to RC-30 MIC IN and RC-30 OUTPUT L/MONO to Channel 2. Use an available RC-30 memory, record a short loop, and play live instrument over it.

**Q4.** Why is the G3X balanced output set to PRE?

**Q5.** If the loop is much louder than the live instrument, which control should you try first?

🔄 **Switch roles.**

### 5. Add vocals last

Keep Channel 1 fully down. Connect the headset, wireless receiver, Zoom V3, and Channel 1. Raise the level only as far as needed. If feedback begins, lower Channel 1 immediately, then check microphone and monitor position.

**Q6.** Which channel is deliberately tested last because it is most feedback-prone?

### 6. Prove the rig works

Demonstrate, in order:

1. A MicroKorg pad or drone.
2. Live effected guitar or uke.
3. A short RC-30 loop with live instrument over it.
4. A cautious headset/V3 vocal test.

If the rig is stable and time allows, test the MicroKorg vocoder briefly. Keep it away from the B205D monitor and stop immediately if feedback begins.

## Troubleshooting

- **No live instrument:** check instrument volume, G3X foot volume, G3X OUTPUT L/MONO, Channel 3, and MAIN LEVEL.
- **No loop playback:** check G3X BALANCED OUT → RC-30 MIC IN, RC-30 OUTPUT L/MONO → Channel 2, the RC-30 loop output, and Channel 2.
- **Silent MicroKorg:** check master volume, power supply, L/MONO OUTPUT, and the gray/left Channel 3 connection.
- **Feedback or an incorrect vocal sound:** lower Channel 1 first; then check monitor/microphone placement, wireless connection, Zoom V3 input/output, and Channel 1.

## Reset

Stop the RC-30 loop and rhythm. Turn Channel 1, Channel 2, Channel 3, and MAIN LEVEL down. Power down deliberately, keep each power supply with its device, and leave the rig organized for the next group.
