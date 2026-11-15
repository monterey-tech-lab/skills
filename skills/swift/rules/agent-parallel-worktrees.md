---
title: Give Each Parallel Agent Its Own Worktree and DerivedData
impact: MEDIUM
impactDescription: parallel agents do not clobber the same checkout or build products
tags: agent, git, worktree, DerivedData, parallelism
---

## Give Each Parallel Agent Its Own Worktree and DerivedData

**Impact: MEDIUM (parallel agents do not clobber the same checkout or build products)**

Two agents editing one working tree overwrite each other's files and share dirty indexes. Give each parallel agent its own Git worktree and point Xcode / `xcodebuild` at a per-worktree DerivedData path. Sharing simulators is fine when memory allows; sharing a checkout is not.

**Incorrect (two agents, one clone):**

```bash
# Agent A and Agent B both:
cd /src/MyApp
# edit files, build into the same DerivedData — races on Package.resolved, source, and build outputs
xcodebuild -scheme MyApp build
```

**Correct (worktree + isolated DerivedData per agent):**

```bash
git worktree add -b agent/export-menu ../MyApp-export main
cd ../MyApp-export

DERIVED="$PWD/.derivedData"
mkdir -p "$DERIVED"
echo ".derivedData/" >> .git/info/exclude

xcodebuild -scheme MyApp \
  -derivedDataPath "$DERIVED" \
  -destination 'platform=macOS' \
  build

# When finished:
# git worktree remove ../MyApp-export
```

Use one branch per task. Delete the worktree's DerivedData with the worktree when the task ends.

Reference: [Building and running an app](https://developer.apple.com/documentation/xcode/building-and-running-an-app), [xcodebuild](https://developer.apple.com/documentation/xcode/building-your-app-using-the-command-line)
