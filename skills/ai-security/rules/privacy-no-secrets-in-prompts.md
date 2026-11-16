---
title: Never Put Secrets or Real PII in AI Prompts
impact: CRITICAL
impactDescription: stops credential and customer data leakage to providers
tags: privacy, secrets, pii, chat
---

## Never Put Secrets or Real PII in AI Prompts

**Impact: CRITICAL (stops credential and customer data leakage to providers)**

Anything pasted into an AI chat can be logged, retained, or visible to operators depending on the product tier. Live API keys, production database URLs, and real customer records belong in vaults and redacted fixtures—not prompts (OWASP LLM02 Sensitive Information Disclosure).

**Incorrect (paste live secrets and customer CSV into chat):**

```text
Please debug this webhook. Here is our .env:
STRIPE_SECRET_KEY=sk_live_...
DATABASE_URL=postgres://prod:hunter2@db/prod
And customers.csv with real emails.
```

**Correct (rotate if exposed; use test keys and synthetic data):**

```text
Do not paste live secrets or real PII.
1) Rotate any key/URL that entered chat.
2) Debug with sk_test_ / staging DB via local env (never in the message).
3) Share redacted event ids, status codes, and synthetic customer rows only.
```

If exposure already happened, treat it as an incident: rotate, review provider/audit logs, follow org PII process.

Reference: [OWASP LLM Top 10](https://genai.owasp.org/llm-top-10/), [Secure Coding with AI Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Coding_with_AI_Cheat_Sheet.html)
