import { test, expect } from "@playwright/test";
import {
	generateThemeRoute,
	loginAsCustomer,
	visitTheme,
	redirect404Check,
} from "../../utilities/utils";
import {
	B2B_DEV_URL,
	THEME_ID,
	STORE_PASSWORD,
} from "../../utilities/constants";

/*
Feature: Smoke test Product Details Page (PDP)
  I want to test that the PDP renders

  Scenario: Visiting as a guest visiting
    Given I am on the PDP
    The content should be hidden as a guest

  Scenario: Visiting as a logged in customer
    Given that I am on the PDP
    All the content should be visible
*/

const pageURL = "/collections/flower/products/sensi-star";
const liquidError = "Liquid error";
const DOM_ELEMENTS = {
	breadCrumbsContainer: ".breadcrumbs-container",
	productTitle: ".site-main .product-title",
	shortDescription: ".product-short-description",
	productGallery: ".site-main .product-gallery",
	productCharacteristics: ".product-characteristics",
	continueButton: "#continue_button",
	checkoutHeader: "#main-header",
	galleryImage: ".product-gallery--image",
};

test.describe("Smoke test, PDP", () => {
	test("For Guests, page should be a 404", async ({ page }) => {
		await redirect404Check(page, pageURL);
	});

	test("Product Details Should be Visible", async ({ page }) => {
		const route = generateThemeRoute("", true, B2B_DEV_URL, THEME_ID);
		await loginAsCustomer(page, "/", route, STORE_PASSWORD);
		await visitTheme(page, pageURL);

		// Check product details
		await expect(page.locator(DOM_ELEMENTS.breadCrumbsContainer)).toBeVisible();
		await expect(page.locator(DOM_ELEMENTS.productTitle)).toBeVisible();
		await expect(page.locator(DOM_ELEMENTS.shortDescription)).toBeVisible();
		await expect(page.locator(DOM_ELEMENTS.productGallery)).toBeVisible();
		await expect(
			page.locator(DOM_ELEMENTS.productCharacteristics)
		).toBeVisible();

		// Expect gallery to be visible and not have liquid Error
		const galleryImage = await page.locator(DOM_ELEMENTS.galleryImage).first();
		await expect(galleryImage).toBeVisible();
		await expect(galleryImage).not.toContainText(liquidError);
	});
});
