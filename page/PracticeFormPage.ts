import { Page, Locator } from '@playwright/test';

export class PracticeFormPage {
  firstNameInput: Locator;
  lastNameInput: Locator;
  emailInput: Locator;
  maleGenderRadio: Locator;
  mobileInput: Locator;
  dateOfBirthInput: Locator;
  subjectsInput: Locator;
  sportsHobbyCheckbox: Locator;
  readingHobbyCheckbox: Locator;
  musicHobbyCheckbox: Locator;
  femaleGenderRadio: Locator;
  otherGenderRadio: Locator;
  pictureFileInput: Locator;
  currentAddressTextarea: Locator;
  stateDropdown: Locator;
  cityDropdown: Locator;
  stateOption: Locator;
  cityOption: Locator;
  submitButton: Locator;
  confirmationModal: Locator;

  PRACTICE_FORM_URL = 'https://demoqa.com/automation-practice-form';

  constructor(public page: Page) {
    
    // Initialize locators
    this.firstNameInput = page.locator('id=firstName');
    this.lastNameInput = page.locator('id=lastName');
    this.emailInput = page.locator("input[type='text'][placeholder='name@example.com']");
    this.maleGenderRadio = page.locator("input[value='Male']");
    this.femaleGenderRadio = page.locator("input[value='Female']");
    this.otherGenderRadio = page.locator("input[value='Other']");
    this.mobileInput = page.locator('id=userNumber');
    this.dateOfBirthInput = page.locator('id=dateOfBirthInput');
    this.subjectsInput = page.locator("input[class='subjects-auto-complete__input']");
    this.sportsHobbyCheckbox = page.locator("label[for='hobbies-checkbox-1']");
    this.readingHobbyCheckbox = page.locator("label[for='hobbies-checkbox-2']");
    this.musicHobbyCheckbox = page.locator("label[for='hobbies-checkbox-3']");
    this.pictureFileInput = page.locator('id=uploadPicture');
    this.currentAddressTextarea = page.locator("textarea[placeholder='Current Address']");
    this.stateDropdown = page.locator("div#state input[aria-autocomplete='list']");
    this.cityDropdown = page.locator("div#city input[aria-autocomplete='list']");
    this.stateOption = page.locator("xpath=//div[@id='state']//div[text()='NCR']");
    this.cityOption = page.locator("xpath=//div[@id='city']//div[text()='Delhi']");
    this.submitButton = page.locator('id=submit');
    this.confirmationModal = page.locator('id=example-modal-sizes-title-lg');
  }

  async navigateTo() {
    await this.page.goto(this.PRACTICE_FORM_URL);
  }

  async fillFirstName(firstName: string) {
    await this.firstNameInput.fill(firstName);
  }

  async fillLastName(lastName: string) {
    await this.lastNameInput.fill(lastName);
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async selectGenderMale() {
    await this.maleGenderRadio.click();
  }

  async fillMobile(mobile: string) {
    await this.mobileInput.fill(mobile);
  }

  async fillDateOfBirth(date: string) {
    await this.dateOfBirthInput.fill(date);
  }

  async fillSubject(subject: string) {
    await this.subjectsInput.fill(subject);
    await this.subjectsInput.press('Enter');
  }

  async selectSports() {
    await this.sportsHobbyCheckbox.click();
  }

  async selectReading() {
    await this.readingHobbyCheckbox.click();
  }

  async selectMusic() {
    await this.musicHobbyCheckbox.click();
  }

  async uploadPicture(filePath: string) {
    try {
      await this.pictureFileInput.setInputFiles(filePath);

      console.log(`File uploaded: ${filePath}`);
    } catch (error) {
      console.warn(`File upload failed or file not found: ${filePath}`);
      console.warn('Continuing test without file upload...');
    }

  }

  async fillAddress(address: string) {
    await this.currentAddressTextarea.fill(address);
  }

  async selectState() {
    await this.stateDropdown.click();
    await this.stateOption.waitFor({ state: 'visible', timeout: 5000 });
    await this.stateOption.click();
  }

  async selectCity() {
    await this.cityDropdown.click();
    await this.cityOption.waitFor({ state: 'visible', timeout: 5000 });
    await this.cityOption.click();
  }

  async selectGenderFemale() {
    await this.femaleGenderRadio.click();
  }

  async selectGenderOther() {
    await this.otherGenderRadio.click();
  }

  async clickSubmit() {
    await this.submitButton.click();
  }

  async getConfirmationMessage(): Promise<string> {
    await this.confirmationModal.waitFor({ state: 'visible' });
    return await this.confirmationModal.textContent() || '';
  }

  async isConfirmationModalVisible(): Promise<boolean> {
    try {
      await this.confirmationModal.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}
