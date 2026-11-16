---
title: Take Tenant Identity from Trusted Auth Context
impact: CRITICAL
impactDescription: blocks client-supplied tenant spoofing
tags: tenant, auth, saas
---

## Take Tenant Identity from Trusted Auth Context

**Impact: CRITICAL (blocks client-supplied tenant spoofing)**

If the client can send `tenantId` in a query parameter or body, any user can attempt to operate as another customer. Establish tenant membership only from a verified session or access-token claim issued after authentication.

**Incorrect (tenantId from the request body):**

```typescript
app.get('/api/invoices', requireAuth, async (req, res) => {
  const tenantId = String(req.query.tenantId); // attacker chooses the tenant
  res.json(await db.invoices.findMany({ tenantId }));
});
```

**Correct (tenantId from verified session/token):**

```typescript
app.get('/api/invoices', requireAuth, async (req, res) => {
  const tenantId = req.ctx.tenantId; // set by auth middleware from signed session/JWT claims
  res.json(await invoices.listForTenant(tenantId));
});
```

Platform operators who truly need cross-tenant access use a separate break-glass role with step-up MFA and audit—never a client-supplied tenant switcher for normal users.

Reference: [OWASP API Security Top 10](https://owasp.org/projects/api-security-project)
