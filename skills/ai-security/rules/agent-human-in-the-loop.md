---
title: Require Human Approval for High-Impact Actions
impact: CRITICAL
impactDescription: prevents irreversible agent mistakes
tags: agent, hitl, auto-run
---

## Require Human Approval for High-Impact Actions

**Impact: CRITICAL (prevents irreversible agent mistakes)**

Auto-run for all terminal commands and MCP tools removes the last check before destructive or credentialed actions (OWASP Excessive Agency / ASI Tool Misuse). Keep human-in-the-loop for production changes, secret access, dependency adds, and anything irreversible.

**Incorrect (approve everything by default):**

```text
Agent settings: auto-run = all commands; auto-approve = all MCP tools; skip PR review.
```

**Correct (HITL for high impact):**

```text
Auto-run only for clearly sandboxed, read-only local commands if needed.
Require explicit approval for: shell that mutates, cloud APIs, git push, dependency installs, secret reads, production deploys.
Human-review agent PRs—especially CI, lockfiles, auth, and infrastructure.
```

Escape hatch: fully ephemeral throwaway containers with no secrets may use broader auto-run for experiments.

Reference: [OWASP AI Agent Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html), [Secure Coding with AI](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Coding_with_AI_Cheat_Sheet.html)
