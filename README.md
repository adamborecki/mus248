# MUS 248: A/V Concert Recording

**🔗 Live site: [adamborecki.github.io/248](https://adamborecki.github.io/248/)**

This is the activity hub for MUS 248 — the hands-on side of learning to record concerts, on both audio and video. If you're a student in the course, this is where you find out what to actually go *do* with the gear. If you're a recording engineer poking around out of curiosity, this is a decent snapshot of how a working audio/video program teaches the craft: stereo mic technique, live console work, Dante networking, camera ops, and the un-glamorous discipline of gain staging.

Canvas is still where enrollment, submissions, discussions, and grades live. Nothing here replaces that — this is just the reference material, built so it's fast, searchable, and doesn't disappear behind a login wall.

## What's actually here

**Activities** — the front page. Each card is a self-contained lesson: what you'll practice, the gear you need, safety notes, step-by-step setup, checkpoints, troubleshooting, and a definition of done. Filter by skill area (Audio Capture, Live Sound, Video Capture, Post Production, Data Management) to find what you need. Some activities are fully written out here; a few older ones still point to their original Google Doc while they wait to be migrated over.

Current lineup: basic stereo recording (XY / AB / ORTF mic technique), portable cameras, a DAW training circuit, live mixing on an analog mixer and on the X32 Compact, mic stand setup, a live-looping rig, and a set of Dante networked-audio activities (broadcast, jam session, and walkie-talkie drills at two difficulty levels).

**Weekly quiz** — a short, no-account, no-server quiz you take before or after doing the activities. It asks how many times you've done each activity, then adjusts what it asks you accordingly — someone who's run the stereo activity three times gets harder stereo questions than someone who hasn't touched it yet. When you finish, it hands you a code to paste into Canvas. That's the whole submission process.

**Study cards** — flip-card review of the terms and concepts the quiz draws from, filterable to Core or Practice material. No login, no gate — review whenever, however many times you want.

## Why it works this way

Everything here is static: plain HTML/CSS/JS served straight off GitHub Pages, no server, no database, no accounts. That's a deliberate choice, not a limitation — a recording rig should be the hard part of this course, not the web app telling you how to use it. It means the site loads instantly, works if the wifi in the recording space is bad, and can't leak anything sensitive because it isn't holding anything sensitive: no student names, no grades, no submissions live in this repository. See **Privacy**, below.

## Repository map

```
content/activities/   reusable activity Markdown (source of truth for in-app activities)
data/activities.json  the directory metadata that drives the front page
data/semesters/        per-term Canvas links and reminders
quiz/                  the weekly quiz app — see quiz/README.md for how it's built and updated
study/                 the study-card app
index.html, app.js,
styles.css             the front page itself
```

Each top-level folder like `stereo/`, `x32compact/`, or `dante-broadcast/` is a rendered activity page — the site's router-free way of giving every activity its own URL.

## Privacy

This repo is public. Do not add student names, journals, submissions, grades, drive links, or anything else that identifies a real student. Canvas already handles all of that; this repo only ever holds the reusable instructional material.

## Contributing / editing

- New or updated activity → edit its Markdown in `content/activities/`, following `_template.md`'s section structure, and make sure `data/activities.json` has a matching entry.
- Quiz content or scoring → see `quiz/README.md`; it's a one-file JSON edit for a weekly update, no code changes needed.
- Found something wrong or missing → open an issue.

---

## Nerdy stuff / tech specs

For the curious: this whole thing is **vibecoded** — built conversationally with Claude rather than hand-written line by line, then reviewed and corrected. That's visible on purpose: several activity pages carry an explicit **AI use disclosure** and a **Technical verification** section noting exactly which details are confirmed against real course material versus still pending a hands-on check. Treat "In Development" status badges literally.

- **Stack:** vanilla HTML/CSS/JS, no framework, no build step. `app.js` fetches `data/activities.json` and renders the directory client-side.
- **Hosting:** GitHub Pages, served from this repo (`.nojekyll` disables Jekyll processing so files starting with `_` or `.` still ship as-is).
- **Quiz engine:** a deterministic, seed-based question selector (`quiz/js/engine.js`) — no AI calls at runtime, no backend. State round-trips through a checksummed, base64url-encoded code (`M248Q<n>.v<schema>.<payload>.<sha256 prefix>`) that a student pastes into Canvas as their submission. Full format and adaptive-selection rules are documented in `quiz/README.md`.
- **Tests:** `cd quiz && npm test` — validates the data files, code round-trips, tamper detection, and selection logic. Node 18+, no other dependencies.
- **Instructor tooling:** `quiz/verify/` scores pasted or downloaded Canvas submissions entirely in-browser; `?debug=1` on the quiz shows the selected question set and adds an auto-answer button for testing.
