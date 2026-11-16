---
title: Review AI Code Like an External PR
impact: HIGH
impactDescription: catches insecure and out-of-scope edits
tags: codegen, review, sast
---

## Review AI Code Like an External PR

**Impact: HIGH (catches insecure and out-of-scope edits)**

NIST SP 800-218A treats AI-generated and human code the same before use. Agents invent weak crypto, concatenated SQL, weakened tests, and drive-by edits to CI or lockfiles. Require human review of high-impact paths and run SCA/SAST on AI-assisted diffs before merge.

**Incorrect (merge from the agent summary):**

```text
LGTM based on the PR description. Skip review of package-lock, CI, and tests.
```

**Correct (diff review + security gates):**

```text
Review the full diff, especially:
- dependency and lockfile changes
- CI/CD, Docker, ignore/rules files
- auth, crypto, SQL, shell execution
Run SCA (npm audit / Snyk / Trivy) and SAST on the change; do not merge on a green summary alone.
```

Escape hatch: trivial typo fixes in non-security files may use lighter review—still run automated gates.

Reference: [NIST SP 800-218A](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-218A.pdf), [Secure Coding with AI](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Coding_with_AI_Cheat_Sheet.html)
