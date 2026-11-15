---
title: Bridge Callback APIs with Continuations and AsyncStream
impact: MEDIUM
impactDescription: one async style across the codebase
tags: concurrency, continuation, asyncstream, legacy
---

## Bridge Callback APIs with Continuations and AsyncStream

**Impact: MEDIUM (one async style across the codebase)**

Wrap one-shot callback APIs with `withCheckedThrowingContinuation` and event-style APIs with `AsyncStream`. A checked continuation must be resumed exactly once; resuming twice traps and never resuming leaks the awaiting task. Always set `onTermination` on a stream so the underlying observer stops when the consumer stops iterating. When the callback delivers a buffer or object you must copy, **read or copy the results before resuming** the continuation—otherwise the awaiting task can observe incomplete or already-freed state.

**Incorrect (callbacks leak into feature code; continuation may never resume):**

```swift
func loadConfig(client: LegacyConfigClient) async throws -> Config {
    try await withCheckedThrowingContinuation { continuation in
        client.fetch { config, error in
            if let config { continuation.resume(returning: config) }
            if let error { continuation.resume(throwing: error) }
            // both nil: never resumed. Both non-nil: resumed twice (crash).
        }
    }
}
```

**Correct (every path resumes exactly once; copy before resume; stream cleans up):**

```swift
func loadConfig(client: LegacyConfigClient) async throws -> Config {
    try await withCheckedThrowingContinuation { continuation in
        client.fetch { config, error in
            if let config {
                continuation.resume(returning: config)
            } else {
                continuation.resume(throwing: error ?? ConfigError.emptyResponse)
            }
        }
    }
}

func loadEmbedding(client: LegacyEmbeddingClient) async throws -> [Float] {
    try await withCheckedThrowingContinuation { continuation in
        client.embed { buffer, error in
            if let error {
                continuation.resume(throwing: error)
                return
            }
            guard let buffer else {
                continuation.resume(throwing: ConfigError.emptyResponse)
                return
            }
            // Copy out of the SDK buffer before resume; do not resume then read.
            let values = Array(buffer)
            continuation.resume(returning: values)
        }
    }
}

func priceUpdates(feed: LegacyPriceFeed) -> AsyncStream<Price> {
    AsyncStream { continuation in
        let token = feed.subscribe { price in
            continuation.yield(price)
        }
        continuation.onTermination = { _ in
            feed.unsubscribe(token)
        }
    }
}

// Consumer: iteration ends and unsubscribes when the enclosing task is cancelled.
// for await price in priceUpdates(feed: feed) { render(price) }
```

`LegacyConfigClient`, `LegacyEmbeddingClient`, and `LegacyPriceFeed` stand for any callback-based SDK. The closures passed to them must be `Sendable` in Swift 6, so the SDK types must be `Sendable` or wrapped in an actor.

Reference: [CheckedContinuation](https://developer.apple.com/documentation/swift/checkedcontinuation), [AsyncStream](https://developer.apple.com/documentation/swift/asyncstream)
