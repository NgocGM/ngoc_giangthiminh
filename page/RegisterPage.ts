
import { Page, Locator } from '@playwright/test';

export class RegisterPage {
  firstNameInput: Locator;
  lastNameInput: Locator;
  usernameInput: Locator;
  passwordInput: Locator;
  registerButton: Locator;

  REGISTER_URL = 'https://demoqa.com/register';

  constructor(public page: Page) {
    // Initialize locators using semantic role selectors (matching recorded test approach)
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.usernameInput = page.getByRole('textbox', { name: 'UserName' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.registerButton = page.getByRole('button', { name: 'Register' });
  }

  async navigateTo() {
    await this.page.goto(this.REGISTER_URL);
  }

  async register(
    firstName: string,
    lastName: string,
    username: string,
    password: string
  ) {
    console.log(`Filling First Name: ${firstName}`);
    await this.firstNameInput.click();
    await this.firstNameInput.fill(firstName);

    console.log(`Filling Last Name: ${lastName}`);
    await this.lastNameInput.click();
    await this.lastNameInput.fill(lastName);

    console.log(`Filling Username: ${username}`);
    await this.usernameInput.click();
    await this.usernameInput.fill(username);

    console.log(`Filling Password: ${password}`);
    await this.passwordInput.click();
    await this.passwordInput.fill(password);

    console.log('Clicking Register button...');
    await this.registerButton.click();
    await this.page.waitForTimeout(2000); // Wait for the registration response to process

    // Debug: Check if there's an error message (reCAPTCHA or other)
    try {
      const errorElement = this.page.locator('text=Please verify reCaptcha');
      const isErrorVisible = await errorElement.isVisible().catch(() => false);
      if (isErrorVisible) {
        console.error('❌ reCAPTCHA error detected');
        throw new Error('Registration failed: reCAPTCHA verification required');
      }
    } catch (e) {
      console.log('No reCAPTCHA error detected');
    }

    // Wait for OK button to appear
    console.log('Waiting for registration response...');
    const okButton = this.page.getByRole('button', { name: 'OK', exact: true });
    
    try {
      // Take screenshot before waiting for button
      await this.page.screenshot({ path: 'debug-before-ok.png' });
      console.log('Screenshot saved: debug-before-ok.png');
      
      await okButton.waitFor({ state: 'visible', timeout: 10000 });
      console.log('✅ OK button appeared');
    } catch (error) {
      console.error('❌ OK button NOT found within 10 seconds');
      // Take screenshot to see what's on page
      await this.page.screenshot({ path: 'debug-no-ok-button.png' });
      console.log('Screenshot saved: debug-no-ok-button.png');
      
      // Try to find any alert/modal/dialog elements
      const alertDialogs = await this.page.locator('[role="alertdialog"], .modal, .alert, .react-modal').count();
      console.log(`Found ${alertDialogs} dialog elements`);
      
      console.log('⚠️ Registration popup not found - will use fallback account');
      throw new Error(`REGISTRATION_POPUP_NOT_FOUND`);
    }

    // Click the OK button
    console.log('Clicking OK button...');
    await okButton.click();
    console.log('✅ Clicked OK button');

    // Wait for page to load stable after modal closes
    await this.page.waitForLoadState('networkidle');
    console.log('✅ Registration completed successfully - page loaded');
  }
}