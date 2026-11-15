# macOS Apps Playbook

Read when building or reviewing a SwiftUI macOS app. Detailed incorrect/correct patterns live in the `macos-*` rules; this file is the decision map.

## Contents

- [Project setup](#project-setup)
- [Scene and command map](#scene-and-command-map)
- [Density and state](#density-and-state)
- [Interop and isolation](#interop-and-isolation)
- [Ship checklist](#ship-checklist)

## Project setup

Default: thin Xcode app target + local Swift package (`modules-local-package`). Put scenes, entitlements, and assets in the app target; put models and features in package modules.

## Scene and command map

| Need | Use | Rule |
|---|---|---|
| Multi-window documents | `WindowGroup` | `macos-scenes` |
| Single utility window | `Window` | `macos-scenes` |
| Preferences | `Settings` | `macos-scenes` |
| Menu bar utility | `MenuBarExtra` + `LSUIElement` when Dock-less | `macos-menu-bar-extra` |
| Frequent action | `.commands` + `.keyboardShortcut` | `macos-commands-shortcuts` |
| Act on key window | `focusedSceneValue` / `@FocusedValue` | `macos-focused-values` |

## Density and state

| Need | Use | Rule |
|---|---|---|
| Sidebar + detail | `NavigationSplitView` | `macos-split-view-table` |
| Multi-column data | `Table` with sort order applied | `macos-split-view-table` |
| Per-window UI state | `@SceneStorage` | `macos-scene-storage` |
| App-wide preferences | `@AppStorage` (never secrets) | `macos-scene-storage` |

## Interop and isolation

| Need | Use | Rule |
|---|---|---|
| SwiftUI cannot express it | Thin `NSViewRepresentable` | `macos-appkit-interop` |
| Non-Sendable ObjC / legacy API | Dedicated `@globalActor` or `@MainActor` | `macos-isolate-unsafe-apis` |

## Ship checklist

**Mac App Store:** archive → App Store Connect.

**Direct download:** Developer ID sign (nested code inside-out, hardened runtime, `--timestamp`) → zip → `notarytool` → staple → re-package → `spctl --assess` (`macos-distribution`).

**Verify while coding:** build → targeted tests → launch the flow → trimmed `log show` (`agent-verify-loop`). Look up unfamiliar Apple APIs in documentation before inventing signatures (`agent-lookup-apple-docs`).

References: [Building a great Mac app with SwiftUI](https://developer.apple.com/documentation/swiftui/building-a-great-mac-app-with-swiftui), [WWDC21: SwiftUI on the Mac](https://developer.apple.com/videos/play/wwdc21/10062/), [Notarizing macOS software](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)
