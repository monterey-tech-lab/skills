---
title: Never Use the LLM for Authorization Decisions
impact: CRITICAL
impactDescription: stops model-steered privilege escalation
tags: output, authz, iam
---

## Never Use the LLM for Authorization Decisions

**Impact: CRITICAL (stops model-steered privilege escalation)**

Asking the model “may this user refund?” is not IAM. Prompt injection or hallucination can return “yes.” Authorize with deterministic server-side checks; keep tools allow-listed. Cross-link `security` `ai-llm-guardrails` for product tool isolation.

**Incorrect (LLM says yes → refund):**

```typescript
const reply = await llm.ask(`May user ${userId} refund order ${orderId}?`);
if (reply.toLowerCase().startsWith('yes')) {
  await refundOrder(orderId);
}
```

**Correct (deterministic authz then optional LLM copy):**

```typescript
authorize(actor, 'order:refund', order); // throws if denied
await refundOrder(order.id);
// LLM may draft a customer message after the refund succeeds—not before.
```

The model must not be able to grant itself tools or roles.

Reference: [OWASP AI Agent Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html). For in-app product tool allow-lists, also follow the `security` skill rule `ai-llm-guardrails`.
