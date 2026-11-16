---
title: Prevent Injection with Parameterized Queries
impact: HIGH
impactDescription: blocks SQLi and command injection
tags: coding, sqli, injection, validation
---

## Prevent Injection with Parameterized Queries

**Impact: HIGH (blocks SQLi and command injection)**

String-concatenated SQL and shell commands turn user input into attacker-controlled queries (OWASP Top 10:2025 A05 Injection). Use bound parameters / ORM query builders and allow-list validation server-side.

**Incorrect (string-built SQL):**

```typescript
const rows = await db.query(
  `SELECT * FROM invoices WHERE id = '${req.params.id}'`,
);
```

**Correct (bound parameters):**

```typescript
const rows = await db.query(
  'SELECT * FROM invoices WHERE id = $1 AND tenant_id = $2',
  [req.params.id, req.ctx.tenantId],
);
```

Validate types and lengths with a schema library (Zod, etc.) before use. Escape or parameterize for XSS/HTML separately (contextual encoding).

Reference: [OWASP Top 10:2025](https://owasp.org/projects/top-ten), [SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
