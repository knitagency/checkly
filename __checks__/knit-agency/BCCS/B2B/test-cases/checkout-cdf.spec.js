/**
 * Tests the checkout process for the CDF total amount and the existence of all CDF product by variant ids.
 */

import { test, expect } from "@playwright/test";
import {
	generateThemeRoute,
	loginAsCustomer,
	AddProductsFromHeaderSearch,
	proceedToCheckout,
	removeDollarSign,
} from "../../utilities/utils";
import {
	B2B_DEV_URL,
	THEME_ID,
	STORE_PASSWORD,
} from "../../utilities/constants";

const DOM_ELEMENTS = {
	sidebar: ".sidebar",
	productLineItem: ".product:not([data-product-type='Fee'])",
	productPrice: ".product__price span",
	paymentPrice: ".payment-due__price",
	priceTarget: "[data-checkout-subtotal-price-target]",
	taxLine: "[data-tax-line-custom]",
	productFee: "[data-product-type='Fee']",
};

const items = [
	{ query: "1017573", quantity: "2" },
	{ query: "1018316", quantity: "4" },
	{ query: "1017532", quantity: "3" },
];

test("Checkout CDF check", async ({ page }) => {
	const taxes = [];
	const subTotalWithFees = [];
	const feeVariants = [];

	/**
	 * Login as customer, add CDF products and go to checkout
	 */
	const route = generateThemeRoute("", true, B2B_DEV_URL, THEME_ID);
	await loginAsCustomer(page, "/", route, STORE_PASSWORD);
	await AddProductsFromHeaderSearch(page, items);
	await proceedToCheckout(page);
	await page.waitForSelector(DOM_ELEMENTS.sidebar, { timeout: 20000 });

	// Check order total matches variant prices + CDFs

	/**
	 * Push custom taxes into taxes array to be used for calculations.
	 */
	for (const cdfTaxLine of await page.locator(DOM_ELEMENTS.taxLine).all()) {
		taxes.push(cdfTaxLine.getAttribute("data-tax-line-toggle") / 100);
	}

	/**
	 * Push all product prices into subTotalWithFees array to be used for calculations.
	 */
	for (const taxLine of await page
		.locator(DOM_ELEMENTS.productLineItem)
		.all()) {
		const price = await taxLine.locator(DOM_ELEMENTS.productPrice).innerText();
		subTotalWithFees.push(removeDollarSign(price));
	}

	/**
	 * Push CDF fees into subTotalWithFees array to be used for calculations.
	 */
	for (const cdf of await page.locator(DOM_ELEMENTS.productFee).all()) {
		const variantId = await cdf.getAttribute("data-variant-id");
		const price = await cdf.locator(DOM_ELEMENTS.productPrice).innerText();
		subTotalWithFees.push(removeDollarSign(price));
		feeVariants.push({ [variantId]: 1 });
	}

	/**
	 * Maps feeVariants as key value pairs
	 * Key - Variant ID
	 * Value - Amount of fees by variant ID
	 */
	const cdfProductVariants = feeVariants.reduce((a, b) => {
		for (const key in b) {
			if (b.hasOwnProperty(key)) {
				a[key] = (a[key] || 0) + b[key];
			}
		}
		return a;
	}, {});

	/**
	 * Checks each fee variant length by variant id
	 */
	for (const key of Object.keys(cdfProductVariants)) {
		const variantCheck = await page
			.locator(`[data-variant-id="${key}"]`)
			.count();
		await expect(variantCheck).toEqual(cdfProductVariants[key]);
	}

	await page.waitForSelector(DOM_ELEMENTS.paymentPrice, { timeout: 5000 });
	const checkoutTotal = await page
		.locator(DOM_ELEMENTS.paymentPrice)
		.getAttribute("data-checkout-payment-due-target");

	/**
	 * Get total amount of all products & fees in dollar amount, convert to pennies
	 */
	const totalAmount =
		[...subTotalWithFees, ...taxes].reduce((a, b) => +a + +b, 0) * 100;

	/**
	 * Check if totalAmount to data-checkout-payment-due-target (total amount in pennies)
	 * Convert checkout total to int to compare with total amount
	 */
	expect(+checkoutTotal).toEqual(totalAmount);

	const cdfAmounts = [];

	for (const taxLine of await page
		.locator(DOM_ELEMENTS.productLineItem)
		.all()) {
		const price = await taxLine.locator(DOM_ELEMENTS.productPrice).innerText();
		cdfAmounts.push(removeDollarSign(price));
	}

	/**
	 * Expect the total price - totalWithOutCdf to equal to cdfTotal
	 */
	const subTotal = await page
		.locator(DOM_ELEMENTS.priceTarget)
		.getAttribute("data-checkout-subtotal-price-target");
	const cdfTotal = cdfAmounts.reduce((a, b) => +a + +b, 0) * 100;
	const taxesTotal = taxes.reduce((a, b) => +a + +b, 0);
	const totalWithOutCDF = +subTotal + taxesTotal - cdfTotal;
	const totalPrice = +subTotal + taxesTotal;
	expect(totalPrice - totalWithOutCDF).toEqual(cdfTotal);
});
