import { test as base } from '@playwright/test';
import { ShopVNLoginPage } from '../page/ShopVNLoginPage';
import { OrdersPage } from '../page/OrdersPage';
import { ShopVNProfilePage } from '../page/ShopVNProfilePage';
import { CartPage } from '../page/CartPage';
import { ProductPage } from '../page/ProductPage';

type TestFixtures = {
  shopVNLoginPage: ShopVNLoginPage;
  ordersPage: OrdersPage;
  shopVNProfilePage: ShopVNProfilePage;
  cartPage: CartPage;
  productPage: ProductPage;
};

export const test = base.extend<TestFixtures>({
  shopVNLoginPage: async ({ page }, use) => {
    const shopVNLoginPage = new ShopVNLoginPage(page);
    await use(shopVNLoginPage);
  },

  ordersPage: async ({ page, context }, use) => {
    const request = await context.request;
    const ordersPage = new OrdersPage(page, request);
    await use(ordersPage);
  },

  shopVNProfilePage: async ({ page, context }, use) => {
    const request = await context.request;
    const shopVNProfilePage = new ShopVNProfilePage(page, request);
    await use(shopVNProfilePage);
  },

  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  productPage: async ({ page }, use) => {
    const productPage = new ProductPage(page);
    await use(productPage);
  }
});

export { expect } from '@playwright/test';
