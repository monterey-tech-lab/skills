---
title: Expose Frequent Actions as Menu Commands with Shortcuts
impact: HIGH
impactDescription: Mac users expect menus and keyboard shortcuts for every frequent action
tags: macos, commands, keyboardShortcut, menu
---

## Expose Frequent Actions as Menu Commands with Shortcuts

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
