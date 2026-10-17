# 🍣 Sushi: maintainer's guide

`/sushi/` is the studio's work-ticket system: maintenance, data management, post-production, and
eventually gig work, shown as plates on a conveyor belt. Students and student employees take a
plate, do it, and mark it done. Adam runs it from a Google Sheet.

Sushi **records** work. It doesn't decide grades (Canvas does) or pay (payroll does), and the
typed name isn't a login.

Specs this was built from: `content/instructor/sushi/SUSHI_BUILD_SPEC.md` and
`SUSHI_BACKEND_PRIVACY_SPEC.md`. Backend setup: [`backend/README.md`](backend/README.md).

## Files

```
sushi/
  index.html        the page shell (all URLs relative: works under /branch/<slug>/ previews)
  sushi.css         all styling; colour tokens at the top, light + dark
  sushi.js          page controller: rendering, the task sheet, button → client calls
  logic.js          pure display logic: plate vocabulary, sorting, filters, "which plates are mine"
  client.js         the protocol: claims in localStorage, mutations confirmed by reply or receipt
  api.js            live transport to Apps Script (fetch, falling back to JSONP / no-cors)
  mock.js           demo transport: runs backend/Code.gs in the browser over a fake Sheet
  fake-google.js    fake SpreadsheetApp / LockService / CacheService / … for the demo and tests
  demo-data.js      practice plates for the demo (fictional on purpose)
  config.js         PUBLIC config: the /exec URL, poll interval. Nothing secret, ever
  backend/Code.gs   the whole backend (Apps Script). Source of truth for backend code
  backend/appsscript.json   manifest: time zone, scopes, web-app defaults
  tests/run.mjs     backend + client + logic + repo-hygiene tests (node, no deps)
  tests/browser.mjs end-to-end in Chromium via Playwright (optional, local)
```

## How a request flows

```
phone ──GET ?action=list──▶ Code.gs doGet ─▶ upkeep (throttled) ─▶ publicFeed_ ─▶ publicTask_ (allowlist)
phone ──POST {action, request_id, task_id, claim_id, claim_secret, …}──▶ doPost
        └─ validate ─▶ lock ─▶ already applied? ─▶ rate limit ─▶ transition ─▶ write cells ─▶ Events row
           ─▶ unlock ─▶ receipt (cache) ─▶ optional email
phone ──GET ?action=receipt&request_id=…──▶ what happened, if the POST reply was unreadable
```

**Never trust a send.** `client.js` reports success only from a readable reply or a receipt.
Otherwise the result is `unconfirmed`, and the next read of the belt decides. A claim is stored
locally *before* it's sent, so if the reply is lost but the claim landed, the device still
recognises its plate. If it didn't land, the claim is quietly dropped after two minutes.

## States

| Canonical status | On screen (owner) | On screen (others) |
|---|---|---|
| `available` | On the belt | On the belt |
| `claimed` | At your table | Taken |
| `help_requested` | Chef called | Taken |
| `submitted` | Waiting for Adam | Being checked |
| `completed` | Cleared | Cleared |

Moves (`TRANSITIONS` in Code.gs; a client only ever names an *action*, never a status):

```
claim     available → claimed
release   claimed | help_requested → available        (claimant: Put It Back)
help      claimed | help_requested → help_requested    (Call the Chef; plate stays theirs)
resume    help_requested → claimed                     (I'm unstuck)
complete  claimed | help_requested → completed (verification self) | submitted (verification admin)
— Sheet only (Sushi Admin menu → adminAction_) —
verify    submitted → completed
send_back submitted → claimed
clear     claimed | help_requested | submitted → available   (claim wiped)
reopen    completed → available
disable / enable    active = no / yes
```

Claims never expire on their own. Only the claimant or Adam ends one.

## Ownership without login

On claim the browser makes a random `claim_id` (public) and `claim_secret` (never leaves that
browser except to the backend). The Sheet stores `sha256('sushi-claim:' + claim_id + ':' + secret)`.
Every later action must present both. "My Table" means "tasks whose public `claim_id` matches one
this browser stored". The feed never says who holds a plate.

localStorage keys: `sushi.profile` (name + work mode, shared), and per mode (`live` / `demo`):
`sushi.<mode>.claims`, `.history`, `.cache` (last good feed, for the offline view). Plus
`sushi.filters`, `sushi.welcomeDismissed`, and `sushi.demo.kitchen` (the demo's fake Sheet).

## Which fields are public

**Only what `publicTask_` in Code.gs writes out.** It builds the object field by field; it never
copies a row. Public: id, title, description, location, category, effort, minutes, urgency, due,
before-you-take, definition of done, note/verification mode, event label, recurring flag,
status, claim_id, completed_at. Everything else (names, modes, notes, private context, source
refs, the secret hash, verifier) stays in the Sheet.

In the Sheet, **green headers are public, red are private.** Adam's rule of thumb: if it can't
be said to the whole internet, it goes in `private_context`.

To publish a new field: add it to `publicTask_` *and* `PUBLIC_TASK_KEYS`, render it in
`sushi.js`, and extend the privacy test in `tests/run.mjs`. Think hard first: once it's in the
feed it's public, and hiding it with CSS changes nothing.

## "Add sushi for ___": which edit is it?

Live task content lives **in the Sheet**, not in git. A request like *"add sushi for clearing the
Salmon SD cards after this weekend"* is a Sheet edit that Adam makes (or asks for):

| The work is… | Do this |
|---|---|
| a one-off job | **Tasks** tab: new row with `public_title` and the green columns; leave `task_id` blank. |
| the same job every week / month | **Templates** tab: one row, `recurrence_kind` weekly (value Mon…Sun) or monthly (value 1–28). |
| a standard job done on demand (e.g. extra SD clears before busy gigs) | **Templates** row with `recurrence_kind` manual, then select it → **Sushi Admin → Make a task from selected template**. |
| linked to a gig that isn't public yet | Generic public title ("Salmon recording: data transfer"), real details in `private_context` / `private_source_ref`, `source_type` gig. |
| a change to how a job is described | Edit that row's public columns. Template edits affect future tasks only. |

Only touch git for **code**: a new behaviour, a new field, a new category emoji.

**Adding a category / task family:** add it to `CATEGORIES` in Code.gs (Sheet dropdown) and give it
a piece in `CATEGORY_PIECE` in `logic.js`. An unknown category still works (🍣, and the dropdown
just warns), so this is cosmetic, not a breaking change. New families must not add public fields
without the privacy steps above.

**Future gig-driven tasks:** call `taskFromTemplate_` (or `appendObject_` on Tasks) from a new
function with `source_type: 'gig'` and the gig's id in `private_source_ref`, and give it a
deterministic `recurrence_key` (e.g. `gigId@task-kind`) so it can't be made twice. Don't build this
until a real gig source exists.

## Diagnosing a stuck plate

1. Find the row in **Tasks** (filter by title). `status`, `actor_name`, `claimed_at` say who and when.
2. **Events** (filter by `task_id`) is the full history: every claim, help, release, submit, verify.
3. Abandoned or the student lost their browser data? Select the row → **Sushi Admin → Clear
   selected claim**. Their phone shows "no longer on your table" on its next read.
4. Waiting forever? It's `submitted`: **Verify selected task**, or **Send back** if it needs redoing.
5. Never edit Events, and never type a status by hand. The menu actions keep the log and the
   claim fields consistent.

## Testing

```bash
node sushi/tests/run.mjs        # always: backend, privacy, client, logic, hygiene (CI runs this)
node sushi/tests/browser.mjs    # after UI changes: the demo end to end in Chromium
```

Plus the repo's usual two (`node tools/check-worksheets.mjs`, `cd quiz && npm test`).

Try it by hand at `/sushi/?demo=1`. The demo is the real `Code.gs` on a fake Sheet in your
browser. **Demo tools** can make someone else take a plate, make Adam verify or clear, drop a
request, lose a reply, or cut the connection. `window.sushiDemo` is available in the console,
in demo mode only.

## Deliberately not built (v1)

Photo uploads (`evidence_ref` column reserved, unused), Canvas or payroll sync, SSO, rosters,
leaderboards / points / streaks, push notifications, a gig database, an offline mutation queue,
and a public admin page. The Sheet *is* the admin page; a hidden web admin without real auth
would be theatre.
