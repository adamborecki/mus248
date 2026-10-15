---
id: salmon-reset
title: "Salmon Reset (BH 208/209)"
emoji: "🔁"
coreSkillAreas:
  - Video Capture
  - Audio Capture
status: Placeholder
revised: "2026-10-15"
estimatedTime: "Not yet timed"
access:
  mode: On campus
  location: "Control room BH 208/209, hall below."
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

> 🧪 **Status: Placeholder.** Started October 2026 because the instructor wants a reset procedure
> for Salmon like the one for the X32 Compact. Nothing below is confirmed yet — it's the list of
> what a reset *probably* covers, pulled from the old source SOP's clean-up section and the
> instructor's notes. **Don't follow it as a procedure.** See **Technical verification**.

## 🎚️ What this is

The state BH 208/209 and Salmon's video and audio gear should be left in at the end of every gig
or practice session, so the next engineer starts from a known setup instead of whatever the last
person left. The gig itself is the **Salmon Gig Checklist**; this is only the putting-back.

## 🔁 What a reset probably covers (every step still to be confirmed)

**Video**

- 🚩 ATEM Software Control: **off air**; the static wide (Camera 2) on program.
- 🚩 RovoControl: the static wide's framing back to the standard wide; exposure (gain, f-stop)
  untouched — it's preset for the hall.
- 🚩 AX100 backup wide: back to the house default (F4 · 3 dB · 1/60 · **3200 K**, no shift ·
  autofocus) before it goes back in the Standard Gear Kit — Salmon's 3800 K A5 G2 is for the hall
  only.

**Audio**

- 🚩 F8 and H6 powered down; cards handled per the data-transfer steps.
- 🚩 Anything brought down to Salmon (stands, mics, cables, monitors) back where it came from.

**Room**

- 🚩 Lobby feed off: CRESTRON → Hallway TV **Signage**, Hallway Audio **off**.
- 🚩 ATEM Master power, backup battery, individual cameras off — only what's supposed to be off.
- 🚩 BH 208/209 tidy, lights off.

## ✅ Definition of done

- 🚩 This procedure hasn't been confirmed yet — use the end-of-show steps in the **Salmon Gig
  Checklist** for now.

## ⚙️ Technical verification

**Still open, everything:**

- Which of the items above belong in a reset (vs. the gig checklist's end of show).
- What the RovoCams' standard framing and exposure presets are, and whether a reset restores them.
- Whether the AX100's Salmon white balance is reset after every gig or left at 3800 K A5 G2 for
  the next Salmon gig.
- ATEM settings to restore (program source, multiview, stream key cleared or kept).

## 🤖 AI use disclosure

Scaffolding drafted by AI from the old Salmon SOP's clean-up section
(`content/activities/_source/bh209-salmon-sop.txt`) and the instructor's October 2026 notes. Not a
verified procedure.
