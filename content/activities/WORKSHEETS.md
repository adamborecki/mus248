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

## The three targets

Chosen by what students most need to learn, not by what's easiest to generate. All three point
at the same real job: recording a recital in BH 209 (Salmon Recital Hall).

**1. Portable Cameras — add the BH 209 built-in cameras.** Today `cameras.md` covers the three
handhelds (G50, GH5, AX100). Adding the room's installed cameras gives students more to pick
from and connects the activity to the hall they'll actually shoot in. The existing file is well
structured, so this is an addition, not a rewrite.
*Blocked on:* what the installed cameras are, how they're operated, where footage lands.

**2. X32 Compact — redesign.** No `.md` yet, but `_source/x32compact.txt` holds the full 716-line
procedure (wireless pairing, mains, two monitor buses, Sends on Fader, Dante stems into channels
9–16). Enough to draft a templated version without new information.
*Blocked on:* nothing to start. Needs judgment about how much of a long procedure belongs in one
activity versus split into rounds.

**3. Stereo Recording — add more capture paths.** Today `stereo.md` is one interface plus a
stereo pair through XY/AB/ORTF. Growing it toward: BH 209's built-in audio recording, a portable
Zoom F8 with KM 184s (or another stereo SDC pair), and a handheld backup — an H4 plus a newer
32-bit-float Zoom that needs no gain setting and mounts on a stand.
*Blocked on:* which recorder models exactly, and what BH 209's built-in audio system is.

Two of the three need equipment facts that aren't in this repo. Per the activity template's own
rule, uncertain gear details get verified before they become student instructions rather than
guessed at — especially port labels, mounting threads, and where recordings are written.

## Parsing — verified against the real files

Checked, not assumed. These are the patterns the generator can rely on:

**Questions** — a bolded marker, the type in parentheses, then the prompt on one line:
```
**Q2 (multiple choice).** Your shot is one stop too dark ...

- a) 4 dB
- b) 6 dB
```
Types seen in the wild: `(multiple choice)` and `(fill in the blank)`. Options follow as a
blank line, then `- a)` / `- b)` / `- c)` / `- d)` items, ending at the next blank line.
Fill-in-the-blank questions have no option list; the blanks are runs of underscores inside the
prompt text (`F______ · ______ dB`), which should print as writable rules on paper.

**Checkpoints** — two shapes, both need handling:
```
🚩 **Checkpoint.** You should now see a live picture ...
> 🚩 You will set the house default twice ...
```
The second is inside a blockquote. Strip the leading `>` and the bold `**Checkpoint.**` label,
keep the sentence, render as `☐`.

**Correct answers are not marked anywhere yet.** No file records which option is right, so the
answer key can't be generated until a convention is added — `- ✅ c) 9 dB` on the correct option
is the recommendation, hidden from the student render. That decision is still open.

## Scope reality for Monday

Three redesigns plus the generator is a lot for two days, and the redesigns are the expensive
part — the generator is cheap once an activity is structured. **Confirmed order:**

1. **Generator + print stylesheet**, proven against the seven already-migrated activities. This
   is what makes "worksheets" a feature rather than one document. **Start here.**
2. **Portable Cameras + BH 209** — the instructor's priority, because more camera options
   unblocks the most students. Needs the room details below.
3. **X32 Compact**, drafted from the imported source — no waiting on anyone, so it's the useful
   fallback whenever BH 209 details haven't landed.
4. **Stereo Recording**, last: it adds the most new equipment and carries the most unknowns.

## Still needed from the instructor

Neither of these is in the repo, and the activity template's own rule says gear details get
verified rather than guessed before they become student instructions.

**BH 209 (Salmon Recital Hall), for Cameras and later Stereo:**
- What cameras are installed, and how does a student operate them — touch panel, web page,
  software, a physical controller?
- Where does footage land: internal storage, a drive, a network share?
- What is the built-in audio recording system, and is it tied to the cameras or separate?
- Does any of it need a login or a key?
- Photos of the control surfaces would answer most of this faster than prose.

**Recorder models, for Stereo:**
- Which 32-bit-float Zoom — described as "no gain to set, mounts on 3/8-inch." Likely the F3
  (two XLR, no gain knobs), an M4 MicTrak (built-in XY, stand-mounting), or an *essential*
  model. The exact one matters because the procedure differs.
- Is the F8 with KM 184s confirmed, or does the stereo pair depend on what's free that day?
