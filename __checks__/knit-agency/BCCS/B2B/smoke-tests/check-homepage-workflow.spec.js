import { test, expect } from "@playwright/test";
import {
	generateThemeRoute,
	loginAsCustomer,
	enterStorePassword,
} from "../../utilities/utils";

/*
Feature: Smoke test Homepage
  I want to test that the Homepage renders

  Scenario: Visiting as a guest visiting
    Given I am on the homepage
    The content should be hidden
    And the guest navigation should display

  Scenario: Visiting as a logged in customer
    Given that I am on the Homepage
    All homepage sections should be visible
    And the navigation search works as expected
*/


test.describe("Smoke test, Homepage", () => {
	test("Should Display Guest Header", async ({ page }) => {
		const route = generateThemeRoute(
			"",
			true,
			"https://bccs-dev-b2b.myshopify.com/",
			"124589967180"
		);
		await enterStorePassword(page, route, "quoddity");

		// Ensure guest header is visible
		await expect(
			page.locator(".site-main .welcome-message--container")
		).toBeVisible();

		// Ensure register/sign in links exist and href values are not empty
		const headerButtons = await page.$$(
			"[data-site-header-main] .site-header-account a"
		);

		await expect(headerButtons.length).toBeGreaterThan(0);
		for (const button of headerButtons) {
			const buttonValue = await button.getAttribute("value");
			await expect(buttonValue).not.toBe("");
		}
	});

	test("Page Should Have Major Content Areas", async ({ page }) => {
		const route = generateThemeRoute(
			"",
			true,
			"https://bccs-dev-b2b.myshopify.com/",
			"124589967180"
		);
		await loginAsCustomer(page, "/", route, "quoddity");
		await expect(page.locator(".site-navigation")).toBeVisible();
		await expect(page.locator(".welcome-message--title")).toBeVisible();
		await expect(page.locator(".promo-mosaic--container").first()).toBeVisible();
	});
});
