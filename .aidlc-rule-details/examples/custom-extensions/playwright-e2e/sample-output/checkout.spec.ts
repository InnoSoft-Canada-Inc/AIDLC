/**
 * E2E Test: Complete Checkout Workflow
 *
 * Generated from E2E scenario: E2E-US-001
 * User Story: US-001 - As a customer, I want to complete a purchase
 *
 * This is a SAMPLE OUTPUT showing what the Playwright E2E extension generates.
 */

import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../pages/checkout.page';

test.describe('E2E-US-001: Complete Checkout Workflow', () => {
  // PLAY-E2E-01: Use authentication fixture
  test.use({ storageState: 'auth.json' });

  test('should complete purchase with valid payment - happy path', async ({ page }) => {
    // Initialize page object (PLAY-E2E-02: Page Object Model)
    const checkoutPage = new CheckoutPage(page);

    // Step 1: Navigate to checkout page
    await checkoutPage.navigate();

    // Step 2: Confirm shipping address
    await checkoutPage.confirmShipping();
    expect(await checkoutPage.getShippingAddress()).toContain('123 Main St');

    // Step 3: Select shipping method
    await checkoutPage.selectStandardShipping();
    expect(await checkoutPage.getShippingCost()).toBe('$5.99');

    // Step 4: Review order summary
    await checkoutPage.reviewOrderSummary();
    expect(await checkoutPage.getOrderTotal()).toBe('$105.99');

    // Step 5: Enter payment information
    await checkoutPage.enterPaymentInfo({
      cardNumber: '4242424242424242',
      cvv: '123',
      expiry: '12/25'
    });

    // Step 6: Submit order
    await checkoutPage.submitOrder();

    // Final verification: Order confirmation displayed
    await expect(checkoutPage.getOrderConfirmation()).toBeVisible();
    await expect(checkoutPage.getOrderNumber()).toMatch(/^ORD-\d{6}$/);
  });

  test('should handle invalid payment - error scenario', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.navigate();

    // Setup: Complete checkout through payment step
    await checkoutPage.confirmShipping();
    await checkoutPage.selectStandardShipping();

    // Trigger error: Enter invalid payment
    await checkoutPage.enterPaymentInfo({
      cardNumber: '0000000000000000', // Invalid card
      cvv: '123',
      expiry: '12/25'
    });

    await checkoutPage.submitOrder();

    // Verify error handling
    await expect(checkoutPage.getPaymentError()).toContainText('Invalid card number');

    // Verify recovery: Cart preserved
    await expect(checkoutPage.getCartItemCount()).toBe('2');
  });

  test('should handle out-of-stock during checkout - error scenario', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.navigate();

    // Simulate out-of-stock (would be setup in test data)
    // In real implementation, this might involve API mocking or test data setup

    await checkoutPage.confirmShipping();

    // Verify error handling
    await expect(checkoutPage.getInventoryError()).toContainText('Item no longer available');

    // Verify recovery: Cart updated
    await expect(checkoutPage.getCartItemCount()).toBe('1');
  });

  test('should handle network failure during payment - error scenario', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    // Setup: Simulate network failure
    await page.route('**/api/payments', route => route.abort('failed'));

    await checkoutPage.navigate();
    await checkoutPage.confirmShipping();
    await checkoutPage.selectStandardShipping();
    await checkoutPage.enterPaymentInfo({
      cardNumber: '4242424242424242',
      cvv: '123',
      expiry: '12/25'
    });

    await checkoutPage.submitOrder();

    // Verify error handling
    await expect(checkoutPage.getNetworkError()).toContainText('Please try again');

    // Verify retry mechanism
    await checkoutPage.retryPayment();
    await expect(checkoutPage.getOrderConfirmation()).toBeVisible();
  });
});
