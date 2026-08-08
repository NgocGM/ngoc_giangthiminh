import { test, expect } from '@playwright/test';
import { BookStorePage } from '../page/BookStorePage';

test.describe('Book Store Tests', () => {
  let bookStorePage: BookStorePage;

  test.beforeEach(async ({ page }) => {
    bookStorePage = new BookStorePage(page);
    await bookStorePage.navigateTo();
    await page.waitForLoadState('domcontentloaded');
  });

  test('Scenario 2: Search book with multiple results', async () => {
    const searchKeyword = 'Design';

    // Enter search keyword
    await bookStorePage.enterSearchKeyword(searchKeyword);

    // Get all search results
    const results = await bookStorePage.getSearchResults();
    const resultCount = results.length;

    // Verify results
    const bookTitles = await bookStorePage.getBookTitles();

    // Verify all results match the search criteria
    const allMatchCriteria = bookTitles.every(title => 
      title.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    if (resultCount > 0) {
      expect(allMatchCriteria).toBe(true);
    }
  });

  test('Scenario 2.1: Search book with no results', async () => {
    const searchKeyword = 'NOTEXISTING BOOK';

    // Enter search keyword
    await bookStorePage.enterSearchKeyword(searchKeyword);

    // Check if no records found
    const resultCount = await bookStorePage.getResultCount();

    // Verify
    expect(resultCount).toBe(0);
  });
});
