# Quiz — where things stand and what's next

Working notes for picking this thread back up. Not student-facing.

## Quiz 2 is live (Sept 20, 2026)

`curriculum.json` is set to **Quiz 2**, version `2026-09-21`. Each quiz now has its own entry in
a `quizzes` map holding its label, date, and code, and **the code selects which quiz runs**:
`phantompower` runs Quiz 1, `exposuretriangle` runs Quiz 2.

**That is the makeup path.** A student who missed a week enters that week's code and sits that
week's quiz, in a week when the class is on a later one. It is labelled "Quiz 1 · makeup" on
screen, tells them which Canvas assignment to submit to, and produces an `M248Q1…` code the
verify page scores as Quiz 1. To close a makeup window, delete that quiz's entry — its code
stops working. Note that a makeup draws questions under the *current* skill statuses, not a
snapshot of that week's, which matters the first time a skill is promoted from practice to core.

Keeping an old code alive on the current quiz would **not** have done this: the site serves one
quiz at a time, so the old code would just have been a second door into the current quiz. That
was the state briefly shipped in 0735af8 and it is why routing exists.
Verified end to end in a browser: the gate, a `?code=` link, a Quiz 1 code pasted into Quiz 2,
the no-code fallback, a full 20-question run, and the instructor verify page scoring the
resulting code and carrying the learner ID forward.

**The timing and capture design (sections B and D) is now built and on for Quiz 2** at the
decided 6/9. The clock starts when the student presses "Start the quiz" rather than at code
entry — the activity self-report before it is not quiz work and varies far too much between
students — so wall clock for the room is code entry + 9 + the two closing questions, which is
the ~10 minutes the decision assumed. The window never cuts anyone off mid-question. Bonus
questions interleave every three graded questions, but only for a student ahead of the pace, so
anyone behind never sees one. They are ungraded and outside the denominator, proven by test.

**Still not built, and deliberately not bundled with a live-class debut:** section A (fixing the
core *skill set* so every student gets all ~15 Core skills) and C2 (bonus *replacing* the
Practice tier). Both change what is graded, and changing the clock and the grading basis in the
same week is how you end up unable to tell which one broke. Bonus currently sits alongside
Practice as a third tier rather than replacing it.

**One real constraint found while building:** the design says extras get "progressively harder"
and that "level 3 *is* reach", but the bank has **no level-3 questions at all** and only seven at
level 2 — all activity-gated, and mostly consumed by the graded set. The climb is therefore
shallow until harder items are written. That is a question-writing job, not a code change.

## Where it stands (Sept 18, 2026)

Quiz 1 ran in class Sept 14 with 16 submissions, all codes valid. Mean 9.69/10, 8 perfect,
nobody below 9. Core 93%, Practice 90%. Raw exports live in `quiz/feedback/` (gitignored).

Weak spots, in order: microphone types (Core, 5/9), ORTF (7/12), mains vs. monitors (7/11),
live-sound signal flow (6/9), looper signal flow (2/4). Dante and X32 gated questions were 100%.

Built and live: the quiz, study cards (All / Core / Practice), the verify page, an access code
per week, 10-point scoring, and a content-editor artifact with verified/unverified tracking.

## The measurement problem

Quiz 1 gave each student 9 Core questions drawn from 15 Core skills, with different *variants*
per student. So per-skill sample sizes came out tiny (n = 4 to 13 out of 16 students), which is
why "56% got mic types wrong" is a lead rather than a finding.

Two ways to fix it:

- **Fix the core skill set** — every student gets all ~15 Core skills each week, but different
  question variants. n = 16 per skill, comparable across students, and the existing
  spaced-retrieval design survives (a missed skill returns as a *different* question next week).
- **Fix the exact items** — literally the same questions for everyone. Best possible signal, but
  it repeats verbatim next week, which contradicts how the state code was designed to work
  (avoid recently-seen items, bring back misses in varied form) and creates an answer-key leak
  if the class study guide quotes question text.

Recommendation: fix the skill set, not the items.

## Decisions pending

Defaults marked. Anything not overridden gets built the default way.

### A. Measurement
- **A1.** Fix core *skills* each week (default) or fix exact *items*?
- **A2.** All ~15 Core skills means a longer quiz than 9. Accept the length (default), or cap core
  around 12 and rotate the remainder?

### B. Timing — DECIDED, and now BUILT

A **fixed wall-clock window**, not a fixed question count. The clock starts when the access
code is entered and the quiz closes when the window ends, so the instructor controls class
flow ("we all come back at 8:15") instead of waiting on the slowest submission.

- `expected_minutes` — what the graded Core set should take. **6.**
- `window_minutes` — the outer limit. **9** (about 10 minutes wall clock once code entry and
  the closing feedback are counted). Everyone gets the same window, so extended time is built
  in and nobody is visibly on a separate track. Assume accommodations exist even if none are
  on file.
- **At the window, a student finishes the question they're on, then submits.** Never a cut
  mid-question.
- Finish Core early and questions **keep coming** until the window closes. They're ungraded,
  so a fast student can't out-score anyone; they just get more practice.
- Extras get progressively harder as the window runs on, drawn by existing `level` (0–3).
  **No new "reach" category** — level 3 *is* reach. Since nothing rides on them, level-3
  items can stay unverified longer than graded ones, clearly labeled as not counted.
- Pace check every few questions decides when to slot an extra in, so extras interleave with
  Core rather than arriving as a block at the end.
- Warn on screen at `expected_minutes` ("you should be wrapping up the graded part").

**Does ~15 Core questions fit in 6 minutes?** Probably, and by a wider margin than "1 minute
per question" suggests. Quiz 1 put 20 questions away in roughly 4–6 minutes — call it 15–20
seconds each — so 15 Core lands near 4–5 minutes. Troubleshooting-style items run longer than
Quiz 1's recall items, which is what the headroom is for. Recalibrate off real `actual_minutes`
after Quiz 2 rather than guessing again.

**Slow students are protected by the pace rule itself.** Extras only appear for someone *ahead*
of schedule, so anyone behind never sees one and gets the entire 9 minutes for Core alone —
roughly 36 seconds per question. The student at risk of running out of time is, by construction,
never the student being handed extra questions.

### C. Scoring
- **C1.** Bonus items ungraded, data-only, not part of the 10 points (default), or graded?
- **C2.** Does bonus *replace* the current Practice tier, or sit alongside it as a third tier
  (default: replaces — core graded, bonus data-only, two tiers not three)?

### D. Capture — DECIDED, and now BUILT

Keep it minimal, and put all of it **after the timer stops** so none of it eats quiz time.

- One **optional** free-text box: "Anything confusing? How did the quiz go?"
- One **one-tap** pacing question: too rushed / just right / too slow.
- Nothing else. No "what went well" prompt — that reflection belongs on the activity
  worksheet's "Before you leave" section, which the activity template already calls for,
  not inside a timed quiz.
- Which wrong answer a student picked, and per-question timing, are recorded silently.

### E. Study guides
- **E1.** Class review list (instructor-facing, after each quiz): skill + miss rate + instructor's
  own paraphrase (default), or literal question text? Literal text leaks repeated items.
- **E2.** Student study guide to email: generated printable page from the study cards, instructor
  sends the link (default), or a PDF?

### F. Activities, worksheets, tracker
- **F1.** ~~Ownership~~ — **settled: this session works in `content/activities/` too**, using
  its own judgment, aimed at worksheets.
- **F2.** ~~Worksheet generated from the activity markdown, with correct answers marked inline so
  the answer key generates from the same file~~ — **done, the default way.** Built and shipped;
  see `content/activities/WORKSHEETS.md`. The marking convention is `- ✅ c) 9 dB` on the correct
  option and `✅ **Answer.** …` for questions with no options; both student renders strip it.
- **F3.** Does the student keep the printed worksheet or turn it in, and who prints it? Built
  assuming *keep*, and that the instructor prints a stack from `/worksheets/`. Still reversible.
- **F4.** Tracker: a Course Map artifact that computes itself from repo data, plus a short manual
  to-do list (default), or GitHub issues?
- **F5.** ~~Next instruction import~~ — **done.** All eight activities now have plain-text
  instructions in `content/activities/_source/`. DAW, mixer, and X32 exported straight from
  their link-shared Google Docs via `tools/import-activity-doc.sh`; Mic Stand Yoga's slide
  text came out of the deck. Mic Stand Yoga still needs image work before migration.

## Deadline

**Worksheets were required by Monday, Sept 21 — the generator is built.** Seven activities print
a worksheet at `/<id>/worksheet/` and an instructor answer key at `/<id>/worksheet/key/`, both
generated from the activity's own markdown. What remains on that thread is activity content, not
code: X32 Compact needs migrating, and Portable Cameras' BH 209 section needs the hall's
documentation. Details in `content/activities/WORKSHEETS.md`.

## Before running the next quiz — read this first

**Nothing in the timing or capture design is built yet.** `expected_minutes`, `window_minutes`,
wrong-answer capture, and the feedback box appear nowhere in `js/`. The live quiz still behaves
exactly as it did for Quiz 1. If a quiz runs before that work lands, it runs the Quiz 1 way,
which is fine — but four fields in `data/curriculum.json` have to move:

- `quiz_number` — **not optional.** Saved attempts and the access-code unlock are both keyed to
  it. Leave it at 1 and a returning student opens straight onto their Quiz 1 results screen
  instead of a new quiz, and never gets asked for the new code.
- `quizzes` — one entry per quiz, holding its `label`, `version`, and `access_code`. Replaces
  the top-level `quiz_label`, `quiz_version`, and `access_code` fields. Bumping `quiz_number`
  without adding an entry is no longer a silent failure: the quiz refuses to open and says so.
- `quiz_label`, `quiz_version` — keep them honest.

**`npm test` now enforces all of this.** Three pre-flight tests fail on a missing access code for
the current quiz number, a code reused between quizzes, and a `quiz_label` or `quiz_version` that
has fallen out of step. The checklist below is still worth reading, but it is no longer the only
thing standing between a forgotten field and a live class.

**On a student with no previous code — the learner ID stays generated, not typed.** It was worth
considering, and it does not do what it looks like it does. The ID's only job is in `verify.js`,
which flags *same ID, different code* to catch a shared submission; a self-typed name breaks that
in both directions (two students typing the same name look like sharing, and one student typing
"Adam B" then "adam b" looks like two people). It also would not restore the adaptive follow-up,
which needs the per-question results and skill history carried inside the **code**, not the ID.
Canvas already joins submissions to students by name, and this repo's privacy rule keeps names
out. What changed instead is the copy: the fallback now tells students their code is at the end
of their Canvas submission from that week, because "I don't have it" usually means "I didn't
look."

**The previous-quiz flow is built and verified**, contrary to the timing/capture work, which is
not. From Quiz 2 on, students choose "I have my code" or "I don't have it". Pasting a whole
Canvas submission works, any *earlier* quiz's code is accepted (not just last week's), a saved
code from the same device is offered with one tap, and truncated or tampered codes are rejected
with a specific message. **"I don't have it" is a complete, unpenalised path** — a student who
missed class self-reports their activity counts and takes the same quiz for the same points,
losing only the adaptive follow-up on skills they previously missed.

Worth doing at the same time, both still pending:

- Promote the skills that hit 100% in Quiz 1 (`active_passive`, `safe_power_order`, the camera
  basics) from `practice` to `core` if they should be graded.
- Rewrite the mains vs. monitors questions around stage monitors/wedges — 4 of 11 students
  missed those, most likely because "monitors" reads as studio monitors.

## Recommended sequence

1. **Measurement and capture.** Fix the core skill set, capture which wrong answer was picked,
   time taken, and the feedback box. Rewrite mains/monitors around stage monitors vs. studio
   monitors. Promote the skills that hit 100%. Cheap, and everything else depends on the data.
2. **Class review list**, generated from the pasted codes.
3. **Worksheets and instruction imports** — biggest instructional payoff, gated on F1.
4. **Timed / interleaved model last.** It is the largest build and the riskiest thing to debut
   during a live class, and the current quiz already works.

## Worksheets — what recon found

The migrated activities already carry the markers a generated worksheet needs: 35 🚩 checkpoints
and consistent `**Q1 (fill in the blank).**` / `**Q2 (multiple choice).**` formatting. So the
printed worksheet can be generated from the activity page rather than maintained separately,
which avoids the drift that made the previous Google Keep version turn into paperwork.

Migrated: stereo, cameras, live-looping, 4× Dante. Still external links: DAW, mixer, X32 Compact,
mic stands. ~~`live-looping.md` predates the current template and needs its headings normalized.~~
Normalized.

## Idea worth keeping: one skill vocabulary

The quiz has 44 granular skills (`input_gain`, `ortf`, `mains_monitors`). Activities are tagged
only with the five broad Core Skill Areas. If each activity also declared the granular skills it
teaches, then "what are students expected to learn" becomes one table — skill → taught by which
activity → has a study card? → has a quiz question? → how the class scored — and the tracker, the
study guide, and the worksheet's "what you'll practice" all derive from it instead of being
maintained by hand.
