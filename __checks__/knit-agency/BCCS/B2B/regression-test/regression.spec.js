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
import {
	B2B_DEV_URL,
	THEME_ID,
	STORE_PASSWORD,
} from "../../utilities/constants";

const items = [{ query: "1000132", quantity: "1" }];

const DOM_ELEMENTS = {
	breadCrumbsContainer: ".breadcrumbs-container",
	productTitle: ".site-main .product-title",
	shortDescription: ".product-short-description",
	productGallery: ".site-main .product-gallery",
	productCharacteristics: ".product-characteristics",
	continueButton: "#continue_button",
	checkoutHeader: "#main-header",
};

test("Regression Test, for logged-in customers", async ({ page }) => {
	await test.step("Type the product in the searchbar and go to the PDP", async () => {
		const route = generateThemeRoute("", true, B2B_DEV_URL, THEME_ID);
		await loginAsCustomer(page, "/", route, STORE_PASSWORD);
		await AddProductsFromHeaderSearch(page, items);
		await expect(page.locator(DOM_ELEMENTS.breadCrumbsContainer)).toBeVisible();
		await expect(page.locator(DOM_ELEMENTS.productTitle)).toBeVisible();
		await expect(page.locator(DOM_ELEMENTS.shortDescription)).toBeVisible();
		await expect(page.locator(DOM_ELEMENTS.productGallery)).toBeVisible();
		await expect(
			page.locator(DOM_ELEMENTS.productCharacteristics)
		).toBeVisible();
	});

	await test.step("Proceed to the checkout and place the order", async () => {
		await expect(page.locator(DOM_ELEMENTS.breadCrumbsContainer)).toBeVisible();
		await proceedToCheckout(page);

		// Continue the shipping
		await page.locator(DOM_ELEMENTS.continueButton).first().click();
		await page.waitForSelector(DOM_ELEMENTS.checkoutHeader, { timeout: 5000 });
		await expect(page.locator(DOM_ELEMENTS.checkoutHeader)).toHaveText(
			"Shipping method"
		);

		// Continue the payment
		await page.locator(DOM_ELEMENTS.continueButton).first().click();

		// Complete the order
		await page
			.locator(`.shown-if-js > ${DOM_ELEMENTS.continueButton}`)
			.first()
			.click();
	});
});
