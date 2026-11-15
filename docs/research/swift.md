# Research: swift (macOS + agent verification extension)

Date: 2026-11-10 · Purpose: Close gaps in `skills/swift` for production macOS apps, agent verification loops, live-test gating, and related tooling · Recommendation: **extend**

## 1. Question / scope

**Skill:** `swift` (existing rule-based skill, v1.0.0, 62 rules / 12 sections).

**Question:** Extend the published skill with macOS scene/command guidance, agent verification practices, and testing/tooling rules synthesized from internal notes 

**In scope:** New `macos-` and `agent-` sections; testing/tooling additions; edits to five existing rules; `references/macos-apps.md`; evals/triggers.

**Out of scope:** Version bump/release (use `/release-skill` later); unverified Xcode 27 MCP tool inventories; third-party doc-search CLIs in published content.

## 2. Current state and gaps

| Area | Today | Gap |
|---|---|---|
| Platform | iOS-leaning examples; macOS mentioned in description | No macOS scene, command, MenuBarExtra, Table, SceneStorage, AppKit, or notarization rules |
| Agent workflow | None | No verify-by-building, docs lookup, AGENTS.md, worktree isolation, or CLI JSON norms |
| Testing | Swift Testing, fakes, TSan | No `.enabled(if:)` / `.serialized` live gating; no “run the built executable” pattern |
| Tooling | Basic swift-format | Thin rule set; no DocC-on-public-API rule |

## 3. Current facts (primary sources)

| Claim | Source | Accessed |
|---|---|---|
| Mac SwiftUI apps use `WindowGroup`, `Window`, `Settings`, `MenuBarExtra`, commands, focused values, NavigationSplitView, Table, SceneStorage | [WWDC21 10062](https://developer.apple.com/videos/play/wwdc21/10062/), [Building a great Mac app with SwiftUI](https://developer.apple.com/documentation/swiftui/building-a-great-mac-app-with-swiftui) | 2026-11-10 |
| `MenuBarExtra` for menu bar extras; agent apps set `LSUIElement` | [MenuBarExtra](https://developer.apple.com/documentation/swiftui/menubarextra), [LSUIElement](https://developer.apple.com/documentation/bundleresources/information-property-list/lsuielement) | 2026-11-10 |
| AppKit bridging via `NSViewRepresentable` / `NSHostingView` | [NSViewRepresentable](https://developer.apple.com/documentation/swiftui/nsviewrepresentable) | 2026-11-10 |
| Global actors isolate non-Sendable work | [SE-0316 Global actors](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0316-global-actors.md), [Sendable](https://developer.apple.com/documentation/swift/sendable) | 2026-11-10 |
| Direct distribution: Developer ID, hardened runtime, notarize, staple | [Notarizing macOS software before distribution](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution) | 2026-11-10 |
| Swift Testing traits: `.enabled(if:)`, `.serialized` | [Enabling and disabling](https://developer.apple.com/documentation/testing/enablinganddisabling), [Serialized](https://developer.apple.com/documentation/testing/serialized) | 2026-11-10 |
| DocC comments on public API; swift-format documentation rules | [Writing symbol documentation](https://www.swift.org/documentation/docc/writing-symbol-documentation-in-your-source-files), [swift-format](https://github.com/swiftlang/swift-format) | 2026-11-10 |
| `package` access level for same-package sharing | [Access Control](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/accesscontrol/) | 2026-11-10 |
| Continuations must resume with complete state | [CheckedContinuation](https://developer.apple.com/documentation/swift/checkedcontinuation) | 2026-11-10 |
| Domain / layered errors | [Error Handling](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/errorhandling/) | 2026-11-10 |
| Xcode documentation and search for Apple APIs | [Documentation](https://developer.apple.com/documentation/), Xcode documentation window | 2026-11-10 |



## 4. Baseline eval failures (expected without skill)

| Eval theme | Baseline typically misses |
|---|---|
| Mac Preferences + Export ⌘⇧E | Uses sheets or iOS Settings; skips `Settings` scene, `CommandGroup`, focused-value routing to key window |
| Non-thread-safe ObjC SDK | Marks `@unchecked Sendable` or hops with GCD instead of a dedicated global actor / actor boundary |
| Ship outside App Store | Mentions “codesign” vaguely; omits hardened runtime, `notarytool`, stapler, Gatekeeper check |

**Measured 2026-11-10** (evals 6–8 vs previous HEAD skill, strong model): first-pass expectations were non-discriminating (4/4 both variants). Expectations were tightened afterward to require `focusedSceneValue`, disable-when-nil, dedicated `@globalActor` + Sendable copies, inside-out signing without `--deep`, `--timestamp`, staple-then-rezip. Re-run before release.

## 5. Proposed additions (ship in this change)

See plan: 9 `macos-*`, 5 `agent-*`, 3 testing/tooling rules, 5 existing-rule edits, `references/macos-apps.md`, 3 new evals + trigger updates.

## 6. Recommendation

**Extend** `swift`. Do not create a separate `macos` skill: Mac guidance belongs next to existing SwiftUI architecture and concurrency rules, and agents already trigger on “Swift” / “SwiftUI” / “macOS app”.
