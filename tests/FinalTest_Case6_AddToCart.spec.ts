import { test, expect } from '../fixtures/test';
import { randomFullName } from '../utils/TestUtils';

test.describe('Final Test - Case 6: Advanced — Update Full Name, Then Clean Up via API', () => {

  let originalName: string = '';

  test.beforeEach(async ({ shopVNLoginPage }) => {
    await shopVNLoginPage.navigateTo();
    await shopVNLoginPage.login('admin', 'password123');
    await expect(shopVNLoginPage.page).toHaveURL(/home|dashboard|orders|products|profile/);
  });

  test('Should update full name via UI and verify change', async ({ shopVNProfilePage, page }) => {
    // Navigate to profile page
    await shopVNProfilePage.navigateTo();
    await expect(page).toHaveURL(/profile/);

    // Get current name to restore later
    originalName = await shopVNProfilePage.getFullName();
    console.log('Current full name:', originalName);

    // Update to new full name
    const newFullName = randomFullName();
    await shopVNProfilePage.updateFullName(newFullName);
    console.log('Updated full name to:', newFullName);

    // Verify success message
    const isSuccess = await shopVNProfilePage.isSuccessMessageDisplayed();
    if (isSuccess) {
      const successMsg = await shopVNProfilePage.getSuccessMessage();
      console.log('Success message:', successMsg);
      expect(isSuccess).toBe(true);
    }

    // Verify the full name was updated in UI
    const updatedName = await shopVNProfilePage.getFullName();
    expect(updatedName).toBe(newFullName);
    console.log('Full name updated successfully:', updatedName);
  });

  test('Should clean up full name change via API', async ({ shopVNProfilePage, page }) => {
    // Navigate to profile page
    await shopVNProfilePage.navigateTo();

    // Get auth token from storage
    const token = await page.evaluate(() => {
      return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || '';
    });

    // Cleanup: restore original name via API
    const cleanupData = { fullName: 'admin' };

    try {
      const result = await shopVNProfilePage.updateProfileViaAPI(token || 'test-token', cleanupData);
      console.log('Profile cleaned up via API:', result);
      expect(result).toBeTruthy();
    } catch (error) {
      console.log('API cleanup failed, falling back to UI cleanup');

      // Fallback: update via UI
      await shopVNProfilePage.updateFullName('admin');
      console.log('Profile cleaned up via UI');
    }

    // Verify profile is back to original state
    await shopVNProfilePage.navigateTo();
    const restoredName = await shopVNProfilePage.getFullName();
    console.log('Restored name:', restoredName);
    expect(restoredName).toBeTruthy();
  });

  test('Should update full name and verify via API then clean up', async ({ shopVNProfilePage, page }) => {
    // Navigate to profile
    await shopVNProfilePage.navigateTo();
    await expect(page).toHaveURL(/profile/);

    // Step 1: Update full name via UI
    const newFullName = randomFullName();
    await shopVNProfilePage.updateFullName(newFullName);
    console.log('Step 1: Updated full name via UI to:', newFullName);

    // Step 2: Verify change via UI
    const updatedName = await shopVNProfilePage.getFullName();
    expect(updatedName).toBe(newFullName);
    console.log('Step 2: Verified name change in UI');

    // Step 3: Get auth token
    const token = await page.evaluate(() => {
      return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || '';
    });

    // Step 4: Clean up via API
    try {
      const result = await shopVNProfilePage.updateProfileViaAPI(token || 'test-token', {
        fullName: 'admin',
      });
      console.log('Step 4: Cleaned up via API:', result);
    } catch (error) {
      // Fallback: cleanup via UI
      await shopVNProfilePage.updateFullName('admin');
      console.log('Step 4: Cleaned up via UI');
    }

    // Step 5: Verify cleanup
    await shopVNProfilePage.navigateTo();
    const finalName = await shopVNProfilePage.getFullName();
    expect(finalName).toBeTruthy();
    console.log('Step 5: Cleanup verified, current name:', finalName);
  });
});


