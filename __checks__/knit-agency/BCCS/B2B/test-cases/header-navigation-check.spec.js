/**
 * Tests the desktop + mobile header navigation to see if the menu + submenu's open and are visible
 */

import { test, expect } from "@playwright/test";
import { generateThemeRoute, loginAsCustomer } from "../../utilities/utils";
import {
	B2B_DEV_URL,
	THEME_ID,
	STORE_PASSWORD,
} from "../../utilities/constants";

const DOM_ELEMENTS = {
	desktopMenuItems:
		".site-navigation [aria-label='Main Menu'] .navmenu-item-parent",
	mobileMenuItems: ".mobile-nav-content > .navmenu > [data-navmenu-trigger]",
	mobileMenuToggle: ".site-header-menu-toggle--button",
	subMenu: ".navmenu-submenu",
	subMenuTrigger: "[data-navmenu-trigger]",
	subMenuList: "[data-navmenu-submenu]",
};

// Utility to check submenu visibility
const checkSubMenus = async (menuItem, scrollIntoView = false) => {
	await menuItem.click();

	if (scrollIntoView) {
		await menuItem.scrollIntoViewIfNeeded();
	}

	await expect(menuItem.locator(DOM_ELEMENTS.subMenuList)).toBeVisible();
};

test("Header Navigation Check", async ({ page }) => {
	await test.step("login", async () => {
		const route = generateThemeRoute("", true, B2B_DEV_URL, THEME_ID);
		await loginAsCustomer(page, "/", route, STORE_PASSWORD);
	});

	// Check Desktop Menu
	await test.step("Ensures desktop header menu dropdown and submenus are visible on click", async () => {
		const headerMenuItems = await page
			.locator(DOM_ELEMENTS.desktopMenuItems)
			.all();
		for (const menuItem of headerMenuItems) {
			await menuItem.click();
			await expect(
				menuItem.locator(DOM_ELEMENTS.subMenu).first()
			).toBeVisible();

			// Check submenu
			for (const subMenu of await menuItem
				.locator(DOM_ELEMENTS.subMenuTrigger)
				.all()) {
				await checkSubMenus(subMenu);
			}
		}
	});

	// Check Mobile Menu
	await test.step("Ensures mobile header menu dropdowns and submenus are visible on click", async () => {
		await page.setViewportSize({ width: 400, height: 600 });
		await page.locator(DOM_ELEMENTS.mobileMenuToggle).click();

		const mobileHeaderMenuItem = await page
			.locator(DOM_ELEMENTS.mobileMenuItems)
			.all();
		for (const menuItem of mobileHeaderMenuItem) {
			await menuItem.click();
			await expect(
				menuItem.locator(DOM_ELEMENTS.subMenu).first()
			).toBeVisible();

			// Check submenu
			for (const subMenu of await menuItem
				.locator(DOM_ELEMENTS.subMenuTrigger)
				.all()) {
				await checkSubMenus(subMenu, true);
			}
		}
	});
});
