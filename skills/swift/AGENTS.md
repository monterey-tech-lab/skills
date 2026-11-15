# Swift Best Practices

**Version 1.0.0**  
Monterey Tech Lab  
November 2026

> **Note:**  
> This document is mainly for agents and LLMs to follow when maintaining,  
> generating, or refactoring Swift, SwiftUI, Swift package, and macOS app codebases. Humans  
> may also find it useful, but guidance here is optimized for automation  
> and consistency by AI-assisted workflows.

---

## Abstract

Production guide for modern Swift (Swift 6.2+ language mode, current through Swift 6.4) on iOS and macOS, designed for AI agents and LLMs. Rules across concurrency, modeling, safety, ARC, SwiftUI architecture, modularization, networking, persistence, realtime, API style, testing, tooling, macOS scenes and commands, and agent verification. Covers approachable concurrency, @Observable architecture, local Swift packages, typed networking, SwiftData and Keychain, Swift Testing, Mac WindowGroup/Settings/MenuBarExtra patterns, notarized distribution, and build-test-run verification. Each rule compares incorrect and correct Swift code. Reference primers cover TypeScript→Swift, concurrency, and macOS apps.

---

## Table of Contents

1. [Concurrency and Data-Race Safety](#1-concurrency-and-data-race-safety) — **CRITICAL**
   - 1.1 [Bridge Callback APIs with Continuations and AsyncStream](#11-bridge-callback-apis-with-continuations-and-asyncstream)
   - 1.2 [Do Not Assume Actor State Survives an Await](#12-do-not-assume-actor-state-survives-an-await)
   - 1.3 [Do Not Silence Sendable Errors with Unsafe Escapes](#13-do-not-silence-sendable-errors-with-unsafe-escapes)
   - 1.4 [Enable Swift 6 Mode and Approachable Concurrency](#14-enable-swift-6-mode-and-approachable-concurrency)
   - 1.5 [Keep UI State on the Main Actor](#15-keep-ui-state-on-the-main-actor)
   - 1.6 [Offload CPU-Heavy Work with @concurrent](#16-offload-cpu-heavy-work-with-concurrent)
   - 1.7 [Pass Value Types Across Isolation Boundaries](#17-pass-value-types-across-isolation-boundaries)
   - 1.8 [Protect Shared Mutable State with an Actor](#18-protect-shared-mutable-state-with-an-actor)
   - 1.9 [Support Cooperative Cancellation](#19-support-cooperative-cancellation)
   - 1.10 [Tie Task Lifetime to the UI with .task](#110-tie-task-lifetime-to-the-ui-with-task)
   - 1.11 [Use async let for Independent Calls](#111-use-async-let-for-independent-calls)
   - 1.12 [Use Task Groups for Dynamic Fan-Out](#112-use-task-groups-for-dynamic-fan-out)
2. [Data Modeling and Value Semantics](#2-data-modeling-and-value-semantics) — **CRITICAL**
   - 2.1 [Avoid default in Switches over Your Own Enums](#21-avoid-default-in-switches-over-your-own-enums)
   - 2.2 [Make Impossible States Unrepresentable with Enums](#22-make-impossible-states-unrepresentable-with-enums)
   - 2.3 [Mark Classes final and Prefer Composition](#23-mark-classes-final-and-prefer-composition)
   - 2.4 [Model Data with Structs by Default](#24-model-data-with-structs-by-default)
   - 2.5 [Prefer some and Generics over any](#25-prefer-some-and-generics-over-any)
   - 2.6 [Use Strongly Typed Identifiers](#26-use-strongly-typed-identifiers)
3. [Optionals and Error Handling](#3-optionals-and-error-handling) — **HIGH**
   - 3.1 [Do Not Swallow Errors with try?](#31-do-not-swallow-errors-with-try)
   - 3.2 [Never Force-Unwrap Runtime Data](#32-never-force-unwrap-runtime-data)
   - 3.3 [Throw Domain Errors and Map Them at Layer Boundaries](#33-throw-domain-errors-and-map-them-at-layer-boundaries)
   - 3.4 [Use guard for Early Exit](#34-use-guard-for-early-exit)
   - 3.5 [Use Optionals Only When Absence Is Meaningful](#35-use-optionals-only-when-absence-is-meaningful)
4. [Memory Management with ARC](#4-memory-management-with-arc) — **HIGH**
   - 4.1 [Capture self Weakly in Stored Closures](#41-capture-self-weakly-in-stored-closures)
   - 4.2 [Declare Delegates as weak](#42-declare-delegates-as-weak)
   - 4.3 [Do Not Add weak self to Non-Escaping Closures](#43-do-not-add-weak-self-to-non-escaping-closures)
5. [SwiftUI App Architecture](#5-swiftui-app-architecture) — **HIGH**
   - 5.1 [Avoid Mutable Singletons](#51-avoid-mutable-singletons)
   - 5.2 [Inject Dependencies Through Protocols and a Composition Root](#52-inject-dependencies-through-protocols-and-a-composition-root)
   - 5.3 [Keep Business Logic out of View Bodies](#53-keep-business-logic-out-of-view-bodies)
   - 5.4 [Keep the Domain Layer Free of UI and Transport](#54-keep-the-domain-layer-free-of-ui-and-transport)
   - 5.5 [Model Navigation as Data](#55-model-navigation-as-data)
   - 5.6 [Use @Observable Models, Not ObservableObject](#56-use-observable-models-not-observableobject)
6. [Repository Structure and Modularization](#6-repository-structure-and-modularization) — **MEDIUM-HIGH**
   - 6.1 [Expose the Minimal Public API per Module](#61-expose-the-minimal-public-api-per-module)
   - 6.2 [Features Depend on Domain Protocols, Not on Each Other](#62-features-depend-on-domain-protocols-not-on-each-other)
   - 6.3 [Group Files by Feature, One Primary Type per File](#63-group-files-by-feature-one-primary-type-per-file)
   - 6.4 [Keep Third-Party Dependencies Few and Justified](#64-keep-third-party-dependencies-few-and-justified)
   - 6.5 [Use a Thin App Target and a Local Swift Package](#65-use-a-thin-app-target-and-a-local-swift-package)
7. [Networking and API Integration](#7-networking-and-api-integration) — **MEDIUM-HIGH**
   - 7.1 [Centralize Requests in One HTTP Client with an Injected Transport](#71-centralize-requests-in-one-http-client-with-an-injected-transport)
   - 7.2 [Decode DTOs and Map Them to Domain Models at the Boundary](#72-decode-dtos-and-map-them-to-domain-models-at-the-boundary)
   - 7.3 [Describe Endpoints as Typed Values](#73-describe-endpoints-as-typed-values)
   - 7.4 [Generate Clients from OpenAPI for Large APIs](#74-generate-clients-from-openapi-for-large-apis)
   - 7.5 [Refresh Tokens Once and Retry 401s Once](#75-refresh-tokens-once-and-retry-401s-once)
   - 7.6 [Retry Only Idempotent Requests with Backoff](#76-retry-only-idempotent-requests-with-backoff)
8. [Persistence and Local Data](#8-persistence-and-local-data) — **MEDIUM-HIGH**
   - 8.1 [Choose the Right Store for Each Kind of Data](#81-choose-the-right-store-for-each-kind-of-data)
   - 8.2 [Pass PersistentIdentifiers, Not Model Objects, Across Actors](#82-pass-persistentidentifiers-not-model-objects-across-actors)
   - 8.3 [Store Secrets in the Keychain](#83-store-secrets-in-the-keychain)
   - 8.4 [Version Your Schema from the First Release](#84-version-your-schema-from-the-first-release)
   - 8.5 [Write SwiftData in the Background with @ModelActor](#85-write-swiftdata-in-the-background-with-modelactor)
9. [Webhooks, Push, and Real-Time](#9-webhooks-push-and-real-time) — **MEDIUM**
   - 9.1 [Expose WebSockets as AsyncThrowingStream with Reconnect and Resync](#91-expose-websockets-as-asyncthrowingstream-with-reconnect-and-resync)
   - 9.2 [Receive Webhooks on the Server, Then Notify the App](#92-receive-webhooks-on-the-server-then-notify-the-app)
   - 9.3 [Register for Push and Handle Delegate Callbacks Off the Main Actor](#93-register-for-push-and-handle-delegate-callbacks-off-the-main-actor)
   - 9.4 [Verify Webhook Signatures and Process Events Idempotently](#94-verify-webhook-signatures-and-process-events-idempotently)
10. [API Design and Code Style](#10-api-design-and-code-style) — **MEDIUM**
   - 10.1 [Design Call Sites That Read Like Prose](#101-design-call-sites-that-read-like-prose)
   - 10.2 [Design Small Protocols with Default Implementations](#102-design-small-protocols-with-default-implementations)
   - 10.3 [Follow Swift Naming Conventions](#103-follow-swift-naming-conventions)
   - 10.4 [Keep Logic in Small Pure Functions, Effects at the Edges](#104-keep-logic-in-small-pure-functions-effects-at-the-edges)
11. [Testing](#11-testing) — **MEDIUM**
   - 11.1 [Gate Live Integration Tests with enabled(if:) and serialized](#111-gate-live-integration-tests-with-enabledif-and-serialized)
   - 11.2 [Run Tests with Thread Sanitizer in CI](#112-run-tests-with-thread-sanitizer-in-ci)
   - 11.3 [Test CLIs by Running the Built Product](#113-test-clis-by-running-the-built-product)
   - 11.4 [Test Through Protocol Fakes, Not the Network](#114-test-through-protocol-fakes-not-the-network)
   - 11.5 [Write Tests with Swift Testing](#115-write-tests-with-swift-testing)
12. [Tooling, Configuration, and Observability](#12-tooling-configuration-and-observability) — **LOW-MEDIUM**
   - 12.1 [Automate Formatting and Linting in CI](#121-automate-formatting-and-linting-in-ci)
   - 12.2 [Configure Environments with xcconfig, Never Ship Secrets](#122-configure-environments-with-xcconfig-never-ship-secrets)
   - 12.3 [Log with Logger, Not print](#123-log-with-logger-not-print)
   - 12.4 [Require DocC Comments on Public Declarations](#124-require-docc-comments-on-public-declarations)
13. [macOS App Structure](#13-macos-app-structure) — **HIGH**
   - 13.1 [Bridge AppKit Only Where SwiftUI Lacks a Capability](#131-bridge-appkit-only-where-swiftui-lacks-a-capability)
   - 13.2 [Build Menu Bar Utilities with MenuBarExtra and LSUIElement](#132-build-menu-bar-utilities-with-menubarextra-and-lsuielement)
   - 13.3 [Expose Frequent Actions as Menu Commands with Shortcuts](#133-expose-frequent-actions-as-menu-commands-with-shortcuts)
   - 13.4 [Isolate Non-Sendable Frameworks Behind a Global Actor](#134-isolate-non-sendable-frameworks-behind-a-global-actor)
   - 13.5 [Restore Per-Window State with SceneStorage](#135-restore-per-window-state-with-scenestorage)
   - 13.6 [Route Menu Commands to the Key Window with Focused Values](#136-route-menu-commands-to-the-key-window-with-focused-values)
   - 13.7 [Sign with Hardened Runtime, Notarize, and Staple for Direct Distribution](#137-sign-with-hardened-runtime-notarize-and-staple-for-direct-distribution)
   - 13.8 [Use NavigationSplitView and Table for Mac Information Density](#138-use-navigationsplitview-and-table-for-mac-information-density)
   - 13.9 [Use the Right Scene Types for Mac Windows](#139-use-the-right-scene-types-for-mac-windows)
14. [Agent Verification and Tooling Hygiene](#14-agent-verification-and-tooling-hygiene) — **HIGH**
   - 14.1 [Design CLIs with JSON Output, Quiet Modes, and Stable Exit Codes](#141-design-clis-with-json-output-quiet-modes-and-stable-exit-codes)
   - 14.2 [Give Each Parallel Agent Its Own Worktree and DerivedData](#142-give-each-parallel-agent-its-own-worktree-and-deriveddata)
   - 14.3 [Look Up Apple APIs in Documentation Before Writing Unfamiliar Code](#143-look-up-apple-apis-in-documentation-before-writing-unfamiliar-code)
   - 14.4 [Put Architecture, Commands, and Verification in AGENTS.md](#144-put-architecture-commands-and-verification-in-agentsmd)
   - 14.5 [Verify Changes by Building, Testing, and Running](#145-verify-changes-by-building-testing-and-running)

---

## 1. Concurrency and Data-Race Safety

**Impact: CRITICAL**

Swift 6 turns data races into compile-time errors. Getting isolation right (main actor by default, explicit background work, actors for shared state) prevents crashes that never reproduce locally and keeps the UI responsive.

### 1.1 Bridge Callback APIs with Continuations and AsyncStream

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

### 1.2 Do Not Assume Actor State Survives an Await

**Impact: HIGH (prevents duplicate work and stale-state bugs)**

Actors are reentrant. At every `await` inside an actor method, other callers can run and change the actor's state. Check-then-await-then-write sequences break: two callers both see "no token", both start a refresh, and the second overwrites the first. Record in-flight work before the first `await` so later callers join it.

**Incorrect (concurrent callers each start their own refresh):**

```swift
actor TokenStore {
    private var token: String?

    func validToken(refresh: @Sendable () async throws -> String) async throws -> String {
        if let token { return token }
        let newToken = try await refresh() // other callers enter here and refresh again
        token = newToken
        return newToken
    }
}
```

**Correct (store the in-flight task before suspending; everyone awaits the same task):**

```swift
actor TokenStore {
    private var token: String?
    private var refreshTask: Task<String, any Error>?

    func validToken(
        refresh: @escaping @Sendable () async throws -> String
    ) async throws -> String {
        if let token { return token }
        if let refreshTask { return try await refreshTask.value }

        let task = Task { try await refresh() }
        refreshTask = task
        defer { refreshTask = nil }

        let newToken = try await task.value
        token = newToken
        return newToken
    }

    func invalidate() {
        token = nil
    }
}
```

General rule: after any `await` inside an actor, re-read state instead of trusting values read before the suspension.

Reference: [SE-0306 Actors: Actor reentrancy](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0306-actors.md#actor-reentrancy)

### 1.3 Do Not Silence Sendable Errors with Unsafe Escapes

**Impact: CRITICAL (keeps the compiler's race detection intact)**

A Sendable or isolation error is a data race the compiler found for you. `@unchecked Sendable`, `nonisolated(unsafe)`, and `@preconcurrency import` turn the check off without fixing anything. Fix the design instead: make the type a value type, make it immutable, move the state into an actor, or keep it on the main actor. Use an unsafe escape only when you have real synchronization, and document it.

**Incorrect (mutable class marked Sendable to make an error go away):**

```swift
final class SessionState: @unchecked Sendable {
    var userID: String?     // mutated from several tasks, no synchronization
    var isRefreshing = false
}

nonisolated(unsafe) var sharedSession = SessionState()
```

**Correct (immutable value type, or real synchronization documented):**

```swift
import Synchronization

// Option 1: an immutable value type is Sendable automatically.
struct SessionSnapshot: Sendable {
    let userID: String?
    let isRefreshing: Bool
}

// Option 2: state that must be shared lives in an actor.
actor SessionStore {
    private(set) var snapshot = SessionSnapshot(userID: nil, isRefreshing: false)
    func update(_ newValue: SessionSnapshot) { snapshot = newValue }
}

// Option 3: synchronous access with a real lock (iOS 18 / macOS 15).
final class Counter: Sendable {
    private let value = Mutex(0) // Mutex is Sendable; access is synchronized
    func increment() -> Int {
        value.withLock { count in
            count += 1
            return count
        }
    }
}
```

Reference: [Swift 6 Migration Guide: Common Problems](https://www.swift.org/migration/documentation/migrationguide)

### 1.4 Enable Swift 6 Mode and Approachable Concurrency

**Impact: CRITICAL (data races become compile errors)**

In the Swift 6 language mode the compiler rejects code that could race. Approachable Concurrency (Swift 6.2+) makes this practical: nonisolated `async` functions run on the caller's actor instead of jumping to a background thread (SE-0461), and isolated conformances are inferred. Default main-actor isolation (SE-0466) makes unannotated code in a module run on the main actor, so an app is single-threaded until you opt into concurrency.

New Xcode app projects enable these settings by default. Swift packages do not: you must opt in per target in `Package.swift`.

**Incorrect (package target on defaults: nonisolated async code silently hops to the global pool, producing Sendable errors and races):**

```swift
// swift-tools-version: 6.2
import PackageDescription

let package = Package(
    name: "AppCore",
    platforms: [.iOS(.v18), .macOS(.v15)],
    targets: [
        .target(name: "FeatureUsers"),
    ]
)
```

**Correct (Swift 6 mode, approachable concurrency features, main-actor default for UI modules):**

```swift
// swift-tools-version: 6.2
import PackageDescription

let approachableConcurrency: [SwiftSetting] = [
    .enableUpcomingFeature("NonisolatedNonsendingByDefault"),
    .enableUpcomingFeature("InferIsolatedConformances"),
]

let uiModule: [SwiftSetting] = approachableConcurrency + [
    .defaultIsolation(MainActor.self),
]

let package = Package(
    name: "AppCore",
    platforms: [.iOS(.v18), .macOS(.v15)],
    targets: [
        .target(name: "Networking", swiftSettings: approachableConcurrency),
        .target(name: "FeatureUsers", dependencies: ["Networking"], swiftSettings: uiModule),
    ],
    swiftLanguageModes: [.v6]
)
```

In Xcode app targets check Build Settings → Swift Compiler – Concurrency: Swift Language Version = 6, Approachable Concurrency = Yes, Default Actor Isolation = MainActor. Keep non-UI modules (networking, domain, persistence) on the default `nonisolated` isolation.

Reference: [SE-0466 Control default actor isolation inference](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0466-control-default-actor-isolation.md), [SE-0461 Run nonisolated async functions on the caller's actor by default](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0461-async-function-isolation.md)

### 1.5 Keep UI State on the Main Actor

**Impact: CRITICAL (prevents UI races and threading crashes)**

UI frameworks may only be touched from the main thread. Anything that drives UI (view models, routers, `@Observable` app state) must be isolated to `@MainActor`. With default main-actor isolation this is inferred, but types shared across modules should state it explicitly. Do not hop to the main thread manually with GCD.

**Incorrect (mutable UI state with no isolation, updated from a GCD callback):**

```swift
import Foundation
import Observation

@Observable
final class ProfileModel {
    var name = ""

    func load(service: ProfileService) {
        service.fetchName { name in
            DispatchQueue.main.async {
                self.name = name // captures non-Sendable self across threads
            }
        }
    }
}
```

**Correct (main-actor isolated model, async API, no manual thread hopping):**

```swift
import Observation

@MainActor
@Observable
final class ProfileModel {
    private(set) var name = ""
    private let service: any ProfileService

    init(service: any ProfileService) {
        self.service = service
    }

    func load() async {
        do {
            name = try await service.fetchName() // resumes on the main actor
        } catch {
            name = ""
        }
    }
}

protocol ProfileService: Sendable {
    func fetchName() async throws -> String
}
```

After every `await`, code in a `@MainActor` function resumes on the main actor, so assigning to UI state is always safe. `DispatchQueue.main.async` and `MainActor.run` are almost never needed in new code.

Reference: [Swift Concurrency: Actors](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/#Actors)

### 1.6 Offload CPU-Heavy Work with @concurrent

**Impact: CRITICAL (removes main-thread hangs without unsafe escapes)**

With Approachable Concurrency, `async` alone does not mean "background". To run CPU-bound work (decoding, image processing, parsing large files, crypto) off the main actor, mark a nonisolated `async` function `@concurrent`. Inputs and outputs must be `Sendable`. Do not reach for `Task.detached` or `DispatchQueue.global()`: they drop priority and cancellation and bypass isolation checking.

Do not mark network or disk calls `@concurrent`. Waiting on I/O does not block a thread; `URLSession` already suspends.

**Incorrect (heavy work on the main actor, or escaping isolation with GCD):**

```swift
import Foundation

@MainActor
final class ReportModel {
    var summary = ""

    func process(_ csv: Data) {
        summary = CSVParser.summarize(csv) // blocks UI for seconds on large files
    }

    func processLegacy(_ csv: Data) {
        DispatchQueue.global().async {
            let result = CSVParser.summarize(csv)
            DispatchQueue.main.async { self.summary = result }
        }
    }
}
```

**Correct (explicit background function, awaited from the main actor):**

```swift
import Foundation

nonisolated struct ReportProcessor {
    @concurrent
    func summarize(_ csv: Data) async -> String {
        CSVParser.summarize(csv) // runs on the global concurrent executor
    }
}

@MainActor
final class ReportModel {
    var summary = ""
    private let processor = ReportProcessor()

    func process(_ csv: Data) async {
        summary = await processor.summarize(csv) // back on the main actor here
    }
}
```

Everything a `@concurrent` function calls synchronously must be nonisolated too. In a module with main-actor default isolation, mark helper types `nonisolated` (as `ReportProcessor` is here), or move CPU-bound code into a module that keeps the default `nonisolated` isolation.

Only add `@concurrent` after measuring a hang (Instruments → Hangs, Time Profiler, Swift Concurrency). Most async functions should stay on the caller's actor.

Reference: [Swift 6.2 Released: Approachable Concurrency](https://www.swift.org/blog/swift-6.2-released/)

### 1.7 Pass Value Types Across Isolation Boundaries

**Impact: HIGH (Sendable by construction, no copies to synchronize)**

Data that moves between the main actor, actors, and background functions must be `Sendable`. Structs and enums whose stored properties are `Sendable` qualify automatically (public types need an explicit `: Sendable`). Classes with mutable state do not. Model data crossing boundaries as value types: DTOs, snapshots, identifiers. Never pass framework objects that are tied to one context, such as SwiftData `@Model` instances.

**Incorrect (mutable reference type sent to a background function):**

```swift
final class Draft {
    var title = ""
    var body = ""
}

nonisolated struct Uploader {
    @concurrent
    func upload(_ draft: Draft) async throws { /* ... */ } // Draft is not Sendable
}
```

**Correct (immutable value type crosses the boundary):**

```swift
import Foundation

struct DraftPayload: Sendable, Codable {
    let title: String
    let body: String
}

nonisolated struct Uploader {
    @concurrent
    func upload(_ draft: DraftPayload) async throws -> Data {
        try JSONEncoder().encode(draft)
    }
}
```

When an object must stay a class, convert it to a snapshot struct at the boundary (`draft.payload`) instead of sending the object itself.

Reference: [Sendable](https://developer.apple.com/documentation/swift/sendable)

### 1.8 Protect Shared Mutable State with an Actor

**Impact: CRITICAL (eliminates data races without locks)**

When mutable state is accessed from several tasks or isolation domains (a cache, a session, a token store, a connection registry), put it in an `actor`. The actor runs one task at a time on its state, so no locks are needed, and the compiler forces callers to `await`. Do not make every service an actor: stateless services should be `Sendable` structs, and UI state belongs on `@MainActor`.

**Incorrect (class with a dictionary mutated from concurrent tasks):**

```swift
final class ImageCache {
    private var storage: [URL: Data] = [:] // concurrent reads and writes race

    func data(for url: URL) -> Data? { storage[url] }
    func insert(_ data: Data, for url: URL) { storage[url] = data }
}
```

**Correct (actor serializes access, callers await):**

```swift
import Foundation

actor ImageCache {
    private var storage: [URL: Data] = [:]
    private let limit: Int

    init(limit: Int = 200) {
        self.limit = limit
    }

    func data(for url: URL) -> Data? {
        storage[url]
    }

    func insert(_ data: Data, for url: URL) {
        if storage.count >= limit, let firstKey = storage.keys.first {
            storage[firstKey] = nil
        }
        storage[url] = data
    }

    nonisolated var debugName: String { "ImageCache" } // no state access, no await needed
}

// Usage from any context
func cachedImage(_ url: URL, cache: ImageCache) async -> Data? {
    await cache.data(for: url)
}
```

If you need a synchronous critical section (for example inside a non-async API), use `Mutex` from the `Synchronization` module (iOS 18 / macOS 15) instead of building an actor around a lock.

Reference: [Swift Concurrency: Actors](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/#Actors)

### 1.9 Support Cooperative Cancellation

**Impact: HIGH (stops wasted work when the user leaves)**

Cancellation in Swift is cooperative: `task.cancel()` only sets a flag. System APIs (`URLSession`, `Task.sleep`) react to it, but your own loops must check with `try Task.checkCancellation()` or `Task.isCancelled`. A cancelled task throws `CancellationError`, which is not a failure to show the user.

**Incorrect (long loop ignores cancellation, cancellation shown as an error):**

```swift
@MainActor
final class UploadModel {
    var errorMessage: String?

    func uploadAll(_ chunks: [Data], uploader: some ChunkUploader) async {
        do {
            for chunk in chunks {
                try await uploader.upload(chunk) // keeps going after the screen is closed
            }
        } catch {
            errorMessage = error.localizedDescription // "cancelled" alert on dismiss
        }
    }
}
```

**Correct (check between units of work, treat cancellation as silent):**

```swift
import Foundation

@MainActor
final class UploadModel {
    var errorMessage: String?

    func uploadAll(_ chunks: [Data], uploader: some ChunkUploader) async {
        do {
            for chunk in chunks {
                try Task.checkCancellation()
                try await uploader.upload(chunk)
            }
        } catch is CancellationError {
            // The user left; nothing to report.
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}

protocol ChunkUploader: Sendable {
    func upload(_ chunk: Data) async throws
}
```

`URLSession` throws `URLError(.cancelled)` rather than `CancellationError` when its task is cancelled. Map it to your own `cancelled` case in the networking layer.

Reference: [Task Cancellation](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/#Task-Cancellation)

### 1.10 Tie Task Lifetime to the UI with .task

**Impact: HIGH (automatic cancellation, no leaked work)**

`Task { }` started from `onAppear` keeps running after the view disappears, and it holds `self` strongly for its whole lifetime. The `.task` modifier starts when the view appears and is cancelled automatically when it disappears. `.task(id:)` restarts when the value changes, which replaces debounced `onChange` plus manual task bookkeeping. If you must create an unstructured task outside SwiftUI, store it and cancel it.

**Incorrect (fire-and-forget tasks that outlive the screen):**

```swift
import SwiftUI

struct SearchView: View {
    @State private var model = SearchModel()

    var body: some View {
        List(model.results) { Text($0.title) }
            .onAppear { Task { await model.observeUpdates() } } // never cancelled
            .onChange(of: model.query) { Task { await model.search() } } // races between keystrokes
    }
}
```

**Correct (lifetime bound to the view; restarts on change):**

```swift
import SwiftUI

struct SearchView: View {
    @State private var model = SearchModel()

    var body: some View {
        List(model.results) { Text($0.title) }
            .searchable(text: $model.query)
            .task { await model.observeUpdates() }
            .task(id: model.query) {
                try? await Task.sleep(for: .milliseconds(300)) // debounce; throws if cancelled
                guard !Task.isCancelled else { return }
                await model.search()
            }
    }
}
```

Outside SwiftUI, keep a handle: `private var observation: Task<Void, Never>?`, assign it when starting, and call `observation?.cancel()` when the owner stops.

Reference: [task(priority:_:)](https://developer.apple.com/documentation/swiftui/view/task(priority:_:))

### 1.11 Use async let for Independent Calls

**Impact: CRITICAL (N round trips become 1)**

Sequential `await`s on independent operations form a waterfall: each one waits for the previous to finish. `async let` starts child tasks immediately and runs them in parallel. It is the structured equivalent of `Promise.all`: if one throws, the others are cancelled automatically, and the function cannot return until all children finish.

**Incorrect (three sequential round trips):**

```swift
func loadDashboard(api: some DashboardAPI) async throws -> Dashboard {
    let profile = try await api.profile()
    let stats = try await api.stats()
    let alerts = try await api.alerts()
    return Dashboard(profile: profile, stats: stats, alerts: alerts)
}
```

**Correct (three parallel child tasks):**

```swift
func loadDashboard(api: some DashboardAPI) async throws -> Dashboard {
    async let profile = api.profile()
    async let stats = api.stats()
    async let alerts = api.alerts()
    return try await Dashboard(profile: profile, stats: stats, alerts: alerts)
}

protocol DashboardAPI: Sendable {
    func profile() async throws -> Profile
    func stats() async throws -> Stats
    func alerts() async throws -> [Alert]
}
```

Use `async let` for a fixed, small number of calls. For a dynamic number, use a task group. Values captured by `async let` initializers must be `Sendable`, so pass dependencies as parameters or local constants rather than reading main-actor properties inside the initializer.

Reference: [Swift Concurrency: Calling Asynchronous Functions in Parallel](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/#Calling-Asynchronous-Functions-in-Parallel)

### 1.12 Use Task Groups for Dynamic Fan-Out

**Impact: HIGH (parallelism with cancellation and backpressure)**

For a variable number of parallel operations use `withThrowingTaskGroup`. Child tasks cannot outlive the group, a thrown error cancels the siblings, and you can bound concurrency so you do not open hundreds of connections at once. Child task closures are `@Sendable`, so copy main-actor properties into local constants before the group.

**Incorrect (unstructured tasks, no limit, main-actor state read from child tasks):**

```swift
@MainActor
final class UsersModel {
    let api: UsersAPI
    var users: [User.ID: User] = [:]

    init(api: UsersAPI) { self.api = api }

    func load(ids: [User.ID]) {
        for id in ids {
            Task.detached {
                let user = try await self.api.user(id: id) // isolated property read off the main actor
                await MainActor.run { self.users[id] = user }
            }
        }
    }
}
```

**Correct (structured group with a concurrency limit):**

```swift
func fetchUsers(
    ids: [User.ID],
    api: some UsersAPI,
    maxConcurrent: Int = 4
) async throws -> [User.ID: User] {
    try await withThrowingTaskGroup(of: (User.ID, User).self) { group in
        var result: [User.ID: User] = [:]
        var iterator = ids.makeIterator()

        // Seed the group up to the limit.
        for _ in 0..<maxConcurrent {
            guard let id = iterator.next() else { break }
            group.addTask { (id, try await api.user(id: id)) }
        }
        // Each time one finishes, start the next.
        while let finished = try await group.next() {
            let (id, user) = finished
            result[id] = user
            if let nextID = iterator.next() {
                group.addTask { (nextID, try await api.user(id: nextID)) }
            }
        }
        return result
    }
}

protocol UsersAPI: Sendable {
    func user(id: User.ID) async throws -> User
}
```

Call it from the main actor with `users = try await fetchUsers(ids: ids, api: api)`. The `api` value is passed in as a `Sendable` parameter, so child tasks never touch main-actor state.

Reference: [Swift Concurrency: Task Groups](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/#Task-Groups)

---

## 2. Data Modeling and Value Semantics

**Impact: CRITICAL**

Value types, enums with associated values, and strong types eliminate whole classes of bugs (shared mutation, impossible states, mixed-up IDs) before the code ever runs.

### 2.1 Avoid default in Switches over Your Own Enums

**Impact: HIGH (new cases surface as compile errors)**

`switch` must be exhaustive. When you list every case of your own enum, adding a case later breaks the build at every switch that needs updating. A `default:` branch silently swallows the new case. Keep `default` for open sets (integers, strings) and use `@unknown default` for enums from frameworks that may add cases.

**Incorrect (new `refunded` case silently falls into default):**

```swift
enum PaymentStatus {
    case pending, paid, failed, refunded
}

func badgeColor(for status: PaymentStatus) -> String {
    switch status {
    case .paid: "green"
    case .failed: "red"
    default: "gray" // refunded is shown as pending-gray, no warning
    }
}
```

**Correct (exhaustive over own cases; @unknown default for framework enums):**

```swift
import UserNotifications

func badgeColor(for status: PaymentStatus) -> String {
    switch status {
    case .pending: "gray"
    case .paid: "green"
    case .failed: "red"
    case .refunded: "blue"
    }
}

func describe(_ status: UNAuthorizationStatus) -> String {
    switch status {
    case .authorized: "Allowed"
    case .denied: "Denied"
    case .notDetermined: "Not asked yet"
    case .provisional, .ephemeral: "Limited"
    @unknown default: "Unknown"
    }
}
```

Reference: [Switch](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/controlflow/#Switch)

### 2.2 Make Impossible States Unrepresentable with Enums

**Impact: CRITICAL (removes invalid state combinations)**

Several booleans and optionals that describe one state (`isLoading`, `error`, `data`) allow combinations that make no sense, such as loading with an error and data at the same time. An enum with associated values (Swift's discriminated union) allows only the legal states, and `switch` forces every state to be handled.

**Incorrect (8 combinations, 5 of them invalid):**

```swift
@MainActor
@Observable
final class OrdersModel {
    var isLoading = false
    var error: (any Error)?
    var orders: [Order]?
}
```

**Correct (one enum, exactly the legal states):**

```swift
enum LoadState<Value> {
    case idle
    case loading
    case loaded(Value)
    case failed(any Error)
}

@MainActor
@Observable
final class OrdersModel {
    private(set) var state: LoadState<[Order]> = .idle
}

func title(for state: LoadState<[Order]>) -> String {
    switch state {
    case .idle: "Pull to refresh"
    case .loading: "Loading…"
    case .loaded(let orders) where orders.isEmpty: "No orders yet"
    case .loaded(let orders): "\(orders.count) orders"
    case .failed(let error): "Error: \(error.localizedDescription)"
    }
}
```

An enum with no cases (`enum API {}`) is the idiomatic namespace for static constants and functions because it cannot be instantiated.

Reference: [Enumerations](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/enumerations/)

### 2.3 Mark Classes final and Prefer Composition

**Impact: MEDIUM (static dispatch and simpler reasoning)**

Unless a class is designed for subclassing, mark it `final`. It enables static dispatch, makes `Sendable` conformance possible for immutable classes, and documents intent. Share behavior through protocols and composition (wrapping one implementation in another) instead of inheritance hierarchies.

**Incorrect (inheritance chain for behavior reuse):**

```swift
class BaseRepository {
    func log(_ message: String) { print(message) }
}

class UserRepository: BaseRepository {
    func user(id: String) async throws -> User { /* ... */ fatalError() }
}

class CachedUserRepository: UserRepository { /* overrides everything */ }
```

**Correct (protocol plus composable final types):**

```swift
protocol UserRepository: Sendable {
    func user(id: User.ID) async throws -> User
}

struct RemoteUserRepository: UserRepository {
    let client: HTTPClient
    func user(id: User.ID) async throws -> User {
        try User(dto: await client.send(UsersEndpoints.user(id: id)))
    }
}

struct CachedUserRepository: UserRepository {
    let wrapped: any UserRepository
    let cache: UserCache // actor

    func user(id: User.ID) async throws -> User {
        if let cached = await cache.user(id: id) { return cached }
        let user = try await wrapped.user(id: id)
        await cache.store(user)
        return user
    }
}
```

Reference: [Inheritance](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/inheritance/)

### 2.4 Model Data with Structs by Default

**Impact: CRITICAL (no shared mutation, Sendable for free)**

Structs are value types: assignment copies (collections use copy-on-write, so copies are cheap until mutated). Nobody else can mutate your copy, and structs of `Sendable` members are `Sendable` automatically. Classes share one instance through references, like JavaScript objects. Use a class only when you need identity, shared mutable state, inheritance, or a framework requires it (`@Observable` models, SwiftData `@Model`, UIKit).

**Incorrect (class for plain data; a mutation leaks to every holder):**

```swift
final class Address {
    var street: String
    var city: String
    init(street: String, city: String) {
        self.street = street
        self.city = city
    }
}

let shipping = Address(street: "Main St 1", city: "Kraków")
let billing = shipping
billing.city = "Warsaw" // shipping.city is now "Warsaw" too
```

**Correct (struct with synthesized conformances):**

```swift
struct Address: Hashable, Codable, Sendable {
    var street: String
    var city: String
}

let shipping = Address(street: "Main St 1", city: "Kraków")
var billing = shipping
billing.city = "Warsaw" // shipping is unchanged
```

`let` on a struct is deep immutability: no property can change. Methods that modify a struct must be `mutating`, which makes mutation visible at the declaration.

Reference: [Choosing Between Structures and Classes](https://developer.apple.com/documentation/swift/choosing-between-structures-and-classes)

### 2.5 Prefer some and Generics over any

**Impact: MEDIUM (static dispatch, no boxing)**

`some P` (an opaque type, shorthand for a generic parameter) means one concrete type known to the compiler: static dispatch, inlining, no allocation. `any P` (an existential) is a box that can hold any conforming type: dynamic dispatch, possible heap allocation, and lost type information. Start with `some` or generics; use `any` when you truly need heterogeneous storage or a type chosen at runtime. Stored dependencies at module boundaries are a reasonable place for `any`.

**Incorrect (existentials everywhere, including hot paths and homogeneous data):**

```swift
func totalArea(of shapes: [any Shape]) -> Double { // every element boxed
    shapes.reduce(0) { $0 + $1.area }
}

func render(_ shape: any Shape) -> String {
    "Area: \(shape.area)"
}
```

**Correct (generics for homogeneous data, any only where heterogeneity is real):**

```swift
protocol Shape {
    var area: Double { get }
}

func totalArea<S: Shape>(of shapes: [S]) -> Double {
    shapes.reduce(0) { $0 + $1.area }
}

func render(_ shape: some Shape) -> String {
    "Area: \(shape.area)"
}

struct Circle: Shape { let radius: Double; var area: Double { .pi * radius * radius } }
struct Square: Shape { let side: Double; var area: Double { side * side } }

// Heterogeneous collection: any is the right tool here.
let mixed: [any Shape] = [Circle(radius: 1), Square(side: 2)]
let mixedArea = mixed.reduce(0) { $0 + $1.area }
```

Reference: [Opaque and Boxed Protocol Types](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/opaquetypes/)

### 2.6 Use Strongly Typed Identifiers

**Impact: HIGH (mixed-up IDs become compile errors)**

Swift typing is nominal: two types with the same shape are still different types. Use that to stop passing a user ID where an order ID is expected. A generic `Tagged` wrapper with a phantom tag gives every entity its own ID type at zero runtime cost. Implement `Codable` as a single value so the JSON stays a plain string or UUID.

**Incorrect (all identifiers are raw UUIDs):**

```swift
import Foundation

func cancel(orderID: UUID) async throws { /* ... */ }

let userID = UUID()
try await cancel(orderID: userID) // compiles, cancels the wrong thing
```

**Correct (one ID type per entity):**

```swift
import Foundation

struct Tagged<Tag, RawValue: Hashable & Sendable>: Hashable, Sendable {
    let rawValue: RawValue
    init(_ rawValue: RawValue) { self.rawValue = rawValue }
}

extension Tagged: Codable where RawValue: Codable {
    init(from decoder: any Decoder) throws {
        rawValue = try decoder.singleValueContainer().decode(RawValue.self)
    }
    func encode(to encoder: any Encoder) throws {
        var container = encoder.singleValueContainer()
        try container.encode(rawValue)
    }
}

struct User: Identifiable, Hashable, Codable, Sendable {
    typealias ID = Tagged<User, UUID>
    let id: ID
    var name: String
}

struct Order: Identifiable, Hashable, Codable, Sendable {
    typealias ID = Tagged<Order, UUID>
    let id: ID
    var total: Decimal
}

func cancel(orderID: Order.ID) async throws { /* ... */ }
// cancel(orderID: user.id) — compile error: User.ID is not Order.ID
```

The tag type parameter is never stored, so `Hashable` and `Sendable` synthesis do not require anything of `Tag`. The `swift-tagged` package from Point-Free provides a production-ready version.

Reference: [Value and Reference Types](https://www.swift.org/documentation/articles/value-and-reference-types.html)

---

## 3. Optionals and Error Handling

**Impact: HIGH**

Optionals and typed errors make failure explicit. Force-unwrapping and swallowing errors turn recoverable situations into crashes or silent data loss.

### 3.1 Do Not Swallow Errors with try?

**Impact: MEDIUM (failures stay visible and debuggable)**

`try?` converts any error into `nil` and discards the reason. Use it only when absence is a genuinely acceptable outcome (an optional cache read, a best-effort cleanup). Everywhere else, propagate with `try` or handle and log the error.

**Incorrect (save failures disappear; user thinks data was saved):**

```swift
func saveNote(_ note: Note, store: NoteStore) async {
    try? await store.save(note)
}
```

**Correct (propagate, or handle and log):**

```swift
import OSLog

private let logger = Logger(subsystem: "com.example.notes", category: "storage")

func saveNote(_ note: Note, store: NoteStore) async throws {
    try await store.save(note)
}

func warmCache(store: NoteStore) async {
    do {
        try await store.preload()
    } catch {
        // Best effort, but still recorded.
        logger.error("Cache warm-up failed: \(error.localizedDescription, privacy: .public)")
    }
}

// Acceptable try?: absence is a normal outcome.
func cachedNote(id: Note.ID, store: NoteStore) async -> Note? {
    try? await store.cachedNote(id: id)
}
```

Reference: [Converting Errors to Optional Values](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/errorhandling/#Converting-Errors-to-Optional-Values)

### 3.2 Never Force-Unwrap Runtime Data

**Impact: HIGH (prevents production crashes)**

`!`, `try!`, and `as!` crash the app when they fail. They are acceptable only where failure is a programmer error that should be caught in development: a URL built from a string literal, a resource bundled with the app. For anything that comes from the network, disk, the user, or the environment, unwrap safely and handle the failure.

**Incorrect (crashes on unexpected server data):**

```swift
import Foundation

func avatarURL(from json: [String: Any]) -> URL {
    let path = json["avatar"] as! String
    return URL(string: path)!
}

let config = try! JSONDecoder().decode(Config.self, from: data)
```

**Correct (handle absence and failure; force-unwrap only literals):**

```swift
import Foundation

func avatarURL(from json: [String: Any]) -> URL? {
    guard let path = json["avatar"] as? String else { return nil }
    return URL(string: path)
}

func loadConfig(from data: Data) throws -> Config {
    try JSONDecoder().decode(Config.self, from: data)
}

// Acceptable: a literal that is known valid at compile time.
let supportURL = URL(string: "https://example.com/support")!
```

Enforce it with SwiftLint's `force_unwrapping`, `force_try`, and `force_cast` rules in production targets.

Reference: [Optionals](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/#Optionals)

### 3.3 Throw Domain Errors and Map Them at Layer Boundaries

**Impact: HIGH (UI never depends on transport details)**

Define errors as enums conforming to `Error`, with associated values that carry context. Convert low-level errors (`URLError`, `DecodingError`, SQLite errors) into your own types at the boundary of the layer that produced them, so features never import transport details. Swift 6 typed throws (`throws(NetworkError)`) make the error type part of the signature; use them for closed, stable error sets inside a module, and keep untyped `throws` on public APIs that may evolve.

For infrastructure layers that wrap frameworks, a struct with a stable `code`, a human `message`, and an optional `underlyingError` is often clearer than a large enum. Translate only expected failures (for example missing file → `.assetNotFound`); rethrow unexpected errors unchanged so you do not erase diagnostics.

**Incorrect (raw URLError reaches the UI; errors carry no context):**

```swift
import Foundation

@MainActor
final class CheckoutModel {
    var message = ""
    func pay(client: PaymentsClient) async {
        do {
            try await client.pay()
        } catch let error as URLError where error.code == .notConnectedToInternet {
            message = "Offline" // every feature repeats transport-specific checks
        } catch {
            message = "\(error)" // leaks internals to users
        }
    }
}
```

**Correct (layer maps errors once; features switch over a domain enum):**

```swift
import Foundation

enum PaymentError: Error, Equatable {
    case offline
    case cardDeclined(reason: String)
    case server(statusCode: Int)
    case unknown
}

struct PaymentsClient: Sendable {
    let transport: any HTTPTransport

    func pay(_ request: URLRequest) async throws(PaymentError) {
        do {
            let (_, response) = try await transport.data(for: request)
            guard let http = response as? HTTPURLResponse else { throw PaymentError.unknown }
            switch http.statusCode {
            case 200..<300: return
            case 402: throw PaymentError.cardDeclined(reason: "insufficient_funds")
            default: throw PaymentError.server(statusCode: http.statusCode)
            }
        } catch let error as PaymentError {
            throw error
        } catch let error as URLError where error.code == .notConnectedToInternet {
            throw .offline
        } catch {
            throw .unknown
        }
    }
}

@MainActor
final class CheckoutModel {
    var message = ""
    func pay(client: PaymentsClient, request: URLRequest) async {
        do throws(PaymentError) {
            try await client.pay(request)
            message = "Paid"
        } catch {
            // `do throws(PaymentError)` makes `error` statically PaymentError: the switch is exhaustive.
            switch error {
            case .offline: message = "You're offline."
            case .cardDeclined: message = "Your card was declined."
            case .server, .unknown: message = "Something went wrong. Try again."
            }
        }
    }
}

/// Infrastructure-style error: code + message + underlying cause.
struct BridgeError: Error, LocalizedError, CustomStringConvertible {
    enum Code: String, Sendable {
        case assetNotFound
        case unavailable
    }

    var code: Code
    var message: String
    var underlyingError: (any Error)?

    var description: String {
        "[\(code.rawValue)] \(message)"
    }

    var errorDescription: String? { description }
}

func loadAsset(at url: URL) throws -> Data {
    do {
        return try Data(contentsOf: url)
    } catch let error as NSError where error.domain == NSCocoaErrorDomain && error.code == NSFileReadNoSuchFileError {
        throw BridgeError(code: .assetNotFound, message: "No asset at \(url.path)", underlyingError: error)
    }
    // Unexpected filesystem errors propagate unchanged.
}
```

Reference: [SE-0413 Typed throws](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0413-typed-throws.md), [Error Handling](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/errorhandling/)

### 3.4 Use guard for Early Exit

**Impact: MEDIUM (flat happy path, unwrapped values in scope)**

`guard` validates preconditions at the top of a function and exits early. Values unwrapped by `guard let` stay in scope for the rest of the function, so the happy path is not nested. Since Swift 5.7, `if let name` and `guard let name` unwrap a variable into a shadow of the same name.

**Incorrect (pyramid of nested if-lets):**

```swift
func sendInvite(to email: String?, team: Team?) async throws {
    if let email {
        if let team {
            if team.canInvite {
                try await api.invite(email: email, teamID: team.id)
            }
        }
    }
}
```

**Correct (guard clauses, then the happy path):**

```swift
func sendInvite(to email: String?, team: Team?) async throws {
    guard let email, !email.isEmpty else { throw InviteError.missingEmail }
    guard let team else { throw InviteError.missingTeam }
    guard team.canInvite else { throw InviteError.notAllowed }

    try await api.invite(email: email, teamID: team.id)
}

enum InviteError: Error {
    case missingEmail, missingTeam, notAllowed
}
```

Reference: [Early Exit](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/controlflow/#Early-Exit)

### 3.5 Use Optionals Only When Absence Is Meaningful

**Impact: MEDIUM (fewer unwraps, clearer domain)**

A non-optional value can never be `nil`; the compiler guarantees it. Making properties optional "just in case" spreads unwrapping (and force-unwrapping) through the codebase and hides which values really can be missing. Make a property optional only when "not present" is a real state in the domain, and require everything else in the initializer.

**Incorrect (everything optional, set later, unwrapped everywhere):**

```swift
import Foundation

final class Invoice {
    var id: UUID?
    var number: String?
    var issuedAt: Date?
    var paidAt: Date?
}

func label(for invoice: Invoice) -> String {
    "Invoice \(invoice.number!) issued \(invoice.issuedAt!)"
}
```

**Correct (required data is required; only paidAt can be absent):**

```swift
import Foundation

struct Invoice: Identifiable, Sendable {
    let id: UUID
    let number: String
    let issuedAt: Date
    var paidAt: Date? // nil means "not paid yet": a real domain state

    var isPaid: Bool { paidAt != nil }
}

func label(for invoice: Invoice) -> String {
    "Invoice \(invoice.number) issued \(invoice.issuedAt.formatted(date: .abbreviated, time: .omitted))"
}
```

Reference: [The Basics: Optionals](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/#Optionals)

---

## 4. Memory Management with ARC

**Impact: HIGH**

Swift uses reference counting, not a garbage collector. Reference cycles leak memory and keep work running after the user has left the screen.

### 4.1 Capture self Weakly in Stored Closures

**Impact: HIGH (prevents retain cycles and leaks)**

ARC frees a class instance when its strong reference count reaches zero. If an object stores a closure that captures `self` strongly, the object and the closure keep each other alive forever. Break the cycle with `[weak self]` in closures that are stored (properties, callbacks registered with long-lived objects, observers).

**Incorrect (self → handler → self cycle):**

```swift
final class Downloader {
    var onProgress: ((Double) -> Void)?
    private(set) var progress = 0.0

    func start() {
        onProgress = { value in
            self.progress = value // strong capture; Downloader never deinitializes
        }
    }

    deinit { print("never printed") }
}
```

**Correct (weak capture breaks the cycle):**

```swift
final class Downloader {
    var onProgress: ((Double) -> Void)?
    private(set) var progress = 0.0

    func start() {
        onProgress = { [weak self] value in
            guard let self else { return }
            self.progress = value
        }
    }

    deinit { print("released") }
}
```

Use Xcode's Debug Memory Graph and Instruments → Leaks to confirm. `unowned` also breaks cycles but crashes if the object is gone; prefer `weak` unless the lifetime is guaranteed.

Reference: [Automatic Reference Counting: Strong Reference Cycles for Closures](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/#Strong-Reference-Cycles-for-Closures)

### 4.2 Declare Delegates as weak

**Impact: MEDIUM (parent and child no longer keep each other alive)**

A delegate usually owns the object it is the delegate of (a controller owns a scanner and is its delegate). A strong `delegate` property closes the loop. Constrain delegate protocols to `AnyObject` and store the reference as `weak var`.

**Incorrect (strong delegate creates a cycle):**

```swift
protocol BarcodeScannerDelegate {
    func scanner(_ scanner: BarcodeScanner, didRead code: String)
}

final class BarcodeScanner {
    var delegate: BarcodeScannerDelegate? // strong
}
```

**Correct (class-bound protocol, weak reference):**

```swift
@MainActor
protocol BarcodeScannerDelegate: AnyObject {
    func scanner(_ scanner: BarcodeScanner, didRead code: String)
}

@MainActor
final class BarcodeScanner {
    weak var delegate: (any BarcodeScannerDelegate)?

    func simulateRead(_ code: String) {
        delegate?.scanner(self, didRead: code)
    }
}
```

In new APIs prefer `AsyncStream` or async functions over delegates; keep delegates for UIKit/AppKit integration.

Reference: [Unowned and Weak References](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/#Resolving-Strong-Reference-Cycles-Between-Class-Instances)

### 4.3 Do Not Add weak self to Non-Escaping Closures

**Impact: LOW-MEDIUM (less noise, no accidental early exits)**

Closures that run immediately and are not stored (`map`, `filter`, `sorted`, `withAnimation`, SwiftUI view builders) cannot create a retain cycle. Adding `[weak self]` there is noise and can skip work if you bail out with `guard let self else { return }`. Short-lived `Task { }` closures hold `self` only until they finish, which is usually fine; long-running tasks should be cancelled instead (see `concurrency-structured-tasks`).

**Incorrect (weak capture where no cycle is possible):**

```swift
@MainActor
final class CartModel {
    var items: [CartItem] = []

    var total: Decimal {
        items.reduce(0) { [weak self] sum, item in
            guard let self else { return sum } // pointless
            return sum + item.price * Decimal(item.quantity) + self.fee(for: item)
        }
    }

    func fee(for item: CartItem) -> Decimal { 0 }
}
```

**Correct (plain capture in non-escaping closures):**

```swift
@MainActor
final class CartModel {
    var items: [CartItem] = []

    var total: Decimal {
        items.reduce(0) { sum, item in
            sum + item.price * Decimal(item.quantity) + fee(for: item)
        }
    }

    func fee(for item: CartItem) -> Decimal { 0 }
}
```

Reference: [Escaping Closures](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/closures/#Escaping-Closures)

---

## 5. SwiftUI App Architecture

**Impact: HIGH**

Observable models, injected dependencies, and navigation as data keep views thin, testable, and fast to re-render.

### 5.1 Avoid Mutable Singletons

**Impact: HIGH (removes hidden dependencies and global races)**

`static let shared` holding mutable state is a hidden global: any code can change it, tests interfere with each other (Swift Testing runs tests in parallel), and in Swift 6 a non-Sendable global is a compile error. Inject the dependency instead. If the state is genuinely app-wide and shared across tasks, own one instance in the composition root and make it an actor or `@MainActor`.

**Incorrect (global mutable session reached from anywhere):**

```swift
final class Session {
    static let shared = Session() // Swift 6: "not concurrency-safe" error in nonisolated modules
    var currentUser: User?
    var authToken: String?
}

struct ProfileRepository {
    func load() async throws -> Profile {
        guard let token = Session.shared.authToken else { throw AuthError.signedOut }
        return try await fetchProfile(token: token)
    }
}
```

**Correct (isolated state, created once at the root, injected):**

```swift
actor SessionStore {
    private(set) var currentUser: User?
    private(set) var authToken: String?

    func signIn(user: User, token: String) {
        currentUser = user
        authToken = token
    }

    func signOut() {
        currentUser = nil
        authToken = nil
    }
}

struct ProfileRepository: Sendable {
    let session: SessionStore

    func load() async throws -> Profile {
        guard let token = await session.authToken else { throw AuthError.signedOut }
        return try await fetchProfile(token: token)
    }
}
```

Stateless singletons of `Sendable` types (`URLSession.shared`, a `Logger`) are fine.

Reference: [Swift 6 Migration Guide: Global Variables](https://www.swift.org/migration/documentation/migrationguide)

### 5.2 Inject Dependencies Through Protocols and a Composition Root

**Impact: HIGH (testable features, previews without network)**

Features depend on protocols, never on concrete clients. One place, the composition root in the `App` struct, builds the live implementations and hands them down. Pass dependencies through initializers; use the SwiftUI environment for app-wide services. Mark the dependency container `nonisolated` and `Sendable` so it can be an environment default value regardless of the module's default isolation.

**Incorrect (feature constructs its own concrete dependencies):**

```swift
import SwiftUI

@MainActor
@Observable
final class UserListModel {
    private let repository = RemoteUserRepository(
        client: HTTPClient(baseURL: URL(string: "https://api.example.com")!)
    ) // untestable, no previews without network, URL hard-coded in a feature

    var users: [User] = []
}
```

**Correct (protocol dependency, container in the environment, live wiring at the root):**

```swift
import SwiftUI

protocol UserRepository: Sendable {
    func allUsers() async throws -> [User]
    func user(id: User.ID) async throws -> User
}

nonisolated struct AppDependencies: Sendable {
    var userRepository: any UserRepository

    static let preview = AppDependencies(userRepository: InMemoryUserRepository(users: User.samples))

    @MainActor // the composition root runs on the main actor
    static func live(config: AppConfig) -> AppDependencies {
        let client = HTTPClient(baseURL: config.apiBaseURL)
        return AppDependencies(userRepository: RemoteUserRepository(client: client))
    }
}

extension EnvironmentValues {
    @Entry var dependencies: AppDependencies = .preview
}

@main
struct ShopApp: App {
    private let dependencies = AppDependencies.live(config: .current)

    var body: some Scene {
        WindowGroup {
            UsersScreen()
                .environment(\.dependencies, dependencies)
        }
    }
}

struct UsersScreen: View {
    @Environment(\.dependencies) private var dependencies

    var body: some View {
        UserListView(repository: dependencies.userRepository)
    }
}

struct UserListView: View {
    @State private var model: UserListModel

    init(repository: any UserRepository) {
        // @State keeps the first instance; keep model init cheap (no work in init).
        _model = State(initialValue: UserListModel(repository: repository))
    }

    var body: some View {
        List(model.users) { Text($0.name) }
            .task { await model.load() }
    }
}

#Preview {
    UserListView(repository: InMemoryUserRepository(users: User.samples))
}
```

For larger apps, Point-Free's `swift-dependencies` package offers the same idea with less boilerplate.

Reference: [EnvironmentValues](https://developer.apple.com/documentation/swiftui/environmentvalues)

### 5.3 Keep Business Logic out of View Bodies

**Impact: HIGH (body runs on every render)**

A SwiftUI `View` is a cheap value that describes UI, like a JSX element. `body` can run many times per second. Do not sort, filter, format, or call services inside it. Put logic in the model (computed properties, methods), keep `body` a declarative mapping from state to views, and split large bodies into small subviews.

**Incorrect (filtering, sorting, and formatter allocation inside body):**

```swift
import SwiftUI

struct TransactionsView: View {
    let transactions: [CardTransaction]
    @State private var query = ""

    var body: some View {
        let visible = transactions
            .filter { query.isEmpty || $0.merchant.localizedCaseInsensitiveContains(query) }
            .sorted { $0.date > $1.date }
        let formatter = NumberFormatter() // allocated on every render
        formatter.numberStyle = .currency

        return List(visible) { tx in
            Text("\(tx.merchant): \(formatter.string(from: tx.amount as NSNumber) ?? "")")
        }
        .searchable(text: $query)
    }
}
```

**Correct (model owns the logic; body only maps state to views):**

```swift
import SwiftUI

@MainActor
@Observable
final class TransactionsModel {
    var query = ""
    private(set) var transactions: [CardTransaction] = []

    init(transactions: [CardTransaction]) {
        self.transactions = transactions.sorted { $0.date > $1.date }
    }

    var visible: [CardTransaction] {
        guard !query.isEmpty else { return transactions }
        return transactions.filter { $0.merchant.localizedCaseInsensitiveContains(query) }
    }
}

struct TransactionsView: View {
    @State var model: TransactionsModel

    var body: some View {
        List(model.visible) { TransactionRow(transaction: $0) }
            .searchable(text: $model.query)
    }
}

struct TransactionRow: View {
    let transaction: CardTransaction

    var body: some View {
        LabeledContent(transaction.merchant) {
            Text(transaction.amount, format: .currency(code: transaction.currencyCode))
        }
    }
}
```

`Text(_:format:)` uses cached `FormatStyle`s; prefer it over hand-built formatters in views.

Reference: [SwiftUI Essentials](https://developer.apple.com/videos/play/wwdc2024/10150/)

### 5.4 Keep the Domain Layer Free of UI and Transport

**Impact: HIGH (domain logic testable in milliseconds)**

Dependencies point inward: views depend on feature models, feature models depend on domain protocols, and the data layer implements those protocols. The domain layer (entities, business rules, repository protocols) imports only Foundation: no SwiftUI, no URLSession, no SwiftData. Map domain values to UI concepts (colors, icons, strings) in the UI layer.

```text
View (SwiftUI)  →  Feature model (@Observable, @MainActor)
                         ↓ protocol
                   Domain (structs, enums, protocols, rules)
                         ↑ implements
                   Data (HTTP client, persistence, repositories)
```

**Incorrect (domain entity imports SwiftUI and knows about colors):**

```swift
import SwiftUI

struct Subscription {
    let plan: String
    let renewsAt: Date
    var badgeColor: Color { plan == "pro" ? .purple : .gray }
}
```

**Correct (pure domain; UI mapping lives in the UI module):**

```swift
// Domain module
import Foundation

enum Plan: String, Codable, Sendable { case free, pro, team }

struct Subscription: Sendable, Equatable {
    let plan: Plan
    let renewsAt: Date
    let autoRenew: Bool

    func isExpiring(within days: Int, now: Date = .now) -> Bool {
        renewsAt.timeIntervalSince(now) < Double(days) * 86_400
    }
}

// DesignSystem or feature module
import SwiftUI

extension Plan {
    var badgeColor: Color {
        switch self {
        case .free: .gray
        case .pro: .purple
        case .team: .blue
        }
    }
}
```

Name the pattern however you like (MV, MVVM): the layering is what matters. TCA (The Composable Architecture) is a valid heavier option for large teams once the fundamentals are solid.

Reference: [Value and Reference Types](https://www.swift.org/documentation/articles/value-and-reference-types.html)

### 5.5 Model Navigation as Data

**Impact: MEDIUM (deep links and state restoration for free)**

Drive `NavigationStack` with a path of `Hashable` route values and resolve destinations in one `navigationDestination(for:)`. Deep links, push notifications, and state restoration then become "append a route". Avoid `NavigationLink(destination:)` with eagerly built destination views scattered across screens.

**Incorrect (destinations wired inline; nothing can navigate programmatically):**

```swift
import SwiftUI

struct HomeView: View {
    let orders: [Order]

    var body: some View {
        NavigationStack {
            List(orders) { order in
                NavigationLink(destination: OrderDetailView(orderID: order.id)) {
                    Text(order.title)
                }
            }
        }
    }
}
```

**Correct (routes as values, a router model, one destination switch):**

```swift
import SwiftUI

enum Route: Hashable {
    case orderDetail(Order.ID)
    case settings
}

@MainActor
@Observable
final class Router {
    var path: [Route] = []

    func open(_ route: Route) { path.append(route) }
    func popToRoot() { path.removeAll() }
}

struct RootView: View {
    @State private var router = Router()
    let orders: [Order]

    var body: some View {
        NavigationStack(path: $router.path) {
            List(orders) { order in
                NavigationLink(value: Route.orderDetail(order.id)) { Text(order.title) }
            }
            .navigationDestination(for: Route.self) { route in
                switch route {
                case .orderDetail(let id): OrderDetailView(orderID: id)
                case .settings: SettingsView()
                }
            }
        }
        .environment(router)
        .onOpenURL { url in
            if let id = Order.ID(deepLink: url) { router.open(.orderDetail(id)) } // your URL parser
        }
    }
}
```

Reference: [NavigationStack](https://developer.apple.com/documentation/swiftui/navigationstack)

### 5.6 Use @Observable Models, Not ObservableObject

**Impact: HIGH (views re-render only for properties they read)**

The Observation framework (`@Observable`, iOS 17 / macOS 14) replaces `ObservableObject`, `@Published`, `@StateObject`, and `@ObservedObject`. SwiftUI tracks exactly which properties `body` reads and re-renders only when those change, so there is no need for selectors or manual `objectWillChange`. Own a model with `@State`, pass it down as a plain property, share it with `.environment(_:)`, and create bindings with `@Bindable` or `$model.property`.

**Incorrect (Combine-era pattern; every @Published change re-renders every observer):**

```swift
import SwiftUI

final class SettingsModel: ObservableObject {
    @Published var username = ""
    @Published var notificationsEnabled = true
}

struct SettingsView: View {
    @StateObject private var model = SettingsModel()

    var body: some View {
        Form {
            TextField("Username", text: $model.username)
            Toggle("Notifications", isOn: $model.notificationsEnabled)
        }
    }
}
```

**Correct (Observation; fine-grained tracking):**

```swift
import SwiftUI

@MainActor
@Observable
final class SettingsModel {
    var username = ""
    var notificationsEnabled = true
}

struct SettingsView: View {
    @State private var model = SettingsModel()

    var body: some View {
        Form {
            TextField("Username", text: $model.username)
            NotificationsRow(model: model)
        }
    }
}

struct NotificationsRow: View {
    @Bindable var model: SettingsModel // binding to a model owned elsewhere

    var body: some View {
        Toggle("Notifications", isOn: $model.notificationsEnabled)
    }
}
```

React mapping: `@State` ≈ `useState`, `@Binding` ≈ passing a setter down, `@Environment` ≈ `useContext`, an `@Observable` class ≈ a store (Zustand/MobX).

Reference: [Migrating from the Observable Object protocol to the Observable macro](https://developer.apple.com/documentation/swiftui/migrating-from-the-observable-object-protocol-to-the-observable-macro)

---

## 6. Repository Structure and Modularization

**Impact: MEDIUM-HIGH**

A thin app target plus a local Swift package with enforced module boundaries gives faster incremental builds, testable features, and an architecture the compiler enforces.

### 6.1 Expose the Minimal Public API per Module

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

### 6.2 Features Depend on Domain Protocols, Not on Each Other

**Impact: HIGH (features build and test in isolation)**

A feature module should depend on `Domain` (and `DesignSystem`), never on `Networking`, `Persistence`, or another feature. Concrete implementations are wired together only in the app's composition root. Then a change to the HTTP client does not rebuild the UI, and a feature compiles and tests with fakes. Features talk to each other through navigation routes or domain protocols.

**Incorrect (feature reaches into the data layer and another feature):**

```swift
// Sources/FeatureCheckout/CheckoutModel.swift
import Networking   // concrete client
import FeatureCart  // another feature
import Observation

@MainActor
@Observable
final class CheckoutModel {
    let client = HTTPClient.live
    let cart = CartModel()
}
```

**Correct (feature sees only protocols from Domain):**

```swift
// Sources/Domain/CheckoutRepository.swift
public protocol CheckoutRepository: Sendable {
    func currentCart() async throws -> Cart
    func placeOrder(_ cart: Cart) async throws -> Order.ID
}

// Sources/FeatureCheckout/CheckoutModel.swift
import Domain
import Observation

@MainActor
@Observable
public final class CheckoutModel {
    private let repository: any CheckoutRepository
    public private(set) var cart: Cart?

    public init(repository: any CheckoutRepository) {
        self.repository = repository
    }

    public func load() async throws {
        cart = try await repository.currentCart()
    }
}

// App/MyApp.swift (composition root) is the only place that imports both:
// import Networking; import FeatureCheckout
// CheckoutModel(repository: RemoteCheckoutRepository(client: client))
```

Reference: [Swift Package Manager](https://www.swift.org/documentation/package-manager/)

### 6.3 Group Files by Feature, One Primary Type per File

**Impact: MEDIUM (related code changes together)**

Inside a module, group files by feature (screen), not by kind (`Views/`, `ViewModels/`). Name each file after its primary type; put extensions in `Type+Purpose.swift`. Inside a type, order members as stored properties, initializers, public methods, then private helpers, and put each protocol conformance in its own extension marked with `// MARK: -`.

**Incorrect (grouped by kind; one feature spread over four folders):**

```text
FeatureUsers/
├── Views/UserListView.swift
├── Views/UserDetailView.swift
├── ViewModels/UserListViewModel.swift
├── ViewModels/UserDetailViewModel.swift
└── Helpers/Extensions.swift      # 900 lines of unrelated extensions
```

**Correct (grouped by feature; small focused files):**

```text
FeatureUsers/
├── UserList/
│   ├── UserListView.swift
│   ├── UserListModel.swift
│   └── UserRow.swift
├── UserDetail/
│   ├── UserDetailView.swift
│   └── UserDetailModel.swift
├── User+Formatting.swift
└── FeatureUsers.swift            # public entry points
```

```swift
import Foundation

struct UserRowViewData: Identifiable, Sendable {
    let id: User.ID
    let name: String
    let email: String
}

// MARK: - CustomStringConvertible

extension UserRowViewData: CustomStringConvertible {
    var description: String { "\(name) <\(email)>" }
}
```

Reference: [Swift API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/)

### 6.4 Keep Third-Party Dependencies Few and Justified

**Impact: MEDIUM (faster clean builds, fewer upgrade breakages)**

Unlike npm, the Swift standard library and Foundation cover most needs: networking (`URLSession`), JSON (`Codable`), dates and formatting (`FormatStyle`), regex (`Regex`), async streams, logging (`OSLog`), crypto (`CryptoKit`). Every package is compiled from source on clean builds and can break on Xcode upgrades. Add a dependency only for substantial, well-maintained functionality, pin it with `from:` (semantic versioning), and commit `Package.resolved`.

**Incorrect (packages for things the platform already provides):**

```swift
// swift-tools-version: 6.2
import PackageDescription

let package = Package(
    name: "AppCore",
    dependencies: [
        .package(url: "https://github.com/Alamofire/Alamofire", from: "5.0.0"),   // URLSession is enough
        .package(url: "https://github.com/SwiftyJSON/SwiftyJSON", from: "5.0.0"), // Codable is enough
        .package(url: "https://github.com/some/date-helpers", branch: "main"),    // unpinned
    ],
    targets: [.target(name: "AppCore")]
)
```

**Correct (few, substantial, version-pinned dependencies):**

```swift
// swift-tools-version: 6.2
import PackageDescription

let package = Package(
    name: "AppCore",
    dependencies: [
        .package(url: "https://github.com/groue/GRDB.swift", from: "7.0.0"),                    // SQL database
        .package(url: "https://github.com/pointfreeco/swift-snapshot-testing", from: "1.17.0"), // tests only
    ],
    targets: [
        .target(name: "Persistence", dependencies: [.product(name: "GRDB", package: "GRDB.swift")]),
        .testTarget(
            name: "DesignSystemTests",
            dependencies: [.product(name: "SnapshotTesting", package: "swift-snapshot-testing")]
        ),
    ]
)
```

Reference: [Swift Package Index](https://swiftpackageindex.com)

### 6.5 Use a Thin App Target and a Local Swift Package

**Impact: HIGH (faster incremental builds, enforced boundaries)**

A single app target means every change rebuilds a lot, everything can see everything, and tests require the app host. Keep the Xcode app target thin (entry point, composition root, assets, entitlements) and put the code in a local Swift package with one module per layer and feature. It is a monorepo of workspace packages, except that the compiler enforces the boundaries through `internal` and `public`.

**Incorrect (everything in one app target):**

```text
MyApp/
├── MyApp.xcodeproj
└── MyApp/
    ├── Views/          # 200 files
    ├── ViewModels/
    ├── Models/
    ├── Services/
    └── Helpers/
```

**Correct (thin app target plus a modular package):**

```text
MyApp/
├── MyApp.xcodeproj                # app target only
├── App/
│   ├── MyApp.swift                # @main, composition root
│   ├── Config/                    # Debug/Staging/Release .xcconfig
│   └── Resources/                 # Assets.xcassets, Localizable.xcstrings
├── Packages/
│   └── AppCore/
│       ├── Package.swift
│       ├── Sources/
│       │   ├── Domain/            # entities, rules, repository protocols
│       │   ├── Networking/        # HTTPClient, endpoints, DTOs
│       │   ├── Persistence/       # SwiftData/GRDB stores, migrations
│       │   ├── DesignSystem/      # colors, typography, components
│       │   ├── FeatureAuth/
│       │   ├── FeatureUsers/
│       │   └── TestSupport/       # fakes, fixtures
│       └── Tests/
│           ├── DomainTests/
│           ├── NetworkingTests/
│           └── FeatureUsersTests/
└── .swift-format
```

```swift
// swift-tools-version: 6.2
import PackageDescription

let concurrency: [SwiftSetting] = [
    .enableUpcomingFeature("NonisolatedNonsendingByDefault"),
    .enableUpcomingFeature("InferIsolatedConformances"),
]
let ui: [SwiftSetting] = concurrency + [.defaultIsolation(MainActor.self)]

let package = Package(
    name: "AppCore",
    platforms: [.iOS(.v18), .macOS(.v15)],
    products: [
        .library(name: "FeatureUsers", targets: ["FeatureUsers"]),
        .library(name: "FeatureAuth", targets: ["FeatureAuth"]),
        .library(name: "Networking", targets: ["Networking"]),
        .library(name: "Persistence", targets: ["Persistence"]),
    ],
    targets: [
        .target(name: "Domain", swiftSettings: concurrency),
        .target(name: "Networking", dependencies: ["Domain"], swiftSettings: concurrency),
        .target(name: "Persistence", dependencies: ["Domain"], swiftSettings: concurrency),
        .target(name: "DesignSystem", swiftSettings: ui),
        .target(name: "FeatureUsers", dependencies: ["Domain", "DesignSystem"], swiftSettings: ui),
        .target(name: "FeatureAuth", dependencies: ["Domain", "DesignSystem"], swiftSettings: ui),
        .target(name: "TestSupport", dependencies: ["Domain"], swiftSettings: concurrency),
        .testTarget(name: "DomainTests", dependencies: ["Domain", "TestSupport"]),
        .testTarget(name: "NetworkingTests", dependencies: ["Networking", "TestSupport"]),
        .testTarget(name: "FeatureUsersTests", dependencies: ["FeatureUsers", "TestSupport"]),
    ],
    swiftLanguageModes: [.v6]
)
```

Add the package to the Xcode project (File → Add Package Dependencies → Add Local) and link the feature products to the app target. Commit `Package.resolved` like a lockfile.

Reference: [Swift Package Manager](https://www.swift.org/documentation/package-manager/)

---

## 7. Networking and API Integration

**Impact: MEDIUM-HIGH**

A single typed HTTP client with explicit endpoints, DTO mapping, and centralized auth makes API integration predictable and testable.

### 7.1 Centralize Requests in One HTTP Client with an Injected Transport

**Impact: HIGH (one place for auth, decoding, logging, errors)**

Build one `HTTPClient` that owns the base URL, JSON configuration, authorization, logging, and error mapping. Inject the transport behind a protocol so tests can stub responses without the network. Reuse a single `URLSession`; never create one per request. Map transport errors to one `NetworkError` type so callers never see `URLError`.

**Incorrect (each repository builds requests, decoders, and error handling itself):**

```swift
import Foundation

struct RemoteOrdersRepository {
    func orders(token: String) async throws -> [OrderDTO] {
        let session = URLSession(configuration: .default) // new session per call
        var request = URLRequest(url: URL(string: "https://api.example.com/v1/orders")!)
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        let (data, _) = try await session.data(for: request) // status code ignored
        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        return try decoder.decode([OrderDTO].self, from: data)
    }
}
```

**Correct (one client; transport and token provider injected):**

```swift
import Foundation
import OSLog

public protocol HTTPTransport: Sendable {
    func data(for request: URLRequest) async throws -> (Data, URLResponse)
}

public struct URLSessionHTTPTransport: HTTPTransport {
    private let session: URLSession

    public init(session: URLSession = .shared) {
        self.session = session
    }

    public func data(for request: URLRequest) async throws -> (Data, URLResponse) {
        try await session.data(for: request)
    }
}

public protocol AccessTokenProvider: Sendable {
    func validToken() async throws -> String
    func invalidateToken() async
}

public enum NetworkError: Error, Sendable, Equatable {
    case invalidRequest
    case invalidResponse
    case offline
    case timeout
    case cancelled
    case unauthorized
    case http(statusCode: Int, body: Data)
    case decoding(String)
    case transport(String)
}

public final class HTTPClient: Sendable {
    private let baseURL: URL
    private let transport: any HTTPTransport
    private let tokens: (any AccessTokenProvider)?
    private let decoder: JSONDecoder
    private let encoder: JSONEncoder
    private let logger = Logger(subsystem: "com.example.app", category: "network")

    public init(
        baseURL: URL,
        transport: any HTTPTransport = URLSessionHTTPTransport(),
        tokens: (any AccessTokenProvider)? = nil
    ) {
        self.baseURL = baseURL
        self.transport = transport
        self.tokens = tokens

        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        decoder.dateDecodingStrategy = .iso8601
        self.decoder = decoder

        let encoder = JSONEncoder()
        encoder.keyEncodingStrategy = .convertToSnakeCase
        encoder.dateEncodingStrategy = .iso8601
        self.encoder = encoder
    }

    public func send<Response>(_ endpoint: Endpoint<Response>) async throws(NetworkError) -> Response {
        do {
            return try await perform(endpoint, allowAuthRetry: true)
        } catch let error as NetworkError {
            throw error
        } catch let error as URLError {
            switch error.code {
            case .notConnectedToInternet, .networkConnectionLost: throw .offline
            case .timedOut: throw .timeout
            case .cancelled: throw .cancelled
            default: throw .transport(error.localizedDescription)
            }
        } catch is CancellationError {
            throw .cancelled
        } catch {
            throw .transport(String(describing: error))
        }
    }

    private func perform<Response>(
        _ endpoint: Endpoint<Response>,
        allowAuthRetry: Bool
    ) async throws -> Response {
        let request = try await makeRequest(for: endpoint)
        let (data, response) = try await transport.data(for: request)

        guard let http = response as? HTTPURLResponse else { throw NetworkError.invalidResponse }
        logger.debug("\(endpoint.method.rawValue, privacy: .public) \(endpoint.path, privacy: .public) -> \(http.statusCode)")

        switch http.statusCode {
        case 200..<300:
            return try decode(Response.self, from: data)
        case 401 where endpoint.requiresAuth && allowAuthRetry:
            await tokens?.invalidateToken()
            return try await perform(endpoint, allowAuthRetry: false) // retry once with a fresh token
        case 401:
            throw NetworkError.unauthorized
        default:
            throw NetworkError.http(statusCode: http.statusCode, body: data)
        }
    }

    private func decode<Response: Decodable>(_ type: Response.Type, from data: Data) throws -> Response {
        if data.isEmpty, let empty = EmptyResponse() as? Response {
            return empty
        }
        do {
            return try decoder.decode(Response.self, from: data)
        } catch {
            logger.error("Decoding \(String(describing: Response.self), privacy: .public) failed: \(String(describing: error), privacy: .public)")
            throw NetworkError.decoding(String(describing: error))
        }
    }

    private func makeRequest<Response>(for endpoint: Endpoint<Response>) async throws -> URLRequest {
        guard var components = URLComponents(
            url: baseURL.appending(path: endpoint.path),
            resolvingAgainstBaseURL: false
        ) else { throw NetworkError.invalidRequest }
        if !endpoint.query.isEmpty { components.queryItems = endpoint.query }
        guard let url = components.url else { throw NetworkError.invalidRequest }

        var request = URLRequest(url: url)
        request.httpMethod = endpoint.method.rawValue
        request.setValue("application/json", forHTTPHeaderField: "Accept")

        if let body = endpoint.body {
            request.httpBody = try encoder.encode(body)
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        }
        if endpoint.requiresAuth, let tokens {
            let token = try await tokens.validToken()
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        return request
    }
}
```

`.iso8601` does not accept fractional seconds; if your API sends them, use `.custom` with `Date.ISO8601FormatStyle(includingFractionalSeconds: true)`. For custom timeouts or caching, create one `URLSessionConfiguration` at startup and pass `URLSession(configuration:)` to the transport.

Reference: [Fetching website data into memory](https://developer.apple.com/documentation/foundation/fetching-website-data-into-memory)

### 7.2 Decode DTOs and Map Them to Domain Models at the Boundary

**Impact: MEDIUM-HIGH (API changes stay out of features)**

Decode JSON into DTO structs that mirror the wire format, then map them to domain models in the data layer. `Codable` validates the shape like a schema library (zod) would: a missing key or wrong type throws a precise `DecodingError`. Mapping is where you convert raw strings into enums, rename fields, and reject invalid data, so backend quirks never reach views.

**Incorrect (views consume the wire format directly):**

```swift
import SwiftUI

struct UserDTO: Decodable {
    let id: String
    let full_name: String
    let role: String // "admin" | "member" | ... unchecked
}

struct UserRow: View {
    let user: UserDTO
    var body: some View {
        Text(user.full_name)
            .foregroundStyle(user.role == "admin" ? .red : .primary) // string comparison in UI
    }
}
```

**Correct (DTO for decoding, domain model for the app, explicit mapping):**

```swift
import Foundation

struct UserDTO: Decodable, Sendable {
    let id: UUID
    let fullName: String   // decoded from "full_name" via .convertFromSnakeCase
    let email: String
    let role: String
    let createdAt: Date
}

enum Role: String, Sendable, Codable {
    case admin, member, guest
}

struct User: Identifiable, Hashable, Sendable {
    typealias ID = Tagged<User, UUID>
    let id: ID
    var name: String
    var email: String
    var role: Role
}

enum MappingError: Error, Equatable {
    case unknownRole(String)
}

extension User {
    init(dto: UserDTO) throws {
        guard let role = Role(rawValue: dto.role) else { throw MappingError.unknownRole(dto.role) }
        self.init(id: ID(dto.id), name: dto.fullName, email: dto.email, role: role)
    }
}

struct RemoteUserRepository: UserRepository {
    let client: HTTPClient

    func allUsers() async throws -> [User] {
        let page = try await client.send(UsersEndpoints.list(cursor: nil))
        return try page.items.map(User.init(dto:))
    }

    func user(id: User.ID) async throws -> User {
        try User(dto: await client.send(UsersEndpoints.user(id: id)))
    }
}
```

When a key cannot be derived by snake-case conversion, declare `enum CodingKeys: String, CodingKey` on the DTO. Never put `CodingKeys` or wire-format names on domain models.

Reference: [Encoding and Decoding Custom Types](https://developer.apple.com/documentation/foundation/encoding-and-decoding-custom-types)

### 7.3 Describe Endpoints as Typed Values

**Impact: HIGH (response types checked at compile time)**

Represent each API call as a value that carries its HTTP method, path, query, body, and response type: `Endpoint<Response>`. Group endpoints per resource in a caseless enum. The client then has one generic `send(_:)` method, call sites cannot decode the wrong type, and the endpoint list doubles as a typed API spec.

**Incorrect (stringly typed requests; response type chosen by each caller):**

```swift
import Foundation

func get(_ path: String) async throws -> Data {
    let url = URL(string: "https://api.example.com" + path)!
    return try await URLSession.shared.data(from: url).0
}

let data = try await get("/v1/users/\(id)")
let user = try JSONDecoder().decode(Order.self, from: data) // wrong type, fails at runtime
```

**Correct (endpoint values with a response type):**

```swift
import Foundation

public enum HTTPMethod: String, Sendable {
    case get = "GET", post = "POST", put = "PUT", patch = "PATCH", delete = "DELETE"
}

public struct Endpoint<Response: Decodable & Sendable>: Sendable {
    public var method: HTTPMethod
    public var path: String
    public var query: [URLQueryItem]
    public var body: (any Encodable & Sendable)?
    public var requiresAuth: Bool

    public init(
        _ method: HTTPMethod,
        _ path: String,
        query: [URLQueryItem] = [],
        body: (any Encodable & Sendable)? = nil,
        requiresAuth: Bool = true
    ) {
        self.method = method
        self.path = path
        self.query = query
        self.body = body
        self.requiresAuth = requiresAuth
    }
}

/// Use for endpoints that return no body (204 No Content).
public struct EmptyResponse: Decodable, Sendable {
    public init() {}
}

enum UsersEndpoints {
    static func list(cursor: String?) -> Endpoint<Page<UserDTO>> {
        Endpoint(.get, "/v1/users", query: cursor.map { [URLQueryItem(name: "cursor", value: $0)] } ?? [])
    }

    static func user(id: User.ID) -> Endpoint<UserDTO> {
        Endpoint(.get, "/v1/users/\(id.rawValue.uuidString)")
    }

    static func update(id: User.ID, _ body: UpdateUserRequest) -> Endpoint<UserDTO> {
        Endpoint(.patch, "/v1/users/\(id.rawValue.uuidString)", body: body)
    }

    static func delete(id: User.ID) -> Endpoint<EmptyResponse> {
        Endpoint(.delete, "/v1/users/\(id.rawValue.uuidString)")
    }
}

struct Page<Item: Decodable & Sendable>: Decodable, Sendable {
    let items: [Item]
    let nextCursor: String?
}
```

Usage: `let dto = try await client.send(UsersEndpoints.user(id: id))`, where `dto` is statically `UserDTO`.

Reference: [URLSession](https://developer.apple.com/documentation/foundation/urlsession)

### 7.4 Generate Clients from OpenAPI for Large APIs

**Impact: MEDIUM (removes hand-written endpoint drift)**

When the backend publishes an OpenAPI document, generate the Swift client with Apple's Swift OpenAPI Generator (an SPM build plugin) instead of hand-writing dozens of endpoints and DTOs. It is the Swift counterpart of `openapi-typescript`: types and client methods are regenerated on every build, and every documented response is an enum case you must handle.

**Incorrect (hand-maintained copies of 80 backend endpoints):**

```swift
enum BillingEndpoints {
    static func invoices() -> Endpoint<[InvoiceDTO]> { Endpoint(.get, "/v1/invoices") }
    static func invoice(id: String) -> Endpoint<InvoiceDTO> { Endpoint(.get, "/v1/invoices/\(id)") }
    // ...78 more, silently drifting from the server
}
```

**Correct (generated types and client from `openapi.yaml`):**

```swift
// swift-tools-version: 6.2
import PackageDescription

let package = Package(
    name: "AppCore",
    platforms: [.iOS(.v18), .macOS(.v15)],
    dependencies: [
        .package(url: "https://github.com/apple/swift-openapi-generator", from: "1.0.0"),
        .package(url: "https://github.com/apple/swift-openapi-runtime", from: "1.0.0"),
        .package(url: "https://github.com/apple/swift-openapi-urlsession", from: "1.0.0"),
    ],
    targets: [
        .target(
            name: "BillingAPI",
            dependencies: [
                .product(name: "OpenAPIRuntime", package: "swift-openapi-runtime"),
                .product(name: "OpenAPIURLSession", package: "swift-openapi-urlsession"),
            ],
            plugins: [.plugin(name: "OpenAPIGenerator", package: "swift-openapi-generator")]
        ),
    ]
)
```

```yaml
# Sources/BillingAPI/openapi-generator-config.yaml  (openapi.yaml sits next to it)
generate:
  - types
  - client
accessModifier: internal
```

```swift
import Foundation
import OpenAPIRuntime
import OpenAPIURLSession

struct BillingRepository {
    private let client = Client(
        serverURL: URL(string: "https://api.example.com")!,
        transport: URLSessionTransport()
    )

    func invoice(id: String) async throws -> Components.Schemas.Invoice {
        let response = try await client.getInvoice(path: .init(id: id)) // operationId: getInvoice
        switch response {
        case .ok(let ok):
            return try ok.body.json
        case .notFound:
            throw BillingError.notFound
        case .undocumented(let statusCode, _):
            throw BillingError.unexpectedStatus(statusCode)
        }
    }
}
```

Generated method and type names come from `operationId` and schema names in your spec. Keep mapping generated types to domain models in the repository, as with hand-written DTOs.

Reference: [Swift OpenAPI Generator](https://github.com/apple/swift-openapi-generator)

### 7.5 Refresh Tokens Once and Retry 401s Once

**Impact: HIGH (no refresh storms, no infinite retry loops)**

When the access token expires, many concurrent requests get `401` at the same time. Each one refreshing on its own floods the auth server and races on the stored token. Keep the token in an actor that deduplicates in-flight refreshes (see `concurrency-actor-reentrancy`), invalidate it on `401`, and retry the request exactly once. Store refresh tokens in the Keychain, never in `UserDefaults`.

**Incorrect (every 401 triggers its own refresh; retries forever):**

```swift
func send<R>(_ endpoint: Endpoint<R>) async throws -> R {
    do {
        return try await perform(endpoint)
    } catch NetworkError.unauthorized {
        token = try await authAPI.refresh() // N concurrent refreshes, racing writes
        return try await send(endpoint)     // loops forever if refresh keeps failing
    }
}
```

**Correct (actor-backed provider; the client retries once):**

```swift
public actor AuthTokenStore: AccessTokenProvider {
    private var token: String?
    private var refreshTask: Task<String, any Error>?
    private let refresh: @Sendable () async throws -> String

    public init(refresh: @escaping @Sendable () async throws -> String) {
        self.refresh = refresh
    }

    public func validToken() async throws -> String {
        if let token { return token }
        if let refreshTask { return try await refreshTask.value }

        let refresh = self.refresh
        let task = Task { try await refresh() }
        refreshTask = task
        defer { refreshTask = nil }

        let newToken = try await task.value
        token = newToken
        return newToken
    }

    public func invalidateToken() {
        token = nil
    }
}

// Composition root:
// let tokens = AuthTokenStore(refresh: { try await authAPI.refreshAccessToken(using: keychain) })
// let client = HTTPClient(baseURL: config.apiBaseURL, tokens: tokens)
```

`HTTPClient.perform` (see `networking-single-client`) handles `401` by calling `invalidateToken()` and retrying with `allowAuthRetry: false`; a second `401` surfaces as `NetworkError.unauthorized`, which the app handles by signing out.

Reference: [SE-0306 Actors](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0306-actors.md)

### 7.6 Retry Only Idempotent Requests with Backoff

**Impact: MEDIUM (resilience without duplicate side effects)**

Retry transient failures (timeouts, connection loss, 502/503/504) with exponential backoff, and only for idempotent operations (GET, PUT, DELETE) or requests that carry an idempotency key. Retrying a POST that already succeeded on the server charges a card twice. Do not retry client errors (4xx) or cancellation.

**Incorrect (blind immediate retries of any request):**

```swift
func createOrder(_ request: CreateOrderRequest) async throws -> Order {
    for _ in 0..<3 {
        if let order = try? await api.createOrder(request) { return order } // may create 3 orders
    }
    throw OrderError.failed
}
```

**Correct (retry helper with backoff and an explicit retry predicate):**

```swift
func withRetry<T>(
    maxAttempts: Int = 3,
    initialDelay: Duration = .milliseconds(500),
    isRetryable: (any Error) -> Bool,
    operation: () async throws -> T
) async throws -> T {
    var attempt = 1
    var delay = initialDelay
    while true {
        do {
            return try await operation()
        } catch let error where attempt < maxAttempts && isRetryable(error) {
            try await Task.sleep(for: delay) // throws CancellationError if cancelled
            delay *= 2
            attempt += 1
        }
    }
}

extension NetworkError {
    var isTransient: Bool {
        switch self {
        case .offline, .timeout: true
        case .http(let statusCode, _): [502, 503, 504].contains(statusCode)
        case .invalidRequest, .invalidResponse, .cancelled, .unauthorized, .decoding, .transport: false
        }
    }
}

// GET is idempotent: safe to retry.
func loadUser(id: User.ID, client: HTTPClient) async throws -> UserDTO {
    try await withRetry(isRetryable: { ($0 as? NetworkError)?.isTransient ?? false }) {
        try await client.send(UsersEndpoints.user(id: id))
    }
}
```

For non-idempotent writes, send an `Idempotency-Key` header with a UUID generated once per user action, and retry only if the backend supports it.

Reference: [Task.sleep(for:tolerance:clock:)](https://developer.apple.com/documentation/swift/task/sleep(for:tolerance:clock:))

---

## 8. Persistence and Local Data

**Impact: MEDIUM-HIGH**

Choosing the right store (UserDefaults, Keychain, SwiftData, GRDB) and respecting actor boundaries prevents data loss, leaked secrets, and threading crashes.

### 8.1 Choose the Right Store for Each Kind of Data

**Impact: HIGH (secrets protected, data in the right place)**

| Data | Store |
|---|---|
| Small preferences and flags | `UserDefaults` / `@AppStorage` |
| Secrets (tokens, passwords, keys) | Keychain |
| Files, caches, exports | `FileManager` (Application Support, Caches) |
| Relational app data, SwiftUI integration, iCloud sync | SwiftData |
| Full SQL control, complex queries, explicit migrations | GRDB (SQLite) |
| Your backend's database (PostgreSQL, etc.) | Never from the app: go through your API |

`UserDefaults` is an unencrypted plist readable from device backups. A mobile or desktop app must never hold database credentials for your backend: anything in the bundle can be extracted. The local database is a cache or offline store; the server stays the source of truth.

**Incorrect (secret in UserDefaults, backend database credentials shipped in the app):**

```swift
import Foundation

UserDefaults.standard.set(accessToken, forKey: "accessToken")

let databaseURL = "postgres://admin:s3cret@db.example.com:5432/prod" // extractable from the binary
```

**Correct (flags in UserDefaults, secrets in the Keychain, server data via the API):**

```swift
import SwiftUI

struct OnboardingGate: View {
    @AppStorage("hasSeenOnboarding") private var hasSeenOnboarding = false

    var body: some View {
        if hasSeenOnboarding { HomeView() } else { OnboardingView { hasSeenOnboarding = true } }
    }
}

func storeSession(token: String, keychain: Keychain) throws {
    try keychain.set(Data(token.utf8), for: "accessToken") // see persistence-keychain-secrets
}

func loadOrders(client: HTTPClient) async throws -> [OrderDTO] {
    try await client.send(OrdersEndpoints.list()) // the server owns the database
}
```

Reference: [SwiftData](https://developer.apple.com/documentation/swiftdata), [Keychain services](https://developer.apple.com/documentation/security/keychain-services)

### 8.2 Pass PersistentIdentifiers, Not Model Objects, Across Actors

**Impact: HIGH (prevents context-threading crashes)**

`@Model` instances are bound to the context that fetched them and are not `Sendable`. Sending one to another actor is a compile error in Swift 6 (and undefined behavior if forced). Send the `persistentModelID` (which is `Sendable`) or a value-type snapshot, and re-fetch inside the receiving actor.

**Incorrect (model object handed to a background actor):**

```swift
@MainActor
func archive(_ project: Project, store: ProjectSyncStore) async throws {
    try await store.archive(project) // Project is not Sendable
}
```

**Correct (identifier crosses the boundary; the actor re-fetches):**

```swift
import SwiftData

extension ProjectSyncStore {
    func rename(projectID: PersistentIdentifier, to newName: String) throws {
        guard let project = modelContext.model(for: projectID) as? Project else { return }
        project.name = newName
        try modelContext.save()
    }
}

@MainActor
func rename(_ project: Project, to name: String, store: ProjectSyncStore) async throws {
    try await store.rename(projectID: project.persistentModelID, to: name)
}
```

For domain logic that should not depend on SwiftData at all, map `@Model` objects to plain structs at the repository boundary.

Reference: [PersistentIdentifier](https://developer.apple.com/documentation/swiftdata/persistentidentifier)

### 8.3 Store Secrets in the Keychain

**Impact: HIGH (tokens encrypted at rest)**

The Keychain encrypts items with keys tied to the device and the user's passcode. Wrap the C-style `Security` API in a small `Sendable` type that the rest of the app uses. Choose the accessibility class deliberately: `kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly` allows background refresh after the first unlock and keeps the item out of backups that move to other devices.

**Incorrect (secret in a plain file or UserDefaults):**

```swift
import Foundation

let url = URL.documentsDirectory.appending(path: "token.txt")
try refreshToken.write(to: url, atomically: true, encoding: .utf8)
```

**Correct (minimal Keychain wrapper):**

```swift
import Foundation
import Security

struct Keychain: Sendable {
    enum KeychainError: Error, Equatable {
        case unexpectedStatus(OSStatus)
    }

    let service: String

    func set(_ value: Data, for key: String) throws {
        let query = baseQuery(for: key)
        SecItemDelete(query as CFDictionary) // replace any existing item

        var attributes = query
        attributes[kSecValueData as String] = value
        attributes[kSecAttrAccessible as String] = kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly

        let status = SecItemAdd(attributes as CFDictionary, nil)
        guard status == errSecSuccess else { throw KeychainError.unexpectedStatus(status) }
    }

    func data(for key: String) throws -> Data? {
        var query = baseQuery(for: key)
        query[kSecReturnData as String] = true
        query[kSecMatchLimit as String] = kSecMatchLimitOne

        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        switch status {
        case errSecSuccess: return result as? Data
        case errSecItemNotFound: return nil
        default: throw KeychainError.unexpectedStatus(status)
        }
    }

    func delete(_ key: String) throws {
        let status = SecItemDelete(baseQuery(for: key) as CFDictionary)
        guard status == errSecSuccess || status == errSecItemNotFound else {
            throw KeychainError.unexpectedStatus(status)
        }
    }

    private func baseQuery(for key: String) -> [String: Any] {
        [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key,
        ]
    }
}
```

Keychain items survive app deletion on iOS; clear them on first launch after reinstall if your app requires a fresh sign-in.

Reference: [Keychain services](https://developer.apple.com/documentation/security/keychain-services)

### 8.4 Version Your Schema from the First Release

**Impact: MEDIUM-HIGH (upgrades without data loss)**

Users skip app versions, so every installed schema must migrate to the current one. Declare each shipped schema as a `VersionedSchema` and the transitions in a `SchemaMigrationPlan`. Use lightweight stages for additive changes (new optional or defaulted properties) and custom stages when data must be transformed. Unversioned models force you to retrofit versioning after users already have data on disk.

**Incorrect (model edited in place across releases):**

```swift
import SwiftData

@Model
final class Note {
    var title: String
    var body: String
    var isPinned: Bool // added in 2.0: existing stores may fail to open
    init(title: String, body: String, isPinned: Bool) {
        self.title = title
        self.body = body
        self.isPinned = isPinned
    }
}
```

**Correct (versioned schemas and a migration plan):**

```swift
import SwiftData

enum NotesSchemaV1: VersionedSchema {
    static var versionIdentifier: Schema.Version { Schema.Version(1, 0, 0) }
    static var models: [any PersistentModel.Type] { [Note.self] }

    @Model
    final class Note {
        var title: String
        var body: String
        init(title: String, body: String) {
            self.title = title
            self.body = body
        }
    }
}

enum NotesSchemaV2: VersionedSchema {
    static var versionIdentifier: Schema.Version { Schema.Version(2, 0, 0) }
    static var models: [any PersistentModel.Type] { [Note.self] }

    @Model
    final class Note {
        var title: String
        var body: String
        var isPinned: Bool = false
        init(title: String, body: String, isPinned: Bool = false) {
            self.title = title
            self.body = body
            self.isPinned = isPinned
        }
    }
}

enum NotesMigrationPlan: SchemaMigrationPlan {
    static var schemas: [any VersionedSchema.Type] { [NotesSchemaV1.self, NotesSchemaV2.self] }
    static var stages: [MigrationStage] {
        [.lightweight(fromVersion: NotesSchemaV1.self, toVersion: NotesSchemaV2.self)]
    }
}

typealias Note = NotesSchemaV2.Note

func makeContainer() throws -> ModelContainer {
    try ModelContainer(for: Note.self, migrationPlan: NotesMigrationPlan.self)
}
```

With GRDB, the same discipline is `DatabaseMigrator` with one named migration per change, never edited after release.

Reference: [SchemaMigrationPlan](https://developer.apple.com/documentation/swiftdata/schemamigrationplan)

### 8.5 Write SwiftData in the Background with @ModelActor

**Impact: HIGH (large syncs without blocking the UI)**

A `ModelContext` belongs to the actor that created it. The `@ModelActor` macro creates an actor with its own context on a background executor; use it to upsert API data in bulk. The UI reads through `@Query`, which updates automatically when the store changes. Keep `@Model` classes in a module whose default isolation is `nonisolated` (for example `Persistence`); under main-actor default isolation they are inferred `@MainActor` and cannot be used from a model actor.

**Incorrect (thousands of inserts on the main context during sync):**

```swift
import SwiftData

@MainActor
func sync(dtos: [ProjectDTO], context: ModelContext) throws {
    for dto in dtos {
        context.insert(Project(remoteID: dto.id, name: dto.name, createdAt: dto.createdAt)) // UI stalls
    }
    try context.save()
}
```

**Correct (model actor upserts; the UI observes via @Query):**

```swift
import Foundation
import SwiftData

@Model
final class Project {
    @Attribute(.unique) var remoteID: UUID
    var name: String
    var createdAt: Date

    init(remoteID: UUID, name: String, createdAt: Date) {
        self.remoteID = remoteID
        self.name = name
        self.createdAt = createdAt
    }
}

struct ProjectDTO: Decodable, Sendable {
    let id: UUID
    let name: String
    let createdAt: Date
}

@ModelActor
actor ProjectSyncStore {
    func upsert(_ dtos: [ProjectDTO]) throws {
        for dto in dtos {
            let remoteID = dto.id
            var descriptor = FetchDescriptor<Project>(
                predicate: #Predicate<Project> { $0.remoteID == remoteID }
            )
            descriptor.fetchLimit = 1

            if let existing = try modelContext.fetch(descriptor).first {
                existing.name = dto.name
            } else {
                modelContext.insert(Project(remoteID: dto.id, name: dto.name, createdAt: dto.createdAt))
            }
        }
        try modelContext.save()
    }
}

// Feature code (main actor):
// let store = ProjectSyncStore(modelContainer: container)
// try await store.upsert(try await client.send(ProjectsEndpoints.list()))
//
// View:
// @Query(sort: \Project.createdAt, order: .reverse) private var projects: [Project]
```

Reference: [ModelActor](https://developer.apple.com/documentation/swiftdata/modelactor)

---

## 9. Webhooks, Push, and Real-Time

**Impact: MEDIUM**

Apps cannot receive webhooks. Server-side ingestion, push notifications, and WebSocket streams must be wired together correctly to deliver real-time updates.

### 9.1 Expose WebSockets as AsyncThrowingStream with Reconnect and Resync

**Impact: MEDIUM (live updates that survive network changes)**

Wrap `URLSessionWebSocketTask` in a function returning `AsyncThrowingStream`, so features consume events with `for try await` and cancellation closes the socket. Sockets drop on network changes: reconnect with capped exponential backoff and re-sync state through REST after every (re)connect, because events sent while disconnected are lost. A stateless client does not need to be an actor.

**Incorrect (callback recursion, no cleanup, no reconnect, no resync):**

```swift
import Foundation

final class LiveClient {
    var onEvent: ((ServerEvent) -> Void)?
    private var socket: URLSessionWebSocketTask?

    func connect(url: URL) {
        socket = URLSession.shared.webSocketTask(with: url)
        socket?.resume()
        listen()
    }

    private func listen() {
        socket?.receive { result in
            if case .success(.string(let text)) = result,
               let event = try? JSONDecoder().decode(ServerEvent.self, from: Data(text.utf8)) {
                self.onEvent?(event) // strong self capture; stops forever on first failure
                self.listen()
            }
        }
    }
}
```

**Correct (stream with cleanup; consumer reconnects and resyncs):**

```swift
import Foundation
import Observation
import OSLog

struct ServerEvent: Decodable, Sendable {
    let orderID: Order.ID
    let status: OrderStatus
}

struct LiveUpdatesClient: Sendable {
    let url: URL
    var session: URLSession = .shared

    func events(token: String) -> AsyncThrowingStream<ServerEvent, any Error> {
        var request = URLRequest(url: url)
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        let socket = session.webSocketTask(with: request)

        return AsyncThrowingStream { continuation in
            let receiveLoop = Task {
                do {
                    while !Task.isCancelled {
                        guard case .string(let text) = try await socket.receive() else { continue }
                        // Skip unknown event types for forward compatibility.
                        if let event = try? JSONDecoder().decode(ServerEvent.self, from: Data(text.utf8)) {
                            continuation.yield(event)
                        }
                    }
                    continuation.finish()
                } catch {
                    continuation.finish(throwing: error)
                }
            }
            continuation.onTermination = { _ in
                receiveLoop.cancel()
                socket.cancel(with: .goingAway, reason: nil)
            }
            socket.resume()
        }
    }
}

@MainActor
@Observable
final class LiveOrdersModel {
    private(set) var statuses: [Order.ID: OrderStatus] = [:]
    private let logger = Logger(subsystem: "com.example.app", category: "live")

    /// Run from `.task { }` so it is cancelled with the view.
    func observe(client: LiveUpdatesClient, token: String, resync: () async throws -> [Order.ID: OrderStatus]) async {
        var delay: Duration = .seconds(1)
        while !Task.isCancelled {
            do {
                statuses = try await resync() // catch up on anything missed while disconnected
                for try await event in client.events(token: token) {
                    statuses[event.orderID] = event.status
                    delay = .seconds(1)
                }
            } catch {
                logger.error("Live updates disconnected: \(error.localizedDescription, privacy: .public)")
            }
            do {
                try await Task.sleep(for: delay)
            } catch {
                return // cancelled
            }
            delay = min(delay * 2, .seconds(30))
        }
    }
}
```

For one-way server streams, Server-Sent Events over `URLSession.bytes(for:)` with `for try await line in bytes.lines` are simpler than WebSockets.

Reference: [URLSessionWebSocketTask](https://developer.apple.com/documentation/foundation/urlsessionwebsockettask)

### 9.2 Receive Webhooks on the Server, Then Notify the App

**Impact: HIGH (reliable real-time updates without polling)**

A webhook is an HTTP POST from a third party (Stripe, GitHub, Paddle) to a public server URL. An iOS or macOS app has no public address and may be suspended or offline, so it cannot receive webhooks. Ingest webhooks in your backend (Node, or Swift with Vapor), persist the result, then notify the app: APNs push when it may be in the background, WebSocket or SSE when it is open. The app always re-fetches authoritative state from your API.

```text
Provider ──webhook──▶ Backend ──▶ database (source of truth)
                         ├──▶ APNs push ──▶ app (alert or silent refresh)
                         └──▶ WebSocket/SSE ──▶ app (while open)
App ──GET /v1/orders/{id}──▶ Backend
```

**Incorrect (app polls the provider on a timer with an embedded secret key):**

```swift
import Foundation

@MainActor
final class PaymentStatusModel {
    var status = "pending"
    private var timer: Timer?

    func start(paymentID: String) {
        timer = Timer.scheduledTimer(withTimeInterval: 2, repeats: true) { _ in
            Task { @MainActor in
                // Secret API key shipped in the app; battery drain; misses updates while suspended.
                self.status = try await StripeDirect(secretKey: "sk_live_...").status(of: paymentID)
            }
        }
    }
}
```

**Correct (server ingests the webhook; app reacts to push or socket and re-fetches):**

```swift
import Foundation
import Observation

@MainActor
@Observable
final class PaymentStatusModel {
    private(set) var status: PaymentStatus = .pending
    private let repository: any PaymentsRepository

    init(repository: any PaymentsRepository) {
        self.repository = repository
    }

    /// Called when a push notification or socket event says this payment changed.
    func paymentDidChange(id: Payment.ID) async {
        do {
            status = try await repository.payment(id: id).status // the API is the source of truth
        } catch {
            // Keep the last known state; the next event or screen refresh will retry.
        }
    }
}

protocol PaymentsRepository: Sendable {
    func payment(id: Payment.ID) async throws -> Payment
}
```

Reference: [Setting up a remote notification server](https://developer.apple.com/documentation/usernotifications/setting-up-a-remote-notification-server)

### 9.3 Register for Push and Handle Delegate Callbacks Off the Main Actor

**Impact: MEDIUM (correct token registration and notification routing)**

Request authorization, register with APNs, and send the hex-encoded device token to your backend, which stores it per user and sends pushes with an APNs auth key (.p8). In a SwiftUI app, hook into the app delegate with `@UIApplicationDelegateAdaptor` (`@NSApplicationDelegateAdaptor` on macOS). `UNUserNotificationCenterDelegate` callbacks are not guaranteed to arrive on the main actor: implement them `nonisolated`, extract `Sendable` values, then hop to the main actor.

**Incorrect (token never sent; main-actor state mutated from a nonisolated callback):**

```swift
import UIKit
import UserNotifications

final class AppDelegate: NSObject, UIApplicationDelegate, UNUserNotificationCenterDelegate {
    var lastOrderID: String?

    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        print(deviceToken) // prints "32 bytes"; backend never learns the token
    }
}
```

**Correct (coordinator with nonisolated delegate methods; token forwarded):**

```swift
import SwiftUI
import UserNotifications

@MainActor
final class PushCoordinator: NSObject, UNUserNotificationCenterDelegate {
    var onDeviceToken: ((String) -> Void)?
    var onOpenOrder: ((String) -> Void)?

    func requestAuthorization() async throws -> Bool {
        try await UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound])
    }

    func didRegister(deviceToken: Data) {
        onDeviceToken?(deviceToken.map { String(format: "%02x", $0) }.joined())
    }

    nonisolated func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        didReceive response: UNNotificationResponse
    ) async {
        guard let orderID = response.notification.request.content.userInfo["order_id"] as? String else { return }
        await openOrder(orderID)
    }

    nonisolated func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        willPresent notification: UNNotification
    ) async -> UNNotificationPresentationOptions {
        [.banner, .sound]
    }

    private func openOrder(_ orderID: String) {
        onOpenOrder?(orderID)
    }
}

final class AppDelegate: NSObject, UIApplicationDelegate {
    let push = PushCoordinator()

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) -> Bool {
        UNUserNotificationCenter.current().delegate = push
        application.registerForRemoteNotifications()
        return true
    }

    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        push.didRegister(deviceToken: deviceToken)
    }

    func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: any Error) {
        // Simulator without APNs support, missing entitlement, or no network: log it.
    }
}

@main
struct ShopApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) private var appDelegate
    @State private var router = Router()
    private let devices = DevicesAPI.live // your backend client: POST /v1/devices

    var body: some Scene {
        WindowGroup {
            RootView()
                .environment(router)
                .task {
                    appDelegate.push.onOpenOrder = { rawID in
                        guard let uuid = UUID(uuidString: rawID) else { return }
                        router.open(.orderDetail(Order.ID(uuid)))
                    }
                    appDelegate.push.onDeviceToken = { token in
                        Task {
                            do {
                                try await devices.register(token: token)
                            } catch {
                                // Registration is retried on the next launch.
                            }
                        }
                    }
                    do {
                        _ = try await appDelegate.push.requestAuthorization()
                    } catch {
                        // Authorization request failed; the app keeps working without push.
                    }
                }
        }
    }
}
```

Enable the Push Notifications capability (and Background Modes → Remote notifications for silent pushes). Silent pushes (`content-available: 1`) are throttled by the system: treat them as hints, not guaranteed delivery.

Reference: [Registering your app with APNs](https://developer.apple.com/documentation/usernotifications/registering-your-app-with-apns)

### 9.4 Verify Webhook Signatures and Process Events Idempotently

**Impact: HIGH (blocks forged events and double processing)**

When the backend is written in Swift (Vapor), apply the same rules as in Node: verify the HMAC signature over the raw body with a constant-time comparison, reject stale timestamps to stop replays, deduplicate by event ID because providers retry, acknowledge quickly with 2xx, and do heavy work in a background job.

**Incorrect (trusts any POST, decodes before verifying, processes retries twice):**

```swift
import Vapor

func routes(_ app: Application) throws {
    app.post("webhooks", "payments") { req async throws -> HTTPStatus in
        let event = try req.content.decode(PaymentEvent.self) // anyone can forge this
        try await fulfill(event)                               // slow; provider retries; double fulfillment
        return .ok
    }
}
```

**Correct (Vapor 4: signature, timestamp, idempotency, async job):**

```swift
import Crypto               // swift-crypto (CryptoKit API on Linux)
import Foundation
import NIOFoundationCompat  // Data(buffer:)
import Vapor

protocol WebhookEventLog: Sendable {
    /// Returns false if the event was already recorded (e.g. INSERT ... ON CONFLICT DO NOTHING).
    func markProcessedIfNew(_ eventID: String) async throws -> Bool
}

protocol JobQueue: Sendable {
    func enqueue(_ event: PaymentEvent) async throws
}

struct PaymentEvent: Codable, Sendable {
    let id: String
    let type: String
    let paymentID: String
}

struct PaymentWebhookController: RouteCollection {
    let signingSecret: SymmetricKey
    let eventLog: any WebhookEventLog
    let jobs: any JobQueue
    let tolerance: TimeInterval = 300

    func boot(routes: any RoutesBuilder) throws {
        routes.on(.POST, "webhooks", "payments", body: .collect(maxSize: "1mb"), use: receive)
    }

    @Sendable
    func receive(req: Request) async throws -> HTTPStatus {
        guard
            let timestampHeader = req.headers.first(name: "X-Webhook-Timestamp"),
            let timestamp = TimeInterval(timestampHeader),
            let signatureHex = req.headers.first(name: "X-Webhook-Signature"),
            let signature = Data(hexString: signatureHex),
            let buffer = req.body.data
        else { throw Abort(.badRequest) }

        guard abs(Date().timeIntervalSince1970 - timestamp) <= tolerance else {
            throw Abort(.unauthorized, reason: "Stale timestamp")
        }

        let body = Data(buffer: buffer)
        let signedPayload = Data("\(timestampHeader).".utf8) + body
        guard HMAC<SHA256>.isValidAuthenticationCode(signature, authenticating: signedPayload, using: signingSecret) else {
            throw Abort(.unauthorized, reason: "Invalid signature")
        }

        let event = try JSONDecoder().decode(PaymentEvent.self, from: body)
        guard try await eventLog.markProcessedIfNew(event.id) else { return .ok } // retry of a handled event

        try await jobs.enqueue(event) // fulfillment, push notifications, etc.
        return .ok
    }
}

extension Data {
    init?(hexString: String) {
        guard hexString.count.isMultiple(of: 2) else { return nil }
        var bytes: [UInt8] = []
        bytes.reserveCapacity(hexString.count / 2)
        var index = hexString.startIndex
        while index < hexString.endIndex {
            let next = hexString.index(index, offsetBy: 2)
            guard let byte = UInt8(hexString[index..<next], radix: 16) else { return nil }
            bytes.append(byte)
            index = next
        }
        self.init(bytes)
    }
}
```

Header names and the signed-payload format differ per provider (Stripe signs `timestamp.body` in a `Stripe-Signature` header); follow the provider's documentation exactly. Vapor 5 is in beta at the time of writing and changes routing APIs; check the version you use.

Reference: [Vapor Docs](https://docs.vapor.codes), [swift-crypto](https://github.com/apple/swift-crypto)

---

## 10. API Design and Code Style

**Impact: MEDIUM**

Following the Swift API Design Guidelines makes call sites read like prose and makes code look native to every Swift developer who reads it.

### 10.1 Design Call Sites That Read Like Prose

**Impact: MEDIUM (self-documenting APIs)**

Every parameter has an argument label (used at the call site) and a parameter name (used in the body). Clarity at the point of use matters more than brevity of the declaration. Omit the first label with `_` when the argument is the obvious direct object (`print(x)`, `contains(x)`); use prepositional labels when they form a phrase (`move(from:to:)`, `remove(at:)`); name parameters by role, not type; and give defaults to rarely changed parameters.

**Incorrect (TypeScript-style naming; call site needs comments):**

```swift
func fetchUserData(userIdString: String, shouldIncludeOrdersFlag: Bool, timeoutSecondsValue: Double) async throws -> User {
    fatalError()
}

func addObserver(observer: Observer) {}

let user = try await fetchUserData(userIdString: id, shouldIncludeOrdersFlag: false, timeoutSecondsValue: 30)
```

**Correct (labels form a sentence; defaults hide the uncommon):**

```swift
func user(id: User.ID, includingOrders: Bool = false, timeout: Duration = .seconds(30)) async throws -> User {
    fatalError()
}

func add(_ observer: Observer) {}

func move(from source: IndexSet, to destination: Int) {}

let user = try await user(id: id)
let detailed = try await user(id: id, includingOrders: true)
```

When the parameter type is weak (`Any`, `String`, `Int`), add a noun to the label to restore meaning: `addObserver(_ observer: NSObject, forKeyPath path: String)`.

Reference: [Swift API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/)

### 10.2 Design Small Protocols with Default Implementations

**Impact: MEDIUM (easy conformance, easy fakes)**

Swift protocols differ from TypeScript interfaces: conformance is explicit (nominal), protocols can carry default implementations in extensions, and you can conform existing types retroactively. Keep each protocol focused on one capability so fakes are trivial, and put shared behavior in protocol extensions instead of base classes.

**Incorrect (one fat protocol; every fake implements twenty methods):**

```swift
protocol BackendService {
    func login(email: String, password: String) async throws -> Session
    func logout() async throws
    func users() async throws -> [User]
    func orders() async throws -> [Order]
    func uploadAvatar(_ data: Data) async throws
    // ...15 more
}
```

**Correct (capability-sized protocols, shared behavior in an extension):**

```swift
import Foundation

protocol OrdersRepository: Sendable {
    func orders(page: Int) async throws -> [Order]
}

extension OrdersRepository {
    /// Default implementation available to every conforming type.
    func allOrders(maxPages: Int = 10) async throws -> [Order] {
        var result: [Order] = []
        for page in 0..<maxPages {
            let batch = try await orders(page: page)
            if batch.isEmpty { break }
            result += batch
        }
        return result
    }
}

struct InMemoryOrdersRepository: OrdersRepository {
    let pages: [[Order]]
    func orders(page: Int) async throws -> [Order] {
        page < pages.count ? pages[page] : []
    }
}
```

Reference: [Protocols](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/protocols/)

### 10.3 Follow Swift Naming Conventions

**Impact: MEDIUM (code looks native to every Swift reader)**

- Types and protocols use `UpperCamelCase`; everything else `lowerCamelCase`. Acronyms are uniform case: `userID`, `urlSession`, `HTTPClient`, `JSONDecoder`.
- Mutating methods are imperative verbs; their non-mutating counterparts use `-ed`/`-ing`: `sort()`/`sorted()`, `append(_:)`/`appending(_:)`.
- Booleans read as assertions: `isEmpty`, `hasPrefix(_:)`, `canSend`, `shouldRetry`.
- Protocols that describe what something is are nouns (`Collection`); capabilities end in `-able`, `-ible`, or `-ing` (`Sendable`, `Codable`, `ProgressReporting`).
- Factory methods begin with `make`: `makeIterator()`, `makeRequest()`.
- Enum cases are `lowerCamelCase`: `case notFound`, not `case NotFound` or `NOT_FOUND`.

**Incorrect (mixed conventions):**

```swift
protocol UserRepositoryProtocol {}
enum Status { case NOT_FOUND, Success }

struct Cart {
    var items: [Item] = []
    var empty: Bool { items.isEmpty }
    func getSortedItems() -> [Item] { items.sorted { $0.name < $1.name } }
    mutating func sortedInPlace() { items.sort { $0.name < $1.name } }
    func createRequest() -> URLRequest? { nil }
    var userId: String = ""
}
```

**Correct (Swift conventions):**

```swift
import Foundation

protocol UserRepository {}
enum Status { case notFound, success }

struct Cart {
    var items: [Item] = []
    var userID = ""
    var isEmpty: Bool { items.isEmpty }

    mutating func sort() { items.sort { $0.name < $1.name } }
    func sorted() -> Cart {
        var copy = self
        copy.sort()
        return copy
    }

    func makeRequest() -> URLRequest? { nil }
}
```

Reference: [Swift API Design Guidelines: Naming](https://www.swift.org/documentation/api-design-guidelines/#naming)

### 10.4 Keep Logic in Small Pure Functions, Effects at the Edges

**Impact: MEDIUM (logic testable without mocks)**

Put business rules in small synchronous functions over value types (input → output). Keep side effects (network, disk, clock, UI) in thin async layers that call those functions. Mark a function `async` only if it actually awaits, `throws` only if it can fail, and make methods that do not use `self` `static`. Inject the current date instead of calling `Date()` inside logic.

**Incorrect (rules, I/O, and clock tangled in one async method):**

```swift
import Foundation

@MainActor
final class SubscriptionModel {
    var banner = ""
    let api: SubscriptionAPI

    init(api: SubscriptionAPI) { self.api = api }

    func refresh() async throws {
        let sub = try await api.subscription()
        if sub.plan == "pro" && sub.renewsAt.timeIntervalSince(Date()) < 3 * 86_400 && !sub.autoRenew {
            banner = "Your Pro plan expires soon"
        } else {
            banner = ""
        }
    }
}
```

**Correct (pure rule plus thin effectful wrapper):**

```swift
import Foundation
import Observation

enum RenewalBanner {
    static func message(for subscription: Subscription, now: Date) -> String? {
        guard subscription.plan == .pro, !subscription.autoRenew else { return nil }
        let threeDays: TimeInterval = 3 * 86_400
        return subscription.renewsAt.timeIntervalSince(now) < threeDays ? "Your Pro plan expires soon" : nil
    }
}

@MainActor
@Observable
final class SubscriptionModel {
    private(set) var banner: String?
    private let api: any SubscriptionAPI
    private let now: @Sendable () -> Date

    init(api: any SubscriptionAPI, now: @escaping @Sendable () -> Date = { Date() }) {
        self.api = api
        self.now = now
    }

    func refresh() async throws {
        let subscription = try await api.subscription()
        banner = RenewalBanner.message(for: subscription, now: now())
    }
}
```

`RenewalBanner.message(for:now:)` can be tested with plain values in microseconds, no fakes required.

Reference: [Functions](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/functions/)

---

## 11. Testing

**Impact: MEDIUM**

Swift Testing, protocol-based fakes, and sanitizers catch regressions and concurrency bugs before release.

### 11.1 Gate Live Integration Tests with enabled(if:) and serialized

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

### 11.2 Run Tests with Thread Sanitizer in CI

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

### 11.3 Test CLIs by Running the Built Product

**Impact: MEDIUM (exit codes and JSON shapes match what users and agents invoke)**

Unit-testing parsed arguments alone does not prove the shipped binary prints the right JSON or returns exit code 64 on usage errors. Resolve the built executable, run it with `Process`, and assert status, stdout, and stderr. Keep these tests in a suite that can locate the binary via the build products directory or an environment variable.

**Incorrect (only test the parser in-process):**

```swift
import Testing

@Test func parseQuery() throws {
    #expect(try DocsTool.parse(["docstool", "Settings"]).query == "Settings")
    // Never launches the binary; broken stdout formatting ships unnoticed.
}
```

**Correct (spawn the built tool):**

```swift
import Foundation
import Testing

enum ToolRunner {
    static func run(_ arguments: [String]) throws -> (status: Int32, stdout: String, stderr: String) {
        let process = Process()
        process.executableURL = try resolveToolURL()
        process.arguments = arguments
        let out = Pipe()
        let err = Pipe()
        process.standardOutput = out
        process.standardError = err
        try process.run()
        process.waitUntilExit()
        let stdout = String(data: out.fileHandleForReading.readDataToEndOfFile(), encoding: .utf8) ?? ""
        let stderr = String(data: err.fileHandleForReading.readDataToEndOfFile(), encoding: .utf8) ?? ""
        return (process.terminationStatus, stdout, stderr)
    }

    static func resolveToolURL() throws -> URL {
        if let path = ProcessInfo.processInfo.environment["DOCS_TOOL_PATH"] {
            return URL(fileURLWithPath: path)
        }
        // Fall back to a path relative to the test bundle / build directory in CI.
        return URL(fileURLWithPath: "docstool", isDirectory: false)
    }
}

@Suite("docstool executable")
struct DocsToolExecutableTests {
    @Test func usageErrorReturns64() throws {
        let result = try ToolRunner.run([])
        #expect(result.status == 64)
        #expect(result.stderr.contains("query") || result.stderr.contains("Usage"))
    }

    @Test func jsonSearchShape() throws {
        let result = try ToolRunner.run(["--json", "--omit-content", "Settings"])
        #expect(result.status == 0)
        let data = try #require(result.stdout.data(using: .utf8))
        let object = try #require(JSONSerialization.jsonObject(with: data) as? [String: Any])
        #expect(object["query"] as? String == "Settings")
        #expect(object["results"] is [Any])
    }
}
```

Wire `DOCS_TOOL_PATH` (or your tool's name) in CI to the binary produced by `swift build`. Assert exact error messages only when they are part of the contract.

Reference: [Process](https://developer.apple.com/documentation/foundation/process), [Swift Testing](https://developer.apple.com/documentation/testing)

### 11.4 Test Through Protocol Fakes, Not the Network

**Impact: MEDIUM (fast, deterministic tests)**

Tests that hit real servers are slow, flaky, and depend on data you do not control. Because the HTTP client takes an `HTTPTransport` and features take repository protocols, tests substitute fakes: a stub transport to test request building, decoding, and error mapping; in-memory repositories to test feature models; an in-memory `ModelContainer` to test SwiftData code.

**Incorrect (unit test calls the staging API):**

```swift
import Testing
@testable import Networking

@Test func decodesUser() async throws {
    let client = HTTPClient(baseURL: URL(string: "https://staging.example.com")!)
    let user = try await client.send(UsersEndpoints.user(id: User.ID(UUID()))) // network, flaky, random ID
    #expect(!user.fullName.isEmpty)
}
```

**Correct (stub transport and in-memory store):**

```swift
import Foundation
import SwiftData
import Testing
@testable import Networking
@testable import Persistence

struct StubTransport: HTTPTransport {
    enum Outcome: Sendable {
        case response(statusCode: Int, body: String)
        case failure(URLError)
    }

    let outcome: Outcome

    func data(for request: URLRequest) async throws -> (Data, URLResponse) {
        switch outcome {
        case .response(let statusCode, let body):
            // Force-unwraps are acceptable in test helpers with constant inputs.
            let response = HTTPURLResponse(url: request.url!, statusCode: statusCode, httpVersion: nil, headerFields: nil)!
            return (Data(body.utf8), response)
        case .failure(let error):
            throw error
        }
    }
}

@Test func decodesSnakeCaseUser() async throws {
    let json = """
    {"id": "6F9619FF-8B86-D011-B42D-00C04FC964FF", "full_name": "Ada Lovelace",
     "email": "ada@example.com", "role": "admin", "created_at": "2026-01-01T00:00:00Z"}
    """
    let client = HTTPClient(
        baseURL: URL(string: "https://api.test")!,
        transport: StubTransport(outcome: .response(statusCode: 200, body: json))
    )

    let dto = try await client.send(UsersEndpoints.user(id: User.ID(UUID())))

    #expect(dto.fullName == "Ada Lovelace")
}

@Test func mapsOfflineError() async {
    let client = HTTPClient(
        baseURL: URL(string: "https://api.test")!,
        transport: StubTransport(outcome: .failure(URLError(.notConnectedToInternet)))
    )

    await #expect(throws: NetworkError.offline) {
        try await client.send(UsersEndpoints.user(id: User.ID(UUID())))
    }
}

@Test func upsertUpdatesExistingProject() async throws {
    let container = try ModelContainer(
        for: Project.self,
        configurations: ModelConfiguration(isStoredInMemoryOnly: true)
    )
    let store = ProjectSyncStore(modelContainer: container)
    let id = UUID()

    try await store.upsert([ProjectDTO(id: id, name: "Old", createdAt: .now)])
    try await store.upsert([ProjectDTO(id: id, name: "New", createdAt: .now)])

    let projects = try ModelContext(container).fetch(FetchDescriptor<Project>())
    #expect(projects.map(\.name) == ["New"])
}
```

Reference: [Swift Testing: Expectations and confirmations](https://developer.apple.com/documentation/testing/expectations)

### 11.5 Write Tests with Swift Testing

**Impact: MEDIUM (expressive, parallel, parameterized tests)**

Swift Testing (`import Testing`) is the default for new tests: `@Test` functions, `#expect` with rich failure output, `try #require` to unwrap or stop, `arguments:` for parameterized cases, and `@Suite` for grouping. Tests run in parallel by default, which surfaces hidden shared state. Keep XCTest for UI tests (XCUITest) and performance tests; the two frameworks interoperate, so migrate incrementally.

**Incorrect (XCTest boilerplate, one test per input, opaque failures):**

```swift
import XCTest
@testable import FeatureUsers

final class UserListModelTests: XCTestCase {
    func testSearchLowercase() async {
        let model = await UserListModel(repository: InMemoryUserRepository(users: .samples))
        await model.load()
        await MainActor.run { model.searchQuery = "ada" }
        let count = await model.filteredUsers.count
        XCTAssertTrue(count == 1) // failure message: "XCTAssertTrue failed"
    }
    // testSearchUppercase, testSearchPrefix: copies of the above
}
```

**Correct (Swift Testing, main-actor suite, parameterized, clear failures):**

```swift
import Testing
@testable import FeatureUsers

@Suite("UserListModel")
@MainActor
struct UserListModelTests {
    @Test func loadsUsers() async throws {
        let model = UserListModel(repository: InMemoryUserRepository(users: [.sample(name: "Ada")]))

        await model.load()

        guard case .loaded(let users) = model.state else {
            Issue.record("Expected loaded state, got \(model.state)")
            return
        }
        #expect(users.map(\.name) == ["Ada"])
    }

    @Test("Search is case-insensitive", arguments: ["ada", "ADA", "Ad"])
    func search(query: String) async {
        let model = UserListModel(repository: InMemoryUserRepository(users: [.sample(name: "Ada"), .sample(name: "Bob")]))
        await model.load()

        model.searchQuery = query

        #expect(model.filteredUsers.map(\.name) == ["Ada"])
    }

    @Test func surfacesFailures() async {
        let model = UserListModel(repository: FailingUserRepository(error: NetworkError.offline))
        await model.load()

        guard case .failed(let error) = model.state else {
            Issue.record("Expected failed state")
            return
        }
        #expect(error as? NetworkError == .offline)
    }
}
```

Reference: [Swift Testing](https://developer.apple.com/documentation/testing)

---

## 12. Tooling, Configuration, and Observability

**Impact: LOW-MEDIUM**

Per-environment configuration, structured logging, and automated formatting keep a production codebase operable and consistent.

### 12.1 Automate Formatting and Linting in CI

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

### 12.2 Configure Environments with xcconfig, Never Ship Secrets

**Impact: MEDIUM (per-environment builds without code changes)**

There is no `.env` at runtime: everything in the app bundle ships to users and can be extracted. Define per-configuration values (API base URL, bundle ID suffix) in `.xcconfig` files, surface them through `Info.plist`, and read them once into a typed config. Secrets for paid third-party APIs belong on your backend, not in the app. Use `#if DEBUG` only for developer tooling.

**Incorrect (environment switched by editing code; secret key in the binary):**

```swift
enum Config {
    static let baseURL = "https://staging-api.example.com" // edited by hand before release
    static let openAIKey = "sk-..."                          // extractable from the app bundle
}
```

**Correct (xcconfig → Info.plist → typed config):**

```text
// App/Config/Staging.xcconfig
API_BASE_URL = https:/$()/staging-api.example.com
PRODUCT_BUNDLE_IDENTIFIER = com.example.app.staging
```

```xml
<!-- Info.plist -->
<key>API_BASE_URL</key>
<string>$(API_BASE_URL)</string>
```

```swift
import Foundation

struct AppConfig: Sendable {
    let apiBaseURL: URL

    static let current: AppConfig = {
        guard
            let raw = Bundle.main.object(forInfoDictionaryKey: "API_BASE_URL") as? String,
            let url = URL(string: raw)
        else {
            fatalError("API_BASE_URL is missing from Info.plist") // misconfigured build: fail fast
        }
        return AppConfig(apiBaseURL: url)
    }()
}
```

`$()` in the xcconfig value is required because `//` starts a comment in xcconfig files. Create one Xcode configuration (Debug, Staging, Release) per environment and assign each its xcconfig.

Reference: [Adding a build configuration file to your project](https://developer.apple.com/documentation/xcode/adding-a-build-configuration-file-to-your-project)

### 12.3 Log with Logger, Not print

**Impact: LOW-MEDIUM (structured, private-by-default, near-zero cost)**

`print` output is unstructured, always evaluated, and invisible in production diagnostics. `Logger` from `OSLog` (unified logging) has levels, subsystems and categories, is filterable in Console.app and Instruments, costs almost nothing when a level is disabled, and redacts dynamic values in release builds unless marked `.public`. Mark personal data `.private` explicitly.

**Incorrect (print with personal data):**

```swift
func signIn(email: String, password: String) async throws {
    print("Signing in \(email) with \(password)") // leaks credentials to the device log
}
```

**Correct (categorized loggers, explicit privacy):**

```swift
import OSLog

extension Logger {
    private static let subsystem = "com.example.app"
    static let auth = Logger(subsystem: subsystem, category: "auth")
    static let network = Logger(subsystem: subsystem, category: "network")
    static let sync = Logger(subsystem: subsystem, category: "sync")
}

func signIn(email: String, password: String) async throws {
    Logger.auth.info("Sign-in started for \(email, privacy: .private(mask: .hash))")
    // never log the password
}

func logSyncResult(count: Int, duration: Duration) {
    Logger.sync.notice("Synced \(count) items in \(duration.formatted(), privacy: .public)")
}
```

For crashes and field metrics use Xcode Organizer and MetricKit; add a third-party crash reporter only if you need more.

Reference: [Logger](https://developer.apple.com/documentation/os/logger)

### 12.4 Require DocC Comments on Public Declarations

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

---

## 13. macOS App Structure

**Impact: HIGH**

Mac apps need the right scenes, menu commands with shortcuts, focused-value routing, information-dense navigation, AppKit bridges only where required, isolation for non-Sendable frameworks, and correct signing for distribution outside the App Store.

### 13.1 Bridge AppKit Only Where SwiftUI Lacks a Capability

**Impact: MEDIUM (keep SwiftUI as the default; wrap AppKit at a thin boundary)**

Prefer SwiftUI controls on macOS. Reach for AppKit only when SwiftUI cannot express the behavior (PDFKit, certain open panels, specialized input). Wrap the AppKit view in `NSViewRepresentable` (or host SwiftUI in `NSHostingView` from AppKit). Spreading AppKit layout and responders through feature screens makes previews and tests harder.

**Incorrect (feature screen owns AppKit layout directly):**

```swift
import AppKit
import SwiftUI

struct ReportScreen: View {
    var body: some View {
        // Feature constructs NSView hierarchy and Auto Layout here.
        AppKitReportCanvas()
            .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

struct AppKitReportCanvas: NSViewRepresentable {
    func makeNSView(context: Context) -> NSView {
        let root = NSView()
        let label = NSTextField(labelWithString: "Report")
        label.translatesAutoresizingMaskIntoConstraints = false
        root.addSubview(label)
        NSLayoutConstraint.activate([
            label.centerXAnchor.constraint(equalTo: root.centerXAnchor),
            label.centerYAnchor.constraint(equalTo: root.centerYAnchor),
        ])
        return root
    }

    func updateNSView(_ nsView: NSView, context: Context) {}
}
```

**Correct (SwiftUI owns the screen; thin bridge for a real gap):**

```swift
import PDFKit
import SwiftUI

struct ReportScreen: View {
    let url: URL

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Report")
                .font(.headline)
            PDFKitView(url: url)
                .frame(minHeight: 320)
        }
        .padding()
    }
}

struct PDFKitView: NSViewRepresentable {
    let url: URL

    func makeNSView(context: Context) -> PDFView {
        let view = PDFView()
        view.autoScales = true
        view.document = PDFDocument(url: url)
        return view
    }

    func updateNSView(_ pdfView: PDFView, context: Context) {
        if pdfView.document?.documentURL != url {
            pdfView.document = PDFDocument(url: url)
        }
    }
}
```

Use `TextEditor` / SwiftUI controls when they cover the need. Keep AppKit types inside the representable, not in feature models.

Reference: [NSViewRepresentable](https://developer.apple.com/documentation/swiftui/nsviewrepresentable), [PDFView](https://developer.apple.com/documentation/pdfkit/pdfview)

### 13.2 Build Menu Bar Utilities with MenuBarExtra and LSUIElement

**Impact: MEDIUM (menu-bar apps stay out of the Dock and use the system extra)**

For a menu-bar utility, use SwiftUI's `MenuBarExtra` scene. Menu-bar-only apps set `LSUIElement` to `true` in Info.plist so they do not show a Dock icon. Building a hidden `NSStatusItem` by hand duplicates what SwiftUI already provides and often fights scene lifecycle.

**Incorrect (Dock app with an ad-hoc status item only):**

```swift
import AppKit
import SwiftUI

@main
struct TimerApp: App {
    @NSApplicationDelegateAdaptor(AppDelegate.self) var delegate

    var body: some Scene {
        Settings { EmptyView() } // still a Dock app; status item owned in AppDelegate
    }
}

final class AppDelegate: NSObject, NSApplicationDelegate {
    var statusItem: NSStatusItem!
    func applicationDidFinishLaunching(_ notification: Notification) {
        statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        statusItem.button?.title = "Timer"
    }
}
```

**Correct (MenuBarExtra scene; LSUIElement for menu-bar-only):**

```swift
import AppKit
import SwiftUI

@main
struct TimerApp: App {
    var body: some Scene {
        #if os(macOS)
        MenuBarExtra("Timer", systemImage: "timer") {
            Button("Start") { }
            Divider()
            SettingsLink()
            Button("Quit") { NSApplication.shared.terminate(nil) }
        }
        .menuBarExtraStyle(.menu)

        Settings {
            PreferencesView()
        }
        #endif
    }
}

struct PreferencesView: View {
    var body: some View { Text("Preferences") }
}
```

In Info.plist (or the target's Info tab) set `LSUIElement` / "Application is agent (UIElement)" to `YES` when the app should not appear in the Dock. Omit that key when the app also has regular windows.

Reference: [MenuBarExtra](https://developer.apple.com/documentation/swiftui/menubarextra), [LSUIElement](https://developer.apple.com/documentation/bundleresources/information-property-list/lsuielement)

### 13.3 Expose Frequent Actions as Menu Commands with Shortcuts

**Impact: HIGH (Mac users expect menus and keyboard shortcuts for every frequent action)**

Toolbar buttons alone are not enough on the Mac. Declare menu items with `.commands` and give every frequent action a `.keyboardShortcut`. Actions that only exist as buttons inside one view are invisible to keyboard users and absent from the system menu search.

**Incorrect (export only as an in-window button):**

```swift
import SwiftUI

struct DocumentView: View {
    var body: some View {
        Text("Document")
            .toolbar {
                Button("Export") { export() } // no menu, no ⌘⇧E
            }
    }

    func export() {}
}
```

**Correct (File menu command with ⌘⇧E):**

```swift
import SwiftUI

@main
struct NotesApp: App {
    var body: some Scene {
        WindowGroup {
            DocumentRootView()
        }
        .commands {
            CommandGroup(after: .saveItem) {
                Button("Export…") {
                    // Wire to the key window via focused values (see macos-focused-values).
                }
                .keyboardShortcut("e", modifiers: [.command, .shift])
            }
        }
    }
}

struct DocumentRootView: View {
    var body: some View { Text("Document") }
}
```

When the command must target the frontmost document window, route it with focused values (`macos-focused-values`) instead of a global singleton.

Reference: [commands(content:)](https://developer.apple.com/documentation/swiftui/scene/commands(content:)), [WWDC21: SwiftUI on the Mac](https://developer.apple.com/videos/play/wwdc21/10062/)

### 13.4 Isolate Non-Sendable Frameworks Behind a Global Actor

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

### 13.5 Restore Per-Window State with SceneStorage

**Impact: MEDIUM (each window remembers its own sidebar and selection)**

Mac users reopen windows and expect the sidebar and selection to return. Store per-window UI state with `@SceneStorage`. `@AppStorage` / `UserDefaults` is shared across every window, so one window's selection overwrites another's. Keep secrets out of both; use the Keychain for tokens.

**Incorrect (AppStorage shared by every window):**

```swift
import SwiftUI

struct SidebarBrowser: View {
    @AppStorage("selectedItemID") private var selectedItemID: String?
    let items: [String]

    var body: some View {
        List(items, id: \.self, selection: $selectedItemID) { Text($0) }
    }
}
```

**Correct (SceneStorage scoped to the window):**

```swift
import SwiftUI

struct SidebarBrowser: View {
    @SceneStorage("selectedItemID") private var selectedItemID: String?
    let items: [String]

    var body: some View {
        NavigationSplitView {
            List(items, id: \.self, selection: $selectedItemID) { Text($0) }
        } detail: {
            Text(selectedItemID ?? "Select an item")
        }
    }
}
```

Use `@AppStorage` for true app-wide preferences (theme, default folder). Use `@SceneStorage` for anything that should differ per window.

Reference: [SceneStorage](https://developer.apple.com/documentation/swiftui/scenestorage), [AppStorage](https://developer.apple.com/documentation/swiftui/appstorage)

### 13.6 Route Menu Commands to the Key Window with Focused Values

**Impact: MEDIUM-HIGH (menu actions hit the frontmost document, not a hidden global)**

Mac apps often have several windows. A menu command must act on the key window's document. Publish the export (or similar) action with `.focusedSceneValue` from the window content and read it with `@FocusedValue` in the command. A mutable singleton or notification that always targets "the last opened model" corrupts the wrong document.

**Incorrect (singleton always exports the same model):**

```swift
import SwiftUI

enum ExportTarget {
    static var document: DocumentModel?
}

struct ExportCommands: Commands {
    var body: some Commands {
        CommandGroup(after: .saveItem) {
            Button("Export…") {
                ExportTarget.document?.export() // wrong window when several are open
            }
            .keyboardShortcut("e", modifiers: [.command, .shift])
        }
    }
}
```

**Correct (focused scene value from the key window):**

```swift
import SwiftUI

struct DocumentExportAction {
    var export: () -> Void
}

private struct DocumentExportActionKey: FocusedValueKey {
    typealias Value = DocumentExportAction
}

extension FocusedValues {
    var documentExport: DocumentExportAction? {
        get { self[DocumentExportActionKey.self] }
        set { self[DocumentExportActionKey.self] = newValue }
    }
}

struct DocumentRootView: View {
    @State private var model = DocumentModel()

    var body: some View {
        DocumentCanvas(model: model)
            .focusedSceneValue(\.documentExport, DocumentExportAction { model.export() })
    }
}

struct ExportCommands: Commands {
    @FocusedValue(\.documentExport) private var exportAction

    var body: some Commands {
        CommandGroup(after: .saveItem) {
            Button("Export…") { exportAction?.export() }
                .keyboardShortcut("e", modifiers: [.command, .shift])
                .disabled(exportAction == nil)
        }
    }
}

@MainActor
@Observable
final class DocumentModel {
    func export() {}
}

struct DocumentCanvas: View {
    var model: DocumentModel
    var body: some View { Text("Document") }
}
```

Attach `ExportCommands` with `.commands { ExportCommands() }` on the scene.

Reference: [FocusedValues](https://developer.apple.com/documentation/swiftui/focusedvalues), [focusedSceneValue(_:_:)](https://developer.apple.com/documentation/swiftui/view/focusedscenevalue(_:_:))

### 13.7 Sign with Hardened Runtime, Notarize, and Staple for Direct Distribution

**Impact: HIGH (Gatekeeper accepts downloads outside the Mac App Store)**

Apps downloaded outside the Mac App Store must be signed with a Developer ID Application certificate, use the hardened runtime, be notarized by Apple, and have the ticket stapled. Skipping any step produces a Gatekeeper block that looks like a broken download. App Store distribution uses a different certificate chain; do not mix the two.

**Incorrect (unsigned or ad-hoc zip):**

```bash
# Zip the .app and upload it. Gatekeeper rejects the download.
ditto -c -k --sequesterRsrc --keepParent MyApp.app MyApp.zip
```

**Correct (sign nested code, zip, notarize, staple, re-zip, assess):**

```bash
# Sign nested frameworks/helpers first (inside-out), then the .app.
# Prefer explicit paths over codesign --deep.
codesign --force --options runtime --timestamp \
  --sign "Developer ID Application: Example Corp (TEAMID)" \
  MyApp.app/Contents/Frameworks/MyFramework.framework

codesign --force --options runtime --timestamp \
  --sign "Developer ID Application: Example Corp (TEAMID)" \
  MyApp.app

# Zip the signed app, then submit for notarization.
ditto -c -k --keepParent MyApp.app MyApp.zip
xcrun notarytool submit MyApp.zip --keychain-profile "AC_NOTARY" --wait

# Staple the ticket onto the .app, then package again for download.
xcrun stapler staple MyApp.app
ditto -c -k --keepParent MyApp.app MyApp-notarized.zip
spctl --assess --type execute -v MyApp.app
```

Enable the hardened runtime in the Xcode target (Signing & Capabilities) and add only the entitlements your app needs. Ship an update mechanism so users can receive fixes after the first install. For Mac App Store builds, archive and upload through App Store Connect instead of Developer ID notarization.

Reference: [Notarizing macOS software before distribution](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution), [Hardened Runtime](https://developer.apple.com/documentation/security/hardened_runtime)

### 13.8 Use NavigationSplitView and Table for Mac Information Density

**Impact: MEDIUM (multi-column Mac layouts instead of phone-sized stacks)**

Mac windows are wide. A single `NavigationStack` of full-screen pushes wastes space and fights window resizing. Use `NavigationSplitView` for sidebar / content / detail, and `Table` for sortable multi-column data. Keep `List` for simple outlines, not for spreadsheet-like grids.

**Incorrect (phone-style stack for a Mac browser):**

```swift
import SwiftUI

struct LibraryView: View {
    let items: [LibraryItem]

    var body: some View {
        NavigationStack {
            List(items) { item in
                NavigationLink(item.title, value: item.id)
            }
            .navigationDestination(for: LibraryItem.ID.self) { id in
                ItemDetailView(id: id) // one column, everything pushed
            }
        }
    }
}

struct LibraryItem: Identifiable, Hashable {
    let id: UUID
    var title: String
}

struct ItemDetailView: View {
    let id: LibraryItem.ID
    var body: some View { Text(id.uuidString) }
}
```

**Correct (split view + sortable table of the selection's peers):**

```swift
import SwiftUI

struct LibraryView: View {
    @State private var items: [LibraryItem]
    @State private var selection: Set<LibraryItem.ID> = []
    @State private var sortOrder = [KeyPathComparator(\LibraryItem.title)]

    init(items: [LibraryItem]) {
        _items = State(initialValue: items)
    }

    var body: some View {
        NavigationSplitView {
            List(selection: $selection) {
                ForEach(items) { item in
                    Text(item.title)
                        .tag(item.id)
                }
            }
            .navigationSplitViewColumnWidth(min: 180, ideal: 220)
        } detail: {
            Table(items, selection: $selection, sortOrder: $sortOrder) {
                TableColumn("Title", value: \.title)
                TableColumn("Kind", value: \.kind)
                TableColumn("Updated") { item in
                    Text(item.updatedAt, format: .dateTime.day().month().year())
                }
            }
            .onChange(of: sortOrder) { _, newOrder in
                items.sort(using: newOrder)
            }
        }
    }
}

struct LibraryItem: Identifiable, Hashable {
    let id: UUID
    var title: String
    var kind: String
    var updatedAt: Date
}
```

Reference: [NavigationSplitView](https://developer.apple.com/documentation/swiftui/navigationsplitview), [Table](https://developer.apple.com/documentation/swiftui/table)

### 13.9 Use the Right Scene Types for Mac Windows

**Impact: HIGH (Preferences, utilities, and multi-window documents work like real Mac apps)**

A Mac app is a collection of scenes, not one phone-sized `NavigationStack`. Use `WindowGroup` for multi-window documents, `Window` for a single-instance utility, `Settings` for Preferences, and `MenuBarExtra` for menu bar extras. Putting Preferences inside a sheet or an iOS-style push destination breaks the system Preferences menu and multi-window expectations.

**Incorrect (one WindowGroup; Preferences faked as a sheet):**

```swift
import SwiftUI

@main
struct NotesApp: App {
    @State private var showPrefs = false

    var body: some Scene {
        WindowGroup {
            ContentView()
                .sheet(isPresented: $showPrefs) { Text("Fake Preferences") }
        }
    }
}
```

**Correct (document windows, Preferences scene, optional utility window):**

```swift
import SwiftUI

@main
struct NotesApp: App {
    var body: some Scene {
        WindowGroup {
            DocumentRootView()
        }

        #if os(macOS)
        Settings {
            PreferencesView()
        }

        Window("Activity", id: "activity") {
            ActivityView()
        }
        .keyboardShortcut("0", modifiers: [.command, .option])
        #endif
    }
}
```

Use `MenuBarExtra` when the primary surface is the menu bar (see `macos-menu-bar-extra`). Keep scene wiring in the `@main` `App`; feature screens stay as views.

Reference: [Building a great Mac app with SwiftUI](https://developer.apple.com/documentation/swiftui/building-a-great-mac-app-with-swiftui), [WWDC21: SwiftUI on the Mac](https://developer.apple.com/videos/play/wwdc21/10062/)

---

## 14. Agent Verification and Tooling Hygiene

**Impact: HIGH**

Agents ship correct Swift by looking up Apple APIs, verifying with build/test/run loops, keeping durable project instructions short, isolating parallel worktrees, and designing CLIs for machine-readable output.

### 14.1 Design CLIs with JSON Output, Quiet Modes, and Stable Exit Codes

**Impact: MEDIUM (agents can parse tools without scraping human logs)**

Tools that agents invoke need machine-readable stdout, optional quiet/content-omitting modes, and stable exit codes. Pretty logs mixed into stdout break parsers; exit code `1` for every failure type forces brittle string matching. Put human progress on stderr; put the payload on stdout.

**Incorrect (human log on stdout; vague exits):**

```swift
import Foundation

@main
enum DocsTool {
    static func main() {
        print("Searching…") // pollutes stdout
        print("found Settings")
        // exits 0 even on failure, or exits 1 for usage and runtime alike
    }
}
```

**Correct (JSON on stdout, status on stderr, distinct exits):**

```swift
import ArgumentParser
import Foundation

@main
struct DocsTool: ParsableCommand {
    static let configuration = CommandConfiguration(commandName: "docstool")

    @Flag(name: .long, help: "Emit JSON on stdout.")
    var json = false

    @Flag(name: .long, help: "Omit long document bodies from JSON.")
    var omitContent = false

    @Argument(help: "Search query.")
    var query: String

    func run() throws {
        guard !query.isEmpty else {
            FileHandle.standardError.write(Data("error: query required\n".utf8))
            throw ExitCode(64) // EX_USAGE-style
        }

        FileHandle.standardError.write(Data("searching…\n".utf8))

        let payload: [String: Any] = [
            "query": query,
            "results": [["title": "Settings", "uri": "doc://com.apple.documentation/documentation/SwiftUI/Settings"]],
            "omitContent": omitContent,
        ]
        let data = try JSONSerialization.data(withJSONObject: payload, options: [.sortedKeys])
        if json {
            FileHandle.standardOutput.write(data)
            FileHandle.standardOutput.write(Data("\n".utf8))
        } else {
            print("Settings — doc://com.apple.documentation/documentation/SwiftUI/Settings")
        }
    }
}
```

Document the JSON shape and exit codes in the tool's help. Prefer explicit subcommands over flag soup so transcripts stay readable.

Reference: [Swift Argument Parser](https://github.com/apple/swift-argument-parser), [ExitCode](https://apple.github.io/swift-argument-parser/documentation/argumentparser/exitcode/)

### 14.2 Give Each Parallel Agent Its Own Worktree and DerivedData

**Impact: MEDIUM (parallel agents do not clobber the same checkout or build products)**

Two agents editing one working tree overwrite each other's files and share dirty indexes. Give each parallel agent its own Git worktree and point Xcode / `xcodebuild` at a per-worktree DerivedData path. Sharing simulators is fine when memory allows; sharing a checkout is not.

**Incorrect (two agents, one clone):**

```bash
# Agent A and Agent B both:
cd /src/MyApp
# edit files, build into the same DerivedData — races on Package.resolved, source, and build outputs
xcodebuild -scheme MyApp build
```

**Correct (worktree + isolated DerivedData per agent):**

```bash
git worktree add -b agent/export-menu ../MyApp-export main
cd ../MyApp-export

DERIVED="$PWD/.derivedData"
mkdir -p "$DERIVED"
echo ".derivedData/" >> .git/info/exclude

xcodebuild -scheme MyApp \
  -derivedDataPath "$DERIVED" \
  -destination 'platform=macOS' \
  build

# When finished:
# git worktree remove ../MyApp-export
```

Use one branch per task. Delete the worktree's DerivedData with the worktree when the task ends.

Reference: [Building and running an app](https://developer.apple.com/documentation/xcode/building-and-running-an-app), [xcodebuild](https://developer.apple.com/documentation/xcode/building-your-app-using-the-command-line)

### 14.3 Look Up Apple APIs in Documentation Before Writing Unfamiliar Code

**Impact: HIGH (invented signatures do not compile against the real SDK)**

Apple frameworks rename APIs, add availability gates, and change overload sets every release. When an API is new to you, renamed, failing to compile, or platform-specific, search Apple documentation (Xcode's documentation window / Developer documentation) before writing call sites from memory. Guessing `glassEffect` modifiers, menu APIs, or concurrency attributes wastes a build cycle.

**Incorrect (invent from memory):**

```swift
import SwiftUI

// Recalled a Mac-only API wrong; compiles on neither platform as written.
extension View {
    func macPreferencesPanel() -> some View {
        self.preferencesScene() // not a real API
    }
}
```

**Correct (confirm the symbol, then apply it):**

```swift
import SwiftUI

// After checking Apple docs for Settings / Scene:
#if os(macOS)
@main
struct NotesApp: App {
    var body: some Scene {
        WindowGroup { ContentView() }
        Settings { PreferencesView() }
    }
}
#endif

struct ContentView: View {
    var body: some View { Text("Notes") }
}

struct PreferencesView: View {
    var body: some View { Text("Preferences") }
}
```

Use documentation search especially for: availability (`#available` / `@available`), exact initializer overloads, and types that exist only on macOS or iOS. Apply what you find: fix symbol names, pick the right overload, add availability guards.

Reference: [Apple Developer Documentation](https://developer.apple.com/documentation/), [Settings](https://developer.apple.com/documentation/swiftui/settings)

### 14.4 Put Architecture, Commands, and Verification in AGENTS.md

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

### 14.5 Verify Changes by Building, Testing, and Running

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

---

## References

1. [https://docs.swift.org/swift-book/documentation/the-swift-programming-language/](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/)
2. [https://www.swift.org/documentation/api-design-guidelines/](https://www.swift.org/documentation/api-design-guidelines/)
3. [https://www.swift.org/migration/documentation/migrationguide](https://www.swift.org/migration/documentation/migrationguide)
4. [https://developer.apple.com/swift/get-started/](https://developer.apple.com/swift/get-started/)
5. [https://developer.apple.com/documentation/swiftui](https://developer.apple.com/documentation/swiftui)
6. [https://developer.apple.com/documentation/swiftui/building-a-great-mac-app-with-swiftui](https://developer.apple.com/documentation/swiftui/building-a-great-mac-app-with-swiftui)
7. [https://developer.apple.com/documentation/swiftdata](https://developer.apple.com/documentation/swiftdata)
8. [https://developer.apple.com/documentation/testing](https://developer.apple.com/documentation/testing)
9. [https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)
10. [https://github.com/swiftlang/swift-evolution](https://github.com/swiftlang/swift-evolution)
11. [https://www.skills.sh/emilkowalski/skills/write-swift](https://www.skills.sh/emilkowalski/skills/write-swift)
