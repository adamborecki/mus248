> 🤖 **AI use:** outline drafted with Claude Code from the instructor's planning messages (Nov 16)
> and photos, the new [Choir Room Overflow](../../choir-room-overflow-gig-checklist/) checklist,
> Lecture 11, Post Mini 1, and the unfinished Live Sound Part 4.

> 🧑‍🏫 **Outline, not final.** Headings and short fragments; the bullets in your voice are
> placeholders to rewrite. Last day of new material eligible for the final. Announcements beyond
> the first slide live in Google Slides. Live Sound Part 4 stays shelved: only its "stereo board
> feed vs. multitrack" line made it in (2.1). Refresher questions come after class, from the final
> text.

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
3. Vibecoding: Picking a Model

## 1. Choir Room Overflow

### When Salmon is full

- Some Salmon gigs sell out (==Mariachi== is the usual one)
- BH 109, the ==choir room==, becomes ==overflow== seating
- They watch on the room's ==projector== and hear it on the wall speakers
- The feed travels over a ==Zoom== meeting
- [Choir Room Overflow Gig Checklist](../../choir-room-overflow-gig-checklist/)

> 🧑‍🏫 [Why it matters / a story about a sold-out night]

### The signal flow

- Salmon room mics and cameras → the ==ATEM==
- ATEM's USB webcam out → the ==livestream computer== in BH 209
- In Zoom, the ATEM shows up as "==Blackmagic Design==": camera *and* microphone
- The meeting → the room PC in ==BH 109==
- Room PC → projector, and Ashly ==Ch.3== "PC/ZOOM" → Crown amp → wall speakers

**BH 109 hears the ATEM's ==program audio==.** Whatever the ATEM gets, overflow gets.

### The sender: Zoom in BH 209

- Video → camera: **Blackmagic Design**
- Audio → microphone: **Blackmagic Design**
- Microphone mode: ==Original sound== for musicians
- High-fidelity music mode **on** · ==Echo cancellation== **off** · Stereo audio **on**
- Input volume all the way up
- Check the banner: "Original sound for musicians: on"

> 🧑‍🏫 [Why not Noise removal: it's built for speech, and treats quiet passages and sustained notes
> as noise]

### The receiver: BH 109

- ==Borecki== starts the meeting, so ask ahead of time. You join it.
- Touch panel: Press here to begin → **PC (Zoom)** → Projector **On** (the screen comes down)
- Room PC: join the meeting, ==mute== the mic, stop video
- Ashly **Ch.3**: green light on, level where it is. The room level is set here.
- The rack stays on
- Photos of every step: the checklist

## 2. Three Kinds of Mix

### Three kinds

1. ==Stereo== only: the pair is the recording
2. Stereo plus a ==board feed== (or spot mics): still basically a stereo mix
3. Full ==multitrack==: Jazz Combo, Big Band

A board feed captures the mixer's decisions as they happen. A multitrack lets you ==remix== later.

> 🧑‍🏫 [Which gigs land in which bucket]

### Stereo only: a limiter

- A ==limiter== on the whole mix
- Ceiling: **==−0.1== dB**
- About **2–6 dB** of ==gain reduction==, at the loudest moment
- Same idea as Post Mini 1's limiter step
- A static mix: no automation

### Variety shows: clip gain between pieces

- "Variety show" programs: ==Music at Noon==, solo guitar one minute, a full ensemble the next
- In the DAW, cut at the clear ==silence== between pieces
- ==Clip gain== each piece so they sit at a reasonable level together
- Between pieces only. **Never** inside a piece, and never between ==movements==
- An all-piano program: **don't** clip gain at all

> 🧑‍🏫 [Why: the performer's dynamics are the music; we only even out the gaps between acts]

### Cleanup: iZotope RX

- ==iZotope RX== may be available. Use it when we can.
- Usually not needed; sometimes it saves a recording
- **==Spectral De-noise==**, set light

> 🧑‍🏫 [Where RX lives / who has it. An example of when you needed it]

### Board feed: the same rules

- Stereo plus a board feed or spot mics: same rules as stereo
- Limiter, clip gain between pieces, light RX
- Still ==static==: set the balance once

### Multitrack: ride the solos

- Only the Jazz Combo and Big Band get this
- ==Automation== on volume: bring each ==solo== up
- Everything else we mix is static
- Last week: the CL5 writes it, Latch then Read (Lecture 11)

> 🧑‍🏫 [Anything else about the multitrack mix]

## 3. Vibecoding: Picking a Model

### Four Claude models

From smallest and fastest to biggest and slowest:

| Model | What it's for |
|---|---|
| ==Haiku== | Fastest and cheapest: small, quick jobs |
| ==Sonnet== | Everyday work |
| ==Opus== | Hard work; a strong default |
| ==Fable== | The most capable; slowest and priciest |

> 🧑‍🏫 Price per million input tokens right now: Haiku 5.5 $0.10, Sonnet 5.5 $2, Opus 5.5 $4,
> Fable 5.2 $8. Fable costs about 80 times what Haiku does.

### ChatGPT has its own four

They line up loosely:

- Astra ≈ Fable
- Sol ≈ Opus
- Tarah ≈ Sonnet
- Luna ≈ Haiku

> 🧑‍🏫 The mapping is yours; not checked against OpenAI's own pages.

### Thinking: the effort setting

- The model ==thinks== before it answers
- ==Effort== sets how much: **low · medium · high · xhigh · max**
- More effort: slower, uses more of your ==usage==, better on hard problems
- Less effort: fast, fine for simple ones

> 🧑‍🏫 [An analogy: like gain, more isn't automatically better]

### Match the model to the job

- A typo fix: small model, low effort
- A tricky bug or a whole new page: big model, high effort
- Start in the middle; go up only when it isn't good enough

> 🧑‍🏫 [Your own default, and when you change it]

## 🗝️ Key terms

**overflow** · **program audio** · **Original sound** · **echo cancellation** · **board feed** ·
**multitrack** · **limiter** · **gain reduction** · **clip gain** · **Spectral De-noise** ·
**automation** · **effort**

## 💭 Before you leave

- Which of the three kinds of mix was your last recording?
- Where would you have cut for clip gain, and where wouldn't you?
