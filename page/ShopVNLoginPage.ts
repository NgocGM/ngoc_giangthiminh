import { Page, Locator } from '@playwright/test';

export class ShopVNLoginPage {
  usernameInput: Locator;
  passwordInput: Locator;
  loginButton: Locator;
  errorMessage: Locator;

  LOGIN_URL = 'https://testing.platformforge.dev/login';

  constructor(public page: Page) {
    this.usernameInput = page.locator('input[data-testid="login-username"]').first();
    this.passwordInput = page.locator('input[type="password"]');
    this.loginButton = page.locator('button[data-testid="login-submit"]');
    this.errorMessage = page.locator('[class*="error"], [class*="alert"]').first();
  }

  async navigateTo() {
    await this.page.goto(this.LOGIN_URL);
    await this.page.waitForLoadState('networkidle');
  }

  async fillUsername(username: string) {
    await this.usernameInput.click();
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string) {
    await this.passwordInput.click();
    await this.passwordInput.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async login(username: string, password: string) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  async isErrorDisplayed(): Promise<boolean> {
    try {
      await this.errorMessage.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }
}
