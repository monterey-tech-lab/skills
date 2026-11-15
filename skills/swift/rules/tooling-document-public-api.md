---
title: Require DocC Comments on Public Declarations
impact: LOW-MEDIUM
impactDescription: public API stays documented and reviewable
tags: tooling, DocC, documentation, public-api, swift-format
---

## Require DocC Comments on Public Declarations

**Impact: LOW-MEDIUM (public API stays documented and reviewable)**

Every `public` declaration that other modules import should carry a DocC comment (summary, and Parameters / Returns / Throws when useful). Undocumented public API forces agents and humans to read implementations. Enforce the habit with swift-format's documentation rules in CI.

**Incorrect (public surface with no docs):**

```swift
public struct SearchResult: Sendable {
    public var title: String
    public var uri: String
    public init(title: String, uri: String) {
        self.title = title
        self.uri = uri
    }
}
```

**Correct (DocC on the public contract):**

```swift
/// A single documentation hit returned by a local search.
///
/// `uri` is the stable identifier used to fetch the full document.
public struct SearchResult: Sendable {
    /// Human-readable title from the documentation catalog.
    public var title: String
    /// Canonical documentation URI for follow-up `get` calls.
    public var uri: String

    /// Creates a search hit.
    /// - Parameters:
    ///   - title: Display title.
    ///   - uri: Canonical documentation URI.
    public init(title: String, uri: String) {
        self.title = title
        self.uri = uri
    }
}
```

Enable at least `AllPublicDeclarationsHaveDocumentation` and `ValidateDocumentationComments` in `.swift-format` (see `tooling-format-lint`). Internal and `package` helpers can stay undocumented unless they are non-obvious.

Reference: [Writing symbol documentation in your source files](https://www.swift.org/documentation/docc/writing-symbol-documentation-in-your-source-files), [swift-format](https://github.com/swiftlang/swift-format)
