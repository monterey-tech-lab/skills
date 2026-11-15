# Build defaults

Read when implementing or refactoring UI and needing concrete incorrect/correct defaults. Stack-agnostic; adapt to web or native. For SwiftUI APIs and concurrency, use `swift`.

## Actions

**Incorrect:**

```html
<button class="primary">Cancel</button>
<button class="primary">Save</button>
<button class="primary">Delete</button>
```

**Correct:**

```html
<button class="ghost">Cancel</button>
<button class="primary">Save</button>
<button class="destructive">Delete</button>
```

One primary per view. Destructive is visually distinct and often separated.

## Badges and urgency

**Incorrect:** colored badge on every row; countdown on every due date this week.

**Correct:** plain rows by default; badge only for Connected / Error / Syncing (or similar live state); due urgency selective (overdue / today), not a wall of clocks.

## Empty state

**Incorrect:** empty list renders nothing.

**Correct:** title + one sentence + primary CTA to create/connect. Optional quiet icon—not a marketing collage.

## Motion hooks

**Incorrect:** `animate on scroll` for every section; `animation-fill` locked until finish; idle Lottie loops.

**Correct:** animate only state changes the user caused; honor `prefers-reduced-motion` (opacity/crossfade or instant); no idle loops on product chrome.

## Hierarchy without cards

**Incorrect:** six nested cards with border + shadow each.

**Correct:** page background + section titles + gap scale (`8/12/16/24` or platform spacing tokens) + hairline dividers where grouping needs a line.

## Type

**Incorrect:** ultralight labels; five typefaces; decorative size jumps without weight hierarchy.

**Correct:** one UI family (or platform text styles); Regular body; Semibold/Bold titles; muted color for secondary—not thinner strokes.

## Escape hatches

- Marketing landing pages may use stronger brand motion and imagery; still avoid gating product data.
- Games and creative tools may allow richer motion; keep reduced-motion paths.
- Native Apple apps: prefer system materials and semantic colors per HIG; do not paint Liquid Glass onto every content card.
