# AIDLC Agent Teams Guide

Use Claude Code Agent Teams to run multiple units of work in parallel. A lead session handles planning with you, then spawns AI teammate sessions that each own a full unit from Construction through Documentation.

> **For human multi-developer coordination**, see [AIDLC_TEAM_GUIDE.md](AIDLC_TEAM_GUIDE.md) instead.

---

## Prerequisites

- Claude Code v2.1.32+
- Agent Teams experimental flag enabled:
  ```json
  { "env": { "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1" } }
  ```
- `CLAUDE-TEAMS.md` and `.aidlc-rule-details-teams/` copied to your project (see [GETTING_STARTED.md](GETTING_STARTED.md#optional-agent-teams-experimental))

---

## How It Works

### The Two Roles

Agent Teams splits the AI-DLC workflow into two roles:

**Lead Session** — handles all planning (Inception). This is where you interact.
- Workspace Detection, Reverse Engineering, Requirements Analysis, User Stories
- Workflow Planning, Application Design, Units Generation
- After Units Generation: spawns teammates, monitors progress, handles escalations
- After all units complete: merges branches, runs cross-unit testing, reports to you

**Teammate Sessions** — handle all execution (Construction → Documentation). Each owns one unit.
- Reads Inception artifacts produced by the lead
- Runs Functional Design → Code Generation → Build & Test → Testing & Validation → Documentation
- Works in its own worktree (isolated copy of the repo, own branch)
- Follows approval routing for all approval gates
- Messages the lead on completion

### What Each Role Does NOT Do

| The Lead does NOT | Teammates do NOT |
|-------------------|------------------|
| Write application code | Run Inception |
| Run Construction for any unit | Interact with you directly |
| Hold implementation details (keeps context lean) | Spawn other teammates |
| | Merge their own branches |
| | Run cross-unit tests |

---

## Workflow

### Step 1: Start Normally

```
Using AI-DLC, [describe your feature]
```

The lead runs Inception exactly like solo mode — Requirements Analysis, User Stories, Application Design, Units Generation. You interact with it normally.

### Step 2: Choose Agent Teams After Units Generation

After the backlog is created, the lead asks:

```
Units Generation complete. The backlog contains 5 units across 2 domains.

Would you like to use Agent Teams for parallel execution?

A) Yes — Spawn teammates for unblocked units
B) No — Solo mode (work through units sequentially)
```

If you choose **A**, the lead sets up the team.

### Step 3: Teammates Spawn in Waves

Not all units start at once. The lead respects dependencies:

```
TIME ────────────────────────────────────────────────────►

LEAD:   [──── Inception ────]
                              │
                              ├─ Wave 1 (unblocked units)
                              │
TEAM 1: [AUTH-001 ═══════════════════]──► complete
TEAM 2: [API-001 ════════════════════════════]──► complete
                                          │
                              ┌───────────┘
                              │ AUTH-001 done → unblocks 3 units
                              │
                              ├─ Wave 2
                              │
TEAM 3:                       [AUTH-002 ══════════════]──► complete
TEAM 4:                       [API-002 ═══════════════════]──► complete
TEAM 5:                       [UI-001 ════════════════]──► complete
                                                           │
                                                           ▼
LEAD:                                          [Cross-Unit Build & Test]
                                               [Merge All Branches]
                                               [Final Report to You]
```

### Step 4: You Wait (Mostly)

While teammates work, the lead monitors progress. You'll only be pulled in for:
- Critical business decisions not covered in requirements
- Scope changes discovered during implementation
- Compliance-sensitive approvals (if HIPAA/PCI-DSS/SOC2 enabled)

For a typical 5-unit feature with ~30 total approval gates, you'll likely review **1-2 decisions** instead of approving all 30 manually.

### Step 5: Lead Merges and Reports

After all teammates finish:
1. Lead merges each teammate's worktree branch
2. Runs cross-unit integration tests
3. Runs cross-unit documentation checks
4. Presents a summary and asks for your final approval

---

## The Approval Model

Every approval gate uses a cascading chain instead of going directly to you.

```
Teammate hits approval gate
        │
        ▼
   ┌────────────┐
   │  TIER 1    │──► APPROVED ──────────► Teammate proceeds
   │  Verify-   │──► NEEDS CHANGES ─────► Teammate fixes, retries
   │  Agent     │──► LOW CONFIDENCE ────► Escalate to Tier 2
   └─────┬──────┘
         │
         ▼
   ┌────────────┐
   │  TIER 2    │──► APPROVED ──────────► Teammate proceeds
   │  Lead      │──► NEEDS CHANGES ─────► Teammate fixes, retries
   │  Agent     │──► CAN'T RESOLVE ─────► Escalate to Tier 3
   └─────┬──────┘
         │
         ▼
   ┌────────────┐
   │  TIER 3    │──► You make the call
   │  Human     │
   └────────────┘
```

### What Each Tier Handles

**Tier 1 — Verify-Agent (~80% of approvals)**
Automated validation against planning artifacts. Checks: goal alignment, architectural consistency, design guidelines, extension compliance, scope appropriateness.

**Tier 2 — Lead Agent (~15% of approvals)**
Contextual review with full Inception knowledge. Handles: ambiguous requirements, cross-unit coordination, design trade-offs.

**Tier 3 — Human (~5% of approvals)**
You. Business decisions, scope changes, compliance sign-off, anything the lead flags as needing human judgment.

### Per-Unit Risk Overrides

During Units Generation, the lead sets a starting tier per unit based on risk:

| Signal | Starting Tier | Why |
|--------|--------------|-----|
| Simple config/CRUD with clear requirements | 1 | Verify-agent can handle it |
| Security-sensitive unit (auth, crypto) | 2 | Lead reviews security design |
| Compliance extension enabled (HIPAA, PCI-DSS) | 3 | Human must approve |
| Unit flagged "high-risk" in backlog | 3 | You requested oversight |

---

## Known Limitations

Agent Teams is experimental. These affect how you should use it.

### No Session Resumption (HIGH impact)

If a teammate session is interrupted (terminal crash, context limit), it **cannot be resumed**. It must be respawned.

**What this means for you:**
- The lead will detect the interruption and respawn the teammate
- The respawned teammate reads the previous session-summary.md to pick up where it left off
- Any in-flight work not written to disk is lost

**How to minimize impact:**
- Keep units small. A unit that takes 20-30 minutes is safer than one that takes 2 hours.
- The AI-DLC rules require aggressive checkpointing — session-summary.md is updated at every stage completion

### Task Status Can Lag (MEDIUM impact)

Teammates sometimes fail to mark tasks as completed, which blocks dependent units from spawning.

**What this means for you:** Wave 2 units might not auto-spawn even after Wave 1 finishes.

**What to do:** Tell the lead to check on the teammate or manually mark the task complete.

### One Team Per Session (LOW impact)

The lead can only manage one team at a time.

**What this means for you:** If your feature has 10+ units, they still run as one team with wave-based spawning. You can't have separate "backend team" and "frontend team."

### Lead Is Fixed (MEDIUM impact)

The session that creates the team is the lead for its lifetime. Can't transfer leadership.

**What this means for you:** If the lead session hits its context limit on very large features (10+ units over multiple days), you may need to start a new team for remaining units.

**Mitigation:** The lead's job after Inception is mostly monitoring — it doesn't hold implementation details, so context usage stays lean.

### Split Panes Not in VS Code

Split-pane display (seeing all teammates at once) requires tmux or iTerm2. VS Code integrated terminal uses in-process mode — you cycle through teammates with Shift+Down.

---

## Tips for Best Results

### Keep Units Small

The most important tip. Small units = faster completion, less work lost on interruption, better parallelism. Prefer 5 small units over 2 large ones.

### Let the Verify-Agent Do Its Job

Don't override the approval tier to Tier 3 for everything. The verify-agent validates against the requirements and design you already approved during Inception. Trust the system you set up.

### Watch for Cross-Unit Conflicts

Teammates work in isolated worktrees, so file conflicts are caught at merge time. If two units modify the same file, the lead resolves it during the merge step. For critical shared files, consider making them a dependency (sequential, not parallel).

### Use Planning Mode First

For complex features, consider running Planning Mode first:
```
Using AI-DLC, plan [your feature]
```
This runs Inception and produces a plan without building anything. Review the unit decomposition and dependencies before committing to Agent Teams execution.

---

## Comparison: Solo vs Agent Teams

| Aspect | Solo Mode | Agent Teams |
|--------|-----------|-------------|
| **Workflow file** | `CLAUDE.md` | `CLAUDE-TEAMS.md` |
| **Units execution** | Sequential (one at a time) | Parallel (wave-based) |
| **Approval gates** | You approve every gate | Cascading: 80% automated |
| **Inception** | Same | Same (lead runs it identically) |
| **Construction** | You work through each stage | Teammates handle independently |
| **Testing** | You run tests per unit | Teammates run unit tests; lead runs cross-unit |
| **Documentation** | You complete per unit | Teammates complete per unit; lead does cross-unit |
| **Merge** | You merge when done | Lead merges all branches |
| **Best for** | Single units, hotfixes, learning the workflow | Multi-unit features, parallel development |

---

## File Structure

```
your-project/
├── CLAUDE.md                          # Solo workflow (unchanged)
├── CLAUDE-TEAMS.md                    # Agent Teams workflow
├── .aidlc-rule-details/               # Shared rules (used by both)
├── .aidlc-rule-details-teams/         # Team overrides (used only by CLAUDE-TEAMS.md)
│   ├── common/
│   │   ├── approval-routing.md        # Tier 1→2→3 cascade logic
│   │   ├── team-orchestration.md      # Lead/teammate roles
│   │   └── team-session-continuity.md # Interruption handling
│   ├── construction/                  # Approval gate addendums
│   ├── testing/                       # Approval gate addendums
│   └── documentation/                 # Approval gate addendums
└── .claude/
    └── agents/
        └── verify-agent.md            # Used for Tier 1 automated approvals
```

Solo users loading `CLAUDE.md` never see `.aidlc-rule-details-teams/`. The two workflows are completely independent.

---

## Quick Reference

| Action | How |
|--------|-----|
| Enable Agent Teams | Set `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`, use `CLAUDE-TEAMS.md` |
| Start a feature | `Using AI-DLC, [describe feature]` (same as solo) |
| Choose teams mode | Select "Yes" when asked after Units Generation |
| Check teammate progress | Ask the lead or use Shift+Down to cycle through teammates |
| Escalation to you | Lead will message you when Tier 3 approval is needed |
| Cancel a teammate | Tell the lead to shut down a specific teammate |
| Go back to solo | Use `CLAUDE.md` instead of `CLAUDE-TEAMS.md` |
