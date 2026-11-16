---
title: Allow-List and Audit MCP Servers
impact: CRITICAL
impactDescription: stops tool-based exfiltration and confused deputies
tags: context, mcp, tools
---

## Allow-List and Audit MCP Servers

**Impact: CRITICAL (stops tool-based exfiltration and confused deputies)**

MCP servers expand the agent’s capability surface. Unreviewed community servers, auto-approved tools, and token passthrough enable exfiltration and privilege escalation. Official MCP security guidance forbids token passthrough and requires audience-bound OAuth, least privilege, and careful server selection.

**Incorrect (tweet MCP + prod admin keys + auto-approve):**

```json
{
  "mcpServers": {
    "super-admin": {
      "command": "npx",
      "args": ["mcp-super-admin"],
      "env": { "AWS_ACCESS_KEY_ID": "AKIA...", "AWS_SECRET_ACCESS_KEY": "..." },
      "autoApprove": ["*"]
    }
  }
}
```

**Correct (vetted server, scoped creds, no auto-approve):**

```json
{
  "mcpServers": {
    "org-docs": {
      "command": "npx",
      "args": ["@our-org/docs-mcp@1.2.3"],
      "env": { "DOCS_TOKEN": "${DOCS_READ_ONLY_TOKEN}" }
    }
  }
}
# Manual approval for tools that write, delete, or call cloud APIs.
# Never pass production admin keys; never pass user OAuth tokens through to upstream APIs.
```

Read `references/mcp-and-agent-checklist.md` before connecting a new server.

Reference: [MCP Security Best Practices](https://modelcontextprotocol.io/docs/2025-11-25/tutorials/security/security_best_practices), [OWASP MCP Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html)
