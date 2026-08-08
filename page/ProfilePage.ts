import { Page, Locator } from '@playwright/test';

export class ProfilePage {
  searchInput: Locator;
  confirmDeleteButton: Locator;
  alertOKButton: Locator;

  PROFILE_URL = 'https://demoqa.com/profile';

  constructor(public page: Page) {
    this.searchInput = page.locator("input[placeholder='Type to search']");
    this.confirmDeleteButton = page.locator("button#closeSmallModal-ok");
    this.alertOKButton = page.locator("button.btn-primary:has-text('OK')");
  }

  async navigateTo() {
    await this.page.goto(this.PROFILE_URL);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async searchBook(bookTitle: string) {
    await this.searchInput.fill(bookTitle);
  }

  async clickDeleteButton(bookTitle?: string) {
    if (bookTitle) {
      const bookRow = this.page.locator(`tr:has-text("${bookTitle}")`);
      const deleteButton = bookRow.locator('span[title="Delete"]');
      await deleteButton.click();
    } else {
      const deleteButton = this.page.locator('//span[@title="Delete"]').first();
      await deleteButton.click();
    }
  }

  async confirmDelete() {
    await this.confirmDeleteButton.click();
  }

  async handleDeleteAlert() {
    try {
      this.page.once('dialog', async (dialog) => {
        await dialog.accept();
      });
      
      await this.page.waitForTimeout(500);
    } catch (error) {
      // Alert handling error
    }
  }

  async clickAlertOK() {
    try {
      if (await this.alertOKButton.isVisible({ timeout: 2000 })) {
        await this.alertOKButton.click();
      }
    } catch (error) {
      // Alert OK button not found
    }
  }

  async deleteBook(bookTitle: string) {
    // Complete delete flow: search → click delete → confirm → handle alert
    await this.searchBook(bookTitle);
    await this.clickDeleteButton(bookTitle);
    await this.confirmDelete();
    await this.handleDeleteAlert();
    await this.clickAlertOK();
  }

  async isBookDeleted(bookTitle: string): Promise<boolean> {
    try {
      await this.searchBook(bookTitle);
      
      const bookRow = this.page.locator(`tr:has-text("${bookTitle}")`);
      const isVisible = await bookRow.isVisible({ timeout: 2000 }).catch(() => false);
      
      return isVisible;
    } catch (error) {
      return false;
    }
  }
}

  async isBookDisplayed(bookTitle: string): Promise<boolean> {
    try {
      const bookRow = this.page.locator(`text=${bookTitle}`);
      await bookRow.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async getBookCount(): Promise<number> {
    const rows = await this.bookRows.count();
    return rows;
  }
}
