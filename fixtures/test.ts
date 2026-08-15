import { test as base } from '@playwright/test';
import { LoginPage } from '../page/LoginPage';
import { BookStorePage } from '../page/BookStorePage';
import { ProfilePage } from '../page/ProfilePage';
import { ShopVNLoginPage } from '../page/ShopVNLoginPage';
import { OrdersPage } from '../page/OrdersPage';
import { ShopVNProfilePage } from '../page/ShopVNProfilePage';
import { CartPage } from '../page/CartPage';
import { ProductPage } from '../page/ProductPage';

type TestFixtures = {
  loginPage: LoginPage;
  bookStorePage: BookStorePage;
  profilePage: ProfilePage;
  shopVNLoginPage: ShopVNLoginPage;
  ordersPage: OrdersPage;
  shopVNProfilePage: ShopVNProfilePage;
  cartPage: CartPage;
  productPage: ProductPage;
};

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  
  bookStorePage: async ({ page }, use) => {
    const bookStorePage = new BookStorePage(page);
    await use(bookStorePage);
  },
  
  profilePage: async ({ page }, use) => {
    const profilePage = new ProfilePage(page);
    await use(profilePage);
  },

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
