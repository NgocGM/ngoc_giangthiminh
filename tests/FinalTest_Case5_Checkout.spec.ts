import { test, expect } from '../fixtures/test';
import testData from '../fixtures/test-data.json';

test.describe(
  'Final Test - Case 5: Checkout Succeeds with Valid Receiver Info (COD)',
  () => {

    test.beforeEach(async ({ shopVNLoginPage, productPage }) => {
      await shopVNLoginPage.navigateTo();
      await shopVNLoginPage.login(
        process.env.ADMIN_USERNAME!,
        process.env.ADMIN_PASSWORD!
      );

      await expect(shopVNLoginPage.page).toHaveURL(/\/home$/);

      await productPage.navigateTo();
      const addedProduct = await productPage.addRandomProductToCart();

      expect(addedProduct).toBeTruthy();
    });

    test(
      'Should checkout successfully with valid receiver info (COD)',
      async ({ checkoutPage, page }) => {

        await checkoutPage.navigateTo();

        await expect(page).toHaveURL(/\/checkout$/);

        await checkoutPage.expectCheckoutReady();

        const { receiverName, receiverPhone, receiverAddress, successHeading } =
          testData.checkout;

        await checkoutPage.fillReceiverInfo(
          receiverName,
          receiverPhone,
          receiverAddress
        );

        await checkoutPage.selectCODPayment();

        await checkoutPage.clickPlaceOrder();

        await checkoutPage.expectOrderSuccess(successHeading);
      }
    );
  }
);