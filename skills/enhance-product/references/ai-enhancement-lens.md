# AI enhancement lens

Propose AI only when it closes a **named gap**. Reject demo theater.

## Fit audit (all must pass)

Adapted from [Smashing Magazine’s AI audit](https://www.smashingmagazine.com/2026/11/should-you-add-ai-audit-product-teams/) (effort / beat current method / catchable errors / year-ahead skill retention) plus [outcome-before-model](https://nenadivanovic.com/blog/ai-product-strategy). Smashing’s four questions map to items 2–4 and 6; items 1 and 5 are skill-specific gates.

1. **Named gap** — Which backlog ID / VOC theme does this address?
2. **Reduce total task effort** — After counting checking/HITL the user inherits, is net effort down for the target user?
3. **Beat the current method** — Better than the spreadsheet, rules engine, or search? Prefer deterministic automation when rules suffice.
4. **Catchable errors** — Can the user detect and correct failures? Require HITL for irreversible or customer-facing actions.
5. **Measurable outcome** — Name the metric (time-to-complete, error rate, resolution rate, conversion). No metric → no ship recommendation.
6. **Year-ahead skill** — If users rely on this for a year, do they keep judgment where it matters, or atrophy a skill the product still needs?

**Fail any →** drop or reframe as non-AI work.

### Incorrect (theater — fails gates 1, 4, 5):

```text
AI-1: Add a homepage chatbot so we look innovative.
Gap: (none) · Metric: (none) · Catchable errors: bot can invent pricing → no HITL
→ DROP
```

### Correct (passes — draft + approve on a named gap):

```text
AI-2 → backlog CAL-3 (hosts rewrite event descriptions after no-shows).
Named gap: CAL-3 · Net effort: down (draft + 30s edit vs blank page)
Beat current: yes vs empty template · Catchable: host must Approve before send
Metric: median minutes to publish reschedule copy · Year-ahead: host still owns tone
→ KEEP as ai-enhancement on CAL-3
```

## Good AI shapes (examples)

| Shape | When |
|---|---|
| Draft + human approve | Writing, triage labels, follow-up email |
| Retrieve + cite | Docs/KB answers with sources and ACL respect |
| Classify / route | High-volume intake with confidence + undo |
| Extract structure | Forms, commitments, entities from text |
| Rank / recommend | Options the user still chooses |

## Bad AI shapes (reject as primary pitch)

- Homepage chatbot with no grounded corpus or job
- “AI everywhere” without per-feature metrics
- Autopilot that posts, charges, or deletes without HITL
- Fake review generation (always reject)

## Studio vs owner

- **Owner:** AI inside the product or ops.
- **Studio:** AI layer *around* a client’s product (API, embeds) when native change is unlikely—still map to a client-visible gap and metric.
