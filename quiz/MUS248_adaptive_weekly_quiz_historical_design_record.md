# MUS 248 Weekly / Adaptive Quiz Idea --- Historical Design Record

**Conversation period:** September 3--13, 2026\
**Purpose of this document:** Historical context for development of a
real MUS 248 personalized/adaptive weekly quiz system. This conversation
predates a later chat in which the actual course coverage, real
questions, and MVP Version 1 decisions were developed in much greater
detail. Therefore, **use this document primarily for design history,
pedagogical intent, constraints, and ideas worth preserving --- not as
the authoritative current specification or current question bank.**

## 1. Original idea and motivation

The initial idea was to introduce **weekly quizzes for MUS 248 (AV
Concert Recording)**, with some portion of each quiz personalized to the
individual student.

The motivating problem was that MUS 248 students have substantially
different backgrounds and amounts of hands-on experience. A completely
uniform quiz may be too basic for an experienced student while
simultaneously failing to give a less-experienced student the repetition
needed to close specific gaps.

The proposed personalized system was intended to:

-   Make sure students are actually learning and retaining material.
-   Diagnose individual knowledge gaps.
-   Provide repeated opportunities to close those gaps.
-   Give less-experienced students targeted review.
-   Give more-experienced students harder applications of concepts they
    already know.
-   Incorporate each student's actual hands-on activity history.
-   Use AI to reduce instructor workload and generate variations,
    feedback, and personalization.
-   Remain low-stakes enough that students can learn through mistakes.
-   Eventually become highly automated so it continues functioning
    during busy parts of the semester without substantial weekly
    instructor work.

A major early realization was that the valuable idea is **not simply "AI
generates a different quiz for every student."** The stronger idea is a
recurring **diagnostic + retrieval + feedback system** that notices what
a student has done, what they missed, and what they should encounter
again.

------------------------------------------------------------------------

## 2. Intended purposes of the weekly quiz

Several possible purposes were considered. The eventual direction
emphasized a combination of:

1.  **Retrieval practice** --- students repeatedly retrieve important
    knowledge rather than seeing it once and forgetting it.
2.  **Diagnosis** --- the instructor/system identifies what students do
    and do not understand.
3.  **Gap repair** --- missed concepts return later rather than
    disappearing after a single quiz.
4.  **Accountability** --- some knowledge should genuinely affect the
    grade once students have had sufficient opportunity to learn it.
5.  **Preparation for larger assessments** --- weekly retrieval should
    support later midterm/final performance.
6.  **Differentiation** --- advanced students can receive more
    applied/troubleshooting questions while beginners can receive
    foundational practice.
7.  **Connection to practical experience** --- quiz content should
    respond to activities the student has actually completed.

The quiz was therefore conceptualized more as a **weekly learning
check** than a conventional one-shot quiz.

------------------------------------------------------------------------

## 3. Low stakes, but not meaningless

A central tension throughout the conversation was grading.

The first thought was that personalized questions might simply receive
full credit for completion because students would be receiving different
levels of difficulty. That protects an advanced student from being
punished because the system intentionally gave them harder questions.

However, a concern emerged that making too much of the quiz automatic
full credit could make the course feel artificially easy or allow
students to repeatedly fail to learn important material without
meaningful consequences.

This led to an important refinement:

> **"Common vs. adaptive" and "graded vs. full-credit/formative" should
> be treated as two different axes.**

A question can be:

-   Common + graded
-   Common + formative
-   Adaptive + graded
-   Adaptive + formative
-   Adaptive + challenge/stretch

Therefore, **adaptive should NOT automatically mean full credit.**

------------------------------------------------------------------------

## 4. Three useful question roles

By the later part of the conversation, three broad question roles had
emerged.

### A. Accountable / required questions

These affect the accuracy portion of the student's grade.

The criterion is not merely "everyone saw this slide." Instead:

> **Has this student had a reasonable opportunity to learn this
> competency, and is it now reasonable to expect them to know it?**

Accountable questions can be common to the whole class OR personalized
to a student.

For example, if a student has repeatedly completed stereo-recording
work, a gain-staging or stereo-routing question may reasonably become
accountable for that student even if another student has had less
exposure.

### B. Learning / repair / formative questions

These generally receive credit for a legitimate attempt.

Possible sources include:

-   Something the student missed previously.
-   Material recently introduced but not yet sufficiently practiced.
-   A concept the system wants to diagnose.
-   Spaced retrieval of older material.
-   A skill for which the student's opportunity to learn is still
    limited.

The point is to create retrieval and useful evidence without punishing
students for being in the process of learning.

### C. Stretch / challenge questions

These are usually completion-based or otherwise low/no-penalty.

They can include:

-   More advanced applications.
-   Troubleshooting scenarios.
-   Transfer to unfamiliar situations.
-   Questions based on repeated activity experience.
-   Additional concepts appropriate to an advanced student.

An important design principle is that students should **not be punished
for becoming advanced**. If the system intentionally raises difficulty
because a student is succeeding, those challenge questions should not
create a perverse incentive to remain at an easier level.

------------------------------------------------------------------------

## 5. Students should know what kind of question they are answering

The conversation concluded that students should probably be able to see
whether a question is accuracy-graded or full-credit-for-attempt.

Possible lightweight labels:

-   **Core / Graded**
-   **Practice / Full credit for attempt**
-   **Challenge / Full credit for attempt**

The distinction should be visible without making the quiz feel like
several disconnected tests.

Reasons for transparency:

-   Students understand the rules.
-   Students know when a difficult question is intentionally
    exploratory.
-   Students may be more willing to attempt challenging material.
-   The system avoids a hidden-rule problem in which students do not
    know whether an error matters to the grade.

------------------------------------------------------------------------

## 6. Opportunity to learn is more important than "it appeared on a slide"

A very important correction came from the instructor:

Some material may have appeared briefly on slides but **was not
necessarily expected to have fully sunk in**.

For example, exposure concepts such as aperture, shutter speed, and
ISO/gain may have been introduced briefly before students had
substantial practice.

Therefore:

> **Being mentioned in lecture does not automatically make a topic fair
> game for graded common-core assessment.**

A useful progression was proposed:

### 0 --- Not yet expected

Do not assess for accountability.

### 1 --- Introduced

Can appear in no-penalty retrieval/practice.

### 2 --- Practiced

Can appear frequently; mistakes trigger feedback and further retrieval.

### 3 --- Expected / accountable

Accuracy can now affect the grade.

### 4 --- Established / advanced

Use application, transfer, and troubleshooting. Some deliberately
difficult questions may still remain no-penalty challenges.

This can be summarized as:

> **Opportunity → Practice → Accountability → Advanced Application**

------------------------------------------------------------------------

## 7. Activity completion should influence assessment

Activity history was identified as one of the most distinctive and
valuable data sources for personalization.

At the time of this conversation, the approximate activity history
across the class was:

-   Most students had completed the **DAW Training Circuit**.
-   Most students had completed **Basic Stereo Recording**.
-   Most students had completed **Portable Video Cameras**.
-   About **9 students had completed X32 once**.
-   About **5 students had completed Live Looping once**.

The original idea was that repetitions could determine question
difficulty.

Example:

-   X32 ×0 → no detailed X32 questions assumed.
-   X32 ×1 → introductory X32/live-sound questions become eligible.
-   X32 ×2 → more applied questions.
-   X32 ×3+ → troubleshooting/transfer questions.

However, an important distinction emerged:

> **Activity completion should control what questions a student has had
> an opportunity to be asked; completion itself should not automatically
> equal mastery.**

Doing an activity twice is evidence of exposure/practice, not proof that
the student learned everything correctly.

Actual quiz responses, hands-on demonstrations, and/or gig performance
provide additional evidence of mastery.

------------------------------------------------------------------------

## 8. Shared activities can migrate into common/accountable material

An activity does not necessarily remain "personalized" forever.

If nearly the entire class completes an activity and the relevant
concepts are reinforced, some of that material can become shared course
knowledge.

Portable cameras were given as an example.

A basic question such as identifying aperture/iris, shutter, and
ISO/gain might eventually become shared/accountable after adequate
practice.

A more nuanced question about visual consequences of a very slow shutter
speed might remain formative or adaptive until the concept has been
reinforced sufficiently.

Therefore, content can move over time:

**Introduced → shared practice → common/accountable**

This means the definition of "core" should evolve throughout the
semester rather than being fixed solely by the syllabus or first
lecture.

------------------------------------------------------------------------

## 9. Early course material available during this historical conversation

The following material was explicitly provided as Week 1 / early-course
content.

### Professionalism = reliability

Students had been told that professionalism means reliability,
including:

-   Be on time.
-   Communicate early.
-   Stay engaged.
-   Take care of equipment.
-   Help your group.
-   Finish the job.
-   Practice basic hygiene.
-   Be someone people can trust.

### Five Core Skill Areas

1.  Audio Capture
2.  Video Capture
3.  Live Sound
4.  Data Management & Archiving
5.  Post Production

### Audio basics

Students had been introduced to:

-   Know signal flow.
-   Set correct I/O.
-   Arm the correct track.
-   Use 48V when appropriate.
-   Set gain carefully.
-   Avoid clipping.
-   Check mono vs. stereo.
-   Listen back.
-   Record a test.
-   Know where files are being saved.

### Video basics

Students had been introduced to:

-   Manual exposure.
-   Aperture / iris.
-   Shutter speed.
-   ISO / gain.
-   Intentional frame rate.
-   Manual white balance.
-   Focus.
-   Framing.
-   Record a test before the real event.

Again, **this historical record explicitly notes that merely being
introduced to these concepts did not necessarily make all of them
appropriate for immediate accuracy grading.**

### Big-picture recording principle

Before recording, students should understand:

-   Where the signal/image is coming from.
-   Where it is going.
-   Whether settings are appropriate.
-   Whether they are actually capturing what they think they are
    capturing.

### MUS 248 overall goal

Build enough technical skill and reliability that students can
eventually handle recording work without constant supervision.

------------------------------------------------------------------------

## 10. Early live-sound material

A newer slide had introduced these ideas:

-   Know the signal flow: **Source → microphone/DI/playback device →
    mixer → amplifier if needed → speakers**
-   Set input gain/preamp first rather than relying on channel/master
    faders.
-   **Mains = audience mix.**
-   **Monitors = performer mix.**
-   Monitor mixes may differ from the main mix.
-   Feedback occurs when speaker sound returns to a microphone and loops
    through the system.
-   Speaker placement, microphone direction, level, and EQ affect
    feedback.
-   Active/powered speakers contain amplification.
-   Passive speakers require an external power amplifier.
-   Condenser microphones and some active DI boxes may require 48V.
-   Know what feeds mains, monitors, recordings, and other outputs
    before turning things up.
-   Power sequencing: **Speakers ON last; speakers OFF first.**
-   Make routing/fader/48V changes deliberately.
-   Test every important input/output/playback source before the event.
-   Before the show, know where important signals originate, where they
    go, who needs to hear them, and which controls affect them.

This material was useful for building future common and adaptive
live-sound questions, but the conversation cautioned against assuming
that every bullet immediately constituted mastered common-core
knowledge.

------------------------------------------------------------------------

## 11. Portable Cameras activity

The class had an in-class Portable Cameras activity involving three
camera models:

-   Canon G50
-   Panasonic GH5
-   Sony AX100

Students practiced camera-specific operation including:

-   Powering on.
-   Lens cap/cover management.
-   Auto vs. manual focus.
-   Entering manual exposure mode.
-   Adjusting iris/aperture.
-   Adjusting shutter speed.
-   Adjusting ISO/gain.
-   Adjusting white balance/color temperature.
-   Restoring cameras to default settings.

The activity used a nominal/default setup around:

-   F4.0
-   3 dB gain / approximately ISO 400
-   1/60 shutter
-   3200 K
-   autofocus

Students recorded demo files including:

-   A baseline file using the specified settings.
-   Manual-focus intentionally out-of-focus example.
-   Autofocus/in-focus example.
-   Comparisons of F4 vs. a more closed aperture such as F5.6.
-   Comparisons of low vs. higher gain.
-   Comparisons involving shutter speed.
-   Comparisons of approximately 3200 K vs. very low/high color
    temperatures.
-   Testing the SD-card recording on a computer.
-   Restoring defaults and returning equipment/batteries.

### Assessment implication

The conversation proposed distinguishing **transferable camera
knowledge** from **camera-model trivia**.

Transferable knowledge is more valuable for common/accountable
assessment, for example:

-   What aperture, shutter, and gain/ISO do.
-   Manual vs. autofocus.
-   White balance.
-   Testing a recording.
-   Diagnosing exposure/focus problems.

Camera-specific button locations may be appropriate as occasional
personalized retrieval for students who used that model, but probably
should not dominate common course assessment.

------------------------------------------------------------------------

## 12. Basic Stereo Recording activity

The Basic Stereo Recording activity involved:

### Required materials

-   Computer
-   Audio interface
-   Stereo microphones
-   Stereo bar

### Deliverables

-   WAV audio files
-   Photos of setup

### Techniques

Students were asked to research and record:

-   ORTF
-   AB
-   XY

### Setup expectations

-   Left/right channels panned appropriately.
-   Gain set identically.

### "Goldilocks" gain exercise

Students created examples of:

-   Too loud → clipping/distortion.
-   Too quiet → insufficient gain.
-   Just right → peak amplitude around -12 dB.

### Equipment variations

Students could use interfaces/recorders such as:

-   Focusrite 2i4
-   Zoom F8
-   Zoom H4n Pro
-   Zoom H5
-   SSL 2+

### Assessment progression imagined during the conversation

Possible progression:

**Introductory** - Identify the stereo techniques practiced.

**Recall** - Understand left/right panning. - Remember basic gain
expectations.

**Application** - Classify -38 dBFS as too quiet. - Recognize
approximately -12 dB peak as the activity's "just right" target.

**Troubleshooting** - Two correctly recorded microphones are both panned
center; identify the stereo-routing issue.

**Advanced transfer** - Diagnose why a stereo image is weighted heavily
to one side despite nominally matched preamp settings.

The point was to let activity repetition and demonstrated success unlock
more sophisticated reasoning rather than merely more trivia.

------------------------------------------------------------------------

## 13. X32 and Live Looping

At the time, the full X32 activity had not yet been pasted into this
conversation because it was very long.

The intended future analysis of X32 was to extract:

1.  Transferable live-sound skills taught by the activity.
2.  X32-specific knowledge students should retain after initial
    practice.
3.  More advanced troubleshooting that becomes reasonable after repeated
    practice.

Approximately nine students had done X32 once at that historical moment.

Approximately five had done Live Looping once.

**Important:** This document does not contain enough source information
to define the actual X32 or Live Looping competencies. Use the
later/current MUS 248 materials as the authoritative source.

------------------------------------------------------------------------

## 14. Spaced retrieval and repair

One of the strongest ideas from the conversation was that incorrect
answers should not simply disappear.

A primitive model was:

**Miss → question returns later**

This was refined to:

> **Miss → feedback/intervention → spaced re-test**

Example:

A student incorrectly answers an ORTF question.

The system should provide useful feedback, perhaps reminding them of the
relevant setup and contrasting it with XY.

Later, instead of repeating the exact same wording, the concept returns
in another form:

-   Identify ORTF from a diagram.
-   Identify an incorrect ORTF setup.
-   Compare ORTF and XY.
-   Choose an appropriate stereo technique for a scenario.

The goal is to determine whether the **concept was repaired**, not
whether the student memorized one answer.

------------------------------------------------------------------------

## 15. Later evidence should matter more than early failure

A related idea was that the adaptive engine should think in a
mastery-oriented way even if Canvas ultimately receives ordinary weekly
scores.

Example:

-   Week 3: phantom power incorrect
-   Week 4: phantom power incorrect
-   feedback/practice
-   Week 6: phantom power correct
-   Week 8: applied phantom-power scenario correct

The meaningful educational conclusion is that the student **now
understands phantom power**, not that their lifetime average on
phantom-power questions is 50%.

This suggests that persistent competency status should be based
substantially on **recent and repeated evidence**, rather than averaging
every historical mistake forever.

------------------------------------------------------------------------

## 16. Different kinds of evidence

The conversation identified three importantly different forms of
competence:

### Recall

Example: recall a factual stereo setup value or terminology.

### Reasoning

Example: choose a technique or troubleshoot a scenario.

### Performance

Example: physically set up the microphones or correctly operate the
console/camera.

A digital quiz is well suited to recall and reasoning.

It should **not pretend that answering a web question proves hands-on
competence.**

A larger MUS 248 competency picture could therefore combine:

-   **Quiz = knowledge/reasoning evidence**
-   **Activities = practice/exposure evidence**
-   **Hands-on demonstrations/gigs = performance evidence**

This distinction should be preserved in the real system.

------------------------------------------------------------------------

## 17. Student agency

An early possibility was having students effectively choose questions
for the following week.

This was refined into a better idea:

Students should probably choose **topics**, not exact questions.

Possible end-of-quiz prompts:

-   "Choose one topic you would like Future You to encounter again."
-   "Choose one area where you would like a harder challenge."

Potential sources for next week's adaptive questions:

1.  Instructor-defined common/accountable material.
2.  Previous incorrect answers.
3.  Activities/repetitions completed.
4.  Student-requested review/challenge topic.

Student self-diagnosis can contribute to personalization, but the system
should not rely on it exclusively.

------------------------------------------------------------------------

## 18. Avoid a punishment loop

The system should not become:

**Miss → remedial question → miss → remedial question → miss forever**

That could make adaptive assessment feel like a machine continually
reminding struggling students what they are bad at.

Instead, the system should include:

-   Corrective feedback.
-   Resources or references.
-   Time before re-testing.
-   Different question forms.
-   Recognition of what the student is doing well.
-   Appropriate challenges and successes in addition to remediation.

Personalization should include strengths and advancement, not only
deficits.

------------------------------------------------------------------------

## 19. AI's role

The instructor was comfortable with AI doing substantial work, including
question generation and personalization, provided privacy and workload
concerns are handled sensibly.

However, the conversation strongly recommended that AI **not have
unrestricted authority over course content**.

A better architecture is a curated competency/topic database containing
authoritative facts and instructional intent.

Example conceptual record:

``` yaml
topic: ORTF

required_facts:
  - cardioid microphones
  - 110 degree included angle
  - 17 cm capsule spacing

intro_question_types:
  - identify ORTF from diagram
  - recall dimensions

application:
  - compare XY and ORTF
  - choose technique for scenario

troubleshooting:
  - identify incorrect setup
  - diagnose geometry

prerequisites:
  - polar patterns
  - stereo localization basics
```

Then AI can create varied questions and scenarios **within
instructor-approved boundaries**.

Design principle:

> **AI can be the question writer; the curated course knowledge base
> should be the authority.**

This reduces the risk of plausible but technically incorrect generated
audio-engineering questions.

------------------------------------------------------------------------

## 20. Privacy / pseudonymous learner records

The instructor expressed interest in avoiding personally identifying
information in the AI-facing system.

Possible pseudonymous records:

``` yaml
learner_id: learner_07

activities:
  stereo_xy: 2
  x32: 1

topics:
  phantom_power: needs_retrieval
  gain_staging: emerging
  ortf: proficient
```

A code such as `ORBIT-17` could identify a learner to the quiz system
without requiring the AI/question generator to receive the student's
name.

The mapping between code and real student identity could live separately
if necessary.

This conversation concluded that privacy did not appear to require
abandoning personalization, provided the implementation is thoughtfully
separated.

------------------------------------------------------------------------

## 21. Journal / spreadsheet as possible infrastructure

MUS 248 already had a journal/spreadsheet workflow.

An early idea was that this existing infrastructure might help track:

-   Activities completed.
-   Repetitions.
-   Topics missed.
-   Topics due for retrieval.
-   Student-requested practice.
-   Strengths/current status.

A conceptual student-facing skill map might look like:

  Topic               Current status   Evidence/source
  ------------------- ---------------- -------------------
  XY / ORTF           Practice again   Quiz 3
  Gain staging        Getting solid    PA activity ×2
  X32 monitor sends   New              X32 activity ×1
  Balanced cables     Solid            Quiz 2 + activity
  Video exposure      Practice again   Quiz 3

However, the instructor should not have to manually maintain a giant
competency spreadsheet. Ideally the system infers most of this from
quiz/activity data.

------------------------------------------------------------------------

## 22. Potential technical architecture discussed historically

Canvas quizzes were initially considered because they self-grade and
integrate naturally with the gradebook.

However, a custom webapp seemed increasingly attractive because Canvas
is less elegant for:

-   Persistent learner mastery profiles.
-   Custom question generation.
-   Adaptive spaced retrieval.
-   Activity-aware difficulty.
-   Personalized feedback.

A conceptual webapp flow:

1.  Student enters pseudonymous MUS 248 quiz code.
2.  App retrieves learner state.
3.  App selects/generates appropriate questions.
4.  Student completes common/accountable and adaptive/formative
    material.
5.  App updates topic/retrieval state.
6.  App displays useful feedback.
7.  App generates a Canvas-compatible completion/result summary or
    verification code.

Example conceptual output:

``` text
MUS 248 Weekly Quiz 4 — Completed
Common: 4/5
Retrieval: 2/3
Challenge: 2/2
Future review: phantom power
Student code: ORBIT-17
Verification: X7F92K
```

This fit the instructor's existing pattern of GitHub-hosted interactive
educational webapps that generate a summary students paste into Canvas.

**Important historical note:** A later conversation developed the actual
MVP Version 1 and real questions in much greater detail. The technical
architecture here should therefore be treated as exploratory design
history, not a final implementation specification.

------------------------------------------------------------------------

## 23. Early ideas about quiz length and weighting

The instructor later leaned toward **20--25 questions per weekly quiz**.

Several rough structures were considered.

One early structure:

-   8--10 common-core graded questions
-   4--6 common/practice questions
-   6--8 personalized/adaptive questions
-   2--3 challenge/retrieval questions

A later conceptual example used approximately **22 questions**:

-   \~10--12 accountable questions
-   \~6--8 formative adaptive questions
-   \~2--4 stretch questions

These numbers were explicitly **not finalized**.

Another idea was to make the Canvas quiz worth a smaller normalized
score, for example:

-   6 points knowledge/mastery
-   4 points participation in adaptive practice

Then the accountable-question accuracy determines the mastery portion
while completion of adaptive practice determines the practice portion.

The reason was to keep weekly quizzes meaningfully accountable but still
genuinely low stakes.

Again, the later MVP conversation should override these historical
numerical ideas.

------------------------------------------------------------------------

## 24. First-pilot / Version 1 philosophy

When asked whether the system could be implemented immediately, the
recommendation was **yes, but do not build the entire adaptive engine at
once.**

A useful first pilot could:

-   Include shared graded questions.
-   Include low-stakes diagnostic/practice questions.
-   Ask students which activities they have completed.
-   Use crude activity-aware branching.
-   Produce useful feedback.
-   Save enough data to personalize the following week's quiz.

The first quiz itself could create the initial adaptive dataset.

Possible initial questions about activity history:

-   DAW Training Circuit
-   Basic Stereo Recording
-   Portable Cameras
-   X32 Compact
-   Live Looping
-   Whether activities had been completed more than once

This was explicitly intended as a practical bridge to a more
sophisticated persistent learner model.

------------------------------------------------------------------------

## 25. "Fair-game map" concept

Before generating large numbers of questions, the conversation proposed
making a small competency map that distinguishes what is actually fair
to assess.

Possible columns:

  ----------------------------------------------------------------------------------------------
  Topic                  Introduced?    Practiced?     Common/accountable   Good adaptive topic?
                                                       yet?                 
  ---------------------- -------------- -------------- -------------------- --------------------
  Professionalism =      Yes            Yes            Yes                  Yes
  reliability                                                               

  Five core skill areas  Yes            Somewhat       Probably             Yes

  48V                    Yes            Yes            Probably             Yes

  Gain staging           Yes            Yes            Yes                  Yes

  Aperture/shutter/ISO   Yes            Some           Maybe                Yes
  names                                                                     

  Exposure tradeoffs     Yes            Limited        Not yet              Yes

  ORTF/XY/AB             Yes            Yes            Maybe after review   Yes

  Mains vs. monitors     Yes            Some           Probably soon        Yes

  X32 routing            Not for all    Some students  No class-wide        Yes,
                                        only                                activity-dependent
  ----------------------------------------------------------------------------------------------

This map was meant to prevent the system from overestimating student
knowledge simply because a topic appeared somewhere in instructional
materials.

------------------------------------------------------------------------

## 26. A small competency set is better for the first real system

The conversation recommended starting with perhaps **15--20 controlled
topics** rather than trying to model every possible MUS 248 skill
immediately.

Historical examples included:

-   professionalism / reliability
-   five skill areas
-   signal flow
-   input/output configuration
-   phantom power
-   gain staging
-   clipping
-   mono/stereo
-   test recordings
-   file location
-   aperture
-   shutter
-   ISO/gain
-   white balance
-   focus
-   mains vs. monitors
-   feedback
-   active/passive speakers
-   PA power sequencing
-   stereo recording techniques

Later additions could include:

-   X32-specific competencies
-   live looping
-   data management
-   archiving
-   post-production
-   concert workflows
-   additional video competencies

The key design principle is that a **small, authoritative competency map
can support many AI-generated question variants.**

------------------------------------------------------------------------

## 27. Example adaptive learner state

A conceptual learner record from the conversation:

``` yaml
activities:
  daw_circuit: 1
  stereo_recording: 2
  portable_cameras: 1
  x32: 0
  live_looping: 0

topic_state:
  gain_staging: strong
  phantom_power: due_for_review
  ortf: needs_repair
  manual_exposure: strong
  signal_flow: strong
  mains_vs_monitors: new

retrieval_queue:
  - ortf
  - phantom_power

student_request:
  - harder stereo recording question
```

This illustrates the distinction between:

-   activity exposure/history
-   knowledge/mastery state
-   retrieval scheduling
-   student agency

Those should probably remain separate fields/concepts in the real
architecture.

------------------------------------------------------------------------

## 28. Example adaptive question progression

The conversation repeatedly favored **different forms of the same
concept** rather than repeating identical questions.

### Phantom power example

Initial factual question: - Which device may require 48V?

Later applied question: - A condenser microphone is connected correctly
but produces no usable signal. What setting should you check?

Later troubleshooting: - Identify which input in a signal-flow scenario
should receive phantom power and explain why.

### Stereo example

Early: - Identify XY / ORTF / AB.

Later: - Correct left/right panning. - Identify too-low gain. - Diagnose
both stereo tracks being panned center.

Advanced: - Choose a stereo technique for a scenario. - Troubleshoot
asymmetric stereo image. - Explain tradeoffs.

### X32/live-sound conceptual progression

After limited experience: - What does a monitor send do?

After more experience: - Main mix works but wedge does not; what should
you investigate?

Advanced: - Vocalist wants more vocal in the monitor without increasing
the house mix; identify the relevant signal path/control and reason
about pre/post-fader behavior.

These examples are historical illustrations of the desired **difficulty
progression**, not necessarily approved final quiz questions.

------------------------------------------------------------------------

## 29. Feedback output should be richer than the Canvas grade

A student-facing result could distinguish course credit from diagnostic
accuracy.

Historical example:

``` text
Core Knowledge: 4/5

Adaptive Practice:
Completed
Currently correct: 3/5

Strong so far:
- XY setup
- balanced vs. unbalanced cables
- basic gain staging

We'll revisit:
- ORTF spacing
- pre-fader monitor sends

Suggested next step:
Repeat/review the relevant activity/reference before the next quiz.
```

The idea is that:

-   **Course grade** answers: "How much credit did I earn?"
-   **Diagnostic data** answers: "What can I currently do/remember?"
-   **Feedback** answers: "What should I do next?"

Those should not necessarily be the same number.

------------------------------------------------------------------------

## 30. Major design principles worth preserving

For the real Claude Code implementation, the strongest ideas from this
historical conversation are:

1.  **Personalization is a means, not the goal.** The goal is learning,
    diagnosis, retrieval, repair, and appropriate challenge.
2.  **Do not equate adaptive with ungraded.** Question selection and
    grading policy are separate dimensions.
3.  **Opportunity to learn matters.** A topic should not become
    accountable simply because it appeared on a slide.
4.  **Activity completion is evidence of exposure/practice, not
    automatic mastery.**
5.  **Repeated activity experience can justify harder questions and
    eventually greater accountability.**
6.  **Shared activities can migrate into common/accountable curriculum
    after sufficient class-wide practice.**
7.  **Missed concepts should return after feedback and spacing,
    preferably in varied forms.**
8.  **Later successful evidence should be able to supersede early
    mistakes in the competency model.**
9.  **Challenge questions should not punish advanced students for
    receiving harder material.**
10. **Students should know which questions are accuracy-graded versus
    practice/challenge.**
11. **A digital quiz measures knowledge/reasoning, not hands-on
    performance by itself.**
12. **Keep recall, reasoning, activity exposure, and performance
    evidence conceptually distinct.**
13. **AI should generate within an instructor-controlled
    competency/knowledge framework rather than inventing curriculum
    freely.**
14. **Use pseudonymous learner IDs if AI receives learner-state data.**
15. **Minimize instructor friction.** The system should continue
    functioning during busy weeks with little or no manual quiz
    construction.
16. **Start with a small, curated competency map rather than modeling
    the entire course at once.**
17. **Feedback should identify strengths, gaps, and useful next
    actions---not merely display a percentage.**
18. **The system should avoid deficit-only personalization; students
    should also receive advancement and challenge opportunities.**
19. **Student-selected review/challenge topics can supplement, but
    should not replace, evidence-based personalization.**
20. **The actual current course coverage and later MVP decisions should
    override assumptions made in this older conversation.**

------------------------------------------------------------------------

## 31. Guidance to Claude Code / future implementation work

This document should be treated as **historical product/pedagogy
context**.

Before implementing details, use the newer MUS 248 quiz
conversation/materials as the authoritative source for:

-   What has actually been taught as of the current class date.
-   Which competencies are currently fair game.
-   Actual approved questions.
-   Exact number of questions.
-   Current grading split.
-   Current MVP Version 1 behavior.
-   Current activity list and repetitions.
-   Current UI/UX decisions.
-   Data persistence decisions.
-   Canvas submission/integration method.
-   Any newer privacy decisions.

When a newer specification conflicts with this historical document,
**prefer the newer specification**.

What this historical document contributes is the rationale behind the
system:

> Build a low-friction weekly learning check that combines meaningful
> accountability with safe formative practice; uses actual opportunities
> to learn and activity history to personalize assessment; repeatedly
> repairs gaps through feedback and spaced retrieval; challenges
> advanced students without penalizing them for harder material; and
> uses AI as a controlled question-generation/personalization layer
> rather than as the authority on course content.

That is the central design philosophy that should survive even if the
exact MVP mechanics have changed.
