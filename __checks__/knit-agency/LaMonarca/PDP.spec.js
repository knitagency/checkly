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

test('Check the PDP', async ({ page }) => {
    const url = process.env.SITE_URL || "";

    // We visit the page.
    await page.goto(site);

    await checkPopUp(page);

    await page.getByText('SHOP Down Arrow Icon').hover();
    await page.getByRole('link', { name: 'COOKIES' }).first().click();
    await expect(page).toHaveURL('https://lamonarcabakery.com/collections/cookies');

    await page.locator('li:has-text("Quickshop Add to cart Unavailable Cinnamon Cookies $5.99 Cinnamon Cookies $5.99")').getByRole('button', { name: 'Add to cart button' }).click();

    await page.getByText('shopping cart 1 Close Alternative Icon la monarca bakery Cinnamon Cookies $5.99').click();
    await expect(page).toHaveURL('https://lamonarcabakery.com/products/organic-oaxaca-reserve?variant=31519195267129');

    await page.getByRole('radio', { name: 'Pack of 2' }).check();
    await expect(page).toHaveURL('https://lamonarcabakery.com/products/organic-oaxaca-reserve?variant=42647348216064');

    await page.locator('form:has-text("Whole Bean / 12oz Bag - $16.00 Whole Bean / Pack of 2 - $30.00 Whole Bean / Case")').getByRole('button', { name: 'Add to cart button' }).click();

    await page.getByText('shopping cart 2 Close Alternative Icon LaMonarcaBakery Organic Oaxaca Reserve Co').click();

    await page.locator('.qtybox > span:nth-child(3)').first().click();

    await page.locator('input[name="quantity"]').first().click();

    await page.getByRole('button', { name: 'remove' }).nth(1).click();

    await page.getByText('you may also like... Cafe de Olla $16.00 + Unavailable Cafe de Olla $16.00 Organ').click();
    await expect(page).toHaveURL('https://lamonarcabakery.com/products/organic-oaxaca-reserve?variant=31519195267129');

    await page.locator('form:has-text("Whole Bean / 12oz Bag - $16.00 Whole Bean / Pack of 2 - $30.00 Whole Bean / Case")').getByRole('button', { name: 'Add to cart button' }).click();

    await page.locator('li:has-text("Organic Oaxaca Reserve Coffee $16.00 + Unavailable Organic Oaxaca Reserve Coffee")').getByRole('button', { name: 'Add to cart button' }).click();

    await page.locator('.cart-mini-content > div:nth-child(2)').click();

    await page.getByText('Subtotal $92.00').click();

    await page.getByText('shopping cart 4 Close Alternative Icon LaMonarcaBakery Organic Oaxaca Reserve Co').click();
    await expect(page).toHaveURL('https://lamonarcabakery.com/products/organic-oaxaca-reserve');

    await page.locator('#shopify-section-static-product').click();
    await expect(page).toHaveURL('https://lamonarcabakery.com/products/organic-oaxaca-reserve?variant=31519195267129#&gid=1&pid=1');

    await page.getByRole('button', { name: 'Close' }).click();

    await page.getByRole('dialog').press('Escape');
    await expect(page).toHaveURL('https://lamonarcabakery.com/products/organic-oaxaca-reserve?variant=31519195267129');

});