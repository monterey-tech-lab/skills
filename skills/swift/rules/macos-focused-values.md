---
title: Route Menu Commands to the Key Window with Focused Values
impact: MEDIUM-HIGH
impactDescription: menu actions hit the frontmost document, not a hidden global
tags: macos, FocusedValue, focusedSceneValue, commands
---

## Route Menu Commands to the Key Window with Focused Values

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
