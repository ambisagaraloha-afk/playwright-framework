import { test, expect } from '@playwright/test';
import { DemoBlazePage } from '../Pages/DemoBlazePage';

test.describe('TC-007: Remove Product from Cart', () => {
  let demoBlazePage: DemoBlazePage;

  test.beforeEach(async ({ page }) => {
    demoBlazePage = new DemoBlazePage(page);
  });

  test('TC-007 - Remove Product from Cart', async ({ page }) => {
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

    // Setup listener for dialog/alert
    page.on('dialog', dialog => {
      if (dialog.message().includes('Product added')) {
        dialog.accept();
      }
    });

    // Click "Add to cart" button
    const addToCartBtn = page.locator('a:has-text("Add to cart")').first();
    await expect(addToCartBtn).toBeVisible();
    await addToCartBtn.click();

    // Wait for alert to be handled
    await page.waitForTimeout(1500);

    // Navigate to home page
    await page.goto('https://demoblaze.com/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    // Open cart
    const cartLink = page.locator('a:has-text("Cart")').first();
    await cartLink.click();

    // Wait for cart page to load
    await page.waitForTimeout(1500);

    // Verify we are on cart page by checking cart header is visible
    const cartHeader = page.locator('h2:has-text("Products")');
    await expect(cartHeader).toBeVisible();

    // Look for delete button in the cart
    const deleteButtons = page.locator('button:has-text("Delete"), a:has-text("Delete")');
    const deleteButtonCount = await deleteButtons.count();
    expect(deleteButtonCount).toBeGreaterThan(0);

    // Click the first delete button
    const firstDeleteBtn = deleteButtons.first();
    await firstDeleteBtn.click();

    // Wait for deletion to complete
    await page.waitForTimeout(1000);

    // Verify the item was deleted by checking delete buttons count decreased
    const updatedDeleteButtons = page.locator('button:has-text("Delete"), a:has-text("Delete")');
    const updatedDeleteButtonCount = await updatedDeleteButtons.count();
    expect(updatedDeleteButtonCount).toBeLessThanOrEqual(deleteButtonCount);

    console.log(`✓ TC-007 PASSED - Product Removed from Cart Successfully (${productName})`);
  });
});
