---
title: Least Privilege and Minimal Attack Surface
impact: CRITICAL
impactDescription: limits blast radius of a compromise
tags: design, least-privilege, attack-surface
---

## Least Privilege and Minimal Attack Surface

**Impact: CRITICAL (limits blast radius of a compromise)**

Default-open ports, sample endpoints, wildcard IAM, and god-mode service accounts turn one bug into a full tenant breach. Grant the minimum permissions needed; disable unused features and public entry points before shipping.

**Incorrect (broad roles and leftover debug routes):**

```typescript
app.use('/debug', debugRouter); // left enabled in production
const dbUrl = process.env.DATABASE_URL; // app uses superuser connection
await iam.attachPolicy(role, 'arn:aws:iam::aws:policy/AdministratorAccess');
```

**Correct (narrow roles, no debug in prod):**

```typescript
if (process.env.NODE_ENV !== 'production') {
  app.use('/debug', debugRouter);
}
// App connects as role `app_rw` without BYPASSRLS; migrations use a separate migrator role.
await iam.attachInlinePolicy(role, {
  Effect: 'Allow',
  Action: ['s3:PutObject', 's3:GetObject'],
  Resource: `arn:aws:s3:::${bucket}/uploads/${tenantId}/*`,
});
```

Escape hatch: break-glass admin roles must be time-boxed, MFA-gated, and audited.

Reference: [NIST SSDF SP 800-218](https://csrc.nist.gov/pubs/sp/800/218/final), [OWASP ASVS 5.0](https://asvs.owasp.org/)
