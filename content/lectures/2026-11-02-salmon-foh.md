> 🤖 **AI use:** outlined with Claude Code from two short planning messages (Nov 2). The instructor
> writes the slides from this outline. The Salmon facts come from the
> [Vocal Jazz Gig Checklist](../../vocal-jazz-gig-checklist/); the Standard Gear Kit facts come from
> the [Standard Gear Kit Checklist](../../standard-gear-kit-checklist/).

> 🧑‍🏫 **Draft for today (Nov 2): write it in your voice.** Three parts: (1) Salmon FOH, the main
> one; (2) a Standard Gear Kit refresher at a **generic** gig, so next week can do **Memorial**
> specifically (spaced repetition); (3) a quick vibecoding pickup and this week's homework plan.
> Headings plus bullet fragments only; `[brackets]` are prompts for your own stories. Commercial
> Music Ensemble is placeholders only (no CME checklist in the repo, so nothing there is verified).
> Mariachi is left out on purpose, for later. No in-class activity yet. A few blanks (`==…==`) on
> key terms so the follow-along notes exist; delete or add as you like. No refresher questions:
> those come from your final text. Remove `"draft": true` in `data/lectures.json` when it's done.

## 📣 Announcements

### Homework review

**Today:** Week 11 · Class 10

**After today:** 4 classes (3 + 1 meeting in finals week)

Everything due this week, with due dates: **see Canvas**.

- **Your `README.md` and `index.html`** (part 3 today)
- **Follow-along notes:** photos of today's notes, on Canvas
- **Online refresher for Live Sound 3:** open since this morning
- **Finished an activity or a checklist?** Fill out the Repo Improvement form

> 🧑‍🏫 Placeholder list: confirm against Canvas.

### Change of plans

- Today: **Salmon FOH**, deep dive
- Why: [what the last couple of weeks of gigs showed you]
- Plus a Standard Gear Kit refresher, and a little vibecoding

## 🎤 Lecture: Salmon FOH Deep Dive

### Salmon FOH Deep Dive

- Goal: everyone knows the whole signal path, not just the steps

### Today

1. Salmon FOH: Vocal Jazz and Commercial Music Ensemble
2. The Standard Gear Kit at a gig
3. Vibecoding: this week's homework

## 1. Salmon FOH

### Lessons from real gigs

- [lesson 1]
- [lesson 2]
- [lesson 3]
- What's changing because of it: [new rule / new step]

> 🧑‍🏫 One example already in the checklist: the wireless rack now gets switched on at the start of
> the gig and off at the end (earlier crews left it on).

### The whole path

Mic → receiver → X32 → wedges and mains

1. **Wireless handheld** → **receiver** (the wireless rack)
2. Receiver → X32's own rear panel: a **==LOCAL==** input
3. X32 channel → **Bus 1** (the wedge mix)
4. Bus 1 → Output 1 → **stage box OUT 1**, over **==AES50==**
5. Stage box → XLR → **NX3000** amp, Channel A
6. Amp → **speakON** → first wedge → **==daisy chain==** to the other two

> 🧑‍🏫 Mains path isn't written out in the checklist. Add it here from your own notes if you want
> it on the slide.

### Inputs: Local vs. AES50

- **ROUTING → INPUT**: 1–24 = **Local**, 25–32 = **AES50** (stage box)
- Receivers plug into the **console**, not the stage box
- 1–24 on AES50 → no mics at all. **Check this ==first==**
- [why a saved scene isn't enough]

### Outputs: the wedges

- Bus 1 = the ==wedges==
- Stage box **OUT 1** → amp **Channel A**, every time
- [a story about a silent wedge?]

### Recording: Dante to Logic (optional)

- **ROUTING → CARD**: all Local → each card out is a direct out
- Dante Controller: X32 → FOH Mac mini, one to one (Control-click)
- Logic: set the input device to **Dante Virtual Soundcard** **first**

### Vocal Jazz: before 5:00

- Arrive about **4:30 PM**; Singers out around 4:45
- Two engineers? Split: **mics** and **monitors**
- [what goes wrong when you arrive late]

### Vocal Jazz: the console

- Every wireless channel: **30 dB** gain, the ==same== for all
- **Low cut** at 80 Hz, no gate, no compressor
- Why same gain: [the ensemble balances itself]

### Vocal Jazz: line check

- **Wedge check** first, before the singers
- Then down the line in color order: meter moves? In the wedges?
- Mic not in the wedges → work the list top to bottom
  ([checklist](../../vocal-jazz-gig-checklist/))

### Vocal Jazz: end of the gig

- Amp off **first**
- Batteries out; alkalines never go in the charger
- Wireless rack off; wedges back in BH 102, door bolted
- Run the **Vocal Jazz Reset**

### Commercial Music Ensemble: what's different

- [instruments, not just voices?]
- [inputs: wireless vs. wired, stage box channels]
- [monitors]
- [what went wrong / what you'd tell the next crew]

> 🧑‍🏫 Nothing here is verified: there's no CME checklist or reset in the repo yet. Anything you say
> here is a good start for one (a Repo Improvement task, too).

## 2. The Standard Gear Kit at a Gig

### What's in the kit

- Stereo pair of pencil condensers → **Zoom F8**
- **Zoom H4n**: backup audio
- Two **Sony AX100s**
- Any venue where we bring the gear with us
- [Standard Gear Kit Checklist](../../standard-gear-kit-checklist/)

> 🧑‍🏫 Refresher from The Big Picture (Oct 12). Today: a generic gig. Next week: the same kit in
> Memorial specifically.

### First: things that need other people

- Ask house staff for **==concert lighting==**
- Electronics in the concert? Ask about a **board feed**
- Lights not ready yet? Do audio first
- [a story about waiting on someone]

### Audio: the F8

- Stereo bar, ORTF or NOS (NOS is usually easier)
- Left → Input 1, right → Input 2 (board feed → 3 and 4)
- **==Dual Channel==** Recording: 1 → 5, 2 → 6
- Start at ≈ **42 dB** on 1–2, ≈ **30 dB** on 5–6
- **PFL** to check each channel; phantom power from the same screen
- **AC power** for the concert; batteries are backup

### Backup: the H4n

- Lighting stand, ¼-inch screw
- Fresh batteries, clean card
- Loudest passage: not clipping, not too quiet

### Video: the AX100s

- Both on **Indoor** (3200 K): they have to ==match==
- Start: **f/4 · 3 dB · 1/60**
- Set exposure **under concert lighting**, not pre-show
- Level, framed slightly wide, one wide and one close
- [your most common camera mistake]

### Next week: Memorial

- Same kit, one real room: **Memorial Hall**
- [what's different there, in one line]

## 3. Vibecoding: This Week's Homework

### Where we are

- [quick pickup from Vibecoding 1]
- Fork, branch, pull request: later

### This week: README.md and index.html

| | `README.md` | `index.html` |
|---|---|---|
| Who reads it | People looking at your repo on github.com | People visiting your site |
| Written in | ==Markdown== | ==HTML== |

- [the homework, in your words]

> 🧑‍🏫 Your notes: the homework is a README in Markdown and an index page in HTML. Vibecoding 2
> (hidden, unscheduled) has a starter `index.html` and `README.md` you can copy onto this slide.

## 🗝️ Key terms

**LOCAL input** · **AES50** · **stage box** · **Bus 1** · **wedge** · **daisy chain** ·
**concert lighting** · **Dual Channel Recording** · **PFL** · **Markdown** · **HTML**

## 💭 Before you leave

- Could you draw the Salmon FOH signal path from memory?
- Could you set up the Standard Gear Kit without the checklist? Which step would you forget?
