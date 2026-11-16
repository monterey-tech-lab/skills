---
title: Pin Dependencies and Scan for CVEs
impact: MEDIUM
impactDescription: reduces supply-chain compromise
tags: supply-chain, sca, dependabot, slsa
---

## Pin Dependencies and Scan for CVEs

**Impact: MEDIUM (reduces supply-chain compromise)**

OWASP Top 10:2025 A03 elevates Software Supply Chain Failures. Commit lockfiles, enable Dependabot/Renovate (or equivalent) for security updates, and run SCA (npm audit, Snyk, Trivy, Grype) in CI. Prefer pinned versions and a path toward build provenance (SLSA).

**Incorrect (floating ranges, no scanner):**

```json
{
  "dependencies": {
    "express": "*",
    "lodash": "^4"
  }
}
```

**Correct (lockfile + automated security PRs):**

```yaml
# package-lock.json / pnpm-lock.yaml committed
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule: { interval: weekly }
    open-pull-requests-limit: 10
```

Block merges on critical CVE gates for production dependencies when a fixed version exists.

Reference: [OWASP Top 10:2025 A03](https://owasp.org/projects/top-ten), [SLSA v1.2](https://slsa.dev/spec/)
