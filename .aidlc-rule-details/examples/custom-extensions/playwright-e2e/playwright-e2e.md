# Playwright E2E Test Extension

## Extension Type

Custom - Project-Specific

## Integration Point

**Option A** (Recommended): Testing & Validation Phase → After E2E Workflow Validation

**Option B**: Construction Phase → After Build and Test

**Choose Option A** if you want to generate Playwright test code immediately after E2E scenarios are created.

**Choose Option B** if you prefer to defer test code generation until after all units are built.

## Applicability

**Enable this extension only if**:
- Project uses Playwright for E2E testing
- E2E Test Standards extension is enabled (prerequisite)
- Team wants enforced Playwright patterns (POM, fixtures, selectors)

**Skip this extension if**:
- Using different E2E framework (Cypress, Selenium, etc.)
- E2E Test Standards disabled
- Team prefers manual E2E test implementation without templates

## Opt-In Prompt

**Question**: Does this project use Playwright for end-to-end testing?

**Enable if**:
- `playwright.config.ts` or `playwright.config.js` exists
- `package.json` includes `@playwright/test` dependency
- Team has decided on Playwright as E2E framework

**Skip if**:
- Using Cypress, Selenium, or other E2E framework
- No E2E testing framework chosen yet
- E2E tests will be written manually without code generation

## Rules

### PLAY-E2E-01: Use Playwright Test Fixtures (BLOCKING)

**When**: E2E tests are implemented or generated

**What**: All tests must use Playwright test fixtures for authentication and common setup

**Verification**:
- No tests manually handle login/authentication
- Tests use fixtures like `test.use({ storageState: 'auth.json' })`
- Auth fixtures defined in `playwright.config.ts` or separate fixture files

**Rationale**: Fixtures provide consistent auth state, reduce test flakiness, improve test speed

**Enforcement**: Blocking — Tests without fixtures are rejected

---

### PLAY-E2E-02: Page Object Model Pattern (BLOCKING)

**When**: E2E tests are implemented or generated

**What**: All page interactions must use Page Object Model (POM) pattern

**Verification**:
- No direct selectors in test files (`page.locator('button')` in test file = violation)
- All page interactions encapsulated in page object classes
- Page objects stored in `e2e/pages/` or `tests/pages/` directory

**Example Compliant**:
```typescript
// tests/pages/checkout.page.ts
export class CheckoutPage {
  readonly submitButton = () => this.page.locator('[data-testid="submit-order"]');

  async submitOrder() {
    await this.submitButton().click();
  }
}

// tests/checkout/complete-purchase.spec.ts
test('complete checkout', async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.submitOrder(); // ✅ Using page object
});
```

**Example Non-Compliant**:
```typescript
// tests/checkout/complete-purchase.spec.ts
test('complete checkout', async ({ page }) => {
  await page.locator('[data-testid="submit-order"]').click(); // ❌ Direct selector in test
});
```

**Rationale**: POM improves maintainability, reduces duplication, centralizes selector management

**Enforcement**: Blocking — Tests with direct selectors are rejected

---

### PLAY-E2E-03: Data-TestId Selectors (ADVISORY)

**When**: E2E tests are implemented or generated

**What**: Prefer `data-testid` selectors over CSS/XPath selectors

**Verification**:
- 80%+ of selectors use `[data-testid="..."]` pattern
- Avoid CSS class selectors (`.button-primary`)
- Avoid XPath selectors (`//button[@class="..."]`)

**Example Preferred**:
```typescript
page.locator('[data-testid="login-button"]')  // ✅ Stable, semantic
```

**Example Discouraged**:
```typescript
page.locator('.btn-primary')                  // ❌ CSS class may change
page.locator('button:nth-child(2)')           // ❌ Brittle, position-dependent
page.locator('//button[@class="primary"]')    // ❌ XPath, harder to read
```

**Rationale**: data-testid selectors are stable, semantic, resistant to styling changes

**Enforcement**: Advisory — Warns but doesn't block (80% threshold recommended, not enforced)

---

### PLAY-E2E-04: CI Retry Strategy (ADVISORY)

**When**: E2E tests run in CI environment

**What**: Configure retry strategy in `playwright.config.ts` (max 2 retries for flaky tests)

**Verification**:
- `playwright.config.ts` has `retries` configuration
- Retries set to 2 or fewer (not 3+, indicates flaky tests)
- Retries only enabled in CI, not locally

**Example Configuration**:
```typescript
// playwright.config.ts
export default defineConfig({
  retries: process.env.CI ? 2 : 0,  // ✅ Retry in CI, not locally
  // ...
});
```

**Rationale**: Limited retries handle transient failures, excessive retries mask flakiness

**Enforcement**: Advisory — Warns if retries not configured or set too high

---

## Enforcement

**Blocking Conditions** (prevents progression):
- Tests use direct selectors instead of page objects (PLAY-E2E-02)
- Tests manually handle authentication instead of fixtures (PLAY-E2E-01)

**Non-Blocking Advisories** (warns but allows progression):
- Excessive CSS/XPath selectors instead of data-testid (PLAY-E2E-03)
- Missing or excessive retry configuration (PLAY-E2E-04)

---

## Integration with Core E2E Extension

This custom extension **requires** the core E2E Test Standards extension:

1. **E2E Test Standards** (core):
   - Generates E2E test scenarios from user stories
   - Validates workflow coverage
   - Enforces traceability

2. **Playwright E2E** (this extension):
   - Generates Playwright test code from scenarios
   - Enforces Playwright-specific patterns (POM, fixtures)
   - Provides code templates

**Flow**:
```
User Stories → E2E Scenarios (core) → Playwright Test Code (this extension)
```

---

## Code Generation Templates

When this extension is enabled, code generation uses templates from `templates/` directory:

- `playwright-test-template.ts` — Standard test structure
- `page-object-template.ts` — Page object class template

**See**: `templates/` directory for complete templates

---

## Output Artifacts

When this extension is enabled:
- `aidlc-docs/{domain}/{unit}/testing/e2e-workflow-validation/playwright-implementation-plan.md`
- Generated test code in project's `e2e/` or `tests/` directory (per project structure)
- Page object classes in `e2e/pages/` or `tests/pages/`

---

## Best Practices

1. **One page object per page/component**: Don't create mega page objects
2. **Use test fixtures for auth**: Never hardcode credentials in tests
3. **Prefer data-testid**: Ask frontend team to add data-testid attributes
4. **Keep retries minimal**: Flaky tests should be fixed, not retried excessively
5. **Organize by user journey**: Mirror E2E scenario structure in test files

---

## Customization for Your Team

To customize this extension:

1. **Add team-specific rules** (e.g., "must use custom waitForStableState() helper")
2. **Update templates** with your team's preferred test structure
3. **Configure integration point** (after E2E Workflow Validation vs after Build and Test)
4. **Add custom templates** (auth fixtures, test data helpers, API mocking)

---

## Example Usage

**Scenario**: E2E-US-001 (Complete Checkout Workflow)

**Generated Playwright Test**:

```typescript
// tests/checkout/complete-purchase.spec.ts
import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../pages/checkout.page';

test.describe('E2E-US-001: Complete Checkout Workflow', () => {
  test.use({ storageState: 'auth.json' }); // PLAY-E2E-01: Use fixture

  test('should complete purchase with valid payment', async ({ page }) => {
    // Navigate to checkout
    const checkoutPage = new CheckoutPage(page); // PLAY-E2E-02: Use POM
    await checkoutPage.navigate();

    // Confirm shipping
    await checkoutPage.confirmShipping();
    expect(await checkoutPage.getShippingAddress()).toContain('123 Main St');

    // Select shipping method
    await checkoutPage.selectStandardShipping();

    // Submit payment
    await checkoutPage.enterPaymentInfo({
      cardNumber: '4242424242424242',
      cvv: '123',
      expiry: '12/25'
    });

    await checkoutPage.submitOrder();

    // Verify success
    await expect(checkoutPage.getOrderConfirmation()).toBeVisible();
  });

  test('should handle invalid payment', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.navigate();

    await checkoutPage.enterPaymentInfo({
      cardNumber: '0000000000000000', // Invalid
      cvv: '123',
      expiry: '12/25'
    });

    await checkoutPage.submitOrder();

    // Verify error displayed
    await expect(checkoutPage.getPaymentError()).toContainText('Invalid card');
  });
});
```

**Generated Page Object**:

```typescript
// tests/pages/checkout.page.ts
import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  constructor(private page: Page) {}

  // PLAY-E2E-03: Use data-testid selectors
  readonly shippingAddressField = () => this.page.locator('[data-testid="shipping-address"]');
  readonly standardShippingOption = () => this.page.locator('[data-testid="shipping-standard"]');
  readonly cardNumberInput = () => this.page.locator('[data-testid="card-number"]');
  readonly cvvInput = () => this.page.locator('[data-testid="cvv"]');
  readonly expiryInput = () => this.page.locator('[data-testid="expiry"]');
  readonly submitButton = () => this.page.locator('[data-testid="submit-order"]');
  readonly orderConfirmation = () => this.page.locator('[data-testid="order-confirmation"]');
  readonly paymentError = () => this.page.locator('[data-testid="payment-error"]');

  async navigate() {
    await this.page.goto('/checkout');
  }

  async confirmShipping() {
    await this.shippingAddressField().click();
  }

  async getShippingAddress(): Promise<string> {
    return await this.shippingAddressField().textContent() || '';
  }

  async selectStandardShipping() {
    await this.standardShippingOption().click();
  }

  async enterPaymentInfo(payment: { cardNumber: string; cvv: string; expiry: string }) {
    await this.cardNumberInput().fill(payment.cardNumber);
    await this.cvvInput().fill(payment.cvv);
    await this.expiryInput().fill(payment.expiry);
  }

  async submitOrder() {
    await this.submitButton().click();
  }

  getOrderConfirmation(): Locator {
    return this.orderConfirmation();
  }

  getPaymentError(): Locator {
    return this.paymentError();
  }
}
```
