---
title: Use the Right Scene Types for Mac Windows
impact: HIGH
impactDescription: Preferences, utilities, and multi-window documents work like real Mac apps
tags: macos, scenes, WindowGroup, Settings, MenuBarExtra, Window
---

## Use the Right Scene Types for Mac Windows

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
