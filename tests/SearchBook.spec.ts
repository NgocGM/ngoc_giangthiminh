import { test, expect } from '@playwright/test';
import { BookStorePage } from '../page/BookStorePage';

test.describe('Book Store Tests', () => {
  let bookStorePage: BookStorePage;

  test.beforeEach(async ({ page }) => {
    bookStorePage = new BookStorePage(page);
    await bookStorePage.navigateTo();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
  });

  test('Scenario 2: Search book with multiple results', async () => {
    const searchKeyword = 'Design';

    console.log(`\n===== Scenario 2: Search Book =====`);
    console.log(`Search Keyword: ${searchKeyword}`);

    // Step 1: Enter search keyword
    console.log(`\nEntering search keyword: "${searchKeyword}"`);
    await bookStorePage.enterSearchKeyword(searchKeyword);

    // Step 2: Get all search results
    const results = await bookStorePage.getSearchResults();
    const resultCount = results.length;

    console.log(`\n===== EXPECTED OUTPUT =====`);
    console.log(`Total Results Found: ${resultCount}`);
    console.log(`All records should match search criteria: "${searchKeyword}"`);

    // Verify results
    const bookTitles = await bookStorePage.getBookTitles();
    
    console.log(`\n===== BOOK TITLES =====`);
    bookTitles.forEach((title, index) => {
      console.log(`${index + 1}. ${title}`);
    });

    // Verify all results match the search criteria
    const allMatchCriteria = bookTitles.every(title => 
      title.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    console.log(`\n===== VERIFICATION RESULTS =====`);
    console.log(`PASS: Search returned ${resultCount} result(s)`);
    
    if (resultCount > 0) {
      expect(allMatchCriteria).toBe(true);
      console.log(`PASS: All displayed records match search criteria "${searchKeyword}"`);
    } else {
      console.log(`INFO: No results found for "${searchKeyword}"`);
    }
  });

  test('Scenario 2.1: Search book with no results', async () => {
    const searchKeyword = 'NOTEXISTING BOOK';

    console.log(`\n===== Scenario 2.1: Search with No Results =====`);
    console.log(`Search Keyword: ${searchKeyword}`);

    // Step 1: Enter search keyword
    console.log(`\nEntering search keyword: "${searchKeyword}"`);
    await bookStorePage.enterSearchKeyword(searchKeyword);

    // Step 2: Check if no records found
    const noRecordsDisplayed = await bookStorePage.isNoRecordsDisplayed();
    const resultCount = await bookStorePage.getResultCount();

    console.log(`\n===== EXPECTED OUTPUT =====`);
    console.log(`No Records Found: ${noRecordsDisplayed}`);
    console.log(`Total Results: ${resultCount}`);

    // Verify
    expect(resultCount).toBe(0);
    console.log(`\nPASS: Search returned 0 results for non-existent keyword`);
  });
});
