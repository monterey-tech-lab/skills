# AI Security

Rule-based Agent Skill for safe use of AI coding assistants, MCP tools, autonomous agents, and LLM product features.

## Install

```bash
npx skills add monterey-tech-lab/skills --skill ai-security
```

## Boundary

Use `security` for multi-tenant SaaS AppSec (IDOR, RLS, JWT, webhooks). This skill owns assistant/agent hygiene and complementary LLM output controls. Cross-link product rule `security` / `ai-llm-guardrails` for in-app tool allow-lists.

## Sources

Grounded in primary sources listed in `docs/research/ai-security.md` and `metadata.json` (OWASP LLM Top 10 2026, Agentic ASI, MCP security docs, NIST SP 800-218A, Cursor/Copilot ignore docs, package hallucination research). Third-party skills used for gap analysis only—bodies not copied.

## Safety

Defensive guidance only. No jailbreak or exploit recipes. Retention/ZDR notes are operational, not legal advice.
