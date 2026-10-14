# PROPOSAL — weekly report: "tested / improved / still unresolved"

> **Proposal only. Nothing here changes current requirements.** The existing weekly activity
> reports, journal entries, Canvas discussions, and simulator receipts stay exactly as they are
> until the instructor decides otherwise.

## The idea

Students already report each week on the activities they did. The Documentation Builder adds a
second kind of work: testing and improving the instructions themselves. Instead of making
students write the same thing twice, the weekly report could later gain one short, optional
block:

```markdown
### Documentation this week
- **Tested:** <page + section>, <where> — link to the Canvas submission or GitHub issue/PR
- **Improved:** what changed, one line (or "proposal submitted")
- **Still unresolved:** open question or blocker, one line (or "none")
```

## Why this shape

- **Links, not duplicate writing.** The full test record already lives in the Documentation
  Builder submission; the weekly report only points to it.
- **"Still unresolved" stays visible.** Open questions surface weekly instead of disappearing
  into one assignment.
- **No change to simulator receipts.** Receipts (e.g. mixer-lab's report evidence) remain their
  own record; this block doesn't replace or restate them.

## Open decisions for the instructor

- Whether to add the block at all, and from which week.
- Optional or required; whether it carries any credit.
- Whether GitHub links count the same as Canvas links (GitHub stays optional for now; requiring
  accounts later is under consideration).
