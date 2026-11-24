# Research: enhance-product

Date: 2026-11-22 · Purpose: Two-step research→implement skill for product/competitive/VOC gap analysis (owner, competitor teardown, or studio helping a client) · Recommendation: **build**

## Prior art

| Skill | Repo | Installs | Covers | Misses | License |
|---|---|---|---|---|---|
| `competitive-analysis` | [jayrha/agent-skills](https://github.com/jayrha/agent-skills) · [skills.sh](https://www.skills.sh/jayrha/agent-skills/competitive-analysis) | Listed on skills.sh (exact count not shown on page access) | Competitor discovery, evidence trail, comparison matrices, positioning, battlecards, ethics/data-sources refs, matrix script | No gated implement step; not multi-audience (owner/studio); weak VOC→ranked product backlog + AI-enhancement lens | MIT |
| `z-market-research` | [victorzhuk/skills](https://github.com/victorzhuk/skills) · [skills.sh](https://www.skills.sh/victorzhuk/skills/z-market-research) | Listed on skills.sh | Ordered market scan: competitor discovery, pricing teardown, positioning-as-claims, demand signals, ICP hypotheses with evidence rules | Strategy digest only; no product-map→gap backlog→implement; no AI fit audit | Apache-2.0 (repo LICENSE) |
| `customer-research` | [poorvith-mp/skills-marketing](https://github.com/poorvith-mp/skills-marketing) · [skills.sh](https://www.skills.sh/poorvith-mp/skills-marketing/customer-research) | Listed on skills.sh | JTBD interview framing, Moesta 4 Forces, discovery interview questions, VOC for messaging | Interview-oriented; not public-review mining + competitor matrix + shippable backlog | MIT |
| `competitor-teardown` | [prosyo-ai/gtm-skill](https://github.com/prosyo-ai/gtm-skill) · [skills.sh](https://www.skills.sh/prosyo-ai/gtm-skill/competitor-teardown) | Listed on skills.sh | Sales-oriented teardown: story, pricing, complaint clustering (5+ mentions) | Battlecard GTM focus; not owner/studio product enhancement or AI ideas | MIT |
| `competitive-teardown` | [borghei/claude-skills](https://github.com/borghei/claude-skills) · [skills.sh](https://www.skills.sh/borghei/claude-skills/competitive-teardown) | Repo ~1.2K stars (skills.sh listing) | Multi-source competitive intel, scoring rubric, feature/pricing/UX teardown | Commons Clause + MIT — do not adapt body; still no research→implement product skill | Commons Clause + MIT |
| monterey `craft-and-taste` | local `skills/craft-and-taste` | N/A | UI/product craft polish | No VOC, competitors, or opportunity backlog | MIT (repo) |
| monterey `security` / `ai-security` | local | N/A | AppSec / LLM security | Not product gap research | MIT (repo) |

`npx skills find` for "product research", "competitive analysis", "market research", "gap analysis", "customer feedback", "competitive", "teardown", "research" returned **no skills** (CLI index gap vs skills.sh web listings as of 2026-11-22). Web `site:skills.sh` search found the rows above.

**Hard boundary:** Summarize prior art only. Do not paste skill bodies. Prefer original prose grounded in primary product frameworks below. MIT/Apache may inform structure with attribution; Commons Clause bodies are off-limits.

## Current facts (with sources)

- **RICE prioritization (Intercom):** Score = (Reach × Impact × Confidence) ÷ Effort. Impact scale 3 / 2 / 1 / 0.5 / 0.25; Confidence 100% / 80% / 50%; Effort in person-months. Use as decision support, not a rigid rule (dependencies, table stakes, strategy can override). ([Intercom RICE](https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers), Sean McBride, 2018-01-05)
- **ODI / Opportunity Score (Ulwick):** Opportunity = Importance + max(Importance − Satisfaction, 0) (often with % of 4–5 ratings normalized). Scores ≥ ~10 flag underserved outcomes; overserved areas favor cheaper solutions, not more features. Full survey ODI needs large samples; for agent skill, use the *importance vs satisfaction gap idea* on clustered VOC themes as a heuristic, not fake survey precision. ([CustomerThink / Ulwick](https://customerthink.com/what-unmet-needs-should-be-targeted-for-growth/); [Notes for Growth summary](https://notesforgrowth.github.io/Opportunity-Score/))
- **Love before growth (Altman):** Make a product a small number of users love before optimizing for growth; premature growth goals produce nebulous products papered with growth hacking. ([Startup Playbook](https://playbook.samaltman.com/); [Before Growth](https://blog.samaltman.com/before-growth))
- **Do things that don't scale (Graham):** Recruit early users manually, delight them, learn from over-engagement; unscalable care teaches what to productize later. ([paulgraham.com/ds.html](https://www.paulgraham.com/ds.html), July 2013)
- **Jobs focus (Jobs-era, public):** Focus is saying no to good ideas so the vital few ship. (Public Fortune 2008 / WWDC 1997 Q&A citations as in craft-and-taste research.)
- **AI fit vs theater:** Ship AI only when it changes a real workflow and improves a measurable outcome (effort, errors, decisions); reject demos that remove no responsibility. Audit: reduce total task effort? beat current method? can user catch errors? ([Smashing Magazine four-question audit, 2026-11](https://www.smashingmagazine.com/2026/11/should-you-add-ai-audit-product-teams/); [AI product strategy — outcome before model](https://nenadivanovic.com/blog/ai-product-strategy); [AI theater vs results framing](https://louiepinto.com/ai-theater-vs-ai-results))
- **Fake reviews (US law):** FTC Trade Regulation Rule on Consumer Reviews and Testimonials (effective 2024-10-21) prohibits businesses from writing/creating/selling/buying fake or false consumer reviews or testimonials, including AI-generated fakes used deceptively. ([Federal Register](https://www.federalregister.gov/documents/2024/08/22/2024-18519/trade-regulation-rule-on-the-use-of-consumer-reviews-and-testimonials); [16 CFR 465.2](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-D/part-465/section-465.2))
- **Public research ethics:** Prefer published pages, official review platforms, and community posts the agent can cite with URLs; treat vendor marketing as claims; do not default to ToS-violating scrape/login bypass. (Aligned with prior-art ethics sections on skills.sh competitive skills; encode as hard defaults.)

## Common agent mistakes this skill must prevent

1. **Skipping competitors** — produces feature wishlists without verifying what peers already offer. Evidence: competitive skills exist because agents default to vibes; locked scope makes competitors mandatory.
2. **Fabricating or paraphrasing reviews without sources** — invents “customers say…”; illegal/deceptive if used as marketing, and useless as research. Evidence: FTC 16 CFR 465; observed LLM hallucination of quotes.
3. **AI theater** — “add AI chatbot / copilot” with no named gap, workflow, or success metric. Evidence: Smashing / AI-theater sources above.
4. **Implementing before research** — jumps to code/PRs when no evidence-backed backlog exists. Evidence: locked two-step scope.
5. **Unranked laundry lists** — dumps 30 ideas with equal weight; no Reach/Impact/Confidence/Effort or importance–satisfaction framing. Evidence: Intercom RICE; Ulwick opportunity score.
6. **Confusing craft polish or security audits with product gaps** — redesigns UI or runs AppSec when the ask is market/VOC gap research. Evidence: repo has `craft-and-taste`, `security`, `ai-security` for those jobs.
7. **Treating sparse signal as certainty** — brands with few reviews get confident roadmaps; must flag low confidence and widen competitor/adjacent searches. Evidence: RICE confidence factor; market-research skills’ evidence rules.
8. **Ignoring audience framing** — same teardown for owner vs agency vs competitor-check without stating who can change what. Evidence: locked multi-audience scope.

## Proposed scope

- **Branches:** (1) product map from own surfaces; (2) mandatory competitor set + offerings matrix; (3) VOC from public reviews/social; (4) peer/market opinion; (5) scored gap backlog including automation/growth; (6) AI enhancement ideas mapped to named gaps; (7) founder-heuristic lens; (8) gated Step 2 implement when user wants shipping / has a codebase.
- **Out of scope:** Fake reviews; ToS-bypass scraping as default; legal advice; full AppSec; craft-only polish without product evidence; copying third-party skill bodies.
- **Candidate skill type:** **simple** — one operating loop with progressive `references/`, not a large independent-rule catalogue.

**Recommendation justification:** (1) No monterey skill covers VOC + competitor gap research + ranked backlog + gated implement. (2) External prior art covers *pieces* (competitive matrix, market scan, interview VOC, sales teardown) but not the combined two-step multi-audience product-enhancement workflow. (3) Skip is wrong: agents default to uncited opinions, AI theater, and unranked wishlists. Build original guidance cited to Intercom/Ulwick/Altman/Graham/FTC/AI-fit sources; use third-party skills for gap analysis only.

## Baseline failures (2026-11-22, no skill)

Recorded from `evals/enhance-product/runs/2026-11-22-baseline/`. Capable baselines already research well; the skill must force **consistent method**, not merely “do research.”

1. **Eval 1 (Linear owner):** Strong map, competitors, cited VOC, ranked list — but **no RICE factors** (Reach/Impact/Confidence/Effort), **no founder-heuristic section**, AI ideas not run through a **fit audit** (workflow change + measurable outcome + error catchability).
2. **Eval 2 (Notion competitors):** Excellent matrix and gaps — gaps remain **unscored**; no explicit opportunity scoring; no handoff to ranked backlog format.
3. **Eval 3 (studio / Calendly):** Good agency framing and ranked table — scoring is ad hoc (`evidence × impact × implementability`), not shared RICE defaults; **no founder lens**; Step-2 gate is narrative only (no checklist completion criteria).
4. **Eval 4 (sparse WindowWarp):** Correctly avoids inventing reviews and uses category peers — still **no shared scoring rubric**; AI parked without fit criteria; no founder “love a few users / don’t scale” guidance for indie stage.
5. **Eval 5 (fake reviews + skip research):** Correctly refuses fake reviews — **does not redirect into the mandatory research loop** (product map → competitors → VOC → scored backlog → gated implement); no FTC rule pointer; offers chatbot implementation path instead of research-first enhancement.

**Skill requirements derived:** operating checklist; hard defaults (3–5 competitors, cite VOC, RICE, AI↔gap mapping); report template; founder heuristics; AI fit lens; hard rejects for fake reviews / skip-research implement; Step-2 gated checklist.

## Sources

- [Intercom: RICE](https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers) — accessed 2026-11-22
- [Ulwick opportunity algorithm (CustomerThink)](https://customerthink.com/what-unmet-needs-should-be-targeted-for-growth/) — accessed 2026-11-22
- [Opportunity Score notes](https://notesforgrowth.github.io/Opportunity-Score/) — accessed 2026-11-22
- [Sam Altman Startup Playbook](https://playbook.samaltman.com/) — accessed 2026-11-22
- [Before Growth](https://blog.samaltman.com/before-growth) — accessed 2026-11-22
- [Paul Graham: Do Things that Don't Scale](https://www.paulgraham.com/ds.html) — accessed 2026-11-22
- [Smashing: Should You Actually Add AI To That?](https://www.smashingmagazine.com/2026/11/should-you-add-ai-audit-product-teams/) — accessed 2026-11-22
- [AI product strategy (outcome before model)](https://nenadivanovic.com/blog/ai-product-strategy) — accessed 2026-11-22
- [FTC Consumer Reviews Rule (Federal Register)](https://www.federalregister.gov/documents/2024/08/22/2024-18519/trade-regulation-rule-on-the-use-of-consumer-reviews-and-testimonials) — accessed 2026-11-22
- [16 CFR 465.2](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-D/part-465/section-465.2) — accessed 2026-11-22
- [jayrha competitive-analysis on skills.sh](https://www.skills.sh/jayrha/agent-skills/competitive-analysis) — accessed 2026-11-22
- [victorzhuk z-market-research](https://www.skills.sh/victorzhuk/skills/z-market-research) — accessed 2026-11-22
- [poorvith-mp customer-research](https://www.skills.sh/poorvith-mp/skills-marketing/customer-research) — accessed 2026-11-22
- [prosyo-ai competitor-teardown](https://www.skills.sh/prosyo-ai/gtm-skill/competitor-teardown) — accessed 2026-11-22
- [borghei competitive-teardown](https://www.skills.sh/borghei/claude-skills/competitive-teardown) — accessed 2026-11-22
