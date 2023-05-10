/*
Feature: Deleting items from the cart
  I want to test the functionality to add items to the cart

    Scenario: Visiting as a logged in customer
      Given that I am on the cart
      Then delete one of the products from the cart
*/

import { test, expect } from "@playwright/test";

import {
	generateThemeRoute,
	loginAsCustomer,
	AddProductsFromHeaderSearch,
	visitTheme,
} from "../../utilities/utils";

import {
	B2B_DEV_URL,
	THEME_ID,
	STORE_PASSWORD,
} from "../../utilities/constants";

const items = [
	{ query: "1000132", quantity: "1" },
	{ query: "1006311", quantity: "2" },
];

const DOM_ELEMENTS = {
    removeAllToggle: ".cart-title .button-icon",
    removeAllButton: ".cart-title .button-text-destructive",
    cartEmpty: ".cartitems-empty"
}

test("Delete Items from the cart", async ({ page }) => {
    const route = generateThemeRoute("", true, B2B_DEV_URL, THEME_ID);
    await loginAsCustomer(page, "/", route, STORE_PASSWORD);
    await AddProductsFromHeaderSearch(page, items);
    await visitTheme(page, "/cart");

    /** Remove all items from cart */
    await page.locator(DOM_ELEMENTS.removeAllToggle).click();
    await page.locator(DOM_ELEMENTS.removeAllButton).click({ force: true })

    /** Ensure cartempty element is visible */
    await expect(page.locator(DOM_ELEMENTS.cartEmpty)).toContainText(/Your cart is empty/)
    await expect(page.locator(DOM_ELEMENTS.cartEmpty)).toBeVisible();
});
