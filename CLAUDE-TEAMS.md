# PRIORITY: This is the AGENT TEAMS version of the AI-DLC workflow
# Load CLAUDE.md as the base workflow, then apply the overrides below

## Base Workflow

**MANDATORY**: Load and follow ALL rules from `CLAUDE.md` first. This file (`CLAUDE-TEAMS.md`) adds team-specific behavior on top of the base workflow. Everything in `CLAUDE.md` applies unless explicitly overridden below.

## MANDATORY: Team Rule Details Loading

**In addition to** the rule details loading defined in `CLAUDE.md`:

1. **After resolving the rule details directory** (`.aidlc-rule-details/`), also check `.aidlc-rule-details-teams/` for team-specific overrides.

2. **Override precedence**: When loading any rule detail file, check `.aidlc-rule-details-teams/` first. If a file exists there, load it **as an addendum** to the base file in `.aidlc-rule-details/`. The addendum does NOT replace the base — it adds or modifies specific behaviors (typically approval gate routing).

3. **Team-specific common rules** (load on-demand):
   - Load `common/approval-routing.md` from `.aidlc-rule-details-teams/` — at every approval gate
   - Load `common/team-orchestration.md` from `.aidlc-rule-details-teams/` — at workflow start and when spawning teammates
   - Load `common/team-session-continuity.md` from `.aidlc-rule-details-teams/` — when resuming or when a teammate is interrupted

---

## MANDATORY: Agent Teams Experimental Flag

Agent Teams requires:
- Claude Code v2.1.32+
- `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` environment variable or settings.json entry

If Agent Teams is not enabled, this workflow file should NOT be used. Use `CLAUDE.md` instead.

---

# AGENT TEAMS WORKFLOW

## Session Role Detection (FIRST STEP — before Track Selection)

**Before** Track Selection from `CLAUDE.md`, determine your session role:

### Step 1: Check aidlc-state.md for Team Mode

Read `aidlc-docs/aidlc-state.md` and check for `## Team Mode Configuration`.

- **If `Mode: lead`** → You are the lead session. Proceed to Track Selection and Inception.
- **If `Mode: teammate`** → You are a teammate session. Skip Inception entirely. Read your spawn prompt and unit assignment, then jump to Construction phase.
- **If Mode field does not exist** → This is a new session. Proceed to Track Selection. After Units Generation (if multi-unit), you will decide whether to use Agent Teams.

### Step 2: If Lead — Continue Normal Inception

The lead runs the entire Inception phase exactly as defined in `CLAUDE.md`. No changes to any Inception stage.

### Step 3: If Teammate — Initialize from Spawn Prompt

1. Read the spawn prompt provided by the lead (contains unit ID, domain, artifact paths)
2. Read Inception artifacts from `aidlc-docs/{domain}/{unit}/inception/`
3. Read `aidlc-state.md` for your unit's approval tier
4. Set up `session-summary.md` with initial teammate state
5. **Begin at Construction phase, Functional Design stage** (or whatever the spawn prompt specifies)
6. Follow `common/team-session-continuity.md` for checkpointing requirements

---

## Agent Team Activation (After Units Generation)

**This section applies to the lead session only.**

After the lead completes Units Generation and the backlog is created:

### Step 1: Present Team Mode Option

```markdown
**Units Generation complete.** The backlog contains {N} units across {M} domains.

Would you like to use **Agent Teams** for parallel execution?

**A) Yes — Spawn teammates** for unblocked units (each gets its own worktree and runs Construction → Documentation independently)

**B) No — Solo mode** (work through units sequentially as usual)

[Answer]:
```

### Step 2: If Agent Teams Selected

1. **Set aidlc-state.md**:
   ```markdown
   ## Team Mode Configuration
   - Mode: lead
   - Team Name: {feature-name}-team
   ```

2. **Set approval tier overrides** for each unit:
   - Review each unit's domain, complexity, and enabled extensions
   - Apply tier signals from `common/approval-routing.md` (Tier Override Configuration section)
   - Add to aidlc-state.md:
   ```markdown
   ## Unit Approval Tier Overrides
   | Unit | Starting Tier | Rationale |
   |------|--------------|-----------|
   ```

3. **Identify Wave 1 units** (status: 🔓 Unblocked in backlog)

4. **Create the Agent Team** — tell Claude Code to create an agent team with teammates for each Wave 1 unit

5. **Spawn teammates** using the spawn prompt template from `common/team-orchestration.md`:
   - Each teammate gets `isolation: worktree`
   - Each teammate gets a feature branch: `feature/{UNIT-ID}`
   - Each teammate receives the spawn prompt with unit context
   - **CRITICAL**: The spawn prompt MUST instruct each teammate to read `CLAUDE-TEAMS.md` first. Teammates auto-load `CLAUDE.md` (solo workflow) by default. Without the explicit instruction to read `CLAUDE-TEAMS.md`, they will follow solo-mode approval gates instead of the cascading tier model.

6. **Enter monitoring mode** (see Lead Monitoring below)

### Step 3: If Solo Mode Selected

Continue with the standard per-unit loop from `CLAUDE.md`. No team-specific behavior activates.

---

## Lead Monitoring (After Teammates Spawned)

The lead's primary job after spawning teammates is **coordination, not implementation**.

### Ongoing Responsibilities

1. **Watch for teammate messages**:
   - Tier 2 approval requests → review and respond (see `common/approval-routing.md`)
   - Completion notifications → update backlog, check for newly unblocked units
   - Blocker reports → provide guidance or escalate to human (Tier 3)
   - Scope questions → decide or escalate to human

2. **Dependency wave management**:
   - When a unit completes → check if any ⏳ Blocked units are now unblocked
   - If unblocked → spawn new teammates for those units (Wave 2, 3, etc.)
   - Follow wave spawning logic from `common/team-orchestration.md`

3. **Keep context lean**:
   - Do NOT read full implementation artifacts from teammates
   - Only read session summaries and approval request artifacts
   - Let the verify-agent handle detailed validation (Tier 1)

4. **Handle interruptions**:
   - If a teammate stops responding → follow recovery protocol from `common/team-session-continuity.md`
   - Read the teammate's `session-summary.md` to assess progress
   - Respawn with a resume prompt if needed

---

## Override: Interruption Handling (Replaces CLAUDE.md Interruption Handling)

**If the session is a LEAD:**

Same 4 options as `CLAUDE.md` (Close, Pause, Continue, New Session), but add:
- Before closing: ensure all teammates have completed or been shut down
- Before pausing: write team state to session-summary.md including which teammates are active

**If the session is a TEAMMATE:**

A teammate cannot close or start new units. Present these options:

```markdown
You are working on unit **{UNIT-ID}** in teammate mode.

**A) Continue working** on this unit (ignore the interruption)

**B) Pause this unit** — save session-summary.md with exact next step, notify the lead

**C) Message the lead** about the new request while continuing current work
```

A teammate CANNOT:
- Close its own unit (only the lead can merge and close)
- Start a new unit (only the lead spawns teammates)
- Interact with the human directly (escalates through lead)

---

## Override: Per-Unit Loop Approval Gates

**For ALL approval gates in Construction, Testing, and Documentation phases:**

When `CLAUDE-TEAMS.md` is loaded, every approval gate uses the cascading approval model instead of direct user approval.

**Before** each "Wait for Explicit Approval" step:
1. Load the team override addendum from `.aidlc-rule-details-teams/` for the current stage
2. Follow the approval routing from `common/approval-routing.md`
3. Only present the standard 2-option menu if the approval escalates to Tier 3 (human)

This applies to approval gates in:
- Functional Design (Step 9)
- NFR Requirements
- NFR Design
- Infrastructure Design
- Code Generation (Step 7 — plan approval, Step 15 — code approval)
- Build and Test
- Integration Tests
- Regression Run
- Coverage Report
- Feature Documentation

**All other stage logic remains exactly as defined in the base `.aidlc-rule-details/` files.**

---

## Lead Post-Completion Duties (After ALL Teammates Complete)

**This section applies to the lead session only.**

Once every unit's task is marked complete in the shared task list:

### 1. Merge All Branches

For each completed teammate's worktree:
- Merge `feature/{UNIT-ID}` into the develop branch
- Resolve any merge conflicts (escalate to human if non-trivial)
- Verify the merged codebase compiles/builds

### 2. Cross-Unit Build & Test

- Follow `construction/build-and-test.md` using the `_shared/` path:
  `aidlc-docs/_shared/build-and-test/`
- Run integration tests across ALL units
- Verify cross-unit API contracts match
- Run regression suite on the fully merged codebase
- Generate combined coverage report

### 3. Cross-Unit Documentation

- Run Impact Scan across all unit feature documentation
- Run Consistency Check (terminology, version references, code examples)
- Update master backlog (mark all units ✅ Complete)
- Write final session summary

### 4. Report to Human

Present:
- Summary of what was built (unit-by-unit with links to feature docs)
- Cross-unit integration test results
- Any issues found during merge or integration
- **Final approval request** — human reviews and closes the workflow

---

## State Management Additions

### aidlc-state.md — Team Mode Fields

These fields are added to `aidlc-state.md` when Agent Teams is active:

```markdown
## Team Mode Configuration
- Mode: lead | teammate
- Team Name: {team-name}

## Lead Session Info (if Mode = lead)
- Spawned Units: [AUTH-001, API-001]
- Active Teammates: [AUTH-001, API-001]
- Completed Units: []
- Pending Units (blocked): [AUTH-002, UI-001]

## Teammate Session Info (if Mode = teammate)
- Assigned Unit: {UNIT-ID}
- Approval Tier: {1|2|3}

## Unit Approval Tier Overrides
| Unit | Starting Tier | Rationale |
|------|--------------|-----------|
```

### Backlog — Optional Team Fields

The master backlog can include an optional `Approval Tier` column:

```markdown
| ID | Unit | Domain | Status | Assignee(s) | Depends On | Approval Tier | Completed |
```

---

## Key Principles for Agent Teams

1. **Base rules always apply.** Everything in `CLAUDE.md` and `.aidlc-rule-details/` is the foundation. Team overrides only modify approval routing and add coordination behavior.

2. **Teammates own units, not phases.** Each teammate runs Construction → Documentation for ONE unit. They do not split work by phase.

3. **The lead never implements.** The lead plans (Inception), coordinates (monitoring), and integrates (merge + cross-unit testing). It does not write application code.

4. **Checkpoint aggressively.** Agent Teams has no session resumption. Every stage completion must be written to `session-summary.md` immediately. See `common/team-session-continuity.md`.

5. **Approval cascades, not gates.** Approvals flow Verify-Agent → Lead → Human. Most approvals (~80%) never reach the human. See `common/approval-routing.md`.

6. **Dependencies create waves.** Not all teammates spawn at once. The lead monitors completions and spawns blocked units as their dependencies resolve. See `common/team-orchestration.md`.

7. **Documentation is still the exit condition.** Every teammate must complete Documentation phase before marking its unit complete. The lead runs cross-unit documentation after all teammates finish.
