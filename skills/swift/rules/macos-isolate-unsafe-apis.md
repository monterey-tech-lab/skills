---
title: Isolate Non-Sendable Frameworks Behind a Global Actor
impact: HIGH
impactDescription: Swift 6 proves no races around legacy and Objective-C objects
tags: macos, concurrency, globalActor, Sendable, Objective-C
---

## Isolate Non-Sendable Frameworks Behind a Global Actor

**Impact: HIGH (Swift 6 proves no races around legacy and Objective-C objects)**

Many AppKit objects, Objective-C SDKs, and private-framework bridges are not `Sendable`. Marking the wrapper `@unchecked Sendable` or using `nonisolated(unsafe)` hides the race. Put all access on a dedicated `@globalActor` (or a plain `actor` / `@MainActor` when that is the correct domain) so every call is `await`ed and the compiler enforces isolation.

**Incorrect (mutable ObjC wrapper marked Sendable):**

```swift
final class LegacyScannerClient: @unchecked Sendable {
    private let scanner = LegacyObjCScanner() // not thread-safe

    func scan() -> String {
        scanner.scan() // called from arbitrary tasks
    }
}
```

**Correct (dedicated global actor serializes access):**

```swift
@globalActor
actor ScannerActor {
    static let shared = ScannerActor()
}

/// Stands in for a non-Sendable Objective-C scanner type.
final class LegacyObjCScanner: NSObject {
    func scan() -> String { "ok" }
}

@ScannerActor
final class LegacyScannerClient {
    private let scanner = LegacyObjCScanner()

    func scan() -> String {
        scanner.scan()
    }
}

func readBarcode(client: LegacyScannerClient) async -> String {
    await client.scan()
}
```

Choose `@MainActor` instead when the API must touch AppKit UI objects that are main-thread-only. Never use `@unchecked Sendable` unless you have real synchronization and document it (see `concurrency-no-unsafe-escapes`).

Reference: [SE-0316 Global actors](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0316-global-actors.md), [Sendable](https://developer.apple.com/documentation/swift/sendable)
