---
id: x32compact-reset
title: "X32 Compact Reset (OH B01)"
emoji: "🔁"
coreSkillAreas:
  - Live Sound
status: In Development
revised: "2026-10-14"
estimatedTime: "A few minutes. Not a timed drill."
access:
  mode: "In class / on campus"
  location: "OH B01, the X32 Compact at the front of the classroom."
  supervision: "Factory reset only when the exercise you're doing tells you to."
groupSize:
  minimum: 1
  ideal: "1–2"
  maximum: 3
  solo: true
activityFamily: "X32 Compact"
level: "Reset procedure"
roundsSupported: false
---

> 🧪 **Status: In Development.** Pulled word for word from the reset and shutdown steps of the
> instructor's *OH B01 — X32 Compact PA Setup & Dante Practice System* doc (imported at
> `content/activities/_source/x32compact.txt`). Not yet checked step by step against the console;
> see **Technical verification**.

## 🎚️ What this is

The reset checklist for the OH B01 X32 Compact system: the factory reset that **starts** the X32
Compact exercise, the power order, and the shutdown that **ends** it. The setup itself (wireless
mics, monitor mixes, Dante stems) lives in the **X32 Compact** activity.

## ⚠️ Before you touch anything

- 🚫 **Normally, do NOT factory reset an X32.** A factory reset can erase routing, scenes,
  presets, and other settings someone may have spent a long time creating.
- ☝️ Factory reset **only** the OH B01 X32 Compact, and **only** when the exercise you're doing
  tells you to.
- 🔇 The **M-Audio speakers** and the **QSC CX702** power amplifier are **OFF** before you start.

## 🔄 Factory reset — start of the exercise

- 🚩 Confirm you're at the **OH B01** X32 Compact, and that your exercise says to factory reset it.
- 🚩 Confirm the M-Audio speakers and the QSC CX702 are **OFF**.
- 🚩 On the X32 Compact, press **SETUP**.
- 🚩 Go to the **Global** tab.
- 🚩 Find the **Reset** section, toward the right side of the screen.
- 🚩 Scroll to **Factory Reset**, select it, and follow the confirmation prompt.
- 🚩 The console is back in its default configuration.

## 🔌 Power order

- 🚩 **On:** mixer and source equipment first; speakers and power amplifiers **last**.
- 🚩 **Off:** speakers and power amplifiers **first**; mixer and source equipment last.

This keeps loud pops out of the speakers.

## 🧹 Shut down — end of the session

- 🚩 Turn the system down.
- 🚩 Turn **OFF** the M-Audio speakers.
- 🚩 Turn **OFF** the QSC CX702.
- 🚩 Then shut down the mixer and other source equipment as appropriate.

## ✅ Definition of done

- 🚩 The factory reset happened only because the exercise called for it.
- 🚩 Speakers and the amplifier went on last and off first.
- 🚩 Everything you turned on is off, in that order.

## ⚙️ Technical verification

All of this is the imported doc's wording. Still open:

- **The menu path** (SETUP → Global → Reset → Factory Reset) hasn't been checked against the
  OH B01 console's firmware.
- **Scenes worth keeping.** A factory reset can erase scenes. Should anything saved on this
  console be exported before an exercise resets it? Not stated.
- **What "reset" means at the end of a session.** The source's end step is a shutdown, not a
  return to a known scene. Should the next class find factory defaults, or a particular scene?
  Not stated.
- **Which M-Audio speakers.** The X32 doc lists **M-Audio Studiophile AV40** speakers as Main L/R
  in OH B01. The Live Sound lecture shows a campus **M-Audio Studiophile DX4** pair without naming
  its room. They may be different rooms. Check the label on the OH B01 speakers.

## 🤖 AI use disclosure

Extracted by AI (Claude, via Claude Code) from the instructor's imported X32 Compact doc: Steps
1–2 (factory reset), the power order from Step 4, and Step 43 (shutdown), reformatted as a
checklist with the doc's wording kept. Nothing was added beyond that doc except the open
questions above.
