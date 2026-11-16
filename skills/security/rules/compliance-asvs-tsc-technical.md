---
title: Map Controls to ASVS and TSC Without Legal Claims
impact: LOW-MEDIUM
impactDescription: honest enterprise answers
tags: compliance, asvs, soc2, governance
---

## Map Controls to ASVS and TSC Without Legal Claims

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
