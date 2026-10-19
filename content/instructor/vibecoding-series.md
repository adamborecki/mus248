# Vibecoding series: instructor notes

Running notes for Vibecoding 1–3. Shown to you (not students) via the lecture pages' instructor
view; this file is public in the repo like everything else, so nothing private goes here.

## 🔁 Reminders (from your notes, Oct 16)

- **Live Sound 3 moved** to the week after Vibecoding 1.
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

| | Vibecoding 1 (Oct 19) | Vibecoding 2 (after Live Sound 3) | Vibecoding 3 (outline) |
|---|---|---|---|
| Tools | Browser only: GitHub web + PantherAI | Terminal, git CLI, a coding agent | Own repos, maybe a local model |
| Practice | Bad webapps (fork → PR) | Same workflow from the terminal | Real Repo Improvement on mus248 |
| AI concepts | Frontier, model size, context window, thinking effort, usage | Agents, `CLAUDE.md`, queues and steering, agent usage | Choosing a tool for the job; local vs. cloud |

**Portals (🌀) in VC1 → where they lead:**

| VC1 slide | Portal | Leads to |
|---|---|---|
| 1. The words you need | The history from the terminal | VC2 · 2. Git from the terminal |
| 3. Same recipe, starting now | Queues and steering | VC2 · 3. Queues and steering |
| 5. Your choice | AI on your own computer (offline models) | VC3 (if the lab gets Ollama) |
| 6. Effort and usage | The settings gear; agents use far more | VC2 · 3. Agents and usage |
| 8. Make every prompt count | From playground to repo (fork + pull request) | VC2 · 4. Your own repo |

VC2 should carry its own 🌀 portals pointing at VC3 once VC3 has a shape.

**Open: the feedback route.** How do students hand in bad webapps and give feedback? Options:
a share link (from `/playground/`) posted to a Canvas discussion or assignment; GitHub Issues on
the bad-webapps repo; or a pull request. VC1's activity slide has a 🧑‍🏫 note to fill in.

### Vibecoding 3: outline (not drafted)

1. Your own repo, start to finish: create, Pages, a custom 404, sharing a link
2. Local models: what Ollama is, what runs on a laptop, what it's good and bad at (if the lab
   computers get it)
3. Picking the tool: chatbot vs. agent vs. local, by task and by cost
4. Real Repo Improvement on mus248: reading `CLAUDE.md`, the tests, a pull request to this site

## ✍️ Fill-in: the three stages

1. **In class:** the printed **follow-along notes** (Lecture page → 📝 Follow-along notes): the
   lecture with every `==term==` as a blank. Key: instructor view → 🔑 Notes key. (The question
   worksheet still exists: 🖨️ Worksheet.)
2. **Due the next week:** the online fill-in (Lecture page → ✍️ Fill in online). Students finish
   it, get a completion code like `M248-L08-19of24-K3QF` (lecture 08, 19 of 24 blanks and
   multiple-choice questions right on the first try), and paste it into a Canvas **text entry** assignment. **Copy for Canvas**
   also pastes their written answers. In instructor view the fill-in page has a box that checks a
   code. It's honor-system: the check stops typos, not a determined student.
3. **The week after:** Canvas multiple choice, paraphrased from the lecture (below).

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
