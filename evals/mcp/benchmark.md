# mcp benchmark

Run: 2026-11-21 · model: inherit (skill-eval-runner / skill-grader) · skill version: 0.1.0 · baseline: none

| Eval | With skill | Baseline | Delta |
|---|---|---|---|
| 1 multi-host-client-setup | 3/3 (1.00) | 3/3 (1.00) | +0.00 |
| 2 build-vs-reuse-server | 3/3 (1.00) | 3/3 (1.00) | +0.00 |
| 3 wrong-premise-sessionful-http | 3/3 (1.00) | 2/3 (0.67) | +0.33 |
| 4 edge-agent-skills-and-stateless | 3/3 (1.00) | 2/3 (0.67) | +0.33 |
| 5 product-command-assignment | 3/3 (1.00) | 2/3 (0.67) | +0.33 |
| **Overall** | **15/15 (1.00)** | **12/15 (0.80)** | **+0.20** |

## Thresholds (quality-bar §3)

| Measure | Threshold | Result |
|---|---|---|
| With-skill pass rate | ≥ 0.80 | **PASS** (1.00) |
| Lift over baseline | ≥ +0.20 | **PASS** (+0.20) |
| Regressions | 0 | **PASS** |
| Trigger recall | ≥ 0.80 | **PASS** (1.00) |
| Trigger false-positive rate | ≤ 0.20 | **PASS** (0.00) |

**Verdict: PASS**

## Analysis

- **Lift drivers:** Eval 3 (rejects Redis/`Mcp-Session-Id` as default), eval 4 (authoring Agent Skills vs Skills extension), eval 5 (Cursor native `"url"` vs `mcp-remote`-only).
- **Non-discriminating:** Evals 1–2 passed for both variants on current expectations (strong baseline knowledge for Linear/Vercel paths and Streamable HTTP + `search`/`fetch`). Keep for coverage; tighten later if lift needs headroom (e.g. require Claude `"type": "http"`, named first-party reuse rejection).
- **Regressions:** none.
- **Triggers:** 10/10 should-trigger → `mcp`; 10/10 near-misses → `ai-security` / `security` / `swift` / `craft-and-taste` / none.

Raw runs: `evals/mcp/runs/2026-11-21-eval/` (git-ignored).
