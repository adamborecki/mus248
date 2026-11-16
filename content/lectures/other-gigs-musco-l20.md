> 🤖 **AI use:** outline drafted with Claude Code from the instructor's planning message (Nov 9),
> the [Vocal Jazz](../../vocal-jazz-gig-checklist/), [Mariachi](../../mariachi-gig-checklist/),
> [CME](../../cme-gig-checklist/), [Musco](../../musco-gig-checklist/) and
> [L-20 Multitrack](../../l20-multitrack-gig-checklist/) checklists, the
> [CL3 Dante Stems](../../cl3-dante-stems/) activity, Mixer Lab, and the previous lectures.

> 🧑‍🏫 **Delivered Nov 9.** Every gear fact here comes from a checklist on this site; the open ones
> are flagged in a note on their slide. Refresher questions (25) were written after class from this
> text, and stay off the AES50 A card routing and the 31 → 64 jump, which aren't confirmed.

## 📣 Announcements

### Homework review

**Today:** Week 12 · Class 11

**After today:** 3 classes (2 + 1 meeting in finals week)

Everything due this week, with due dates: **see Canvas**.

> 🧑‍🏫 Placeholder until the homework list is written. Quiz 8 is take-home, opening after class
> (access code in the quiz overview).

## 🎤 Overview

### Today

1. Vibecoding: an update
2. Vocal Jazz: a reminder, plus the recording session variation
3. Other Salmon gigs: Mariachi and CME
4. Musco: Big Band and Jazz Combo
5. Multitrack recording on the Zoom L-20

## 1. Vibecoding: An Update

### Last time: account vs. Pages

| | GitHub account | GitHub Pages |
|---|---|---|
| Example | `github.com/adamborecki` | `adamborecki.github.io` |
| What it is | You, and your ==repos== (the code) | The ==website== published from a repo |

- Same username, two addresses: the ==code== and the ==site==

### Markdown vs. HTML: one example

The same three lines, written two ways:

```
# Salmon Recital Hall
The **X32** is at FOH.
[Mariachi checklist](mariachi.html)
```

```
<h1>Salmon Recital Hall</h1>
<p>The <strong>X32</strong> is at FOH.</p>
<a href="mariachi.html">Mariachi checklist</a>
```

- ==Markdown==: the shorthand people write. Every checklist here
- ==HTML==: what the browser reads, every part in ==tags==

### Claude Code vs. Claude (and Codex vs. ChatGPT)

| | The chat app | The coding agent |
|---|---|---|
| Anthropic | Claude | **==Claude Code==** |
| OpenAI | ChatGPT | **==Codex==** |

- The chat app: you talk, it answers, **you** copy things where they go
- The ==coding agent==: it reads the ==repo==, edits the files, runs the ==tests==, commits

**Q1 (multiple choice).** What can a coding agent like Claude Code or Codex do that the chat app can't?

- a) Answer questions about code
- ✅ b) Read the repo, edit its files, run the tests, and commit
- c) Write Markdown

✅ **Answer.** The chat app answers and you copy things where they go. The coding agent works in the repo itself: reads, edits, tests, commits.

### A cloud session

- Claude Code in a ==cloud session==: it runs on a computer in the cloud, not yours
- It edits the ==GitHub== repo directly, from your ==phone==
- That's how this site is built: photos and a dictated walkthrough from the gig → a checklist
- Today's Mariachi, Musco multitrack, and L-20 checklists were all made that way

**Q2 (fill in the blank).** Claude Code running on a computer in the cloud, editing the GitHub repo directly from your phone, is a ==cloud session==.

✅ **Answer.** A cloud session runs Claude Code on a computer in the cloud, so you can change the repo from your phone. That's how this site's checklists get made.

## 2. Vocal Jazz: A Reminder

### Last week, in one slide

- Thirteen ==wireless== handhelds, ==LOCAL== inputs on the X32
- The hall's speakers; three wedges on ==one== mix, daisy-chained
- Every wireless channel at the ==same== gain (30 dB)
- [Vocal Jazz Gig Checklist](../../vocal-jazz-gig-checklist/)

### Vocal Jazz: Recording Session Variation

- Add **two ==condensers== on the piano**: left and right
- Add a **stereo pair of ==room mics==**
- Pencil condensers (like the blue Audio-Technicas), ==48V== on
- Those go into the **==S32==**, the stage box: its last bank, IN 25–32
- S32 → ==AES50== → the X32 at FOH → ==Dante== → ==Logic== on the FOH Mac mini

> 🧑‍🏫 Exact inputs (piano L/R on 25/26, room pair on 27/28?) not confirmed yet. Heads-up for 2.3:
> the Vocal Jazz checklist's Dante step sets every CARD block to Local, which is right for 13
> wireless mics on Local 1–24, but S32 inputs arrive over AES50, so block 25–32 has to be AES50 A
> for this variation. Check it on the console before the session.

**Q3 (multiple choice).** What gets added to the Vocal Jazz setup for a recording session?

- ✅ a) Two condensers on the piano, plus a stereo pair of room mics
- b) A second set of wireless handhelds
- c) Three more wedges on their own mixes

✅ **Answer.** Piano left and right, plus a stereo pair of room mics: pencil condensers with 48V on.

**Q4 (multiple choice).** Where do the piano and room mics plug in?

- a) The X32's own rear panel, next to the wireless receivers
- ✅ b) The S32 stage box, its last bank (IN 25–32)
- c) Straight into the FOH Mac mini

✅ **Answer.** Into the S32's last bank. From there: AES50 → the X32 → Dante → Logic.

### Dante considerations

- The X32's ==routing== has to be right: **ROUTING → CARD** decides what goes out the
  **X-DANTE** card
- CH 1–24 (the wireless) come from **Local**. The piano and room mics come from the S32, so
  card 25–32 must be **==AES50== A**, not Local, or those tracks are silent
- Dante Controller: the X32 → the FOH Mac mini, ==one-to-one==
- Logic's **Input Device** = **Dante Virtual Soundcard**, set **before** you make the tracks
- The ==inputs== in Logic have to be right too: a whole bunch of tracks, Input 1 with
  **==Ascending==** on, so track n gets input n
- ==Record enable== every track, then a short test: every track has its own source

**Q5 (multiple choice).** For a Dante multitrack from the X32, which two things both have to be right?

- a) The wedge mixes and the main fader
- b) The wireless receivers' VOL knobs and the Mix5
- ✅ c) The X32's routing to the Dante card, and the inputs in Logic

✅ **Answer.** The X32's CARD routing decides what goes out to Dante; Logic's inputs decide which track gets which channel. Either one wrong means silent or swapped tracks.

**Q6 (fill in the blank).** To give a whole bunch of new tracks inputs 1, 2, 3… in order, create them starting at Input 1 with ==Ascending== on.

✅ **Answer.** Ascending gives track n input n, so the input list and the tracks line up.

## 3. Other Salmon Gigs: Mariachi and CME

### Same hall, three gigs

| | Vocal Jazz | Mariachi | CME |
|---|---|---|---|
| ==Mics== | 13 wireless | ==9== wireless (no trumpet mics) | 5 wireless + band on a sub snake |
| ==House== | The hall's speakers | The hall's speakers | Its own, ==downstage== |
| ==Wedges== | 3 wedges, 1 mix | **==6== wedges, 6 mixes** | 3 wedges, 3 mixes |

- Same X32, same S32, same default routing. What changes: the ==outputs==

**Q7 (multiple choice).** Which Salmon gig has six wedges on six mixes?

- a) Vocal Jazz
- ✅ b) Mariachi
- c) CME

✅ **Answer.** Mariachi: six wedges, six mixes. Vocal Jazz has three wedges on one mix; CME has three wedges on three mixes.

### Mariachi: what's the same

- The hall's ==speakers== are the house, like Vocal Jazz
- Every mic ==wireless==, receivers on LOCAL
- Separate mixes per wedge, no daisy chain, like ==CME==
- Same test order: music through the mains, then each wedge, then the mics

### Mariachi: what's different

- **Six wedges, six mixes**: MIX n on ==output== n (wedge 1 = MIX 3 … wedge 6 = MIX 8)
- Three kinds of amp path: an **==active== wedge** on XLR, two **KM750s** (speakON), the **Crown**
  (1/4" only)
- Check each wedge's ==jack== before you carry a cable to it
- **Priority:** the two vocal mics in the house and every wedge, then violins, then guitarrón, vihuela, guitarra
- Arrive ==early==: patching six wedges took extra time at the dress rehearsal

**Q8 (fill in the blank).** At Mariachi, MIX n goes out on ==output== n, so wedge 1 is MIX 3 and wedge 6 is MIX 8.

✅ **Answer.** MIX n on output n: nobody has to guess which knob is whose.

**Q9 (multiple choice).** A passive wedge only takes a 1/4" cable. Which amp can drive it?

- ✅ a) The Crown: its outputs are 1/4"
- b) A KM750: its outputs are speakON
- c) The S32, straight from an output

✅ **Answer.** Check each wedge's jack before you carry a cable to it. The 1/4"-only wedges go on the Crown.

### Mariachi: the handheld that dies

- It happens at most gigs. A ==spare== comes in on **its own** channel
- Don't re-patch the receivers: set up the spare's ==channel== like the dead one (gain, low cut, sends)
- Sends stay ==pre-fader==
- At the Nov 6 dress rehearsal, the **red** handheld died at soundcheck

**Q10 (multiple choice).** A violinist's handheld dies, and the spare comes in on its own channel. What do you do?

- a) Re-patch the receivers' XLRs so the spare lands on the old channel
- b) Turn up the dead channel's gain
- ✅ c) Set up the spare's channel like the dead one: gain, low cut, and pre-fader sends

✅ **Answer.** Don't re-patch the receivers. Set up the spare's own channel like the dead one, sends pre-fader.

### CME: the comparison

- Its own mains ==downstage==: every open mic is behind them
- The hall's speakers turned down at the ==Mix5==, and the next gig (Mariachi) has to turn them back up
- A band on a ==sub snake== into S32 IN 25–32 (AES50)

> 🧑‍🏫 The Mix5 hand-off is the one real link between the two: CME turns the hall down, Mariachi
> finds it silent.

**Q11 (multiple choice).** Mariachi is the night after CME. The X32's MAIN meters move, but the hall's speakers are silent. Where do you look?

- ✅ a) The Mix5 in the hall's mains rack: CME turns the hall's speakers down there
- b) The S32's AES50 cable
- c) The wireless rack's Furman

✅ **Answer.** CME turns the hall's speakers down at the Mix5, and the next gig has to turn them back up.

### Mixer Lab

- [Mariachi in Salmon](https://adamborecki.github.io/mixer-lab/#/x32-mariachi-tour): eleven scenarios with the band's own recording
- [CME: Everything working](https://adamborecki.github.io/mixer-lab/#/x32-cme-tour)
- [Mariachi Gig Checklist](../../mariachi-gig-checklist/) · [CME Gig Checklist](../../cme-gig-checklist/)

## 4. Musco: Big Band and Jazz Combo

### Not a normal Musco gig

- Video: the normal ==multicam== crew in the booth ([Musco Gig Checklist](../../musco-gig-checklist/))
- Audio: a live ==multitrack==, **40 tracks** in Logic, in the ==basement== recording room
- About two concerts a year. Jazz Combo uses the **same** input list and mics: write down which
  player sits in which big band ==chair==
- [Musco Multitrack Gig Checklist](../../musco-multitrack-gig-checklist/)

**Q12 (multiple choice).** What's different about audio at a Big Band or Jazz Combo concert at Musco?

- a) A stereo board feed recorded in the booth
- ✅ b) A live multitrack, 40 tracks in Logic, in the basement
- c) The H4n is the only recording

✅ **Answer.** The video crew works as normal; audio records a 40-track multitrack in the basement.

**Q13 (fill in the blank).** The Jazz Combo plays into the Big Band's mics, so write down which player sits in which big band ==chair==.

✅ **Answer.** Same input list, same mics. Without a chair map, nobody can tell later which track is which player.

### The signal flow

```
Stage mics ─► sub snakes ─► DiGiCo (upstairs) ─► Dante 01–38
ORTF room pair ─► Booth01VSubMix ─► Dante 39–40

Basement: the CL5 · the MacBook Pro (DVS ─► Logic)

CL5 MIDI ─► USB MIDI interface ─► USB-C dongle ─► MacBook ─► Logic automation
```

- Nothing to patch on stage: the ==DiGiCo== puts every channel on ==Dante==
- In the basement you ==subscribe== to them: channel n → Logic track n
- Logic records through **Dante Virtual Soundcard** (==DVS==)

**Q14 (multiple choice).** What puts the stage mics onto the Dante network at Musco?

- a) The CL5 in the basement
- b) The MacBook Pro running DVS
- ✅ c) The DiGiCo upstairs

✅ **Answer.** Nothing gets patched on stage: the DiGiCo puts every channel on Dante, and the basement subscribes to them.

### Dante Controller: the whole building

- One ==Dante== network carries the **==live show==**: the ==mains==, every ==monitor== mix
- Click only the receiver row with **your own** computer's ==name==
- ==Filter== Receivers first, so nothing else is on screen
- October: the room's Mac Pro wouldn't talk to Dante. The department MacBook recorded the
  whole concert instead. Don't debug during the gig

**Q15 (multiple choice).** In Dante Controller in the basement, which receiver rows may you click?

- ✅ a) Only the row with your own computer's name
- b) Any receiver that's missing a channel
- c) The CL5's rows, to match the recording

✅ **Answer.** One Dante network carries the live show, mains and monitors included. Filter Receivers first, and touch only your own row.

### One dongle, two jobs

- A **==USB-C== dongle** with both **==Ethernet==** and **==USB-A==**
- Ethernet: the **==spare==** yellow cable behind the desk → ==Dante==. Never the CL5's or the Mac Pro's
- USB-A: the **USB ==MIDI== interface** → the CL5's 5-pin MIDI port
- DVS warns **480 Mbps** (USB 2 speed): click OK. It recorded 40 channels fine. The ==test
  recording== is what proves it

**Q16 (multiple choice).** What are the USB-C dongle's two ports for?

- a) Ethernet for the internet, USB-A for a backup drive
- ✅ b) Ethernet for Dante, USB-A for the MIDI interface
- c) Both carry Dante audio

✅ **Answer.** One dongle, two jobs: Ethernet on the spare yellow cable for Dante, USB-A for the CL5's MIDI.

### The CL5 writes the mix

- New this semester: the **==CL5==**'s fader moves go to Logic as **MIDI**
- Logic records them as ==automation== on each track
- So the basement mix is a **real mix** of the multitrack, ready to use later
- It took real time to set up: practice it **before** the concert

**Q17 (fill in the blank).** The CL5's fader moves go to Logic as MIDI and are recorded as ==automation==.

✅ **Answer.** So the basement mix is a real mix of the multitrack, ready to use later.

### CL5 MIDI setup

**🤖 Use AI to figure out this crazy MIDI stuff!!!** Paste the CL5's MIDI table and Logic's Learn
window into a chat and ask it to explain them.

- On the CL5: **SETUP › ==MIDI/GPI==**
- It sends two numbers per fader, **Fader H** and **Fader L**. Turn **every Fader L ==off==**
- Controller numbers run **1–31** for channels 1–31, then jump to **==64==** for 32–40
- In Logic: move a fader, **⌘L** (==Learn==), move the CL5's fader. Fader Bank 1, not Selected
- Learn fader 1 and fader 31; Logic fills in between. Then the block from 64

> 🧑‍🏫 Why 31 → 64 is unverified. Likely: MIDI reserves controllers 32–63 as the fine half of
> 0–31, which is what Fader L sends.

**Q18 (multiple choice).** In the CL5's MIDI/GPI setup, what do you turn off?

- ✅ a) Every Fader L
- b) Every Fader H
- c) The MIDI channel

✅ **Answer.** The CL5 sends two numbers per fader. Turn off every Fader L and use Fader H only.

### Automation modes: Latch, then Read

| Mode | What it does |
|---|---|
| **==Read==** | Plays the automation back. Writes nothing |
| **Touch** | Writes while you're moving the fader, then goes back to what was there |
| **==Latch==** | Writes from the first move, and **holds** the last value until playback stops |
| **Write** | Overwrites everything from the start, moving or not |

- During the concert: **every track on ==Latch==**. Without it, the CL5's moves aren't written
- After: every track back to **Read**, so nothing gets written over by accident

> 🧑‍🏫 Latch during, Read after is from the Oct 29–30 setup. The rest of the table is how Logic's
> modes work in general. Why Latch and not Touch: the CL5 sends fader values, not "my hand let go",
> so a mix written in Latch stays where the CL5 left it.

**Q19 (fill in the blank).** During the concert, every track's automation mode is ==Latch==.

✅ **Answer.** Latch during the show, so the CL5's moves get written. Read after, so nothing gets written over by accident.

### Save it like a gig

- Save **before** anything is recorded: date and ensemble, e.g. `261029 Jazz Combo Big Band`
- Organize as a **==Folder==**, not a Package: the audio files show up in Finder
- Copied to a second drive **before** the MacBook leaves the room

**Q20 (multiple choice).** How do you save the Logic project?

- a) As a Package, not a Folder
- ✅ b) As a Folder, not a Package
- c) Either: it makes no difference

✅ **Answer.** A Folder's audio files show up in Finder, so they can be copied and checked like every other gig's files.

### Practice upstairs: the CL3 in OH 207

- OH 207 has a Yamaha **==CL3==**: the smaller version of the CL5. Same layout, same words
- Practice there first: [CL3: Dante Stems from Logic](../../cl3-dante-stems/) (Logic → Dante → CL3, the same subscriptions in reverse)
- Or in a browser: [Mixer Lab: Virtual soundcheck over Dante](https://adamborecki.github.io/mixer-lab/#/cl3-dante)

## 5. Multitrack Recording on the Zoom L-20

### One mic, one track

- Film Recording Workshop, Nov 2: 14 mics → 14 ==tracks== in Logic
- A **==Decca tree==** of three Telefunken M61s, plus small-diaphragm spot mics
- Mix ==later==, not live
- Same rig: a band, a choir section, a studio session
- ==48V== on all 16 inputs: every mic is a condenser, and phantom switches in banks of four

**Q21 (multiple choice).** Why is 48V on for all 16 inputs at the Film Recording Workshop?

- a) The L-20 needs it to send audio over USB
- b) It makes the headphones louder
- ✅ c) Every mic is a condenser, and phantom switches in banks of four

✅ **Answer.** Condensers need phantom, and the L-20 switches it four inputs at a time.

### Recording in Logic

- Logic's **Input Device** and **Output Device**: **ZOOM ==L-20== Driver**
- Tracks 1–14 on **In 1–In 14**, named from the input list: input n → track n
- **==Record enable== every track** (the R button). A track that isn't armed records nothing
- Every track's **I** (input monitoring) ==off==: nobody hears the band through Logic
- ==Save== with the date in the name, and after every take
- [L-20 Multitrack Recording Checklist](../../l20-multitrack-gig-checklist/)

**Q22 (fill in the blank).** A track that isn't ==record enabled|record-enabled|armed|record armed== records nothing.

✅ **Answer.** Record enable every track (the R button) before the test recording.

### The faders lie

- Not ==motorized==
- The ==green LED== is the real level
- After FADER MODE or a scene recall, the caps stay put
- Move the fader through the LED, then it takes over

**Q23 (multiple choice).** On the L-20, where do you read a channel's real fader level?

- ✅ a) The green LED beside the fader
- b) The fader cap's position
- c) The channel's GAIN knob

✅ **Answer.** The faders aren't motorized. The green LED is the real level; move the fader through it and it takes over.

### Recorded vs. heard

- USB to Logic comes from ==before== the fader: only **GAIN** changes the recording
- Channels 1–16 ==muted== on purpose: live mics out of the headphones
- Headphones: Logic's ==click== → USB 1-2 → 17/18 → MONITOR OUT A → the HP12U

> 🧑‍🏫 "A mute doesn't stop the USB feed" is what happened Nov 2 (it recorded fine with 1–16
> muted); the manual only says so for the SD card. Still open on the checklist.

**Q24 (multiple choice).** A player is too quiet in the recording. Which L-20 control fixes it?

- a) The channel's fader
- ✅ b) GAIN
- c) MUTE

✅ **Answer.** USB to Logic comes from before the fader, so only GAIN changes what's recorded.

### Two monitor paths

- The L-20's own mix: no ==delay==
- Through Logic: buffer 1024 ≈ 27 ms out, about 53 ms round trip
- The same mic both ways = doubled, an ==echo==
- Rule: ==one== path per sound

**Q25 (fill in the blank).** Rule for the headphones: ==one== path per sound.

✅ **Answer.** The L-20's own mix has no delay; through Logic is late. The same mic both ways sounds doubled, like an echo.

### Before the musicians arrive

- MacBook Pro + Telefunken M61s from the office, arranged ahead
- Input or output? The HP12U's back panel: **INPUT A** is the lower pair
- A ==test recording==: every track, every time

### Mixer Lab: Film Recording Workshop

Five scenarios on a virtual L-20, each one a real mistake from the checklist:

- [No click in the headphones](https://adamborecki.github.io/mixer-lab/#/l20-rec-click)
- [Someone fixed the mutes](https://adamborecki.github.io/mixer-lab/#/l20-rec-mutes)
- [The clarinet is tiny on its track](https://adamborecki.github.io/mixer-lab/#/l20-rec-gain)
- [The fader that lies](https://adamborecki.github.io/mixer-lab/#/l20-rec-fader-lies)
- [Tracks 13 and 14 are flat](https://adamborecki.github.io/mixer-lab/#/l20-rec-48v)

## 🗝️ Key terms

**GitHub Pages** · **Markdown** · **HTML** · **Claude Code** · **cloud session** · **room mics** ·
**AES50** · **Dante** · **active wedge** · **spare handheld** · **downstage** · **CL5** · **CL3** ·
**DVS** · **MIDI** · **automation** · **Latch** · **Read** · **multitrack** · **Decca tree** ·
**pre-fader** · **latency** · **test recording**

## 💭 Before you leave

- What's one thing a coding agent can do that the chat app can't?
- Mariachi and Vocal Jazz both use the hall's speakers. What's the biggest difference at the wedges?
- Why is every track on Latch during the Big Band concert, and back on Read after?
- On the L-20, which control changes what's recorded, and which only changes what's heard?
