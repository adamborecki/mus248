> 🤖 **AI use:** drafted with Claude Code from the instructor's notes (a planning conversation on
> Oct 20). Part 2 of the Vibecoding series. The students' work this week uses no AI.

> 🧑‍🏫 **Draft for Oct 26.** Target is 30–45 minutes: Announcements ~5, section 1 ~12, section 2 ~6,
> section 3 ~15 (the shared activity), section 4 ~8. Watch-only through section 2, then everyone
> does section 3. Three things this lecture links to don't exist yet: the Gear Dating Profile
> generator, the stock bad webapp, and WTF 248. Each slide that needs one says "link coming" until
> it does. Section 4 waits on the Performance Evaluation session. Present with **Presenter view**
> (`?presenter=1`): the notes column on the right fills in as you go.

## 📣 Announcements

### Homework review

**Today:** Week 10 · Class 9

**After today:** 5 classes (4 + 1 meeting in finals week)

Everything due this week, with due dates: **see Canvas**.

- **Your `mus248-sandbox` site**, live with four files, no AI (today's section 1 and 2)
- **Follow-along notes:** photos of today's notes, on Canvas
- **Online refresher for Vibecoding 1:** open since this morning. Copy the Canvas deliverable into
  the Canvas assignment
- **Finished an activity or a checklist?** Fill out the Repo Improvement form

### I read your feedback

Thank you. I read every response, and it changes what we do.

Two things I heard:

- **AI can feel impersonal**, just knowing that it's AI. Fair. Today is shorter, and it's me
  talking, not a wall of slides.
- **Mixer Lab has bugs**, so it's hard to tell whether *you're* doing it wrong or the simulator is.
  Also fair, and it's next on my list.

### You're already ahead

Compared with past classes at this point in the semester, you have:

- more **camera** experience, from hands-on activities and Camera Lab
- more **mixer** experience, even with Mixer Lab's problems
- a wider look at more kinds of gigs, and more preparation for them

That's three things working together: your **honest feedback**, AI, and plain experience. This
class gets better every semester.

### Mixer Lab is next

Coming up: a **more realistic** interface, and showing how what you learn there carries over to
the real mixers you'll use on gigs.

Until then: if Mixer Lab and a real board disagree, the **==real board==** wins. Tell me on the
Repo Improvement form.

**Q1 (multiple choice).** Mixer Lab shows one thing and the real mixer in the room shows another.
Which do you trust?

- a) Mixer Lab, because it was built for this class
- ✅ b) The real board, and you report the difference on the Repo Improvement form
- c) Whichever one your group agrees on

✅ **Answer.** The real board wins. Mixer Lab still has bugs, and reporting the difference is how
it gets fixed.

### Planning further ahead

Some weeks get more prep time than others. That's the honest truth of teaching while gigs happen.

The new lecture system lets me plan weeks ahead, so lectures are ready earlier and **shorter**.
New today: the notes on the right side of the screen fill in as we go, so you can always catch up.

## 🎤 Lecture: Vibecoding 2

### Vibecoding 2: Going Live

Last week you made a bad webapp with AI. Today you put things on the internet **yourself**, with
**no ==AI==**.

### Today

1. Your own website
2. Markdown vs. HTML
3. Fix WTF 248
4. What the final looks like

## 1. Your Own Website

### One repo, four files

Everyone makes **one** repo, named exactly **`mus248-sandbox`**. Its address:
`your-username.github.io/mus248-sandbox/`

| File | What it is |
|---|---|
| `bad-webapp.html` | Your group's bad webapp. Everyone in the group publishes their **own ==copy==** |
| `gear-dating-profile.html` | A dating profile for a piece of gear (slide 1.5) |
| `index.html` | Your home page: links to the other two |
| `README.md` | What this repo is, for people looking at it on GitHub |

Free hosting for a repo is called **==GitHub Pages==**. Missed the bad webapp? Use the stock one
(link coming).

**Q2 (fill in the blank).** Everyone's practice repo has the same name: ==mus248-sandbox==.

✅ **Answer.** One repo, `mus248-sandbox`, with four files. Same name for everyone, so anyone can
find your site from your username.

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

**Q3 (fill in the blank).** To turn a repo into a website, open the repo's Settings and turn on
==Pages|GitHub Pages==.

✅ **Answer.** Settings → Pages → deploy from main. A minute later the repo is a website.

### When it doesn't work

| What you see | Check this |
|---|---|
| **404** | Wait a minute. Then check the file name, letter for letter: `bad-webapp.html`, all ==lowercase== |
| Your code shows up as **text** | The file name must end in `.html`, not `.txt` |
| "Pages isn't available" | The repo has to be **==Public==** |
| An old version | Refresh. It can take a minute to update |

**Q4 (multiple choice).** You turned on Pages 10 seconds ago, and your link shows a 404. What do
you do first?

- a) Delete the repo and start over
- ✅ b) Wait a minute, then check the file name letter for letter
- c) Ask an AI to fix your code

✅ **Answer.** Pages takes about a minute. After that, a 404 almost always means the file name or
the link doesn't match exactly.

### Public means public

Your site is on the **public internet**. Anyone can find it.

- Your **GitHub ==username==** or a ==persona== is plenty
- No full name, phone, address, or schedule
- Nothing you wouldn't put on a poster on campus

When in doubt, ==leave it out==.

**Q5 (multiple choice).** Which is fine to put on your `mus248-sandbox` site?

- a) Your full name and phone number, so people can book you
- ✅ b) Your GitHub username and a made-up bio for a cable
- c) Your class schedule

✅ **Answer.** It's the public internet: a username or a persona is plenty. When in doubt, leave
it out.

### Your gear dating profile

Pick a piece of gear. Fill in its profile. Pick colors, a photo, a bio. The preview updates as you
go. Then **Copy ==HTML==** and paste it into `gear-dating-profile.html`.

> *XLR cable, 25 ft. Balanced, in every sense. Looking for: a ==phantom==-powered connection.
> Turn-offs: being wrapped around an elbow.*

Same move as the Playground: get ==source code== from somewhere, and publish it yourself.

The generator: link coming.

> 🧑‍🏫 The generator is yours to build (form → live preview → localStorage → Copy HTML, in its own
> repo). Put its link here when it's live.

## 2. Markdown vs. HTML

### Same link, two languages

| | Markdown (`.md`) | HTML (`.html`) |
|---|---|---|
| A heading | `# My sandbox` | `<h1>My sandbox</h1>` |
| Bold | `**loud**` | `<strong>loud</strong>` |
| A link | `[My app](bad-webapp.html)` | `<a href="bad-webapp.html">My app</a>` |

Markdown is **==shorthand==** for people. HTML is what the ==browser== actually reads, with every
part spelled out in **==tags==**.

**Q6 (multiple choice).** Which one is an HTML link?

- a) `[My app](bad-webapp.html)`
- ✅ b) `<a href="bad-webapp.html">My app</a>`
- c) `**My app**`

✅ **Answer.** HTML spells a link out in an `<a>` tag; Markdown writes the same link as
`[text](address)`.

### README vs. index.html

| | `README.md` | `index.html` |
|---|---|---|
| Who reads it | People looking at your ==repo== on github.com | People visiting your ==site== |
| Where it shows | Under the file list on GitHub | At `your-username.github.io/mus248-sandbox/` |
| Written in | Markdown | HTML |

Same repo, two ==audiences==.

**Q7 (multiple choice).** Someone opens `your-username.github.io/mus248-sandbox/`. Which file do
they see?

- a) `README.md`
- ✅ b) `index.html`
- c) `bad-webapp.html`

✅ **Answer.** The site's address opens `index.html`. The README is for people looking at the repo
on GitHub.

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

**Q8 (short answer).** Your README and your `index.html` both have a link in them. Write the same
link both ways: once in Markdown, once in HTML.

✅ **Answer.** Markdown: `[My app](bad-webapp.html)`. HTML: `<a href="bad-webapp.html">My app</a>`.
Same link; HTML spells out every part.

## 3. Fix WTF 248

### Meet WTF 248

**WTF 248** is a parody copy of this course site, cut down to the skills on the midterm and the
final. Somebody broke its checklists on purpose:

> *4.3 Start a small fire on stage for ambiance. (Obviously don't. This is a test.)*

Your job: find **one** broken step, fix it, and ==propose== the fix to the repo's owner.

WTF 248: link coming.

### Fork, fix, pull request

1. Open WTF 248 on GitHub and press **==Fork==**: your own copy
2. In your fork, open a checklist's `.md` file and press the ✏️ pencil
3. Fix one broken step. Check the **Preview** tab
4. **Commit changes**, with a note that says what you changed and why
5. **Contribute → Open ==pull request==**

The owner reads it and decides whether to ==merge== it. That's the whole job of a pull request.

**Q9 (multiple choice).** You want to change a repo you don't own. What do you make first?

- ✅ a) A fork
- b) A pull request
- c) A merge

✅ **Answer.** Fork first: your own copy to change. The pull request then asks the owner to bring
your change in.

### What a good fix looks like

- **==One== fix** per pull request
- The note says **==what and why==**: *"Step 4.3 said to start a fire. Changed it to: turn on the stage
  lights."*
- Leave the rest of the page alone. Same format, same numbering style

The real checklists on this site use the **same ==format==**. Next comes Repo Improvement on MUS 248
itself: a fix you make could be what next semester's students follow in Salmon.

**Q10 (short answer).** Write the commit note for a fix to this step: *"2.1 Plug the XLR cable
into the power outlet."*

✅ **Answer.** Something like: "Step 2.1 said to plug the XLR into the power outlet. Changed it to:
plug the XLR into the mic input on the mixer." What changed, and why, in one line.

## 4. What the Final Looks Like

### Like the midterm

The final works like the midterm: you **==show==** specific skills, one at a time. The goal is that
everyone who passes MUS 248 can work the normal gig types.

The skills list: coming.

> 🧑‍🏫 Placeholder for the Performance Evaluation session's skills list (midterm and final). The
> Big Picture lecture's preliminary areas: Salmon A/V and livestream, a Standard Gear Kit recording,
> Musco with multicamera, basic live sound / FOH, data management and post, troubleshooting and gig
> conduct. Budget about 10 minutes of discussion here.

**Q11 (multiple choice).** What will the final look like?

- a) A written test on one gig type you choose
- ✅ b) Like the midterm: you show specific skills, one at a time
- c) A group project

✅ **Answer.** Like the midterm: individual skills, across the normal gig types.

### Why WTF 248 is cut down to these

WTF 248 keeps only the pages for the skills on the final. Fixing its checklists means reading the
same steps you'll be **==tested== on**, with the jokes taken out.

## 🗝️ Key terms

**GitHub Pages** · **`mus248-sandbox`** · **HTML** · **Markdown** · **README** · **`index.html`** ·
**fork** · **pull request** · **merge**

## 💭 Before you leave

- What piece of gear gets your dating profile, and what's its biggest turn-off?
- Find one thing on this site that's wrong or unclear. Save it: that's your first Repo Improvement.
