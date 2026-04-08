/**
 * Page Object Model Template
 *
 * This template generates Playwright page objects for E2E tests.
 * Replace placeholders with actual values from the E2E scenario.
 */

import { Page, Locator } from '@playwright/test';

export class {{PageObjectClass}} {
  constructor(private page: Page) {}

  /**
   * Locators - Use data-testid selectors (PLAY-E2E-03)
   *
   * Define locators as methods that return Locator objects.
   * Use arrow functions for consistency.
   */

  // Primary action elements
  readonly {{primaryElement1}} = () => this.page.locator('[data-testid="{{testid-1}}"]');
  readonly {{primaryElement2}} = () => this.page.locator('[data-testid="{{testid-2}}"]');
  readonly {{primaryElement3}} = () => this.page.locator('[data-testid="{{testid-3}}"]');

  // Input fields
  readonly {{inputField1}} = () => this.page.locator('[data-testid="{{input-testid-1}}"]');
  readonly {{inputField2}} = () => this.page.locator('[data-testid="{{input-testid-2}}"]');

  // Verification elements
  readonly {{verificationElement1}} = () => this.page.locator('[data-testid="{{verify-testid-1}}"]');
  readonly {{errorElement}} = () => this.page.locator('[data-testid="{{error-testid}}"]');

  /**
   * Navigation
   */
  async navigate(): Promise<void> {
    await this.page.goto('{{PAGE_URL}}');
  }

  /**
   * Actions - Map to test steps from E2E scenario
   */

  async {{action1Method}}(): Promise<void> {
    await this.{{primaryElement1}}().click();
  }

  async {{action2Method}}({{param1}}: {{param1Type}}): Promise<void> {
    await this.{{inputField1}}().fill({{param1}});
  }

  async {{action3Method}}(data: {{DataInterface}}): Promise<void> {
    await this.{{inputField1}}().fill(data.field1);
    await this.{{inputField2}}().fill(data.field2);
  }

  async {{submitActionMethod}}(): Promise<void> {
    await this.{{primaryElement3}}().click();
  }

  /**
   * Getters - For verifications
   */

  async {{getter1}}(): Promise<string> {
    return await this.{{verificationElement1}}().textContent() || '';
  }

  {{getter2Element}}(): Locator {
    return this.{{verificationElement1}}();
  }

  {{errorGetter}}(): Locator {
    return this.{{errorElement}}();
  }

  /**
   * Utility methods (optional)
   */

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async {{customWaitMethod}}(): Promise<void> {
    await this.{{verificationElement1}}().waitFor({ state: 'visible' });
  }
}

/**
 * Data Interfaces
 *
 * Define interfaces for complex input data
 */
export interface {{DataInterface}} {
  field1: string;
  field2: string;
  // Add more fields as needed
}

/**
 * TEMPLATE USAGE NOTES:
 *
 * Placeholders to replace:
 * - {{PageObjectClass}}: Page object class name (e.g., CheckoutPage, LoginPage)
 * - {{PAGE_URL}}: Page URL path (e.g., /checkout, /auth/login)
 * - {{primaryElementX}}: Primary action element names (e.g., submitButton, loginButton)
 * - {{testid-X}}: data-testid attribute values
 * - {{inputFieldX}}: Input field names (e.g., usernameInput, cardNumberInput)
 * - {{verificationElementX}}: Elements for verification (e.g., confirmationMessage, errorBanner)
 * - {{actionXMethod}}: Method names for actions (e.g., submitOrder, enterCredentials)
 * - {{paramX}}: Method parameter names
 * - {{paramXType}}: Parameter types
 * - {{DataInterface}}: Interface name for complex data (e.g., PaymentInfo, UserCredentials)
 * - {{getterX}}: Getter method names (e.g., getOrderTotal, getErrorMessage)
 * - {{customWaitMethod}}: Custom wait method names (e.g., waitForOrderConfirmation)
 *
 * Best practices:
 * 1. One page object per page/component
 * 2. All locators use data-testid selectors
 * 3. Locators are methods returning Locator objects
 * 4. Actions return Promise<void>
 * 5. Getters return Promise<string> or Locator
 * 6. Group related elements together
 * 7. Add TypeScript interfaces for complex data
 *
 * Example populated template: See sample-output/ directory
 */
