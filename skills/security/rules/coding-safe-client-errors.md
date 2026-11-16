---
title: Return Opaque Errors to Clients
impact: HIGH
impactDescription: stops schema and stack leakage
tags: coding, errors, logging
---

## Return Opaque Errors to Clients

**Impact: HIGH (stops schema and stack leakage)**

Stack traces and SQL driver messages teach attackers your schema and dependency versions. Log full detail server-side with a request id; send clients a generic message.

**Incorrect (stack and SQL in the JSON body):**

```typescript
app.use((err, req, res, _next) => {
  res.status(500).json({ stack: err.stack, detail: err.detail });
});
```

**Correct (generic client body, detailed server log):**

```typescript
app.use((err, req, res, _next) => {
  const requestId = req.id ?? crypto.randomUUID();
  logger.error({ requestId, err });
  res.status(500).json({ error: 'An unexpected error occurred', requestId });
});
```

Map intentional domain errors to stable 4xx codes with non-sensitive messages.

Reference: [OWASP Top 10 A10 Mishandling of Exceptional Conditions](https://owasp.org/projects/top-ten)
