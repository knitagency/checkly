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

import { test, expect } from "@playwright/test";
import {
	generateThemeRoute,
	loginAsCustomer,
	enterStorePassword,
} from "../../utilities/utils";
import {
	B2B_DEV_URL,
	THEME_ID,
	STORE_PASSWORD,
} from "../../utilities/constants";

const DOM_ELEMENTS = {
	guestHeader: ".site-main .welcome-message--container",
	headerButtons: "[data-site-header-main] .site-header-account a",
	siteNav: ".site-navigation",
	welcomeMessage: ".welcome-message--title",
	mosaicSection: ".promo-mosaic--container",
};

test.describe("Smoke test, Homepage", () => {
	test("Should Display Guest Header", async ({ page }) => {
		const route = generateThemeRoute("", true, B2B_DEV_URL, THEME_ID);

		await enterStorePassword(page, route, STORE_PASSWORD);

		// Ensure guest header is visible
		await expect(page.locator(DOM_ELEMENTS.guestHeader)).toBeVisible();

		// Ensure register/sign in links exist and href values are not empty
		const headerButtons = await page.$$(DOM_ELEMENTS.headerButtons);

		await expect(headerButtons.length).toBeGreaterThan(0);
		for (const button of headerButtons) {
			const buttonValue = await button.getAttribute("value");
			await expect(buttonValue).not.toBe("");
		}
	});

	test("Page Should Have Major Content Areas", async ({ page }) => {
		const route = generateThemeRoute("", true, B2B_DEV_URL, THEME_ID);
		await loginAsCustomer(page, "/", route, STORE_PASSWORD);
		await expect(page.locator(DOM_ELEMENTS.siteNav)).toBeVisible();
		await expect(page.locator(DOM_ELEMENTS.welcomeMessage)).toBeVisible();
		await expect(
			page.locator(DOM_ELEMENTS.mosaicSection).first()
		).toBeVisible();
	});
});
