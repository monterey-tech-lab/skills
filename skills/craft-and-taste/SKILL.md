---
name: craft-and-taste
description: Judges and improves product craft and taste across UI and UX—necessity, calm hierarchy, typography and color, purposeful motion, and polished empty/loading/error/success states—drawing on Apple HIG, Linear craft, and Vercel design restraint. Use when reviewing or building product interfaces for polish and focus, deciding whether a feature or decoration belongs, calming AI-slop or template UI, judging motion and micro-interactions, or aligning a screen with Apple-like or Linear-like product quality.
license: MIT
metadata:
  author: monterey-tech-lab
  version: "0.1.0"
---

# Craft and Taste

Prefer focus and fit over feature count; hierarchy and space over boxes; stillness over decorative motion. Doctrine draws on Apple HIG, Linear craft essays, Vercel design restraint, and publicly attributable Jobs-era focus (saying no)—not on copying third-party skill bodies.

## When to Apply

- Deciding whether a feature, badge, celebration, or chrome belongs in the product
- Reviewing or redesigning product UI that feels template-like, noisy, or AI-slop
- Judging motion / micro-interactions (what to keep, change, or delete)
- Building or refactoring screens with hierarchy, type, color, layout, and states in mind
- Pushing for Apple-like or Linear-like *product* quality (calm craft), not spring demos alone

Do not use for: WCAG legal audits, brand-system libraries, backend/API work, deep SwiftUI API rules (use `swift`), or marketing landing “taste” passes that are not shipping product UI.

## Operating Loop

Run this loop on every craft request. Stop when each step’s criterion is met.

```text
Craft progress:
- [ ] 1. Problem fit: name the user’s job in one sentence
- [ ] 2. Necessity: list what to ship, refuse, or defer (saying no is craft)
- [ ] 3. Hierarchy: one primary job per surface; progressive disclosure for the rest
- [ ] 4. Visual craft: type/space/color before cards/borders; quiet chrome
- [ ] 5. Motion: only purposeful, brief, interruptible; honor reduced motion
- [ ] 6. States: empty, loading, error, success each have copy + next action
- [ ] 7. Critique: remove one more element; equal-weight actions are a fail
```

**Completion criterion for the whole task:** every checkbox above is satisfied in the answer or the shipped UI notes, and no hard reject from the list below remains.

## Hard Rejects

Refuse these by default (escape hatch only when the user names a rare, high-stakes exception and accepts the cost):

| Reject | Prefer instead |
|---|---|
| Equal-visibility toolbars / rainbow accents for every action | One primary action; overflow or menus for the rest |
| Fake urgency (countdown badges everywhere, constant celebration) | Selective status; quiet completion cue |
| Decorative motion (scroll-bounce every widget, sparkle hover, idle mascots) | Stillness; brief feedback on real state change |
| Gating content behind branded intros or non-interruptible animation | Skeletons; show data ASAP; cancelable transitions |
| Nested card stacks repairing weak hierarchy | Type scale + spacing + grouping on one surface |
| Template aesthetics as defaults (purple/indigo gradient canvas, glow grids, ultralight labels) | Neutral canvas; semantic color; Regular–Bold readable type |

“Premium like Apple/Linear” means calm hierarchy, restraint, and fit—not more micro-interactions.

## Branches

### Product necessity

Ask “what if we don’t build this?” before designing it. Focus is saying no to many good ideas so the product stays greater than the sum of parts. Output without problem fit is not design.

Read `references/product-necessity.md` when the request adds features, badges, feeds, celebrations, or “prove we listen by showing everything.”

### UI craft review

Review in fixed order: canvas → hierarchy → type → color → surfaces → actions → empty/loading/error/success. Hierarchy comes from type and space; earn every border and card.

Read `references/ui-craft-checklist.md` when reviewing or redesigning a screen for polish, anti-slop, or Linear/Apple calm.

### Motion and interaction

Motion supports the experience; it must not be the only channel for meaning. Prefer continuous, interruptible feedback over long timed performances. Delete motion that fires on every row, every scroll, or while idle.

Read `references/motion-and-interaction.md` when advising animation, delight, or micro-interactions.

### Layout and composition

Order by importance; align for scanning; progressive disclosure; one job per surface; structure felt, not shouted with separators.

Read `references/layout-and-composition.md` when composing pages, toolbars, or dense product chrome.

### Build defaults

Stack-agnostic incorrect/correct patterns for actions, badges, empty states, and motion. Point to platform docs for native specifics; leave SwiftUI APIs to `swift`.

Read `references/build-defaults.md` when implementing or refactoring UI and needing concrete defaults.

## Sources

Citations and prior-art license notes: `references/sources.md`.
