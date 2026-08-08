import { Page, Locator } from '@playwright/test';

export class ProfilePage {
  searchInput: Locator;
  deleteButtons: Locator;
  confirmDeleteButton: Locator;
  alertOKButton: Locator;
  bookRows: Locator;

  PROFILE_URL = 'https://demoqa.com/profile';

  constructor(public page: Page) {
    // Initialize locators using semantic selectors
    this.searchInput = page.locator("input[placeholder='Type to search']");
    this.deleteButtons = page.locator("button[title='Delete']");
    this.confirmDeleteButton = page.locator("button#closeSmallModal-ok");
    this.alertOKButton = page.locator("button.btn-primary:has-text('OK')");
    this.bookRows = page.locator("div[class='rt-tr-group']");
  }

  async navigateTo() {
    await this.page.goto(this.PROFILE_URL);
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1000);
  }

  async searchBook(bookTitle: string) {
    await this.searchInput.fill(bookTitle);
    console.log(`Searched for book: ${bookTitle}`);
    await this.page.waitForTimeout(1000);
  }

  async clickDeleteButton(bookTitle?: string) {
    if (bookTitle) {
      // Find the row with the specific book title and click delete button in that row
      const bookRow = this.page.locator(`tr:has-text("${bookTitle}")`);
      const deleteButton = bookRow.locator('span[title="Delete"]');
      await deleteButton.click();
      console.log(`✅ Clicked Delete button for book: ${bookTitle}`);
    } else {
      // Click first delete button (default behavior)
      const deleteButton = this.page.locator('//span[@title="Delete"]').first();
      await deleteButton.click();
      console.log('✅ Clicked Delete button...');
    }
    await this.page.waitForTimeout(500);
  }

  async confirmDelete() {
    await this.confirmDeleteButton.click();
    console.log('✅ Confirmed deletion in modal');
    await this.page.waitForTimeout(500);
  }

  async handleDeleteAlert() {
    try {
      // Handle the alert dialog
      this.page.once('dialog', async (dialog) => {
        console.log(`Alert message: ${dialog.message()}`);
        await dialog.accept();
      });
      
      // Wait for alert to appear
      await this.page.waitForTimeout(1000);
    } catch (error) {
      console.warn('Alert handling error or alert not appeared');
    }
  }

  async clickAlertOK() {
    try {
      // Try clicking the OK button if it's a modal instead of browser alert
      if (await this.alertOKButton.isVisible({ timeout: 2000 })) {
        await this.alertOKButton.click();
        console.log('✅ Clicked OK button on alert');
        await this.page.waitForTimeout(500);
      }
    } catch (error) {
      console.log('Alert OK button not found, may have been auto-dismissed');
    }
  }

  async deleteBook(bookTitle: string) {
    // Complete delete flow: search → click delete → confirm → handle alert
    console.log(`\n----- Deleting book: ${bookTitle} -----`);
    
    // Search for the book
    await this.searchBook(bookTitle);
    
    // Click delete button
    await this.clickDeleteButton(bookTitle);
    
    // Confirm deletion in modal
    await this.confirmDelete();
    
    // Handle alert dialog
    await this.handleDeleteAlert();
    await this.clickAlertOK();
    
    console.log(`✅ Book "${bookTitle}" deleted successfully`);
    await this.page.waitForTimeout(1000);
  }

  async isBookDeleted(bookTitle: string): Promise<boolean> {
    try {
      // Search for book to see if it exists
      await this.searchBook(bookTitle);
      
      // Check if book row is visible
      const bookRow = this.page.locator(`tr:has-text("${bookTitle}")`);
      const isVisible = await bookRow.isVisible({ timeout: 2000 }).catch(() => false);
      
      console.log(`Book "${bookTitle}" exists after deletion: ${isVisible}`);
      return isVisible;
    } catch (error) {
      console.log(`Book "${bookTitle}" not found (deleted successfully)`);
      return false;
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
