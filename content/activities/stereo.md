---
id: stereo
title: Basic Stereo Recording
emoji: "🎙️"
coreSkillAreas:
  - Audio Capture
status: In Development
estimatedTime: "40–55 minutes"
access:
  mode: On campus
  location: "Anywhere with a stable, quiet-ish sound source. Needs the stereo recording kit and a computer with recording software."
  supervision: "None required once you know where the kit lives."
groupSize:
  minimum: 1
  ideal: "2"
  maximum: 2
  solo: true
activityFamily: ""
level: "XY · AB · ORTF"
roundsSupported: true
externalResource:
  label: "Original instructions"
  url: "https://docs.google.com/document/d/1VvSACp670AeqwC2mtHm2zBEiFgfT8DpeRFddJt4jnjA/edit?usp=sharing"
---

> 🧪 **Status: In Development.** Reorganized with AI assistance from a short internal design outline. The three mic-technique definitions and the −12 to −6 dBFS target are cross-checked against this course's own quiz content and are solid; the equipment and room details below still need a hands-on check — see **Technical verification** at the bottom.

## 🎚️ Core skill area

**Stereo Audio Capture.**

## 🌍 Why this matters

Most of the recording you'll do as a working engineer doesn't need eight microphones and a multitrack session — it needs two, placed well, feeding a clean stereo pair. A solo recital, a small ensemble, a quick archival capture of a rehearsal: a matched stereo pair is often the entire signal chain. Getting the pair, the panning, and the gain right is the single most common recording task you'll actually be asked to do.

## 🎯 What you'll practice

By the end of this activity, you should be able to:

- 🎙️ Set up and record a matched stereo pair using three standard techniques — XY, AB, and ORTF.
- 🎚️ Pan and gain-match a stereo pair correctly, and recognize it by ear and on the meter when you haven't.
- 📉 Identify clipping, a too-quiet signal, and a healthy peak level, and know which direction to move the gain for each.

## 🗝️ Key terms

**XY** · **AB (spaced pair)** · **ORTF** · coincident / near-coincident · **phase** · mono compatibility · **stereo image** · **panning** · **gain staging** · **phantom power (48V)** · **clipping** · **dBFS** · **headroom** · peak level · stereo bar

## 📍 Logistics

**Estimated time:** 40–55 minutes for all three techniques plus the gain-staging drill. Budget more the first time through; the second and third rounds go faster.

**Where:** Anywhere reasonably quiet with a sound source (your voice, an instrument, a phone playing music) works. You need the stereo recording kit — computer, audio interface, matched mic pair, stereo bar — in one place.

**Access:** On campus, independently, once you have the kit. No instructor or TA needed for the base activity.

**Group size:** Minimum 1 · ideal 2 · maximum 2. Solo is fine — you'll just do both jobs yourself.

**Roles (pairs):** Rotate every round so both partners run the full setup at least once.

- **Mic operator** — positions the stereo bar and both mics, sets the spacing and angle for the technique.
- **Levels operator** — sets gain on the interface, arms the track(s), watches the meter, starts and stops the recording.

🔄 **Switch roles** after each technique.

## 🧰 Equipment and materials

- [ ] Computer with recording software (a DAW, or any app that records two channels to a stereo or two mono WAV files)
- [ ] Audio interface (this kit defaults to a **Focusrite 2i4**)
- [ ] A matched pair of microphones
- [ ] Stereo bar, with two mic clips
- [ ] Two mic stands
- [ ] Two XLR cables
- [ ] Headphones
- [ ] A phone or camera to photograph your setup
- [ ] Somewhere to save WAV files as you go
- [ ] A sound source you can repeat consistently — your own voice reading the same sentence works well, since it makes the three techniques directly comparable

## ⚠️ Safety and handling — read this before you touch anything

- 🔌 **Turn phantom power (48V) off before connecting or disconnecting any microphone**, and before moving cables at the interface. Hot-plugging a mic with 48V engaged can pop loudly in your headphones and, on some gear, can damage the mic. Confirm whether your mics need 48V before you turn anything on — if they're condensers, they do; if you're not sure, ask before engaging it.
- 🎧 **Start with headphone volume low** before your first test recording. A loud pop from a gain or phantom-power mistake, straight into headphones, is a real hearing-safety issue, not just an inconvenience.
- 🚫 **Never intentionally push a live performance into clipping.** You'll clip on purpose later in this activity — but only ever on your own test recordings, never during an actual concert or recital you're recording for someone else.

## 📉 Reading the meter — the target you're aiming for

Every recording you make in this activity gets judged by where its peak lands on the meter, so get this straight before you start.

**dBFS** (decibels relative to full scale) is how a digital meter reports level. **0 dBFS is the ceiling** — audio cannot go higher than that in a digital system. Push a signal above it and the waveform doesn't get louder, it gets **clipped**: the peaks are chopped flat, and that distortion is permanent. You cannot fix clipping after the fact by turning the track down — the information above 0 dBFS is simply gone.

| Situation | Peak level | Why | 
|---|---|---|
| **Too loud** | At or above 0 dBFS | Clips. Unrecoverable distortion. |
| **Just right** | **−12 to −6 dBFS** | Enough headroom that a louder moment in the performance won't clip, but well above the noise floor. |
| **Too quiet** | Well below −12 dBFS (for example, around −38 dBFS) | Technically clean, but you'll need to raise the level significantly afterward — which raises the noise floor right along with it. |

The reason you don't just record as loud as possible, right up against 0 dBFS: performances get louder than soundchecks. A quiet passage during setup can turn into a loud passage during the actual performance, and you want headroom in reserve for that moment, not zero margin.

**Q1 (fill in the blank).** The healthy peak-level target for this activity is **−______ to −______ dBFS.**

## 🚀 Get ready

1. Gather the kit: interface, mic pair, stereo bar, stands, cables, headphones.
2. Connect the interface to your computer and open your recording software.
3. Create a new session or project. Make a habit of naming files clearly as you go (technique + take number) — you'll be making several recordings back to back.
4. Decide who is mic operator and who is levels operator for Round 1.
5. With gain all the way down and phantom power off, mount both mics on the stereo bar and connect them to the interface.

🚩 **Checkpoint.** Before you engage phantom power or raise any gain, confirm: headphone volume is low, and both mic cables are fully seated.

## 🎙️ Part 1 — Three techniques, three rounds

Do all three. Each one is a full round: set up, connect, gain-match, record, verify, photograph.

| Technique | Setup | Stereo image | Mono compatibility |
|---|---|---|---|
| **XY** | Two directional mics, capsules as close together as possible ("coincident"), angled apart (roughly 90°–135° between them) | Narrower, tightly focused | Excellent — capsules are nearly in the same spot, so there's almost no time difference between channels |
| **AB** | Two mics spaced apart (try 30–60 cm to start), facing the source | Wide, spacious | Weakest of the three — spacing creates real time-of-arrival differences that can partially cancel when summed to mono |
| **ORTF** | Two cardioid mics spaced **17 cm** apart, angled **110°** from each other ("near-coincident") | A standard compromise between XY and AB | Good — better than AB, not quite as strong as XY |

### Round 1 — XY

1. Mount both mics on the stereo bar as close together as the mounts allow, angled apart per the table above.
2. Connect left mic → interface input 1, right mic → interface input 2. Engage phantom power if your mics need it.
3. In your software, create a stereo track (or two mono tracks) fed from inputs 1 and 2.
4. **Check panning.** If you're recording to two mono tracks, pan the track fed by the left mic hard left and the track fed by the right mic hard right. If you're recording straight to an interleaved stereo file, this is already handled by which mic feeds which input — confirm it rather than assume it.
5. **Match gain.** Set both input gain knobs to the same value. There's rarely a reason for a matched pair to run at different gains.
6. Do a test recording of your sound source, aiming for the −12 to −6 dBFS target above.
7. Record your take. Play it back in headphones.
8. Photograph the setup before you break it down.

🚩 **Checkpoint.** Play back your XY take. You should hear a tight, focused stereo image — not obviously wider than a mono source, but with real left/right information.

🔄 **Switch roles.**

### Round 2 — AB

Repeat the same steps with the mics spaced apart per the table (30–60 cm is a reasonable starting point — try adjusting the spacing and listening to what it does to the width). Reconnect, re-check panning (this is a fresh setup — don't assume last round's routing carried over), re-match gain, record, play back, photograph.

🚩 **Checkpoint.** Play back your AB take against your XY take. The AB image should sound noticeably wider.

**Q2 (multiple choice).** Which technique's stereo image usually holds up best when the recording is summed to mono?

- a) XY
- b) AB
- c) ORTF
- d) All three are identical in mono

🔄 **Switch roles.**

### Round 3 — ORTF

Set the spacing and angle exactly per the table (17 cm, 110°) — this one has a fixed standard, unlike AB's looser spacing. Reconnect, re-check panning, re-match gain, record, play back, photograph.

🚩 **Checkpoint.** Play back all three takes back to back. You should be able to hear XY as narrowest, AB as widest, and ORTF in between.

**Q3 (fill in the blank).** ORTF spaces its two cardioid mics ______ cm apart, angled ______° from each other.

## 📉 Part 2 — The gain-staging drill ("Goldilocks")

Pick whichever technique from Part 1 was quickest to set up. Using that same setup, make three short recordings of the same source, changing only the gain knob between them:

| # | Target | What you're demonstrating |
|---|---|---|
| 1 | **Too loud** — push it into clipping on purpose | What clipping looks like on the meter and sounds like in playback |
| 2 | **Too quiet** — well below −12 dBFS, in the neighborhood of −38 dBFS | Why "just turn it up later" doesn't actually fix an under-gained recording |
| 3 | **Just right** — peak between −12 and −6 dBFS | The target you should be hitting on every real recording from here on |

🚩 **Checkpoint.** Look at your too-loud take's waveform. Clipped peaks look flat-topped, not rounded — that's the visual signature of digital distortion, and it's why you can't fix it by turning the track down afterward.

**Q4 (multiple choice).** Your too-quiet take peaks around −38 dBFS. If you raise that track's level after the fact to compensate, what do you also raise?

- a) The sample rate
- b) The noise floor
- c) The stereo width
- d) Nothing — this fixes the recording completely

## 🛠️ Troubleshooting

Work in signal-flow order: source → mic → cable → interface input/gain → software track → pan/level → playback.

**IF you get no signal at all:**
→ Check the cable is fully seated at both ends.
→ Check phantom power is on, if your mics need it.
→ Check the gain knob isn't all the way down.
→ Check the correct input is selected and the track is armed/record-enabled in your software.

**IF the signal is present but very quiet:**
→ Check the gain knob — it's probably lower than you think.
→ Check phantom power is actually engaged, if needed — some condensers produce almost nothing without it.
→ Check the mic isn't in a pad/attenuate mode, if it has one.

**IF playback sounds like everything is in the middle, with no left/right separation:**
→ Check that your two tracks aren't both panned center. This is the single most common mistake with a mono-tracks-to-stereo-pair setup — pan one hard left, the other hard right.

**IF one channel is louder than the other:**
→ Check both gain knobs actually match — it's easy to nudge one while adjusting the other.
→ Check both mics are the same distance from the source.

## ✅ Definition of done

- 🚩 Three takes recorded and played back — one each for XY, AB, and ORTF — with matched gain and correct panning.
- 🚩 One labeled setup photo per technique (three total).
- 🚩 The three-part gain-staging drill completed: a clipped take, a too-quiet take, and a take peaking between −12 and −6 dBFS.
- 🚩 You can point to your too-loud take's waveform and explain why it can't be fixed after the fact.

Keep your WAV files and setup photos — you'll need them for your submission (see **After this activity**, below).

## ⭐ Bonus / if time allows — swap the interface

The Focusrite 2i4 is this kit's default interface, but the skill transfers to any audio interface or portable recorder. If time allows, repeat one technique on a different unit:

- Zoom F8 (Kitchen of OH B01)
- Zoom H4n Pro (Pantry #6 of OH B01)
- Zoom H5 (Pantry #6 of OH B01)
- SSL 2+ (Pantry #4 of OH B01)

The controls will be in different places, but the same three checks — panning, matched gain, and a −12 to −6 dBFS peak — apply no matter what you're holding.

## 🧹 Finish, reset, put away

1. Stop and save your recordings. Confirm the files are actually on disk before you break anything down.
2. Turn phantom power off, then disconnect the mics.
3. Break down the stereo bar and stands, coil the cables properly, and return everything to the kit.
4. Leave the workstation and kit ready for the next person.

## 💭 Before you leave

- Which of the three techniques would you reach for first if you only had five minutes to set up? Why?
- What's the one thing you'd check first if a stereo recording came back sounding mono?

## ⚙️ Technical verification

**Last verified:** the three mic-technique definitions and the −12 to −6 dBFS peak target are cross-checked against this course's own quiz question bank (which already tests them) and are solid. Everything below is transcribed from a short internal design outline and has not been re-checked against the physical kit.

- **Kit storage location.** The outline names the Focusrite 2i4 and the alternate interfaces' rooms (Kitchen/Pantry #4/Pantry #6 of OH B01) but not where the *default* kit — interface, mic pair, stereo bar — actually lives. Confirm and add it above.
- **Microphone model.** The outline says "stereo mics" without naming a model. Confirm which mics this kit actually pairs, and whether they're condensers (phantom power required) — the safety note above assumes they might be and instructs students to check.
- **Recording software.** The procedure is written DAW-agnostic (create a track, set its input, arm it) because no specific software is named in the source material. If this course standardizes on one, add its exact menu names and screenshots.
- **AB spacing.** "30–60 cm" is a reasonable common starting range, not a value from the source material, which left AB spacing open. Confirm or adjust.
- **Room/cabinet names for the alternate interfaces.** Confirm "Kitchen of OH B01," "Pantry #6 of OH B01," and "Pantry #4 of OH B01" are still current.

## 🤖 AI use disclosure

Based on a short internal design outline (required materials, deliverables, and a numbered instruction list) and substantially AI-drafted from there into the standard MUS 248 activity structure — the equipment list, safety notes, gain-staging framing, procedure, troubleshooting, and questions are new. The three mic-technique definitions and the −12 to −6 dBFS target were cross-checked against this course's existing quiz content rather than invented. Pending instructor review.
