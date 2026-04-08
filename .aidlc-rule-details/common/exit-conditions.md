# Exit Conditions

**Purpose**: Define the mandatory exit conditions that must be met before any unit of work can be considered complete. Documentation is the exit condition, not an optional phase.

---

## Core Principle

**Documentation is not a phase you enter — it is the exit condition for closing any unit of work regardless of track.**

No unit of work is complete until:
1. **Task alignment verified** — deliverable addresses the original user request
2. Session summary is finalized
3. Affected documentation is updated at appropriate depth for the track
4. Backlog reflects the current state

The developer never needs to explicitly request documentation. The workflow enforces it automatically as the exit condition every time.

---

## Exit Requirements by Track

### Full Track Exit

All of the following must be complete:

| Requirement | Description |
|-------------|-------------|
| **Task Alignment** | Deliverable verified against original request (see `common/task-alignment.md`) |
| **Session Summary** | Finalized with Session End Commit, Exact Next Step marked complete, Session Status set to "Complete" |
| **Feature Documentation** | Full documentation of the new feature or capability |
| **Impact Scan** | Assessment of all areas affected by the change |
| **Cross-Doc Update** | All related documentation updated for consistency |
| **Consistency Check** | Verification that documentation is internally consistent |
| **Backlog Update** | Unit marked ✅ Complete, unblock cascade applied to dependent units |

### Lightweight Track Exit

All of the following must be complete:

| Requirement | Description |
|-------------|-------------|
| **Task Alignment** | Deliverable verified against original request |
| **Session Summary** | Finalized with Session End Commit, Session Status set to "Complete" |
| **Brief Change Note** | Concise description of what changed and why |
| **Targeted Doc Update** | Only directly affected documentation updated |
| **Backlog Update** | Unit marked ✅ Complete, unblock cascade applied |

### Hotfix Track Exit

All of the following must be complete:

| Requirement | Description |
|-------------|-------------|
| **Task Alignment** | Fix addresses the reported issue |
| **Session Summary** | Finalized with Session End Commit, Session Status set to "Complete" |
| **One-Paragraph Entry** | Single paragraph in the relevant documentation explaining the fix |
| **Backlog Update** | Unit marked ✅ Complete (if tracked), session logged |

---

## Session Summary Exit Requirements

At unit completion, the session summary must contain:

```markdown
## Identity
- **Session Status**: Complete

## Git Anchors
- **Session Start Commit**: {40-character hash}
- **Session End Commit**: {40-character hash}
- **Rollback Command**: `git reset --hard {session-start-hash}`

## Exact Next Step
Unit complete. No further action required for this unit.
```

See `common/session-summary.md` for full session summary requirements.

---

## Backlog Exit Requirements

When marking a unit complete:

1. **Update status** to ✅ Complete in both master and domain backlogs
2. **Add completion date** (YYYY-MM-DD format)
3. **Write completion note** in domain backlog with:
   - Summary (one to two sentences)
   - Key decisions for downstream units
   - Integration points
4. **Run unblock cascade** — check all ⏳ Blocked units and update to 🔓 Unblocked if all their dependencies are now complete

See `common/backlog.md` for full backlog update requirements.

---

## State File Exit Requirements

When closing a unit, the following state files MUST be updated:

### session-summary.md (MANDATORY)

| Field | Required Value |
|-------|----------------|
| `Session Status` | Complete |
| `Current Stage` | Complete |
| `Session End Commit` | 40-character git hash from `git rev-parse HEAD` |
| `Exact Next Step` | "Unit complete. No further action required for this unit." |

### aidlc-state.md (MANDATORY)

| Field | Required Value |
|-------|----------------|
| `Active Unit` | None |
| `Active Domain` | None |
| `Current Phase` | None |
| `Current Stage` | None |
| `Stages Pending Execution` | (empty or cleared) |
| `Status` | Ready — no active units |

**Validation**: A unit closure is incomplete if either file shows stale state (e.g., "In Progress" status, pending stages listed, or missing Session End Commit).

---

## Exit Checklist

Use this checklist before closing any unit:

### All Tracks

- [ ] Task alignment verified — deliverable addresses original request
- [ ] All code changes committed
- [ ] Session End Commit captured in session summary
- [ ] Session Status set to "Complete" in session-summary.md
- [ ] Current Phase set to "Complete" in session-summary.md
- [ ] Exact Next Step set to "Unit complete. No further action required for this unit."
- [ ] aidlc-state.md reset (Active Unit: None, Current Phase: None, Stages Pending cleared)
- [ ] Backlog status updated to ✅ Complete
- [ ] Unblock cascade applied to dependent units

### Full Track Additional

- [ ] Feature documentation written
- [ ] Impact scan completed
- [ ] Cross-doc update performed
- [ ] Consistency check passed
- [ ] Recreation readiness check passed
- [ ] Knowledge base promotion offered (optional — skip/copy/merge/link)

### Lightweight Track Additional

- [ ] Brief change note written
- [ ] Directly affected docs updated
- [ ] Knowledge base promotion offered (optional — skip/copy/merge/link)

### Hotfix Track Additional

- [ ] One-paragraph entry added to relevant doc
- [ ] Missing test written (if applicable)

---

## Non-Compliance Handling

### Incomplete Exit Attempt

If a developer attempts to close a unit without meeting exit conditions:

```markdown
**Exit conditions not met for {UNIT-ID}.**

The following requirements are still incomplete:
- {List of unmet requirements}

Please complete these items before closing this unit, or choose:
A) Complete the missing items now
B) Pause the unit (save current state, resume later)

[Answer]:
```

### Forced Close (Emergency Only)

In exceptional circumstances where a unit must be abandoned:

1. Document the reason in the session summary under "Open Questions / Blockers"
2. Set Session Status to "Paused" (not "Complete")
3. Mark the unit as ⏸ Paused in the backlog
4. Leave clear instructions for whoever picks up this work

**A unit should never be marked ✅ Complete if exit conditions are not met.**

---

## Why Documentation Is Mandatory

1. **Knowledge Preservation**: Decisions and context captured while fresh
2. **Team Continuity**: Any developer can pick up where another left off
3. **Audit Trail**: Complete history of what was built and why
4. **Reduced Rework**: Clear documentation prevents misunderstandings
5. **Quality Assurance**: Exit conditions ensure consistent deliverable quality

---

## Integration with Other Systems

### Task Alignment

- Exit conditions require alignment verification
- Deliverable must address the original user request
- Any scope changes must be documented and approved
- See `common/task-alignment.md`

### Session Summary

- Exit conditions require session summary finalization
- See `common/session-summary.md`

### Backlog

- Exit conditions require backlog update
- See `common/backlog.md`

### Rollback

- Session End Commit enables rollback if needed
- See `common/rollback.md`

### Tracks

- Exit depth varies by track
- See `common/tracks.md`
