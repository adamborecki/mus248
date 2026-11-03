> 🤖 **AI use:** drafted with Claude Code from the instructor's planning messages (Nov 2). The
> Standard Gear Kit facts come from the instructor and the
> [Standard Gear Kit Checklist](../../standard-gear-kit-checklist/); the Salmon facts come from the
> [Vocal Jazz](../../vocal-jazz-gig-checklist/) and [CME](../../cme-gig-checklist/) gig checklists
> and Mixer Lab.

> 🧑‍🏫 **Draft for today (Nov 2).** Three parts: (1) a quick vibecoding refresher, (2) a Standard
> Gear Kit refresher at a generic gig (Memorial specifically next week, for spaced repetition), and
> (3) Salmon FOH signal flow and gain staging, the main part. Sections 1 and 2 are drafted; section
> 3 is a skeleton until the planning questions are answered. Mariachi is left out on purpose, for
> later. No refresher questions: those come from your final text. Remove `"draft": true` in
> `data/lectures.json` when it's done.

## 📣 Announcements

### Homework review

**Today:** Week 11 · Class 10

**After today:** 4 classes (3 + 1 meeting in finals week)

Everything due this week, with due dates: **see Canvas**.

- **Quiz 7:** tonight, in class
- **Follow-along notes:** photos of today's notes, on Canvas
- **Online refresher for Live Sound 3:** open since this morning
- **Finished an activity or a checklist?** Fill out the Repo Improvement form

> 🧑‍🏫 Placeholder list: confirm against Canvas.

## 🎤 Lecture: Salmon FOH Deep Dive

### Salmon FOH Deep Dive

- A quick vibecoding refresher
- The Standard Gear Kit, again
- Then the main event: **Salmon FOH**, signal flow and gain staging

### Today

1. Vibecoding: a quick refresher
2. The Standard Gear Kit: a refresher
3. Salmon FOH: signal flow and gain staging

## 1. Vibecoding: A Quick Refresher

### Why are we doing this?

- **Repo Improvement:** you fix the checklists you follow
- **Signal flow:** the diagrams, checklists, and simulators (Mixer Lab) are all built this way
- **Training:** next semester's crew learns from what you write
- Every checklist on this site is a text file anyone can improve

### Your GitHub account vs. your GitHub Pages site

| | GitHub account | GitHub Pages |
|---|---|---|
| Example | `github.com/adamborecki` | `adamborecki.github.io` |
| What it is | You, and your ==repos== (code and history) | ==Websites== published from those repos |
| This course | `github.com/adamborecki/mus248` | `adamborecki.github.io/mus248/` |

- Same username, two addresses: one for the ==code==, one for the site
- Coming soon: **your own website** at `your-username.github.io`

### Four words: fork, clone, commit, merge

| Word | What it means |
|---|---|
| **Fork** | Your own ==copy== of someone else's repo, on GitHub |
| **Clone** | A copy of a repo on your ==computer== |
| **Commit** | A saved ==snapshot== of your changes, with a note saying what changed |
| **Merge** | Your changes become part of the ==main== version (after a pull request) |

### Markdown vs. HTML

| | Markdown (`.md`) | HTML (`.html`) |
|---|---|---|
| A heading | `# My site` | `<h1>My site</h1>` |
| Bold | `**loud**` | `<strong>loud</strong>` |
| A link | `[Mixer Lab](mixer-lab.html)` | `<a href="mixer-lab.html">Mixer Lab</a>` |

- Markdown: **==shorthand==**, easy for people to write. Every checklist here is Markdown
- HTML: what the ==browser== reads, every part spelled out in tags

### Soon: your own

- You'll edit **your own** `README.md` (Markdown) and `index.html` (HTML) soon
- Details next week

## 2. The Standard Gear Kit: A Refresher

### Any venue, same kit

- Memorial, Fish, or anywhere else we bring the gear: the **Standard Gear Kit**
- Two **AX100s**, a stereo pair into the **F8**, an **H4n** as backup
- [Standard Gear Kit Checklist](../../standard-gear-kit-checklist/)
- Next week: the same kit in **Memorial**, specifically

### Ask for concert lighting

- You **must** ask for ==concert lighting==: the brightest cue of the show
- Set camera exposure **under it**, never under the pre-show lights
- Must. Must. Must.

### Cameras: two AX100s, both wide

- Both **static**, both **==wide==**
- Different angles are fine, but both wide
- One of them is the ==backup==
- Both on the **same** white balance

### Audio: the F8

- Main pencil mics in **==ORTF==** or **NOS** → Inputs **1–2**
- **==Dual Channel== Recording** copies 1–2 to **5–6**, with the gain **==lower==** (≈ 42 dB on 1–2, ≈ 30 dB on 5–6)
- Inputs **3–4** and **7–8**: boundary mics and/or a ==board feed==

### Backup: the H4n

- The H4n is the **backup** recording
- Gain set ==conservatively==: a quiet backup beats a clipped one

### SD cards

| Device | SD card |
|---|---|
| H4n | **8 GB** |
| F8 | **32 GB** |
| Each AX100 | **128 GB** |

## 3. Salmon FOH: Signal Flow and Gain Staging

> 🧑‍🏫 Skeleton only, waiting on the planning questions. Everything below is from the Vocal Jazz
> and CME gig checklists and Mixer Lab.

### The rig in one sentence

- Mics come **in** at the X32; everything goes **out** through the S32

### Inputs

- Wireless receivers → the X32's own rear panel: **LOCAL**, CH 1–24
- The S32 stage box → **AES50 A**, CH 25–32 (CME's band, on the sub snake)
- If CH 1–24 are left on AES50, no mic reaches the console

### Outputs

- Every output leaves through the **S32**, down one Cat5e (AES50)
- Mains: MAIN L/R → S32 OUT 15/16 → the hall's mains rack
- Vocal Jazz wedges: MIX 1 → S32 OUT 1 → NX3000 → three wedges, daisy-chained
- CME: three wedges on MIX 9–11; its own mains downstage on S32 OUT 13/14
- No AES50 link: every meter moves, every speaker is silent

### Gain staging

- **GAIN** first, into the good range (about −18 to −6); faders are for the mix
- Vocal Jazz: every wireless channel at the **same** gain (30 dB)
- CME: write every GAIN and every amp knob on the level sheet
- Amp knobs set once, during the music test; after that, mix at the console

### Test before the mics

- Music you know through the **mains**, then through each **wedge**
- Then the mics, one at a time

## 🗝️ Key terms

**GitHub Pages** · **fork** · **clone** · **commit** · **merge** · **Markdown** · **HTML** ·
**concert lighting** · **Dual Channel Recording** · **LOCAL** · **AES50** · **S32** · **gain staging**

## 💭 Before you leave

- What's the difference between `github.com/your-username` and `your-username.github.io`?
- Could you set up the Standard Gear Kit without the checklist? Which step would you forget?
- Could you draw Salmon's signal flow, from a mic to a wedge, from memory?
