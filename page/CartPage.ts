import { Page, Locator } from '@playwright/test';

export class CartPage {
  cartButton: Locator;
  cartIcon: Locator;
  cartItems: Locator;
  cartItemRows: Locator;
  quantityInput: Locator;
  removeButton: Locator;
  checkoutButton: Locator;
  emptyCartMessage: Locator;
  cartTotal: Locator;
  cartCount: Locator;

  CART_URL = 'https://testing.platformforge.dev/cart';

  constructor(public page: Page) {
    this.cartButton = page.locator('button:has-text("Cart"), a:has-text("Cart")').first();
    this.cartIcon = page.locator('[class*="cart-icon"], [class*="shopping-cart"]').first();
    this.cartItems = page.locator('[class*="cart-item"], tr[class*="item"]');
    this.cartItemRows = page.locator('tbody tr, [class*="cart-item"]');
    this.quantityInput = page.locator('input[type="number"]').first();
    this.removeButton = page.locator('button:has-text("Remove"), button:has-text("Delete")').first();
    this.checkoutButton = page.locator('button:has-text("Checkout"), button:has-text("Proceed")');
    this.emptyCartMessage = page.locator('text=Your cart is empty, text=No items');
    this.cartTotal = page.locator('[class*="total"], text=/Total.*\\$/').first();
    this.cartCount = page.locator('[class*="cart-count"], [class*="badge"]').first();
  }

  async navigateTo() {
    await this.page.goto(this.CART_URL);
    await this.page.waitForLoadState('networkidle');
  }

  async clickCartButton() {
    await this.cartButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickCartIcon() {
    await this.cartIcon.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getCartItemCount(): Promise<number> {
    const items = await this.cartItemRows.all();
    return items.length;
  }

  async getCartItems() {
    const items: any[] = [];
    const rows = await this.cartItemRows.all();

    for (const row of rows) {
      const productName = await row.locator('td:nth-child(1), [class*="name"]').textContent();
      const quantity = await row.locator('input[type="number"], td:nth-child(2)').inputValue().catch(() => '1');
      const price = await row.locator('td:nth-child(3), [class*="price"]').textContent();
      
      if (productName && productName.trim()) {
        items.push({
          name: productName.trim(),
          quantity: quantity || '1',
          price: price?.trim() || '',
        });
      }
    }

    return items;
  }

  async getFirstItemQuantity(): Promise<string> {
    const quantity = await this.quantityInput.inputValue();
    return quantity || '1';
  }

  async updateQuantity(quantity: number, itemIndex: number = 0) {
    const quantityInputs = this.page.locator('input[type="number"]');
    const input = quantityInputs.nth(itemIndex);
    
    await input.clear();
    await input.fill(quantity.toString());
    await this.page.keyboard.press('Enter');
    await this.page.waitForLoadState('networkidle');
  }

  async isEmptyCartDisplayed(): Promise<boolean> {
    try {
      await this.emptyCartMessage.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async getCartTotal(): Promise<string> {
    return await this.cartTotal.textContent() || '';
  }

  async removeFirstItem() {
    await this.removeButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickCheckout() {
    await this.checkoutButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getCartCountBadge(): Promise<string> {
    return await this.cartCount.textContent() || '0';
  }
}
