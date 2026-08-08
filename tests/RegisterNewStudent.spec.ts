import { test, expect } from '@playwright/test';
import { PracticeFormPage } from '../page/PracticeFormPage';

function generateRandomString(length: number, type: 'lower' | 'upper' | 'numbers' | 'firstName' | 'lastName' = 'lower'): string {
  const firstNames = [
    'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles',
    'Mary', 'Patricia', 'Jennifer', 'Linda', 'Barbara', 'Elizabeth', 'Susan', 'Jessica', 'Sarah', 'Karen'
  ];

  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'
  ];

  if (type === 'firstName') {
    return firstNames[Math.floor(Math.random() * firstNames.length)];
  }

  if (type === 'lastName') {
    return lastNames[Math.floor(Math.random() * lastNames.length)];
  }

  if (type === 'numbers') {
    const numberChars = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
    }
    return result;
  }

  return '';
}

function generateRandomDate(): { input: string; display: string } {
  // Generate random date between 1990 and 2006 (age 18-36 in 2026)
  const year = Math.floor(Math.random() * (2006 - 1990 + 1)) + 1990;
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1; // Use 1-28 to avoid month end issues

  const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthNamesFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthNameShort = monthNamesShort[month - 1];
  const monthNameFull = monthNamesFull[month - 1];
  
  // Return format: "DD MMM YYYY" (for input) and "DD MMMM,YYYY" (for display with full month name)
  return {
    input: `${String(day).padStart(2, '0')} ${monthNameShort} ${year}`,
    display: `${String(day).padStart(2, '0')} ${monthNameFull},${year}`
  };
}

test.describe('Student Registration Form', () => {
  let practiceFormPage: PracticeFormPage;

  test.beforeEach(async ({ page }) => {
    practiceFormPage = new PracticeFormPage(page);
    await practiceFormPage.navigateTo();
    await page.waitForLoadState('domcontentloaded');
  });

  test('Scenario 1.1: Register student with all fields successfully', async () => {
    // Generate random test data
    const firstName = generateRandomString(0, 'firstName');
    const lastName = generateRandomString(0, 'lastName');
    const mobile = generateRandomString(10, 'numbers');
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@test.com`;
    const address = '123 Demo Street';
    const dateOfBirth = generateRandomDate();

    // Enter valid data into all fields
    await practiceFormPage.fillFirstName(firstName);
    await practiceFormPage.fillLastName(lastName);
    await practiceFormPage.fillEmail(email);
    await practiceFormPage.selectGenderMale();
    await practiceFormPage.fillMobile(mobile);
    await practiceFormPage.fillDateOfBirth(dateOfBirth.input);
    await practiceFormPage.fillSubject('Maths');
    await practiceFormPage.selectSports();
    await practiceFormPage.selectReading();
    
    const picturePath = 'C:/Users/Public/Pictures/Sample Pictures/Koala.jpg';
    await practiceFormPage.uploadPicture(picturePath);
    await practiceFormPage.fillAddress(address);
    await practiceFormPage.selectState();
    await practiceFormPage.selectCity();
    await practiceFormPage.clickSubmit();

    // Verify confirmation
    const isModalVisible = await practiceFormPage.isConfirmationModalVisible();
    expect(isModalVisible).toBe(true);

    const message = await practiceFormPage.getConfirmationMessage();
    expect(message).toContain('Thanks for submitting the form');

    // Verify all submitted information
    const pageContent = await practiceFormPage.page.content();
    expect(pageContent).toContain(`${firstName} ${lastName}`);
    expect(pageContent).toContain(email);
    expect(pageContent).toContain('Male');
    expect(pageContent).toContain(mobile);
    expect(pageContent).toContain(dateOfBirth.display);
    expect(pageContent).toContain('Maths');
    expect(pageContent).toContain('Sports, Reading');
    expect(pageContent).toContain(address);
    expect(pageContent).toContain('NCR Delhi');
  });

  test('Scenario 1.2: Register student with required fields only', async ({ page }) => {
    // Generate random test data
    const firstName = generateRandomString(0, 'firstName');
    const lastName = generateRandomString(0, 'lastName');
    const mobile = generateRandomString(10, 'numbers');

    // Enter required fields only
    await practiceFormPage.fillFirstName(firstName);
    await practiceFormPage.fillLastName(lastName);
    await practiceFormPage.selectGenderMale();
    await practiceFormPage.fillMobile(mobile);
    await practiceFormPage.clickSubmit();

    // Verify confirmation
    const isModalVisible = await practiceFormPage.isConfirmationModalVisible();
    expect(isModalVisible).toBe(true);

    const message = await practiceFormPage.getConfirmationMessage();
    expect(message).toContain('Thanks for submitting the form');

    // Verify all submitted information
    const pageContent = await practiceFormPage.page.content();
    expect(pageContent).toContain(`${firstName} ${lastName}`);
    expect(pageContent).toContain('Male');
    expect(pageContent).toContain(mobile);
  });
});
