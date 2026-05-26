# Copilot Instructions for Playwright + TypeScript E2E Test Automation

## 🚀 QUICK START
**Purpose:** Generic framework documentation for automating any web application using Playwright + TypeScript  
**Goal:** Write complete, correct, efficient test automation code following Page Object Model patterns  
**Framework Language:** TypeScript + Playwright

---

## 📊 FRAMEWORK OVERVIEW

This automation framework uses the **Page Object Model (POM)** pattern with TypeScript and Playwright. Each page of the application is represented as a dedicated page class, test data is centralized, and test cases are organized by functional area.

### Key Principles
- **Separation of Concerns:** Page logic separated from test logic
- **Reusability:** Locators and methods defined once, used across multiple tests
- **Maintainability:** Changes to UI require updates in only one place
- **Scalability:** Easy to add new pages, tests, and data

---

## 📚 FRAMEWORK STRUCTURE

### Directory Layout
```
Automation_Framework/
│
├── pages/
│   ├── basePage.ts                    (Base page class with common utilities)
│   ├── [applicationName]Page.ts      (Individual page class for each page/feature)
│   ├── [applicationName]Page.ts      (Example: loginPage.ts, homePage.ts, cartPage.ts)
│   └── [applicationName]Page.ts      (Each page contains: locators + business logic)
│
├── utilities/ (or data/)
│   ├── testData.ts                    (Test data constants: URLs, credentials, test inputs)
│   ├── excelDataReader.ts            (Excel file reader for reading test cases)
│   ├── waitUtilities.ts              (Custom wait functions)
│   ├── assertionUtilities.ts         (Custom assertion helpers)
│   └── [otherUtilities].ts
│
├── tests/
│   ├── [featureName].spec.ts         (Test cases for specific feature)
│   ├── [featureName].spec.ts         (Example: login.spec.ts, cart.spec.ts, checkout.spec.ts)
│   └── [featureName].spec.ts         (Each test file focuses on one functional area)
│
├── test-data/
│   └── TestCases.xlsx               (Excel file containing test cases)
│
├── playwright.config.ts              (Playwright configuration: browsers, timeouts, etc.)
├── package.json                      (Dependencies and scripts)
├── tsconfig.json                     (TypeScript configuration)
└── .env / .env.local                (Optional: Environment variables for credentials)
```

### Layered Architecture
```
Test Class (*.spec.ts) ─── Test case execution & assertions
    ↓ instantiates & calls
Page Object Class (*Page.ts) ─── Page-specific locators & business logic
    ↓ inherits & calls
Base Page Class (basePage.ts) ─── Common utilities, wait functions, interaction methods
```

---

## 🔨 PAGE OBJECT MODEL (POM) PATTERNS

### What is Page Object Model?
A design pattern that:
- Represents each web page/feature as a separate TypeScript class
- Encapsulates all locators and interactions for that page
- Provides methods for actions and validations
- Reduces code duplication and improves maintainability

### Structure
```
HomePage.ts contains:
  ├── Locators (readonly properties with Locator type)
  │   ├── searchBoxLocator
  │   ├── loginButtonLocator
  │   └── productCategoryLocator
  │
  ├── Methods (async functions for interactions)
  │   ├── navigateToHomePage()
  │   ├── searchForProduct(productName)
  │   ├── clickCategory(categoryName)
  │   └── isHomePageDisplayed()
```

---

## 🔨 BASE PAGE CLASS TEMPLATE

**File:** `pages/basePage.ts`

The base page class provides common utilities inherited by all page classes.

```typescript
import { Page, Locator } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  // ============= NAVIGATION =============
  async navigateTo(url: string) {
    await this.page.goto(url);
  }

  // ============= WAIT UTILITIES =============
  async waitForElement(selector: string, timeout: number = 5000) {
    await this.page.waitForSelector(selector, { timeout });
  }

  async waitForLocator(locator: Locator, timeout: number = 5000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async waitForNavigation(timeout: number = 5000) {
    await this.page.waitForNavigation({ timeout });
  }

  // ============= CLICK OPERATIONS =============
  async clickElement(locator: Locator) {
    await locator.click();
  }

  async doubleClickElement(locator: Locator) {
    await locator.dblclick();
  }

  async rightClickElement(locator: Locator) {
    await locator.click({ button: 'right' });
  }

  // ============= TEXT OPERATIONS =============
  async fillText(locator: Locator, text: string) {
    await locator.clear();
    await locator.fill(text);
  }

  async appendText(locator: Locator, text: string) {
    await locator.type(text);
  }

  async getText(locator: Locator): Promise<string> {
    return await locator.textContent() || '';
  }

  async getInputValue(locator: Locator): Promise<string> {
    return await locator.inputValue();
  }

  // ============= VISIBILITY CHECKS =============
  async isElementVisible(locator: Locator, timeout: number = 3000): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  async isElementHidden(locator: Locator, timeout: number = 3000): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'hidden', timeout });
      return true;
    } catch {
      return false;
    }
  }

  async isElementEnabled(locator: Locator): Promise<boolean> {
    return await locator.isEnabled();
  }

  // ============= COUNT & SELECTION =============
  async getElementCount(selector: string): Promise<number> {
    return await this.page.locator(selector).count();
  }

  // ============= BROWSER UTILITIES =============
  async reloadPage() {
    await this.page.reload();
  }

  async goBack() {
    await this.page.goBack();
  }

  async goForward() {
    await this.page.goForward();
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async getPageUrl(): Promise<string> {
    return this.page.url();
  }

  // ============= DIALOG HANDLING =============
  async acceptDialog() {
    this.page.once('dialog', dialog => dialog.accept());
  }

  async dismissDialog() {
    this.page.once('dialog', dialog => dialog.dismiss());
  }

  // ============= SCREENSHOT =============
  async takeScreenshot(filename: string) {
    await this.page.screenshot({ path: `screenshots/${filename}.png` });
  }
}
```

---

## 📄 STANDARD PAGE OBJECT CLASS TEMPLATE

**File:** `pages/[featureName]Page.ts`

Each page in the application gets its own class. Example: loginPage.ts, cartPage.ts, productPage.ts

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class LoginPage extends BasePage {
  // ============= LOCATORS (Property Declarations) =============
  // RULE: All locators must use 'Locator' suffix
  // RULE: Locators are readonly and defined at class level
  // RULE: Use XPath with normalize-space() for text-based selectors

  readonly usernameFieldLocator: Locator = this.page.locator('#username');
  readonly passwordFieldLocator: Locator = this.page.locator('#password');
  readonly loginButtonLocator: Locator = this.page.locator('//button[normalize-space()="Login"]');
  readonly errorMessageLocator: Locator = this.page.locator('.error-message');
  readonly pageHeadingLocator: Locator = this.page.locator('//h1[normalize-space()="Login"]');

  // ============= PAGE NAVIGATION =============
  async navigateToLoginPage() {
    await this.navigateTo('https://application.com/login');
  }

  // ============= VALIDATION METHODS =============
  // These methods check if page elements are visible/displayed
  async isLoginPageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.pageHeadingLocator);
  }

  async isErrorMessageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessageLocator);
  }

  // ============= ACTION METHODS =============
  // These methods perform user interactions

  async enterUsername(username: string) {
    await this.waitForLocator(this.usernameFieldLocator);
    await this.fillText(this.usernameFieldLocator, username);
  }

  async enterPassword(password: string) {
    await this.fillText(this.passwordFieldLocator, password);
  }

  async clickLoginButton() {
    await this.clickElement(this.loginButtonLocator);
  }

  // ============= COMBINED BUSINESS LOGIC METHODS =============
  // These methods combine multiple actions into a single logical step
  // Used by test classes to perform complete user journeys

  async loginWithCredentials(username: string, password: string) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  async getErrorMessageText(): Promise<string> {
    return await this.getText(this.errorMessageLocator);
  }
}
```

### Page Class Best Practices
1. **One class per page/feature** - Each distinct page gets its own file
2. **Locators at class level** - All locators defined as readonly properties at the top
3. **Locator naming** - Always use `[elementName]Locator` suffix
4. **Method organization** - Group methods by purpose: navigation, validation, actions, business logic
5. **No assertions in page classes** - Page classes only interact with the page; tests do assertions
6. **Descriptive method names** - Method names should clearly describe what they do

---

## 🎯 TEST CLASS TEMPLATE

**File:** `tests/[featureName].spec.ts`

Test classes contain the actual test cases. Each test focuses on one specific scenario.

```typescript
import { test, expect, Page } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { LoginPage } from '../pages/loginPage';
import { TEST_DATA } from '../utilities/testData';

test.describe('Login Feature Tests', () => {
  let page: Page;
  let homePage: HomePage;
  let loginPage: LoginPage;

  // ============= SETUP & TEARDOWN =============
  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    await homePage.navigateToHomePage();
  });

  test.afterEach(async () => {
    await page.close();
  });

  // ============= TEST CASES =============
  test('feature_functionality_specificScenario', async () => {
    // Naming pattern: [feature]_[functionality]_[scenario]
    // Example: login_validCredentials_successfulLogin
    // Example: cart_multipleItems_correctTotalCalculation

    // ARRANGE - Setup test data and preconditions
    const testUsername = TEST_DATA.VALID_USER.username;
    const testPassword = TEST_DATA.VALID_USER.password;

    // ACT - Perform user interactions
    await loginPage.loginWithCredentials(testUsername, testPassword);

    // ASSERT - Verify expected results
    const isLoggedIn = await homePage.isUserLoggedIn();
    expect(isLoggedIn).toBe(true);
  });

  test('login_validCredentials_userRedirectedToDashboard', async () => {
    // Test with specific validation
    await loginPage.loginWithCredentials(
      TEST_DATA.VALID_USER.username,
      TEST_DATA.VALID_USER.password
    );

    const pageUrl = await loginPage.getPageUrl();
    expect(pageUrl).toContain('/dashboard');
  });

  test('login_invalidCredentials_errorMessageDisplayed', async () => {
    // Test error scenario
    await loginPage.loginWithCredentials(
      TEST_DATA.INVALID_USER.username,
      TEST_DATA.INVALID_USER.password
    );

    const isErrorDisplayed = await loginPage.isErrorMessageDisplayed();
    expect(isErrorDisplayed).toBe(true);

    const errorText = await loginPage.getErrorMessageText();
    expect(errorText).toContain('Invalid credentials');
  });

  test('login_emptyFields_validationErrorsDisplayed', async () => {
    // Test without filling any fields
    await loginPage.clickLoginButton();

    const isErrorDisplayed = await loginPage.isErrorMessageDisplayed();
    expect(isErrorDisplayed).toBe(true);
  });
});
```

### Test Class Best Practices
1. **One describe block per feature** - Group related tests together
2. **Clear test naming** - Use pattern: `feature_functionality_scenario`
3. **AAA Pattern** - Arrange (setup), Act (execute), Assert (verify)
4. **One assertion per test** - Or multiple related assertions on same object
5. **Use beforeEach/afterEach** - For setup and cleanup
6. **Data-driven when possible** - Use testData constants instead of hardcoding values
7. **No page class logic in tests** - Keep tests focused on test logic, not page interactions

---

## 📋 TEST DATA CLASS TEMPLATE

**File:** `utilities/testData.ts`

Centralized test data used across all tests. Avoid hardcoding values in test classes.

```typescript
export const TEST_DATA = {
  // ============= URLS =============
  BASE_URL: 'https://application.com',
  LOGIN_URL: 'https://application.com/login',
  DASHBOARD_URL: 'https://application.com/dashboard',
  PRODUCTS_URL: 'https://application.com/products',

  // ============= USER ACCOUNTS =============
  VALID_USER: {
    username: 'testuser@example.com',
    password: 'SecurePassword123',
    fullName: 'Test User'
  },

  ADMIN_USER: {
    username: 'admin@example.com',
    password: 'AdminPassword123'
  },

  INVALID_USER: {
    username: 'nonexistent@example.com',
    password: 'WrongPassword'
  },

  // ============= PRODUCTS =============
  PRODUCTS: {
    PRODUCT_001: {
      name: 'Product 1',
      price: 29.99,
      quantity: 1
    },
    PRODUCT_002: {
      name: 'Product 2',
      price: 49.99,
      quantity: 2
    }
  },

  // ============= CATEGORIES =============
  CATEGORIES: {
    ELECTRONICS: 'Electronics',
    CLOTHING: 'Clothing',
    HOME: 'Home & Garden'
  },

  // ============= FORM DATA =============
  CHECKOUT_DATA: {
    fullName: 'John Doe',
    email: 'john@example.com',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    cardNumber: '4111111111111111',
    expiryMonth: '12',
    expiryYear: '2025',
    cvv: '123'
  },

  // ============= TIMEOUTS =============
  TIMEOUTS: {
    SHORT: 3000,
    MEDIUM: 5000,
    LONG: 10000
  },

  // ============= MESSAGES =============
  SUCCESS_MESSAGES: {
    LOGIN_SUCCESS: 'Login successful',
    PRODUCT_ADDED: 'Product added to cart',
    ORDER_PLACED: 'Order placed successfully'
  },

  ERROR_MESSAGES: {
    INVALID_CREDENTIALS: 'Invalid username or password',
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Invalid email address'
  }
};
```

---

## 🔍 SELECTOR LOCATOR STRATEGY

### Priority Order for Selecting Elements

Use selectors in this priority order. Higher priority = more stable and reliable.

1. **Unique ID Attribute** (Most Stable)
   ```typescript
   readonly loginButtonLocator = this.page.locator('#btn-login');
   ```

2. **data-testid Attribute** (Recommended for test automation)
   ```typescript
   readonly usernameFieldLocator = this.page.locator('[data-testid="username-input"]');
   ```

3. **CSS Selector with Unique Class Combination**
   ```typescript
   readonly cartIconLocator = this.page.locator('.navbar .cart-icon');
   ```

4. **XPath with Attribute + Text**
   ```typescript
   readonly loginButtonLocator = this.page.locator('//button[@type="submit" and normalize-space()="Login"]');
   ```

5. **Simple XPath with normalize-space()** (Text-based, last resort)
   ```typescript
   readonly loginButtonLocator = this.page.locator('//button[normalize-space()="Login"]');
   ```

### Selector Best Practices

✅ **DO:**
- Use `normalize-space()` in XPath for text matching to handle whitespace
- Combine multiple attributes for uniqueness
- Use CSS selectors when possible (faster than XPath)
- Use data-testid attributes added by developers

❌ **DON'T:**
- Use fragile selectors like `//div[2]/button[1]` (positional)
- Rely on elements without stable identifiers
- Hardcode dynamic IDs that change between sessions
- Use overly complex XPath expressions

### Examples

```typescript
// ❌ BAD - Fragile positional selector
readonly productLocator = this.page.locator('//div[2]/div[3]/button');

// ✅ GOOD - Attribute-based with text
readonly productLocator = this.page.locator('//button[normalize-space()="Add to Cart"]');

// ❌ BAD - Multiple possible matches
readonly categoryLocator = this.page.locator('.list-item');

// ✅ GOOD - Unique combination
readonly categoryLocator = this.page.locator('//li[@class="category-item" and normalize-space()="Electronics"]');

// ❌ BAD - Generic XPath
readonly priceLocator = this.page.locator('//span');

// ✅ GOOD - Specific selector
readonly priceLocator = this.page.locator('[data-testid="product-price"]');
```

---

## 🚨 CRITICAL RULES — MANDATORY

### RULE #1: No Hard-Coded Waits (No setTimeout)
❌ **DON'T:**
```typescript
await new Promise(resolve => setTimeout(resolve, 3000));
```

✅ **DO:**
```typescript
// Wait for specific element to appear
await this.page.waitForSelector('[data-testid="success-message"]', { timeout: 5000 });

// Or use Locator's built-in wait
await this.successMessageLocator.waitFor({ state: 'visible' });

// Or wait for navigation
await Promise.all([
  this.page.waitForNavigation(),
  this.clickElement(this.submitButton)
]);
```

### RULE #2: All Locators Use 'Locator' Suffix
❌ **DON'T:**
```typescript
readonly loginButton = this.page.locator('...');
readonly usernameField = this.page.locator('...');
```

✅ **DO:**
```typescript
readonly loginButtonLocator = this.page.locator('...');
readonly usernameFieldLocator = this.page.locator('...');
```

### RULE #3: Page Classes Do Not Contain Assertions
❌ **DON'T:**
```typescript
// In Page Class
async loginAndVerify(username: string, password: string) {
  await this.loginWithCredentials(username, password);
  expect(await this.isUserLoggedIn()).toBe(true); // ❌ ASSERTION IN PAGE CLASS
}
```

✅ **DO:**
```typescript
// In Page Class
async loginWithCredentials(username: string, password: string) {
  await this.enterUsername(username);
  await this.enterPassword(password);
  await this.clickLoginButton();
}

// In Test Class
async loginTest() {
  await loginPage.loginWithCredentials('user@test.com', 'pass123');
  const isLoggedIn = await loginPage.isUserLoggedIn();
  expect(isLoggedIn).toBe(true); // ✅ ASSERTION IN TEST CLASS
}
```

### RULE #4: Implement ALL Test Steps
❌ **DON'T:** Test has 5 steps, but you only implement steps 1-3
✅ **DO:** Implement ALL steps with corresponding validations

### RULE #5: Never Hardcode Waits in Page Classes
❌ **DON'T:**
```typescript
async clickLoginButton() {
  await this.loginButtonLocator.click();
  await this.page.waitForTimeout(2000); // ❌ HARDCODED WAIT
}
```

✅ **DO:**
```typescript
async clickLoginButton() {
  await this.loginButtonLocator.click();
  // Wait for resulting navigation or next page element to appear
  await this.page.waitForNavigation({ timeout: 5000 });
}
```

### RULE #6: Method Naming Convention
❌ **DON'T:** `test1()`, `login()`, `TC_001()`, `test_login_valid_user()`
✅ **DO:** `loginWithValidCredentials()`, `addProductToCart()`, `verifyCheckoutSuccess()`

**Pattern for tests:** `[feature]_[functionality]_[scenario]`
- `login_validCredentials_successfulLogin`
- `cart_multipleItems_correctTotalCalculation`
- `checkout_missingField_validationErrorDisplayed`

### RULE #7: Use AAA Pattern in Tests (Arrange, Act, Assert)
```typescript
test('login_validCredentials_successfulLogin', async () => {
  // ARRANGE - Set up test data
  const username = TEST_DATA.VALID_USER.username;
  const password = TEST_DATA.VALID_USER.password;

  // ACT - Perform actions
  await loginPage.loginWithCredentials(username, password);

  // ASSERT - Verify results
  const isLoggedIn = await homePage.isUserLoggedIn();
  expect(isLoggedIn).toBe(true);
});
```

### RULE #8: Organized Code Comments
```typescript
export class HomePage extends BasePage {
  // ============= LOCATORS =============
  readonly searchBoxLocator: Locator = this.page.locator('#search-input');

  // ============= NAVIGATION =============
  async navigateToHomePage() { ... }

  // ============= VALIDATION METHODS =============
  async isHomePageDisplayed(): Promise<boolean> { ... }

  // ============= ACTION METHODS =============
  async searchForProduct(productName: string) { ... }

  // ============= BUSINESS LOGIC METHODS =============
  async searchAndViewProduct(productName: string) { ... }
}
```

---

## 📋 AUTOMATION WORKFLOW

### Phase 1: Test Case Reading & Understanding
1. Receive test case (from Excel, Jira, or manual specification)
2. Parse complete test case details
3. Display test case in clear format to user
4. **STOP and WAIT** for user confirmation
5. Do NOT proceed without explicit approval

### Phase 2: Element Inspection & Locator Capture
1. Navigate to application using MCP browser
2. Execute each test step manually in browser
3. Inspect elements used in each step
4. Capture and verify unique selectors for:
   - Every input field
   - Every button/link clicked
   - Every validation/check point
5. Document selectors in a table with purpose and selector type
6. Verify selectors work before proceeding

### Phase 3: Framework Code Review
1. Check existing page classes for related functionality
2. Search for existing methods that might be reused
3. Verify method signatures and return types
4. Check for any hardcoded values that need parameterization
5. Identify gaps in framework coverage

### Phase 4: Code Implementation
1. **Add/Update Page Object Class:**
   - Add new locators needed for test
   - Add new methods or update existing ones
   - Follow naming conventions
   - Ensure proper TypeScript types
   - Add code comments where needed

2. **Add/Update Test Class:**
   - Create new test method or update existing
   - Follow AAA pattern
   - Use testData constants
   - Add clear descriptive test names
   - Ensure all test steps are implemented

3. **Update Test Data (if needed):**
   - Add any new test inputs
   - Add new URLs if needed
   - Add new credentials if needed

### Phase 5: Validation & Testing
1. Review generated code for correctness
2. Walk through code against actual application UI
3. Verify all selectors find correct elements
4. Verify all methods work as intended
5. Run tests to ensure they pass
6. Fix any issues found
7. Verify TypeScript compilation succeeds

---

## 🔧 COMMON PLAYWRIGHT PATTERNS

### Pattern 1: Click and Wait for Navigation
```typescript
async clickAndNavigate(locator: Locator) {
  await Promise.all([
    this.page.waitForNavigation(),
    locator.click()
  ]);
}
```

### Pattern 2: Handle Alerts/Dialogs
```typescript
// Accept alert
page.once('dialog', dialog => dialog.accept());
await buttonThatTriggersAlert.click();

// Dismiss alert
page.once('dialog', dialog => dialog.dismiss());
await buttonThatTriggersAlert.click();

// Get alert message
let alertMessage = '';
page.once('dialog', dialog => {
  alertMessage = dialog.message();
  dialog.accept();
});
```

### Pattern 3: Fill Form and Submit
```typescript
async fillAndSubmitForm(data: {username: string, password: string}) {
  await this.fillText(this.usernameFieldLocator, data.username);
  await this.fillText(this.passwordFieldLocator, data.password);
  await this.clickElement(this.submitButtonLocator);
}
```

### Pattern 4: Check Multiple Elements Visibility
```typescript
async isPageDisplayed(): Promise<boolean> {
  const allVisible = await Promise.all([
    this.isElementVisible(this.headerLocator),
    this.isElementVisible(this.contentLocator),
    this.isElementVisible(this.footerLocator)
  ]);
  return allVisible.every(visible => visible === true);
}
```

### Pattern 5: Get Attribute Value
```typescript
async getAttributeValue(locator: Locator, attribute: string): Promise<string> {
  return await locator.getAttribute(attribute) || '';
}
```

### Pattern 6: Select from Dropdown
```typescript
async selectFromDropdown(dropdownLocator: Locator, optionText: string) {
  await dropdownLocator.selectOption({ label: optionText });
}
```

### Pattern 7: Upload File
```typescript
async uploadFile(inputLocator: Locator, filePath: string) {
  await inputLocator.setInputFiles(filePath);
}
```

---

## 📂 FILE NAMING CONVENTIONS

### Page Classes
- **Format:** `[featureName]Page.ts`
- **Examples:**
  - `loginPage.ts`
  - `homePage.ts`
  - `cartPage.ts`
  - `checkoutPage.ts`
  - `profilePage.ts`

### Test Classes
- **Format:** `[featureName].spec.ts`
- **Examples:**
  - `login.spec.ts`
  - `shopping.spec.ts`
  - `checkout.spec.ts`
  - `navigation.spec.ts`

### Utility Files
- **Format:** `[utilityName]Utilities.ts` or `[utilityName].ts`
- **Examples:**
  - `testData.ts`
  - `excelDataReader.ts`
  - `waitUtilities.ts`
  - `assertionUtilities.ts`

---

## ⚙️ PLAYWRIGHT CONFIGURATION

### playwright.config.ts (Basic Setup)
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,

  reporter: 'html',

  use: {
    baseURL: 'https://application.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'npm run start',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env['CI'],
  },
});
```

---

## 🚀 RUNNING TESTS

```bash
# Run all tests
npm test

# Run specific test file
npm test -- tests/login.spec.ts

# Run tests in a specific browser
npm test -- --project=chromium

# Run tests in headed mode (see browser)
npm test -- --headed

# Run tests with specific grep pattern
npm test -- --grep="login"

# Run tests and open HTML report
npm test && npx playwright show-report
```

---

## 📊 PROJECT SETUP CHECKLIST

When starting a new project from scratch:

- [ ] Create `pages/basePage.ts` with common utilities
- [ ] Create page classes for each application page/feature
- [ ] Create `utilities/testData.ts` with test constants
- [ ] Create test spec files for each feature
- [ ] Configure `playwright.config.ts`
- [ ] Create `package.json` with dependencies
- [ ] Set up `tsconfig.json`
- [ ] Create `.env` for sensitive data (optional)
- [ ] Document application structure and key workflows
- [ ] Review and follow all naming conventions
- [ ] Test framework with sample test case
- [ ] Document any application-specific patterns

---

## 📝 SUMMARY

This framework emphasizes:
1. **Maintainability** - Changes localized to page classes
2. **Reusability** - Methods written once, used many times
3. **Clarity** - Clear naming, organized code, proper comments
4. **Reliability** - Proper waits, robust selectors, error handling
5. **Scalability** - Easy to add new pages and tests
6. **Best Practices** - Following industry standards for test automation

Use this as a reference for all new Playwright + TypeScript projects!
