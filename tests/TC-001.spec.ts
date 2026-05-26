import { test, expect } from '@playwright/test';
import { DemoBlazePage } from '../Pages/DemoBlazePage';

test.describe('TC-001: Verify Home Page Loads Successfully', () => {
  let demoBlazePage: DemoBlazePage;

  test.beforeEach(async ({ page }) => {
    demoBlazePage = new DemoBlazePage(page);
  });

  test('TC-001 - Verify Home Page Loads Successfully', async ({ page }) => {
    // Navigate to DemoBlaze home page
    await demoBlazePage.goto();

    // Verify page is loaded
    const isPageLoaded = await demoBlazePage.verifyPageLoaded();
    expect(isPageLoaded).toBeTruthy();

    // Verify page title contains "STORE"
    await expect(page).toHaveTitle(/STORE/);

    // Verify navigation menu is visible
    const navMenu = page.locator('nav');
    await expect(navMenu).toBeVisible();

    // Verify key page elements are visible
    const homeLink = page.locator('text=Home');
    await expect(homeLink).toBeVisible();

    console.log('✓ TC-001 PASSED - Home Page Loads Successfully');
  });
});
