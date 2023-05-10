import { test, expect } from "@playwright/test";
import {
	generateThemeRoute,
	loginAsCustomer,
	proceedToCart,
	visitTheme,
} from "../../utilities/utils";
import { B2B_DEV_URL, THEME_ID, STORE_PASSWORD } from "../../utilities/constants";

const pageURL = "/collections/flower/products/sensi-star";

test("PLP tests", async ({ page }) => {
	await test.step("login", async () => {
		const route = generateThemeRoute(
			"",
			true,
			B2B_DEV_URL,
			THEME_ID
		);
		await loginAsCustomer(page, "/", route, STORE_PASSWORD);
		await visitTheme(page, pageURL);
	});
	/*
    Feature: Main product image changes when a different image is selected from gallery.
    I want to test that the main product image is changed after a different image from the gallery is selected.
  */
	await test.step("should change main product image", async () => {
		const initialThumbNail = await page
			.locator(".product-gallery--thumbnail-trigger")
			.nth(0);
		const secondThumbNail = await page
			.locator(".product-gallery--thumbnail-trigger")
			.nth(1);

		/**
		 * Expect initial thumbnail to be selected
		 * */
		expect(initialThumbNail).toHaveClass(/thumbnail--selected/);

		/**
		 * After clicking second thumbnail, it should be selected and initial thumbnail should not be selected
		 */
		await secondThumbNail.click();
		expect(initialThumbNail).not.toHaveClass(/thumbnail--selected/);
		expect(secondThumbNail).toHaveClass(/thumbnail--selected/);
	});

	/*
    Feature: A variant that is not in stock cannot be added to the cart.
    I want to test that an unavailable product cannot be added to the cart.
  */
	await test.step("should have a disabled ATC button", async () => {
		await page.locator("select #static-product-form--data-product-option-0");

		const optionsArr = await page.$$eval(
			"select #static-product-form--data-product-option-0 option",
			(options) => {
				return options.map((option) => option.value);
			}
		);

		for (const optionValue in optionsArr) {
			await page
				.locator("select#static-product-form--data-product-option-0")
				.selectOption(optionValue);
			const productBadge = await page.locator(
				".product-pricing .product-pricing-badge"
			);

			if (productBadge.innerHTML.trim().includes("Not in Stock")) {
				await expect(page.locator(".product-form--atc-button"))
					.toBeDisabled()
					.toHaveClass("/disabled/");
			}
		}
	});

	/*
    Feature: Maximum quantity toast message. Toast message indicating maximum quantity appears when big number is inputted
    I want to test that an error toast indicating that the maximum quantity was exceeded appears when attempting to add an invalid amount to cart.
  */
	await test.step("should display maximum amount error toast ", async () => {
		const errorMessage =
			"Quantity requested unavailable, maximum amount has been added to your cart";
		await page.locator("#product-quantity-input").fill("99999999999999");
		await page.locator(".product-form--atc-button").click();
		await expect(page.locator("[data-messaging]")).toBeVisible();
		await expect(page.locator("[data-messaging-content]")).toContainText(
			errorMessage
		);
	});

	/*
    Feature: Accurate price and SKU from PDP to Cart page.
    I want to test that the product price and SKU corrsponds to the one in the cart once it is added.
  */
	await test.step("should compare product title, sku and price to item in cart", async () => {
		const PDPproductTitle = await page.locator(".product-title").innerText();
		const PDPproductSKU = await page.locator(".product-data-sku").innerText();
		const PDPproductPrice = await page
			.locator(".price--main .money")
			.first()
			.innerText();
		await page.locator("#product-quantity-input").fill("1");
		await page.locator(".product-form--atc-button").click();
		await proceedToCart(page);
		const cartProductTitle = await page
			.locator(".productlistitem--title > a")
			.innerText();
		const cartProductSKU = await page
			.locator(".productlistitem--sku-text")
			.innerText();
		const cartProductPrice = await page
			.locator(".productlistitem--price > .price--main > .money")
			.innerText();
		expect(PDPproductTitle).toContain(cartProductTitle);
		expect(PDPproductSKU).toContain(cartProductSKU);
		expect(PDPproductPrice).toContain(cartProductPrice);
	});
});
