//import { generateMultipassURL } from '@knitagency/bccs-utils';
//import { generateThemeRoute } from '#cyhelpers';
import { expect, Locator, Page } from '@playwright/test';

export class CommandsHelper {
    readonly page: Page;
    readonly warningLoc: Locator;

    constructor(page: Page) {
        this.page = page;
        this.warningLoc = page.getByRole('heading', { name: 'Your connection is not private' });

    }

    /*     // Variant to handle BCCS password
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
    /*async function visitTheme(page) {
        visitTheme('/cart').then(() => {
            page.locator('[data-cart-checkout-button]').click();
        });
    }*/


    /**
     * With items in cart, use this command to proceed to Checkout from the Cart
     */
    // Cypress.Commands.add('CartProceedToCheckout', () => {
    //     cy.VisitTheme('/cart').then(() => {
    //         cy.get('[data-cart-checkout-button]').click();
    //     });
    // });

    async loginInTheStore() {
        // Login into the store
        await this.page.getByLabel('Password').click();
        await this.page.getByLabel('Password').fill('quoddity');

        await this.page.getByRole('button', { name: 'Submit' }).click();
        await expect(this.page).toHaveURL('https://bccs-dev-b2b.myshopify.com/');
        await this.page.waitForLoadState();

        console.log('Inside loginInTheStore before sign in');

        await this.page.getByRole('link', { name: 'Sign in' }).click();

        // Check the warning
        this.checkWarningMessage();

        await this.page.waitForLoadState();

        // Login into the store
        this.loginAsCustomer()
    }

    async loginAsCustomer() {
        // Wait until the page load all the elements
        await this.page.waitForLoadState();

        // Login with a customer
        await this.page.getByPlaceholder('Email address').click();
        await this.page.getByPlaceholder('Email address').fill('Multipass.Customer1@bcldb.com');

        await this.page.getByPlaceholder('Password').click();
        await this.page.getByPlaceholder('Password').fill('MovingForward7!');

        await this.page.getByRole('button', { name: 'Login' }).click();
        await expect(this.page).toHaveURL('https://bccs-dev-b2b.myshopify.com/');

        console.log('Inside loginAsCustomer');
    }

    async gotoBCCSUrl() {
        await this.page.goto('https://bccs-dev-b2b.myshopify.com/');
        await this.page.waitForLoadState();
    }

    async checkPopUp(page) {
        if (page.getByTestId('klaviyo-form-QVUyEF').isVisible()) {
            await page.getByRole('button', { name: 'Close form 1' }).click();
        }
    }

    async takeScreenshoot(page) {
        // We snap a screenshot.
        await page.screenshot({ path: "screenshots/screenshot.jpg" });
    }

    async closeBrowser(page) {
        // We close the page to clean up and gather performance metrics.
        await page.close();
    }

    // Method to check the warning message
    async checkWarningMessage() {
        if (await this.warningLoc.isVisible()) {
            await this.page.locator('html').click();
            await this.page.keyboard.type('Thisisunsafe');
            await this.page.keyboard.press('Enter');
        }
        console.log('Inside checkWarningMessage');
    }
}