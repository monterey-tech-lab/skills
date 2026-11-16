---
title: Verify Webhooks and Lock CORS to the Product Origin
impact: MEDIUM-HIGH
impactDescription: blocks forged events and cross-site credential abuse
tags: api, webhooks, cors, stripe
---

## Verify Webhooks and Lock CORS to the Product Origin

**Impact: MEDIUM-HIGH (blocks forged events and cross-site credential abuse)**

Unverified webhooks accept attacker-crafted billing events. Wildcard or marketing-site CORS with credentials on privileged APIs lets unrelated origins drive state-changing calls. Verify provider signatures, process webhook event ids idempotently, require auth on charge APIs, and allow-list only the trusted product frontend origin.

**Incorrect (trust body; marketing CORS on charges):**

```typescript
app.post('/webhooks/stripe', express.json(), async (req, res) => {
  await handleStripeEvent(req.body); // no signature check
  res.sendStatus(200);
});
app.use(cors({ origin: 'https://marketing.example.com', credentials: true }));
app.post('/api/charges', createCharge); // marketing page can call with cookies
```

**Correct (signature verify; product-origin CORS only):**

```typescript
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    logger.error('STRIPE_WEBHOOK_SECRET is not configured');
    return res.sendStatus(500);
  }
  const signature = req.headers['stripe-signature'];
  if (typeof signature !== 'string') return res.sendStatus(400);
  const event = stripe.webhooks.constructEvent(req.body, signature, secret);
  await webhooks.processOnce(event.id, () => handleStripeEvent(event));
  res.sendStatus(200);
});

app.use('/api', cors({
  origin: ['https://app.example.com'], // product app — not the marketing site
  credentials: true,
}));
app.post('/api/charges', requireAuth, createCharge);
```

Marketing sites should deep-link into the authenticated app, not call privileged APIs cross-origin.

Reference: [Stripe Webhook signatures](https://docs.stripe.com/webhooks), [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
