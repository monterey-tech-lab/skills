---
title: Deny-by-Default RBAC or ABAC
impact: CRITICAL
impactDescription: enterprise roles without isAdmin sprawl
tags: authz, rbac, abac
---

## Deny-by-Default RBAC or ABAC

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
