import { test, expect } from '@playwright/test';
test('Smoke Test', async ({ page }) => {
    const url = process.env.SITE_URL || "";

    await page.goto(url);


});