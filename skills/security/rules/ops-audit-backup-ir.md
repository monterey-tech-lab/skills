---
title: Audit High-Risk Events, Test Backups, Keep an IR Runbook
impact: MEDIUM
impactDescription: enterprise readiness without compliance theater
tags: ops, audit, backup, incident-response, soc2
---

## Audit High-Risk Events, Test Backups, Keep an IR Runbook

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
