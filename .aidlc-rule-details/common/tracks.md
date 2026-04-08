# Workflow Tracks

**Purpose**: Define the three workflow tracks (Full, Lightweight, Hotfix) and selection criteria. Not every unit of work warrants five phases — track selection adapts the workflow depth to the scope of the change.

---

## Track Overview

| Track | When to Use | Phases Included |
|-------|-------------|-----------------|
| **Full** | Features, new domains, new integrations, significant changes | All five phases |
| **Lightweight** | Small improvements, minor refactors, config changes | Condensed workflow |
| **Hotfix** | Bug fixes, typos, urgent production issues | Minimal workflow |

---

## Full Track

**Triggers**: new feature, new domain, new API, new integration, significant change

**Description**: The complete five-phase workflow for substantial work.

### Phases

1. **Inception** — Full requirements analysis, user stories (if applicable), workflow planning
2. **Construction** — Functional design, NFR requirements/design, infrastructure design, code generation, build and test
3. **Operations** — Deployment and monitoring (placeholder for future expansion)
4. **Testing & Validation** — Integration tests, regression tests, contract validation, coverage report
5. **Documentation & Consolidation** — Full feature doc, impact scan, cross-doc update, consistency check, backlog update

### Documentation Depth

- Full feature documentation (12 sections)
- Impact scan across all affected areas
- Consistency check with existing documentation
- Recreation readiness check
- **Knowledge base promotion offered** (optional — skip/copy/merge/link to `docs/`)

---

## Lightweight Track

**Triggers**: improvement, refactor, update, small change, config, dependency update, non-urgent improvement

**Description**: A condensed workflow for changes that don't require full ceremony.

### Phases Included

1. **Condensed Inception** — Scope confirmation only, no full requirements analysis
2. **Construction** — Code generation, quick verification
3. **Quick Regression Check** — Run tests directly related to the change
4. **Documentation Exit** — Brief change note, targeted update

### Phases Skipped

- Full Inception ceremony (requirements analysis, user stories, workflow planning)
- Operations phase
- Full Testing & Validation phase

### Documentation Depth

- Brief change note
- Targeted update to directly affected docs only
- **Knowledge base promotion offered** (optional — skip/copy/merge/link to `docs/`)

---

## Hotfix Track

**Triggers**: bug, fix, broken, error, typo, urgent, hotfix, production issue, isolated one-liner

**Description**: Minimal workflow for urgent fixes that need to ship quickly.

### Core Principles

#### Autonomous Diagnosis

**The AI diagnoses autonomously. Do not ask for hand-holding.**

1. **Use available evidence**: Logs, stack traces, error messages, failing tests
2. **Present findings ONCE**: Show the diagnosis clearly, then fix without further user input
3. **If CI tests fail after fix**: Resolve them without being told how
4. **Zero context switching**: The user points at the problem; the AI fixes it completely

#### Root Cause Analysis

**Every fix addresses the root cause, not the symptom.**

1. **Identify root cause before implementing fix** — don't just make the error go away
2. **No temporary fixes** — address the underlying issue, not a workaround
3. **Senior developer quality bar** — ask "Would a staff engineer approve this approach?"

If the root cause is unclear:
- State what you investigated
- Present your best hypothesis
- Explain why you believe this is the root cause
- Then proceed with the fix

### Workflow

1. **Diagnose** — Identify the root cause using logs, traces, and failing tests
2. **Fix** — Implement the correction (address root cause, not symptom)
3. **Verify** — Run tests directly related to the fix; fix any newly failing tests
4. **Documentation Exit** — One-paragraph entry, session summary update, backlog update

### Phases Skipped

- Inception (entire phase)
- Operations phase
- Testing & Validation phase (replaced by targeted verification)

### Missing Test Rule

**If no test existed that would have caught this bug, write that one missing test as part of the fix.**

This ensures the same bug cannot recur without being caught by the test suite.

### Quality Gate

Before presenting the fix as complete, verify:

- [ ] Root cause was identified (not just symptom addressed)
- [ ] Fix is permanent (not a temporary workaround)
- [ ] Related tests pass (existing tests + new test if applicable)
- [ ] No new issues introduced by the fix

If any verification fails, iterate on the fix before presenting completion.

### Documentation Depth

- One-paragraph entry in the aidlc-docs feature-doc.md artifact
- **Lightweight impact check** on knowledge base (see below)
- Session summary updated (with Session Status: Complete)
- Backlog updated (unit marked ✅ Complete in both master and domain backlogs)
- aidlc-state.md reset (Active Unit: None)

### Lightweight Impact Check (Hotfix-Specific)

**Purpose**: Prevent knowledge base documentation drift without slowing down hotfixes.

**When to run**: If the fix touches a component that likely has documented behavior:
- Middleware, auth flows, access control
- API endpoints or contracts
- Configuration or environment handling
- Security-related code
- Core business logic with documented rules

**Process** (should take <1 minute):
1. Scan knowledge base path (from anchor-map.md) for files mentioning the affected component
2. List any potentially affected files in the feature-doc.md under "Knowledge Base Impact"
3. **Do NOT require full cross-doc update** — just flag for user awareness

**Format in feature-doc.md**:
```markdown
## Knowledge Base Impact

**Affected component**: {component name}
**Potentially affected docs**:
- `docs/security.md` — mentions access control middleware (line ~45)
- `docs/api-reference.md` — documents endpoint permissions

**Action required**: Review listed docs for accuracy after this fix. Updates can be made in a separate Lightweight Track unit if needed.
```

**If no knowledge base docs are affected**: Note "No knowledge base impact detected" in feature-doc.md.

**Trade-off rationale**: This adds ~30 seconds to hotfix completion but prevents documentation drift. The user is informed of potentially stale docs without blocking the hotfix flow.

### Artifact Structure

Hotfix track creates a **minimal artifact footprint**:

```
aidlc-docs/{domain}/{unit}/
├── session-summary.md          # Required — tracks the fix (must be finalized with Status: Complete)
├── testing/
│   └── test-report.md          # Single verification report (not subdirectories)
└── documentation/
    └── feature-doc.md          # One-paragraph addition to existing doc
```

**State files that MUST be updated (same as all tracks):**
- `aidlc-docs/aidlc-backlog.md` — Mark unit ✅ Complete with completion date
- `aidlc-docs/{domain}/aidlc-backlog.md` — Mark unit ✅ Complete with completion date
- `aidlc-docs/aidlc-state.md` — Reset Active Unit to None

**What Hotfix does NOT create:**
- `construction/` folder — no design artifacts (fix is direct)
- `testing/integration-tests/`, `testing/regression/`, `testing/coverage-report/` subdirectories — replaced by single `test-report.md`
- `session-history/` — only created if multiple sessions occur on the same unit

---

## Track Selection Criteria

### Automatic Selection

The workflow reads the activation prompt and selects based on these signals:

| Signal Words | Selected Track |
|--------------|----------------|
| new feature, new domain, new API, new integration | **Full Track** |
| improvement, refactor, update, small change, config | **Lightweight Track** |
| bug, fix, broken, error, typo, urgent, hotfix | **Hotfix Track** |

### Ambiguous Prompts

If the activation prompt is ambiguous (no clear signal words, mixed signals, or unclear scope):

**Ask exactly one clarifying question before selecting a track.**

Example clarifying question:

```markdown
I want to make sure I choose the right workflow depth for this work.

Is this:
A) A new feature or significant change (Full Track — all five phases)
B) A small improvement or refactor (Lightweight Track — condensed workflow)
C) A bug fix or urgent correction (Hotfix Track — minimal workflow)

[Answer]:
```

### Handling Ambiguous Answers to Clarifying Question

If the user's answer to the clarifying question is still ambiguous:

1. **Partial answer**: If user provides context but doesn't clearly choose A/B/C, analyze their response for signal words and make a reasoned selection
2. **No answer**: If user says "just proceed" or similar, default to **Lightweight Track** as the safest middle ground
3. **Contradictory answer**: If user provides conflicting information (e.g., "it's a quick bug fix but also a new feature"), ask ONE follow-up question focusing on the primary intent
4. **Custom scope**: If user describes something that doesn't fit the three tracks, select the track closest to their described scope and note the adaptation in the track announcement

**Never ask more than two clarifying questions total** — after two questions, make a reasoned selection based on available information and proceed.

### Track Announcement

After selecting a track, announce the selection with a one-sentence rationale:

```markdown
**Track Selected**: {Full | Lightweight | Hotfix}

**Rationale**: {One sentence explaining why this track was selected based on the prompt}

Proceed with this track? (Y to confirm, or specify a different track)
```

Wait for confirmation or override before proceeding.

---

## Documentation Is Mandatory on All Tracks

**Documentation is not a phase you enter — it is the exit condition for closing any unit of work regardless of track.**

No unit is complete until:
- Session summary is finalized
- Affected documentation is updated (at appropriate depth for track)
- Backlog reflects the current state

What varies between tracks is documentation **depth**, not whether it happens.

The developer never needs to explicitly request documentation. The workflow enforces it as the exit condition every time.

See `common/exit-conditions.md` for detailed exit requirements.

---

## Track Comparison Summary

| Aspect | Full | Lightweight | Hotfix |
|--------|------|-------------|--------|
| **Inception** | Full | Scope confirmation only | None |
| **Construction** | Full design + code | Code generation | Diagnose + fix |
| **Operations** | Yes (placeholder) | Skipped | Skipped |
| **Testing** | Full phase | Quick regression | Verify fix only |
| **Documentation** | Full depth | Targeted | One paragraph + impact check |
| **Impact Scan** | Full scan + cross-doc update | Targeted update only | Lightweight check (flag only) |
| **Typical Duration** | Multiple sessions | One session | One session |
| **Human Approvals** | Multiple gates | Minimal | None (verify only) |

---

## Important Notes

1. **Track selection happens once** at the start of a unit of work
2. **Tracks cannot be changed mid-unit** — if scope changes significantly, close the current unit and start a new one
3. **The initialization track is separate** — see `common/initialization.md`. It runs once before any workflow track.
4. **When in doubt, ask** — one clarifying question is better than choosing the wrong track
