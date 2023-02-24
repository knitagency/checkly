import { test, expect } from '@playwright/test';

test('Check the PDP', async ({ page }) => {

    const site = "https://lamonarcabakery.com/"

    // We visit the page.
    const response = await page.goto(site);

    // If the page doesn't return a successful response code, we fail the check.
    if (response.status() > 399) {
        throw new Error(`Failed with response code ${response.status()}`);
    }

    if (page.getByTestId('klaviyo-form-QVUyEF').isVisible()) {
        await page.getByRole('button', { name: 'Close form 1' }).click();
    }

    // Check 
    await page.getByText('SHOP Down Arrow Icon').hover()
    await page.getByRole('link', { name: 'MEXICAN COFFEE' }).click();
    await expect(page).toHaveURL('https://lamonarcabakery.com/collections/frontpage');

    await page.getByRole('heading', { name: 'Mexican Coffee' }).click();

    await page.locator('.collection-tools-left').isVisible()

    await page.getByText('Home / Collections / Mexican Coffee Mexican Coffee Sort by: Featured Best sellin').isVisible()

    await page.getByText('Quickshop Add to cart Unavailable Cafe de Olla $16.00 Cafe de Olla $16.00 Quicks').isVisible()

    await page.getByRole('combobox', { name: 'sort by' }).selectOption('price-ascending');
    await expect(page).toHaveURL('https://lamonarcabakery.com/collections/frontpage?sort_by=price-ascending');

    await page.locator('.content-area').first().click();

});