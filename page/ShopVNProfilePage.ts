import { Page, Locator } from '@playwright/test';

export class ShopVNProfilePage {
  fullNameInput: Locator;
  saveButton: Locator;
  successMessage: Locator;
  errorMessage: Locator;

  PROFILE_URL = 'https://testing.platformforge.dev/profile';

  constructor(public page: Page) {
    this.fullNameInput = page.locator(
      '[data-testid="profile-name"]'
    );

    this.saveButton = page.locator(
      '[data-testid="profile-save"]'
    );

    this.successMessage = page.locator(
      '[class*="success"], [class*="alert-success"]'
    ).first();

    this.errorMessage = page.locator(
      '[class*="error"], [class*="alert-danger"]'
    ).first();
  }

  async navigateTo() {
    await this.page.goto(this.PROFILE_URL);
    await this.page.waitForLoadState('domcontentloaded');

    await this.fullNameInput.waitFor({
      state: 'visible'
    });
  }

  async fillFullName(fullName: string) {
    await this.fullNameInput.fill(fullName);
  }

  async clickSave() {
    await this.saveButton.click();
  }

  async updateFullName(fullName: string) {
    await this.fillFullName(fullName);
    await this.clickSave();
  }

  async getFullName(): Promise<string> {
    return (await this.fullNameInput.inputValue()).trim();
  }

  async isSuccessMessageDisplayed(): Promise<boolean> {
    try {
      await this.successMessage.waitFor({
        state: 'visible',
        timeout: 3000
      });

      return true;
    } catch {
      return false;
    }
  }

  async getSuccessMessage(): Promise<string> {
    return (
      (await this.successMessage.textContent())?.trim() || ''
    );
  }

  async isErrorMessageDisplayed(): Promise<boolean> {
    try {
      await this.errorMessage.waitFor({
        state: 'visible',
        timeout: 3000
      });

      return true;
    } catch {
      return false;
    }
  }
}