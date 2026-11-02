> 🤖 **AI use:** outlined with Claude Code from a short planning message (Nov 2). The instructor
> writes the slides from this outline. The signal-flow and Vocal Jazz facts come from the
> [Vocal Jazz Gig Checklist](../../vocal-jazz-gig-checklist/); the Markdown vs. HTML tables come
> from Vibecoding 2.

> 🧑‍🏫 **Draft for today (Nov 2): write it in your voice.** Headings plus bullet fragments only.
> Fragments in [brackets] are prompts for your own stories from recent gigs. Section 4 (Commercial
> Music Ensemble) is empty on purpose: there's no CME checklist in the repo yet, so nothing there
> is verified. Section 5 is the small vibecoding piece (Markdown vs. HTML, borrowed from
> Vibecoding 2, which is now hidden and unscheduled). No in-class activity yet. Blanks (`==…==`)
> are on a few key terms only, so the follow-along notes exist; delete or add as you like. No
> refresher questions: those come from your final text. Remove `"draft": true` in
> `data/lectures.json` when it's done.

## 📣 Announcements

### Homework review

**Today:** Week 11 · Class 10

**After today:** 4 classes (3 + 1 meeting in finals week)

Everything due this week, with due dates: **see Canvas**.

- **Follow-along notes:** photos of today's notes, on Canvas
- **Online refresher for Live Sound 3:** open since this morning
- **Finished an activity or a checklist?** Fill out the Repo Improvement form

> 🧑‍🏫 Placeholder list: confirm against Canvas.

### Change of plans

- Today: **Salmon FOH**, deep dive
- Why: [what the last couple of weeks of gigs showed you]
- A little vibecoding at the end; the rest (fork, branch, pull request) comes later

## 🎤 Lecture: Salmon FOH Deep Dive

### Salmon FOH Deep Dive

- Vocal Jazz and Commercial Music Ensemble
- Goal: everyone knows the whole signal path, not just the steps

### Today

1. What real gigs taught us
2. Salmon FOH signal flow
3. Vocal Jazz
4. Commercial Music Ensemble
5. Markdown vs. HTML

## 1. What Real Gigs Taught Us

### Lessons from the last few weeks

- [lesson 1]
- [lesson 2]
- [lesson 3]
- What's changing because of it: [new rule / new step]

> 🧑‍🏫 One example already in the checklist: the wireless rack now gets switched on at the start of
> the gig and off at the end (earlier crews left it on).

## 2. Salmon FOH Signal Flow

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

## 3. Vocal Jazz

### Before 5:00

- Arrive about **4:30 PM**; Singers out around 4:45
- Two engineers? Split: **mics** and **monitors**
- [what goes wrong when you arrive late]

### The console

- Every wireless channel: **30 dB** gain, the ==same== for all
- **Low cut** at 80 Hz, no gate, no compressor
- Why same gain: [the ensemble balances itself]

### Line check

- **Wedge check** first, before the singers
- Then down the line in color order: meter moves? In the wedges?
- Mic not in the wedges → work the list top to bottom
  ([checklist](../../vocal-jazz-gig-checklist/))

### End of the gig

- Amp off **first**
- Batteries out; alkalines never go in the charger
- Wireless rack off; wedges back in BH 102, door bolted
- Run the **Vocal Jazz Reset**

## 4. Commercial Music Ensemble

### What's different from Vocal Jazz

- [instruments, not just voices?]
- [inputs: wireless vs. wired, stage box channels]
- [monitors]
- [what went wrong / what you'd tell the next crew]

> 🧑‍🏫 Nothing here is verified: there's no CME checklist or reset in the repo yet. Anything you say
> here is a good start for one (a Repo Improvement task, too).

## 5. Markdown vs. HTML

### Same link, two languages

| | Markdown (`.md`) | HTML (`.html`) |
|---|---|---|
| A heading | `# My sandbox` | `<h1>My sandbox</h1>` |
| Bold | `**loud**` | `<strong>loud</strong>` |
| A link | `[My app](bad-webapp.html)` | `<a href="bad-webapp.html">My app</a>` |

- Markdown: **==shorthand==**, for people
- HTML: what the browser reads

### README vs. index.html

| | `README.md` | `index.html` |
|---|---|---|
| Who reads it | People looking at your repo on github.com | People visiting your site |
| Written in | Markdown | HTML |

- [tie-in: the checklists on this site are Markdown]
- Next time: fork, branch, pull request

## 🗝️ Key terms

**LOCAL input** · **AES50** · **stage box** · **Bus 1** · **wedge** · **daisy chain** ·
**line check** · **Markdown** · **HTML**

## 💭 Before you leave

- Could you draw the Salmon FOH signal path from memory?
- [one more question]
