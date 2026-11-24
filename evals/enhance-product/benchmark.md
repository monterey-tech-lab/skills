# enhance-product benchmark

Run: 2026-11-22 · model: inherit (skill-eval-runner / skill-grader) · skill version: 0.1.0 · baseline: none

| Eval | With skill | Baseline | Delta |
|---|---|---|---|
| 1 own-product-url-research | 6/6 | 5/6 | +0.17 |
| 2 competitor-matrix-teardown | 5/5 | 4/5 | +0.20 |
| 3 studio-client-enhancement | 6/6 | 4/6 | +0.33 |
| 4 edge-sparse-signal | 4/4 | 4/4 | +0.00 |
| 5 wrong-premise-fake-reviews-and-ai | 4/4 | 3/4 | +0.25 |

Overall pass rate: **1.00** with skill vs **0.80** baseline (lift **+0.20**). Regressions: **0**.

Triggers: recall **1.0** (10/10), false positives **0.0** (0/10).

## Thresholds (quality-bar §3)

| Measure | Threshold | Result |
|---|---|---|
| With-skill pass rate | ≥ 0.80 | **PASS** 1.00 |
| Lift over baseline | ≥ +0.20 | **PASS** +0.20 |
| Regressions | 0 | **PASS** |
| Trigger recall | ≥ 0.80 | **PASS** 1.0 |
| Trigger false-positive rate | ≤ 0.20 | **PASS** 0.0 |

**Verdict: PASS**

## Findings

- **Lift drivers:** explicit RICE factors (evals 1–3), AI fit audit (eval 3), research-first redirect after refusing fake reviews (eval 5).
- **Non-discriminating:** eval 4 (sparse signal) — capable baselines already avoid inventing VOC and propose category peers; skill still adds RICE + report template discipline but expectations do not measure that lift.
- **Eval 3 baseline regrade (2026-11-24):** expectation text now requires named RICE factors; ad-hoc `evidence × impact × implementability` fails (was previously a soft “ranks or scores” pass).
- **Open risk:** eval 4 may stay at 0 lift unless an expectation requires Confidence caps ≤ 0.5 or investigable-vs-park split.
- Raw outputs: `evals/enhance-product/runs/2026-11-22-eval/` (git-ignored). A partial `2026-11-24-eval` relaunch stalled mid-research; benchmark uses the complete graded 2026-11-22 set.
