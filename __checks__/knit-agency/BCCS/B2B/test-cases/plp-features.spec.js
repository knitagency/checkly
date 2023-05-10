import { test, expect } from "@playwright/test";
import {
	generateThemeRoute,
	loginAsCustomer,
	proceedToCart,
	visitTheme,
} from "../../utilities/utils";
import { B2B_DEV_URL, THEME_ID, STORE_PASSWORD } from "../../utilities/constants";

const pageURL = "/collections/flower";

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
    Feature: Filter expansion on PLP page
    I want to test that the filters expand out when clicking "more filters"
  */

	await test.step("should expand filters", async () => {
		const filterGroup = page.locator(".filter-group").first();
		const filterSeeMore = page.locator(".filter-text--link").first();
		await expect(filterGroup.locator(".filter-item").first()).toBeVisible();
		await expect(filterSeeMore).toContainText("See more");
		await filterSeeMore.click();
		await expect(filterGroup.locator(".filter-item").last()).toBeVisible();
	});

	/*
    Feature: CBD per UOM yields multiple results
    I want to test that more than one result is return when a filter of type "CBD per UOM" is applied
  */

	await test.step('should return more than 1 result when "CBD per UOM" filter is applied', async () => {
		await page
			.locator('[data-handle="cbd_per_retail_unit-cbd-less-than-30mg"]')
			.click();
		await expect(page.locator(".productlist--items").nth(0)).toBeVisible();
	});

	/*

  Feature: Quickshop modal
  I want to test that the "Quickshop" modal appears when "Quick look" is clicked and that the correct item is added to the cart.

  */

	await test.step('should open quickshop modal when "quick look" is clicked', async () => {
		// Get first available product, open quickshop modal and ensure it is visible
		const product = await page
			.locator(".productlist--item:not(.productitem--unavailable)")
			.first();
		await product
			.locator(".productitem--action-trigger")
			.first()
			.click({ force: true });
		await expect(page.locator(".modal--quickshop-full")).toBeVisible();

		// Store first available PLP product title and price, close modal and proceed to cart
		const PLPproductTitle = await page
			.locator(".modal--quickshop-full .product-title")
			.innerText();
		const PLPproductPrice = await page
			.locator(".modal--quickshop-full .price--main .money")
			.innerText();
		await page
			.locator(".modal--quickshop-full .product-form--atc-button")
			.click();
		await page.locator(".modal-close").click();
		await proceedToCart(page);

		// Compare cart product title and price to PLP product title and price
		const cartProductTitle = await page
			.locator(".productlistitem--title")
			.innerText();
		const cartProductPrice = await page
			.locator(".productlistitem--price .price--main .money")
			.innerText();
		expect(PLPproductTitle).toContain(cartProductTitle);
		expect(PLPproductPrice).toContain(cartProductPrice);
	});

	/*
  Feature: Related products is rendered
  I want to test that related products are rendered.
  */

	await test.step("related products should be visible", async () => {
		await expect(page.locator(".related-products--container")).toBeVisible();
	});
});
