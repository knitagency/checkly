import { THEME_ID, B2B_DEV_URL, STORE_PASSWORD } from '../../utilities/constants';
import { test, expect } from '@playwright/test';
import {
  generateThemeRoute,
  loginAsCustomer,
  AddProductsFromHeaderSearch,
  visitTheme,
  inCartSearch,
  actionQuickLook,
  atcQuickShop,
  proceedToCheckout,
  waitForPageToFullyRender,
  proceedToCart
} from "../../utilities/utils";
/*
Feature: Cannabis Weight is totalled correctly
  I want to test that the Cart and Checkout consistently set the same cannabis weight attribute.

  This includes testing the initial values when the page is first rendered
  And testing values that are updated and don't require refreshing the page

  The scenario will be looped with order item composition.

  Scenarios:
    1: CDF product is first, follow by other items
    2: Items and a CDF product somewhere in the middle of the order

  Scenario loop:
    Given I am on the homepage with a few items already in the cart
    When going to the Cart, expect the count to be correct
    When adding additional items, via the Cart inline search, display the correct updated weight
    Then proceeding the Checkout should display the same result from the Cart

*/

const route = generateThemeRoute(
  '',
  true,
  B2B_DEV_URL,
  THEME_ID
);

const cdfProductSku = '1017557';

// Elements order within array is important
const firstSetSearchItems = [
  { query: cdfProductSku, quantity: '1' },
  { query: '1010834', quantity: '1' },
  { query: '1019074', quantity: '1' }
];

// Elements order within array is important
const secondSetSearchItems = [
  { query: '1010834', quantity: '1' },
  { query: cdfProductSku, quantity: '1' },
  { query: '1019074', quantity: '1' },
];

const headerSearchSkus = [firstSetSearchItems, secondSetSearchItems];

const inlineCartSkus = ['1023639'];

// Stateful values:
let cartTotalCannabisWeight; // NOTE: Used to compare cart and checkout values
let checkoutTotalCannabisWeight;

test.describe('Cannabis Weight is tallied correctly', () => {
  test.beforeEach(async ({ page }) => {
    await visitTheme(page);
    await loginAsCustomer(page, '', route, STORE_PASSWORD);
  });

  headerSearchSkus.forEach((items, index) => {
    test(`${index} - Order: ${items.length}, building cart`, async ({ page }) => {
      await test.step('Cart checks', async () => {
        let pristine = true;

        await AddProductsFromHeaderSearch(page, items);
        await proceedToCart(page);
        await expect(page.locator('.productlistitem')).toHaveCount(items.length);

        inlineCartSkus.forEach(sku => {
          inCartSearch(page, pristine, sku);
          actionQuickLook(page);
          atcQuickShop(page);
          pristine = !pristine;
        });

        await compareCannabisTotalWeights(page);
      });
    });
  });
});

const compareCannabisTotalWeights = async (page) => {
  await waitForPageToFullyRender(page, 8000);
  cartTotalCannabisWeight = await page.locator('[data-cart-weight-cannabis]').textContent();
  await proceedToCheckout(page);
  checkoutTotalCannabisWeight = await page.locator('[data-cart-weight-cannabis]').textContent();
  expect(checkoutTotalCannabisWeight).toEqual(cartTotalCannabisWeight);
}
