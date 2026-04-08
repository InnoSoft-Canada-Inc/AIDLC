/**
 * Playwright Test Template
 *
 * This template generates Playwright tests from E2E test scenarios.
 * Replace placeholders with actual values from the E2E scenario.
 */

import { test, expect } from '@playwright/test';
import { {{PageObjectClass}} } from '../pages/{{page-object-file}}';

test.describe('{{SCENARIO_ID}}: {{SCENARIO_NAME}}', () => {
  // Use authentication fixture if scenario requires authenticated user
  {{#if_requires_auth}}
  test.use({ storageState: 'auth.json' });
  {{/if_requires_auth}}

  test('{{TEST_NAME}} - happy path', async ({ page }) => {
    // Initialize page object
    const {{pageObjectInstance}} = new {{PageObjectClass}}(page);

    // Step 1: {{STEP_1_DESCRIPTION}}
    await {{pageObjectInstance}}.{{step1Method}}();
    {{#if step1_verification}}
    expect(await {{pageObjectInstance}}.{{step1VerificationGetter}}()).{{step1Assertion}};
    {{/if}}

    // Step 2: {{STEP_2_DESCRIPTION}}
    await {{pageObjectInstance}}.{{step2Method}}();
    {{#if step2_verification}}
    expect(await {{pageObjectInstance}}.{{step2VerificationGetter}}()).{{step2Assertion}};
    {{/if}}

    // Step 3: {{STEP_3_DESCRIPTION}}
    await {{pageObjectInstance}}.{{step3Method}}();

    // Final verification: {{SUCCESS_CRITERIA}}
    await expect({{pageObjectInstance}}.{{finalVerificationElement}}()).{{finalAssertion}};
  });

  {{#each error_scenarios}}
  test('{{TEST_NAME}} - {{error_case_name}}', async ({ page }) => {
    const {{pageObjectInstance}} = new {{PageObjectClass}}(page);

    // Setup error condition
    {{#each setup_steps}}
    await {{step}};
    {{/each}}

    // Trigger error scenario
    await {{pageObjectInstance}}.{{errorTriggerMethod}}();

    // Verify error handling
    await expect({{pageObjectInstance}}.{{errorElement}}()).{{errorAssertion}};

    // Verify recovery (if applicable)
    {{#if recovery_verification}}
    await expect({{pageObjectInstance}}.{{recoveryElement}}()).{{recoveryAssertion}};
    {{/if}}
  });
  {{/each}}
});

/**
 * TEMPLATE USAGE NOTES:
 *
 * Placeholders to replace:
 * - {{SCENARIO_ID}}: E2E scenario ID (e.g., E2E-US-001)
 * - {{SCENARIO_NAME}}: Human-readable scenario name
 * - {{PageObjectClass}}: Page object class name (e.g., CheckoutPage)
 * - {{page-object-file}}: Page object file name (e.g., checkout.page.ts)
 * - {{pageObjectInstance}}: Instance variable name (e.g., checkoutPage)
 * - {{TEST_NAME}}: Test case name
 * - {{STEP_X_DESCRIPTION}}: Description of test step
 * - {{stepXMethod}}: Page object method to call
 * - {{stepXVerificationGetter}}: Method to get verification data
 * - {{stepXAssertion}}: Playwright assertion (e.g., toBe, toContain)
 * - {{SUCCESS_CRITERIA}}: Final success verification
 * - {{finalVerificationElement}}: Element to verify success
 * - {{finalAssertion}}: Final assertion
 *
 * Conditional blocks:
 * - {{#if_requires_auth}}: Include if scenario requires authentication
 * - {{#if stepX_verification}}: Include if step has intermediate verification
 * - {{#each error_scenarios}}: Iterate over error scenarios from E2E scenario
 * - {{#if recovery_verification}}: Include if error has recovery verification
 *
 * Example populated template: See sample-output/checkout.spec.ts
 */
