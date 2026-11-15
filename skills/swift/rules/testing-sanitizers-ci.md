---
title: Run Tests with Thread Sanitizer in CI
impact: MEDIUM
impactDescription: catches races the compiler cannot see
tags: testing, tsan, sanitizers, ci, xcodebuild
---

## Run Tests with Thread Sanitizer in CI

**Impact: MEDIUM (catches races the compiler cannot see)**

Swift 6 checking covers Swift code, but races can still come from `@unchecked Sendable` types, C/Objective-C libraries, and legacy GCD code. Thread Sanitizer detects them at runtime. Run the test suite with TSan in CI (it slows tests, so a separate job is fine), and Address Sanitizer periodically for memory errors in unsafe code. Scope workflows with path filters, keep `permissions: contents: read` unless a job must write, and pin GitHub Actions to exact versions.

**Incorrect (tests run only locally, without sanitizers):**

```bash
# "Works on my machine": no CI, no sanitizers
swift test
```

**Correct (CI runs package tests and app tests with Thread Sanitizer):**

```yaml
# .github/workflows/test.yml
name: Test
on:
  pull_request:
  push:
    paths:
      - "Package.swift"
      - "Package.resolved"
      - "Packages/**"
      - "App/**"
      - ".github/workflows/test.yml"
permissions:
  contents: read
jobs:
  test:
    runs-on: macos-26
    steps:
      - uses: actions/checkout@v4.2.2
      - name: Package tests with Thread Sanitizer
        working-directory: Packages/AppCore
        run: swift test --sanitize=thread
      - name: App tests
        run: |
          xcodebuild test \
            -scheme MyApp \
            -destination 'platform=iOS Simulator,name=iPhone 17' \
            -enableThreadSanitizer YES
```

Adjust the runner image and simulator name to what your CI provider offers (`xcrun simctl list devices available`). In Xcode, enable sanitizers per test plan under Diagnostics. Put formatting on a cheaper Linux job (see `tooling-format-lint`) so TSan stays on macOS runners only.

Reference: [Diagnosing memory, thread, and crash issues early](https://developer.apple.com/documentation/xcode/diagnosing-memory-thread-and-crash-issues-early)
