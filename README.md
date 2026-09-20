# 🎬 MUS 248: A/V Concert Recording

**🔗 Live site: [adamborecki.github.io/248](https://adamborecki.github.io/248/)**

The activity hub for MUS 248 — the hands-on side of learning to record concerts, on both audio and video.

- 🎓 **Student?** This is where you find out what to actually go *do* with the gear.
- 🎙️ **Recording engineer just browsing?** This is a decent snapshot of how a working A/V program teaches the craft — stereo mic technique, live console work, Dante networking, camera ops, and the un-glamorous discipline of gain staging.

> Canvas is still where enrollment, submissions, discussions, and grades live. Nothing here replaces that — this is the reference material, built so it's fast, searchable, and doesn't disappear behind a login wall.

---

## 📋 What's actually here

### 🛠️ Activities
The front page. Each card is a self-contained lesson with:

- ✅ What you'll practice
- 🧰 The gear you need
- ⚠️ Safety notes
- 🚀 Step-by-step setup
- 🚩 Checkpoints along the way
- 🔧 Troubleshooting
- 🏁 A definition of done

Filter by skill area — **Audio Capture**, **Live Sound**, **Video Capture**, **Post Production**, **Data Management** — to find what you need.

**Current lineup:**

| Activity | Skill area |
|---|---|
| 🎙️ Basic stereo recording (XY / AB / ORTF) | Audio Capture |
| 📹 Portable cameras | Video Capture |
| 💻 DAW training circuit | Post Production |
| 🎚️ Analog mixer basics | Live Sound |
| 🔊 X32 Compact digital console | Live Sound |
| 🧘 Mic stand setup | Audio Capture |
| 🔁 Live-looping rig | Audio Capture, Live Sound |
| 📡 Dante Broadcast, Jam Session, Walkie-Talkie (basic + advanced) | Audio Capture, Live Sound |

Most activities are fully written out here; a few older ones still point to their original Google Doc while they wait to be migrated over.

### 🖨️ Worksheets
Each fully-written activity also has a **printable worksheet** at `/<activity>/worksheet/` — one
page you write on while you work and keep afterwards: checkpoints to tick, key terms to define,
and the activity's questions with blanks to fill and options to circle.

The worksheet is **generated from the activity's own Markdown**, never maintained separately, so
it can't drift from the instructions. The web page stays the textbook; the paper is the workbook.
The procedure, photos, and troubleshooting deliberately stay on the phone — nobody should be
copying text from a screen onto paper.

`/worksheets/` lists them all, for printing a stack before class.

### 📝 Weekly quiz
A short, no-account, no-server quiz you take alongside the activities:

1. Say how many times you've done each activity — the quiz gets harder on skills you've practiced more.
2. Answer ~20 questions.
3. Get a code. Paste it into Canvas.

That's the whole submission process.

### 🗂️ Study cards
Flip-card review of the terms and concepts the quiz draws from. Filter to **Core** or **Practice** material. No login, no gate — review whenever, as many times as you want.

---

## 🤔 Why it works this way

Everything here is **static**: plain HTML/CSS/JS served straight off GitHub Pages. No server, no database, no accounts.

That's deliberate, not a limitation:

- ⚡ Loads instantly, works even on bad wifi in the recording space
- 🔒 Can't leak anything sensitive because it isn't holding anything sensitive
- 🎯 A recording rig should be the hard part of this course — not the web app explaining it

---

## 🗺️ Repository map

```
PAGES — every folder here is a URL on the live site
  index.html           the front page
  cameras/             one folder per activity: /cameras/, /stereo/, /daw/ …
    worksheet/           its printable worksheet
    worksheet/key/       the instructor answer key (noindex)
  quiz/                the weekly quiz app — see quiz/README.md
  study/               the study-card app
  worksheets/          index of every printable worksheet

SOURCE — never served as a page
  content/activities/  activity Markdown (the source of truth) and its media/
  content/activities/_source/   imported instructions awaiting migration
  data/activities.json directory metadata that drives the front page
  data/semesters/      per-term Canvas links and reminders
  tools/               import and check scripts

SHARED FRONT-END
  markdown.js          the Markdown renderer, used by page and worksheet alike
  activity.js/.css     the activity page
  worksheet.js/.css    the worksheet and answer key
  app.js, styles.css   the front page
```

**Why activity folders sit at the top level next to `content/` and `data/`:** the folder path *is*
the URL. `cameras/index.html` is what makes `…/cameras/` work with no router, no build step, and no
server. Tidying them into something like `activity/cameras/` would change every activity URL —
including any already pasted into Canvas or printed on the QR-coded manuals in the recording rooms —
for a purely cosmetic gain in the GitHub file list. So they stay, and this map is the signpost
instead.

---

## 🔐 Privacy

This repo is **public**. Do not add:

- Student names or journals
- Submissions or grades
- Drive links or other identifying information

Canvas already handles all of that; this repo only holds reusable instructional material.

---

## ✏️ Contributing / editing

- **New or updated activity** → edit its Markdown in `content/activities/` following `_template.md`'s section structure, and add/update the matching entry in `data/activities.json`. The worksheet regenerates itself; run `node tools/check-worksheets.mjs` to confirm it still parses.
- **Correct answers** are marked inline in the activity Markdown — `- ✅ c) 9 dB` on the right option, or a `✅ **Answer.** …` line for a question with no options. Both student renders strip the markers, so the answer key generates from the same file without leaking.
- **Quiz content or scoring** → see `quiz/README.md`. It's a one-file JSON edit for a weekly update, no code changes needed.
- **Found something wrong or missing?** → open an issue.

---

## 🤓 Nerdy stuff / tech specs

For the curious: this whole thing is **vibecoded** — built conversationally with Claude rather than hand-written line by line, then reviewed and corrected. That's visible on purpose: several activity pages carry an explicit **AI use disclosure** and a **Technical verification** section noting exactly which details are confirmed against real course material versus still pending a hands-on check. Treat "In Development" status badges literally.

- **Stack:** vanilla HTML/CSS/JS, no framework, no build step. `app.js` fetches `data/activities.json` and renders the directory client-side.
- **Hosting:** GitHub Pages, served from this repo (`.nojekyll` disables Jekyll processing so files starting with `_` or `.` still ship as-is).
- **Quiz engine:** a deterministic, seed-based question selector (`quiz/js/engine.js`) — no AI calls at runtime, no backend. State round-trips through a checksummed, base64url-encoded code (`M248Q<n>.v<schema>.<payload>.<sha256 prefix>`) that a student pastes into Canvas as their submission. Full format and adaptive-selection rules are documented in `quiz/README.md`.
- **Worksheets:** `worksheet.js` parses each activity's Markdown — frontmatter, `## ✅ Definition of done`, `## 🗝️ Key terms`, `🚩` checkpoints, and `**Qn (type).**` blocks — and renders both the student page and the instructor answer key from it, styled for paper with `@media print`. It shares `markdown.js` with the activity page so the two can't disagree.
- **Tests:** `cd quiz && npm test` — validates the data files, code round-trips, tamper detection, and selection logic. `node tools/check-worksheets.mjs` proves the worksheet generator against every activity and fails on an unmarked answer or a leaked key. Node 18+, no other dependencies.
- **Instructor tooling:** `quiz/verify/` scores pasted or downloaded Canvas submissions entirely in-browser; `?debug=1` on the quiz shows the selected question set and adds an auto-answer button for testing.
