# E2E Test Standards

## Extension Type

Conditional

## Integration Point

Testing & Validation Phase → After Regression Run, Before Coverage Report

## Opt-In Configuration

**Opt-in prompt**: See `e2e-test-standards.opt-in.md` (loaded separately for context efficiency)

**Project-level override**: Configure in `TECHNICAL_GUIDELINES.md` under `## Testing Standards` to skip opt-in prompt.

## Rules

### E2E-01: User Journey Traceability (BLOCKING)

**When**: E2E test scenarios are generated

**What**: Every user story must have a corresponding E2E test scenario that validates the complete user journey

**Verification**:
- Compare user story IDs against E2E test scenario IDs
- Every user story has at least one E2E test scenario
- Test scenario names reference user story IDs (e.g., "E2E-US-001: Complete checkout workflow")

**Enforcement**: Blocking — Cannot proceed if user stories lack E2E coverage

### E2E-02: Critical Workflow Coverage (BLOCKING)

**When**: E2E test scenarios are reviewed

**What**: All "happy path" user workflows and critical edge cases must have E2E test scenarios

**Verification**:
- **Happy path**: Primary user journey from start to completion
- **Critical errors**: Authentication failures, payment failures, network errors
- **Critical edge cases**: Empty states, permission errors, data conflicts

**Enforcement**: Blocking — Cannot proceed if critical workflows lack coverage

### E2E-03: Cross-Service Validation (BLOCKING - if multi-service)

**When**: Project involves multiple services or domains

**What**: E2E test scenarios must validate data flows across service boundaries, not just integration contracts

**Verification**:
- E2E scenarios test actual workflow completion (not just API contracts)
- Scenarios validate data consistency across services
- Example: Order creation → payment processing → inventory update → email notification

**Enforcement**: Blocking — Cannot proceed if cross-service workflows lack end-to-end validation

### E2E-04: Test Data Management (ADVISORY)

**When**: E2E test implementation is planned or exists

**What**: E2E tests should use dedicated test data fixtures or data generation

**Verification**:
- Tests don't depend on production data
- Test data is isolated per test run
- Data cleanup strategy exists

**Enforcement**: Advisory — Warns but doesn't block

### E2E-05: Test Organization (ADVISORY)

**When**: E2E tests are implemented

**What**: E2E tests should be organized by user journey, not by page/component

**Verification**:
- File structure follows domain/journey pattern (e.g., `e2e/checkout/complete-purchase.spec.ts`)
- Test names describe user intent (not technical implementation)

**Enforcement**: Advisory — Warns but doesn't block

## Enforcement

**Blocking Conditions** (prevents progression to Coverage Report):
- User stories lack E2E test scenario coverage (E2E-01)
- Critical workflows lack E2E test scenarios (E2E-02)
- Cross-service workflows lack end-to-end validation (E2E-03, if applicable)

**Non-Blocking Advisories** (warns but allows progression):
- Test data management concerns (E2E-04)
- Test organization patterns (E2E-05)

## Integration with Other Extensions

- **User Stories**: E2E validation requires User Stories stage — if skipped, warn and execute minimal validation
- **Unit Test Standards**: E2E scenarios complement unit test coverage (workflows vs logic)
- **Security Baseline**: E2E scenarios should include security workflow tests (authentication, authorization)

## Output Artifacts

When this extension is enabled:
- `aidlc-docs/{domain}/{unit}/testing/e2e-workflow-validation/e2e-test-scenarios.md`
- `aidlc-docs/{domain}/{unit}/testing/e2e-workflow-validation/workflow-coverage-report.md`
- `aidlc-docs/{domain}/{unit}/testing/e2e-workflow-validation/e2e-execution-results.md` (optional - if tests executed)
