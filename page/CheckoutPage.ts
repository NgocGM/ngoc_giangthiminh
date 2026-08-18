import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  receiverNameInput: Locator;
  receiverPhoneInput: Locator;
  receiverAddressInput: Locator;
  codPaymentOption: Locator;
  placeOrderButton: Locator;
  successMessage: Locator;
  successHeading: Locator;

  CHECKOUT_URL = 'https://testing.platformforge.dev/checkout';

  constructor(public page: Page) {
    this.receiverNameInput = page.locator('input[data-testid="checkout-name"]');
    this.receiverPhoneInput = page.locator('input[data-testid="checkout-phone"]');
    this.receiverAddressInput = page.locator('input[data-testid="checkout-address"]');
    this.codPaymentOption = page.locator('input[type="radio"][value="cash"]');
    this.placeOrderButton = page.locator('button[data-testid="checkout-submit"]');
    this.successMessage = page.locator('[class*="success"], [class*="alert-success"]').first();
    this.successHeading = page.locator('[data-testid="checkout-success-heading"]');
  }

  async navigateTo() {
    await this.page.goto(this.CHECKOUT_URL);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillReceiverName(name: string) {
    await this.receiverNameInput.fill(name);
  }

  async fillReceiverPhone(phone: string) {
    await this.receiverPhoneInput.fill(phone);
  }

  async fillReceiverAddress(address: string) {
    await this.receiverAddressInput.fill(address);
  }

  async selectCODPayment() {
    await this.codPaymentOption.check();
  }

  async fillReceiverInfo(
    name: string,
    phone: string,
    address: string
  ) {
    await this.fillReceiverName(name);
    await this.fillReceiverPhone(phone);
    await this.fillReceiverAddress(address);
  }

  async clickPlaceOrder() {
    await this.placeOrderButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async isSuccessMessageDisplayed(): Promise<boolean> {
    try {
      await this.successMessage.waitFor({
        state: 'visible',
        timeout: 5000
      });
      return true;
    } catch {
      return false;
    }
  }

  async isOnSuccessPage(): Promise<boolean> {
    const url = this.page.url();

    return (
      url.includes('success') ||
      url.includes('order-confirm') ||
      url.includes('thank')
    );
  }

  async isCheckoutPageReady(): Promise<boolean> {
    try {
      await this.placeOrderButton.waitFor({
        state: 'visible',
        timeout: 5000
      });
      return true;
    } catch {
      return false;
    }
  }

  async expectCheckoutReady() {
    await expect(this.placeOrderButton).toBeVisible();
  }

  async expectOrderSuccess(expectedText: string) {
    await expect(this.successHeading).toBeVisible();
    await expect(this.successHeading).toHaveText(expectedText);
  }
}