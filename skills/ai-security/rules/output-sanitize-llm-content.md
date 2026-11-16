---
title: Sanitize LLM Output Before Render or Execution
impact: HIGH
impactDescription: prevents XSS and code execution from model text
tags: output, xss, injection, llm
---

## Sanitize LLM Output Before Render or Execution

**Impact: HIGH (prevents XSS and code execution from model text)**

LLM output is untrusted (OWASP Improper Output Handling). Rendering with `innerHTML`, concatenating into SQL/shell, or `eval`ing model text turns the model into an attacker-controlled channel.

**Incorrect (innerHTML and eval of model output):**

```typescript
container.innerHTML = llmHtml;
eval(llmCode);
await db.query(`SELECT * FROM users WHERE id = '${llmValue}'`);
```

**Correct (escape, schema-validate, parameterize):**

```typescript
import DOMPurify from 'dompurify';
element.textContent = llmPlainText; // or DOMPurify.sanitize(llmHtml) if HTML is required
const parsed = OutputSchema.parse(JSON.parse(llmJson));
await db.query('SELECT * FROM users WHERE id = $1', [parsed.userId]);
```

Prefer structured JSON with a schema over free-form HTML when building product features.

Reference: [OWASP LLM Top 10 Improper Output Handling](https://genai.owasp.org/llm-top-10/), [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
