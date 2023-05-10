import { test, expect } from "@playwright/test";
import {
	generateThemeRoute,
	loginAsCustomer,
	AddProductsFromHeaderSearch,
	proceedToCheckout,
	redirect404Check,
	visitTheme,
} from "../../utilities/utils";
import { B2B_DEV_URL, THEME_ID } from "../../utilities/constants";

/*
Feature: Smoke test for cart to checkout flow
  I want to test that the Cart page renders

  Scenario: Visiting as a guest visiting
    Given I am on the Cart
    The content should be hidden as a guest

  Scenario: Visiting as a logged in customer
    Given that I am on the cart with products
    All the cart totals should be visible
    Customer should be able to checkout when the cart is valid
    Customer should not be able to checkout when exceeding daily/weekly limits
*/

const pageURL = "/cart";

const validItems = [
	{ query: "1000132", quantity: "1" },
	{ query: "1006311", quantity: "1" },
];

const expensiveItems = [
	{ query: "1003839", quantity: "100" },
	{ query: "1024728", quantity: "100" },
];

const inventory_sku = [{ query: "1003839", quantity: "1" }];

const DOM_ELEMENTS = {
	cartAttributes: {
		cannabisWeight: "[data-cart-weight-cannabis]",
		shippingWeight: "[data-cart-weight-shipping]",
		remaining: "[data-cart-remaining]",
		total: "[data-cart-total]",
	},
	product: {
		title: ".productlistitem--title",
		money: ".productlistitem--price > .price--main > .money",
		name: ".product__description__name",
		price: ".product__price > span",
	},
	sidebar: ".sidebar",
	warningMessage: ".cart-warning.active > .message--warning",
};

test("Smoke test, Cart to Checkout", async ({ page }) => {
	await test.step("When a Guest is Visiting", async () => {
		await redirect404Check(page, pageURL);
	});

	await test.step("Log in as customer, should have the cart displayed", async () => {
		const route = generateThemeRoute("", true, B2B_DEV_URL, THEME_ID);
		await loginAsCustomer(page, "/", route);
		await AddProductsFromHeaderSearch(page, validItems);
		await visitTheme(page, "/cart");
		await expect(
			page.locator(DOM_ELEMENTS.cartAttributes.cannabisWeight)
		).toBeVisible();
		await expect(
			page.locator(DOM_ELEMENTS.cartAttributes.shippingWeight)
		).toBeVisible();
		await expect(
			page.locator(DOM_ELEMENTS.cartAttributes.remaining)
		).toBeVisible();
		await expect(page.locator(DOM_ELEMENTS.cartAttributes.total)).toBeVisible();
	});

	await test.step("Should be able to successfully continue to checkout when cart is valid", async () => {
		const cartTitles = [];
		const cartPrices = [];
		const checkoutTitles = [];
		const checkoutPrices = [];

		const containsAll = (arr1, arr2) =>
			arr2.every((arr2Item) => arr1.includes(arr2Item));

		const sameMembers = (arr1, arr2) =>
			containsAll(arr1, arr2) && containsAll(arr2, arr1);

		await visitTheme(page, "/cart");

		// Push product titles from /cart
		for (const productTitles of await page
			.locator(DOM_ELEMENTS.product.title)
			.all()) {
			const title = await productTitles.textContent();
			cartTitles.push(title.trim());
		}

		// Push product prices from /cart
		for (const productPrice of await page
			.locator(DOM_ELEMENTS.product.money)
			.all()) {
			const price = await productPrice.textContent();
			cartPrices.push(price);
		}

		await proceedToCheckout(page);
		await page.waitForSelector(DOM_ELEMENTS.sidebar, { timeout: 20000 });

		// Push product prices from checkout
		for (const checkoutProductTitles of await page
			.locator(DOM_ELEMENTS.product.name)
			.all()) {
			const title = await checkoutProductTitles.textContent();
			checkoutTitles.push(title);
		}

		for (const checkoutProductPrice of await page
			.locator(DOM_ELEMENTS.product.price)
			.all()) {
			const price = await checkoutProductPrice.textContent();
			checkoutPrices.push(price);
		}

		expect(sameMembers(cartTitles, checkoutTitles)).toBe(true);
	});

	// await test.step("should not be able to continue to checkout if it exceeds remaining inventory amount and cart is invalid", async () => {
	//     const quantity = '101';
	// 	await AddProductsFromHeaderSearch(page, inventory_sku);
	// 	await visitTheme(page, "/cart");

	//     // TODO: convert this intercept to check quantity from /cart/update.js
	//     // cy.intercept('POST', '/cart/update.js').as('cart-update');
	//     // cy.wait('@cart-update')
	//     //   .get('[data-product-list-item-quantity]')
	//     //   .should($el => {
	//     //     if ($el) {
	//     //       expect($el.val()).to.not.equal(quantity);
	//     //     }
	//     //   });
	//     // const quantityElement = await page.locator('[data-product-list-item-quantity]')
	//     // await expect(quantityElement).not.toEqual(quantity);
	// });

	await test.step("should not be able to continue to checkout if it exceeds order limits and cart is invalid", async () => {
		await visitTheme(page, "/");
		await AddProductsFromHeaderSearch(page, expensiveItems);
		await visitTheme(page, "/cart");
		await page.waitForSelector(DOM_ELEMENTS.warningMessage, { timeout: 5000 });
		await expect(
			page.locator(DOM_ELEMENTS.warningMessage).first()
		).toBeVisible();
	});
});
