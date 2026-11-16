---
title: Know Provider Retention and ZDR Scope
impact: HIGH
impactDescription: avoids false privacy assumptions
tags: privacy, zdr, retention
---

## Know Provider Retention and ZDR Scope

**Impact: HIGH (avoids false privacy assumptions)**

Enterprise “Zero Data Retention” and similar contracts are product-scoped. Claude Code ZDR, for example, applies only to qualified Enterprise setups and does not cover every surface (e.g. some MCP/third-party paths). Treat retention claims as operational configuration to verify—not a legal determination.

**Incorrect (assume all AI traffic is ZDR):**

```text
We have Enterprise, so every prompt, MCP call, and local transcript is zero-retention.
```

**Correct (verify which products ZDR covers):**

```text
Check the vendor ZDR/data-usage docs for this product:
- Which surfaces are covered (IDE chat vs agent vs MCP)?
- What is still stored locally (transcripts, caches)?
- Disable features that are unsupported under ZDR if required by policy.
Do not claim legal compliance from a marketing badge.
```

This is awareness guidance, not legal advice.

Reference: [Claude Code Zero Data Retention](https://code.claude.com/docs/en/zero-data-retention), [Claude data usage](https://code.claude.com/docs/en/data-usage)
