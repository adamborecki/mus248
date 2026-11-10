# Zoom LiveTrak L-20 multitrack recording: intake notes

> **Source material, not student-facing.** Intake notes for a future L-20 multitrack gig
> checklist, a Mixer Lab scenario, and an upcoming lecture. Written 2026-11-10 from Borecki's
> walkthrough and 12 photos of the **Film Recording Workshop** session (MUS 328, Mon Nov 2,
> 2026), his answers to follow-up questions, and the L-20 / HP12U documentation as far as it
> could be reached (see **Sources**). Each fact is tagged:
> **[seen]** in the photos · **[Borecki]** the instructor said so · **[manual]** Zoom/AKG
> documentation · **[forum]** user reports only · **[open]** not verified, do not teach as fact.
>
> Redacted: nothing needed redacting. Photos with students in frame are not committed (see
> **Photos**).

## 🎯 What this is about

The point is **the L-20 as a multitrack recorder**, not the film workshop itself. The film
workshop is this semester's worked example; the same setup records a band, a chamber group, a
studio session, anything that wants one track per mic. **[Borecki]**

Two things it teaches that students don't expect **[Borecki]**:

1. **The faders don't tell the truth.** They aren't motorized. After a FADER MODE switch or a
   scene recall, where a fader *sits* and where its level *is* can differ. The green LED beside
   the fader is the real level.
2. **Monitor mixes go somewhere else.** What the players hear in headphones is a separate
   question from what gets recorded, and there are two different places it can come from (the
   L-20 or the DAW). Mixing those up is how you get latency or doubling.

The setup moves between rooms. **[Borecki]** (Nov 2 was in a recital hall with raked seats
and a booth; the checklist should not assume a room.)

## 🧩 The rig (Film Recording Workshop, fall 2026)

The input list is fixed for film music this semester; future semesters or one-off weeks may
differ. **[Borecki]**

| L-20 input → Logic track | Source | Mic |
| --- | --- | --- |
| 1 | DECCA L | Telefunken M61 **[Borecki]** |
| 2 | DECCA R | Telefunken |
| 3 | DECCA C | Telefunken |
| 4 | Cello | spot: inexpensive small-diaphragm condenser (LyxPro or similar) **[Borecki]** |
| 5 | Viola | spot SDC |
| 6 | Sax | spot SDC |
| 7 | Trumpet/Horn | spot SDC |
| 8 | Piano Hi | spot SDC |
| 9 | Piano Lo | spot SDC |
| 10 | Vibes Hi | spot SDC |
| 11 | Vibes Lo | spot SDC |
| 12 | Euphonium | spot SDC |
| 13 | Clarinet | spot SDC |
| 14 | Vocal 1 | spot SDC **[open: confirm it's an SDC too]** |

Track names and input numbers **[seen]** (Logic mixer: tracks 1–14 on In 1–In 14, all to
Stereo Out). The "Decca" is three separate stands (L, C, R), not a tree bar. That's how it is
done here. **[seen] [Borecki]**

**Gear and where it comes from**

- **Zoom LiveTrak L-20**: the center of everything. Mixer, preamps, USB audio interface.
- **Music department MacBook Pro** running **Logic Pro**, and the **Telefunken** mics. Both
  normally live in Borecki's office, so **pickup and return have to be arranged with him in
  advance**. **[Borecki]**
- **Sub-snakes** on the floor: two Pro Co *Little Bit* and one Hosa, XLRs numbered with tape
  at the L-20 end. **[seen]** (Channel counts per snake **[open]**.)
- **AKG HP12U** headphone amplifier (12 outputs in 6 pairs) on a rolling rack cart labeled
  "1", with Audio-Technica headphones in the cart's drawer. **[seen]**
- Storage location of the L-20, cart, snakes and headphones **[open]**.

## 🔀 Signal flow (as photographed Nov 2)

```
mics ─▶ sub-snakes ─▶ L-20 inputs 1–14 ─┬─▶ USB ─▶ Logic tracks 1–14   (recorded)
                                        │
                                        └─▶ L-20 MASTER mix: channels 1–16 MUTED, faders at bottom
Logic Stereo Out (click, playback) ─▶ USB 1-2 ─▶ L-20 channel 17/18 ─▶ MASTER mix
L-20 MONITOR OUT A (set to MASTER, PHONES) ─▶ TRS → dual TS "Y" ─▶ AKG HP12U ─▶ 12 headphones
```

**[seen]** on the L-20 top panel:

- **48V** on for all four banks (1–4, 5–8, 9–12, 13–16). All mics are condensers.
- **MUTE lit on 1–16.** The fader LEDs for 1–16 (FADER MODE = MASTER) sit at the bottom.
- **17/18 USB 1-2** and **19/20 USB 3-4** buttons lit: those stereo channels take the
  computer's output instead of their own jacks.
- Screen: **No Card**. Nothing recorded on the L-20 itself; Logic did the recording.
- Only **MONITOR OUT A** has a cable.

**What the players heard.** With 1–16 muted and down, the MASTER mix (and so MONITOR A, which
was set to MASTER **[Borecki]**) contained **only what came back from Logic: the click, and
playback of takes**. Players heard each other acoustically in the room. Borecki's recollection
from the day was "everybody got everything", but the photographed state says click-only, and he
said to go with what makes sense. **The checklist teaches the photographed state (click and
playback only) as the default.** "Everyone also hears the band" is an option described below.

## ⚠️ Pitfalls and how the board actually works

### 1. The fader that lies (pick-up, not jump)

- The L-20's faders are **not motorized**. After switching **FADER MODE** (MASTER ↔ A–F) or
  recalling a **scene**, the LEDs beside each fader show the **stored** level for that mix,
  and the physical fader stays wherever it was. **[manual] [forum]**
- Zoom's manual: *"If the actual channel fader position differs from the channel fader
  position shown, the volume will not change until the fader is moved to the same
  position."* **[manual, via a mirror; see Sources]** So it is a **pick-up**: nothing happens
  until you move the fader through the lit LED, then it takes over. It does **not** jump.
  This matches Borecki's guess.
- Practical rule: **read the LEDs, not the fader caps.** To take control, slide the fader to
  the lit LED first.
- The LEDs also act as meters in some modes, and a menu setting (Rec Level Meter) makes them
  show input level instead. **[forum]** Worth knowing so students don't confuse a meter with
  a fader position. **[open: confirm on the unit]**

### 2. Faders and MUTE don't change what's recorded

- What the L-20 sends over USB is **pre-fader**: only GAIN changes the level Logic sees.
  **[forum]**
- The manual says MUTE *"has no effect on recording to the SD card."* **[manual]**
- For **USB to Logic**, Borecki is confident MUTE doesn't stop it, and the Nov 2 session
  recorded with 1–16 muted. **[Borecki]** It isn't in the documentation reached so far, so
  it's **[open]** until someone mutes a channel and watches its Logic meter.
- So 1–16 muted is **on purpose**, not a mistake to fix: it keeps the live mics out of the
  headphones without touching the recording. **Students will try to "fix" those red buttons.**
- ⚠️ Mixer Lab's current L-20 model is live sound only: MUTE silences the channel in every mix
  and there's no USB side. A recording scenario needs a USB send that ignores fader and mute.

### 3. Two places the headphone mix can come from

| | **Hardware monitoring** (the L-20's own mix) | **Software monitoring** (through Logic) |
| --- | --- | --- |
| Path | input → L-20 mix → MONITOR OUT | input → USB → Logic → USB → 17/18 → MONITOR OUT |
| Delay | none you can hear | the buffer, there and back |
| Set by | L-20 faders in that FADER MODE, MUTE | Logic track input monitoring (the **I** button), record-arm behavior |

- Logic was at **1024 samples: 26.8 ms output, 53.5 ms roundtrip** **[seen]**. That's fine
  when Logic only sends a click. Anything a player hears of *themselves* through Logic arrives
  about 50 ms late, which is a clear echo and throws players off.
- **Doubling:** if the same mic reaches the headphones by both paths, you hear it twice. At a
  few ms that's comb filtering (phasy); at 50 ms it's a slap echo.
- **Rule for the checklist: each live mic reaches the headphones by one path only.** Default:
  Logic sends click + playback, the L-20 keeps 1–16 out of the mix, Logic input monitoring
  off. If players need to hear each other in the cans, do it on the L-20 (zero latency) and
  keep Logic's input monitoring off.
- What Logic does with input monitoring on record-armed tracks (Auto Input Monitoring, the
  **I** buttons) **[open]**. Check in the session before writing click paths.

### 4. Getting the click to the headphones

- Logic's Stereo Out (metronome + playback) comes back over **USB 1-2** to L-20 channel
  **17/18** (its USB button lit) **[seen]**, then into the MASTER mix.
- Count-in and metronome were on in Logic **[seen]**. Whether Logic's click is routed to the
  Stereo Out or to a separate output **[open]** (it reached the cans, so Stereo Out is likely).
- **MONITOR OUT A** set to **MASTER** (not its own A mix), **PHONES/SPEAKER** on **PHONES**,
  feeding the HP12U through a **TRS → dual TS Y cable**. **[Borecki, best guess]** That
  PHONES switch matters: on PHONES the jack carries a stereo headphone signal (tip L, ring R),
  which the Y splits into L and R. **[open: confirm the switch's exact behavior]**

### 5. The headphone amp: input vs output

- HP12U back panel **[seen]**: **INPUT B** = two XLR (L, R), each with a **LINK** TRS jack;
  a box labeled **LINK A / OUTPUT** with two TRS jacks (**L/MONO**, **R**); **INPUT A** = USB.
- Spec sheets: Input A is 2 × ¼" TRS with USB as an alternative; Input B is XLR; link
  outputs are 2 × ¼" TRS; the USB channel can't be linked. **[manual-adjacent: spec listings]**
- **Resolved from the uncropped photo [seen]:** there are **two pairs** of ¼" jacks there. The
  upper pair is labeled **LINK A OUTPUT**; the **lower** pair (**L/MONO**, **R**) is bracketed with
  **INPUT A**, and that's where the Y cable's plugs are. So the Nov 2 patch was right, and the
  front SELECT belongs on **A**. Still worth teaching: a plug one row up is an output, and silent.
  What INPUT A does if a USB cable is also plugged in **[open]**.
- Front panel: each pair of headphone jacks has a **VOLUME** and a **SELECT** button (**A (USB)**
  / **B**). **Each pair must be set to the input the L-20 actually feeds.** **[Borecki]**
- The lesson generalizes: **find out which jack is the input before you plug in.**

### 6. Setup details that bite

- **Driver:** the Mac needs Zoom's **L-20 driver** installed before Logic sees
  "ZOOM L-20 Driver" as input/output device. **[Borecki] [seen]** It's on the department
  MacBook Pro. A student's own Mac needs it downloaded and installed first, which
  needs admin rights.
- **Phantom** is per bank of four, so one button affects four inputs. All mics on this plot
  are condensers, so all banks on. A future plot with a ribbon mic needs thought.
- **Test recording is essential:** record a few seconds on every track, play it back, check
  every track has signal at a sane level. Disk write speed matters for 14+ tracks.
  **[Borecki]**

### 7. Backup on SD?

- The L-20 records up to 22 tracks to SD by itself, and can also be a USB interface.
- B&H's overview says it can stream over USB **while recording to an SD card**. Borecki
  doesn't think it can do both. **[open: conflicting]** Test on the unit before the checklist
  promises a backup.

## 🔮 Later (not this version)

- **Separate monitor mixes** on MONITOR OUT A–F (FADER MODE A–F): e.g. the pianist gets more
  click, the singer gets more piano. The board can do it; the cart has one HP12U fed from A.
  **[Borecki]**
- **Stems from the Nov 2 session** exist. Borecki will send them later. Until then Mixer Lab
  can use FTW stems as stand-ins plus a click, as the electroacoustic showcase does.

## 🧑‍🏫 Lecture hooks (outline fragments, for the instructor to write)

- Where's the real fader level? LEDs vs caps; pick-up behavior
- Recorded ≠ heard: pre-fader USB sends; mute 1–16 on purpose
- Two monitor paths: hardware vs software; buffer → ms; echo vs comb filtering
- The click's path: Logic → USB 1-2 → 17/18 → MASTER → MONITOR A → HP12U
- Input or output? the HP12U's back panel
- Test recording before the musicians arrive
- Logistics: MBP and Telefunkens from the office, arranged ahead
- Generalizes: the film workshop is one example; band, chamber, studio
- Existing tie-in: Big Picture lecture (2026-10-12) slide 17, "Studio and Multitrack Recording",
  Q16 (L-20 for multitrack sessions)

### Paste-ready section (outline, Nov 9 lecture: a short intro)

No Nov 9 lecture exists in the repo yet, so this is a section to paste into it. Headings are
slides; bullets are fragments for the instructor to say in his own words. No blanks or refresher
questions yet: those come from the final text.

```markdown
## Multitrack Recording on the L-20

### One mic, one track
- Film Recording Workshop, Nov 2: 14 mics → 14 tracks in Logic
- mix later, not live
- same rig: band, choir section, studio session
- [L-20 Multitrack Recording Checklist](../../l20-multitrack-gig-checklist/)

### The faders lie
- not motorized
- green LED = real level
- FADER MODE / scene → caps stay put
- move the fader through the LED, then it takes over

### Recorded vs. heard
- USB to Logic = before the fader → only GAIN changes the recording
- channels 1–16 muted on purpose: live mics out of the headphones
- headphones: Logic's click → USB 1-2 → 17/18 → MONITOR OUT A → HP12U

### Two monitor paths
- L-20 mix: no delay
- through Logic: buffer 1024 ≈ 27 ms out, 53 ms round trip
- same mic both ways = doubled / echo
- rule: one path per sound

### Before the musicians arrive
- MacBook Pro + Telefunken M61s from the office, arranged ahead
- input vs. output: the HP12U's back panel
- test recording, every track, every time
```

## ✅ Technical verification (open)

- [ ] Muting a channel on the L-20 does not stop its USB send to Logic (mute ch 1, watch track 1's meter)
- [ ] Fader pick-up behavior after FADER MODE switch and scene recall (manual says pick-up; confirm on the unit)
- [x] Which HP12U rear jacks are Input A's analog inputs (the lower pair; SELECT on A)
- [ ] HP12U INPUT A with USB also connected
- [ ] MONITOR OUT A PHONES/SPEAKER and MASTER switch positions and what each does
- [ ] Logic: click routing; Auto Input Monitoring / I buttons during record
- [ ] Can the L-20 record to SD while streaming to Logic? (conflicting)
- [x] Telefunken model: M61
- [ ] Sub-snake channel counts; Vocal 1's mic
- [ ] Where the L-20, HP12U cart, snakes and headphones are stored
- [ ] Sample rate / bit depth for film sessions, where the project is saved, and how it reaches the composers

## 📷 Photos (Nov 2, not yet committed)

Planned for `content/activities/media/l20-multitrack/` when the checklist is built, gear
only: the L-20 top panel; Logic Settings › Audio › Devices; the Logic mixer; the Decca mics
seen from the ensemble's side (no people); the sub-snakes; the HP12U front, back panel and SELECT close-up; the
L-20 MASTER OUT/MONITOR OUT close-up. **Not used, or cropped/blurred:** the two room overviews
and the desk shot (students in frame; the desk shot also shows personal keys, wallet and phone).
Two shots have students in the background (HP12U back, MONITOR OUT close-up), so blur them.

## Sources

- Borecki's walkthrough and answers, Nov 2–10, 2026.
- Zoom LiveTrak L-20 Operation Manual (fader pick-up and MUTE/SD wording), read via mirrors
  because zoomcorp.com was not reachable from the build environment:
  [manualsnet](https://manualsnet.com/zoom/livetrak-l-20),
  [ManualsLib](https://www.manualslib.com/manual/1446079/Zoom-Livetrak-L-20.html),
  [B&H copy](https://www.bhphotovideo.com/lit_files/594727.pdf).
- [B&H Explora: Record, Mix, and More with the L-20](https://www.bhphotovideo.com/explora/pro-audio/news/record-mix-and-more-with-the-zoom-livetrak-l-20-digital-mixer) (USB while recording to SD).
- [Ardour forum: L-20 USB audio is pre-fader](https://discourse.ardour.org/t/avl-mx-and-zoom-l-20-control-and-audio-playback-resolved/106629).
- [TalkBass thread](https://www.talkbass.com/threads/zoom-livetrak-l20-plus-which-daw.1665054/) and [Long & McQuade listing](https://www.long-mcquade.com/114251/Pro-Audio-Recording/Multi-track-Recorders/Zoom/LiveTrak-L-20-Digital-Recording-Mixing-Console.htm) (LED/fader matching; LEDs as meters).
- AKG HP12U spec listings ([B&H Q&A](https://www.bhphotovideo.com/c/product/1244170-REG/akg_3450h00050_hp12u.html/ask-question), [Audio46](https://audio46.com/products/akg-hp12u-12-channel-headphone-amp)); the AKG quick-start PDF was not reachable.
