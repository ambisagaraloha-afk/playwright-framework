import { test, expect } from '@playwright/test';
import { Homepage } from '../Pages/homePage';

test.describe('DemoBlaze Category Filtering Tests', () => {
  let homePage: Homepage;

  test.beforeEach(async ({ page }: any) => {
    await page.goto("https://demoblaze.com/index.html", { waitUntil: 'domcontentloaded', timeout: 60000 });
    homePage = new Homepage(page);
    await page.waitForTimeout(2000);
  });

  test('TC-003: Filter Products by Category - Phones', async ({ page }: any) => {
    // Step 1: Click on "Phones" category
    await homePage.filterByPhonesCategory();
    await page.waitForTimeout(1500);

    // Step 2 & 3: Verify products are filtered and wait for product list to update
    const productsDisplayed = await homePage.verifyProductsDisplayed();
    expect(productsDisplayed).toBe(true);
    
    // Additional validation: Get product count to confirm products are displayed
    const productCount = await homePage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
    
    console.log(`TC-003 PASSED: ${productCount} phone products are displayed after filtering by Phones category`);
  });

  test('TC-004: Filter Products by Category - Laptops', async ({ page }: any) => {
    // Step 1: Click on "Laptops" category
    await homePage.filterByLaptopsCategory();
    await page.waitForTimeout(1500);

    // Step 2 & 3: Verify products are filtered and wait for product list to update
    const productsDisplayed = await homePage.verifyProductsDisplayed();
    expect(productsDisplayed).toBe(true);
    
    // Additional validation: Get product count to confirm products are displayed
    const productCount = await homePage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
    
    console.log(`TC-004 PASSED: ${productCount} laptop products are displayed after filtering by Laptops category`);
  });

  test('TC-005: Filter Products by Category - Monitors', async ({ page }: any) => {
    // Step 1: Click on "Monitors" category
    await homePage.filterByMonitorsCategory();
    await page.waitForTimeout(1500);

    // Step 2 & 3: Verify products are filtered and wait for product list to update
    const productsDisplayed = await homePage.verifyProductsDisplayed();
    expect(productsDisplayed).toBe(true);
    
    // Additional validation: Get product count to confirm products are displayed
    const productCount = await homePage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
    
    console.log(`TC-005 PASSED: ${productCount} monitor products are displayed after filtering by Monitors category`);
  });
});
