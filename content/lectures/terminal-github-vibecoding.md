> 🧪 **Draft: a possible alternate or add-on lecture, not scheduled.** Written with AI help
> (Claude) for the instructor to review; nothing here has been presented. It could replace a week
> (live sound picks up the week after) or run as a ~30-minute add-on after Live Sound Part 3, using
> the first section and the vibecoding section only.
> **Open items for the instructor before this goes in front of students:**
> (1) whether students may open GitHub Issues or pull requests on this repo, or only send feedback
> through Repo Improvement; (2) whether lab Macs have Homebrew/ffmpeg (the one optional slide that
> uses it says "if installed"); (3) whether the class has an AI-use policy beyond Repo
> Improvement's disclosure and "please don't cheat" on quizzes. None of these are guessed below.

## 🎤 Lecture: Under the Hood

### MUS 248: Under the Hood

The Terminal, GitHub, and Vibecoding

How this course site is actually made, and why a recording engineer should care.

### Why is a recording class talking about code?

Every page you've used this semester (activities, checklists, worksheets, the quiz, these slides)
lives in one folder of plain text files on GitHub.

Most of it was written by the instructor working **with an AI coding agent**. As of mid-October,
about 9 in 10 of the repo's saved changes list Claude as a co-author.

You don't need to become a programmer. But you will work alongside these tools for the rest of
your career, and three skills carry straight over from what you already do:

- Knowing exactly where files are, and proving a copy is good
- Keeping a history you can roll back to
- Not trusting anything (a mix, a checklist, an AI) until you've checked it yourself

### Today

1. The terminal: talking to your computer in text
2. Git and GitHub: a history for every file
3. Vibecoding: what it is, what it's good at, where it bites
4. A tour of how this site is built
5. Your on-ramp: Repo Improvement

## 1. The Terminal

### 1. What the terminal is

The terminal is a **text conversation with your computer**. You type a command, press Return, and
it answers.

It sees the **same files** Finder shows you. Nothing is hidden or separate. It's just a different
way in.

On a Mac: **Applications → Utilities → Terminal**, or press ⌘ Space and type *Terminal*.

Why bother, when Finder works?

- It's **exact**: no guessing which folder you dragged into
- It's **repeatable**: the same command does the same thing every time
- It's **how AI coding agents work**: they "type" in a terminal on your behalf

### 1. Your first five commands

| Command | What it does | Finder equivalent |
|---|---|---|
| `pwd` | **P**rint **w**orking **d**irectory: where am I? | The folder name at the top of the window |
| `ls` | List what's in this folder | Looking at the window |
| `cd Desktop` | Go into a folder | Double-clicking a folder |
| `cd ..` | Go up one folder | The back arrow |
| `open .` | Open this folder in Finder | (the way back to Finder) |

### 1. Tricks that save you every time

- **Drag a folder from Finder into the Terminal window** and its full path is typed for you,
  spaces and all.
- **Tab** finishes a file or folder name. If nothing happens, press Tab twice to see the choices.
- **Up arrow** brings back your last command.
- **Control-C** stops whatever is running.
- Folder names with spaces need quotes: `cd "Recital Audio"`. Dragging does this for you.

### 1. Why an engineer cares: proving a copy is good

Remember the **Triple Triple Check** from Data Management: matching GB, matching exact bytes,
the right three locations. The terminal can add a stronger check: comparing **every byte of every
file**.

| Command | What it tells you |
|---|---|
| `du -sh "folder"` | Total size of a folder, e.g. `38G` |
| `ls -l` | Every file with its exact size in bytes |
| `diff -rq "copy A" "copy B"` | Compares two folders file by file, byte by byte |
| `shasum -a 256 "file.wav"` | A fingerprint of one file. Same fingerprint = same file |

With `diff -rq`, **silence is good news**: no output means every file matched. It reports files
that differ and files that exist in only one place. Expect it to take a while on video; it's
actually reading every byte.

This is an **extra** check. It doesn't replace the Triple Triple Check.

### 1. Gotcha: `.DS_Store`

macOS quietly drops hidden `.DS_Store` files into folders you've opened in Finder.

So `diff -rq` may say `Only in copy A: .DS_Store`. That one is harmless: it's Finder's view
settings, not your media.

Anything else in that report is a real difference. Stop and find out why before you delete
anything.

### 1. Commands that don't forgive

- `rm` deletes. **It does not go to the Trash.** There is no undo.
- `sudo` runs a command with full admin power. If something tells you to use it, stop and ask.
- **Never paste a command you can't explain**, from a website, a forum, or an AI. Ask the AI to
  explain each part first. If you still can't explain it, don't run it.

Same rule as the drives: **if you are 99% sure, do not delete. Ask for help.**

### 1. Optional: what else is possible

*Only if ffmpeg is installed on the machine. It doesn't come with macOS.*

`ffprobe "clip.mov"` prints a file's codec, frame rate, resolution, and audio channels without
opening an editor. Handy when a camera was left on the wrong setting and you need to know before
you start an edit.

Batch jobs (convert 40 files, rename a folder of takes to our naming convention) are where the
terminal really shines, and they're exactly the kind of thing people ask AI to write.

## 2. Git and GitHub

### 2. Git: a history for a whole folder

You've seen this folder:

`Recital_mix.wav` · `Recital_mix_v2.wav` · `Recital_mix_FINAL.wav` · `Recital_mix_FINAL_actually.wav`

**Git** solves that properly. One copy of each file, plus a history of every saved version.

- Each save is a **commit**: a snapshot of the whole folder, plus a note saying what changed and
  why.
- You can see exactly what changed between any two commits.
- You can go back to any commit.

### 2. GitHub: git, online

**GitHub** hosts git folders (called **repositories**, or **repos**) online, so several people (and
AI agents) can work on the same files.

**GitHub Pages** turns a repo into a website. That's this site:

- The repo: [github.com/adamborecki/mus248](https://github.com/adamborecki/mus248)
- The website: [adamborecki.github.io/mus248](../../)

Same files. Change one, commit it, and a minute or two later the website updates.

### 2. The vocabulary, in engineer terms

| Git word | What it means | Closest thing in our world |
|---|---|---|
| repo | A project folder with its full history | The session folder |
| commit | One saved snapshot plus a note | A saved session version, labeled |
| diff | Exactly what changed, line by line | A/B comparison |
| branch | A separate line of work that doesn't touch the main version | A duplicate playlist to try an idea |
| merge | Bringing a branch's changes into the main version | Comping the take you kept |
| push / pull | Send your commits to GitHub / get everyone else's | Uploading to / syncing from the shared drive |
| pull request (PR) | "Here are my changes; please review and merge them" | Handing in a mix for approval |

### 2. Public means public

This repo is **public**. Anyone on the internet can read every file and **every old version**.

Deleting a file later does **not** delete it from history. Assume anything committed is permanent.

So the rule here is strict. Never commit:

- Passwords, access codes, door codes, stream keys
- Account names or addresses
- Student names, grades, or submissions

That's why you see `[names — ask instructor]` in the lecture pages. It's redacted before it goes
in, not after.

### 2. You've already been using version history

Every activity page and worksheet shows a **revised** date ("Rev. 2026-10-14").

If you're holding a printed worksheet from three weeks ago, that date is how you tell it's not the
current version.

Same idea as our folder naming conventions: **the name or date tells the next person exactly what
they're holding.**

## 3. Vibecoding

### 3. What is vibecoding?

The term comes from AI researcher Andrej Karpathy (February 2025): you describe what you want in
plain language, an AI writes the code, you run it and react, and you mostly "forget that the code
even exists."

In practice it ranges from:

- **Pure vibes:** never reading the code; fine for a throwaway toy
- **Directed:** you set the rules, the AI writes the code, you test everything and read the
  changes that matter. This site is built this way.

### 3. Chatbot vs. coding agent

| | Chatbot (e.g. PantherAI, ChatGPT) | Coding agent (e.g. Claude Code) |
|---|---|---|
| Sees | Only what you paste or upload | The whole repo |
| Does | Writes a reply you copy somewhere | Edits files, runs commands, runs tests, commits |
| Works in | A chat window | A terminal (or an editor, or the web) |
| You check | Its answer | Its changes: the diff, the tests, the result on screen |

That's why the first two sections matter: **the terminal and git are the agent's hands.** When
something goes wrong, they're also how you see what it did.

### 3. The loop

1. **Describe** what you want, specifically
2. **The AI builds** it
3. **You test** it: in the browser, on the gear, on your phone
4. **Report** what's wrong, as specifically as you would to a performer
5. Repeat

Step 3 is the job. It's soundcheck: you don't trust the mix because the faders look right. You
trust it because you listened.

### 3. Where vibecoding bites

Real kinds of mistakes, including ones this repo has had to catch:

- **Confidently wrong procedure.** A well-written step that the room's own SOP contradicted. It
  read perfectly; it was wrong.
- **Invented details.** A port label, menu path, or mounting thread that sounds right and doesn't
  exist on the actual gear.
- **Silent bugs.** A tiny comparison in the quiz code that would have quietly stopped it adapting
  to students, weeks later, with no error message.
- **Leaks in the background.** A photo of the gear that also showed a desktop file listing, with
  an account name in it. Check the whole frame, not just the subject.
- **"It works on my screen."** Bugs that are invisible in the code and obvious on a phone.

The common thread: **AI output sounds equally confident whether it's right or wrong.**

### 3. Guardrails this repo uses

- **An instruction file the agent reads first** (`CLAUDE.md`): hard rules like "this repo is
  public," "American spellings," and "if you're not certain of a port label, don't guess."
- **Automated tests**, run before every commit. They check that every worksheet parses, no answer
  key leaks onto a student page, and the quiz still scores correctly.
- **Look at it in a browser**, every time something visible changes.
- **Verification marks** on procedures: ✅ Verified · 📝 Proposed · ❓ Unverified · ⛔ Blocked
- **Git history as the safety net**: any change can be found and undone.

None of these make the AI smarter. They make its mistakes **visible sooner.**

### 3. AI slop, revisited

The Big Picture lecture (October 12) included an **AI SLOP DISCLOSURE**: the slides were
reviewed; the follow-along notes weren't.

That's the honest version of how this works. The valuable skill isn't generating text or code.
It's **knowing what has been checked and what hasn't**, and saying so out loud.

You already practice that skill: it's the Triple Triple Check.

## 4. A Tour of This Site

### 4. One file, three outputs

Each activity is **one Markdown file** (`content/activities/stereo.md`, for example). Markdown is
plain text with a few symbols: `##` for a heading, `-` for a bullet, `**bold**`.

From that one file, the site builds:

1. **The web page:** full procedure, photos, troubleshooting (the textbook)
2. **The worksheet:** key terms, checkpoints, questions (the workbook)
3. **The answer key:** generated from answers marked inside the same file

Nobody hand-writes a worksheet. A previous version of this course kept them separately, and the
copies drifted apart until they disagreed. One source can't disagree with itself.

### 4. These slides are a text file too

This lecture is `content/lectures/terminal-github-vibecoding.md`.

- Every `##` heading becomes a section card
- Every `###` heading becomes a slide
- The zoomable deck you're looking at is built from that, in your browser

No PowerPoint, no build step, no server. Plain files, a little JavaScript, and GitHub Pages.

### 4. Live demo (about 10 minutes)

1. Open Terminal. `pwd`, `ls`, `cd` into a folder with two copies of a recording.
2. `diff -rq` the two copies. Silence. Then change one file in a scratch copy (not real media)
   and run it again.
3. Open [the repo's commit history](https://github.com/adamborecki/mus248/commits/main) and click
   one commit to see its diff.
4. Ask a coding agent for one small change on a branch, and open the branch's preview link on a
   phone before it goes live.

## 5. Your Turn

### 5. Repo Improvement

The [Repo Improvement](../../repo-improvement/) activity is how you join in. **No coding, no
GitHub account, no terminal required.**

1. Pick **one small section** of any page and actually try it: on the gear, or in a simulator.
2. Notice exactly where the page stops matching reality.
3. Hand in one of the two routes below.

- 🗣️🎙️ **Talk it out:** one dictated paragraph of raw feedback.
- 🧹🤖🍝 **Use AI to clean AI slop:** paste the starter into PantherAI, let it interview you, then
  check every claim it writes against what you actually saw.

"Step 4 says hold the switch; it took about 2 seconds before the F8 turned on" is worth more than a
page of polished prose.

### 5. Try this week (5 minutes)

1. Open Terminal.
2. Type `pwd`, then `ls`. You're looking at your home folder.
3. `cd Desktop`, then `ls` again. Compare it with what Finder shows.
4. Type `cd ` (with a space), drag any folder into the window, press Return, then `open .`

If any step didn't do what this slide says, that's a Repo Improvement finding. Report it.

### Takeaways

- The terminal is just **another way to reach the same files**, exact and repeatable.
- Git keeps **every version with a note**; this repo is public, so **nothing secret goes in**.
- Vibecoding is **describe → build → test → report**. The testing is the job.
- AI is equally confident when it's wrong. **Verify before you trust**: same as gain, same as
  drives, same as everything else in this class.
