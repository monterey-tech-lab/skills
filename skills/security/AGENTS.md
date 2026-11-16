# SaaS Security

**Version 0.1.0**  
Monterey Tech Lab  
November 2026

> **Note:**  
> This document is mainly for agents and LLMs to follow when maintaining,  
> generating, or refactoring Multi-tenant B2B/SaaS product codebases (TypeScript/Node, PostgreSQL, cloud). Humans  
> may also find it useful, but guidance here is optimized for automation  
> and consistency by AI-assisted workflows.

---

## Abstract

Secure-by-default architecture and implementation guardrails for agents shipping scalable SaaS: Confidentiality, Integrity, Availability, Authentication, and Non-Repudiation, plus first-class authorization. Covers STRIDE threat modeling, IDOR/BOLA prevention, PostgreSQL RLS tenant isolation, Argon2id and session/JWT hygiene, SSO readiness, secrets and PII logging, API abuse controls, LLM prompt-injection boundaries, SCA, environment isolation, audit logs, backups, incident runbooks, and technical mapping to OWASP ASVS 5.0 and SOC 2 Trust Services Criteria. Each rule compares incorrect and correct TypeScript/SQL patterns. Defensive only; not legal advice.

---

## Table of Contents

1. [Design and Threat Modeling](#1-design-and-threat-modeling) — **CRITICAL**
   - 1.1 [Least Privilege and Minimal Attack Surface](#11-least-privilege-and-minimal-attack-surface)
   - 1.2 [Threat-Model New Trust Boundaries with STRIDE](#12-threat-model-new-trust-boundaries-with-stride)
2. [Authorization](#2-authorization) — **CRITICAL**
   - 2.1 [Authorize Every Object Access (No IDOR)](#21-authorize-every-object-access-no-idor)
   - 2.2 [Deny-by-Default RBAC or ABAC](#22-deny-by-default-rbac-or-abac)
3. [Multi-Tenant Isolation](#3-multi-tenant-isolation) — **CRITICAL**
   - 3.1 [Automate Cross-Tenant Isolation Tests](#31-automate-cross-tenant-isolation-tests)
   - 3.2 [Enforce Tenant Isolation with PostgreSQL RLS](#32-enforce-tenant-isolation-with-postgresql-rls)
   - 3.3 [Take Tenant Identity from Trusted Auth Context](#33-take-tenant-identity-from-trusted-auth-context)
4. [Authentication and Sessions](#4-authentication-and-sessions) — **CRITICAL**
   - 4.1 [Hash Passwords with Argon2id](#41-hash-passwords-with-argon2id)
   - 4.2 [Keep Auth SSO-Ready with OIDC or SAML](#42-keep-auth-sso-ready-with-oidc-or-saml)
   - 4.3 [Use Revocable Sessions or Short-Lived JWTs](#43-use-revocable-sessions-or-short-lived-jwts)
5. [Secure Coding](#5-secure-coding) — **HIGH**
   - 5.1 [Prevent Injection with Parameterized Queries](#51-prevent-injection-with-parameterized-queries)
   - 5.2 [Return Opaque Errors to Clients](#52-return-opaque-errors-to-clients)
6. [Secrets Management](#6-secrets-management) — **HIGH**
   - 6.1 [Keep Secrets out of Git and Scan for Leaks](#61-keep-secrets-out-of-git-and-scan-for-leaks)
7. [Data Protection and Privacy](#7-data-protection-and-privacy) — **HIGH**
   - 7.1 [Encrypt Data and Redact PII from Logs](#71-encrypt-data-and-redact-pii-from-logs)
8. [APIs and Abuse Resistance](#8-apis-and-abuse-resistance) — **MEDIUM-HIGH**
   - 8.1 [Rate-Limit and Require Idempotency on Side Effects](#81-rate-limit-and-require-idempotency-on-side-effects)
   - 8.2 [Verify Webhooks and Lock CORS to the Product Origin](#82-verify-webhooks-and-lock-cors-to-the-product-origin)
9. [AI Feature Guardrails](#9-ai-feature-guardrails) — **MEDIUM-HIGH**
   - 9.1 [Isolate Prompts and Constrain LLM Tools](#91-isolate-prompts-and-constrain-llm-tools)
10. [Supply Chain](#10-supply-chain) — **MEDIUM**
   - 10.1 [Pin Dependencies and Scan for CVEs](#101-pin-dependencies-and-scan-for-cves)
11. [Infrastructure and Environments](#11-infrastructure-and-environments) — **MEDIUM**
   - 11.1 [Separate Environments and Private Data Planes](#111-separate-environments-and-private-data-planes)
12. [Operations and Incident Readiness](#12-operations-and-incident-readiness) — **MEDIUM**
   - 12.1 [Audit High-Risk Events, Test Backups, Keep an IR Runbook](#121-audit-high-risk-events-test-backups-keep-an-ir-runbook)
   - 12.2 [Ship Kill Switches and Expand-Contract Migrations](#122-ship-kill-switches-and-expand-contract-migrations)
13. [Compliance Mapping](#13-compliance-mapping) — **LOW-MEDIUM**
   - 13.1 [Map Controls to ASVS and TSC Without Legal Claims](#131-map-controls-to-asvs-and-tsc-without-legal-claims)

---

## 1. Design and Threat Modeling

**Impact: CRITICAL**

Shift-left security: STRIDE threat models, least privilege, and a minimal attack surface before features harden into liabilities.

### 1.1 Least Privilege and Minimal Attack Surface

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

### 1.2 Threat-Model New Trust Boundaries with STRIDE

**Impact: CRITICAL (catches insecure design before it ships)**

Features that cross trust boundaries (admin impersonation, webhooks, exports, AI tools) fail as Insecure Design (OWASP Top 10:2025 A06) when nobody names who can spoof, tamper, repudiate, disclose, deny, or elevate. Sketch a data-flow and apply STRIDE before coding.

**Incorrect (ship first, security later):**

```typescript
// "Just add an admin 'login as user' button for support."
app.post('/admin/impersonate/:userId', requireAdmin, async (req, res) => {
  const target = await db.user.findById(req.params.userId);
  req.session.userId = target.id; // no abuse cases, no audit, no step-up MFA
  res.json({ ok: true });
});
```

**Correct (STRIDE notes then controls):**

```typescript
// STRIDE for impersonation (summary kept with the change):
// S: forged admin session → requireAdmin + step-up MFA
// T: swap userId → authorize target in same org; bind action to request id
// R: deniable support access → immutable audit (actor, target, reason, ticket)
// I: PII over support channel → minimize fields returned
// D: mass impersonation → rate limit + kill switch
// E: support → tenant admin → break-glass role, time-boxed grant

app.post('/admin/impersonate/:userId', requireAdmin, requireStepUpMfa, async (req, res) => {
  const target = await users.findInActorScope(req.actor, req.params.userId);
  if (!target) return res.status(404).end();
  await audit.append({
    type: 'impersonation.start',
    actorId: req.actor.id,
    targetId: target.id,
    reason: req.body.reason,
    ticket: req.body.ticket,
  });
  req.session.impersonatingUserId = target.id;
  req.session.impersonationExpiresAt = Date.now() + 15 * 60_000;
  res.json({ ok: true });
});
```

Completion criterion: every new trust boundary has a short STRIDE list and at least one control per relevant threat. Read `references/stride-checklist.md` for the worksheet.

Reference: [Microsoft Learn: STRIDE threats](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats), [OWASP Top 10:2025](https://owasp.org/projects/top-ten)

---

## 2. Authorization

**Impact: CRITICAL**

Broken access control (OWASP A01 / API1 BOLA) is the most common SaaS failure. Every object access must be authorized; roles deny by default.

### 2.1 Authorize Every Object Access (No IDOR)

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

### 2.2 Deny-by-Default RBAC or ABAC

**Impact: CRITICAL (enterprise roles without isAdmin sprawl)**

A boolean `isAdmin` collapses when customers need custom roles. Build explicit permissions, deny by default, and check function-level authorization on every privileged route.

**Incorrect (boolean admin flag):**

```typescript
if (!user.isAdmin) throw new ForbiddenError();
await deleteWorkspace(workspaceId); // every admin can do everything
```

**Correct (permission check on the action):**

```typescript
type Permission = 'invoice:read' | 'invoice:write' | 'workspace:delete' | 'billing:manage';

function authorize(actor: Actor, permission: Permission, resource?: Resource): void {
  if (!policy.allows(actor, permission, resource)) {
    throw new ForbiddenError();
  }
}

authorize(req.actor, 'workspace:delete', workspace);
await deleteWorkspace(workspace.id);
```

Prefer a small permission set with role→permission maps; add ABAC attributes (tenant, region) when enterprise customers demand them.

Reference: [OWASP ASVS 5.0](https://asvs.owasp.org/), [OWASP Top 10 A01 Broken Access Control](https://owasp.org/projects/top-ten)

---

## 3. Multi-Tenant Isolation

**Impact: CRITICAL**

One customer must never read or mutate another customer's data. Enforce tenant context from trusted auth, database policies, and automated isolation tests.

### 3.1 Automate Cross-Tenant Isolation Tests

**Impact: CRITICAL (proves isolation survives refactors)**

RLS and repository filters regress silently. Every multi-tenant resource needs an automated test where tenant A authenticates and requests tenant B's object id, expecting 404/403 and zero row leakage.

**Incorrect (happy-path tests only):**

```typescript
it('returns an invoice for the user', async () => {
  const res = await authAs(tenantA).get(`/api/invoices/${invoiceA.id}`);
  expect(res.status).toBe(200);
});
```

**Correct (explicit cross-tenant denial):**

```typescript
it('denies cross-tenant invoice reads', async () => {
  const res = await authAs(tenantA).get(`/api/invoices/${invoiceB.id}`);
  expect(res.status).toBe(404);
  expect(res.body).not.toHaveProperty('lineItems');
});
```

Add the same case for list endpoints (empty or only A's rows), updates, deletes, exports, and search.

Reference: [OWASP ASVS 5.0](https://asvs.owasp.org/), [NIST SSDF](https://csrc.nist.gov/pubs/sp/800/218/final)

### 3.2 Enforce Tenant Isolation with PostgreSQL RLS

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

### 3.3 Take Tenant Identity from Trusted Auth Context

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

---

## 4. Authentication and Sessions

**Impact: CRITICAL**

Verify identity with strong password hashing, MFA for privileged roles, secure sessions or short-lived tokens with revocation, and SSO readiness for enterprise.

### 4.1 Hash Passwords with Argon2id

**Impact: CRITICAL (resists offline cracking after a dump)**

Fast hashes (MD5, SHA-*) make password dumps trivially crackable. Use Argon2id with OWASP-recommended memory/time parameters; bcrypt/scrypt/PBKDF2 are documented fallbacks. Follow NIST SP 800-63B-4 on length and no composition rituals.

**Incorrect (SHA-256 password storage):**

```typescript
import { createHash } from 'node:crypto';
const passwordHash = createHash('sha256').update(password).digest('hex');
```

**Correct (Argon2id verify/hash):**

```typescript
import { hash, verify } from '@node-rs/argon2';

const passwordHash = await hash(password, {
  memoryCost: 19456, // 19 MiB (OWASP minimum example)
  timeCost: 2,
  parallelism: 1,
});

const ok = await verify(passwordHash, password);
```

Prefer MFA so passwords are not the only factor. Min length: 15 for single-factor, 8 when used only as part of MFA (NIST SP 800-63B-4); max ≥ 64; blocklist common passwords; no periodic forced rotation.

Reference: [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), [NIST SP 800-63B-4](https://pages.nist.gov/800-63-4/sp800-63b.html)

### 4.2 Keep Auth SSO-Ready with OIDC or SAML

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

### 4.3 Use Revocable Sessions or Short-Lived JWTs

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

---

## 5. Secure Coding

**Impact: HIGH**

Treat all input as untrusted. Prevent injection with parameterized queries and contextual output encoding; never leak internals in client errors.

### 5.1 Prevent Injection with Parameterized Queries

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

### 5.2 Return Opaque Errors to Clients

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

---

## 6. Secrets Management

**Impact: HIGH**

Secrets never live in git or images. Use a secret manager, rotate compromised material, and block leaks with CI secret scanning.

### 6.1 Keep Secrets out of Git and Scan for Leaks

**Impact: HIGH (prevents credential theft from the repo)**

Committed `.env` files and keys in images are permanent leaks once the repo is cloned. Load secrets from a manager or CI injection, rotate anything that was committed, and block future leaks with gitleaks/trufflehog (or equivalent) in pre-commit and CI.

**Incorrect (committed production .env):**

```text
# .env committed to git
DATABASE_URL=postgres://prod:hunter2@db/prod
STRIPE_SECRET_KEY=sk_live_...
```

**Correct (secret manager + scanner):**

```yaml
# CI: inject secrets; never commit them
# - uses: google-github-actions/auth / aws-actions / Doppler / Vault
# Pre-commit + CI:
# - gitleaks detect --source . --verbose
#
# App reads process.env populated by the platform; rotate any key that ever touched git.
```

Add `.env` to `.gitignore` and ship `.env.example` with empty placeholders only.

Reference: [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html), [NIST SSDF](https://csrc.nist.gov/pubs/sp/800/218/final)

---

## 7. Data Protection and Privacy

**Impact: HIGH**

Encrypt in transit and at rest, minimize PII, and redact secrets and sensitive fields from logs and client responses.

### 7.1 Encrypt Data and Redact PII from Logs

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

---

## 8. APIs and Abuse Resistance

**Impact: MEDIUM-HIGH**

Rate-limit, require idempotency for side effects, verify webhooks, and lock CORS to trusted product origins—not marketing sites on privileged APIs.

### 8.1 Rate-Limit and Require Idempotency on Side Effects

**Impact: MEDIUM-HIGH (stops stuffing, double charges, and resource exhaustion)**

Credential stuffing and payment retries without idempotency keys create fraud and availability failures (API4:2023 Unrestricted Resource Consumption). Apply per-IP and per-user/tenant limits at the edge or gateway, and require `Idempotency-Key` on POST charges, provisioning, and similar side effects.

**Incorrect (unlimited retries create duplicate charges):**

```typescript
app.post('/api/charges', requireAuth, async (req, res) => {
  const charge = await stripe.charges.create(req.body); // retry = second charge
  res.json(charge);
});
```

**Correct (idempotency key + rate limit):**

```typescript
app.post('/api/charges', requireAuth, rateLimit({ perTenant: 30, windowMs: 60_000 }), async (req, res) => {
  const key = req.get('Idempotency-Key');
  if (!key) return res.status(400).json({ error: 'Idempotency-Key required' });
  const cached = await idempotency.get(req.ctx.tenantId, key);
  if (cached) return res.status(cached.status).json(cached.body);
  const body = await payments.charge(req.ctx, req.body, key);
  await idempotency.put(req.ctx.tenantId, key, { status: 200, body });
  res.json(body);
});
```

Also cap request body size and handler timeouts to blunt slowloris-style exhaustion.

Reference: [OWASP API Security Top 10](https://owasp.org/projects/api-security-project), [REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)

### 8.2 Verify Webhooks and Lock CORS to the Product Origin

**Impact: MEDIUM-HIGH (blocks forged events and cross-site credential abuse)**

Unverified webhooks accept attacker-crafted billing events. Wildcard or marketing-site CORS with credentials on privileged APIs lets unrelated origins drive state-changing calls. Verify provider signatures, process webhook event ids idempotently, require auth on charge APIs, and allow-list only the trusted product frontend origin.

**Incorrect (trust body; marketing CORS on charges):**

```typescript
app.post('/webhooks/stripe', express.json(), async (req, res) => {
  await handleStripeEvent(req.body); // no signature check
  res.sendStatus(200);
});
app.use(cors({ origin: 'https://marketing.example.com', credentials: true }));
app.post('/api/charges', createCharge); // marketing page can call with cookies
```

**Correct (signature verify; product-origin CORS only):**

```typescript
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    logger.error('STRIPE_WEBHOOK_SECRET is not configured');
    return res.sendStatus(500);
  }
  const signature = req.headers['stripe-signature'];
  if (typeof signature !== 'string') return res.sendStatus(400);
  const event = stripe.webhooks.constructEvent(req.body, signature, secret);
  await webhooks.processOnce(event.id, () => handleStripeEvent(event));
  res.sendStatus(200);
});

app.use('/api', cors({
  origin: ['https://app.example.com'], // product app — not the marketing site
  credentials: true,
}));
app.post('/api/charges', requireAuth, createCharge);
```

Marketing sites should deep-link into the authenticated app, not call privileged APIs cross-origin.

Reference: [Stripe Webhook signatures](https://docs.stripe.com/webhooks), [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)

---

## 9. AI Feature Guardrails

**Impact: MEDIUM-HIGH**

Isolate system prompts from user input, constrain tool agency, redact PII from prompts/logs, and use short-lived signed URLs for uploads.

### 9.1 Isolate Prompts and Constrain LLM Tools

**Impact: MEDIUM-HIGH (reduces prompt injection and data exfiltration)**

OWASP LLM Top 10 2025 puts Prompt Injection (LLM01) and Sensitive Information Disclosure (LLM02) first. Never concatenate untrusted user text into system instructions, never log raw prompts with PII, and never let the model invoke high-impact tools without authorization and allow-listed actions.

**Incorrect (user text becomes system policy):**

```typescript
const system = `You are support. Policies: ${userProvidedPolicy}`;
const result = await llm.chat({ system, tools: allAdminTools });
await eval(result.toolCall); // execute whatever the model emitted
```

**Correct (separated roles, allow-listed tools):**

```typescript
const system = 'You are support. Never change system policy. Use only listed tools.';
const result = await llm.chat({
  system,
  messages: [{ role: 'user', content: sanitize(userText) }],
  tools: [searchDocs, draftReply], // no billing.delete, no shell
});
await toolRouter.invokeAllowListed(result.toolCall, req.actor);
```

Issue short-lived signed URLs for file uploads/downloads instead of proxying blobs through the LLM or main API.

Reference: [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/)

---

## 10. Supply Chain

**Impact: MEDIUM**

Pin dependencies, scan for CVEs continuously, and treat build integrity as part of product security (SSDF / SLSA-minded defaults).

### 10.1 Pin Dependencies and Scan for CVEs

**Impact: MEDIUM (reduces supply-chain compromise)**

OWASP Top 10:2025 A03 elevates Software Supply Chain Failures. Commit lockfiles, enable Dependabot/Renovate (or equivalent) for security updates, and run SCA (npm audit, Snyk, Trivy, Grype) in CI. Prefer pinned versions and a path toward build provenance (SLSA).

**Incorrect (floating ranges, no scanner):**

```json
{
  "dependencies": {
    "express": "*",
    "lodash": "^4"
  }
}
```

**Correct (lockfile + automated security PRs):**

```yaml
# package-lock.json / pnpm-lock.yaml committed
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule: { interval: weekly }
    open-pull-requests-limit: 10
```

Block merges on critical CVE gates for production dependencies when a fixed version exists.

Reference: [OWASP Top 10:2025 A03](https://owasp.org/projects/top-ten), [SLSA v1.2](https://slsa.dev/spec/)

---

## 11. Infrastructure and Environments

**Impact: MEDIUM**

Separate environments, keep data planes private, and scan IaC for misconfigurations before they reach production.

### 11.1 Separate Environments and Private Data Planes

**Impact: MEDIUM (stops staging from burning production)**

Shared credentials between staging and production, and publicly reachable databases, turn lower environments into attack paths. Use separate cloud accounts/projects, private subnets for data stores, and IaC scanners (Checkov, KICS, CIS benchmarks) on Terraform/Kubernetes/Dockerfiles.

**Incorrect (staging app on prod database):**

```text
STAGING_DATABASE_URL=postgres://prod-user:...@prod-db.public/aws
# Postgres security group allows 0.0.0.0/0:5432
```

**Correct (isolated envs, private DB):**

```text
STAGING_DATABASE_URL=postgres://staging-user:@staging-db.internal:5432/app
# DB in private subnet; ingress only from app security group / private service connect
# Separate AWS account or GCP project for prod vs non-prod
```

Treat servers as ephemeral: no SSH snowflake edits; immutable container images without shells in production where practical.

Reference: [NIST SSDF](https://csrc.nist.gov/pubs/sp/800/218/final), [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks)

---

## 12. Operations and Incident Readiness

**Impact: MEDIUM**

Immutable audit logs, tested backups, kill switches, safe migrations, and a one-page incident runbook keep growth from becoming an outage or breach.

### 12.1 Audit High-Risk Events, Test Backups, Keep an IR Runbook

**Impact: MEDIUM (enterprise readiness without compliance theater)**

A marketing "SOC 2 Compliant" badge without evidence fails enterprise questionnaires. Record high-risk actions in an append-only or WORM-oriented audit store, prove backups restore (PITR + drill), and keep a one-page incident runbook (who to page, how to revoke keys, how to notify). Map these to AICPA Trust Services Criteria as technical controls—not a legal certification claim.

**Incorrect (badge instead of controls):**

```text
Homepage: "SOC 2 Compliant"
# No audit log, no restore drill, no incident runbook
```

**Correct (technical evidence pack):**

```typescript
await audit.append({
  type: 'role.changed',
  actorId,
  targetId,
  before,
  after,
  at: new Date().toISOString(),
}); // store is append-only; admins cannot UPDATE/DELETE

// ops/incident-response.md: page on-call → revoke sessions/keys →
// preserve logs → customer notice draft → postmortem
// Quarterly: restore PITR backup to a scratch instance and verify row counts.
```

For questionnaire framing and the “not a certification” disclaimer, follow `compliance-asvs-tsc-technical` and `references/asvs-tsc-technical-map.md`.

Reference: [AICPA SOC 2](https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2/), [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)

### 12.2 Ship Kill Switches and Expand-Contract Migrations

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

---

## 13. Compliance Mapping

**Impact: LOW-MEDIUM**

Map technical controls to OWASP ASVS 5.0 and SOC 2 Trust Services Criteria. This is not legal advice or a certification determination.

### 13.1 Map Controls to ASVS and TSC Without Legal Claims

**Impact: LOW-MEDIUM (honest enterprise answers)**

Teams confuse marketing language with attestation. Target OWASP ASVS 5.0 levels for application baselines and map implemented controls to AICPA Trust Services Criteria points of focus. State clearly that this is technical control mapping, not a legal determination of SOC 2 certification, GDPR adequacy, or HIPAA compliance.

**Incorrect (self-declared compliant):**

```markdown
We are SOC 2, GDPR, and HIPAA compliant because we use Postgres and TLS.
```

**Correct (control map with evidence links):**

```markdown
## Technical control map (not a certification)

| Control | Evidence | TSC theme | ASVS 5.0 focus |
|---|---|---|---|
| Tenant RLS + isolation tests | CI job + policy SQL | Security / Confidentiality | Access control |
| Immutable audit log | Store config + sample events | Security | Logging |
| Backup restore drill | Dated run notes | Availability | Continuity |
| Incident runbook | ops/incident-response.md | Security | Incident response |

Legal/compliance attestation status: *not attested* until a CPA issues a report.
```

When questionnaires ask for legal status, defer to counsel and share factual evidence of technical controls. Read `references/asvs-tsc-technical-map.md` for a copy-ready evidence table.

Reference: [OWASP ASVS 5.0](https://asvs.owasp.org/), [AICPA 2017 TSC (2022 PoF)](https://www.aicpa-cima.com/resources/download/2017-trust-services-criteria-with-revised-points-of-focus-2022)

---

## References

1. [https://owasp.org/projects/top-ten](https://owasp.org/projects/top-ten)
2. [https://asvs.owasp.org/](https://asvs.owasp.org/)
3. [https://owasp.org/projects/api-security-project](https://owasp.org/projects/api-security-project)
4. [https://cheatsheetseries.owasp.org/](https://cheatsheetseries.owasp.org/)
5. [https://genai.owasp.org/llm-top-10/](https://genai.owasp.org/llm-top-10/)
6. [https://csrc.nist.gov/pubs/sp/800/218/final](https://csrc.nist.gov/pubs/sp/800/218/final)
7. [https://pages.nist.gov/800-63-4/sp800-63b.html](https://pages.nist.gov/800-63-4/sp800-63b.html)
8. [https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats)
9. [https://www.rfc-editor.org/rfc/rfc8725.html](https://www.rfc-editor.org/rfc/rfc8725.html)
10. [https://www.postgresql.org/docs/current/ddl-rowsecurity.html](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
11. [https://slsa.dev/spec/](https://slsa.dev/spec/)
12. [https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2/](https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2/)
