import { test, expect } from "@playwright/test";
import {
	generateThemeRoute,
	loginAsCustomer,
	AddProductsFromHeaderSearch,
	proceedToCheckout,
	visitTheme,
	getLocalStorage,
} from "../../utilities/utils";
import { B2B_DEV_URL, THEME_ID, STORE_PASSWORD } from "../../utilities/constants";

/**
 Ensure that Checkout are consistently created from different flows, this utilizes the the `shopify-buy-SDK` which abstracts Storefront API interactions.
Feature: Ensure checkout is properly created
  Scenario: Checkout ID is saved after successful instances
    When using the Cart
      Expect to find checkout ID in storage
*/

const items = [
	{ query: "1000132", quantity: "1" },
	{ query: "1006311", quantity: "1" },
];

/**
 * Util function to return a boolean if the "checkout_id" exists in the local storage and is a valid value.
 * @param {*} localStorage
 * @returns Boolean if the checkoutId is a string and a valid value
 */
const getCheckoutID = async (localStorage) => {
	const storefrontCheckoutId = "checkout_id";
	const checkoutId = localStorage[storefrontCheckoutId];
	const checkoutIdType = typeof (checkoutId === "string") && checkoutId;
	return checkoutIdType;
};

test.describe("Ensure a checkouts ID is saved", async () => {
	await test("expect to create `checkout_id` when none found", async ({
		page,
	}) => {
		const route = generateThemeRoute(
			"",
			true,
			B2B_DEV_URL,
			THEME_ID
		);
		await loginAsCustomer(page, "/", route, STORE_PASSWORD);
		await AddProductsFromHeaderSearch(page, items);
		await visitTheme(page, "/checkout");
		const localStorage = getLocalStorage(page);
		await expect(getCheckoutID(localStorage)).toBe(false);
	});

	await test("expects `checkout_id` to exist in the checkout", async ({
		page,
	}) => {
		const route = generateThemeRoute(
			"",
			true,
			B2B_DEV_URL,
			THEME_ID
		);
		await loginAsCustomer(page, "/", route, STORE_PASSWORD);
		await AddProductsFromHeaderSearch(page, items);
		await proceedToCheckout(page);
		const localStorage = getLocalStorage(page);
		await expect(getCheckoutID(localStorage)).toBe(true);
	});
});
