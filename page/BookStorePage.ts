import { Page, Locator } from '@playwright/test';

export class BookStorePage {
  searchInput: Locator;
  bookRows: Locator;
  bookTitle: Locator;
  noRecordsFound: Locator;
  addToCollectionButton: Locator;

  BOOK_STORE_URL = 'https://demoqa.com/books';

  constructor(public page: Page) {
    // Initialize locators
    this.searchInput = page.locator('id=searchBox');
    this.bookRows = page.locator('div[class="rt-tr-group"]');
    this.bookTitle = page.locator('span[class*="rt-td"]');
    this.noRecordsFound = page.locator('text=No records found');
    this.addToCollectionButton = page.locator("button:has-text('Add to your collection')");
  }

  async navigateTo() {
    await this.page.goto(this.BOOK_STORE_URL);
  }

  async enterSearchKeyword(keyword: string) {
    await this.searchInput.fill(keyword);
    
    // Wait for search results to appear
    try {
      await this.page.waitForSelector('div.rt-tr-group, text=No records found', { timeout: 5000 });
    } catch (error) {
      // Results may not load immediately, continue anyway
    }
  }

  async getSearchResults() {
    return await this.bookRows.all();
  }

  async getBookTitles() {
    const rows = await this.bookRows.all();
    const titles: string[] = [];
    
    for (const row of rows) {
      const title = await row.locator('div[class="rt-td"]:first-child').textContent();
      if (title) {
        titles.push(title.trim());
      }
    }
    
    return titles;
  }

  async getResultCount() {
    const rows = await this.bookRows.all();
    return rows.length;
  }

  async isNoRecordsDisplayed() {
    try {
      await this.noRecordsFound.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickBookByTitle(bookTitle: string) {
    const bookLink = this.page.locator(`text=${bookTitle}`).first();
    await bookLink.click();
    console.log(`Clicked on book: ${bookTitle}`);
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1000);
  }

  async clickAddToCollection() {
    await this.addToCollectionButton.click();
    console.log('Clicked Add to your collection button');
    await this.page.waitForTimeout(1000);
  }

  async addBookToCollection(bookTitle: string) {
    await this.clickBookByTitle(bookTitle);
    await this.clickAddToCollection();
  }
}
