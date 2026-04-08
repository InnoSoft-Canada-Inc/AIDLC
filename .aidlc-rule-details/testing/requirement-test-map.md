# Requirement-Test Mapping

## Purpose

Create traceability between requirements, user stories, business rules, and tests. This mapping enables:

1. **Verification**: Confirm all requirements have test coverage
2. **Recreation**: Future developers can use this map to ensure equivalent implementations pass the same tests
3. **Maintenance**: When requirements change, identify which tests need updating

---

## Stage: Requirement-Test Mapping (ALWAYS EXECUTE)

**Position in Workflow**: After Integration Test Generation, before Regression Run

**Execution Time**: ~10-15 minutes for typical units

---

## Step 1: Gather Source Materials

Load these artifacts:
- User stories with acceptance criteria (`aidlc-docs/{domain}/{unit}/inception/` or `aidlc-docs/_shared/user-stories/`)
- Functional design with business rules (`aidlc-docs/{domain}/{unit}/construction/functional-design/`)
- Test files from the codebase

---

## Step 2: Create Mapping Document

**Output Location**: `aidlc-docs/{domain}/{unit}/testing/requirement-test-map.md`

**Template**:

```markdown
# Requirement-Test Mapping

**Unit**: {UNIT-ID}
**Generated**: {timestamp}

## Summary

| Category | Total | Covered | Coverage |
|----------|-------|---------|----------|
| Acceptance Criteria | X | X | 100% |
| Business Rules | X | X | 100% |
| Edge Cases | X | X | 100% |

---

## User Stories → Tests

| Story ID | Acceptance Criterion | Test File | Test Name(s) |
|----------|---------------------|-----------|--------------|
| US-001 | User can register with email | auth.test.ts | `creates user when valid email provided` |
| US-001 | Email must be unique | auth.test.ts | `returns error when email already exists` |
| US-001 | Password must be 8+ characters | auth.test.ts | `returns error when password too short` |
| US-002 | User can login with credentials | auth.test.ts | `returns token pair for valid credentials` |

---

## Business Rules → Tests

| Business Rule | Source | Test File | Test Name(s) |
|---------------|--------|-----------|--------------|
| Email normalized to lowercase | functional-design.md | validation.test.ts | `normalizes email to lowercase` |
| Passwords hashed with bcrypt | functional-design.md | auth.test.ts | `stores password as bcrypt hash` |
| Refresh tokens expire in 7 days | functional-design.md | token.test.ts | `refresh token expires after 7 days` |

---

## Edge Cases → Tests

| Edge Case | Test File | Test Name(s) |
|-----------|-----------|--------------|
| Empty email | validation.test.ts | `returns error when email is empty` |
| Email > 255 chars | validation.test.ts | `returns error when email exceeds max length` |
| Special characters in password | auth.test.ts | `accepts special characters in password` |
| Concurrent login attempts | auth.test.ts | `handles concurrent login attempts` |

---

## Gaps Identified

| Requirement | Status | Action Needed |
|-------------|--------|---------------|
| (None) | — | — |

*If gaps exist, list them here with recommended action.*
```

---

## Step 3: Verify Coverage

Check each category:

### Acceptance Criteria
- [ ] Every acceptance criterion from user stories is listed
- [ ] Each criterion has at least one test
- [ ] Test names accurately describe what they verify

### Business Rules
- [ ] Every business rule from functional design is listed
- [ ] Each rule has at least one test
- [ ] Edge cases for rules are covered

### Edge Cases
- [ ] Common edge cases documented
- [ ] Boundary conditions tested
- [ ] Error conditions tested

---

## Step 4: Identify and Address Gaps

If any requirement lacks a test:

1. **Determine if testable**:
   - Can this be automated? → Write the test
   - Requires manual verification? → Document in "Manual Test Required" section
   - Out of scope for this unit? → Note as deferred

2. **Document the gap** in the mapping file with action needed

3. **Write missing tests** before proceeding (if blocking per TEST-02 extension rule)

---

## Completion Message

Present to user:

```markdown
## Requirement-Test Mapping Complete

**Coverage Summary**:
- Acceptance Criteria: X/X (100%)
- Business Rules: X/X (100%)
- Edge Cases: X documented and tested

**Mapping Document**: `aidlc-docs/{domain}/{unit}/testing/requirement-test-map.md`

**Gaps Found**: [None / List gaps]

---

**Options**:
1. **Request Changes** — Adjust mapping or add missing tests
2. **Continue to Regression Run** — Proceed with current coverage
```

---

## Integration with Workflow

### Input From
- User stories (acceptance criteria)
- Functional design (business rules)
- Integration test generation (test files created)

### Output To
- Regression Run (uses mapping to understand test scope)
- Coverage Report (references mapping for gap analysis)
- Recreation Readiness Checklist (verifies mapping exists and is complete)

---

## Best Practices

1. **Be specific**: Map to exact test names, not just files
2. **One-to-many is OK**: One requirement may have multiple tests
3. **Many-to-one is suspicious**: If one test covers many requirements, it may be too broad
4. **Update when tests change**: Keep mapping current as tests evolve
5. **Include negative tests**: "returns error when X" tests are as important as happy paths
