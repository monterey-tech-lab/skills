# ASVS and SOC 2 Technical Control Map

Read when preparing enterprise security questionnaire answers or an internal readiness checklist.

This is **technical control mapping only**. It is not a legal determination that the product is SOC 2 certified, GDPR-adequate, or HIPAA-compliant.

## How to use

1. Pick an ASVS 5.0 level target for the product (often Level 1–2 for early SaaS; raise for sensitive data).
2. For each row below, link to evidence (CI job, config, runbook, dated restore drill).
3. Mark attestation status separately: *not attested* until a CPA issues a report.

| Technical control (this skill) | Evidence examples | TSC theme (2017 / 2022 PoF) | ASVS 5.0 focus |
|---|---|---|---|
| Object authz + tenant RLS + isolation tests | Policy SQL, CI test | Security / Confidentiality | Access control |
| Argon2id, MFA, revocable sessions, SSO path | Auth config, terminate runbook | Security | Authentication |
| Secrets manager + gitleaks/CI scan | Scanner logs, rotation notes | Security | Configuration / secrets |
| TLS, at-rest encryption, PII log redaction | Ingress/TLS config, logger scrub | Confidentiality / Privacy | Data protection |
| Rate limits, idempotency, webhook verify | Gateway rules, handler code | Availability / Security | API abuse |
| SCA / Dependabot, lockfiles | PR history, CI gate | Security | Supply chain |
| Env separation, private DB | Account layout, SG/VPC | Security | Infrastructure |
| Append-only audit, backup restore drill, IR runbook | Log store, drill notes, `ops/incident-response.md` | Security / Availability | Logging / continuity |

Primary sources: [OWASP ASVS 5.0](https://asvs.owasp.org/), [AICPA SOC 2 / TSC](https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2/).
