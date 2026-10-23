# Documentation guide — how this course's docs are written and changed

Short, local rules for anyone contributing to MUS 248 documentation: students in the
Repo Improvement, the instructor, and AI assistants. Written to be promoted later into
[webapp-conventions](https://github.com/adamborecki/webapp-conventions) once it has been tested
in class. Until then, this file is the reference.

## Three types of document

"Documentation" is the umbrella term. Every page is one of these:

| Type | Job | Contains | Doesn't contain |
|---|---|---|---|
| **Activity** | Teach a skill by doing it | What you'll practice, starting conditions, numbered learning procedure, success evidence, how to submit | Operational steps copied from a checklist — link to it instead |
| **Checklist** | Run a real job | Short ordered actions, each with a check | Lessons, background, "why" — move that to a reference |
| **Reference** | Explain | Equipment facts, diagrams, settings, troubleshooting | A procedure someone is meant to follow step by step |

- A **reset procedure** is a checklist with `"kind": "reset"`. It gets its own filter option and
  chip, not a fourth type.
- A **signal-flow diagram** is a reference, not a fourth type.
- A **simulator** is a learning tool an activity links to, not a document type.
- The type lives in `data/activities.json` as `"type"`: `activity` (the default when it's missing),
  `checklist`, or `reference`. The front page filters and labels by it.

## Where it can be done is a separate fact from whether it's verified

`data/activities.json` can carry `"settings"`, one value per setting:

| Key | Setting |
|---|---|
| `home` | At home |
| `class` | On campus, during class |
| `outsideClass` | On campus, outside class |

Values are `yes`, `no`, or `confirm`. **Map only what the page's own Logistics/Access text
says**; anything it doesn't say is `confirm`, which shows as "Confirm with instructor." Being on
campus never implies access to a room or its gear.

Room, required gear/software, supervision, and time stay in their own fields (the page's
frontmatter `access.location`, `access.supervision`, `estimatedTime`), not folded into settings.

## Writing steps

- Numbered, one action per step, imperative voice: "Hold the power switch about 2 seconds."
- Each step ends in something **observable**: "the red light under channel 3 is lit."
- Use the equipment's own labels in **bold**, exactly as printed on the gear.
- Keep working steps. Change only what testing gives a reason to change.
- American spelling.

Checklists number their steps automatically (section.item, like 3.4), so a step can be named out
loud. Don't type numbers into a checklist by hand.

## Credit

Contributors are credited only by **GitHub username**, only if they opt in, in the improved
page's frontmatter (`contributors:` as a list). Real names stay in Canvas.

## Evidence and status

Every step someone changes, or that a page presents as fact, should be traceable to evidence.
Mark changed steps in proposals:

| Mark | Means |
|---|---|
| ✅ Verified | Done on the real gear (or named simulator) and it worked as written |
| 📝 Proposed | Changed or new; not re-tested yet |
| ❓ Unverified | From the source; not tested |
| ⛔ Blocked | Couldn't be tested, with the reason |

- **Observations, suggestions, and questions stay separate.** "We held it 1 s and it stayed off"
  is an observation. "Step 4 should say 2 s" is a suggestion.
- **Never invent** settings, labels, menu paths, access permissions, results, sources, or
  reviewers. Unknown things go in the page's **⚙️ Technical verification** section as open items.
- **Contradictions are flagged, not resolved.** If two parts of a page disagree, record both in
  Technical verification and leave the decision to the instructor. Example: the Salmon Gig
  Checklist's preamp item, flagged 2026-10-14.
- The model to borrow: the Salmon upstairs diagram's `content/upstairs.json` labels each fact
  confirmed / tentative / unknown / legacy / planned, with a source note.

## Review workflow

1. A student (or anyone) tests one bounded section and submits either a paragraph of raw
   feedback or a **proposal** (the revised Markdown plus a change/test report). Through Canvas by
   default; a GitHub issue or pull request is optional.
2. A peer follows the revision with minimal coaching. Their pauses inform the next revision.
   Peers don't approve or grade.
3. The **instructor** decides what becomes the approved operational document and edits
   `content/activities/<id>.md`, bumping `revised:` (see `CLAUDE.md`).
4. Public proposals carry a group label and technical evidence only. Names, reflections, grades,
   codes, and account details stay in Canvas.

## Linking across repos

- Link to another repo's **published page** (`https://adamborecki.github.io/<repo>/…`) or a file
  on GitHub, never to a page that doesn't exist yet. **`/musco` is planned; don't link to it
  until it's live.**
- A change to something another repo generates from data (a diagram from JSON, a simulator's
  scenario) is a **proposal that names the exact source file and entry** in that repo. Editing a
  Markdown description here doesn't change the diagram there.
- Changes to other repos are coordinated in those repos, not made from here. Record the
  follow-up instead.
- Keep every link inside this site relative, so pages work both at the root and under
  `/branch/<slug>/` previews. In activity Markdown, write links relative to the Markdown file,
  the same way as images: `[Salmon Gig Checklist](../../salmon-gig-checklist/)`.
- A simulator or page worth rehearsing on before the activity goes in a `## 🕹️ Practice first`
  section, one bullet each, starting with its link: `- [Mixer Lab: Vocal Jazz](https://…): what it
  rehearses`. The page shows the links; the worksheet prints each one as a QR code (paper can't
  click). The section isn't a numbered step. A link to one scenario next to the step it rehearses
  can go in a plain line under that step, not a bullet, so it doesn't renumber the steps.
