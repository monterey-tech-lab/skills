# Research: mcp

Date: 2026-11-22 (refresh) · Original: 2026-11-21 · Purpose: Host-correct MCP client setup and language-agnostic server build/publish against 2026-07-28 · Recommendation: **extend mcp**

## Changes since 2026-11-21

Refresh focused on **how leading companies implement MCP**, industry **best practices / patterns**, and a **gap matrix** vs shipped `skills/mcp` v0.1.0. Prior host/protocol/baseline findings below still hold unless noted.

**Decision update:** original recommendation was **build** (skill now exists). Refresh recommendation is **extend mcp** — keep the operating loop and host matrix; add named patterns, first-party server recipes, VS Code/Copilot hosts, richer tool-design/caching/Registry/MCP Apps·MCPB guidance. Do not create a second skill.

**What changed in the evidence base:**
- Company implementations documented for Anthropic, OpenAI, Cursor, Cloudflare, Google Cloud MCP, Vercel, Linear, plus first-party servers: GitHub, Notion, Stripe, Microsoft Learn / VS Code Copilot, Shopify (stdio-local), Atlassian v2, Slack.
- Prior-art delta: `tenequm/mcp-best-practices`, GitHub awesome-copilot `typescript-mcp-server-generator`, Cloudflare Workers MCP skill, others — monterey still unique on multi-host wrong-premise + eval gate, but thin on production DX patterns those skills encode.
- Google Cloud MCP overview is **aligned** with 2026-07-28 as of 2026-11-22 (earlier caveat about “stdio+SSE only” overview applies mainly to older consumer explainers, not `docs.cloud.google.com/mcp`).
- Auth is **not** one recipe: CIMD preferred (spec/Vercel/Cloudflare); Slack and GitHub remote **reject DCR**; Linear still documents DCR; Claude supports multiple OAuth modes.
- New agent mistakes to prevent in a future extend: omit annotations; wrong Copilot config path; scaffold TS on retired monolithic SDK; `cacheScope: public` on user-scoped lists; discover only via mcpmarket; MCPB/Apps for plain cloud APIs.

**Still true from 2026-11-21:** sessionless Streamable HTTP default; host-native config shapes; reuse-first official URLs; `ai-security` owns allow-list/HITL; baseline failures on Redis sessions / Cursor-via-mcp-remote / Skills conflation.

## 1. Question / proposed scope

**Proposed skill name:** `mcp`

**Question:** Should monterey-tech-lab/skills publish a new **simple** Agent Skill (`SKILL.md` + `references/`) that teaches engineers and agents to discover required MCP capabilities, configure clients on the correct host paths/commands, select and pin servers, build/publish servers (SDK + transport choices), and smoke-test against the **2026-07-28** specification—without duplicating `ai-security` allow-list / HITL / auto-approve policy?

**Audience:** Engineers wiring agents into any project stack, or shipping MCP servers/connectors.

**In scope (agreed branches):**
1. **Discover** — product/host, required capabilities (tools / resources / prompts / sampling), transport needs
2. **Configure client** — host-correct config files/commands (Cursor, Claude Code, Claude connectors, OpenAI/ChatGPT MCP, Vercel MCP, Linear MCP, others)
3. **Select & pin servers** — reuse vs build; pin versions; auth/env patterns without secrets in chat
4. **Build/publish server** — SDK choice, transports (stdio / Streamable HTTP; legacy SSE only as host delta), Agent Skills + MCP intersection per 2026-07-28 docs
5. **Validate & smoke-test** — match spec/changelog + host deltas; verify tools list and a real call per host
6. **Wrong premise** — correct outdated formats (pre-2026-07-28), wrong host config paths, or conflating security setup with capability setup

**Out of scope:** SaaS AppSec (`security`); Swift platform rules (`swift`); security policy catalogues / allow-list / auto-approve / HITL (link `ai-security`); inventing host features not in primary docs; offense/red-team PoCs.

**Overlap decision (agreed):** Do **not** extend `ai-security`. That skill owns MCP allow-list, no token passthrough, HITL, and the `references/mcp-and-agent-checklist.md` security checklist. This skill owns capability/setup/build/publish/smoke-test and cross-links `ai-security` for security gates.

**Skill type planned:** simple (progressive disclosure via `references/` for host-specific recipes).

**Repo context today:** Published skills include `ai-security` (rule `context-mcp-allowlist` + MCP checklist citing **2025-11-25** security docs), `security`, `swift`, `craft-and-taste`. No existing monterey skill covers multi-host MCP client wiring or 2026-07-28 server authoring.

---

## 2. Prior art

| Skill | Repo / listing | Installs (skills.sh / secondary, accessed 2026-11-21) | Covers | Misses (vs proposed `mcp`) | License |
|---|---|---|---|---|---|
| `build-mcp-server` (+ `build-mcp-app`, `build-mcpb`) | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) · [skills.sh](https://www.skills.sh/anthropics/claude-plugins-official/build-mcp-server) · official MCP docs point here | ~7.8K / ~7.5K / ~7.3K; pack ~198.6K total | Strong **server** discovery → deployment path (remote Streamable HTTP / MCP Apps / MCPB / local stdio); Claude-specific auth/limits | Claude-first; not multi-host **client** config matrix; not Cursor/OpenAI/Vercel/Linear recipes; not “wrong premise” host-path corrections | **Apache-2.0** (cite; do not paste bodies) |
| `mcp-integration` | same Anthropic pack · [skills.sh](https://www.skills.sh/anthropics/claude-plugins-official/mcp-integration) | ~8.1K | Claude Code **plugin** MCP wiring (`.mcp.json` / `plugin.json`, stdio + remote, env, `/mcp` debug) | Plugin-centric, not general IDE/host matrix; still mentions SSE/WebSocket shapes; not server build or 2026-07-28 protocol deltas | **Apache-2.0** |
| `mcp-typescript-sdk-skills` | [modelcontextprotocol/typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk) · [skills.sh](https://www.skills.sh/modelcontextprotocol/typescript-sdk/mcp-typescript-sdk-skills) | Listed; install count not a top leader for this query | **Skills-over-MCP** extension APIs in TS SDK v2 (`ext/skills`) | Narrow SDK extension; not host setup or language-agnostic server publish | Check repo LICENSE before adaptation (official SDK) |
| `mcp-server-building` | [jpeetz/agent-skills](https://www.skills.sh/jpeetz/agent-skills/mcp-server-building) | Low (repo ~19★; first seen ~7 days before access) | Explicitly targets **2026-07-28** stateless server build; warns pre-2026 tutorials are obsolete | Server-only; thin/no multi-host client matrix; not monterey eval-gated | Verify before adaptation |
| `mcp-developer` | [saeed-vayghan/gemini-agent-skills](https://www.skills.sh/saeed-vayghan/gemini-agent-skills/mcp-developer) | Niche; repo ~59★ | Persona/checklist for MCP server+client “senior developer” | Generic checklist; not host-correct paths; not 2026-07-28-specific | Verify before adaptation |
| `mcp-server` | [black141312/ada](https://www.skills.sh/black141312/ada/mcp-server) | Niche | Compact stdio/HTTP server scaffold + smoke-test reminder | Short howto; may lag transport naming; not multi-host | Verify before adaptation |
| `opencode-mcp-server-setup` | [ericmjl/skills](https://www.skills.sh/ericmjl/skills/opencode-mcp-server-setup) | Niche | **One host** (OpenCode) local vs remote config gotchas | OpenCode-only | Verify before adaptation |
| `create-mcp-skill` | [cygnusfear/agent-skills](https://www.skills.sh/cygnusfear/agent-skills/create-mcp-skill) | Niche (first seen 2026-02-13) | Creating Agent Skills that **consume** MCP tools (MCP CLI patterns) | Skill-authoring around MCP, not MCP itself | Verify before adaptation |
| `build-mcp-use-client` | [yigitkonur/skills-by-yigitkonur](https://www.skills.sh/yigitkonur/skills-by-yigitkonur/build-mcp-use-client) | Niche | Deterministic **mcp-use** TypeScript client SDK | Library-specific, not host config | Verify before adaptation |
| Existing monterey `ai-security` → `context-mcp-allowlist` + `references/mcp-and-agent-checklist.md` | this repo | N/A (product skill) | Allow-list, pin versions, least-privilege env, no auto-approve `*`, no token passthrough | Intentionally **security-only**; cites 2025-11-25 MCP security docs; no host setup matrix, no server SDK/transport authoring, no 2026-07-28 protocol migration | MIT (repo) |

**Secondary directories (not skills):** [mcpmarket.com](https://mcpmarket.com/) catalogs servers/clients/skills for discovery; prefer official first-party endpoints over third-party proxies when selecting servers.

**Hard boundary:** Summarize only. Do **not** paste third-party skill bodies. Prefer MCP.org / vendor primary docs. Apache-2.0 Anthropic skills may inform structure with attribution; do not republish their scaffolds.

---

## 3. Current facts (with sources)

Accessed **2026-11-21** unless noted.

### Protocol identity & architecture
- MCP is an open standard for connecting AI applications to external systems (data, tools, workflows). Hosts include Claude, ChatGPT, VS Code, Cursor, and others. ([intro](https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro))
- Architecture: **host** (AI app) contains **client(s)** that connect to **server(s)** over a transport using JSON-RPC 2.0. Servers expose tools, resources, and prompts. ([Google Cloud overview](https://cloud.google.com/discover/what-is-model-context-protocol); [Claude connectors orientation](https://claude.com/docs/connectors/building/mcp); [Vercel MCP FAQ](https://vercel.com/docs/mcp))
- Official org: [github.com/modelcontextprotocol](https://github.com/modelcontextprotocol) — reference servers, SDKs, Inspector, registry, specification repo.

### Spec revision 2026-07-28 (major deltas vs 2025-11-25)
- **Stateless core:** remove protocol-level sessions and `Mcp-Session-Id` from Streamable HTTP; list endpoints no longer vary per-connection; cross-call state uses explicit server-minted handles as tool args (SEP-2567). ([changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog); [Cloudflare MCP v2](https://blog.cloudflare.com/mcp-v2/); [Google Developers Blog](https://developers.googleblog.com/scaling-ai-agent-infrastructure-with-the-mcp-stateless-updates/); [Claude announcement](https://claude.com/resources/articles/bringing-mcp-2026-07-28-to-claude))
- **No initialize handshake:** every request carries protocol version and client capabilities in `_meta` (`io.modelcontextprotocol/protocolVersion`, `io.modelcontextprotocol/clientCapabilities`); clients SHOULD send `clientInfo`; servers SHOULD return `serverInfo`; version mismatches → `UnsupportedProtocolVersionError` (SEP-2575). ([changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog))
- **`server/discover`:** servers MUST implement this RPC to advertise supported versions, capabilities, and identity (SEP-2575). ([changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog))
- **Subscriptions:** replace HTTP GET + `resources/subscribe` with `subscriptions/listen` (SEP-2575). ([changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog))
- **Removed:** `ping`, `logging/setLevel`, `notifications/roots/list_changed`; log level per-request via `_meta` `io.modelcontextprotocol/logLevel`. ([changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog))
- **Tasks** moved to official extension `io.modelcontextprotocol/tasks` (SEP-2663). ([changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog); [roadmap](https://blog.modelcontextprotocol.io/posts/mcp-roadmap/))
- **Multi Round-Trip Requests (MRTR):** replaces server-initiated requests (roots/list, sampling/createMessage, elicitation/create) with `InputRequiredResult` (`resultType: "input_required"`) + retry with `inputResponses` (SEP-2322). All results require `resultType` (`"complete"` | `"input_required"`). ([changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog); [Cloudflare](https://blog.cloudflare.com/mcp-v2/))
- **Streamable HTTP headers:** require `Mcp-Method`, `Mcp-Name` on POST; optional custom headers via `x-mcp-header` (SEP-2243). ([changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog); [Google](https://developers.googleblog.com/scaling-ai-agent-infrastructure-with-the-mcp-stateless-updates/))
- **Caching:** list/read results require `ttlMs` and `cacheScope` (`public`|`private`) (SEP-2549); tools/list SHOULD be deterministically ordered. ([changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog))
- **Auth hardening:** RFC 9207 `iss` validation; issuer-bound client credentials; CIMD preferred over DCR (DCR deprecated) (SEP-2468, SEP-2352, PR #2858). ([changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog); [Cloudflare](https://blog.cloudflare.com/mcp-v2/))
- **Deprecated (Active → Deprecated → Removed, ≥12 months):** Roots, Sampling, Logging; HTTP+SSE transport; `includeContext` `"thisServer"`/`"allServers"`; OAuth DCR for new implementations. ([changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog))
- **Roadmap after 2026-07-28:** agentic messaging, HTTP-native transport unification (including local Streamable HTTP over stdio), agent identity / DPoP / WIF, progressive tool discovery, SDK DX. ([roadmap post](https://blog.modelcontextprotocol.io/posts/mcp-roadmap/), dated 2026-08-22)

### Official SDKs
- Tiered SDKs (Tier 1: TypeScript, Python, C#, Go, Rust, Ruby; Tier 2: Java; Tier 3: Swift, PHP, Kotlin). SDKs adopt revisions on their own schedules—check each SDK’s supported revisions. ([SDK page](https://modelcontextprotocol.io/docs/2026-07-28/sdk))
- TS v2 splits packages (`@modelcontextprotocol/server`, `@modelcontextprotocol/client`); Cloudflare notes `createMcpHandler` graduated into the official TS SDK; Agents SDK wraps Worker defaults. ([SDK page](https://modelcontextprotocol.io/docs/2026-07-28/sdk); [Cloudflare](https://blog.cloudflare.com/mcp-v2/); [Google migration notes](https://developers.googleblog.com/scaling-ai-agent-infrastructure-with-the-mcp-stateless-updates/))
- Inspector / debugging tools are first-class for smoke-testing. ([docs index](https://modelcontextprotocol.io/llms.txt) → Inspector)

### Agent Skills ∩ MCP
- Official docs: use Agent Skills (`mcp-server-dev` plugin: `build-mcp-server`, `build-mcp-app`, `build-mcpb`) to guide server design; install via Claude plugin marketplace or copy skill dirs. Discovery before code; four deployment paths (remote Streamable HTTP default for cloud APIs; MCP Apps; MCPB; local stdio). ([build-with-agent-skills](https://modelcontextprotocol.io/docs/2026-07-28/develop/build-with-agent-skills))
- Skills extension (`io.modelcontextprotocol/skills`): servers can publish Agent Skills via resources (`skill://…`), with `skills/list` / `skills/get`. ([docs index](https://modelcontextprotocol.io/llms.txt); [ext-skills beta](https://github.com/modelcontextprotocol/ext-skills/blob/main/specification/beta/skills.mdx); [TS SDK skills skill](https://www.skills.sh/modelcontextprotocol/typescript-sdk/mcp-typescript-sdk-skills))
- **Implication for this skill:** teach when to *use* Anthropic/MCP.org server-dev skills vs when monterey `mcp` owns host wiring; do not fork Anthropic scaffolds.

### Host client configuration (capability setup)

| Host | Primary config / command | Notes (sourced) |
|---|---|---|
| **Cursor** | Project: `.cursor/mcp.json`; Global: `~/.cursor/mcp.json`; Marketplace / Customize UI | Transports: `stdio`, `SSE`, `Streamable HTTP`. Stdio: `command`/`args`/`env`/`envFile`. Remote: `url` + optional `headers` / static OAuth `auth`. Interpolation: `${env:NAME}`, `${workspaceFolder}`, etc. OAuth callbacks: `https://www.cursor.com/agents/mcp/oauth/callback`, `http://localhost:8787/callback`. Debug: Output → “MCP Logs”. ([Cursor MCP docs](https://cursor.com/docs/mcp)) |
| **Claude Code** | CLI: `claude mcp add …`; scopes → `local` (`~/.claude.json` per project), `project` (`.mcp.json` at repo root), `user` (`~/.claude.json` top-level `mcpServers`). In-session: `/mcp` | Example HTTP: `claude mcp add --transport http <name> <url>`. Stdio: `claude mcp add <name> -- <command>…`. Verify: `claude mcp list` / `claude mcp get`. **Wrong paths to reject:** `~/.claude/.mcp.json`, `~/.claude/config/mcp.json`, `~/.claude/mcp.json`, `%APPDATA%\Claude\mcp.json`. Project `.mcp.json` needs restart + approval. `MCP_TIMEOUT` for slow `npx` first runs. Pre-v2.1.302: missing `resultType`/`ttlMs`/`cacheScope` on 2026-07-28 servers → tools fetch failed. ([Claude Code MCP quickstart](https://code.claude.com/docs/en/mcp-quickstart)) |
| **Claude.ai / Claude Desktop connectors** | Connectors UI; Claude Desktop may use `claude_desktop_config.json` (import via `claude mcp add-from-claude-desktop`) | Remote/local connectors; tool annotations `readOnlyHint` / `destructiveHint` required for Claude. Directory ~950+ servers noted in Anthropic article. ([Claude MCP orientation](https://claude.com/docs/connectors/building/mcp); [2026-07-28 Claude article](https://claude.com/resources/articles/bringing-mcp-2026-07-28-to-claude); [Claude Code surfaces](https://code.claude.com/docs/en/mcp-quickstart)) |
| **OpenAI / ChatGPT** | ChatGPT: Plugins → Add custom MCP server; API: Responses API `tools: [{ type: "mcp", server_url, … }]` | Remote MCP; deep research / company knowledge expect `search` + `fetch` tools with `structuredContent` + JSON text content; prefer Streamable HTTP / documented SSE paths per sample; OAuth + CIMD recommended. ([OpenAI MCP docs](https://developers.openai.com/api/docs/mcp)) |
| **Vercel (as host tooling)** | Official server: `https://mcp.vercel.com`; `npx -y add-mcp https://mcp.vercel.com` / `-g`; Cursor snippet `url`; Claude Code `claude mcp add --transport http vercel https://mcp.vercel.com` then `/mcp` | Implements latest Auth + Streamable HTTP. Building servers: `mcp-handler` on Vercel; Streamable HTTP for remote; `mcp-remote` proxy if client is stdio-only. ([Vercel MCP](https://vercel.com/docs/agent-resources/vercel-mcp); [Vercel docs/mcp](https://vercel.com/docs/mcp)) |
| **Linear** | Official: `https://mcp.linear.app/mcp` (read-write); read-only: `/mcp/readonly` or `read` OAuth scope; legacy SSE: `/sse` deprecated | Claude Code: `claude mcp add --transport http linear-server https://mcp.linear.app/mcp`. Many clients: `npx -y mcp-remote https://mcp.linear.app/mcp`. Bearer API key / OAuth supported. ([Linear MCP](https://linear.app/docs/mcp)) |

### Transports (skill-default guidance)
- **stdio:** local subprocess; host manages lifecycle; single-user; never log to stdout (corrupts JSON-RPC). ([Cursor](https://cursor.com/docs/mcp); [Claude Code](https://code.claude.com/docs/en/mcp-quickstart); server best practices in community skills)
- **Streamable HTTP:** preferred remote transport for 2026-07-28; single endpoint, POST JSON-RPC; optional SSE stream per response. ([Vercel](https://vercel.com/docs/mcp); [changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog); [Cloudflare](https://blog.cloudflare.com/mcp-v2/))
- **HTTP+SSE (legacy):** deprecated under feature lifecycle; some hosts (Cursor, Linear FAQ, older OpenAI samples) still document SSE for compatibility—treat as host delta, not the skill default for new servers. ([changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog); [Linear](https://linear.app/docs/mcp); [Cursor](https://cursor.com/docs/mcp))
- **Caveat:** Google Cloud’s educational “what is MCP” page still lists stdio + SSE as the two main transports and does **not** reflect Streamable HTTP / 2026-07-28—do not treat it as transport source of truth. ([Google Cloud](https://cloud.google.com/discover/what-is-model-context-protocol))

### Auth / env (capability patterns only; security detail → `ai-security`)
- Prefer env interpolation / host secret stores over literals in chat or committed JSON (`${env:…}`, Claude `--env`, Cursor `envFile` for stdio only). ([Cursor](https://cursor.com/docs/mcp); [Claude Code](https://code.claude.com/docs/en/mcp-quickstart))
- Remote OAuth: PKCE; resource indicators (RFC 8707); CIMD preferred; static client IDs when providers require redirect allowlists (Cursor `auth` block). ([Cursor](https://cursor.com/docs/mcp); [changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog); [Vercel CIMD notes](https://vercel.com/docs/agent-resources/vercel-mcp))
- Prefer first-party hosted endpoints (e.g. `mcp.linear.app`, `mcp.vercel.com`, vendor `mcp.*`) over unofficial proxies. ([OpenAI risks](https://developers.openai.com/api/docs/mcp); [Vercel security](https://vercel.com/docs/agent-resources/vercel-mcp))

### Overlap with monterey `ai-security`
- `context-mcp-allowlist` + checklist: vet source, pin package version, least-privilege creds, no OAuth token passthrough, no `autoApprove: ["*"]`, understand egress. References MCP Security Best Practices **2025-11-25** and OWASP MCP cheat sheet. ([rule](skills/ai-security/rules/context-mcp-allowlist.md); [checklist](skills/ai-security/references/mcp-and-agent-checklist.md))
- New `mcp` skill should **link** those for the security gate after capability setup; optionally note that security doc URLs may move under `/docs/2026-07-28/tutorials/security/…` per [llms.txt](https://modelcontextprotocol.io/llms.txt)—update `ai-security` separately if desired.

---

## 4. Common agent mistakes this skill must prevent

1. **Teaching pre-2026-07-28 sessionful HTTP** (`initialize` + `Mcp-Session-Id`, sticky sessions, Redis session stores) as current best practice — evidence: [changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog), [Google](https://developers.googleblog.com/scaling-ai-agent-infrastructure-with-the-mcp-stateless-updates/), [Cloudflare](https://blog.cloudflare.com/mcp-v2/).
2. **Wrong host config paths** — e.g. Claude Code `~/.claude/mcp.json` or Cursor project config outside `.cursor/mcp.json` — evidence: [Claude Code troubleshooting](https://code.claude.com/docs/en/mcp-quickstart), [Cursor docs](https://cursor.com/docs/mcp).
3. **Conflating security policy with capability setup** — auto-approve, allow-lists, HITL belong in `ai-security`; agents dump security lecture instead of fixing transport/config — evidence: agreed scope + existing `ai-security` ownership.
4. **Hardcoding secrets in `mcp.json` / chat** — evidence: [Cursor security section](https://cursor.com/docs/mcp); `ai-security` privacy rules.
5. **Unpinned `npx …@latest` community servers** — supply-chain / slopsquatting risk — evidence: `ai-security` allow-list examples; OWASP Secure Coding with AI (via `ai-security` research).
6. **Using deprecated HTTP+SSE or Roots/Sampling/Logging as defaults for new servers** — evidence: [changelog Deprecated](https://modelcontextprotocol.io/specification/2026-07-28/changelog).
7. **Assuming all hosts speak the same JSON shape / field names** — e.g. Windsurf `serverUrl`, OpenCode `type: remote`, Cursor `url`, Claude Code `type: http` — evidence: [Vercel client recipes](https://vercel.com/docs/agent-resources/vercel-mcp), [Linear](https://linear.app/docs/mcp), [OpenCode skill](https://www.skills.sh/ericmjl/skills/opencode-mcp-server-setup).
8. **Skipping smoke-test** (list tools + one real call) after add — evidence: [Claude Code quickstart](https://code.claude.com/docs/en/mcp-quickstart) status table; community `mcp-server` skill pattern.
9. **Logging to stdout on stdio servers** — corrupts the protocol stream — evidence: community MCP server skills; Inspector/debugging docs.
10. **Treating Google Cloud “what is MCP” SSE guidance or outdated blog samples as current remote transport default** — evidence: contrast [Google Cloud](https://cloud.google.com/discover/what-is-model-context-protocol) vs [changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog) / [Vercel](https://vercel.com/docs/mcp).
11. **Ignoring host protocol lag** — Claude Code note that older versions fail tool fetch when 2026-07-28 servers omit `resultType`/`ttlMs`/`cacheScope` — evidence: [Claude Code quickstart](https://code.claude.com/docs/en/mcp-quickstart).
12. **Building a custom server when a first-party remote MCP already exists** — evidence: Linear/Vercel/OpenAI “prefer official endpoint” guidance.

---

## 5. Gaps this skill fills

- **No monterey skill** covers multi-host **client** configuration with correct paths/commands and a validation loop.
- Anthropic `build-mcp-server` / `mcp-integration` are excellent but **Claude-centric** and split server vs plugin-client; they are not a host-agnostic product skill for monterey’s install channel.
- `ai-security` covers **whether** to trust/allow a server, not **how** to wire Cursor vs Claude Code vs ChatGPT vs vendor remotes, nor how to implement 2026-07-28 servers.
- Few prior-art skills simultaneously: (a) pin 2026-07-28 as truth, (b) teach wrong-premise corrections, (c) include smoke-test per host, (d) link security without duplicating it.
- Practitioner sources (Cloudflare, Google) document production migration pain that agents still reproduce from stale tutorials.

---

## 6. Proposed scope

- **Branches:** Discover → Configure client → Select & pin → Build/publish → Validate & smoke-test → Wrong premise (as decision tree in `SKILL.md`; host recipes in `references/`).
- **Out of scope:** SaaS AppSec; Swift rules; security policy catalogues; inventing undocumented host features; offense.
- **Candidate skill type:** **simple** — workflow + host matrices + protocol deltas fit progressive disclosure better than many incorrect/correct rule files; security examples already live in `ai-security`.
- **Cross-links:** `ai-security` (allow-list, HITL, secrets); optionally Anthropic `build-mcp-server` / MCP Inspector for deep Claude server scaffolds and interactive testing.
- **References candidates:** `hosts-cursor.md`, `hosts-claude-code.md`, `hosts-openai-chatgpt.md`, `hosts-vercel-linear.md` (or one `hosts.md` with TOC), `protocol-2026-07-28.md`, `build-and-publish.md`, `smoke-test.md`.

---

## 7. Decision

**2026-11-21:** **build** a new simple skill `mcp` (done — v0.1.0 shipped).

**2026-11-22 refresh:** **extend mcp**.

**Rationale:** Eval-critical paths (host config, sessionless default, reuse gate, Skills distinction) are solid. Industry practice now documents company-specific auth/URL/tool patterns, VS Code/Copilot hosts, Registry discovery, annotations, caching semantics, MCP Apps/MCPB packaging, and TS SDK v2 pins that v0.1.0 omits or only one-lines. A separate monterey skill would duplicate; `ai-security` remains the policy boundary. Prefer new `references/patterns.md` + thicken existing references over a rewrite.

---

## Baseline failures

Recorded from `evals/mcp/runs/2026-11-21-baseline/` (no skill). These are skill requirements:

1. **Eval 3 (wrong premise) — still ships sessionful Redis + `Mcp-Session-Id`:** Baseline rejected legacy dual-endpoint SSE and `~/.claude/mcp.json`, and refused blanket auto-approve, but **still implemented** initialize handshake + Redis session store as “production Streamable HTTP.” Skill must treat sessionless 2026-07-28 as a hard default, not an optional note beside Redis sessions.
2. **Eval 5 (Linear commands) — Cursor wired via `mcp-remote` only:** Baseline gave correct `claude mcp add --transport http … https://mcp.linear.app/mcp` and stdio `mcp-remote`, but Cursor project JSON used stdio `mcp-remote` instead of native `"url": "https://mcp.linear.app/mcp"`. Skill host matrix must assign **native remote `url` for Cursor** and reserve `mcp-remote` for stdio-only clients.
3. **Eval 2 (build vs reuse) — jumps to custom server:** Baseline correctly chose Streamable HTTP + `search`/`fetch` for ChatGPT, but led with “build a thin custom server” rather than a reuse-first gate (first-party remote MCP when it covers the need). Skill must force discover/reuse before SDK scaffolding.
4. **Eval 1 (multi-host) — mostly strong; tighten verify loop:** Paths/URLs were largely correct; skill should still enforce a single checklist: host paths → official endpoints → env/OAuth (no secrets in JSON) → list tools + one real call, and call out Claude Code `"type": "http"` vs Cursor `"url"` shape difference as a hard rule.
5. **Eval 4 (Skills + stateless) — conflation risk:** Baseline covered the Skills *extension* well; skill must also separate **Agent Skills used to author servers** (`build-mcp-server` / mcp-server-dev) from **servers publishing skills** (`io.modelcontextprotocol/skills`), and keep `server/discover` + `resultType` as required wire facts.
6. **Cross-cutting:** Baseline sometimes mixes security lecture with capability setup; skill must link `ai-security` for allow-list/auto-approve and stay on config/build/smoke-test.

---

## 8. Company MCP implementations (2026-11-22)

Primary-sourced host + first-party server patterns. Full detail was gathered for the refresh; condensed here for the skill author.

### Host / platform summary

| Company | Role | Transport default | Auth flavor | Config UX highlights |
|---|---|---|---|---|
| **Anthropic** | Host (Claude.ai / Desktop / Code) + connector directory | Remote Streamable HTTP; Claude Code also stdio; SSE deprecated | OAuth modes include DCR, CIMD, Anthropic-held creds, static headers; Enterprise Managed Auth | Connectors UI; `claude mcp add --transport http`; `.mcp.json` needs `"type":"http"`; `/mcp` debug. Remote Claude connectors egress from Anthropic cloud (not user LAN) |
| **OpenAI** | Host (Responses API, ChatGPT custom MCP) | Streamable HTTP or SSE for `type: mcp` tools | OAuth token resent each Responses call (`authorization`); Secure MCP Tunnel for private servers | `server_url`, `require_approval`, `allowed_tools`; Deep Research requires `search` + `fetch` |
| **Cursor** | Host + marketplace | stdio / SSE (legacy) / Streamable HTTP | OAuth PKCE; static `auth` when DCR unavailable; `headers` for keys | `.cursor/mcp.json` + Marketplace; MCP Logs |
| **Cloudflare** | Build platform (Workers) + product MCPs | Stateless Streamable HTTP via `createMcpHandler` | workers-oauth-provider; CIMD preferred | Dual-compat `/mcp`; migrate off sessionful `McpAgent` |
| **Google Cloud** | Host ecosystem + first-party Google/Cloud MCP servers | Remote HTTP; overview targets **2026-07-28** | Google credentials / IAM `mcp.toolUser` for **Cloud** servers only | Agent Registry; **toolsets** as separate endpoints to shrink tool lists; Model Armor |
| **Vercel** | First-party `https://mcp.vercel.com` + `mcp-handler` | Streamable HTTP | OAuth; **CIMD** for unreviewed clients (changelog 2026-11-02) | `npx add-mcp`; per-client recipes |
| **Linear** | First-party `https://mcp.linear.app/mcp` | Streamable HTTP; `/sse` deprecated | OAuth 2.1 with DCR; API key escape; read-only URL/scope | Native installers + `claude mcp add`; `mcp-remote` for stdio-only |

### First-party servers (primary docs exist)

| Vendor | Endpoint / form | Notes |
|---|---|---|
| **GitHub** | `https://api.githubcopilot.com/mcp/` | OAuth+PKCE preferred; remote **no DCR**; also local Docker/binary; Google blog cites Redis-session removal after 2026-07-28 upgrade |
| **Notion** | `https://mcp.notion.com/mcp` | OAuth + Business MCP tokens; legacy SSE retires **2026-02-23** |
| **Stripe** | `https://mcp.stripe.com` | OAuth or Agent API keys; prefixed tools; Dashboard human confirmation for some writes; OAuth refresh window **14 days** |
| **Microsoft / VS Code** | Host: `.vscode/mcp.json` uses `"servers"`; Learn MCP `https://learn.microsoft.com/api/mcp` (no auth) | Copilot gallery; config key names differ from Cursor |
| **Shopify** | **stdio only** `@shopify/dev-mcp` — no remote SaaS URL | Prefer AI Toolkit plugin; do not invent `mcp.shopify.com` |
| **Atlassian** | `https://mcp.atlassian.com/v2/mcp` | OAuth 2.1; v1→v2 migration; clear cached clientIds if auth breaks |
| **Slack** | `https://mcp.slack.com/mcp` | Streamable HTTP only; **no SSE, no DCR**; static Cursor `auth.CLIENT_ID`; workspace admin approval |

### Recurring company patterns

1. Canonical vendor hostname (`mcp.<vendor>…` or product-specific host)
2. Streamable HTTP first; SSE as deprecated bridge
3. OAuth interactive + bearer/API-key escape hatch
4. CIMD preferred where available — but DCR not universal (Slack/GitHub reject it)
5. Host-shaped JSON (`mcpServers` vs `type`+`url` vs `servers` vs `server_url`)
6. `mcp-remote` only for stdio-only / awkward hosts
7. Marketplace / `add-mcp` / vendor CLI over hand-rolled JSON
8. Least-privilege surfaces (read-only URL, toolsets, `allowed_tools`, human confirmation)
9. Prefixed or fixed tool catalogs (`stripe_*`, OpenAI `search`/`fetch`)
10. Stateless deploy defaults (Cloudflare handler, Google Cloud Run)

### Divergences agents must not paper over

- Claude.ai remote connectors cannot reach private LAN URLs; Cursor/stdio can
- Redirect URI families differ per host
- DCR assumption breaks Slack and GitHub remote
- Copying Cursor JSON into VS Code / Claude Code without renaming fields fails
- SSE “still works” on some hosts ≠ correct **new server** default
- OpenAI must resend `authorization` every Responses call
- Approval is multi-layer (host HITL + vendor Dashboard confirmation + admin app approval)
- Shopify is local/authless; Google Cloud IAM ≠ Google consumer MCP

Sources for this section: see § Sources → Company refresh (2026-11-22).

---

## 9. Pattern catalog (2026-11-22)

| Pattern | Definition | Primary source |
|---|---|---|
| Reuse-first official remote URL | Prefer first-party HTTPS MCP before scaffolding | OpenAI / Linear / Vercel docs; monterey `SKILL.md` |
| Sessionless Streamable HTTP | No protocol sessions / `Mcp-Session-Id`; handles for app state | Spec changelog; Cloudflare; Google |
| Host-native config shapes | Never copy field names across hosts | Cursor; Claude Code; VS Code Copilot |
| Progressive tool disclosure | Hosts inject tool defs after search/inspect | MCP client best practices; roadmap |
| Tool annotations as risk vocabulary | `readOnlyHint` / `destructiveHint` (hints ≠ enforcement); Claude requires first two | Claude connectors; annotations blog |
| OpenAI search + fetch | Deep Research: `search`/`fetch` + `structuredContent` + canonical `url` | OpenAI MCP docs |
| CIMD over DCR | New OAuth clients prefer CIMD | Spec changelog; auth tutorial; Vercel |
| Pin versions / no `@latest` | Pin stdio packages and bridges | monterey + `ai-security` |
| Inspector + list + one-call smoke | Inspector (`--protocol-era modern`) then host list + one call | MCP Inspector docs |
| stderr-only logging (stdio) | stdout is JSON-RPC only | Spec stdio transport |
| Skills extension vs authoring skills | `build-mcp-server` ≠ `io.modelcontextprotocol/skills` | MCP build-with-agent-skills; Skills extension |
| `server/discover` + `resultType` | MUST discover; `complete` \| `input_required` | Spec changelog |
| List/read caching hints | `ttlMs` + `cacheScope`; never `public` on user-scoped data | Spec caching utility |
| Streamable HTTP method headers | `Mcp-Method` / `Mcp-Name` on POST | Spec changelog SEP-2243 |
| Schema-first tools + `outputSchema` | Zod/Pydantic source of truth; declare outputs | OpenAI; client best practices |
| TS SDK v2 package split | `@modelcontextprotocol/server` (+ adapters); Zod 4.2+; not retired monolithic v1 as first recipe | SDK page; awesome-copilot generator |
| Dual-era awareness | Much production still 2025-11-25; negotiate | tenequm mcp-best-practices; Claude Code lag notes |
| Official Registry metadata | Discover/publish via MCP Registry; hosts use aggregators | Registry about |
| MCP Apps when UI-in-chat wins | Interactive HTML in-host when exploration beats text | MCP Apps overview |
| MCPB only for must-run-local | `.mcpb` for local/filesystem/firewall; remote HTTP for cloud APIs | Claude MCPB docs |
| Security handoff | Allow-list / HITL / no autoApprove* → `ai-security` | monterey boundary; MCP security tutorials |

---

## 10. Gap matrix vs `skills/mcp` v0.1.0

| Industry practice | Covered? | Path if partial | Suggested change |
|---|---|---|---|
| Reuse-first / sessionless HTTP / core host matrix | **yes** | `SKILL.md`, `host-matrix.md`, `spec-…`, `build-server.md` | Keep |
| Named pattern / company synthesis | **no** | — | Add `references/patterns.md` (+ optional first-party servers appendix) |
| Tool design (schema, `outputSchema`, annotations, order) | **partial** | `build-server.md`, Claude note in `host-matrix.md` | Expand defaults; annotations required |
| Caching semantics (`public` vs `private`) | **partial** | Field names in `spec-…` / `build-server.md` | Document wrong `public` on user-scoped lists |
| Gateway headers | **partial** | `spec-…` | Incorrect/correct example in build path |
| Official Registry | **no** | discovery only mentions mcpmarket secondary | Point reuse/publish to Registry |
| Auth capability recipes (CIMD/PRM/Inspector OAuth) | **partial** | CIMD prefer one-liners | Short capability-auth subsection; policy stays `ai-security` |
| VS Code / Copilot hosts | **no** | — | Rows in `host-matrix.md` (`servers` key; Copilot paths) |
| Progressive discovery | **no** | — | Thin pointer for server authors / host builders |
| MCP Apps / MCPB decisioning | **partial** | Bullets in `build-server.md` | Decision table; link official overviews |
| Inspector CLI modern era | **partial** | Optional mention | Promote into publish checklist |
| TS SDK v2 pins / Zod 4 | **no** | Generic Tier-1 SDK | Default TS stack; reject monolithic v1 as first recipe |
| Dual-era warning | **partial** | Claude Code field-lag | Generalize in hard defaults |
| Programmatic tool calling / code mode | **no** | — | Out of scope for v0.x; optional one-line pointer |
| Security allow-list / HITL | **yes** (handoff) | `SKILL.md` → `ai-security` | Keep boundary |

### Additional mistakes not yet prevented by skill body

1. Omitting or treating annotations as enforcement — [Claude connectors](https://claude.com/docs/connectors/building/mcp); [annotations blog](https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/)
2. Wrong Copilot/VS Code config destination — [VS Code MCP configuration](https://code.visualstudio.com/docs/agents/reference/mcp-configuration)
3. Scaffolding TS on retired monolithic `@modelcontextprotocol/sdk` + SSE — awesome-copilot generator vs old samples
4. `cacheScope: "public"` on user-scoped lists/reads — [caching utility](https://modelcontextprotocol.io/specification/2026-07-28/server/utilities/caching)
5. Discovering only via mcpmarket / random GitHub — [Registry](https://modelcontextprotocol.io/registry/about)
6. Choosing MCPB or MCP Apps for a plain cloud API — [Claude MCPB](https://claude.com/docs/connectors/building/mcpb)
7. Smoke-test without modern Inspector era / without OpenAI citation URLs — [Inspector](https://modelcontextprotocol.io/docs/2026-07-28/tools/inspector); OpenAI MCP docs
8. Host that dumps hundreds of tools into context (no progressive discovery) — [client best practices](https://modelcontextprotocol.io/docs/2026-07-28/develop/clients/client-best-practices)

---

## 11. Outdated / thin skill paths (for follow-up extend)

| Path | Issue |
|---|---|
| [`skills/mcp/SKILL.md`](skills/mcp/SKILL.md) | No pattern catalog; description omits VS Code/Copilot; no SDK v2 / annotations hard defaults |
| [`skills/mcp/references/discovery-checklist.md`](skills/mcp/references/discovery-checklist.md) | No official Registry; thin progressive-discovery awareness |
| [`skills/mcp/references/host-matrix.md`](skills/mcp/references/host-matrix.md) | Missing VS Code/Copilot; annotations Claude-only |
| [`skills/mcp/references/spec-2026-07-28.md`](skills/mcp/references/spec-2026-07-28.md) | Thin caching semantics, annotations, progressive discovery |
| [`skills/mcp/references/build-server.md`](skills/mcp/references/build-server.md) | Thin Apps/MCPB decision, Inspector CLI, tool-design, TS v2 pins |
| [`skills/mcp/README.md`](skills/mcp/README.md) | Update when references grow |
| — | **Missing:** `references/patterns.md` (and optional first-party servers appendix) |

Eval-covered themes (sessionless, host paths, reuse, Skills conflation, Linear native `url`) are **not** outdated—only thin relative to industry DX.

---

## Sources

### Must-verify primary (accessed 2026-11-21)
- [MCP intro (2026-07-28)](https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro) — accessed 2026-11-21
- [MCP specification changelog (2026-07-28)](https://modelcontextprotocol.io/specification/2026-07-28/changelog) — accessed 2026-11-21
- [MCP SDKs (2026-07-28)](https://modelcontextprotocol.io/docs/2026-07-28/sdk) — accessed 2026-11-21
- [Build with Agent Skills (2026-07-28)](https://modelcontextprotocol.io/docs/2026-07-28/develop/build-with-agent-skills) — accessed 2026-11-21
- [modelcontextprotocol GitHub org](https://github.com/modelcontextprotocol) — accessed 2026-11-21
- [Google Cloud: What is MCP](https://cloud.google.com/discover/what-is-model-context-protocol) — accessed 2026-11-21
- [MCP roadmap blog (2026-08-22)](https://blog.modelcontextprotocol.io/posts/mcp-roadmap/) — accessed 2026-11-21
- [Cloudflare: The next generation of MCP](https://blog.cloudflare.com/mcp-v2/) — accessed 2026-11-21
- [Google Developers: MCP stateless updates](https://developers.googleblog.com/scaling-ai-agent-infrastructure-with-the-mcp-stateless-updates/) — accessed 2026-11-21
- [Claude: Bringing MCP 2026-07-28 to Claude](https://claude.com/resources/articles/bringing-mcp-2026-07-28-to-claude) — accessed 2026-11-21
- [MCP Market](https://mcpmarket.com/) — accessed 2026-11-21 (secondary directory)
- [OpenAI: Building MCP servers](https://developers.openai.com/api/docs/mcp) — accessed 2026-11-21
- [Claude Code: Connect to MCP servers](https://code.claude.com/docs/en/mcp-quickstart) — accessed 2026-11-21
- [Claude connectors: MCP orientation](https://claude.com/docs/connectors/building/mcp) — accessed 2026-11-21
- [Vercel MCP (official server)](https://vercel.com/docs/agent-resources/vercel-mcp) — accessed 2026-11-21
- [Vercel: Model Context Protocol](https://vercel.com/docs/mcp) — accessed 2026-11-21
- [Cursor: MCP](https://cursor.com/docs/mcp) — accessed 2026-11-21
- [Linear: MCP server](https://linear.app/docs/mcp) — accessed 2026-11-21

### Prior art / secondary (accessed 2026-11-21)
- [skills.sh: anthropics/claude-plugins-official](https://www.skills.sh/anthropics/claude-plugins-official) — `build-mcp-server`, `mcp-integration` install counts
- [skills.sh: mcp-typescript-sdk-skills](https://www.skills.sh/modelcontextprotocol/typescript-sdk/mcp-typescript-sdk-skills)
- [skills.sh: mcp-developer](https://www.skills.sh/saeed-vayghan/gemini-agent-skills/mcp-developer)
- [skills.sh: mcp-server-building](https://www.skills.sh/jpeetz/agent-skills/mcp-server-building)
- [skills.sh: create-mcp-skill](https://www.skills.sh/cygnusfear/agent-skills/create-mcp-skill)
- [skills.sh: opencode-mcp-server-setup](https://www.skills.sh/ericmjl/skills/opencode-mcp-server-setup)
- [skills.sh: mcp-server (ada)](https://www.skills.sh/black141312/ada/mcp-server)
- [MCP docs llms.txt index](https://modelcontextprotocol.io/llms.txt)
- [MCP Skills extension (beta)](https://github.com/modelcontextprotocol/ext-skills/blob/main/specification/beta/skills.mdx)
- monterey `skills/ai-security/rules/context-mcp-allowlist.md` and `references/mcp-and-agent-checklist.md` — local overlap check

### Company + practices refresh (accessed 2026-11-22)
- [Claude connector authentication](https://claude.com/docs/connectors/building/authentication)
- [Claude Code MCP](https://code.claude.com/docs/en/mcp)
- [OpenAI Responses MCP tools](https://developers.openai.com/api/docs/guides/tools-connectors-mcp)
- [Cloudflare createMcpHandler](https://developers.cloudflare.com/agents/model-context-protocol/apis/handler-api/)
- [Cloudflare MCP authorization](https://developers.cloudflare.com/agents/model-context-protocol/protocol/authorization/)
- [Google Cloud MCP overview](https://docs.cloud.google.com/mcp/overview)
- [Google Cloud MCP release notes](https://docs.cloud.google.com/mcp/release-notes)
- [Vercel CIMD changelog](https://vercel.com/changelog/vercel-mcp-now-supports-client-id-metadata-documents)
- [Deploy MCP servers to Vercel](https://vercel.com/docs/mcp/deploy-mcp-servers-to-vercel)
- [GitHub MCP setup](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/set-up-the-github-mcp-server)
- [GitHub MCP host-integration](https://github.com/github/github-mcp-server/blob/main/docs/host-integration.md)
- [Notion MCP get started](https://developers.notion.com/guides/mcp/get-started-with-mcp)
- [Stripe MCP](https://docs.stripe.com/mcp)
- [VS Code MCP servers](https://code.visualstudio.com/docs/agent-customization/mcp-servers/)
- [VS Code MCP configuration reference](https://code.visualstudio.com/docs/agents/reference/mcp-configuration)
- [Microsoft Learn MCP](https://learn.microsoft.com/en-us/training/support/mcp)
- [Shopify AI Toolkit](https://shopify.dev/docs/api/ai-toolkit)
- [Atlassian MCP v2](https://support.atlassian.com/atlassian-ai-gateway/docs/get-started-with-the-atlassian-remote-mcp-server/)
- [Slack MCP overview](https://docs.slack.dev/ai/slack-mcp-server/)
- [MCP Registry about](https://modelcontextprotocol.io/registry/about)
- [Client best practices](https://modelcontextprotocol.io/docs/2026-07-28/develop/clients/client-best-practices)
- [Security best practices tutorial](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices)
- [Authorization tutorial](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/authorization)
- [MCP Inspector](https://modelcontextprotocol.io/docs/2026-07-28/tools/inspector)
- [Caching utility](https://modelcontextprotocol.io/specification/2026-07-28/server/utilities/caching)
- [MCP Apps overview](https://modelcontextprotocol.io/extensions/apps/overview)
- [Tool annotations blog](https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/)
- [Claude MCPB](https://claude.com/docs/connectors/building/mcpb)
- [MCP Registry](https://registry.modelcontextprotocol.io/)
- [skills.sh: tenequm/mcp-best-practices](https://www.skills.sh/tenequm/skills/mcp-best-practices)
- [skills.sh: awesome-copilot typescript-mcp-server-generator](https://www.skills.sh/github/awesome-copilot/typescript-mcp-server-generator)
- [skills.sh: cloudflare building-mcp-server-on-cloudflare](https://www.skills.sh/cloudflare/cloudflare-docs/building-mcp-server-on-cloudflare)
