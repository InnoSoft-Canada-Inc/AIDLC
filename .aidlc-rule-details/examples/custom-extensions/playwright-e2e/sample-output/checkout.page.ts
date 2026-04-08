/**
 * Page Object: Checkout Page
 *
 * Generated for E2E scenario: E2E-US-001 (Complete Checkout Workflow)
 *
 * This is a SAMPLE OUTPUT showing what the Playwright E2E extension generates.
 * Follows Page Object Model pattern (PLAY-E2E-02)
 */

import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  constructor(private page: Page) {}

  /**
   * Locators - All use data-testid selectors (PLAY-E2E-03)
   */

  // Shipping section
  readonly shippingAddressField = () => this.page.locator('[data-testid="shipping-address"]');
  readonly confirmShippingButton = () => this.page.locator('[data-testid="confirm-shipping"]');
  readonly standardShippingOption = () => this.page.locator('[data-testid="shipping-standard"]');
  readonly expressShippingOption = () => this.page.locator('[data-testid="shipping-express"]');
  readonly shippingCostDisplay = () => this.page.locator('[data-testid="shipping-cost"]');

  // Order summary section
  readonly orderSummarySection = () => this.page.locator('[data-testid="order-summary"]');
  readonly orderTotalDisplay = () => this.page.locator('[data-testid="order-total"]');
  readonly cartItemCount = () => this.page.locator('[data-testid="cart-item-count"]');

  // Payment section
  readonly cardNumberInput = () => this.page.locator('[data-testid="card-number"]');
  readonly cvvInput = () => this.page.locator('[data-testid="cvv"]');
  readonly expiryInput = () => this.page.locator('[data-testid="expiry"]');
  readonly submitOrderButton = () => this.page.locator('[data-testid="submit-order"]');

  // Confirmation section
  readonly orderConfirmation = () => this.page.locator('[data-testid="order-confirmation"]');
  readonly orderNumberDisplay = () => this.page.locator('[data-testid="order-number"]');

  // Error elements
  readonly paymentErrorBanner = () => this.page.locator('[data-testid="payment-error"]');
  readonly inventoryErrorBanner = () => this.page.locator('[data-testid="inventory-error"]');
  readonly networkErrorBanner = () => this.page.locator('[data-testid="network-error"]');
  readonly retryButton = () => this.page.locator('[data-testid="retry-payment"]');

  /**
   * Navigation
   */
  async navigate(): Promise<void> {
    await this.page.goto('/checkout');
    await this.waitForPageLoad();
  }

  /**
   * Shipping Actions
   */
  async confirmShipping(): Promise<void> {
    await this.confirmShippingButton().click();
  }

  async selectStandardShipping(): Promise<void> {
    await this.standardShippingOption().click();
  }

  async selectExpressShipping(): Promise<void> {
    await this.expressShippingOption().click();
  }

  /**
   * Order Review Actions
   */
  async reviewOrderSummary(): Promise<void> {
    await this.orderSummarySection().scrollIntoViewIfNeeded();
  }

  /**
   * Payment Actions
   */
  async enterPaymentInfo(payment: PaymentInfo): Promise<void> {
    await this.cardNumberInput().fill(payment.cardNumber);
    await this.cvvInput().fill(payment.cvv);
    await this.expiryInput().fill(payment.expiry);
  }

  async submitOrder(): Promise<void> {
    await this.submitOrderButton().click();
  }

  async retryPayment(): Promise<void> {
    await this.retryButton().click();
  }

  /**
   * Getters - For verifications
   */
  async getShippingAddress(): Promise<string> {
    return await this.shippingAddressField().textContent() || '';
  }

  async getShippingCost(): Promise<string> {
    return await this.shippingCostDisplay().textContent() || '';
  }

  async getOrderTotal(): Promise<string> {
    return await this.orderTotalDisplay().textContent() || '';
  }

  async getCartItemCount(): Promise<string> {
    return await this.cartItemCount().textContent() || '';
  }

  async getOrderNumber(): Promise<string> {
    return await this.orderNumberDisplay().textContent() || '';
  }

  /**
   * Element getters (for assertions)
   */
  getOrderConfirmation(): Locator {
    return this.orderConfirmation();
  }

  getPaymentError(): Locator {
    return this.paymentErrorBanner();
  }

  getInventoryError(): Locator {
    return this.inventoryErrorBanner();
  }

  getNetworkError(): Locator {
    return this.networkErrorBanner();
  }

  /**
   * Utility methods
   */
  private async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async waitForOrderConfirmation(): Promise<void> {
    await this.orderConfirmation().waitFor({ state: 'visible', timeout: 10000 });
  }
}

/**
 * Data Interfaces
 */
export interface PaymentInfo {
  cardNumber: string;
  cvv: string;
  expiry: string;
}
