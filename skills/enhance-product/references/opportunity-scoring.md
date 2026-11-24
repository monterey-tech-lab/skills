# Opportunity scoring

Every backlog item gets an explicit score. Default: Intercom **RICE**.

## RICE (default)

From [Intercom’s RICE](https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers) (Sean McBride, 2018):

| Factor | Meaning | Scale |
|---|---|---|
| **Reach** | People/events affected per time period | Number (customers/quarter, bookings/month, …). Estimate; cite metric basis or mark guess |
| **Impact** | Effect per person reached | `3` massive, `2` high, `1` medium, `0.5` low, `0.25` minimal |
| **Confidence** | Trust in the estimates | Numeric **`1`** (high) / **`0.8`** (medium) / **`0.5`** (low); below `0.5` = moonshot. Pass these decimals to `scripts/rice.mjs` — never `80` or `50` |
| **Effort** | Person-months (product+design+eng) | Whole numbers; `0.5` minimum for tiny work |

**Score** = (Reach × Impact × Confidence) ÷ Effort

Sort descending. When overriding order (dependency, table stakes, sales block), **state why**.

### Worked example

Viewer/stakeholder seat for a SaaS with ~800 customers/quarter hitting guest billing pain:

| Factor | Value | Why |
|---|---|---|
| Reach | 800 | customers/quarter who invite external viewers |
| Impact | 2 | high — removes a top churn theme |
| Confidence | 0.8 | medium — strong VOC, effort estimate rough |
| Effort | 2 | ~2 person-months (billing + permissions + docs) |

RICE = (800 × 2 × 0.8) ÷ 2 = **640**

Optional check: `node scripts/rice.mjs --reach=800 --impact=2 --confidence=0.8 --effort=2`

### Importance–satisfaction hint (Ulwick)

When VOC yields outcome themes, prefer gaps that are **important and poorly satisfied** (underserved). Full ODI surveys need large samples—use the gap idea as a qualitative check, not fake decimal precision ([Ulwick opportunity algorithm](https://customerthink.com/what-unmet-needs-should-be-targeted-for-growth/)).

## Backlog row shape

```text
ID | Title | Gap type | Evidence | R | I | C | E | RICE | Notes
```

**Gap types (canonical):** `feature` | `automation` | `bug/fix` | `growth` | `pricing/packaging` | `process` | `ai-enhancement`

Map VOC themes to these types only (playbook “UX-process” → `process`; support/trust friction → `process` or `feature` with a note).

## Founder heuristics (apply ≥1 per report)

1. **Love before growth** — Prefer changes that deepen love for a defined ICP over vanity growth hacks when retention/love is unproven ([Altman Startup Playbook](https://playbook.samaltman.com/); [Before Growth](https://blog.samaltman.com/before-growth)).
2. **Do things that don’t scale** — For early/indie products, rank manual delight, concierge onboarding, or recruiting users by hand above premature platform bets ([Graham](https://www.paulgraham.com/ds.html)).
3. **Focus / saying no** — Cut backlog items that dilute the core job even if peers have them; record explicit non-goals.

**Completion criterion:** every item has R/I/C/E; report names which founder heuristic shaped prioritization or non-goals.
