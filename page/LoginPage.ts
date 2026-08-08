import { Page, Locator } from '@playwright/test';

export class LoginPage {
  usernameInput: Locator;
  passwordInput: Locator;
  loginButton: Locator;
  newUserButton: Locator;
  backToLoginButton: Locator;

  LOGIN_URL = 'https://demoqa.com/login';

  constructor(public page: Page) {
    // Initialize locators using semantic role selectors (matching test-1 approach)
    this.usernameInput = page.getByRole('textbox', { name: 'UserName' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.locator('//*[@id="login"]');
    this.newUserButton = page.getByRole('button', { name: 'New User' });
    this.backToLoginButton = page.getByRole('button', { name: 'Back to Login' });
  }

  async navigateTo() {
    await this.page.goto(this.LOGIN_URL);
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
    
    // Wait for page navigation after login
    await this.page.waitForURL('**/profile', { timeout: 15000 }).catch(() => {
      // Fallback if URL doesn't match expected pattern
    });
  }

  async login(username: string, password: string) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  async clickNewUser() {
    await this.newUserButton.click();
    await this.page.waitForURL('**/register', { timeout: 15000 });
    console.log('Navigated to register page');
  }

  async clickBackToLogin() {
    await this.backToLoginButton.click();
    console.log('Clicking Back to Login button...');
    await this.page.waitForLoadState('domcontentloaded');
  }
}
