> 🤖 **AI use:** drafted with Claude Code from the instructor's notes. This lecture is part of a
> series: Vibecoding 1 (today), Vibecoding 2, and Vibecoding 3.

> 🧑‍🏫 **Instructor notes are only visible in instructor view.** Slides marked 🙈 are hidden from
> students; they're kept so you can switch them back on by removing the 🙈 from the heading. Your
> running reminders for this series are in `content/instructor/vibecoding-series.md`.

## 🎤 Lecture: Vibecoding 1

### Vibecoding 1: Markdown, GitHub, and Bad Webapps

How this course site is built, how to work with cheaper AI, and your first contribution to a real
repo: a webapp that is **bad on purpose**.

> 🧑‍🏫 Before class: set the prompt budget on the "Bad webapps: the rules" slide, and put the
> bad-webapps link on Canvas. Live Sound 3 moved to next week.

### Today

1. Markdown
2. GitHub, in the browser
3. Working with AI: models, context, effort, usage
4. Bad webapps
5. What's next

### 🍄 See a mushroom? It's a power-up

Some slides have a **🍄 power-up**: a hidden level with a sneak peek of **Vibecoding 2**.

> 🍄 **Power-up: what this is.** Tap a power-up to open it. Power-ups are optional and never on
> the worksheet. Each one is a topic you'll meet properly in a later lecture, so when it comes up
> again you'll already have a head start.

## 1. Markdown

### 1. What Markdown is

**Plain text with a few symbols** that become formatting.

- Readable as-is, even without being rendered
- Opens in any app, on any computer, forever
- Files end in `.md`

It's how AI chatbots format their answers. That's why stray `**` and `##` show up when you paste
from an AI into Canvas or Word: the symbols came along, the formatting didn't.

**Q1 (multiple choice).** You paste an AI's answer into Canvas and see `**phantom power**`, asterisks
and all. What happened?

- a) The AI made a typo
- ✅ b) The AI wrote Markdown, and Canvas showed the symbols instead of the formatting
- c) Canvas doesn't allow bold text

✅ **Answer.** b) The AI wrote Markdown; Canvas showed the symbols instead of turning them into
bold.

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

Each activity is **one Markdown file**. From it, the site builds the web page, the worksheet, and
the answer key. Nobody hand-writes a worksheet, so the page and the paper can never disagree.

These slides are Markdown too.

**Q2 (fill in the blank).** In these slides, every `###` heading becomes a ______.

✅ **Answer.** slide

> 🍄 **Power-up: instructions for the AI, in Markdown.** This repo has a file called `CLAUDE.md`:
> plain Markdown rules that an AI coding agent reads before it touches anything ("this repo is
> public," "American spellings," "don't guess a port label"). In Vibecoding 2 you'll see an agent
> follow it.

## 2. GitHub, in the Browser

### 2. Git and GitHub

You've seen this folder:

`mix.wav` · `mix_v2.wav` · `mix_FINAL.wav` · `mix_FINAL_actually.wav`

**Git** fixes that: one copy of each file, plus every saved version, each with a note saying what
changed. **GitHub** puts that history online, and **GitHub Pages** turns it into a website.

This site is a GitHub repo: [github.com/adamborecki/mus248](https://github.com/adamborecki/mus248).

### 2. The words you need

| Word | What it means |
|---|---|
| **repo** | A project folder, with its whole history |
| **commit** | One save, plus a note about what changed |
| **fork** | Your own copy of someone else's repo |
| **pull request** | "Here's my change; please bring it into yours" |
| **merge** | The owner accepts the change |

**Q3 (multiple choice).** Which one is your own copy of someone else's repo, under your account?

- a) commit
- ✅ b) fork
- c) merge
- d) pull request

✅ **Answer.** b) A fork is your copy. A commit is one save, a pull request asks the owner to take
your change, and a merge is the owner saying yes.

### 2. How a change gets in

1. **Fork** the repo (button at the top right on GitHub)
2. **Edit** in your browser: open a file and click the ✏️ pencil, or **Add file → Create new file**
3. **Commit** your change, with a short note
4. Open a **pull request** back to the original
5. The instructor reviews it and **merges** it. Then it's live.

No terminal, no app to install. Everything happens on github.com.

**Q4 (fill in the blank).** In bad-webapps, anyone can open a pull request, but only the
______ can merge it.

✅ **Answer.** instructor (or someone the instructor has put in charge)

> 🍄 **Power-up: the same thing from the terminal.** Everything on this slide has a terminal
> version: `git clone`, `git commit`, `git push`. It's faster once you know it, and it's how AI
> coding agents do it. That's Vibecoding 2.

### 2. Public means public

This repo is **public**: anyone can read every file and **every old version**. Deleting something
later doesn't remove it from the history.

Never commit:

- Passwords, access codes, door codes, stream keys
- Real names (yours or anyone's), grades, or anything about a classmate

**Q5 (short answer).** You commit a door code by accident and delete it the next day. Why is it
still a problem?

✅ **Answer.** The history keeps every old version, so anyone can still find it.

### 2. 🙈 You've already been using version history

Every activity page and worksheet shows a **revised** date ("Rev. 2026-10-14"). If you're holding
a printed worksheet from three weeks ago, that date tells you it isn't the current version. Same
idea as our folder naming conventions: the name or date tells the next person what they're
holding.

## 3. Working with AI

### 3. Frontier models

A **frontier model** is one of the newest, most capable AI models from the big labs: Anthropic
(Claude), OpenAI (ChatGPT), Google (Gemini).

- The "best" model changes every few months
- The biggest models are the smartest, and the most expensive to run

Claude comes in sizes: **Haiku** (small, fast), **Sonnet** (middle), **Opus** (largest).

**PantherAI** gives you the highest **Claude Sonnet** available (Sonnet 5, right now). That's a very
good model. It just isn't the biggest one, so you work with it a little differently.

**Q6 (multiple choice).** A "frontier" model is:

- a) Any AI that's free to use
- ✅ b) One of the newest, most capable models from the big AI labs
- c) An AI that runs without the internet

✅ **Answer.** b) "Frontier" means the leading edge: the newest, most capable models.

### 3. The context window

The **context window** is everything the AI can "see" at once: your messages, its replies, and
anything you pasted.

- It's big, but not unlimited
- In a very long chat, early instructions get less attention, and some tools quietly drop the
  oldest messages
- It can't see this website, your files, or your screen unless you paste them in

**Fix:** when a chat gets long or confused, start a **new chat** with a short summary and your
current file.

**Q7 (fill in the blank).** Everything the AI can "see" at once is its ______ ______.

✅ **Answer.** context window

**Q8 (multiple choice).** Your PantherAI chat is very long, and it keeps ignoring a rule you gave
at the start. Best move?

- a) Repeat the rule in ALL CAPS
- ✅ b) Start a new chat with a short summary and your current file
- c) Keep going; it will catch up

✅ **Answer.** b) A fresh chat puts your rules back at the front of the context window.

### 3. Thinking effort

Some AI tools can **think before answering**: work through the problem step by step, then reply.

- **More effort:** better on hard problems, slower, uses more
- **Less effort:** fine for simple, clear requests

In PantherAI, look for a settings gear ⚙️ next to the model name. If there's a thinking or effort
option, that's this. If there isn't, the model decides for itself.

> 🧑‍🏫 PantherAI runs on LibreChat. Confirm before class whether Chapman's setup shows a thinking
> or effort option under the gear; if it does, say where it is on this slide.

### 3. The big trade-off: usage

Every message costs something: money, a usage limit, or your time.

| Uses more | Uses less |
|---|---|
| Bigger model | Smaller model |
| More thinking effort | Less thinking effort |
| Long chats, big pastes | Fresh chats, only what's needed |
| Vague asks, many rounds | Clear asks, fewer rounds |

**Cheaper AI is still good. It's different work:** you do more of the thinking. Smaller asks,
clearer instructions, more checking.

**Q9 (multiple choice).** Which uses the most?

- a) A short question to a small model
- ✅ b) A long chat with a big model on high thinking effort
- c) Re-reading the AI's last answer

✅ **Answer.** b) Bigger model, more effort, and a longer chat all add up.

> 🍄 **Power-up: coding agents.** PantherAI is a chatbot: it only sees what you paste, and you copy
> its answer somewhere yourself. A **coding agent** (like Claude Code, which built this site) works
> on the files directly: it edits, runs tests, and commits. More powerful, and it uses far more.
> Vibecoding 2.

### 3. 🙈 Chatbot vs. coding agent

| | Chatbot (e.g. PantherAI, ChatGPT) | Coding agent (e.g. Claude Code) |
|---|---|---|
| Sees | Only what you paste or upload | The whole repo |
| Does | Writes a reply you copy somewhere | Edits files, runs commands, runs tests, commits |
| You check | Its answer | Its changes, the tests, the result on screen |

## 4. Bad Webapps

### 4. So bad it's good

**Bad webapps** is a shared repo where everyone builds a tiny webapp that is **bad on purpose**,
and bad in a way that's actually good.

- A metronome that slowly drifts
- A tuner that insults you
- A calculator that's always off by a little
- A mirror that's two seconds late
- A microphone that only hears whispers
- A cable generator that's all spaghetti

It's low stakes. The point is practicing the workflow: vibecoding, iterating, and a pull request.

### 4. The rules

- **One app, one folder:** `apps/your-app-name/index.html`
- **Prompt budget:** [number — set in class]. Plan each prompt.
- **Start from `STARTER.md`** in the repo: paste it into PantherAI first, then describe your idea
- **Bad on purpose, but it has to work.** A tuner that insults you still has to listen.
- **No real names** in the app or the files. Your GitHub username is enough.

The repo: [link on Canvas]

> 🧑‍🏫 Pick the prompt budget (5–8 is enough to finish and tight enough to make every prompt
> count) and edit the line above. The bad-webapps repo and setup steps are in
> `content/instructor/vibecoding-series.md`.

### 4. Iterating: the loop

1. **Describe** what you want, specifically
2. **The AI builds** it
3. **You test** it: open it, on your phone too
4. **Report** what's wrong, as specifically as you'd tell a performer
5. Repeat

Step 3 is the job. It's soundcheck: you trust the mix because you listened, not because the faders
look right.

### 4. Make every prompt count

| ❌ Spends a prompt | ✅ Earns its prompt |
|---|---|
| "make it better" | "The drift is too fast to notice. Make it drift about 1 BPM every 4 bars, and keep everything else the same." |
| "it doesn't work" | "On my phone, tapping Start does nothing. On my laptop it works." |
| Three new ideas at once | One change, then test |

**Q10 (short answer).** Rewrite this prompt so it earns its place: *"make it better."*

✅ **Answer.** One specific change, plus what you saw. For example: "The tuner's insults repeat
too often. Give it 20 different ones, and keep everything else the same."

> 🍄 **Power-up: queues and steering.** In a coding agent you don't have to wait: you can send your
> next message while it's still working (it waits in a **queue**), or interrupt to **steer** it
> mid-task. Vibecoding 2.

### 4. When is it done?

**AI sounds equally confident when it's right and when it's wrong.**

It's done when **you** opened it and it did what you asked, not when the AI says "this works!"

**Q11 (multiple choice).** Your bad tuner looks great in the AI's reply. When is it done?

- a) When the AI says it works
- ✅ b) When you've opened it, on your phone too, and it does what you asked
- c) When the code is long enough

✅ **Answer.** b) Same as soundcheck: you trust it after you've tested it.

### 4. 🙈 Where vibecoding bites

Real kinds of mistakes this course site has had to catch:

- A well-written procedure that the room's own SOP contradicted
- A tiny bug that would have quietly stopped the quiz adapting, weeks later
- A photo that showed an account name in the background

## 5. What's Next

### 5. This week: bad webapps

1. Make a free GitHub account (a username that isn't your real name is fine)
2. Open the bad-webapps repo and **fork** it
3. Paste `STARTER.md` into PantherAI, then build your app within your prompt budget
4. Add it as `apps/your-app-name/index.html` in your fork
5. Open a **pull request**

The `CONTRIBUTING.md` file in the repo walks through every click.

### 5. Then: Repo Improvement

Bad webapps is the practice run. Next comes [Repo Improvement](../../repo-improvement/): the same
workflow, on **this** site, making a real page better.

Early volunteers are already welcome.

### 5. Fill in this lecture online

This lecture has a printed worksheet for class, and an **online version** you can fill in on your
phone. Finish it and you get a **completion code** to paste into Canvas.

## 🗝️ Key terms

**Markdown** · **repo** · **commit** · **fork** · **pull request** · **merge** · **frontier model** ·
**context window** · **thinking effort** · GitHub Pages · prompt budget

## 💭 Before you leave

- What will your bad webapp be, and what makes it bad?
- Write your first prompt, in one sentence.
