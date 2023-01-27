// @ts-nocheck
import { test, expect } from "@playwright/test";

test("home page has a title", async ({ page }) => {
  // Constants
  const site = process.env.SITE_URL || "";
  const title = process.env.SITE_TITLE || "";
  // We visit the page.
  const response = await page.goto(site);
  // We expect a title "to contain" a substring.
  await expect(page).toHaveTitle(title);
  // If the page doesn't return a successful response code, we fail the check.
  if (response.status() > 399) {
    throw new Error(`Failed with response code ${response.status()}`);
  }
  // We snap a screenshot.
  await page.screenshot({ path: "screenshots/screenshot.jpg" });
  // We close the page to clean up and gather performance metrics.
  await page.close();
});
