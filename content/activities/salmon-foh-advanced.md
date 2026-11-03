---
id: salmon-foh-advanced
title: "Salmon FOH: X32 Fault Scenarios"
emoji: "🔊"
coreSkillAreas:
  - Live Sound
status: In Development
revised: "2026-11-03"
estimatedTime: "Not yet timed. A scenario takes 2–10 minutes; run as many as the session has room for."
access:
  mode: On campus
  location: "Salmon Recital Hall, on the training rig from the Salmon FOH: X32 Learning Checklist."
  supervision: "Run by a trainer who knows the rig and works from the answer key. Trainees get the worksheet."
groupSize:
  minimum: 2
  ideal: "2–3, plus the trainer"
  maximum: 4
  solo: false
activityFamily: "Salmon Recital Hall"
level: "The Learning Checklist's training rig, built and working · harder faults, two at once, mid-show crises"
roundsSupported: true
---

> 🧪 **Status: In Development.** Drafted November 2026 as the scenario bank for the
> **Salmon FOH: X32 Learning Checklist**. It uses that page's training rig, and its gear facts
> come from the **Vocal Jazz** and **CME** gig checklists. Some faults use X32 features those
> checklists don't cover (mute groups, DCAs, polarity, SOLO). Where a button or menu on Salmon's
> X32 isn't confirmed, the scenario says so and **Technical verification** lists it.

## 🎚️ What this is

The trainer's bag of faults for Salmon's X32. Build the rig and pass **Everything working** in the
[Salmon FOH: X32 Learning Checklist](../../salmon-foh-basic/) first, and run a few of its standard
ten. Then come here.

These are harder: faults that look like other faults, two faults at once, requests from a
director, and crises in the middle of a song. Each one is rated:

- 🌶️ One clear cause, a few minutes.
- 🌶️🌶️ The obvious guess is wrong, or it needs a menu.
- 🌶️🌶️🌶️ Two faults, a time limit, or a decision you have to explain.

The trainer picks the order. Nobody needs to do all of them.

## 🗝️ Key terms

**signal path** · **destination** · **meter** · **pre-fader** · **post-fader** · **mute group** ·
**DCA** · **SOLO** · **polarity** · **gate** · **compressor** · **clip** · **feedback** ·
**SENDS ON FADERS**

## 🕹️ Practice first

- [Mixer Lab: Vocal Jazz in Salmon](https://adamborecki.github.io/mixer-lab/#/x32-vj-lowcut): the
  gains, low cut and dynamics, a muted channel, a missing send, and the wedge path, on a virtual X32.
- [Mixer Lab: CME in Salmon](https://adamborecki.github.io/mixer-lab/#/x32-cme-gtr): the band's
  channels, the amps on stage, a bad cable and the end of the night.

## 🧑‍🏫 How a drill runs

- 🚩 The rig passes **Everything working** before the first drill, and the level sheet is filled in.
- 🚩 The trainer plants the fault while the trainees are out of sight, then reads the complaint out
  loud, in the performer's voice.
- 🚩 Before touching anything, say three things: **where** it's wrong (the house, the singers'
  wedges, the band's wedge, the headphones, everywhere), **what still works**, and **where you'll
  look first**.
- 🚩 Find it, fix it, and prove it's fixed by listening where it was wrong.
- 🚩 Write down what you found and what fixed it. A time is optional.
- 🚩 The trainer checks that nothing else was changed along the way, and puts the rig back to the
  level sheet before the next one.

**Trainer's rules.** One fault at a time, unless the scenario says two. Amps off, or the music
stopped, whenever a speaker cable moves. Keep everything at talking level. Never plant something
that could damage gear or hearing; if a fault needs that, talk it through instead. Put every fault
back, and say so out loud.

## 🔎 How to find anything

The same three questions every time:

1. **Which destinations are wrong?** One wedge, both singers' wedges, the house, everything. Listen
   to each one. A fault that hits one destination lives on that destination's path.
2. **Is there signal at the meter?** Flat: the problem is **before** the console (the mic, the
   receiver, the cable, 48V, the routing). Moving: it's **after** (mutes, faders, sends, outputs,
   amps, speakers).
3. **Walk from the last good place to the first bad one.** Everything in between is a suspect;
   everything outside it isn't.

## 🎤 Wireless and singers

**Q1 (short answer).** 🌶️🌶️ **“The alto's too loud, and you can't fix it.”** FOH pulls CH 3 down
and the wrong singer gets quieter. Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** have two singers swap handhelds (black/yellow and black/orange) without
moving. **Fix:** swap the mics back, then line check again. **Watch for:** they suspect the mics
before the console, and they learn the lesson: a channel's name is a label, the line check is the
proof.

**Q2 (short answer).** 🌶️🌶️ **“Everything's backwards.”** Every time FOH turns up black/red,
black/orange gets louder, and the other way round. The singers have their own mics.
Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** at the X32's rear panel, swap the two XLRs in LOCAL 1 and 2, so receiver
1's CH 1 lands on CH 2 and its CH 2 on CH 1. **Fix:** swap them back. **Watch for:**
after the last drill they check the singers' mics first and find them right, so they go to the
X32's rear panel. Skip this one if the X32's rear panel can't be reached safely.

**Q3 (short answer).** 🌶️ **“Mic 4 is crunchy.”** Black/green sounds distorted, its meter hits the
top, and its GAIN is 30 dB like the others. Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** turn receiver 1's CH 4 VOL knob well up from 9 o'clock. **Fix:** VOL back to
9 o'clock. Don't fix it at the X32: every wireless channel stays at 30 dB. **Watch for:** they ask
"what feeds the preamp?" when the GAIN matches the others.

**Q4 (short answer).** 🌶️ **“Mic 2 is barely there.”** Black/orange is very quiet in the house
and the wedges, and its meter barely moves. GAIN is 30 dB. Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** turn receiver 1's CH 2 VOL knob almost all the way down. **Fix:** back to 9
o'clock. **Watch for:** the same lesson as the crunchy mic, the other way round. Turning up its
GAIN would "work" and break the 30 dB rule.

**Q5 (short answer).** 🌶️ **“Every time I move my hand, there's a thump.”** Black/red's singer
hears a boom in the house whenever they shift their grip. Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** LOW CUT off on CH 1. **Fix:** LOW CUT back on at 80 Hz. **Watch for:**
they compare CH 1's settings with a channel that sounds right.

**Q6 (short answer).** 🌶️🌶️ **“I sound like a phone call.”** Black/yellow's singer sounds thin
and small in the house and the wedges, and only them. Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** CH 3's LOW CUT up to about 300 Hz. **Fix:** back to 80 Hz. **Watch for:**
they notice LOW CUT is on (so it "looks right") and read its frequency anyway.

**Q7 (short answer).** 🌶️🌶️ **“It chops off the ends of my phrases.”** Black/green's soft notes
and the ends of words disappear, then come back when they sing louder. Found: ______ ·
Fixed by: ______

✅ **Answer.** **Plant:** turn on CH 4's gate with a high threshold. **Fix:** gate off. The rule for
the singers is no dynamics. **Watch for:** "comes back when louder" should point at a gate, not at
the mic or the battery.

**Q8 (short answer).** 🌶️🌶️ **“Mic 1 is pumping.”** Black/red gets quieter every time they sing
loud, and the room noise swells back up between phrases. Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** turn CH 1's compressor on with a low threshold and a high ratio. **Fix:**
compressor off. **Watch for:** they can tell this from the gate drill: a gate cuts quiet sounds, a
compressor squashes loud ones.

## 🎸 The band

**Q9 (short answer).** 🌶️🌶️ **“The bass knob moves the guitar.”** FOH turns up CH 29 and the
guitar gets louder; CH 30 brings up the bass. Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** swap sub snake tails 5 and 6 at the S32 (IN 29 and IN 30). **Fix:** swap
them back, then have each player play alone while you watch the meters. **Watch for:** the same
lesson as the swapped handhelds, on the band side: the fix is at the S32, not the console.

**Q10 (short answer).** 🌶️ **“No guitar anywhere.”** CH 30 is flat, the guitarist says they're
playing, and the SM57 is right where it was. Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** the guitar amp's own volume (its MASTER, on the cart's Katana) all the way
down. **Fix:** ask the player, then bring it back up. **Watch for:** they check the amp before the
console, and they ask before touching anyone's amp.

**Q11 (short answer).** 🌶️🌶️ **“The keyboard is a whisper.”** CH 25 barely moves even with its
GAIN much higher than the level sheet says. Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** turn the keyboard's own volume nearly down, and turn CH 25's GAIN up 10 dB
so it "looks fixed". **Fix:** the keyboard's volume back up, and CH 25's GAIN back to the level
sheet. **Watch for:** they fix it at the source and put the GAIN back. Two changes, and only the
level sheet shows the second one.

**Q12 (short answer).** 🌶️🌶️🌶️ **“The piano sounds hollow.”** Either piano mic alone sounds
fine. Both up together, the piano is thin and has no low end. Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** flip the polarity (Ø) on CH 28. **Fix:** polarity back to normal. Two mics
on one source, one flipped, cancel each other's low end. **Watch for:** "fine alone, wrong
together" is the clue. Find the polarity button on Salmon's X32 before the session; see Technical
verification.

**Q13 (short answer).** 🌶️ **“The guitar is thin and full of drums.”** CH 30 works, but the guitar
is small and distant, and there's a lot of everything else in it. Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** move the SM57 a couple of feet back from the amp, or turn it away from the
speaker. **Fix:** close to the grille, pointed at the speaker. **Watch for:** they walk to the
stage and look before reaching for EQ or GAIN. Fix it at the mic.

**Q14 (short answer).** 🌶️🌶️ **“The bass is in the band's wedge, but not the house.”** CH 29's
meter moves, its fader is up, it isn't muted, and it's in MIX 11. Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** take CH 29 off the main LR bus (its MAIN assignment, so the fader no longer
feeds the house). **Fix:** assign it back. **Watch for:** they've ruled out MUTE and the fader, so
they look at where the channel is sent. Find the assignment button on Salmon's X32 before the
session; see Technical verification.

## 🎛️ The console

**Q15 (short answer).** 🌶️🌶️ **“I pulled the piano down and nothing changed.”** FOH brings CH 27
and 28 down; the house stays the same, but the singers say the piano just vanished from their
wedges. Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** turn SENDS ON FADERS on for MIX 1 and leave it on when handing back the
console. **Fix:** switch it off, then put the piano's MIX 1 send back. **Watch for:** they realize
the faders were moving a wedge mix, and they check for SENDS ON FADERS any time a fader "does
nothing".

**Q16 (short answer).** 🌶️ **“Where did my faders go?”** The input faders are showing something
that isn't the singers or the band. Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** switch the input fader section to a different layer (the BUS layer, say).
**Fix:** press the CH 1-16 layer button (green when it's on), or CH 17-32 for the band. **Watch
for:** they read the scribble strips before moving anything.

**Q17 (short answer).** 🌶️🌶️ **“Half the band went silent at once.”** CH 25–30 are out of the
house and the wedges. Nobody touched their MUTE buttons. Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** assign CH 25–30 to a mute group and switch that MUTE GROUPS button on.
**Fix:** switch the group off, then tell the trainer it was there; at a real gig, ask before you
change a mute group someone else set up. **Watch for:** "several channels at the same instant"
points at something they share, not at each channel.

**Q18 (short answer).** 🌶️🌶️ **“The singers are quiet in the house, and their faders are up.”**
CH 1–4 are at their usual spots, but the singers are much quieter in the house than at
soundcheck. The wedges are fine. Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** assign CH 1–4 to a DCA and pull that DCA fader well down. **Fix:** the DCA
back to 0. **Watch for:** faders that look right, a house that sounds wrong, wedges unaffected: a
control above the channel faders. Skip if Salmon's X32 has DCAs set up for something else.

**Q19 (short answer).** 🌶️ **“My headphones only hear the bass.”** At FOH, the X32's headphones
play one channel, while the house sounds normal. Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** press SOLO on CH 29. **Fix:** clear the solo. **Watch for:** they confirm
the house is fine first. A solo changes what the engineer hears, not what the audience hears.

**Q20 (short answer).** 🌶️🌶️ **“Every time FOH pulls the piano down, we lose it too.”** The
singers say the piano in their wedges follows the house fader. Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** set CH 27 and 28's MIX 1 sends to post-fader. **Fix:** back to how the
house sets up MIX 1 (pre-fader is the usual choice for a wedge; see Technical verification).
**Watch for:** they can explain pre and post: a pre-fader send ignores the fader, a post-fader send
follows it.

**Q21 (short answer).** 🌶️🌶️ **“The band is dead, the singers are fine.”** CH 25–30 are flat; the
sub snake and the S32 look normal. Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** ROUTING → INPUT, set 25–32 to Local 25-32. **Fix:** back to AES50 A25-32.
On Local, those channels hear the X32's own rear inputs (where the PTU-7000 plugs in), not the S32.
**Watch for:** they check routing because the whole block failed together.

## 🔈 Outputs and amps

**Q22 (short answer).** 🌶️ **“Both singers' wedges are silent.”** The music test into MIX 1
plays nothing, the NX3000 is on, and the band's wedge works. Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** with the amp off, move the XLR from S32 OUT 1 from the NX3000's CH A input
to CH B, then switch the amp back on. **Fix:** amp off, back to CH A, amp on. **Watch for:** they
follow the path back from the wedges to the amp's input.

**Q23 (short answer).** 🌶️ **“Our wedges are barely on.”** MIX 1's master is where it was, and
every send is up, but both singers' wedges are much quieter than at the music test.
Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** turn the NX3000's CH A level knob most of the way down. **Fix:** back to the
level sheet. **Watch for:** the level sheet makes this a ten-second fix.

**Q24 (short answer).** 🌶️ **“Our wedges died, and nothing else did.”** The singers' wedges went
silent; the house and the band's wedge are fine; every singer's send to MIX 1 is up.
Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** pull MIX 1's master fader all the way down (or mute MIX 1). **Fix:** back
up. **Watch for:** every send up and still silent means look one step later: the mix's own master.

**Q25 (short answer).** 🌶️🌶️ **“The house went quiet. The rack looks fine.”** The X32's MAIN LR
meters move, the Mix5's channel is at U, and the hall's speakers are silent.
Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** unplug the two 1/4" cables from the S32 into the Mix5, and put them on top
of the rack. **Fix:** plug them back into the same inputs. **Watch for:** they look at the cables,
not only the knobs. It happens for real: people borrow those cables.

**Q26 (short answer).** 🌶️🌶️ **“Spot it before the music starts.”** Something about the stage
setup will cause trouble the moment the singers get loud. Found: ______ · Fixed by: ______

✅ **Answer.** **Plant:** turn the singers' second wedge to face the back wall or the audience
instead of the singers. **Fix:** back to facing the singers. **Watch for:** they walk the stage
before turning anything up. A wedge pointed the wrong way doesn't reach the singer and pushes
the mics toward feedback.

## 🎬 Showtime

These happen mid-song. The trainer starts the test music (or a singer starts singing) before
reading the complaint, and the clock runs.

**Q27 (short answer).** 🌶️🌶️ **“Mic 3 just died, mid-song.”** Black/yellow's singer holds up a
dead mic. Time to get them back: ______ · What you did: ______

✅ **Answer.** **Plant:** switch black/yellow off (press and hold) while they're singing. **Fix:**
hand them the spare (CH 16), bring CH 16's fader up and CH 3's down; deal with the dead mic later.
**Watch for:** it only takes seconds if the spare's channel was already set up. If it wasn't, that's
the lesson.

**Q28 (short answer).** 🌶️🌶️🌶️ **“The wedges are starting to ring.”** During a quiet song, the
singers' wedges start to squeal. What you did first: ______ · Then: ______

✅ **Answer.** **Plant:** with everyone warned, raise MIX 1's master slowly until the first hint of a
ring, then stop. Skip this one if you can't keep it gentle. **Fix:** pull MIX 1 down a few dB right
away (fast first, then find the cause: the turned wedge, a singer pointing a mic at it, or a send
that's crept up). **Watch for:** they move the master, not a channel. Speed matters more than
precision.

**Q29 (short answer).** 🌶️🌶️ **“More piano for us, less for the audience.”** The director asks
for both during a run-through. What you changed: ______

✅ **Answer.** **Request, not a fault.** **Fix:** turn up CH 27 and 28's MIX 1 sends, and bring their
faders down a little. **Watch for:** two different controls, and the house change doesn't move the
wedges. If it does, the sends are post-fader: that's Q20.

**Q30 (short answer).** 🌶️ **“The bass player can't hear the singers.”** The band's wedge has the
band but no voices. What you changed: ______

✅ **Answer.** **Plant:** every singer's send to MIX 11 all the way down. **Fix:** bring them up,
using SENDS ON FADERS on MIX 11, then switch it off. **Watch for:** they go straight to MIX 11's
sends and leave MIX 1 alone.

## 🧩 Two at once

**Q31 (short answer).** 🌶️🌶️🌶️ **“All the singers are dead.”** The receivers are dark. (After the
first fix, keep going.) Found: ______ · and ______

✅ **Answer.** **Plant:** the wireless rack's Furman off, **and** black/orange muted at the mic (a
tap). **Fix:** the Furman on, then black/orange unmuted. **Watch for:** after the rack comes back,
they line check all five mics instead of stopping when most of them work.

**Q32 (short answer).** 🌶️🌶️🌶️ **“Nothing comes out anywhere.”** Every meter moves and every
speaker is silent. (After the first fix, keep going.) Found: ______ · and ______

✅ **Answer.** **Plant:** music stopped and the amp off: unplug the AES50 Cat5e, **and** move the
NX3000's input from CH A to CH B; then the amp back on. **Fix:** AES50 back in (the house and the
band's wedge come back), then the amp's input back to CH A. **Watch for:** they listen to every
destination again after the first fix.

**Q33 (short answer).** 🌶️🌶️🌶️ **“The house is dead.”** The wedges are fine. (After the first fix,
keep going.) Found: ______ · and ______

✅ **Answer.** **Plant:** MAIN LR muted on the X32, **and** the Mix5's channel LEVEL down. **Fix:**
unmute MAIN LR (its meters come back), then the Mix5 back to U. **Watch for:** they use the MAIN LR
meters to split the problem: the console first, then the rack.

## 🏁 The handover

**Q34 (short answer).** 🌶️🌶️🌶️ **“The handover.”** The trainer has left three things wrong
somewhere. Run the **Vocal Jazz Reset** and the end-of-session steps, and find all three. Found:
______ · ______ · ______

✅ **Answer.** **Plant (pick three):** CH 9–16 left on AES50 A9-16; the Mix5's channel left down; LOW
CUT off on one handheld channel; a gate on; one handheld left on in the drawer; the NX3000 left on.
**Fix:** each one, back to the reset. **Watch for:** they work the reset line by line instead of
looking for "something wrong". The reset finds them; guessing doesn't.

## ✅ Definition of done

- 🚩 At least one scenario from each heat (🌶️, 🌶️🌶️, 🌶️🌶️🌶️), each found, fixed, and proved fixed by
  listening.
- 🚩 For each one, you said where it was wrong and what still worked, before touching anything.
- 🚩 Every planted fault is put back, and the rig is reset.

## 💭 Before you leave

- 🚩 Which scenario fooled you, and what was the first thing you checked that you shouldn't have?

## ⚙️ Technical verification

**From the Vocal Jazz and CME gig checklists (confirmed by the instructor, October–November 2026):**
the rig's routing, gains, low cut and dynamics rules, the wireless rack (the Furman, receiver 1 on
LOCAL 1–8, the VOL knobs at 9 o'clock, the PTU-7000 on LOCAL 25–28), the sub snake on S32 IN 25–32,
the NX3000 CH A wedge chain, the active wedge, the Mix5 channel LEVEL, SENDS ON FADERS, the
Katana's MASTER knob, and that the Mix5's cables get borrowed.

**Still open. Check these on Salmon's X32 before a session uses them:**

- **Whether the training rig works at all.** It's new: see the Learning Checklist's open items.
- **Mute groups (Q17) and DCAs (Q18).** The X32 has both, and the Super Simple Salmon photos show a
  MUTE GROUPS button lit. What Salmon's mute groups and DCAs are set up for, if anything, isn't
  known. Don't overwrite a setup someone relies on.
- **Polarity (Q12)** and **the main LR assignment (Q14):** where each one is on Salmon's X32, by its
  own labels. Not yet photographed.
- **Pre- or post-fader sends (Q20).** How MIX 1 and MIX 11's sends are tapped at Salmon by default
  isn't confirmed. CME's photo shows Output 9 taking MixBus 9 post fader, which is the output, not
  the channel sends.
- **The receivers' VOL range (Q3, Q4).** That turning VOL up makes a channel clip at 30 dB, and down
  makes it nearly silent, is expected but not tested.
- **Swapping XLRs at the X32's rear panel (Q2):** whether LOCAL 1 and 2 can be reached without
  moving the console.
- **The feedback drill (Q28)** is the trainer's call. Keep it to the first hint of a ring, or talk
  it through instead.
- **Whether a channel's MUTE silences its wedge sends** on Salmon's X32 the way Mixer Lab's X32 does.
  The muted-channel drills assume it does.

## 🤖 AI use disclosure

Drafted by AI (Claude, via Claude Code) at the instructor's request: a large set of creative
faults for a trainer to plant on the training rig, building on the instructor's examples (no 48V, a
muted mic). The scenarios, their ratings and the trainer's notes are the AI's design; the gear facts
are from the Vocal Jazz and CME checklists and Mixer Lab. Features those checklists don't cover are
listed above as open. Not yet run as a session.
