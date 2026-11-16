# IDE Ignore and Content Exclusion

Read when configuring what coding assistants can index or attach.

## Cursor

Use **`.cursorignore`** at the project root (gitignore syntax). It blocks Agent, Tab, and `@` references for listed paths. Cursor also respects `.gitignore`. Optional: global ignore patterns in Cursor settings for personal machines.

**Terminal commands and MCP servers can still read ignored files**—ignore is not a sandbox.

Docs: [Ignore file](https://cursor.com/docs/reference/ignore-file)

## GitHub Copilot

Configure **content exclusion** at organization or repository level (Business/Enterprise). Prefer official content exclusion over ad-hoc ignore filenames. Exclusions are not a filesystem security boundary; agents and third-party MCP may still reach files indirectly.

Docs: [Content exclusion](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion)

## Recommended patterns

```
/secrets/**
**/.env
**/.env.*
**/credentials/**
**/customer-exports/**
```

Always keep the same paths in `.gitignore`. There is no universal `.aiignore` that all vendors honor.
