---
id: dante-broadcast
title: Dante Broadcast
emoji: "📡"
coreSkillAreas:
  - Live Sound
status: Ready
estimatedTime: "20–30 minutes per round (2 rounds)"
access:
  mode: In class / on campus
  location: "OH B01 — those iMacs are already Dante-networked with Dante Virtual Soundcard (DVS) and Dante Controller installed."
  supervision: "None required once you know the room's schedule."
groupSize:
  minimum: 1
  ideal: "1–2"
  maximum: 2
  solo: true
activityFamily: "Dante Activities"
level: ""
roundsSupported: true
---

> ✅ **Status: Ready.** Originally based on the instructor's own Dante setup videos, reorganized and expanded with AI assistance (Claude), then reviewed and edited by the instructor across several revision passes.

## 🎚️ Core skill area

**Live Sound** — signal routing, mains and monitors.

🗝️ **Key terms:** signal flow · connector types (Ethernet/RJ45, XLR, TRS) · AoIP · DVS (Dante Virtual Soundcard) · Dante Controller · TX/RX (transmit/receive) · routing matrix · input monitoring · Multi-Output Device · mono vs. stereo · DAW I/O

## 🌍 Why this matters

You're supporting MUS 324 Audio Recording Techniques. The instructor needs to send audio from the instructor computer to every student computer in the room — in real time, fully uncompressed, full quality. That's exactly the routing you're about to build.

## 🎯 What you'll practice

By the end of this activity, you should be able to:

- Route a stereo audio signal from one computer to another over a Dante network using Dante Virtual Soundcard and Dante Controller.
- Confirm signal flow using your DAW's audio I/O settings together with Dante Controller's transmit/receive matrix.
- Diagnose a common stereo mistake (mono track routed instead of stereo) by ear and by looking at the routing matrix.
- Set up a Multi-Output Device so a transmitting computer can send audio over the network and hear it locally at the same time.

## 📍 Logistics

**Estimated time:** 20–30 minutes per round, two rounds.

**Where:** OH B01 only. Those iMacs are already networked together with DVS and Dante Controller installed — that exact combination isn't something you can quickly replicate elsewhere. Check the OH B01 schedule (sign on the door, or posted in the Music Tech Den) to find open lab time. Can't be done remotely.

**Group size:** Minimum 1, ideal 1–2, maximum 2. Three is too many for this one.

**Rounds:** If you're in a pair, complete the whole activity once, then switch computers with your partner and do the entire thing again from scratch. If you're solo, complete it once at one pair of computers, then move to a completely different pair and do it again. Round 1 is untimed. For Round 2, start a timer.

## 🧰 Equipment and materials

- [ ] 2 computers in OH B01, both Dante-networked, both with DVS and Dante Controller installed
- [ ] A DAW on each computer (Logic, Pro Tools, Reaper, Ableton Live, or similar)
- [ ] Headphones for both computers
- [ ] A stereo test source (see step 1)

## ⚠️ Before you touch Dante Controller

Do NOT re-route or disconnect anything labeled **INST**. That's the instructor computer, and it's already sending audio to the room's main speakers — breaking that connection cuts sound for the whole room, including other classes.

## 🚀 Get ready

1. On each computer, open System Settings > General > Sharing and note the "Local Hostname" (iMac computer number) — this is how you'll tell computers apart in Dante Controller.
2. Launch Dante Virtual Soundcard on both computers and click Start on each. Confirm both devices appear in Dante Controller.
3. Decide who's Computer A (transmitter) and who's Computer B (receiver) for Round 1.

**Q1 (fill in the blank).** DVS stands for ______.

✅ **Answer.** Dante Virtual Soundcard.

## 📋 Round 1 — Part A: basic one-computer-to-another send

1. Computer A (transmitter): set up a source that's clearly stereo — either two mono tracks panned hard left and hard right, or one stereo track (inputs 1/2). Either works, just make sure it isn't mono.
2. Set your DAW's audio output device to "Dante Virtual Soundcard."
3. Open Dante Controller.
4. Use Filter Transmitters to show only Computer A — find it by the Local Hostname/iMac number you noted in Get Ready. Use Filter Receivers to show only Computer B the same way.

**Q2 (fill in the blank).** The Local Hostname you noted for each computer is what you type into the Dante Controller ______ boxes to find the right transmitter/receiver.

✅ **Answer.** Filter — the Filter Transmitters and Filter Receivers boxes.

5. Click the routing cells to connect: Transmit ch. 1 → Receive ch. 1, and Transmit ch. 2 → Receive ch. 2.

🚩 **Checkpoint.** The routing squares should turn green.

6. Computer B (receiver): set the DAW's input device to "Dante Virtual Soundcard" and output device to your headphones.
7. Create a stereo audio track, set its input to Dante channels 1–2, and enable input monitoring.

🚩 **Checkpoint.** You should hear left-channel content only in your left ear and right-channel content only in your right ear.

**Q3 (multiple choice).** To transmit audio out over Dante, what does your DAW's output device need to be set to?

- a) Built-in Output
- b) Headphones
- ✅ c) Dante Virtual Soundcard
- d) Whatever the other computer is using

**Q4 (multiple choice).** You only hear sound in one ear when you expected stereo. What's the most likely cause?

- a) The DAW crashed
- ✅ b) The track is mono instead of stereo, or only one Dante channel got routed
- c) Dante Controller needs to be reinstalled
- d) The headphones are broken

## 📋 Round 1 — Part B: send and hear yourself locally

8. On the transmitting computer (still Computer A), open Audio MIDI Setup. If a Multi-Output Device doesn't already exist, click + to create one.
9. In the Multi-Output Device, check the boxes for both "Dante Virtual Soundcard" and your local audio interface/headphone output.

**Q5 (fill in the blank).** You should check the ______ box first, then your local interface box — otherwise your channel numbering will come out different than expected.

✅ **Answer.** Dante Virtual Soundcard (DVS).

🚩 **Checkpoint (order matters).** Check the DVS box before the local interface box, or your channel numbering will come out different than expected.

10. Set your DAW's output device to the new Multi-Output Device.

🚩 **Checkpoint.** Confirm you can hear the track on your own headphones and that the receiving computer still shows green routing in Dante Controller and hears the signal.

**Q6 (multiple choice).** Now that you've built a Multi-Output Device, what should your DAW's output device be set to, so you can hear it locally AND still send it over Dante?

- a) Dante Virtual Soundcard only
- b) Your headphone output only
- ✅ c) The Multi-Output Device
- d) Aggregate Device

**Q7 (multiple choice).** In a Multi-Output Device, what determines each device's channel numbering?

- a) Alphabetical order of device names
- ✅ b) The order you check the boxes
- c) It's random
- d) Every device always starts at channel 1

## 🔁 Round 2 — switch and repeat (timed)

- Pair: swap computers with your partner — the transmitter becomes the receiver and vice versa.
- Solo: move to a completely different pair of computers in the room.
- Start your timer, then redo Part A and Part B, start to finish.

🚩 **Checkpoint.** Try not to peek at the steps above — but it's okay to check if you get stuck.

## 🛠️ Troubleshooting

**IF the receiving computer hears nothing:**
→ Check Dante Controller — are the routing squares green, or gray/red?
→ Check the transmitting DAW's output = DVS, and the receiving DAW's input = DVS.
→ Check that input monitoring is enabled on the receiving track.
→ Check headphones are plugged in and the correct output is selected.

**IF only one channel (left or right) works:**
→ Check the track is actually stereo, not mono.
→ Check both Dante channels 1 and 2 are routed, not just one.

**IF things suddenly stop making sense in Logic:**
→ Double-check your I/O — sometimes changing the output also changes the input unintentionally.

**IF Dante Controller shows a red square in the lower-right corner** (something like "Clock: No clock source found"):
→ Check that a Master Clock source is set and shows as active somewhere on the network (Device Info > Clock Status Monitor).
→ This is a network-wide problem, not just your computer — flag it to your instructor/TA if you can't resolve it.

## 📹 Video tutorials (if you get stuck)

A student who tried an earlier version of this activity said the videos were genuinely helpful — worth a look if you're stuck. Both videos live in this shared folder: [Dante Setup Videos (SharePoint)](https://chapman0.sharepoint.com/:f:/s/AdamBoreckiLargeFilesTeachingResources/IgA58SRcKrVgT5tBx6dFOfOeAeR26dzIzSsgSZVq5My3gyo?e=n2Vl1n)

| Video | Duration | What it covers |
|---|---|---|
| IMG_0688 dante setup Part 1.MOV | ~3 min | Part A — the basic 1-to-1 stereo send: setting the DAW output to Dante Virtual Soundcard, routing both channels in Dante Controller, and checking left/right arrives correctly on the receiving computer. |
| IMG_0689 dante setup Part 2.MOV | ~1 min | Part B — building a Multi-Output Device so the sending computer can hear its own output locally while still sending the signal over Dante. |

## 🧹 Finish, reset, cleanup

- Stop playback and close your DAW session without saving over shared test files.
- In Dante Controller, you may leave the routing in place for the next activity, unless your instructor says otherwise.
- Return headphones to their spot.
- Leave the workstation as you found it for the next student.

## 🏫 Note about this classroom setup

As of September 2026, the INST computer's Dante output is routed to Dante AVIO, which feeds the classroom's main speakers. This routing should never need to change. If you notice it has changed (accidentally or otherwise), fix it back to INST → Dante AVIO before you leave — other instructors depend on it working.

## 💭 Before you leave

- Draw a quick signal-flow diagram of what you built (source → DAW → DVS → network → DVS → DAW → output).

**Q8 (multiple choice).** A classmate says Dante Controller shows their connection as green/connected, but they still hear nothing. What's the most likely next thing to check?

- a) Restart the whole computer
- ✅ b) Whether their DAW's input device is actually set to Dante Virtual Soundcard
- c) Buy new headphones
- d) Reinstall Dante Controller

## 🤖 AI use disclosure

Based on the instructor's own Dante setup recordings (three short screen-recorded video tutorials). Reorganized into the standard MUS 248 activity structure with AI assistance (Claude), including the checkpoints, questions, and troubleshooting steps. Reviewed and edited by the instructor across several revision passes — this is the first Dante activity to reach Ready status.
