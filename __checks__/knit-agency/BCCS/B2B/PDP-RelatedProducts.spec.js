import { expect, test } from '@playwright/test';
// Method from the helper class
import { CommandsHelper } from '../../../../support/commandsHelper';

test('PDP Related Products B2B', async ({ page }) => {
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

  // Go to the PDP
  await page.getByRole('link', { name: 'Dried' }).click();
  await page.getByRole('link', { name: 'Flower' }).click();
  await expect(page).toHaveURL('https://bccs-dev-b2b.myshopify.com/collections/flower');
  await page.locator('article:has-text("SENSI STAR TEST123 1 g (Case of 12) THC 140.0-190.0mg/gCBD 0.0-10.0mg/gNamaste10")').getByRole('link', { name: 'SENSI STAR TEST123' }).click();

  // Check Related products 
  await page.getByRole('heading', { name: 'Related products' }).isVisible();
  await page.getByText('Related products ALIEN DAWG - 1G (ALIENDAWG) by CANACA THC 15-20% CBD 0-1% Curre').isVisible();
  await page.locator('div:has-text("ALIEN DAWG - 1G (ALIENDAWG) by CANACA THC 15-20% CBD 0-1% Current price $796.95 ")').nth(2).isVisible();

});