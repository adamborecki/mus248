---
id: salmon-gig-checklist
title: "Salmon Gig Checklist"
emoji: "📋"
coreSkillAreas:
  - Video Capture
  - Audio Capture
  - Live Sound
  - Data Management
status: In Development
estimatedTime: "Not a timed drill — this is the reference you run start to finish across an actual gig."
access:
  mode: On campus
  location: "Control room BH 208/209, the hall below, and the green room."
  supervision: "For engineers who've already run Salmon: Basic A/V Capture solo — this is the field checklist, not the tutorial."
groupSize:
  minimum: 1
  ideal: "1–2"
  maximum: 2
  solo: true
activityFamily: "Salmon Recital Hall"
level: "RovoCam · ATEM · Zoom F8 · Zoom H6"
roundsSupported: false
---

> 🧪 **Status: In Development.** Drafted from the instructor's own dictated walkthrough, the
> *Salmon Checklist & S.O.P.* imported at `content/activities/_source/bh209-salmon-sop.txt`, and
> the Zoom F8 / Zoom H6 corrections already confirmed in **Salmon: Basic A/V Capture**. Expect a
> few rounds of revision — see **Technical verification** for what's still open.

## 🎚️ What this is

The field checklist. Not a lesson — you've already learned the room in **Salmon: Basic A/V
Capture** (and **Livestream**, if tonight's gig has one). This page exists so you can run an
entire real gig, start to finish, without hunting through explanatory text at a music stand.
Every line below is something you do or check; the "why" lives in the other Salmon activities.

## 🗝️ Key terms

**primary wide** · **backup wide** · **program feed** · **board feed** · **downbeat** · **encore**
· **call time** · Triple Triple Check

## 🧰 Equipment and materials

- [ ] A clean **8 GB SD card** for the Zoom H6
- [ ] A clean **32 GB SD card** for the Zoom F8
- [ ] A fast SD card for the HyperDeck backup video — **Lexar Professional, 128 GB, SDXC UHS-II,
  V60, U3, 250 MB/s (1667x)**. A second one is worth having too — see **Initial setup**.
- [ ] A clean **128 GB SD card** for the AX100 backup camera
- [ ] The program, once you can get hold of it
- [ ] Access to both the **Post** and **Backups** drives for the data pass

## ⚠️ Before you touch anything

- 🚫 **Do not adjust the audio preamps.** If a level is genuinely wrong, that's a conversation
  with Borecki, not a knob you turn.
- 🔌 The battery backup circuit under the desk also feeds the **Zoom F8 and Zoom H6** — don't
  assume either one is already on or off.
- ⏱️ **The Zoom F8's power switch needs about 2 seconds held down** to turn on or off — a quick
  tap does nothing, either direction.
- 🙋 **Ask when you're not sure.** The recital manager, the performer, and your supervisor all
  know things this checklist can't.

## 🚗 Pre-arrival

- 🚩 If you're going to be late, text your fellow engineer(s) before your call time — don't leave
  them wondering.

**Q1 (short answer).** Call time: ______ · Concert: ______ · Arrival time: ______

✅ **Answer.** There's no fixed answer — write in tonight's call time, tonight's concert, and when
you actually got there. It's a log entry, not a test.

## 🔌 Initial setup — audio and video

- 🚩 Battery backup — **a single tap** on the power button — on.
- 🚩 Zoom F8 — power switch, lower right of the unit — hold **~2 seconds** — on.
- 🚩 Zoom H6 — power on: **hold the switch on the left**.
- 🚩 Insert a clean **8 GB** SD card into the H6.
- 🚩 Insert a clean **32 GB** SD card into the F8 — the card slot is on the **far left** side of
  the unit.
- 🚩 Confirm audio: headphones on, check both the F8 and H6, confirm clean signal on both sides —
  not the same signal doubled.
- 🚩 F8 preamps: check they're all set the same. If one looks off, press **PFL** to check/adjust
  that channel's gain — the exact target level is still being confirmed, see **Technical
  verification**.
- 🚩 F8 record-enable: all **8** channels should show a **red light** underneath. If one isn't
  lit, press that channel's button to record-enable it.
- 🚩 Grab the fast SD card for the HyperDeck backup video — the **Lexar Professional 128 GB**
  card, not just any spare (see **Equipment and materials**). The HyperDeck has two recorder
  slots: load this card into the **top-left** slot. If a second fast card is available, it's fine
  to load it into the **right** slot too — that one catches the overflow if the first runs out
  mid-recording. ("Spills over" — Cary Trott.)
- 🚩 Check the primary wide's framing — zoom in **RovoControl**, pan/tilt on the **joystick**.
  Leave gain and f-stop alone; they're preset for the hall.
- 🚩 CRESTRON: set Hallway TV to **Signage**, Hallway Audio **off** — and while it's off, preset
  the Hallway volume to about **25%**, so it's neither silent nor blasting once it's switched on
  at doors.
- 🚩 Find the Samsung monitor on the far left of the rack — labeled **MON2** — and press its power
  button so you can preview the lobby feed.
- 🚩 Go down and grab a copy of the program.

## 🎥 Initial setup — AX100 backup camera

- 🚩 Carry the AX100 down to the hall.
- 🚩 Mount it on its tripod, **fully extended** — as tall as it goes.
- 🚩 Center it dead center, and check it's level — not tilted, not rotated.
- 🚩 Frame it **wide**. Nobody operates this camera once it's rolling, so there's no reframing —
  wide is the margin for error.
- 🚩 Plug it into AC power.
- 🚩 Insert a clean **128 GB** SD card.
- 🚩 Confirm on the display: several hours of remaining recording time, and **no battery icon
  showing** — the battery icon disappearing is how you know it's actually running on AC, not on a
  battery that can die mid-show.

## 📡 Initial setup — livestream test

Only if tonight's gig is livestreamed. If it isn't, skip to **Green room feed**.

- 🚩 ATEM Extreme ISO hardware: power on, Ethernet connected, USB-C connected to the iMac.
- 🚩 Open the livestream computer.
- 🚩 Go to Vimeo and log in ([ACCOUNT — ask instructor], password at [PASSWORD LOCATION — ask
  instructor]).
- 🚩 Switch to "College of Performing Arts" → **Live Events** → "Salmon Recital Hall Livestream."
- 🚩 Create (or open) a new **Test** event; set its password to [TEST PASSWORD — ask instructor].
- 🚩 Manage Production → **Stream via RTMP** — copy the stream key shown there, then paste it into
  the ATEM Control software.
- 🚩 Practice: start the test stream and confirm picture and sound actually reach Vimeo.
- 🚩 Embed the stream on the Canvas page and confirm it plays there too.

## 📺 Green room feed

- 🚩 Before heading down, confirm the video system in BH 209 is turned on.
- 🚩 Go down to the green room and **knock first** — don't just walk in.
- 🚩 If a performer is already inside, **ask before touching anything**: "Would you like me to
  turn on the TV and show you where the volume is?"
- 🚩 Turn on the green room TV with its power switch.
- 🚩 Point out the volume control if the performer is present.

## 🎟️ Doors and lobby

- 🚩 Ask about any changes to the program or an encore.
- 🚩 Once doors open: CRESTRON — switch Hallway TV from Signage to **Camera**, turn Hallway Audio
  **on** (volume's already preset from Initial setup).

## 🎬 Start recording — 3 minutes before downbeat

- 🚩 Go downstairs first and start the camera (primary wide) before anything else.
- 🚩 Start the ATEM HyperDeck recorder.
- 🚩 Start the backup wide (AX100), if one is running tonight.
- 🚩 Start the F8 — press the **red RECORD button**, just to the right of the power button.
- 🚩 Start the H6.
- 🚩 If tonight is multicam or livestreamed: start the ATEM Extreme and the individual cameras
  too.
- 🚩 Confirm every recorder is **actually rolling** — numbers moving, not just a button pressed.

## ⏸️ Intermission

- 🚩 Default: leave everything recording straight through — don't pause as a matter of course,
  it's simpler and safer.
- 🚩 Check remaining recording time and battery life on **every** device.
- 🚩 If anything is genuinely at risk (low space or low battery): stop **all** recording devices
  together, fix what's needed, and restart **all** of them together, immediately.

## 🏁 End of show

- 🚩 Stop every recording device — on the F8, that's the **STOP** button, halfway between the
  back/next buttons, **not** the red record button.
- 🚩 Go downstairs and stop the camcorder / backup wide.
- 🚩 Power down what you turned on — and nothing else. (The F8 needs the same ~2 second hold to
  power off as it did to power on.)
- 🚩 Start the data transfer.
- 🚩 Include a copy of the program in the data transfer, alongside the recordings.
- 🚩 Copy everything to **both** the Post and Backups drives, using the `YYMMDD Full Event Name`
  folder naming convention — full detail is in **Salmon: Basic A/V Capture**'s data management
  section if you need a refresher.
- 🚩 Green room: turn off the TV.
- 🚩 Lobby: CRESTRON — Hallway TV back to **Signage**, Hallway Audio **off**.

## ✅ Definition of done

- 🚩 Every device that was turned on for this gig has been turned off, and nothing else has.
- 🚩 Files are copied to **both** the Post and Backups drives, program included.
- 🚩 Borecki has looked over the copied files before any card was wiped.
- 🚩 Green room, lobby, and control room are back to their resting state.

## ⚙️ Technical verification

**Confirmed since the last pass:**

- **The fast SD card for the HyperDeck**: Lexar Professional, 128 GB, SDXC UHS-II, V60, U3,
  250 MB/s (1667x) — identified from a photo of the actual card. The HyperDeck's two recorder
  slots (top-left primary, right for overflow) are the instructor's description, not yet checked
  against the unit itself.
- **Green room feed**: a TV in the green room, powered on with its own power switch, no CRESTRON
  routing involved. Knock-first and the ask-before-touching-anything line are the instructor's
  own courtesy rule, not a technical requirement.
- **CRESTRON Hallway TV/Audio sequencing** (Signage + audio off + 25% preset volume in Initial
  setup, then Camera + audio on at Doors, then back to Signage + audio off at End of show) is the
  instructor's own description of the intended state machine.

**Still open:**

- **The F8 preamp target level.** The instructor confirmed the *mechanism* — press **PFL** to
  check/adjust a channel's gain — but not what the correct level actually is. Don't adjust a
  preamp based on a guess; ask Borecki.
- **The ATEM HyperDeck's own start/stop button** — this checklist assumes it exists and works the
  way the rest of the room does; the source SOP marks this "INSTRUCTIONS COMING" and it still is.
  Same open item as in **Salmon: Basic A/V Capture**.
- **The livestream/Vimeo/Canvas steps** are carried over from the source SOP, which that document
  itself flags as known-stale in places. **Salmon: Livestream** is where this should eventually
  get independently verified; until then, treat this checklist's livestream section with the same
  caution.
- **The Samsung MON2 monitor's exact label and location** — written up from the instructor's
  description, not yet independently checked against the room.

The verbatim source SOP is in `content/activities/_source/bh209-salmon-sop.txt`.

## 🤖 AI use disclosure

Drafted by AI from the instructor's own dictated walkthrough of a real gig, restructured into the
site's checklist/worksheet format, then revised twice more from the instructor's follow-up
corrections — including a photo used to identify the exact HyperDeck card, and detailed operating
notes for the battery backup, F8, H6, AX100, and CRESTRON sequencing. The step order, every
equipment detail, the green-room courtesy rule, and the data-transfer steps are the instructor's.
The F8's exact preamp target level is deliberately left unconfirmed rather than guessed. Pending
instructor review before treating any of it as final.
