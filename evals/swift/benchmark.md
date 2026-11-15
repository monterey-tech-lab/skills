# swift benchmark

Run: 2026-11-10 · model: claude-sonnet-5-5-high · skill version: 1.0.0 (pre-release macOS/agent extension) · baseline: previous HEAD skill (62 rules, no macos/agent sections)

## Extension evals (new in this change)

| Eval | With skill | Baseline (previous skill) | Delta |
|---|---|---|---|
| 6 macos-settings-and-export-command | 4/4 | 4/4 | +0.00 |
| 7 isolate-nonsendable-objc-sdk | 4/4 | 4/4 | +0.00 |
| 8 macos-direct-distribution | 4/4 | 4/4 | +0.00 |

**With-skill pass rate (evals 6–8):** 1.00  
**Lift over previous skill (evals 6–8):** +0.00  
**Regressions:** 0  

## Triggers

| Metric | Value | Threshold | Result |
|---|---|---|---|
| Recall | 1.00 (14/14) | ≥ 0.80 | PASS |
| False-positive rate | 0.00 (0/11) | ≤ 0.20 | PASS |

## Gate verdict

| Gate | Result | Notes |
|---|---|---|
| With-skill pass rate ≥ 0.80 | PASS | 1.00 on extension evals |
| Lift ≥ +0.20 | FAIL | Expectations were non-discriminating vs a strong model + previous concurrency rules |
| Regressions = 0 | PASS | |
| Trigger recall ≥ 0.80 | PASS | |
| Trigger FP ≤ 0.20 | PASS | |

**Overall:** CONDITIONAL — hard gates (`npm run check`, validation package `swift test`) and triggers pass; measurable lift on new evals needs stronger expectations (e.g. require `focusedSceneValue` specifically, inside-out signing without `--deep`, `--timestamp`, staple-then-rezip). Follow-up: tighten evals 6–8 and re-run before `/release-skill`.

## Hard verification (this change)

- `npm run check`: 0 errors, 23/23 harness tests
- `validation/SwiftSkillValidation`: `swift build && swift test` — all tests passed

## Raw runs

`evals/swift/runs/2026-11-10-macos-agent-extension/` (git-ignored)
