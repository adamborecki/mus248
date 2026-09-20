# BH 209 (Salmon Recital Hall) — camera and audio intake

Working notes, not student-facing. This is the landing spot for the room's existing
documentation, which is still outside the repo.

The activity page (`cameras.md`) already carries a BH 209 orientation section built from
what is confirmed below. It stops there on purpose: the activity template's rule is that
gear details get verified before they become student instructions, and a click-path written
from recollection is exactly the thing that sends a student to the wrong menu at 7:50 on a
recital night.

## Confirmed (instructor, September 2026)

| | |
| --- | --- |
| Cameras | **AJA RovoCam**, installed in the hall |
| Control | **Software on a computer in the room** — not a touch panel, not a joystick |
| Recording | A **Blackmagic** recorder, to **SD card**; a higher-speed card is the norm |
| Audio | **Both** — embedded in the video, and a separate feed |
| Access | **Key code** on the door; most students in this course already have it |
| Documentation | Exists, is old, and has not been imported |

Not written down anywhere: the key code itself. This repo is public — it stays out.

## Still needed

Answering these turns the orientation section into a procedure. Roughly in the order that
unblocks the most:

- [ ] **The control software** — its name, which computer it runs on, how a student opens it.
      AJA's own application for RovoCam is RovoControl; confirm that is what the room uses and
      not a browser pointed at the camera, or something third-party.
- [ ] **How many cameras there are, and where they point.**
- [ ] **Which exposure controls the software actually exposes**, and what they are called there.
      If iris/gain/shutter/white balance are not all reachable, the BH 209 drill gets built
      around the ones that are, rather than pretending the handheld five transfer intact.
- [ ] **The Blackmagic recorder** — model, where the SD slot is, what card speed it needs, and
      whether a card lives in it or students bring their own.
- [ ] **The data-transfer procedure.** Explicitly wanted. After the take: which card, which
      computer, where files go, how a student confirms the take is good before handing the room
      over.
- [ ] **The separate audio feed** — what it comes off, where it records, whether starting it is
      its own action. This one also unblocks target 3 (Stereo Recording), which wants to know
      what the hall's built-in audio system is.
- [ ] **Who a student asks** when their key code does not work.

## Getting the documentation in

Plain text in the repo, assets linked — same as every other activity's source here.

If it is a Google Doc shared as "anyone with the link can view":

```bash
tools/import-activity-doc.sh bh209-cameras https://docs.google.com/document/d/DOC_ID/edit
```

That writes `content/activities/_source/bh209-cameras.txt`. Anything else — a PDF, a Word
file, a wiki page — paste the text into that same path by hand; verbatim is fine and
preferred, since this folder is provenance, not prose.

Screenshots matter more than usual here, because the whole interface is on a screen: one of
the control software with a live picture, and one of the recorder's front panel, would answer
several of the open items above faster than any amount of description. Downscale them to
sensible web JPEGs before committing (see this folder's README on the Mic Stand Yoga media
for why), or host them elsewhere and link.

Once the source is in, rewrite the BH 209 section of `cameras.md` from it and move the
answered items out of that file's **Technical verification** list.
