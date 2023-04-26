import { test, expect } from "@playwright/test";
import {
	generateThemeRoute,
	loginAsCustomer,
	visitTheme,
	redirect404Check,
} from "../../utilities/utils";

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

test.describe("Smoke test, PDP", () => {
	test("For Guests, page should be a 404", async ({ page }) => {
		await redirect404Check(page, pageURL);
	});

	test("Product Details Should be Visible", async ({ page }) => {
		const route = generateThemeRoute(
			"",
			true,
			"https://bccs-dev-b2b.myshopify.com/",
			"124589967180"
		);
		await loginAsCustomer(page, "/", route, "quoddity");
		await visitTheme(page, pageURL);

		// Check product details
		await expect(page.locator(".breadcrumbs-container")).toBeVisible();
		await expect(page.locator(".site-main .product-title")).toBeVisible();
		await expect(page.locator(".product-short-description")).toBeVisible();
		await expect(page.locator(".site-main .product-gallery")).toBeVisible();
		await expect(page.locator(".product-characteristics")).toBeVisible();

		// Expect gallery to be visible and not have liquid Error
		const galleryImage = await page.locator(".product-gallery--image").first();
		await expect(galleryImage).toBeVisible();
		await expect(galleryImage).not.toContainText(liquidError);
	});
});
