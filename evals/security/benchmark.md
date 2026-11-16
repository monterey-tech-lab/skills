# security benchmark

Run: 2026-11-15 · model: composer/inherit · skill version: 0.1.0 · baseline: none (no prior skill)

| Eval | With skill | Baseline | Delta |
|---|---|---|---|
| 1 multi-tenant-invoice-api | 3/3 (1.00) | 2/3 (0.67) | +0.33 |
| 2 auth-sessions-jwt | 3/3 (1.00) | 2/3 (0.67) | +0.33 |
| 3 secrets-and-safe-errors | 3/3 (1.00) | 3/3 (1.00) | +0.00 |
| 4 edge-webhook-payments | 3/3 (1.00) | 2/3 (0.67) | +0.33 |
| 5 wrong-premise-soc2-banner | 3/3 (1.00) | 1/3 (0.33) | +0.67 |

Overall pass rate: **1.00** with skill vs **0.67** baseline (lift **+0.33**). Regressions: **0**.

Triggers: recall **1.0** (10/10), false positives **0.0** (0/10).

## Thresholds (quality-bar §3)

| Measure | Threshold | Result |
|---|---|---|
| With-skill expectation pass rate | ≥ 0.80 | **PASS** (1.00) |
| Lift over baseline | ≥ +0.20 | **PASS** (+0.33) |
| Regressions | 0 | **PASS** |
| Trigger recall | ≥ 0.80 | **PASS** (1.0) |
| Trigger false-positive rate | ≤ 0.20 | **PASS** (0.0) |

**Verdict: PASS**

## Findings

- Skill lift concentrates on isolation tests, SSO readiness, marketing-CORS refusal on privileged APIs, and immutable-audit / technical-not-legal SOC 2 framing.
- Eval 3 is non-discriminating (baseline already covers vault, opaque errors, redaction, and gitleaks). Strengthen later if needed (require pre-commit+CI as hard gate, or ship concrete middleware diffs).
- Follow-up: optional split of compound expectations (revoke vs SSO; webhook vs charge idempotency).
