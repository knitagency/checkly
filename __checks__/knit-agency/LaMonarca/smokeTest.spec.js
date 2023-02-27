import { test, expect } from '@playwright/test';

const site = "https://lamonarcabakery.com/";

function checkRespone(page) {
    // We visit the page.
    const response = page.goto(site);

    // If the page doesn't return a successful response code, we fail the check.
    if (response.status() > 399) {
        throw new Error(`Failed with response code ${response.status()}`);
    }
}

async function checkPopUp(page) {
    if (page.getByTestId('klaviyo-form-QVUyEF').isVisible()) {
        await page.getByRole('button', { name: 'Close form 1' }).click();
    }
}

async function takeScreenshot(page) {
    // We snap a screenshot.
    await page.screenshot({ path: "screenshots/screenshot.jpg" });
}

async function closeBrowser(page) {
    // We close the page to clean up and gather performance metrics.
    await page.close();
}

test('Smoke Test', async ({ page }) => {
    //const url = process.env.SITE_URL || "";

    // We visit the page.
    await page.goto(site);

    checkPopUp(page);

    // Check PLP and PDP
    await page.getByText('SHOP Down Arrow Icon').hover();
    await page.locator('#header-dropdown-shop a:has-text("Cookies")').click();
    await expect(page).toHaveURL('https://scfvs8pg1i24xncr-8056668196.shopifypreview.com/collections/cookies');
    await page.locator('li:has-text("Quickshop Choose options Mexican Wedding Cookies $5.99 - $45.00 Mexican Wedding ")').getByRole('link', { name: 'Choose options' }).click();
    await expect(page).toHaveURL('https://scfvs8pg1i24xncr-8056668196.shopifypreview.com/products/mexican-wedding-cookies?variant=40639283789986');

    // Add product to the cart
    await page.getByRole('radio', { name: '1 Case of 8 Bags' }).check();
    await expect(page).toHaveURL('https://scfvs8pg1i24xncr-8056668196.shopifypreview.com/products/mexican-wedding-cookies?variant=42566919454976');
    await page.getByRole('button', { name: '+' }).click();
    await page.getByRole('button', { name: 'Add to cart' }).click();

    // QuickView add product to the cart
    await page.locator('#shopify-section-static-header span:has-text("Shop")').hover();
    await page.locator('#header-dropdown-shop a:has-text("Hot Chocolate")').click();
    await expect(page).toHaveURL('https://scfvs8pg1i24xncr-8056668196.shopifypreview.com/collections/mexican-chocolate');
    await page.locator('li:has-text("Quickshop Choose options Champurrado $8.00 - $75.00 Champurrado $8.00 - $75.00")').getByRole('button', { name: 'Quickshop' }).click();
    await page.getByRole('radio', { name: '2 pack' }).check();
    await page.getByRole('button', { name: '+' }).dblclick();
    await page.getByRole('button', { name: 'Add to cart' }).click();

    // View cart
    await page.getByRole('link', { name: 'View cart' }).click();
    await expect(page).toHaveURL('https://scfvs8pg1i24xncr-8056668196.shopifypreview.com/cart');
    await page.getByLabel('Special instructions').click();
    await page.getByLabel('Special instructions').fill('This is a test');

    // Checkout step
    await page.getByRole('button', { name: 'Checkout' }).click();
    await expect(page).toHaveURL('https://scfvs8pg1i24xncr-8056668196.shopifypreview.com/cart');
});