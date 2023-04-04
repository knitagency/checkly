import { test, expect } from '@playwright/test';

const site = "https://www.playbetter.com/";

function checkRespone(page) {
    const url = process.env.SITE_URL || "";

    // We visit the page.
    //const response = page.goto(url);

    // If the page doesn't return a successful response code, we fail the check.
    if (response.status() > 399) {
        throw new Error(`Failed with response code ${response.status()}`);
    }
}

async function checkPopUp(page) {
    if (page.frameLocator('iframe[name="ju_iframe_863330"]').getByText('SUBMIT TO GET YOUR 10% OFF CODE*Due to manufacturer restrictions, some products').isVisible()) {
        await page.frameLocator('iframe[name="ju_iframe_863330"]').getByRole('button', { name: '✖' }).click();
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

test('Check the Homepage', async ({ page, isMobile }) => {
    const url = process.env.SITE_URL || "";

    // We visit the page.
    await page.goto(site);

    // Scroll down the page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    await page.waitForLoadState();

    // Close the pop-up to sign in
    await checkPopUp(page);

    // If is the mobile version we might need to check it other elements
/*     if (isMobile) {

    } else {

    } */

    await page.getByText('LOGIN CARTNEED SUPPORT?Visit Help CenterGolf Shop Launch MonitorsLaunch Monitors').isVisible()
    await page.locator('.chakra-stack').first().isVisible()
    await page.frameLocator('iframe[name="ju_iframe_863330"]').getByRole('button', { name: '✖' }).isVisible()
    await page.locator('.css-f8iv5s').isVisible()
    await page.locator('.site-footer').isVisible()
    await page.locator('#frontend-root div:has-text("Exchanges & ReturnsShipping & Return PoliciesPrivacy PolicyTerms of ServiceJoin ")').nth(2).isVisible()
    await page.getByText('LOGIN CART').isVisible()
});