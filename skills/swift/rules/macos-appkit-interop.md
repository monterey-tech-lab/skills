---
title: Bridge AppKit Only Where SwiftUI Lacks a Capability
impact: MEDIUM
impactDescription: keep SwiftUI as the default; wrap AppKit at a thin boundary
tags: macos, AppKit, NSViewRepresentable, interop
---

## Bridge AppKit Only Where SwiftUI Lacks a Capability

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
