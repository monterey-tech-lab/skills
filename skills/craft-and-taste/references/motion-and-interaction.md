# Motion and interaction

Read when advising animation, delight plans, or micro-interactions. Decorative-motion Hard Rejects live in `SKILL.md`; this file is the keep/change/delete judgment.

## Default

Stillness. Add motion only to show cause and effect (panel open, selection, insert). Escape hatch: one short emphasis moment for a rare milestone the user opted into—not ambient loops.

## Principles

1. **Purpose** — Motion supports the experience; do not animate for its own sake.
2. **Optional channel** — Essential information must work with reduced motion / motion off.
3. **Interruptible** — Users can reverse or cancel; never trap them in a timed performance.
4. **Brief and infrequent** — High-frequency surfaces (tables, charts, filters) get shorter or zero motion.
5. **Content first** — Never gate numbers or primary UI behind a branded intro.

“Delightful like Apple/Linear” means precise feedback and calm craft—not micro-interactions on every control, and never idle mascots.

## Keep / change / delete

| Pattern | Decision |
|---|---|
| Bounce/overshoot on every chart scroll-in | Delete |
| Sparkle/shimmer on every row hover | Delete |
| Idle mascot or ambient loops | Delete |
| Non-interruptible 600ms+ chrome transitions | Change → short, cancelable |
| 3s branded intro before data | Delete → skeletons, show data ASAP |
| Sidebar/sheet open-close spatial motion | Keep if short and interruptible |
| Quiet press/focus feedback | Keep if brief and reduced-motion safe |

## Incorrect / correct

**Incorrect (delight everywhere):**

```text
Plan: page transitions + button springs + list inserts + empty mascots
+ error shakes + success confetti + idle ambient loops on every screen.
```

**Correct (allowlist):**

```text
Allow: interruptible sheet/sidebar; brief list insert highlight; toast on rare success;
press opacity/scale on primary only; reduced-motion path uses opacity/instant.
Forbid: idle animation, scroll-reveal bounce farms, hover particles, content-gating intros.
Premium feel comes from hierarchy, timing restraint, and clear states—not animation count.
```

## Branch criterion

```text
Motion:
- [ ] Decorative / frequent motion deleted
- [ ] Remaining motion interruptible; reduced-motion path keeps meaning
- [ ] No content gated on animation
```
