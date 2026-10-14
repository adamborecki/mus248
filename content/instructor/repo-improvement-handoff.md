# Handoff — Documentation Builder MVP (pilot)

Built 2026-10-14 from the October 13 handoff. **Not merged to `main`**; it lives on
`claude/documentation-builder` for instructor review before release.

## 🔗 Preview

| What | URL |
|---|---|
| Activity | `https://adamborecki.github.io/mus248/branch/claude-documentation-builder/documentation-builder/` |
| Front page (type filter, pilot card) | `https://adamborecki.github.io/mus248/branch/claude-documentation-builder/` |
| Worksheet | `…/branch/claude-documentation-builder/documentation-builder/worksheet/` |
| All previews | `https://adamborecki.github.io/mus248/branch/` |

**⚠️ One manual step still recommended:** GitHub → mus248 → Settings → Pages → Source →
**GitHub Actions**. Observed on 2026-10-14: the new "Deploy site and branch previews" workflow
deployed successfully even with the old "Deploy from a branch" source still selected, so previews
publish now. But every push to `main` also runs the old branch build, and whichever finishes last
wins. Production content is the same either way (`main` at the root). Only `/branch/` can vanish
until the next preview push. Switching the source ends the race.

Every existing `claude/…` branch (about nine stale ones) also publishes a
preview. Delete merged branches to keep `/branch/` tidy. `claude/branch-previews` (PR #9) is
merged and can be deleted too. Deleting it from this session's git proxy failed.

## 📦 What changed

**New**
- `content/activities/documentation-builder.md`: the activity (source of truth)
- `documentation-builder/`: page, worksheet, and key routes; `toolkit.js`/`.css` (starter kit);
  `starter-menu.json`; `downloads/PROJECT_STARTER.md`, `ISSUE_REPORT.md`, `SUBMISSION_REPORT.md`
- `catalog.js`: labels for the new optional catalog fields
- `content/DOCUMENTATION_GUIDE.md`: types, settings, step style, evidence marks, review, cross-repo links
- `content/instructor/documentation-builder-canvas-draft.md`: **draft**, not published
- `content/instructor/weekly-report-transition.md`: proposal only, no requirement changed

**Changed**
- `data/activities.json`: new entry; `"type": "checklist"` on the three gig checklists;
  `"settings"` on those three plus the five starter-menu pages, mapped only from each page's own
  Access text; "Full gig (reference)" → "Full gig"
- `app.js`, `index.html`, `styles.css`: type filter, type and settings chips, pilot card
- `activity.js`, `activity.css`: type and settings in the page header; an `activity:rendered` event
- `markdown.js`: relative links resolve like images (no existing page had one)
- `tools/check-worksheets.mjs`: focused checks for the above
- Salmon / Musco / Standard Gear Kit checklists: "reference" → "checklist" in `estimatedTime`;
  Salmon's preamp contradiction recorded under Technical verification. `revised` bumped on all three.

**Untouched:** quiz, study cards, all URLs, worksheet generator logic, semester/Canvas
discussion data, existing weekly report requirements.

## ✅ Tests run

- `node tools/check-worksheets.mjs`: passes (18 worksheets). The new checks fail when they
  should: tested by renaming a starter-menu heading and misspelling a type.
- `cd quiz && npm test`: passes.
- `node tools/check-quiz-activity-links.mjs`: reports `documentation-builder` with no quiz gate.
  That's on purpose; no quiz change during a teaching week.
- Headless Chromium (desktop 1200 px, phone 375 px), at the site root **and** under a locally
  built `/mus248/branch/claude-documentation-builder/`: hub filters, chips, activity page, all
  three download kinds (bundle, starter-only, templates; saved files are valid UTF-8), copy to
  clipboard, show-text fallback, arrow-key selection in the menu, no horizontal scroll on phone,
  worksheet and key render, existing pages (stereo, daw, salmon checklist, worksheets, quiz,
  study) load with no console errors.
- **Not tested:** real iOS/Android download behavior; PantherAI itself; whether the preview URL is
  reachable (this session can't load github.io; the Actions deploy itself reported success).

## 🧑‍🏫 Instructor decisions still open

1. **Salmon preamps:** "do not adjust" vs. "PFL to check/adjust F8 gain." Which governs?
2. **Canvas:** release date, due date (~2 weeks after release), points, submission type, group
   submission mechanics (shared document submitted once or by everyone).
3. **Early-pilot credit:** eligible work, amount/cap, make-up equivalencies, how to request it.
4. **Starter menu:** the seven suggestions were picked by AI from existing sections; keep, cut, or
   replace. camera-lab and mixer-lab are left out on purpose (separate Canvas assignments).
5. **Settings mapping:** "Confirm with instructor" shows wherever a page didn't say. In
   particular: can students use BH 208/209 cables (Cable Safari) or the gear kit outside class?
6. **Skill area:** the pilot has none in the skill filter. Add one, or leave it type-only?
7. **GitHub accounts:** still optional here. You mentioned possibly requiring them later.
8. **Weekly report transition:** adopt the proposed block, and when.

## 🧩 Known gaps (small, deliberate)

- The printed worksheet's QR code points to the **production** URL, which 404s until merged.
- Quiz and study apps don't isolate `localStorage` per preview (webapp-conventions
  `storageKey`), so a preview shares saved quiz state with production. Not touched during a
  teaching week.
- Settings exist on 9 of 21 catalog entries. The rest show no labels, exactly as before.
- No "reference" pages exist yet, so the type filter shows only Activities and Checklists.

## 🔁 Cross-repo follow-ups (not done here)

- **webapp-conventions:** promote `content/DOCUMENTATION_GUIDE.md` (types, evidence marks,
  contribution rules) once the pilot has been used; add a note that `build-pages.sh` previews
  stale branches until they're deleted.
- **salmon:** reconcile the upstairs reference (`tools/upstairs`, `content/upstairs.json`) with
  the course's Salmon pages using on-site evidence. Proposals about the diagram must name the
  `upstairs.json` entry.
- **camera-lab:** improvements aligned with the Big Picture lecture and actual class use. Needs
  its own spec.
- **mixer-lab:** reconcile README/handoff descriptions and preserve current report evidence.
  Needs its own spec. Not used as a Documentation Builder target, because it's a separate
  assignment.
- **musco:** `/musco` is planned. Nothing links to it yet. Add it to the starter menu once it's live.
- **mus248 later:** map settings for the remaining entries; migrate a first page to a separate
  reference (e.g. Salmon background out of a checklist); `storageKey` for quiz/study; final
  Canvas settings; the remaining live-sound lecture replacement.
