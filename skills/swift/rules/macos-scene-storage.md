---
title: Restore Per-Window State with SceneStorage
impact: MEDIUM
impactDescription: each window remembers its own sidebar and selection
tags: macos, SceneStorage, AppStorage, state-restoration
---

## Restore Per-Window State with SceneStorage

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
