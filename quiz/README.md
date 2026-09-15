# MUS 248 Weekly Quiz

A static, front-end-only weekly quiz at `/mus248/quiz/`. No backend, accounts, database, or AI calls: questions are pre-written in JSON and the browser picks them.

## Student flow

Study cards have their own page, `/mus248/study/` (source in `../study/`), and the quiz links to it. Cards live in `data/study-deck.json`, each with a `category` (topic chips on the page) and a `skill`; a card shows whenever its skill isn’t `inactive` in the curriculum, tagged Core or Practice to match. Students flip, go Previous/Next (buttons, arrow keys, or swipe), shuffle, or read them as a list. Study cards are not access-gated. The quiz itself:

1. **If `curriculum.json` sets an `access_code`,** the quiz asks for it before anything else. A student who has the right code for this quiz number stays unlocked on that device, so they only enter it once.
2. **From Quiz 2 on:** choose **I have my code**, which checks a pasted code the moment it lands, or **I don’t have it**. Quiz 1 skips this step because no earlier code can exist.
3. Say how many times they’ve done each activity: 0, 1, 2, or 3+.
4. Answer ~20 questions, each worth the same fraction of the quiz’s total points (`target_total_points ÷ total_questions` — 10 ÷ 20 = 0.5 apiece right now). Each shows a badge first and an explanation after:
   - 🟢 **Core — graded**: full credit for that question if correct.
   - 🟡 **Practice — full credit this week**: full credit for answering at all. Correct answers still show green.
5. **Copy Canvas submission** and paste it into Canvas. It holds a readable summary plus a code for next week.

Until everything is answered, the text under **Continue** names exactly what’s still missing.

Progress is saved in the browser, so a refresh or accidental close offers **Resume**. The finished code also stays on the device, and next week’s quiz offers to reuse it.

## Weekly update (data only, no code)

All of it lives in `data/curriculum.json`:

1. Bump `quiz_number`, `quiz_label`, and `quiz_version`.
2. Set `access_code` to whatever you’re announcing in class that week (any case, spaces ignored — `"phantompower"`, `"Phantom Power"`, and `"PHANTOM POWER"` all match). Leave it out, or set it to `""`, to run the quiz with no code at all. **This is not real security** — it’s a normalized string compared in the browser, checked only to keep people from wandering into the quiz uninvited. A student who enters the right code for a given quiz number stays unlocked on that device (or share a link with `?code=phantompower` to skip typing it).
3. Change skill statuses under `skills`: `core`, `practice`, or `inactive`. **This is the only thing that makes a question graded.** Student history never promotes a skill to Core.
4. Optionally adjust `coming_to_core` and `targets`. Study cards follow the skill statuses automatically.

`target_total_points` sets what the whole quiz is worth in Canvas (10, to match a 10-point Canvas assignment), split evenly across however many questions that week has — change `targets.total_questions` and each question’s point value adjusts automatically, so the quiz always adds up to `target_total_points`. Pick a question count that divides evenly into it (20 → 0.5 each, 10 → 1 each) so scores don’t come out as long decimals. If Core and Practice should ever be weighted differently instead of split evenly, add an explicit `"scoring": {"core_correct": ..., "practice_completed": ...}` — its presence overrides the automatic split.

Then run the tests and preview with `?debug=1` (see below).

Because the start of a new quiz number invalidates unfinished attempts from the last one, update between classes, not during.

## Questions (`data/questions.json`)

Each question has a stable `id`, a `skill`, a `level` (0 recognition, 1 recall/basic application, 2 troubleshooting, 3 independent scenario), an optional `activity_gate`, `choices` with `answer_index`, and a 1–2 sentence `explanation`. Choices are shuffled per student, so writing every answer first is fine. Set `"shuffle": false` for choices like “All of the above”.

- **Drafts:** questions marked `"draft": true` are never used. Review one, then delete that line. Or set `"include_drafts": true` in the curriculum to use them all. New questions on Core skills start as drafts; Practice and activity questions go live directly.
- **Verified:** every question and study card has `"verified": true/false` — whether the instructor has personally read and confirmed it. This is independent of draft/live: a question can be live (served to students) but still unverified, which is the normal state for anything nobody has checked yet. It doesn’t affect selection at all; it only tracks review work. In the content editor, adding a note to something sets it back to unverified — a note means "needs a change."
- **Activity gates** use the site’s activity ids (`stereo`, `cameras`, `x32compact`, `live-looping`, `dante`, …). Gated questions go only to students who report the activity. A level-N gated question needs the activity N times (level 2 → twice, level 3 → 3+).
- Common (ungated) questions above `max_common_level` are skipped.
- Every `skill` needs a label in the `skills` map at the top of the file and a status in the curriculum. The tests check this.

## How questions are chosen

For each attempt, `js/engine.js` builds:

1. Up to `activity_aware_questions` gated questions, spread across the student’s activities.
2. Common Core questions, up to `core_questions` total Core.
3. Common Practice questions to reach `total_questions`.

Within each pool it covers as many different skills as possible before repeating one. When a previous code is loaded, it also:

- brings back missed Core skills as a *different* question;
- favors skills that were Practice last time and are Core now;
- avoids exact questions seen in the last two quizzes;
- eases off skills answered right twice in a row.

With no code, none of that applies, so the quiz adapts to nothing it doesn’t know.

## Quiz code format

`M248Q<quiz>.v<schema>.<base64url JSON>.<first 12 hex chars of SHA-256>`

| key | meaning |
| --- | --- |
| `s` | state schema (1) |
| `app` | app version |
| `q` / `v` | quiz number / curriculum version |
| `id` | random quiz ID, carried forward each week (no names) |
| `t` | completed at (ISO) |
| `seed` | selection seed |
| `n` | attempt number for this quiz on this device (a retake shows as 2+) |
| `act` | self-reported activity counts (non-zero only) |
| `a` | this quiz’s results: `c1`/`c0` Core right/wrong, `p1`/`p0` Practice |
| `sk` | last 5 outcomes per skill, oldest first |
| `seen` | question ids from earlier quizzes (capped at 40) |
| `sc` | `[coreCorrect, coreTotal, practiceDone, practiceTotal, points, max]` |

The checksum catches copy/paste damage and casual edits. **It is not security**: the code is public and anyone determined can forge a code. Don’t build the midterm on this.

## Instructor tools

- **`verify/`**: paste Canvas submissions (any number) or choose the files from Canvas “Download submissions.” You get a table of scores and checksums, a flag when two different codes share a quiz ID, and a by-skill summary with the weakest Core skills first. Everything runs in the browser.
- **`?debug=1`**: shows the selected questions, their roles, and the saved state, and adds an “answer the rest randomly” button. Add `&drafts=1` to include draft questions.

## Privacy

No student names or activity records live in this public repo. Students self-report activities, Canvas already knows who submitted, and each code carries only a random ID. The original handoff bundle (`mus248_quiz_handoff.zip`) contains names, so it’s gitignored.

## Tests

```bash
cd quiz && npm test
```

This checks the data files, the SHA-256, code round-trips and tamper detection, selection rules (counts, gates, determinism, Quiz 2 adaptation), and scoring. It needs Node 18+ and nothing else.

To preview locally, serve the repo root (for example `python3 -m http.server 8248`) and open `http://localhost:8248/quiz/`.
