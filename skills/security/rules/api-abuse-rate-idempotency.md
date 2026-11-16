---
title: Rate-Limit and Require Idempotency on Side Effects
impact: MEDIUM-HIGH
impactDescription: stops stuffing, double charges, and resource exhaustion
tags: api, rate-limit, idempotency, availability
---

## Rate-Limit and Require Idempotency on Side Effects

**Impact: MEDIUM-HIGH (stops stuffing, double charges, and resource exhaustion)**

Credential stuffing and payment retries without idempotency keys create fraud and availability failures (API4:2023 Unrestricted Resource Consumption). Apply per-IP and per-user/tenant limits at the edge or gateway, and require `Idempotency-Key` on POST charges, provisioning, and similar side effects.

**Incorrect (unlimited retries create duplicate charges):**

```typescript
app.post('/api/charges', requireAuth, async (req, res) => {
  const charge = await stripe.charges.create(req.body); // retry = second charge
  res.json(charge);
});
```

**Correct (idempotency key + rate limit):**

```typescript
app.post('/api/charges', requireAuth, rateLimit({ perTenant: 30, windowMs: 60_000 }), async (req, res) => {
  const key = req.get('Idempotency-Key');
  if (!key) return res.status(400).json({ error: 'Idempotency-Key required' });
  const cached = await idempotency.get(req.ctx.tenantId, key);
  if (cached) return res.status(cached.status).json(cached.body);
  const body = await payments.charge(req.ctx, req.body, key);
  await idempotency.put(req.ctx.tenantId, key, { status: 200, body });
  res.json(body);
});
```

Also cap request body size and handler timeouts to blunt slowloris-style exhaustion.

Reference: [OWASP API Security Top 10](https://owasp.org/projects/api-security-project), [REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
