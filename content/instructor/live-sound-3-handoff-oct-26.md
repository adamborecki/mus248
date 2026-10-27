# Handoff: Live Sound 3 is tonight's lecture (Mon Oct 26)

Written 6:30 PM Oct 26, at the end of the Vibecoding 2 planning session. Class is tonight; the quiz
was set to open at 7:00 PM. Public repo: no access codes here.

## What changed this afternoon

- **Vibecoding 2 moved to Mon Nov 2**: now lecture 10, week 11, in `data/lectures.json`. Its id
  is still `2026-10-26-vibecoding-2`, because that id is in `quiz/data/skill-sources.json`, its
  URL, and presenter view's saved state. The `date` field is what counts.
- **Quiz 6 (the GitHub Pages quiz) moved with it:** version `2026-11-02`, opens Nov 2 at 7:00 PM.
  Same number, code, and `new_skills`. `quiz_number` is still 6, so **until Nov 2 the site serves
  Quiz 5** (Vibecoding 1). Nobody had taken Quiz 6.
- **Vibecoding 3 stays hidden** until after Nov 2 (`hiddenUntil` was going to reveal it tonight).
- **No skill statuses were changed.**

## To do tonight

> **Done (evening of Oct 26):** items 1–3. Live Sound 3 is lecture 09, its Homework review has both
> lines, and it has 57 follow-along blanks in six numbered sections. Still no refresher questions,
> and the quiz decisions below are still open.

1. **Make Live Sound 3 lecture 09** in `data/lectures.json`: `"date": "2026-10-26"`, `"week": 10`,
   `"lecture": 9`, and move its entry above Vibecoding 1 (newest first; Vibecoding 2 stays on top).
   `lectures/live-sound-3/index.html` already exists.
2. **Its Homework review needs the two lines the checker requires once a lecture has a date**:
   `**Today:** Week 10 · Class 9` and `**After today:** 5 classes (4 + 1 meeting in finals week)`,
   each its own paragraph (see `content/lectures/_template.md`).
3. **It has no follow-along blanks** (`==term==`), so there are no notes to print, and no
   refresher yet. Add blanks only if the instructor wants printed notes tonight.
4. **Presenter view works on it as is** (`/lectures/live-sound-3/?presenter=1`).

## The quiz: decide first

- **Is there a quiz tonight?**
  - **No:** nothing to do. Quiz 6 (GitHub Pages) runs Nov 2.
  - **Yes:** it has to be **Quiz 6**, because quiz numbers must run in date order (a code from a
    later-numbered quiz is refused). So:
    - move the GitHub Pages entry to **Quiz 7**, still dated Nov 2 (safe: nobody has taken it)
    - make a new Quiz 6 for tonight, with a new access code from the instructor
    - point `quiz_number` at whichever opens next
- **Live Sound 3's material** (patching, DI boxes, gain staging, line check) has no skills yet. It
  can run tonight with no `new_skills`, or get skills later. `content/QUIZ_GUIDE.md` has the
  steps, including `skill-sources.json`.
- **Ask before changing statuses.** Two open calls for the instructor:
  - The Vibecoding 2 skills are `practice` now, so their questions and study cards are already
    visible a week early. Make them `inactive` until Nov 2?
  - `coming_to_core` lists the Vibecoding 1 skills. By the rhythm they'd go Core tonight, but only
    verified questions can be graded.

## Checks

- `node tools/check-worksheets.mjs`
- `cd quiz && npm test`
- Open the quiz with the new code and `&debug=1&window=0.5&expected=0.2` before class.
