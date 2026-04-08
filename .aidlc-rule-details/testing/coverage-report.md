# Coverage Report

## Purpose

**Generate a meaningful coverage report and obtain human approval**

Coverage Report focuses on:
- Generating a structured report of untested code paths
- Providing risk assessment for each untested path
- Enabling informed developer sign-off decisions
- Gating advancement to Documentation phase on explicit approval

**Note**: This is not just a percentage — it's a list of specific untested paths with risk analysis.

## Prerequisites

- Contract Validation must be complete
- All contract drift resolved
- Test suite passing
- Code changes finalized

---

## Why Structured Coverage Matters

A coverage percentage alone is misleading:
- 80% coverage could mean critical error handling is untested
- 95% coverage could mean trivial getters are tested but business logic isn't
- Percentages hide which specific paths carry risk

A structured coverage report tells developers:
- **What** specific code paths are untested
- **Why** each untested path matters (or doesn't)
- **Whether** the untested paths represent acceptable risk

---

## Steps to Execute

### Step 1: Run Coverage Analysis

Execute the test suite with coverage instrumentation:

1. Run all unit tests with coverage enabled
2. Run all integration tests with coverage enabled
3. Collect combined coverage data

### Step 2: Identify Untested Paths

Extract all code paths that lack test coverage:

| Category | What to Look For |
|----------|------------------|
| **Uncovered Functions** | Functions never called during tests |
| **Uncovered Branches** | If/else branches not exercised |
| **Uncovered Error Handlers** | Catch blocks never triggered |
| **Uncovered Edge Cases** | Boundary conditions not tested |

### Step 3: Assess Risk of Each Untested Path

For each untested path, assess:

| Risk Level | Criteria |
|------------|----------|
| **High** | Business-critical logic, error handling for user-facing features, security-related code |
| **Medium** | Supporting logic, non-critical error handling, infrequently used paths |
| **Low** | Trivial code (getters/setters), defensive code for impossible conditions, logging |

### Step 4: Generate Structured Report

Create a detailed coverage report:

```markdown
# Coverage Report: {UNIT-ID}

**Generated**: {timestamp}
**Overall Coverage**: {percentage}%

---

## Untested Paths Summary

| Risk | Count | Action |
|------|-------|--------|
| 🔴 High | {count} | Recommend adding tests |
| 🟡 Medium | {count} | Consider adding tests |
| 🟢 Low | {count} | Acceptable to skip |

---

## High-Risk Untested Paths

These paths carry significant risk if they fail in production:

### 1. {file_path}:{line_number} — {function_name}

**What**: {Description of the untested code}
**Risk**: {Why this matters if it fails}
**Recommendation**: {Add test | Accept risk with justification}

```{language}
// Code snippet showing the untested path
```

### 2. {file_path}:{line_number} — {function_name}

...

---

## Medium-Risk Untested Paths

These paths have moderate impact if they fail:

### 1. {file_path}:{line_number} — {function_name}

**What**: {Description}
**Risk**: {Impact assessment}
**Recommendation**: {Suggested action}

...

---

## Low-Risk Untested Paths

These paths are acceptable to leave untested:

| File | Line | Code | Why Low Risk |
|------|------|------|--------------|
| user.ts | 45 | `get name() { return this._name; }` | Trivial getter |
| logger.ts | 12 | `catch (e) { /* ignore */ }` | Defensive logging |

---

## Coverage by Component

| Component | Coverage | Untested High-Risk |
|-----------|----------|-------------------|
| auth/ | 92% | 0 |
| api/ | 78% | 2 |
| services/ | 85% | 1 |
| utils/ | 95% | 0 |
```

### Step 5: Store Coverage Report

Save the report to:
`aidlc-docs/{domain}/{unit}/testing/coverage-report.md`

### Step 6: Present Human Approval Gate

**Critical**: Developer must explicitly approve before Phase 5 begins.

```markdown
**Coverage Report Complete**

## Summary

- **Overall Coverage**: {percentage}%
- **High-Risk Untested Paths**: {count}
- **Medium-Risk Untested Paths**: {count}
- **Low-Risk Untested Paths**: {count}

## Findings

{If high-risk paths exist}
⚠️ **{count} high-risk untested path(s) detected:**

1. **{path}**: {brief description of risk}
2. **{path}**: {brief description of risk}

{If no high-risk paths}
✅ **No high-risk untested paths detected.**

{If medium-risk paths exist}
📋 **{count} medium-risk untested path(s)** — see detailed report for assessment.

---

## Human Approval Required

Before proceeding to Documentation phase, please review and approve:

**Option A**: Approve coverage and proceed to Documentation
- All high-risk paths are acceptably tested (or risk is acknowledged)
- Ready to close this unit

**Option B**: Add more tests before proceeding
- Return to Construction to add tests for specific paths
- Re-run Testing & Validation after tests are added

**Option C**: Review detailed coverage report
- See full breakdown of untested paths before deciding

---

**Your approval is required to proceed.**

Which option do you choose?

[Answer]:
```

### Step 7: Handle Developer Decision

#### If Approved (Option A)

1. Record approval in session summary
2. Log approval decision in audit trail
3. Proceed to Documentation phase

```markdown
## Approval Recorded

**Approved By**: Developer (via workflow)
**Timestamp**: {timestamp}
**High-Risk Accepted**: {count} (if any)
**Notes**: {any developer notes}

Proceeding to Documentation phase.
```

#### If More Tests Requested (Option B)

1. Document which paths need tests
2. Return to Construction phase
3. After tests added, re-run entire Testing & Validation phase

#### If Review Requested (Option C)

1. Display the full coverage report
2. Return to approval prompt after review

---

## Approval Criteria Guidelines

### Should Approve If

- All high-risk paths have adequate test coverage
- Remaining untested paths are genuinely low risk
- Business-critical functionality is well-tested
- Error handling for user-facing features is tested

### Should Request More Tests If

- Critical business logic lacks coverage
- Error handling for user-facing features is untested
- Security-related code paths are uncovered
- Known edge cases are not tested

### Acceptable to Skip Testing If

- Trivial getters/setters
- Defensive code for theoretically impossible conditions
- Logging and debugging code
- Third-party library wrapper code with no business logic

---

## Integration with Workflow

### Human Approval Gate

This stage contains a **mandatory human approval gate**. The workflow cannot proceed to Documentation without explicit developer approval.

```
Coverage Report → [Human Approval] → Documentation Phase
                          ↓
               [More Tests] → Construction → Testing & Validation (full re-run)
```

### Return to Construction

If the developer requests more tests:

1. Workflow returns to Construction phase
2. After tests are added, re-run entire Testing & Validation phase (not just coverage)
3. This ensures new tests don't introduce regressions

---

## Best Practices

1. **Risk over percentage**: Focus on what's untested, not the number
2. **Business context**: High coverage of trivial code is less valuable than moderate coverage of critical code
3. **Document decisions**: Record why untested paths were accepted
4. **Don't game metrics**: Adding tests just to increase percentage defeats the purpose
5. **Iterate**: If high-risk paths are found, add tests before approving

---

## Example Approval Recording

When developer approves, record:

```markdown
## Testing & Validation Approval

**Unit**: {UNIT-ID}
**Approved**: {timestamp}

### Coverage Summary
- Overall: {percentage}%
- High-Risk Untested: {count}
- Medium-Risk Untested: {count}
- Low-Risk Untested: {count}

### Approval Notes
{Any notes from developer about accepted risks or decisions}

### Proceed To
Documentation & Consolidation Phase
```
