# Product necessity

Read when the user asks to add features, chrome, badges, feeds, celebrations, or to “prove we listen” by exposing every option. Hard Rejects for fake urgency and equal-visibility dumps live in `SKILL.md`; this file is the necessity gate.

## Default

Ship the smallest change that improves the user’s job. Refuse or defer the rest with a one-line reason. Escape hatch: ship a narrow experiment only when the problem is validated and the surface stays one-job.

## Saying no is craft

Focus means declining many good ideas so the product stays coherent. A polished screen for the wrong problem is still a miss: form without fit is not design.

**Incorrect (accept every stakeholder ask):**

```text
Add chat + social feed + confetti + countdown badges on home.
Home becomes a magazine of equal-weight features.
```

**Correct (necessity first):**

```text
Job: help people finish their work.
Ship: selective “due soon / needs attention” on home; subtle close confirmation.
Refuse: native chat (integrate), social feed on home, default confetti, badge walls.
Home stays a short “what’s next” surface.
```

## Listening ≠ showing everything

User research that lists many actions does not require equal-visibility chrome. Listening means solving the job; progressive disclosure holds secondary actions.

**Incorrect (wrong premise accepted):**

```text
Ten toolbar buttons, each with its own accent color, all always visible.
```

**Correct:**

```text
One primary action for the page’s job.
2–3 frequent secondary actions nearby.
Everything else in overflow / menu / keyboard shortcuts.
Neutral chrome; color only for meaning (destructive, status)—not a rainbow legend.
```

## Branch criterion

```text
Necessity:
- [ ] User job stated in one sentence before UI proposals
- [ ] Each proposed feature tagged ship / refuse / defer with reason
- [ ] Primary surface still has one job after the change
```
