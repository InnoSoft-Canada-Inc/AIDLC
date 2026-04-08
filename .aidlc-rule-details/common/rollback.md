# Git Rollback Anchor System

**Purpose**: Enable clean rollback of any session's changes if something goes wrong. This system is intentionally simple — just git refs, no complex scripts.

---

## Core Concept

Every session captures two git commits:
- **Session Start Commit**: The state before any changes
- **Session End Commit**: The state after all changes

These commits enable precise rollback to any known-good state.

---

## Session Start Rule

**At the beginning of every session:**

1. Run `git rev-parse HEAD` to capture the current commit hash
2. Write the result as "Session Start Commit" in session-summary.md
3. This captures the exact state of the codebase before any changes

### Example

```bash
$ git rev-parse HEAD
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
```

This hash is then recorded in the Git Anchors section of session-summary.md:

```markdown
## Git Anchors
- **Session Start Commit**: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
- **Session End Commit**: (pending)
- **Rollback Command**: `git reset --hard a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0`
```

---

## Session End Rule

**At the end of every session:**

1. Commit all changes (if not already committed)
2. Run `git rev-parse HEAD` to capture the final commit hash
3. Write the result as "Session End Commit" in session-summary.md
4. This captures the exact state after all session changes

### Example

```markdown
## Git Anchors
- **Session Start Commit**: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
- **Session End Commit**: z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0
- **Rollback Command**: `git reset --hard a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0`
```

---

## Rollback Command Format

**Format**: `git reset --hard {session-start-commit}`

**Purpose**: Allows full undo of a session if needed.

### How to Use

If a session's changes need to be undone:

1. Open the session-summary.md for the unit
2. Find the Git Anchors section
3. Copy the Rollback Command
4. Execute it in the terminal

```bash
git reset --hard a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
```

**Warning**: This is a destructive operation. All uncommitted changes and all commits after the start commit will be lost.

---

## What Constitutes a "Session" for Rollback

A session is bounded by:
- **Start**: When workspace detection captures the git HEAD
- **End**: When the session is closed (via documentation exit or explicit pause)

### Multi-Unit Sessions

When a developer works on multiple units in one session:
- All units share the same Session Start Commit (from the first unit's workspace detection)
- Each unit may have different Session End Commits (captured when each unit completes or pauses)
- Rolling back to the session start would undo ALL units worked on in that session

### Multi-Session Units

When a developer spreads one unit across multiple sessions:
- Each session has its own start/end commit pair
- Previous session commits are preserved in `session-history/`
- Rolling back to a specific session's start only undoes that session's changes
- The session history provides a complete audit trail of all sessions

---

## Integration with Session Summary

Rollback anchors are stored in the **Git Anchors** section of `session-summary.md`:

```markdown
## Git Anchors
- **Session Start Commit**: {40-character git hash}
- **Session End Commit**: {40-character git hash or "(pending)"}
- **Rollback Command**: `git reset --hard {session-start-hash}`
```

### Session History Preservation

When a session-summary.md is archived to `session-history/`:
- The archived file preserves its own start/end commits
- This provides a complete history of git states for the unit
- Any prior session can be identified and its changes analyzed

---

## When to Capture Anchors

| Event | Action |
|-------|--------|
| Workspace Detection | Capture Session Start Commit |
| Session End (complete) | Capture Session End Commit |
| Session End (paused) | Capture Session End Commit |
| Context Reset (mid-session) | Update Session End Commit to current state |

---

## Rollback Scenarios

### Scenario 1: Undo Entire Session

If the entire session's work needs to be undone:

```bash
git reset --hard {session-start-commit}
```

### Scenario 2: Return to Specific Point in Unit History

1. Check `session-history/` for the desired session
2. Find the Session End Commit from that archived session
3. Reset to that commit:

```bash
git reset --hard {session-end-commit-from-history}
```

### Scenario 3: Investigate What Changed in a Session

To see what changed between session start and end:

```bash
git diff {session-start-commit} {session-end-commit}
```

Or to see commit messages:

```bash
git log {session-start-commit}..{session-end-commit} --oneline
```

---

## Design Principles

1. **Simplicity**: No complex scripts, just git refs
2. **Transparency**: All anchors visible in session-summary.md
3. **Auditability**: Session history preserves all prior states
4. **Safety**: Rollback command is ready-to-use, reducing error risk
5. **Flexibility**: Works with multi-unit sessions and multi-session units

---

## Error Handling

### Missing Start Commit

If session-summary.md is missing a Session Start Commit:
- The session may have been started improperly
- Check if workspace detection was executed
- If recovery is needed, use git reflog to find the likely start point

### Dirty Working Directory

Before capturing Session End Commit:
- Ensure all changes are committed
- Uncommitted changes won't be captured in the end commit
- Use `git status` to verify clean working directory

### Detached HEAD State

If the repository is in detached HEAD state:
- The rollback anchor system still works
- Commits are captured as usual
- Be aware that rolling back may leave you in detached HEAD again
