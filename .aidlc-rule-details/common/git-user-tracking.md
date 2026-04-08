# Git User Tracking

**Purpose**: Automatically track which developers have worked on each unit of work by capturing git username(s) in backlog tables and unit artifacts.

---

## Overview

In multi-developer environments, it's valuable to know:
- **Who is currently working on a unit** (avoid duplicate work)
- **Who has worked on a unit** (know who to ask for context)
- **Who to review PRs with** (original implementers provide best reviews)

This is achieved by:
1. Capturing the current git user's username at session start
2. Recording that username when units are claimed or worked on
3. Appending additional usernames if multiple developers touch the same unit

---

## Git Username Capture

### Automatic Detection

At the start of every AIDLC session (during Workspace Detection), automatically capture the git username:

```bash
git config user.name
```

**Fallback**: If git config is not set or command fails, use `"unknown"` and warn the user.

**Storage**: Store temporarily in memory for the session. Do NOT create a permanent config file.

### Example Output

```
Git User: alice.johnson
```

---

## Backlog Table Enhancement

### Master Backlog Format

Add an **Assignee(s)** column to the master backlog table:

```markdown
# Master Backlog

## Units Overview

| ID | Unit of Work | Domain | Status | Assignee(s) | Depends On | Completed |
|----|--------------|--------|--------|-------------|------------|-----------|
| AUTH-001 | User Authentication | auth | ✅ Complete | alice.johnson | — | 2026-03-01 |
| AUTH-002 | Session Management | auth | 🔄 In Progress | bob.smith | AUTH-001 | — |
| API-001 | REST API Foundation | api | 🔓 Unblocked | — | AUTH-001 | — |
| API-002 | Rate Limiting | api | ⏳ Blocked | — | API-001 | — |
```

**Column Position**: Insert **Assignee(s)** column AFTER Status, BEFORE Depends On.

### Domain Backlog Format

Domain backlogs use a different structure. Add **Assignee(s)** field in the unit metadata:

```markdown
# Domain Backlog: auth

## Units

### AUTH-002: Session Management

- **Status**: 🔄 In Progress
- **Assignee(s)**: bob.smith
- **Branch**: feature/AUTH-002-session-mgmt
- **Completed**: —
- **Track**: Full

#### Phase Progress
- [x] Inception
- [ ] Construction
- [ ] Operations
- [ ] Testing & Validation
- [ ] Documentation

#### Summary
{One to two sentences describing what will be built}

#### Notes for Downstream Units
- {Key decision 1}
- {Key decision 2}
```

**Field Position**: Insert **Assignee(s)** AFTER Status, BEFORE Branch.

---

## Username Assignment Rules

### Rule 1: Claim Unit (New Work)

**When**: Developer starts work on a new unit (status changes from 🔓 Unblocked or ⏳ Blocked to 🔄 In Progress)

**Action**:
1. Capture git username via `git config user.name`
2. Set **Assignee(s)** to that username in both master and domain backlogs
3. Commit the backlog update immediately (prevents race conditions)

**Example**:

```bash
# Before claiming
| AUTH-002 | Session Management | auth | 🔓 Unblocked | — | AUTH-001 | — |

# After claiming (by bob.smith)
| AUTH-002 | Session Management | auth | 🔄 In Progress | bob.smith | AUTH-001 | — |
```

### Rule 2: Resume Unit (Continuation)

**When**: Same developer resumes work on a unit they previously claimed

**Action**:
- No change to **Assignee(s)** field (already set)
- Verify git username matches assignee (warn if mismatch)

**Warning on Mismatch**:

```markdown
⚠️ **Git User Mismatch**

This unit (AUTH-002) is assigned to: bob.smith
Your git username is: alice.johnson

This could mean:
- You're taking over work from another developer
- Your git config user.name is incorrect
- Someone else started this unit and didn't finish

Would you like to:
A) Add your username to assignees (you're collaborating)
B) Replace the assignee (you're taking over)
C) Cancel and verify with the team

[Answer]:
```

### Rule 3: Multiple Developers (Collaboration)

**When**: Second developer works on a unit previously claimed by someone else

**Action**:
1. Detect git username doesn't match current assignee
2. Present warning (see Rule 2)
3. If user selects **A) Add**, append username to assignees field

**Format for Multiple Assignees**:

```markdown
# Comma-separated list
| AUTH-002 | Session Management | auth | 🔄 In Progress | bob.smith, alice.johnson | AUTH-001 | — |
```

**Domain Backlog Format**:

```markdown
- **Assignee(s)**: bob.smith, alice.johnson
```

**Order**: First assignee is original claimant, subsequent assignees in chronological order

### Rule 4: Complete Unit

**When**: Unit transitions to ✅ Complete status

**Action**:
- **Assignee(s)** field is preserved (historical record of who worked on it)
- Do NOT clear the field

**Example**:

```markdown
| AUTH-002 | Session Management | auth | ✅ Complete | bob.smith, alice.johnson | AUTH-001 | 2026-03-05 |
```

### Rule 5: Pause/Deferred Units

**When**: Unit transitions to ⏸ Paused or ⏸ Deferred

**Action**:
- **Assignee(s)** field is preserved
- When resumed, same rules as Rule 2 apply (check for mismatch)

---

## Session Summary Enhancement

Add git username to the session summary file:

```markdown
# Session Summary: AUTH-002-session-management

## Session Metadata

- **Unit ID**: AUTH-002
- **Domain**: auth
- **Developer(s)**: bob.smith, alice.johnson
- **Track**: Full Track
- **Current Phase**: Construction
- **Current Stage**: Code Generation
- **Session Status**: Active
```

**Field Position**: Add **Developer(s)** field AFTER Domain, BEFORE Track.

**Update Rules**:
- **First session**: Set to current git username
- **Subsequent sessions**: Append if username doesn't already exist in list

---

## Feature Documentation Enhancement

Add developer attribution to feature documentation:

```markdown
# Feature Documentation: AUTH-002 Session Management

## Metadata

- **Unit ID**: AUTH-002
- **Domain**: auth
- **Developer(s)**: bob.smith, alice.johnson
- **Track**: Full Track
- **Completed**: 2026-03-05

## What Was Built
...
```

**Field Position**: Add **Developer(s)** field AFTER Domain, BEFORE Track.

**Value**: Copy from session summary at Documentation phase completion.

---

## Integration with Workspace Detection

During **Workspace Detection** stage, execute git username capture:

### Step: Capture Git Username (NEW)

**Execute**: At the start of EVERY session, after checking for initialization.

```bash
# Capture username
GIT_USER=$(git config user.name)

# Fallback if not configured
if [ -z "$GIT_USER" ]; then
  GIT_USER="unknown"
  # Display warning to user
fi
```

**Display to user**:

```markdown
**Session Started**

- **Git User**: alice.johnson
- **Project**: {project-name}
- **Branch**: {current-branch}
```

**If username is "unknown"**:

```markdown
⚠️ **Git Username Not Configured**

Your git user.name is not set. This is used to track who works on each unit.

To set it:
```bash
git config --global user.name "Your Name"
```

Or to skip username tracking:
- Continue without username (units will show assignee as "unknown")

[Press Enter to continue]
```

---

## Backlog Update Stage Integration

During **Backlog Update** stage (Documentation phase):

### Enhanced Backlog Update Process

1. Load current git username (captured at session start)
2. Check unit's current **Assignee(s)** field
3. If username not in list, append it
4. Mark unit as ✅ Complete with updated assignee list
5. Update both master and domain backlogs

**Example**:

```markdown
# Before Documentation phase
| AUTH-002 | Session Management | auth | 🔄 In Progress | bob.smith | AUTH-001 | — |

# After Documentation phase (same user)
| AUTH-002 | Session Management | auth | ✅ Complete | bob.smith | AUTH-001 | 2026-03-05 |

# After Documentation phase (different user continued work)
| AUTH-002 | Session Management | auth | ✅ Complete | bob.smith, alice.johnson | AUTH-001 | 2026-03-05 |
```

---

## Git Username Retrieval Command

**When git username is needed**, use this bash command:

```bash
git config user.name
```

**Error Handling**:
- Command returns empty: Use "unknown"
- Command fails (not in git repo): Use "unknown"
- Command not available (git not installed): Use "unknown"

**Do NOT**:
- ❌ Use `whoami` (system username, not git identity)
- ❌ Use `$USER` environment variable (system username)
- ❌ Prompt user to enter username manually (use git config)

---

## Example Workflow

### Scenario: Bob starts AUTH-002, Alice helps finish it

**Step 1: Bob claims unit**

```bash
# Bob's session
git config user.name  # Returns: bob.smith
```

Master backlog updated:
```markdown
| AUTH-002 | Session Management | auth | 🔄 In Progress | bob.smith | AUTH-001 | — |
```

Session summary created:
```markdown
- **Developer(s)**: bob.smith
```

**Step 2: Bob works on unit (Construction phase)**

No assignee changes during work.

**Step 3: Alice resumes unit (Bob went on vacation)**

```bash
# Alice's session
git config user.name  # Returns: alice.johnson
```

**AI detects mismatch**:
```markdown
⚠️ Git User Mismatch

This unit (AUTH-002) is assigned to: bob.smith
Your git username is: alice.johnson

Would you like to:
A) Add your username to assignees (you're collaborating)
B) Replace the assignee (you're taking over)
C) Cancel and verify with the team
```

Alice selects **A) Add**.

Master backlog updated:
```markdown
| AUTH-002 | Session Management | auth | 🔄 In Progress | bob.smith, alice.johnson | AUTH-001 | — |
```

Session summary updated:
```markdown
- **Developer(s)**: bob.smith, alice.johnson
```

**Step 4: Alice completes unit**

Documentation phase preserves the assignee list:

Master backlog:
```markdown
| AUTH-002 | Session Management | auth | ✅ Complete | bob.smith, alice.johnson | AUTH-001 | 2026-03-05 |
```

Feature doc:
```markdown
- **Developer(s)**: bob.smith, alice.johnson
```

---

## Benefits

### For Teams
✅ **Transparency** — Everyone knows who's working on what
✅ **Avoid collisions** — See claimed units in backlog before starting work
✅ **Historical record** — Know who to ask about past implementation decisions
✅ **Better PR reviews** — Original developers can provide context

### For Solo Developers
✅ **No overhead** — Automatic capture, no manual input
✅ **Context in worktrees** — See your own work across multiple worktrees
✅ **Optional** — System works fine even if git username is "unknown"

---

## Implementation Checklist

**At Session Start** (Workspace Detection):
- [ ] Capture git username via `git config user.name`
- [ ] Display username to user
- [ ] Warn if username is "unknown"

**When Starting Unit** (Inception or Workspace Detection):
- [ ] Check current unit assignee(s)
- [ ] If empty, set to current git username
- [ ] If mismatch, present 3-option warning
- [ ] Update master backlog
- [ ] Update domain backlog
- [ ] Commit backlog changes immediately

**During Work** (Construction, Testing):
- [ ] Record username in session summary
- [ ] No backlog updates (unless pausing)

**At Unit Completion** (Documentation phase):
- [ ] Copy developer(s) list to feature doc
- [ ] Preserve assignee(s) in backlogs when marking complete
- [ ] Do NOT clear assignee field

---

## Related Rules

- `common/backlog.md` — Backlog structure and status transitions
- `inception/workspace-detection.md` — Session start procedures
- `documentation/backlog-update.md` — Backlog update during Documentation phase
- `common/session-summary.md` — Session summary structure

---

## Summary

| Aspect | Behavior |
|--------|----------|
| **Username Source** | `git config user.name` |
| **Capture Timing** | At session start (Workspace Detection) |
| **Storage** | Master backlog, domain backlog, session summary, feature doc |
| **Multi-Developer** | Comma-separated list (chronological order) |
| **Completion** | Assignee(s) preserved as historical record |
| **Fallback** | "unknown" if git config not set |
| **User Action** | Automatic (no manual input needed) |

This system provides automatic, low-overhead developer tracking without requiring manual input or complex configuration.
