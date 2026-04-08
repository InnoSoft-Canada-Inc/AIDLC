# AIDLC Multi-Developer Team Guide

This guide explains how to use AI-DLC (Adaptive Intelligent Development Life Cycle) effectively in team environments with multiple developers working in the same codebase.

---

## The Challenge: Multiple Developers, One Repository

When multiple developers use AI-DLC simultaneously on the same codebase, conflicts can arise in AIDLC state files:
- `aidlc-docs/aidlc-state.md` - Current workflow state
- `aidlc-docs/aidlc-backlog.md` - Master backlog
- `aidlc-docs/{domain}/aidlc-backlog.md` - Domain backlogs
- `aidlc-docs/audit.md` - Audit trail

**The Problem**: These files get updated frequently during development, leading to merge conflicts when multiple developers work on different units of work simultaneously.

---

## The Solution: Git Worktrees

**Git worktrees** allow each developer to maintain an isolated workspace with their own AIDLC state while sharing the same Git repository.

### What Are Git Worktrees?

Git worktrees let you check out multiple branches of the same repository simultaneously in different directories. Each worktree has its own working directory but shares the same `.git` repository.

```
/my-project/                      # Main worktree (develop branch)
/my-project-auth-002/            # Worktree for AUTH-002 (feature branch)
/my-project-api-001/             # Worktree for API-001 (feature branch)
```

**Key Benefits**:
- ✅ **Isolated AIDLC state** - Each worktree has its own `aidlc-docs/` state files
- ✅ **No state conflicts** - Developers don't step on each other's AIDLC sessions
- ✅ **Parallel work** - Multiple developers can work on different units simultaneously
- ✅ **Fast context switching** - Jump between units without stashing or committing incomplete work
- ✅ **Standard Git workflow** - Works with normal PR/merge process

---

## Team Workflow with Git Worktrees

### 1. Project Initialization (One Time, Per Project)

**First developer initializes the project**:

```bash
# In main repository
cd /path/to/my-project

# Initialize AIDLC for the project
# "Using AI-DLC, initialize project"
```

After initialization, commit and push the AIDLC configuration:

```bash
git add aidlc-docs/
git commit -m "chore(aidlc): initialize project configuration"
git push origin develop
```

**All other developers pull the configuration**:

```bash
git pull origin develop
# Now aidlc-docs/anchor-map.md exists and is shared
```

---

### 2. Starting Work on a Unit

#### Step 1: Check Available Units

**Before starting work**, check which units are available:

```bash
# Pull latest changes
git checkout develop
git pull origin develop

# Check available units
cat aidlc-docs/aidlc-backlog.md
```

**Review the backlog table**:

```markdown
| ID | Unit of Work | Domain | Status | Assignee(s) | Depends On | Completed |
|----|--------------|--------|--------|-------------|------------|-----------|
| AUTH-001 | User Authentication | auth | ✅ Complete | alice.johnson | — | 2026-03-01 |
| AUTH-002 | Session Management | auth | 🔓 Unblocked | — | AUTH-001 | — |
| API-001 | REST API Foundation | api | 🔓 Unblocked | — | AUTH-001 | — |
| API-002 | Rate Limiting | api | ⏳ Blocked | — | API-001 | — |
```

**Pick an unblocked unit** (🔓 Unblocked) that doesn't have an assignee yet.

> **Note**: AIDLC will **automatically claim the unit** for you when you start the workflow (Step 3). Your git username will be captured and added to the Assignee(s) column automatically.

#### Step 2: Create Feature Branch + Worktree

```bash
# Create a feature branch + worktree in one command
# Pattern: git worktree add -b <branch-name> <directory> <base-branch>
git worktree add -b feature/AUTH-002-session-mgmt ../myproject-auth-002 develop

# Navigate to the new worktree
cd ../myproject-auth-002

# Verify you're in the right place
git branch --show-current
# Should show: feature/AUTH-002-session-mgmt
```

**Naming Convention**:
- Branch: `feature/{UNIT-ID}-{slugified-title}`
- Worktree directory: `../{project-name}-{unit-id-lowercase}`

Examples:
- `feature/AUTH-002-session-mgmt` → `../myproject-auth-002`
- `feature/API-001-rest-api-foundation` → `../myproject-api-001`
- `feature/FRONTEND-003-login-page` → `../myproject-frontend-003`

#### Step 3: Start AIDLC Work

In your worktree, start the AIDLC workflow:

```
Using AI-DLC, implement AUTH-002 session management with JWT tokens
```

The AI will:
- **Capture your git username** automatically (via `git config user.name`)
- Load the shared AIDLC configuration (anchor-map.md)
- **Claim the unit** by updating Assignee(s) field with your username
- Create a **local copy** of AIDLC state files in this worktree
- Work through Inception → Construction → Testing → Documentation phases
- All state changes are isolated to this worktree

**Automatic claiming**: When you start work on AUTH-002, AIDLC automatically:
1. Detects your git username (e.g., `bob.smith`)
2. Updates the master backlog: `| AUTH-002 | ... | 🔄 In Progress | bob.smith | ... |`
3. Updates the domain backlog with the same assignee
4. Commits the backlog update to signal to other developers

This prevents race conditions where two developers accidentally claim the same unit.

---

### 3. Working in Your Worktree

While in your worktree, you have **complete isolation**:

```
/myproject-auth-002/
├── src/                          # Your feature code
├── tests/                        # Your feature tests
├── aidlc-docs/
│   ├── aidlc-state.md           # YOUR isolated state
│   ├── aidlc-backlog.md         # Your local copy (don't merge this)
│   ├── audit.md                 # YOUR audit trail (don't merge this)
│   └── auth/
│       ├── aidlc-backlog.md     # Your local copy
│       └── AUTH-002-session-mgmt/  # Your unit artifacts (DO merge this)
│           ├── inception/
│           ├── construction/
│           ├── testing/
│           ├── documentation/
│           └── session-summary.md
```

**Key Points**:
- ✅ **Work freely** - All AIDLC state changes stay in your worktree
- ✅ **No conflicts** - Other developers' work doesn't interfere
- ✅ **Context switching** - Jump to another worktree anytime (no stashing needed)

---

### 4. Staying in Sync with Main Branch

**Regularly pull updates** from the main development branch to get completed units from other developers:

```bash
# In your worktree
cd /path/to/myproject-auth-002

# Fetch latest changes
git fetch origin

# Merge develop into your feature branch
git merge origin/develop
```

**What gets updated**:
- ✅ Completed units from other developers (e.g., `aidlc-docs/auth/AUTH-001-*/`)
- ✅ Master backlog updates (other units marked complete)
- ✅ Application code changes from other developers

**What stays isolated**:
- ❌ Your `aidlc-state.md` (not committed)
- ❌ Your `audit.md` (not committed)
- ❌ Your in-progress unit artifacts

---

### 5. Completing a Unit and Creating a PR

When AIDLC completes the Documentation phase, you're ready to merge.

#### Step 1: Review What to Commit

**DO commit** (these merge to main branch):
- ✅ Application code (`src/`, `tests/`, etc.)
- ✅ **Completed unit folder**: `aidlc-docs/{domain}/{UNIT-ID}-{title}/`
- ✅ **Master backlog update**: Mark unit as ✅ Complete in `aidlc-docs/aidlc-backlog.md`
- ✅ **Domain backlog update**: Mark unit complete in `aidlc-docs/{domain}/aidlc-backlog.md`
- ✅ **Promoted feature doc**: `aidlc-docs/{domain}/docs/{UNIT-ID}-{title}.md` (if created by AIDLC)
- ✅ **Anchor map updates**: If you added new domains or guidelines

**DO NOT commit** (these are session-local state):
- ❌ `aidlc-docs/aidlc-state.md` (temporary session state)
- ❌ `aidlc-docs/audit.md` (your personal audit trail)
- ❌ `aidlc-docs/_shared/plans/` (temporary workflow plans)

#### Step 2: Commit Your Work

```bash
# Add application code
git add src/ tests/

# Add completed unit artifacts
git add aidlc-docs/auth/AUTH-002-session-mgmt/

# Add domain backlog update
git add aidlc-docs/auth/aidlc-backlog.md

# Add master backlog update
git add aidlc-docs/aidlc-backlog.md

# Add promoted feature doc (if exists)
git add aidlc-docs/auth/docs/AUTH-002-session-mgmt.md

# Create TWO commits (per AIDLC convention)
git commit -m "feat(auth): implement session management with JWT tokens (AUTH-002)"
git commit -m "docs(aidlc): AUTH-002 complete — session summary, backlog updated"

# Push feature branch
git push -u origin feature/AUTH-002-session-mgmt
```

#### Step 3: Create Pull Request

Create a PR from your feature branch to `develop` (or `main`):

```
Title: feat(auth): Implement session management (AUTH-002)

Description:
- Implements JWT-based session management
- Adds session refresh endpoints
- Updates authentication middleware

AIDLC Artifacts:
- Unit documentation: aidlc-docs/auth/AUTH-002-session-mgmt/
- Feature doc: aidlc-docs/auth/docs/AUTH-002-session-mgmt.md

Dependencies:
- Depends on AUTH-001 (User Authentication) ✅ Complete
```

#### Step 4: After PR Merge

```bash
# Switch back to main worktree
cd /path/to/my-project

# Pull merged changes
git checkout develop
git pull origin develop

# Remove the feature worktree (work is now merged)
git worktree remove ../myproject-auth-002

# Clean up feature branch (optional)
git branch -d feature/AUTH-002-session-mgmt
```

---

## Handling Dependencies Between Units

### Scenario: Developer B Needs Developer A's Work

**Developer A** is working on `AUTH-001` (User Authentication)
**Developer B** wants to start `API-001` (REST API), which depends on `AUTH-001`

#### Option 1: Wait for Completion (Recommended)

```bash
# Developer B checks backlog
cat aidlc-docs/aidlc-backlog.md

# AUTH-001 shows: 🔄 In Progress
# Decision: Wait or work on another unblocked unit
```

#### Option 2: Work on a Different Unit

```bash
# Check for unblocked units
grep "🔓 Unblocked" aidlc-docs/aidlc-backlog.md

# Start a different unit that has no dependencies
git worktree add -b feature/FRONTEND-001-login-page ../myproject-frontend-001 develop
```

#### Option 3: Coordinate with Developer A (Advanced)

If urgent, Developer B can pull Developer A's feature branch into their worktree:

```bash
# In Developer B's worktree
git fetch origin
git merge origin/feature/AUTH-001-jwt-authentication

# Now B can use A's code, but not AIDLC artifacts
# B's AI doesn't know about A's in-progress planning
```

> **Note**: This is risky if Developer A is still making changes. Better to wait for PR merge.

---

## Best Practices

### 1. **Check Backlog Before Starting**
Always check the backlog for in-progress units **before** creating your worktree. AIDLC will automatically claim the unit when you start work, but you should verify no one else is already working on it.

### 2. **One Developer Per Unit**
Never have two developers work on the same unit simultaneously. If someone is already 🔄 In Progress, pick another unit.

### 3. **Keep Worktrees Short-Lived**
Create a worktree → complete unit → merge PR → remove worktree. Don't let worktrees linger for weeks.

### 4. **Sync Regularly**
Run `git merge origin/develop` in your worktree at least daily to stay up-to-date with completed units.

### 5. **Clean Commits**
Only commit completed artifacts. Don't commit `aidlc-state.md` or `audit.md` (these are session-local).

### 6. **Use Descriptive Branch Names**
Follow the pattern: `feature/{UNIT-ID}-{slugified-title}` for easy identification.

### 7. **Communicate Dependencies**
If your unit is blocking others, let the team know when you expect to finish.

---

## Troubleshooting

### Problem: "I accidentally committed `aidlc-state.md`"

```bash
# Remove from last commit (before push)
git reset HEAD~1
git restore --staged aidlc-docs/aidlc-state.md
git commit -m "feat(auth): implement session management (AUTH-002)"

# If already pushed, create a follow-up commit
git rm aidlc-docs/aidlc-state.md
git commit -m "chore: remove session-local state file"
```

### Problem: "Merge conflict in `aidlc-backlog.md`"

This happens if two developers updated the backlog simultaneously.

```bash
# During merge
git merge origin/develop

# Conflict in aidlc-docs/aidlc-backlog.md
# Open the file and resolve manually:
# - Keep both status updates
# - Preserve unit order
# - Don't delete others' "In Progress" units

git add aidlc-docs/aidlc-backlog.md
git commit -m "chore: resolve backlog merge conflict"
```

### Problem: "How do I list all worktrees?"

```bash
# Show all worktrees for this repo
git worktree list

# Example output:
# /Users/alice/my-project              abc1234 [develop]
# /Users/alice/my-project-auth-002     def5678 [feature/AUTH-002-session-mgmt]
# /Users/alice/my-project-api-001      ghi9012 [feature/API-001-rest-api]
```

### Problem: "I want to switch to another unit mid-work"

No problem! Just navigate to the other worktree:

```bash
# You're in worktree for AUTH-002
cd /path/to/myproject-auth-002

# Switch to worktree for API-001
cd /path/to/myproject-api-001

# Resume AIDLC work
# "Using AI-DLC, continue API-001"
```

Your AUTH-002 work is preserved in its worktree, no stashing needed.

---

## Handling Application Code Conflicts

### The Problem

Even with isolated AIDLC state (via worktrees or different units), your **application code can still conflict** when multiple developers modify the same files.

**Example**:
- Dev A (AUTH-001) modifies `src/middleware/auth.ts` to add JWT validation
- Dev B (API-001) modifies `src/middleware/auth.ts` to add rate limiting
- When merging: Git conflict in `auth.ts`

### This is Normal Git Workflow

AIDLC doesn't prevent or detect application code conflicts - **this is standard software development**.

**What AIDLC solves**:
- ✅ AIDLC state conflicts (via worktrees or unit isolation)
- ✅ Developer tracking (who's working on what via Assignee(s) field)
- ✅ Documentation and testing (catch integration issues)

**What AIDLC does NOT solve**:
- ❌ Preventing Git merge conflicts in application code
- ❌ Resolving merge conflicts (use Git tools)
- ❌ Detecting file overlap before coding starts

Application code conflicts require **team coordination** and **good Git practices**.

---

### Best Practices to Minimize Conflicts

#### 1. **Check the Backlog Before Starting**

Before claiming a unit, review in-progress units to identify potential overlaps:

```bash
# Check in-progress units
cat aidlc-docs/aidlc-backlog.md | grep "🔄 In Progress"

# Example output:
| AUTH-001 | User Authentication | auth | 🔄 In Progress | alice.johnson | — | — |
| API-002 | Rate Limiting | api | 🔄 In Progress | bob.smith | API-001 | — |
```

**If you see someone working in the same domain or related area, coordinate with them**:

- Slack/Teams: "Hey Alice, I'm starting API-001 which depends on AUTH-001. Which files are you changing?"
- Standups: "I'm working on AUTH middleware this sprint. Anyone else touching that area?"

#### 2. **Use Short-Lived Feature Branches**

Complete units quickly (2-3 days, not weeks) and merge frequently:

```bash
# ✅ Good: Unit completed in 2-3 days
feature/AUTH-001 → PR → merge → delete branch

# ❌ Bad: Unit lingers for 2 weeks
# Other devs' changes accumulate, merge conflicts grow exponentially
```

**Why this matters**:
- Small, frequent merges = small, manageable conflicts
- Long-lived branches = large, complex conflicts with multiple files

#### 3. **Pull Main/Develop Frequently**

Even while working on your unit, stay synced with the main branch:

```bash
# In your worktree or feature branch (at least daily)
cd /path/to/myproject-auth-002
git fetch origin
git merge origin/develop

# Resolve small conflicts incrementally, not all at once at the end
```

**Benefit**: Catch conflicts early when context is fresh, rather than days/weeks later.

#### 4. **Coordinate on Shared Files**

If your unit will touch files another developer is modifying, choose a coordination strategy:

**Option A: Sequential Work (Recommended)**
- Wait for their PR to merge before starting your unit
- Your work builds on theirs (no conflicts)
- Example: AUTH-001 merges → then start API-001

**Option B: Pair Programming**
- Work together on the shared file
- Both devs credited in Assignee(s): `alice.johnson, bob.smith`
- Real-time coordination eliminates conflicts

**Option C: Split Work Differently**
- Refactor unit boundaries to minimize overlap
- Example:
  - AUTH-001 handles only auth logic in `src/auth/`
  - API-001 handles only endpoints in `src/api/`
  - Shared middleware created in separate unit AUTH-002

**Option D: Coordinate Merge Timing**
- Both devs work in parallel on separate files
- Coordinate merge order: A merges first, B rebases on A's merged code
- Requires tight communication

#### 5. **Use Git Merge Tools**

When conflicts happen (and they will), use proper merge tools:

```bash
# VSCode built-in merge editor (recommended)
# Opens automatically on conflict

# Or: Git's built-in mergetool
git mergetool --tool=vimdiff

# Or: GitHub Desktop visual merge
# Or: Tower, GitKraken, SourceTree
```

**Don't manually edit conflict markers** (`<<<<<<<`, `=======`, `>>>>>>>`):
- Error-prone
- Easy to miss conflicts
- Can accidentally delete code

#### 6. **PR Reviews Catch Integration Issues**

Git conflicts are only one type of integration problem. **Logic conflicts** can occur without Git conflicts:

**Example**:
- Dev A changes function signature: `authenticate(token)` → `authenticate(token, options)`
- Dev B calls old signature: `authenticate(token)` in a different file
- **No Git conflict** (different files), but code breaks at runtime

**Solution**:
- Thorough PR reviews catch these issues
- Automated tests (unit + integration + E2E) catch runtime failures
- CI/CD pipeline runs all tests before merge

#### 7. **Monitor File Changes in PRs**

Before starting a new unit, check recent PRs for file changes:

```bash
# GitHub CLI: List recent PRs and their files
gh pr list --state merged --limit 10
gh pr view <PR-NUMBER> --json files

# Or: Check GitHub/GitLab web UI
# Go to "Files changed" tab in recent PRs
```

**Why this helps**: If `auth.ts` was recently modified, you know it's a hot file with high conflict risk.

---

### When to Use Worktrees vs Single Repository

| Scenario | Recommendation | Reasoning |
|----------|----------------|-----------|
| **Different domains** | Either worktrees or single repo | Low file overlap between domains |
| **Same domain, different files** | Single repo is fine | Git branch management handles this well |
| **Same domain, same files** | Coordinate timing or use worktrees | Worktrees isolate state while you coordinate merges |
| **3+ developers** | Worktrees recommended | Reduces AIDLC state conflicts significantly |
| **Large codebase (500K+ LOC)** | Worktrees recommended | More likely to have simultaneous work |

---

### Example: Coordinating Same-File Changes

**Scenario**: Alice and Bob both need to modify `src/middleware/auth.ts`

#### Without Coordination (Bad)

```bash
# Alice (AUTH-001): Adds JWT validation to auth.ts
# Bob (API-001): Adds rate limiting to auth.ts
# Both work in parallel for 3 days

# On merge: Large conflict in auth.ts
# Context lost: What was each change trying to accomplish?
# Resolution: Error-prone, may break one or both features
```

#### With Coordination (Good)

```bash
# Day 1: Alice claims AUTH-001, Bob sees it in backlog
Bob: "Hey Alice, I need to touch auth.ts for API-001. What's your timeline?"
Alice: "I'll be done in 2 days. Want to pair on the shared changes?"

# Option A: Bob waits (if not urgent)
# Day 3: Alice merges AUTH-001
# Day 4: Bob starts API-001, builds on Alice's merged code
# Result: No conflicts

# Option B: Pair programming (if both urgent)
# Day 1-2: Alice and Bob work together on auth.ts
# Both features implemented together
# Single PR with both devs as assignees
# Result: No conflicts
```

---

### Summary: AIDLC's Role in Conflict Management

| Conflict Type | AIDLC Helps? | How? |
|---------------|-------------|------|
| **AIDLC state conflicts** | ✅ Yes | Worktrees isolate state, git user tracking shows who's working on what |
| **Backlog conflicts** | ✅ Yes | Git user tracking + claiming workflow prevents duplicate work |
| **Application code conflicts** | ⚠️ Indirectly | Documentation shows what was changed, tests catch integration issues |
| **Git merge conflicts** | ❌ No | Standard Git workflow, use merge tools and coordination |

**Bottom Line**: AIDLC provides visibility (backlog, assignees, documentation) and isolation (worktrees). Actual conflict resolution requires:
- Team communication (standups, Slack, pair programming)
- Git discipline (short-lived branches, frequent merges, proper tools)
- Testing (automated tests catch logic conflicts without Git conflicts)

---

## Alternative: Single-Worktree Teams (Not Recommended)

If your team doesn't want to use worktrees, you can work in a single repository, but you'll face conflicts:

### Conflict Mitigation Without Worktrees

1. **Coordinate via backlog** - Update status immediately when starting/stopping work
2. **Short-lived branches** - Complete units quickly to minimize overlap
3. **Manual conflict resolution** - Expect merge conflicts in backlog files
4. **Avoid simultaneous domain work** - Try to work in different domains when possible

### When Single-Worktree Makes Sense

- Very small teams (2-3 developers)
- Large codebase with well-separated domains (rare conflicts)
- Team has strong communication/coordination practices

---

## Worktree Cheat Sheet

```bash
# Create new worktree + branch
git worktree add -b <branch> <directory> <base-branch>
git worktree add -b feature/AUTH-002 ../myproject-auth-002 develop

# List all worktrees
git worktree list

# Remove worktree (after branch is merged)
git worktree remove <directory>
git worktree remove ../myproject-auth-002

# Remove worktree (force, even if uncommitted changes)
git worktree remove --force <directory>

# Clean up stale worktree references
git worktree prune
```

---

## Summary

| Aspect | With Git Worktrees | Without Git Worktrees |
|--------|-------------------|----------------------|
| **State Conflicts** | ✅ None (isolated) | ❌ Frequent (merge conflicts) |
| **Parallel Work** | ✅ Easy | ⚠️ Requires coordination |
| **Context Switching** | ✅ Fast (just cd) | ⚠️ Requires stash/commit |
| **Setup Complexity** | ⚠️ Medium (new workflow) | ✅ Low (standard Git) |
| **Team Coordination** | ✅ Minimal | ❌ High (to avoid conflicts) |
| **Disk Usage** | ⚠️ Higher (multiple worktrees) | ✅ Lower (single worktree) |

**Recommendation**: For teams of 3+ developers working on the same codebase, **use Git worktrees**. The isolated state eliminates AIDLC conflicts and enables true parallel development.

---

## Looking for AI-Driven Parallel Development?

For automated parallel execution using Claude Code Agent Teams (experimental), see [AIDLC_AGENT_TEAMS_GUIDE.md](AIDLC_AGENT_TEAMS_GUIDE.md). This guide covers human multi-developer coordination only.

---

## Need Help?

- **Git Worktrees Documentation**: https://git-scm.com/docs/git-worktree
- **AIDLC Framework Issues**: https://github.com/csiorbit/aidlc/issues
- **Questions?** Open a discussion in your team's communication channel

---

*This guide is maintained by the AIDLC community. Contributions welcome!*
