> 🤖 **AI use:** drafted with Claude Code from the instructor's planning messages (Nov 2). The
> Standard Gear Kit facts come from the instructor and the
> [Standard Gear Kit Checklist](../../standard-gear-kit-checklist/); the Salmon facts come from the
> instructor, the [Vocal Jazz](../../vocal-jazz-gig-checklist/) and [CME](../../cme-gig-checklist/)
> gig checklists, and Mixer Lab.

> 🧑‍🏫 **Draft for today (Nov 2).** Three parts: (1) a quick vibecoding refresher, (2) a Standard
> Gear Kit refresher at a generic gig (Memorial specifically next week, for spaced repetition), and
> (3) Salmon FOH signal flow and gain staging, the main part: Vocal Jazz and CME, the whole gain
> chain, and Mixer Lab live. Mariachi is left out on purpose, for later. No refresher questions:
> those come from your final text. Remove `"draft": true` in `data/lectures.json` when it's done.

## 📣 Announcements

### Homework review

**Today:** Week 11 · Class 10

**After today:** 4 classes (3 + 1 meeting in finals week)

Everything due this week, with due dates: **see Canvas**.

## 🎤 Overview

### Today

1. Vibecoding: a quick refresher
2. The Standard Gear Kit: a refresher
3. Salmon FOH: signal flow and gain staging

## 1. Vibecoding: A Quick Refresher

### Why are we doing this?

- **==Repo Improvement==:** you fix the checklists you follow
- **Signal flow:** the diagrams, checklists, and ==simulators== (Mixer Lab) are all built this way
- **Training:** ==future students== learn from what you write
- Every checklist on this site is a ==text file== anyone can improve

### Your GitHub account vs. your GitHub Pages site

| | GitHub account | GitHub Pages |
|---|---|---|
| Example | `github.com/adamborecki` | `adamborecki.github.io` |
| What it is | You, and your ==repos== (code and history) | ==Websites== published from those repos |
| This course | `github.com/adamborecki/mus248` | `adamborecki.github.io/mus248/` |

- Same ==username==, two addresses: one for the ==code==, one for the ==site==
- Coming soon: **your own ==website==** at `your-username.github.io`

### Four words from GitHub

| Word | What it means |
|---|---|
| **==Fork==** | Your own copy of someone else's repo, on GitHub |
| **==Clone==** | A copy of a repo on your computer |
| **==Commit==** | A saved snapshot of your changes, with a note saying what changed |
| **==Merge==** | Your changes become part of the main version (after a pull request) |

### Markdown vs. HTML

| | Markdown (`.md`) | HTML (`.html`) |
|---|---|---|
| A heading | `# My site` | `<h1>My site</h1>` |
| Bold | `**loud**` | `<strong>loud</strong>` |
| A link | `[Mixer Lab](mixer-lab.html)` | `<a href="mixer-lab.html">Mixer Lab</a>` |

- ==Markdown==: **==shorthand==**, easy for people to write. Every checklist here is Markdown
- ==HTML==: what the ==browser== reads, every part spelled out in ==tags==

### Soon: your own

- You'll edit **your own** `README.md` (==Markdown==) and `index.html` (==HTML==) soon
- Details to be posted by ==Wednesday==

## 2. The Standard Gear Kit: A Refresher

### Any venue, same kit

- ==Memorial==, ==Fish==, or anywhere else we bring the gear: the **Standard Gear Kit**
- Two **==AX100s==**, a stereo pair into the **==F8==**, an **==H4n==** as backup
- [Standard Gear Kit Checklist](../../standard-gear-kit-checklist/)

### Ask for concert lighting

- You **must** ask for ==concert lighting==: the ==brightest== cue of the show
- Set the exposure while looking at the ==stage== **with concert lighting on**, never with the
  pre-show lights
- Must. Must. Must.

### Cameras: two AX100s, both wide

- Both **==static==**, both **==wide==**
- Different ==angles== are fine, but both wide
- One of them is the ==backup==
- Both on the **same** ==white balance==

### Audio: the F8

- Main pencil mics in **==ORTF==** or **==NOS==** → Inputs **1–2**
- **==Dual Channel== Recording** copies 1–2 to **5–6**, with the gain **==lower==** (≈ 42 dB on 1–2, ≈ 30 dB on 5–6)
- Inputs **3–4** and **7–8**: ==boundary mics== and/or a ==board feed==

### Backup: the H4n

- The H4n is the **==backup==** recording
- Gain set ==conservatively==: a quiet backup beats a ==clipped== one

### SD cards

| Device | SD card |
|---|---|
| H4n | **==8 GB==** |
| F8 | **==32 GB==** |
| Each AX100 | **==128 GB==** |

## 3. Salmon FOH: Signal Flow and Gain Staging

> 🧑‍🏫 Built around Vocal Jazz and CME (same rig, very different setups). Every fact here is from
> you, the two gig checklists, and Mixer Lab. Slide 3.11 is the live Mixer Lab walkthrough on the
> projector. 3.12 is for your own gig stories.

### Vocal Jazz and CME

| | Vocal Jazz | CME |
|---|---|---|
| Who | Singers only | A band, with lead and backing vocals |
| Mics | Thirteen ==wireless== handhelds | Five wireless, plus the band on a ==sub snake== |
| Mains | The hall's speakers | Its own, **==downstage== of the band** |
| Wedges | Three wedges, **one** mix | Three wedges, **three** ==mixes== |

- Same X32, same S32, same routing. What changes is the **==outputs==**

### Using AES50

- Mics come **in** at the ==X32==
- Everything goes **out** through the **==S32==**, the ==stage box==
- One Cat5e between them: **==AES50==**
- No AES50 link: every ==meter== moves, **every speaker is silent**

### Inputs: LOCAL vs. AES50

- **ROUTING → INPUT**: CH 1–24 = **==LOCAL==**, CH 25–32 = **AES50 A** (the S32)
- Wireless ==receivers== plug into the X32's **own** rear panel → LOCAL
- CME's band: sub snake → S32 IN 25–32 → AES50
- Last event left 1–24 on AES50? Then **no mic arrives**. Check it ==first==

### Outputs: the mains

- MAIN L/R → S32 **OUT 15/16** → the hall's ==mains rack== → the hall's speakers
- The hall's mains rack has the small **==Mackie== Mix5** on top. It's also how a teacher plugs a
  laptop or phone into the hall's speakers
- CME adds its **own**: S32 OUT 13/14 → the **Crown** at the bottom of the ==amp rack== (not the
  hall's mains rack) → two Yamaha speakers **downstage**
- Why downstage: every open mic is **==behind==** the speakers → much less ==feedback==
- CME turns the hall's speakers down at the **Mix5**: that channel's LEVEL, not MAIN MIX

### Outputs: Vocal Jazz wedges

**MIX 1 → S32 OUT 1 → XLR → NX3000 CH A → speakON → wedge → wedge → wedge**

- One ==mix==, one amp channel, three wedges in a **==daisy chain==**
- XLR carries the mix at **==line level==**; speakON carries the amp's **power**
- Not working? Check your ==routing== and ==signal flow==

### Outputs: CME wedges

- **Three mixes**: MIX 9, 10, 11 → S32 OUT 9, 10, 11
- Wedges 1 and 2 (==passive==): KM750 CH A and B → **1/4" speaker cable**
- Wedge 3 (==active==): XLR straight in, plus its own **power** and **VOLUME** knob
- Don't daisy-chain wedges on **different** mixes: every wedge in a chain plays the **==same==**
  mix, so three mixes need three amp channels
- **==Speaker== cable** (thick) is not ==instrument== cable (thin): same plug, different job
- Side note: in-ear monitors (==IEMs==) are possible later. We don't use them right now

### Gain staging: the whole chain

| Stage | Control | Its one job |
|---|---|---|
| Preamp | **==GAIN==** | How hot the signal comes **in** |
| Channel | **==Fader==** | The mix in the mains: who's louder than whom |
| Send | **Send level** | How much of this channel goes into a wedge mix |
| Bus | **MIX / MAIN ==master==** | How much of that whole mix leaves |
| Amp | **Level knob** | Set **once**, during the music test |
| Speaker | (active wedge: VOLUME) | Up, and left there |

- The fader sets the mains; the **==send==** sets each wedge. On the X32: **SENDS ON FADERS**
- Fix a level where it's **wrong**: too hot coming in → **GAIN**, not the fader
- Every stage up and ==unmuted==, or nothing comes out

### Gain staging: Vocal Jazz

- Every wireless channel at the **==same==** gain: **==30 dB==**
- The group balances **itself**, like an ensemble should
- A quiet singer is a conversation with the director, not a knob
- **==Low cut==** at 80 Hz; no gate, no ==compressor==

### Gain staging: CME

- **GAIN** each channel into the ==good== range: peaks about **−18 to −6**
- **==48V==** on the piano's two pencil condensers (CH 27, 28)
- Save your levels: a ==level sheet==, an input list, a saved ==scene==, or photos
- The point: the **gains stay the ==same==** from soundcheck through rehearsal and the show

### Test in order

1. Music you know through the **==mains==**
2. House down, then music through **each ==wedge==**
3. Amp knobs set, about the same on every channel, **while the music plays**
4. Then the mics, one at a time: the meter, the mains, the wedges

- Each wedge is checked for **==signal==** *and* **==level==**: hearing it is step one. Then watch
  what the meter shows, and how loud it actually looks and feels on stage
- In the mains but not the wedges? The mic is fine: look at the **==monitor== path**

### Mixer Lab: everything working

- [CME: Everything working](https://adamborecki.github.io/mixer-lab/#/x32-cme-tour): nothing is broken
- Walk the signal from the band to **every speaker**: the house, then each wedge
- Then one that breaks: [The mics work, the speakers don't](https://adamborecki.github.io/mixer-lab/#/x32-vj-link) (Vocal Jazz)
- Practice on your own: the [Vocal Jazz](../../vocal-jazz-gig-checklist/) and [CME](../../cme-gig-checklist/) checklists list every scenario

> 🧑‍🏫 Live on the projector. In "Everything working", tap through the X32's ROUTING page (Mixer
> Lab now has the console's own BLOCK / PATCH POINTS screen) and each output. "The mics work, the
> speakers don't" is the AES50 slide (3.2) as a fault.

### From real gigs

- Arrive **==early==**: at a CME dress rehearsal, one wedge never worked and there wasn't time to find out why
- The wireless rack goes **on** at the start and **off** at the end, at the ==Furman==
- Cables in the hall's rack get ==borrowed==: check they're still there
- [your stories]

## 🗝️ Key terms

**GitHub Pages** · **fork** · **clone** · **commit** · **merge** · **Markdown** · **HTML** ·
**concert lighting** · **Dual Channel Recording** · **LOCAL** · **AES50** · **S32** · **downstage** ·
**daisy chain** · **send level** · **gain staging** · **level sheet**

## 💭 Before you leave

- What's the difference between `github.com/your-username` and `your-username.github.io`?
- Could you set up the Standard Gear Kit without the checklist? Which step would you forget?
- Could you draw Salmon's signal flow, from a mic to a wedge, from memory?
