# Sushi backend: setup and deploy

The backend is one Apps Script file, `Code.gs`, bound to one Google Sheet. **Git is the source of
truth for the code. The Sheet is the source of truth for live tasks.** Nothing private goes in
this repo: the Sheet's link, Adam's email, and names stay in Google.

Time needed: about 15 minutes, once.

## Before you start

- Use a Google account that is allowed to publish a web app to **"Anyone"** (no sign-in). Some
  Google Workspace domains (possibly Chapman's) switch that option off. If the deploy dialog
  doesn't offer "Anyone", use a personal Google account for the Sheet instead. This is a real
  open question; see *Open items* below.
- The Sheet holds names and notes. Don't share it beyond the people who should see those.

## 1. Make the Sheet and paste the code

1. Create a new Google Sheet. Name it something like **Sushi kitchen**.
2. **Extensions → Apps Script.** A script project opens, already bound to this Sheet.
3. Delete the starter `myFunction` code. Paste the **whole** of `sushi/backend/Code.gs`.
4. **Project Settings** (gear icon) → tick **Show "appsscript.json" manifest file in editor**.
   Back in the editor, open `appsscript.json` and replace it with `sushi/backend/appsscript.json`.
5. Save (⌘S / Ctrl+S).

## 2. Run the setup

1. In the editor's function menu choose **`setupSushi`**, then **Run**.
2. Google asks for permission. Expect these (from `appsscript.json`):
   - **See, edit, create, and delete all your Google Sheets spreadsheets.** Reads and writes the
     task Sheet. (Google offers no narrower scope that also covers the fallback in `book_()`.)
   - **Send email as you.** Only used for help-request emails, and only if you set `ADMIN_EMAIL`.
   - **Allow this application to run when you are not present.** Only used if you install the
     hourly upkeep trigger.
   - **Display and run third-party web content in prompts and sidebars.** The Sushi Admin menu
     and its dialogs.

   Google may first say *"Google hasn't verified this app."* That's normal for your own script:
   **Advanced → Go to (project name) (unsafe)**.
3. Back in the Sheet you now have tabs **Start here, Tasks, Templates, Events, Config**, and
   (after reloading the Sheet) a **Sushi Admin** menu. Two example rows are present with
   `active = no`. Delete them or switch them on.

## 3. Private settings (Script Properties)

**Project Settings → Script Properties → Add script property:**

| Property | Value | Needed? |
|---|---|---|
| `ADMIN_EMAIL` | the address that should get "Call the Chef" emails | optional |
| `NOTIFY_SUBMITTED` | `true` to also email when a plate is waiting for verification | optional |
| `SPREADSHEET_ID` | written automatically by `setupSushi` | don't edit |

Test it from the Sheet: **Sushi Admin → Send a test notification email.**

## 4. Deploy the web app

1. In the editor: **Deploy → New deployment → ⚙ → Web app.**
2. **Execute as: Me.** **Who has access: Anyone.** (Not "Anyone with Google account": that
   forces a sign-in that GitHub Pages can't do.)
3. **Deploy.** Copy the **Web app URL**. It ends in `/exec`.
4. Open that URL in a private window. You should see JSON starting `{"ok":true,"api":1,…`. If you
   see a Google sign-in page instead, the access setting is wrong.

## 5. Connect the site

1. Put the URL in `sushi/config.js` as `apiUrl` (the only config change). The URL is public by
   design: anyone who opens `/sushi/` can see it, and that's fine. It isn't a secret.
2. Run `node sushi/tests/run.mjs`. It checks that the URL is well formed and nothing private
   slipped into the folder.
3. Commit and push as usual. `/sushi/` switches from "the kitchen opens soon" to the live belt.
   The demo stays available at `/sushi/?demo=1` for practice and testing.

## 6. Privacy review before students use it

Do this once, on the real GitHub Pages site (not a local copy):

- [ ] **Sushi Admin → Preview the public feed.** Read it all. This is everything the internet sees.
- [ ] Make a test task with something sensitive in `private_context` and an obviously fake name
      when you claim it. Open DevTools → Network on `/sushi/` and read the `list` response: no
      name, no notes, no private context.
- [ ] **Sushi Admin → Run privacy check.** It must pass.
- [ ] Claim a plate on your phone. On a laptop, confirm it shows only as "Taken", and that the
      laptop has no way to finish it.
- [ ] Watch the footer of `/sushi/`. If it says "reading via JSONP", plain `fetch` was blocked
      and the fallback is in use. Both are fine; it's worth knowing which one your setup uses.

## Changing the code later

1. Edit `sushi/backend/Code.gs` in the repo. Run `node sushi/tests/run.mjs`.
2. Paste the whole file into the Apps Script editor again and save.
3. **Deploy → Manage deployments → ✏ (edit) → Version: New version → Deploy.** Editing the
   existing deployment keeps the same `/exec` URL. A *new* deployment makes a new URL, which
   would then need to go into `config.js`.
4. If you added columns: **Sushi Admin → Set up / repair tabs.** It only adds; it never deletes,
   reorders, or touches data.

## Optional: hourly upkeep

New recurring tasks appear the first time anyone opens `/sushi/` in their window. For them to
appear on schedule even when nobody looks, use **Sushi Admin → Install hourly upkeep trigger**.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| `/sushi/` says "The kitchen sheet isn't set up yet" | A tab is missing or renamed. Run **Set up / repair tabs**. |
| `/sushi/` says "answered with a web page instead of data" | Deployment access isn't **Anyone**. |
| Every action says "Couldn't confirm" | The POST is reaching Google but the receipt isn't. Check **Executions** in the editor for errors; make sure you deployed a *new version* after pasting code. |
| A new task row never appears | Its `public_title` is empty, `active` is `no`, or upkeep hasn't run yet: **Sushi Admin → Fill in new rows + recurring tasks now**. |
| A student lost their phone/browser data mid-task | Their claim secret is gone. Select the row → **Clear selected claim**. They can re-take it. |
| Lots of bogus claims | Untick `kitchen_open` (set it to `no`) on **Config** to pause while you clean up; clear the rows; the Events tab shows what happened. |

## Open items: not yet verified against real Google

The code was built and tested against faithful fakes (`sushi/fake-google.js`), not a live Google
account. These need a first real run:

- [ ] Whether `fetch` from GitHub Pages can read Apps Script replies, or JSONP + receipts take over.
      The code handles both; the footer reports which one is in use.
- [ ] Whether Chapman's Workspace allows "Anyone" web-app access (see *Before you start*).
- [ ] `setupSushi`'s formatting calls (validation, colours, filter, Events protection) on a real
      Sheet. The fakes accept them without checking.
- [ ] That `SpreadsheetApp.getActiveSpreadsheet()` is non-null inside the web app (expected for a
      bound script; `book_()` falls back to `SPREADSHEET_ID` either way).
