---
title: Encrypt Data and Redact PII from Logs
impact: HIGH
impactDescription: limits breach blast radius and observability leaks
tags: data, tls, encryption, pii, privacy
---

## Encrypt Data and Redact PII from Logs

**Impact: HIGH (limits breach blast radius and observability leaks)**

Cleartext traffic and verbose logs turn routine incidents into reportable breaches. Enforce TLS for all external and service traffic, encrypt sensitive stores/backups at rest with cloud KMS-managed keys, minimize collected PII, and scrub passwords, tokens, and payment fields before logs leave the process.

**Incorrect (HTTP and raw body logging):**

```typescript
logger.info({ body: req.body }); // passwords, PANs, tokens
// API served over http://api.example.com
```

**Correct (TLS + allow-listed structured logs):**

```typescript
app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true }));

logger.info({
  requestId: req.id,
  route: req.path,
  userId: req.ctx?.userId,
  // never: password, authorization, cookie, cardNumber, ssn
});
```

Prefer payment provider elements so PANs never hit your servers. Keys live in KMS/HSM, not in application config files.

Reference: [OWASP Transport Layer Protection](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Protection_Cheat_Sheet.html), [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
