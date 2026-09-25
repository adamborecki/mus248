# Working in this repo

MUS 248 course site: vanilla HTML/CSS/JS on GitHub Pages. **No framework, no build step, no
server.** If a change needs a bundler, it is the wrong change.

## Before you commit, always

```bash
node tools/check-worksheets.mjs   # every activity parses; no answer key leaks
cd quiz && npm test               # quiz data, scoring, state codes, pre-flight
```

Both are fast and both have caught real bugs. Run them even for a "just text" edit — activity
Markdown is parsed by code, so prose changes can break a worksheet.

For anything user-visible, also look at it in a browser. Chromium is at
`/opt/pw-browsers/chromium`; serve with `python3 -m http.server 8848` from the repo root. Several
bugs this repo has shipped were invisible in the source and obvious on the page.

## Hard rules

**This repo is public.** Never commit: passwords, access codes, door codes, stream keys, account
addresses, student names, grades, or submissions. When importing a document that contains them,
redact in place with `[THING — ask instructor]` and say so at the top of the file. Check
photographs for the whole frame, not just the subject — a desktop file listing leaked an account
name once already.

**Activity folders at the top level are the URLs.** `cameras/index.html` is what makes
`/cameras/` work with no router. Do not tidy them into a subfolder: it breaks links already in
Canvas and QR codes printed in the recording rooms.

**American spellings.** center, color, practiced, leveled.

**Gear details get verified before they become student instructions.** If you are not certain of
a port label, a menu path, a mounting thread, or where a file lands, put it in the activity's
**Technical verification** section as an open item. Do not guess — a student follows this in a
room where a recital happens once.

## Activities

Source of truth is `content/activities/<id>.md`, following `_template.md`. Everything else is
generated or derived.

**Adding one** needs four things:
1. `content/activities/<id>.md`
2. an entry in `data/activities.json` (`contentFile` is what gives it a worksheet)
3. `<id>/index.html`, `<id>/worksheet/index.html`, `<id>/worksheet/key/index.html` — copy an
   existing trio and change `data-activity-id`
4. both test suites passing

`data/activities.json` and the quiz's own activity list (`quiz/data/curriculum.json`'s
`activities` array, matched against by `activity_gate` in `quiz/data/questions.json`) are separate,
hand-maintained lists — adding an activity here does not teach the quiz about it. Run
`node tools/check-quiz-activity-links.mjs` after adding one; it's informational (never fails), and
tells you if the new activity has no matching quiz activity id or gate. Not every activity needs
one — decide on purpose, not by accident.

**Markdown conventions the generator depends on:**

- Emoji headings (`## ✅ Definition of done`, `## 🗝️ Key terms`, `## 💭 Before you leave`)
- `🚩` marks a checkpoint, inline or blockquoted
- `**Qn (type).**` questions, **numbered 1..n in file order** — the checker fails otherwise, so
  inserting a question mid-file means renumbering the rest
- Types: `(multiple choice)`, `(fill in the blank)`, `(short answer)`
- Correct answers live inline: `- ✅ c) 9 dB` on the right option, or `✅ **Answer.** …` for a
  question with no options. Both student renders strip them; the answer key is generated from
  them. Every question must have one.
- Blanks to write on are runs of underscores: `F______ · ______ dB`
- Images go in `content/activities/media/<activity>/` and are referenced relative to the Markdown
  (`media/salmon/desk.jpg`); the renderer resolves the base. A line that is only an image becomes
  a captioned figure.

**Never hand-write a worksheet.** They are generated from the activity Markdown so the two cannot
drift — that drift is what killed the previous Google Keep version. Fix the activity, not the
worksheet.

**What belongs where:** the web page is the textbook — full procedure, photos, troubleshooting.
The worksheet is the workbook — definition of done, key terms, checkpoints, questions, "before
you leave". Photos and step-by-step procedure deliberately stay off the paper so nobody copies a
screen onto it.

## Quiz

`quiz/data/curriculum.json` is the weekly edit; `quiz/README.md` has the detail. Two things to
know before touching it:

- **The access code selects which quiz runs**, not just whether you get in. Each quiz has its own
  entry in `quizzes` with its label, date, and code. An earlier quiz's code runs that quiz as a
  makeup for a student who missed the week. Deleting a quiz's entry closes its makeup window.
- **Students paste last week's code into this week's quiz.** Anything that changes how a state
  code is written must still parse codes written before the change. There is a test for this;
  keep it passing.
- **The instructor edits questions, study cards, and skill status in a content-editor artifact**,
  which saves to its own database, not to git. Nothing reaches `questions.json` or
  `curriculum.json` until someone runs `node tools/editor-sync.mjs` (the instructor asks Claude
  to "sync the editor"; the header of that file says how). If you change a question or a skill's
  status here directly, say so in the commit message, and expect the next sync to report a
  CONFLICT rather than overwrite it.

The graded set is the denominator: a fixed count (`targets.graded_questions`) of verified
questions on Core skills. Bonus questions sit outside it — they are extra credit only, worth
`scoring.bonus_per_correct` each up to `scoring.bonus_max`, and a missed one costs nothing. If a
change lets a bonus question lower someone's score, or lets bonus push the graded score itself
around, that is a bug, not a feature.

The editor's Delete is a soft delete: it flags `deleted: true` so `editor-sync.mjs` reports the
question and a person decides, rather than silently dropping one the repo has. A question added
in the editor and never synced has nothing to protect, so its Delete removes the row outright.

Rehearse a timed quiz without editing data: `?debug=1&window=0.5&expected=0.2` (minutes).

## Git

Another agent also pushes to `main`. **Fetch and merge before you push**, every time.

**Default: land it yourself, without asking first.** Adam reviews this site on his phone against
the live production site — not by reading diffs or approving PRs — so don't leave finished work
sitting on a branch waiting for a review that isn't coming. Once both test suites pass and you've
checked anything user-visible in a browser, open a PR and merge it immediately (or push straight
to `main`, whichever is simpler), then check the Pages deploy afterwards. This is standing
authorization — you don't need to ask "should I merge this?" or "should I open a PR?" each time.
`git log` is the safety net if something needs undoing.

The exception is anything the note below already says to slow down on — a big, uncertain, or
live-teaching-week quiz change is worth a pause and a question before it goes live, not after.

## Where things live

`README.md` has the full map. In short: folders that are URLs at the top level, sources in
`content/` and `data/`, shared front-end (`markdown.js`, `activity.js`, `worksheet.js`) at the
root, scripts in `tools/`.

## A note on care

Most work here is prose, and the expensive mistakes have not been syntax errors — they have been
a string comparison that would have silently stopped the quiz adapting weeks later, and a
confidently written procedure that the room's own SOP contradicted. Slow down on: anything
touching the quiz during a live teaching week, importing a document you have not read end to end,
and any place two sources might disagree. Say plainly when something is unverified rather than
writing around it.
