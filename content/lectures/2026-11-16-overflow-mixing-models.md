> 🤖 **AI use:** outline drafted with Claude Code from the instructor's planning messages (Nov 16)
> and photos, the new [Choir Room Overflow](../../choir-room-overflow-gig-checklist/) checklist,
> Lecture 3 (data management), Lecture 11, Post Mini 1, and the unfinished Live Sound Part 4.

> 🧑‍🏫 **Delivered Nov 16.** The last day of new material eligible for the final. Live Sound
> Part 4 stays shelved: only its "stereo board feed vs. multitrack" line made it in (2.1).
> Refresher questions (23) were written after class from this text. They stay off the ChatGPT
> names (third-party sources only) and the model prices (instructor note, not on a slide).

## 📣 Announcements

### Homework review

**Today:** Week 13 · Class 12

**After today:** 2 classes (1 + 1 meeting in finals week)

Everything due this week, with due dates: **see Canvas**.

> 🧑‍🏫 The rest of the announcements are in Google Slides.

## 🎤 Lecture: Overflow, Mixing, and Picking a Model

### Overflow, Mixing, and Picking a Model

The last new material of the semester: a new gig, how we mix what we record, and a vibecoding
update.

### Today

1. Choir Room Overflow
2. Three Kinds of Mix
3. Data Management: A Reminder
4. Vibecoding: Picking a Model

## 1. Choir Room Overflow

### When Salmon is full

- Some Salmon gigs sell out (==Mariachi== is the usual one)
- BH 109, the ==choir room==, becomes ==overflow== seating
- They watch on the room's ==projector== and hear it on the wall speakers
- The feed travels over a ==Zoom== meeting
- [Choir Room Overflow Gig Checklist](../../choir-room-overflow-gig-checklist/)

**Q1 (multiple choice).** When does BH 109 become overflow seating?

- a) Every Salmon gig
- ✅ b) When a Salmon gig sells out, like Mariachi
- c) Only when Salmon's speakers fail

✅ **Answer.** When a Salmon gig sells out (Mariachi is the usual one), the choir room becomes overflow: the show on its projector and wall speakers, over a Zoom meeting.

> 🧑‍🏫 [Why it matters / a story about a sold-out night]

### The signal flow

- Salmon room mics and cameras → the ==ATEM==
- ATEM's USB webcam out → the ==livestream computer== in BH 209
- In Zoom, the ATEM shows up as "==Blackmagic Design==": camera *and* microphone
- The meeting → the room PC in ==BH 109==
- Room PC → projector, and Ashly ==Ch.3== "PC/ZOOM" → Crown amp → wall speakers

**BH 109 hears the ATEM's ==program audio==.** Whatever the ATEM gets, overflow gets.

**Q2 (multiple choice).** What does the overflow audience in BH 109 hear?

- a) A separate mic set up in BH 109
- ✅ b) The ATEM's program audio: the Salmon room mics
- c) The Zoom F8's recording, played back later

✅ **Answer.** The ATEM's program audio, which is the Salmon room mics. Whatever the ATEM gets, overflow gets.

**Q3 (fill in the blank).** In Zoom on the livestream computer, the ATEM shows up as ==Blackmagic Design==, for both the camera and the microphone.

✅ **Answer.** The ATEM's USB webcam output appears in Zoom as "Blackmagic Design": pick it as the camera *and* the microphone.

### The sender: Zoom in BH 209

- Video → camera: ==Blackmagic Design==
- Audio → microphone: **Blackmagic Design** too
- Microphone mode: ==Original sound== for musicians
- ==High-fidelity== music mode **on** · ==Echo cancellation== **off** · ==Stereo== audio **on**
- Input volume all the way ==up==
- Check the banner: "Original sound for musicians: on"

**Q4 (multiple choice).** Which Zoom audio settings does the sender in BH 209 use?

- a) Noise removal, with echo cancellation on
- ✅ b) Original sound for musicians: high-fidelity on, echo cancellation off, stereo on
- c) Whatever Zoom picks automatically

✅ **Answer.** Original sound for musicians, with high-fidelity music mode on, echo cancellation off, and stereo on. Then check the banner says it's on.

> 🧑‍🏫 [Why not Noise removal: it's built for speech, and treats quiet passages and sustained notes
> as noise]

### The receiver: BH 109

- ==Borecki== starts the meeting, so ask ahead of time. You join it.
- Touch panel: Press here to begin → ==PC (Zoom)== → Projector **On** (the ==screen== comes down)
- Room PC: join the meeting, ==mute== the mic, stop ==video==
- Ashly **Ch.3** (PC/ZOOM): green light ==on==, level where it is
- Room volume: the Ashly's ==Stereo Output== knob
- The rack stays ==on==
- Photos of every step: the checklist

**Q5 (multiple choice).** In BH 109, what does the room PC do in the meeting?

- ✅ a) Joins with its mic muted and its video stopped
- b) Starts the meeting and shares its camera
- c) Joins with its mic on, so the booth can hear the room

✅ **Answer.** It joins the meeting Borecki started, with its mic muted and video stopped. The meeting should carry one thing: the hall.

**Q6 (fill in the blank).** In BH 109, the room volume for overflow is set on the Ashly's ==Stereo Output== knob.

✅ **Answer.** Ch.3 (PC/ZOOM) stays on and where it is; the room volume is the Ashly's Stereo Output.

## 2. Three Kinds of Mix

### Three kinds

1. ==Stereo== only: the pair is the recording
2. Stereo plus a ==board feed== (or spot mics): still basically a stereo mix
3. Full ==multitrack==: Jazz Combo, Big Band

A board feed captures the mixer's decisions as they happen. A multitrack lets you ==remix== later.

**Q7 (multiple choice).** Which kind of recording lets you remix the performance later?

- a) Stereo only
- b) Stereo plus a board feed
- ✅ c) A full multitrack

✅ **Answer.** A multitrack keeps every channel separate, so you can remix later. A board feed captures the mixer's decisions as they happen.

> 🧑‍🏫 [Which gigs land in which bucket]

### Stereo only: a limiter

- A ==limiter== on the ==master==: the stereo output, so it catches the whole mix
- Ceiling: **==−0.1== dB**
- Then **boost into it**: a ==gain== plugin before the limiter, or clip gain
- Turn the boost up until the loudest moment gets **2–6 dB** of ==gain reduction==
- The amount of boost changes with every recording; the gain reduction target doesn't
- Same idea as Post Mini 1's limiter step

**Q8 (multiple choice).** For a stereo-only recording, where does the limiter go?

- ✅ a) On the master (the stereo output), with its ceiling at −0.1 dB
- b) On each mic's track
- c) After the export, in Final Cut only

✅ **Answer.** On the master, the stereo output, so it catches the whole mix. Ceiling −0.1 dB.

**Q9 (multiple choice).** How do you get 2–6 dB of gain reduction from that limiter?

- a) Lower the limiter's ceiling until it's working
- ✅ b) Boost into it, with a gain plugin or clip gain, until the loudest moment gets 2–6 dB
- c) Turn up the master fader after the limiter

✅ **Answer.** Boost into the limiter with a gain plugin or clip gain. The amount of boost changes with every recording; the 2–6 dB target at the loudest moment doesn't.

**Q10 (fill in the blank).** Turn the boost up until the loudest moment gets 2–6 dB of ==gain reduction==.

✅ **Answer.** The target is 2–6 dB of gain reduction at the loudest moment, however much boost that takes.

### Variety shows: clip gain between pieces

- "Variety show" programs: ==Music at Noon==, solo guitar one minute, a full ensemble the next
- In the DAW, cut at the clear ==silence== between pieces
- ==Clip gain== each piece so they sit at a reasonable level together
- Between pieces only. **Never** inside a piece, and never between ==movements==
- Same ==instrumentation== all the way through (an all-piano recital, say): **don't** clip gain at all

**Q11 (multiple choice).** A Music at Noon program goes from solo guitar to a full ensemble. What do you do in the DAW?

- a) Clip gain inside each piece wherever it gets loud
- ✅ b) Cut at the clear silence between pieces and clip gain each piece
- c) Leave it, and let the limiter handle everything

✅ **Answer.** Cut at the silence between pieces and clip gain each piece so they sit together. Between pieces only: never inside a piece or between movements.

**Q12 (multiple choice).** An all-piano recital. Do you clip gain the pieces?

- ✅ a) No: it's the same instrumentation all the way through
- b) Yes, every piece to the same loudness
- c) Only the loudest piece

✅ **Answer.** No. With the same instrumentation throughout, leave the gain alone; the performer's dynamics are the music.

> 🧑‍🏫 [Why: the performer's dynamics are the music; we only even out the gaps between acts]

### Cleanup: iZotope RX

- ==iZotope RX== may be available. Use it when we can.
- Usually not needed; sometimes it saves a recording
- **==Spectral De-noise==**, set light
- How it works: it ==learns== the noise from a stretch of just the noise (room tone, no music)
- Then it takes out that noise, about **==2 dB==** of reduction. Light enough not to hear it working.

**Q13 (multiple choice).** How does Spectral De-noise work?

- ✅ a) It learns the noise from a stretch of just room tone, then takes out about 2 dB
- b) It cuts everything below a set frequency
- c) It turns the whole recording down 2 dB

✅ **Answer.** It learns the noise from a stretch with no music, then reduces that noise by about 2 dB: light enough not to hear it working.

> 🧑‍🏫 [Where RX lives / who has it. An example of when you needed it]

### Board feed: the same rules

- Stereo plus a board feed or spot mics: same rules as stereo
- Limiter, clip gain between pieces, light RX
- The balance between them is ==static== per piece
- Usually: set the balance ==once== and leave it for the whole concert
- Sometimes a different balance for a different ==piece==, never moving inside one

**Q14 (multiple choice).** With a stereo pair plus a board feed, how does the balance between them work?

- a) Ride it constantly to follow the music
- ✅ b) Static per piece: usually set once for the whole concert
- c) Automate it like a multitrack

✅ **Answer.** Static per piece. Usually set once and left for the whole concert; sometimes a different balance per piece, never moving inside one.

### Multitrack: ride the solos

- Only the Jazz Combo and Big Band get this
- ==Automation== on volume: bring each ==solo== up
- Everything else we mix is static
- Last week: the CL5 writes it, Latch then Read (Lecture 11)

**Q15 (fill in the blank).** For the Jazz Combo and Big Band multitracks, volume ==automation== brings each solo up.

✅ **Answer.** Only these two get automation, to ride the solos. Everything else we mix is static.

> 🧑‍🏫 [Anything else about the multitrack mix]

## 3. Data Management: A Reminder

> 🧑‍🏫 A recap of Lecture 3 (Data Management + Dante) and the Salmon Gig Checklist's Data transfer,
> plus one new slide (3.4).

### One source, two destinations

- Copy **everything** from each card or SSD
- Destination 1: the ==Post== drive
- Destination 2: the ==Backups== drive
- A drive can ==fail== at any time: one copy is not enough

**Q16 (multiple choice).** Why does everything get copied to two drives, Post and Backups?

- a) The Post drive is too small for everything
- ✅ b) A drive can fail at any time: one copy is not enough
- c) Backups is for video, Post for audio

✅ **Answer.** One source, two destinations: a drive can fail at any time, so one copy is not enough.

### Naming: where it came from

- Gig folder: ==YYMMDD== Full Event Name
- Inside it: `r [abbr]` for the raw recordings
- One subfolder per source, named ==From== the card: `From Mus128_1842`, `From F8_03`
- The same structure on **both** drives

**Q17 (fill in the blank).** Inside `r [abbr]`, each card gets its own subfolder named ==From== the card, like `From F8_03`.

✅ **Answer.** One subfolder per source, named "From" + the card's ID, on both drives, so you can always tell which card a file came from.

> 🧑‍🏫 [Why "From": six months later, you can tell which card every file came from]

### Triplets: the Triple Triple Check

Three copies:

1. The ==original==: the card or SSD
2. The Post copy
3. The Backups copy

Three checks, before you wipe anything:

1. Approximate ==GB== match
2. The last ==three digits== of the exact bytes match
3. The ==location==: the source plus both drives

**If you're 99% sure, don't delete. Ask.**

**Q18 (multiple choice).** What are the three checks of the Triple Triple Check?

- a) File names, dates, and colors
- ✅ b) Approximate GB, the last three digits of the exact bytes, and the location
- c) That both drives are plugged in, named, and empty

✅ **Answer.** Approximate GB, the last three digits of the exact byte count, and the location (the source plus both drives). If you're 99% sure, don't delete: ask.

### Deleted something by accident?

1. Tell ==Borecki==
2. ==Stop== using that drive. Right now. Every new file can overwrite what you lost.
3. Switch it to ==read-only==
4. Then ==recovery== software, or an AI subscription to walk you through it

**Q19 (multiple choice).** You deleted something by accident. What comes first?

- a) Run recovery software on that drive right away
- ✅ b) Tell Borecki, then stop using that drive
- c) Keep working and check it later

✅ **Answer.** Tell Borecki, then stop using that drive: every new file can overwrite what you lost. Switch it to read-only, then use recovery software.

**Q20 (fill in the blank).** Before you try to recover anything, switch the drive to ==read-only==.

✅ **Answer.** Read-only means nothing new gets written over the deleted files while you recover them.

> 🧑‍🏫 [How you switch a drive to read-only on our Macs. A story about a near miss]

## 4. Vibecoding: Picking a Model

### Four Claude models

From smallest and fastest to biggest and slowest:

| Model | What it's for |
|---|---|
| ==Haiku== | Fastest and cheapest: small, quick jobs |
| ==Sonnet== | Everyday work |
| ==Opus== | Hard work; a strong default |
| ==Fable== | The most capable; slowest and priciest |

**Q21 (multiple choice).** Which Claude model is the fastest and cheapest?

- ✅ a) Haiku
- b) Opus
- c) Fable

✅ **Answer.** Haiku is the smallest and fastest; then Sonnet, Opus, and Fable, the most capable, slowest, and priciest.

> 🧑‍🏫 Price per million input tokens right now: Haiku 5.5 $0.10, Sonnet 5.5 $2, Opus 5.5 $4,
> Fable 5.2 $8. Fable costs about 80 times what Haiku does.

### ChatGPT has its own four

They line up loosely:

- Astra ≈ Fable
- Sol ≈ Opus
- Terra ≈ Sonnet
- Luna ≈ Haiku

> 🧑‍🏫 Spelled **Terra**. Third-party write-ups (not OpenAI's own pages) describe a GPT-6 family in
> this order, top to bottom: Astra, Sol, Terra, Luna, so the order matches Claude's. By price the
> match is loose: their reported API prices put Sol ($2/$10) beside Sonnet, Terra ($1/$5) below
> it, and Luna ($0.10/$0.50) level with Haiku. Some say Terra is only in Work, Codex, and the API,
> not regular ChatGPT. Unverified against OpenAI.

### Thinking: the effort setting

- The model ==thinks== before it answers
- ==Effort== sets how much: **low · medium · high · xhigh · max**
- More effort: slower, uses more of your ==usage==, better on hard problems
- Less effort: fast, fine for simple ones
- **==Medium== is usually best**

**Q22 (fill in the blank).** Of the effort levels (low, medium, high, xhigh, max), ==medium== is usually best.

✅ **Answer.** More effort is slower and uses more of your usage. Medium is usually best; go up for hard problems.

> 🧑‍🏫 [An analogy: like gain, more isn't automatically better]

### Match the model to the job

- A typo fix: small model, low effort
- A tricky bug or a whole new page: big model, high effort
- Start at medium; go up only when it isn't good enough

**Q23 (multiple choice).** You need a typo fixed. What do you pick?

- ✅ a) A small model at low effort
- b) The biggest model at max effort
- c) It doesn't matter

✅ **Answer.** Match the model to the job: a typo is a small model at low effort. Start at medium for most work and go up only when it isn't good enough.

> 🧑‍🏫 [Your own default, and when you change it]

## 🗝️ Key terms

**overflow** · **program audio** · **Original sound** · **echo cancellation** · **board feed** ·
**multitrack** · **limiter** · **gain reduction** · **clip gain** · **Spectral De-noise** ·
**Triple Triple Check** · **read-only** ·
**automation** · **effort**
