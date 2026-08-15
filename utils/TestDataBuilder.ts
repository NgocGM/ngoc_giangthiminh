/**
 * Authentication and Common API Utilities for ShopVN tests
 */

export class AuthUtils {
  /**
   * Generate random string for unique names
   */
  static generateRandomString(length: number = 8, type: 'lowercase' | 'uppercase' | 'mixed' | 'numeric' = 'lowercase'): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    
    let chars = '';
    
    if (type === 'lowercase') {
      chars = lowercase;
    } else if (type === 'uppercase') {
      chars = uppercase;
    } else if (type === 'mixed') {
      chars = lowercase + uppercase + numbers;
    } else if (type === 'numeric') {
      chars = numbers;
    }
    
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }

  /**
   * Generate random email
   */
  static generateRandomEmail(): string {
    const randomPart = this.generateRandomString(10, 'lowercase');
    return `test_${randomPart}@example.com`;
  }

  /**
   * Generate random full name
   */
  static generateRandomFullName(): string {
    const firstNames = [
      'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph',
      'Mary', 'Patricia', 'Jennifer', 'Linda', 'Barbara', 'Elizabeth', 'Susan', 'Jessica'
    ];
    
    const lastNames = [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
      'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson'
    ];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return `${firstName} ${lastName}`;
  }

  /**
   * Generate random phone number
   */
  static generateRandomPhone(): string {
    let phone = '+1';
    for (let i = 0; i < 10; i++) {
      phone += Math.floor(Math.random() * 10);
    }
    return phone;
  }

  /**
   * Wait for element to be ready
   */
  static async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Extract token from localStorage or sessionStorage
   */
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
      fullName: AuthUtils.generateRandomFullName(),
      email: AuthUtils.generateRandomEmail(),
      phone: AuthUtils.generateRandomPhone(),
      address: '123 Test Street'
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
