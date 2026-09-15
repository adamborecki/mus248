---
id: dante-walkie-basic
title: "Dante Walkie-Talkie — Basic"
emoji: "🎙️"
coreSkillAreas:
  - Live Sound
  - Audio Capture
status: In Development
estimatedTime: "25–35 minutes"
access:
  mode: In class
  location: "OH B01 — needs 2 networked computers, each with an external audio interface and a microphone."
  supervision: "Instructor/TA supervision recommended the first time — Dante networking can be flaky."
groupSize:
  minimum: 2
  ideal: "2"
  maximum: 2
  solo: false
activityFamily: "Dante Activities"
level: ""
roundsSupported: true
---

> 🧪 **Status: In Development.** Based on a recording of the instructor building this live in class. Reorganized into the standard MUS 248 activity structure with AI assistance (Claude). Not yet reviewed by the instructor — steps, terminology, and troubleshooting may contain errors.

**Prerequisite:** Dante Broadcast — do that one first.

## 🎚️ Core skill area

**Live Sound** — live mic input, signal routing.

## 🎯 What you'll practice

By the end of this activity, you should be able to:

- Capture live microphone audio through an external audio interface and send it, live, over a Dante network to another computer.
- Use Dante Controller's Device View to confirm a channel is actually transmitting (not just routed).
- Recognize that a working Dante connection can drop for no obvious reason, and that restarting Dante Virtual Soundcard is often the fix.

## 📍 Logistics

**Estimated time:** 25–35 minutes.

**Where:** OH B01, with 2 networked computers, each with an external audio interface and a microphone. Best completed during class with instructor/TA supervision the first time — Dante networking can be flaky, and troubleshooting is easier with support nearby.

**Group size:** Exactly 2 — one student per computer.

**Roles:** After your first successful connection, swap which computer is transmitting vs. receiving and repeat the full procedure.

## 🧰 Equipment and materials

- [ ] 2 computers, Dante-networked, with DVS and Dante Controller installed
- [ ] An external audio interface on each computer (e.g., an audio interface with a mic input)
- [ ] A microphone plugged into the transmitting computer's interface
- [ ] A DAW on each computer
- [ ] Headphones or speakers on the receiving computer
- [ ] (optional) Video tutorial — scroll down to the bottom for extra help/videos to watch

## 🚀 Get ready

1. Identify each computer's Dante device name (System Settings > Sharing > Local Hostname, or just look at Dante Controller's device list).
2. Launch Dante Virtual Soundcard on both computers and click Start. Confirm both show up, online, in Dante Controller.
3. Plug your microphone into the transmitting computer's audio interface.

## 📋 Follow the procedure

> ⚠️ Not yet proofread — treat as a starting point, not a verified answer key.

1. Transmitting computer: in your DAW, set the audio interface as your input device and Dante Virtual Soundcard as your output device.
2. Create an audio track and set its input to the mic's channel (e.g., channel 1).

**Q1 (multiple choice).** What problem would happen if you left this track set to stereo, but your mic is only plugged into channel 1?

- a) Nothing, it works exactly the same either way
- b) You'd only get signal in one side of the stereo image, with the other side silent
- c) Dante would refuse to route it
- d) The DAW would crash

3. In Dante Controller, filter Transmitters to your computer, and filter Receivers to the other computer.
4. Route your transmit channel(s) to the receiving computer's input channel(s) — check Device View first to make sure you're not reusing a channel someone else already has in use.

🚩 **Checkpoint.** In Device View, your channel should show as actively transmitting (green) before you continue.

5. Receiving computer: set the DAW's input device to Dante Virtual Soundcard, output device to headphones/speakers.
6. Create an audio track, set its input to match the routed Dante channel(s), and enable input monitoring.

🚩 **Checkpoint.** Talk into the mic on the transmitting computer — your partner should hear you live, in real time, on the receiving computer.

### Role switch

Swap seats and repeat steps 1–6 so the other student also configures a transmit and receive chain.

## 🛠️ Troubleshooting

**IF the receiving computer hears nothing:**
→ Open Device View — is your channel actually green/transmitting? If not, try stopping and restarting Dante Virtual Soundcard.
→ Check the routing squares in Dante Controller are green, not gray.
→ Double check DAW input/output devices on both computers.
→ Check input monitoring is enabled on the receiving track.

**IF things suddenly stop making sense in Logic:**
→ Double-check your I/O — sometimes changing the output also changes the input unintentionally.

**IF it worked, then suddenly stopped:**
→ This happens even to experienced engineers — try quitting and relaunching Dante Virtual Soundcard, or re-clicking the routing. Restarting things often just fixes it, even without a clear explanation why.

## 📹 Video tutorials (if you get stuck)

A student who tried an earlier version of this activity said the videos were genuinely helpful — worth a look if you're stuck. Both are recordings of the same live class session, filmed once from each computer.

| Video | Duration | What it covers |
|---|---|---|
| [180906 Dante Walkie Talkie on IM-13.mov](https://drive.google.com/file/d/1JMHDIjXSPu3YrEAL_RzTaGH51L_6h2im/view?usp=sharing) | ~16 min | The transmitting side of the session: setting up DVS, Dante Controller, and Logic's I/O to send live mic audio out over Dante, including real troubleshooting (a connection that worked one day and not the next). |
| [180906 Dante Walkie Talkie on IM-18.mov](https://drive.google.com/file/d/1175XDFv_n8iIhvDOIv4Uo3dEAV0PaPl1/view?usp=sharing) | ~12 min | The same session filmed from the receiving computer: confirming the connection in Dante Controller's Device View and hearing the transmitted audio come through live. |

## 🧹 Finish, reset, cleanup

- Stop and close your DAW session.
- Leave routing in Dante Controller as instructed, or clear it.
- Unplug and return the microphone, coil cables properly.
- Leave both workstations ready for the next pair.

## 💭 Before you leave

- What would you check FIRST if your walkie-talkie stopped working mid-activity?

## 🤖 AI use disclosure

Based on a video recording of the instructor building this activity live in class (filmed from both computers involved). Reorganized into the standard MUS 248 activity structure with AI assistance (Claude), including the checkpoints, questions, and troubleshooting steps. Not yet reviewed by the instructor.
