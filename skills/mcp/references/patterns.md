# MCP patterns and first-party servers

Named patterns agents should apply. Facts: `docs/research/mcp.md` (2026-11-22 refresh). Host wiring details stay in `host-matrix.md`.

## Contents

- [Pattern catalog](#pattern-catalog)
- [First-party servers](#first-party-servers)
- [Auth capability vs security policy](#auth-capability-vs-security-policy)

## Pattern catalog

| Pattern | Do this | Escape hatch |
|---|---|---|
| **Reuse-first official URL** | Prefer vendor `https://mcp.<vendor>…` (or documented product host) before scaffolding | Build when ACL/tool shape/private data is uncovered |
| **Sessionless Streamable HTTP** | New remotes: no `initialize` + `Mcp-Session-Id` sticky store | App-level handles as tool args for cross-call state |
| **Host-native config shapes** | Use each host’s field names (`url` vs `type`+`url` vs `servers` vs `server_url`) | Never paste one JSON into another product |
| **Streamable HTTP first, SSE last** | Ship `/mcp` Streamable HTTP; treat `/sse` as deprecated bridge | Host that still requires SSE—document as host delta |
| **Annotations as risk vocabulary** | Set `readOnlyHint` / `destructiveHint` on every tool (Claude requires them) | Hints are **not** enforcement—HITL stays in `ai-security` |
| **OpenAI search + fetch** | Deep Research: read-only `search` + `fetch` with `structuredContent` + canonical `url` | Extra tools only after those two exist |
| **CIMD over DCR** | New OAuth clients prefer Client ID Metadata Documents | Hosts that reject DCR need static client ID / vendor recipe (Slack, GitHub remote) |
| **Pin versions** | Pin stdio packages and `mcp-remote`; no eternal `@latest` as the recommend path | Local throwaway spikes only |
| **Inspector + list + one call** | Pre-host: Inspector modern era `tools/list` / `tools/call`; then host smoke-test | Skip Inspector only when host already proves list+call |
| **stderr-only (stdio)** | Never log JSON-RPC to stdout | stderr / structured logs elsewhere |
| **Registry over random catalogs** | Discover/publish via [MCP Registry](https://modelcontextprotocol.io/registry/about); verify first-party docs | mcpmarket.com / blogs are secondary |
| **MCPB only if must-run-local** | `.mcpb` when filesystem/firewall/local runtime is required | Cloud APIs → remote Streamable HTTP URL |
| **MCP Apps when UI-in-chat wins** | Interactive in-host UI when forms/media beat text | Default text tools otherwise |
| **Schema-first + outputSchema** | Zod/Pydantic (or equivalent) as source of truth; declare `outputSchema` | Language without schema lib—still document JSON shape |
| **Dual-era awareness** | Emit 2026-07-28 fields (`resultType`, `ttlMs`, `cacheScope`); older hosts may lag | Document intentional dual-compat |
| **Security handoff** | Capability setup here; allow-list / auto-approve / HITL → `ai-security` | Do not invent policy catalogues |

## First-party servers

Prefer these official endpoints when the product match is exact. Auth and migration notes are capability setup—not allow-list policy.

| Vendor | Endpoint / form | Notes |
|---|---|---|
| **Linear** | `https://mcp.linear.app/mcp` | Read-only: `/mcp/readonly`; `/sse` deprecated |
| **Vercel** | `https://mcp.vercel.com` | CIMD for unreviewed clients; `npx add-mcp` |
| **GitHub** | `https://api.githubcopilot.com/mcp/` | OAuth+PKCE preferred; remote **no DCR**; also local Docker/binary |
| **Notion** | `https://mcp.notion.com/mcp` | Legacy SSE retirement—use Streamable HTTP `/mcp` |
| **Stripe** | `https://mcp.stripe.com` | OAuth or Agent API keys; prefixed tools; some Dashboard human confirmation |
| **Slack** | `https://mcp.slack.com/mcp` | Streamable HTTP only; **no SSE, no DCR**; static client ID on Cursor |
| **Atlassian** | `https://mcp.atlassian.com/v2/mcp` | Prefer v2; clear cached client metadata if auth breaks after migration |
| **Microsoft Learn** | `https://learn.microsoft.com/api/mcp` | Docs search; no auth |
| **Shopify** | stdio `@shopify/dev-mcp` only | **No** remote SaaS MCP URL—prefer Shopify AI Toolkit plugin |

Do not invent vendor hostnames (e.g. `mcp.shopify.com`) from other companies’ patterns.

## Auth capability vs security policy

**Capability (this skill):** which OAuth mode the host/server supports (CIMD, static client ID, bearer header, API key env); expect 401 + protected-resource metadata where documented; smoke OAuth with Inspector or host UI.

**Policy (`ai-security`):** whether to allow-list the server, refuse `autoApprove: ["*"]`, forbid token passthrough, require HITL for destructive tools.
