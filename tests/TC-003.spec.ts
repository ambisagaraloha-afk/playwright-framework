import { test, expect } from '@playwright/test';
import { DemoBlazePage } from '../Pages/DemoBlazePage';

test.describe('TC-003: Filter Products by Category - Phones', () => {
  let demoBlazePage: DemoBlazePage;

  test.beforeEach(async ({ page }) => {
    demoBlazePage = new DemoBlazePage(page);
  });

  test('TC-003 - Filter Products by Category - Phones', async ({ page }) => {
    // Navigate to home page
    await demoBlazePage.goto();

    // Verify page is loaded
    const isPageLoaded = await demoBlazePage.verifyPageLoaded();
    expect(isPageLoaded).toBeTruthy();

    // Click on Phones category
    await demoBlazePage.clickCategory('Phones');

    // Verify products are filtered and displayed
    const productCount = await demoBlazePage.getProductCount();
    expect(productCount).toBeGreaterThan(0);

    // Verify products are visible
    const productItems = page.locator('#tbodyid div.col-lg-4');
    const firstProduct = productItems.first();
    await expect(firstProduct).toBeVisible();

    console.log(`✓ TC-003 PASSED - Found ${productCount} Phones Products`);
  });
});
