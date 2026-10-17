# Sushi — Backend, Data, API, and Privacy Spec

**Companion to:** `SUSHI_BUILD_SPEC.md`  
**Backend target:** Google Sheets + Google Apps Script  
**Frontend:** public GitHub Pages at `/sushi/`

## 1. Security model in one sentence

**Anything the public frontend can read must be treated as public.**

The GitHub repo is public, the app has no login in v1, and the Apps Script endpoint should be
assumed discoverable. Obscure URLs are not security.

Sushi is a low-risk operational system, not an authentication system. It must nevertheless avoid
unnecessary disclosure and casual cross-user state corruption.

## 2. Public vs private data

### Public-safe fields

Examples:

- task id
- public title
- public description/instructions
- task category
- public-safe location
- effort/estimated time
- urgency
- public due label/date when appropriate
- verification requirement
- status: available/claimed/help/submitted/completed
- random claim id (not a person's identity)
- public-safe event/concert label

### Private-only fields

Never serialize these to the public frontend:

- worker name
- worker role/mode
- completion/help notes
- admin notes
- verifier identity
- private gig id / source id
- recipient/contact emails
- Drive links
- unreleased event details
- grades or class-credit decisions
- payroll/timecard data
- door/access codes
- account addresses, secrets, stream keys
- claim secret or its full stored hash
- admin email
- spreadsheet id if there is no reason to publish it

The safest implementation is an explicit **allowlist serializer** that constructs the public JSON
object field-by-field. Never take a Sheet row object and “remove a few private keys.”

Add a test that known private columns cannot appear in the public payload.

## 3. Public and private descriptions

Real work sometimes needs private context.

Tasks should therefore have separate fields such as:

- `public_title`
- `public_description`
- `public_location`
- `private_context`
- `source_type`
- `source_ref` (private)

If a gig is public, its public name/date may be used.

If a gig is sensitive/unreleased, author a generic public-safe task, e.g.
“Salmon recording — data transfer,” while retaining the real internal reference privately.

A task that cannot be described safely enough for an unauthenticated worker-facing app should not
be exposed through Sushi yet.

## 4. Suggested Sheet tabs

The exact column ordering may evolve, but keep these conceptual tables separate.

### `Templates`

Recurring task definitions.

Suggested fields:

- `template_id`
- `active`
- `public_title`
- `public_description`
- `public_location`
- `category`
- `effort_size`
- `estimated_minutes`
- `urgency_default`
- `before_you_take`
- `definition_of_done`
- `note_mode` — none/optional/required
- `verification_mode` — self/admin
- `recurrence_kind` — weekly/monthly/manual initially
- `recurrence_value` — day-of-week/day-of-month/etc. as defined by implementation
- `source_type`
- `private_context`
- `private_source_ref`
- `created_at`
- `updated_at`

### `Tasks`

Concrete task instances and current state.

Suggested fields:

- `task_id`
- `template_id` optional
- `active`
- public fields copied/materialized from template
- `status`
- `due_at` / public-safe due information
- `created_at`
- `updated_at`
- `claimed_at`
- `completed_at`
- `claim_id` — random UUID, safe to expose
- `claim_secret_hash` — PRIVATE
- `actor_name` — PRIVATE
- `actor_mode` — PRIVATE
- `help_note` — PRIVATE
- `completion_note` — PRIVATE
- `private_context`
- `private_source_ref`
- `verified_at`
- `verified_by`

Avoid formulas as core application logic if Apps Script can keep state clearer and auditable.

### `Events`

Append-only audit/work log. This is the long-term data Adam will later use to reason about
participation/work without making Sushi itself a grading or payroll system.

Suggested fields:

- `event_id`
- `request_id`
- `timestamp`
- `task_id`
- `template_id`
- `event_type`
- `old_status`
- `new_status`
- `actor_name`
- `actor_mode`
- `claim_id`
- `note`
- `metadata_json` only if genuinely useful

Events to log include task creation, claim, release, help request, completion submission,
self-completion, admin verification, admin clear/reopen.

Never rewrite history to “clean it up.” Correct current state separately.

### `Config`

Non-secret operational settings can live here if useful.

**Secrets/config with security value belong in Apps Script Properties**, not a public repo and
preferably not a generally browsed sheet:

- admin email
- optional future kitchen/access code
- deployment-specific values

A `People` tab is not required for v1. Avoid building a roster just to build one.

## 5. Claim ownership without real authentication

The app intentionally does not authenticate students. Still, avoid letting any random browser
finish a task just because it knows the task id.

Recommended pattern:

When claiming, the browser generates:

- `claim_id`: random UUID; safe to appear in the public task payload
- `claim_secret`: high-entropy random secret; stored only in that browser's localStorage and sent
  to the backend for mutation authorization

The backend stores only a hash of `claim_secret`.

The public task list may expose `claim_id` but never the secret/hash.

“My Table” is determined by matching the browser's locally stored claim ids to the public claim ids.
Thus the public feed never needs to expose “Jane claimed this.”

Subsequent claimant actions — release, help, complete — require the matching claim secret.

This is still not identity authentication: a person can type someone else's name when claiming. It
is simply a good low-friction ownership mechanism that prevents casual cross-device mutation.

If localStorage is lost, Adam can clear/reopen the task from the Sheet.

## 6. Concurrency

Claim operations must be atomic.

Use Apps Script `LockService` (or an equally robust Sheets-safe locking pattern) around state
mutations.

For a claim:

1. acquire lock
2. read current task state
3. require `available`
4. write claim data and `claimed` state
5. append event
6. release lock

If another claim wins first, the loser must see a conflict after refresh/poll; never silently
overwrite.

Use the same guarded state transitions for release/help/complete/admin operations.

## 7. Idempotency

Every mutation should include a client-generated `request_id` UUID.

Before applying a mutation, the backend can check recent Events for that request id (or another
small dedupe store) and avoid double-applying repeated submits.

This matters on phones with retries/double taps/network uncertainty.

Buttons should also disable while an action is in flight.

## 8. API shape

Exact transport may change after browser testing, but preserve this semantic contract.

### Public read

`listTasks`

Returns only public-safe fields plus lightweight server metadata such as current timestamp/version.

Never returns:

- names
- notes
- private refs
- secret hashes

### Mutations

At minimum:

- `claimTask`
- `releaseTask`
- `requestHelp`
- `completeTask`

Inputs include:

- task id
- request id
- claim id where relevant
- claim secret where relevant
- actor name/mode for initial claim
- note only where relevant

Server validates:

- required fields
- lengths
- legal state transition
- claim-secret ownership
- task availability
- note requirement
- allowed enum values

Treat all text as plain text. Never render user notes as HTML.

### Admin mutations

Admin need not use a public API in v1. Prefer Sheet-side helpers/custom menu for:

- verify submitted task
- clear/reopen claim
- disable task
- materialize/rebuild recurring tasks if needed

## 9. Apps Script / GitHub Pages cross-origin transport

**Prototype this early. Do not assume cross-origin behavior.**

The frontend must remain on GitHub Pages. Apps Script Web Apps can have redirect/CORS quirks,
especially for POST.

A robust low-dependency strategy is acceptable, including:

- public read via JSONP if ordinary `fetch` to Apps Script is unreliable
- mutations via a simple cross-origin form/POST or `fetch(..., {mode:'no-cors'})`
- client-generated claim id/secret so the POST does not need to return a secret
- poll/re-read afterward to confirm the state actually changed

Do not tell the UI “success” merely because a no-CORS POST was sent. Confirm via the next public
read and show a failure/conflict if state does not match.

If ordinary JSON fetch works reliably in real GitHub Pages/browser testing, use it; keep the code
simpler. The requirement is reliability, not a particular transport fashion.

Do **not** solve CORS by moving the whole UI into Apps Script; the user explicitly wants Sushi as
part of the MUS 248 GitHub Pages site.

## 10. State transition rules

Allowed baseline transitions:

```
available -> claimed
claimed -> available             # claimant release or admin clear
claimed -> help_requested
help_requested -> claimed        # worker resumes / clears help if implemented
help_requested -> available      # release/admin clear
claimed -> completed             # self-verified task
claimed -> submitted             # admin-verification task
help_requested -> completed      # if allowed by UI after issue resolved
help_requested -> submitted
submitted -> completed           # Adam verifies
submitted -> claimed             # Adam sends back / asks for correction, optional
completed -> available           # only explicit admin reopen/new instance logic
```

Do not let the client directly request arbitrary status strings.

## 11. Recurrence

Support weekly/monthly templates without making recurrence its own platform.

A simple approach:

- each template has recurrence settings
- `ensureRecurringTasks()` calculates whether an instance should exist for the current recurrence
  window
- call it during public list generation or via a simple trigger
- create at most one instance per template+window using a deterministic recurrence key

Deterministic keys prevent duplicate weekly tasks.

Manual/as-needed tasks are inserted directly in `Tasks`.

Future recurrence/trigger types can include:

- interval
- semester week
- gig-driven
- after-gig cleanup

Do not build those future integrations until there is a real source to integrate.

## 12. Admin Sheet usability

The Sheet is an actual product surface for Adam, not merely storage.

Make it readable:

- frozen header rows
- useful column order
- validation dropdowns for enums
- filters
- conditional formatting for urgent/help/submitted states if easy
- avoid burying the five columns Adam edits most often among twenty internal columns

If the setup script can initialize formatting/validation safely, do it.

A custom **Sushi Admin** menu is encouraged if it meaningfully reduces error-prone manual edits.

## 13. “Add sushi for ___” maintenance goal

A future Sonnet session should be able to respond intelligently when Adam says something like:

> add sushi for clearing the Salmon SD cards after this weekend

The documented workflow should make clear whether that means:

- add a one-off Tasks row
- add/edit a recurring Template
- modify task instructions
- eventually call a gig-driven task-generation helper

Do not require editing five files just to add operational work. Content should primarily live in
the Sheet once the backend is live.

Git is for app/backend code and generic documentation; the private Sheet is for live task data.

## 14. Setup / deployment goals

Backend source must be kept in the repo for maintainability, but **never commit real secrets or
private data**.

Provide a backend README with exact setup steps such as:

1. create a Google Sheet
2. open/create Apps Script project
3. copy/deploy repository `Code.gs` (or use clasp only if deliberately configured)
4. run a setup function to create/format tabs
5. set Script Properties for private settings
6. deploy as web app with the minimum access needed for the no-login design
7. put only the public-safe deployment URL into the frontend config
8. test from the real GitHub Pages origin

Be explicit about which Google permission prompts Adam should expect.

Git should remain the source of truth for Apps Script **code**. The Sheet is source of truth for
live operational data.

## 15. Privacy review before live use

Before switching from mock data:

- inspect the complete public list response in DevTools
- verify no worker names
- verify no completion/help notes
- verify no private source refs
- verify no Drive links/private contacts
- verify no access codes
- search repo for any accidentally committed real student name or secret
- intentionally create a sensitive/private-context task and confirm only its public fields appear
- confirm another browser cannot finish a claim without the claim secret
- confirm another browser never learns the claimant name

Remember: hiding text in CSS/DOM is not privacy. If it reaches the browser, it is public.

## 16. Abuse / risk posture

Because there is no login, a determined person who discovers the endpoint can still:

- create bogus claims under a fake name
- spam requests
- attempt malformed input

Mitigate cheaply:

- validate all inputs
- length-limit notes/names
- lock state changes
- use request ids
- log mutations
- optionally throttle obvious rapid repetition
- make admin recovery easy

Do not pretend this equals authentication.

If abuse ever becomes a real issue, the next step can be a lightweight saved “kitchen code” or
actual Chapman identity. Do not add that friction preemptively unless needed.

Most importantly: because Sushi is **not** the official grade or payroll system, the consequences of
soft identity remain bounded.

## 17. Photos

Do not implement anonymous Drive/photo uploads in the first backend.

Prepare the data model for a future evidence reference, but leave it unused. If photo evidence
becomes important, design the permission/retention model deliberately rather than bolting an open
upload endpoint onto the app.

## 18. Help notifications

Optional but useful v1 enhancement:

If `ADMIN_EMAIL` is present in private Apps Script Properties, a new help request may send Adam a
concise email containing the private task/claim context and note.

Requirements:

- do not put the email address in Git
- avoid duplicate emails for retried request ids
- respect Apps Script quotas
- failure to send an email must not corrupt task state

The Sheet remains the authoritative record.

## 19. Data retention

Do not delete Events when Tasks are completed.

Completed task instances can eventually be archived/hidden from the active Sheet view, but the
event history is valuable for later questions such as:

- what maintenance actually happened this semester?
- who worked on post production?
- how much work tended to occur around heavy concert weeks?
- what tasks repeatedly needed help?

No automatic grading or wage calculation should be inferred from these logs.

## 20. Definition of backend success

The backend is successful when:

- two phones cannot both claim the same sushi
- one phone cannot casually finish the other's claim
- the public feed contains no PII/private operational context
- Adam can recover a stuck task from the Sheet
- recurring and one-off tasks coexist
- completion/history data is retained
- the system remains understandable enough for Sonnet to maintain after the Opus build
