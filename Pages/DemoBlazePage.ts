import { Page, Locator } from '@playwright/test';

export class DemoBlazePage {
  private page: Page;
  readonly baseURL = 'https://demoblaze.com/index.html';
  readonly pageHeading: Locator;
  readonly navigationMenu: Locator;
  readonly phonesCategory: Locator;
  readonly laptopsCategory: Locator;
  readonly monitorsCategory: Locator;
  readonly productList: Locator;
  readonly productItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHeading = page.locator('h4:has-text("PRODUCT STORE")');
    this.navigationMenu = page.locator('nav');
    this.phonesCategory = page.locator('a[data-category="1"]');
    this.laptopsCategory = page.locator('a[data-category="2"]');
    this.monitorsCategory = page.locator('a[data-category="3"]');
    this.productList = page.locator('#tbodyid');
    this.productItems = page.locator('#tbodyid div.col-lg-4');
  }

  async goto() {
    await this.page.goto(this.baseURL, { waitUntil: 'domcontentloaded' });
    await this.page.waitForTimeout(1000);
  }

  async verifyPageLoaded() {
    await this.page.waitForTimeout(500);
    return await this.pageHeading.isVisible();
  }

  async getCategoryCount() {
    const categories = await this.page.locator('div#cat').locator('a').count();
    return categories;
  }

  async getCategories() {
    const categories = [];
    // Get all category links from the sidebar
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

  async clickCategory(categoryName: string) {
    const categoryLink = this.page.locator(`a:has-text("${categoryName}")`).first();
    await categoryLink.click();
    await this.page.waitForTimeout(800);
  }

  async getProductCount() {
    return await this.productItems.count();
  }

  async getProductNames() {
    const products = [];
    const productElements = this.productItems;
    const count = await productElements.count();
    for (let i = 0; i < count; i++) {
      const text = await productElements.nth(i).locator('h4').innerText();
      products.push(text);
    }
    return products;
  }
}
