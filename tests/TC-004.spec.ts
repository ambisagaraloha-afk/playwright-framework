import { test, expect } from '@playwright/test';
import { DemoBlazePage } from '../Pages/DemoBlazePage';

test.describe('TC-004: Filter Products by Category - Laptops', () => {
  let demoBlazePage: DemoBlazePage;

  test.beforeEach(async ({ page }) => {
    demoBlazePage = new DemoBlazePage(page);
  });

  test('TC-004 - Filter Products by Category - Laptops', async ({ page }) => {
    // Navigate to home page
    await demoBlazePage.goto();

    // Verify page is loaded
    const isPageLoaded = await demoBlazePage.verifyPageLoaded();
    expect(isPageLoaded).toBeTruthy();

    // Click on Laptops category
    await demoBlazePage.clickCategory('Laptops');

    // Verify products are filtered and displayed
    const productCount = await demoBlazePage.getProductCount();
    expect(productCount).toBeGreaterThan(0);

    // Verify products are visible
    const productItems = page.locator('#tbodyid div.col-lg-4');
    const firstProduct = productItems.first();
    await expect(firstProduct).toBeVisible();

    console.log(`✓ TC-004 PASSED - Found ${productCount} Laptops Products`);
  });
});
