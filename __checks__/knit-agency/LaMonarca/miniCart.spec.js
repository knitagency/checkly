import { test, expect } from '@playwright/test';

const site = "https://lamonarcabakery.com/"

// test.beforeAll(async () => {
//     page = await browser.newPage();
// });

// test.afterAll(async () => {
//     await page.close();
// });

function checkRespone(page) {
    // We visit the page.
    const response = page.goto(site);

    // If the page doesn't return a successful response code, we fail the check.
    if (response.status() > 399) {
        throw new Error(`Failed with response code ${response.status()}`);
    }
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

test('MiniCart check', async ({ page }) => {
    // We visit the page.
    await page.goto(site);

    checkPopUp(page);

    // Select option
    await page.getByText('SHOP Down Arrow Icon').hover();
    await page.getByRole('link', { name: 'COOKIES' }).click();
    await expect(page).toHaveURL('https://lamonarcabakery.com/collections/cookies');

    // Add product to the cart
    await page.getByRole('link', { name: 'Polvorones Sugar Cookies' }).first().hover();
    await page.locator('li:has-text("Quickshop Add to cart Unavailable Polvorones Sugar Cookies $5.99 Polvorones Suga")').getByRole('button', { name: 'Add to cart button' }).click();

    // Check all the sections of the MiniCart
    await page.getByText('shopping cart 1 Close Alternative Icon LaMonarcaBakery Polvorones Sugar Cookies').isVisible()
    await page.getByText('LaMonarcaBakery Polvorones Sugar Cookies $5.99 Remove - +').isVisible()
    await page.getByText('you may also like... Cafe de Olla $16.00 + Unavailable Cafe de Olla $16.00 Organ').isVisible()
    await page.getByText('Subtotal $5.99').isVisible()
    await page.getByText('Subtotal').isVisible()
    await page.getByText('$5.99').nth(1).isVisible()

    // Add a new product from "You might also like"
    await page.locator('li:has-text("Cafe de Olla $16.00 + Unavailable Cafe de Olla $16.00")').getByRole('button', { name: 'Add to cart button' }).click();
    await page.locator('div:has-text("LaMonarcaBakery Cafe de Olla $16.00 Remove - +")').nth(3).isVisible()
    await page.locator('div:nth-child(2) > .cart-mini-item-row > div:nth-child(3) > .qtydiv > .qtybox > span:nth-child(3)').click();
    await page.locator('input[name="quantity"]').nth(1).isVisible()
    
    // Expected to have value 2 now after incrementing the amount
    let sum1 = await page.locator('input[name="quantity"]').nth(1).inputValue();
    expect(sum1).toEqual("2");

    // Remove product from the MiniCart
    await page.getByRole('button', { name: 'remove' }).nth(1).click();
    await page.getByText('LaMonarcaBakery Polvorones Sugar Cookies $5.99 Remove - +').isHidden()

    // Expected to have value 2 now after incrementing the amount
    await page.locator('span:has-text("-")').nth(1).click();
    let descrease1 = await page.locator('input[name="quantity"]').nth(1).inputValue();
    expect(descrease1).toEqual("1");
});