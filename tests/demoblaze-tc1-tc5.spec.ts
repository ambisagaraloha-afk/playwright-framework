import { test, expect } from '@playwright/test';
import { DemoBlazePage } from '../Pages/DemoBlazePage';

test.describe('DemoBlaze Test Cases TC1-TC5', () => {
  let demoBlazePage: DemoBlazePage;

  test.beforeEach(async ({ page }) => {
    demoBlazePage = new DemoBlazePage(page);
    await demoBlazePage.navigateToHome();
  });

  test('TC-001: Verify Home Page Loads Successfully', async () => {
    await test.step('Verify page title is visible', async () => {
      const isTitleVisible = await demoBlazePage.isPageTitleVisible();
      expect(isTitleVisible).toBe(true);
    });

    await test.step('Verify product categories are present', async () => {
      const categories = await demoBlazePage.getCategoryLinks();
      expect(categories.length).toBeGreaterThan(0);
    });

    await test.step('Verify products are displayed on home page', async () => {
      const productCount = await demoBlazePage.getVisibleProductCount();
      expect(productCount).toBeGreaterThan(0);
    });
  });

  test('TC-002: Verify Product Categories Display', async () => {
    await test.step('Get all available categories', async () => {
      const categories = await demoBlazePage.getCategoryLinks();
      
      expect(categories.length).toBeGreaterThanOrEqual(3);
      expect(categories).toContain('Phones');
      expect(categories).toContain('Laptops');
      expect(categories).toContain('Monitors');
    });
  });

  test('TC-003: Filter Products by Category - Phones', async () => {
    await test.step('Click on Phones category', async () => {
      await demoBlazePage.clickCategoryByName('Phones');
    });

    await test.step('Verify phones products are displayed', async () => {
      const productCount = await demoBlazePage.getVisibleProductCount();
      expect(productCount).toBeGreaterThan(0);
    });

    await test.step('Verify at least one phone product is visible', async () => {
      const productNames = await demoBlazePage.getVisibleProductNames();
      expect(productNames.length).toBeGreaterThan(0);
    });
  });

  test('TC-004: Filter Products by Category - Laptops', async () => {
    await test.step('Click on Laptops category', async () => {
      await demoBlazePage.clickCategoryByName('Laptops');
    });

    await test.step('Verify laptops products are displayed', async () => {
      const productCount = await demoBlazePage.getVisibleProductCount();
      expect(productCount).toBeGreaterThan(0);
    });

    await test.step('Verify at least one laptop product is visible', async () => {
      const productNames = await demoBlazePage.getVisibleProductNames();
      expect(productNames.length).toBeGreaterThan(0);
    });
  });

  test('TC-005: Filter Products by Category - Monitors', async () => {
    await test.step('Click on Monitors category', async () => {
      await demoBlazePage.clickCategoryByName('Monitors');
    });

    await test.step('Verify monitors products are displayed', async () => {
      const productCount = await demoBlazePage.getVisibleProductCount();
      expect(productCount).toBeGreaterThan(0);
    });

    await test.step('Verify at least one monitor product is visible', async () => {
      const productNames = await demoBlazePage.getVisibleProductNames();
      expect(productNames.length).toBeGreaterThan(0);
    });
  });
});
