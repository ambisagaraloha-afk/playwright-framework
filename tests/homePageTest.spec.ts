import { test, expect } from '@playwright/test';
import { Homepage } from '../Pages/homePage';

test.describe('TC-001: Verify Home Page Loads Successfully', () => {
  let homePage: Homepage;

  test.beforeEach(async ({ page }) => {
    homePage = new Homepage(page);
  });

  test('demoBlaze_homePage_verifyHomePageLoadsSuccessfully', async ({ page }) => {
    // Step 1: Navigate to https://demoblaze.com/index.html
    await homePage.navigateToHomePage();

    // Step 2: Wait for page to fully load (already handled in navigateToHomePage method)

    // Validations - Verify all key elements are visible

    // Verify page is loaded and URL is correct
    const isPageLoaded = await homePage.isHomePageLoaded();
    expect(isPageLoaded).toBe(true);

    // Verify all categories are displayed - this validates the page structure is correct
    const isPhonesDisplayed = await homePage.isPhonesCategoryDisplayed();
    expect(isPhonesDisplayed).toBe(true);

    const isLaptopsDisplayed = await homePage.isLaptopsCategoryDisplayed();
    expect(isLaptopsDisplayed).toBe(true);

    const isMonitorsDisplayed = await homePage.isMonitorsCategoryDisplayed();
    expect(isMonitorsDisplayed).toBe(true);

    // Verify cart link is displayed
    const isCartLinkDisplayed = await homePage.isCartLinkDisplayed();
    expect(isCartLinkDisplayed).toBe(true);
    console.log('✅ TC-001: Home page loaded successfully with all key elements visible');
  });
});
