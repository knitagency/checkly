import { test, expect } from '@playwright/test';

/*
URL > https://www.sferra.com/?_ab=0&_fd=0&_sc=1
HomePage check:
- Check header
- Check display features
- Check Similar results
- Check titles
- Check templates
*/

test('Check the PLP', async ({ page }) => {
    /*     const site = process.env.SITE_URL || ""
    
        // Access to the URL
        await page.goto(site)
    
        // If the page doesn't return a successful response code, we fail the check.
        if (response.status() > 399) {
            throw new Error(`Failed with response code ${response.status()}`);
        } */

    await page.goto('https://www.sferra.com/?_ab=0&_fd=0&_sc=1');

    // Add product to the cart
    await page.getByRole('link', { name: 'BEDDING BEDDING' }).hover()
    await page.getByRole('link', { name: 'Duvet Covers' }).click();
    await expect(page).toHaveURL('https://www.sferra.com/collections/duvet-covers');
    await page.getByRole('link', { name: 'variant__slate Mara Duvet Cover' }).click();
    await expect(page).toHaveURL('https://www.sferra.com/products/mara-duvet-cover');
    await page.locator('form:has-text("Color SLATE SLATE SLATE SLATE Size KING KING SLATE / KING - $925 SLATE / FULL/QU")').getByRole('button', { name: 'KING' }).click();

    await page
        .locator('button.dropdown-menu')
        .locator('li')
        .filter({ hasText: /^KING$/ })
        .click();

    await expect(page).toHaveURL('https://www.sferra.com/products/mara-duvet-cover?variant=39996234006591');
    await page.locator('form:has-text("Color SLATE SLATE SLATE SLATE Size KING KING SLATE / KING - $925 SLATE / FULL/QU")').getByRole('button', { name: 'Add to bag' }).click();
    await page.getByRole('button', { name: 'Close bag' }).click();
    await page.locator('form:has-text("Color SLATE SLATE SLATE SLATE Size KING KING SLATE / KING - $925 SLATE / FULL/QU")').getByRole('button', { name: 'KING' }).click();
    await page.getByRole('button', { name: 'FULL/QUEEN' }).click();
    await expect(page).toHaveURL('https://www.sferra.com/products/mara-duvet-cover?variant=39996234104895');
    await page.locator('#product_form_7125631336511 div:has-text("This item is available for pre-order. .st0{fill-rule:evenodd;clip-rule:evenodd;}") span').nth(2).click();
    await page.locator('form:has-text("Color SLATE SLATE SLATE SLATE Size FULL/QUEEN FULL/QUEEN SLATE / KING - $925 SLA")').getByRole('button', { name: 'Add to bag' }).click();
    await page.getByRole('button', { name: 'Close bag' }).click();

    // Add product to the cart
    await page.getByText('TABLE TABLE').hover()
    await page.getByRole('link', { name: 'Napkins' }).click();
    await expect(page).toHaveURL('https://www.sferra.com/collections/table-napkins');
    await page.getByRole('link', { name: 'variant__white-multi Aperitivo Cocktail Napkins' }).click();
    await expect(page).toHaveURL('https://www.sferra.com/products/aperitivo-cocktail-napkins');
    await page.locator('#product_form_7125630910527 div:has-text("This item is available for pre-order. .st0{fill-rule:evenodd;clip-rule:evenodd;}") span').nth(2).click();
    await page.getByRole('button', { name: 'Add to bag' }).click();
    await page.getByRole('button', { name: 'Close bag' }).click();

    // Add product to the cart
    await page.getByRole('link', { name: 'DOWN DOWN' }).hover()
    await page.getByRole('link', { name: 'Duvets' }).click();
    await expect(page).toHaveURL('https://www.sferra.com/collections/duvets');
    await page.locator('#ProductItem--arcadia-duvet').getByRole('link', { name: 'A hypoallergenic microfiber fills SFERRA\'s Arcadia down alternative duvet. A hypoallergenic microfiber fills SFERRA\'s Arcadia down alternative duvet.' }).click();
    await expect(page).toHaveURL('https://www.sferra.com/products/arcadia-duvet');
    await page.getByRole('button', { name: 'HEAVY' }).click();
    await page.getByRole('button', { name: 'MEDIUM' }).click();
    await expect(page).toHaveURL('https://www.sferra.com/products/arcadia-duvet?variant=39599134507071');
    await page.locator('#product_form_4376788664383 div:has-text("This item is available for pre-order. .st0{fill-rule:evenodd;clip-rule:evenodd;}") span').nth(2).click();

    // Check PDP Sections
    await page.isVisible('button', { name: 'Details & Care' })
    await page.isVisible('button', { name: 'Size Guide' })
    await page.isVisible('button', { name: 'Details & Care' }).click()
    await page.isVisible('button', { name: 'Size Guide' }).click()
    await page.getByText(/Fiber\s+Pluma-fil\s+down\s+alternative\s+330TC\s+100%\s+cotton\s+sateen\s+Finishing\s+15"\s+Baffle\s+b/)
    await page.isVisible(/KING\s+108x94"Medium:\s+65\s+oz\.Heavy:\s+75\s+oz\.\s+QUEEN\s+90x94"Medium:\s+54\s+oz\.Heavy:\s+65\s+oz\.\s+/)
    await page.isVisible('Arcadia Throw$129 Color WHITE WHITE WHITE WHITE - $129 Qty .st0{fill-rule:evenod')
    await page.isVisible('Arcadia Mattress Pad$349 Size CALIFORNIA KING CALIFORNIA KING - $349KING - $349Q')
    await page.isVisible('You may also like Mara Duvet Cover $825 - $925 SLATE Aperitivo Cocktail Napkins')

    // Check Gifts option
    await page.isVisible('#product_form_4376788664383').getByText('Gift RegistryGift Registry')
    await page.isVisible('#product_form_4376788664383').getByText('Gift RegistryGift Registry Wishlist')
    await page.isVisible('#product_form_4376788664383 div:has-text("This item is available for pre-order. .st0{fill-rule:evenodd;clip-rule:evenodd;}") span').nth(2)

    // Add product to the cart
    await page.getByRole('button', { name: 'MEDIUM' }).click();
    await page.getByRole('button', { name: 'HEAVY' }).click();
    await expect(page).toHaveURL('https://www.sferra.com/products/arcadia-duvet?variant=31475256000575');
    await page.getByText('Arcadia Duvet$446').click();

    // Check templates section
    await page.locator('#shopify-section-product-template section div:has-text("Click to Zoom")').nth(3).click();
    await page.locator('#shopify-section-product-template section div:has-text("Click to Zoom")').nth(1).click();
    await page.getByRole('button', { name: 'Close (Esc)' }).click();
    await page.locator('form:has-text("Size KING KING Weight HEAVY HEAVY KING / HEAVY - $446 KING / MEDIUM - $377 QUEEN")').getByRole('button', { name: 'Add to bag' }).click();
    await page.getByRole('button', { name: 'Close bag' }).click();
    // We snap a screenshot.
    await page.screenshot({ path: "screenshots/screenshot.jpg" });
    // We close the page to clean up and gather performance metrics.
    await page.close();
});