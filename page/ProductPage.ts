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

  PRODUCTS_URL = 'https://testing.platformforge.dev/products';

  constructor(public page: Page) {
    this.productName = page.locator('h1, h2, [class*="product-name"]').first();
    this.productPrice = page.locator('[class*="price"], text=/\\$\\d+/').first();
    this.productDescription = page.locator('[class*="description"], p').first();
    this.addToCartButton = page.locator('button:has-text("Add to Cart")');
    this.quantityInput = page.locator('input[type="number"]').first();
    this.addQuantityButton = page.locator('button:has-text("+")').first();
    this.subtractQuantityButton = page.locator('button:has-text("-")').first();
    this.successMessage = page.locator('[class*="success"], [class*="alert-success"], text=Added to cart').first();
    this.cartIcon = page.locator('[class*="cart-icon"], button:has-text("Cart")').first();
    this.cartCount = page.locator('[class*="cart-count"], [class*="badge"]').first();
  }

  async navigateTo() {
    await this.page.goto(this.PRODUCTS_URL);
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToProductByName(productName: string) {
    const productLink = this.page.locator(`text=${productName}`).first();
    await productLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getProductName(): Promise<string> {
    return await this.productName.textContent() || '';
  }

  async getProductPrice(): Promise<string> {
    return await this.productPrice.textContent() || '';
  }

  async getProductDescription(): Promise<string> {
    return await this.productDescription.textContent() || '';
  }

  async setQuantity(quantity: number) {
    await this.quantityInput.clear();
    await this.quantityInput.fill(quantity.toString());
  }

  async getQuantity(): Promise<string> {
    return await this.quantityInput.inputValue();
  }

  async increaseQuantity() {
    await this.addQuantityButton.click();
    await this.page.waitForTimeout(300);
  }

  async decreaseQuantity() {
    await this.subtractQuantityButton.click();
    await this.page.waitForTimeout(300);
  }

  async clickAddToCart() {
    await this.addToCartButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async addToCartWithQuantity(quantity: number) {
    await this.setQuantity(quantity);
    await this.clickAddToCart();
  }

  async isSuccessMessageDisplayed(): Promise<boolean> {
    try {
      await this.successMessage.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async getSuccessMessage(): Promise<string> {
    return await this.successMessage.textContent() || '';
  }

  async getCartCountBadge(): Promise<string> {
    return await this.cartCount.textContent() || '0';
  }
}
