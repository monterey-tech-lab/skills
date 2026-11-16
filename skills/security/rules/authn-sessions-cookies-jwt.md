---
title: Use Revocable Sessions or Short-Lived JWTs
impact: CRITICAL
impactDescription: enables fire-and-revoke without waiting for expiry
tags: authn, sessions, jwt, cookies
---

## Use Revocable Sessions or Short-Lived JWTs

**Impact: CRITICAL (enables fire-and-revoke without waiting for expiry)**

Long-lived JWTs in `localStorage` cannot be revoked when an employee is fired, and they are easy XSS prey. Prefer opaque server sessions with HttpOnly Secure SameSite cookies, or short-lived access tokens (minutes) plus rotatable refresh tokens you can denylist. Validate JWT `exp`/`iss`/`aud` and algorithm allowlists per RFC 8725.

**Incorrect (30-day JWT in localStorage):**

```typescript
const accessToken = jwt.sign(claims, secret, { expiresIn: '30d' });
localStorage.setItem('token', accessToken); // no revoke path
```

**Correct (server session cookie + terminate path):**

```typescript
res.cookie('session', opaqueToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  path: '/',
  maxAge: 12 * 60 * 60 * 1000,
});

async function terminateEmployee(userId: string) {
  await db.users.update(userId, { disabledAt: new Date() });
  await sessions.revokeAllForUser(userId);
  await refreshTokens.revokeAllForUser(userId);
}
```

If JWTs are required for APIs: access TTL 5–15 minutes, bind `iss`/`aud`, reject `alg: none`, store refresh tokens server-side, rotate on use. Prefer sessions when browser revocation matters most.

Reference: [RFC 8725 JWT BCP](https://www.rfc-editor.org/rfc/rfc8725.html), [OWASP JWT Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html)
