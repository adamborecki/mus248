> 🤖 **AI use:** outline drafted with Claude Code from the instructor's planning message (Nov 10),
> the [Vocal Jazz](../../vocal-jazz-gig-checklist/), [Mariachi](../../mariachi-gig-checklist/),
> [CME](../../cme-gig-checklist/), [Musco](../../musco-gig-checklist/) and
> [L-20 Multitrack](../../l20-multitrack-gig-checklist/) checklists, the
> [CL3 Dante Stems](../../cl3-dante-stems/) activity, Mixer Lab, and the previous lectures.

> 🧑‍🏫 **Outline, not the lecture.** Headings are slides; bullets are fragments for you to say and
> rewrite in your own voice. Reference rows (tables, signal chains) are close to final where a
> checklist already confirms them. Anything marked **(confirm)** is from your message only, or not
> in any checklist yet. No refresher questions yet: they come last, from the final text. Quiz 8's
> skills get written from the final text too.

## 📣 Announcements

### Homework review

**Today:** Week 12 · Class 11

**After today:** 3 classes (2 + 1 meeting in finals week)

Everything due this week, with due dates: **see Canvas**.

> 🧑‍🏫 Placeholder until the homework list is written. Quiz 8 is take-home, opening after class
> (access code in the quiz overview).

## 🎤 Overview

### Today

1. Vibecoding: an update
2. Vocal Jazz: a reminder, plus the recording session
3. Other Salmon gigs: Mariachi and CME
4. Musco: Big Band and Jazz Combo
5. Multitrack recording on the Zoom L-20

## 1. Vibecoding: An Update

### Last time: account vs. Pages

| | GitHub account | GitHub Pages |
|---|---|---|
| Example | `github.com/adamborecki` | `adamborecki.github.io` |
| What it is | You, and your ==repos== (the code) | The ==website== published from a repo |

- Same username, two addresses: the ==code== and the ==site==

### Markdown vs. HTML: one example

The same three lines, written two ways:

```
# Salmon Recital Hall
The **X32** is at FOH.
[Mariachi checklist](mariachi.html)
```

```
<h1>Salmon Recital Hall</h1>
<p>The <strong>X32</strong> is at FOH.</p>
<a href="mariachi.html">Mariachi checklist</a>
```

- ==Markdown==: the shorthand people write. Every checklist here
- ==HTML==: what the browser reads, every part in ==tags==

### One more thing: [your topic]

> 🧑‍🏫 Your message said "mention one other thing" before the Claude Code slide. Fill in or delete.

### Claude Code vs. Claude (and Codex vs. ChatGPT)

| | The chat app | The coding agent |
|---|---|---|
| Anthropic | Claude | **Claude Code** |
| OpenAI | ChatGPT | **Codex** |

- The chat app: you talk, it answers, **you** copy things where they go
- The ==coding agent==: it reads the ==repo==, edits the files, runs the ==tests==, commits
- [your take: when each one is the right tool]

### A cloud session

- Claude Code in a ==cloud session==: it runs on a computer in the cloud, not yours
- It edits the ==GitHub== repo directly, from your ==phone==
- That's how this site is built: [your example, e.g. the mariachi checklist from photos after the rehearsal]
- [what students will do with it, if anything, before the final]

## 2. Vocal Jazz: A Reminder

### Last week, in one slide

- Thirteen ==wireless== handhelds, ==LOCAL== inputs on the X32
- The hall's speakers; three wedges on ==one== mix, daisy-chained
- Every wireless channel at the ==same== gain (30 dB)
- [Vocal Jazz Gig Checklist](../../vocal-jazz-gig-checklist/)

### When it's a recording session

- Add **two ==condensers== on the piano**: left and right
- Add a **stereo pair of ==room mics==**
- Pencil condensers (like the blue Audio-Technicas), ==48V== on
- Those go into the **==S32==**, the stage box: its last bank, IN 25–32
- S32 → ==AES50== → the X32 at FOH → ==Dante== → ==Logic== on the FOH Mac mini

> 🧑‍🏫 Exact inputs (piano L/R on 25/26, room pair on 27/28?) not confirmed yet. The Vocal Jazz
> checklist's optional Dante → Logic step covers the recording half.

## 3. Other Salmon Gigs: Mariachi and CME

### Same hall, three gigs

| | Vocal Jazz | Mariachi | CME |
|---|---|---|---|
| Mics | 13 wireless | ==9== wireless (no trumpet mics) | 5 wireless + band on a sub snake |
| House | The hall's speakers | The hall's speakers | Its own, ==downstage== |
| Wedges | 3 wedges, 1 mix | **==6== wedges, 6 mixes** | 3 wedges, 3 mixes |

- Same X32, same S32, same default routing. What changes: the ==outputs==

> 🧑‍🏫 Your message lists "mariachi and CME" as the two other gigs. CME was most of last week's
> section 3, so this slide treats it as the comparison point and spends the time on Mariachi.
> Tell me if you meant a different second gig (Music at Noon?).

### Mariachi: what's the same

- The hall's ==speakers== are the house, like Vocal Jazz
- Every mic ==wireless==, receivers on LOCAL
- Separate mixes per wedge, no daisy chain, like ==CME==
- Same test order: music through the mains, then each wedge, then the mics

### Mariachi: what's different

- **Six wedges, six mixes**: MIX n on ==output== n (wedge 1 = MIX 3 … wedge 6 = MIX 8)
- Three kinds of amp path: an **==active== wedge** on XLR, two **KM750s** (speakON), the **Crown**
  (1/4" only)
- Check each wedge's ==jack== before you carry a cable to it
- **Priority:** the two vocal mics in the house and every wedge, then violins, then guitarrón, vihuela, guitarra
- Arrive ==early==: patching six wedges took extra time at the dress rehearsal

### Mariachi: the handheld that dies

- It happens at most gigs. A ==spare== comes in on **its own** channel
- Don't re-patch the receivers: set up the spare's ==channel== like the dead one (gain, low cut, sends)
- Sends stay ==pre-fader==
- [your story from the Nov 6 dress rehearsal: the red handheld]

### CME: the comparison

- Its own mains ==downstage==: every open mic is behind them
- The hall's speakers turned down at the ==Mix5==, and the next gig (Mariachi) has to turn them back up
- A band on a ==sub snake== into S32 IN 25–32 (AES50)

> 🧑‍🏫 The Mix5 hand-off is the one real link between the two: CME turns the hall down, Mariachi
> finds it silent.

### Mixer Lab

- [Mariachi in Salmon](https://adamborecki.github.io/mixer-lab/#/x32-mariachi-tour): eleven scenarios with the band's own recording
- [CME: Everything working](https://adamborecki.github.io/mixer-lab/#/x32-cme-tour)
- [Mariachi Gig Checklist](../../mariachi-gig-checklist/) · [CME Gig Checklist](../../cme-gig-checklist/)

## 4. Musco: Big Band and Jazz Combo

> 🧑‍🏫 Most of this section is a placeholder until you send the Big Band / Jazz Combo repo or notes.
> What's here is only what the Big Picture lecture (Oct 12) and your message say.

### Not a normal Musco gig

- Normal Musco: the ==multicam== crew in the booth, Seiyua's rack recorders, a board feed
- Big Band and Jazz Combo: multicam **as normal**, **plus** a live ==multitrack==
- About two concerts a year
- [Musco Gig Checklist](../../musco-gig-checklist/)

### Downstairs: the CL5

- Audio goes down to the ==basement==: the Yamaha **==CL5==**
- The multitrack is captured **downstairs** [how: Dante into a recorder / a computer? (confirm)]
- [what the CL5 is mixing: the room, the stream, the recording? (confirm)]

### The CL5 and the CL3 in OH 207

- OH 207 has a Yamaha **==CL3==**: the smaller version of the CL5
- [how the CL5 downstairs connects to the CL3 in OH 207 (confirm): Dante? a file you bring up?]
- Practice on the CL3 first: [CL3: Dante Stems from Logic](../../cl3-dante-stems/)
- Or in a browser: [Mixer Lab: Virtual soundcheck over Dante](https://adamborecki.github.io/mixer-lab/#/cl3-dante)

## 5. Multitrack Recording on the Zoom L-20

### One mic, one track

- Film Recording Workshop, Nov 2: 14 mics → 14 ==tracks== in Logic
- Mix ==later==, not live
- Same rig: a band, a choir section, a studio session
- [L-20 Multitrack Recording Checklist](../../l20-multitrack-gig-checklist/)

### The faders lie

- Not ==motorized==
- The ==green LED== is the real level
- After FADER MODE or a scene recall, the caps stay put
- Move the fader through the LED, then it takes over

### Recorded vs. heard

- USB to Logic comes from ==before== the fader: only **GAIN** changes the recording
- Channels 1–16 ==muted== on purpose: live mics out of the headphones
- Headphones: Logic's ==click== → USB 1-2 → 17/18 → MONITOR OUT A → the HP12U

> 🧑‍🏫 The checklist still lists "a mute doesn't stop the USB feed" as open (confirmed for SD in the
> manual; the Nov 2 session recorded fine with 1–16 muted). Teach it as "what happened Nov 2" until
> someone mutes CH 1 and watches track 1.

### Two monitor paths

- The L-20's own mix: no ==delay==
- Through Logic: buffer 1024 ≈ 27 ms out, about 53 ms round trip
- The same mic both ways = doubled, an ==echo==
- Rule: ==one== path per sound

### Before the musicians arrive

- MacBook Pro + Telefunken M61s from the office, arranged ahead
- Input or output? The HP12U's back panel: **INPUT A** is the lower pair
- A ==test recording==: every track, every time

## 🗝️ Key terms

**GitHub Pages** · **Markdown** · **HTML** · **Claude Code** · **cloud session** · **room mics** ·
**AES50** · **Dante** · **active wedge** · **spare handheld** · **downstage** · **CL5** · **CL3** ·
**multitrack** · **pre-fader** · **latency** · **test recording**

## 💭 Before you leave

- What's one thing a coding agent can do that the chat app can't?
- Mariachi and Vocal Jazz both use the hall's speakers. What's the biggest difference at the wedges?
- On the L-20, which control changes what's recorded, and which only changes what's heard?
