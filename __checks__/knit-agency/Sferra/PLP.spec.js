import { test, expect } from '@playwright/test';

/*
URL > https://www.sferra.com/?_ab=0&_fd=0&_sc=1
PLP check:
- Check filter
- Check images
- Check search results
*/

test('Check the PLP', async ({ page }) => {
    const site = process.env.SITE_URL || ""

    // Access to the URL
    await page.goto(site)

    // If the page doesn't return a successful response code, we fail the check.
    if (response.status() > 399) {
        throw new Error(`Failed with response code ${response.status()}`);
    }

    // Check Duvet Covers PLP
    await page.getByRole('link', { name: 'BEDDING BEDDING' }).hover()
    await page.getByRole('link', { name: 'Duvet Covers' }).click();
    await page.getByRole('button', { name: 'Show filters' }).click();
    await page.getByRole('checkbox', { name: 'Cotton' }).click();
    // Check filters
    await expect(page).toHaveURL('https://www.sferra.com/collections/duvet-covers?pf_t_material=Material__Cotton');
    await page.getByRole('button', { name: 'Show filters' }).click();
    await page.getByRole('button', { name: 'Show sort by' }).click();
    await page.getByRole('button', { name: 'Most Popular' }).click();
    await expect(page).toHaveURL('https://www.sferra.com/collections/duvet-covers?sort=best-selling&pf_t_material=Material__Cotton');
    await page.isVisible('Duvet Covers')
    const result1 = page.locator('CollectionCount Heading u-h6', { hasText: '57 Products' })
    result1.isVisible()

    // Check Napkins PLP
    await page.getByRole('link', { name: 'TABLE TABLE' }).hover()
    await page.getByRole('link', { name: 'Napkins' }).click();
    await expect(page).toHaveURL('https://www.sferra.com/collections/table-napkins');
    await page.isVisible('header:has-text("Table Napkins Cotton NapkinsLinen NapkinsCocktail Napkins") div')
    await page.getByRole('link', { name: '2' }).nth(1).click();
    await expect(page).toHaveURL('https://www.sferra.com/collections/table-napkins?page=2');
    await page.locator('.Pagination__NavItem').first().click();
    await expect(page).toHaveURL('https://www.sferra.com/collections/table-napkins');

    // Check Duvets PLP
    await page.getByRole('link', { name: 'DOWN DOWN' }).hover()
    await page.getByRole('link', { name: 'Duvets' }).click();
    await expect(page).toHaveURL('https://www.sferra.com/collections/duvets');
    // Check filters
    await page.getByRole('button', { name: 'Show filters' }).click();
    await page.getByRole('checkbox', { name: 'KING' }).click();
    await expect(page).toHaveURL('https://www.sferra.com/collections/duvets?pf_opt_size=KING');
    await page.getByRole('button', { name: 'Show sort by' }).click();
    await page.getByRole('button', { name: 'Price, Ascending' }).click();
    await expect(page).toHaveURL('https://www.sferra.com/collections/duvets?sort=price-ascending&pf_opt_size=KING');
    const result2 = page.locator('CollectionCount Heading u-h6', { hasText: '10 Products' })
    result2.isVisible()

    // We snap a screenshot.
    await page.screenshot({ path: "screenshots/screenshot.jpg" });
    // We close the page to clean up and gather performance metrics.
    await page.close();
});