---
id: vocal-jazz-reset
title: "Vocal Jazz Reset (Salmon X32)"
emoji: "🔁"
coreSkillAreas:
  - Live Sound
  - Audio Capture
status: In Development
revised: "2026-10-19"
estimatedTime: "Not yet timed"
access:
  mode: On campus
  location: "Salmon Recital Hall: the FOH X32, the wireless rack, and the storage closet in BH 102."
  supervision: ""
groupSize:
  minimum: 1
  ideal: "1–2"
  maximum: 2
  solo: true
activityFamily: "Salmon Recital Hall"
level: "Reset procedure"
roundsSupported: false
---

> 🧪 **Status: In Development.** Started October 2026 from the instructor's notes, a student
> engineer's walkthrough of the gig, and what the **Salmon Simulator** project has already
> confirmed. The routing and the no-dynamics rule are the instructor's own. The exact gain and
> low-cut values, and the X32's page names, still need checking at the console. See **Technical
> verification**.

## 🎚️ What this is

The state the downstairs Salmon audio system should be left in after Vocal Jazz. The X32 and the
wireless gear go back to a known setup, so the next Vocal Jazz engineer can check it in a minute
instead of rebuilding it. The gig itself is the **Vocal Jazz Gig Checklist**; this is only the
putting-back. The upstairs video reset (BH 208/209) is the separate **Salmon Reset**.

## 🎛️ X32 — routing

- 🚩 **ROUTING → inputs 1–8, 9–16 and 17–24: LOCAL.** The wireless receivers plug into the X32's
  own rear panel, so these channels have to listen to LOCAL, not AES50.
- 🚩 **Inputs 25–32: AES50** (the stage box). That's the default, so leave it.
- 🚩 **Bus 1 = the wedges (Monitor 1)**, out to the stage box output that feeds the monitor amp.
- 🚩 **Card outputs → the Dante card**, as direct outs of the inputs (card out 1 = input 1, and so
  on), so the next multitrack recording only needs Dante Controller and Logic. The page and block
  names are still to be checked.

## 🎚️ X32 — every wireless channel

- 🚩 **The same gain on every channel**, about **30 dB** (to be confirmed).
- 🚩 **LOW CUT** on.
- 🚩 **No dynamics**: gate **off**, compressor **off**.

**Q1 (short answer).** A channel shows the right gain and low cut, but nothing from its mic reaches
the meter. Which routing page setting do you check first?

✅ **Answer.** Its input block's source. The wireless mics come in on LOCAL, so a block left on
AES50 hears the stage box instead and the mic never arrives.

## 📡 Wireless

- 🚩 Every handheld switched **off** (press and hold), **batteries out**.
- 🚩 Rechargeable cells back **in the charger** on top of the mic cabinet. **Never** put an alkaline
  in the charger.
- 🚩 All 16 handhelds back in the **FOH mic drawer**.
- 🚩 The **wireless rack off**, at the **Furman on top**.

## 🔊 Monitors and room

- 🚩 The **NX3000 off** before you unplug anything from it.
- 🚩 Three wedges and the speakON cables back in the storage closet, **BH 102**.
- 🚩 Close the latch **fully**.
- 🚩 The **Mac mini** is normally left on: quit Logic and leave the machine running.

## ✅ Definition of done

- 🚩 X32 inputs 1–24 on LOCAL, 25–32 on AES50.
- 🚩 Every wireless channel at the same gain, low cut on, no gate, no compressor.
- 🚩 Mics in the drawer with no batteries, cells in the charger, wireless rack off.
- 🚩 Wedges and cables in BH 102, latch fully closed.

## ⚙️ Technical verification

**Confirmed (instructor, 2026-10-19):** inputs 1–24 on LOCAL and 25–32 over the stage box by
default; no dynamics, with low cut on; the same gain on every wireless channel; the wireless rack's
master switch is the Furman on top; the storage closet is BH 102. The mic drawer, the charger, and
"never alkaline in the charger" are already confirmed in the Salmon Simulator project.

**Still open:**

- **Gain:** "I think 30 dB." Check it on the console.
- **Low-cut frequency:** not given yet.
- **Is the reset saved as an X32 scene?** If there's a Vocal Jazz scene, recalling it may be the
  quickest reset, but nobody has said one exists. If one does, it needs a name and a safe slot.
- **The Dante card's output routing:** which page, and whether resetting it to direct outs breaks
  anything else that uses the card.
- **Which stage box output Bus 1 uses.** It was the S32's OUTPUT 1 on 2026-10-08, but the routing
  can change.
- **Is the Mac mini always left on**, or does it get shut down after a Logic session?
- **Does the reset include the mains?** Nothing here touches the mains path yet.

## 🤖 AI use disclosure

Drafted by AI (Claude, via Claude Code) from the instructor's October 2026 notes and answers, a
student engineer's walkthrough of the Vocal Jazz gig, and facts already recorded in the Salmon
Simulator project. Not yet run as a procedure at the console.
