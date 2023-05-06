/*
Feature: Custom Session Timer flow tests
  I want to test the customer session timer as a user would change between guest and customers states.

  Scenario: Visiting as a guest visiting
    Given I am on the homepage
    There should be a timestamp in local storage

  Scenario: After logging in as a customer
    Given logging in from the homepage
    The pristine should be removed from the timestamp
    And it should be a normal timestamp

  Scenario: A customer logging in with an expired timestamp
    When a customer returns to the shop
    Then the shop should logout the customer and refresh
    And the local storage should be a new pristine timestamp
*/

import { test, expect } from "@playwright/test";
import {
	generateThemeRoute,
	loginAsCustomer,
	visitTheme,
	getLocalStorage,
	clearLocalStorage,
	redirect404Check,
} from "../../utilities/utils";
import {
	B2B_DEV_URL,
	THEME_ID,
	STORE_PASSWORD,
	SESSION_TIMER,
} from "../../utilities/constants";

// Setup constants
const LS_KEY = SESSION_TIMER.key;
const LS_FLAG = SESSION_TIMER.pristineFlag;

test.describe("Customer Session Timer", async () => {
	await test("should set timestamp with a pristine flag", async ({ page }) => {
		await visitTheme(page, "", true);
		await page.waitForTimeout(1000);
		const localStorage = await getLocalStorage(page);
		const result = localStorage[LS_KEY];
		await expect(result).not.toBe(null);
		await expect(result).toContain(LS_FLAG);
	});

    await test("With valid pristine timestamp, should be updated to non-pristine state", async ({
		page,
	}) => {
		const route = generateThemeRoute("", true, B2B_DEV_URL, THEME_ID);
		await loginAsCustomer(page, "/", route, STORE_PASSWORD);
		await page.waitForTimeout(1000);
		const localStorage = await getLocalStorage(page);
		const result = localStorage[LS_KEY];
		await expect(result).not.toBe(null);
		await expect(result).not.toContain(LS_FLAG);
	});
});
