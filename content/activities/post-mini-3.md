---
id: post-mini-3
title: "Post Mini 3: Salmon Recital"
emoji: "🎼"
coreSkillAreas:
  - Post Production
  - Data Management
status: In Development
revised: "2026-11-06"
estimatedTime: "Not yet timed (video tutorials plus the edit)"
access:
  mode: "Confirm with instructor"
  location: "A Mac with Final Cut Pro and Logic"
  supervision: ""
groupSize:
  minimum: 1
  ideal: "1"
  maximum: 1
  solo: true
activityFamily: "Post Production"
level: "Phase 3 of 4 · Final Cut Pro + Logic"
roundsSupported: false
---

> 🧪 **Status: In Development.** From the instructor's **Post Production "Mini"** slides (2024),
> Phase 3. The slides say this phase's video covers everything, so this page is the map around
> it. Do [Post Mini 1](../../post-mini-1/) and [Post Mini 2](../../post-mini-2/) first.

## 🎯 What you'll practice

A real job, the most common one: a basic **Salmon recital**. You'll mix the primary audio in
Logic, build a multicam clip in Final Cut, deliver a 4K **complete concert file**, then cut a
separate file for every piece and every movement.

## 🗝️ Key terms

**complete concert file** · **movement** · **attacca** · **sonata** · **encore** · **key** ·
**.caf** · **stereo out** · **retime to fit** · **audio keyframe**

| Term | What it means here |
|---|---|
| **Movement** | A self-contained section of a larger piece. A sonata usually has three or four. Each gets its own file. |
| **Attacca** | Go straight into the next movement with no pause, so there's no silence to cut at. |
| **Encore** | An extra piece after the program ends. It's on the recording, so it gets a file too. |
| **Key** | The piece's home key, part of its title ("Sonata in E-flat major"). Helps you match the program to what you hear. |
| **.caf** | The audio file format a Logic project's recordings can be stored in. |
| **Stereo Out** | Logic's master bus, the mix of everything. The limiter goes here. |

## 📍 Logistics

- **Software:** Final Cut Pro and Logic.
- **Where:** confirm with the instructor which computers, and whether this can be done at home.
- **Raw files and video tutorials:** [Post Mini Phase 3 folder (SharePoint)](https://chapman0.sharepoint.com/:f:/s/AdamBoreckiLargeFilesTeachingResources/ErWfd_yoP_dAnMSf_MGicz8Bd-MIgHZSPD11HmsErOCisw?e=ZGxkfM).
  Chapman sign-in.

## 🧰 Ingredients

- A 4K video file.
- The backup video camera's file is **missing**, on purpose. Work with what you have.
- The primary audio, as a **Logic** project. One irregularity: the applause was added after the
  recording and exists **only in the Logic project**. Editing by the sound of the applause is
  important, so the instructor added "fake" applause.
- A backup audio recorder's file.
- The concert **program**: your map of what's being played, in what order.

## 📦 Deliverables

- **A 4K complete concert file.** No effects, except maybe a little brighter. It keeps everything
  from before the stage manager to after the encore, talking included.
- **One video file per piece** (or per stretch of talking), numbered with two digits: `01`, `02`,
  `03`, `04`.
- **One more file per movement,** with a lowercase letter after the number: `02a`, `02b`, `02c`
  for the movements of piece `02`.
- **Each piece's file:** video with no fade-in, and a short fade-out only. Audio: listen for a
  click at the beginning (there won't be one in this recording, but check), turn the applause down
  a little, and fade out earlier than the video.

🚩 You know, from the program, how many pieces and movements there are before you cut anything.

## 🗂️ The job, in order

1. **Data management.** Gig folder (`YYMMDD …`), `r` and `e` subfolders, raw files in a
   `From HDD` folder.
2. **Logic.** Know whether the project is a **folder** or a **package**. Its audio is `.caf`. Mute
   the tracks you don't need, put a **limiter on the Stereo Out**, and bounce the mix.
3. **Final Cut settings.** Background render off; optimized media for multicam off; one library.
4. **Import with Leave files in place.** Some camera folders block it. In your copy, rename
   them with an `x` in front first: `DCIM` → `xDCIM`, `M4ROOT` → `xM4ROOT`, `CLIP` → `xCLIP`,
   `PRIVATE` → `xPRIVATE`.
5. **Project settings:** 1080p for the individual files; metadata title **Recording**, everything
   else deleted.
6. **Multicam clip,** then check the sync at several points.
7. **Lift from Storyline, a Custom generator, and Replace with Retime to Fit.** The video shows
   this sequence.
8. **Global fixes, inside the multicam clip:** color correction (a brighter exposure); transform
   (zoom in and rotate); audio re-sync using a spare audio track, if needed.
9. **Edit the pieces first.** Tap **V** to disable a region you're cutting out. Decide what to do
   with talking (below).
10. **Then audio and fades.** **⌥ click** on the volume line adds an audio keyframe, for turning
    the applause down.
11. **Then split by movement.** Export each piece, then each movement, with its number.
12. **QC** every file against the definition of done.

### When to keep the talking

- **The complete concert file:** yes, everything, from before the stage manager to after the encore.
- **If you're ever in doubt:** keep it.
- **If it's very short and inconsequential:** you can cut it.

🚩 Pieces are edited before audio and fades, and audio and fades before splitting by movement.

## ✅ Definition of done

- 🚩 A 4K complete concert file, with no effects except maybe a little brighter.
- 🚩 One file per piece, numbered `01`, `02`, `03`, and so on.
- 🚩 One extra file per movement, lettered `02a`, `02b`, `02c`, and so on.
- 🚩 Every piece file: no video fade-in, a short video fade-out, and an audio fade-out a little earlier.
- 🚩 Applause is turned down a little, not cut off.
- 🚩 Talking is kept wherever you were in doubt.

## 💭 Before you leave

**Q1 (fill in the blank).** Piece 03 is a sonata in three movements. Its files are named ______,
plus ______, ______, and ______.

✅ **Answer.** `03`, plus `03a`, `03b`, and `03c`.

**Q2 (multiple choice).** In what order do the slides have you work?

- a) Split by movement, then fades, then edit the pieces
- ✅ b) Edit the pieces, then audio and fades, then split by movement
- c) Fades first, so they're never forgotten
- d) It doesn't matter

**Q3 (multiple choice).** Two movements are played **attacca**. What does that mean for your edit?

- a) There's applause between them to cut at
- ✅ b) There's no pause between them, so you have to find the musical join to cut at
- c) The second movement is an encore
- d) You leave them in one file and don't letter them

**Q4 (short answer).** A performer says a few words before the last piece. Do you keep it in the
complete concert file? In the individual files?

✅ **Answer.** **The complete concert file keeps everything**, talking included. For the individual
files: keep it if it matters or if you're in doubt; cut it only if it's very short and
inconsequential.

**Q5 (multiple choice).** Why did the instructor add "fake" applause to this recording's Logic
project?

- a) To make the recording sound more impressive
- ✅ b) Editing by the sound of the applause is important, and the real applause wasn't on the recording
- c) To hide a mistake in the performance
- d) Applause is always added in post

## ⚙️ Technical verification

- ❓ **Lift from Storyline → Custom generator → Replace with Retime to Fit:** what the sequence is
  for and its exact clicks are in the video, not the slides. The Concert Post Checklist has the
  same steps ("Lift from Storyline," "Add Custom," "refit the time"); confirm they're the same
  procedure.
- ❓ **4K complete concert file vs. a 1080p project.** The slides set projects to 1080p but deliver
  the complete concert in 4K. Confirm how: a separate 4K project, or a different export setting.
- ❓ The `x`-prefix renames: still needed with the current cameras? Always on the Post drive copy,
  never the card?
- ❓ Where the Logic bounce goes, and whether it's WAV.
- ❓ The SharePoint folder link is from the 2024 slides. Confirm it still opens.

## 🤖 AI use disclosure

Written by AI (Claude, via Claude Code) from the instructor's 2024 Post Production "Mini" slides
(Phase 3). The key-term definitions for classical terms were added by AI and are general music
vocabulary, not from the slides. Nothing was tested in Final Cut or Logic for this page.
