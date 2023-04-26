import { test, expect } from "@playwright/test";
import {
	generateThemeRoute,
	loginAsCustomer,
	AddProductsFromHeaderSearch,
	proceedToCheckout,
} from "../../utilities/utils";

/*
Feature: Smoke test Checkout creation
  I want to test to attributes rendered
  on the Checkout page
*/

const skus = [
	{ query: "kush", quantity: "1" },
	{ query: "blueberry", quantity: "2" },
];

const requiredAttributes = [
	"cannabis_weight",
	"shipping_weight",
	"licence_type",
	"licence_number",
	"licence_pad",
	"licence_payment_state",
	"licence_pst_number",
	"licence_state",
	"licence_type",
];

const valideHiddenInputs = async (page, value) => {
	const input = await page
		.locator(
			`input[type=hidden][data-checkout-attribute][name="checkout[attributes][${value}]"]`
		)
		.first();

	const inputValue = await input.getAttribute("value");
	await expect(inputValue).not.toBe('');
};

test.describe("Smoke test Checkout creation", () => {
	test("Add Items to Cart and Proceed to Checkout, Verify Checkout Attributes Exist", async ({
		page,
	}) => {
		const route = generateThemeRoute(
			"",
			true,
			"https://bccs-dev-b2b.myshopify.com/",
			"124589967180"
		);
		await loginAsCustomer(page, "/", route, "quoddity");
		await AddProductsFromHeaderSearch(page, skus);
		await proceedToCheckout(page);
		
		await page.waitForSelector('.sidebar', { timeout: 20000 });

		requiredAttributes.forEach((attribute) => {
			valideHiddenInputs(page, attribute);
		});
	});
});
