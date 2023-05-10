/*
Feature: Smoke Test the Shopify /cart endpoint to ensure it is matching the products in the cart page.
  NOTE: This is for products that do not add cdfs as those increase the total number of items outside of being added through the header search.
Scenario:
  Given that I am in the cart page
  When there are products on the cart
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
	{ query: "1002112", quantity: "1" },
	{ query: "1002435", quantity: "1" },
];

test("Smoke Test Cart API", async ({ page }) => {
	const route = generateThemeRoute("", true, B2B_DEV_URL, THEME_ID);
	await loginAsCustomer(page, "/", route, STORE_PASSWORD);
	await AddProductsFromHeaderSearch(page, items);
	await visitTheme(page, "/cart");
	await page.pause();

	// TODO: convert this to playwright
	// cy.request('cart.js').then(response => {
	//     const items = JSON.parse(response.body).items;
	//     expect(items.length).to.equal(items.length);
	//     items.forEach(product => {
	//       expect(skus).to.contain(product.sku);
	//     });
	//   });
});
