import { test, expect } from '@playwright/test';
import { DemoBlazePage } from '../Pages/DemoBlazePage';

test.describe('TC-006: Add Product to Cart', () => {
  let demoBlazePage: DemoBlazePage;

  test.beforeEach(async ({ page }) => {
    demoBlazePage = new DemoBlazePage(page);
  });

  test('TC-006 - Add Product to Cart', async ({ page }) => {
    // Navigate to home page
    await demoBlazePage.goto();

    // Verify page is loaded
    const isPageLoaded = await demoBlazePage.verifyPageLoaded();
    expect(isPageLoaded).toBeTruthy();

    // Click on Phones category
    await demoBlazePage.clickCategory('Phones');

    // Wait for products to load
    await page.waitForTimeout(800);

    // Click on first product
    const firstProduct = page.locator('#tbodyid div.col-lg-4').first();
    const productName = await firstProduct.locator('h4 a').innerText();
    await firstProduct.locator('h4 a').click();

    // Wait for product details page to load
    await page.waitForTimeout(1500);

    // Verify product details are displayed
    const productTitle = page.locator('h2').first();
    await expect(productTitle).toBeVisible();

    // Get product price
    const priceElement = page.locator('h3').first();
    const price = await priceElement.innerText();
    expect(price).toBeTruthy();
    expect(price).toContain('$');

    // Verify "Add to cart" button is visible
    const addToCartBtn = page.locator('a:has-text("Add to cart")').first();
    await expect(addToCartBtn).toBeVisible();

    // Setup listener for dialog/alert
    page.on('dialog', dialog => {
      expect(dialog.message()).toContain('Product added');
      dialog.accept();
    });

    // Click "Add to cart" button
    await addToCartBtn.click();

    // Wait for alert to be handled
    await page.waitForTimeout(2000);

    console.log(`✓ TC-006 PASSED - Product Added to Cart Successfully (${productName})`);
  });
});

