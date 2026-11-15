---
title: Expose the Minimal Public API per Module
impact: MEDIUM
impactDescription: encapsulation enforced by the compiler
tags: modules, access-control, public, package
---

## Expose the Minimal Public API per Module

**Impact: MEDIUM (encapsulation enforced by the compiler)**

Access levels: `private` (enclosing declaration), `fileprivate` (file), `internal` (module, the default), `package` (all modules in the same Swift package), `public` (other modules can use it), `open` (other modules can also subclass or override). Keep implementation details `internal`, use `package` for helpers shared across your own modules, and mark only the real entry points `public`. Never put a `package` type in a `public` initializer signature or default argument.

**Incorrect (everything public "so it compiles"):**

```swift
public final class HTTPClient {
    public var baseURL: URL
    public var decoder = JSONDecoder()
    public func makeRequest(path: String) -> URLRequest { /* ... */ fatalError() }
    public func send<R: Decodable>(_ endpoint: Endpoint<R>) async throws -> R { fatalError() }
}
```

**Correct (only the contract is public; layers share with `package`):**

```swift
import Foundation

/// Public library surface: tiny. Support stays `package`.
public struct DocsClient: Sendable {
    private let support: DocsSupport

    public init() {
        self.support = DocsSupport()
    }

    public func search(_ query: String) async throws -> [SearchResult] {
        try await support.search(query)
    }
}

public struct SearchResult: Sendable {
    public var title: String
    public var uri: String
    public init(title: String, uri: String) {
        self.title = title
        self.uri = uri
    }
}

/// Same-package modules can use this; app targets importing the product cannot.
package struct DocsSupport: Sendable {
    package init() {}
    package func search(_ query: String) async throws -> [SearchResult] {
        [SearchResult(title: query, uri: "doc://example/\(query)")]
    }
}
```

Layer inward with separate targets (CLI → library → support → bridge). Keep bridge types `package` so the published API stays a handful of value types. Public structs do not get a public memberwise initializer; write `public init` explicitly. Public types must state `Sendable` explicitly because it is not inferred across module boundaries.

Reference: [Access Control](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/accesscontrol/)
