---
name: mcp
description: Configures and verifies Model Context Protocol clients and servers across hosts—Cursor, Claude Code, ChatGPT/OpenAI, VS Code/Copilot, Vercel, Linear—against the 2026-07-28 specification. Use when setting up or fixing host MCP config paths and commands, choosing reuse versus building a server, applying industry MCP patterns (annotations, Registry, CIMD, MCP Apps/MCPB), picking Streamable HTTP or stdio transports, migrating off sessionful initialize/Mcp-Session-Id tutorials, publishing remote MCP for agents, distinguishing Agent Skills for authoring servers from the MCP Skills extension (skills/list, skill://), or smoke-testing tools after connect—not for MCP allow-list/auto-approve/HITL policy (use ai-security).
license: MIT
metadata:
  author: monterey-tech-lab
  version: "0.2.0"
---

# MCP

Host-correct MCP client wiring and language-agnostic server build/publish against protocol revision **2026-07-28**. Capability and config only—security allow-lists, auto-approve, and HITL belong in `ai-security`.

## Operating loop

Copy and complete on every MCP request. Stop when each criterion is met.

```text
MCP progress:
- [ ] 1. Discover: name host(s), required capabilities, local vs remote; check Registry / first-party URL
- [ ] 2. Reuse gate: official first-party MCP URL if it covers the need; else justify build
- [ ] 3. Configure or build: host-correct paths/commands OR 2026-07-28 server defaults + patterns
- [ ] 4. Secrets: env interpolation / OAuth / host secret store — never literals in chat or committed JSON
- [ ] 5. Security handoff: point to ai-security for allow-list / HITL / no autoApprove *
- [ ] 6. Smoke-test: Inspector (optional) + tools list visible + one successful tool call on each target host
```

**Completion criterion:** every checkbox is satisfied in the answer or shipped config, and no hard reject below remains.

## Hard defaults

| Choice | Default | Escape hatch |
|---|---|---|
| Protocol truth | Spec revision **2026-07-28** (stateless Streamable HTTP core) | Dual-era compat for lagging hosts; still do not teach Redis/`Mcp-Session-Id` as best practice for new servers |
| Remote transport | **Streamable HTTP** | Legacy HTTP+SSE only when a named host still requires it |
| Local transport | **stdio** (host-managed subprocess) | Bridge with `mcp-remote` when the client is stdio-only and the server is remote HTTPS |
| Reuse vs build | **Reuse** first-party / Registry-listed endpoints | Build when no official server covers ACL, tool shape, or private data |
| New remote servers | No protocol sessions; no `initialize` + `Mcp-Session-Id` store | App-level handles as tool args if cross-call state is required |
| Tool annotations | **`readOnlyHint` / `destructiveHint` on every tool** | Hints ≠ enforcement—HITL via `ai-security` |
| TypeScript SDK | `@modelcontextprotocol/server` (+ adapters); schema-first | Other Tier-1 languages per project; do not start on retired monolithic v1 as the first recipe |
| Packaging | Remote Streamable HTTP URL | MCP Apps for UI-in-chat; MCPB only when must-run-local |
| Cursor project config | `.cursor/mcp.json` with `"url"` for remotes | `~/.cursor/mcp.json` for personal-only; `mcp-remote` stdio only if native remote fails |
| Claude Code | `claude mcp add --transport http …` and/or project `.mcp.json` with `"type": "http"` | User/local scopes in `~/.claude.json` — never `~/.claude/mcp.json` |
| VS Code / Copilot | `"servers"` key / Copilot MCP paths from current VS Code docs | Never paste Cursor `mcpServers` unchanged |
| ChatGPT / OpenAI remote | Responses API `tools: [{ type: "mcp", server_url }]` / custom connector; Deep Research: `search` + `fetch` | Extra tools only after those two exist when Deep Research is a goal |
| OAuth for new clients | **CIMD** preferred | Static client ID when vendor rejects DCR (Slack, GitHub remote) |
| Secrets | `${env:NAME}`, host envFile, OAuth | Static headers only for non-secret values |
| Security policy | Link `ai-security` | Do not invent allow-list rules here |

## Hard rejects

| Reject | Prefer instead |
|---|---|
| `initialize` + `Mcp-Session-Id` + Redis/sticky sessions as the 2026-07-28 production default | Sessionless Streamable HTTP; explicit handles for app state |
| HTTP+SSE dual endpoints as the default for **new** servers | Streamable HTTP; SSE only as documented host delta |
| Claude Code path `~/.claude/mcp.json` (or `~/.claude/config/mcp.json`) | `claude mcp add`, project `.mcp.json`, or `~/.claude.json` scopes |
| Cursor remote via `mcp-remote` when native `"url"` works | `"url": "https://…"` in `.cursor/mcp.json` |
| Copying one host’s JSON shape to another (including Cursor → VS Code) | Host matrix field names (`url` vs `type`+`url` vs `servers` vs `server_url`) |
| `autoApprove: ["*"]` or “approve all tools” | Manual approval / allow-list via `ai-security` |
| Unpinned `npx …@latest` community servers as the recommend path | Pin version; prefer first-party / Registry URLs |
| Logging MCP JSON-RPC to **stdout** on stdio servers | Log to stderr only |
| `cacheScope: "public"` on user/tenant-scoped lists | `private` for ACL-bound data |
| MCPB or MCP Apps as default for a plain cloud API | Remote Streamable HTTP URL first |
| Omitting `readOnlyHint` / `destructiveHint` | Set annotations; do not treat them as enforcement |
| Treating marketplace blogs as transport source of truth | Spec changelog + host docs + Registry |

## Branches

### Discover

Name the product hosts, whether the server must be reachable remotely (ChatGPT) or only locally (IDE stdio), and which primitives are required. Prefer official vendor MCP docs and the MCP Registry over marketplace blogs.

Read `references/discovery-checklist.md` when the request is vague (“add MCP”) or spans multiple hosts.
Read `references/patterns.md` when choosing reuse, packaging, annotations, or a first-party vendor endpoint.

### Configure client

Assign **host-native** commands and config files. Never assume one JSON schema fits all products.

Read `references/host-matrix.md` when setting up or comparing Cursor, Claude Code, ChatGPT/OpenAI, VS Code/Copilot, Vercel, or Linear.

### Select and pin

Reuse official endpoints (`https://mcp.linear.app/mcp`, `https://mcp.vercel.com`, GitHub/Notion/Stripe/Slack/… in `patterns.md`) before scaffolding. Pin package versions for stdio servers; use OAuth or env refs for credentials.

### Build and publish

Default new remote servers to Streamable HTTP on an official Tier-1 SDK. TypeScript: `@modelcontextprotocol/server` (+ adapters). Implement `server/discover`; emit `resultType`; set annotations; prefer CIMD over DCR for new OAuth clients. Do not fork Anthropic `build-mcp-server` bodies—point agents there for deep Claude scaffolds when useful.

Read `references/build-server.md` when authoring or migrating a server.
Read `references/spec-2026-07-28.md` when correcting protocol misconceptions or designing wire-level behavior.

### Agent Skills ∩ MCP

Two different things:

1. **Authoring aids** — Agent Skills such as MCP.org / Anthropic `build-mcp-server` that guide how to implement a server.
2. **Skills extension** — `io.modelcontextprotocol/skills`: a server publishes skills via `skills/list` / `skills/get` and `skill://` resources.

Do not conflate them. Read `references/spec-2026-07-28.md` when either is in scope.

### Validate and smoke-test

After config or deploy: prefer Inspector modern-era `tools/list` + `tools/call`, then list tools on the host, run one real call, fix auth/transport failures before declaring done. Completion criterion: tools visible and one call succeeds on each target host.

## Incorrect / correct

**Incorrect (sessionful “production” server on 2026-07-28):**

```text
POST /mcp with initialize → store Mcp-Session-Id in Redis → require sticky sessions
Legacy GET /sse + POST /messages as the primary remote transport
```

**Correct:**

```text
Streamable HTTP, sessionless core; per-request protocol version + capabilities in _meta
server/discover for capability advertisement; app state via explicit tool-arg handles
```

**Incorrect (wrong Claude Code path + Cursor forced through mcp-remote):**

```text
# Wrong path for Claude Code:
~/.claude/mcp.json

# Wrong first recipe for Cursor (native url works):
{ "mcpServers": { "linear": { "command": "npx", "args": ["-y", "mcp-remote", "https://mcp.linear.app/mcp"] } } }
```

**Correct — Claude Code:**

```bash
claude mcp add --transport http linear-server https://mcp.linear.app/mcp
```

```json
{ "mcpServers": { "linear": { "type": "http", "url": "https://mcp.linear.app/mcp" } } }
```

```text
Save as project .mcp.json (with "type": "http") or use ~/.claude.json scopes — never ~/.claude/mcp.json
```

**Correct — Cursor:**

```json
{ "mcpServers": { "linear": { "url": "https://mcp.linear.app/mcp" } } }
```

```text
Save as .cursor/mcp.json; use mcp-remote only for stdio-only clients
```
