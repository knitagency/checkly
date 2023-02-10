import { test, expect } from '@playwright/test';

/*
URL > https://www.sferra.com/?_ab=0&_fd=0&_sc=1
HomePage check:
- Check megaMenu
- Check header
- Check search bar
- Check images displayed
- Check titles
*/

test('Check the Homepage', async ({ page }) => {
    const site = process.env.SITE_URL || ""

    // We visit the page.
    const response = await page.goto(site);

    // If the page doesn't return a successful response code, we fail the check.
    if (response.status() > 399) {
        throw new Error(`Failed with response code ${response.status()}`);
    }

    // Accept Canada Site
    //await page.getByRole('button', { name: 'Continue' }).click();
    //await expect(page).toHaveURL('https://www.sferra.com/');

    // Check Header and first images
    await page.isVisible('link', { name: 'SFERRA logo' })
    await page.isVisible('header[role="banner"]:has-text("Icons/Hamburger Created with Sketch. NEWNEW Collections Spring/Summer 2023 NEW A")')
    await page.isVisible('section:has-text("SPRING 2023 COLLECTIONDREAMING IN COLOR SHOP NEW ARRIVALS")')

    // Subscribe checking
    await page.getByRole('button', { name: 'Subscribe' }).click()
    //await expect(page).toHaveURL('https://www.sferra.com/?contact%5Btags%5D=newsletter&form_type=customer#footer-newsletter')
    await page.getByText('Don\'t miss out! Join the SFERRA email list and receive 10% off your first full-p').isVisible()

    // Check MegaMenu >> Bedding, Down, Gifts, Rugs, Tables
    await page.isVisible('navigation', { name: 'Main navigation' })

    await page.getByRole('link', { name: 'BEDDING BEDDING' }).hover()
    await page.getByRole('link', { name: 'All Collections' }).click()
    await expect(page).toHaveURL('https://www.sferra.com/collections/bedding')

    await page.getByRole('link', { name: 'DOWN DOWN' }).hover()
    await page.getByRole('link', { name: 'Shop All' }).click()
    await expect(page).toHaveURL('https://www.sferra.com/collections/down')

    await page.isVisible('p:has-text("Gifts & Décor")')

    await page.getByRole('link', { name: 'GIFTS & DÉCOR GIFTS & DÉCOR' }).hover()
    await page.getByRole('link', { name: 'Decorative Objects' }).click()
    await expect(page).toHaveURL('https://www.sferra.com/collections/serveware')

    await page.getByRole('link', { name: 'RUGS RUGS' }).hover()
    await page.getByRole('link', { name: 'Indian Rugs' }).click()
    await expect(page).toHaveURL('https://www.sferra.com/collections/indian-rugs')

    await page.getByRole('link', { name: 'TABLE TABLE' }).hover()
    await page.getByRole('link', { name: 'TABLECLOTH SIZE GUIDE' }).click()
    await expect(page).toHaveURL('https://www.sferra.com/pages/tablecloth-size-guide')

    // Search a product
    await page.getByRole('link', { name: 'Search' }).click()
    await page.getByRole('search', { name: 'Search' }).click()
    await page.getByRole('search', { name: 'Search' }).fill('Table')
    await page.locator('a:has-text("Festival Runner")').click()
    await expect(page).toHaveURL('https://www.sferra.com/products/festival-runner')

    // We snap a screenshot.
    await page.screenshot({ path: "screenshots/screenshot.jpg" })
    // We close the page to clean up and gather performance metrics.
    await page.close()
});