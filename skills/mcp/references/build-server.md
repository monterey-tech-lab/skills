# Build and publish MCP servers

Language- and framework-agnostic defaults. Verify SDK revision support on [MCP SDKs](https://modelcontextprotocol.io/docs/2026-07-28/sdk). Research: `docs/research/mcp.md`.

## Contents

- [When to build](#when-to-build)
- [Defaults](#defaults)
- [SDK selection](#sdk-selection)
- [Tool design](#tool-design)
- [Deployment paths](#deployment-paths)
- [MCP Apps vs MCPB](#mcp-apps-vs-mcpb)
- [OpenAI / ChatGPT tool shapes](#openai--chatgpt-tool-shapes)
- [Capability auth smoke](#capability-auth-smoke)
- [Publish and smoke-test checklist](#publish-and-smoke-test-checklist)
- [Deep Claude scaffolds](#deep-claude-scaffolds)

## When to build

Apply the reuse gate already defined in discovery (official `mcp.*` URL / Registry first). Build only when that gate fails: no first-party coverage, missing required tool shapes (e.g. Deep Research `search`/`fetch`), or you must publish private resources / the Skills extension from your origin.

## Defaults

| Concern | Default |
|---|---|
| Remote transport | Streamable HTTP, **sessionless** (2026-07-28) |
| Local transport | stdio; logs to **stderr** only |
| Discovery | Implement `server/discover` |
| Results | Emit `resultType`: `complete` or `input_required` |
| List/read caching | `ttlMs` + `cacheScope` (`private` for user/tenant data) |
| Annotations | `readOnlyHint` / `destructiveHint` on every tool |
| OAuth for new servers | CIMD preferred; avoid new DCR unless the host requires another mode |
| Protocol sessions | **Do not** add `initialize` + `Mcp-Session-Id` + Redis sticky stores |
| Gateway headers | `Mcp-Method` + `Mcp-Name` on Streamable HTTP POST |

**Incorrect:**

```text
isInitializeRequest → assign Mcp-Session-Id → persist transport in Redis → require sticky pods
Scaffold TypeScript with retired monolithic @modelcontextprotocol/sdk + HTTP+SSE as primary
```

**Correct:**

```text
Per-request handler; protocol version + capabilities on each call; app handles as tool args
Streamable HTTP single endpoint; @modelcontextprotocol/server (+ adapter) for new TypeScript work
```

## SDK selection

Pick the official SDK for the project’s language (Tier 1: TypeScript, Python, C#, Go, Rust, Ruby; Tier 2/3 per docs). Confirm that package’s supported protocol revisions before claiming 2026-07-28 wire compatibility.

**TypeScript default for new work:**

- Prefer `@modelcontextprotocol/server` (and documented `/node` / `/express` / `/hono` adapters) over scaffolding on the retired monolithic `@modelcontextprotocol/sdk` as the first recipe
- Align Zod to the version the current SDK docs require (generators often pin Zod 4.x)
- On Vercel: current `mcp-handler` + `@modelcontextprotocol/server`—not hand-rolled session stores

Much production software still speaks **2025-11-25**—emit modern response fields and document dual-compat when you must support lagging hosts.

## Tool design

| Default | Detail |
|---|---|
| Schema-first | Define tool args with Zod/Pydantic (or equivalent); generate JSON Schema from that source |
| `outputSchema` | Declare when hosts benefit (OpenAI / code-mode sandboxes) |
| Annotations | Always set `readOnlyHint` / `destructiveHint`; treat as hints, not enforcement |
| Deterministic `tools/list` | Stable order for client/prompt-cache hit rates |
| Descriptions | Precise enough for progressive discovery—do not dump hundreds of vague tools |

## Deployment paths

1. **Remote Streamable HTTP** — default for cloud APIs and ChatGPT/Cursor remote clients
2. **Local stdio** — IDE-only single-user tools
3. **MCP Apps / MCPB** — only when the decision table below says so

If a client is stdio-only but the server is HTTPS, bridge with `mcp-remote` at the **client** config—not by downgrading the server to SSE.

## MCP Apps vs MCPB

| Need | Choose |
|---|---|
| Cloud API / multi-host remote agents | **Remote Streamable HTTP URL** |
| Interactive UI inside the chat (forms, media, exploration) | **MCP Apps** (`ui://`, sandboxed iframe)—see [MCP Apps overview](https://modelcontextprotocol.io/extensions/apps/overview) |
| Must run on the user’s machine (filesystem, firewall, local runtime) | **MCPB** (`.mcpb` bundle)—see [Claude MCPB](https://claude.com/docs/connectors/building/mcpb) |

**Incorrect:** package a plain SaaS API as MCPB or MCP Apps by default.  
**Correct:** HTTPS Streamable HTTP first; Apps/MCPB only when UI-in-chat or local runtime is the product requirement.

## OpenAI / ChatGPT tool shapes

When Deep Research or company knowledge is a target, implement read-only tools named **`search`** and **`fetch`** with both `structuredContent` and JSON text `content`, including canonical URLs for citations. Prefer `outputSchema`. Wire Responses API as `type: "mcp"` + `server_url` (resent `authorization` each call when using OAuth).

## Capability auth smoke

Before declaring publish done:

1. Unauthenticated call should fail as documented (often 401 + `WWW-Authenticate` / protected-resource metadata).
2. Complete OAuth or env-based auth via host UI or [MCP Inspector](https://modelcontextprotocol.io/docs/2026-07-28/tools/inspector).
3. Prefer CIMD when creating **new** OAuth clients; use static client ID when the vendor rejects DCR (Slack, GitHub remote).

Policy (allow-list, HITL, no token passthrough) → `ai-security`.

## Publish and smoke-test checklist

```text
Publish:
- [ ] 1. Reuse gate documented (why build); Registry / first-party checked
- [ ] 2. Transport = Streamable HTTP (remote) or stdio (local); Apps/MCPB only if decided
- [ ] 3. server/discover + resultType + ttlMs/cacheScope; annotations on tools
- [ ] 4. No secrets in repo; OAuth or env-based credentials
- [ ] 5. Host configs use host-matrix recipes (not one JSON for all)
- [ ] 6. Inspector (modern era): tools/list + tools/call succeed
- [ ] 7. Host UI: tools listed + one real tool call on each target host
- [ ] 8. Security: defer allow-list / HITL / no auto-approve * to ai-security
```

**Done when:** steps 6–7 pass on every agreed host.

Inspector CLI shape (exact flags follow current Inspector docs): run with the **modern / 2026-07-28** protocol era, then `tools/list` and one `tools/call` before wiring hosts.

## Deep Claude scaffolds

For long Claude-specific server scaffolds, point engineers at the official MCP docs “build with Agent Skills” / Anthropic `build-mcp-server` (Apache-2.0)—summarize and link; do not paste those skill bodies into this repository.
