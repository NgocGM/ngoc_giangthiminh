import {
  randomAddress,
  randomEmail,
  randomFullName,
  randomPhone
} from './StringUtils';

/**
 * Authentication and Common API Utilities for ShopVN tests
 */

export class AuthUtils {
  static generateRandomEmail(): string {
    return randomEmail();
  }

  static generateRandomFullName(): string {
    return randomFullName();
  }

  static generateRandomPhone(): string {
    return randomPhone();
  }

  static getStorageToken(page: any, key: string = 'authToken'): Promise<string> {
    return page.evaluate((storageKey: string) => {
      return localStorage.getItem(storageKey) || sessionStorage.getItem(storageKey) || '';
    }, key);
  }
}

/**
 * Order data builder
 */
export class OrderBuilder {
  private orderData: any = {};

  constructor() {
    this.orderData = {
      productId: 'PROD-001',
      quantity: 1,
      shippingAddress: '123 Test Street, Test City',
      paymentMethod: 'Credit Card',
      totalAmount: 99.99
    };
  }

  withProductId(productId: string): OrderBuilder {
    this.orderData.productId = productId;
    return this;
  }

  withQuantity(quantity: number): OrderBuilder {
    this.orderData.quantity = quantity;
    return this;
  }

  withShippingAddress(address: string): OrderBuilder {
    this.orderData.shippingAddress = address;
    return this;
  }

  withPaymentMethod(method: string): OrderBuilder {
    this.orderData.paymentMethod = method;
    return this;
  }

  withTotalAmount(amount: number): OrderBuilder {
    this.orderData.totalAmount = amount;
    return this;
  }

  build(): any {
    return { ...this.orderData };
  }
}

/**
 * Profile data builder
 */
export class ProfileBuilder {
  private profileData: any = {};

  constructor() {
    this.profileData = {
      fullName: randomFullName(),
      email: randomEmail(),
      phone: randomPhone(),
      address: randomAddress()
    };
  }

  withFullName(fullName: string): ProfileBuilder {
    this.profileData.fullName = fullName;
    return this;
  }

  withEmail(email: string): ProfileBuilder {
    this.profileData.email = email;
    return this;
  }

  withPhone(phone: string): ProfileBuilder {
    this.profileData.phone = phone;
    return this;
  }

  withAddress(address: string): ProfileBuilder {
    this.profileData.address = address;
    return this;
  }

  build(): any {
    return { ...this.profileData };
  }
}
