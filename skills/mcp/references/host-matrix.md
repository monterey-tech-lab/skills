# Host configuration matrix

Sources: `docs/research/mcp.md` (accessed 2026-11-21 / refresh 2026-11-22). Assign **host-native** recipes; do not copy JSON field names across products.

## Contents

- [Cursor](#cursor)
- [Claude Code](#claude-code)
- [Claude.ai / Desktop connectors](#claudeai--desktop-connectors)
- [OpenAI / ChatGPT](#openai--chatgpt)
- [VS Code / GitHub Copilot](#vs-code--github-copilot)
- [Vercel official MCP](#vercel-official-mcp)
- [Linear official MCP](#linear-official-mcp)
- [Stdio-only clients](#stdio-only-clients)
- [Tool annotations (all hosts)](#tool-annotations-all-hosts)
- [Smoke-test per host](#smoke-test-per-host)

## Cursor

| Item | Value |
|---|---|
| Project config | `.cursor/mcp.json` |
| Global config | `~/.cursor/mcp.json` |
| Remote shape | `"url": "https://…"` (+ optional `headers` / OAuth `auth`) |
| Stdio shape | `"command"` / `"args"` / `"env"` / `"envFile"` |
| Transports | stdio, SSE (legacy host support), Streamable HTTP |
| Secrets | `${env:NAME}`, `${workspaceFolder}`, … — not literals |
| Debug | Output panel → “MCP Logs” |

**Default remote entry:**

```json
{
  "mcpServers": {
    "linear": { "url": "https://mcp.linear.app/mcp" },
    "vercel": { "url": "https://mcp.vercel.com" }
  }
}
```

Use `npx mcp-remote <url>` **only** when native remote HTTP fails or the client is stdio-only—not as the first Cursor recipe. For hosts that reject DCR (e.g. Slack), use Cursor’s static `auth.CLIENT_ID` block per vendor docs.

## Claude Code

| Item | Value |
|---|---|
| Add command | `claude mcp add --transport http <name> <url>` |
| Stdio add | `claude mcp add <name> -- <command> …` |
| Project config | `.mcp.json` at repo root (`"type": "http"` required for HTTP) |
| User / local | `~/.claude.json` (`mcpServers` / per-project local) |
| **Wrong paths** | `~/.claude/mcp.json`, `~/.claude/.mcp.json`, `~/.claude/config/mcp.json` |
| Verify | `claude mcp list`, `claude mcp get`, in-session `/mcp` |
| Notes | Project servers need restart + approval; `MCP_TIMEOUT` for slow first `npx` |

```bash
claude mcp add --transport http linear-server https://mcp.linear.app/mcp
claude mcp add --transport http vercel https://mcp.vercel.com
```

```json
{
  "mcpServers": {
    "linear": {
      "type": "http",
      "url": "https://mcp.linear.app/mcp"
    }
  }
}
```

Hosts on Claude Code **before** versions that understand 2026-07-28 response fields may fail tool fetch if servers omit `resultType` / `ttlMs` / `cacheScope`—upgrade the host or keep dual-compat intentionally.

## Claude.ai / Desktop connectors

- Prefer Connectors UI for remote servers.
- Desktop local config may use `claude_desktop_config.json`; Claude Code can import via `claude mcp add-from-claude-desktop`.
- Remote Claude.ai connectors are **brokered from Anthropic cloud**—private LAN MCP URLs that work in Cursor may fail unless publicly reachable / allowlisted.
- Tool annotations (`readOnlyHint` / `destructiveHint`) are expected when building connectors.

## OpenAI / ChatGPT

| Item | Value |
|---|---|
| ChatGPT UI | Plugins / custom MCP server |
| API | Responses API `tools: [{ "type": "mcp", "server_url": "https://…" }]` |
| Deep Research / company knowledge | Implement **`search`** and **`fetch`** with `structuredContent` + JSON text content |
| Transport | Remote Streamable HTTP (treat documented SSE samples as compatibility, not new-server default) |
| Auth | OAuth; CIMD preferred over DCR for new implementations; resend `authorization` each Responses call |

## VS Code / GitHub Copilot

| Item | Value |
|---|---|
| VS Code workspace MCP | `.vscode/mcp.json` uses top-level **`"servers"`** (not `mcpServers`) |
| Copilot / agent harness | Prefer documented Copilot MCP config paths (e.g. user `~/.copilot/mcp-config.json` and workspace `.mcp.json` per [VS Code MCP configuration](https://code.visualstudio.com/docs/agents/reference/mcp-configuration))—do **not** assume Cursor’s `.cursor/mcp.json` shape |
| Remote shape | Often `"type": "http"` + `"url"` under `servers` |
| UI | Command Palette: `MCP: List Servers` / `Add Server`; Copilot MCP gallery for first-party servers (e.g. GitHub) |
| First-party examples | GitHub remote `https://api.githubcopilot.com/mcp/`; Microsoft Learn `https://learn.microsoft.com/api/mcp` |

**Incorrect:** copy Cursor `{ "mcpServers": { … "url" } }` into `.vscode/mcp.json` unchanged.  
**Correct:** rename to `"servers"` and use the VS Code / Copilot field names from current docs.

```json
{
  "servers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    }
  }
}
```

## Vercel official MCP

| Item | Value |
|---|---|
| URL | `https://mcp.vercel.com` |
| Helpers | `npx -y add-mcp https://mcp.vercel.com` (optional `-g`) |
| Cursor | `"url": "https://mcp.vercel.com"` |
| Claude Code | `claude mcp add --transport http vercel https://mcp.vercel.com` then `/mcp` |
| Building on Vercel | `mcp-handler` + Streamable HTTP; `mcp-remote` if a client is stdio-only |

## Linear official MCP

| Item | Value |
|---|---|
| Read-write | `https://mcp.linear.app/mcp` |
| Read-only | `https://mcp.linear.app/mcp/readonly` (or `read` OAuth scope) |
| Legacy SSE | `https://mcp.linear.app/sse` — **deprecated**; do not recommend as default |
| Claude Code | `claude mcp add --transport http linear-server https://mcp.linear.app/mcp` |
| Cursor | `"url": "https://mcp.linear.app/mcp"` |
| Stdio-only | `npx -y mcp-remote https://mcp.linear.app/mcp` |

## Stdio-only clients

When the host cannot speak remote HTTP natively:

```bash
npx -y mcp-remote https://mcp.linear.app/mcp
```

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.linear.app/mcp"]
    }
  }
}
```

Pin `mcp-remote` (or the server package) to a version in production recommendations; avoid eternal `@latest` as the documented default.

## Tool annotations (all hosts)

For **every** new tool (not only Claude connectors): set `readOnlyHint` and `destructiveHint` accurately. Hosts use them for UX and risk display; they are **not** a substitute for allow-lists or HITL (`ai-security`).

## Smoke-test per host

| Host | Minimum verify |
|---|---|
| Cursor | Server enabled in MCP settings; tools listed; one tool call; check MCP Logs on failure |
| Claude Code | `claude mcp list` shows connected; `/mcp` healthy; one tool call |
| ChatGPT / API | Connector connected or Responses API tool calls succeed; Deep Research can `search` then `fetch` |
| VS Code / Copilot | Server listed in MCP UI / Copilot; tools visible; one tool call |
| Any | Fix auth/transport before claiming setup complete |
