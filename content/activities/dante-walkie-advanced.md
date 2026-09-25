---
id: dante-walkie-advanced
title: "Dante Walkie-Talkie — Advanced"
emoji: "🔁"
coreSkillAreas:
  - Live Sound
  - Post Production
status: In Development
revised: "2026-09-20"
estimatedTime: "25–40 minutes"
access:
  mode: In class
  location: "OH B01 — needs 2 networked computers, each with an audio interface and mic."
  supervision: ""
groupSize:
  minimum: 2
  ideal: "2"
  maximum: 2
  solo: false
activityFamily: "Dante Activities"
level: ""
roundsSupported: false
---

> 🧪 **Status: In Development.** Built out from the instructor's Walkie-Talkie Basic recording, extending the one-way setup into a two-way one with AI assistance (Claude). Not yet reviewed by the instructor — steps, terminology, and troubleshooting may contain errors.

**Prerequisite:** Dante Walkie-Talkie — Basic — do that one first.

## 🎚️ Core skill area

**Live Sound** (advanced live routing) and **Post Production** (basic vocal-chain processing, bonus).

## 🎯 What you'll practice

By the end of this activity, you should be able to:

- Extend a one-way Dante audio link into a true bidirectional connection, with both computers transmitting and receiving at the same time.
- Build and read a signal-flow diagram for a two-way networked audio setup.
- (Bonus) Apply basic vocal-chain processing — noise gate, compressor, low-cut filter, de-esser, limiter — to a live signal.

## 📍 Logistics

**Estimated time:** 25–40 minutes.

**Where:** OH B01, during class, using 2 Dante-networked computers each with an audio interface and mic. If using speakers instead of headphones, be aware of feedback risk — see Troubleshooting.

**Group size:** Exactly 2. Unlike the Basic activity, both students work on their own computer simultaneously this time — each configures their machine as both a transmitter and a receiver.

## 🧰 Equipment and materials

- [ ] 2 computers, Dante-networked, each with an audio interface, mic, and headphones (or speakers, advanced)
- [ ] A DAW on each computer
- [ ] Your working one-way setup from the Basic activity

## 🚀 Get ready

1. Confirm your one-way Dante Walkie-Talkie from the Basic activity is still working in at least one direction before attempting both directions at once.
2. Decide who is "A" and who is "B" — you'll both be doing the same thing to each other simultaneously.

## 📋 Follow the procedure

> ⚠️ Not yet proofread — treat as a starting point, not a verified answer key.

1. Keep your existing one-way chain running (e.g., A → B).
2. Now build the reverse direction at the same time: Computer B's mic becomes an additional transmit source, and Computer A adds a receive track for it.

🚩 **Checkpoint.** In Dante Controller, you should now see green routing squares in both directions between the two devices.

3. Each computer now needs two tracks live at once: one track routed mic → Dante out (your send), and one track routed Dante in → headphones/speakers (your receive).

🚩 **Checkpoint.** Talk on Computer A — B hears you. Talk on Computer B — A hears you. No manual switching required.

**Q1 (multiple choice).** Real walkie-talkies are technically half-duplex — they can't transmit and receive at the same instant. Is what you just built actually a walkie-talkie, or something else?

- a) Yes, exactly the same thing
- ✅ b) No — this is full-duplex, more like a phone call, since both directions work at once
- c) No — this isn't audio at all
- d) There's no meaningful difference

### Bonus: clean up your signal

4. Insert a Noise Gate on your mic input track. Set the threshold by ear so background noise is cut when you're not talking.
5. Add a Compressor, Low-Cut Filter, and/or De-esser to your vocal chain. Listen before/after each — what changed?
6. Add a Limiter at the end of the chain as a safety net against sudden loud peaks.

### Super advanced (optional)

7. If you're brave enough to use speakers instead of headphones, try a sidechain compressor (or other dynamics processing) to automatically reduce feedback risk.

## ✅ Definition of done

- A signal-flow diagram of your final bidirectional setup: mic → interface → DAW → Dante Virtual Soundcard → network → Dante Virtual Soundcard → DAW → speakers, drawn for both directions.
- A photo or short video showing it working (both people talking and hearing each other).

## 🛠️ Troubleshooting

**IF you get feedback/howling:**
→ Are you on speakers instead of headphones? Lower monitor volume, or switch to headphones.
→ Check for an accidental routing loop (your own output feeding back into your own input).

**IF one direction breaks while you're setting up the second:**
→ Isolate the problem — re-verify the original one-way direction from the Basic activity still works before troubleshooting the new direction.

## 📹 Video tutorials (if you get stuck)

There are currently no video files for this activity. (The Basic activity's recordings show the instructor discussing the two-way goal as homework, but don't actually demonstrate this bidirectional/advanced setup being built.)

## 🧹 Finish, reset, cleanup

- Stop and close your DAW sessions on both computers.
- Leave routing in Dante Controller as instructed, or clear it.
- Unplug and return microphones, coil cables properly.
- Leave both workstations ready for the next pair.

## 💭 Before you leave

- What's the actual difference between a "one-way broadcast" and a true "two-way" connection, in terms of what you had to set up twice?

## 🤖 AI use disclosure

Built out from the instructor's Walkie-Talkie Basic recording, which ends with the instructor describing the two-way goal as homework rather than demonstrating it. This activity's bidirectional procedure was drafted with AI assistance (Claude) to extend that goal into concrete steps, but — unlike the Basic activity — it has not been verified against an actual two-way build. Not yet reviewed by the instructor.
