# Writing quiz skills, questions, and study cards for a lecture

The playbook for turning a new lecture into quiz material, and for the weekly quiz build. Written
Oct 22, 2026 from building Quizzes 5 and 6 (Vibecoding 1 and 2). Read with:

- `content/LECTURE_GUIDE.md` → **The weekly rhythm** (when a lecture's material is Practice, then Core)
- `quiz/README.md` → **Weekly update** (every field in `curriculum.json`) and **Questions**
- `CLAUDE.md` → **Quiz** (the content editor, the graded set, live-week care)

The refresher (in the lecture Markdown) and the quiz (in `quiz/data/questions.json`) are separate.
The refresher tests one lecture once; quiz questions come back week after week. They can cover the
same ideas, but **never copy refresher wording into the quiz**: students do the refresher the same
week, and a copied question tests memory of the wording.

## Where things live

| What | File | Who edits it |
|---|---|---|
| Skills and their status, quizzes and codes | `quiz/data/curriculum.json` | Claude; status also in the editor |
| Skill labels, questions | `quiz/data/questions.json` | Claude; the instructor in the editor |
| Study cards | `quiz/data/study-deck.json` | Claude; the instructor in the editor |
| Where each skill was taught | `quiz/data/skill-sources.json` | Claude (the test requires an entry) |
| What any quiz can ask, every code | `/quiz/overview/` (instructor view) | generated, read-only |
| Review, verify, edit on a phone | the content-editor artifact | the instructor |

## The weekly build

1. **Sync the editor first** (`tools/editor-sync.mjs`, its header says how). Editing the data files
   before a sync makes the sync report CONFLICTs. Hold anything that looks unfinished and ask.
2. **Count the quizzes, don't assume.** `quiz_number` and the `quizzes` map say what has run. A
   week can have no quiz (Sep 28 had none; Oct 19's was made up later as Quiz 5). A made-up quiz
   gets its own number and code like any other.
3. **Make the lecture's skills** (below), with an entry in `skill-sources.json` for each.
4. **Write questions and cards** (below). All `verified: false`.
5. **Add the quiz entry**: label `Quiz N`, `version` = the Monday it's for, the instructor's
   `access_code`, `expected_minutes` 6 / `window_minutes` 9 unless told otherwise, and
   `new_skills` = this lecture's skills, so its questions lead the bonus queue.
6. **Ask before changing any skill's status during a teaching week.** The rhythm says last week's
   lecture goes Core, but a skill with no verified questions can't be graded (the test fails), so
   the instructor verifies first. `/quiz/overview/` shows what's ready.
7. **Update `coming_to_core`** to what really goes Core next.
8. **Test and rehearse**: `cd quiz && npm test`, `node tools/check-worksheets.mjs`, then open the
   quiz with `?code=…&debug=1&window=0.5&expected=0.2`.
9. **Republish the editor** with a fresh baseline (`node tools/editor-sync.mjs baseline`) so the
   new questions show up there for review.
10. **Set next week's quiz up early** with `"opens"` on its entry (a time with offset, e.g.
   `2026-10-26T07:00:00-07:00`) and `quiz_number` pointing at it. Until then its code only says
   when it opens, and the site keeps serving the newest open quiz. Earlier quizzes' codes keep
   working, labeled “makeup”, so students submit them to that quiz's Canvas assignment.

## Skills

A skill is one idea a student can get right or wrong, at the size of a study card: `context_window`,
`pre_post_fader`, `two_destinations`. Not a lecture, not a whole topic.

- **Key:** `snake_case`, short, stable. It's in students' state codes forever; never rename one.
- **Label:** what students see on results and study cards. Plain words: “The context window”.
- **How many:** one per idea the lecture really teaches. Vibecoding 1 had 10, Vibecoding 2 had 6.
  A skill nobody can write three different questions about is too small; merge it.
- **Status:** new skills start `practice`. They go `core` the next Monday, after the instructor
  verifies their questions. The graded set takes **one question per Core skill**, so a skill with
  only one verified question gives every student the same item (the test warns: “thin”).
- **Source:** add `{"lecture": "<id from data/lectures.json>", "confirmed": true}` (or
  `"activity": "<id>"`) to `skill-sources.json`. `confirmed: false` means a guess; the 69 guesses
  written Oct 22 for older skills are waiting for the instructor to check.

## Questions

```json
{
  "id": "VC_CTX_003", "skill": "context_window", "topic": "vibecoding", "level": 2,
  "activity_gate": null, "type": "multiple_choice",
  "prompt": "A long AI chat keeps ignoring a rule you gave at the start. What’s the most useful fix?",
  "choices": ["Start a fresh chat with a short summary and the current file", "Repeat the rule in ALL CAPS",
              "Paste the whole chat back in", "Keep going; it will catch up"],
  "answer_index": 0,
  "explanation": "In a long chat, early instructions fade. A fresh chat puts your rules back at the front of the context window.",
  "verified": false
}
```

- **id:** `PREFIX_SKILL_NNN`, never reused. A removed id stays retired (old state codes still name it).
- **topic:** reuse one (`audio_fundamentals`, `live_sound`, `video_fundamentals`, `stereo_capture`,
  `dante`, `live_looping`, `power`, `zoom_f8`, `final_cut`, `data_management`, `salmon`, `gigs`,
  `professionalism`, `vibecoding`). A new series gets a new one.
- **level:** 0 recognition, 1 recall or basic use, 2 troubleshooting, 3 an independent scenario.
  The graded set only uses 0–1 (`max_common_level`); 2–3 are bonus. Write mostly 0–1, with one or
  two level 2 per lecture.
- **activity_gate:** only when the question needs hands-on time with that activity's gear.
- **Four choices**, correct one first (choices are shuffled per student). Distractors must be
  plausible: a joke distractor (“It wears out your keyboard”) makes the question free. Some of the
  Oct 22 Vibecoding questions have joke distractors; fix them when verifying.
- **explanation:** the main point in one or two sentences, shown after answering. Write it as the
  thing to remember, not “B is correct because…”.
- **Only what the lecture says.** If it's in an instructor note or a 🙈 slide, it wasn't taught.
- **Nothing that will go stale.** A question whose answer depends on a product's current version
  (“PantherAI gives you the highest Sonnet”) was removed for that reason. Prefer the idea (“bigger
  models use more”) to the fact of the week.
- **No unverified gear or click details.** Button labels, menu paths, and port names that the
  lecture marks “rehearse” or “confirm” aren't quiz material until they're confirmed.
- **Questions from an outline** (a lecture the instructor hasn't written up yet) are fine for its
  Practice week, but they must be reviewed against the final slides before the skill goes Core.
- **`verified: false`**, always. Only the instructor verifies, in the editor. Questions on
  Practice skills go live directly; a new question on a Core skill starts with `"draft": true`.
- **How many:** about 3–6 per skill. At least two at level 0–1 that can be verified, so the skill
  can go Core without leaking one fixed question.

## Study cards

```json
{ "id": "vc_context", "skill": "context_window", "category": "Vibecoding",
  "front": "Context window",
  "back": "Everything the AI can “see” at once: your messages, its replies, what you pasted. Long or confused chat → fresh chat with a short summary.",
  "verified": false }
```

- **One or two per skill.** Front: the term or the question a student would ask. Back: the rule or
  definition in one or two lines, with the number or the example that makes it stick.
- **category** is the topic chip on `/study/`. Reuse one from `study-deck.json`'s `categories`; a
  new series adds one to that list.
- Cards follow their skill's status automatically (Practice, Core, or hidden when Off).

## Checking your work

- `cd quiz && npm test` (data shape, every Core skill gradable, every skill has a source, state codes)
- `/quiz/overview/?instructor=1`: every code, and what each skill can contribute: “Can be graded”,
  “Bonus · Not verified yet”, “Draft: not served”
- `/study/`: the new category's cards render
- The editor dry run: `node tools/editor-sync.mjs apply <export> --baseline <editor.html>` shows
  only what you expect

## Asking for it (a prompt that works)

> Build the quiz material for `<lecture id>`. Read `content/QUIZ_GUIDE.md` first and sync the
> editor. Propose the skills (key, label, source) and wait for my OK, then write 3–6 questions and
> 1–2 study cards per skill from the lecture's final text, reworded from its refresher. Don't
> change any existing skill's status without asking.
