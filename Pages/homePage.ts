import { Locator, Page } from "@playwright/test";

export class Homepage
{
    readonly page:Page;
    readonly samsaungGalaxyS6:Locator;
    readonly addToCartButton:Locator;
    readonly phonesCategoryLocator:Locator;
    readonly laptopsCategoryLocator:Locator;
    readonly monitorsCategoryLocator:Locator;
    readonly productItemsLocator:Locator;
    readonly cartLinkLocator:Locator;

    constructor(page:Page)
    {
        this.page=page;
        this.samsaungGalaxyS6=page.locator('//a[contains(., "Samsung galaxy s6")]');
        this.addToCartButton=page.locator('//a[contains(., "Add to cart")]');
        // Updated locators - using contains() for partial text matching
        this.phonesCategoryLocator=page.locator('//a[contains(., "Phones")]');
        this.laptopsCategoryLocator=page.locator('//a[contains(., "Laptops")]');
        this.monitorsCategoryLocator=page.locator('//a[contains(., "Monitors")]');
        // Fixed product items locator with proper class
        this.productItemsLocator=page.locator('//div[@class="col-lg-4 col-md-6 mb-4"]');
        // Cart link
        this.cartLinkLocator=page.locator('#cartur');
    }

    async navigateToCartPage()
    {
        await this.samsaungGalaxyS6.click();
        await this.addToCartButton.click();
    }

    async filterByPhonesCategory()
    {
        try {
            await this.phonesCategoryLocator.waitFor({ state: 'visible', timeout: 5000 });
            await this.phonesCategoryLocator.click();
            await this.page.waitForTimeout(1500);
        } catch (error) {
            throw new Error(`Failed to click Phones category: ${error}`);
        }
    }

    async filterByLaptopsCategory()
    {
        try {
            await this.laptopsCategoryLocator.waitFor({ state: 'visible', timeout: 5000 });
            await this.laptopsCategoryLocator.click();
            await this.page.waitForTimeout(1500);
        } catch (error) {
            throw new Error(`Failed to click Laptops category: ${error}`);
        }
    }

    async filterByMonitorsCategory()
    {
        try {
            await this.monitorsCategoryLocator.waitFor({ state: 'visible', timeout: 5000 });
            await this.monitorsCategoryLocator.click();
            await this.page.waitForTimeout(1500);
        } catch (error) {
            throw new Error(`Failed to click Monitors category: ${error}`);
        }
    }

    async getProductCount(): Promise<number>
    {
        return await this.productItemsLocator.count();
    }

    async verifyProductsDisplayed(): Promise<boolean>
    {
        const count = await this.getProductCount();
        return count > 0;
    }

    // TC-001 validation methods
    async isHomePageLoaded(): Promise<boolean>
    {
        try {
            // Wait for the page to load by checking the URL
            await this.page.waitForURL('**/demoblaze.com/**', { timeout: 10000 });
            // Wait for at least one category to be visible
            await this.phonesCategoryLocator.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }

    async isPhonesCategoryDisplayed(): Promise<boolean>
    {
        try {
            await this.phonesCategoryLocator.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }

    async isLaptopsCategoryDisplayed(): Promise<boolean>
    {
        try {
            await this.laptopsCategoryLocator.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }

    async isMonitorsCategoryDisplayed(): Promise<boolean>
    {
        try {
            await this.monitorsCategoryLocator.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }

    async isCartLinkDisplayed(): Promise<boolean>
    {
        try {
            await this.cartLinkLocator.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }

    async verifyAllCategoriesDisplayed(): Promise<boolean>
    {
        const phones = await this.isPhonesCategoryDisplayed();
        const laptops = await this.isLaptopsCategoryDisplayed();
        const monitors = await this.isMonitorsCategoryDisplayed();
        return phones && laptops && monitors;
    }

    async navigateToHomePage()
    {
        await this.page.goto('https://demoblaze.com/index.html', { waitUntil: 'domcontentloaded' });
        // Wait for categories to be visible
        await this.phonesCategoryLocator.waitFor({ state: 'visible', timeout: 10000 });
    }
}
