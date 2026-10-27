# Quiz handoff: the Oct 26 quiz (and catching up on Oct 19)

> ✅ **Done, then changed (Oct 26).** The quiz session built Quiz 5 (the Oct 19 quiz, take-home) and
> Quiz 6 (Vibecoding 2). Then Vibecoding 2 moved to Nov 2, and Quiz 6 with it. Kept for the record;
> the current state is `quiz/data/curriculum.json` and `/quiz/overview/`.

For the separate session that builds this week's quiz. Written Oct 22 from the lecture-planning
session. Public repo: no access codes here; the instructor picks the new one.

## Read first

- `CLAUDE.md` → **Quiz**, and the **weekly rhythm** paragraph under Lectures
- `content/LECTURE_GUIDE.md` → **The weekly rhythm** (the full table)
- `quiz/README.md` → **Weekly update (data only, no code)**
- **Sync the editor before touching `questions.json` or `curriculum.json`.** The instructor edits
  questions and skill statuses in a content-editor artifact; `node tools/editor-sync.mjs` (its
  header says how) brings those edits in. Editing the files first means the next sync reports
  CONFLICTs.

## The rhythm this quiz follows

Lecture X on Monday A → X's material is **Practice** on that day's quiz → **Core** the next Monday.
The quiz is meant to run in class; if it doesn't fit, it's take-home, due the Sunday before the
next Monday. Only **verified** questions on **Core** skills are graded.

## Where things stand (checked Oct 22)

- `quiz_number` is **4** (Oct 12, The Big Picture). **There was no quiz on Oct 19**, so Vibecoding 1
  (lecture 08) has never been in the quiz.
- **No skill statuses have changed since Quiz 4.** 27 skills are Core and 71 are Practice.
- **Vibecoding 1 and Vibecoding 2 have no quiz skills or questions yet.**

## Decisions for the instructor

1. **Numbering:** is Oct 26 **Quiz 5**? (No Oct 19 quiz exists to number.)
2. **Vibecoding 1 (Oct 19):** by the rhythm it would be Core on Oct 26, but it was never
   Practice. Recommended: **Practice on Oct 26, alongside Vibecoding 2**, and Core on Nov 2.
3. **Vibecoding 2 (Oct 26):** Practice on Oct 26. Its questions are written from the lecture
   **outline**, before the instructor's final text. That's fine for a Practice week (Practice is full
   credit for answering), but **review them before they go Core on Nov 2**.
4. **The promotion backlog** (the report below): which of lectures 1–7's Practice skills go Core now?
5. **Access code, `expected_minutes`, `window_minutes`** for the new entry in `quizzes`.

## New skills to create

Suggested ids; the instructor may rename them. Question sources are in the lecture Markdown.

**Vibecoding 1** (`content/lectures/2026-10-19-vibecoding-1.md`): repo · commit · fork · pull request ·
Markdown basics · frontier model · context window · thinking effort / usage · AI ethics (bias,
environmental cost, honesty and privacy) · prompting (one specific change per prompt). Good
sources: the lecture's 28 refresher questions (same ideas, **reworded**: students do that refresher
the same week) and the 14 paraphrased MC questions in `content/instructor/vibecoding-series.md`
("Stage 3 draft").

**Vibecoding 2** (`content/lectures/2026-10-26-vibecoding-2.md`): GitHub Pages · the
`mus248-sandbox` site · Markdown vs. HTML (a link written both ways) · README vs. `index.html` · fork,
branch, pull request · privacy on a public site.

Add each new id to `new_skills` in the quiz's entry, so fresh questions on them are served first.

## One-time report: Practice skills past their promotion week

By the rhythm, everything taught in lectures 1–7 (Aug 24–Oct 12) should be Core by Oct 26. **The
lecture each skill came from is a best guess from topic names: confirm before promoting.** The
number is verified questions / all questions. **Promoting a skill with 0 verified adds nothing to the
graded set**: verify questions first.

| Probably from | Practice skills with verified questions | Practice skills with **0** verified |
|---|---|---|
| L1 Aug 24 (first class) | `skill_areas` 2/2 | |
| L2 Aug 31 (live sound basics) | `feedback` 3/3, `live_signal_flow` 2/2 | `cable_ends` 0/5 |
| L3 Sep 14 (data management + Dante) | `two_destinations` 5/5, `dante_stereo_routing` 4/4, `dante_multi_output` 3/4, `dante_channel_planning` 6/6, `dante_signal_flow` 2/3 | `gig_folders` 0/3, `rse_stages` 0/4, `triple_check` 0/4, `empty_trash` 0/3, `dante_audio_over_ip` 0/5, `dante_daw_io` 0/5, `dante_troubleshooting` 0/3 |
| L4 Sep 21 (electricity, F8, Final Cut) | `ac_dc` 4/4, `ac_cable_safety` 2/4, `power_adapters` 6/7 | `f8_basics` 0/3, `f8_workflow` 0/4, `f8_dual_channel` 0/6, `record_verify` 0/2, `fcp_areas` 0/3, `fcp_workflow` 0/3, `fcp_settings` 0/4, `fcp_nondestructive` 0/4 |
| L5 Sep 28 (Live Sound 1) | `connector_signal` 3/4 | `signal_levels` 0/5, `preamp_power_amp` 0/7, `mixer_orientation` 0/4 |
| L6 Oct 5 (Live Sound 2) | `aux_sends` 4/8, `buses` 3/3, `outputs_routing` 1/1, `sends_on_fader` 1/2 | `pre_post_fader` 0/9, `pfl_solo` 0/5, `mix_destinations` 0/9 |
| L7 Oct 12 (Big Picture; Quiz 4's `new_skills`, so this row is certain) | | `gig_families` 0/7, `gig_workflow` 0/6, `musco_crew` 0/3, `musco_recording` 0/8, `sgk_kit` 0/4, `sgk_audio` 0/4, `sgk_cameras` 0/4, `capture_types` 0/4, `salmon_livestream` 0/2 |
| Activities, not a lecture (check) | `looper_signal_flow` 4/4, `looper_power` 1/1, `wireless_setup` 1/1, `ab` 2/2, `ortf` 2/2, `matched_gain` 2/3, `lr_panning` 2/2, `white_balance_kelvin` 3/3, `frame_rate` 2/2, `framing` 1/1 | `xy` 0/3, `stops` 0/7, `depth_of_field` 0/4, `house_default` 0/3, `camera_test_clip` 0/4, `nd_filters` 0/5, `focal_length` 0/4, `focus_distance` 0/3, `video_connectors` 0/3, `salmon_pre_gig` 0/3, `salmon_audio_setup` 0/4, `salmon_recording` 0/5, `salmon_etiquette` 0/3, `salmon_data_pass` 0/5 |

`coming_to_core` (what students are told is next) currently lists `two_destinations`,
`triple_check`, `signal_levels`, `preamp_power_amp`, `power_adapters`, `f8_workflow`. Update it to
match whatever's actually promoted next.

## Fall 2026 quizzes left

One per Monday: **Oct 26, Nov 2, Nov 9, Nov 16, Nov 30**, and possibly Dec 7 (the finals-week
meeting: instructor to decide). No class Nov 23.

## Care

This is a live teaching week, so slow down. Before committing:

- **Run the tests:** `cd quiz && npm test`
- **Rehearse:** run the quiz with `?debug=1&window=0.5&expected=0.2`
- **Keep old codes working:** last week's code must still paste into this week's quiz (the
  state-code test covers it)
- **Bonus can only help:** a bonus question must never lower a score
