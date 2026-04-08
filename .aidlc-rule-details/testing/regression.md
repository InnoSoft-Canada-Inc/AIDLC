# Regression Run

## Purpose

**Execute the full test suite and categorize any failures**

Regression Run focuses on:
- Running the complete existing test suite
- Surfacing any failures introduced by this unit's changes
- Categorizing failures as legitimate regressions vs intentional changes
- Presenting categorized findings before any fixes are made

**Note**: This validates that new code hasn't broken existing functionality that was working before this unit.

## Prerequisites

- Integration Test Generation must be complete
- All integration tests executed
- Code changes committed
- Test environment available

---

## Steps to Execute

### Step 1: Capture Pre-Run State

Before running tests, document the starting state:

```markdown
## Pre-Regression State

**Unit**: {UNIT-ID}
**Branch**: {branch-name}
**Last Commit**: {commit-hash}
**Test Suite Version**: {version or commit reference}
```

### Step 2: Execute Full Test Suite

Run the complete existing test suite:

1. Execute all unit tests
2. Execute all integration tests (including new ones from previous stage)
3. Execute any end-to-end tests
4. Execute contract tests if they exist

Capture execution output for analysis.

### Step 3: Collect All Failures

For each failing test, capture:

| Field | Description |
|-------|-------------|
| **Test Name** | Full test identifier |
| **Test File** | Location of the test |
| **Error Message** | Actual error or assertion failure |
| **Expected** | What the test expected |
| **Actual** | What actually happened |
| **Stack Trace** | Relevant portion of stack trace |

### Step 4: Categorize Each Failure

**This is the critical step.** For each failure, determine if it is:

#### Legitimate Regression

**Definition**: This unit broke something that was working.

Indicators:
- Test was passing before this unit's changes
- Test validates behavior unrelated to this unit's scope
- Failure is unexpected given the unit's intent
- The existing behavior should have been preserved

**Action Required**: Fix the regression in Construction before proceeding.

#### Intentional Behavior Change

**Definition**: This unit intentionally changed behavior, and the test needs updating.

Indicators:
- Test validates behavior this unit was meant to change
- Failure aligns with the unit's design intent
- The old behavior is no longer correct
- Test needs to be updated to reflect new expected behavior

**Action Required**: Update the test to reflect the new correct behavior.

### Step 5: Generate Categorized Report

Present failures in a structured format:

```markdown
## Regression Analysis Report

**Unit**: {UNIT-ID}
**Total Tests**: {count}
**Passed**: {count}
**Failed**: {count}

---

### Legitimate Regressions ({count})

These failures indicate unintended breakage that must be fixed:

| # | Test | Error | Impact Assessment |
|---|------|-------|-------------------|
| 1 | test_user_login | AssertionError: expected 200, got 500 | Auth flow broken for all users |
| 2 | test_data_export | KeyError: 'user_id' | Export feature broken |

**Recommendation**: Return to Construction to fix these issues before proceeding.

---

### Intentional Changes ({count})

These failures are expected based on the unit's design. Tests need updating:

| # | Test | Old Behavior | New Behavior | Why Changed |
|---|------|--------------|--------------|-------------|
| 1 | test_response_format | Returned XML | Returns JSON | API modernization per design |
| 2 | test_default_limit | Default 10 | Default 25 | Performance optimization |

**Recommendation**: Update these tests to reflect the new correct behavior.

---

### Summary

- **Legitimate Regressions**: {count} — must fix
- **Intentional Changes**: {count} — update tests
- **Blocking Issues**: {yes/no}
```

### Step 6: Present to Developer

**Critical**: Present findings to developer BEFORE any fixes are made.

```markdown
**Regression Analysis Complete**

**Test Suite Execution**:
- Total Tests: {count}
- Passed: {count}
- Failed: {count}

**Failure Categorization**:
- Legitimate Regressions: {count}
- Intentional Changes: {count}

{If legitimate regressions exist}
⚠️ **{count} legitimate regression(s) detected.**

These issues must be fixed before proceeding:
1. {Brief description of regression 1}
2. {Brief description of regression 2}

**Recommended Action**: Return to Construction to fix regressions, then re-run Testing & Validation.

{If only intentional changes exist}
✅ **No legitimate regressions detected.**

{count} test(s) need updating to reflect intentional behavior changes:
1. {Brief description of change 1}
2. {Brief description of change 2}

**Recommended Action**: Update tests and proceed to Contract Validation.

---

How would you like to proceed?
A) Return to Construction to fix regressions
B) Update tests for intentional changes and proceed
C) Review detailed failure report
```

### Step 7: Handle Developer Decision

Based on developer response:

#### If returning to Construction

1. Document the regressions to fix in session summary
2. Update workflow state to Construction phase
3. After fixes, re-run entire Testing & Validation phase

#### If proceeding with test updates

1. Update tests to reflect intentional changes
2. Re-run updated tests to confirm they pass
3. Proceed to Contract Validation

---

## Categorization Guidelines

### Signs of Legitimate Regression

- Test is in a domain not touched by this unit
- Error is in code path not modified by this unit
- Failure would affect production users
- The broken behavior was intentionally designed and documented

### Signs of Intentional Change

- Test directly validates behavior this unit was designed to change
- Design documents describe the new behavior
- Stakeholders approved the behavior change
- The test's expected value is now outdated

### When Uncertain

If categorization is unclear:

1. Check design documents for intended behavior changes
2. Check commit history for what was deliberately modified
3. Check if the test was recently added or long-standing
4. Ask the developer for clarification

```markdown
**Categorization Unclear**

The following test failure could not be confidently categorized:

**Test**: {test_name}
**Error**: {error_description}

This could be:
- A legitimate regression if {scenario A}
- An intentional change if {scenario B}

Please clarify: Is this an intended behavior change?

[Answer]:
```

---

## Integration with Workflow

### If Regressions Found

```
Testing & Validation → [Regressions] → Construction → Testing & Validation (full re-run)
```

The workflow returns to Construction for fixes, then re-runs the entire Testing & Validation phase (not just regression).

### If No Regressions

```
Testing & Validation → [Clean] → Contract Validation → Coverage Report
```

Proceed to the next stage in Testing & Validation.

---

## Best Practices

1. **Never auto-fix regressions**: Present to developer first
2. **Preserve test history**: Don't delete failing tests; update them
3. **Document categorization rationale**: Future developers should understand why
4. **Re-run after fixes**: Always verify fixes resolved the regressions
5. **Update session summary**: Record regression findings for audit trail
