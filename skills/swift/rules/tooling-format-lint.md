---
title: Automate Formatting and Linting in CI
impact: LOW-MEDIUM
impactDescription: consistent style without review comments
tags: tooling, swift-format, swiftlint, ci, warnings
---

## Automate Formatting and Linting in CI

**Impact: LOW-MEDIUM (consistent style without review comments)**

Pick one formatter and run it automatically: `swift format`, which ships with the Swift 6 toolchain, or SwiftFormat. Add SwiftLint for rules a formatter does not cover (force unwraps, force tries). Fail CI on violations and treat warnings as errors in CI builds so concurrency warnings do not pile up. Ignore generated or manifest files that fight the formatter with `// swift-format-ignore-file` at the top of `Package.swift`.

**Incorrect (style enforced by review comments; warnings ignored):**

```bash
# No formatter config, no lint step; 300 warnings in the build log
xcodebuild build -scheme MyApp
```

**Correct (checked-in config, lint in CI, warnings as errors):**

```json
{
  "version": 1,
  "lineLength": 120,
  "indentation": { "spaces": 4 },
  "tabWidth": 4,
  "lineBreakBeforeEachArgument": true,
  "respectsExistingLineBreaks": false,
  "rules": {
    "AllPublicDeclarationsHaveDocumentation": true,
    "AlwaysUseLiteralForEmptyCollectionInit": true,
    "AlwaysUseLowerCamelCase": true,
    "DoNotUseSemicolons": true,
    "DontRepeatTypeInStaticProperties": true,
    "FileScopedDeclarationPrivacy": true,
    "NoAccessLevelOnExtensionDeclaration": true,
    "NoEmptyTrailingClosureParentheses": true,
    "NoLeadingUnderscores": true,
    "NoParensAroundConditions": true,
    "OmitExplicitReturns": true,
    "TypeNamesShouldBeCapitalized": true,
    "UseExplicitNilCheckInConditions": true,
    "UseLetInEveryBoundCaseVariable": true,
    "UseSingleLinePropertyGetter": true,
    "UseSynthesizedInitializer": true,
    "UseWhereClausesInForLoops": true,
    "ValidateDocumentationComments": true
  }
}
```

```swift
// swift-format-ignore-file
// Package.swift — keep the manifest free of formatter churn.
```

```yaml
# .github/workflows/format.yml — format on a runner that has the Swift toolchain.
name: Format
on:
  pull_request:
  push:
    paths: ["**/*.swift", ".swift-format", ".github/workflows/format.yml"]
jobs:
  lint:
    runs-on: macos-26
    steps:
      - uses: actions/checkout@v4.2.2
      - name: Lint Sources and Tests
        run: |
          # Package.swift uses // swift-format-ignore-file; do not lint it.
          swift format lint --strict --recursive Packages/AppCore/Sources Packages/AppCore/Tests App
```

```bash
swiftlint lint --strict
xcodebuild build -scheme MyApp SWIFT_TREAT_WARNINGS_AS_ERRORS=YES
```

Run `swift format --in-place --recursive .` locally or in a pre-commit hook so CI rarely fails on formatting. Pair documentation rules with `tooling-document-public-api`.

Reference: [swift-format](https://github.com/swiftlang/swift-format)
