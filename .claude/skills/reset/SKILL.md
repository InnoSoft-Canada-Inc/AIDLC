---
name: reset
description: Reset AIDLC project state. ONLY invoke via /reset slash command. NEVER auto-invoke from natural language — no phrase like "reset", "clear", "start fresh", or "clean slate" should trigger this skill. The user must explicitly type /reset.
---

# AIDLC Reset

Safely reset AIDLC project state with tiered options — from clearing unit work to full project reset, with optional archival.

## CRITICAL: Safety Guards

**This skill performs DESTRUCTIVE operations. Follow these rules strictly:**

1. **ONLY invoke via `/reset`.** This skill must NEVER be auto-invoked from natural language. No phrase — "reset", "clear", "start fresh", "clean slate", "new project" — should trigger this skill. The user must explicitly type the `/reset` slash command.

2. **ALWAYS confirm intent before ANY action.** The very first thing this skill does is present options and wait for the user to choose. No files are read, deleted, moved, or modified until the user has made an explicit selection.

3. **NEVER skip confirmation steps.** Every destructive path (A, B, C) has its own confirmation. Option B requires typing "RESET". These cannot be bypassed.

4. **If the user seems uncertain**, recommend Option C (Archive & Reset) or suggest they cancel. Err on the side of preserving data.

## Instructions

When invoked:

### Step 0: Confirm Intent

Before doing anything else, confirm the user actually wants a reset:

```
You've requested an AIDLC reset. This will delete generated documentation in `aidlc-docs/`.

Your application code, CLAUDE.md, and .aidlc-rule-details/ are never affected.

Would you like to see the reset options, or did you mean something else?
A) Show reset options
B) Cancel — I didn't mean to reset

[Answer]:
```

If B: Stop immediately. If the user's original message suggests they wanted something else (new unit, initialize), point them to the right command.

### Step 1: Check Current State

1. Check if `aidlc-docs/` exists. If not:
   ```
   No AIDLC project state found (`aidlc-docs/` does not exist). Nothing to reset.
   ```
   Stop here.

2. Read `aidlc-docs/aidlc-state.md` to check for an active unit
3. Count domains and units from `aidlc-docs/aidlc-backlog.md` (if it exists)
4. Check if `aidlc-docs/anchor-map.md` exists (project configuration)
5. Check for lessons at the path configured for self-improvement (typically `aidlc-docs/lessons.md` or within `_shared/`)

### Step 2: Warn if Active Unit

If `aidlc-state.md` shows an active unit (status: In Progress):

```
## Warning: Active Unit Detected

Unit **{UNIT-ID}** ({domain}) is currently **in progress** at the {phase} phase.

Resetting now will lose all unsaved work for this unit. Consider:
- Completing the unit first
- Running `/sync-docs` to sync external docs before reset
- Choosing "Archive & Reset" to preserve a copy

Do you want to continue?
A) Yes, continue to reset options
B) No, cancel reset

[Answer]:
```

If B: Stop here.

### Step 3: Present Reset Options

```
## AIDLC Reset

Current state: {N} domain(s), {M} unit(s) ({C} complete, {P} in progress)

**A) Reset units** — Clear all unit work but keep project configuration
   Removes: Domain folders, backlogs, session summaries, audit logs
   Keeps: anchor-map.md, extension config, technical/design guidelines references, lessons

**B) Reset project** — Full clean slate, re-initialization required
   Removes: Everything in `aidlc-docs/`
   Keeps: Nothing (CLAUDE.md, .aidlc-rule-details/, application code are untouched)

**C) Archive & reset** — Archive current state, then full reset
   Archives: Copies `aidlc-docs/` to `aidlc-docs-archive/{timestamp}/`
   Then: Same as Option B (full clean slate)

**D) Cancel** — Do nothing

[Answer]:
```

Wait for user's selection before proceeding.

---

### Option A: Reset Units

Clears all unit work while preserving project-level configuration.

**Step A1: Pre-flight check**

Check if External Docs Configuration exists in anchor-map.md. If yes:
```
You have external docs sync configured. Would you like to run /sync-docs for completed units before resetting?
A) Yes, sync first
B) No, just reset

[Answer]:
```

If A: Invoke the sync-docs skill, then continue.

**Step A2: Preserve configuration files**

Read and hold in memory:
- `aidlc-docs/anchor-map.md` (full contents)
- Extension configuration section from `aidlc-docs/aidlc-state.md` (under `## Extension Configuration`)
- `aidlc-docs/lessons.md` (if it exists) — or wherever self-improvement lessons are stored

**Step A3: Delete unit artifacts**

Delete the following (but NOT the `aidlc-docs/` directory itself):
- All domain folders: `aidlc-docs/{domain}/` (each domain directory and all contents)
- `aidlc-docs/_shared/` (cross-domain artifacts)
- `aidlc-docs/aidlc-backlog.md` (master backlog)
- `aidlc-docs/audit.md` (audit log)
- `aidlc-docs/audit-archive/` (archived audit logs)

**Step A4: Reset aidlc-state.md**

Overwrite `aidlc-docs/aidlc-state.md` with a clean state that preserves extension config:

```markdown
# AIDLC State

## Current Session
- **Status**: No active unit
- **Track**: —
- **Phase**: —
- **Stage**: —

## Extension Configuration
{preserved extension config from Step A2, or empty section if none existed}
```

**Step A5: Restore preserved files**

- `anchor-map.md` — already preserved (was not deleted)
- `lessons.md` — write back if it was read in Step A2

**Step A6: Report**

```
## Reset Complete (Units Cleared)

### Removed
- {N} domain folder(s): {list domain names}
- Shared artifacts (`_shared/`)
- Master backlog, audit logs

### Preserved
- `anchor-map.md` — Project configuration intact
- `aidlc-state.md` — Reset to clean state (extension config preserved)
- `lessons.md` — Self-improvement lessons preserved
- CLAUDE.md, .aidlc-rule-details/ — Untouched

### Next Steps
- Run `Using AI-DLC, {your next feature}` to start a new unit
- Project initialization is NOT required — anchor-map.md is still configured
```

---

### Option B: Reset Project

Full clean slate. User will need to re-run `Using AI-DLC, initialize project`.

**Step B1: Final confirmation**

```
## Confirm Full Reset

This will delete the entire `aidlc-docs/` directory including:
- All domain folders and unit work
- anchor-map.md (project configuration)
- aidlc-state.md (workflow state)
- All backlogs, audit logs, session summaries
- Lessons learned (self-improvement data)

Your application code, CLAUDE.md, and .aidlc-rule-details/ are NOT affected.

**This cannot be undone.** Consider Option C (Archive & Reset) if you might need this data later.

Type "RESET" to confirm, or anything else to cancel.

[Answer]:
```

If the user does not type exactly "RESET": Cancel and return to Step 3.

**Step B2: Delete aidlc-docs/**

Delete the entire `aidlc-docs/` directory and all contents.

**Step B3: Report**

```
## Reset Complete (Full Project)

### Removed
- `aidlc-docs/` — Entire directory deleted

### Untouched
- CLAUDE.md
- .aidlc-rule-details/
- .claude/ (skills, agents)
- All application code

### Next Steps
- Run `Using AI-DLC, initialize project` to set up a new project
```

---

### Option C: Archive & Reset

Archives the current state before doing a full reset.

**Step C1: Create archive**

1. Generate timestamp: `YYYY-MM-DD-HHMMSS` format
2. Create archive directory: `aidlc-docs-archive/{timestamp}/`
3. Copy the entire `aidlc-docs/` directory into the archive:
   ```
   aidlc-docs-archive/
   └── {timestamp}/
       ├── aidlc-state.md
       ├── aidlc-backlog.md
       ├── anchor-map.md
       ├── audit.md
       ├── _shared/
       └── {domains}/
   ```

**Step C2: Verify archive**

Verify the archive was created successfully by checking that key files exist:
- `aidlc-docs-archive/{timestamp}/anchor-map.md`
- `aidlc-docs-archive/{timestamp}/aidlc-state.md`

If verification fails, abort and report the error. Do NOT proceed to deletion.

**Step C3: Delete aidlc-docs/**

Delete the entire `aidlc-docs/` directory (same as Option B Step B2).

**Step C4: Report**

```
## Reset Complete (Archived & Reset)

### Archived To
- `aidlc-docs-archive/{timestamp}/`

### Archive Contents
- {N} domain(s), {M} unit(s)
- Project configuration (anchor-map.md)
- All session summaries, backlogs, audit logs

### Removed
- `aidlc-docs/` — Entire directory deleted

### Untouched
- CLAUDE.md
- .aidlc-rule-details/
- .claude/ (skills, agents)
- All application code

### Next Steps
- Run `Using AI-DLC, initialize project` to set up a new project
- Previous project data available at `aidlc-docs-archive/{timestamp}/`
- To restore: copy archive contents back to `aidlc-docs/`
```

---

## Important Rules

- **Never touch application code** — This skill only operates on `aidlc-docs/` and `aidlc-docs-archive/`. It must NEVER delete, modify, or move any application code, CLAUDE.md, .aidlc-rule-details/, or .claude/.
- **Confirm destructive actions** — Option B requires typing "RESET". Option A and C have softer confirmations but still require explicit user choice.
- **Archive before delete for Option C** — Always verify the archive exists before deleting the original. If archival fails, abort entirely.
- **Preserve lessons when possible** — Option A preserves `lessons.md` because self-improvement data has cross-project value. Options B and C do not (but C archives it).
- **Check for active work** — Always warn if an in-progress unit exists before allowing reset.
- **Offer sync first** — If external docs config exists, offer to run `/sync-docs` before clearing.
- **Don't auto-add to .gitignore** — The `aidlc-docs-archive/` directory may or may not be version-controlled. Let the user decide.
