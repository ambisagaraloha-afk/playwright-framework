import { test, expect } from '@playwright/test';
import { DemoBlazePage } from '../Pages/DemoBlazePage';
import { credentials } from '../utilities/testData';

test.describe('DemoBlaze Test Cases TC6-TC10', () => {
  let demoBlazePage: DemoBlazePage;

  test.beforeEach(async ({ page }) => {
    demoBlazePage = new DemoBlazePage(page);
    await demoBlazePage.navigateToHome();
  });

  test('TC-006: Add Product to Cart', async () => {
    await test.step('Navigate to Phones category', async () => {
      await demoBlazePage.clickCategoryByName('Phones');
    });

    await test.step('Get product count before adding', async () => {
      const productCount = await demoBlazePage.getVisibleProductCount();
      expect(productCount).toBeGreaterThan(0);
    });

    await test.step('Click on first product', async () => {
      await demoBlazePage.clickFirstProduct();
    });

    await test.step('Add product to cart', async () => {
      await demoBlazePage.addCurrentProductToCart();
    });

    await test.step('Verify product was added by navigating to cart', async () => {
      await demoBlazePage.goToCart();
      const cartItemCount = await demoBlazePage.getCartItemCount();
      expect(cartItemCount).toBeGreaterThan(0);
    });
  });

  test('TC-007: Add Multiple Products to Cart', async () => {
    await test.step('Navigate to Phones category', async () => {
      await demoBlazePage.clickCategoryByName('Phones');
    });

    await test.step('Click and add first product', async () => {
      await demoBlazePage.clickFirstProduct();
      await demoBlazePage.addCurrentProductToCart();
    });

    await test.step('Go back to home', async () => {
      await demoBlazePage.navigateToHome();
    });

    await test.step('Navigate to Laptops category', async () => {
      await demoBlazePage.clickCategoryByName('Laptops');
    });

    await test.step('Click and add first laptop product', async () => {
      await demoBlazePage.clickFirstProduct();
      await demoBlazePage.addCurrentProductToCart();
    });

    await test.step('Go to cart and verify multiple items', async () => {
      await demoBlazePage.goToCart();
      const cartItemCount = await demoBlazePage.getCartItemCount();
      expect(cartItemCount).toBe(2);
    });
  });

  test('TC-008: Remove Product from Cart', async () => {
    await test.step('Add a product to cart', async () => {
      await demoBlazePage.clickCategoryByName('Phones');
      await demoBlazePage.clickFirstProduct();
      await demoBlazePage.addCurrentProductToCart();
    });

    await test.step('Go back and add another product', async () => {
      await demoBlazePage.navigateToHome();
      await demoBlazePage.clickCategoryByName('Monitors');
      await demoBlazePage.clickFirstProduct();
      await demoBlazePage.addCurrentProductToCart();
    });

    await test.step('Navigate to cart', async () => {
      await demoBlazePage.goToCart();
      const initialCount = await demoBlazePage.getCartItemCount();
      expect(initialCount).toBe(2);
    });

    await test.step('Delete first item from cart', async () => {
      await demoBlazePage.deleteFirstCartItem();
      await test.step('wait for page update', async () => {
        // Wait a moment for the page to update
        await new Promise(resolve => setTimeout(resolve, 1000));
      });
    });

    await test.step('Verify item count decreased', async () => {
      const finalCount = await demoBlazePage.getCartItemCount();
      expect(finalCount).toBe(1);
    });
  });

  test('TC-009: View Cart and Verify Total Price', async () => {
    await test.step('Add first product to cart', async () => {
      await demoBlazePage.clickCategoryByName('Phones');
      await demoBlazePage.clickFirstProduct();
      await demoBlazePage.addCurrentProductToCart();
    });

    await test.step('Go back and add second product', async () => {
      await demoBlazePage.navigateToHome();
      await demoBlazePage.clickCategoryByName('Laptops');
      await demoBlazePage.clickFirstProduct();
      await demoBlazePage.addCurrentProductToCart();
    });

    await test.step('Navigate to cart', async () => {
      await demoBlazePage.goToCart();
    });

    await test.step('Verify cart has items', async () => {
      const itemCount = await demoBlazePage.getCartItemCount();
      expect(itemCount).toBe(2);
    });

    await test.step('Verify total price is displayed', async () => {
      const total = await demoBlazePage.getCartTotal();
      expect(total).toBeTruthy();
      const totalPrice = parseFloat(total.replace('Total: ', '').replace('$', ''));
      expect(totalPrice).toBeGreaterThan(0);
    });
  });

  test('TC-010: Proceed to Checkout', async () => {
    await test.step('Add product to cart', async () => {
      await demoBlazePage.clickCategoryByName('Phones');
      await demoBlazePage.clickFirstProduct();
      await demoBlazePage.addCurrentProductToCart();
    });

    await test.step('Navigate to cart', async () => {
      await demoBlazePage.goToCart();
      const itemCount = await demoBlazePage.getCartItemCount();
      expect(itemCount).toBeGreaterThan(0);
    });

    await test.step('Click Place Order button', async () => {
      await demoBlazePage.proceedToCheckout();
    });

    await test.step('Fill checkout form', async () => {
      await demoBlazePage.fillCheckoutForm(
        'John Doe',
        'USA',
        'New York',
        '4532123456789010',
        '12',
        '2025'
      );
    });

    await test.step('Complete purchase', async () => {
      await demoBlazePage.completePurchase();
    });

    await test.step('Verify purchase confirmation', async () => {
      const successMsg = await demoBlazePage.getSuccessMessage();
      expect(successMsg).toBeTruthy();
      expect(successMsg.toLowerCase()).toContain('thank you');
    });
  });
});
