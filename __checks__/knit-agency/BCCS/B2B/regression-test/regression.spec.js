/*
Feature: Check the main workflow is working
  I want to test the main workflow since I login until I purchase an Item

  Scenario: Login and purhase an item
    Given I am  on the homepage as customer
    Then I should see search bar
    And a account menu in header
    And be able to search a product in the search
    And add the item to the cart
    And go to the cart section
    And proceed to the checkout
    Then I should place the order
*/

import { test, expect } from "@playwright/test";

import {
	generateThemeRoute,
	loginAsCustomer,
	AddProductsFromHeaderSearch,
	proceedToCheckout,
} from "../../utilities/utils";

const skus = [{ query: "1000132", quantity: "1" }];

test("Regression Test, for logged-in customers", async ({ page }) => {
	await test.step("Type the product in the searchbar and go to the PDP", async () => {
		const route = generateThemeRoute(
			"",
			true,
			"https://bccs-dev-b2b.myshopify.com/",
			"124589967180"
		);
		await loginAsCustomer(page, "/", route, "quoddity");
		await AddProductsFromHeaderSearch(page, skus);
		await expect(page.locator(".breadcrumbs-container")).toBeVisible();
		await expect(page.locator(".site-main .product-title")).toBeVisible();
		await expect(page.locator(".product-short-description")).toBeVisible();
		await expect(page.locator(".site-main .product-gallery")).toBeVisible();
		await expect(page.locator(".product-characteristics")).toBeVisible();
	});

	await test.step("Proceed to the checkout and place the order", async () => {
		await expect(page.locator(".breadcrumbs-container")).toBeVisible();
		await proceedToCheckout(page);

		// Continue the shipping
		await page.locator("#continue_button").first().click();

		await page.waitForSelector("#main-header", { timeout: 5000 });
		await expect(page.locator("#main-header")).toHaveText("Shipping method");

		// Continue the payment
		await page.locator("#continue_button").first().click();

		// Complete the order
		await page.locator(".shown-if-js > #continue_button").first().click();
	});
});
