import { Page, Locator } from '@playwright/test';

export class DemoBlazePage {
  private page: Page;

  // Page locators using web-first strategies
  readonly pageTitle: Locator;
  readonly phonesLink: Locator;
  readonly laptopsLink: Locator;
  readonly monitorsLink: Locator;
  readonly productItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('h4:has-text("PRODUCT STORE")');
    this.phonesLink = page.locator('a#itemc').filter({ hasText: 'Phones' });
    this.laptopsLink = page.locator('a#itemc').filter({ hasText: 'Laptops' });
    this.monitorsLink = page.locator('a#itemc').filter({ hasText: 'Monitors' });
    this.productItems = page.locator('div.col-lg-4');
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
}
