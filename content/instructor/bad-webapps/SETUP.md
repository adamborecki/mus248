# Bad Webapps: setup and merge control (instructor)

Everything in `repo/` is the starting content of the new repo, exactly as it should land. This
file is for you, and doesn't go in the new repo.

## The model: students fork, you merge

- Students are **not** members of anything. They **fork** the repo (their own copy), build in
  their fork, and open a **pull request**.
- Only people you give a role can merge. A fork can't merge itself into yours. That's the whole
  control mechanism, and it needs no settings.
- The rules below are a second lock, so even you and your delegate go through a pull request and
  nobody can force-push over history.

## 1. Create a free organization (5 minutes)

1. github.com → your avatar → **Your organizations** → **New organization** → **Free**.
2. Name it. It becomes the web address: `NAME.github.io/bad-webapps/`. Something not tied to one
   semester works best (e.g. `mus248-lab`, `borecki-studio`). *[Your choice; nothing below
   depends on it.]*
3. "This organization belongs to: **My personal account**."
4. Skip inviting members for now.

You're the **Owner**. Owners can do everything, including undoing anything.

## 2. Create the repo

1. In the org: **New repository** → name `bad-webapps` → **Public** → create it empty (no README).
2. Either upload the files from `repo/` (**Add file → Upload files**, drag the folder contents in,
   including `.github/`), or tell Claude "push the bad-webapps kit": it needs push access to the
   new repo, which you grant when it asks. (Finder hides `.github/`; press ⌘⇧. to see it. Letting
   Claude push avoids that.)
3. **Settings → Pages → Build and deployment → Source: Deploy from a branch → main → / (root) →
   Save.** A minute later it's live at `NAME.github.io/bad-webapps/`.

No GitHub Actions on purpose: "deploy from a branch" works the same way on every student's fork,
so they can test their app on their own fork's Pages before opening a pull request.

## 3. Lock `main` (the ruleset)

Repo → **Settings → Rules → Rulesets → New ruleset → New branch ruleset**:

- **Name:** protect main · **Enforcement status:** Active
- **Target branches:** Add target → **Include default branch**
- **Bypass list:** add **Organization admin** (that's you), so you can still fix things directly
  in an emergency
- Turn on:
  - **Restrict deletions**
  - **Block force pushes**
  - **Require a pull request before merging** → Required approvals: **1** → also tick
    **Require review from Code Owners**
- **Create**

`repo/.github/CODEOWNERS` names who counts as a Code Owner. It says `@adamborecki` now.

## 4. Delegating (optional, any time)

1. Org → **People → Invite member**: invite them by GitHub username.
2. Repo → **Settings → Collaborators and teams → Add people**, role **Maintain** (can merge pull
   requests and manage issues; can't change settings or delete the repo) or **Write** (can merge,
   fewer admin powers).
3. Add their username to `.github/CODEOWNERS` so their approval counts.

To take it back, remove them from the repo (or the org). Nothing they merged is lost; it's in the
history.

## 5. Each semester / class

- The repo keeps every app forever; that's the point. Nothing to reset.
- If it gets crowded, start a fresh folder per term (`apps/2027-spring/…`) and say so in
  `CONTRIBUTING.md`. Not needed yet.

## Reviewing a pull request (on your phone)

1. Open the pull request → **Files changed**: it should be one new folder under `apps/`, with an
   `index.html`.
2. Check: no real names, nothing creepy (mic/camera apps must not record or upload), no external
   scripts. The PR template asks the student to confirm all three.
3. Open their fork's Pages link from the PR description and try it.
4. **Review changes → Approve**, then **Merge pull request**.

If two students pick the same folder name, the second pull request will say there's a conflict.
Ask them to rename their folder.

## Things to check before Oct 19

- [ ] Prompt budget for the "Bad webapps: the rules" slide
- [ ] Org name, then put the repo link on Canvas
- [ ] Does PantherAI (LibreChat) preview HTML in the chat (an "artifact" panel)? If so, students
  can see their app before committing, and the CONTRIBUTING steps can mention it
- [ ] Does Chapman's PantherAI show a thinking/effort setting under the gear?
