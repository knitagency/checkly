import { test, expect } from '@playwright/test';
// Method from the helper class
import { CommandsHelper } from '../../../../support/commandsHelper';

test('PLP Check B2B', async ({ page }) => {
  // New object for the helper class
  const helper = new CommandsHelper(page);

  // Go to the store URL
  await page.goto('https://bccs-dev-b2b.myshopify.com');

  await page.waitForLoadState();

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

  // Go to the PLP
  await page.getByRole('link', { name: 'Dried' }).click();
  await page.getByRole('link', { name: 'Flower' }).click();
  await expect(page).toHaveURL('https://bccs-dev-b2b.myshopify.com/collections/flower');
  
  // Check sections of the PLP
  await page.locator('main[role="main"]:has-text("Filters Brand 123QWEST 7ACRES Acreage Pharms AltaVie Aurora Broken Coast Cannabi")').isVisible()
  await page.locator('div:has-text("Flower Filters Sort by Featured Price: Low to High Price: High to Low A-Z Z-A Ol")').nth(3).isVisible()
  await page.getByText('Home Flower Flower Filters Sort by Featured Price: Low to High Price: High to Lo').isVisible()
  await page.getByText('Flower Filters Sort by Featured Price: Low to High Price: High to Low A-Z Z-A Ol').isVisible()
  await page.getByText('Filters Brand 123QWEST 7ACRES Acreage Pharms AltaVie Aurora Broken Coast Cannabi').isVisible()
  await expect(page).toHaveURL('https://bccs-dev-b2b.myshopify.com/collections/flower/cbd_per_retail_unit-cbd-less-than-30mg');
  await page.getByRole('list', { name: 'Main Menu' }).isVisible()
  await page.locator('section[role="contentinfo"]:has-text("Main menu Home Catalog Footer menu Account Customer Service Contact Us Customer ")').isVisible()
  
  // Check left filter
  await page.getByRole('link', { name: 'San Rafael \'71' }).click();
  await expect(page).toHaveURL('https://bccs-dev-b2b.myshopify.com/collections/flower/cbd_per_retail_unit-cbd-less-than-30mg+brand-san-rafael-71');
  await page.getByText('TEST TANGERINE DREAM 1 g (Case of 48) THC 115.0-165.0mgCBD 5.0-15.0mgSan Rafael').click();
  
  // Check filter order by price
  await page.locator('span:has-text("Popularity") path').click();
  await page.getByRole('link', { name: 'Price: High to Low' }).click();
  await expect(page).toHaveURL('https://bccs-dev-b2b.myshopify.com/collections/flower/cbd_per_retail_unit-cbd-less-than-30mg+brand-san-rafael-71?sort_by=price-descending');

});