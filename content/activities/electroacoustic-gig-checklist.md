---
id: electroacoustic-gig-checklist
title: "Electroacoustic Showcase Gig Checklist (Salmon)"
emoji: "🎛️"
coreSkillAreas:
  - Live Sound
status: In Development
revised: "2026-10-19"
estimatedTime: "Not a timed drill. It starts weeks before the show, with the tech riders, and ends at strike."
access:
  mode: On campus
  location: "Salmon Recital Hall: the FOH mixer position, the stage, and the storage closet in BH 102."
  supervision: "For a crew of three or more, led by someone who has already run a Salmon gig on the X32. Not a solo job."
groupSize:
  minimum: 3
  ideal: "4–5"
  maximum: 6
  solo: false
activityFamily: "Salmon Recital Hall"
level: "X32 · S32 + SD8 stage boxes on AES50 · laptops and interfaces · click tracks · an 8-channel speaker ring · video"
roundsSupported: false
---

> 🧪 **Status: In Development.** Drafted from the **Chapman Faculty Electroacoustic Showcase**
> (October 18, 2026): the crew's debrief in class the next day, the instructor's load-in notes, and
> photos. Every step below either worked that night or is the fix for something that didn't. A few
> details are still open. See **Technical verification**.

## 🎚️ What this is

The gig checklist for a **concert of electroacoustic pieces** in Salmon Recital Hall: nine pieces,
nine different setups. Laptops at FOH and on stage, audio interfaces you've never seen, a click track
only the performer should hear, a piano played by speakers, video on a rear-projection screen, and one
piece in eight channels on its own speaker system.

Each piece is a small gig of its own. The job is to fit all of them into **one** patch, without
re-cabling between pieces, and to have a plan for when something breaks mid-show, because something
will.

The whole system, piece by piece, is drawn in the
[showcase signal flow](https://adamborecki.github.io/salmon/showcase/). Read it before load-in.

## 🗝️ Key terms

**tech rider** · **input list** · **output list** · **stage box** · **AES50** · **daisy chain** ·
**input routing** · **local output** · **click track** · **AUX IN** · **DI box** · **Thunderbolt** ·
**ground loop** · **ground-loop isolator** · **rear projection** · **changeover**

## 🧰 Equipment and materials

- [ ] Each piece's **tech rider** (see **Weeks before**), printed, one per piece
- [ ] The show's **input list** and **output list**, printed, one copy at FOH and one backstage
- [ ] The **run order** with every **changeover** on it
- [ ] Two **shielded Cat5e** cables with etherCON ends, long enough for each stage box run, plus a spare
- [ ] **DI boxes**, at least one per laptop that comes to the stage without its own interface
- [ ] A **long XLR** (enough to reach from FOH to any performer) coiled at FOH as the emergency cable
- [ ] **Ground-loop isolators** (the course has Pyle hum destroyers), one per line, plus spare TRS cables
- [ ] **Adapters:** 3.5 mm to dual 1/4", 1/4" to XLR, RCA to 1/4", 5-pin MIDI to USB-C
- [ ] **Gaff tape** and a marker, for labels
- [ ] **Headphones** for the X32
- [ ] Towels or a non-slip mat, for a controller that sits on top of a piano

## ⚠️ Before you touch anything

- 🔌 **Power order:** console and sources first, **speakers and amps last**. At the end, speakers
  and amps **off first**. Same order whenever you move a power cable during setup.
- ⚡ **A Thunderbolt interface doesn't hot-plug.** If it loses power or its cable, the computer
  usually has to be restarted. Label its power plug and the strip it's on, and keep that strip off
  limits during the show.
- 🔇 **Never lift a safety ground.** No three-to-two-prong adapters, no snapped-off ground pins. A
  hum is fixed in the audio path (a DI's ground lift, an isolator), never in the power cord.
- 🧮 **A power strip is not more power.** Everything plugged into one wall circuit shares its
  15 A, however many conditioners and strips hang off it. Don't plug strips into strips.
- 🙋 **Ask when you're not sure.** The composer knows their piece; your supervisor knows the hall.

## 📨 Weeks before — tech riders

- 🚩 Send every composer the same short form and get it back. For each piece: every **sound
  source** (mic, instrument, laptop, interface), its **connector** and **how many channels**, what
  the **performer needs to hear** (click, track, themselves), any **video**, the **computer and
  operating system**, and the **software** (DAW, Max, Kontakt).
- 🚩 For every laptop that plays audio, find out **what interface** it uses. A laptop's headphone
  jack is a stereo line output that needs a DI or a proper line input. A Thunderbolt interface needs
  its driver, and possibly lowered security settings on the Mac, installed and tested **before**
  load-in.
- 🚩 Find out which pieces have a **click track**. A click is for the performer only. It must never
  reach the house.
- 🚩 If a performer doesn't have a reliable laptop or DAW to practice with, solve that now, not at
  the dress rehearsal.

**Q1 (short answer).** A composer's rider says: "laptop, stereo out." Name two things you still need
to know before you can patch it.

✅ **Answer.** Any two of: what the output connector is (headphone jack, 1/4", XLR); whether there's
an audio interface, and which; whether it's line level; whether there's a click or track for the
performer as well; where on stage the laptop will be. "Stereo out" isn't a patch yet.

## 🗂️ One input list for the whole show

- 🚩 Write **one** input list with **every piece on it**: each source gets its own X32 channel and
  its own stage box input for the whole night. Name each channel on the X32 to match.
- 🚩 Check the list for **collisions**: two pieces sharing an input number is the mistake that
  nearly cost the showcase a piece (see Q2). If two pieces really must share an input, write the
  repatch into the run order as a changeover task, with a name next to it.
- 🚩 Write an **output list** too: every speaker, every performer feed (wedge or earpiece), the
  projector, and which X32 output or stage box output feeds each.
- 🚩 Mark the **free outputs** on the X32's rear panel (the local XLR outs). They're your plan B
  if a stage box output fails.
- 🚩 Draw a **stage plot**: which side of the stage each piece's gear is on, and which stage box is
  nearer. The plot decides which stage box each source goes into.

**Q2 (multiple choice).** In the showcase, a guitarist's rig was planned onto the same inputs the
pianist's mic used in the piece just before. When is the cheapest time to catch that?

- a) During the guitarist's line check.
- b) During the changeover between the two pieces.
- ✅ c) When the input list is written, weeks before.
- d) It can't be caught; it's a live-show risk.

## 🚚 Load-in — the system

- 🚩 Set up the **screen** for **rear projection**: the projector behind the screen. In the
  projector's settings, flip the image so it reads correctly from the audience.
- 🚩 Plan **power** before you plug in: what goes on which circuit, nothing over the circuit's
  load. Label the plug of any Thunderbolt interface.
- 🚩 Place the **S32** on one side of the stage and the **SD8** on the other, per the stage plot.
- 🚩 **Cat5 #1:** X32 **AES50 A** to the S32's **AES50 A**. **Cat5 #2 (the daisy chain):** the
  S32's **AES50 B** to the SD8's **AES50 A**. Use **shielded** cable for the whole run.
- 🚩 Both stage boxes show a steady **link/sync light**. A box with no link has no inputs **and**
  no outputs.
- 🚩 X32 **ROUTING → INPUT**: check every block. In this hall the S32's inputs normally come in on
  channels **25–32** as **AES50 A25-32**. Daisy-chained after the S32, the SD8's inputs arrive as
  **AES50 A 33–40**: route a block of 8 channels to them (see **Technical verification**).
- 🚩 Set the SD8's **output-bank switch** so its outputs carry what the output list says. In this
  hall, AES50 A outputs 1–8 carry the X32's **Output 1-8** and 9–16 carry **Output 9-16**, so the
  SD8 on its 1–8 bank plays the same eight outputs as the S32's OUT 1–8.
- 🚩 Patch the playback **Mac mini** at FOH: its interface's outputs **1–2** (the track) into
  **AUX IN 1-2** on the X32, and a **click** on its own AUX IN.
- 🚩 The **click channel** goes to the performer's mix only: off the main L/R. Check it with the
  mains up: you should hear no click in the house.

**Q3 (short answer).** The SD8's inputs are all live on its meters, the S32 works, and the X32
hears nothing from the SD8. The cables are fine. What's the likely fix?

✅ **Answer.** Input routing on the X32: no block of channels is routed to AES50 A 33–40, where a
daisy-chained SD8's inputs arrive. Route a free block of 8 channels to them.

## 🔈 Load-in — the multichannel piece

Only if a piece brings its own speaker system (at the showcase: eight channels on four STAGEPAS
systems and a sub, from a Clarett 8PreX).

- 🚩 The laptop and its Thunderbolt interface are **powered and connected first**, and stay that
  way until strike.
- 🚩 Routing inside the interface is set in **Focusrite Control** (the original app: Focusrite
  Control 2 doesn't support the Clarett Thunderbolt range).
- 🚩 Each output on a **TRS** cable into a **1/4" line input** on the STAGEPAS, set to **stereo**,
  not mono. The XLR inputs have no pan knob, so they can't keep two channels apart.
- 🚩 The sub's RCA input: through a small mixer (1/4" or XLR in, its 2-track RCA out).
- 🚩 Play each channel **alone** and walk the room: the right speaker, and only that speaker.
- 🚩 Listen for **hum** with the music stopped, speaker by speaker. If there's any, see **If
  something hums**.
- 🚩 The **video** cable (the showcase used 100 ft of HDMI from FOH to the projector) is tested
  with the actual laptop, not a stand-in.

## 🎤 Soundcheck and tech rehearsal — piece by piece

- 🚩 Line check **every input on the input list**: the right channel moves, the right name.
- 🚩 Condenser mics (a mic inside a piano, an instrument mic on a stand) need **+48 V** on their
  stage box input, switched on from the X32.
- 🚩 Every **laptop**: power supply plugged in, notifications and sleep off, volume at a known level.
  If two DAWs run on one Mac, open both and play both. On **Windows**, two programs sharing one
  audio driver usually fails: give each its own interface or don't do it.
- 🚩 A laptop's **headphone jack into a stage box** goes through a **DI**, not a 3.5 mm-to-XLR cable.
  It may work without one; the DI is the version that doesn't hum and has the right level.
- 🚩 A **5-pin MIDI** controller into a laptop: through a MIDI-to-USB adapter. Test note-off and the
  sustain pedal, not just a few notes.
- 🚩 Every **performer feed**: the performer hears what they asked for (click, track, themselves),
  at a level they approve. Write the X32 output and mix bus on the output list.
- 🚩 If a performer's own software clips (a **Max** patch, a DAW), the distortion is upstream of the
  console: no fader fixes it. Ask them to turn down **inside** their rig.
- 🚩 Save an X32 **scene** per piece, or one for the whole show, and write which on the run order.

**Q4 (multiple choice).** A performer's laptop distorts. The X32 channel's meter isn't near the top
and the gain is sensible. What do you do?

- a) Turn down the X32 channel's fader.
- b) Turn down the gain on the stage box input.
- ✅ c) Ask the performer to turn down inside their own software or interface.
- d) Put a limiter on the channel.

## 🎬 Show

- 🚩 Before doors: the **emergency XLR** is coiled at FOH, and you know which X32 local outputs are
  free.
- 🚩 At each **changeover**, run the run order's checklist for the next piece: the right scene, the
  click muted in the house, the next laptop awake.
- 🚩 Keep a **pen and the output list** at FOH, and note anything that fails, when, and what you did.

## 🧰 If a stage box output dies mid-show

At the showcase, the SD8's outputs stopped during a piece while its inputs kept working. The fix
took about a minute.

- 🚩 Confirm it's the box: the mix bus's meter moves on the X32, and the performer still hears
  nothing.
- 🚩 Unplug the performer's cable from the stage box output.
- 🚩 Plug it into a **free local XLR output** on the X32's rear panel (the emergency XLR, if it
  won't reach).
- 🚩 On the X32 output routing, set that output to the **same mix bus**. The performer hears it
  again.
- 🚩 Tell the performer and the stage manager what happened, after the piece. Write it down.

**Q5 (short answer).** Why does the fix work when the stage box's inputs are still fine?

✅ **Answer.** The mix bus itself is fine: only the stage box's outputs failed. A local output on
the console carries the same bus, so moving the cable and routing that output to the bus bypasses
the broken part.

## 🧰 If something hums

- 🚩 Turn the **speakers off** before you move any power or unplug any audio. Leave a Thunderbolt
  interface and its laptop running.
- 🚩 Unplug only the **laptop's charger** and listen on battery. A change points at the charger.
- 🚩 Switch off one humming speaker, unplug its **audio input**, switch it back on. Hum gone: the
  cause is upstream. Hum still there: it's that speaker or its power.
- 🚩 Upstream: a **ground-loop isolator** (or a DI's ground lift) in that line. Suspect any
  unbalanced link first, such as an RCA input on a sub.
- 🚩 After adding isolators, check **every channel still has signal**. One of the showcase's
  isolators lost signal.

## 🏁 Strike

- 🚩 Speakers and amps **off first**.
- 🚩 Laptops shut down properly, **then** their interfaces off.
- 🚩 Stage boxes and Cat5 coiled and back where they came from.
- 🚩 Borrowed gear back to each performer; course gear counted against the equipment list.
- 🚩 X32: recall the hall's default scene, and check **ROUTING → INPUT** is back to the hall's
  normal routing (inputs 1–24 Local, 25–32 AES50 A25-32), for whoever runs the next gig.

## ✅ Definition of done

- 🚩 Every piece ran with every source on its own planned channel, and no click in the house.
- 🚩 Anything that failed during the show is written down with what fixed it.
- 🚩 The hall's X32 routing is back to normal and the gear is put away.

## 💭 Before you leave

- 🚩 Tell your supervisor what failed and how you fixed it. The next showcase starts from your notes.

## ⚙️ Technical verification

**Confirmed (the showcase crew's debrief and the instructor's notes, October 2026):**

- The S32 on the X32's AES50 A, the SD8 daisy-chained from the S32's AES50 B to its AES50 A, on
  opposite sides of the stage.
- The SD8's outputs failed during the first half while its inputs kept working; the fix was moving
  the cable to an X32 local output.
- Two pieces' planned inputs collided and were fixed just before the second one.
- The FOH Mac mini's interface outputs 1–2 into X32 AUX IN 1-2; a mono click on another AUX IN.
- The Clarett 8PreX: Thunderbolt, Focusrite Control, lowered security on the Mac, a reboot if it
  loses power. STAGEPAS 1/4" inputs set to stereo; the sub through a small mixer's RCA output;
  ground-loop isolators on each line.
- Rear projection with the projector's image flipped.
- From photos of the X32 (2026-10-20): ROUTING → INPUT 1–24 Local, 25–32 AES50 A25-32; AES50 A
  outputs 1–8 = Output 1-8 and 9–16 = Output 9-16.

**Still open:**

- **Where a daisy-chained SD8's inputs land.** Behringer's documentation puts them at AES50 A 33–40
  after a 32-input S32. Which X32 input block the showcase routed to them wasn't recorded, and the
  menu option's exact name should be checked on the console.
- **The SD8's output-bank switch:** its exact label and the position used at the showcase.
- **Why the SD8's outputs failed** (cable, switch, power or the box) and whether it's been tested since.
- **The click's AUX IN** (3 or 4) and whether the bass clarinetist heard it on a wedge or an earpiece.
- **The STAGEPAS switch** for stereo vs mono on the 1/4" inputs: its label on the 400 and the 600.
- **The X32's default scene name** to recall at strike.

## 🤖 AI use disclosure

Drafted by AI (Claude, via Claude Code) from the crew's debrief of the Chapman Faculty
Electroacoustic Showcase (dictated in class on October 19, 2026), the instructor's load-in notes, and
photos. The facts are theirs; the AI arranged them into the site's checklist format, added the
standard safety lines, and listed what isn't confirmed. Not yet run step by step at a real gig.
