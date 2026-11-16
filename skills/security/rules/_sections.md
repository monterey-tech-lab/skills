# Sections

This file defines all sections, their ordering, impact levels, and descriptions.
The section ID (in parentheses) is the filename prefix used to group rules.

---

## 1. Design and Threat Modeling (design)

**Impact:** CRITICAL
**Description:** Shift-left security: STRIDE threat models, least privilege, and a minimal attack surface before features harden into liabilities.

## 2. Authorization (authz)

**Impact:** CRITICAL
**Description:** Broken access control (OWASP A01 / API1 BOLA) is the most common SaaS failure. Every object access must be authorized; roles deny by default.

## 3. Multi-Tenant Isolation (tenant)

**Impact:** CRITICAL
**Description:** One customer must never read or mutate another customer's data. Enforce tenant context from trusted auth, database policies, and automated isolation tests.

## 4. Authentication and Sessions (authn)

**Impact:** CRITICAL
**Description:** Verify identity with strong password hashing, MFA for privileged roles, secure sessions or short-lived tokens with revocation, and SSO readiness for enterprise.

## 5. Secure Coding (coding)

**Impact:** HIGH
**Description:** Treat all input as untrusted. Prevent injection with parameterized queries and contextual output encoding; never leak internals in client errors.

## 6. Secrets Management (secrets)

**Impact:** HIGH
**Description:** Secrets never live in git or images. Use a secret manager, rotate compromised material, and block leaks with CI secret scanning.

## 7. Data Protection and Privacy (data)

**Impact:** HIGH
**Description:** Encrypt in transit and at rest, minimize PII, and redact secrets and sensitive fields from logs and client responses.

## 8. APIs and Abuse Resistance (api)

**Impact:** MEDIUM-HIGH
**Description:** Rate-limit, require idempotency for side effects, verify webhooks, and lock CORS to trusted product origins—not marketing sites on privileged APIs.

## 9. AI Feature Guardrails (ai)

**Impact:** MEDIUM-HIGH
**Description:** Isolate system prompts from user input, constrain tool agency, redact PII from prompts/logs, and use short-lived signed URLs for uploads.

## 10. Supply Chain (supply)

**Impact:** MEDIUM
**Description:** Pin dependencies, scan for CVEs continuously, and treat build integrity as part of product security (SSDF / SLSA-minded defaults).

## 11. Infrastructure and Environments (iac)

**Impact:** MEDIUM
**Description:** Separate environments, keep data planes private, and scan IaC for misconfigurations before they reach production.

## 12. Operations and Incident Readiness (ops)

**Impact:** MEDIUM
**Description:** Immutable audit logs, tested backups, kill switches, safe migrations, and a one-page incident runbook keep growth from becoming an outage or breach.

## 13. Compliance Mapping (compliance)

**Impact:** LOW-MEDIUM
**Description:** Map technical controls to OWASP ASVS 5.0 and SOC 2 Trust Services Criteria. This is not legal advice or a certification determination.
