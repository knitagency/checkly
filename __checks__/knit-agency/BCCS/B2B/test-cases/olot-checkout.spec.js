/*
Feature: Cart Page OLOT Check
  Scenario: As a logged-in customer
    Given that I am on the cart page with products
    Products are under the OLOT limit
    All the cart totals should be visible
    Checkout button should be visible and clickable

  Scenario: As a logged-in customer
    Given that I am on the cart page with products
    Products are over the OLOT limit
    All the cart totals should be visible
    Subtotal should be greater than remaining total
    Warning messages should be visible
    Checkout button should be disabled
*/

import { test, expect } from "@playwright/test";
import {
	generateThemeRoute,
	loginAsCustomer,
	AddProductsFromHeaderSearch,
	visitTheme,
	removeDollarSign,
} from "../../utilities/utils";
import { B2B_DEV_URL, THEME_ID, STORE_PASSWORD } from "../../utilities/constants";

const cheapItems = [
	{ query: "1019538", quantity: "1" },
	{ query: "1020445", quantity: "1" },
];

const expensiveItems = [
	{ query: "1019538", quantity: "100" },
	{ query: "1024728", quantity: "100" },
];

const DOM_ELEMENTS = {
	REMAINING_TOTAL: ".cart-total--remaining",
	SUBTOTAL: ".cart-total--subtotal",
	CART_BUTTON: "[data-cart-checkout-button]",
	cartAttributes: {
		cannabisWeight: "[data-cart-weight-cannabis]",
		shippingWeight: "[data-cart-weight-shipping]",
		remaining: "[data-cart-remaining]",
		total: "[data-cart-total]",
	},
	warningMessage: "[data-cart-warning='remaining'] > .message--warning"
};


test.describe("OLOT Cart to Checkout test", () => {
	test.beforeEach(async ({ page }) => {
		const route = generateThemeRoute(
			"",
			true,
			B2B_DEV_URL,
			THEME_ID
		);
		await loginAsCustomer(page, "/", route, STORE_PASSWORD);
	});

	/**
	 * @param {*} skus array of object skus with query ID and quantity
	 * Adds product skus and proceeds to the cart page.
	 * Then checks if the cannabis weight, shipping weight, cart remaining total and cart total are all visible.
	 */
	const addProducts = async (page, skus) => {
		// Add products
		await AddProductsFromHeaderSearch(page, skus);

		// Navigate to cart
		await visitTheme(page, "/cart");

		// Check if cart totals are visible
		await expect(page.locator(DOM_ELEMENTS.cartAttributes.cannabisWeight)).toBeVisible();
		await expect(page.locator(DOM_ELEMENTS.cartAttributes.shippingWeight)).toBeVisible();
		await expect(page.locator(DOM_ELEMENTS.cartAttributes.remaining)).toBeVisible();
		await expect(page.locator(DOM_ELEMENTS.cartAttributes.total)).toBeVisible();
	};

	test("Products should be under OLOT limit and able to checkout", async ({
		page,
	}) => {
		await addProducts(page, cheapItems);
		await page.locator(DOM_ELEMENTS.CART_BUTTON).click();
	});

	test("Products should be over OLOT limit and unable to checkout", async ({
		page,
	}) => {
		await addProducts(page, expensiveItems);
		await expect(page.locator(DOM_ELEMENTS.CART_BUTTON)).toBeDisabled();

		const remaingTotalEl = await page
			.locator(`${DOM_ELEMENTS.REMAINING_TOTAL} .money`)
			.innerText();
		const subTotalEl = await page
			.locator(`${DOM_ELEMENTS.SUBTOTAL} .money`)
			.innerText();

		const remainingAmount = parseFloat(removeDollarSign(remaingTotalEl));
		const subTotal = parseFloat(removeDollarSign(subTotalEl));
		expect(subTotal).toBeGreaterThan(remainingAmount);

		/**
		 * Checks if warning messages are shown and errors exist on the remaining total, subtotal and cart button elements.
		 */
		await expect(
			page.locator(DOM_ELEMENTS.warningMessage)
		).toBeVisible();

		await expect(page.locator(DOM_ELEMENTS.REMAINING_TOTAL)).toHaveClass(
			/error/
		);
		await expect(page.locator(DOM_ELEMENTS.SUBTOTAL)).toHaveClass(/error/);
		await expect(page.locator(DOM_ELEMENTS.CART_BUTTON)).toHaveClass(
			/disabled/
		);
	});
});
