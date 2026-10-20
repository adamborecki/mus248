> 🤖 **AI use:** drafted with Claude Code from the instructor's notes. Part 1 of a series:
> Vibecoding 1 (today), Vibecoding 2, and Vibecoding 3.

> 🧑‍🏫 **Instructor view only.** Blanks are highlighted here (students see plain text). Slides
> marked 🙈 are hidden from students; remove the 🙈 from a heading to bring one back (they have
> blanks ready). The numbered questions are the online refresher's: they don't show on the slides
> or the notes. Print the 📝 Follow-along notes for class. Series reminders:
> `content/instructor/vibecoding-series.md`.

## 📣 Announcements

### Homework review

Everything due this week, with due dates: **see Canvas**.

> 🧑‍🏫 Placeholder: every lecture's announcements open with this slide. When the weekly homework
> list is ready, put it here (follow-along notes photos, online refresher, quiz, …).

### No more Canvas discussions

We're ==getting rid of== the Canvas ==discussions==.

### New: the Repo Improvement form

Whenever you ==finish== an ==activity== or a ==checklist==, fill out the ==Repo Improvement== form.

The form: [forms.gle/ee2ypjZo8VbhRVUT9](https://forms.gle/ee2ypjZo8VbhRVUT9). It's also at the
==end== of every activity, checklist, and worksheet, as a link and a ==QR code==.

**Q1 (multiple choice).** You just finished an activity or a checklist. What do you do now?

- a) Post about it in the Canvas discussion
- ✅ b) Fill out the Repo Improvement form
- c) Nothing; the instructor checks it later

✅ **Answer.** The Canvas discussions are gone: every time you finish an activity or a checklist,
fill out the Repo Improvement form.

## 🎤 Lecture: Vibecoding 1

### Vibecoding 1: This Site, AI, and Bad Webapps

A tour of the ==repo== behind this site, how it gets built with ==AI==, what using AI costs,
and a webapp your group makes that is **bad on ==purpose==**.

Fill in the blanks on your follow-along notes as we go.

### Today

1. A ==tour== of this site
2. A finished example: ==COB==
3. A live build: the ==Electroacoustic Showcase==
4. ==Markdown==, by example
5. The ==ethics== of AI
6. ==Working== with AI
7. Checking the ==live build==
8. Activity: ==bad webapps==

### 🌀 See a swirl? It's a portal

Some slides have a 🌀 ==portal==: tap it for a glimpse of something we'll get to later.

> 🌀 **Portal: what this is.** Portals are optional, and never on the notes. Each one opens onto
> a later lecture (usually Vibecoding 2), so when we get there, you've already been.

## 1. A Tour of This Site

### One site, one repo

Every page you've used this semester lives in one ==repo==: a folder of files, with its whole
history, on ==GitHub==.

- The repo: [github.com/adamborecki/mus248](https://github.com/adamborecki/mus248)
- The site: [adamborecki.github.io/mus248](../../)

==GitHub Pages== turns the repo into the website. Change a file, and a minute later the
site changes.

> 🧑‍🏫 Open the repo on the projector and click around while you talk: folders, a Markdown file,
> the commit list.

**Q2 (fill in the blank).** A project folder with its whole history, kept on GitHub, is called a
==repo|repository==.

✅ **Answer.** A repo is a project's folder plus every saved version of it. This whole course site
is one repo.

**Q3 (fill in the blank).** The GitHub feature that turns a repo into a website is GitHub
==Pages==.

✅ **Answer.** GitHub Pages publishes a repo as a website: change a file, and a minute later the
site changes.

### What's inside

| In the repo | What it is |
|---|---|
| `cameras/`, `stereo/`, `salmon-gig-checklist/` … | Each folder is a page's ==web address== |
| `content/activities/` | One Markdown file per activity: the real ==source== |
| `content/lectures/` | These slides, as text |
| `data/` | Lists the site reads: activities, lecture dates |
| `CLAUDE.md` | ==Rules== for the AI that helps build it |

Most of it is plain text files written in ==Markdown==.

### One file, three outputs

Each activity is **one Markdown file**. From it, the site builds:

1. **The ==web page==:** full procedure, photos, troubleshooting
2. **The ==worksheet==:** key terms, checkpoints, questions
3. **The ==answer key==**

Nobody hand-writes a worksheet, so the page and the paper can never ==disagree==. Your
follow-along notes are made the same way, from this lecture's own file.

**Q4 (multiple choice).** The site builds an activity's web page, worksheet, and answer key from
one Markdown file. What's the point of doing it that way?

- a) It makes the files smaller
- ✅ b) The page and the paper can never disagree
- c) Only the instructor can read Markdown

✅ **Answer.** One source means one truth: change the file, and the page, worksheet, and key all
change together.

### Rules for the AI

`CLAUDE.md` is a Markdown file of ==rules== the AI reads before it changes anything. A few of
them:

- "This repo is ==public==." Never commit passwords, codes, or names.
- "==American== spellings."
- Don't ==guess== a port label or menu path: mark it ==unverified==.
- Run the ==tests== before every save, and look at the result in a browser.

**Q5 (multiple choice).** What is `CLAUDE.md`?

- a) The website's home page
- ✅ b) A Markdown file of rules the AI reads before it changes anything
- c) A list of every student's work

✅ **Answer.** `CLAUDE.md` holds the repo's rules for the AI: public repo, no guessing gear details,
run the tests, check it in a browser.

### The words you need

| Word | What it means |
|---|---|
| ==repo== | A project folder, with its whole history |
| ==commit== | One save, plus a ==note== about what changed |
| ==fork== | Your own ==copy== of someone else's repo |
| ==pull request== | "Here's my change; please bring it into yours" |
| ==merge== | The owner ==accepts== the change |

Every saved change is a ==commit==, and the history keeps every one.

**Q6 (multiple choice).** Which one is your own copy of someone else's repo, under your account?

- a) commit
- ✅ b) fork
- c) merge
- d) pull request

✅ **Answer.** A fork is your own copy. A commit is one save, a pull request asks the owner to take
your change, and a merge is the owner saying yes.

**Q7 (fill in the blank).** One save in a repo, plus a note about what changed, is called a
==commit==.

✅ **Answer.** A commit is one save with a note, and the repo's history keeps every one, so any
change can be found and undone.

**Q8 (multiple choice).** You open a pull request on someone's repo. What has to happen before your
change is part of their repo?

- a) Nothing; it's already in
- ✅ b) The owner reviews it and merges it
- c) You fork it again

✅ **Answer.** A pull request is a request: the owner decides, and merging is the owner saying yes.

> 🌀 **Portal: the history from the terminal.** You can read and write this history without a
> browser: `git log`, `git commit`, `git push`. That's how AI coding agents do it, and it's
> Vibecoding 2.

### One repo, one thing

The simulators you've used are their own ==repos==, each its own small site:

- [camera-lab](https://adamborecki.github.io/camera-lab/)
- [mixer-lab](https://adamborecki.github.io/mixer-lab/)
- [Salmon](https://adamborecki.github.io/salmon/)

Each repo does ==one thing==, so a change to one can't ==break== another.

**Q9 (short answer).** Why are camera-lab, mixer-lab, and this course site separate repos instead
of one big one?

✅ **Answer.** Each repo does one thing, so a change to one can't break another, and each can be
worked on (and fixed) on its own.

### 🙈 How a change gets in

1. ==Fork== the repo (button at the top right on GitHub)
2. ==Edit== in your browser: open a file and click the ✏️ ==pencil==, or **Add file → Create new
   file**
3. ==Commit== your change, with a short ==note==
4. Open a ==pull request== back to the original
5. The instructor ==reviews== it and ==merges== it. Then it's ==live==.

### 🙈 Public means public

This repo is ==public==: anyone can read every file and every old ==version==. Deleting something
later doesn't remove it from the history. Never commit passwords, access codes, door codes,
stream keys, real names, grades, or anything about a classmate.

### 🙈 You've already been using version history

Every activity page and worksheet shows a ==revised== date ("Rev. 2026-10-14"). If you're holding
a ==printed== worksheet from three weeks ago, that ==date== tells you it isn't the current version.

## 2. A Finished Example: COB

### What went in

For the Chapman on Broadway (==COB==) show in Irvine, the AI got:

- ==Photos== from the gig: the booth, the receivers, the wedges, the cases
- **Notes**: a long, ==dictated== paragraph, plus the student crew's quick-reference doc
- **A one-line ==prompt==**: "Make a mixer-lab scenario and a gig checklist for this."

### What came out

- A [COB Gig Checklist](../../cob-gig-checklist/): ==equipment==, setup steps in order,
  photos, troubleshooting
- A COB scenario in [mixer-lab](https://adamborecki.github.io/mixer-lab/) to ==practice== the board
  before the gig

Look at what it did **not** do:

- It replaced students' names with ==roles==, and blurred ==faces== in the photos
- Anything it couldn't ==confirm== went in a section called ==Technical verification==, instead of
  being guessed

**Q10 (multiple choice).** What three things did the AI get to build the COB checklist?

- a) A finished checklist, a template, and a video
- ✅ b) Photos from the gig, dictated notes, and a one-line prompt
- c) Only the student crew's names

✅ **Answer.** Photos, dictated notes, and a one-line prompt: the same recipe works for any gig.

**Q11 (fill in the blank).** In the COB checklist, anything the AI couldn't confirm went in a
section called ==Technical verification==.

✅ **Answer.** Unconfirmed details get marked as open questions, not guessed: a student will follow
this page in a room where the show happens once.

**Q12 (multiple choice).** How did the COB build handle the students in the photos and notes?

- a) It listed their names in the checklist
- ✅ b) It replaced names with roles, and blurred faces
- c) It left the photos out entirely

✅ **Answer.** The repo is public, so people become roles ("sound engineer") and faces get blurred
before anything is committed.

## 3. A Live Build: The Electroacoustic Showcase

### Same recipe, starting now

Same recipe as COB, for the **10/18 ==Electroacoustic Showcase==**: ==photos==, ==dictated notes==,
and a ==one-line prompt==.

It runs in the ==background== while we keep going. We'll ==check== what it made near the end.

> 🧑‍🏫 In Claude Code (claude.ai/code, with mus248 and mixer-lab attached): upload the showcase
> photos, paste your dictated notes, then: "Make a mixer-lab scenario and a gig checklist for the
> 10/18 Electroacoustic Showcase from these photos and my notes. Follow CLAUDE.md. Preview, don't
> merge: send me the branch preview link." Glance at the photos for faces or screens first.
> (There's also an `electroacoustic-showcase` repo from Oct 12, if you want to show or reuse it.)

> 🌀 **Portal: queues and steering.** While an agent works you don't have to wait: send your next
> message and it waits in a **queue**, or interrupt to **steer** it. Vibecoding 2.

## 4. Markdown, by Example

### A real file

The top of the COB checklist, trimmed a little, as it's written in its file:

```
## 🎚️ What this is

The gig checklist for a **Chapman on Broadway (COB)** musical-theater
show in Irvine: twelve performers on **wireless headset mics**.

- **SD8 OUT 1** → the performers' **wedges**
- **SD8 OUT 7 and 8** → a **Yamaha StagePas 600BT**

## 🗝️ Key terms

**AES50** · **stage box** · **input routing** · **mix bus**
```

Readable ==as-is==: `##` starts a ==heading==, `**` makes text ==bold==, and `-` starts a ==bullet==.

**Q13 (fill in the blank).** In Markdown, a line that starts with `##` is a ==heading==.

✅ **Answer.** Markdown is plain text with a few symbols: `##` for a heading, `**` for bold, `-`
for a bullet.

### Your notes are Markdown too

The blanks on your follow-along notes are words marked like this in the lecture's file:

```
Every saved change is a ==commit==.
```

The slides show the word; your notes print a ==blank==. One file, two ==outputs==.

**Q14 (multiple choice).** You paste an AI's answer into Canvas and see `**phantom power**`,
asterisks and all. What happened?

- a) The AI made a typo
- ✅ b) The AI wrote Markdown, and Canvas showed the symbols instead of the formatting
- c) Canvas doesn't allow bold text

✅ **Answer.** AI tools answer in Markdown. Where Markdown isn't turned into formatting, you see the
raw symbols, like `**`.

### 🙈 The whole cheat sheet

| Type this | You get |
|---|---|
| `## Gear list` | A ==heading== |
| `**phantom power**` | **phantom power** (==bold==) |
| `*optional*` | *optional* (==italic==) |
| `- XLR cable` | A ==bullet== |
| `1. Power on the F8` | A ==numbered== step |
| `[Salmon checklist](link)` | A ==link== |
| `![caption](photo.jpg)` | A ==picture== |

## 5. The Ethics of AI

### Your choice

My preference is that nobody is ==required== to use AI if they don't want to.

Today is an ==exception==: we're going to use ==PantherAI==. It's simply too powerful for us not
to use it. You'll work in ==groups== of 2–3, so one person can drive while the others test and
think.

> 🌀 **Portal: AI on your own computer.** Some models run **offline**, on your own laptop: free,
> and nothing you type leaves the machine. They're smaller and slower. A later lecture.

**Q15 (multiple choice).** What's this class's general approach to using AI?

- a) Everyone has to use it for everything
- ✅ b) Nobody is required to use it if they don't want to; today's PantherAI activity is an exception
- c) It's banned, even today

✅ **Answer.** Nobody is required to use AI here. Today is an exception, because PantherAI is too
powerful not to learn, and you're in groups, so not everyone has to drive.

### Your brain on AI

Leaning on AI for thinking you could do yourself has a real risk: the potential for ==cognitive
decline==. Skills you stop using get weaker, and early research suggests heavy reliance on AI can
mean less thinking, not just less typing.

So it's very important to be ==thoughtful== about how you use it.

- Using it to ==cheat== is bad. Using it to get ==help== is good.
- A good prompt: "Help me ==understand== this without giving me the answers."
- Go at least ==three== rounds of replies, sometimes more: ask, push back, ask again.

**Q16 (fill in the blank).** A prompt that gets help without cheating: "Help me understand this
without giving me the ==answers|answer==."

✅ **Answer.** Use AI to understand, not to skip the thinking: ask it to explain without handing
you the answers, and keep the conversation going for at least three rounds.

### Weightlifting vs. forklifting

A good rule of thumb for whether to use AI:

| | ==Forklifting== | ==Weightlifting== |
|---|---|---|
| The point is… | just getting it ==done== | doing it ==yourself==, so you ==grow== |
| Like… | filling out a form, ==routine== monotonous work | practice, homework, learning a skill |
| AI? | probably a ==good== use | do the heavy lifting yourself |

Nobody gets stronger by watching a forklift lift the weights.

**Q17 (multiple choice).** Which of these is "forklifting," where AI is probably a good fit?

- a) Practicing gain staging until it's second nature
- ✅ b) Reformatting a long list of file names to match the naming convention
- c) Answering this refresher

✅ **Answer.** Forklifting is when the point is just getting it done (routine, monotonous work):
a fine job for AI. Weightlifting is when the point is your own growth: do it yourself.

### Bias

AI learns from huge amounts of human ==writing==, so it picks up that writing's ==bias==: whose
voices are common, and whose are ==missing==.

- It sounds just as ==sure== when it's wrong or one-sided
- Be most careful with anything it says about ==people==

**Q18 (fill in the blank).** Because AI learns from huge amounts of human writing, it picks up that
writing's ==bias|biases==.

✅ **Answer.** AI repeats the bias in what it learned from, and sounds just as sure when it's
one-sided, so check anything it says about people.

### Environmental cost

Every AI answer runs in a ==data center== that uses ==electricity==, and ==water== for cooling.

- ==Bigger== models and more "thinking" use more
- Clear, small asks in a ==fresh== chat use less

**Using less is the habit that's cheaper, faster, and kinder to the planet.**

**Q19 (multiple choice).** Which of these uses the least AI (and the least energy)?

- a) A long chat with the biggest model on maximum thinking
- ✅ b) A clear, small question in a fresh chat
- c) Pasting a whole project into every message

✅ **Answer.** Smaller, clearer asks in fresh chats use less: less electricity and water, and
they're usually faster too.

### Honesty and privacy

- ==Disclose== when you used AI, like the note at the top of this lecture
- You ==own== what you hand in, mistakes included
- Never paste ==private== things into an AI: names, door codes, passwords, recordings of
  people
- Follow each ==assignment=='s own AI ==rules==

**Q20 (short answer).** Name one thing you should never paste into an AI tool, and why.

✅ **Answer.** Private information (a name, a door code, a password, a recording of a person):
once it's sent, you can't take it back.

**Q21 (fill in the blank).** When you've used AI on something you hand in, you should ==disclose==
it.

✅ **Answer.** Say when you used AI, like the note at the top of this lecture, and you still own
what you hand in, mistakes included.

> 🧑‍🏫 Say your own rule for AI on quizzes out loud here.

## 6. Working with AI

### Models

A ==frontier model== is one of the newest, most capable models from the big labs:
Anthropic (Claude), OpenAI (ChatGPT), Google (Gemini).

Claude comes in sizes: ==Haiku== (small), ==Sonnet== (middle), ==Opus== (largest).
==PantherAI== gives you the highest **Claude Sonnet** available (Sonnet 5, right now): very good,
just not the biggest.

**Q22 (fill in the blank).** One of the newest, most capable models from the big AI labs is called
a ==frontier model|frontier==.

✅ **Answer.** "Frontier" means the leading edge: the newest, most capable, and most expensive
models to run.

**Q23 (multiple choice).** Which is the smallest of Claude's three sizes?

- ✅ a) Haiku
- b) Sonnet
- c) Opus

✅ **Answer.** Haiku is small, Sonnet is the middle, Opus is the largest. PantherAI gives you the
highest Sonnet.

### The context window

The ==context window== is everything the AI can "==see==" at once: your messages, its
replies, and anything you pasted. It can't see this site, your files, or your screen
unless you paste them.

When a chat gets long or confused, start a ==new chat== with a short summary.

**Q24 (fill in the blank).** Everything an AI can "see" at once (your messages, its replies, and
whatever you pasted) is its ==context window==.

✅ **Answer.** The context window is all the AI can see. In a long chat, early instructions fade,
so start a fresh chat with a short summary.

**Q25 (multiple choice).** Your PantherAI chat is very long, and it keeps ignoring a rule you gave
at the start. Best move?

- a) Repeat the rule in ALL CAPS
- ✅ b) Start a new chat with a short summary and your current file
- c) Keep going; it will catch up

✅ **Answer.** A fresh chat puts your rules back at the front of the context window.

### Effort and usage

| Uses more | Uses less |
|---|---|
| A ==bigger== model, like ==Sonnet== or ==Opus== | A ==smaller== model, like ==Haiku== |
| More thinking ==effort== | Less thinking effort |
| Long chats, big pastes | ==Fresh== chats, only what's needed |

More isn't always ==better==. For a small, clear job, less is faster and just as good.

> 🌀 **Portal: the settings gear.** In PantherAI, look for a gear ⚙️ next to the model name. If
> there's a thinking or effort setting there, that's this slide. Coding agents (Vibecoding 2) use
> far more than a chat: they read whole repos.

> 🧑‍🏫 Confirm what Chapman's PantherAI shows under the gear before class.

### 🙈 Chatbot vs. coding agent

| | ==Chatbot== (e.g. PantherAI, ChatGPT) | Coding ==agent== (e.g. Claude Code) |
|---|---|---|
| Sees | Only what you ==paste== or upload | The whole ==repo== |
| Does | Writes a reply you ==copy== somewhere | ==Edits== files, runs commands, runs ==tests==, commits |
| You check | Its ==answer== | Its changes, the tests, the result on ==screen== |

### 🙈 Thinking effort

Some AI tools can ==think== before answering. More ==effort==: better on ==hard== problems,
==slower==, uses more. Less effort: fine for ==simple==, clear requests.

## 7. Checking the Live Build

### What did it make?

Open the preview link from the build we started, and read the new checklist together.

- Does it match what actually happened at the showcase?
- What did it put in ==Technical verification==?
- Find ==one== thing that's wrong, missing, or guessed.

> 🧑‍🏫 If it isn't finished, show what it has so far, and come back to it next week.

### Done means checked

**AI sounds equally ==confident== when it's right and when it's wrong.**

It's done when a ==person== opened it and ==checked== it, not when the AI says "this works!"

**Q26 (multiple choice).** Your group's bad tuner looks great in the AI's reply. When is it done?

- a) When the AI says it works
- ✅ b) When you've opened it, on a phone too, and it does what you asked
- c) When the code is long enough

✅ **Answer.** Same as soundcheck: you trust it after you've tested it yourself, not because it
sounds sure.

### 🙈 Where vibecoding bites

Real kinds of mistakes this course site has had to ==catch==:

- A well-written ==procedure== that the room's own ==SOP== contradicted
- A tiny ==bug== that would have quietly stopped the quiz ==adapting==, weeks later
- A ==photo== that showed an account name in the ==background==

## 8. Activity: Bad Webapps

### So bad it's good

In your group, make a tiny ==webapp== that is **bad on ==purpose==**, and bad in a way that's
actually good:

- A ==metronome== that slowly drifts
- A ==tuner== that insults you
- A ==mirror== that's two seconds late
- A calculator that's always off by a little
- A cable generator that's all spaghetti

It has to ==work== at being bad. A tuner that insults you still has to listen.

### 🙈 The rules (for the shared repo, later)

- **One app, one folder:** `apps/your-app-name/index.html`
- **Prompt ==budget==:** [number — set in class]
- **Start from `STARTER.md`** in the repo
- **No real names** in the app or the files. Your GitHub ==username== is enough.

### How to do it

1. Pick your bad idea
2. Open the [Playground](../../playground/), tap **Copy the ==starter prompt==**, and paste it into
   ==PantherAI== with your idea
3. Copy the AI's code into the Playground, press ==Run==, and try it, on a phone too
4. Tell the AI exactly what to change, and run it again
5. When it's gloriously bad, tap **Copy ==share link==**

> 🧑‍🏫 Where the share links go (a Canvas discussion, an assignment, or GitHub Issues later) is
> still to be decided. Say it here, and set a prompt budget if you want one.

**Q27 (multiple choice).** You've got your app's code from PantherAI. How do you try it?

- a) Email it to yourself
- ✅ b) Paste it into the Playground and press Run
- c) Upload it to Canvas

✅ **Answer.** The Playground runs pasted code right away, and its share link carries the whole app,
so anyone can open it.

### Make every prompt count

| ❌ Spends a prompt | ✅ Earns its prompt |
|---|---|
| "make it ==better==" | "The drift is too fast to notice. Make it drift about 1 BPM every 4 bars, and keep everything else the same." |
| "it doesn't ==work==" | "On my phone, tapping Start does nothing. On my laptop it works." |
| Three new ideas at once | ==One== change, then test |

**Q28 (short answer).** Rewrite this prompt so it earns its place: *"make it better."*

✅ **Answer.** One specific change, plus what you saw. For example: "The tuner's insults repeat
too often. Give it 20 different ones, and keep everything else the same."

> 🌀 **Portal: from playground to repo.** Next, your app gets its own folder in a shared
> bad-webapps repo: you fork, add your file, and open a pull request. Vibecoding 2.

### This week

1. **Finished an activity or a checklist?** Fill out the ==Repo Improvement== form
2. **Follow-along notes:** take photos of your filled-in notes and submit them on Canvas
3. **Online refresher:** on this lecture's page, tap 🔁 **Online refresher**, then copy the Canvas
   deliverable into the Canvas assignment (due dates are on Canvas)
4. **Bad webapp:** finish it with your group, and hand in its ==share link==
5. **Repo Improvement:** the form is the start; the full assignment is coming. Early volunteers
   welcome.

## 🗝️ Key terms

**repo** · **commit** · **fork** · **pull request** · **merge** · **Markdown** · **frontier model** ·
**context window** · GitHub Pages · Technical verification

## 💭 Before you leave

- What will your group's bad webapp be, and what makes it bad?
- One way you'll use AI less, or more carefully, this week.
