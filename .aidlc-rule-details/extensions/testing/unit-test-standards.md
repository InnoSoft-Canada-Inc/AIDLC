# Unit Test Standards Extension

## Opt-In Configuration

This extension is **always-on** (no opt-in prompt) because unit test standards should serve as behavioral specifications.

**Default**: Enabled (tests should serve as behavioral specifications)

## Purpose

Ensure unit tests serve as behavioral specifications that enable project recreation. Well-written tests document expected behavior and can guide reimplementation.

---

## Rules

### TEST-01: Descriptive Test Names (BLOCKING)

Test names MUST describe the behavior being verified, not the implementation.

**Pattern**: `[action/returns/throws] [expected outcome] [when/for condition]`

**Good Examples** (Next.js style):
```javascript
it('returns error when email format is invalid')
it('creates user when valid credentials provided')
it('throws ValidationError for empty password')
it('redirects to login when session expired')
it('preserves query params after authentication')
```

**Bad Examples**:
```javascript
it('test validateEmail function')
it('email validation')
it('test case 1')
it('should work')
```

**Verification**: Review test file names and `it()`/`test()` descriptions for clarity.

---

### TEST-02: Requirement Traceability (BLOCKING)

Every user story acceptance criterion MUST have at least one corresponding test.

**How to Verify**:
1. List all acceptance criteria from user stories
2. For each criterion, identify the test(s) that verify it
3. Document the mapping in `aidlc-docs/{domain}/{unit}/testing/requirement-test-map.md`

**Gap Handling**: If an acceptance criterion has no test, either:
- Write the missing test, OR
- Document why it's untestable (e.g., requires manual verification)

---

### TEST-03: Business Rule Coverage (BLOCKING)

Business rules from functional design MUST have corresponding tests.

For each documented business rule, ensure:
- At least one "happy path" test
- Tests for documented edge cases
- Tests for error/rejection conditions

**Example**:

Business Rule: "Email must be unique across all users"

Required tests:
```javascript
it('creates user when email is unique')
it('returns DuplicateError when email already exists')
it('treats email comparison as case-insensitive')
```

---

### TEST-04: Test Organization (ADVISORY)

Organize tests by behavior/feature, not by file/class structure.

**Recommended structure**:
```
tests/
  unit/
    auth/
      login.test.ts
      token-refresh.test.ts
      password-reset.test.ts
    users/
      registration.test.ts
      profile-update.test.ts
  integration/
    auth-flow.test.ts
  e2e/
    user-journey.test.ts
```

**Why**: Feature-based organization makes tests easier to understand as specifications.

---

### TEST-05: Test Data Clarity (BLOCKING)

Test data MUST use meaningful values that indicate purpose.

**Good**:
```javascript
const validEmail = 'user@example.com';
const invalidEmail = 'not-an-email';
const emptyEmail = '';
const tooLongEmail = 'a'.repeat(256) + '@example.com';
```

**Bad**:
```javascript
const email1 = 'test@test.com';
const email2 = 'abc123';
const x = '';
```

**Why**: Meaningful test data makes test intent clear without reading assertions.

---

## Verification Checklist

At Testing & Validation phase, verify:

- [ ] All test names describe behavior (TEST-01)
- [ ] Requirement-test mapping document exists (TEST-02)
- [ ] All acceptance criteria have corresponding tests (TEST-02)
- [ ] All business rules have corresponding tests (TEST-03)
- [ ] Test data uses meaningful values (TEST-05)

---

## Compliance Summary Format

When presenting stage completion, include:

```markdown
### Unit Test Standards Compliance

| Rule | Status | Notes |
|------|--------|-------|
| TEST-01: Descriptive Names | Compliant | All 47 tests use behavior-describing names |
| TEST-02: Requirement Traceability | Compliant | 12/12 acceptance criteria mapped |
| TEST-03: Business Rule Coverage | Compliant | 8/8 business rules have tests |
| TEST-04: Test Organization | N/A | Advisory only |
| TEST-05: Test Data Clarity | Compliant | Reviewed, all test data meaningful |
```

---

## Rationale

Tests written to these standards serve dual purposes:

1. **Validation**: Verify implementation correctness
2. **Specification**: Document expected behavior for recreation

When recreating a project, developers can:
- Read test names to understand expected behaviors
- Use requirement-test mapping to ensure all features are implemented
- Use test assertions as acceptance criteria
