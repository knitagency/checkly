import { THEME_ID, B2B_DEV_URL } from '../../utilities/constants';
import { test, expect } from '@playwright/test';
import {
  generateThemeRoute,
  loginAsCustomer,
  AddProductsFromHeaderSearch,
  visitTheme,
} from "../../utilities/utils";
/*
Feature: Adding items to the cart
  I want to test the functionality to add items to the cart from the main page and then from within.

    Scenario: Visiting as a logged in customer after
      Given I am on the cart
      And I add a new item to my cart
      Then the total amount of line-items should update accordinly and their skus should match
*/

const route = generateThemeRoute(
  '',
  true,
  B2B_DEV_URL,
  THEME_ID
);

const skus = [
  { query: '1000132', quantity: "1" },
  { query: '1006311', quantity: "1" }
];

const extraItem = { query: '1000023', quantity: "1" };

const lineItemsCount = [...skus, extraItem].length;

const skusText = [...skus, extraItem].map(i => (i.query));

const addItemFromInsideCart = async (page) => {
  await page.getByRole('link', { name: '2 View cart' }).click();
  //allow for button to be fully rendered
  await page.waitForTimeout(1500);
  await page.locator('button:text("Add a product to order")').click();
  await page.getByPlaceholder('Add a product to order').fill(extraItem.query);
  //allow for search results to populate
  await page.waitForTimeout(1000);
  await page.locator('#search-cart').getByRole('link').first().click();
}

test('Integration Test, Add more items from the cart', async ({ page }) => {
  await visitTheme(page);
  await loginAsCustomer(page, "", route, "quoddity");
  await AddProductsFromHeaderSearch(page, skus);

  await test.step('Redirect to cart and add extra product from within', async () => {
    await addItemFromInsideCart(page);
    //check cart lineitems length
    await expect(page.locator('.productlistitem')).toHaveCount(lineItemsCount);
    //check skus match the ones added
    await expect(page.locator('.productlistitem--sku-text')).toContainText(skusText);
  });
});
