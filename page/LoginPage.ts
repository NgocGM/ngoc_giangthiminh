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
    console.log(`Filled Username: ${username}`);
  }

  async fillPassword(password: string) {
    await this.passwordInput.click();
    await this.passwordInput.fill(password);
    console.log(`Filled Password: ${password}`);
  }

  async clickLogin() {
    console.log('Clicking Login button...');
    await this.loginButton.click();
    
    // Wait for page navigation after login (redirect to dashboard/book store)
    await this.page.waitForURL('**/profile', { timeout: 15000 }).catch(() => {
      console.log('Dashboard URL not detected, waiting for network idle instead');
    });
    
    // // Also wait for network to settle
    // await this.page.waitForLoadState('networkidle');
    // console.log('✅ Login page load complete');
  }

  async login(username: string, password: string) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  async clickNewUser() {
    await this.newUserButton.click();
    console.log('Clicking New User button...');
    await this.page.waitForURL('**/register', { timeout: 15000 });
    console.log('Navigated to register page');
  }

  async clickBackToLogin() {
    await this.backToLoginButton.click();
    console.log('Clicking Back to Login button...');
    await this.page.waitForLoadState('domcontentloaded');
  }
}
