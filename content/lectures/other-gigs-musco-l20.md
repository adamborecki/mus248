> 🤖 **AI use:** outline drafted with Claude Code from the instructor's planning message (Nov 10),
> the [Vocal Jazz](../../vocal-jazz-gig-checklist/), [Mariachi](../../mariachi-gig-checklist/),
> [CME](../../cme-gig-checklist/), [Musco](../../musco-gig-checklist/) and
> [L-20 Multitrack](../../l20-multitrack-gig-checklist/) checklists, the
> [CL3 Dante Stems](../../cl3-dante-stems/) activity, Mixer Lab, and the previous lectures.

> 🧑‍🏫 Every gear fact here comes from a checklist on this site; the open ones are flagged in a note
> on their slide. Refresher questions and Quiz 8 come after class, from this text.

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
2. Vocal Jazz: a reminder, plus the recording session
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

### A cloud session

- Claude Code in a ==cloud session==: it runs on a computer in the cloud, not yours
- It edits the ==GitHub== repo directly, from your ==phone==
- That's how this site is built: photos and a dictated walkthrough from the gig → a checklist
- Today's Mariachi, Musco multitrack, and L-20 checklists were all made that way

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

> 🧑‍🏫 Exact inputs (piano L/R on 25/26, room pair on 27/28?) not confirmed yet. The Vocal Jazz
> checklist's optional Dante → Logic step covers the recording half.

### Dante considerations

- The X32's ==routing== has to be right: **ROUTING → CARD**, every block on **Local**, out the
  **X-DANTE** card
- Dante Controller: the X32 → the FOH Mac mini, ==one-to-one==
- Logic's **Input Device** = **Dante Virtual Soundcard**, set **before** you make the tracks
- The ==inputs== in Logic have to be right too: a whole bunch of tracks, Input 1 with
  **==Ascending==** on, so track n gets input n
- ==Record enable== every track, then a short test: every track has its own source

## 3. Other Salmon Gigs: Mariachi and CME

### Same hall, three gigs

| | Vocal Jazz | Mariachi | CME |
|---|---|---|---|
| ==Mics== | 13 wireless | ==9== wireless (no trumpet mics) | 5 wireless + band on a sub snake |
| ==House== | The hall's speakers | The hall's speakers | Its own, ==downstage== |
| ==Wedges== | 3 wedges, 1 mix | **==6== wedges, 6 mixes** | 3 wedges, 3 mixes |

- Same X32, same S32, same default routing. What changes: the ==outputs==

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

### Mariachi: the handheld that dies

- It happens at most gigs. A ==spare== comes in on **its own** channel
- Don't re-patch the receivers: set up the spare's ==channel== like the dead one (gain, low cut, sends)
- Sends stay ==pre-fader==
- At the Nov 6 dress rehearsal, the **red** handheld died at soundcheck

### CME: the comparison

- Its own mains ==downstage==: every open mic is behind them
- The hall's speakers turned down at the ==Mix5==, and the next gig (Mariachi) has to turn them back up
- A band on a ==sub snake== into S32 IN 25–32 (AES50)

> 🧑‍🏫 The Mix5 hand-off is the one real link between the two: CME turns the hall down, Mariachi
> finds it silent.

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

### Dante Controller: the whole building

- One ==Dante== network carries the **==live show==**: the ==mains==, every ==monitor== mix
- Click only the receiver row with **your own** computer's ==name==
- ==Filter== Receivers first, so nothing else is on screen
- October: the room's Mac Pro wouldn't talk to Dante. The department MacBook recorded the
  whole concert instead. Don't debug during the gig

### One dongle, two jobs

- A **==USB-C== dongle** with both **==Ethernet==** and **==USB-A==**
- Ethernet: the **==spare==** yellow cable behind the desk → ==Dante==. Never the CL5's or the Mac Pro's
- USB-A: the **USB ==MIDI== interface** → the CL5's 5-pin MIDI port
- DVS warns **480 Mbps** (USB 2 speed): click OK. It recorded 40 channels fine. The ==test
  recording== is what proves it

### The CL5 writes the mix

- New this semester: the **==CL5==**'s fader moves go to Logic as **MIDI**
- Logic records them as ==automation== on each track
- So the basement mix is a **real mix** of the multitrack, ready to use later
- It took real time to set up: practice it **before** the concert

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

### Automation modes: Latch, then Read

| Mode | What it does |
|---|---|
| **==Read==** | Plays the automation back. Writes nothing |
| **Touch** | Writes while you're moving the fader, then goes back to what was there |
| **==Latch==** | Writes from the first move, and **holds** the last value until you stop |
| **Write** | Overwrites everything from the start, moving or not |

- During the concert: **every track on ==Latch==**. Without it, the CL5's moves aren't written
- After: every track back to **Read**, so nothing gets written over by accident

> 🧑‍🏫 Latch during, Read after is from the Oct 29–30 setup. The rest of the table is how Logic's
> modes work in general. Why Latch and not Touch: the CL5 sends fader values, not "my hand let go",
> so a mix written in Latch stays where the CL5 left it.

### Save it like a gig

- Save **before** anything is recorded: date and ensemble, e.g. `261029 Jazz Combo Big Band`
- Organize as a **==Folder==**, not a Package: the audio files show up in Finder
- Copied to a second drive **before** the MacBook leaves the room

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

### Recording in Logic

- Logic's **Input Device** and **Output Device**: **ZOOM ==L-20== Driver**
- Tracks 1–14 on **In 1–In 14**, named from the input list: input n → track n
- **==Record enable== every track** (the R button). A track that isn't armed records nothing
- Every track's **I** (input monitoring) ==off==: nobody hears the band through Logic
- ==Save== with the date in the name, and after every take
- [L-20 Multitrack Recording Checklist](../../l20-multitrack-gig-checklist/)

### The faders lie

- Not ==motorized==
- The ==green LED== is the real level
- After FADER MODE or a scene recall, the caps stay put
- Move the fader through the LED, then it takes over

### Recorded vs. heard

- USB to Logic comes from ==before== the fader: only **GAIN** changes the recording
- Channels 1–16 ==muted== on purpose: live mics out of the headphones
- Headphones: Logic's ==click== → USB 1-2 → 17/18 → MONITOR OUT A → the HP12U

> 🧑‍🏫 "A mute doesn't stop the USB feed" is what happened Nov 2 (it recorded fine with 1–16
> muted); the manual only says so for the SD card. Still open on the checklist.

### Two monitor paths

- The L-20's own mix: no ==delay==
- Through Logic: buffer 1024 ≈ 27 ms out, about 53 ms round trip
- The same mic both ways = doubled, an ==echo==
- Rule: ==one== path per sound

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
