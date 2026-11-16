---
title: Authorize Every Object Access (No IDOR)
impact: CRITICAL
impactDescription: stops cross-user and cross-tenant data reads
tags: authz, idor, bola, access-control
---

## Authorize Every Object Access (No IDOR)

**Impact: CRITICAL (stops cross-user and cross-tenant data reads)**

Checking that the caller is logged in is not authorization. OWASP API Security Top 10 2023 API1 (Broken Object Level Authorization) is the classic IDOR: `/invoices/102` returns another customer's invoice when the handler loads by id alone.

**Incorrect (authenticated fetch by id only):**

```typescript
app.get('/api/invoices/:id', requireAuth, async (req, res) => {
  const invoice = await db.invoices.findById(req.params.id);
  if (!invoice) return res.status(404).end();
  res.json(invoice); // any logged-in user can read any invoice
});
```

**Correct (ownership or tenant-scoped lookup):**

```typescript
app.get('/api/invoices/:id', requireAuth, async (req, res) => {
  const invoice = await invoices.findByIdForTenant(
    req.params.id,
    req.ctx.tenantId, // from verified session/token — never from the client body
  );
  if (!invoice) return res.status(404).end(); // same status for missing and cross-tenant
  res.json(invoice);
});
```

Apply the same check on update, delete, export, and signed download URLs.

Reference: [OWASP API Security Top 10](https://owasp.org/projects/api-security-project), [OWASP Top 10 A01](https://owasp.org/projects/top-ten)
