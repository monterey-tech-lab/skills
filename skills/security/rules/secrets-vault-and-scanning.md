---
title: Keep Secrets out of Git and Scan for Leaks
impact: HIGH
impactDescription: prevents credential theft from the repo
tags: secrets, vault, gitleaks, supply-chain
---

## Keep Secrets out of Git and Scan for Leaks

**Impact: HIGH (prevents credential theft from the repo)**

Committed `.env` files and keys in images are permanent leaks once the repo is cloned. Load secrets from a manager or CI injection, rotate anything that was committed, and block future leaks with gitleaks/trufflehog (or equivalent) in pre-commit and CI.

**Incorrect (committed production .env):**

```text
# .env committed to git
DATABASE_URL=postgres://prod:hunter2@db/prod
STRIPE_SECRET_KEY=sk_live_...
```

**Correct (secret manager + scanner):**

```yaml
# CI: inject secrets; never commit them
# - uses: google-github-actions/auth / aws-actions / Doppler / Vault
# Pre-commit + CI:
# - gitleaks detect --source . --verbose
#
# App reads process.env populated by the platform; rotate any key that ever touched git.
```

Add `.env` to `.gitignore` and ship `.env.example` with empty placeholders only.

Reference: [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html), [NIST SSDF](https://csrc.nist.gov/pubs/sp/800/218/final)
