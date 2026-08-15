import { Page, Locator } from '@playwright/test';

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
    this.receiverNameInput = page.locator('input[name="name"], input[placeholder*="Name"], input[placeholder*="Họ tên"]').first();
    this.receiverPhoneInput = page.locator('input[name="phone"], input[type="tel"], input[placeholder*="Phone"], input[placeholder*="Điện thoại"]').first();
    this.receiverAddressInput = page.locator('input[name="address"], textarea[name="address"], input[placeholder*="Address"], input[placeholder*="Địa chỉ"]').first();
    this.codPaymentOption = page.locator('input[value="COD"], label:has-text("COD"), label:has-text("Cash on Delivery")').first();
    this.placeOrderButton = page.locator('button:has-text("Place Order"), button:has-text("Đặt hàng"), button[type="submit"]').first();
    this.successMessage = page.locator('[class*="success"], [class*="alert-success"]').first();
    this.successHeading = page.locator('h1:has-text("Success"), h2:has-text("Success"), h1:has-text("Order"), h2:has-text("Order")').first();
  }

  async navigateTo() {
    await this.page.goto(this.CHECKOUT_URL);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillReceiverName(name: string) {
    await this.receiverNameInput.clear();
    await this.receiverNameInput.fill(name);
  }

  async fillReceiverPhone(phone: string) {
    await this.receiverPhoneInput.clear();
    await this.receiverPhoneInput.fill(phone);
  }

  async fillReceiverAddress(address: string) {
    await this.receiverAddressInput.clear();
    await this.receiverAddressInput.fill(address);
  }

  async selectCODPayment() {
    await this.codPaymentOption.click();
  }

  async fillReceiverInfo(name: string, phone: string, address: string) {
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
      await this.successMessage.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isOnSuccessPage(): Promise<boolean> {
    const url = this.page.url();
    return url.includes('success') || url.includes('order-confirm') || url.includes('thank');
  }

  async isCheckoutPageReady(): Promise<boolean> {
    try {
      await this.placeOrderButton.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}
