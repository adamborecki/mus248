# Working in this repo

MUS 248 course site: vanilla HTML/CSS/JS on GitHub Pages. **No framework, no build step, no
server.** If a change needs a bundler, it is the wrong change.

## Before you commit, always

```bash
node tools/check-worksheets.mjs   # every activity parses; no answer key leaks
cd quiz && npm test               # quiz data, scoring, state codes, pre-flight
node sushi/tests/run.mjs          # Sushi backend, privacy, client (only if sushi/ changed)
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

Optional catalog fields, all safe to omit: `"kind"` is `"gig"` (gig checklist) or `"reset"`
(reset procedure), and either one must also be `"type": "checklist"`. Checklists number their steps automatically (`stepNumbers` in
`markdown.js`, shared by page and worksheet, so the numbers move when steps are added; `revised`
says which version a number belongs to). **Contributor credit** is opt-in and only ever a GitHub
username, in the activity's frontmatter as a `contributors:` list. Never a real name. And: `"type"` (`activity` default, `checklist`,
`reference`) and `"settings"` (`home` / `class` / `outsideClass` → `yes` / `no` / `confirm`). Map
settings only from what the page's own Logistics/Access text says. Anything it doesn't say is
`confirm`, never a guess. `content/DOCUMENTATION_GUIDE.md` has the rest. Repo Improvement's `repo-improvement/starter-menu.json` names exact `##` headings in other pages, and the checker fails if
you rename one without updating it.

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

**Bump `revised: "YYYY-MM-DD"` in frontmatter whenever you edit an activity.** It prints on the
worksheet ("Rev. 2026-09-25") next to the time/group-size line, on both the student copy and the
key — the only way anyone holding a printed page, possibly weeks old, can tell it apart from a
newer one. There's no automated check for this (it can't be — the field has to reflect the edit
that's about to be committed, not the last one), so it's on whoever edits the file. Forgetting to
bump it is worse than not having the field, since a stale date reads as confirmed-current.

**What belongs where:** the web page is the textbook — full procedure, photos, troubleshooting.
The worksheet is the workbook — definition of done, key terms, checkpoints, questions, "before
you leave". Photos and step-by-step procedure deliberately stay off the paper so nobody copies a
screen onto it.

## Lectures

`data/lectures.json` holds each lecture's date, week, status (`delivered`, `upcoming`,
`no-class`), its `lecture` number (the LECTURE ## badge; matches the Canvas follow-along notes, so
01 is Aug 24 and Labor Day has none), and optionally `hiddenUntil` (ISO time with offset, e.g.
`2026-10-19T22:00:00-07:00`). That hides it from the site until then, but the Markdown stays public
in the repo, so it's not a secret; `content/lectures/<id>.md` holds only the slides' text, in slide order; each readable
lecture needs a `lectures/<id>/index.html` shell (copy one, change `data-lecture-id`). Slide decks
are full of student names (group lists, survey answers), quiz access codes, and Drive/form links.
Redact all of them on import (`[names — ask instructor]`) and say so at the top of the file; the
checker fails on a quiz access code or a form/Drive folder link, but it can't spot a name.

**The Repo Improvement form** (students fill it out after every activity or checklist; it replaced the
per-activity Canvas discussions) lives in one place, `feedback.js`. Every activity page, checklist,
and student worksheet ends with it as a link and a QR code, and it's the one form link the checker
allows in lectures. Changing the form means changing that one line.

**Every week opens the same way:** an upcoming lecture's first section is `## 📣 Announcements`, and
its first slide is `### Homework review` (what's due; "see Canvas" until the list is written). The
checker requires it for `upcoming` lectures; delivered ones are left as they were. Start a new
lecture from `content/lectures/_template.md`.

Every lecture page also opens as a slide deck (`lectures/deck.js`): the same Markdown, split at
each `##` (a section card) and `###` (a slide), laid out on one zoomable canvas. Its outline nests
slides by shared number ("3. …"), shared "Topic:" prefix, or being named in an earlier slide's
numbered list. No authoring needed; keep one `###` per slide. New decks come in with
`node tools/pptx-to-lecture.mjs deck.pptx > content/lectures/<id>.md` (no dependencies). Its output
still needs the redaction pass above, because it can't spot a name.

Three markers in lecture Markdown (`lectures/view.js` is the one place that reads them):
`### 3. 🙈 Title` hides a slide (or a `##` section) from students but keeps it in the file;
`> 🧑‍🏫 …` is an instructor note; `> 🌀 **Title.** …` is a portal, a collapsed sneak peek of a
later lecture that students tap open. Notes and 🙈 slides show only in **instructor view** (the
faint π at the foot of a lecture page, or `?instructor=1`; remembered per device). It's a view,
not a lock: the Markdown is public, so nothing private goes in a note. The deck never shows notes.

Slides number themselves: under `## 2. A Finished Example`, write plain `### What went in` and the
page, slides, and notes show **2.1, 2.2…** (`numberSlides` in `lectures/view.js`; a typed number is
replaced, 🙈 slides aren't counted). Only lectures whose `##` sections start with a number do this.

**Follow-along notes** come from `==term==`: the page and slides show the word as plain text
(instructor view highlights it), and `lectures/notes/?id=…` prints the lecture with a blank in its
place (`…/key/` fills it in). Students photograph their notes for Canvas. Aim for a handful per
slide. Keep each a short plain word (the checker enforces it); never inside a 🌀 portal or a ```
code block, where it doesn't count. A ``` fence shows its lines exactly, for raw Markdown on a slide.

**The online refresher** comes from the lecture's `**Qn (type).**` questions (same format and
numbering rules as activities, never inside a 🙈 slide). They are taken off the page, slides, and
notes (`stripQuestions` in `worksheet.js`) and live only at `lectures/refresher/?id=…`: three tries
each, then the answer; every question ends on its `✅ **Answer.**` line, so write that as the
**main point**, not just the answer. A `(fill in the blank)` question marks its answer in the prompt,
`==context window==` (`==repo|repository==` accepts either). It tracks tries, clicks, and time, and
ends in a **Copy Canvas deliverable** (summary + JSON receipt with a SHA-256 checksum, camera-lab's
shape). The question key is `lectures/worksheet/key/?id=…` (instructor view: 🔑 Refresher key).
Past lectures have neither notes nor a refresher until someone adds blanks or questions; that's a
good Repo Improvement task. **Before adding either, read `content/LECTURE_GUIDE.md`** (how many, the
three question kinds, imported lectures, and editing mistakes already made once), and check
coverage with `node tools/lecture-report.mjs <lecture id>`. `content/instructor/vibecoding-series.md` has the series plan.

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

## Sushi

`/sushi/` is the studio work-ticket system (built from the two specs in
`content/instructor/sushi/`). **Start with `sushi/README.md`**: file map, state machine, which
fields are public, and the "add sushi for ___" decision table. Backend setup and deploy steps are
in `sushi/backend/README.md`.

- **Live task content lives in Adam's Google Sheet, not in git.** "Add a task" is a Sheet row
  (or a Templates row for repeating work), not a code change. Git holds code and generic docs only.
- **The public feed is an allowlist:** `publicTask_` in `sushi/backend/Code.gs` writes each public
  field by hand. Never copy a row into the response. A new public field also needs
  `PUBLIC_TASK_KEYS` and the privacy test updated.
- `sushi/config.js` is public: it may only ever hold the `/exec` URL. No spreadsheet id, email,
  or names anywhere in `sushi/` (the tests scan for them).
- `Code.gs` changes reach production only when someone pastes the file into Apps Script and deploys
  a **new version** of the existing deployment. Say so when you change it; pushing isn't enough.
- `node sushi/tests/run.mjs` runs the real `Code.gs` against fakes (`sushi/fake-google.js`). After
  UI changes also run `node sushi/tests/browser.mjs`. `/sushi/?demo=1` is the same backend in the
  browser, with Demo tools for races and network failures.

## Git

Another agent also pushes to `main`. **Fetch and merge before you push**, every time.

**Default: land it yourself, without asking first.** Adam reviews this site on his phone against
the live production site — not by reading diffs or approving PRs — so don't leave finished work
sitting on a branch waiting for a review that isn't coming. Once both test suites pass and you've
checked anything user-visible in a browser, open a PR and merge it immediately (or push straight
to `main`, whichever is simpler), then check the Pages deploy afterwards. This is standing
authorization — you don't need to ask "should I merge this?" or "should I open a PR?" each time.
`git log` is the safety net if something needs undoing.

**Branch previews.** A pushed `claude/…` (or `feature/…`, `preview/…`, `skin/…`) branch publishes
at `https://adamborecki.github.io/mus248/branch/<slug>/` (slug = branch name lower-cased, every
run of other characters turned into `-`). When a task says "preview, don't merge", push the branch
and send that URL instead. Previews share the live site's origin, so they share `localStorage` —
the quiz and study apps don't isolate their keys yet; don't rehearse a real quiz on a preview.

**End every reply that changed something with a link to the latest version, at the very bottom**
(the live page that changed, or the branch preview if it isn't merged), so Adam can open it from
his phone without scrolling. If the deploy isn't confirmed live, say so on that line. This is the
"Reporting Back" rule in `adamborecki/webapp-conventions`.

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
