import { test, expect } from "@playwright/test";
import {
	generateThemeRoute,
	loginAsCustomer,
    visitTheme,
    redirect404Check
} from "../../utilities/utils";

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

const pageURL = '/collections/flower';

test.describe("Smoke test, PDP", () => {
    test("For Guests, page should be a 404", async ({ page }) => {
        await redirect404Check(page, pageURL);
	});

	test("Should Have the Product Content Visible", async ({ page }) => {
		const route = generateThemeRoute(
			"",
			true,
			"https://bccs-dev-b2b.myshopify.com/",
			"124589967180"
		);
		await loginAsCustomer(page, "/", route, "quoddity");
        await visitTheme(page, pageURL)

        // Check PLP elements are visible
        await expect(page.locator('.breadcrumbs-container')).toBeVisible();
        await expect(page.locator('.site-main .collection--image')).toBeVisible();
        await expect(page.locator('.productgrid--sidebar-section')).toBeVisible();
        await expect(page.locator('.productlistitem').first()).toBeVisible();
	});
});
