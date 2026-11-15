---
title: Test CLIs by Running the Built Product
impact: MEDIUM
impactDescription: exit codes and JSON shapes match what users and agents invoke
tags: testing, CLI, Process, executable, Swift Testing
---

## Test CLIs by Running the Built Product

**Impact: MEDIUM (exit codes and JSON shapes match what users and agents invoke)**

Unit-testing parsed arguments alone does not prove the shipped binary prints the right JSON or returns exit code 64 on usage errors. Resolve the built executable, run it with `Process`, and assert status, stdout, and stderr. Keep these tests in a suite that can locate the binary via the build products directory or an environment variable.

**Incorrect (only test the parser in-process):**

```swift
import Testing

@Test func parseQuery() throws {
    #expect(try DocsTool.parse(["docstool", "Settings"]).query == "Settings")
    // Never launches the binary; broken stdout formatting ships unnoticed.
}
```

**Correct (spawn the built tool):**

```swift
import Foundation
import Testing

enum ToolRunner {
    static func run(_ arguments: [String]) throws -> (status: Int32, stdout: String, stderr: String) {
        let process = Process()
        process.executableURL = try resolveToolURL()
        process.arguments = arguments
        let out = Pipe()
        let err = Pipe()
        process.standardOutput = out
        process.standardError = err
        try process.run()
        process.waitUntilExit()
        let stdout = String(data: out.fileHandleForReading.readDataToEndOfFile(), encoding: .utf8) ?? ""
        let stderr = String(data: err.fileHandleForReading.readDataToEndOfFile(), encoding: .utf8) ?? ""
        return (process.terminationStatus, stdout, stderr)
    }

    static func resolveToolURL() throws -> URL {
        if let path = ProcessInfo.processInfo.environment["DOCS_TOOL_PATH"] {
            return URL(fileURLWithPath: path)
        }
        // Fall back to a path relative to the test bundle / build directory in CI.
        return URL(fileURLWithPath: "docstool", isDirectory: false)
    }
}

@Suite("docstool executable")
struct DocsToolExecutableTests {
    @Test func usageErrorReturns64() throws {
        let result = try ToolRunner.run([])
        #expect(result.status == 64)
        #expect(result.stderr.contains("query") || result.stderr.contains("Usage"))
    }

    @Test func jsonSearchShape() throws {
        let result = try ToolRunner.run(["--json", "--omit-content", "Settings"])
        #expect(result.status == 0)
        let data = try #require(result.stdout.data(using: .utf8))
        let object = try #require(JSONSerialization.jsonObject(with: data) as? [String: Any])
        #expect(object["query"] as? String == "Settings")
        #expect(object["results"] is [Any])
    }
}
```

Wire `DOCS_TOOL_PATH` (or your tool's name) in CI to the binary produced by `swift build`. Assert exact error messages only when they are part of the contract.

Reference: [Process](https://developer.apple.com/documentation/foundation/process), [Swift Testing](https://developer.apple.com/documentation/testing)
