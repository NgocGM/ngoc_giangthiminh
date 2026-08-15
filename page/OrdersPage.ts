import { Page, Locator, APIRequestContext } from '@playwright/test';

export class OrdersPage {
  ordersTable: Locator;
  orderRows: Locator;
  noOrdersMessage: Locator;
  refreshButton: Locator;
  deleteOrderButton: Locator;

  ORDERS_URL = 'https://testing.platformforge.dev/orders';
  API_BASE_URL = 'https://testing.platformforge.dev/api';

  constructor(public page: Page, private request?: APIRequestContext) {
    this.ordersTable = page.locator('table, [class*="table"]').first();
    this.orderRows = page.locator('tr[class*="row"], tbody tr');
    this.noOrdersMessage = page.locator('text=No orders, text=No data');
    this.refreshButton = page.locator('button:has-text("Refresh"), button:has-text("Reload")');
    this.deleteOrderButton = page.locator('button:has-text("Delete")').first();
  }

  async navigateTo() {
    await this.page.goto(this.ORDERS_URL);
    await this.page.waitForLoadState('networkidle');
  }

  async getOrderCount(): Promise<number> {
    const rows = await this.orderRows.all();
    // Subtract 1 if first row is header
    return rows.length > 0 ? rows.length - 1 : 0;
  }

  async getOrdersList() {
    const rows = await this.orderRows.all();
    const orders: any[] = [];
    
    // Skip first row if it's header
    const startIndex = rows.length > 0 ? 1 : 0;
    
    for (let i = startIndex; i < rows.length; i++) {
      const cells = await rows[i].locator('td').all();
      if (cells.length > 0) {
        orders.push({
          id: await cells[0]?.textContent(),
          status: await cells[1]?.textContent(),
          total: await cells[2]?.textContent(),
        });
      }
    }
    
    return orders;
  }

  async isNoOrdersMessageDisplayed(): Promise<boolean> {
    try {
      await this.noOrdersMessage.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickRefresh() {
    await this.refreshButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async deleteFirstOrder() {
    await this.deleteOrderButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  // API method to seed an order
  async seedOrderViaAPI(token: string, orderData: any) {
    if (!this.request) {
      throw new Error('APIRequestContext not provided');
    }

    const response = await this.request.post(`${this.API_BASE_URL}/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: orderData,
    });

    if (!response.ok()) {
      throw new Error(`Failed to seed order: ${response.status()}`);
    }

    return await response.json();
  }

  // API method to get orders
  async getOrdersViaAPI(token: string) {
    if (!this.request) {
      throw new Error('APIRequestContext not provided');
    }

    const response = await this.request.get(`${this.API_BASE_URL}/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok()) {
      throw new Error(`Failed to get orders: ${response.status()}`);
    }

    return await response.json();
  }
}
