> 🧪 **Draft: a possible alternate or add-on lecture, not scheduled.** Written with AI help
> (Claude) for the instructor to review; nothing here has been presented.
> **Open items for the instructor:** (1) whether students may open GitHub Issues or pull requests
> on this repo, or only send feedback through Repo Improvement; (2) whether the class has an
> AI-use policy beyond Repo Improvement's disclosure and "please don't cheat" on quizzes.

## 🎤 Lecture: Under the Hood

### MUS 248: Under the Hood

Markdown, the Terminal, GitHub, and Vibecoding

How this course site is made, and why a recording engineer should care.

### Why talk about this?

Every page you've used this semester (activities, worksheets, the quiz, these slides) is a
**plain text file on GitHub**, written by the instructor working with an **AI coding agent**.

You don't need to become a programmer. Three habits you already practice carry straight over:

- Know exactly where your files are
- Keep a history you can roll back to
- Don't trust anything until you've checked it

### Today

1. Markdown
2. The terminal
3. Git and GitHub
4. Vibecoding
5. Your turn

## 1. Markdown

### 1. What Markdown is

**Plain text with a few symbols** that become formatting.

- Readable as-is, even without being rendered
- Opens in any app, on any computer, forever
- Files end in `.md`

It's how AI chatbots format their answers. That's why stray `**` and `##` show up when you paste
from ChatGPT into Canvas or Word: the formatting didn't come along, only the symbols.

### 1. The whole cheat sheet

| Type this | You get |
|---|---|
| `## Gear list` | A heading |
| `**phantom power**` | **phantom power** |
| `*optional*` | *optional* |
| `- XLR cable` | A bullet |
| `1. Power on the F8` | A numbered step |
| `[Salmon checklist](link)` | A link |
| `![caption](photo.jpg)` | A picture |

That covers almost everything on this site.

### 1. This site is Markdown

Each activity is **one Markdown file**. From it, the site builds:

1. **The web page:** full procedure, photos, troubleshooting
2. **The worksheet:** key terms, checkpoints, questions
3. **The answer key**

Nobody hand-writes a worksheet, so the page and the worksheet can never disagree.

These slides are Markdown too: every `###` heading becomes a slide.

## 2. The Terminal

### 2. What the terminal is

A **text conversation with your computer**. Type a command, press Return, it answers.

It sees the **same files** Finder shows you, just a different way in.

On a Mac: press ⌘ Space and type *Terminal*.

It matters because it's **exact** and **repeatable**, and because **AI coding agents work in a
terminal**: it's their hands.

### 2. Five commands

| Command | What it does |
|---|---|
| `pwd` | Where am I? |
| `ls` | What's in this folder? |
| `cd Desktop` | Go into a folder |
| `cd ..` | Go up one folder |
| `open .` | Show this folder in Finder |

Tip: **drag a folder into the Terminal window** and its full path is typed for you.

### 2. Commands that don't forgive

- `rm` deletes. **It does not go to the Trash.** No undo.
- **Never paste a command you can't explain**, from a website or from an AI.

Same rule as the drives: **if you are 99% sure, do not delete. Ask for help.**

## 3. Git and GitHub

### 3. Git: a history for a whole folder

You've seen this folder:

`mix.wav` · `mix_v2.wav` · `mix_FINAL.wav` · `mix_FINAL_actually.wav`

**Git** fixes that: one copy of each file, plus every saved version.

- Each save is a **commit**: a snapshot plus a note saying what changed.
- You can see exactly what changed, and go back to any commit.

**GitHub** puts that history online, and **GitHub Pages** turns it into a website. That's this
site: [github.com/adamborecki/mus248](https://github.com/adamborecki/mus248).

### 3. Public means public

This repo is **public**: anyone can read every file and **every old version**. Deleting a file
later doesn't remove it from history.

Never commit:

- Passwords, access codes, door codes, stream keys
- Student names or grades

That's why lecture pages say `[names — ask instructor]`.

## 4. Vibecoding

### 4. What is vibecoding?

A term from AI researcher Andrej Karpathy (2025): **describe what you want in plain language, an AI
writes the code**, you run it and react.

The loop:

1. **Describe** it
2. **AI builds** it
3. **You test** it: in the browser, on the gear, on your phone
4. **Report** what's wrong
5. Repeat

Step 3 is the job. It's soundcheck: you trust the mix because you listened, not because the faders
look right.

### 4. Where it bites

**AI sounds equally confident whether it's right or wrong.** Real examples from this site:

- A well-written procedure that the room's own SOP contradicted
- A tiny bug that would have quietly stopped the quiz adapting, weeks later
- A photo that showed an account name in the background

That's why every procedure here gets marked ✅ Verified, 📝 Proposed, ❓ Unverified, or ⛔ Blocked.
The skill isn't generating text. It's **knowing what has been checked**.

## 5. Your Turn

### 5. Repo Improvement

[Repo Improvement](../../repo-improvement/) is how you join in. **No coding, no GitHub account,
no terminal required.**

1. Pick **one small section** of any page and actually try it.
2. Notice exactly where the page stops matching reality.
3. Hand in a dictated paragraph, or use AI to clean it up and check every claim it makes.

"Step 4 says hold the switch; it took about 2 seconds" beats a page of polished prose.

### Takeaways

- **Markdown:** plain text, a few symbols, readable anywhere.
- **Terminal:** the same files, exact and repeatable.
- **Git:** every version, with a note. Public, so nothing secret goes in.
- **Vibecoding:** describe, build, **test**, report. Verify before you trust.
