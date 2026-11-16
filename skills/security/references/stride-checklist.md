# STRIDE Checklist for SaaS Changes

Read when designing or reviewing a feature that crosses a trust boundary (admin tools, webhooks, exports, impersonation, LLM tools, new public APIs).

## Steps

1. Draw the data flow: actors → entry points → processes → data stores → external services.
2. For each hop, ask STRIDE and name at least one control:

| Threat | Property | Ask | Typical SaaS control |
|---|---|---|---|
| Spoofing | Authentication | Who could pretend to be this actor? | MFA, SSO, signed webhooks, mTLS |
| Tampering | Integrity | What could alter this data in transit or at rest? | TLS, signed URLs, checksums, immutability |
| Repudiation | Non-repudiation | Could the actor deny this action? | Append-only audit log |
| Information disclosure | Confidentiality | What leaks to another tenant or logs? | RLS, redaction, least privilege |
| Denial of service | Availability | How could this be exhausted? | Rate limits, quotas, timeouts |
| Elevation of privilege | Authorization | How could a member become admin or cross tenants? | RBAC deny-default, object authz, break-glass |

3. Completion criterion: every relevant STRIDE row has a named control in the design or PR notes.

Primary source: [Microsoft Learn — STRIDE](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats).
