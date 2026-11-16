---
title: Audit AI Actions and Keep a Kill Switch
impact: HIGH
impactDescription: enables incident response for agent mishaps
tags: output, audit, kill-switch
---

## Audit AI Actions and Keep a Kill Switch

**Impact: HIGH (enables incident response for agent mishaps)**

When an agent or LLM feature misbehaves, you need append-oriented logs of prompts/tool calls (redacted) and an immediate way to revoke API keys and disable tools. Feature flags and key rotation are the product/feature kill switch. For agent harness spend caps and max-steps circuit breakers, follow `agent-deterministic-limits`.

**Incorrect (no logs, no off switch):**

```text
Ship the agent. No tool-call log. Keys are long-lived personal tokens.
```

**Correct (redacted audit + revoke path):**

```typescript
await aiAudit.append({
  actorId,
  tool: 'shell',
  argsDigest: hash(args),
  // never store raw secrets or full PII prompts
});
async function killAiFeature() {
  await flags.disable('ai.agent');
  await secrets.revoke('AGENT_API_KEY');
}
```

Red-team prompt-injection cases in CI for product LLM features before launch; keep tests non-offensive (assert refusal/containment).

Reference: [OWASP AI Agent Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html), [OWASP LLM Top 10](https://genai.owasp.org/llm-top-10/)
