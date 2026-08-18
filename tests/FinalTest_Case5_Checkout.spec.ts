import { test, expect } from '../fixtures/test';
import {
  randomAddress,
  randomFullName,
  randomPhone
} from '../utils/StringUtils';

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

        const receiverName = randomFullName();
        const receiverPhone = randomPhone();
        const receiverAddress = randomAddress();

        await checkoutPage.fillReceiverInfo(
          receiverName,
          receiverPhone,
          receiverAddress
        );

        await checkoutPage.selectCODPayment();

        await checkoutPage.clickPlaceOrder();

        await checkoutPage.expectOrderSuccess('Đặt hàng thành công!');
      }
    );
  }
);