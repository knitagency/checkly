/*
Feature: Site Header
  I want to test the site global header for correct functionality.

  Scenario: Visiting as a guest visiting
    Given I am  on the homepage as guest
    There should be register and sign up buttons

  Scenario: Visiting as a logged in customer
    Given I am on the homepage as a customer
    Then I should see search bar
    And a account menu in header

  Scenario: Visiting as an in-active customer
*/

import { test, expect } from "@playwright/test";
import {
	generateThemeRoute,
	loginAsCustomer,
	enterStorePassword
} from "../../utilities/utils";
import {
	B2B_DEV_URL,
	THEME_ID,
	STORE_PASSWORD,
} from "../../utilities/constants";

const DOM_ELEMENTS = {
	accountMenu: ".site-header-account",
	header: "[data-site-header-main]",
};

test.describe("Site Header", async () => {
	await test("Should show the guest menu", async ({ page }) => {
		const route = generateThemeRoute("", true, B2B_DEV_URL, THEME_ID);
		await enterStorePassword(page, route, STORE_PASSWORD);

		const createAccount = await page.locator(`${DOM_ELEMENTS.header} ${DOM_ELEMENTS.accountMenu} > a`).first();
		await expect(createAccount.getAttribute("href")).not.toBeNull();
		await expect(createAccount).toContainText(/Register/);

		const signIn = await page
			.locator(`${DOM_ELEMENTS.header} ${DOM_ELEMENTS.accountMenu} > a`)
			.last();
		await expect(signIn.getAttribute("href")).not.toBeNull();
		await expect(signIn).toContainText(/Sign in/);
	});

	await test("Should show the customer menu", async ({ page }) => {
    const route = generateThemeRoute("", true, B2B_DEV_URL, THEME_ID);
		await loginAsCustomer(page, "/", route, STORE_PASSWORD);

    await page
			.locator(`${DOM_ELEMENTS.header} ${DOM_ELEMENTS.accountMenu}`).click();
		
		await expect(
			page.locator(
				`${DOM_ELEMENTS.header} ${DOM_ELEMENTS.accountMenu} [data-dropdown-items]`
			)
		).toBeVisible();
      
		const logOut = await page.locator("[data-account-logout]").first();
		await expect(logOut.getAttribute("href")).not.toBeNull();
		await expect(logOut).toContainText(/Sign out/);
	});
});
