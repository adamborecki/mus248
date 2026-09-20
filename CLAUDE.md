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

Bonus questions are ungraded and sit outside the denominator. If a change lets them move
someone's score, that is a bug, not a feature.

Rehearse a timed quiz without editing data: `?debug=1&window=0.5&expected=0.2` (minutes).

## Git

Another agent also pushes to `main`. **Fetch and merge before you push**, every time. Work on a
branch, merge to `main` when it should go live, and check the Pages deploy afterwards.

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
