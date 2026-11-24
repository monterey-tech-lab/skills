# Research playbook

Source ladder and VOC rules for Step 1. Prefer citable public pages over vibes.

## Source ladder (use in order)

1. **Subject surfaces** — homepage, pricing, features, docs, changelog, App Store / Play listing, public API docs. Label vendor claims as claims.
2. **Official review platforms** — G2, Capterra, Trustpilot, Google Business, App Store / Play reviews. Prefer cons/lowest-star themes with links.
3. **Community** — Reddit, HN, Indie Hackers, niche forums, public Discord/Slack archives if linkable, X/Twitter search for product name + complaint keywords.
4. **Competitors** — their pricing/features/positioning pages (use the competitor-matrix branch).
5. **Secondary roundups** — “best alternatives” posts only to discover peers; re-verify claims on primary pages.

**Completion criterion:** every theme in the report has at least one primary URL, or is marked **hypothesis**.

## VOC synthesis

- Cluster complaints and praise into **themes**; count recurring mentions when possible.
- Treat a theme as **real** when multiple independent sources agree (e.g. ≥3 review snippets or distinct threads). Single rants stay **anecdote**.
- Quote sparingly; paraphrase with citation. Never invent quotes or star ratings.
- Separate **severity** (how bad) from **frequency** (how often) when evidence allows.
- Map each theme to a canonical gap type from `opportunity-scoring.md`: `feature` | `automation` | `bug/fix` | `growth` | `pricing/packaging` | `process` | `ai-enhancement` (and note the affected job-to-be-done).

## Sparse-signal path

When the site 404s, brand is unknown, or reviews are empty:

1. Say **sparse signal** explicitly — do not fabricate VOC.
2. Research **category peers** for the job (window managers, schedulers, etc.).
3. Build backlog from competitor parity + category complaints as **proxy evidence**.
4. Cap Confidence at **`0.5`** (or lower) unless the user supplies private data.
5. Split backlog into **Investigable now** vs **Park until first-party signal**.
6. Recommend the smallest instrumentation (analytics event, one-question survey, interview script) to exit sparse mode.

### Incorrect (invent VOC):

```text
Agent: Users love WindowWarp Pro — “best window tool ever” (5★ Google). Reddit raves about the tiling…
```

### Correct (sparse + proxy):

```text
Agent: Sparse signal — subject URL unresolved; no first-party reviews found.
       Category peers: Rectangle, Magnet, Amethyst (pricing/features cited).
       Proxy theme: multi-display restore after sleep (Mac window-manager forums).
       Backlog item WW-1 Confidence capped at 0.5; labeled investigable vs park.
```

## Ethics defaults

- Public pages and published posts only by default. No login bypass, paywall scrape, or ToS-violating harvest as the default path.
- Do not write, buy, or invent fake reviews for the user to post ([FTC 16 CFR 465.2](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-D/part-465/section-465.2); rule effective 2024-10-21).
- Marketing copy from the vendor is evidence of **positioning intent**, not proven outcomes.
