---
id: memorial-gig-checklist
title: "Memorial Hall Gig Checklist"
emoji: "🏛️"
coreSkillAreas:
  - Audio Capture
  - Video Capture
status: In Development
revised: "2026-10-16"
estimatedTime: "Not a timed drill — this is the checklist you run start to finish across an actual gig."
access:
  mode: On campus
  location: "Memorial Hall (Chapman Auditorium), with the Standard Gear Kit from BH 208/209."
  supervision: "For engineers who know the Standard Gear Kit — this is the field checklist, not the tutorial."
groupSize:
  minimum: 1
  ideal: "2"
  maximum: 3
  solo: true
activityFamily: "Standard Gear Kit"
level: "Zoom F8 · boundary mics · board feed"
roundsSupported: false
---

> 🧪 **Status: In Development.** Built October 2026 from the instructor's Memorial Hall input
> layout and the Standard Gear Kit Checklist. The boundary mics' model and placement, and the
> board feed's starting gain, aren't confirmed yet — see **Technical verification**.

## 🎚️ What this is

The gig checklist for a **Memorial Hall** recording. Memorial Hall and **Chapman Auditorium** are
the same venue. It's a Standard Gear Kit gig with two additions: **boundary microphones** placed
closer to the performers as spot mics, and a **board feed** from the house console.

Run it alongside the [Standard Gear Kit Checklist](../../standard-gear-kit-checklist/). The main
pair, the H4n, and both cameras are set up exactly as that checklist says. **The F8 is not:** this
page's input layout replaces that checklist's **Connections** and **F8 configuration** steps.

## 🗝️ Key terms

**board feed** · **boundary microphone** · **spot mic** · **dual-channel recording** · **mono** ·
**line level** · **TRS** · **XLR** · **PFL** · **phantom power** · **clipping**

## 🧰 Equipment and materials

Everything on the Standard Gear Kit Checklist's equipment list, plus:

- [ ] **Boundary microphones** (model and count — ask instructor) and an **XLR cable** for each
- [ ] An **XLR-to-¼-inch TRS adapter** for the board feed, in case the house gives you XLR
- [ ] A cable long enough to reach from the house console's output to the F8

## 🚗 Phase 1 — Before arrival

- 🚩 Gather the Standard Gear Kit and the extras above.
- 🚩 Confirm whether tonight has a **board feed**, **boundary mics**, or both. If neither, run
  the Standard Gear Kit Checklist on its own.

**Q1 (short answer).** Call time: ______ · Event: ______ · Arrival time: ______ · Board feed
(yes / no): ______ · Boundary mics (yes / no): ______

✅ **Answer.** There's no fixed answer — write in tonight's details. It's a log entry, not a test.

## 🙋 Phase 2 — On arrival: the things that need other people

Other people's time is the bottleneck — do these first.

- 🚩 Ask house staff for **concert lighting** — the brightest lighting level used during the
  performance — so camera exposure can be set correctly.
- 🚩 Ask for the **board feed**: where it comes out of the house console, and whether it's
  **XLR** or **¼-inch TRS**.
- 🚩 Ask where you're allowed to put the **boundary mics** on stage before you place anything.
- 🚩 Re-order the rest of this checklist around those answers. If the lights won't be ready for a
  while, do audio first.

## 🎙️ Main pair, backup audio, and cameras

- 🚩 Main stereo pair on its stand — set up per the Standard Gear Kit Checklist.
- 🚩 Zoom H4n backup — set up per the Standard Gear Kit Checklist.
- 🚩 Both Sony AX100s — set up per the Standard Gear Kit Checklist, exposure set under concert
  lighting.

## 🔌 Zoom F8 — the Memorial Hall input layout

The F8 records eight tracks. With **Dual Channel Recording** on Inputs 1 and 2, tracks 5 and 6
hold their quieter copies, so the boundary mics go to 3–4 and the board feed goes to 7.

| Input | Source | Dual Channel | Records to |
|---|---|---|---|
| 1 | Main pair — **left** mic | **On** | Tracks 1 and 5 |
| 2 | Main pair — **right** mic | **On** | Tracks 2 and 6 |
| 3 | Boundary mic — **left** (as the audience sees it) | Off | Track 3 |
| 4 | Boundary mic — **right** | Off | Track 4 |
| 7 | Board feed — **mono** | Off | Track 7 |
| 8 | Empty — or the board feed's right side, if the house sends stereo | Off | Track 8 |

**Main pair — Inputs 1 and 2**

- 🚩 **Left mic → Input 1**, **right mic → Input 2**.
- 🚩 **Dual Channel Recording on** for Inputs 1 and 2 only: **Menu → REC → Dual Channel
  Recording**.
- 🚩 Starting gain: Inputs 1–2 ≈ **42 dB**; their copies on 5–6 ≈ **30 dB**. Adjust with PFL.
- 🚩 **Phantom power on** for Inputs 1 and 2 — the pencil condensers need it.

**Boundary mics — Inputs 3 and 4**

- 🚩 Place each boundary mic on the stage, closer to the performers than the main pair, where
  house staff said you could.
- 🚩 Run each cable where nobody — performer or audience — will trip on it.
- 🚩 **Left boundary mic → Input 3**, **right boundary mic → Input 4**.
- 🚩 **Dual Channel Recording off** for Inputs 3 and 4.
- 🚩 Set the gain **conservatively low**. These mics sit close to the performers, and there's no
  safety copy on another track.
- 🚩 Check the signal with **PFL** while someone plays or sings their loudest passage.

**Board feed — Input 7**

- 🚩 If the house gives you **¼-inch TRS**, plug it straight into **Input 7**.
- 🚩 If the house gives you **XLR**, put the **XLR-to-¼-inch TRS adapter** on it, then plug the ¼-inch
  end into **Input 7**.
- 🚩 **Phantom power off** on Input 7 — a board feed doesn't need it.
- 🚩 Ask house staff to send signal, then set Input 7's gain with **PFL**.

**Power and media**

- 🚩 Batteries in — **backup only**. **AC power** plugged in for the concert.
- 🚩 A clean **32 GB** SD card in.

**Q2 (fill in the blank).** Memorial Hall F8 layout: main pair → Inputs ______ and ______ ·
boundary mics → Inputs ______ and ______ · mono board feed → Input ______.

✅ **Answer.** Main pair → **1 and 2** · boundary mics → **3 and 4** · board feed → **7**.

**Q3 (multiple choice).** Why is Dual Channel Recording on for Inputs 1 and 2, but off for 3 and
4, at a Memorial Hall gig?

- a) Dual Channel Recording only works with pencil condensers
- b) The boundary mics are the backup, so they don't need a copy
- ✅ c) The F8 records eight tracks: copies of 3 and 4 would take tracks 7 and 8, leaving nowhere
  for the board feed
- d) The board feed is already a copy of the boundary mics

**Q4 (multiple choice).** House staff hand you the board feed on an **XLR** cable. What do you do?

- a) Plug the XLR straight into Input 7 with phantom power on
- b) Plug the XLR straight into Input 3
- ✅ c) Put the XLR-to-¼-inch TRS adapter on it, plug it into Input 7, phantom power off
- d) Plug it into the H4n instead

**Q5 (short answer).** Why do the boundary mics start with a conservatively low gain?

✅ **Answer.** They sit much closer to the performers than the main pair, so they pick up a
louder signal — and with Dual Channel Recording off on Inputs 3–4, there's no quieter copy to
fall back on if they clip.

## 🎬 Start recording

- 🚩 Start both AX100s.
- 🚩 Start the H4n.
- 🚩 Start the F8 — press the **red RECORD button**, just to the right of the power button.
- 🚩 Confirm every recorder is **actually rolling** — numbers moving, not just a button pressed.

## ⏸️ Intermission

- 🚩 Default: leave everything recording straight through — don't pause as a matter of course.
- 🚩 Check remaining recording time and battery life on **every** device.
- 🚩 If anything is genuinely at risk (low space or low battery): stop **all** recording devices
  together, fix what's needed, and restart **all** of them together, immediately.

## 🏁 End of show

- 🚩 Stop the F8 with the **STOP** button, halfway between the back/next buttons — **not** the red
  record button.
- 🚩 Stop the H4n and both AX100s.
- 🚩 Give back anything the house lent you, such as the board-feed cable.
- 🚩 Pack up with the [Standard Gear Kit Reset](../../standard-gear-kit-reset/).

## ✅ Definition of done

- 🚩 The main pair is on Inputs 1–2, with Dual Channel Recording to 5–6.
- 🚩 The boundary mics are on Inputs 3–4, with dual channel off and the gain set conservatively
  low.
- 🚩 The board feed is on Input 7 through ¼-inch TRS, with phantom power off.
- 🚩 Every channel's signal was checked with PFL.
- 🚩 Every recorder rolled through the whole show, and the gear went back through the Standard
  Gear Kit Reset.

## ⚙️ Technical verification

**From the instructor (October 2026):** the input layout — main pair on 1–2 with Dual Channel
Recording, boundary mics on 3–4 set conservatively low, the board feed on 7–8 or on 7 alone when
it's mono, as it is at Memorial Hall — and that an XLR board feed goes into the F8 as ¼-inch TRS.
**From the October 12 lecture:** Memorial Hall and Chapman Auditorium are the same venue, and it
uses the Standard Gear Kit.

**Still open:**

- **Boundary mics** — which model, how many, whether they need phantom power, and where on stage
  they go. "Phantom on Inputs 3–4" isn't in the steps yet for that reason.
- **Boundary mic starting gain** — "conservatively low" needs a number.
- **Board feed starting gain** on Input 7, and whether the house sends it **pre- or post-fader**
  (whether it changes when the house engineer moves faders).
- **Where the board feed comes out** of the house console, and how much cable that run needs.
- **Dual Channel Recording per input** — that the F8's menu lets you turn it on for Inputs 1 and 2
  and leave it off for 3 and 4, and that Inputs 7 and 8 then work as ordinary inputs. Not yet
  checked against the unit's screen.
- **Left/right for the boundary mics** — 3 = left and 4 = right, as the audience sees it, matches
  the main pair. A convention choice; confirm.
- **Data transfer** — not on this page yet. Until it's confirmed, ask the instructor; the
  [Salmon Gig Checklist](../../salmon-gig-checklist/)'s **Data transfer** section is the closest
  existing procedure.
- **Group size** — set here as 1–3, ideally 2, like the Standard Gear Kit. Confirm.

## 🤖 AI use disclosure

Drafted by AI from the instructor's Memorial Hall input layout (given verbally, October 2026), the
Standard Gear Kit Checklist, the October 12 lecture, and the Salmon Gig Checklist's
start/intermission/end-of-show steps for the F8. Five questions added. Pending instructor review.
