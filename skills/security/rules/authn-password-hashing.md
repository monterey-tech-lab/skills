---
title: Hash Passwords with Argon2id
impact: CRITICAL
impactDescription: resists offline cracking after a dump
tags: authn, passwords, argon2, nist
---

## Hash Passwords with Argon2id

**Impact: CRITICAL (resists offline cracking after a dump)**

Fast hashes (MD5, SHA-*) make password dumps trivially crackable. Use Argon2id with OWASP-recommended memory/time parameters; bcrypt/scrypt/PBKDF2 are documented fallbacks. Follow NIST SP 800-63B-4 on length and no composition rituals.

**Incorrect (SHA-256 password storage):**

```typescript
import { createHash } from 'node:crypto';
const passwordHash = createHash('sha256').update(password).digest('hex');
```

**Correct (Argon2id verify/hash):**

```typescript
import { hash, verify } from '@node-rs/argon2';

const passwordHash = await hash(password, {
  memoryCost: 19456, // 19 MiB (OWASP minimum example)
  timeCost: 2,
  parallelism: 1,
});

const ok = await verify(passwordHash, password);
```

Prefer MFA so passwords are not the only factor. Min length: 15 for single-factor, 8 when used only as part of MFA (NIST SP 800-63B-4); max ≥ 64; blocklist common passwords; no periodic forced rotation.

Reference: [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), [NIST SP 800-63B-4](https://pages.nist.gov/800-63-4/sp800-63b.html)
