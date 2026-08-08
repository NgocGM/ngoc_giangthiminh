import { test as base } from '@playwright/test';
import { LoginPage } from '../page/LoginPage';
import { BookStorePage } from '../page/BookStorePage';
import { ProfilePage } from '../page/ProfilePage';

type TestFixtures = {
  loginPage: LoginPage;
  bookStorePage: BookStorePage;
  profilePage: ProfilePage;
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
  }
});

export { expect } from '@playwright/test';
