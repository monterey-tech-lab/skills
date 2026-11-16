# Research: security

Date: 2026-11-15 · Purpose: Secure-by-default architecture and implementation guardrails for agents shipping multi-tenant B2B/SaaS (MVP → SOC 2 technical readiness) · Recommendation: **build**

## 1. Question / proposed scope

**Proposed skill name:** `security`

**Question:** Should monterey-tech-lab/skills publish a new **rule-based** Agent Skill that teaches agents building or reviewing scalable SaaS / startup products to apply secure-by-default architecture and implementation guardrails—Confidentiality, Integrity, Availability, Authentication, and Non-Repudiation—across design, code, auth, data, multi-tenancy, APIs, supply chain, testing, and deployment?

**Audience:** Engineers and agents shipping multi-tenant B2B/SaaS (MVP through enterprise / SOC 2 *technical* readiness).

**Stack default:** Language-agnostic principles; primary incorrect/correct examples in TypeScript/Node, PostgreSQL, and cloud (AWS/GCP patterns). Complements existing `swift` (does not duplicate Keychain / notarization / Apple-platform security).

**In scope (agreed branches):**
1. Design / threat modeling (STRIDE, least privilege, attack-surface cut)
2. Secure coding (validation, SQLi/XSS, secrets, safe errors)
3. Auth & sessions (MFA, hashing, cookies, short JWTs, SSO readiness)
4. Data protection & crypto (TLS, at-rest, key management, PII/logs)
5. Multi-tenant SaaS (tenant isolation, IDOR, RBAC/ABAC)
6. APIs & abuse (rate limits, idempotency, webhooks, CORS)
7. Supply chain, testing, IaC, ops readiness (SCA/SAST/DAST, backups, IR runbook)

**Content pillars:** Five CIA+ properties (Confidentiality, Integrity, Availability, Authentication, Non-Repudiation); phase checklists (threat modeling, least privilege, OWASP secure coding, auth/sessions, crypto, SCA, SAST/DAST, IaC, ASVS / SOC 2 technical baselines); ~26 startup SaaS guardrails (RLS, IDOR, RBAC/SSO, rate limit, idempotency, webhooks, CORS, VPC/secrets/env separation, PII in logs, prompt injection, signed URLs, secret scanning, Dependabot, audit logs, kill switches, expand-contract migrations, IR runbook).

**Out of scope:** Writing exploits / offensive payloads; novel crypto design; legal advice on GDPR/HIPAA/PCI (technical control mapping only); deep Apple-platform security (owned by `swift`); pure network/SOC tooling unrelated to the product codebase; copying third-party skill bodies verbatim.

**Skill type planned:** rule-based (catalogue of independent guardrails with Incorrect/Correct examples), matching `swift` authoring patterns.

**Repo overlap today:** Published product skills are `swift` (Swift/SwiftUI/macOS) and `craft-and-taste` (UI/UX craft). Neither is an AppSec / SaaS security skill.

---

## 2. Prior art

| Skill | Repo / listing | Installs (skills.sh, accessed 2026-11-15) | Covers | Misses (vs proposed `security`) | License |
|---|---|---|---|---|---|
| OWASP Secure Agent Playbook (19 skills: `code-review-security`, `api-security-review`, `web-security-review`, `sca-audit`, `iac-security-review`, `secrets-scan`, AI/agent audits, etc.) | [owasp/secure-agent-playbook](https://github.com/OWASP/secure-agent-playbook) · [skills.sh](https://www.skills.sh/owasp/secure-agent-playbook) | ~5.7K total across skills; top skills ~852 / 667 / 505 installs | Procedure-oriented **security review plays** grounded in OWASP Top 10, API Top 10, ASVS data, SCA/IaC/secrets; strong agent *audit* workflows | Not a build-default catalogue for **startup multi-tenant SaaS product agents**; thin on Postgres RLS / tenant isolation as ship defaults; review-first rather than incorrect/correct implementation rules in monterey style | **CC-BY-4.0** ([LICENSE](https://owasp.github.io/secure-agent-playbook/LICENSE.md)); ASVS/Top 10 etc. often **CC BY-SA 4.0** (see THIRD_PARTY_NOTICES) — attribute if adapting; prefer primary sources |
| `owasp-security` | [agamm/claude-code-owasp](https://github.com/agamm/claude-code-owasp) · [skills.sh](https://www.skills.sh/agamm/claude-code-owasp/owasp-security) | ~2.7K | Review workflow + large reference set (Top 10:2025, ASVS 5.0, LLM/Agentic, multi-language pitfalls, config/supply chain) | Generic Top 10 review kit; not SaaS multi-tenant / SOC 2 technical velocity guardrails; not monterey rule-based product skill | **MIT** |
| `sota-code-security` (+ related `sota-threat-modeling`, `sota-identity-access`, `sota-secrets-management`, `sota-security-compliance`) | [martinholovsky/sota-skills](https://github.com/martinholovsky/sota-skills) · [skills.sh](https://www.skills.sh/martinholovsky/sota-skills/sota-code-security) | Repo ~251 total; `sota-code-security` ~10 | BUILD + AUDIT modes; OWASP Top 10 2025 / API 2023 / LLM+Agentic; CWE-mapped rules | Broad SOTA kit, not focused on multi-tenant B2B SaaS ship defaults; CC-BY adaptation needs attribution; not in this repo’s quality/eval harness | **CC-BY-4.0** |
| `owasp-security-check` | [sergiodxa/agent-skills](https://github.com/sergiodxa/agent-skills) · [skills.sh](https://www.skills.sh/sergiodxa/agent-skills/owasp-security-check) | Listing does not show large install count; GitHub ~92 stars | ~20 rules / 5 categories; TS incorrect/correct for access control, auth, etc. | Narrower than full SaaS lifecycle; no RLS/tenant/SSO/IR/SOC 2 mapping depth | **MIT** |
| `code-security` | [semgrep/agent-skills](https://github.com/semgrep/agent-skills) · [skills.sh](https://www.skills.sh/semgrep/agent-skills/code-security) | Not prominently ranked on skills.sh home for this query | Multi-language secure coding rules (crypto, JWT, CSRF, SSRF, …) with incorrect/correct examples | Coupled to Semgrep ecosystem; license restricts naive reuse; not SaaS multi-tenant product architecture | **Semgrep Rules License v1.0** — do **not** copy rule text; treat as structural prior art only |
| `security` (hub + sub-skills) | [tyler-r-kendrick/agent-skills](https://github.com/tyler-r-kendrick/agent-skills) | Not a top skills.sh hit for this query | Encyclopedia hub: OWASP, threat modeling, auth, crypto, API, supply chain, AI security, SDLC | Too broad / navigation-oriented; includes pentest/red-team branches we explicitly out-of-scope; not startup SaaS defaults with Postgres examples | **MIT** |
| `security-secure-coding` (+ auth/authz/threat-modeling siblings) | [KentoShimizu/sw-agent-skills](https://github.com/kentoshimizu/sw-agent-skills) · [skills.sh](https://www.skills.sh/kentoshimizu/sw-agent-skills/security-secure-coding) | Low single-digit installs on listing | Secure-coding workflow + checklist assets; sibling skills for auth/authz/secrets/threat modeling | Fragmented workflows; little multi-tenant SaaS / RLS / SOC 2 technical mapping | **Apache-2.0** |
| Other GitHub SKILL.md hits (`harness-auth`, polymath `discover-security`, etc.) | Various | Niche | Specialized auth audits or skill routers | Not a published monterey product skill; uneven quality | Check per-repo before any adaptation |

**Hard boundary:** Summarize only. Do **not** paste skill bodies into monterey content. Prefer official OWASP/NIST/IETF/PostgreSQL/SLSA/AICPA sources. MIT/Apache-2.0/CC-BY may inform *structure* with attribution; Semgrep Rules License content must not be copied. OWASP ASVS/Top 10 materials are typically CC BY-SA 4.0—cite and do not republish substantial verbatim requirement text.

---

## 3. Current facts (with sources)

Accessed **2026-11-15** unless noted.

### Standards & baselines
- **OWASP ASVS stable version is 5.0.0** (released 30 May 2025 at Global AppSec EU). Prefer versioned requirement IDs such as `v5.0.0-…`. ([asvs.owasp.org](https://asvs.owasp.org/), [asvs.owasp.org/news](https://asvs.owasp.org/news/), [OWASP/ASVS](https://github.com/OWASP/ASVS))
- **OWASP Top 10:2025** is the current Top 10. Categories include A01 Broken Access Control, A02 Security Misconfiguration, A03 Software Supply Chain Failures, A04 Cryptographic Failures, A05 Injection, A06 Insecure Design, A07 Authentication Failures, A08 Software or Data Integrity Failures, A09 Security Logging & Alerting Failures, A10 Mishandling of Exceptional Conditions. SSRF rolled into A01; supply chain expanded from “vulnerable components.” ([owasp.org/projects/top-ten](https://owasp.org/projects/top-ten), [OWASP/Top10 2025 intro](https://github.com/OWASP/Top10/blob/master/2025/docs/en/0x00_2025-Introduction.md))
- **OWASP API Security Top 10 2023** remains the API-specific Top 10 (BOLA/IDOR as API1, broken auth, resource consumption, SSRF, etc.). ([owasp.org/projects/api-security-project](https://owasp.org/projects/api-security-project))
- **OWASP Cheat Sheet Series** is the practical implementation companion (AuthN, Password Storage, Session Management, JWT, REST, TLS, Secrets, etc.); project license **CC BY-SA 4.0**. ([Cheat Sheet Series project](https://owasp.org/www-project-cheat-sheets/), [cheatsheetseries.owasp.org](https://cheatsheetseries.owasp.org/))
- **NIST SSDF final is SP 800-218 Version 1.1** (Feb 2022). **SP 800-218 Rev. 1 / SSDF 1.2** exists as an **initial public draft** (17 Dec 2025)—cite as draft until finalized. ([SP 800-218](https://csrc.nist.gov/pubs/sp/800/218/final), [SSDF publications](https://csrc.nist.gov/projects/ssdf/publications), [SP 800-218r1 IPD](https://csrc.nist.gov/pubs/sp/800/218/r1/ipd))
- **NIST SP 800-63B-4** (Digital Identity Guidelines — Authentication) is the current password/authenticator baseline cited by OWASP AuthN/Password Storage sheets: min length 15 for single-factor passwords (8 when used only as part of MFA); no composition rules; no periodic rotation; blocklist checks; max length ≥ 64. ([nvlpubs NIST.SP.800-63B-4](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-63B-4.pdf), [pages.nist.gov/800-63-4](https://pages.nist.gov/800-63-4/sp800-63b.html))
- **SLSA specification current approved version is 1.2** (Build track L0–L3 + Source track). Older v1.0/v1.1 pages are marked retired. ([slsa.dev/spec](https://slsa.dev/spec/), [Build levels overview](https://slsa.dev/spec/v1.1/levels) historical; use v1.2 index)
- **SOC 2** examinations use AICPA **2017 Trust Services Criteria** (Security, Availability, Processing Integrity, Confidentiality, Privacy) **with Revised Points of Focus — 2022**. Skill should map *technical* controls only, not give legal/compliance advice. ([AICPA TSC download](https://www.aicpa-cima.com/resources/download/2017-trust-services-criteria-with-revised-points-of-focus-2022), [SOC 2 topic](https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2/))

### Threat modeling & pillars
- **STRIDE** maps Spoofing→Authentication, Tampering→Integrity, Repudiation→Non-repudiation, Information Disclosure→Confidentiality, Denial of Service→Availability, Elevation of Privilege→Authorization. Microsoft SDL still documents STRIDE for threat modeling. ([Microsoft Learn — Threat Modeling Tool threats](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats), [SDL Secure by Design / STRIDE](https://www.microsoft.com/en-us/securityengineering/sdl/practices/secure-by-design), [MSDN STRIDE article (archive)](https://learn.microsoft.com/en-us/archive/msdn-magazine/2006/november/uncover-security-design-flaws-using-the-stride-approach))
- The five proposed skill pillars (Confidentiality, Integrity, Availability, Authentication, Non-Repudiation) align with STRIDE’s property mapping; **Authorization / least privilege** should still appear as an explicit rule section even if not named as a sixth pillar (Elevation of Privilege / Broken Access Control).

### Auth, sessions, JWT
- Prefer modern password hashing: **Argon2id** first (e.g. m=19 MiB, t=2, p=1 among OWASP minima); scrypt/bcrypt/PBKDF2 as documented fallbacks; never fast hashes alone for passwords. ([Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html))
- AuthN defaults: MFA where practical; generic error messages; throttling/lockout careful of DoS; re-auth for sensitive actions; OIDC for SSO; avoid security questions. ([Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html))
- **JWT BCP: RFC 8725 / BCP 225** — algorithm allowlists; do not trust header `alg` alone; validate cryptographic ops; sufficient key entropy; reject misuse of `none` unless explicitly intended and otherwise protected. ([RFC 8725](https://www.rfc-editor.org/rfc/rfc8725.html))
- OWASP JWT Cheat Sheet: prefer server sessions when revocation is required; validate `exp`/`nbf`/`iss`/`aud`; don’t put secrets in claims; denylist/`jti` if using JWTs as sessions. ([JSON Web Token Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html), [REST Security Cheat Sheet — JWT](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html))

### Multi-tenant data (PostgreSQL)
- **Row Level Security:** `ALTER TABLE … ENABLE ROW LEVEL SECURITY` + `CREATE POLICY`; default-deny when enabled with no policy; owners/superusers/`BYPASSRLS` bypass unless `FORCE ROW LEVEL SECURITY`; use `USING` + `WITH CHECK`; beware covert channels via RI constraints. ([PostgreSQL 18 docs — Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html), [CREATE POLICY](https://www.postgresql.org/docs/current/sql-createpolicy.html))

### APIs & AI-adjacent product risks
- API1:2023 Broken Object Level Authorization is the classic **IDOR** class agents routinely miss on `/resource/:id` handlers. ([API Security Top 10](https://owasp.org/projects/api-security-project))
- **OWASP Top 10 for LLM Applications 2025** (CC BY-SA 4.0) — Prompt Injection (LLM01), Sensitive Information Disclosure (LLM02), Improper Output Handling, Unbounded Consumption, etc.—grounds PII-in-prompts / prompt-injection guardrails for SaaS AI features. ([genai.owasp.org LLM Top 10](https://genai.owasp.org/llm-top-10/), [OWASP project page](https://owasp.org/projects/top-10-for-large-language-model-applications))

---

## 4. Common agent mistakes this skill must prevent

1. **Missing object-/tenant-level authorization (IDOR / BOLA)** — treat “user is logged in” as enough; fetch by client-supplied ID without tenant check. Evidence: OWASP Top 10 A01; API1:2023; observed baseline agent behavior on CRUD APIs.
2. **Relying on app-layer filters alone for multi-tenancy** — omit Postgres RLS / `FORCE ROW LEVEL SECURITY` for shared tables; service roles bypass policies silently. Evidence: [PostgreSQL RLS docs](https://www.postgresql.org/docs/current/ddl-rowsecurity.html).
3. **Unsafe JWT defaults** — `alg: none`, trusting header algorithm, long-lived access tokens in `localStorage`, no `aud`/`iss`/`exp` validation, JWT-as-session without revocation. Evidence: [RFC 8725](https://www.rfc-editor.org/rfc/rfc8725.html), [OWASP JWT Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html).
4. **Weak or outdated password storage** — SHA-*/MD5, unsalted hashes, bcrypt without understanding 72-byte limit, composition-rule policies that fight NIST 800-63B-4. Evidence: [Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), [SP 800-63B-4](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-63B-4.pdf).
5. **Secrets and PII leakage** — API keys in git/env committed to images; PII or tokens in logs/errors/traces; verbose exception payloads to clients. Evidence: Top 10 A02/A04/A09; Cheat Sheet Series Error Handling / Logging guidance.
6. **Skipping threat modeling / insecure design** — ship features without trust boundaries, least privilege, or abuse cases (webhooks, admin impersonation, export endpoints). Evidence: Top 10 A06; Microsoft STRIDE/SDL.
7. **Supply chain & integrity gaps** — no lockfile SCA, unsigned artifacts, mutable tags in CI, no SBOM/provenance path toward SLSA L1+. Evidence: Top 10 A03/A08; [SLSA v1.2](https://slsa.dev/spec/).
8. **API abuse blindness** — no rate limits, missing idempotency keys on payments/side effects, webhook receivers without signature verify + replay protection, permissive CORS `*`. Evidence: API4/API2/API8; OWASP REST/Webhook patterns.
9. **LLM feature shortcuts** — concatenate untrusted user content into system prompts; log full prompts with PII; grant tools excessive agency. Evidence: [OWASP LLM Top 10 2025](https://genai.owasp.org/llm-top-10/).
10. **Compliance theater without technical controls** — claiming “SOC 2 ready” without audit logs, access reviews, change management, backups/restore tests, or incident runbooks. Evidence: [AICPA TSC](https://www.aicpa-cima.com/resources/download/2017-trust-services-criteria-with-revised-points-of-focus-2022) (map controls; no legal advice).

---

## 5. Gaps this skill would fill

### vs external prior art
| Gap | Why monterey `security` should own it |
|---|---|
| **Build-default SaaS product skill** (not only review plays) | OWASP playbook / agamm excel at *audit procedures*; agents shipping MVPs need incorrect/correct **implementation** defaults |
| **Multi-tenant B2B focus** (tenant ID in session, RLS, IDOR, RBAC/ABAC, SSO readiness) | Sparse or generic in most skills.sh entries |
| **Startup velocity + enterprise readiness** | Secret scanning, Dependabot/SCA, expand-contract migrations, kill switches, IR runbook, audit logs framed for SOC 2 *technical* TSC mapping |
| **Primary stack examples** | TypeScript/Node + PostgreSQL + AWS/GCP patterns; not 20-language encyclopedias |
| **Repo quality bar** | Evals, triggers, research file, `npm run check` — third-party skills are not in this harness |
| **Five pillars + Authorization as first-class** | Explicit CIA + Authentication + Non-Repudiation framing agents can recite; prior art usually Top-10-ordered only |

### vs this repository
| Existing skill | Overlap | Boundary |
|---|---|---|
| `swift` | Secrets-in-Keychain, webhook signature verify, auth token refresh, xcconfig no secrets, notarization | Keep Apple-platform / SwiftUI rules in `swift`. `security` may *point* to client→API auth themes but must not duplicate Keychain/notarization/macOS distribution |
| `craft-and-taste` | None material | UI craft only; no AppSec |

**Do not extend `swift` or `craft-and-taste`** for this topic: wrong trigger surface and audience.

---

## 6. Recommendation

**build** a new rule-based skill `skills/security`.

Justification: (1) This repo has no AppSec/SaaS security skill; extending `swift`/`craft-and-taste` would pollute triggers. (2) External prior art is strong on *review workflows* and generic Top 10, but does not deliver monterey’s productized, eval-gated, multi-tenant SaaS build defaults with TypeScript/Postgres examples and SOC 2 *technical* mapping. (3) Skip is wrong: agents default to insecure CRUD/auth patterns without a focused skill. Cite primary sources; treat third-party skills as gap analysis only (CC-BY/MIT/Apache may inspire structure with attribution; Semgrep Rules License and CC BY-SA requirement dumps must not be pasted).

---

## 7. Proposed scope & suggested rule section map

**Candidate skill type:** rule-based (why: independent guardrails with Incorrect/Correct code, impact tags, and section prefixes—same as `swift`; progressive disclosure via `references/` for STRIDE checklist, ASVS Level mapping, SOC 2 TSC technical map).

### Suggested `rules/_sections.md` map

| Priority | Section ID / prefix | Impact | Maps to pillars / branches |
|---|---|---|---|
| 1 | `design-` | CRITICAL | Threat modeling (STRIDE), least privilege, attack-surface cut, insecure design (A06) |
| 2 | `authz-` | CRITICAL | Broken access control, IDOR/BOLA, RBAC/ABAC, deny-by-default |
| 3 | `tenant-` | CRITICAL | Multi-tenant isolation, Postgres RLS, cross-tenant tests |
| 4 | `authn-` | CRITICAL | Passwords (Argon2id), MFA, sessions/cookies, short JWTs, SSO/OIDC readiness |
| 5 | `coding-` | HIGH | Input validation, injection (SQLi/XSS/command), safe errors, SSRF |
| 6 | `secrets-` | HIGH | No secrets in repo/images; vault/SM; rotation; CI secret scanning |
| 7 | `data-` | HIGH | TLS in transit, encryption at rest, KMS, PII minimization, logging hygiene |
| 8 | `crypto-` | HIGH | Approved algorithms only; no novel crypto; key management |
| 9 | `api-` | MEDIUM-HIGH | Rate limits, idempotency keys, webhook verify+idempotency, CORS allowlists |
| 10 | `ai-` | MEDIUM-HIGH | Prompt injection, PII in prompts/logs, tool least privilege, signed URLs for downloads |
| 11 | `supply-` | MEDIUM | SCA/Dependabot, lockfiles, SLSA-minded provenance, SBOM |
| 12 | `test-` | MEDIUM | SAST/DAST in CI, authz regression tests, tenant isolation tests |
| 13 | `iac-` | MEDIUM | Env separation, VPC/private data planes, least-privilege IAM, IaC scanning |
| 14 | `ops-` | MEDIUM | Audit logs, backups/restore drills, kill switches, expand-contract migrations, IR runbook |
| 15 | `compliance-` | LOW-MEDIUM | ASVS level targeting, SOC 2 TSC *technical* control map (non-legal) |

### Seed rule themes (~26 startup guardrails → first rules)
- Tenant: session carries `tenantId`; every query scoped; RLS + FORCE; cross-tenant integration test
- Authz: authorize every object access; no IDOR; admin vs member function-level checks
- Authn: Argon2id; MFA for privileged roles; HttpOnly Secure SameSite cookies; access JWT ≤15–60m + refresh rotation; OIDC ready
- API: rate limit per tenant/IP; Idempotency-Key on side effects; verify webhook signatures; CORS explicit origins
- Data/AI: no PII in logs; redacted errors; prompt injection boundaries; time-limited signed URLs
- Velocity: secret scanning; Dependabot/SCA gate; audit log for authz/admin; feature kill switch; expand-contract migrations; IR runbook template

**Out of scope (reaffirm):** exploit PoCs; custom crypto; legal opinions; Apple Keychain/notarization; SIEM product cookbooks.

---

## 8. Sources

### Prior art / catalogs
- [owasp/secure-agent-playbook](https://github.com/OWASP/secure-agent-playbook) · [skills.sh listing](https://www.skills.sh/owasp/secure-agent-playbook) · [CC-BY-4.0 LICENSE](https://owasp.github.io/secure-agent-playbook/LICENSE.md) — accessed 2026-11-15
- [agamm/claude-code-owasp `owasp-security`](https://www.skills.sh/agamm/claude-code-owasp/owasp-security) · MIT LICENSE — accessed 2026-11-15
- [martinholovsky/sota-skills `sota-code-security`](https://www.skills.sh/martinholovsky/sota-skills/sota-code-security) · CC-BY-4.0 — accessed 2026-11-15
- [sergiodxa/agent-skills `owasp-security-check`](https://www.skills.sh/sergiodxa/agent-skills/owasp-security-check) · MIT — accessed 2026-11-15
- [semgrep/agent-skills `code-security`](https://www.skills.sh/semgrep/agent-skills/code-security) · Semgrep Rules License v1.0 — accessed 2026-11-15
- [tyler-r-kendrick/agent-skills `security`](https://github.com/tyler-r-kendrick/agent-skills/blob/main/skills/security/SKILL.md) · MIT — accessed 2026-11-15
- [KentoShimizu/sw-agent-skills](https://github.com/kentoshimizu/sw-agent-skills) · Apache-2.0 — accessed 2026-11-15

### Primary / official
- [OWASP ASVS](https://asvs.owasp.org/) · [News (5.0.0)](https://asvs.owasp.org/news/) · [OWASP/ASVS](https://github.com/OWASP/ASVS) — accessed 2026-11-15
- [OWASP Top 10](https://owasp.org/projects/top-ten) · [Top10:2025 Introduction](https://github.com/OWASP/Top10/blob/master/2025/docs/en/0x00_2025-Introduction.md) — accessed 2026-11-15
- [OWASP API Security Top 10](https://owasp.org/projects/api-security-project) — accessed 2026-11-15
- [OWASP Cheat Sheet Series](https://owasp.org/www-project-cheat-sheets/) · [Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) · [Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) · [JWT](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html) · [REST Security](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html) — accessed 2026-11-15
- [OWASP Top 10 for LLM Applications](https://owasp.org/projects/top-10-for-large-language-model-applications) · [genai.owasp.org LLM Top 10](https://genai.owasp.org/llm-top-10/) — accessed 2026-11-15
- [NIST SP 800-218 SSDF v1.1](https://csrc.nist.gov/pubs/sp/800/218/final) · [SSDF publications](https://csrc.nist.gov/projects/ssdf/publications) · [SP 800-218r1 IPD](https://csrc.nist.gov/pubs/sp/800/218/r1/ipd) — accessed 2026-11-15
- [NIST SP 800-63B-4 PDF](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-63B-4.pdf) · [HTML](https://pages.nist.gov/800-63-4/sp800-63b.html) — accessed 2026-11-15
- [Microsoft STRIDE / Threat Modeling Tool](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats) · [SDL threat modeling](https://www.microsoft.com/en-us/securityengineering/sdl/threatmodeling) · [Secure by Design](https://www.microsoft.com/en-us/securityengineering/sdl/practices/secure-by-design) — accessed 2026-11-15
- [RFC 8725 JWT BCP](https://www.rfc-editor.org/rfc/rfc8725.html) — accessed 2026-11-15
- [PostgreSQL Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html) · [CREATE POLICY](https://www.postgresql.org/docs/current/sql-createpolicy.html) — accessed 2026-11-15
- [SLSA specification (v1.2)](https://slsa.dev/spec/) — accessed 2026-11-15
- [AICPA 2017 TSC (2022 PoF)](https://www.aicpa-cima.com/resources/download/2017-trust-services-criteria-with-revised-points-of-focus-2022) · [SOC 2 overview](https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2/) — accessed 2026-11-15

### Repo context
- Local `skills/swift`, `skills/craft-and-taste`, `docs/research/swift.md`, `docs/research/craft-and-taste.md` — reviewed 2026-11-15

---

## 9. Baseline failures (2026-11-15, no skill)

Recorded from `evals/security/runs/2026-11-15-baseline/` against discriminating expectations. These gaps are skill requirements.

| Eval | Baseline gaps / misses |
|---|---|
| 1 multi-tenant-invoice-api | Strong on JWT tenant claims + WHERE + RLS/FORCE. **Missed:** explicit warning that table owners / superusers / `BYPASSRLS` bypass RLS unless the app connects as a constrained role; **no automated cross-tenant isolation test** required or sketched. |
| 2 auth-sessions-jwt | Strong on Argon2id, server sessions, cookie flags, MFA, terminate/revoke. **Missed:** enterprise **SSO readiness (OIDC/SAML IdP)** so auth is not rewritten for enterprise sales. |
| 3 secrets-and-safe-errors | Strong on vault, opaque 500s, PII redaction, rotate committed secrets. **Missed:** **CI/dev secret scanning** (gitleaks/trufflehog or equivalent) as a required control. |
| 4 edge-webhook-payments | Strong on Stripe signature verify + idempotency. **Failed premise correction:** implemented credentialed CORS for the **marketing** origin on `/api/charges` instead of refusing marketing→privileged API access and limiting CORS to the trusted product app with auth. |
| 5 wrong-premise-soc2-banner | Strong rejection of badge + required logs/backups/IR. **Weaker on:** framing as **technical control mapping only / not a legal certification determination**; did not stress **immutable/append-oriented** audit log storage. |

**Skill must teach:** defense-in-depth tenant isolation + RLS role caveats + isolation tests; SSO-ready auth; secret scanning; refuse marketing CORS on privileged APIs; SOC 2 as technical TSC mapping with immutable audit trails—not badges.
