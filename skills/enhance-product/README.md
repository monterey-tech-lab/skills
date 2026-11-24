# Enhance Product

Simple Agent Skill for evidence-backed product enhancement: research a website, business, or software product (features, competitors, public VOC), produce a RICE-scored gap backlog including grounded AI ideas, then optionally implement selected items.

## Install

```bash
npx skills add monterey-tech-lab/skills --skill enhance-product
```

Manual: copy `skills/enhance-product` to `~/.claude/skills/`, `.agents/skills/`, or `~/.cursor/skills/`.

## Structure

- `SKILL.md` — operating loop, hard defaults/rejects, Step 1 → Step 2 gate
- `references/research-playbook.md` — source ladder, VOC, sparse signal, ethics
- `references/competitor-matrix.md` — peer selection and offerings matrix
- `references/opportunity-scoring.md` — RICE + founder heuristics
- `references/ai-enhancement-lens.md` — AI fit vs theater
- `references/report-template.md` — required Step 1 report sections
- `scripts/rice.mjs` — optional RICE arithmetic helper (stdlib Node)

## Complements

- UI craft polish → `craft-and-taste`
- Multi-tenant AppSec → `security`
- Agent/MCP hygiene → `ai-security` / `mcp`

## Attribution

Guidance is original prose grounded in primary sources listed in `docs/research/enhance-product.md` (Intercom RICE, Ulwick opportunity scoring, Altman/Graham public essays, FTC 16 CFR 465, product AI-fit articles). Third-party Agent Skills on skills.sh were used for gap analysis only—bodies were not copied.

## License

MIT
