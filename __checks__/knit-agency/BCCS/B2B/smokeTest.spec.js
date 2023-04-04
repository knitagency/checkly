import { test, expect } from '@playwright/test';
// Method from the helper class
import { CommandsHelper } from '../../../../support/commandsHelper';

test('Smoke Test B2B', async ({ page }) => {
    // New object for the helper class
    const helper = new CommandsHelper(page);

  // Go to the store URL
  await page.goto('https://bccs-dev-b2b.myshopify.com/password');

  // Login into the store
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('quoddity');

  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page).toHaveURL('https://bccs-dev-b2b.myshopify.com/');

  await page.getByRole('link', { name: 'Sign in' }).click();

  // Check the warning
  await helper.checkWarningMessage(page);

  // Login with a customer
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('Multipass.Customer1@bcldb.com');

  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('MovingForward7!');

  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL('https://bccs-dev-b2b.myshopify.com/');

  // Add items to the cart
  await page.getByRole('link', { name: 'Dried' }).click();
  await page.getByRole('link', { name: 'Flower' }).click();
  await expect(page).toHaveURL('https://bccs-dev-b2b.myshopify.com/collections/flower');

  await page.getByRole('button', { name: 'Quick look' }).click();
  await page.getByRole('button', { name: 'Add to order' }).click();
  await page.getByRole('button', { name: 'Close' }).click();

  await page.locator('article:has-text("TEST TANGERINE DREAM 3.5 g (Case of 24) THC 115.0-165.0mgCBD 5.0-15.0mgSan Rafae")').getByRole('link', { name: 'TEST TANGERINE DREAM' }).click();
  await expect(page).toHaveURL('https://bccs-dev-b2b.myshopify.com/collections/flower/products/tangerine-dream-1?variant=39659098867532');

  await page.getByRole('spinbutton', { name: 'Quantity' }).click();
  await page.getByRole('spinbutton', { name: 'Quantity' }).fill('2');
  await page.getByRole('button', { name: 'Add to order' }).click();

  await page.getByRole('link', { name: '3 View cart' }).click();
  await expect(page).toHaveURL('https://bccs-dev-b2b.myshopify.com/cart');

  await page.getByRole('button', { name: 'Proceed to checkout' }).click();
  await expect(page).toHaveURL('https://bccs-dev-b2b.myshopify.com/702482252/checkouts/b029850066f47f749d2622f6638e0f7f?key=2a4ae40e5716d43f3fbe15fc23961bd3');

  await page.goto('https://bccs-dev-b2b.myshopify.com/702482252/checkouts/b029850066f47f749d2622f6638e0f7f');

  await page.waitForLoadState();

  // Checkout process
  await page.getByRole('button', { name: 'Continue to shipping' }).click();
  await expect(page).toHaveURL('https://bccs-dev-b2b.myshopify.com/702482252/checkouts/b029850066f47f749d2622f6638e0f7f?step=shipping_method');
  await page.getByRole('button', { name: 'Continue to payment' }).click();
  await page.getByRole('link', { name: 'Payment' }).click();
  await page.getByRole('button', { name: 'Complete order' }).click();
  await page.goto('https://bccs-dev-b2b.myshopify.com/702482252/checkouts/b029850066f47f749d2622f6638e0f7f/thank_you');

});