/*
Feature: Smoke test Product Listing Page (PLP)
  I want to test that the PLP renders

  Scenario: Visiting as a guest visiting
    Given I am on the PLP
    The content should be hidden as a guest

  Scenario: Visiting as a logged in customer
    Given that I am on the PLP
    All the content should be visible
*/

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

const pageURL = "/collections/flower";
const DOM_ELEMENTS = {
	breadcrumbContainer: ".breadcrumbs-container",
	collectionImage: ".site-main .collection--image",
	sidebar: ".productgrid--sidebar-section",
	listItem: ".productlistitem",
};

test.describe("Smoke test, PDP", () => {
	test("For Guests, page should be a 404", async ({ page }) => {
		await redirect404Check(page, pageURL);
	});

	test("Should Have the Product Content Visible", async ({ page }) => {
		const route = generateThemeRoute("", true, B2B_DEV_URL, THEME_ID);
		await loginAsCustomer(page, "/", route, STORE_PASSWORD);
		await visitTheme(page, pageURL);

		// Check PLP elements are visible
		await expect(page.locator(DOM_ELEMENTS.breadcrumbContainer)).toBeVisible();
		await expect(page.locator(DOM_ELEMENTS.collectionImage)).toBeVisible();
		await expect(page.locator(DOM_ELEMENTS.sidebar)).toBeVisible();
		await expect(page.locator(DOM_ELEMENTS.listItem).first()).toBeVisible();
	});
});
