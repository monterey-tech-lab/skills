# MCP

Simple Agent Skill for host-correct Model Context Protocol client setup and language-agnostic MCP server build/publish against protocol revision **2026-07-28**, including industry patterns (annotations, Registry, CIMD, MCP Apps/MCPB) and first-party server endpoints.

## Install

```bash
npx skills add monterey-tech-lab/skills --skill mcp
```

Manual: copy `skills/mcp` to `~/.claude/skills/`, `.agents/skills/`, or `~/.cursor/skills/`.

## Structure

- `SKILL.md` — operating loop, hard defaults/rejects, branch pointers
- `references/discovery-checklist.md` — explore/reuse gate + Registry
- `references/patterns.md` — named patterns + first-party server table
- `references/host-matrix.md` — Cursor, Claude Code, ChatGPT/OpenAI, VS Code/Copilot, Vercel, Linear
- `references/spec-2026-07-28.md` — protocol deltas, caching, annotations, dual-era
- `references/build-server.md` — build/publish/tool-design/smoke-test defaults

## Complements

Security allow-list, auto-approve, HITL, and token-passthrough rules live in the `ai-security` skill—this skill links them and does not duplicate them.

## Attribution

Facts are grounded in primary sources recorded in `docs/research/mcp.md` (MCP.org 2026-07-28 docs, host vendor docs, Cloudflare/Google migration posts, 2026-11-22 company-patterns refresh). Prior-art skills (e.g. Anthropic `build-mcp-server`, Apache-2.0) were reviewed for gaps only; their bodies are not copied here.

## License

MIT
