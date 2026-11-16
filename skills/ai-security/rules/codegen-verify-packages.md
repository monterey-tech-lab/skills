---
title: Verify AI-Suggested Packages Before Install
impact: CRITICAL
impactDescription: blocks slopsquatting malware
tags: codegen, supply-chain, slopsquatting, npm
---

## Verify AI-Suggested Packages Before Install

**Impact: CRITICAL (blocks slopsquatting malware)**

Models hallucinate package names. Attackers register those names (slopsquatting). Never `npm install` / `pip install` from a suggestion alone—confirm the package exists on the official registry, check publisher signals, then pin an exact version.

**Incorrect (blind install from the model):**

```bash
npm install @acme/stripe-webhook-helper@latest
# because the agent said so
```

**Correct (registry check then pin):**

```bash
npm view @acme/stripe-webhook-helper
# If 404 → stop (do not invent a publish). Existence alone is not trust:
# check publisher, age, download volume, and repository URL vs the official SDK.
# Prefer first-party packages (e.g. stripe) over obscure AI-suggested helpers.
npm install stripe@17.7.0 --save-exact   # pin; commit lockfile
npm audit --omit=dev
```

Repeated hallucinations are common across runs—do not retry install hoping the name becomes real.

Reference: [Socket: slopsquatting](https://socket.dev/glossary/slopsquatting), [OWASP Secure Coding with AI](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Coding_with_AI_Cheat_Sheet.html)
