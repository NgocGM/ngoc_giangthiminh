import { test, expect } from '../fixtures/test';

test.describe(
  'Final Test - Case 2: Add Single Product to Cart and Verify Quantity & Cart Page',
  () => {

    test.beforeEach(async ({ shopVNLoginPage }) => {
      // Login
      await shopVNLoginPage.navigateTo();
      await shopVNLoginPage.login(
        process.env.ADMIN_USERNAME!,
        process.env.ADMIN_PASSWORD!
      );

      await expect(shopVNLoginPage.page).toHaveURL(/\/home$/);
    });

    test('Add single random product to cart and verify quantity, cart page', async ({
      productPage,
      cartPage,
      page
    }) => {

      await productPage.navigateTo();

      const productName = await productPage.addRandomProductToCart();

      expect(productName).toBeTruthy();

      await cartPage.navigateTo();

      await expect(page).toHaveURL(/\/cart$/);

      const cartItems = await cartPage.getCartItems();

      expect(cartItems.length).toBeGreaterThan(0);

      const addedProduct = cartItems.find(item => item.name === productName);

      expect(addedProduct).toBeDefined();

      expect(Number(addedProduct!.quantity)).toBe(1);
      expect(addedProduct!.price).toBeTruthy();
    });
  }
);