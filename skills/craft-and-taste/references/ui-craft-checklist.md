# UI craft checklist

Read when reviewing or redesigning a product screen for polish, calm, or anti-slop. Use the Hard Rejects table in `SKILL.md` for the canonical refuse/prefer pairs; this file adds the fixed review order and state requirements.

## Review order (do not skip)

Complete each step before the next. Criterion: a concrete fix or “already OK” note exists for that step.

1. **Canvas** — Neutral background; no promotional gradient as the page fill.
2. **Hierarchy** — Page title > section > field; spacing shows structure before borders do.
3. **Typography** — Readable Regular–Bold weights; few faces; clear size steps. Avoid ultralight UI labels.
4. **Color** — Semantic and sparse; never the only channel for meaning; no badge on every row.
5. **Surfaces** — Prefer one column + dividers/spacing; cards only for a real interactive unit. No nested card stacks.
6. **Actions** — One primary; secondary quiet; destructive distinct. Never style Cancel/Save/Delete identically.
7. **States** — Empty, loading, error, success: short copy + next action. Empty is not a blank hole.

## Empty / loading / error / success

**Incorrect:**

```text
Integrations list: blank white area when count is 0.
Buttons: Cancel, Save, Delete all full-width primary.
```

**Correct:**

```text
Empty: “No integrations yet” + one sentence of what integrations do + “Connect an integration”.
Loading: skeletons or inline progress; content appears as soon as ready.
Error: what failed + how to retry or get help.
Success: quiet confirmation; navigate or stay with clear next step—no default confetti.
Actions: Save primary; Cancel ghost/text; Delete destructive and separated.
```

## Branch criterion

```text
UI craft:
- [ ] Each review-order step has a finding or OK note
- [ ] Empty/loading/error/success are first-class where the screen has those modes
```
