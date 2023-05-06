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

/*
Feature: Smoke test Checkout creation
  I want to test to attributes rendered
  on the Checkout page
*/

const items = [
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

const DOM_ELEMENTS = {
	hiddenInput:
		'input[type=hidden][data-checkout-attribute][name="checkout[attributes]',
	sidebar: ".sidebar",
};
const valideHiddenInputs = async (page, value) => {
	const input = await page
		.locator(`${DOM_ELEMENTS.hiddenInput}[${value}]"]`)
		.first();

	const inputValue = await input.getAttribute("value");
	await expect(inputValue).not.toBe("");
};

test.describe("Smoke test Checkout creation", () => {
	test("Add Items to Cart and Proceed to Checkout, Verify Checkout Attributes Exist", async ({
		page,
	}) => {
		const route = generateThemeRoute("", true, B2B_DEV_URL, THEME_ID);
		await loginAsCustomer(page, "/", route, STORE_PASSWORD);
		await AddProductsFromHeaderSearch(page, items);
		await proceedToCheckout(page);

		await page.waitForSelector(DOM_ELEMENTS.sidebar, { timeout: 20000 });

		requiredAttributes.forEach((attribute) => {
			valideHiddenInputs(page, attribute);
		});
	});
});
