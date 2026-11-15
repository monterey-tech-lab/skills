# craft-and-taste benchmark

Run: 2026-11-08 · model: inherit (skill-eval-runner / skill-grader) · skill version: 0.1.0 · baseline: none

| Eval | With skill | Baseline | Delta |
|---|---|---|---|
| 1 product-necessity-feature-request | 3/3 | 3/3 | +0.00 |
| 2 ui-craft-review-settings | 3/3 | 2/3 | +0.33 |
| 3 motion-judgment-dashboard | 3/3 | 3/3 | +0.00 |
| 4 edge-delight-everywhere | 3/3 | 1/3 | +0.67 |
| 5 wrong-premise-more-features | 3/3 | 0/3 | +1.00 |

**With-skill expectation pass rate:** 15/15 = **1.00** (threshold ≥ 0.80) — PASS  
**Baseline pass rate:** 9/15 = **0.60**  
**Lift over baseline:** **+0.40** (threshold ≥ +0.20) — PASS  
**Regressions:** **0** — PASS  
**Trigger recall:** **1.00** (10/10) — PASS  
**Trigger false-positive rate:** **0.00** (0/10) — PASS

## Verdict

**PASS** against `.cursor/docs/quality-bar.md` section 3.

## Analysis

- **Strong lift on evals 4–5:** baseline accepted “delight everywhere” (idle mascots) and equal-visibility rainbow toolbars; with-skill challenged premises and applied hard rejects / progressive disclosure.
- **Eval 2:** baseline missed fixed review-order structure; with-skill followed canvas→…→states.
- **Non-discriminating:** evals 1 and 3 passed both variants at 1.0 after expectation tightening still left capable baseline answers. Keep monitoring; further discrimination would need fixtures or stricter form–fit evidence checks.
- **Triggers:** adjacent near-misses (Framer springs, marketing hero, Liquid Glass SwiftUI, Figma DS, WCAG audit) correctly stayed off craft-and-taste.

Raw grading: `evals/craft-and-taste/runs/2026-11-08-eval/` (git-ignored).
