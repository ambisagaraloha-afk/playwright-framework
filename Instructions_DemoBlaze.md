# Copilot Instructions for DemoBlaze E2E Automation (Playwright + TypeScript)

## 🚀 QUICK START
**User provides:** Excel file path or test case name (e.g., "Automate TC-001 from DemoBlaze_TestCases.xlsx")
**Goal:** Write complete, correct, efficient Playwright + TypeScript test automation code following framework patterns.

---

## 🌐 TARGET APPLICATION DETAILS
**URL:** https://demoblaze.com/index.html

### Application Overview
DemoBlaze is an e-commerce product store with the following features:
- **Product Categories:** Phones, Laptops, Monitors
- **User Authentication:** Sign up, Login, Logout
- **Shopping Cart:** Add/Remove products, View cart
- **Checkout:** Order placement with payment details
- **UI Elements:** Product carousel, search, filtering, responsive design

---

## 📊 TEST CASE SOURCE: EXCEL SHEET

### Expected Excel Format (DemoBlaze_TestCases.xlsx)
| Column | Description | Required |
|--------|-------------|----------|
| TestCaseId | Unique ID (e.g., TC-001) | ✅ Yes |
| TestCaseName | Descriptive name | ✅ Yes |
| Descriptive | Detailed description of test | ✅ Yes |
| Category | UI/Navigation / Product Browsing / Shopping Cart / Checkout / Authentication | ✅ Yes |
| Preconditions | Setup requirements | ✅ Yes |
| Priority | High / Medium / Low | ✅ Yes |
| TestData | Input values for the test | ✅ Yes |
| Steps for execution | Numbered steps to perform | ✅ Yes |
| ExpectedResult | What should happen | ✅ Yes |
| Status | Test execution status | ✅ Yes |

### How Copilot Reads Excel Test Cases
1. User provides Excel file path or test case ID (e.g., "TC-001")
2. Copilot reads and displays ALL test details from the Excel
3. 🛑 **STOP AND WAIT** → User must reply "Yes, proceed" or "Yes" or "OK"
4. DO NOT START CODING WITHOUT CONFIRMATION
5. After confirmation → Execute full test case in MCP to capture ALL locators
6. Write automation using ONLY verified locators and EXACT test case values

---

## 🚨 CRITICAL RULES — MANDATORY

### RULE #1: Always Display Test Case First AND Wait for Confirmation
❌ **DON'T:** Read Excel and start coding immediately
✅ **DO:** Display complete test case in chat → WAIT for user to reply "Yes, proceed"

**Process:**
1. Read Excel test case (user provides file path or test case ID)
2. Display ALL test details in chat formatted as:
```
Test Case ID: TC-001
Title: Verify Home Page Loads Successfully
Category: UI/Navigation
Priority: High

Preconditions:
  - User has internet connectivity
  - Access to demoblaze.com

Test Data:
  - URL: https://demoblaze.com/index.html

Steps:
1. Navigate to https://demoblaze.com/index.html
2. Wait for page to fully load

Expected Result:
  - Home page loads successfully with all elements visible
  - Products, Categories (Phones, Laptops, Monitors), navigation menu visible
  - Footer displayed

Status: Not Executed
```
3. Say: "I've read the test case. Please confirm if this is correct and I should proceed."
4. **STOP** — Do not execute MCP, do not start coding
5. WAIT for user response
6. Only after confirmation → Continue with MCP execution

---

### RULE #2: Capture BOTH Action AND Validation Locators During MCP Execution
❌ **DON'T:** Only capture input/button locators
✅ **DO:** Also capture error messages, success indicators, page headers, cart badges, product details

**DemoBlaze-specific examples:**
- Category filter → Capture clickable category element
- Add to cart button → Capture button selector
- Success message → Capture confirmation message locator
- Cart badge count → Capture badge element
- Product price → Capture price element
- Login error → Capture error message element
- Page title → Capture page header element

**During MCP Execution:**
1. For every action → Capture action element locator (must be unique)
2. For every validation/check → Capture validation element locator (must be unique)
3. For every page navigation → Capture visible element for page load verification
4. Document ALL locators before starting code implementation

---

### RULE #3: Never Guess Locators — MCP Verify First
❌ **DON'T:** Guess selectors without inspecting
✅ **DO:** Inspect actual DOM in MCP browser, verify selector works, then use it

**Priority order for selectors:**
1. `data-testid` attribute (if available)
2. `id` attribute
3. `class` attribute
4. CSS selectors with unique combinations
5. XPath (last resort, keep simple)

---

### RULE #4: Locator Priority (Use in Order)
1. **Unique ID attribute** (preferred) → `#btn-login`
2. **data-testid attribute** → `[data-testid='login-button']`
3. **CSS Selector with class** → `.btn-add-to-cart`
4. **XPath** (last resort, keep simple) → `//button[normalize-space()='Login']`
5. **Text-based selectors** → `getByRole('button', { name: 'Add to Cart' })`

---

### RULE #5: Use Page Object Model with Proper Structure
❌ **DON'T:**
```typescript
await page.locator('[some-selector]').click();
```
✅ **DO:**
```typescript
// Declare at class level in page object
readonly addToCartButton = page.locator('[data-id="add-to-cart"]');

// Use in methods
async addProductToCart() {
  await this.addToCartButton.click();
}
```

---

### RULE #6: Element Variable Names Must Use 'Locator' Suffix
❌ **DON'T:** `loginButton`, `usernameField`, `cartIcon`
✅ **DO:** `loginButtonLocator`, `usernameFieldLocator`, `cartIconLocator`

---

### RULE #7: Avoid Complex Assertions in Test Methods
❌ **DON'T:**
```typescript
expect(await page.locator('[some-selector]').isVisible()).toBe(true);
```
✅ **DO:**
```typescript
// In page object
async isProductsPageDisplayed(): Promise<boolean> {
  return await this.pageTitle.isVisible();
}

// In test
const isDisplayed = await inventoryPage.isProductsPageDisplayed();
expect(isDisplayed).toBe(true);
```

---

### RULE #8: No Hard Waits — Use Playwright's Built-in Waits
❌ **DON'T:**
```typescript
await new Promise(resolve => setTimeout(resolve, 3000));
```
✅ **DO:**
```typescript
await page.waitForSelector('[selector]', { timeout: 5000 });
// OR
await this.pageTitle.waitFor({ state: 'visible' });
```

---

### RULE #9: Implement ALL Test Steps — No Partial Implementation
❌ **DON'T:** Test case has 7 steps, only implement steps 1-5
✅ **DO:** Implement ALL 7 steps with all validations. No TODOs.

---

### RULE #10: Test Method Naming Convention
❌ **DON'T:** `test1()`, `loginTest()`, `TC001()`
✅ **DO:** `demoBlaze_login_verifyValidUserLogin()`, `demoBlaze_cart_verifyAddSingleProduct()`

**Pattern:** `demoBlaze_[page]_[testDescription]()`

---

### RULE #11: Always Ask Before Adding to Files
❌ **DON'T:** Create separate test/page/data files without asking
✅ **DO:** Ask user which existing file to add to, or confirm new file creation

---

### RULE #12: XPath Best Practice — Always Use normalize-space()
❌ **DON'T:** `//span[text()='Products']`
✅ **DO:** `//span[normalize-space()='Products']`

---

## 📚 FRAMEWORK STRUCTURE

### Directory Layout
```
Playwright_Framework/
│
├── pages/
│   ├── basePage.ts           (Base page class with common methods)
│   ├── homePage.ts           (Home page locators + methods)
│   ├── loginPage.ts          (Login page locators + methods)
│   ├── cartPage.ts           (Shopping cart page)
│   ├── catPage.ts            (Category/Products page)
│   └── checkoutPage.ts       (Checkout/Order placement page)
│
├── data/
│   ├── testData.ts           (Test data constants)
│   └── excelDataReader.ts    (Excel file reader utility)
│
├── utilities/
│   ├── waitUtilities.ts      (Wait utilities)
│   ├── assertionUtilities.ts (Custom assertions)
│   └── browserUtilities.ts   (Browser utilities)
│
├── tests/
│   ├── loginTest.spec.ts     (Login test cases)
│   ├── cartTest.spec.ts      (Shopping cart tests)
│   ├── checkoutTest.spec.ts  (Checkout tests)
│   └── example.spec.ts       (Example reference)
│
├── test-data/
│   └── DemoBlaze_TestCases.xlsx (Excel test cases)
│
├── playwright.config.ts      (Playwright configuration)
├── package.json              (Dependencies)
└── tsconfig.json            (TypeScript configuration)
```

### Layered Architecture
```
Test Class (XXXTest.spec.ts) — Test case execution
    ↓ calls
Page Object Class (XXXPage.ts) — Locators + Business logic + Element interactions
    ↓ uses
Base Page Class (basePage.ts) — Common utilities and wait methods
```

---

## 🔨 PAGE OBJECT TEMPLATES

### Base Page Class — basePage.ts
```typescript
import { Page, Locator } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  async navigateTo(url: string) {
    await this.page.goto(url);
  }

  async waitForElement(selector: string, timeout: number = 5000) {
    await this.page.waitForSelector(selector, { timeout });
  }

  async waitForLocator(locator: Locator, timeout: number = 5000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async clickElement(locator: Locator) {
    await locator.click();
  }

  async fillText(locator: Locator, text: string) {
    await locator.clear();
    await locator.fill(text);
  }

  async clearAndType(locator: Locator, text: string) {
    await locator.fill('');
    await locator.type(text);
  }

  async getText(locator: Locator): Promise<string> {
    return await locator.textContent() || '';
  }

  async isElementVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async isElementHidden(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'hidden', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async getElementCount(selector: string): Promise<number> {
    return await this.page.locator(selector).count();
  }
}
```

### Standard Page Object — homePage.ts
```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class HomePage extends BasePage {
  // Locators — all verified via MCP browser
  readonly phoneCategoryLocator: Locator = this.page.locator('//a[normalize-space()="Phones"]');
  readonly laptopCategoryLocator: Locator = this.page.locator('//a[normalize-space()="Laptops"]');
  readonly monitorCategoryLocator: Locator = this.page.locator('//a[normalize-space()="Monitors"]');
  readonly pageTitle: Locator = this.page.locator('//h1[normalize-space()="PRODUCT STORE"]');
  readonly cartLink: Locator = this.page.locator('#cartur');
  readonly nextButtonLocator: Locator = this.page.locator('//button[normalize-space()="Next"]');
  readonly prevButtonLocator: Locator = this.page.locator('//button[normalize-space()="Prev"]');

  async navigateToHomePage() {
    await this.navigateTo('https://demoblaze.com/index.html');
  }

  async isHomePageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.pageTitle);
  }

  async clickPhonesCategory() {
    await this.clickElement(this.phoneCategoryLocator);
  }

  async clickLaptopsCategory() {
    await this.clickElement(this.laptopCategoryLocator);
  }

  async clickMonitorsCategory() {
    await this.clickElement(this.monitorCategoryLocator);
  }

  async clickProduct(productName: string) {
    const productLocator = this.page.locator(`//a[normalize-space()="${productName}"]`);
    await this.clickElement(productLocator);
  }

  async navigateToCart() {
    await this.clickElement(this.cartLink);
  }

  async clickNextCarousel() {
    await this.clickElement(this.nextButtonLocator);
  }

  async clickPrevCarousel() {
    await this.clickElement(this.prevButtonLocator);
  }
}
```

### Standard Page Object — loginPage.ts
```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class LoginPage extends BasePage {
  readonly usernameFieldLocator: Locator = this.page.locator('#loginusername');
  readonly passwordFieldLocator: Locator = this.page.locator('#loginpassword');
  readonly loginButtonLocator: Locator = this.page.locator('//button[normalize-space()="Log in"]');
  readonly signupUsernameLocator: Locator = this.page.locator('#sign-username');
  readonly signupPasswordLocator: Locator = this.page.locator('#sign-password');
  readonly signupButtonLocator: Locator = this.page.locator('//button[normalize-space()="Sign up"]');
  readonly errorMessageLocator: Locator = this.page.locator('.show.alert');

  async openLoginModal() {
    const loginLink = this.page.locator('//a[normalize-space()="Log in"]');
    await this.clickElement(loginLink);
    await this.page.waitForTimeout(500);
  }

  async openSignupModal() {
    const signupLink = this.page.locator('//a[normalize-space()="Sign up"]');
    await this.clickElement(signupLink);
    await this.page.waitForTimeout(500);
  }

  async enterUsername(username: string) {
    await this.waitForLocator(this.usernameFieldLocator);
    await this.fillText(this.usernameFieldLocator, username);
  }

  async enterPassword(password: string) {
    await this.waitForLocator(this.passwordFieldLocator);
    await this.fillText(this.passwordFieldLocator, password);
  }

  async clickLoginButton() {
    await this.clickElement(this.loginButtonLocator);
    await this.page.waitForTimeout(1000);
  }

  async loginWithCredentials(username: string, password: string) {
    await this.openLoginModal();
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  async signupWithCredentials(username: string, password: string) {
    await this.openSignupModal();
    await this.waitForLocator(this.signupUsernameLocator);
    await this.fillText(this.signupUsernameLocator, username);
    await this.fillText(this.signupPasswordLocator, password);
    await this.clickElement(this.signupButtonLocator);
    await this.page.waitForTimeout(1000);
  }

  async isErrorMessageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessageLocator);
  }

  async getErrorMessageText(): Promise<string> {
    return await this.getText(this.errorMessageLocator);
  }
}
```

### Standard Page Object — cartPage.ts
```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class CartPage extends BasePage {
  readonly pageTitle: Locator = this.page.locator('//h2[normalize-space()="Cart"]');
  readonly placeOrderButtonLocator: Locator = this.page.locator('//button[normalize-space()="Place Order"]');
  readonly totalPriceLocator: Locator = this.page.locator('.col-sm-1.text-right');

  async navigateToCart() {
    await this.navigateTo('https://demoblaze.com/cart.html');
  }

  async isCartPageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.pageTitle);
  }

  async removeProductFromCart(productName: string) {
    const removeButton = this.page.locator(`//td[normalize-space()="${productName}"]/following-sibling::td//a`);
    await this.clickElement(removeButton);
    await this.page.waitForTimeout(500);
  }

  async clickPlaceOrder() {
    await this.clickElement(this.placeOrderButtonLocator);
    await this.page.waitForTimeout(500);
  }

  async getTotalPrice(): Promise<string> {
    return await this.getText(this.totalPriceLocator);
  }

  async getProductCount(): Promise<number> {
    const productRows = this.page.locator('//tbody/tr');
    return await productRows.count();
  }
}
```

### Standard Page Object — catPage.ts
```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class CatPage extends BasePage {
  async clickProduct(productName: string) {
    const productLocator = this.page.locator(`//a[normalize-space()="${productName}"]`);
    await this.clickElement(productLocator);
    await this.page.waitForTimeout(500);
  }

  async clickAddToCart() {
    const addToCartButton = this.page.locator('//a[normalize-space()="Add to cart"]');
    await this.clickElement(addToCartButton);
    await this.page.waitForTimeout(500);
  }

  async getProductPrice(): Promise<string> {
    const priceLocator = this.page.locator('//h3[@class="price-container"]');
    return await this.getText(priceLocator);
  }

  async getProductDescription(): Promise<string> {
    const descriptionLocator = this.page.locator('.product-description');
    return await this.getText(descriptionLocator);
  }

  async clickProductByName(productName: string) {
    const productLocator = this.page.locator(`//a[normalize-space()="${productName}"]`);
    await this.clickElement(productLocator);
    await this.page.waitForTimeout(500);
  }
}
```

---

## 🎯 TEST CLASS TEMPLATE

### Standard Test Class — loginTest.spec.ts
```typescript
import { test, expect, Page } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { LoginPage } from '../pages/loginPage';

test.describe('DemoBlaze Login Tests', () => {
  let page: Page;
  let homePage: HomePage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    await homePage.navigateToHomePage();
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('demoBlaze_login_verifyValidUserLogin', async () => {
    // TC-013: Login - Valid Credentials
    await loginPage.loginWithCredentials('testuser123', 'Password@123');
    
    // Verify user is logged in by checking if username appears in page
    const usernameDisplay = page.locator('//li/a[contains(text(), "testuser123")]');
    const isLoggedIn = await loginPage.isElementVisible(usernameDisplay);
    
    expect(isLoggedIn).toBe(true);
  });

  test('demoBlaze_login_verifyInvalidCredentials', async () => {
    // TC-014: Login - Invalid Credentials
    await loginPage.loginWithCredentials('invaliduser', 'WrongPass');
    
    const isErrorDisplayed = await loginPage.isErrorMessageDisplayed();
    expect(isErrorDisplayed).toBe(true);
  });

  test('demoBlaze_signup_verifyValidSignup', async () => {
    // TC-011: Sign Up - Valid Data
    const uniqueUsername = `testuser${Date.now()}`;
    await loginPage.signupWithCredentials(uniqueUsername, 'Password@123');
    
    const alert = page.context().on('dialog', dialog => {
      expect(dialog.message()).toContain('Sign up successful');
      dialog.accept();
    });
  });
});
```

### Standard Test Class — cartTest.spec.ts
```typescript
import { test, expect, Page } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { CatPage } from '../pages/catPage';
import { CartPage } from '../pages/cartPage';
import { LoginPage } from '../pages/loginPage';

test.describe('DemoBlaze Shopping Cart Tests', () => {
  let page: Page;
  let homePage: HomePage;
  let catPage: CatPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    homePage = new HomePage(page);
    catPage = new CatPage(page);
    cartPage = new CartPage(page);
    await homePage.navigateToHomePage();
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('demoBlaze_cart_verifyAddProductToCart', async () => {
    // TC-007: Add Product to Cart
    await homePage.clickPhonesCategory();
    await page.waitForTimeout(500);
    
    // Click on first product
    const firstProduct = page.locator('//div[@class="col-lg-4"]//a[1]').first();
    await firstProduct.click();
    await page.waitForTimeout(500);
    
    await catPage.clickAddToCart();
    
    // Verify success message
    const successAlert = page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Product added');
      await dialog.accept();
    });
  });

  test('demoBlaze_cart_verifyViewCart', async () => {
    // TC-008: View Shopping Cart
    await homePage.navigateToCart();
    
    const isCartDisplayed = await cartPage.isCartPageDisplayed();
    expect(isCartDisplayed).toBe(true);
  });

  test('demoBlaze_cart_verifyAddMultipleProducts', async () => {
    // TC-021: Add Multiple Products to Cart
    // Add first product from Phones
    await homePage.clickPhonesCategory();
    await page.waitForTimeout(500);
    let firstProduct = page.locator('//div[@class="col-lg-4"]//a[1]').first();
    await firstProduct.click();
    await page.waitForTimeout(500);
    await catPage.clickAddToCart();
    await page.waitForTimeout(500);
    
    // Return to home and add from Laptops
    await homePage.navigateToHomePage();
    await homePage.clickLaptopsCategory();
    await page.waitForTimeout(500);
    firstProduct = page.locator('//div[@class="col-lg-4"]//a[1]').first();
    await firstProduct.click();
    await page.waitForTimeout(500);
    await catPage.clickAddToCart();
    
    // Navigate to cart and verify both products
    await homePage.navigateToCart();
    const productCount = await cartPage.getProductCount();
    
    expect(productCount).toBeGreaterThanOrEqual(2);
  });
});
```

---

## 📋 DATA CLASS TEMPLATE

### Test Data — testData.ts
```typescript
export const TEST_DATA = {
  // URLs
  BASE_URL: 'https://demoblaze.com/index.html',
  CART_URL: 'https://demoblaze.com/cart.html',

  // Users
  VALID_USER: {
    username: 'testuser123',
    password: 'Password@123'
  },
  
  INVALID_USER: {
    username: 'invaliduser',
    password: 'WrongPass'
  },

  // Products
  PRODUCTS: {
    IPHONE: 'Iphone 6 32gb',
    SAMSUNG: 'Samsung galaxy s6',
    NOKIA: 'Nokia lumia 1520',
    MACBOOK: 'MacBook air',
    DELL: 'Dell i7 Gaming',
    SONY: 'Sony vaio i5'
  },

  // Categories
  CATEGORIES: {
    PHONES: 'Phones',
    LAPTOPS: 'Laptops',
    MONITORS: 'Monitors'
  },

  // Checkout
  CHECKOUT: {
    name: 'John Doe',
    country: 'United States',
    city: 'New York',
    creditCard: '4111111111111111',
    month: '12',
    year: '2025'
  }
};
```

---

## 📋 AUTOMATION PROCESS (Step by Step)

### Step 1: Read Test Case from Excel
1. User provides Excel file path or test case ID (e.g., "TC-001")
2. Parse test case from `DemoBlaze_TestCases.xlsx`
3. Display complete test case in chat with clear formatting
4. 🛑 **STOP** — Say: "I've read the test case. Please confirm if this is correct and I should proceed."
5. **WAIT** for user confirmation
6. DO NOT proceed without "Yes" / "OK" / "Proceed"

### Step 2: Navigate to DemoBlaze and Execute Test in MCP
1. Navigate to `https://demoblaze.com/index.html` using MCP browser
2. Execute EVERY step from the test case:
   - Click every element → Capture unique selector
   - Fill every field → Capture input selector
   - Navigate every page → Capture page title/header selector
   - For EVERY expected result → Capture validation element selector
3. Document ALL captured selectors in a table:

| Element | Selector Type | Selector Value | Purpose |
|---------|---------------|-----------------|---------|
| Username | CSS | `#loginusername` | Input field |
| Login Button | XPath | `//button[normalize-space()="Log in"]` | Click action |
| Error Message | CSS | `.show.alert` | Validation |

### Step 3: Check Existing Framework Code
1. Search for existing page objects covering needed elements
2. **Deep inspect** any existing method before reusing:
   - Read COMPLETE implementation
   - Check for hardcoded values or extra logic
   - If values don't match test case → Create new method
3. Identify what's missing and needs to be created

### Step 4: Write Test Code
1. Add/update locators in appropriate Page Object class
2. Add/update action/validation methods in Page Object class
3. Add test method to Test class with all steps
4. Follow ALL naming conventions and coding standards
5. Ensure TypeScript types are properly used

### Step 5: Validate in MCP
1. Walk through test code line-by-line against MCP browser
2. Verify every selector finds the correct element
3. Verify every action produces the expected result
4. Fix any mismatches

### Step 6: Compile Check
1. Verify no TypeScript compilation errors
2. Run tests to ensure they pass
3. Fix any issues found

---

## 🔧 COMMON PLAYWRIGHT PATTERNS

### Handling Alerts/Dialogs
```typescript
page.once('dialog', async dialog => {
  console.log(dialog.message());
  await dialog.accept();
});
```

### Waiting for Navigation
```typescript
await Promise.all([
  page.waitForNavigation(),
  page.locator('button').click()
]);
```

### Getting Element Count
```typescript
const count = await page.locator('selector').count();
```

### Checking Element Visibility
```typescript
const isVisible = await page.locator('selector').isVisible();
```

### Filling Forms
```typescript
await page.locator('#input-id').fill('value');
```

### Getting Text
```typescript
const text = await page.locator('selector').textContent();
```

---

## ✅ QUALITY CHECKLIST

Before marking test as complete:
- [ ] All test steps from Excel are implemented
- [ ] All expected results are validated with assertions
- [ ] All locators verified in MCP browser
- [ ] No hardcoded waits (Thread.Sleep / setTimeout) used
- [ ] Page Object Model followed
- [ ] Proper TypeScript types used
- [ ] Test method follows naming convention
- [ ] No console.log() left in code
- [ ] Code compiles without errors
- [ ] Test data from TEST_DATA used, not hardcoded
- [ ] All assertions have meaningful messages
