import { test, expect } from '../fixtures/test';
import testData from '../fixtures/test-data.json';

test.describe(
  'Final Test - Case 6: Advanced — Update Full Name, Then Clean Up via API',
  () => {

    test.beforeEach(async ({ shopVNLoginPage }) => {
      await shopVNLoginPage.navigateTo();

      await shopVNLoginPage.login(
        process.env.ADMIN_USERNAME!,
        process.env.ADMIN_PASSWORD!
      );

      await expect(shopVNLoginPage.page).toHaveURL(/\/home$/);
    });

    test('Should update full name and clean up via API', async ({
      shopVNProfilePage,
      page
    }) => {
      await shopVNProfilePage.navigateTo();
      await expect(page).toHaveURL(/\/profile$/);

      const originalName = await shopVNProfilePage.getFullName();
      const newFullName = testData.profile.updatedFullName;

      await shopVNProfilePage.updateFullName(newFullName);
      await expect(
        shopVNProfilePage.successMessage
      ).toBeVisible();

      const updatedName = await shopVNProfilePage.getFullName();

      expect(updatedName).toBe(newFullName);

      const token = await page.evaluate(() => sessionStorage.getItem('token'));

      const response = await page.request.patch(
        'https://testing.platformforge.dev/api/profile',
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          multipart: {
            name: originalName
          }
        }
      );

      expect(response.ok()).toBe(true);
      await page.reload();
      await page.waitForLoadState('domcontentloaded');

      expect(await shopVNProfilePage.getFullName())
        .toBe(originalName);
    });
  }
);