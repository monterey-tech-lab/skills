---
title: Verify Changes by Building, Testing, and Running
impact: HIGH
impactDescription: unread code is not done; compile and exercise the flow
tags: agent, verification, build, test, xcodebuild
---

## Verify Changes by Building, Testing, and Running

**Impact: HIGH (unread code is not done; compile and exercise the flow)**

Agents often stop after editing files. Uncompiled Swift is not finished work: isolation errors, missing imports, and broken menu wiring show up only when you build and run. After non-trivial edits, build, run the relevant tests, exercise the affected UI flow (or a preview), and read a short slice of the failure log—not hundreds of unrelated lines.

**Done when:** the scheme or package builds with zero errors, the targeted tests pass, and the changed flow was launched once without a crash or obvious functional failure.

**Incorrect (trust the diff):**

```text
Edited DocumentRootView.swift and ExportCommands.swift.
Assumed ⌘⇧E exports the frontmost document. Did not build or run.
```

**Correct (checkable loop):**

```bash
# 1. Build the scheme or package and fix every error before continuing.
xcodebuild -scheme MyApp -destination 'platform=macOS' build

# 2. Run targeted tests for the changed module.
swift test --filter ExportCommandsTests

# 3. Launch the Mac app (or a SwiftUI preview), trigger the flow, then trim logs.
# For macOS apps use `log show` (simctl is for the iOS Simulator).
log show --last 2m --predicate 'subsystem CONTAINS "com.example"' | tail -n 20
```

Stop and re-plan when the same failure repeats twice with no new evidence. Prefer structured build output (file, line, severity) over scrolling a raw transcript.

Reference: [Building and running an app](https://developer.apple.com/documentation/xcode/building-and-running-an-app), [Running tests and interpreting results](https://developer.apple.com/documentation/xcode/running-tests-and-interpreting-results)
