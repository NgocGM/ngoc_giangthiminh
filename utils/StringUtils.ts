/**
 * Utility functions for generating random test data
 */

export class StringUtils {
  /**
   * Generate random text-only username
   * @param length Username length (default: 8)
   * @returns Random username (lowercase letters only)
   */
  static generateRandomUsername(length: number = 8): string {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    let username = '';
    for (let i = 0; i < length; i++) {
      username += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return username;
  }

  /**
   * Generate random first name from predefined list
   * @returns Random first name
   */
  static generateRandomFirstName(): string {
    const firstNames = [
      'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph',
      'Thomas', 'Charles', 'Mary', 'Patricia', 'Jennifer', 'Linda', 'Barbara',
      'Elizabeth', 'Susan', 'Jessica', 'Sarah', 'Karen'
    ];
    return firstNames[Math.floor(Math.random() * firstNames.length)];
  }

  /**
   * Generate random last name from predefined list
   * @returns Random last name
   */
  static generateRandomLastName(): string {
    const lastNames = [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
      'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
      'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'
    ];
    return lastNames[Math.floor(Math.random() * lastNames.length)];
  }
}
