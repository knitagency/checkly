import { test, expect } from '@playwright/test';

const site = "https://www.playbetter.com/"

function checkRespone(page) {
    // We visit the page.
    //const response = page.goto(site);

    // If the page doesn't return a successful response code, we fail the check.
    //if (response.status() > 399) {
    //    throw new Error(`Failed with response code ${response.status()}`);
    //}
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
test('Check the PLP', async ({ page }) => {
    const url = process.env.SITE_URL || "";

    // We visit the page.
    await page.goto(site);

    // Scroll down the page
    //await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    await page.getByRole('link', { name: 'Outdoor' }).click();
    await expect(page).toHaveURL('https://www.playbetter.com/collections/outdoor');

    await page.waitForLoadState();

    // Check the sections are visible
    await page.locator('#frontend-root div:has-text("FiltersActivityHiking (3)Outdoor (37)Running (2)BrandCOROS (1)Garmin (26)Nikon (")').nth(1).isVisible()
    await page.getByRole('img', { name: 'Get Gadgets and Equipment for Camping, Hiking, Travel Bags, Outdoor Gear, Recreational, and More at PlayBetter.com' }).isVisible()
    await page.getByText('FiltersActivityHiking (3)Outdoor (37)Running (2)BrandCOROS (1)Garmin (26)Nikon (').click();
    await page.locator('.css-vhtl65').isVisible()

    await page.frameLocator('iframe[name="ju_iframe_863330"]').getByRole('button', { name: '✖' }).isVisible()
    await page.locator('.site-footer').isVisible()
    await page.getByText('12Next').isVisible()

    await page.getByRole('combobox', { name: 'Sort by' }).selectOption('price-ascending');
    await expect(page).toHaveURL('https://www.playbetter.com/collections/outdoor?sort_by=price-ascending');

    // Check the filters
    await page.locator('.css-vypxf2 > .icon-list > path').isVisible()
    await page.getByText('Home/OutdoorFilters Sort by Sort byFeaturedBest SellerAlphabetically, A-ZAlphabe').isVisible()
});