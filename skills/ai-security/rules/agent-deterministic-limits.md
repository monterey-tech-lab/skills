---
title: Enforce Spend Caps, Loops, and Hooks Outside the Prompt
impact: HIGH
impactDescription: stops runaway cost and policy bypass
tags: agent, spend, hooks, kill-switch
---

## Enforce Spend Caps, Loops, and Hooks Outside the Prompt

**Impact: HIGH (stops runaway cost and policy bypass)**

System-prompt lines like “never rm -rf” are not enforceable. Prompt injection and confused agents bypass them. Put hard limits in the harness: max steps, max spend, pre-commit/hooks, and a kill switch that revokes keys and disables tools.

**Incorrect (prompt-only policy):**

```text
System: never exfiltrate secrets or run rm -rf.
# No sandbox, no spend cap, no audit log, no kill switch.
```

**Correct (harness limits + kill switch):**

```yaml
agent:
  max_steps: 40
  max_usd: 25
  require_approval: [shell.write, cloud.write, git.push]
  audit_log: append_only
kill_switch:
  revoke: [AGENT_API_KEY, CLOUD_ROLE]
  disable_tools: true
```

Prompt policy can remain as soft guidance; it must not be the only control.

Reference: [OWASP LLM Unbounded Consumption](https://genai.owasp.org/llm-top-10/), [AI Agent Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html)
