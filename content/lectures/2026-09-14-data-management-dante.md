> 📽️ **From the class slides** (*248 Slides 2026b.pptx*, slides 43–66). Slide order and wording
> are kept; images aren't reproduced. **Redacted for this public site:** student names in group
> lists and in one example folder name. Each is marked `[… — ask instructor]`.

## 🗓️ Class slides

### Slide 43: Monday, September 14

Fall 2026

### Slide 44: Reminder

Min. Work 3 gigs per semester

### Slide 45: Advice from Past Students on Activities

**🎥 Camera Crews (AX100 / G50)**

- Finding white balance / Kelvin setting = universally hard (ask for help early!)
- Touchscreen + joystick navigation takes some trial and error
- Remember: SD card required, needs power to turn on

**🎚️ DAW Circuit (Goldilocks of Gain / Go With the Flow)**

- Mono vs. Stereo mismatches tripped up multiple groups — check your track type before you record
- Arm your track! Several groups couldn't see levels because the track wasn't armed
- Gain staging target: aim for peaks around -6 to -12 dB FS (not clipping, not buried)

### Slide 46: Advice from Past Students on Activities

- ✅ Before you record: confirm input/output routing, headphone jack, and correct audio interface for your station
- ✅ Before you hit record: arm the track, confirm mono/stereo matches your source
- ✅ On cameras: check for touchscreen controls first, then look for physical dials/wheels
- ✅ When stuck: ask a neighbor group or instructor — several of you solved the exact same problem independently. Let's share solutions faster!

## 🎤 Lecture: Day 3 (Week 4) — Data Management + Dante

### Slide 47: MUS 248 Day 3 (Week 4) Lecture

Data Management + Dante. A/V Concert Recording & Archiving

1. Keep the data safe
2. Move audio over a network

> **AI Use Disclosure:** I talked a lot at chatGPT, uploaded materials, and then asked it to make PPTX. I then proofread and reviewed it all.

[Follow along notes](https://docs.google.com/document/d/1sHH7NK7721ICSvS5yES9WsVa__ci0C-G8dIu0j0k72Y/edit?usp=sharing)

### Slide 48: Part 1: Data Management

### Slide 49: Data Management

A typical semester can contain dozens and dozens of recordings. Appropriate file name conventions are essential.

See example of a post production hard drive — 📁 **Post 42**:

- 📁 260912K Faculty Recital - Mary Palchak
- 📁 260918 Vocal Forum
- 📁 260919 Musco 10th Anniversary Event
- 📁 261002 Music at Noon
- 📁 261005 [student name — ask instructor] Senior Recital
- 📁 261009P Prelim-Concerto & Aria Comp
- 📁 261009Y Wind Symphony
- 📁 261009S Mariachi Garibaldi de Jaime Cuellar Masterclass
- 📁 261010A The Chapman Orchestra
- 📁 261011E Faculty Recital - Faculty Electroacoustic Showcase
- 📁 261016A Ben Bliss Masterclass and Q&A
- 📁 261016S Opera Scenes
- 📁 261017S Opera Scenes
- 📁 261017T Orchestra Festival
- etc.

### Slide 50: Data Management: Folder Structure TEMPLATE

Use the full event name for the gig folder; short names inside.

**YYMMDD Full Name.** Optional letter after YYMMDD only if that same letter is assigned in the Rec Gigs spreadsheet.

| Folder | Holds |
|---|---|
| r abbr | raw / source files |
| e abbr | edit / post-production files |
| s abbr | saved final deliverables |
| a abbr | (optional special archive / keep files) |

**Short-name ("abbr.") examples:** The Chapman Orchestra → TCO · Wind Symphony → WS · Studio Recital of several students → studioRecital

**Terminology note:** "Post Drive" and "Work Drive" may be used synonymously. In current instructions, prefer "Post Drive."

### Slide 51: Data Management: Folder Structure EXAMPLE

Use the full event name for the gig folder; short names inside.

**260914 The Chapman Orchestra.** Optional letter after YYMMDD only if that same letter is assigned in the Rec Gigs spreadsheet.

| Folder | Holds |
|---|---|
| r TCO | raw / source files |
| e TCO | edit / post-production files |
| s TCO | saved final deliverables |
| a TCO | (optional special archive / keep files) |

**Short-name ("abbr.") examples:** The Chapman Orchestra → TCO · Wind Symphony → WS · Studio Recital of several students → studioRecital

**Terminology note:** "Post Drive" and "Work Drive" may be used synonymously. In current instructions, prefer "Post Drive."

### Slide 52: Data Transfer: 1 Source → 2 Destinations

Beginner default: copy everything from the capture media to a "Post Drive" and a "Backups Drive"

**SOURCE / CAPTURE MEDIA:** Mus128_#### (128 = card capacity, #### = unique ID). Also: Mus64_####, Mus32_####, SSDs, etc. IDs correspond to the Data Volumes spreadsheet.

**DESTINATION 1 — Post ## Drive:** Create the gig folder: YYMMDD Full Event Name. Copy source material into the appropriate "r" subfolder.

**DESTINATION 2 — Backups ## Drive:** Make the same gig structure here too. A hard drive can fail at any time — one copy is not enough.

**COPY EVERYTHING BY DEFAULT.** Experienced engineers may selectively copy only what is needed — but only when they truly know what they are doing. For beginners, copy the whole card.

**Audio note:** current concert audio capture is primarily on the Zoom F8, so transferring a DAW project is less central than in older instructions.

### Slide 53: Data Transfer: What it looks like

Example folder structure:

**Post 43**

- 📁 261106A The Chapman Orchestra › 📁 r TCO › 📁 From Mus128_1842 · 📁 From Mus128_2197 · 📁 From F8_03
- 📁 261106A The Chapman Orchestra › 📁 e TCO (,,,, more stuff here later)
- 📁 261106A The Chapman Orchestra › 📁 s TCO
- 📁 261006 Wind Symphony › 📁 r WS › 📁 From Mus128_1067 · 📁 From Mus128_2067 · 📁 From F8_67
- 📁 261006 Wind Symphony › 📁 e WS
- 📁 261006 Wind Symphony › 📁 s WS

**Backups 68**

- 📁 261106A The Chapman Orchestra › 📁 r TCO › 📁 From Mus128_1842 · 📁 From Mus128_2197 · 📁 From F8_03
- 📁 261106A The Chapman Orchestra › 📁 e TCO
- 📁 261106A The Chapman Orchestra › 📁 s TCO
- 📁 261006 Wind Symphony › 📁 r WS › 📁 From Mus128_1067 · 📁 From Mus128_2067 · 📁 From F8_67
- 📁 261006 Wind Symphony › 📁 e WS
- 📁 261006 Wind Symphony › 📁 s WS

### Slide 54: Trip' Trip' Trip' or Pink Slip

Delete only when you can prove the source exists safely in all three places.

**TRIPLETS**

1. ORIGINAL — SD / SSD — Mus128_####
2. POST COPY — Post ## Drive — r shortname
3. BACKUP COPY — Backups ## Drive — r shortname

**Triple Triple Checked**

1. Approx. GB must match
2. Last 3 digits of exact bytes must match
3. Where / volume location must be the expected source + two drives

Only then: Trash → Empty Trash → confirm free space

**If you are 99% sure, DO NOT DELETE. Ask for help.**

### Slide 55: Trip' Trip' Trip' or Pink Slip

Delete only when you can prove the source exists safely in all three places.

*🖼️ Image in original slide.*

### Slide 56: The Life of the Data

r / e / s describe stages and file types — not three backup copies of the same folder.

CAPTURE (SD / SSD, F8 / cameras) → **r** RAW (source recordings) → **e** EDIT (projects + working files) → **s** SAVE (final deliverables)

Each gig's data should be organized this way on the Post Drive. A matching safe copy also lives on the Backups Drive.

Optional: an "a" subfolder can hold special "archival" files

### Slide 57: Empty the trash!

"Trashed" is not deleted

*🖼️ Image in original slide.*

Only 106GB available on a 128GB SD?!? The Trash wasn't emptied, so the files weren't deleted and the space isn't available.

After the trash is emptied (with the SD still connected), this will probably show about 127GB free or so. When SD cards get older, they lose max capacity.

### Slide 58: Part 2: Dante

### Slide 59: What is Dante?

**Dante = Audio over IP (AoIP):** multichannel digital audio over a network.

Instead of a thick analog snake (with oodles of cables), there's just 1 ethernet cable.

Any DAW can use DVS (if installed): Logic / Ableton / Reaper. Choose the correct audio I/O. DVS is licensed software ($50-100 ea.)

- **Dante Virtual Soundcard (DVS):** Connects a computer to a Dante network. Appears as an audio interface in DAW I/O
- **Dante Controller:** Connects Dante devices and channels on the network. TX = transmit • RX = receive

**Important distinction:** DAW I/O is where you choose the audio interface. • Dante Controller chooses where network audio goes.

Dante Controller does not "make sound" — it creates the subscription / connection between transmit and receive channels.

Think: a virtual patch bay that works across the network.

### Slide 60: Dante Activities: Build the Skill in Steps

Each activity adds one piece of the same routing puzzle.

1. **[Dante Broadcast](../../dante-broadcast/):** 1 computer → 1 or more computers. Sender also hears locally
2. **[Dante Jam Session](../../dante-jam-session/):** many senders → 1 receiver. Live-sound style routing
3. **[Walkie-Talkie — Basic](../../dante-walkie-basic/):** live mic → network → speaker. Real-time signal flow
4. **[Walkie-Talkie — Advanced](../../dante-walkie-advanced/):** two-way live connection • basic vocal processing

**NEXT PAYOFF:** multitrack DAW → Dante → X32 / CL3

### Slide 61: Dante Signal Flow: DAW → Mixer (e.g. X32 Compact)

The professional payoff: multitrack stems become physical console channels.

DAW (Outputs 1–8) → DVS (TX 1–8) → Dante Network (Ethernet) → Dante Controller (Subscribe TX → RX) → X32 Dante Card (RX 1–8) → X32 Channels (faders 1–8)

**Example stems:** Kick • Snare • Bass • Guitar • Keys • Vocals • etc.

If the routing works, each stem lands on its own X32 fader.

### Slide 62: Upcoming Homework

**Due this coming Sunday**

- 💪 💻 Quiz 1 (In-Class)
- 💪 💻 MISC 05 — Outlook Calendar
- 🏃🏽‍♀️ 📝 Weekly Learning & Activity Report 03
- 244 review 💪 🔘 MC 2.4 Clicks & Pops in Audio Editing
- 💪 📲 Camera Lab (Part 1): [camera-lab](https://adamborecki.github.io/camera-lab/)

Next week's quiz will include exposure questions!

**Due 1 week from Sunday**

- 💪 💻 POST 1 - Complete Post Mini Phases 1 & 2 (IN OH B01)

### Slide 63: Important Notes

**Changes:** No class time for "paperwork"

- Activity reports and write ups will be done outside of class
- Take notes so you remember

**New mus248 github repo:** [adamborecki.github.io/mus248](../../). Starting place to find activities.

**"Paperwork":** Activities get submitted in 4 places

- Journal: Spreadsheet
- Journal: Google Doc
- Canvas: Each Discussion
- Canvas: 1 Weekly Report

**Weekly Report:** Just once, include all activities. Now: no sooner than 12 hours after class. Take notes to remember what you did. Use class time for activities, not paperwork.

### Slide 64: Activity Clarification

**"What Can You Do With A Mixer?"** Long list of potential things to do with a mixer (not great instructions yet)

vs.

**"X32 Compact"** Specifically the mixer at front of OH B01 classroom

**(new) Dante Activities:** Dante Broadcast · Dante Jam Session · (parts 3 and 4 not proofread yet)

**(new) "Mic Stand Yoga":** [slides](https://chapman0.sharepoint.com/:p:/s/AdamBoreckiLargeFilesTeachingResources/EV0cut0in-1Gv6okSiGYviwBLij2n542beyDUAqom1-eUg?e=8yscm4). "Filler" activity, shorter time, do other activities first

### Slide 65: ACTIVITIES

- Dante Broadcast & Dante Jam Session: [names — ask instructor]
- X32 Compact: [names — ask instructor]
- Live Looping (new, improved instructions): [names — ask instructor]
- Portable Video Cameras: [names — ask instructor]
- Stereo Recording: [names — ask instructor]

**Reminders:** Take notes! Do paperwork later, but take notes now!

### Slide 66: Clean up!

Clear SD cards, put headphones back, keep workstations tidy.
