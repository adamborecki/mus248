> 🤖 **AI use:** outlined with Claude Code from a planning conversation with the instructor (Oct
> 20–21). The instructor writes the slides from this outline. Part 2 of the Vibecoding series. The
> students' work this week uses no AI.

> 🧑‍🏫 **Outline draft for Oct 26: write it in your voice.** Bullet fragments are prompts for what
> to say; rewrite them as slides. Reference material (the click steps, the file table, the
> troubleshooting table, the two starters) is meant to be close to final. Section 3 is the
> roughest, since the activity isn't settled. No refresher questions yet: they get written from your
> final text (refresher opens Nov 2). Target 30–45 minutes: Announcements ~5, section 1 ~12,
> section 2 ~6, section 3 ~15 (the shared activity), section 4 ~8. Three links don't exist yet:
> the Gear Dating Profile generator, the stock bad webapp, and WTF 248. Present with **Presenter
> view** (`?presenter=1`).

## 📣 Announcements

### Homework review

**Today:** Week 10 · Class 9

**After today:** 5 classes (4 + 1 meeting in finals week)

Everything due this week, with due dates: **see Canvas**.

- **Your `mus248-sandbox` site**, live with four files, no AI (today's sections 1 and 2)
- **Follow-along notes:** photos of today's notes, on Canvas
- **Online refresher for Vibecoding 1:** open since this morning. Copy the Canvas deliverable into
  the Canvas assignment
- **Finished an activity or a checklist?** Fill out the Repo Improvement form

### I read your feedback

- Thank you: I read all of it, and it changes what we do
- "AI feels impersonal" → fair. Today: shorter, me talking
- "Mixer Lab bugs: is it me or the simulator?" → fair, next slide

### You're already ahead

vs. past classes at this point in the semester:

- more **camera** experience (hands-on activities, Camera Lab)
- more **mixer** experience (even with Mixer Lab's problems)
- more kinds of gigs, more prep for them

Why: your honest feedback + AI + experience. This class gets better every semester.

### Mixer Lab is next

- Coming: a more realistic interface, and how it carries over to real mixers
- Until then: Mixer Lab and a real board disagree → the **==real board==** wins
- Tell me on the Repo Improvement form

### Planning further ahead

- Some weeks get more prep than others (teaching while gigs happen)
- New lecture system → planned further ahead, ready earlier, shorter
- New today: the notes on the right fill in as we go

## 🎤 Lecture: Vibecoding 2

### Vibecoding 2: Going Live

- Last week: a bad webapp, with AI
- Today: on the internet **yourself**, with **no ==AI==**

### Today

1. Your own website
2. Markdown vs. HTML
3. Fix WTF 248
4. What the final looks like

## 1. Your Own Website

### One repo, four files

Everyone makes **one** repo, named exactly **`mus248-sandbox`**:
`your-username.github.io/mus248-sandbox/`

| File | What it is |
|---|---|
| `bad-webapp.html` | Your group's bad webapp. Everyone in the group publishes their **own ==copy==** |
| `gear-dating-profile.html` | A dating profile for a piece of gear (slide 1.5) |
| `index.html` | Your home page: links to the other two |
| `README.md` | What this repo is, for people looking at it on GitHub |

- Free hosting for a repo: **==GitHub Pages==**
- Missed the bad webapp? The stock one (link coming)

### Publish it

1. github.com → **+** → **New repository** → name it `mus248-sandbox` → **==Public==** → turn on
   **Add a README** → **Create**
2. **Add file → Create new file** → name it `bad-webapp.html` → paste your code →
   **==Commit== changes**
3. **Settings → ==Pages== → Deploy from a branch → main → / (root) → Save**
4. Wait about a minute, then open `your-username.github.io/mus248-sandbox/bad-webapp.html` on your
   ==phone==

Getting your code out of the Playground: open your share link → **See the code** → select all →
copy.

> 🧑‍🏫 Rehearse these clicks once on a fresh repo before class. GitHub moves buttons, and the exact
> labels on the new-repository page change more often than anything else here.

### When it doesn't work

| What you see | Check this |
|---|---|
| **404** | Wait a minute. Then check the file name, letter for letter: `bad-webapp.html`, all ==lowercase== |
| Your code shows up as **text** | The file name must end in `.html`, not `.txt` |
| "Pages isn't available" | The repo has to be **==Public==** |
| An old version | Refresh. It can take a minute to update |

### Public means public

- Public internet: anyone can find it
- GitHub **==username==** or a ==persona==: plenty
- No full name, phone, address, schedule
- Poster-on-campus test
- When in doubt, ==leave it out==

### Your gear dating profile

- Pick a piece of gear → fill in its profile → colors, photo, bio → live preview
- **Copy ==HTML==** → paste into `gear-dating-profile.html`
- e.g. *XLR cable, 25 ft. Balanced, in every sense. Looking for: a ==phantom==-powered connection.
  Turn-offs: being wrapped around an elbow.*
- Same move as the Playground: get ==source code== from somewhere, publish it yourself
- The generator: link coming

> 🧑‍🏫 The generator is yours to build (form → live preview → localStorage → Copy HTML, in its own
> repo). Put its link here when it's live.

## 2. Markdown vs. HTML

### Same link, two languages

| | Markdown (`.md`) | HTML (`.html`) |
|---|---|---|
| A heading | `# My sandbox` | `<h1>My sandbox</h1>` |
| Bold | `**loud**` | `<strong>loud</strong>` |
| A link | `[My app](bad-webapp.html)` | `<a href="bad-webapp.html">My app</a>` |

- Markdown: **==shorthand==**, for people
- HTML: what the ==browser== reads, every part spelled out in **==tags==**

### README vs. index.html

| | `README.md` | `index.html` |
|---|---|---|
| Who reads it | People looking at your ==repo== on github.com | People visiting your ==site== |
| Where it shows | Under the file list on GitHub | At `your-username.github.io/mus248-sandbox/` |
| Written in | Markdown | HTML |

- Same repo, two ==audiences==

### Your index.html

Copy this into a new file named `index.html`, then change the words to your own:

```
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My MUS 248 sandbox</title>
  </head>
  <body>
    <h1>My MUS 248 sandbox</h1>
    <p>Two things I made. No AI this time.</p>
    <ul>
      <li><a href="bad-webapp.html">Our bad webapp</a></li>
      <li><a href="gear-dating-profile.html">My gear dating profile</a></li>
    </ul>
  </body>
</html>
```

### Your README.md

Click the README, then the ✏️ pencil. Write something like this, and check the **==Preview==** tab
before you commit:

```
# mus248-sandbox

My practice site for MUS 248: https://your-username.github.io/mus248-sandbox/

## What's here

- Our bad webapp, made with: username1, username2
- My gear dating profile

## Known bug

The metronome drifts. That's the point.

## To do

- [x] Publish the bad webapp
- [ ] Publish my gear dating profile
- [ ] Fix one thing in WTF 248
```

## 3. Fix WTF 248

### Meet WTF 248

- A parody copy of this site, cut down to the skills on the midterm and final
- Its checklists are broken on purpose, e.g. *"4.3 Start a small fire on stage for ambiance.
  (Obviously don't. This is a test.)"*
- Your job: find **one**, fix it, ==propose== the fix
- WTF 248: link coming

> 🧑‍🏫 Roughest section: the activity isn't settled. Decide how many fixes each student makes,
> whether groups share one, and whether you merge a few live on the projector.

### Fork, branch, fix, pull request

1. Open WTF 248 on GitHub → **==Fork==** (your own copy)
2. In your fork: a checklist's `.md` file → ✏️ pencil
3. Fix one broken step → **Preview** tab
4. **Commit changes** → choose **Create a new ==branch== for this commit** → name it for the fix,
   like `fix-step-4-3`
5. **Open ==pull request==** → the owner decides whether to ==merge== it

> 🧑‍🏫 Rehearse step 4 and 5 on a fork before class: confirm the commit dialog's branch option and
> that the pull request's base is WTF 248's `main`, not your fork's.

### Branches

- A branch: a copy of the files where you try an idea **without touching ==main==**
- Like a duplicate playlist to try an edit
- One fix = one branch = one ==pull request==
- Name it for what it fixes: `fix-step-4-3`
- On MUS 248, a pushed branch even gets its own ==preview== link before anything goes live

### What a good fix looks like

- **==One== fix** per pull request
- The note says **==what and why==**: *"Step 4.3 said to start a fire. Changed it to: turn on the
  stage lights."*
- Leave the rest of the page alone
- The real checklists here use the **same ==format==** → next: Repo Improvement on MUS 248 itself
- A fix you make could be what next semester follows in Salmon

## 4. What the Final Looks Like

### Like the midterm

- Like the midterm: you **==show==** specific skills, one at a time
- Goal: everyone who passes can work the normal gig types
- The skills list: coming

> 🧑‍🏫 Placeholder for the Performance Evaluation session's skills list (midterm and final). The
> Big Picture lecture's preliminary areas: Salmon A/V and livestream, a Standard Gear Kit recording,
> Musco with multicamera, basic live sound / FOH, data management and post, troubleshooting and gig
> conduct. Budget about 10 minutes of discussion here.

### Why WTF 248 is cut down to these

- WTF 248 keeps only the pages for the final's skills
- Fixing its checklists = reading the steps you'll be **==tested== on**, jokes removed

## 🗝️ Key terms

**GitHub Pages** · **`mus248-sandbox`** · **HTML** · **Markdown** · **README** · **`index.html`** ·
**fork** · **branch** · **pull request** · **merge**

## 💭 Before you leave

- What piece of gear gets your dating profile, and what's its biggest turn-off?
- Find one thing on this site that's wrong or unclear. Save it: that's your first Repo Improvement.
