
import { test, expect } from '../fixtures/test';
import { StringUtils } from '../utils/StringUtils';

test.describe('Book Store - Delete Book Tests', () => {
  const bookToDelete = 'Git Pocket Guide';
  const testUsername = 'Pucca1';
  const testPassword = 'Pucca@1234';

  test.beforeEach(async ({ page, loginPage, bookStorePage }) => {
    // Login
    await loginPage.navigateTo();
    await loginPage.login(testUsername, testPassword);
    
    // Wait for page to settle
    await page.waitForTimeout(2000);

    // Add book to collection
    await bookStorePage.navigateTo();
    await bookStorePage.enterSearchKeyword(bookToDelete);
    await bookStorePage.addBookToCollection(bookToDelete);
  });

  test('Delete book successfully', async ({ profilePage }) => {
    // Navigate to Profile
    await profilePage.navigateTo();

    // Delete the book
    await profilePage.deleteBook(bookToDelete);

    // Verify deletion
    const bookStillExists = await profilePage.isBookDeleted(bookToDelete);
    expect(bookStillExists).toBe(false);
  });
});