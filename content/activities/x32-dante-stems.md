---
id: x32-dante-stems
title: "X32 Compact: Dante Stems (OH B01)"
emoji: "🎛️"
coreSkillAreas:
  - Live Sound
  - Audio Capture
status: In Development
revised: "2026-10-14"
estimatedTime: "Not yet timed"
access:
  mode: "In class / on campus"
  location: "OH B01: the X32 Compact (with its Dante card) and a Dante-networked computer with Logic Pro and Dante Controller."
  supervision: "Don't change X32 channels 1–8 routing; the wireless mics live there."
groupSize:
  minimum: 1
  ideal: "2"
  maximum: 3
  solo: true
activityFamily: "X32 Compact"
level: "Logic → Dante → X32 channels 9–16"
roundsSupported: false
---

> 🧪 **Status: In Development.** Condensed from Parts 8–9 of the instructor's *OH B01 — X32 Compact
> PA Setup & Dante Practice System* doc (imported at `content/activities/_source/x32compact.txt`).
> Menu names haven't been checked step by step; see **Technical verification**.

## 🎯 What you'll practice

- 🌐 Sending 8 separate stems from Logic over Dante to 8 X32 channels.
- 🧭 Tracing a network signal path, one hop at a time, when something's silent.
- 🎚️ Mixing a "band" that never gets tired: levels, EQ, dynamics, and two monitor mixes.

## 🗝️ Key terms

**stem** · **Dante** · **Tx / Rx** · **Dante Controller** · **Card** input · **Sends on Fader** · bus

## 📍 Logistics

**Where:** OH B01, at the X32 Compact, with a computer on the same Dante network that has
**Logic Pro** and **Dante Controller**.

**Before this:** the [wireless mics](../../x32-wireless-mics/) can stay on channels 1–3. This uses
channels **9–16** only.

## 🧭 Signal flow

One stem = one Logic track = one Dante output = one X32 channel:

| Logic | Dante | X32 card | X32 channel |
|---|---|---|---|
| Track/Output 1 | Tx 1 → Rx 1 | Card 1 | Ch 9 |
| Track/Output 2 | Tx 2 → Rx 2 | Card 2 | Ch 10 |
| … | … | … | … |
| Track/Output 8 | Tx 8 → Rx 8 | Card 8 | Ch 16 |

## 🚀 Procedure

### 1. Connect in Dante Controller

Open **Dante Controller**. Find your computer (the transmitter) and the X32 Compact (the receiver).
In the routing grid, connect **computer Tx 1–8 → X32 Rx 1–8**, one intersection each.

🚩 **Checkpoint.** All eight connections show as established in Dante Controller.

### 2. Set Logic to Dante

Before making tracks, set Logic's **audio output device to Dante**, not the built-in output.

### 3. Make 8 tracks, outputs ascending

Create 8 tracks using Logic's **Ascending** option, so track 1 → Output 1 … track 8 → Output 8.
Put one stem on each track (for example drums, bass, guitar, keys, lead vocal, backing vocals, and
two more).

🚩 **Checkpoint.** Eight tracks, one stem each, on Outputs 1–8 in order.

### 4. Route X32 channels 9–16 to the card

On the X32, press **ROUTING**, find the input block for **channels 9–16**, and set it to
**Card 1–8**. Leave channels 1–8 on Local inputs.

**Q1 (fill in the blank).** X32 channels 9–16 take their audio from Card ______, while channels 1–8
stay on ______ inputs.

✅ **Answer.** Card 1–8; Local inputs (so the wireless mics on 1–3 keep working).

### 5. Play

Press Play in Logic.

🚩 **Checkpoint.** Each stem shows on its own X32 channel, 9 through 16.

## 🎚️ Practice mixing

With the session playing, channels 9–16 act like eight live inputs. Practice levels, mutes, panning,
EQ, compression, gates, and the Main L/R mix. Then:

- **Bus 1:** select it and turn on **Sends on Fader**; build a monitor mix (for example drums loud,
  vocal loud, guitar low, keys off). The Main mix shouldn't change.
- **Bus 2:** build a second mix that's deliberately different from Bus 1.

🚩 **Checkpoint.** Bus 1 and Bus 2 are two different mixes, and changing one doesn't change the other or Main L/R.

## 🛠️ Troubleshooting

Don't change settings at random. Check, in order:

1. Is Logic playing, and does each track have audio?
2. Is Logic's output device Dante, with tracks on Outputs 1–8 ascending?
3. Does Dante Controller show the computer transmitting and the X32 receiving, with Tx 1–8 → Rx 1–8?
4. Is the X32 routing channels 9–16 from Card 1–8?
5. Are you looking at channels 9–16?

## ✅ Definition of done

- 🚩 Eight stems arrive on X32 channels 9–16, one each, in order.
- 🚩 Channels 1–8 still come from Local inputs.
- 🚩 Bus 1 and Bus 2 carry two different monitor mixes.

## 💭 Before you leave

- Which hop in the chain (Logic, Dante Controller, X32 routing) would you check first if only
  channel 12 were silent, and why?

## ⚙️ Technical verification

- **Dante Virtual Soundcard.** The doc says you don't need to open DVS separately for this. Whether
  Logic can see a "Dante" output device without DVS running isn't confirmed.
- **Which computer, and where the practice stems live.** Not stated.
- **X32 menu names** (ROUTING → input block for 9–16 → Card 1–8) and Logic's **Ascending** option
  are from the doc, not checked against current versions.
- **Shared console.** Should the 9–16 routing be put back to Local afterwards? Not stated; see the
  [X32 Compact Reset](../../x32compact-reset/).

## 🤖 AI use disclosure

Condensed by AI (Claude, via Claude Code) from the instructor's imported X32 Compact doc, keeping
its steps, order, and signal path. Wording was shortened at the instructor's direction. One question
was added. Nothing was tested on the gear.
