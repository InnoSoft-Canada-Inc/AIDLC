---
name: aidlc-status
description: Show current AI-DLC workflow state including active unit, phase, stage, and pending tasks. Use when starting work, checking progress, or asking "what am I working on" or "what's my current status".
---

# AI-DLC Status Checker

Provides a quick overview of your current position in the AI-DLC workflow.

## What This Does

1. Reads `aidlc-docs/aidlc-state.md` for current unit and phase information
2. Reads the relevant domain backlog for unit status and dependencies
3. Reads session-summary.md for the exact next step
4. Presents a concise, actionable status overview

## Instructions

When invoked:

1. **Check if AI-DLC is initialized**:
   - Look for `aidlc-docs/aidlc-state.md`
   - If not found, inform user: "AI-DLC not initialized. Run: Using AI-DLC, initialize project"

2. **Read current state**:
   - Parse `aidlc-docs/aidlc-state.md` to extract:
     - Current Unit ID
     - Current Domain
     - Current Phase
     - Current Stage
     - Overall workflow status

3. **Read domain backlog**:
   - Find domain backlog at `aidlc-docs/{domain}/aidlc-backlog.md`
   - Extract current unit's status, description, dependencies

4. **Read session summary**:
   - Find session summary at `aidlc-docs/{domain}/{unit-id}/session-summary.md`
   - Extract "Exact Next Step" field

5. **Check for blocked units**:
   - Scan domain backlog for any units with "Blocked" status
   - Identify blocking dependencies

## Output Format

Present information in this clear, scannable format:

```
## AI-DLC Status

**Active Unit**: {UNIT-ID} - {title/description}
**Domain**: {domain-name}
**Phase**: {current phase} (e.g., Inception, Construction, Testing & Validation, Documentation)
**Stage**: {current stage within phase}
**Status**: {in_progress/paused/pending}

**Next Step**: {exact next step from session-summary.md}

**Workflow Progress**:
- ✓ Inception (completed)
- → Construction (in progress)
- ○ Testing & Validation (pending)
- ○ Documentation (pending)

{If blocked units exist:}
**Blocked Units**:
- {UNIT-ID}: Blocked by {dependency}
```

## Edge Cases

- If no active unit: "No active unit. Start new work with: Using AI-DLC, [describe task]"
- If session-summary.md missing: Note that exact next step is unavailable
- If aidlc-state.md is incomplete: Show only available information

## Examples

**User asks**: "What am I working on?"
**User asks**: "What's my current status?"
**User asks**: "Where did I leave off?"
**User asks**: "Check my AI-DLC status"

All trigger this skill to show the current workflow state.
