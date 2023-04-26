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

const skus = [
	{ query: "1002112", quantity: "1" },
	{ query: "1002435", quantity: "1" },
];

test("Smoke Test Cart API", async ({ playwright, page }) => {
	const route = generateThemeRoute(
		"",
		true,
		"https://bccs-dev-b2b.myshopify.com/",
		"124589967180"
	);
	await loginAsCustomer(page, "/", route, "quoddity");
	await AddProductsFromHeaderSearch(page, skus);
	await visitTheme(page, "/cart");
	await page.pause();

	// TODO: convert this to playwright
	// cy.request('cart.js').then(response => {
    //     const items = JSON.parse(response.body).items;
    //     expect(items.length).to.equal(skus.length);
    //     items.forEach(product => {
    //       expect(skus).to.contain(product.sku);
    //     });
    //   });
});
