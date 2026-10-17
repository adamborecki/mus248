# Sushi — Product + Build Spec

**Status:** approved direction for the first substantial build  
**Owner:** Adam Borecki  
**Build model:** Opus for the initial build; Sonnet for routine maintenance afterward  
**Site:** `adamborecki/mus248` GitHub Pages  
**Target route:** `/sushi/`

> This file is a handoff. Read it together with `SUSHI_BACKEND_PRIVACY_SPEC.md` and the root
> `CLAUDE.md` before writing code.

## 1. What Sushi is

Sushi is a lightweight operational ticket system for the Chapman music-technology / recording
program, presented as a clean sushi-conveyor interface.

It is **not primarily a game**. The sushi metaphor should make maintenance and production work
pleasant, legible, and easy to claim, while the underlying behavior remains a serious task system.

Initial users:

- MUS 248 students doing work for class participation/credit
- hired recording-engineer / music-tech student employees doing paid work
- Adam, who is the only admin in v1
- other staff (for example the Conservatory Operations Coordinator) may use normal-user views later,
  but are not admins in v1

Sushi must be able to track work history without deciding grading or payroll policy. **Canvas remains
the grading system. The university payroll system remains the payroll system.** Sushi records work;
it does not calculate grades or wages.

## 2. Why it belongs in MUS 248

The current MUS 248 site is the hands-on operational hub for concert recording. Its existing
taxonomy already includes:

- Audio Capture
- Video Capture
- Live Sound
- Post Production
- Data Management

Sushi should therefore begin with studio/room maintenance but be designed from day one to include
**Post Production and Data Management**, and eventually real gig-linked work.

Add Sushi as a first-class section of the existing MUS 248 home page, not as a separate repo or
framework.

## 3. Core metaphor / state model

Keep the metaphor understandable, not cutesy enough to obscure status.

| Real workflow | Sushi language | Canonical state |
|---|---|---|
| Work is available | On the Belt | `available` |
| User opens details | Looking at it | no state change |
| User takes responsibility | At My Table / Take the Plate | `claimed` |
| User is blocked and needs Adam | Call the Chef | `help_requested` |
| User submits completion | Finished Eating | `submitted` when verification is required |
| Work is finished | Cleared | `completed` |
| User gives task back | Put It Back | returns to `available` |

Do **not** automatically expire claims after two hours or some arbitrary window. That did not match
the real workflow. A claim stays claimed until the claimant releases/completes it or Adam clears it
from the private admin Sheet.

## 4. Identity: deliberately lightweight

There is no Chapman/Google login in v1.

On first use:

1. Ask the user to enter their name.
2. Ask how they are doing the work: at minimum `MUS 248`, `Student employee`, or `Other`.
3. Remember those choices in `localStorage`.
4. Let the user change them from a small profile/settings control.

Do **not** publish or fetch a class roster. Do **not** present a dropdown of student names.

This identity is a convenience / accountability identity, **not secure authentication**. Never treat
Sushi records as authoritative proof for grades, payroll, discipline, or access control.

The backend design adds a per-claim secret so one browser cannot casually finish another browser's
claim. See the backend/privacy spec.

## 5. Main student/employee experience

### Home / belt

The default page should answer, quickly:

- What work is available?
- What is urgent?
- What can I do where I am?
- How long will it take?
- What have I already claimed?

Suggested structure on a phone:

1. Compact Sushi header + profile
2. **My Table** — tasks claimed on this device, if any
3. **The Belt** — available tasks
4. Filters / chips
5. Completed/history should not dominate the main page

The belt can have restrained horizontal conveyor motion on larger screens. On phones, usability beats
literal animation: a horizontal scroll/track or card list is acceptable. Respect
`prefers-reduced-motion`.

### Task card

At a glance show:

- title
- sushi/plate visual
- category
- location
- estimated time
- urgency / due-soon indicator when applicable
- available vs claimed vs awaiting verification

Never show another worker's name publicly.

### Task details

Opening a task does **not** claim it. Show:

- plain-language description
- location
- expected time
- **Before you take it**: access, prerequisite, safety, or “ask Adam first” details
- **Definition of done**
- note/verification expectations
- due/urgency information when public-safe
- Take the Plate button

This is the useful version of the “check dietary restrictions before taking sushi” metaphor. Do not
literally call equipment prerequisites “dietary restrictions.”

### Claiming

“Take the Plate” should be one deliberate action. Once confirmed:

- the task leaves the public available belt
- it appears at the claimant's **My Table**
- other users see only that it is claimed/unavailable, never the claimant name
- the private backend records name, work mode, timestamp, claim id, and audit event

Two users must not be able to successfully claim the same task at once.

### Call the Chef

A claimed task offers **Call the Chef / I need help**.

Allow a short optional note. This should:

- mark the task `help_requested`
- record an audit event
- keep ownership with the claimant
- optionally notify Adam by email if an admin email is configured privately in Apps Script
- not leak the worker name or note in the public task feed

The worker can still return to the task later.

### Completion report

Routine task:

- Done button
- short note if optional
- submit
- becomes `completed`

Selected task:

- Done button
- required or optional note according to task configuration
- submit
- becomes `submitted` / “Waiting for Adam”
- Adam verifies it privately from the Sheet/admin helper
- then becomes `completed`

Support these task-level settings:

- completion note: `none | optional | required`
- verification: `self | admin`

Design the schema so photo evidence can be added later, but **do not build anonymous photo upload
into the first backend**. It adds Drive permissions/abuse complexity without enough benefit yet.

## 6. Effort / plate model

Use plate size to communicate **time/effort**, not points or competition.

Suggested display vocabulary:

- Small plate — about 5–10 minutes
- Medium plate — about 10–25 minutes
- Large plate — about 25–60 minutes
- Sushi boat / project — larger, multi-part, or 60+ minutes

Store an estimated minute value or range separately from the visual effort class where practical.

Do not add leaderboards, streaks, XP, scores, or competitive ranking in v1.

## 7. Task families

The data model must support at least these families from day one.

### Maintenance

Examples:

- clean keyboards
- dust a workstation / monitors
- straighten cable storage
- check batteries
- check / clear SD cards
- reset a room after use

Some recur weekly, some monthly, some are simply created as needed.

### Data Management

Examples:

- check SD-card readiness
- transfer recording media
- confirm a folder was copied
- archive / organize media
- verify storage readiness before a busy recording period

### Post Production

Examples:

- edit a concert recording
- audio cleanup
- video edit / multicam pass
- export deliverables
- QC an export
- archive project media

### Gig-linked work

Eventually Sushi should create or display tasks related to real gigs. Do not tightly couple v1 to an
unknown gig database yet.

Build fields such as `source_type` and a private `source_ref` so a future process can create tasks
from gig/calendar data without redesigning the system.

A public task can say something like:

- “Salmon recording — data transfer”
- “Music at Noon — audio edit”

when that information is safe/public.

A sensitive or unreleased event should use a generic public label while the private Sheet retains
the useful internal context.

## 8. Recurring work

The first build should support:

- one-off task instances
- weekly recurring templates
- monthly recurring templates
- manual/as-needed task creation

Do not over-engineer semester-week intelligence yet.

Example: SD-card work should have at least a weekly readiness check, while extra checks/clears can be
created around busy gig periods. Later, a gig source or semester-load model can spawn additional
instances.

Prefer **lazy materialization** (for example, ensure due recurring instances exist when the public
list is requested) or another simple robust mechanism over a complicated scheduler unless there is
a compelling reason.

The schema should make future trigger kinds possible, e.g. `gig`, `semester_week`, or custom
intervals.

## 9. Filters and organization

Provide useful, fast filters without turning the interface into a database UI.

At minimum:

- location
- category/family
- effort/time
- urgency
- available vs My Table

Likely locations include the existing music-tech / recording spaces, but locations are data, not
hard-coded UI. Never include door/access codes.

Post-production/data tasks may have virtual or broad locations.

## 10. Urgency

Urgency is independent of plate size.

Support something like:

- normal
- due soon
- urgent

A 5-minute urgent SD-card task stays a small plate; it simply gets a stronger urgency treatment.

Keep animation restrained. Do not use flashing UI.

## 11. Visual direction

Target: **somewhere between a clean operations dashboard and a charming sushi restaurant.**

Desired:

- unmistakable sushi visual identity
- clean plate/card shapes
- subtle conveyor motion
- tasteful decorative details
- excellent phone usability
- fast scanning
- accessible color contrast
- keyboard accessibility
- reduced-motion support
- native-looking controls
- no framework and no build step

Avoid:

- childish game UI
- leaderboards / fake currency
- excessive animation
- hiding operational information behind metaphor
- huge decorative art that slows the page

Use CSS/emoji/simple original SVG where useful. Do not depend on copyrighted restaurant art or heavy
asset libraries.

## 12. Offline / failure behavior

Unlike the rest of MUS 248, Sushi depends on a backend.

Cache the latest safe public task list locally so the page can still show a clearly marked stale
read-only view if the backend cannot be reached.

When offline or the backend is unavailable:

- say that the list may be stale
- show cached tasks if available
- do **not** pretend a claim/completion succeeded
- do not build a complex offline mutation queue in v1

The frontend should fail gracefully if the Sheet/API is not yet configured.

## 13. Repo integration

Stay consistent with the existing repo:

- vanilla HTML/CSS/JS
- no framework
- no bundler
- relative URLs compatible with branch previews
- public repo privacy rules remain in force

Expected implementation area:

```
sushi/
  index.html
  sushi.css
  sushi.js
  config.js                 # only public-safe config
  README.md                 # operating/deployment docs
  backend/
    Code.gs                 # Apps Script source of truth
    appsscript.json         # if useful
    README.md               # setup/deploy instructions
  tests/
    ...
```

Exact names may change if a better repo-native layout emerges.

Add a Sushi entry to the MUS 248 home page. It should read as an operational section, not a normal
instructional activity that needs a generated worksheet.

Update the root README/repo map after the implementation is real.

## 14. Mock-first / live-backend sequence

The first build should be substantial, but do not block UI work on Google setup.

Recommended sequence:

1. Read the existing MUS 248 repo and both Sushi specs.
2. Build the complete frontend against a mock adapter / mock task dataset.
3. Exercise all states: available, claim, My Table, help, release, complete, verification pending.
4. Build the backend implementation to the documented contract.
5. Provide an easy setup function / clear steps for creating the Google Sheet tabs and Script
   Properties.
6. Switch the app to the live backend once Adam creates/deploys the Sheet + Apps Script.
7. Keep mock mode available for development/testing, but do not show fake work on production once
   live configuration exists.

Adam does **not** need to create the Sheet before the frontend/build begins.

## 15. Admin experience

There is no public “secret admin button” in v1. Without authentication, that is not meaningful
security.

Adam is the only admin. The Google Sheet is the primary admin surface in v1.

Make it practical to:

- add/edit one-off tasks
- add/edit recurring templates
- inspect current claims
- clear an abandoned claim
- verify a submitted task
- see the append-only work/audit history
- filter/export history later for class participation analysis or employee work review

If helpful, Apps Script may add a **Sushi Admin** custom menu to the Sheet for operations such as
“verify selected task” or “clear selected claim.” This is preferable to a fake-protected public
admin page.

## 16. Maintenance workflow

The initial build should be unusually well documented because Adam intends to use:

- **Opus** for the initial architecture/build
- **Sonnet** for ordinary maintenance

A future Sonnet session should be able to understand:

- where task fields live
- how state transitions work
- which fields are safe to expose
- how to add a task/template
- how to deploy an Apps Script change
- how to test locally
- how to diagnose a stuck claim
- how to add a new task family without breaking privacy

Prefer obvious code and comments over clever abstraction.

## 17. Testing / acceptance criteria

The first build is not “done” merely because it renders.

At minimum verify:

- mobile layout in Chromium responsive view
- reduced-motion behavior
- mock claim race/conflict behavior
- double-click / repeated action idempotency
- claim → help → complete flow
- claim → release flow
- admin-verification flow
- self-verification flow
- localStorage identity/profile survives reload
- My Table recognizes claims made on this device without needing a public name
- backend errors do not falsely report success
- no private fields appear in the public API response
- no student names are committed to Git
- no spreadsheet id, private notes, admin email, access code, or credential is committed
- existing MUS 248 worksheet + quiz tests continue to pass
- branch-preview URL works with relative paths

Use Node's built-in test/assert tools if useful; do not introduce a framework solely for Sushi.

## 18. Non-goals for v1

Do not make the initial build sprawl into:

- Canvas grade sync
- payroll integration
- Chapman SSO / Google login
- student roster publishing
- photo uploads
- leaderboards / points / streaks
- a full gig database
- push notifications
- a general-purpose project-management platform

Design seams for future work, but ship a coherent maintenance/post/data ticket system first.

## 19. Tone / terminology

Student-facing copy should be concise and friendly.

Good:
- On the Belt
- My Table
- Take the Plate
- Call the Chef
- Put It Back
- Finished Eating
- Waiting for Adam
- Cleared

Always pair metaphor with enough plain language that status is obvious.

## 20. First-build priority

Adam explicitly wants the **first build to be fairly big**. Do not respond by producing only a tiny
proof of concept or another design memo.

The first implementation session should aim for a polished mock-complete frontend **plus** a real
backend source/setup path, privacy-safe API boundary, persistence model, and documentation. If live
Google deployment needs Adam to perform a manual account step, finish everything possible around
that dependency and give him the shortest exact setup steps.
