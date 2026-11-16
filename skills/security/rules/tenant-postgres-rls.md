---
title: Enforce Tenant Isolation with PostgreSQL RLS
impact: CRITICAL
impactDescription: defense in depth when app filters are forgotten
tags: tenant, postgres, rls, isolation
---

## Enforce Tenant Isolation with PostgreSQL RLS

**Impact: CRITICAL (defense in depth when app filters are forgotten)**

Application `WHERE tenant_id = ?` filters fail the first time a query omits them. Enable Row Level Security with FORCE so policies apply even to table owners, and connect the app as a role without `BYPASSRLS`.

**Incorrect (app filter only; superuser connection):**

```sql
-- App uses the table owner / superuser role.
SELECT * FROM invoices WHERE id = $1; -- forgot tenant_id; returns any tenant
```

**Correct (RLS + FORCE + session tenant + constrained role):**

```sql
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices FORCE ROW LEVEL SECURITY;

CREATE POLICY invoices_tenant_isolation ON invoices
  FOR ALL
  TO app_rw
  USING (tenant_id = current_setting('app.tenant_id')::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);

-- Before queries (transaction-local):
-- SELECT set_config('app.tenant_id', $1, true);
```

`FORCE ROW LEVEL SECURITY` subjects **table owners** to policies. Superusers and roles with `BYPASSRLS` always bypass policies, FORCE or not—so the app must connect as a non-superuser role without `BYPASSRLS`. Keep a migrator role separate from `app_rw`.

Reference: [PostgreSQL Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html), [CREATE POLICY](https://www.postgresql.org/docs/current/sql-createpolicy.html)
