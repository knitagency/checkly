import { test, expect } from '@playwright/test';
test('Smoke Test', async ({ page }) => {
    const url = process.env.SITE_URL || "";

    // We visit the page.
    const response = await page.goto(site);


});