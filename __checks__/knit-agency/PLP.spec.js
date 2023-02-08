// @ts-nocheck
import { test, expect } from "@playwright/test";

test("home page has a title", async ({ page }) => {

  // Constants
  const site = process.env.SITE_B2B_URL || "";
  const title = process.env.SITE_BCCS_TITLE || "";
  // We visit the page.
  const response = await page.goto(site);

  // If the page doesn't return a successful response code, we fail the check.
  if (response.status() > 399) {
    throw new Error(`Failed with response code ${response.status()}`);
  }

  // We expect a title "to contain" a substring.
  await expect(page).toHaveTitle(title);

  // Login into the store
  await page.getByRole('link', { name: 'Sign in' }).click();
  await expect(page).toHaveURL('chrome-error://chromewebdata/');
  await page.getByRole('button', { name: 'Advanced' }).click();
  await page.getByPlaceholder('Email address').fill('Multipass.Customer3@bcldb.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('MovingForward7!');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL('https://bccs-dev-b2b.myshopify.com/');
  await page.getByRole('link', { name: 'Dried' }).click();
  await page.getByRole('link', { name: 'Flower' }).click();
  await expect(page).toHaveURL('https://bccs-dev-b2b.myshopify.com/collections/flower');
  await page.getByRole('button', { name: 'Quick look' }).click();
  await page.getByRole('button', { name: 'Add to order' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'Add to order' }).click();
  await page.getByRole('link', { name: '"FREE" (TREASURE ISLAND)' }).first().click();
  await expect(page).toHaveURL('https://bccs-dev-b2b.myshopify.com/collections/flower/products/free?variant=27730176771916');
  await page.getByRole('button', { name: 'Add to order' }).click();
  await page.getByRole('link', { name: '3 View cart' }).click();
  await expect(page).toHaveURL('https://bccs-dev-b2b.myshopify.com/cart');
  await page.getByRole('button', { name: 'Proceed to checkout' }).click();
  await expect(page).toHaveURL('https://bccs-dev-b2b.myshopify.com/702482252/checkouts/e4260b78cc6cd33d38be6fde0205f851?key=826dfe07a6b7b511807b945a4e6d0ad9');
  await page.goto('https://bccs-dev-b2b.myshopify.com/702482252/checkouts/e4260b78cc6cd33d38be6fde0205f851');
  await page.getByRole('button', { name: 'Continue to shipping' }).click();
  await expect(page).toHaveURL('https://bccs-dev-b2b.myshopify.com/702482252/checkouts/e4260b78cc6cd33d38be6fde0205f851?previous_step=contact_information&step=shipping_method');
  await page.getByRole('button', { name: 'Continue to payment' }).click();

  // We snap a screenshot.
  await page.screenshot({ path: "screenshots/screenshot.jpg" });
  // We close the page to clean up and gather performance metrics.
  await page.close();
});
