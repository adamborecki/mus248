# Quiz — where things stand and what's next

Working notes for picking this thread back up. Not student-facing.

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

### B. Timing (new model, from the pacing brief)
- **B1.** `Y` (target core-completion minutes) set manually per week (default), or auto-calibrated
  from live pacing?
- **B2.** Total window = `Y × 1.5` for everyone, no separate accommodated track (default: yes).
- **B3.** Bonus insertion: checkpoint every N core items, N=3 (default), or probabilistic?
- **B4.** When the window ends: stop feeding *bonus* items but always let core finish (default),
  or hard stop?

### C. Scoring
- **C1.** Bonus items ungraded, data-only, not part of the 10 points (default), or graded?
- **C2.** Does bonus *replace* the current Practice tier, or sit alongside it as a third tier
  (default: replaces — core graded, bonus data-only, two tiers not three)?

### D. Capture (approved in principle: wrong answer, timing, feedback box)
- **D1.** Free-text feedback box plus a one-tap pacing item (too rushed / fine / too slow)
  (default: both).
- **D2.** Per-question timing grows the Canvas code roughly 10–15% (default: accept).

### E. Study guides
- **E1.** Class review list (instructor-facing, after each quiz): skill + miss rate + instructor's
  own paraphrase (default), or literal question text? Literal text leaks repeated items.
- **E2.** Student study guide to email: generated printable page from the study cards, instructor
  sends the link (default), or a PDF?

### F. Activities, worksheets, tracker
- **F1.** Ownership — worksheets and instruction imports live in the activities site, which the
  other session has been building. Does this session take that on? **Blocks all of F.**
- **F2.** Worksheet generated from the activity markdown, with correct answers marked inline so
  the answer key generates from the same file (default: yes).
- **F3.** Does the student keep the printed worksheet or turn it in, and who prints it?
- **F4.** Tracker: a Course Map artifact that computes itself from repo data, plus a short manual
  to-do list (default), or GitHub issues?
- **F5.** Next instruction import — X32 Compact (default), DAW, mixer, or mic stands? Needs the
  source doc pasted; those four still point at external links.

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
mic stands. `live-looping.md` predates the current template and needs its headings normalized.

## Idea worth keeping: one skill vocabulary

The quiz has 44 granular skills (`input_gain`, `ortf`, `mains_monitors`). Activities are tagged
only with the five broad Core Skill Areas. If each activity also declared the granular skills it
teaches, then "what are students expected to learn" becomes one table — skill → taught by which
activity → has a study card? → has a quiz question? → how the class scored — and the tracker, the
study guide, and the worksheet's "what you'll practice" all derive from it instead of being
maintained by hand.
