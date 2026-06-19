import { Page, Locator } from '@playwright/test';

export class DemoBlazePage {
  private page: Page;

  // Page locators using web-first strategies
  readonly pageTitle: Locator;
  readonly phonesLink: Locator;
  readonly laptopsLink: Locator;
  readonly monitorsLink: Locator;
  readonly productItems: Locator;
  readonly cartLink: Locator;
  readonly addToCartButton: Locator;
  readonly deleteButton: Locator;
  readonly checkoutButton: Locator;
  readonly placeOrderButton: Locator;
  readonly nameInput: Locator;
  readonly countryInput: Locator;
  readonly cityInput: Locator;
  readonly cardInput: Locator;
  readonly monthInput: Locator;
  readonly yearInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('h4:has-text("PRODUCT STORE")');
    this.phonesLink = page.locator('a#itemc').filter({ hasText: 'Phones' });
    this.laptopsLink = page.locator('a#itemc').filter({ hasText: 'Laptops' });
    this.monitorsLink = page.locator('a#itemc').filter({ hasText: 'Monitors' });
    this.productItems = page.locator('div.col-lg-4');
    this.cartLink = page.locator('a#cartur');
    this.addToCartButton = page.locator('a.btn.btn-success');
    this.deleteButton = page.locator('a.btn.btn-danger');
    this.checkoutButton = page.locator('button:has-text("Place Order")');
    this.placeOrderButton = page.locator('button:has-text("Purchase")');
    this.nameInput = page.locator('#name');
    this.countryInput = page.locator('#country');
    this.cityInput = page.locator('#city');
    this.cardInput = page.locator('#card');
    this.monthInput = page.locator('#month');
    this.yearInput = page.locator('#year');
  }

  async navigateToHome(): Promise<void> {
    await this.page.goto('/index.html', { waitUntil: 'domcontentloaded' });
  }

  async isPageTitleVisible(): Promise<boolean> {
    return await this.pageTitle.isVisible({ timeout: 10_000 });
  }

  async getCategoryLinks(): Promise<string[]> {
    const categories = [];
    const categoryElements = this.page.locator('a#itemc');
    const count = await categoryElements.count();
    
    for (let i = 0; i < count; i++) {
      const text = await categoryElements.nth(i).innerText();
      if (text.trim()) {
        categories.push(text.trim());
      }
    }
    return categories;
  }

  async clickCategoryByName(categoryName: string): Promise<void> {
    const categoryLink = this.page.locator(`a#itemc:has-text("${categoryName}")`);
    await categoryLink.click();
    // Wait for product items to be visible instead of network idle
    await this.productItems.first().waitFor({ state: 'visible', timeout: 10_000 });
  }

  async getVisibleProductCount(): Promise<number> {
    // Wait for products to be visible
    await this.productItems.first().waitFor({ state: 'visible', timeout: 10_000 });
    return await this.productItems.count();
  }

  async getVisibleProductNames(): Promise<string[]> {
    const productNames = [];
    const count = await this.getVisibleProductCount();
    
    for (let i = 0; i < count; i++) {
      const nameElement = this.productItems.nth(i).locator('h4');
      const name = await nameElement.innerText();
      productNames.push(name);
    }
    return productNames;
  }

  async clickFirstProduct(): Promise<void> {
    const firstProduct = this.productItems.first().locator('a.hrefch');
    await firstProduct.click();
    await this.page.waitForTimeout(2000);
  }

  async clickProductByName(productName: string): Promise<void> {
    const productLink = this.page.locator(`a.hrefch:has-text("${productName}")`).first();
    await productLink.click();
    await this.page.waitForTimeout(2000);
  }

  async addCurrentProductToCart(): Promise<void> {
    // Try different selectors for the Add to cart button
    let addBtn = this.page.locator('a:has-text("Add to cart")').first();
    
    // Check if button exists, if not try alternative selectors
    let count = await addBtn.count();
    if (count === 0) {
      addBtn = this.page.locator('button:has-text("Add to cart")').first();
    }
    
    count = await addBtn.count();
    if (count === 0) {
      addBtn = this.page.locator('[onclick*="addToCart"]').first();
    }
    
    await addBtn.click();
    await this.page.waitForTimeout(500);
    
    // Handle alert if present
    this.page.once('dialog', async dialog => {
      await dialog.accept();
    });
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
    await this.page.waitForTimeout(2000);
  }

  async getCartItemCount(): Promise<number> {
    const rows = this.page.locator('table tbody tr');
    return await rows.count();
  }

  async getCartTotal(): Promise<string> {
    const totalElement = this.page.locator('h3 strong').last();
    return await totalElement.innerText();
  }

  async deleteFirstCartItem(): Promise<void> {
    const deleteBtn = this.deleteButton.first();
    await deleteBtn.click();
    await this.page.waitForTimeout(1000);
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
    await this.page.waitForTimeout(1500);
  }

  async fillCheckoutForm(name: string, country: string, city: string, card: string, month: string, year: string): Promise<void> {
    await this.nameInput.fill(name);
    await this.countryInput.fill(country);
    await this.cityInput.fill(city);
    await this.cardInput.fill(card);
    await this.monthInput.fill(month);
    await this.yearInput.fill(year);
  }

  async completePurchase(): Promise<void> {
    await this.placeOrderButton.click();
    await this.page.waitForTimeout(1500);
  }

  async getSuccessMessage(): Promise<string> {
    const successMsg = this.page.locator('.sweet-alert');
    return await successMsg.innerText();
  }

  async isCartEmpty(): Promise<boolean> {
    const rows = this.page.locator('table tbody tr');
    return (await rows.count()) === 0;
  }
}
