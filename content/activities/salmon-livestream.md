---
id: salmon-livestream
title: "Salmon: Livestream"
emoji: "📡"
coreSkillAreas:
  - Video Capture
  - Audio Capture
  - Live Sound
status: In Development
revised: "2026-10-09"
estimatedTime: "15–25 minutes"
access:
  mode: On campus
  location: "Control room BH 208/209 — the livestream computer and the ATEM."
  supervision: "Practice runs never go On Air. A real gig's stream is set up by an engineer who has done a practice run first."
groupSize:
  minimum: 1
  ideal: "1–2"
  maximum: 3
  solo: true
activityFamily: "Salmon Recital Hall"
level: "Vimeo · ATEM Software Control · Canvas"
roundsSupported: false
---

> 🧪 **Status: In Development.** Rewritten from a student engineer's dictated walkthrough of the
> current process, replacing the old SOP's steps (the account switch, the Live Events folder, and
> the test-event password are all gone). A few exact details — where the stream key goes in the
> ATEM software, and the Canvas page itself — are still open. See **Technical verification**.

## 🎚️ Core skill area

**Video Capture**, **Audio Capture**, and **Live Sound** — getting a Salmon recital onto a Vimeo livestream and in
front of its audience on Canvas, on top of the usual capture.

## 🌍 Why this matters

Some gigs in Salmon are also streamed live — usually for family who can't be in the room. The
stream is three systems that have to agree with each other: **Vimeo** hosts it, the **ATEM**
sends the picture and sound to it, and **Canvas** is the page the audience actually opens. Get
any one of the three wrong and the stream is either dark or nobody can find it.

The good news: it's short. Once you've done it once, the whole setup is a few minutes.

## 🎯 What you'll practice

- 📺 Create a Vimeo live event set up for an external encoder.
- 🔑 Find its stream key and get it into ATEM Software Control.
- 🧩 Copy the embed code and put it on the Canvas livestream page.
- 🔴 Know exactly which button starts the stream, and which one ends it.

## 🗝️ Key terms

**live event** · **external encoder** · **stream key** · **embed code** · **On Air** · Vimeo ·
ATEM Software Control · HTML editor

## 📍 Logistics

**Time:** 15–25 minutes for a practice run. On a real gig, do this during **Initial setup**,
well before doors — see **Salmon Gig Checklist**.

**Where:** the livestream computer in the control room, BH 208/209.

**Sign-in:** the livestream computer is normally already signed in to Vimeo (check the account
menu in the top right). If it's ever signed out, the login is [VIMEO LOGIN — ask instructor].
Don't sign it out when you're done.

## ⚠️ Before you touch anything

- 🔴 **On Air is the go-live button.** Nothing reaches the audience until you click it, and it
  goes out live the moment you do. On a practice run, **never click On Air**.
- 🧩 **On a practice run, don't touch Canvas.** The Canvas livestream page is the one the audience
  uses. Only a real gig's embed code goes there.
- 🔒 **The Vimeo event has no password.** Access is controlled on the Canvas side, so don't paste
  the Vimeo link anywhere public.

## 📺 Part 1 — Create the event in Vimeo

1. On the livestream computer, open Vimeo. Check that it's signed in (top right).
2. Click **Create**, then **Event**.
3. Choose the event type: **Live broadcast**.
4. Under **Live broadcast settings**, it will offer **Stream from your browser** or **Use an
   external encoder**. Change it to **Use an external encoder**. It never defaults to that —
   you'll always have to change it.
5. Name the event **the name of the gig** — no date numbers, just the name. Vimeo auto-saves every
   event you create, so a real name is how the next person tells them apart. On a practice run,
   name it something that's obviously a test.
6. Click **Create**.

🚩 The event exists, is set to **Use an external encoder**, and has the gig's name.

**Q1 (multiple choice).** Under **Live broadcast settings**, which option do you choose?

- a) Stream from your browser
- ✅ b) Use an external encoder
- c) Leave whatever it defaults to
- d) It doesn't matter as long as the ATEM is on

**Q2 (short answer).** Why does the event get a real name instead of something generic like
"Livestream"?

✅ **Answer.** Vimeo auto-saves every event that gets created, so generic names pile up and
nobody can tell one gig's event from another. Naming it after the gig keeps them identifiable.

## 🔑 Part 2 — Stream key into the ATEM

1. On the event's page in Vimeo, open the **Settings** tab on the right. The **stream key** is
   there.
2. Copy the stream key.
3. Open **ATEM Software Control** and paste the stream key into its livestream settings. (The
   exact panel is still being confirmed — see **Technical verification**.)

🚩 The ATEM software has the stream key from **this** event, not a leftover from an earlier one.

**Q3 (fill in the blank).** Once the event is created, the stream key is in the ________ tab, on
the ________ side of the page.

✅ **Answer.** Settings · right.

## 🧩 Part 3 — Embed it on Canvas

*Real gig only — skip this part on a practice run.*

1. Back on the Vimeo event, click **Embed** in the top right corner.
2. Click **Copy embed code** in the window that pops up.
3. Open the **Canvas livestream page** and click **Edit**.
4. Switch to the **HTML editor**.
5. Scroll all the way down and replace **line 11 and everything below it** with the embed code you
   copied. Leave lines 1–10 alone.
6. Click **Save**.

🚩 The Canvas page is saved with the new embed code.

## 🔴 Part 4 — Go live, and end

*Real gig only — on a practice run, stop at Part 2.*

1. In ATEM Software Control, click **On Air**. That's the go-live button: it starts sending the
   picture and sound from the ATEM to Vimeo. There's no separate "go live" step in Vimeo.
2. Confirm it's actually running — the stream should be playing on the Canvas page.
3. **To end the stream, go off air in ATEM Software Control.** That's it — there's no separate
   step in Vimeo to end the event.

🚩 You can say which button starts the stream and which ends it, without looking.

**Q4 (multiple choice).** What actually starts the livestream?

- a) Clicking **Create** in Vimeo
- b) Saving the Canvas page
- ✅ c) Clicking **On Air** in ATEM Software Control
- d) Copying the embed code

**Q5 (multiple choice).** The Vimeo event has no password. Where is access to the stream
controlled?

- a) In the ATEM software
- b) In the Vimeo event's Settings tab
- ✅ c) On the Canvas side
- d) It isn't — anyone can watch

**Q6 (short answer).** A practice run is over. What did you deliberately **not** do, and why?

✅ **Answer.** Didn't click **On Air** (that sends the stream out live) and didn't put the embed
code on the Canvas livestream page (that's the page the audience uses). A practice run is just
creating the event and getting its stream key into the ATEM.

## ✅ Definition of done

- 🚩 A Vimeo event exists with a real name, set to **Use an external encoder**.
- 🚩 Its stream key is in ATEM Software Control.
- 🚩 Practice run: nothing went On Air and Canvas wasn't touched. Real gig: the embed code is saved
  on the Canvas page, the ATEM is On Air, and the stream plays there.
- 🚩 Vimeo is still signed in on the livestream computer.

## 💭 Before you leave

**On Air** in the ATEM software is the only thing that sends anything to the audience — and going
off air there is the only thing that stops it.

## ⚙️ Technical verification

**Confirmed since the last pass** (from the instructor and a student engineer's dictated
walkthrough, October 2026):

- The livestream computer stays signed in to the right Vimeo account; no account or team switch
  is needed. The old "College of Performing Arts" → **Live Events** → "Salmon Recital Hall
  Livestream" steps are gone.
- **Create → Event → Live broadcast**, then **Live broadcast settings → Use an external encoder**
  (it always needs changing).
- Event naming: just the gig's name, no date numbers.
- The stream key is on the created event's page, in the **Settings** tab on the right.
- There is no separate test area in Vimeo and no test-event password. The Vimeo event has no
  password; access is controlled on the Canvas side.
- **On Air** in ATEM Software Control is the go-live button; going off air there ends the event.
- The old embed settings (Chapman Red #A50034, viewer count turned off) no longer apply.

**Still open:**

- **Where in ATEM Software Control the stream key goes** — the exact tab/panel, and whether the
  platform/server field needs setting too (or only the key).
- **How you go off air** — whether it's the same **On Air** button clicked again or a separate
  control.
- **The ATEM hardware checks** carried in the old SOP — ATEM Extreme ISO powered on, Ethernet
  connected, USB-C to the iMac. Not re-confirmed in the new walkthrough.
- **The Canvas livestream page** — which course and page it is, whether students have edit access
  or the instructor does this step, and what lines 1–10 hold. "Replace line 11 and below" is the
  walkthrough's instruction as given; it breaks the first time someone edits the top of the page,
  so it should become a description of what to keep.
- **What a practice run can confirm.** Read here as: create a throwaway event, get its stream key
  into the ATEM, and **don't** go On Air or touch Canvas. That means a practice run can't check
  that picture and sound actually reach Vimeo. Whether a practice run may go On Air to a
  throwaway event that isn't embedded anywhere is not yet confirmed.
- **When to go On Air on a real gig** — the walkthrough goes On Air during setup to confirm the
  stream runs. Whether it then stays on air through doors and the show, or goes on air closer to
  downbeat, isn't confirmed.
- **Whether old events should be cleaned out of Vimeo**, given that it auto-saves every one.
- **Audio levels for the stream** — the old SOP said not to adjust the preamps, and that the ATEM
  Extreme ISO's input level could be changed if necessary. Not re-confirmed.
- **Whether this activity assumes Salmon: Basic A/V Capture** as a prerequisite.

The old source SOP's livestream section is in `content/activities/_source/bh209-salmon-sop.txt`,
under "Prepare Livestream Test" and "Prepare Real Livestream". It's superseded by this page.

## 🤖 AI use disclosure

Drafted by AI from a student engineer's dictated walkthrough of the current Vimeo → ATEM → Canvas
process and the instructor's answers to follow-up questions, then restructured into the site's
activity/worksheet format. The step order, button names, and the no-password / Canvas-gates-it
policy come from them. The ATEM software's stream-key panel and the Canvas page details are left
open rather than guessed. Pending instructor review before treating any of it as final.
