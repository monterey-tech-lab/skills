---
title: Look Up Apple APIs in Documentation Before Writing Unfamiliar Code
impact: HIGH
impactDescription: invented signatures do not compile against the real SDK
tags: agent, documentation, Xcode, API
---

## Look Up Apple APIs in Documentation Before Writing Unfamiliar Code

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
