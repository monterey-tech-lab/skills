---
title: Gate Live Integration Tests with enabled(if:) and serialized
impact: MEDIUM
impactDescription: live system tests skip cleanly and do not race each other
tags: testing, Swift Testing, enabled, serialized, integration
---

## Gate Live Integration Tests with enabled(if:) and serialized

**Impact: MEDIUM (live system tests skip cleanly and do not race each other)**

Tests that touch real frameworks, files under `/Library`, or network services fail or flake on machines where the dependency is missing. Gate them with Swift Testing's `.enabled(if:)` so they skip cleanly, and add `.serialized` when they share system state. Keep deterministic unit tests ungated and parallel.

**Incorrect (live suite always runs; parallel mutation of one asset):**

```swift
import Testing

@Suite("Documentation asset")
struct DocumentationAssetTests {
    @Test func searchesRealIndex() async throws {
        let client = try LiveDocsClient() // crashes when the asset is absent
        #expect(try await client.search("Settings").isEmpty == false)
    }

    @Test func searchesAgain() async throws {
        let client = try LiveDocsClient() // races the test above on the same cache
        #expect(try await client.search("Table").isEmpty == false)
    }
}
```

**Correct (availability gate + serialized live suite):**

```swift
import Foundation
import Testing

enum LiveEnvironment {
    static let isAvailable: Bool = {
        FileManager.default.fileExists(atPath: "/path/to/required.asset")
    }()

    static let sampleQuery = "Settings"
}

@Suite("Documentation asset unit")
struct DocumentationAssetUnitTests {
    @Test func parsesEmptyResult() {
        #expect(SearchResult(hits: []).hits.isEmpty)
    }
}

@Suite("Documentation asset live", .enabled(if: LiveEnvironment.isAvailable), .serialized)
struct DocumentationAssetLiveTests {
    @Test func searchesRealIndex() async throws {
        let client = try LiveDocsClient()
        let hits = try await client.search(LiveEnvironment.sampleQuery)
        #expect(!hits.isEmpty)
    }
}

struct SearchResult: Sendable {
    var hits: [String]
}

struct LiveDocsClient: Sendable {
    init() throws {
        guard LiveEnvironment.isAvailable else { throw LiveError.unavailable }
    }
    func search(_ query: String) async throws -> [String] { [query] }
}

enum LiveError: Error { case unavailable }
```

Put shared fixtures and the availability probe in a small `TestSupport` module so every live suite uses the same gate.

Reference: [Enabling and disabling tests](https://developer.apple.com/documentation/testing/enablinganddisabling), [serialized](https://developer.apple.com/documentation/testing/serialized)
