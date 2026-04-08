# Integration Test Scenario Generation

## Purpose

**Generate comprehensive integration test scenarios that enable flexible, bias-reduced testing**

Integration Test Scenario Generation focuses on:
- Identifying all cross-domain touch points from Construction output
- Creating detailed, implementation-agnostic test scenarios
- Generating standalone scenario documentation for external/deferred testing
- Optionally generating integration test code in same session
- Validating API contracts, shared resources, and event patterns

**Note**: This is distinct from unit tests written during Construction. Unit tests validate new code against itself; integration test scenarios specify how new code should integrate with the existing system.

**Key Innovation**: Scenarios are stored as standalone artifacts, enabling testing by different LLM, different session, human tester, or external QA team—reducing same-session implementation bias.

**Key Distinction**:
| Phase | Creates | Location | Tests |
|-------|---------|----------|-------|
| Construction | Unit test code | Project codebase | New code in isolation |
| Testing & Validation | Integration test code | Project codebase | New code + existing system |
| Testing & Validation | Test documentation | aidlc-docs | Plans, reports, coverage |

## Prerequisites

- Construction phase must be complete for the unit
- All code changes committed
- Unit tests passing
- Operations phase complete (or skipped per track)

## Why This Phase Exists

Construction-phase unit testing only validates new code against itself. It does not validate new code against the existing system. Integration failures — where the new feature subtly breaks something that was working — are the most common and most expensive failures in a multi-domain system.

---

## Steps to Execute

### Step 1: Review Construction Output

Load and analyze all artifacts from the completed Construction phase:

- Code changes made during this unit
- New APIs, endpoints, or interfaces introduced
- Database schema changes
- Service modifications
- Event/hook implementations

### Step 2: Identify Cross-Domain Touch Points

Systematically identify all integration boundaries:

| Touch Point Type | What to Look For |
|------------------|------------------|
| **API Contracts** | Endpoints consumed by other domains |
| **Shared Database Tables** | Tables read or written by multiple domains |
| **Event/Hook Patterns** | Events published that other domains subscribe to |
| **Tool Signatures** | Service tools called by other components |
| **Message Queues** | Messages sent to queues consumed elsewhere |
| **Cache Dependencies** | Shared cache keys or invalidation patterns |

### Step 3: Check Project Anchor Documents

Load relevant anchor documents to understand:

- Defined API contracts and their consumers
- Service interface specifications
- Integration patterns established for this project
- Cross-domain data flow expectations

### Step 4: Generate Comprehensive Test Scenarios

Create detailed, implementation-agnostic test scenarios for each identified touch point.

**Scenario Format Template**:

```markdown
## Scenario {N}: {Descriptive Title}

**Requirement**: {US-ID} {AC-ID}
**Touch Point**: {Endpoint or component boundary}
**Priority**: {High | Medium | Low}

### Pre-conditions
- Database state requirements
- Environment setup needed
- Authentication/authorization context
- Dependent service states

### Test Steps
1. Explicit action to perform
2. Request/input details (headers, body, parameters)
3. Any setup or configuration needed

### Expected Outcomes
- HTTP status code (if API)
- Response structure with field types
- Response content validation rules
- Database side-effects (what should change)
- Event emissions (if applicable)
- Error messages (if error scenario)

### Edge Cases to Test
1. **Edge case description**:
   - Input: {specific input}
   - Expected: {expected behavior}
2. **Another edge case**:
   - Input: {specific input}
   - Expected: {expected behavior}

### Contract References
- OpenAPI spec reference (if applicable)
- Business rule reference (BR-ID)
- Security requirement reference (SR-ID)
```

**Example Comprehensive Scenario**:

```markdown
## Scenario 1: User Login with Valid Credentials

**Requirement**: US-001 AC-02 (User can authenticate with email and password)
**Touch Point**: POST /api/auth/login
**Priority**: High (critical authentication path)

### Pre-conditions
- Database contains user record:
  - email: "test@example.com"
  - password: (bcrypt hash of "ValidPass123!")
  - status: "active"
  - email_verified: true
  - account_locked: false

### Test Steps
1. Send POST request to /api/auth/login
2. Request headers:
   - Content-Type: application/json
3. Request body:
   ```json
   {
     "email": "test@example.com",
     "password": "ValidPass123!"
   }
   ```

### Expected Outcomes
- HTTP Status: 200 OK
- Response headers:
  - Content-Type: application/json
- Response body structure:
  ```json
  {
    "access_token": "<JWT_TOKEN>",
    "refresh_token": "<REFRESH_TOKEN>",
    "expires_in": 900,
    "token_type": "Bearer"
  }
  ```
- JWT token validation:
  - Algorithm: HS256
  - Claims include: user_id (UUID), email (string), exp (timestamp 15min from now), iat (timestamp now)
- Database side-effects:
  - users.last_login updated to current timestamp (within 1 second)
  - New record in sessions table with session_id and user_id
- No events emitted for successful login

### Edge Cases to Test
1. **Email case insensitivity**:
   - Input: "TEST@example.com" (uppercase)
   - Expected: 200 OK (same response as lowercase)
2. **Whitespace trimming**:
   - Input: " test@example.com " (leading/trailing spaces)
   - Expected: 200 OK (spaces trimmed)
3. **Invalid password**:
   - Input: password="wrongpassword"
   - Expected: 401 Unauthorized, {"error": "Invalid credentials", "code": "AUTH_INVALID_CREDENTIALS"}
4. **Unverified email**:
   - Pre-condition: email_verified=false
   - Expected: 403 Forbidden, {"error": "Email not verified", "code": "AUTH_EMAIL_UNVERIFIED"}
5. **Locked account**:
   - Pre-condition: account_locked=true
   - Expected: 403 Forbidden, {"error": "Account locked", "code": "AUTH_ACCOUNT_LOCKED"}
6. **Non-existent user**:
   - Input: email="nonexistent@example.com"
   - Expected: 401 Unauthorized, {"error": "Invalid credentials", "code": "AUTH_INVALID_CREDENTIALS"}

### Contract References
- OpenAPI spec: /api/auth/login (see openapi.yaml lines 45-78)
- Business rule: BR-AUTH-001 (Password validation requirements)
- Business rule: BR-AUTH-002 (Email case-insensitive matching)
- Security requirement: SR-003 (JWT token expiration policy)
- Security requirement: SR-005 (Password must not be logged)
```

**Key Principles for Scenarios**:
- ✅ Implementation-agnostic (describe WHAT should happen, not HOW it's built)
- ✅ Reference requirements and contracts, NOT implementation code
- ✅ Measurable outcomes (specific status codes, field values)
- ✅ Comprehensive edge cases (boundary conditions, error paths)
- ✅ Self-contained (can be understood without reading implementation)

**Anti-Patterns to Avoid**:
- ❌ "Returns 422 because that's what the code does" → ✅ "Returns 422 per API spec for validation errors"
- ❌ "Email validated with regex pattern X" → ✅ "Email validated per RFC 5322 standard"
- ❌ "Token expires in 900 seconds (found in code)" → ✅ "Token expires in 15 minutes per security requirement SR-003"
```

### Step 4b: Store Scenarios as Standalone File (NEW)

**Purpose**: Enable testing by different LLM, different session, or external tester without same-session implementation bias.

**Create File**: `aidlc-docs/{domain}/{unit}/testing/integration-test-scenarios.md`

**Content**: All scenarios generated in Step 4, formatted according to the comprehensive template.

**File Structure**:
```markdown
# Integration Test Scenarios: {UNIT-ID}

**Generated**: {timestamp}
**Domain**: {domain}
**Unit**: {unit}

## Overview

**Touch Points**: {count}
**Scenarios**: {count}
**Priority Distribution**: {X} High, {Y} Medium, {Z} Low

---

## Scenario 1: {Title}
[Complete scenario per template]

---

## Scenario 2: {Title}
[Complete scenario per template]

---

[... additional scenarios ...]
```

**Use Cases for Standalone Scenarios**:
1. **Different LLM Testing**: Provide scenarios to GPT-4, Claude Opus, or other model to implement tests
2. **New Session Testing**: Test in fresh session without implementation context (avoid same-session bias)
3. **Human Tester**: QA team or developer manually tests following scenarios
4. **External QA**: Contractor or external team implements automated tests from scenarios
5. **Future Regression**: Re-test after refactoring using original scenarios as specification
6. **Scenario Review**: Stakeholders review test coverage before test implementation

**Key Characteristic**: File is **self-contained** — can be used to write tests without accessing implementation code.

---

### Step 5: Generate Integration Tests (OPTIONAL)

**Note**: Scenarios are now stored in Step 4b. This step optionally implements tests from those scenarios.

**Implementation Choice**:

**Option A - Implement Tests Now** (current workflow):
- Main agent implements integration tests in this session
- Uses scenarios from Step 4 as specification
- Proceeds immediately to Step 6 (store test artifacts)
- Provides immediate feedback but may carry same-session bias

**Option B - Defer to User** (external/deferred testing):
- Skip test code generation in this session
- User implements tests later using scenarios file
- Scenarios can be tested by different LLM, new session, or human tester
- Reduces same-session bias but delays test execution
- To implement later: `"Using AI-DLC, implement integration tests from scenarios for {UNIT-ID}"`

**If Option A selected** (implement now), continue with test generation:

**CRITICAL**: This step creates **actual executable test code** in the project codebase, not just documentation.

For each identified touch point, generate test files in the project's test directory:

1. **Create test files** following project conventions:
   - JavaScript/TypeScript: `tests/integration/` or `__tests__/integration/`
   - Python: `tests/integration/` or `test_integration_*.py`
   - Java: `src/test/java/.../integration/`
   - Go: `*_integration_test.go`
   - Follow existing test patterns in the codebase

2. **Test content** for each touch point:
   - **Validate contract compliance**: Does the implementation match the spec?
   - **Test boundary behavior**: Do edge cases at boundaries work correctly?
   - **Verify data format**: Is data passed across boundaries in expected format?
   - **Check error propagation**: Do errors cross boundaries appropriately?

3. **Test characteristics**:
   - Tests should be runnable via the project's test runner
   - Use real dependencies where possible (minimize mocking)
   - Include setup/teardown for test isolation
   - Document which contract each test validates in test comments

### Step 6: Store Test Artifacts

**Two outputs are created:**

1. **Executable Test Code** (in project codebase):
   - Location: Project's test directory per conventions
   - Examples:
     - `tests/integration/{unit}-integration.test.js`
     - `tests/integration/test_{unit}_integration.py`
     - `src/test/java/.../integration/{Unit}IntegrationTest.java`
   - These are real, runnable tests that validate cross-domain boundaries

2. **Test Plan Documentation** (in aidlc-docs):
   - Location: `aidlc-docs/{domain}/{unit}/testing/integration-test-plan.md`
   - Documents what was tested, why, and the results
   - Provides traceability for each integration point tested

### Step 7: Execute Integration Tests (if generated)

**Note**: Only executes if Option A was selected in Step 5 (tests generated in same session).

**If Option B was selected** (tests deferred):
- Skip to Step 8
- Note in completion message that scenarios are available for external implementation
- Proceed to Regression Run with existing tests only

**If tests were generated**, run them and capture results:

```markdown
## Integration Test Results

**Executed**: {timestamp}
**Total Tests**: {count}
**Passed**: {count}
**Failed**: {count}

### Failures (if any)

| Test | Expected | Actual | Analysis |
|------|----------|--------|----------|
| ... | ... | ... | ... |
```

### Step 8: Present Findings

Present integration test scenario generation results to developer:

**If Option A selected** (tests generated in same session):

```markdown
**Integration Test Scenario Generation Complete**

**Scenarios Created**: {count}
**Scenarios File**: `aidlc-docs/{domain}/{unit}/testing/integration-test-scenarios.md`

**Integration Tests Generated**: {count}
**Tests Passing**: {count}
**Tests Failing**: {count}

{If failures exist}
The following integration issues were detected:
1. {Issue description}
2. {Issue description}

**Recommendation**: {Fix in Construction | Proceed with known limitations}

**Note**: Scenarios are available for future re-testing or external testing.

Ready to proceed to Regression Run?
```

**If Option B selected** (tests deferred to user):

```markdown
**Integration Test Scenario Generation Complete**

**Scenarios Created**: {count}
**Scenarios File**: `aidlc-docs/{domain}/{unit}/testing/integration-test-scenarios.md`

**Integration Tests**: Deferred to external/future implementation

**Use Cases**:
- Test with different LLM (reduced bias)
- Test in new session (avoid same-session bias)
- Human tester or external QA team
- Future regression testing

**To implement tests later**:
`Using AI-DLC, implement integration tests from scenarios for {UNIT-ID}`

**Note**: Proceeding to Regression Run with existing tests only (no new integration tests in this session).

Ready to proceed to Regression Run?
```

---

## Touch Point Categories

### API Contracts

Tests should verify:
- Response schema matches OpenAPI spec
- Required fields are present
- Data types are correct
- Pagination works as documented
- Error responses match spec

### Shared Database Tables

Tests should verify:
- Writes don't break reads by other domains
- Schema changes don't invalidate existing queries
- Indexes still support expected query patterns
- Constraints don't reject valid data from other domains

### Event/Hook Patterns

Tests should verify:
- Event payload contains all expected fields
- Event timing meets consumer expectations
- Event ordering is preserved where required
- Failure to process event doesn't break producer

### Tool Signatures

Tests should verify:
- Tool input schema matches consumer calls
- Tool output schema matches consumer expectations
- Error handling works as consumers expect
- Tool permissions haven't changed unexpectedly

---

## Integration with Other Phases

### From Construction

- Receives: Complete code changes, new interfaces, schema changes
- Validates: Changes integrate correctly with existing system

### To Regression

- Passes: Integration test results
- Regression run validates full system including new integration tests

### To Contract Validation

- Integration tests may reveal contract drift
- Contract validation will formalize and flag drift as blocking

---

## Best Practices

1. **Test at boundaries**: Focus on where domains meet, not internal behavior
2. **Use real dependencies**: Mock only what you must; integration tests lose value with excessive mocking
3. **Test failure modes**: Verify graceful degradation when dependencies fail
4. **Document assumptions**: Each test should document what contract it validates
5. **Keep tests fast**: Integration tests should complete in reasonable time
