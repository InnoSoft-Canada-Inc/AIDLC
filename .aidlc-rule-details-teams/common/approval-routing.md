# Approval Routing (Agent Teams)

> This file defines the cascading approval model for Agent Teams mode.
> It is referenced by all approval gate override files in `.aidlc-rule-details-teams/`.
> See [AGENT_TEAMS_CONCEPT.md](../../AGENT_TEAMS_CONCEPT.md#cascading-approval-model) for the full design.

---

## Cascading Approval Chain

Every approval gate in the teammate's workflow follows this escalation chain. The verify-agent is always the first line of defense. It only escalates when it can't confidently approve.

```
Teammate hits approval gate
        │
        ▼
  ┌─────────────┐     APPROVED ──────────────► Teammate proceeds
  │   TIER 1    │
  │   Verify-   │     NEEDS CHANGES ─────────► Teammate fixes, retries Tier 1
  │   Agent     │
  │             │     LOW CONFIDENCE ─────────► Escalate to Tier 2
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐     APPROVED ──────────────► Teammate proceeds
  │   TIER 2    │
  │   Lead      │     NEEDS CHANGES ─────────► Teammate fixes, retries Tier 1
  │   Agent     │
  │             │     CAN'T RESOLVE ──────────► Escalate to Tier 3
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐     APPROVED / DECISION ───► Lead relays to teammate
  │   TIER 3    │
  │   Human     │     NEEDS CHANGES ─────────► Lead relays, teammate fixes
  └─────────────┘
```

---

## How to Execute Approval Routing

**MANDATORY**: Before presenting any stage completion message, follow these steps:

### Step 1: Determine the Approval Tier

Read `aidlc-docs/aidlc-state.md` under `## Unit Approval Tier Overrides`.

- If this unit has a specific tier override → use that tier as the starting tier
- If no override exists → default to **Tier 1**

### Step 2: Route Based on Starting Tier

#### If Starting at Tier 1 (Verify-Agent)

1. Invoke the verify-agent with the current stage's artifacts
2. Provide: artifact path, unit requirements path, stage name
3. Wait for verdict:
   - **APPROVED** → proceed to next stage immediately (do NOT present completion message to user)
   - **NEEDS CHANGES** (with specific issues) → address the issues, then retry from Tier 1
   - **LOW CONFIDENCE** (with escalation reason) → escalate to Tier 2

#### If Starting at or Escalated to Tier 2 (Lead Agent)

1. Message the lead with:
   - Stage name and unit ID
   - The artifact(s) requiring approval
   - If escalated from Tier 1: include the verify-agent's LOW CONFIDENCE reason
2. Wait for lead's verdict:
   - **APPROVED** → proceed to next stage immediately
   - **NEEDS CHANGES** (with guidance) → address the issues, then retry from Tier 1
   - **CAN'T RESOLVE** (with context) → escalate to Tier 3

#### If Starting at or Escalated to Tier 3 (Human)

1. The lead messages the human with:
   - Stage name, unit ID, and what needs review
   - If escalated from Tier 2: include the lead's reason for escalation
2. Present the standard **2-option completion message** (Request Changes / Continue to Next Stage)
3. Wait for human response
4. Relay decision back to the teammate through the lead

### Step 3: Log the Routing Decision

Record in `audit.md`:
```markdown
## Approval Routing
**Timestamp**: [ISO timestamp]
**Stage**: [stage name]
**Unit**: [UNIT-ID]
**Starting Tier**: [1/2/3]
**Final Tier**: [1/2/3]
**Verdict**: [APPROVED/NEEDS CHANGES]
**Context**: [brief reason if escalated]
```

---

## Tier Override Configuration

During Units Generation, the lead sets the starting tier for each unit in `aidlc-docs/aidlc-state.md`:

```markdown
## Unit Approval Tier Overrides

| Unit | Starting Tier | Rationale |
|------|--------------|-----------|
| AUTH-001 | 1 | Standard CRUD, verify-agent can validate |
| AUTH-002 | 2 | Touches shared session schema, lead review needed |
| PAY-001 | 3 | PCI-DSS compliance, human must approve |
```

### Automatic Tier Escalation Signals

The lead should set starting tier based on:

| Signal | Starting Tier | Rationale |
|--------|--------------|-----------|
| Security extension enabled + auth/crypto unit | 2 | Lead reviews security-critical design |
| Compliance extension (HIPAA/PCI-DSS/SOC2) enabled | 3 | Human must approve compliance-sensitive work |
| Unit touches shared database schema | 2 | Cross-unit impact needs lead context |
| Simple config/CRUD with clear requirements | 1 | Verify-agent can fully validate |
| Unit flagged "high-risk" in backlog | 3 | Human explicitly requested oversight |
| No override specified | 1 | Default: start with automated validation |

---

## Expected Approval Distribution

For a typical 5-unit feature with ~6 approval gates per unit (30 total gates):
- **~24 gates** (~80%) handled by verify-agent (Tier 1)
- **~4-5 gates** (~15%) handled by the lead (Tier 2)
- **~1-2 gates** (~5%) escalated to human (Tier 3)

---

## Retry Flow

After **NEEDS CHANGES** at any tier:
1. Teammate addresses the specific issues cited in the verdict
2. Teammate **always retries from Tier 1** (verify-agent re-validates the fix)
3. This ensures the fix is validated against all dimensions, not just the one that flagged it

**Exception**: If the human (Tier 3) provides an explicit directive ("proceed as-is" or "skip this check"), the teammate proceeds without re-routing through Tier 1.
