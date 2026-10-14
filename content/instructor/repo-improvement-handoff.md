# Handoff — Repo Improvement, lectures, filters (2026-10-14, updated same night)

Instructor-facing notes for the October 14 session. Superseded by `git log` once read.

## What shipped

- **Repo Improvement** (`/repo-improvement/`, was "Documentation Builder" and was never on
  `main`): two routes, 🗣️🎙️ talk it out (dictated paragraph, no AI) or 🧹🤖🍝 use AI to clean AI
  slop (one `PROJECT_STARTER.md`). Starter menu covers this site plus Salmon upstairs/walk/
  battery-check, mixer-lab, and camera-lab. Planned pages (Musco, Salmon monitors, batteries,
  projector, FOH) are listed but not linked. Roles and Canvas group mechanics are cut, and nothing
  on the page promises credit.
- **Lectures** (`/lectures/`): weeks 1–8 from *248 Slides 2026b* plus the Big Picture and Live
  Sound decks; Live Sound Parts 3–4 marked upcoming. Redacted: every student name, the quiz access
  code on the Sept 21 slide, the Oct 18 Drive folder, the participation-form link, and
  first-name-only people who may be students or staff (TA, Salmon student staff, Musco contact,
  the two showcase composers, one collaborator). Faculty with "Prof" titles and public guest
  artists are kept.
- **Front page:** Type filter (with ↳ Reset procedures) and a Where filter (in class / out of class
  / at home / on campus / campus outside class). Entries whose page doesn't say go under "ask the
  instructor first" instead of being hidden. Every entry now has settings, mapped conservatively.
- **Checklists number their steps** (3.4) on the page and the worksheet, from one shared function.
- **X32 Compact Reset (OH B01)**: first reset procedure, taken word for word from the imported
  X32 doc.
- **Salmon Gig Checklist:** F8 preamps hands-off, per your decision.
- **Contributor credit:** opt-in GitHub usernames only, via frontmatter `contributors:`.

## Resolved with the instructor (2026-10-14)

- Stereo verification branch merged; stereo is **Ready**.
- First class was **Aug 24**; LECTURE 01–07 badges match the Canvas follow-along notes.
- **Seiyua** named in the Big Picture lecture. Other first-name-only people stay redacted.
- OH B01's pantry holds both the M-Audio AV40 and DX4 pairs.
- Live Sound Part 4 is hidden on the site until 2026-10-19, 10pm Pacific.

## Branches to delete

All of these have nothing that isn't already on `main`. One page: https://github.com/adamborecki/mus248/branches

- `claude/documentation-builder`, `claude/stereo-lectures-filters` (once merged),
  `claude/stereo-recording-activity-ghmdvz` (merged now), `claude/portable-cameras-redesign-j4mj63`
  (an older copy; its `dante.md` was later split into the four Dante activities)
- `claude/branch-previews` · `claude/fix-qr-code-typo-44b673` · `claude/salmon-gig-checklist-fvsog9`
  · `claude/salmon-recital-instructions-4g7lfy` · `claude/stoic-edison-7g0zdq` ·
  `claude/worksheet-checkpoint-restructure-049bif` · `claude/worksheet-generator-cameras-eig1e7` ·
  `draft/musco-gig-checklist` · `quiz-timer-and-score-cap` · `worksheet-web-pointers`

## Open issues

#11 review "where can you do it" for every page · #12 lectures that look like Canvas · #13 speed run ·
#14 link mixer activity ↔ mixer-lab · #15 quiz/study cards: Seiyua, Chris

## Follow-ups

- Quiz/study `localStorage` isolation on branch previews (`storageKey`). Not touched during a
  teaching week.
- webapp-conventions: promote `content/DOCUMENTATION_GUIDE.md` once the pilot has been used.
- salmon: reconcile the upstairs reference with on-site evidence; F8 signal flow is an open item
  in the Salmon Gig Checklist.
