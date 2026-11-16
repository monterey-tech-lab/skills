---
title: Automate Cross-Tenant Isolation Tests
impact: CRITICAL
impactDescription: proves isolation survives refactors
tags: tenant, testing, isolation
---

## Automate Cross-Tenant Isolation Tests

**Impact: CRITICAL (proves isolation survives refactors)**

RLS and repository filters regress silently. Every multi-tenant resource needs an automated test where tenant A authenticates and requests tenant B's object id, expecting 404/403 and zero row leakage.

**Incorrect (happy-path tests only):**

```typescript
it('returns an invoice for the user', async () => {
  const res = await authAs(tenantA).get(`/api/invoices/${invoiceA.id}`);
  expect(res.status).toBe(200);
});
```

**Correct (explicit cross-tenant denial):**

```typescript
it('denies cross-tenant invoice reads', async () => {
  const res = await authAs(tenantA).get(`/api/invoices/${invoiceB.id}`);
  expect(res.status).toBe(404);
  expect(res.body).not.toHaveProperty('lineItems');
});
```

Add the same case for list endpoints (empty or only A's rows), updates, deletes, exports, and search.

Reference: [OWASP ASVS 5.0](https://asvs.owasp.org/), [NIST SSDF](https://csrc.nist.gov/pubs/sp/800/218/final)
