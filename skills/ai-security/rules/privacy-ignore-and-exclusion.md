---
title: Use Vendor Ignore Files and Know Their Limits
impact: CRITICAL
impactDescription: reduces accidental indexing of secrets
tags: privacy, cursorignore, copilot, indexing
---

## Use Vendor Ignore Files and Know Their Limits

**Impact: CRITICAL (reduces accidental indexing of secrets)**

There is no universal `.aiignore` that all tools honor. Cursor uses `.cursorignore` (gitignore syntax); Copilot uses org/repo content exclusion. Ignore files are not a hard security boundary: Cursor documents that terminal and MCP can still read ignored paths.

**Incorrect (rely on fictional .aiignore alone):**

```text
# Named .aiignore only — Cursor never reads it
/secrets
.env
```

**Correct (vendor-correct ignore + bypass awareness):**

```text
# .cursorignore (gitignore syntax) — blocks Agent/Tab/@ for listed paths
/secrets/**
**/.env
**/.env.*
**/customers.csv

# Also .gitignore the same paths.
# Note: terminal commands and MCP servers can still read these files.
# Copilot: configure Content exclusion in org/repo settings (Business/Enterprise).
```

Read `references/ignore-and-exclusion.md` for Cursor vs Copilot recipes. Escape hatch: global ignore settings for personal machines.

Reference: [Cursor ignore file](https://cursor.com/docs/reference/ignore-file), [Copilot content exclusion](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion)
