> 🤖 **AI use:** drafted with Claude Code from the instructor's notes. Part 2 of the Vibecoding
> series.

> 🧑‍🏫 **Draft, not scheduled.** Live Sound 3 is next week, so this lands after it. Each 🌀 portal
> in Vibecoding 1 opens onto a section here: `CLAUDE.md` → section 3, terminal git → section 2, coding
> agents → section 3, queues and steering → section 3. Vibecoding 3 is outlined in
> `content/instructor/vibecoding-series.md`.

## 🎤 Lecture: Vibecoding 2

### Vibecoding 2: The Terminal and Coding Agents

Last time you made a change in the browser. Today: the same thing from the terminal, and what
changes when an AI agent does the typing.

### Last time's portals, walked through

Remember the 🌀 portals in Vibecoding 1? Today you walk through them:

- The terminal version of fork, commit, and pull request
- `CLAUDE.md`: instructions written for an AI
- Coding agents
- Queues and steering

### Today

1. The terminal
2. Git from the terminal
3. Coding agents
4. Your own repo

## 1. The Terminal

### 1. What the terminal is

A **text conversation with your computer**. Type a command, press Return, it answers.

It sees the **same files** Finder shows you, just a different way in.

On a Mac: press ⌘ Space and type *Terminal*.

Why bother? It's **exact**, it's **repeatable**, and it's **how AI coding agents work**: they "type"
in a terminal on your behalf.

### 1. Five commands

| Command | What it does | Finder equivalent |
|---|---|---|
| `pwd` | Where am I? | The folder name at the top of the window |
| `ls` | What's in this folder? | Looking at the window |
| `cd Desktop` | Go into a folder | Double-clicking a folder |
| `cd ..` | Go up one folder | The back arrow |
| `open .` | Show this folder in Finder | (the way back) |

**Q1 (fill in the blank).** The command that answers "where am I?" is `______`.

✅ **Answer.** pwd

### 1. Tricks that save you every time

- **Drag a folder from Finder into the Terminal window** and its full path is typed for you.
- **Tab** finishes a file or folder name. Press it twice to see the choices.
- **Up arrow** brings back your last command.
- **Control-C** stops whatever is running.
- Folder names with spaces need quotes: `cd "Recital Audio"`. Dragging does this for you.

### 1. Why an engineer cares: proving a copy is good

Remember the **Triple Triple Check**: matching GB, matching exact bytes, the right three
locations. The terminal can add a stronger check, comparing **every byte of every file**.

| Command | What it tells you |
|---|---|
| `du -sh "folder"` | Total size of a folder, e.g. `38G` |
| `diff -rq "copy A" "copy B"` | Compares two folders, file by file, byte by byte |
| `shasum -a 256 "file.wav"` | A fingerprint of one file. Same fingerprint = same file |

With `diff -rq`, **silence is good news**: no output means every file matched. This is an
**extra** check. It doesn't replace the Triple Triple Check.

**Q2 (multiple choice).** You run `diff -rq` on two copies of a recital folder and it prints
nothing. What does that mean?

- a) The command failed
- ✅ b) Every file matched
- c) The folders are empty

✅ **Answer.** b) Silence means no differences were found.

### 1. 🙈 Gotcha: `.DS_Store`

macOS drops hidden `.DS_Store` files into folders you've opened in Finder, so `diff -rq` may say
`Only in copy A: .DS_Store`. That one is harmless: it's Finder's view settings, not your media.
Anything else in the report is a real difference. Find out why before you delete anything.

### 1. Commands that don't forgive

- `rm` deletes. **It does not go to the Trash.** No undo.
- `sudo` runs a command with full admin power. If something tells you to use it, stop and ask.
- **Never paste a command you can't explain**, from a website or from an AI.

Same rule as the drives: **if you are 99% sure, do not delete. Ask for help.**

### 1. 🙈 Optional: ffmpeg

*Only if ffmpeg is installed; it doesn't come with macOS.* `ffprobe "clip.mov"` prints a file's
codec, frame rate, resolution, and audio channels without opening an editor. Batch jobs (convert
40 files, rename a folder of takes to our naming convention) are where the terminal shines.

## 2. Git from the Terminal

### 2. Same steps, typed

| In the browser (Vibecoding 1) | In the terminal |
|---|---|
| Fork, then open your fork | `git clone` your fork's URL |
| See what you changed | `git status` |
| Choose what to save | `git add index.html` |
| Commit, with a note | `git commit -m "Tuner insults are less repetitive"` |
| Send it to GitHub | `git push` |
| Get everyone else's changes | `git pull` |

The pull request still happens on github.com.

**Q3 (fill in the blank).** To send your commits from your computer up to GitHub, you run
`git ______`.

✅ **Answer.** push

### 2. 🙈 The vocabulary, in engineer terms

| Git word | Closest thing in our world |
|---|---|
| repo | The session folder |
| commit | A saved session version, labeled |
| diff | A/B comparison |
| branch | A duplicate playlist to try an idea |
| merge | Comping the take you kept |
| push / pull | Uploading to / syncing from the shared drive |

## 3. Coding Agents

### 3. Chatbot vs. coding agent

| | Chatbot (e.g. PantherAI) | Coding agent (e.g. Claude Code) |
|---|---|---|
| Sees | Only what you paste | The whole repo |
| Does | Writes a reply you copy somewhere | Edits files, runs commands, runs tests, commits |
| Works in | A chat window | A terminal (or an editor, or the web) |
| You check | Its answer | Its changes, the tests, the result on screen |

That's why the terminal and git matter: **they're the agent's hands**, and how you see what it did.

**Q4 (multiple choice).** What can a coding agent do that a chatbot like PantherAI can't?

- a) Write code
- ✅ b) Edit the files in a repo directly and run the tests itself
- c) Explain what code does

✅ **Answer.** b) A chatbot can write code too, but you have to copy it into place yourself.

### 3. `CLAUDE.md`: rules written for an AI

This site has a Markdown file the agent reads before it touches anything. A few of its rules:

- "This repo is public." Never commit passwords, codes, or names.
- "American spellings."
- If you're not certain of a port label or menu path, **don't guess**: mark it unverified.
- Run the tests before every commit, and look at the result in a browser.

**Q5 (short answer).** Why write rules like these down in a file, instead of typing them into the
chat each time?

✅ **Answer.** The agent reads the file at the start of every session, so the rules never get
forgotten or left out, and they take up no extra prompts.

### 3. Queues and steering

A coding agent can work for minutes at a time. You don't have to wait:

- **Queue:** send your next message while it's working. It picks it up when it's ready.
- **Steer:** interrupt (Esc in Claude Code) when it's heading the wrong way, and redirect it.

Same skill as calling a mix from the booth: short, specific, early.

**Q6 (fill in the blank).** Interrupting an agent mid-task to redirect it is called ______.

✅ **Answer.** steering

### 3. Agents and usage

An agent reads files, runs commands, and checks its own work, and **all of that fills the context
window**. One agent task can use far more than a whole PantherAI chat.

Worth it for real work on a big repo. Overkill for a tiny bad webapp.

### 3. Guardrails this site uses

- **An instruction file** the agent reads first (`CLAUDE.md`)
- **Automated tests**, run before every commit
- **A look in a real browser**, every time something visible changes
- **Verification marks** on procedures: ✅ Verified · 📝 Proposed · ❓ Unverified · ⛔ Blocked
- **Git history as the safety net**: any change can be found and undone

None of these make the AI smarter. They make its mistakes **visible sooner**.

### 3. 🙈 Live demo (about 10 minutes)

1. Open Terminal. `pwd`, `ls`, `cd` into a folder with two copies of a recording.
2. `diff -rq` the two copies. Silence. Then change one file in a scratch copy and run it again.
3. Open [this site's commit history](https://github.com/adamborecki/mus248/commits/main) and click
   one commit to see its diff.
4. Ask a coding agent for one small change on a branch, and open the branch's preview link on a
   phone before it goes live.

## 4. Your Own Repo

### 4. Make a repo and publish it

1. On GitHub: **New repository**, give it a name, set it to **Public**
2. Add an `index.html`
3. **Settings → Pages → Deploy from a branch → main → / (root) → Save**
4. A minute or two later it's live at `your-username.github.io/your-repo/`

The same steps work on your bad-webapps fork, so you can test your app before you open the pull
request.

**Q7 (fill in the blank).** To turn a repo into a website, you turn on GitHub ______ in the repo's
settings.

✅ **Answer.** Pages

## 🗝️ Key terms

**terminal** · **`pwd` / `ls` / `cd`** · **clone** · **push** · **pull** · **coding agent** ·
**`CLAUDE.md`** · **queue** · **steer** · GitHub Pages · `diff -rq`

## 💭 Before you leave

- One thing you'd trust a coding agent with, and one thing you wouldn't. Why?
- What would you put in a `CLAUDE.md` for your bad webapp?
