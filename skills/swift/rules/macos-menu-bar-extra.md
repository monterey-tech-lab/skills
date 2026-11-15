---
title: Build Menu Bar Utilities with MenuBarExtra and LSUIElement
impact: MEDIUM
impactDescription: menu-bar apps stay out of the Dock and use the system extra
tags: macos, MenuBarExtra, LSUIElement, menu-bar
---

## Build Menu Bar Utilities with MenuBarExtra and LSUIElement

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
