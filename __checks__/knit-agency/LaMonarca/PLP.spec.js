import { test, expect } from '@playwright/test';

const site = "https://lamonarcabakery.com/"

// test.beforeAll(async () => {
//     page = await browser.newPage();
// });

// test.afterAll(async () => {
//     await page.close();
// });

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

test('Check the PDP Mexican Coffee', async ({ page }) => {
    const url = process.env.SITE_URL || "";

    // We visit the page.
    const response = page.goto(url);

    checkPopUp(page);

    // Check Mexican Coffee PLP
    await page.getByText('SHOP Down Arrow Icon').hover();
    await page.getByRole('link', { name: 'MEXICAN COFFEE' }).click(({ timeout: 10000 }));
    await expect(page).toHaveURL('https://lamonarcabakery.com/collections/frontpage');

    await page.getByRole('heading', { name: 'Mexican Coffee' }).click();
    await page.locator('.collection-tools-left').isVisible()
    await page.getByText('Home / Collections / Mexican Coffee Mexican Coffee Sort by: Featured Best sellin').isVisible()
    await page.getByText('Quickshop Add to cart Unavailable Cafe de Olla $16.00 Cafe de Olla $16.00 Quicks').isVisible()

    // Check the filters
    await page.getByRole('combobox', { name: 'sort by' }).selectOption('price-ascending');
    await expect(page).toHaveURL('https://lamonarcabakery.com/collections/frontpage?sort_by=price-ascending');
    await page.locator('.content-area').first().isVisible();

    // We snap a screenshot.
    //takeScreenshot(page);
    // We close the page to clean up and gather performance metrics.
    closeBrowser(page);
});


test('Check the PDP Hot Chocolate', async ({ page }) => {
    await page.goto(site);

    checkPopUp(page);

    // Check Hot Chocolate PLP
    await page.getByText('SHOP Down Arrow Icon').hover()
    await page.getByRole('link', { name: 'HOT CHOCOLATE' }).click();
    await expect(page).toHaveURL('https://lamonarcabakery.com/collections/mexican-chocolate');
    await page.getByText('Home / Collections / Mexican Chocolate Mexican Chocolate').click();
    await page.locator('.content-area').first().click();

    // Check the filters
    await page.getByRole('combobox', { name: 'sort by' }).selectOption('price-ascending');
    await expect(page).toHaveURL('https://lamonarcabakery.com/collections/mexican-chocolate?sort_by=price-ascending');
    await page.locator('.content-area').first().isVisible();

    // We snap a screenshot.
    //takeScreenshot(page);
    // We close the page to clean up and gather performance metrics.
    closeBrowser(page);
})

test('Check the PDP Cookies', async ({ page }) => {
    await page.goto(site);

    checkPopUp(page);

    // Check Cookies PLP
    await page.getByText('SHOP Down Arrow Icon').hover()
    await page.getByRole('link', { name: 'COOKIES' }).click();
    await expect(page).toHaveURL('https://lamonarcabakery.com/collections/cookies');
    await page.getByText('Home / Collections / Mexican Cookies Mexican Cookies Scratch made, all-natural a').click();
    await page.locator('main:has-text("Home / Collections / Mexican Cookies Mexican Cookies Scratch made, all-natural a")').click();
    await page.locator('.content-area').first().click();

    // Check the filters
    await page.getByRole('combobox', { name: 'sort by' }).selectOption('price-ascending');
    await expect(page).toHaveURL('https://lamonarcabakery.com/collections/cookies?sort_by=price-ascending');
    await page.locator('.content-area').first().isVisible();

    // We snap a screenshot.
    //takeScreenshot(page);
    // We close the page to clean up and gather performance metrics.
    closeBrowser(page);
})

// test.afterAll(async () => {
//     await page.close();
// });