import { test, expect } from '@playwright/test';
import { DemoBlazePage } from '../Pages/DemoBlazePage';

test.describe('TC-002: Verify Product Categories Display', () => {
  let demoBlazePage: DemoBlazePage;

  test.beforeEach(async ({ page }) => {
    demoBlazePage = new DemoBlazePage(page);
  });

  test('TC-002 - Verify Product Categories Display', async ({ page }) => {
    // Navigate to home page
    await demoBlazePage.goto();

    // Verify page is loaded
    const isPageLoaded = await demoBlazePage.verifyPageLoaded();
    expect(isPageLoaded).toBeTruthy();

    // Get all categories
    const categories = await demoBlazePage.getCategories();
    
    // Verify we have at least 3 categories
    expect(categories.length).toBeGreaterThanOrEqual(3);

    // Verify specific categories exist
    expect(categories).toContain('Phones');
    expect(categories).toContain('Laptops');
    expect(categories).toContain('Monitors');

    // Verify categories are clickable
    for (const category of categories) {
      const categoryLink = page.locator(`a:has-text("${category}")`).first();
      await expect(categoryLink).toBeVisible();
    }

    console.log(`✓ TC-002 PASSED - Found ${categories.length} Product Categories`);
  });
});
