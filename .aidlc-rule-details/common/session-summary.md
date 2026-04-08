# Session Summary System

> **For patterns and philosophy**, see [RULE_AUTHORING.md § Session & Unit Management](/.aidlc-rule-details/RULE_AUTHORING.md#session--unit-management)

---

## File Structure (MANDATORY FORMAT)

**Location**: `aidlc-docs/{domain}/{unit}/session-summary.md`

```markdown
# Session Summary: {UNIT-ID}

## Identity
- **Domain**: {domain name}
- **Unit**: {unit identifier}
- **External Reference**: {JIRA-1234 | ADO-5678 | GH-123 | None}
- **Branch**: {git branch name}
- **Current Phase**: {INCEPTION | CONSTRUCTION | OPERATIONS | TESTING & VALIDATION | DOCUMENTATION}
- **Current Stage**: {stage name within phase}
- **Last Session**: {YYYY-MM-DD HH:MM} (ISO timestamp)
- **Session Status**: {Active | Paused | Complete}
- **Track**: {Full | Lightweight | Hotfix}

## Git Anchors
- **Session Start Commit**: {40-character git hash}
- **Session End Commit**: {40-character git hash or "(pending)"}
- **Rollback Command**: `git reset --hard {session-start-hash}`

## Files Touched This Session
### Created
- `path/to/file.ext` — one-line description

### Modified
- `path/to/file.ext` — one-line description

### Deleted
- `path/to/file.ext` — one-line description

## Decisions Made
- **{Decision Name}**: {One-sentence rationale}

## Discovered (Not Yet Acted On)
- {Item discovered during work for later action}

## Exact Next Step
{Specific, actionable instruction for resuming work without re-planning. Must be precise enough to continue without additional context.}

## Open Questions / Blockers
- {Question or blocker with resolution context}
- None (if no blockers)
```

---

## Update Triggers (MANDATORY)

### Session Start
Update session-summary.md with:
- Git anchor (Session Start Commit from `git rev-parse HEAD`)
- Current phase and stage
- Session Status: "Active"
- Last Session timestamp

### Mid-Session Breakpoints
Update at EVERY natural breakpoint:
- After significant file batch completed
- After completing a stage within a phase
- Before context reset

**Rule**: If Claude Code were closed right now, session summary MUST contain enough for fresh session to resume without re-planning.

### Session End
Finalize with:
- Session End Commit (from `git rev-parse HEAD`)
- Exact Next Step (specific and actionable)
- Open Questions / Blockers (if any)
- Session Status updated
- **MANDATORY**: Execute audit archival check (see below)

**Audit Archival Check** (MANDATORY at session end):
1. Count session markers in `aidlc-docs/audit.md` using: `grep -c "^## Session:" aidlc-docs/audit.md`
2. If count > 5:
   - Archive oldest session(s) to `aidlc-docs/audit-archive/audit-{YYYY-MM}.md`
   - Remove archived sessions from audit.md
   - Keep only 5 most recent sessions
3. See `common/audit-archive.md` for complete archival procedure

---

## Overwrite-with-Archive Pattern (MANDATORY)

### Process
1. **Before overwriting**: Archive prior version to preserve history
2. **Archive location**: `aidlc-docs/{domain}/{unit}/session-history/session-YYYY-MM-DD-HH.md`
3. **Then overwrite**: Update session-summary.md with new content

### Archive Filename Format
```
session-{YYYY}-{MM}-{DD}-{HH}.md
```
Example: `session-2026-03-02-14.md`

### When to Archive
- At session end, before marking complete
- When making significant changes mid-session
- When resuming a paused unit (archive paused state first)

---

## Pause Checkpoint Requirements

When unit paused via Option B (interruption handling), session summary MUST include:

1. **Exact Next Step**: Precise enough to resume without other context
   - ❌ Bad: "Continue with implementation"
   - ✅ Good: "Implement `validateUserInput()` method in `src/validators/user.ts` using schema from functional-design.md section 3.2"

2. **Session Status**: Set to "Paused"

3. **Files Touched**: List ALL files created/modified/deleted

4. **Decisions Made**: Capture any decisions made before pausing

5. **Open Questions**: Document anything unresolved affecting next step

---

## Session Status Values

| Status | Meaning | When to Use |
|--------|---------|-------------|
| **Active** | Work in progress | During active development |
| **Paused** | Interrupted, will resume | When switching units via Option B |
| **Complete** | Unit finished | After Documentation phase approval |

---

## Required Field Standards

### "Exact Next Step" Requirements
- Include file paths with line numbers when relevant
- Reference specific sections of design documents
- Mention any setup or context needed
- Assume reader has no memory of prior work

### "Decisions Made" Requirements
- State decision clearly
- Include rationale in one sentence
- Reference artifact where documented in detail

### "Discovered" Requirements
- Capture items found but shouldn't block current work
- Include enough context for future action
- Tag with priority if known (e.g., "P1: security concern")

---

## Integration Points

| System | Requirement |
|--------|-------------|
| **Backlog** | Session Status changes MUST be reflected in domain backlog |
| **Rollback** | Git Anchors enable rollback system (see common/rollback.md) |
| **Audit Trail** | Session summary changes MUST be noted in audit.md |

---

## External Reference Field

**Optional field**: `External Reference`

**Usage**: Only include if user mentioned external ticket in initial request
**Format**: `JIRA-1234`, `ADO-5678`, `GH-123`, or `None`
**Purpose**: Link unit to project management system

**Do NOT ask** about external references — only populate if explicitly mentioned by user.
