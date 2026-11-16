---
title: Sandbox Agents and Scope Their Credentials
impact: CRITICAL
impactDescription: limits blast radius of a compromised or confused agent
tags: agent, sandbox, least-privilege
---

## Sandbox Agents and Scope Their Credentials

**Impact: CRITICAL (limits blast radius of a compromised or confused agent)**

Agents running on the host with personal admin cloud keys can destroy production. Prefer Docker/devcontainers/micro-VMs, ephemeral least-privilege tokens, and no production admin credentials in the agent environment.

**Incorrect (host agent with prod admin keys):**

```bash
export AWS_ACCESS_KEY_ID=AKIA_ADMIN...
export AWS_SECRET_ACCESS_KEY=...
claude --dangerously-skip-permissions
```

**Correct (container + temporary scoped role):**

```bash
docker run --rm -it -v "$PWD:/work" -w /work \
  -e AWS_ROLE_ARN=arn:aws:iam::123:role/AgentReadOnlyStaging \
  agent-image:locked
# Short-lived STS credentials; no production admin; no host Docker socket unless required.
```

Pair with network egress allow-lists where the platform supports them (e.g. Copilot cloud agent firewall).

Reference: [OWASP AI Agent Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html), [Copilot risks and mitigations](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/risks-and-mitigations)
