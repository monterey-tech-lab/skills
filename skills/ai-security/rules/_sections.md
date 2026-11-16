# Sections

This file defines all sections, their ordering, impact levels, and descriptions.
The section ID (in parentheses) is the filename prefix used to group rules.

---

## 1. Privacy and Context Hygiene (privacy)

**Impact:** CRITICAL
**Description:** Keep secrets, PII, and proprietary material out of AI chat and indexes. Use vendor-correct ignore/exclusion files and know retention/ZDR scope.

## 2. AI Codegen and Supply Chain (codegen)

**Impact:** CRITICAL
**Description:** Treat AI-generated code and dependency suggestions as untrusted. Verify packages exist, pin versions, and gate merges with SCA/SAST.

## 3. Prompt and Tool Context (context)

**Impact:** CRITICAL
**Description:** Untrusted issues, web pages, repos, and MCP tools can inject instructions. Delimit data from policy; allow-list and pin MCP servers.

## 4. Agentic Execution Boundaries (agent)

**Impact:** CRITICAL
**Description:** Human-in-the-loop, sandboxes, least-privilege tokens, deterministic hooks, and spend/loop limits—controls that work when the model is wrong.

## 5. LLM Output and Product Controls (output)

**Impact:** HIGH
**Description:** Sanitize model output, never use LLMs for authorization, audit AI actions, filter secrets, red-team prompts, and keep a kill switch.
