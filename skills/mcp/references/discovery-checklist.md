# Discovery checklist

Use before writing config or scaffolding a server. Facts: `docs/research/mcp.md`.

The operating loop in `SKILL.md` owns the discover/reuse checkboxes. Use this file for host/capability questions and the reuse gate detail.

## Reuse gate

1. Search the vendor’s **official** MCP URL (`mcp.<vendor>.…` or product docs “MCP server”).
2. Cross-check [MCP Registry](https://modelcontextprotocol.io/registry/about) / [registry.modelcontextprotocol.io](https://registry.modelcontextprotocol.io/) for namespace metadata when publishing or verifying a listed server.
3. If an official endpoint covers the job (auth model + tools), **configure the client**—do not scaffold.
4. Build only for private data, custom ACL, missing tool shapes (e.g. ChatGPT Deep Research `search`/`fetch`), or no official server.

**Secondary only:** mcpmarket.com and random GitHub READMEs. Prefer first-party docs over third-party proxies.

**Done when:** reuse-or-build is decided and each target host has a config or build path.

## Capability prompts

Ask only what changes the design:

- Which agent products must call this? (Cursor, Claude Code, ChatGPT, VS Code/Copilot, …)
- Does ChatGPT/Deep Research need remote HTTPS + `search`/`fetch`?
- Is stdio enough for IDE-only workflows?
- Are write tools required (implies stricter HITL via `ai-security`)?
- Will hosts load dozens of tools? If yes, plan clear tool descriptions/annotations so progressive disclosure can work (server authors optimize descriptions; host builders follow [client best practices](https://modelcontextprotocol.io/docs/2026-07-28/develop/clients/client-best-practices)—deep code-mode sandboxes are out of scope here).

## Progressive discovery (thin pointer)

Hosts increasingly list many servers but inject tool definitions only after search/inspect. Server authors: keep `tools/list` deterministically ordered, descriptions precise, annotations accurate. Do not assume every tool definition is always in the model context.
