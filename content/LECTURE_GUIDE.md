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

## Every week: Announcements first

Every lecture opens with `## 📣 Announcements`, and its first slide is always `### Homework review`:
what's due this week, with due dates. Until that list is written, the slide says **see Canvas**
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
- Students can hand it in unfinished (they're warned first). It records tries, clicks, and time
  per question.

### How many

Thorough without being monotonous: **every section of the lecture gets questions**, roughly one per
idea worth remembering. VC1 has 26 for 8 sections. Don't cap it at a round number, and don't ask
the same thing twice in different words.

A good mix is about half multiple choice, a third fill in the blank, and a few short answers.

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
