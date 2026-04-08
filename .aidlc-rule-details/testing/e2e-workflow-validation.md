# E2E Workflow Validation

## Purpose

**Validate that critical user workflows are covered by end-to-end test scenarios**

E2E Workflow Validation focuses on:
- Mapping user stories to E2E test scenarios
- Ensuring critical user journeys have end-to-end validation
- Validating cross-service data flows (if applicable)
- Tracking workflow coverage (not just code coverage)

**Note**: This stage generates test **scenarios** (documentation), not test code. Implementation is project-specific.

## Prerequisites

- Regression Run must be complete
- User approval received for regression results
- User Stories stage executed (or minimal E2E validation if skipped)
- E2E Test Standards extension enabled

## Conditional Execution

**Execute IF**:
- E2E Test Standards extension is enabled in `aidlc-state.md`

**Skip IF**:
- E2E Test Standards extension is disabled

## Output Location

```
aidlc-docs/{domain}/{unit}/testing/e2e-workflow-validation/
├── e2e-test-scenarios.md         # Test scenarios mapped to user stories
├── workflow-coverage-report.md   # User journey coverage analysis
└── e2e-execution-results.md      # Test results (if tests executed)
```

---

## Steps to Execute

### Step 1: Load User Stories

Load user stories created during Inception phase (if User Stories stage was executed).

**Location**: `aidlc-docs/_shared/user-stories/user-stories.md`

**If User Stories stage was skipped**:
- Warn user that E2E validation is limited without user stories
- Offer to create minimal user journey list from requirements
- User chooses:
  - **A) Proceed with minimal E2E validation** (based on requirements)
  - **B) Return to Inception and execute User Stories stage**
  - **C) Skip E2E validation for this unit**

**Log in audit.md**:
- "E2E Workflow Validation: User stories loaded from {path}"
- OR "E2E Workflow Validation: Minimal validation mode (no user stories)"

---

### Step 2: Generate E2E Test Scenarios

Create detailed E2E test scenarios mapped to user stories.

**Process**:

1. **For each user story**, create E2E test scenario:
   - **Scenario ID**: `E2E-{USER-STORY-ID}` (e.g., E2E-US-001)
   - **Scenario name**: User story title
   - **Preconditions**: Initial state before workflow starts
   - **Test Steps**: User actions from start to completion
   - **Expected Outcomes**: What should happen at each step
   - **Success Criteria**: How to verify workflow completed successfully
   - **Error Scenarios**: Critical failures that should be tested

2. **Include cross-service scenarios** (if applicable):
   - Identify workflows that span multiple services/domains
   - Document data flow across service boundaries
   - Specify validation points at each service

3. **Validate coverage**:
   - Every user story has at least one E2E scenario (E2E-01)
   - All critical workflows covered (E2E-02)
   - Cross-service flows validated (E2E-03, if applicable)

**Example Scenario Template**:

```markdown
### E2E-US-001: Complete Checkout Workflow

**User Story**: As a customer, I want to complete a purchase so that I can receive my order

**Preconditions**:
- User is authenticated
- Shopping cart contains at least one item
- User has valid payment method
- Inventory is available for cart items

**Test Steps**:
1. Navigate to checkout page
2. Confirm shipping address
3. Select shipping method
4. Review order summary
5. Enter payment information
6. Submit order

**Expected Outcomes**:
- Step 2: Shipping address pre-filled from user profile
- Step 3: Shipping options displayed with cost
- Step 4: Order total calculated correctly (subtotal + shipping + tax)
- Step 5: Payment form validates card number format
- Step 6: Order confirmation displayed with order ID

**Success Criteria**:
- Order created in database with status "pending"
- Payment processed successfully
- Inventory decremented for purchased items
- Confirmation email sent to user
- User redirected to order confirmation page

**Error Scenarios to Test**:
- **Invalid payment information** → display error, preserve cart
- **Out of stock during checkout** → display error, update cart
- **Network failure during payment** → retry mechanism or fail gracefully

**Data Validation**:
- Order record exists in database with correct totals
- Payment record created with transaction ID
- Inventory quantities updated atomically
- Email queued in outbound message queue
```

**Output**: `aidlc-docs/{domain}/{unit}/testing/e2e-workflow-validation/e2e-test-scenarios.md`

**Log in audit.md**: "E2E test scenarios generated: {count} scenarios for {count} user stories"

---

### Step 3: Validate Workflow Coverage

Analyze workflow coverage and identify gaps.

**Process**:

1. **User Story Coverage**:
   - List all user stories
   - Mark which have E2E scenarios
   - Identify gaps (user stories without E2E coverage)

2. **Critical Workflow Coverage**:
   - Identify critical user journeys (happy paths)
   - Verify each has E2E scenario
   - Identify critical edge cases (auth failures, payment errors, etc.)
   - Verify critical edge cases have scenarios

3. **Cross-Service Coverage** (if applicable):
   - List workflows spanning multiple services
   - Verify each has end-to-end validation scenario
   - Identify missing cross-service validations

4. **Generate Coverage Report**:
   - Summary: X/Y user stories have E2E coverage (Z%)
   - Gap analysis: Which workflows lack coverage
   - Risk assessment: Impact of gaps (high/medium/low)
   - Recommendations: Prioritize missing scenarios

**Example Coverage Report Template**:

```markdown
# E2E Workflow Coverage Report

## Summary

- **Total User Stories**: 12
- **E2E Scenarios Created**: 10
- **Coverage**: 83% (10/12)

## Coverage by User Story

| Story ID | Story Title | E2E Scenario | Status |
|----------|-------------|--------------|--------|
| US-001 | Complete checkout | E2E-US-001 | ✅ Covered |
| US-002 | View order history | E2E-US-002 | ✅ Covered |
| US-003 | Cancel order | — | ❌ Missing |
| US-004 | Update profile | E2E-US-004 | ✅ Covered |

## Critical Workflow Coverage

| Workflow | Happy Path | Error Cases | Status |
|----------|------------|-------------|--------|
| Checkout | ✅ E2E-US-001 | ✅ Payment failure, Out of stock | ✅ Complete |
| Authentication | ✅ E2E-US-005 | ❌ Invalid credentials | ⚠️ Partial |
| Order Management | ✅ E2E-US-002 | ❌ Cancellation | ⚠️ Partial |

## Cross-Service Workflows (if applicable)

| Workflow | Services Involved | E2E Scenario | Status |
|----------|-------------------|--------------|--------|
| Order → Payment → Inventory | Orders, Payments, Inventory | E2E-US-001 | ✅ Covered |
| User Registration → Email | Users, Notifications | E2E-US-007 | ✅ Covered |

## Gap Analysis

### High Priority Gaps
- **US-003 (Cancel order)**: Critical workflow, no E2E coverage
  - **Risk**: Users unable to cancel orders may contact support
  - **Recommendation**: Add E2E-US-003 scenario immediately

### Medium Priority Gaps
- **Authentication error cases**: Missing invalid credential test
  - **Risk**: Auth errors not validated end-to-end
  - **Recommendation**: Extend E2E-US-005 with error scenario

### Low Priority Gaps
- None identified

## Recommendations

1. **Immediate**: Add E2E-US-003 for order cancellation
2. **Before Release**: Complete authentication error case coverage
3. **Future Enhancement**: Add performance validation to checkout workflow
```

**Output**: `aidlc-docs/{domain}/{unit}/testing/e2e-workflow-validation/workflow-coverage-report.md`

**Log in audit.md**: "E2E workflow coverage: {coverage}% ({covered}/{total} user stories)"

---

### Step 4: Execute E2E Tests (Optional)

If E2E test implementation exists, execute tests and capture results.

**Conditional**: Only if project has implemented E2E tests (e.g., Playwright, Cypress)

**Process**:

1. **Detect E2E test framework**:
   - Check for `playwright.config.ts`, `playwright.config.js`
   - Check for `cypress.config.ts`, `cypress.config.js`
   - Check `package.json` for E2E test dependencies

2. **Execute E2E test command**:
   - **Playwright**: `npx playwright test`
   - **Cypress**: `npx cypress run`
   - **Other**: Use project-specific command from `package.json`

3. **Capture results**:
   - Tests passed/failed/skipped
   - Execution time
   - Screenshots/videos (if available)
   - Detailed failure information

4. **Analyze failures**:
   - **Test failures**: Tests exist but workflows broken
   - **Coverage gaps**: Scenarios exist but tests not implemented

**If E2E tests not implemented**:
- Note in coverage report: "E2E test scenarios documented, implementation pending"
- Log in audit.md: "E2E Workflow Validation: Scenarios only (tests not implemented)"

**If E2E tests implemented and executed**:
- Create execution results document
- Log in audit.md: "E2E tests executed: {passed}/{total} passed"

**Example Execution Results Template**:

```markdown
# E2E Test Execution Results

## Execution Summary

- **Date**: {YYYY-MM-DD HH:MM:SS}
- **Framework**: Playwright v1.40.0
- **Total Tests**: 10
- **Passed**: 8
- **Failed**: 2
- **Skipped**: 0
- **Duration**: 2m 34s

## Test Results by Scenario

| Scenario | Test File | Status | Duration | Notes |
|----------|-----------|--------|----------|-------|
| E2E-US-001 | checkout/complete-purchase.spec.ts | ✅ Passed | 24s | — |
| E2E-US-002 | orders/view-history.spec.ts | ✅ Passed | 8s | — |
| E2E-US-003 | orders/cancel-order.spec.ts | ❌ Failed | 12s | Timeout waiting for refund |
| E2E-US-005 | auth/login.spec.ts | ❌ Failed | 5s | Login button not clickable |

## Failure Details

### E2E-US-003: Cancel Order (Failed)
**Error**: Timeout waiting for element: `[data-testid="refund-confirmation"]`
**Screenshot**: `test-results/cancel-order-failure.png`
**Reproduction Steps**: Cancel order → Wait for refund → Timeout after 30s
**Suspected Cause**: Refund service not running in test environment

### E2E-US-005: Login (Failed)
**Error**: Element `[data-testid="login-button"]` is not clickable
**Screenshot**: `test-results/login-failure.png`
**Reproduction Steps**: Navigate to login → Enter credentials → Click login → Error
**Suspected Cause**: Modal overlay blocking button interaction

## Test Environment

- **OS**: macOS 14.2
- **Browser**: Chromium 120.0.6099.28
- **Viewport**: 1280x720
- **Network**: Fast 3G throttling
```

**Output**: `aidlc-docs/{domain}/{unit}/testing/e2e-workflow-validation/e2e-execution-results.md` (if tests executed)

---

### Step 5: Verify Extension Rule Compliance

Verify compliance with E2E Test Standards extension rules.

**Compliance Checklist**:

- [ ] **E2E-01 (User Journey Traceability)**: Every user story has E2E scenario — **BLOCKING**
- [ ] **E2E-02 (Critical Workflow Coverage)**: All critical workflows have scenarios — **BLOCKING**
- [ ] **E2E-03 (Cross-Service Validation)**: Cross-service flows validated (if applicable) — **BLOCKING**
- [ ] **E2E-04 (Test Data Management)**: Test data strategy documented — **ADVISORY**
- [ ] **E2E-05 (Test Organization)**: Test organization follows journey pattern — **ADVISORY**

**Blocking Violations**:
- If any BLOCKING rule violated, mark as non-compliant
- Do NOT proceed to approval gate
- Present violations with remediation options to user

**Advisory Violations**:
- Note in coverage report
- Warn user but do not block progression

**Log in audit.md**: "E2E Test Standards compliance: {compliant_rules}/{total_rules} rules compliant, {blocking_violations} blocking violations"

---

### Step 6: Present for Approval

Present E2E workflow validation results for human review.

**Approval Message Format** (if compliant):

```markdown
**E2E Workflow Validation Stage Complete**

### E2E Test Scenarios Generated
✅ {count} E2E test scenarios created
✅ Mapped to {user_story_count} user stories

### Workflow Coverage Analysis
✅ User story coverage: {coverage}% ({covered}/{total})
✅ Critical workflow coverage: {critical_coverage}%
✅ Cross-service workflows validated (if applicable)

### Extension Rule Compliance
✅ E2E-01 (Traceability): Compliant
✅ E2E-02 (Critical Coverage): Compliant
✅ E2E-03 (Cross-Service): Compliant / N/A
⚠️ E2E-04 (Test Data): Advisory warning
⚠️ E2E-05 (Organization): Advisory warning

### Test Execution (if applicable)
✅ E2E tests executed: {passed}/{total} passed
OR
ℹ️ E2E test scenarios documented (implementation pending)

---

**Please review the E2E workflow validation and confirm:**
1. Are all critical user workflows covered by E2E test scenarios?
2. Are coverage gaps acceptable (if any)?
3. Are E2E test execution results satisfactory (if tests ran)?

**Options**:
A) Approve and continue to Coverage Report
B) Request additional E2E test scenarios for gaps
C) Request changes to existing scenarios

[Answer]:
```

**Wait for explicit user approval** before proceeding to Coverage Report stage.

**Approval Message Format** (if BLOCKING violations exist):

```markdown
**E2E Workflow Validation Stage — BLOCKING VIOLATIONS FOUND**

❌ Cannot proceed — the following BLOCKING rules are violated:

### Violations
- **E2E-01 (Traceability)**: User stories {list} lack E2E scenarios
- **E2E-02 (Critical Coverage)**: Critical workflow "{name}" lacks E2E coverage
- **E2E-03 (Cross-Service)**: Cross-service workflow "{name}" not validated

### Impact
These violations prevent progression to Coverage Report stage per E2E Test Standards extension.

---

**Options**:
A) Generate additional scenarios to resolve violations
B) Mark user stories as non-critical (exclude from E2E requirement)
C) Disable E2E Test Standards extension for this unit (not recommended)

[Answer]:
```

**Log user response in audit.md** with complete raw input.

---

## Integration with Workflow

### Input From
- User Stories stage (user story definitions)
- Requirements Analysis (if User Stories skipped)
- Regression Run results

### Output To
- Coverage Report (E2E workflow coverage included in overall coverage analysis)
- Feature Documentation (E2E test scenarios referenced in "How to Test Manually" section)

### Extension Loading

E2E Test Standards extension is loaded for this stage. See `extensions/testing/e2e-test-standards.md` for enforcement rules.

---

## Best Practices

1. **Focus on user value**: E2E scenarios validate user outcomes, not technical implementation
2. **Keep scenarios tool-agnostic**: Scenarios should work with any E2E framework (Playwright, Cypress, Selenium, etc.)
3. **Include error cases**: Happy path + critical failures (auth, payment, network)
4. **Cross-service validation**: Verify data consistency across service boundaries
5. **Separate scenarios from code**: Scenarios are documentation, code is implementation
6. **Update scenarios when requirements change**: E2E scenarios are living documentation
7. **Document data validation**: Specify what data changes are expected (database, queue, external systems)
8. **Use realistic workflows**: Base scenarios on actual user behavior, not theoretical paths
