# Vibecoding series: instructor notes

Running notes for Vibecoding 1–3. Shown to you (not students) via the lecture pages' instructor
view; this file is public in the repo like everything else, so nothing private goes here.

## ✅ To do (from the Oct 20 planning conversation)

**Before Vibecoding 2 (Mon Oct 26).** The order matters: each one feeds the next.

1. **Performance Evaluation session** (separate conversation): finalize the midterm/final skills
   list. It's the basis of WTF 248, and VC2 section 4 discusses it (~10 minutes; placeholder now).
2. **UI pass on MUS 248** (activity and checklist display, a breadcrumb), so WTF 248 starts from
   the newest version.
3. **Create the GitHub org** (5 minutes: `content/instructor/bad-webapps/SETUP.md`, step 1).
4. **Make WTF 248:** copy MUS 248, strip it down to the performance-eval skills, water it down, and
   plant obviously absurd checklist steps ("4.3 Start a small fire on stage for ambiance.
   (Obviously don't. This is a test.)"). Put its link in VC2 slide 3.1. *Pencilled in, confirm
   later:* branch previews like MUS 248's (copy the Pages workflow; each fork has to turn on
   Actions), so a student sees their fix live before the pull request.
5. **Build the Gear Dating Profile generator**, in its own repo (not this one): a form with pickers
   and a live preview, saved in localStorage, ending in **Copy HTML** with a text area. About 20
   gear photos, one profile per student. Manufacturer press/media kits are the safest source,
   manufacturer product pages are close behind, and retailer photos (Sweetwater, Amazon) should be
   skipped. Keep a credits file with each photo's source URL. Put its link in VC2 slide 1.5.
6. **Stock bad webapp** for anyone who missed class. Put its link in VC2 slide 1.1.
7. **Write VC2 in your voice.** It's an outline now: bullet fragments for what to say, with the
   reference steps and tables close to final. Use presenter view (Shift+E) or instructor view's
   ✏️ Edit on GitHub.
8. **Rehearse:** a timed read-through in presenter view (`?presenter=1`), plus the new-repository
   and fork → branch → pull request clicks on GitHub (labels move).
9. **Print the follow-along notes** 30–60 minutes before class, after the last edit.

**After your pass on VC2:** ask Claude for its refresher questions, written from your final text
(the refresher opens Nov 2).

**After class:** open presenter view → 📤 Changes, send it to yourself, and fold the edits into
the lecture Markdown (or ask Claude to). Then Clear all.

**Later:**

- Anyone who didn't build a bad webapp with a group: that's homework.
- **Mixer Lab:** a more realistic interface, the bugs students hit, and showing how it carries over
  to real mixers. Top priority among the live sound items.
- **Live Sound 3 and 4:** adapt, don't scrap. Look back at past semesters' live sound slides for
  what's worth saving.
- Sushi and the real Repo Improvement round come after WTF 248.

## 🔁 Reminders (from your notes, Oct 16)

- **Live Sound 3 moved** to the week after Vibecoding 1, then moved again (Oct 20): it's on the
  back burner, to be adapted rather than scrapped.
- **No due dates in the web app.** Dates live in Canvas only.
- **Next week:** gather feedback on the PowerPoint → GitHub conversion process (how the lecture
  decks got onto the site). Part of how the class is structured; worth a few minutes.
- **Repo Improvement:** real round in about two weeks. Early volunteers are already doing the
  talk-it-out route. One student may already be doing Repo Improvement; check in.
- **Homework idea for the first Repo Improvement round:** past lectures have no worksheets (only
  future ones generate them). Adding questions to a past lecture's Markdown is a good small,
  real contribution: the worksheet and online fill-in appear automatically.
- **Offline model?** Could Ollama be installed on the lab computers by Vibecoding 3? Free,
  private, smaller. Find out what IT allows.
- **PantherAI** runs on LibreChat, currently with Claude Sonnet 5 as the highest Sonnet. Check the
  ⚙️ gear for a thinking/effort setting and whether chats preview HTML.

## 🗺️ The series

| | Vibecoding 1 (Oct 19) | Vibecoding 2: Going Live (Oct 26) | Vibecoding 3 (drafted, not scheduled) |
|---|---|---|---|
| Tools | Browser only: GitHub web + PantherAI | Browser only, **no AI**: GitHub web + GitHub Pages | Terminal, git CLI, a coding agent |
| Practice | Bad webapps in the Playground | `mus248-sandbox` site (4 files) + a pull request on WTF 248 | Real Repo Improvement on mus248 |
| Concepts | Frontier, model size, context window, thinking effort, usage | Pages, Markdown vs. HTML, README vs. `index.html`, fork → pull request | Agents, `CLAUDE.md`, queues and steering, agent usage |

**Portals (🌀) in VC1 → where they lead:**

| VC1 slide | Portal | Leads to |
|---|---|---|
| 1. The words you need | The history from the terminal | VC3 · 2. Git from the terminal |
| 3. Same recipe, starting now | Queues and steering | VC3 · 3. Queues and steering |
| 5. Your choice | AI on your own computer (offline models) | VC3 (if the lab gets Ollama) |
| 6. Effort and usage | The settings gear; agents use far more | VC3 · 3. Agents and usage |
| 8. Make every prompt count | From playground to repo (fork + pull request) | VC2 · 1. Your own website, and 3. Fix WTF 248 |

VC2 (Oct 26) took over the old draft's "Your own repo" section; the rest of that draft (terminal,
git CLI, coding agents) is now `content/lectures/vibecoding-3.md`.

**Open: the feedback route.** How do students hand in bad webapps and give feedback? Options:
a share link (from `/playground/`) posted to a Canvas discussion or assignment; GitHub Issues on
the bad-webapps repo; or a pull request. VC1's activity slide has a 🧑‍🏫 note to fill in.

### Vibecoding 3: what's drafted, and ideas beyond it

Drafted in `vibecoding-3.md`: the terminal, git from the terminal, coding agents (`CLAUDE.md`,
queues and steering, guardrails). Ideas not yet in it:

1. A custom 404 and an optional `username.github.io` root site, building on VC2's `mus248-sandbox`
   (VC2 slide 1.1 has a 🌀 portal to it)
2. Branches from the terminal: `git switch -c`, `git push` (VC2 slide 3.3 has a 🌀 portal here; the
   draft doesn't cover branches yet)
3. Local models: what Ollama is, what runs on a laptop, what it's good and bad at (if the lab
   computers get it)
4. Picking the tool: chatbot vs. agent vs. local, by task and by cost
5. Real Repo Improvement on mus248: reading `CLAUDE.md`, the tests, a pull request to this site

## ✍️ Notes and refresher

1. **In class:** the printed **follow-along notes** (lecture page → 📝 Follow-along notes): the
   lecture with every `==term==` as a blank, about four per slide (VC1: 117, plus blanks ready in the 🙈 slides). Students photograph
   them for Canvas, **due the Sunday after**. Key: instructor view → 🔑 Notes key.
2. **The week after:** the **online refresher** (lecture page → 🔁 Online refresher): the
   lecture's numbered questions (VC1: 25, covering every section), which never show on the slides or notes. Three tries
   each, then the answer and the slide's main point. Students can hand it in unfinished (it warns
   them first) with **📋 Copy Canvas deliverable**: a readable summary plus a JSON receipt (tries,
   clicks, seconds per question, optional feedback, SHA-256 checksum), the same shape as
   camera-lab's. Canvas doesn't auto-grade it; download the submissions to read them.
3. The paraphrased Canvas questions below are optional now: the refresher covers the same ground.

### Stage 3 draft: Vibecoding 1, paraphrased for Canvas

Same ideas as the worksheet, different wording, so recall is what's tested.

1. A classmate pastes a chatbot's answer into a Canvas discussion and it's full of `##` and `**`.
   Why?
   - *Correct:* The chatbot wrote Markdown, and Canvas displayed the raw symbols
   - Canvas adds those symbols to AI text
   - The chatbot was trying to make a table
   - The text was copied from the terminal
2. Which file extension usually means Markdown?
   - *Correct:* `.md` · `.mk` · `.txt` · `.html`
3. On GitHub, what do you make first when you want to change a repo you don't own?
   - *Correct:* A fork · A merge · A release · A ruleset
4. What does opening a pull request do?
   - *Correct:* Asks the repo's owner to bring your change into their repo
   - Copies the owner's repo into your account
   - Publishes your change immediately
   - Deletes your fork
5. Why can't you "undo" committing a password to a public repo by deleting the file?
   - *Correct:* Every earlier version stays in the history, where anyone can read it
   - Deleted files go to a recycle bin that's public
   - GitHub sends the file to the instructor
   - Only the README is public
6. Which best describes a "frontier" AI model?
   - *Correct:* Among the newest and most capable models from the major AI labs
   - Any model available for free
   - A model that runs on your own laptop
   - The model that answers the fastest
7. Your long chat with an AI has started ignoring instructions from the beginning. What's the most
   useful fix?
   - *Correct:* Start a fresh chat with a short summary and the current file
   - Paste the whole chat back in
   - Ask it to try harder
   - Switch to a smaller model
8. Which change would use the *least* of your AI usage?
   - *Correct:* Asking a clear, specific question in a fresh chat
   - Turning thinking effort up to the maximum
   - Pasting your whole project into every message
   - Switching to the largest model available
9. Which prompt best uses a limited prompt budget?
   - *Correct:* "On my phone the Start button does nothing; on my laptop it works. Fix only that."
   - "make it better"
   - "add more features and fix the bugs"
   - "try again"
10. When is your bad webapp actually done?
    - *Correct:* When you've opened it yourself, including on a phone, and it does what you asked
    - When the AI says the code is complete
    - When the code passes 100 lines
    - When the pull request is opened
11. Why are camera-lab, mixer-lab, and this course site separate repos?
    - *Correct:* Each repo does one thing, so a change to one can't break another
    - GitHub only allows one website per account
    - They were written in different programming languages
    - To keep them secret from each other
12. Where did the COB checklist put details it couldn't confirm?
    - *Correct:* In a Technical verification section, instead of guessing
    - In a hidden file only the AI can read
    - It guessed the most likely answer
    - It left them out entirely
13. Which is an environmental cost of using AI?
    - *Correct:* Data centers use electricity, and water for cooling
    - AI models wear out the keyboard
    - Each chat prints a paper copy
    - There isn't one; it runs on the phone
14. An AI writes a confident summary about a group of people. What's the best habit?
    - *Correct:* Check it, because AI can repeat the bias in its training data while sounding sure
    - Trust it, because it was confident
    - Ask it to sound less confident
    - Use a longer prompt

## 🙈 Hiding and showing slides

- Put `🙈` at the start of a slide's heading (after its number) to hide it from students:
  `### 3. 🙈 Chatbot vs. coding agent`. Remove the 🙈 to bring it back.
- A `> 🧑‍🏫` line is an instructor note: instructor view only, never projected in the deck.
- Turn instructor view on with the faint **π** at the very bottom of any lecture page (or add
  `?instructor=1`), and off with the banner's **Turn off**. It's remembered on that device, and
  branch previews share it with the live site.
- A question may not sit in a hidden slide; the checker fails if one does, because students would
  never see it.
