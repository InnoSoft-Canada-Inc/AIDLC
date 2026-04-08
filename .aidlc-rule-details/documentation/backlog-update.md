# Backlog Update

## Purpose

**Update backlog, obtain final approval, and close the unit of work**

Backlog Update focuses on:
- Marking the unit as complete in both backlogs
- Writing a completion note for downstream units
- Running unblock detection for dependent units
- Obtaining human approval to close the unit
- Finalizing and archiving the session summary

**Note**: This is the final stage. Human sign-off closes the unit of work.

## Prerequisites

- Consistency Check must be complete
- All documentation issues resolved
- Feature doc finalized
- All doc updates completed and logged

---

## Steps to Execute

### Step 1: Update Domain Backlog

Update the unit's entry in the domain backlog:

**Location**: `aidlc-docs/{domain}/aidlc-backlog.md`

**Changes**:
1. Set status to ✅ Complete
2. Add completion date
3. Update phase progress checkboxes
4. Write completion note

**Example Update**:

```markdown
### AUTH-001: User Authentication

- **Status**: ✅ Complete  ← Updated
- **Branch**: feature/auth-001-user-authentication
- **Completed**: 2026-03-02  ← Added
- **Track**: Full

#### Phase Progress
- [x] Inception
- [x] Construction
- [x] Operations
- [x] Testing & Validation
- [x] Documentation  ← Checked

#### Summary  ← Added
Implemented JWT-based authentication with refresh token rotation. Chose bcrypt
for password hashing (cost factor 12). Redis used for refresh token storage.

#### Notes for Downstream Units  ← Added
- Token format is `Bearer {jwt}` in Authorization header
- Refresh tokens expire after 7 days
- User sessions stored in Redis, not database
- Auth middleware available at `src/middleware/auth.ts`
```

### Step 2: Update Master Backlog

Update the unit's entry in the master backlog:

**Location**: `aidlc-docs/aidlc-backlog.md`

**Changes**:
1. Set status to ✅ Complete
2. Add completion date

**Example Update**:

```markdown
| ID | Unit of Work | Domain | Status | Depends On | Completed |
|----|--------------|--------|--------|------------|-----------|
| AUTH-001 | User Authentication | auth | ✅ Complete | — | 2026-03-02 |
```

### Step 2b: Reset aidlc-state.md

Clear the active unit tracking to reflect that no unit is currently in progress.

**Location**: `aidlc-docs/aidlc-state.md`

**MANDATORY Changes**:
1. Set `Active Unit`: None
2. Set `Active Domain`: None
3. Set `Current Phase`: None
4. Set `Current Stage`: None
5. Clear `Stages Pending Execution` list (remove all items or mark section as empty)
6. Update `Session Status`: Ready — no active units

**Example Update**:

```markdown
## Current State

- **Active Unit**: None
- **Active Domain**: None
- **Current Phase**: None
- **Current Stage**: None

## Executed Stages

(Cleared — see session-summary for {UNIT-ID} for completion details)

## Stages Pending Execution

(None — no active unit)

## Session Status

- **Status**: Ready — no active units
- **Last Updated**: {YYYY-MM-DD}
- **Last Completed Unit**: {UNIT-ID} ({domain})
```

**Rationale**: A stale aidlc-state.md showing pending stages for a completed unit creates confusion about project status and can mislead future sessions.

### Step 3: Write Completion Note

The completion note must include:

| Section | Content |
|---------|---------|
| **Summary** | One to two sentences on what was built |
| **Key Decisions** | Decisions downstream units should know |
| **Integration Points** | How other units should interact |

**Good Completion Note**:
```markdown
#### Summary
Implemented JWT-based authentication with refresh token rotation. Chose bcrypt
for password hashing (cost factor 12).

#### Notes for Downstream Units
- Token format is `Bearer {jwt}` in Authorization header
- Refresh tokens expire after 7 days
- User sessions stored in Redis, not database
```

**Bad Completion Note**:
```markdown
#### Summary
Done.
```

### Step 4: Run Unblock Detection

Check all units currently marked ⏳ Blocked and determine if any are now unblocked.

**Process**:

1. List all ⏳ Blocked units
2. For each blocked unit:
   - Check its "Depends On" field
   - Determine if ALL dependencies are now ✅ Complete
   - If yes, update status to 🔓 Unblocked
3. Update both master and domain backlogs

**Example**:

```markdown
## Unblock Detection

**Completed Unit**: AUTH-001

### Checking Blocked Units

| Unit | Depends On | All Complete? | New Status |
|------|------------|---------------|------------|
| AUTH-002 | AUTH-001 | ✅ Yes | 🔓 Unblocked |
| API-001 | AUTH-001 | ✅ Yes | 🔓 Unblocked |
| API-002 | API-001 | ❌ No (API-001 not complete) | ⏳ Blocked |

### Updates Made

- AUTH-002: ⏳ Blocked → 🔓 Unblocked
- API-001: ⏳ Blocked → 🔓 Unblocked
```

### Step 5: Verify Domain Documentation Promotion

**Note**: Domain documentation promotion and index regeneration were already completed during the Feature Documentation stage. This step verifies the promotion was successful.

**Verification Checklist**:

1. **Promoted Copy Exists**: Verify `aidlc-docs/{domain}/docs/{UNIT-ID}-{feature-title}.md` exists
2. **Source Reference Header**: Verify promoted copy has proper source reference header pointing to canonical doc
3. **Domain Index Updated**: Verify `aidlc-docs/{domain}/docs/_index.md` includes entry for this unit
4. **No Orphans**: Verify no orphaned entries in domain index (canonical sources exist for all promoted docs)

**If Promotion Failed**: This should not happen if Feature Documentation stage completed successfully. If verification fails:
- Alert the user immediately
- Return to Feature Documentation stage to re-execute Step 2 (promotion)
- Do NOT proceed to approval gate until promotion is verified

**Log in audit.md**: "Domain docs promotion verified for {UNIT-ID}"

---

### Step 6: Present Human Approval Gate

**Critical**: Developer must explicitly approve to close the unit.

**Note**: The approval gate now includes confirmation of domain docs promotion.

```markdown
**Documentation Phase Complete**

The following work has been completed for **{UNIT-ID}**:

### Feature Documentation
✅ Feature doc created at `aidlc-docs/{domain}/{unit}/documentation/feature-doc.md`
✅ Promoted to `aidlc-docs/{domain}/docs/{UNIT-ID}-{feature-title}.md`

### Domain Documentation Index
✅ Index regenerated at `aidlc-docs/{domain}/docs/_index.md`

### Documentation Updates
✅ {count} files updated per impact scan
✅ All updates logged in audit.md

### Consistency Check
✅ All terminology consistent
✅ All version references current
✅ All code examples verified

### Backlog Updates
✅ Unit marked complete in domain backlog
✅ Unit marked complete in master backlog
✅ Completion note written
✅ {count} units unblocked: {list}

---

## Human Approval Required

Please review the following and confirm:

1. **Feature Doc**: Does the feature doc accurately describe what was built?
2. **Doc Updates**: Are the documentation updates accurate and complete?
3. **Completion Note**: Does the completion note capture key decisions?

**Your sign-off closes this unit of work.**

Options:
A) Approve and close unit
B) Request changes to feature doc
C) Request changes to doc updates
D) Request changes to completion note

[Answer]:
```

### Step 6b: Offer Knowledge Base Promotion (Optional)

**Purpose**: Prevent documentation drift in brownfield projects by offering to promote feature-doc content to the user's knowledge base.

**When to offer**: Only if ALL of the following are true:
1. Knowledge base exists (anchor-map.md has a configured `Location` that is not empty)
2. Track is Full or Lightweight (NOT Hotfix — too lightweight for promotion)
3. Feature-doc has substantive content (more than one paragraph)

**Skip if**: Hotfix track, no knowledge base configured, or greenfield project with empty `docs/`.

**Prompt**:

```markdown
## Knowledge Base Promotion (Optional)

Your feature documentation is complete at:
`aidlc-docs/{domain}/{unit}/documentation/feature-doc.md`

Would you like to promote this to your knowledge base (`{knowledge_base_path}`)?

A) **Skip** — Keep feature-doc in aidlc-docs/ only (default)
B) **Copy** — Copy feature-doc to `{knowledge_base}/features/{UNIT-ID}.md`
C) **Merge** — Merge relevant sections into existing docs (guided process)
D) **Link** — Add reference link in relevant docs pointing to feature-doc

[Answer]:
```

#### Option A: Skip (Default)
- No action taken
- Feature-doc remains in `aidlc-docs/` only
- Log choice in audit.md: "Knowledge Base Promotion: Skipped"

#### Option B: Copy
1. Create `{knowledge_base}/features/` directory if it doesn't exist
2. Copy feature-doc to `{knowledge_base}/features/{UNIT-ID}-{short-description}.md`
3. Create or update `{knowledge_base}/features/README.md` with entry:
   ```markdown
   | Unit | Description | Date |
   |------|-------------|------|
   | {UNIT-ID} | {short description} | {date} |
   ```
4. Log in audit.md: "Knowledge Base Promotion: Copied to {path}"

#### Option C: Merge (Guided)
1. Analyze feature-doc sections (API Contracts, Data Model, Configuration, Architecture Decisions)
2. Scan knowledge base for matching docs by topic/component
3. Present merge plan:
   ```markdown
   ## Merge Plan

   | Feature-Doc Section | Target Doc | Action |
   |---------------------|------------|--------|
   | API Contracts | {knowledge_base}/api-reference.md | Append new endpoints |
   | Data Model | {knowledge_base}/data-models.md | Add new entities |
   | Configuration | {knowledge_base}/configuration.md | Add new env vars |
   | Architecture Decisions | {knowledge_base}/decisions/ | Create new decision record |

   Sections with no matching target will be skipped (or copied to features/).

   Proceed with merge? (Y/N)
   ```
4. If approved, execute merges with targeted updates (same rules as Cross-Doc Update)
5. Log all changes in audit.md with before/after for each file

#### Option D: Link
1. Identify the most relevant doc in knowledge base (by component/domain)
2. Add a "Related Features" or "See Also" section if it doesn't exist
3. Insert link: `- [{UNIT-ID}]: See [Feature Documentation](../aidlc-docs/{domain}/{unit}/documentation/feature-doc.md)`
4. Log in audit.md: "Knowledge Base Promotion: Linked from {path}"

**Project Default**: If `anchor-map.md` has a `## Knowledge Base Promotion Preference` section with a default set, use that instead of prompting (unless user overrides).

---

### Step 6c: Capture Self-Improvement Lessons (NEW)

**Purpose**: Detect corrections made during the session and offer to capture them as lessons.

**When to execute**: ALWAYS at session end, after human approval gate (Step 6), before finalizing session summary (Step 8).

#### 6c.1 Scan Session for Corrections

**Automatic detection**: Scan `aidlc-docs/audit.md` for this session's entries looking for correction indicators:

**Keywords that indicate a correction**:
- "correction", "corrected", "no, actually", "wrong", "incorrect", "mistake", "fix"
- "should have", "should be", "instead of", "not", "don't"
- "that's not right", "that won't work", "try again"

**Examples**:
```markdown
## User Input
**Timestamp**: 2026-03-10T14:30:00Z
**Input**: "no, don't use Redis for sessions, use PostgreSQL instead"
→ Detected: Correction about technology choice

## User Input
**Timestamp**: 2026-03-10T15:00:00Z
**Input**: "that function should be async, not sync"
→ Detected: Correction about implementation pattern
```

#### 6c.2 Analyze Corrections for Lesson Potential

For each detected correction:
1. **Determine category**: Requirements Misunderstanding / Technology Choice / Implementation Pattern / Documentation Error / Process Improvement
2. **Assess scope**: Is this specific to this unit, or broadly applicable?
3. **Check if already captured**: Search `aidlc-docs/lessons.md` for duplicate lessons

**Skip if**:
- Correction is minor typo or formatting
- Correction is user preference, not a mistake
- Lesson already exists in lessons.md

#### 6c.3 Offer Lesson Capture

**If corrections detected**, present to user:

```markdown
## Self-Improvement: Lessons Detected

I detected {count} correction(s) during this session that could be captured as lessons:

### Correction 1: {Brief Title}
- **Context**: {what was the situation}
- **What Went Wrong**: {what mistake was made}
- **Suggested Lesson**: {what to do differently next time}
- **Scope**: {This unit only / This domain / All domains}

[Additional corrections listed similarly...]

**Capture these as lessons?**

A) Yes, capture all
B) Let me select which ones
C) No, skip lesson capture

[Answer]:
```

#### 6c.4 Capture Approved Lessons

**If user approves** (Option A or B):

1. Append each lesson to `aidlc-docs/lessons.md`:
```markdown
## {Category}: {Brief Title}
- **Date**: {YYYY-MM-DD}
- **Unit**: {UNIT-ID}
- **Domain**: {domain or "all"}
- **Stage**: {phase/stage or "all"}
- **Context**: {what was the situation}
- **Correction**: {what was wrong}
- **Lesson**: {what to do differently next time}
- **Status**: Active

---
```

2. Log in audit.md: "Self-improvement: Captured {count} lessons from this session"

**If user declines** (Option C):
- Log in audit.md: "Self-improvement: User declined lesson capture for this session"

**Note**: Lessons are NOT loaded at session start of the same session they're captured in — they apply to future sessions only.

---

### Step 7: Handle Approval Response

#### If Approved (Option A)

1. Offer Knowledge Base Promotion (Step 6b) if applicable
2. Finalize session summary
3. Archive session summary
4. Close the unit
5. Commit backlog updates

#### If Changes Requested (Options B, C, D)

1. Make requested changes
2. Return to approval prompt
3. Do not close unit until approved

### Step 8: Finalize Session Summary

Update the session summary with final state.

**MANDATORY CHECKLIST** (do not skip any item):
- [ ] Update `Current Phase`: DOCUMENTATION & CONSOLIDATION
- [ ] Update `Current Stage`: Complete
- [ ] Update `Session Status`: Complete
- [ ] Update `Session End Commit`: Run `git rev-parse HEAD` and capture the hash
- [ ] Update `Exact Next Step`: "Unit complete. No further action required for this unit."
- [ ] Clear or update `Open Questions / Blockers`: "None" if all resolved

**Required Final State**:

```markdown
## Identity
- **Domain**: {domain name}
- **Unit**: {unit identifier}
- **Current Phase**: DOCUMENTATION & CONSOLIDATION
- **Current Stage**: Complete
- **Session Status**: Complete  ← MUST be "Complete"

## Git Anchors
- **Session Start Commit**: {40-character hash from session start}
- **Session End Commit**: {40-character hash from git rev-parse HEAD}  ← MUST be populated
- **Rollback Command**: `git reset --hard {session-start-hash}`

## Exact Next Step
Unit complete. No further action required for this unit.  ← MUST use this exact text

## Open Questions / Blockers
- None  ← Or list resolved items
```

**Validation**: Before proceeding to Step 9, verify ALL fields above are updated. A stale session-summary is a workflow compliance failure.

### Step 9: Archive Session Summary

Before closing, archive the session summary:

1. Copy current session-summary.md to:
   ```
   aidlc-docs/{domain}/{unit}/session-history/session-YYYY-MM-DD-HH.md
   ```
2. This preserves the complete session history

### Step 10: Commit Backlog Updates

Create the documentation commit for this unit:

```bash
git add aidlc-docs/
git commit -m "docs({domain}): complete {UNIT-ID} documentation

- Feature doc: {brief description}
- Updated {count} existing docs
- Backlog: {UNIT-ID} complete, {count} units unblocked

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Completion Checklist

Before closing any unit, verify:

### Backlog Updates
- [ ] Domain backlog status: ✅ Complete
- [ ] Domain backlog completion date added
- [ ] Domain backlog completion note written
- [ ] Master backlog status: ✅ Complete
- [ ] Master backlog completion date added
- [ ] Unblock detection completed
- [ ] Newly unblocked units updated

### Session Summary
- [ ] Session Status: Complete
- [ ] Session End Commit captured
- [ ] Exact Next Step: "Unit complete"
- [ ] Session archived to session-history/

### Human Approval
- [ ] Developer reviewed feature doc
- [ ] Developer confirmed doc updates
- [ ] Explicit sign-off received

### Commit
- [ ] All changes committed
- [ ] Commit message follows convention

---

## Integration with Workflow

### Input From
- Consistency Check results
- All prior phase artifacts
- Developer approval

### Output To
- Unit is closed
- Workflow complete for this unit
- Next unit can begin (if any)

### References
- See `common/backlog.md` for backlog rules
- See `common/session-summary.md` for session summary rules
- See `common/exit-conditions.md` for exit requirements

---

## Post-Closure

After the unit is closed:

1. **Session summary** remains in place for reference
2. **Feature doc** is the authoritative record of what was built
3. **Backlog** shows unit as complete
4. **Audit log** contains full history of the unit

The developer can now:
- Start a new unit
- End the session
- Work on a different domain

---

## Best Practices

1. **Write for future readers**: Completion notes help developers who pick up related work
2. **Be specific about decisions**: "Used Redis" is less helpful than "Used Redis for token storage because of TTL support and performance"
3. **Run unblock cascade immediately**: Don't delay updating dependent units
4. **Get explicit approval**: Never auto-close units
5. **Archive before overwriting**: Session history enables debugging and audit
