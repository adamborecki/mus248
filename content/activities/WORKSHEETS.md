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

## Status — the generator is built

Shipped and proven against all seven migrated activities:

| | |
| --- | --- |
| Student worksheet | `/<id>/worksheet/` |
| Answer key | `/<id>/worksheet/key/` — `noindex`, not linked from anywhere students see |
| Print-them-all list | `/worksheets/` |
| Code | `worksheet.js` (parse + render), `worksheet.css` (`@media print`), `markdown.js` (shared with the activity page) |
| Check | `node tools/check-worksheets.mjs` |

Static, no build step, same as the rest of the site. The activity page and the worksheet run
through **one** parser, so they cannot disagree about what the source file says.

Current yield: **7 worksheets · 31 checkpoints · 33 questions · 32 key terms.** Longest
(Portable Cameras) prints at just under two pages; lightest (Dante Walkie-Talkie — Advanced)
fits on one with room to spare.

## What goes on the page

Pulled straight out of `<activity>.md`:

| Worksheet element | Comes from |
| --- | --- |
| Title, estimated time, group size | frontmatter, falling back to `data/activities.json` |
| Name / date line, and a Round box when `roundsSupported: true` | added by the generator |
| Definition of done | `## ✅ Definition of done` |
| Key terms to write in | `## 🗝️ Key terms` — **bold** terms get a rule to write on, plain ones become a compact "also know" line |
| Checkpoints as ☐ checkboxes | every `🚩` line outside Definition of done, in order, tagged with the section it came from |
| Questions with blanks / options to circle | every `**Qn (type).**` block |
| "One thing to remember" | `## 💭 Before you leave` |

Deliberately *not* on the page: the step-by-step procedure, photos, troubleshooting. Those stay
on the phone. Students should never copy text from screen to paper.

Sections that are missing are skipped, not printed empty.

## Decisions that were open and are now closed

- **Marking correct answers — `- ✅` on the correct option, as recommended.** Multiple choice
  marks the option: `- ✅ c) 9 dB`. A question with no option list gets a `✅ **Answer.** …`
  line, which may wrap. Both student renders (the activity page and the worksheet) strip the
  markers, so the key lives in the same file without leaking. All 33 questions are marked, and
  `check-worksheets.mjs` fails on an unmarked one or a leak.
- **`live-looping.md` normalized.** It predated the template; it now has emoji headings, 6
  checkpoints, key terms, a definition of done, and typed questions. Its worksheet is no longer
  thin.
- **Non-activity markdown is ignored** because the generator is driven by `data/activities.json`,
  never by globbing the folder. `_template.md`, this brief, and `_source/` can never be mistaken
  for activities. The checker asserts it.

## Still open

- **Keep or turn in?** Built assuming students keep it. If it gets turned in, the name line needs
  to matter more and rounds probably want a page each.
- **Who prints?** Built assuming the instructor prints a stack ahead of class — that is what
  `/worksheets/` is for. It also prints acceptably from a phone if that changes.
- **Filling the gaps in the sources.** Four of the seven have no `Definition of done`, and four
  have no `Key terms`. The generator skips them cleanly, but the sections are worth writing —
  they are the two that carry the most weight on paper.

## Correction to the earlier recon

The first pass reported `Key terms` in 4 of 7 files. It is **3 of 7** (stereo, cameras, and now
live-looping); `Definition of done` is 3 of 7 as first reported. Counts in the table above come
from the checker, not from reading.

## The three targets

Chosen by what students most need to learn, not by what's easiest to generate. All three point
at the same real job: recording a recital in BH 209 (Salmon Recital Hall).

**1. Portable Cameras — add the BH 209 built-in cameras.** *Partly done.* The activity now
covers the three handhelds plus an orientation to the hall's installed cameras. What the
instructor confirmed in September 2026 is written in: they are **AJA RovoCam**, driven from
**software on a computer in the room**; recording lands on an **SD card in a Blackmagic
recorder** (bring a fast card); the hall gives **both** embedded audio and a separate feed; the
door is on a **key code** most students already have, and the code itself stays out of this
public repo.

The click-by-click procedure is **not** written, on purpose — the instructor's own words were
that more detail is needed than was available then, and the template's rule is that gear details
get verified before they become student instructions. Everything still missing is itemized in
two places: `cameras.md`'s **Technical verification**, and `_source/bh209-cameras.md`, which is
the landing spot for the room's existing (old, still-external) documentation. Importing that
doc as plain text is the unblocking step — `tools/import-activity-doc.sh bh209-cameras <url>`.

**2. X32 Compact — redesign.** No `.md` yet, but `_source/x32compact.txt` holds the full 716-line
procedure (wireless pairing, mains, two monitor buses, Sends on Fader, Dante stems into channels
9–16). Enough to draft a templated version without new information.
*Blocked on:* nothing to start. Needs judgment about how much of a long procedure belongs in one
activity versus split into rounds. **This is the next thing to do** — it needs nobody.

**3. Stereo Recording — add more capture paths.** Today `stereo.md` is one interface plus a
stereo pair through XY/AB/ORTF. Growing it toward: BH 209's built-in audio recording, a portable
Zoom F8 with KM 184s (or another stereo SDC pair), and a handheld backup — an H4 plus a newer
32-bit-float Zoom that needs no gain setting and mounts on a stand.
*Blocked on:* which recorder models exactly, and BH 209's separate audio feed — the same
question target 1 leaves open.

## Not ready — these need migrating before they can have a worksheet

`daw` · `mixer` · `x32compact` · `mic-stands`

All four have their instructions in `_source/` as plain text, but no templated `.md` yet, so
there is nothing structured to generate from. Mic Stand Yoga is the heaviest lift: it's 22
slides of mostly photos, and its images need downscaling out of the deck first (see
`_source/README.md`).

## Parsing — verified against the real files

Checked, not assumed, then implemented and tested. These are the patterns the generator relies on:

**Questions** — a bolded marker, the type in parentheses, then the prompt, which **may wrap**:
```
**Q2 (multiple choice).** Your shot is one stop too dark ...

- a) 4 dB
- ✅ c) 9 dB
```
Types seen in the wild: `(multiple choice)` and `(fill in the blank)`; `(short answer)` was added
for live-looping, and an untyped `**Qn.**` is inferred from whether options follow. Options are
`- a)` / `- b)` items (a trailing `A.` also parses), ending at the next blank line.
Fill-in-the-blank questions have no option list; the blanks are runs of underscores inside the
prompt text (`F______ · ______ dB`), which print as writable rules. A question with neither
options nor blanks gets two ruled lines.

Questions must number `1..n` in file order — the checker enforces it, so inserting one mid-file
means renumbering the rest.

**Checkpoints** — two shapes, both handled:
```
🚩 **Checkpoint.** You should now see a live picture ...
> 🚩 You will set the house default twice ...
```
The leading `>` and the `**Checkpoint.**` label are stripped and the sentence kept; a label that
is all there is (`**Final checkpoint.**`) becomes the sentence. A label that says something else
(`**Stop here and test.**`) is kept. `- 🚩` bullets inside `## ✅ Definition of done` stay in the
done list rather than being counted twice.

**Hard-wrapped lines.** Source files may wrap. Paragraphs, bullets, and blockquotes are joined
before parsing, so a checkpoint wrapped across two lines no longer reaches the worksheet as half
a sentence. This was a real bug in the activity page's renderer too — the older files happened
to use one long line per paragraph, so nothing had exposed it.

## Scope reality for Monday

**Order, as confirmed — updated:**

1. ~~**Generator + print stylesheet**, proven against the seven already-migrated activities.~~
   **Done.**
2. **Portable Cameras + BH 209** — **as far as the facts allowed.** Finishing it needs the room's
   documentation in the repo.
3. **X32 Compact**, drafted from the imported source — no waiting on anyone. **Next.**
4. **Stereo Recording**, last: it adds the most new equipment and carries the most unknowns.

## Still needed from the instructor

**BH 209 (Salmon Recital Hall)** — the full list lives in `_source/bh209-cameras.md`. The
shortest path: import the room's existing documentation as plain text, and add a screenshot of
the camera control software and one of the recorder's front panel. Those two pictures would
answer most of the open items faster than prose.

**Recorder models, for Stereo:**
- Which 32-bit-float Zoom — described as "no gain to set, mounts on 3/8-inch." Likely the F3
  (two XLR, no gain knobs), an M4 MicTrak (built-in XY, stand-mounting), or an *essential*
  model. The exact one matters because the procedure differs.
- Is the F8 with KM 184s confirmed, or does the stereo pair depend on what's free that day?
