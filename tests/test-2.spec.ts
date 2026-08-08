import { test, expect } from '../fixtures/test';

test('Book Store Workflow: Login, Search, Add Book, Delete Book', async ({ page, loginPage, bookStorePage, profilePage }) => {
  const testUsername = 'Pucca1';
  const testPassword = 'Pucca@1234';
  const bookToAdd = 'Git Pocket Guide';

  // Login
  await loginPage.navigateTo();
  await loginPage.login(testUsername, testPassword);

  // Wait for page to settle
  await page.waitForTimeout(2000);

  // Navigate to Book Store and add book
  await bookStorePage.navigateTo();
  await bookStorePage.addBookToCollection(bookToAdd);

  // Navigate to Profile and delete book
  await profilePage.navigateTo();
  await profilePage.deleteBook(bookToAdd);

  // Verify deletion
  const bookStillExists = await profilePage.isBookDeleted(bookToAdd);
  expect(bookStillExists).toBe(false);
});
