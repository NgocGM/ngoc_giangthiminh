
import { test, expect } from '@playwright/test';
import { LoginPage } from '../page/LoginPage';
import { BookStorePage } from '../page/BookStorePage';
import { ProfilePage } from '../page/ProfilePage';

test.describe('Book Store - Delete Book Tests', () => {
  // Test data
  const bookToDelete = 'Git Pocket Guide';
  const testUsername = 'Pucca1';
  const testPassword = 'Pucca@1234';

  // Page Objects
  let loginPage: LoginPage;
  let bookStorePage: BookStorePage;
  let profilePage: ProfilePage;

  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);

    // Initialize Page Objects
    loginPage = new LoginPage(page);
    bookStorePage = new BookStorePage(page);
    profilePage = new ProfilePage(page);

    console.log('\n===== Setup: Login and Add Book =====');
    console.log(`Test User: ${testUsername}`);

    // Step 1: Navigate and Login
    await loginPage.navigateTo();
    await loginPage.login(testUsername, testPassword);
    console.log('✅ Login successful');

    // Wait for page to settle after login
    await page.waitForTimeout(2000);
    console.log('Waited 2 seconds after login');

    // Step 2: Add book to collection
    await bookStorePage.navigateTo();
    await bookStorePage.enterSearchKeyword(bookToDelete);
    await bookStorePage.addBookToCollection(bookToDelete);
    console.log(`✅ Added "${bookToDelete}" to collection`);
  });

  test('Scenario 3: Delete book successfully', async ({ page }) => {
    test.setTimeout(45000);

    console.log('\n===== Scenario 3: Delete Book Successfully =====');
    console.log(`User: ${testUsername}`);
    console.log(`Book to delete: ${bookToDelete}`);

    // Navigate to Profile
    await profilePage.navigateTo();

    // Delete the book (complete flow: search → click delete → confirm → handle alert)
    await profilePage.deleteBook(bookToDelete);

    // Verification: Check if book is deleted
    console.log('\n----- Verification: Confirm book is deleted -----');
    const bookStillExists = await profilePage.isBookDeleted(bookToDelete);

    // Assertion
    expect(bookStillExists).toBe(false);
    console.log('✅ PASS: Book successfully deleted from collection');
  });
});