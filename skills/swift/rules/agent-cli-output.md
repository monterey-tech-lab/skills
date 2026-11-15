---
title: Design CLIs with JSON Output, Quiet Modes, and Stable Exit Codes
impact: MEDIUM
impactDescription: agents can parse tools without scraping human logs
tags: agent, cli, JSON, ArgumentParser, exit-codes
---

## Design CLIs with JSON Output, Quiet Modes, and Stable Exit Codes

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
