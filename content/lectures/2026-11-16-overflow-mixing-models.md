> 🤖 **AI use:** outline drafted with Claude Code from the instructor's planning messages (Nov 16)
> and photos, the new [Choir Room Overflow](../../choir-room-overflow-gig-checklist/) checklist,
> Lecture 3 (data management), Lecture 11, Post Mini 1, and the unfinished Live Sound Part 4.

> 🧑‍🏫 **Delivered Nov 16.** The last day of new material eligible for the final. Live Sound
> Part 4 stays shelved: only its "stereo board feed vs. multitrack" line made it in (2.1).
> Refresher questions come next, from this text.

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

> 🧑‍🏫 [Why it matters / a story about a sold-out night]

### The signal flow

- Salmon room mics and cameras → the ==ATEM==
- ATEM's USB webcam out → the ==livestream computer== in BH 209
- In Zoom, the ATEM shows up as "==Blackmagic Design==": camera *and* microphone
- The meeting → the room PC in ==BH 109==
- Room PC → projector, and Ashly ==Ch.3== "PC/ZOOM" → Crown amp → wall speakers

**BH 109 hears the ATEM's ==program audio==.** Whatever the ATEM gets, overflow gets.

### The sender: Zoom in BH 209

- Video → camera: ==Blackmagic Design==
- Audio → microphone: **Blackmagic Design** too
- Microphone mode: ==Original sound== for musicians
- ==High-fidelity== music mode **on** · ==Echo cancellation== **off** · ==Stereo== audio **on**
- Input volume all the way ==up==
- Check the banner: "Original sound for musicians: on"

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

## 2. Three Kinds of Mix

### Three kinds

1. ==Stereo== only: the pair is the recording
2. Stereo plus a ==board feed== (or spot mics): still basically a stereo mix
3. Full ==multitrack==: Jazz Combo, Big Band

A board feed captures the mixer's decisions as they happen. A multitrack lets you ==remix== later.

> 🧑‍🏫 [Which gigs land in which bucket]

### Stereo only: a limiter

- A ==limiter== on the ==master==: the stereo output, so it catches the whole mix
- Ceiling: **==−0.1== dB**
- Then **boost into it**: a ==gain== plugin before the limiter, or clip gain
- Turn the boost up until the loudest moment gets **2–6 dB** of ==gain reduction==
- The amount of boost changes with every recording; the gain reduction target doesn't
- Same idea as Post Mini 1's limiter step

### Variety shows: clip gain between pieces

- "Variety show" programs: ==Music at Noon==, solo guitar one minute, a full ensemble the next
- In the DAW, cut at the clear ==silence== between pieces
- ==Clip gain== each piece so they sit at a reasonable level together
- Between pieces only. **Never** inside a piece, and never between ==movements==
- Same ==instrumentation== all the way through (an all-piano recital, say): **don't** clip gain at all

> 🧑‍🏫 [Why: the performer's dynamics are the music; we only even out the gaps between acts]

### Cleanup: iZotope RX

- ==iZotope RX== may be available. Use it when we can.
- Usually not needed; sometimes it saves a recording
- **==Spectral De-noise==**, set light
- How it works: it ==learns== the noise from a stretch of just the noise (room tone, no music)
- Then it takes out that noise, about **==2 dB==** of reduction. Light enough not to hear it working.

> 🧑‍🏫 [Where RX lives / who has it. An example of when you needed it]

### Board feed: the same rules

- Stereo plus a board feed or spot mics: same rules as stereo
- Limiter, clip gain between pieces, light RX
- The balance between them is ==static== per piece
- Usually: set the balance ==once== and leave it for the whole concert
- Sometimes a different balance for a different ==piece==, never moving inside one

### Multitrack: ride the solos

- Only the Jazz Combo and Big Band get this
- ==Automation== on volume: bring each ==solo== up
- Everything else we mix is static
- Last week: the CL5 writes it, Latch then Read (Lecture 11)

> 🧑‍🏫 [Anything else about the multitrack mix]

## 3. Data Management: A Reminder

> 🧑‍🏫 A recap of Lecture 3 (Data Management + Dante) and the Salmon Gig Checklist's Data transfer,
> plus one new slide (3.4).

### One source, two destinations

- Copy **everything** from each card or SSD
- Destination 1: the ==Post== drive
- Destination 2: the ==Backups== drive
- A drive can ==fail== at any time: one copy is not enough

### Naming: where it came from

- Gig folder: ==YYMMDD== Full Event Name
- Inside it: `r [abbr]` for the raw recordings
- One subfolder per source, named ==From== the card: `From Mus128_1842`, `From F8_03`
- The same structure on **both** drives

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

### Deleted something by accident?

1. Tell ==Borecki==
2. ==Stop== using that drive. Right now. Every new file can overwrite what you lost.
3. Switch it to ==read-only==
4. Then ==recovery== software, or an AI subscription to walk you through it

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

> 🧑‍🏫 [An analogy: like gain, more isn't automatically better]

### Match the model to the job

- A typo fix: small model, low effort
- A tricky bug or a whole new page: big model, high effort
- Start at medium; go up only when it isn't good enough

> 🧑‍🏫 [Your own default, and when you change it]

## 🗝️ Key terms

**overflow** · **program audio** · **Original sound** · **echo cancellation** · **board feed** ·
**multitrack** · **limiter** · **gain reduction** · **clip gain** · **Spectral De-noise** ·
**Triple Triple Check** · **read-only** ·
**automation** · **effort**
