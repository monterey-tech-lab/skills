---
title: Use NavigationSplitView and Table for Mac Information Density
impact: MEDIUM
impactDescription: multi-column Mac layouts instead of phone-sized stacks
tags: macos, NavigationSplitView, Table, List
---

## Use NavigationSplitView and Table for Mac Information Density

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
