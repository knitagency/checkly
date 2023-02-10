import { test, expect } from '@playwright/test';

test('Check the footer', async ({ page }) => {
    //const site = process.env.SITE_URL || "";
    //const title = process.env.SITE_TITLE || "";
    // We visit the page.
    //const response = await page.goto(site);

    await page.goto('https://www.sferra.com/?_ab=0&_fd=0&_sc=1');

    // If the page doesn't return a successful response code, we fail the check.
    //if (response.status() > 399) {
    //    throw new Error(`Failed with response code ${response.status()}`);
    //}

    //await page.isVisible('Your location is set to CanadaShop in USD $Get shipping options for CanadaContin')
    //await page.getByRole('button', { name: 'Continue' }).click()

    await page.isVisible('#shopify-section-footer')
    await page.isVisible('link', { name: '© 2023 SFERRA' })

    await page.isVisible('div:has-text("Icons/Hamburger Created with Sketch. NEWNEW Collections Spring/Summer 2023 NEW A")')

    await page.isVisible('div:has-text("COMPLIMENTARY SHIPPING ON ALL ORDERS WORLDWIDE.*")')

    await page.isVisible('heading', { name: 'Follow us' })
    await page.isVisible('div:has-text("Follow us")')

    // We snap a screenshot.
    await page.screenshot({ path: "screenshots/screenshot.jpg" });
    // We close the page to clean up and gather performance metrics.
    await page.close();
});