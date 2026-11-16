# MCP and Agent Checklist

Read when connecting MCP servers or enabling autonomous agent runs.

## Before connecting an MCP server

- [ ] Source is first-party or org-vetted (not a random tweet install)
- [ ] Tool list and schemas reviewed; pin package version
- [ ] Credentials are least-privilege and ephemeral (no prod admin keys)
- [ ] No OAuth token passthrough to upstream APIs
- [ ] Destructive tools require human approval (not auto-approve *)
- [ ] Network egress understood (what hosts can it call?)

Primary: [MCP Security Best Practices](https://modelcontextprotocol.io/docs/2025-11-25/tutorials/security/security_best_practices), [OWASP MCP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html)

## Before enabling auto-run / autonomous loops

- [ ] Sandbox or dedicated machine without production secrets
- [ ] Max steps and spend/cost caps configured
- [ ] HITL for shell writes, cloud writes, git push, dependency installs
- [ ] Append-only (redacted) audit of tool calls
- [ ] Kill switch documented: revoke agent keys, disable tools/flags
- [ ] Agent PRs still get human review of CI, lockfiles, auth, and infra diffs

Primary: [AI Agent Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html)
