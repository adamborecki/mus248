# Printed worksheets — build brief

**Due Monday, Sept 21, 2026.** Working notes, not student-facing.

## What it is

Every activity gets a **printed worksheet**: a compact page students write on while they work,
and keep. The phone/web page stays the full "textbook" — all the instructions, photos, and
troubleshooting. The paper is the "workbook" — checkpoints to tick, blanks to fill, questions
to answer.

**The worksheet is generated from the activity's own markdown, never written separately.** That
is the whole point. A hand-maintained worksheet drifts from the instructions and turns into the
paperwork problem that killed the previous Google Keep version. One source file, two renderings.

## What goes on the page

Pulled straight out of `<activity>.md`:

| Worksheet element | Comes from |
| --- | --- |
| Title, estimated time, group size | frontmatter |
| Name / date line | added by the generator |
| Definition of done | `## ✅ Definition of done` |
| Key terms to write in | `## 🗝️ Key terms` |
| Checkpoints as ☐ checkboxes | every `🚩` line, in order |
| Questions with blanks / options to circle | every `**Qn (type).**` block |
| "One thing to remember" | `## 💭 Before you leave` |

Deliberately *not* on the page: the step-by-step procedure, photos, troubleshooting. Those stay
on the phone. Students should never copy text from screen to paper.

Target one page, two if an activity genuinely needs it. Compact, skimmable while standing at a
mic stand with the page on a music desk.

## How it renders

- A print view per activity — `/mus248/<id>/worksheet/` — styled with `@media print`.
- An **answer key** at a separate instructor URL, generated from the same file, `noindex`.
- Everything is static; no build step, matching how the rest of the site works.

## Open questions

- **Keep or turn in?** The plan assumes students keep it. If it gets turned in, it needs a
  name line that actually matters and probably a per-round page.
- **Who prints?** Instructor prints a stack ahead of class (simplest, assume this) or students
  print their own (then it must print cleanly from a phone).
- **Marking answers.** The answer key needs correct answers marked inline in the markdown,
  hidden from the student view. Recommended convention: `- ✅` on the correct option. Needs a
  decision before the key can generate.

## What's ready

Seven activities are migrated and already carry the markers the generator needs — 35 🚩
checkpoints and consistent `**Q1 (fill in the blank).**` / `**Q2 (multiple choice).**`
formatting:

`stereo` · `cameras` · `live-looping` · `dante-broadcast` · `dante-jam-session` ·
`dante-walkie-basic` · `dante-walkie-advanced`

Caveats:

- `live-looping.md` predates the current template: plain headings instead of the emoji ones,
  no 🚩 checkpoints, questions in a different shape. **Normalize it first** or its worksheet
  will come out thin.
- Not all seven have every section. Counted across the migrated files: 🚩 checkpoints 0–12,
  questions 1–8, `Definition of done` in 3 of 7, `Key terms` in 4 of 7, `Before you leave` in
  6 of 7. The generator should skip missing sections rather than print empty ones, and the
  gaps are worth filling in the source files.
- The generator must ignore non-activity markdown in this folder — `_template.md` and this
  brief — rather than treating every `.md` as an activity.

## Not ready — these need migrating before they can have a worksheet

`daw` · `mixer` · `x32compact` · `mic-stands`

All four have their instructions in `_source/` as plain text, but no templated `.md` yet, so
there is nothing structured to generate from. Mic Stand Yoga is the heaviest lift: it's 22
slides of mostly photos, and its images need downscaling out of the deck first (see
`_source/README.md`).

**Critical path question: which activities actually need a worksheet by Monday?** If the answer
is inside the migrated seven, this is a generator plus a print stylesheet. If it includes any of
the four above, that activity has to be migrated first, and Mic Stand Yoga is a whole project of
its own.
