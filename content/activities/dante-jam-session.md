---
id: dante-jam-session
title: Dante Jam Session
emoji: "🎛️"
coreSkillAreas:
  - Live Sound
status: Ready
revised: "2026-09-20"
estimatedTime: "20–30 minutes per round (2 rounds)"
access:
  mode: In class / on campus
  location: "OH B01 — those iMacs are already Dante-networked with DVS and Dante Controller installed."
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

**Prerequisite:** Dante Broadcast — do that one first.

## 🎚️ Core skill area

**Live Sound**

🗝️ **Key terms:** routing matrix · channel pair · TX/RX · DVS (Dante Virtual Soundcard) · Dante Controller · front-of-house (FOH) · channel override · mono vs. stereo · Multi-Output Device

## 🌍 Why this matters

This is an optional workflow for MUS 230 Intro to Songwriting. If several people want to jam together, each on their own computer or instrument, everyone's audio can route into one computer that acts as the mixer — that computer is doing the real work, since its output is what actually feeds the room's speakers. (The same result could technically be done with a hardware mixer like an X32 Compact instead of Dante — this activity teaches the networked/software version of that same idea.)

## 🎯 What you'll practice

By the end of this activity, you should be able to:

- Route audio from multiple separate transmitting computers into a single receiving computer's DAW session, with each computer landing on its own track — mono or stereo, whichever that source actually is.
- Plan Dante channel numbering ahead of time so two sources don't collide on the same destination.
- Recognize and fix a channel conflict: Dante never lets two sources share one destination. Routing a second source to a channel pair that's already in use doesn't mix the two together — it silently overrides/disconnects the first one.

## 📍 Logistics

**Estimated time:** 20–30 minutes per round, two rounds.

**Where:** OH B01 only, same as Dante Broadcast. Check the OH B01 schedule (sign on the door, or posted in the Music Tech Den) to find open lab time. Can't be done remotely.

**Group size:** Minimum 1, ideal 1–2, maximum 2. You don't need 3 separate students, just 3 computers — OH B01 has plenty of networked iMacs, so 1–2 people can operate all three. You'll need 3 computers free at once, which may take a bit more coordination than Dante Broadcast if the room is busy.

**Rounds:** If solo, you'll operate all three computers yourself — set up Transmitter 1, then Transmitter 2, then the Receiving computer, moving between them. If in a pair, split the work for Round 1 (e.g., one of you handles both transmitting computers while the other sets up the receiving computer), then switch roles and do the entire thing again for Round 2. Round 1 is untimed. Round 2, start a timer.

## 🧰 Equipment and materials

- [ ] 3 computers, all Dante-networked, all with DVS and Dante Controller installed
- [ ] A DAW on each computer
- [ ] Headphones/speakers on the receiving computer
- [ ] Headphones on each transmitting computer too (needed for Part B)
- [ ] A distinct audio source on each transmitting computer (so you can tell them apart by ear)
- [ ] (optional) Video tutorial — scroll down to the bottom for extra help/videos to watch

## 🚀 Get ready

1. Complete Dante Broadcast first — this activity assumes you're already comfortable with basic Dante routing.
2. Confirm all 3 computers appear in Dante Controller.
3. Decide which computer will be the Receiving computer for Round 1 — this is your makeshift "instructor"/mixer machine, the one that would feed the room's speakers in a real setup. Note its Dante device name.

**Q1 (fill in the blank).** Write down the Dante device name of your Round 1 receiving computer here, so you can find it quickly when filtering: ______

✅ **Answer.** The student's own — whichever Dante device name their Round 1 receiving computer is showing.

4. Before you start routing, decide on a channel map (if you're in a pair, agree on this together):

- Transmitter 1 → Receiver channels 1–2
- Transmitter 2 → Receiver channels 3–4
- (Transmitter 3, if used → Receiver channels 5–6)

## 📋 Round 1 — Part A: basic multi-computer routing

> ⚠️ This activity has been through several revision passes but may still have a minor error or two — flag anything that seems off.

1. Transmitting Computer 1: set DAW output to Dante Virtual Soundcard.
2. In Dante Controller, route Transmitter 1's channels 1–2 → Receiving computer's channels 1–2.

**Q2 (multiple choice).** Why does each transmitter need its own receive channel pair?

- ✅ a) So each source arrives on a separate track instead of overriding another source
- b) Because Dante limits the whole network to 2 channels total
- c) Because DAWs require every channel name to be unique
- d) It doesn't matter — Dante automatically mixes everything together

3. Transmitting Computer 2: set DAW output to Dante Virtual Soundcard.
4. In Dante Controller, route Transmitter 2's channels 1–2 → Receiving computer's channels 3–4 (not 1–2, which are already taken).

🚩 **Checkpoint.** Look at the routing matrix — confirm no two transmitters are routed into the same receive channel pair. Tip: a clean 1-to-1 routing usually shows up as a diagonal line of green squares from upper-left to lower-right — if yours looks scattered instead, that's not automatically wrong, but it's worth a second look.

5. Receiving computer: create a second stereo audio track, set its input to Dante channels 3–4.

🚩 **Checkpoint.** You should now hear both sources at once, arriving on two separate tracks in your DAW.

**Q3 (multiple choice).** If a third computer joined the jam, which receive channels on the receiving computer would it need?

- a) 1–2 (already used by Transmitter 1)
- b) 3–4 (already used by Transmitter 2)
- ✅ c) 5–6
- d) It doesn't matter — any channels work

## 📋 Round 1 — Part B: add a Multi-Output Device

Reinforces the Dante Broadcast skill.

6. On each transmitting computer, build a Multi-Output Device combining Dante Virtual Soundcard and your local headphone output — same as you did in Dante Broadcast.
7. Switch that computer's DAW output to the new Multi-Output Device.

🚩 **Checkpoint.** Confirm you can still hear your own source locally on headphones and that the receiving computer still shows green routing and still hears you.

## 🔁 Round 2 — switch and repeat (timed)

Rotate roles, not just seats: whichever computer was the Receiving computer in Round 1 becomes a Transmitter this time, and one of the old Transmitters becomes the new Receiver. (Pairs: also swap who's sitting at which machine.)

Start your timer, then redo the entire procedure — Part A and Part B — from scratch with the new role assignment.

🚩 **Checkpoint.** Try not to peek at the steps above — but it's okay to check if you get stuck.

## 🛠️ Troubleshooting

**IF you don't hear one of the sources:**
→ Check whether that channel pair is already claimed by another transmitter — look at the full routing matrix, not just your own row. Remember: Dante doesn't mix two sources sent to the same destination, it silently overrides the older connection.
→ Check that the receiving track's input matches the receive channel pair assigned to that transmitter.
→ Check the transmitting computer's DAW output is actually set to Dante Virtual Soundcard (or your Multi-Output Device, in Part B).

**IF things suddenly stop making sense in Logic:**
→ Double-check your I/O — sometimes changing the output also changes the input unintentionally.

**Q4 (multiple choice).** You only hear Transmitter 2's audio — Transmitter 1 should also be playing, but it's silent. What's the most likely cause?

- a) Transmitter 1's audio interface is broken
- ✅ b) Both transmitters got routed to the same receive channel pair, so Transmitter 2's connection silently overrode Transmitter 1's
- c) The receiving computer needs more RAM
- d) Dante Virtual Soundcard only supports one transmitter at a time

## 📹 Video tutorials (if you get stuck)

A student who tried an earlier version of this activity said the videos were genuinely helpful — worth a look if you're stuck. All setup videos live in this shared folder: [Dante Setup Videos (SharePoint)](https://chapman0.sharepoint.com/:f:/s/AdamBoreckiLargeFilesTeachingResources/IgA58SRcKrVgT5tBx6dFOfOeAeR26dzIzSsgSZVq5My3gyo?e=n2Vl1n)

| Video | Duration | What it covers |
|---|---|---|
| IMG_0691 dante setup Part 3.MOV | ~2 min | Adds a second sending computer into the mix — the actual "jam session" setup, showing two computers each sending their own stereo source into different channel pairs on one receiving computer. |

## 🧹 Finish, reset, cleanup

- Stop playback on all computers.
- Clear or leave routing per instructor's preference.
- Return headphones, leave all three workstations tidy for the next student(s).

## 💭 Before you leave

**Q5 (multiple choice).** Two students' audio came out on the same track. What would you check FIRST?

- a) Restart both computers
- ✅ b) Whether the two transmitters were accidentally routed to the same receive channel pair
- c) Buy new headphones
- d) Reinstall Dante Virtual Soundcard

## 🤖 AI use disclosure

Based on the instructor's own Dante setup recordings (the "jam session" segment of the video series). Reorganized into the standard MUS 248 activity structure with AI assistance (Claude). A factual error in an early draft — describing conflicting Dante routes as "colliding" rather than silently overriding — was caught and corrected by the instructor. Reviewed and edited by the instructor across several revision passes.
