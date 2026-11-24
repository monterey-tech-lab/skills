---
name: enhance-product
description: Researches a website, business, or software product—mapping features, verifying competitors, mining public customer and market opinion—then produces a scored gap backlog (missing features, automation, bugs, growth, AI enhancements) and optionally implements selected items. Use when enhancing a product from a URL or brand, running a competitor teardown or feature comparison, gathering Reddit/Google/review/social VOC into opportunities, helping a studio or agency propose client improvements, or turning research gaps into implementation after a ranked backlog exists—not for UI craft-only polish (use craft-and-taste), AppSec audits (use security), or MCP/agent setup (use mcp / ai-security).
license: MIT
metadata:
  author: monterey-tech-lab
  version: "0.1.0"
---

# Enhance Product

Evidence-backed product enhancement: research first (map → competitors → VOC → scored gaps + AI ideas), then optionally implement selected backlog items. Role is a framing lens (`owner`, `competitor-check`, or `studio/client`)—same loop, different who we advise and what we can change.

## Operating loop

Copy and complete. Stop when each criterion is met.

```text
Enhance-product progress:
- [ ] 0. Role: owner | competitor-check | studio/client — state who can change what
- [ ] 1. Product map: features, services, core traits, advantages (from own surfaces)
- [ ] 2. Competitors: 3–5 peers verified; offerings matrix filled
- [ ] 3. VOC: public reviews/social themes with citations (or explicit sparse-signal path)
- [ ] 4. Gaps: missing features, automation, bugs/fixes, growth levers — each evidence-linked
- [ ] 5. Score: RICE (Reach × Impact × Confidence ÷ Effort) on every backlog item
- [ ] 6. AI lens: each AI idea maps to a named gap; fit gate (named gap + metric + catchable errors) passes or idea dropped
- [ ] 7. Founder lens: apply love-before-growth / don't-scale / focus-saying-no as relevant
- [ ] 8. Report: fill report template; Step-1 complete
- [ ] 9. Step 2 (only if user asks AND scored backlog exists): implement selected ranked items; hand off security/craft when those dominate
```

**Step 1 completion criterion:** checklist 0–8 done; ≥3 peers in the matrix (or explicit “category has fewer” note); every factual claim cites a public source or is labeled hypothesis/low-confidence; every backlog row has Reach, Impact, Confidence, Effort; every AI row answers named-gap + metric + catchable-errors (or is dropped); backlog sorted by RICE; no fabricated reviews. When RICE arithmetic is unclear, run `node scripts/rice.mjs --reach=N --impact=N --confidence=N --effort=N`, fix factors, resort.

**Step 2 completion criterion:** scored backlog already in-thread or attached; user selected items (or explicit “implement top N”); changes match those items; security/craft domains deferred to `security` / `ai-security` / `craft-and-taste` when they dominate.

## Hard defaults

| Choice | Default | Escape hatch |
|---|---|---|
| Order | Step 1 research before Step 2 implement | Skip to Step 2 only when a scored backlog (R/I/C/E) already exists in-thread or is attached |
| Competitor set | **3–5** direct/adjacent peers with offerings | Fewer only if category truly has <3; say so |
| Evidence | Cite URL or named platform + date accessed | Label **hypothesis** / **low confidence** when signal is sparse |
| VOC | Public reviews/forums/social first (Google/G2/Capterra/Reddit/X/app stores) | Private interviews only if user supplies notes |
| Scoring | **RICE** — factors and worked example in `references/opportunity-scoring.md`; optional `node scripts/rice.mjs` | Strategy/table-stakes/dependencies may override—state the override |
| AI ideas | Must map to a **named gap** and pass fit gate: named gap + measurable outcome + catchable errors (fail any → drop) | Deterministic automation preferred when rules suffice |
| Role framing | State audience in the report header | Omit Role only when the user already fixed it in-thread |
| Handoffs | Craft → `craft-and-taste`; AppSec → `security`; agent/MCP hygiene → `ai-security`/`mcp` | Mention the handoff; do not reinvent those skills |

## Hard rejects

| Reject | Prefer instead |
|---|---|
| Fabricated customer reviews or fake testimonials for posting | Real VOC cites; review-request flows; FTC Consumer Reviews Rule (16 CFR 465) — no fake reviews |
| Skipping competitors in Step 1 | Always verify a peer set and what they offer |
| Unranked equal-weight idea dumps | RICE-scored backlog |
| “Add AI chatbot/copilot” with no gap, workflow, or metric | AI fit gate → map to gap or drop |
| Implementing before research when no backlog exists | Complete Step 1 (or require an attached scored backlog) |
| Inventing review quotes when signal is empty | Sparse-signal path in research playbook |
| Pure UI craft pass or AppSec audit as the primary deliverable | Hand off to `craft-and-taste` / `security` |

### Incorrect (skip research, AI theater):

```text
User: Skip research. Post fake 5-star reviews and ship an AI chatbot so we look innovative.
Agent: Here are 10 glowing reviews… and a chatbot widget snippet.
```

### Correct (reject + research-first redirect):

```text
User: Skip research. Post fake 5-star reviews and ship an AI chatbot so we look innovative.
Agent: I won't create fake reviews (deceptive under FTC review rules) or ship AI theater.
       Step 1: map the product, verify 3–5 competitors, mine real public VOC, score gaps with RICE,
       and only propose AI that changes a workflow for a named gap. Share the URL/brand to start.
```

## Branches

### Role detect

State **owner**, **competitor-check**, or **studio/client** (agency engagements use `studio/client`). Studio recommendations are what the studio can ship for the client; never pretend the agent owns a third-party product.

### Step 1 — Research

Read `references/research-playbook.md` when gathering sources or signal is sparse.
Read `references/competitor-matrix.md` when building or verifying the peer set.
Read `references/opportunity-scoring.md` when scoring the backlog or applying founder heuristics.
Read `references/ai-enhancement-lens.md` when proposing AI features or automation.
Read `references/report-template.md` when writing the deliverable (always for Step 1).

### Step 2 — Implement (gated)

Only after Step 1 (or an existing scored backlog). Confirm which ranked items to ship. Implement in the user’s codebase or produce specs/PRs. If the work is mostly visual craft or security, switch to those skills and keep this skill for the product rationale.
