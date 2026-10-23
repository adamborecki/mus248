# Writing follow-along notes and online refreshers for a lecture

For anyone (person or AI) adding **follow-along notes** or an **online refresher** to a lecture in
`content/lectures/`. Both are generated from the lecture's own Markdown file: you never build a
page, you mark up the lecture. `CLAUDE.md` (Lectures) has the short version; this is the long one,
including the mistakes that have already happened once.

Worked example: `content/lectures/2026-10-19-vibecoding-1.md` (126 blanks, 26 questions).

## What students get, and when

| | Follow-along notes | Online refresher |
|---|---|---|
| Comes from | `==term==` marks in the lecture text | the lecture's `**Qn (type).**` questions |
| Student opens | lecture page → 📝 **Follow-along notes** (printed) | lecture page → 🔁 **Online refresher** (phone) |
| When | filled in **during class**, from the slides | done **the week after** |
| Handed in | photos of the paper, on Canvas, due the Sunday after | **📋 Copy Canvas deliverable**, pasted into Canvas |
| On the slides? | yes: the word shows as plain text | **no**: questions are kept off the page, slides, and notes |
| Key | instructor view → 🔑 Notes key | instructor view → 🔑 Refresher key |

The buttons appear on their own: a lecture with at least one `==term==` gets notes, and a lecture
with at least one question gets a refresher. **If you were asked for a refresher only, add
questions and no blanks.**

## The weekly rhythm

One lecture, one quiz, every Monday. For lecture X on Monday A:

| When | Lecture X's follow-along notes | X's online refresher | X's material in the quiz |
|---|---|---|---|
| **Monday A** (class) | filled in during class | | **Practice** on that day's quiz |
| **Sunday before Monday B** | photos **due** on Canvas | | |
| **Monday B** | | **opens** 7:00 AM | moves to **Core** |
| **Sunday before Monday C** | | **due** on Canvas | |

So the same Sunday, students hand in **this** lecture's notes and **last** lecture's refresher.

- **The quiz** is the weekly quiz the quiz engine builds from its question bank
  (`quiz/data/questions.json`), not the refresher. It's meant to be taken **in class** on Monday.
  If it isn't ready, or the lecture runs long, it becomes take-home, due the Sunday before the next
  Monday.
- **"Skill"** in the quiz engine means a topic tag (`gig_families`, `aux_sends`): every question in
  the bank belongs to one, and each skill's status in `quiz/data/curriculum.json` (`practice`,
  `core`, `inactive`) decides whether its questions count. Only **verified** questions on Core
  skills are graded, so promoting a skill with no verified questions changes nothing.
- **The refresher and the quiz are separate.** Refresher questions live in the lecture Markdown
  and test that one lecture; quiz questions live in the question bank and come back week after
  week. They can cover the same ideas, but word them differently.
- **Maybe later:** a lecture's easy questions go Core on Monday B and its harder ones on Monday C
  (per-question `tier` overrides already allow this).

**Fall 2026 Mondays left** (from Oct 26): Oct 26 (lecture 09), Nov 2, Nov 9, Nov 16, no class Nov 23
(Thanksgiving), Nov 30, and Dec 7 (the finals-week meeting).

## New lectures: outline first, instructor writes, questions last

1. **A planning conversation** about what the lecture is for and how long it runs.
2. **An outline draft** (Claude): every slide's heading, and short bullet fragments for anything
   that should be in the instructor's voice (stories, opinions, announcements). Reference material
   students copy or follow (click-by-click steps, tables, code starters) can be close to final.
   Sections that aren't settled stay rough, with a `> 🧑‍🏫` note saying what's undecided. Blanks can
   go in now, on key terms.
3. **The instructor writes it**, in presenter view (Shift+E, then 📤 Changes) or with instructor
   view's ✏️ Edit on GitHub link.
4. **Refresher questions last**, from the final text, because they test what was actually said.
   Until then the 🔁 button reads "not written yet". While they're half done, set
   `"refresherDraft": true` on the lecture in `data/lectures.json` and the button reads "being
   written" (students can't open it); remove it when they're ready.

Vibecoding 2 (`2026-10-26-vibecoding-2.md`) is the first lecture made this way.

## Every week: Announcements first

Every lecture opens with `## 📣 Announcements`, and its first slide is always `### Homework review`:
how far into the semester we are, then what's due this week, with due dates. It opens with two
lines, each its own paragraph:

```
**Today:** Week 10 · Class 9

**After today:** 5 classes (4 + 1 meeting in finals week)
```

The class number is the lecture's `lecture` number (it runs one behind the week: no class on Labor
Day). "After today" counts the normal class weeks left, skipping Thanksgiving week, plus the one
meeting in finals week. For Fall 2026 after Oct 26: Nov 2, 9, 16, 30, and Dec 7 in finals week.
Until the homework list is written, the slide says **see Canvas**
(with a 🧑‍🏫 note saying it's a placeholder). Other announcements follow as their own slides. The
checker requires this for `upcoming` lectures, and `content/lectures/_template.md` starts a new
lecture with it already in place.

## The online refresher

### How it behaves (so you write for it)

- Every question allows **three tries**, then shows the answer.
- Every question **ends on its `✅ **Answer.**` line**, shown as **"The main point:"**, whether the
  student got it right, ran out of tries, or wrote a short answer. So that line is a one- or
  two-sentence paraphrase of the slide's point, not just the answer.
- It **opens 7:00 AM Pacific the Monday a week after the lecture** (`refresherOpens` in
  `data/lectures.json` overrides it); until then students see when it opens. Instructor view can
  always open it.
- After one miss (right away on a short answer), **👀 Peek at the notes** opens the follow-along
  notes, filled in, at the question's slide: a sheet on a phone, a side panel on a wide screen. It
  doesn't cost a try; the deliverable counts which questions were peeked at. It finds the slide by
  the question's slide title, so a question has to sit under the slide it's about.
- Students can hand it in unfinished (they're warned first). It records tries, clicks, and time
  per question.

### How many

Thorough without being monotonous: **every section of the lecture gets questions**, roughly one per
idea worth remembering. VC1 has 26 for 8 sections. Don't cap it at a round number, and don't ask
the same thing twice in different words.

A good mix is about half multiple choice, a third fill in the blank, and a few short answers.

**Keep it quick.** The Big Picture's first refresher had 45 questions and was too tedious; it's now
20, almost all three-option multiple choice with one-line prompts and short main points. Around
20 is a better target than one per idea (up to about 25 if the lecture needs it to be covered): pick the ideas that matter most, merge the small ones into
another question's main point, and skip short answers when the lecture is mostly facts.

### The three kinds

**Multiple choice:** 3 or 4 options, exactly one marked `✅`. Wrong options should be plausible
mistakes, not jokes.

```
**Q4 (multiple choice).** What is `CLAUDE.md`?

- a) The website's home page
- ✅ b) A Markdown file of rules the AI reads before it changes anything
- c) A list of every student's work

✅ **Answer.** `CLAUDE.md` holds the repo's rules for the AI: public repo, no guessing gear details,
run the tests, check it in a browser.
```

**Fill in the blank:** the answer is marked **in the prompt** with `==…==`. Students type it; case,
punctuation, a leading "the", and a plural "s" don't matter. List other accepted answers with `|`
(only the first is ever shown): `==repo|repository==`, `==bias|biases==`. Keep the blank to a word
or a short phrase someone could actually type. Don't use `______` in lectures: there's nothing to
check it against.

```
**Q8 (fill in the blank).** Everything an AI can "see" at once (your messages, its replies, and
whatever you pasted) is its ==context window==.

✅ **Answer.** The context window is all the AI can see. In a long chat, early instructions fade,
so start a fresh chat with a short summary.
```

**Short answer:** not graded. Ask for something with a real answer in one or two sentences ("Name
one thing…, and why"). The `✅ **Answer.**` line is the model answer the student compares theirs to.

### Rules the checker enforces

- Numbered **Q1, Q2, … in file order**. Inserting one means renumbering everything after it
  (a regex over `^\*\*Q(\d+) \(` does it in one pass).
- Every question has a `✅ **Answer.**` line; multiple choice has exactly one `✅` option; a fill in
  the blank has a `==term==` in its prompt.
- No question inside a 🙈 hidden slide (students would never see it).

### Where to put each question

Right after the content of the slide it's about, as its own paragraph (blank line before it). The
refresher labels each question with that slide's title, which is how a student finds it again.
A question block ends at the next heading, blockquote, table, or list that isn't its options, so a
`> 🌀` portal or `> 🧑‍🏫` note after it is fine.

### Only what the lecture says

The refresher tests the lecture, not the world. Every answer must be on the slides. For gear
details (gains, settings, port numbers), check the lecture against the matching activity or
checklist page. **If they disagree, don't encode either one in a question: ask the instructor.**
(Example: the Big Picture lecture gives the AX100 white balance as 3200 K in general; Salmon
Basic says 3800 K in Salmon specifically. Both can be true; a question has to say which room.)

## Follow-along notes

- Mark the words that carry the slide's idea: key terms, numbers that matter, the word a student
  would otherwise miss. **About four per slide**; more than eight on one slide is too much to write
  during class. Leave generic words alone ("minute", "website", "file").
- A blank is a short plain word or phrase: no `**`, backticks, or links inside it (the checker
  enforces this). `**bold ==word==**` is fine; `==**word**==` isn't.
- Blanks inside a 🌀 portal or a ``` code block don't count (and aren't blanked).
- 🙈 hidden slides can have blanks ready; they print only when the slide is visible.
- After changing blanks on a lecture that's already been printed, say so: the old printout no
  longer matches.

## Older, imported lectures (like `2026-10-12-big-picture`)

These came from PowerPoint through `tools/pptx-to-lecture.mjs` and look different:

- Slides are `### Slide 9: …`, and sections aren't numbered, so **nothing auto-numbers**. That's
  fine: the refresher labels questions "Slide 9: 3. Musco Center for the Arts". Don't renumber or
  restructure the lecture to add a refresher.
- There's usually a `## 🗓️ Class slides` section (date, agenda, homework, group lists) before the
  `## 🎤 Lecture` section. Questions belong in the lecture section, not the class logistics.
- Read the whole file before writing. Imported decks have had names, codes, and links redacted
  as `[… — ask instructor]`; never write a question whose answer is a redacted thing. Some names
  were kept on purpose (Seiyua, the Musco video tech; faculty as "Prof …"): see
  `content/instructor/repo-improvement-handoff.md`. Any other first name: ask before committing.
- The lecture is already `delivered`: adding questions makes its 🔁 button appear right away,
  which is the point.

## Editing safely (lessons from real mistakes)

- **A heading's text can also appear inside a ``` code block.** VC1's Markdown example contains
  `## 🗝️ Key terms`, so a script that found "the Key terms section" by searching for that text
  found the example instead, sliced an empty string, and corrupted the whole file. Replace whole,
  exact blocks (`str.replace(old, new)` with `assert s.count(old) == 1`), never slices between
  two searched headings.
- **Adding a 🙈 slide in the middle of a slide swallows everything after it** (until the next
  heading), questions and portals included. Put hidden slides after the visible slide's last line.
- After any scripted edit, check the file's line count and the checker's table before going on;
  a sudden jump (or a lecture with 0 questions) means the edit went wrong.

## Checking your work

```bash
node tools/check-worksheets.mjs                 # the rules; must pass
node tools/lecture-report.mjs <lecture id>      # per-slide blanks and questions, plus things worth a look
cd quiz && npm test
```

Then in a browser (`python3 -m http.server 8848`):

- `lectures/<id>/` shows the 🔁 (and 📝, if you added blanks) button, and no question text.
- `lectures/refresher/?id=<id>`: answer one of each kind, miss one three times, then
  **Copy Canvas deliverable** with something skipped (the warning should appear).
- `lectures/worksheet/key/?id=<id>` is the refresher key; read it once as the instructor would.
- If you added blanks: `lectures/notes/?id=<id>`, print preview, and note the page count.

## Asking for one (a prompt that works)

> Read `content/LECTURE_GUIDE.md`, then add an online refresher (questions only, no follow-along
> blanks) to the lecture `2026-10-12-big-picture`. Cover every part of the lecture section. Check
> gear details against the matching activity pages and ask me about anything that disagrees.
