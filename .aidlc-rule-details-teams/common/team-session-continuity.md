# Team Session Continuity (Agent Teams)

> This file defines how teammate sessions handle interruptions, resumption, and checkpointing.
> Critical context: Agent Teams has **no session resumption** for teammates. See
> [AGENT_TEAMS_CONCEPT.md](../../AGENT_TEAMS_CONCEPT.md#no-session-resumption-for-teammates).

---

## The Core Problem

When a teammate session is interrupted (context limit, terminal crash, laptop sleep), it **cannot be resumed**. The lead may try to message a teammate that no longer exists. The teammate must be respawned from scratch.

This makes aggressive checkpointing **mandatory** — every piece of progress must be written to disk so a respawned teammate can pick up where the previous one left off.

---

## MANDATORY: Checkpoint Requirements

### When to Checkpoint

Update `session-summary.md` at **every** natural breakpoint:

- After completing any stage (Functional Design, Code Generation, etc.)
- After completing a significant file batch within Code Generation
- After any approval gate verdict (approved or needs changes)
- Before any operation that might consume significant context

### What to Checkpoint

The `session-summary.md` must always contain:

```markdown
## Session Identity
- **Domain**: {domain}
- **Unit**: {UNIT-ID}
- **Mode**: teammate
- **Approval Tier**: {1|2|3}

## Current Position
- **Phase**: {Construction|Testing|Documentation}
- **Stage**: {exact stage name}
- **Substep**: {if mid-stage, which step}

## Files Touched This Session
### Created
- {file path} — {purpose}
### Modified
- {file path} — {what changed}

## Decisions Made
- {decision 1} — {rationale}
- {decision 2} — {rationale}

## Approval History
- Functional Design: APPROVED (Tier 1, verify-agent)
- Code Generation Plan: APPROVED (Tier 2, lead reviewed)

## Exact Next Step
{Precise instruction for a fresh session to resume without re-planning.
Example: "Begin Code Generation Part 2. The plan is approved at
construction/plans/code-gen-plan.md. Start with file 3 of 7:
src/auth/session-manager.ts"}

## Open Questions / Blockers
- {any unresolved items}
```

**Critical**: The "Exact Next Step" field must be precise enough that a **brand new session** can resume without reading any other context. It should specify the file, the stage, the substep, and what was already done.

---

## Lead Recovery Protocol

When the lead detects that a teammate is no longer responding (via `TeammateIdle` hook or manual check):

### Step 1: Assess the Situation

Read the teammate's `session-summary.md` at:
```
aidlc-docs/{domain}/{UNIT-ID}-{title}/session-summary.md
```

Determine:
- **How far did the teammate get?** (which phase/stage)
- **Is the work salvageable?** (were files created/modified?)
- **What's the exact next step?**

### Step 2: Decide Action

| Situation | Action |
|-----------|--------|
| Teammate completed all phases | Mark unit complete, no respawn needed |
| Teammate was mid-stage, files partially written | Respawn with resume prompt |
| Teammate just started, minimal progress | Respawn with original spawn prompt |
| Teammate hit a blocker it couldn't resolve | Review blocker, then respawn with guidance |

### Step 3: Respawn (if needed)

Spawn a new teammate with a **resume prompt** instead of the original spawn prompt:

```markdown
You are **resuming** work on unit **{UNIT-ID}** ({unit title}) in the **{domain}** domain.

A previous session was interrupted. Here is the state:

**Phase**: {phase from session-summary}
**Stage**: {stage from session-summary}
**Exact Next Step**: {exact next step from session-summary}

**Prior work exists.** Read these before continuing:
- `session-summary.md` — full session state
- `aidlc-docs/{domain}/{UNIT-ID}-{title}/construction/` — completed artifacts
- `aidlc-docs/{domain}/{UNIT-ID}-{title}/testing/` — if testing started

**Approval history**: {list from session-summary}

**Resume at**: {exact stage and substep}. Do NOT redo completed stages.
```

### Step 4: Update State

- Update the shared task list: reassign the task to the new teammate
- Log the interruption and respawn in `audit.md`
- If the old teammate's worktree still exists, the new teammate uses the same branch

---

## Teammate Startup Detection

When a teammate session starts, it must determine if this is a **fresh start** or a **resumption**:

### Detection Logic

```
1. Read aidlc-state.md → check Mode field
2. If Mode = "teammate":
   a. Read session-summary.md for this unit
   b. If session-summary.md exists AND has "Exact Next Step":
      → This is a RESUMPTION. Follow the resume instructions.
   c. If session-summary.md does not exist OR is empty:
      → This is a FRESH START. Follow the spawn prompt.
3. If Mode is not set:
   → This is NOT team mode. Follow standard AI-DLC workflow.
```

### Fresh Start Behavior

1. Read spawn prompt (provided by lead at teammate creation)
2. Read Inception artifacts from `aidlc-docs/{domain}/{unit}/inception/`
3. Set up `session-summary.md` with initial state
4. Begin at Construction phase, Functional Design stage

### Resumption Behavior

1. Read `session-summary.md` thoroughly
2. Read all artifacts listed in "Files Touched This Session"
3. Read approval history to know which stages are already approved
4. Resume at the "Exact Next Step" — do NOT redo completed work
5. Update `session-summary.md` to reflect resumed session

---

## Mitigating the No-Resumption Limitation

### Keep Units Small

The single most effective mitigation. A unit that takes 20-30 minutes of agent work has:
- Lower chance of interruption
- Less work lost if interrupted
- Faster respawn and recovery

Prefer **5 small units** over **2 large units**, even if it means more teammates.

### Checkpoint After Every Approval

Approval gates are natural checkpoints. After every APPROVED verdict:
1. Update `session-summary.md` immediately
2. Archive the approval in the session's approval history
3. Commit any generated artifacts to the worktree branch

This ensures that if the teammate is interrupted between stages, the respawned teammate starts at the next stage — not the beginning.

### Write Files Incrementally

During Code Generation, write files to disk as they're completed — don't hold everything in context and write at the end. This means:
- If interrupted at file 5 of 7, files 1-4 are already on disk
- The respawned teammate reads the existing files and continues from file 5

### Session Summary as Insurance

Think of `session-summary.md` as a save file in a video game. The more frequently you save, the less progress you lose on a crash. The cost of checkpointing is minimal (one file write). The cost of NOT checkpointing is redoing potentially significant work.
