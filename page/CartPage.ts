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
    this.cartButton = page
      .locator('button:has-text("Giỏ hàng"), a:has-text("Giỏ hàng")')
      .first();

    this.cartIcon = page
      .locator('[class*="cart-icon"], [class*="shopping-cart"]')
      .first();

    // Container của từng sản phẩm
    this.cartItems = page.locator('.cart-items > .cart-item');

    this.cartItemRows = page.locator('.cart-items > .cart-item');

    // Cart hiện tại không có input[type="number"]
    this.quantityInput = page
      .locator('.cart-item .item-qty')
      .first();

    this.removeButton = page
      .locator('.cart-item .remove-btn')
      .first();

    this.checkoutButton = page
      .locator(
        'button:has-text("Thanh toán"), button:has-text("Checkout"), button:has-text("Proceed")'
      )
      .first();

    this.emptyCartMessage = page.locator(
      'text=Giỏ hàng trống, text=Your cart is empty, text=No items'
    );

    this.cartTotal = page
      .locator('.cart-summary [class*="total"]')
      .first();

    this.cartCount = page
      .locator('.cart-count, .badge')
      .first();
  }

  async navigateTo() {
    await this.page.goto(this.CART_URL);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickCartButton() {
    await this.cartButton.click();
  }

  async clickCartIcon() {
    await this.cartIcon.click();
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItemRows.count();
  }

  async getCartItems() {
    const items: {
      name: string;
      quantity: string;
      price: string;
    }[] = [];

    const rowCount = await this.cartItemRows.count();

    for (let i = 0; i < rowCount; i++) {
      const row = this.cartItemRows.nth(i);

      const productName =
        (await row.locator('.item-name').textContent())?.trim() || '';

      const quantityText =
        (await row.locator('.item-qty').textContent())?.trim() || '';

      // item-qty chứa "- [số] +" nên lấy span ở giữa thay vì parse text
      const quantity =
        (await row.locator('.item-qty span').textContent())?.trim() ||
        quantityText.match(/\d+/)?.[0] ||
        '1';

      // TODO: verify class name .item-unit-price matches actual DOM
      const price =
        (await row.locator('.item-unit-price, .item-price').first().textContent())
          ?.replace('/ cái', '')
          .trim() || '';

      if (productName) {
        items.push({
          name: productName,
          quantity,
          price
        });
      }
    }

    return items;
  }

  async getFirstItemQuantity(): Promise<string> {
    const quantityText =
      (await this.quantityInput.textContent())?.trim() || '';

    const quantityMatch = quantityText.match(/\d+/);

    return quantityMatch?.[0] || '1';
  }

  async updateQuantity(quantity: number, itemIndex: number = 0) {
    const row = this.cartItemRows.nth(itemIndex);
    const quantityArea = row.locator('.item-qty');

    const currentText = await quantityArea.textContent();
    const currentMatch = currentText?.match(/\d+/);
    const currentQuantity = Number(currentMatch?.[0] || 1);

    if (quantity > currentQuantity) {
      const increaseButton = quantityArea.locator('button').last();

      for (let i = currentQuantity; i < quantity; i++) {
        await increaseButton.click();
      }
    } else if (quantity < currentQuantity) {
      const decreaseButton = quantityArea.locator('button').first();

      for (let i = currentQuantity; i > quantity; i--) {
        await decreaseButton.click();
      }
    }
  }

  async isEmptyCartDisplayed(): Promise<boolean> {
    try {
      await this.emptyCartMessage.waitFor({
        state: 'visible',
        timeout: 3000
      });

      return true;
    } catch {
      return false;
    }
  }

  async getCartTotal(): Promise<string> {
    return (await this.cartTotal.textContent())?.trim() || '';
  }

  async removeFirstItem() {
    await this.removeButton.click();
  }

  async clickCheckout() {
    await this.checkoutButton.click();
  }

  async getCartCountBadge(): Promise<string> {
    return (await this.cartCount.textContent())?.trim() || '0';
  }
}