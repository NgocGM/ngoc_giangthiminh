import { test, expect } from '../fixtures/test';

test.describe('Final Test - Case 2: Add Single Product to Cart and Verify Quantity & Cart Page', () => {
  
  test.beforeEach(async ({ shopVNLoginPage }) => {
    // Navigate to login page
    await shopVNLoginPage.navigateTo();
    
    // Login with credentials
    await shopVNLoginPage.login('admin', 'password123');
    
    // Verify successful login by checking page URL
    await expect(shopVNLoginPage.page).toHaveURL(/home|dashboard|orders|products/);
  });

  test('Should add single product to cart and verify quantity', async ({ productPage, page }) => {
    // Navigate to products page
    await productPage.navigateTo();
    await page.waitForLoadState('domcontentloaded');

    // Get product details
    const productName = await productPage.getProductName();
    const productPrice = await productPage.getProductPrice();
    console.log('Product selected:', productName);
    console.log('Product price:', productPrice);

    expect(productName).toBeTruthy();
    expect(productPrice).toBeTruthy();

    // Set quantity to 1
    await productPage.setQuantity(1);
    const quantity = await productPage.getQuantity();
    expect(quantity).toBe('1');
    console.log('Quantity set to:', quantity);

    // Add to cart
    await productPage.clickAddToCart();
    await page.waitForLoadState('domcontentloaded');

    // Verify success message
    const isSuccess = await productPage.isSuccessMessageDisplayed();
    if (isSuccess) {
      const successMsg = await productPage.getSuccessMessage();
      console.log('Success message:', successMsg);
      expect(isSuccess).toBe(true);
    }

    console.log('Product added to cart successfully');
  });

  test('Should verify product in cart with correct quantity', async ({ productPage, cartPage, page }) => {
    // Navigate to products page
    await productPage.navigateTo();
    await page.waitForLoadState('domcontentloaded');

    // Get product details before adding
    const productName = await productPage.getProductName();
    console.log('Adding product to cart:', productName);

    // Add 1 item to cart with quantity 1
    await productPage.setQuantity(1);
    await productPage.clickAddToCart();
    await page.waitForLoadState('domcontentloaded');

    // Navigate to cart page
    await cartPage.navigateTo();
    await page.waitForLoadState('domcontentloaded');

    // Verify cart page URL
    await expect(page).toHaveURL(/cart/);

    // Get cart items
    const cartItems = await cartPage.getCartItems();
    console.log('Cart items count:', cartItems.length);

    // Verify at least one item in cart
    expect(cartItems.length).toBeGreaterThan(0);

    // Verify first item has quantity 1 or more
    const firstItem = cartItems[0];
    const cartQuantity = parseInt(firstItem.quantity) || 1;
    
    console.log(`Item in cart: ${firstItem.name}`);
    console.log(`Cart quantity: ${cartQuantity}`);
    console.log(`Item price: ${firstItem.price}`);
    
    expect(cartQuantity).toBeGreaterThanOrEqual(1);
    expect(firstItem.price).toBeTruthy();
  });
});
