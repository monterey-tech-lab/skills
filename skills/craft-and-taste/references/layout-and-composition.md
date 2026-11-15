# Layout and composition

Read when composing pages, toolbars, settings, or dense product chrome.

## Default

One primary job per surface. Order content by importance in reading order; align for scanning; group related items; use progressive disclosure so secondary choices do not bury the task. Escape hatch: a second job only on a separate route or disclosed panel—not as equal chrome on the same surface.

## Structure felt, not shouted

Prefer spacing and typography over loud separators and nested boxes. Soften or remove chrome that competes with content. Density is fine when hierarchy is clear; crowded equal-weight controls are not.

**Incorrect:**

```text
Every section in its own bordered card; toolbar of ten equal buttons;
nav, badges, and banners all competing at the same visual weight.
```

**Correct:**

```text
Single content column; sections separated by space and title weight.
Toolbar: primary + few secondary; overflow for the rest.
Chrome quieter than content; attention earned, not demanded.
```

## Progressive disclosure

| Frequency | Placement |
|---|---|
| Primary job action | Visible, one primary style |
| Occasional | Secondary control or nearby menu |
| Rare / power | Overflow, shortcuts, or settings |

## Platform pointers

For Apple platforms, follow HIG layout (safe areas, adaptive size classes, Dynamic Type reflow) via [HIG Layout](https://developer.apple.com/design/human-interface-guidelines/layout). Do not hard-code device idioms. Deep SwiftUI implementation belongs in the `swift` skill.

## Branch criterion

```text
Layout:
- [ ] One job named for the surface
- [ ] Secondary actions disclosed, not equal-weight
- [ ] Structure via space/type, not box piles
```
