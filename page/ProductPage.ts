import { Page, Locator } from '@playwright/test';

export class ProductPage {
  productName: Locator;
  productPrice: Locator;
  productDescription: Locator;
  addToCartButton: Locator;
  quantityInput: Locator;
  addQuantityButton: Locator;
  subtractQuantityButton: Locator;
  successMessage: Locator;
  cartIcon: Locator;
  cartCount: Locator;

  PRODUCTS_URL = 'https://testing.platformforge.dev/home';

  constructor(public page: Page) {
    this.productName = page.locator('h3.product-name').first();

    this.productPrice = page.locator('p.product-price').first();

    this.addToCartButton = page
      .locator('button.add-to-cart')
      .first();

    this.quantityInput = page
      .locator('input[type="number"]')
      .first();

    this.addQuantityButton = page
      .locator('button:has-text("+")')
      .first();

    this.subtractQuantityButton = page
      .locator('button:has-text("-")')
      .first();

    this.productDescription = page
      .locator('[class*="description"]')
      .first();

    this.successMessage = page
      .locator('[class*="success"], [class*="alert-success"]')
      .first();

    this.cartIcon = page
      .locator('[class*="cart-icon"], button:has-text("Giỏ hàng")')
      .first();

    this.cartCount = page
      .locator('[class*="cart-count"]')
      .first();
  }

  async navigateTo() {
    await this.page.goto(this.PRODUCTS_URL);

    await this.page.waitForLoadState('domcontentloaded');

    await this.page.locator('.product-card').first().waitFor({
      state: 'visible',
      timeout: 10000
    });
  }

  async addRandomProductToCart(): Promise<string> {
    const productCards = this.page.locator('.product-card');

    const count = await productCards.count();

    if (count === 0) {
      throw new Error(
        'No products found on home page'
      );
    }

    const randomIndex = Math.floor(Math.random() * count);

    const productCard = productCards.nth(randomIndex);

    const productName = (
      await productCard.locator('.product-name').textContent()
    )?.trim() || '';

    if (!productName) {
      throw new Error(
        `Product name not found for product index ${randomIndex}`
      );
    }

    await productCard
      .locator('button.add-to-cart')
      .click();

    return productName;
  }

  async getProductName(): Promise<string> {
    return (
      (await this.productName.textContent())?.trim() || ''
    );
  }

  async getProductPrice(): Promise<string> {
    return (
      (await this.productPrice.textContent())?.trim() || ''
    );
  }

  async getProductDescription(): Promise<string> {
    return (
      (await this.productDescription.textContent())?.trim() || ''
    );
  }

  async setQuantity(quantity: number) {
    await this.quantityInput.fill(quantity.toString());
  }

  async getQuantity(): Promise<string> {
    return await this.quantityInput.inputValue();
  }

  async increaseQuantity() {
    await this.addQuantityButton.click();
  }

  async decreaseQuantity() {
    await this.subtractQuantityButton.click();
  }

  async clickAddToCart() {
    await this.addToCartButton.click();
  }

  async addToCartWithQuantity(quantity: number) {
    await this.setQuantity(quantity);
    await this.clickAddToCart();
  }

  async isSuccessMessageDisplayed(): Promise<boolean> {
    try {
      await this.successMessage.waitFor({
        state: 'visible',
        timeout: 3000
      });

      return true;
    } catch {
      return false;
    }
  }

  async getSuccessMessage(): Promise<string> {
    return (
      (await this.successMessage.textContent())?.trim() || ''
    );
  }

  async getCartCountBadge(): Promise<string> {
    return (
      (await this.cartCount.textContent())?.trim() || '0'
    );
  }
}