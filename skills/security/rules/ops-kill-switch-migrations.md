---
title: Ship Kill Switches and Expand-Contract Migrations
impact: MEDIUM
impactDescription: limits outage and security-bug blast radius
tags: ops, feature-flags, migrations, availability
---

## Ship Kill Switches and Expand-Contract Migrations

**Impact: MEDIUM (limits outage and security-bug blast radius)**

Risky features and schema changes fail hard under load. Wrap new integrations in feature flags/kill switches so you can disable them without redeploying. Use expand-and-contract migrations so rolling deploys never lock tables or break old app versions.

**Incorrect (blocking migration + no flag):**

```sql
-- Deploy needs the new column AND the app that writes it, atomically.
ALTER TABLE invoices ADD COLUMN total_cents bigint NOT NULL;
-- Concurrently: long LOCK; old app crashes on missing default
```

**Correct (expand, dual-write, contract + flag):**

```sql
-- 1) Expand: nullable/new table, no lock storm
ALTER TABLE invoices ADD COLUMN total_cents bigint NULL;
-- 2) Deploy app that dual-writes / backfills
-- 3) Contract later: SET NOT NULL after backfill; drop old column
-- Feature flag `payments.v2` off by default; kill switch in config service
```

Flags must default safely (off for risky paths) and be controllable without a full redeploy.

Reference: [NIST SSDF](https://csrc.nist.gov/pubs/sp/800/218/final)
