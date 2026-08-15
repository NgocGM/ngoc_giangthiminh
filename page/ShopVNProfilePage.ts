import { Page, Locator, APIRequestContext } from '@playwright/test';

export class ShopVNProfilePage {
  fullNameInput: Locator;
  emailInput: Locator;
  phoneInput: Locator;
  addressInput: Locator;
  saveButton: Locator;
  editButton: Locator;
  successMessage: Locator;
  errorMessage: Locator;

  PROFILE_URL = 'https://testing.platformforge.dev/profile';
  API_BASE_URL = 'https://testing.platformforge.dev/api';

  constructor(public page: Page, private request?: APIRequestContext) {
    this.fullNameInput = page.locator('input[placeholder*="Full Name"], input[name*="fullName"], input[name*="name"]').first();
    this.emailInput = page.locator('input[type="email"], input[placeholder*="Email"]');
    this.phoneInput = page.locator('input[type="tel"], input[placeholder*="Phone"]');
    this.addressInput = page.locator('textarea, input[placeholder*="Address"]');
    this.editButton = page.locator('button:has-text("Edit"), button:has-text("Edit Profile")').first();
    this.saveButton = page.locator('button:has-text("Save"), button:has-text("Update")').first();
    this.successMessage = page.locator('[class*="success"], [class*="alert-success"]').first();
    this.errorMessage = page.locator('[class*="error"], [class*="alert-danger"]').first();
  }

  async navigateTo() {
    await this.page.goto(this.PROFILE_URL);
    await this.page.waitForLoadState('networkidle');
  }

  async clickEdit() {
    await this.editButton.click();
    await this.page.waitForTimeout(500);
  }

  async fillFullName(fullName: string) {
    await this.fullNameInput.clear();
    await this.fullNameInput.fill(fullName);
  }

  async fillEmail(email: string) {
    await this.emailInput.clear();
    await this.emailInput.fill(email);
  }

  async fillPhone(phone: string) {
    await this.phoneInput.clear();
    await this.phoneInput.fill(phone);
  }

  async fillAddress(address: string) {
    await this.addressInput.clear();
    await this.addressInput.fill(address);
  }

  async clickSave() {
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async updateFullName(fullName: string) {
    await this.clickEdit();
    await this.fillFullName(fullName);
    await this.clickSave();
  }

  async getFullName(): Promise<string> {
    return await this.fullNameInput.inputValue();
  }

  async isSuccessMessageDisplayed(): Promise<boolean> {
    try {
      await this.successMessage.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async getSuccessMessage(): Promise<string> {
    return await this.successMessage.textContent() || '';
  }

  async isErrorMessageDisplayed(): Promise<boolean> {
    try {
      await this.errorMessage.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  // API method to update profile
  async updateProfileViaAPI(token: string, profileData: any) {
    if (!this.request) {
      throw new Error('APIRequestContext not provided');
    }

    const response = await this.request.put(`${this.API_BASE_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: profileData,
    });

    if (!response.ok()) {
      throw new Error(`Failed to update profile: ${response.status()}`);
    }

    return await response.json();
  }

  // API method to get profile
  async getProfileViaAPI(token: string) {
    if (!this.request) {
      throw new Error('APIRequestContext not provided');
    }

    const response = await this.request.get(`${this.API_BASE_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok()) {
      throw new Error(`Failed to get profile: ${response.status()}`);
    }

    return await response.json();
  }
}
