---
title: Keep Auth SSO-Ready with OIDC or SAML
impact: HIGH
impactDescription: avoids rewriting auth for enterprise deals
tags: authn, sso, oidc, saml
---

## Keep Auth SSO-Ready with OIDC or SAML

**Impact: HIGH (avoids rewriting auth for enterprise deals)**

Enterprise buyers require SAML/OIDC SSO. Homegrown email/password-only auth forces a rewrite under sales pressure. Use an IdP or library path (Auth0, Clerk, WorkOS, Keycloak, or certified OIDC) that can add SSO without changing your session/authorization model.

**Incorrect (password-only forever):**

```typescript
// Custom users table + bcrypt only. SSO deferred "until we need it."
app.post('/login', passwordLoginHandler);
```

**Correct (external IdP with OIDC, local sessions unchanged):**

```typescript
// Browser completes OIDC against the IdP; app stores a local session mapped to tenant membership.
app.get('/auth/callback', async (req, res) => {
  const profile = await oidc.exchange(req.query.code);
  const user = await users.linkFederatedIdentity(profile);
  await sessions.create(res, user);
  res.redirect('/app');
});
```

MFA for privileged roles remains required even when SSO is enabled; prefer enforcing MFA at the IdP when possible.

Reference: [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
