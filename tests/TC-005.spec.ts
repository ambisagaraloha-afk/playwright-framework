import { test, expect } from '@playwright/test';
import { DemoBlazePage } from '../Pages/DemoBlazePage';

test.describe('TC-005: Filter Products by Category - Monitors', () => {
  let demoBlazePage: DemoBlazePage;

  test.beforeEach(async ({ page }) => {
    demoBlazePage = new DemoBlazePage(page);
  });

  test('TC-005 - Filter Products by Category - Monitors', async ({ page }) => {
    // Navigate to home page
    await demoBlazePage.goto();

    // Verify page is loaded
    const isPageLoaded = await demoBlazePage.verifyPageLoaded();
    expect(isPageLoaded).toBeTruthy();

    // Click on Monitors category
    await demoBlazePage.clickCategory('Monitors');

    // Verify products are filtered and displayed
    const productCount = await demoBlazePage.getProductCount();
    expect(productCount).toBeGreaterThan(0);

    // Verify products are visible
    const productItems = page.locator('#tbodyid div.col-lg-4');
    const firstProduct = productItems.first();
    await expect(firstProduct).toBeVisible();

    console.log(`✓ TC-005 PASSED - Found ${productCount} Monitors Products`);
  });
});
