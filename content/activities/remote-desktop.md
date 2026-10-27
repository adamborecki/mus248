---
id: remote-desktop
title: "Apple Remote Desktop (OH B01)"
emoji: "🖥️"
coreSkillAreas: []
status: In Development
revised: "2026-10-27"
estimatedTime: "10 minutes to read"
access:
  mode: "Any location"
  location: "Using it: the Mac that has Remote Desktop set up for the OH B01 lab (which Mac ❓)."
  supervision: "Student employees only, for department work."
groupSize:
  minimum: 1
  ideal: "1"
  maximum: 1
  solo: true
activityFamily: ""
level: "Reference"
roundsSupported: false
---

> 🧪 **Status: In Development.** Written 2026-10-27 from a spoken walkthrough given at the
> Remote Desktop Mac, plus three photos of its screen. Nothing has been tried from this page yet.
> Lines marked ❓ are open items, all listed under **Technical verification**.

> 🔒 **Redacted for this public site:** the Remote Desktop password, the freeze software's
> password, any hint to either one, and the lab's network addresses. `[passwords — ask
> instructor]`. The photos weren't included: the screen behind them showed a sign-up sheet with
> names and phone numbers.

## 🖥️ What this is

**Apple Remote Desktop** (ARD, the app is just called **Remote Desktop**) runs every iMac in OH B01
from one Mac: wake them, restart them, copy files to them, install software, send a message to
the screens, and **freeze or thaw** them. It's how the lab gets updated without walking to 22
computers.

> ⚠️ **Student employees only, for real department work.** Remote Desktop can delete everything
> on every computer in the room at once. Don't share the password with anyone, don't try things
> out "to see what happens," and when you're not sure, ask before you click.

## 🗝️ Key terms

**Remote Desktop** · **computer list** · **frozen** · **thawed** · **task** · **History** ·
**Copy Items** · **Share Screen**

| Term | What it means |
|---|---|
| **Remote Desktop** | Apple's app for managing many Macs at once. Open on one Mac and controls the others over the network. |
| **Computer list** | A saved group of computers in the left sidebar. **OHB01** is the 22 lab iMacs, **OHB01-01** through **OHB01-22**. |
| **Frozen** | The lab iMacs' normal state. Changes made while frozen are wiped when the computer restarts, so every student starts from the same clean setup. ❓ |
| **Thawed** | Unfrozen. Changes made now survive a restart. Thaw only to install or update something, then freeze again. |
| **Task** | One action sent to a set of computers (Wake, Restart, Copy Items…). Every task you run lands in **History**. |
| **History** | The sidebar list of past tasks, newest first, each with a status icon: ✓ worked everywhere, ⚠ failed on some computers, ✕ failed. |
| **Copy Items** | Copies files (an installer, for example) from this Mac to the selected computers. |
| **Share Screen** | Shows this Mac's screen on the selected computers. |

## 📍 Logistics

Read it anywhere. **Using** Remote Desktop happens at the one Mac it's set up on ❓, and only as a
student employee doing department work. You need two passwords, both from the instructor, and
neither one goes anywhere else. `[passwords — ask instructor]`

## 🧭 The window

- **Left sidebar, top:** computer lists. **OHB01** is the lab. Others seen in the photos: **All
  Computers**, **OH B01 & Inst**, **OHB01 & studios**, **BH20x**, **Scanner**, **Scanner 2**. ❓ What
  each of those holds hasn't been written down.
- **Left sidebar, middle:** **Thaw Computers** and **Freeze Computers**. These aren't lists;
  they're saved tasks. Dragging computers onto one runs it on them.
- **Left sidebar, bottom:** **Task Server**, **Active Tasks** (what's running now), and **History**.
- **Toolbar:** **Observe**, **Control**, **Restart**, **Copy**, **Install**, **UNIX**, **Reports**,
  **Spotlight**.
- **Computer table** (after you click a list): **Name**, **Current Status**, **Current
  Application**, **Current User**, **OS Version**, and **Computer Info #1**, which shows **Frozen**
  for a frozen iMac. ❓

Reading **Current Status**: **Idle (2h 3m)** means nobody has touched that iMac for that long.
**Available** means Remote Desktop can reach it. Look at **Current Application** too: an iMac
that's **Available** with **Logic Pro** open may have a student sitting at it. ❓

## 🧊 Freeze and thaw

The iMacs stay **frozen** so a class can't leave a mess for the next one. To install or update
anything, an iMac has to be **thawed** first, or the change disappears at the next restart.

- **Thaw:** select the computers in the **OHB01** list, then **drag them onto Thaw Computers** in
  the sidebar.
- **Freeze:** select them, then **drag them onto Freeze Computers**. Select all with ⌘A to do the
  whole room.
- The freeze software has **its own password**, separate from Remote Desktop's. ❓
- Afterward, check **History** for that task's icon, and **Computer Info #1** for the result. ❓

Freezing or thawing probably restarts the iMac, so check nobody is working on it first. ❓ **Don't
leave the lab thawed.** Freeze every computer you thawed before you leave.

## 📦 Copy and install

- **Manage → Copy Items** (or the **Copy** button) puts files on the selected computers: an
  installer, a sample library, a session template. ❓ Where the files land.
- The **Install** button installs a `.pkg` installer on the selected computers. ❓ Not mentioned
  in the walkthrough.
- Licensed software that's been waiting for someone with the time to install it is the reason
  employees have this password at all. ❓ Which software (the walkthrough mentioned Dante).

## 📢 Interact

**Interact** holds what you do *to the screens*: **Share Screen** (your screen on theirs), **Send
Message**, **Unlock Screen**, plus **Observe** and **Control** in the toolbar. ❓ Exact menu
contents.

## 🛟 Before and after any task

- **Select only the computers you mean.** The selection count is at the bottom of the window
  ("22 computers · 1 selected"). Check it before you click.
- **Asleep computers miss tasks.** Run **Wake** first if any iMacs aren't showing up. ❓ Where Wake
  is in the menus.
- **Read History after.** ⚠ or ✕ means some computers didn't get it. Find which ones and run it
  again on just those.
- **Leave the room as you found it:** frozen, and no one's work lost to a restart.

**Q1 (multiple choice).** You install an update on a lab iMac while it's frozen, then restart it.
What happens?

- a) The update stays, because you installed it as an administrator
- ✅ b) The update is wiped; the iMac comes back the way it was frozen
- c) The iMac thaws itself so the update can finish
- d) Nothing changes until someone runs Freeze Computers

**Q2 (short answer).** How do you thaw one iMac, say OHB01-15, in Remote Desktop?

✅ **Answer.** Click the **OHB01** list, select **OHB01-15**, and drag it onto **Thaw Computers** in
the sidebar. Freeze it again the same way when you're done.

**Q3 (fill in the blank).** After running a task, a ⚠ next to it in __________ means it failed on
some of the computers.

✅ **Answer.** History. Check it after every task, and rerun it on the computers that missed it.

## ⚙️ Technical verification

Everything below came from one spoken walkthrough and three photos. Open items (each marked ❓
above):

- **Which Mac** has Remote Desktop set up for the lab, and where it is.
- **The freeze software.** The walkthrough called its password "the polar bear," which suggests
  Faronics **Deep Freeze**. Confirm the product, whether freezing and thawing restarts the iMac,
  and whether **Computer Info #1** really reports its state (all 22 read **Frozen** in the photos).
- **What Thaw Computers and Freeze Computers are.** Their sidebar icon matches **Send UNIX
  Command**, so they look like saved commands. Confirm, and say whether they need the freeze
  password typed in.
- **Current Status.** What **Available** means versus **Idle** in this version, and whether an
  **Available** iMac can be assumed to be in use.
- **Menus:** **Manage → Copy Items** (said in the walkthrough), where **Share Screen**, **Send
  Message**, **Unlock Screen**, and **Wake** live, and where copied files land on the iMacs.
- **Which software** is waiting to be installed. The walkthrough mentions Dante, but **Dante Jam
  Session** says the OH B01 iMacs already have Dante Virtual Soundcard. A license, a different
  Dante product, or an update?
- **The other computer lists** (OH B01 & Inst, OHB01 & studios, BH20x, the scanners): what each
  holds, and whether employees should touch them.
- **History** in the photos shows several ⚠ and ✕ results (Freeze, Wake, Restart). Worth knowing
  why: asleep computers, or something else.

**Left out on purpose:** both passwords and the hint given for one of them, the iMacs' network
addresses, and the photos (a sign-up sheet with names and phone numbers was in the background).

## 🤖 AI use disclosure

Written by AI (Claude, via Claude Code) from a voice transcript of the walkthrough and three photos
of the Remote Desktop window, both supplied by the instructor. The window layout, list names, and
column names were read from the photos; the rest is the walkthrough, reorganized, plus general
Remote Desktop behavior marked ❓ where it wasn't confirmed. The three questions were added.
Nothing here has been tried from this page.
