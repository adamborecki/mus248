---
id: salmon-foh-basic
title: "Salmon FOH: X32 Learning Checklist"
emoji: "🎚️"
coreSkillAreas:
  - Live Sound
status: In Development
revised: "2026-11-03"
estimatedTime: "Not yet timed. Plan on most of a session: the build, then a few fault drills."
access:
  mode: On campus
  location: "Salmon Recital Hall: the FOH X32 and wireless rack, the stage, the stage-side rack (S32), the amp rack, the hall's mains rack, and the storage closet in BH 102."
  supervision: "A training session run by a trainer who already knows the rig. The trainer works from the answer key; trainees get the worksheet."
groupSize:
  minimum: 2
  ideal: "2–3, plus the trainer"
  maximum: 4
  solo: false
activityFamily: "Salmon Recital Hall"
level: "X32 · wireless handhelds · S32 + Hosa sub snake · a wedge chain on one mix, an active wedge on another · the hall's speakers"
roundsSupported: false
---

> 🧪 **Status: In Development.** Drafted November 2026 by putting two gig checklists together:
> the **Vocal Jazz Gig Checklist** (the singers, the wedge chain, the hall's speakers) and the
> **CME Gig Checklist** (the band on the sub snake, an active wedge on its own mix). Every gear fact
> here comes from one of those two pages. The **training rig itself is new**: nobody has built this
> exact combination yet. See **Technical verification**.

## 🎚️ What this is

A training session for running **front of house (FOH)** on Salmon's **X32**. You build one rig that
borrows from both of Salmon's big sound gigs:

- From **Vocal Jazz**: singers on **wireless handhelds**, every one at the **same gain**, and a
  **daisy chain** of passive wedges on **one mix**, through the hall's own speakers.
- From **CME**: a small **band** on the **Hosa sub snake** (piano mics on **48V**, DIs, a mic on a
  guitar amp), and an **active wedge** on **its own mix** for the band.

Then the **trainer breaks it**, one fault at a time, and you find and fix each one. This page has
the build and the ten standard faults. The **Salmon FOH: X32 Fault Scenarios** page has the harder
ones, on the same rig.

**How a session runs:**

1. Build the rig with this page, top to bottom.
2. The trainer signs off **everything working** (the section near the end).
3. **Fault drills.** The trainer plants one fault while you're out of the room or looking away,
   then reads you the complaint. Find it, fix it, and write down what it was.
4. Put everything back: the end-of-session steps and the **Vocal Jazz Reset**.

The trainer works from the **answer key**, which says how to plant each fault and what fixes it.
Everybody else works from the printed worksheet.

## 🗝️ Key terms

**front of house (FOH)** · **LOCAL** · **AES50** · **S32** · **sub snake** · **48V** · **GAIN** ·
**fader** · **send** · **mix bus** · **MAIN LR** · **daisy chain** · **passive speaker** ·
**active speaker** · **music test** · **line check** · **level sheet**

## 🕹️ Practice first

Both Salmon gigs this rig comes from are in Mixer Lab, on a virtual X32. A phone works.

- [Mixer Lab: Vocal Jazz in Salmon](https://adamborecki.github.io/mixer-lab/#/x32-vj-local): the
  singers, the routing, the gains and the wedge chain, with eight faults from the Vocal Jazz checklist.
- [Mixer Lab: CME in Salmon, everything working](https://adamborecki.github.io/mixer-lab/#/x32-cme-tour):
  the band on the sub snake and three wedges on three mixes. Start with nothing broken: walk the
  signal to every speaker, then try the thirteen scenarios after it.

Neither simulator has this exact rig. Where Mixer Lab and this page disagree, this page wins. Tell
the trainer what you found.

## 🧰 Equipment and materials

From the FOH mic drawer and the charger at FOH:

- [ ] **Four handhelds with black windscreens**: black/red, black/orange, black/yellow, black/green
  (mics 1–4)
- [ ] **One gray-windscreen handheld** as the spare: gray/gray (mic 16) or any of 14–16
- [ ] **Two AA cells per handheld**, from the charger on top of the mic cabinet
- [ ] **Headphones** for the X32

From the storage closet, **BH 102**:

- [ ] **Two passive wedges** and **speakON cables**
- [ ] **One active wedge**, with its **IEC power cable** and an **XLR**
- [ ] An **XLR cable** from the stage box to the monitor amp
- [ ] The **Hosa sub snake** ("Little Bro")
- [ ] **Two DI boxes** (a keyboard and a bass)
- [ ] **Two pencil condensers** for the grand piano, and an **SM57** with a short stand for a guitar amp
- [ ] A **guitar amp** and its **amp stand**, from the **School of Rock band cart**, if no player
  brings one
- [ ] **AC extension cords** (the **black milk crates**)

Already at FOH: the **FOH Mac mini**, which plays test music through its **SSL 2+** into the X32's
**AUX IN 1/2**.

No band? Anyone can make the sound. Play a few notes on the piano, pluck the bass, strum the
guitar. You're testing the path, not the playing.

## ⚠️ Before you touch anything

- 🔌 **Power order:** mixer and sources first, **amps last**. At the end, amps off **first**.
- 🔇 **Amps off, or the music stopped, before you plug or unplug a speaker cable.** That goes for the
  trainer planting a fault, too.
- 🎤 **The handheld's one button:** a **tap** mutes or unmutes it. **Press and hold** switches it
  on or off.
- 🔋 **Never put alkaline batteries in the charger.** It's for the rechargeable cells only.
- 🔈 **Keep it at talking level.** Drills happen at a level you could talk over. Nobody needs a
  loud fault to learn from it.
- 🙋 **Say it before you touch it.** In a drill, tell the trainer what you think is wrong and
  where you'll look, then look.

## 🗺️ The training rig: inputs and outputs

The X32's input routing stays at **Salmon's default**: CH 1–24 **Local**, CH 25–32 **AES50 A25-32**
(the S32). The singers are on the first layer, the band on the second.

| CH | Source | How it gets there |
|---|---|---|
| 1–4 | Black/red, orange, yellow, green handhelds: the singers | Receiver 1, CH 1–4 → LOCAL 1–4 |
| 16 | Gray/gray handheld: the spare, ready but fader down | Receiver 2, CH 8 → LOCAL 16 |
| 25 | Keyboard, through a DI | Sub snake 1 → S32 IN 25 |
| 27, 28 | Grand piano: two pencil condensers, **48V** | Sub snake 3, 4 → S32 IN 27, 28 |
| 29 | Bass, through a DI | Sub snake 5 → S32 IN 29 |
| 30 | Guitar amp: SM57 | Sub snake 6 → S32 IN 30 |

| Mix | What's in it | Goes to |
|---|---|---|
| MAIN LR | Everyone | S32 OUT 15, 16 → the **Mix5** in the hall's mains rack → the hall's speakers |
| MIX 1 | The singers, plus some piano for pitch | S32 OUT 1 → XLR → NX3000 **CH A** → speakON → wedge 1 → speakON → wedge 2 |
| MIX 11 | The band, plus the singers | S32 OUT 11 → XLR → the **active wedge** (its own power and **VOLUME**) |

MIX 1 is the Vocal Jazz wedge mix; MIX 11 is CME's third wedge. The singers' two wedges share one
mix, so they can share one amp channel in a daisy chain. The band's wedge has a different mix, so
it gets its own path.

**Q1 (fill in the blank).** Mic 1 to the singers' wedges: handheld → ______ → X32 LOCAL 1 → CH 1 →
its send to ______ → AES50 → S32 OUT 1 → XLR → ______ CH A → ______ cable → wedge 1 → wedge 2

✅ **Answer.** Receiver 1 · MIX 1 · NX3000 · speakON. The receivers plug into the X32's own rear
panel (LOCAL), and every output leaves through the S32, so AES50 carries the wedge mix to the stage.

**Q2 (fill in the blank).** The piano to the house: two pencil condensers (with ______ on) →
sub snake 3, 4 → S32 IN 27, 28 → ______ → CH 27, 28 → MAIN LR → S32 OUT ______ → the ______ in
the hall's mains rack → the hall's speakers

✅ **Answer.** 48V · AES50 · 15, 16 · Mix5. The band comes in through the S32 and the house goes out
through it, so one AES50 cable carries both directions.

## 📡 Power and console

- 🚩 Switch the **wireless rack** on at the **Furman** on top. The receivers' displays light up.
- 🚩 Check **ROUTING → INPUT**: **1–8 = Local 1-8**, **9–16 = Local 9-16**, **17–24 = Local 17-24**,
  **25–32 = AES50 A25-32**. If 1–24 show AES50, no handheld reaches the console. Fix this first.
- 🚩 Every handheld's channel (CH 1–4 and the spare, CH 16) at **30 dB** of **GAIN**.
- 🚩 Those same channels: **LOW CUT on at 80 Hz**, and **no dynamics**: gate off, compressor off.
- 🚩 Don't trust a saved scene. Scene **01: SALMON-DEFAULT** exists, but check each setting yourself.

## 🔊 The mains: the hall's speakers

- 🚩 In the hall's **mains rack**, the **Mackie Mix5**: the channel that S32 OUT 15/16 come in on is
  at **U**. If the last gig was CME, it may still be turned down.
- 🚩 Check the two 1/4" cables from the S32 into the Mix5 are still there. People borrow them.
- 🚩 Play test music from the FOH Mac mini (SSL 2+ → AUX IN 1/2) and confirm **both** hall speakers
  play it.

## 🎧 The wedges: two mixes

- 🚩 Bring the **two passive wedges**, the **active wedge** and the cables out of **BH 102**.
- 🚩 Switch the **NX3000** on, after the console is on.
- 🚩 An **XLR** from S32 **OUT 1** into the NX3000's **CH A** input.
- 🚩 A **speakON** from NX3000 **CH A**'s output into wedge 1, then a **speakON** from wedge 1's other
  jack into wedge 2.
- 🚩 The **active wedge**: an **XLR** from S32 **OUT 11**, and its **IEC power cable** plugged in. Its
  **VOLUME** up.
- 🚩 Set the singers' two wedges in front of the singers, **facing them**. The active wedge goes by
  the band.

## 🎵 The music test, before any mic

- 🚩 Bring the house down. Test music into **MIX 1** only, and listen: **both** singers' wedges play
  it, and the active wedge doesn't.
- 🚩 Test music into **MIX 11** only: the **active wedge** plays it, and the singers' wedges don't.
- 🚩 Set the **NX3000 CH A** level and the active wedge's **VOLUME** while the music plays, so the
  two kinds of wedge sound about the same. One person at the amp, one at the X32. After this, mix at
  the console.

## 🎤 The singers' mics

- 🚩 Two batteries in each handheld, the right way round; **press and hold** to switch it on.
- 🚩 **Line check**, in color order, black/red first: each person talks into their own mic. Watch
  **its own channel's meter** move, then hear it in the house.
- 🚩 Send each singer to **MIX 1** and **MIX 11**. Use **SENDS ON FADERS**, and switch it **off**
  again when you're done.
- 🚩 Check each singer in both wedges.
- 🚩 Set up the **spare** (CH 16) the same way: 30 dB, low cut, in MIX 1 and MIX 11, **fader down**.
  If a mic dies mid-show, you hand over the spare and bring up its fader. That only works if its
  channel is already set up.

## 🎸 The band

- 🚩 Put the **Hosa sub snake** by the piano; its tails go into **S32 IN 25–32**, in order.
- 🚩 Plug in by the input list: the **keyboard DI** on 1, the **pencil condensers** on 3 and 4, the
  **bass DI** on 5, the **SM57** on the guitar amp on 6.
- 🚩 **48V** on **CH 27 and 28** (the condensers). Nothing else on this rig needs it.
- 🚩 Check every band channel's meter while someone plays that instrument. A mic on an amp that
  shows nothing: check the **amp's own volume** before the console.
- 🚩 Set each band channel's **GAIN** so it peaks about **−18 to −6**. GAIN first; faders are for the
  mix.
- 🚩 The band in **MIX 11**, and the piano (CH 27, 28) in **MIX 1** so the singers have pitch.

## 📝 Write it down

- 🚩 Every GAIN, and the two wedge knobs, on the level sheet below. Keep it at FOH.

**Q3 (short answer).** Level sheet: CH 1 ______ · CH 2 ______ · CH 3 ______ · CH 4 ______ ·
CH 16 ______ · CH 25 keys ______ · CH 27 ______ · CH 28 ______ · CH 29 bass ______ ·
CH 30 guitar ______ · NX3000 CH A ______ · active wedge VOLUME ______

✅ **Answer.** CH 1–4 and 16 are 30 dB every time. The rest are tonight's numbers: the point is
having them, so a bumped knob can be put back in seconds.

## 🏆 Everything working

The trainer checks this with you before the first drill.

- 🚩 Every singer and every band channel is in the house, on its own channel.
- 🚩 Every singer is in **both** wedges; the band is in the active wedge; the piano is in the
  singers' wedges.
- 🚩 SENDS ON FADERS is **off**, and the level sheet is filled in.

## 🧰 If something doesn't work

Work down the list and stop when it's fixed. The first question is always **where** it's wrong:
the house, the singers' wedges, the band's wedge, or everywhere.

- 🚩 **Signal at the mixer?** Watch the channel's meter.
- 🚩 **A handheld:** muted at the mic (a tap) or off (press and hold)? The receiver shows its signal.
- 🚩 **Every handheld at once:** the wireless rack's **Furman**, then **ROUTING → INPUT**.
- 🚩 **A condenser:** **48V**. **A mic on an amp, or a DI:** the instrument's own volume.
- 🚩 **Meter moves, but not in the house:** the channel's **MUTE**, its **fader**, then **MAIN LR**.
  Then the rack: the **Mix5** and its cables.
- 🚩 **In the house but not a wedge:** the channel's send to that wedge's mix, then the mix's own
  master.
- 🚩 **A wedge dead:** the amp or the active wedge's power and VOLUME, then reseat every cable on its
  path.
- 🚩 **Everything is silent, but every meter moves:** the **AES50** cable between the X32 and the
  S32.
- 🚩 **Still nothing:** swap the cable. Tag a bad one with gaff tape and tell the trainer.

## 🔧 Fault drills: the standard ten

The trainer plants one, then reads you the complaint. For each: write **what you found** and
**what fixed it**. Each one is something that has gone wrong, or easily could, at a real Salmon gig.

**Q4 (short answer).** 🔧 **“The piano's gone.”** The pianist is playing, but there's no piano in
the house or the wedges, and CH 27 and 28 don't move. Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** 48V off on CH 27 and 28. **Fix:** 48V back on for both (faders down first:
it pops). Pencil condensers need phantom power; the DIs and the SM57 don't. **Watch for:** they read
the meters and check 48V before walking to the stage.

**Q5 (short answer).** 🔧 **“My mic just stopped.”** Black/yellow's singer says they're talking
and nothing comes out anywhere. The receiver's display is lit. Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** tap black/yellow's button once, so it's muted at the mic (still on).
**Fix:** a tap unmutes it. **Watch for:** they ask the singer, or look at the mic, before
touching the console. The meter is flat, so the X32's MUTE can't be the cause.

**Q6 (short answer).** 🔧 **“I'm not anywhere.”** Black/red's singer isn't in the house or the
wedges, but CH 1's meter moves when they talk. Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** press CH 1's MUTE on the X32. **Fix:** unmute it. The meter moving rules
out the mic, the battery and the receiver; on the X32 a muted channel is out of the house and the
wedges. **Watch for:** they tell this apart from the last drill: a flat meter is the mic, a moving
meter with no sound is the channel.

**Q7 (short answer).** 🔧 **“All the singers are dead.”** Every handheld is on, the band is fine,
and the receivers' displays are dark. Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** switch the wireless rack off at the Furman. **Fix:** switch it back on,
then line check every mic again: the receivers take a moment to come back. **Watch for:** "the
displays are dark" should send them to the rack, not to the batteries.

**Q8 (short answer).** 🔧 **“No mic meters, but the receivers show signal.”** All five handhelds
are on, the receivers show signal, and CH 1–4 and 16 are flat. Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** ROUTING → INPUT, set 1–8 and 9–16 to AES50 (A1-8, A9-16). **Fix:** back
to Local 1-8 and Local 9-16. The receivers plug into the X32's own rear panel, so those channels
have to listen to LOCAL. **Watch for:** they go to the ROUTING page early, because "the receivers
are fine" rules out the mics.

**Q9 (short answer).** 🔧 **“I can't hear myself.”** Black/green's singer is in the house, and
the other singers are in the wedges. Black/green isn't. Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** CH 4's send to MIX 1 all the way down (leave its MIX 11 send). **Fix:**
bring it back up to match the others; the level sheet doesn't have sends, so match by ear and by
SENDS ON FADERS. **Watch for:** "in the house" means the mic and the channel work, so they look only
at the monitor path. Do they also check the band's wedge?

**Q10 (short answer).** 🔧 **“The wedge on the right is dead.”** The singers' left wedge is fine.
The right one is silent. Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** with the NX3000 off, unplug the speakON between wedge 1 and wedge 2, then
switch the NX3000 back on. **Fix:** amp off, plug the link back in, amp on. **Watch for:** they
switch the amp off before touching a speakON, and they reason that wedge 1 working means the amp
and MIX 1 are fine.

**Q11 (short answer).** 🔧 **“The hall's speakers are silent.”** The X32's MAIN LR meters are
moving and every wedge works. Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** turn the Mix5's LEVEL down on the channel S32 OUT 15/16 come in on: what
CME does and sometimes forgets to undo. **Fix:** back to U. Not MAIN MIX. **Watch for:** MAIN LR
meters moving means the X32 is sending, so the fault is downstream: they go to the rack.

**Q12 (short answer).** 🔧 **“The band's wedge is dead.”** The singers' wedges and the house are
fine. Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** unplug the active wedge's IEC power cable (or turn its VOLUME all the way
down; pick one, and tell them which one it was afterwards). **Fix:** power back in, VOLUME back to
the level sheet. **Watch for:** they remember an active wedge has its own power and knob, before
they blame MIX 11.

**Q13 (short answer).** 🔧 **“Every meter's moving, but nothing comes out.”** The house and every
wedge went silent at the same moment. Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** music stopped, unplug the Cat5e (etherCON) between the X32's AES50 A and
the S32. **Fix:** plug it back in and wait for the S32 to sync. The wireless meters moving and
everything silent means the outputs are what's common. The band's meters die too, which is a
second clue: they come in on the S32. **Watch for:** they ask "what do all the silent things have
in common?"

## 🏁 End of the session

- 🚩 The trainer puts back anything still planted, and says so out loud.
- 🚩 Amps off **first**: the NX3000, and the active wedge's power.
- 🚩 Handhelds off (press and hold), batteries out. Rechargeables back in the charger; alkalines
  never do. Mics back in the FOH drawer.
- 🚩 **48V** off on CH 27 and 28 before you unplug the condensers.
- 🚩 The Mix5's channel at **U**.
- 🚩 Run the **Vocal Jazz Reset** on the X32: it puts back the routing, the gains and the low cut.
- 🚩 Switch the **wireless rack off** at the **Furman**.
- 🚩 Everything back in **BH 102** in its place, and its door closed properly: the fixed half
  flush, its flush bolt over, then the other half.

## ✅ Definition of done

- 🚩 The rig passed **Everything working** with the trainer.
- 🚩 You found and fixed at least five of the standard ten, and said what each one was.
- 🚩 Nothing planted is left behind, the X32 is reset, and BH 102 is closed.

## 💭 Before you leave

- 🚩 Which fault took you longest, and what would have found it faster?

## ⚙️ Technical verification

**From the Vocal Jazz and CME gig checklists (confirmed by the instructor, October–November 2026):**

- ROUTING → INPUT default: CH 1–24 Local, CH 25–32 AES50 A25-32. The wireless receivers plug into
  the X32's rear panel: receiver 1 → LOCAL 1–8 (black windscreens), receiver 2 → LOCAL 9–16 (gray).
- Every wireless channel at 30 dB; no dynamics; mics 14–16 are the spares at FOH.
- The handheld's button: tap = mute, hold = power. The wireless rack's master switch is the Furman.
- The S32 is on AES50 A. Its OUT 1 carries the X32's Output 1; OUT 11 carries MIX 11 (CME);
  OUT 15/16 carry MAIN L/R to the Mix5 in the hall's mains rack.
- The Vocal Jazz wedges: S32 OUT 1 → XLR → NX3000 CH A → speakON, daisy-chained.
- CME: the sub snake on S32 IN 25–32; pencil condensers on 48V; the active wedge (XLR, IEC power,
  VOLUME). Test music: FOH Mac mini → SSL 2+ → AUX IN 1/2. The Mix5 channel LEVEL, not MAIN MIX.

**Still open:**

- **The training rig is new.** This exact combination (two wedges in a chain, the active wedge on
  MIX 11, the band on the sub snake, the hall's speakers) hasn't been built yet. Check it in the
  room before the first session.
- **Wedge count in BH 102.** The Vocal Jazz checklist lists three passive speakON wedges; CME lists
  two passive (1/4" only) and one active. Whether two speakON wedges **and** the active wedge are
  there at the same time, and whether these are the same boxes, isn't confirmed.
- **Output 1 = MIX 1.** S32 OUT 1 carries Output 1 (confirmed), but whether Output 1 is set to MIX 1
  hasn't been photographed (the same open item as Vocal Jazz).
- **Is the spare on receiver 2, CH 8 → LOCAL 16?** Assumed from the windscreen naming (gray is
  9–16). The spare's channel, and whether it's set up at a normal gig, isn't confirmed.
- **The keyboard and the grand piano** for a training session: whose keyboard, and whether the
  piano and the pencil condensers are available outside a CME gig.
- **Low cut at 80 Hz** is still the AI's recommendation for Vocal Jazz; the instructor was thinking
  100 Hz.

## 🤖 AI use disclosure

Drafted by AI (Claude, via Claude Code) at the instructor's request, as a hybrid of the Vocal Jazz
and CME gig checklists, with the signal flow checked against Mixer Lab's Salmon scenarios. The
training rig, its patch, the order of the build and the fault drills are the AI's design from
those sources; every gear fact is from one of the two checklists. Not yet run as a session.
