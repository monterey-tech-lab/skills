---
title: Threat-Model New Trust Boundaries with STRIDE
impact: CRITICAL
impactDescription: catches insecure design before it ships
tags: design, threat-modeling, stride, asvs
---

## Threat-Model New Trust Boundaries with STRIDE

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
