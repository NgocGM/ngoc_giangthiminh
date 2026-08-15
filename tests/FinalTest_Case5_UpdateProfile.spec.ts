import { test, expect } from '../fixtures/test';
import { randomFullName, randomPhone, randomAddress } from '../utils/TestUtils';

test.describe('Final Test - Case 5: Checkout Succeeds with Valid Receiver Info (COD)', () => {

  test.beforeEach(async ({ shopVNLoginPage, productPage, cartPage }) => {
    // Login
    await shopVNLoginPage.navigateTo();
    await shopVNLoginPage.login('admin', 'password123');
    await expect(shopVNLoginPage.page).toHaveURL(/home|dashboard|products|orders/);

    // Add a product to cart as prerequisite
    await productPage.navigateTo();
    await productPage.setQuantity(1);
    await productPage.clickAddToCart();
    await productPage.page.waitForLoadState('domcontentloaded');
  });

  test('Should checkout successfully with valid receiver info (COD)', async ({ checkoutPage, page }) => {
    // Navigate to checkout
    await checkoutPage.navigateTo();
    await page.waitForLoadState('domcontentloaded');

    // Verify checkout page is ready
    const isReady = await checkoutPage.isCheckoutPageReady();
    expect(isReady).toBe(true);
    console.log('Checkout page loaded');

    // Fill in valid receiver info
    await checkoutPage.fillReceiverName(randomFullName());
    await checkoutPage.fillReceiverPhone(randomPhone());
    await checkoutPage.fillReceiverAddress(randomAddress());
    console.log('Receiver info filled');

    // Select COD payment
    await checkoutPage.selectCODPayment();
    console.log('COD payment selected');

    // Place the order
    await checkoutPage.clickPlaceOrder();
    await page.waitForLoadState('domcontentloaded');

    // Verify checkout success
    const isSuccessPage = await checkoutPage.isOnSuccessPage();
    const isSuccessMsg = await checkoutPage.isSuccessMessageDisplayed();

    console.log('Success page:', isSuccessPage);
    console.log('Success message:', isSuccessMsg);

    expect(isSuccessPage || isSuccessMsg).toBe(true);
    console.log('Checkout completed successfully');
  });

  test('Should display checkout form with required fields', async ({ checkoutPage, page }) => {
    // Navigate to checkout
    await checkoutPage.navigateTo();
    await page.waitForLoadState('domcontentloaded');

    // Verify all required fields are visible
    await expect(checkoutPage.receiverNameInput).toBeVisible();
    await expect(checkoutPage.receiverPhoneInput).toBeVisible();
    await expect(checkoutPage.receiverAddressInput).toBeVisible();
    await expect(checkoutPage.codPaymentOption).toBeVisible();
    await expect(checkoutPage.placeOrderButton).toBeVisible();

    console.log('All checkout form fields are visible');
  });
});
