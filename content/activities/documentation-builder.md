---
id: documentation-builder
title: "Documentation Builder (pilot)"
emoji: "🧪"
coreSkillAreas: []
status: In Development
revised: "2026-10-14"
estimatedTime: "45–90 minutes for one section"
access:
  mode: "Any location"
  location: "Reading and editing anywhere. Hands-on testing only where the document you pick already allows it."
  supervision: "Whatever the document you test requires. This activity gives you no extra room access or equipment permission."
groupSize:
  minimum: 1
  ideal: "2–3"
  maximum: 3
  solo: true
activityFamily: ""
level: "Pilot"
roundsSupported: false
---

> 🧪 **Status: Pilot.** This is the first version of this activity, and its own instructions are
> being tested along with everything else. If a step here is confusing, that counts as a finding:
> write it down and report it the same way you'd report a problem in any other page.

## 🌍 Why this matters

Most of the instructions on this site were drafted with AI help from the instructor's notes, then
corrected. Some steps are confirmed against the real gear. Others were never tested. A working
engineer's real job includes this: following a procedure in the room, noticing exactly where it
stops matching reality, and leaving a better one for the next person.

This is **verification and technical writing**, not polishing prose. A page that reads nicely
but tells someone to press the wrong button is worse than an ugly one that's right.

## 🎯 What you'll practice

- 🔎 Testing one written procedure against the actual equipment or room, and recording exactly
  where it stops working.
- ✍️ Rewriting a section as clear numbered steps, each with something you can see or hear when
  it's done.
- 🧾 Keeping three things separate: what you **observed**, what you **suggest**, and what is
  still **unknown**.
- 🤝 Watching a peer follow your revision with as little coaching as possible.

## 🗝️ Key terms

**activity** · **checklist** · **reference** · **observation** · **suggestion** ·
**verification status** · **blocker** · **peer test** · revision · AI-use disclosure

## 📚 Three kinds of document

An **activity** teaches: what to practice, the starting conditions,
a numbered learning procedure, and what success looks like. A **checklist** runs a real job: short
ordered actions and checks, no lessons. A **reference** explains: equipment facts, diagrams,
settings, troubleshooting. A good activity *links to* its checklist and references instead of
copying their steps.

## 🏷️ Verification status

Mark every step you touch with one of these:

| Mark | Means |
|---|---|
| ✅ Verified | You did it today, on the real gear or the named simulator, and it worked as written. |
| 📝 Proposed | You changed it, and haven't yet re-tested the changed version. |
| ❓ Unverified | It was in the source, and you didn't get to test it. |
| ⛔ Blocked | You couldn't test it, and you say why (no access, gear missing, needs an instructor). |

## 📍 Logistics

**Time:** 45–90 minutes for one section. Pick something small. One working section is the
goal, not a whole page.

**Where.** The kind of work decides where you can do it:

| Setting | What you can do there |
|---|---|
| 🏠 At home | Read the source, find gaps and contradictions, draft the revision. Anything you test at home is a *desk check*: physical steps stay ❓ Unverified until someone tries them on the gear. |
| 🏫 On campus, during class | Hands-on testing with the instructor in the building. This is Monday's version. |
| 🔑 On campus, outside class | Only where the document you picked **already** says you can work outside class. "Confirm with instructor" on a page means ask first. |

Being on campus doesn't mean you can get into a room or use its gear. Each page's own **Access**
and **Supervision** lines still apply.

**Two routes:**

- **Early pilot (before Monday, October 19).** Volunteers, solo or in small groups, wherever
  access allows. You're testing **two things at once**: the document you pick, *and* this
  activity's own instructions. Report problems with both. Early testing may count toward
  instructor-approved extra credit or make-up work. The instructor decides what counts and how
  much, so check with Borecki before relying on it.
- **Monday in class.** Groups of 2–3, hands-on, in the room the document is about.

**Roles.** Rotate them so everyone does real work:

- **Operator** — hands on the gear, follows the steps exactly as written.
- **Documenter** — records what happened, word for word where it matters.
- **Peer tester** — follows the *revised* steps later, with minimal coaching.

In a pair, combine roles and swap halfway. Solo, you're operator and documenter, and you find a
peer tester later (or mark it pending; see step 8).

## 🧰 Starter kit

Everything is a plain Markdown (`.md`) text file. No GitHub account or login needed. Open them in
any text editor, or paste them into a chatbot.

- [PROJECT_STARTER.md](../../documentation-builder/downloads/PROJECT_STARTER.md) — the prompt
  that sets up an AI assistant for this job. It also works as a plain checklist if you're editing
  by hand.
- [ISSUE_REPORT.md](../../documentation-builder/downloads/ISSUE_REPORT.md) — one form for any
  problem: a wrong step, a broken app, or a door you couldn't get through.
- [SUBMISSION_REPORT.md](../../documentation-builder/downloads/SUBMISSION_REPORT.md) — the short
  companion report you hand in with your revised Markdown.

**Using AI (optional).** The default is **PantherAI** (PantherAI.Chapman.edu): pick the
highest-numbered **Claude Sonnet** model it offers. Any other AI tool you can use is fine too.
You don't need a paid subscription, Claude Code, or a local model. **A chatbot can't open
this site or GitHub for you.** Paste or upload the starter *and* your source text together. The
"starter + source" download below bundles both into one file for that reason.

**Not using AI** is just as valid. Follow the same steps in any text editor. Python or other local
tools can help with formatting or checking links. They can't verify anything about the
equipment. Only testing in the room does that.

## ⚠️ Ground rules — read before you start

- 🚫 **Never invent** a result, a setting, a port label, a menu path, an access permission, a
  source, or a peer's feedback. "I don't know yet" is a complete, honest answer. Write it down.
- 🔒 **No improvised equipment changes.** If a step needs a setting the page says not to touch, or
  a room you don't have access to, stop and mark it ⛔ Blocked. A finished-looking assignment is
  not worth a changed preamp before a recital.
- 🧩 **Your revision is a proposal.** The instructor decides what becomes the approved procedure.
  Peers test your steps; they don't approve them, and they don't grade you.
- 🙈 **Keep private things out of the document.** No names, door codes, passwords, stream keys,
  or account details in the revised Markdown. Use a group label ("Group C, Oct 19"). Your name
  goes in Canvas, not in the document.
- 🧱 **Keep the working parts.** Don't rewrite steps that already work. Keep exact room names,
  equipment names, and labels as they appear on the gear.

## 🧭 Procedure

### 1. Choose one thing to test

Pick **one** section from the starter menu below, or one your instructor assigns, and say exactly
what you'll test. "Part 2 of Basic Stereo Recording, the gain-staging drill, on the stereo kit
in class." Not "the stereo page."

Check the location labels before you commit. A 🏠 desk-check item works anywhere; a hands-on
item needs its room and gear.

🚩 **Checkpoint.** You've written down one section title, the page it's on, and where you'll
test it.

**Q1 (multiple choice).** A page lists every button on the Zoom F8's front panel, what each one
does, and why, with a diagram, but gives no order to do anything in. Which type of document is
it?

- a) Activity
- b) Checklist
- ✅ c) Reference

### 2. Save the starting version

Download the **starter + source** bundle from the starter kit. It records the page's URL and
its **revised** date for you. If you're testing something that isn't on this site, save a
copy of it and write down where it came from and when.

🚩 **Checkpoint.** You have a saved copy of the source as it was *before* you changed anything,
with its URL and revised date.

### 3. Assign roles

Decide who's operator, documenter, and peer tester (see **Logistics**). Plan when you'll swap.

🚩 **Checkpoint.** Everyone in the group has a role and knows when they swap.

### 4. Read the steps and say what success looks like

Read the section through once without touching anything. Note its limits: what it says *not*
to do, and what access it needs. Then write one sentence: *if this works, we'll see / hear …*

🚩 **Checkpoint.** You've written what a successful run should look or sound like, before you
start.

### 5. Do it, exactly as written

Follow the steps as written, not as you think they meant. At the first point where the
instructions are **missing, confusing, contradictory, outdated, or don't match the equipment**,
record:

- the exact step (number or quoted text)
- what you expected
- what actually happened, in plain words
- evidence if it's allowed: a photo of a label or screen (whole frame checked for private info)

Then keep going if it's safe to, or stop and mark the rest ⛔ Blocked.

🚩 **Checkpoint.** Every problem you hit is written down with the exact step and what you
observed.

**Q2 (multiple choice).** Which of these is an **observation**, not a suggestion?

- a) "Step 4 should say to hold the switch longer."
- ✅ b) "We held the power switch for 1 second and the F8 stayed off; at about 2 seconds it turned on."
- c) "The F8 probably needs a firmware update."
- d) "The AI said this step is confusing."

### 6. Draft a focused revision

Use AI, edit by hand, or both. Keep the steps that worked. Fix only what your test showed. Where
steps were missing, add explicit numbered steps, each ending in something you can check ("the
meter peaks between −12 and −6 dBFS"). Mark every changed step 📝 Proposed. Keep your
observations, suggestions, and open questions in separate lists.

🚩 **Checkpoint.** Your revised section is a complete Markdown file, and every changed step is
marked 📝 Proposed.

**Q3 (fill in the blank).** You rewrote step 6 but haven't tried the new version yet. Its
verification status is ______.

✅ **Answer.** Proposed (📝). It only becomes Verified once someone has re-run the changed step
and it worked.

### 7. Re-test the changed steps

Run just the steps you changed, using your revision. Update each mark: ✅ Verified if it worked,
back to the drawing board if it didn't. List anything you couldn't re-test.

🚩 **Checkpoint.** Every changed step is now either ✅ Verified or has a written reason it isn't.

### 8. Peer test

Give your revised section to someone who **didn't** write it. Let them follow it with as little
coaching as possible. Note every place they pause, misread, or ask for help. Those are your next
fixes.

No peer available during the early pilot? Write **"Peer test: pending"**. Never write down a
reviewer or feedback that didn't happen.

🚩 **Checkpoint.** You've recorded where your peer paused, or written "Peer test: pending."

### 9. Submit

Hand in, through the Canvas assignment:

1. **The revised Markdown**, the whole document with your changes. If your source isn't
   Markdown (a diagram's data file, an app), submit a Markdown *change proposal* that names the
   exact file and entry it's about. Editing a Markdown description doesn't change the diagram
   or app itself.
2. **The companion report** (`SUBMISSION_REPORT.md`): source and revision, what changed and why,
   tests and results, unresolved questions, peer test, your own contribution and reflection, and
   your AI-use disclosure (or "No AI used").
3. **Feedback on this activity:** anything in *these* instructions that tripped you up.

**Pilot default for groups**, pending instructor review: one shared revised document per group,
plus each person's own short contribution, reflection, and disclosure in Canvas.

**Didn't finish?** Submit the draft anyway, with the blocker and the next useful step. Careful
testing and honestly documented open problems can earn full credit without a finished procedure.

**Have a GitHub account?** Optional. You can also open an issue or a pull request on the
[course repository](https://github.com/adamborecki/mus248), using the same report fields. That's
public, so use a group label and leave out personal reflections. Canvas is still where the
assignment is graded.

🚩 **Checkpoint.** Revised Markdown and companion report are submitted, or saved and ready to
submit.

### 10. Reset the space

Put every piece of gear back the way the page's own **Finish, reset, put away** section says
(or the way you found it). Turn off what you turned on, and nothing else.

🚩 **Checkpoint.** The room is ready for the next group.

## 🆘 Stuck?

Go in this order:

1. **Write down the exact obstacle**: the step, what you saw, what you expected. That's a finding,
   not a failure.
2. **Check a page that's already linked** from the one you're testing (its references,
   troubleshooting, or the activity it came from).
3. **Ask a peer.**
4. **Ask the instructor** when it needs a decision, an access permission, or a setting you've
   been told not to touch.

**Equipment or room unavailable?** Switch to a 🏠 desk-check item from the starter menu, or
write up the blocked test with `ISSUE_REPORT.md`. A well-documented blocked test is a valid
submission. Don't make up results, and don't improvise around a restriction to finish.

## ✅ Definition of done

- 🚩 One bounded section was tested against the real gear, or desk-checked with that limit stated.
- 🚩 Every changed step carries a verification mark: Verified, Proposed, Unverified, or Blocked.
- 🚩 Observations, suggestions, and open questions are in separate lists.
- 🚩 A peer test happened, or it's honestly marked "pending."
- 🚩 Revised Markdown and companion report, with AI-use disclosure, are submitted or ready to submit.
- 🚩 The equipment and room are reset.

## 💭 Before you leave

- The one step in your section most likely to trip up the next person, and why.
- One thing about *this* activity's instructions you'd change.

## ⚙️ Technical verification

- **PantherAI model list.** The instructor's default is the highest-numbered Claude Sonnet model
  PantherAI offers. Which models are actually available there hasn't been checked from this
  repo. The starter is written to work with any capable chat model.
- **Downloads on phones.** The starter kit downloads use the browser's own file save. Checked
  in desktop Chromium. iOS Safari and Android behavior is unchecked, which is why every download
  also has a **Copy** button and a show-the-text fallback.
- **Settings labels.** Only the pages in the starter menu, plus the three gig checklists, carry
  where-you-can-do-it labels so far, each mapped from what that page's own Logistics/Access text
  says. Anything not stated is marked "Confirm with instructor," not guessed.
- **Canvas assignment.** Not published yet. Deadline, points, and extra-credit equivalencies are
  instructor decisions.

## 🤖 AI use disclosure

Drafted by AI (Claude, via Claude Code) from the instructor's written handoff for this pilot,
using the existing activity format and the site's own pages for the starter menu. The procedure,
roles, and rules follow that handoff. The starter-menu suggestions were picked by AI from
sections that already exist, and the instructor hasn't reviewed them yet. Nothing in this page
has been tested with students yet. The early pilot is that test.
