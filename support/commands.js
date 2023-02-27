import { generateMultipassURL } from '@knitagency/bccs-utils';
import { generateThemeRoute } from '#cyhelpers';
import { expect } from '@playwright/test';

// Variant to handle BCCS password
const handlePasswordPage = () => {
    expect(page.locator(".passwordentry-title")), async () => {
        //page.getByPlaceholder('Password').fill(process.env.SHOP_PASSWORD_PAGE);
        page.locator("input#password").fill(process.env.SHOP_PASSWORD_PAGE);
        page.getByRole('button', { name: 'Submit' }).click();
    }
};

// Generate Multipass URL and login as a customer. This bypasses IAM endpoint but mirrors functionality.
async function loginAsCustomer(page) {
    const returnToRoute = generateThemeRoute(page, process.env.USE_PREVIEW_THEME);
    const shopURL = process.env.SITE_B2B_URL || "";

    // NOTE: Remove protocol from URL due to Util dependency.
    const cleanShopURL = shopURL.replace(/^https?:\/\//, '');

    const multipassRoute = generateMultipassURL({
        shopURL: cleanShopURL,
        shopSecret: process.env.SHOP_PASSWORD_PAGE,
        returnURL: returnToRoute
    });

    page.goto(multipassRoute);
}

// Visit function with support for viewing theme previews.
async function visitTheme(page) {
    const url = generateThemeRoute(page, process.env.SITE_B2B_URL);

    await page.goto(site).then(() => handlePasswordPage());
}

async function HeaderSearch(query = 'kusk') {
    page.locator('#search-header input.site-header-search-form-field').fill(query);
}

/**
 * With items in cart, use this command to proceed to Checkout from the Cart
 */
async function visitTheme(page) {
    visitTheme('/cart').then(() => {
        page.locator('[data-cart-checkout-button]').click();
    });
}


/**
 * With items in cart, use this command to proceed to Checkout from the Cart
 */
// Cypress.Commands.add('CartProceedToCheckout', () => {
//     cy.VisitTheme('/cart').then(() => {
//         cy.get('[data-cart-checkout-button]').click();
//     });
// });

async function checkPopUp(page) {
    if (page.getByTestId('klaviyo-form-QVUyEF').isVisible()) {
        await page.getByRole('button', { name: 'Close form 1' }).click();
    }
}

async function takeScreenshoot(page) {
    // We snap a screenshot.
    await page.screenshot({ path: "screenshots/screenshot.jpg" });
}

async function closeBrowser(page) {
    // We close the page to clean up and gather performance metrics.
    await page.close();
}