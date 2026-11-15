---
title: Put Architecture, Commands, and Verification in AGENTS.md
impact: MEDIUM
impactDescription: durable project rules survive new chats without bloating every prompt
tags: agent, AGENTS.md, CLAUDE.md, conventions
---

## Put Architecture, Commands, and Verification in AGENTS.md

**Impact: MEDIUM (durable project rules survive new chats without bloating every prompt)**

Architecture constraints, build/test commands, and "do not" rules belong in `AGENTS.md` (and `CLAUDE.md` if you use it), not only in a one-off chat. New threads start without prior context; without a short durable file, agents reintroduce Combine, skip tests, or invent module layouts. Keep the file focused—every line consumes context—and include how to verify completed work.

**Incorrect (conventions only in chat history):**

```text
Human: Remember we use @Observable, never ObservableObject, and tests must pass before you stop.
(No AGENTS.md. Next thread reintroduces ObservableObject and ships untested.)
```

**Correct (short durable instructions):**

```markdown
# AGENTS.md

## Stack
- Swift 6.2+ language mode, Approachable Concurrency, `@Observable` (not `ObservableObject` / Combine for UI state).
- Thin Xcode app target; code in `Packages/AppCore`.

## Commands
- Build: `xcodebuild -scheme MyApp -destination 'platform=macOS' build`
- Test: `cd Packages/AppCore && swift test`
- Format: `swift format lint --strict --recursive Packages App`

## Do not
- Do not add `@unchecked Sendable` to silence isolation errors.
- Do not put networking in SwiftUI views.

## Done means
- Build is green, relevant tests pass, and the changed flow was exercised once.
```

Start a new thread after each milestone with a written handoff (goal, state, constraints, next steps). Keep unrelated tasks in separate threads.

Reference: [Xcode documentation overview](https://developer.apple.com/documentation/xcode), [Building and running an app](https://developer.apple.com/documentation/xcode/building-and-running-an-app)
