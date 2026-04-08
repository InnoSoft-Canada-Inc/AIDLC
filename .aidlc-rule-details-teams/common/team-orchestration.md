# Team Orchestration (Agent Teams)

> This file defines lead and teammate roles, spawning behavior, and coordination patterns.
> See [AGENT_TEAMS_CONCEPT.md](../../AGENT_TEAMS_CONCEPT.md) for the full design and diagrams.

---

## Role Definitions

### Lead Session

The lead is the session that creates the Agent Team. It is the **only** session that interacts with the human.

**Responsibilities:**
- Run the entire **Inception phase** (Workspace Detection through Units Generation)
- Determine unit dependencies and approval tier overrides
- Spawn teammates for unblocked units with worktree isolation
- Monitor teammate progress via task list and messages
- Handle Tier 2 approval routing (review artifacts escalated from verify-agent)
- Escalate to human (Tier 3) when the lead can't resolve
- Spawn Wave 2+ teammates when dependencies resolve
- Merge teammate worktree branches after completion
- Run cross-unit Build & Test from `aidlc-docs/_shared/build-and-test/`
- Run cross-unit integration verification and documentation
- Report final results to the human

**The lead does NOT:**
- Run Construction, Testing, or Documentation for any unit
- Write application code
- Hold implementation details from teammates (keeps context lean)

### Teammate Session

A teammate is spawned by the lead to own one unit of work end-to-end.

**Responsibilities:**
- Read Inception artifacts from `aidlc-docs/{domain}/{unit}/inception/`
- Run **Construction** (Functional Design → Code Generation → Build & Test)
- Run **Testing & Validation** (Integration Tests → Coverage Report)
- Run **Documentation** (Feature Doc → Recreation Readiness Check)
- Follow approval routing per `common/approval-routing.md`
- Checkpoint aggressively (update session-summary.md at every stage completion)
- Message the lead on completion
- Mark task as complete in shared task list

**A teammate does NOT:**
- Run Inception (already completed by lead)
- Spawn other teammates (no nested teams)
- Interact with the human directly (escalates through lead)
- Merge its own branch (lead handles merge)
- Run cross-unit tests (lead handles after all units complete)

---

## Spawn Prompt Template

When the lead spawns a teammate, it provides this context:

```markdown
**FIRST**: Read `CLAUDE-TEAMS.md` in the project root. This is your workflow file.
It will instruct you to load `CLAUDE.md` as the base workflow, then apply team
overrides from `.aidlc-rule-details-teams/`.

You are a **teammate** working on unit **{UNIT-ID}** ({unit title}) in the **{domain}** domain.

**Inception is complete.** All planning artifacts are available at:
`aidlc-docs/{domain}/{UNIT-ID}-{title}/inception/`

Read the following before starting Construction:
- `inception/requirements.md` — unit requirements
- `inception/plans/execution-plan.md` — execution plan (if exists)

**Start at Construction phase, Functional Design stage.**

Your approval tier is **Tier {N}**. Follow approval routing from
`.aidlc-rule-details-teams/common/approval-routing.md` at every approval gate.

When you complete Documentation phase, message the lead:
"Unit {UNIT-ID} complete. Branch ready for merge."
```

### Spawn Configuration

Each teammate is spawned with:
- `isolation: worktree` — gets its own copy of the repository
- Own feature branch: `feature/{UNIT-ID}`
- Spawn prompt explicitly instructs teammate to read `CLAUDE-TEAMS.md` first
- Approval tier set in `aidlc-state.md` for this unit

**CRITICAL**: Teammates auto-load `CLAUDE.md` from their worktree (standard Claude Code behavior). The spawn prompt must instruct them to also read `CLAUDE-TEAMS.md` so they get the team overrides (approval routing, checkpointing requirements, teammate completion behavior). Without this, teammates would follow solo-mode approval gates instead of the cascading tier model.

---

## Dependency Wave Spawning

Not all units can start simultaneously. The lead manages waves based on the dependency graph.

### Wave Logic

```
1. Read aidlc-docs/aidlc-backlog.md for all units and dependencies
2. Identify Wave 1: units with no dependencies (status: 🔓 Unblocked)
3. Spawn teammates for all Wave 1 units
4. Monitor for completions:
   - When a unit completes → update backlog status to ✅ Complete
   - Check: did this completion unblock any ⏳ Blocked units?
   - If yes → those units become 🔓 Unblocked → spawn teammates for them (Wave 2)
5. Repeat until all units are complete or spawned
```

### Wave Spawning Rules

- **Spawn immediately**: Any unit whose dependencies are all ✅ Complete
- **Do not spawn**: Any unit with at least one ⏳ Blocked dependency
- **Maximum concurrent teammates**: Use judgment based on feature size. 3-5 is typical. More teammates = more token cost but faster completion.
- **Task list alignment**: Each spawned unit should have a corresponding task in the Agent Teams shared task list

---

## Inter-Agent Messaging Patterns

### Teammate → Lead Messages

| Event | Message Format |
|-------|---------------|
| Stage completion (Tier 2 approval) | "AUTH-001: Functional Design complete. Artifacts at `{path}`. Verify-agent returned LOW CONFIDENCE because: {reason}. Please review." |
| Unit completion | "AUTH-001 complete. All phases done. Branch `feature/AUTH-001` ready for merge." |
| Blocker encountered | "AUTH-001 blocked: {description}. Need guidance on: {specific question}." |
| Scope question | "AUTH-001: Discovered {finding} during Code Generation. This wasn't in requirements. Should I: (A) implement it, (B) skip it, (C) add to backlog as separate unit?" |

### Lead → Teammate Messages

| Event | Message Format |
|-------|---------------|
| Tier 2 approval | "AUTH-001 Functional Design APPROVED. Proceed to next stage." |
| Tier 2 changes needed | "AUTH-001 Functional Design NEEDS CHANGES: {specific issues}. Fix and retry from Tier 1." |
| Tier 3 escalation result | "AUTH-001: Human decided {decision}. Proceed with: {guidance}." |
| Cross-unit coordination | "AUTH-001: API-001 has completed and exposed endpoint X. Update your integration accordingly." |

### Lead → Human Messages (Tier 3 Escalation)

| Event | Message Format |
|-------|---------------|
| Approval escalation | "Unit AUTH-001 needs your review at {stage}. Lead couldn't resolve because: {reason}. Artifacts at: {path}." |
| Scope decision | "Unit AUTH-001 teammate found {issue}. Options: (A) {option}, (B) {option}. What would you like?" |
| All units complete | "All {N} units complete. Cross-unit integration results: {summary}. Ready for final approval?" |

---

## Lead Post-Completion Protocol

After ALL teammates have completed their units:

### 1. Merge

- For each completed teammate's worktree branch:
  - Merge `feature/{UNIT-ID}` into the develop branch
  - Resolve any conflicts (flag to human if non-trivial)
  - Verify merged code compiles/builds

### 2. Cross-Unit Build & Test

- Run integration tests from `aidlc-docs/_shared/build-and-test/`
- Verify cross-unit API contracts (do endpoints match what consumers expect?)
- Run regression suite on the fully merged codebase
- Generate combined coverage report

### 3. Cross-Unit Documentation

- Impact scan across all unit feature documentation
- Consistency check (terminology, version references, code examples)
- Update master backlog (mark all units ✅ Complete)
- Write final session summary

### 4. Report to Human

Present:
- Summary of what was built (unit-by-unit)
- Any issues found during cross-unit integration
- Combined test results
- Final approval request

---

## State Management in Team Mode

### aidlc-state.md Additions

```markdown
## Team Mode Configuration
- Mode: lead | teammate
- Team Name: {team-name}

## Lead Session Info (if Mode = lead)
- Spawned Units: [AUTH-001, API-001, ...]
- Active Teammates: [AUTH-001, API-001]
- Completed Units: [...]
- Pending Units (blocked): [AUTH-002, UI-001]

## Teammate Session Info (if Mode = teammate)
- Assigned Unit: {UNIT-ID}
- Approval Tier: {1|2|3}
- Lead Agent ID: {agent-id for messaging}

## Unit Approval Tier Overrides
| Unit | Starting Tier | Rationale |
|------|--------------|-----------|
```

### Backlog Additions (Optional Fields)

The master backlog can include these optional columns for team mode:

```markdown
| ID | Unit | Domain | Status | Assignee(s) | Depends On | Approval Tier | Completed |
```

The `Approval Tier` column is set during Units Generation and read by teammates during approval routing.
