import { THEME_ID, B2B_DEV_URL, STORE_PASSWORD } from '../../utilities/constants';
import { test, expect } from '@playwright/test';
import {
  generateThemeRoute,
  loginAsCustomer,
  AddProductsFromHeaderSearch,
  visitTheme,
  waitForPageToFullyRender,
  proceedToCart,
  proceedToCheckout
} from '../../utilities/utils';

/*
Feature:
  Check the order limit for a product in the cart
  If the product added has a weekly limit and the user exceeds it, the user can't proceed to the checkout.
  If the same product has a valid quantity, the user can proceed to the checkout.

  Scenario:
    Visiting as a logged in customer
    Given that I am on the Cart with a product with a weekly order limit,
    if I try to order more than said amount proceeding to checkout, the page should prompt a warning message
    and the item quantity should decrease to the limit amount.
    After reentering a valid amount, the warning message should disappear and I should be able to proceed to checkout.
*/

// This product has a order limit of 2 products per week
// For more info check > https://docs.google.com/spreadsheets/d/1Hg9K4_wkhQwxxJOaeiqQuZ52iyBNT5kM4oawbq_toi4/edit#gid=1066879954
const item = [{ query: '1020220', quantity: '2' }];
const itemLimit = 2;

const route = generateThemeRoute('', true, B2B_DEV_URL, THEME_ID);

const inputSelector = 'input[data-product-list-item-quantity]';
const warningSelector = '.cart-warning.active[data-cart-warning]';

test.beforeEach(async ({ page }) => {
  await visitTheme(page);
  await loginAsCustomer(page, '', route, STORE_PASSWORD);
});

test('Integration test, Cart to Checkout with Order Limit', async ({ page }) => {
  await AddProductsFromHeaderSearch(page, item);
  await proceedToCart(page);

  await test.step('Check for order summary elements', async () => {
    await checkOrderSummary(page);
  });

  await test.step('Check the cart limit before proceeding to the checkout', async () => {
    await checkLimitIndication(page);
  });

  await test.step('Exceed item limit and check for warning', async () => {
    await checkForLimitWarning(page);
  });

  await test.step('Order allowed amount and proceed to checkout', async () => {
    await proceedWithValidAmounts(page);
  });
});

const checkOrderSummary = async (page) => {
  await waitForPageToFullyRender(page, 1000)
  expect(page.locator('span[data-cart-weight-cannabis]')).toBeVisible(true);
  expect(page.locator('span[data-cart-weight-shipping]')).toBeVisible(true);
  expect(page.locator('span[data-cart-remaining-total]')).toBeVisible(true);
  expect(page.locator('span[data-cart-total]')).toBeVisible(true);
}

const checkLimitIndication = async (page) => {
  const selector = 'span[data-sku-order-limit-value]';

  await page.waitForSelector(selector, { timeout: 1000 });
  expect(page.locator(selector)).toBeVisible(true);
  expect(page.locator(selector)).toHaveText(`${itemLimit}`);
}

const checkForLimitWarning = async (page) => {
  await page.locator(inputSelector).fill(`${itemLimit + 1}`);
  await page.locator(inputSelector).blur();

  await page.waitForSelector(warningSelector, { timeout: 1000 });
  expect(page.locator(warningSelector))
    .toHaveAttribute('data-cart-warning', 'quantity');

  await waitForPageToFullyRender(page, 1000);
  expect(page.locator(inputSelector))
    .toHaveAttribute('data-product-list-item-quantity', `${itemLimit}`);
}

const proceedWithValidAmounts = async (page) => {
  await page.locator(inputSelector).fill(`${itemLimit - 1}`);
  await page.locator(inputSelector).blur();

  await waitForPageToFullyRender(page, 1000);
  expect(page.locator(warningSelector)).toBeHidden(true);
  await proceedToCheckout(page);
}
