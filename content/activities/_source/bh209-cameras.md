# BH 209 (Salmon Recital Hall) — camera and audio intake

Working notes, not student-facing. This is the landing spot for the room's existing
documentation, which is still outside the repo.

The activity page (`cameras.md`) already carries a BH 209 orientation section built from
what is confirmed below. It stops there on purpose: the activity template's rule is that
gear details get verified before they become student instructions, and a click-path written
from recollection is exactly the thing that sends a student to the wrong menu at 7:50 on a
recital night.

## Confirmed

### From the instructor, September 2026

| | |
| --- | --- |
| Cameras | **AJA RovoCam**, installed in the hall |
| Control | **Software on a computer in the room** |
| Recording | To **SSD or SD card**; a higher-speed card is the norm |
| Audio | **Both** — embedded in the video, and a separate feed |
| Access | **Key code** on the door; most students in this course already have it |

**The room is a production room, not a practice room** — the instructor's own framing, and the
single most important thing this section has to get across. The handheld activity encourages
students to push settings around; BH 209 is patched and levelled for live recitals that stream to
an audience. Students touch only what a procedure names, and put everything back. That rule is now
written into `cameras.md` twice: in the safety list and as a red-flag callout heading the BH 209
section.

Not written down anywhere, deliberately: the key code, and the contents of the room's
`vimeo login password.rtf`. This repo is public.

### From photographs of the room, September 2026

Read off the control surfaces directly, so these are observed rather than recalled. Anything an
angle made ambiguous is in **Still needed** below rather than here.

**The Mac** is named **`BH209-LivestreamAndDanteRecord`** — so the livestream and the Dante
recording are the same machine.

**AJA RovoControl v3.0.1** (the desktop zip is `AJA_RovoControl_v3_0_1.zip`), three tabs:
**Camera Control**, **ePTZ**, **Settings**. On Camera Control:

| Control | Range as shown | Notes |
| --- | --- | --- |
| Iris | `Close` … `f14` → `f1.8` | Has an **AUTO** toggle |
| Exposure mode | **A / S / M / B** | Observed on **M** |
| Shutter speed | dropdown | Observed on `1/1` |
| Gain | `0dB` → `33dB` | |
| Focus | `10mm` → `1500mm` | Has an **AUTO** toggle |
| Zoom | `Wide` → `Tele` | Observed at `3.2x`, with a rocker |
| Presets | **1–16** | Observed on 2 |
| Cameras | two buttons, both reading `Cam ?` | Unnamed or not connected at the time |

Status line: `EPTZ Off · Joystick Off · Close/0dB · 1/1 · 1500mm · 1.0x`.

**This answers the biggest open question:** the five settings this activity teaches *do* transfer,
in the same units. Iris in f-stops, gain in dB, a real manual mode. **White balance is the
exception** — it is not on the Camera Control tab, so it is either under **Settings** or not
exposed at all. That one still needs checking.

**Physical control** exists too, which the earlier "software on a computer" answer did not cover:
a **Pan/Tilt joystick** on the desk with its own speed knob and a hardware **Camera 1 / Camera 2**
selector, plus a second small unit with a 4-way pan pad and a Power / Pan / Remote / Control
switch.

**The video chain is Blackmagic ATEM, not a standalone deck** — the earlier note said "a
Blackmagic recorder", which was close but imprecise. Two multiviews on stacked Samsung displays:

- **HDMI1 — ATEM Production Studio 4K.** Camera 1–8, Preview, Program, audio meters for
  `CAM1`–`CAM8`, `MIC1`, `MIC2`, `PGM`. Two record slots (`STOP 00:00:00`, both reading
  **`NO DISK`** when idle) and a stream readout (`OFF`, `DATA RATE Mb/s`, `CACHE OK`, **Vimeo**).
- **HDMI2 — ATEM Mini Extreme ISO.** Preview/Program plus Camera 1–7 and Media Player 1.
- A taped label reads **"select HDMI1 for MULTIVIEW source"**.

The switcher has eight camera inputs, but **the room is run as a single locked-off wide plus one
alternate angle** — the two RovoCams. The handhelds *could* be patched in, but in practice they
are not (instructor, September 2026). Do not write the activity as though a recital here is an
eight-camera production.

**At the desk:** Genelec monitors, an ATEM Mini Extreme ISO control panel, a Mackie Big Knob
(source select / mono / volume), outboard VU meters, a Furman power conditioner in the rack, and a
SanDisk **SSD PLUS** on a stand.

**A handwritten setup checklist** on the desk, partly legible:

1. Furman on
2. SSD (or a "fast" 1667x Lexar SD) — **Mb for left**
3. spare SSD (or SD) in **top right**
4. adjust exposure with … *(cut off)*

**Two printed manuals live at the desk** and are not in this repo: *Salmon Recital Hall Recording
Engineer Manual — Quick…* (carries QR codes) and a *Live-Streaming Guide*, both annotated by hand.

**An operational risk worth flagging to the instructor:** macOS warns that this build of AJA
RovoControl is Intel-only and **"will not open in a future release of macOS."** The room loses
camera control the day that Mac updates past it. Worth checking whether AJA ships an Apple-silicon
build before an OS upgrade happens, not after.

## Photographs

Cropped and downscaled copies live in `content/activities/media/bh209/` and are used on the
activity page: `rovocontrol.jpg`, `joystick.jpg`, `multiview.jpg`, `desk.jpg`. The RovoControl
shot is cropped to the application window on purpose — the full frame showed a desktop file
listing that included `vimeo login password.rtf`, and this repo is public. Keep that in mind
before adding more: check the whole frame, not just the subject.

## Getting the documentation in

Plain text in the repo, assets linked — same as every other activity's source here.

If it is a Google Doc shared as "anyone with the link can view":

```bash
tools/import-activity-doc.sh bh209-cameras https://docs.google.com/document/d/DOC_ID/edit
```

That writes `content/activities/_source/bh209-cameras.txt`. Anything else — a PDF, a Word
file, a wiki page — paste the text into that same path by hand; verbatim is fine and
preferred, since this folder is provenance, not prose.

Screenshots matter more than usual here, because the whole interface is on a screen: one of
the control software with a live picture, and one of the recorder's front panel, would answer
several of the open items above faster than any amount of description. Downscale them to
sensible web JPEGs before committing (see this folder's README on the Mic Stand Yoga media
for why), or host them elsewhere and link.

Once the source is in, rewrite the BH 209 section of `cameras.md` from it and move the
answered items out of that file's **Technical verification** list.
