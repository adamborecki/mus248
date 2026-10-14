# Handoff — Repo Improvement, lectures, filters (2026-10-14)

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

## Please check

1. **⚠️ Unmerged stereo verification.** Branch `claude/stereo-recording-activity-ghmdvz` has one
   commit (Sept 21) that never reached `main`: stereo kit in the OH B01 kitchen with more in the
   OH B00 closet, generic small-diaphragm condenser pair, AB on two stands, a portable-recorder
   alternative, and status → Ready, described as instructor-checked. If that's right, say "merge
   the stereo branch" and it'll be reconciled with today's `stereo.md`. **Don't delete that branch
   until then.**
2. **Week 1 date.** The deck labels it "Monday, August 31", the same as week 2. Content says it
   was the first class (probably Aug 24).
3. **Lecture redactions.** Were Jackson, Magnolia, Ellie, Seiyua, Micah, and the two composers
   fine to name publicly? They're redacted until you say so.
4. **M-Audio model in OH B01.** The X32 doc says Studiophile **AV40**; the Live Sound slides show
   a **DX4** from an unnamed room. Flagged in the X32 reset checklist.

## Branches safe to delete

Nothing new versus `main` (merged or squash-merged):

- `claude/branch-previews` · `claude/fix-qr-code-typo-44b673` · `claude/salmon-gig-checklist-fvsog9`
- `claude/salmon-recital-instructions-4g7lfy` · `claude/stoic-edison-7g0zdq`
- `claude/worksheet-checkpoint-restructure-049bif` · `claude/worksheet-generator-cameras-eig1e7`
- `draft/musco-gig-checklist` · `quiz-timer-and-score-cap` · `worksheet-web-pointers`
- `claude/documentation-builder` (this work, once merged)

**Keep for now:** `claude/stereo-recording-activity-ghmdvz` (above).
`claude/portable-cameras-redesign-j4mj63` has an unrelated, older history (Sept 15). It's almost
certainly superseded by today's `cameras.md`, but have a look before deleting it.

## Follow-ups

- Wireless mic and Dante-stems procedures as their own pages (source: `_source/x32compact.txt`
  Parts 2, 8–9), and "What can you do with a mixer?" linked to mixer-lab scenarios vs. real-board
  scenarios.
- Quiz/study `localStorage` isolation on branch previews (`storageKey`). Not touched during a
  teaching week.
- webapp-conventions: promote `content/DOCUMENTATION_GUIDE.md` once the pilot has been used.
- salmon: reconcile the upstairs reference with on-site evidence; F8 signal flow is an open item
  in the Salmon Gig Checklist.
