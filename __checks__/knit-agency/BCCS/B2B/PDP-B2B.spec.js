import { test, expect } from '@playwright/test';
// Method from the helper class
import { CommandsHelper } from '../../../../support/commandsHelper';

test('Check PDP - B2B', async ({ page }) => {
  // New object for the helper class
  const helper = new CommandsHelper(page);

  // Go to the store URL
  await helper.gotoBCCSUrl();

  // Login as a customer
  await helper.loginInTheStore();

  await helper.gotoBCCSUrl();

  // Go to the PDP
  await page.getByRole('link', { name: 'Inhalable extracts' }).click();
  await page.getByRole('link', { name: 'Vape kits & cartridges' }).click();
  await expect(page).toHaveURL('https://bccs-dev-b2b.myshopify.com/collections/vape-kits-cartridges');
  await page.getByRole('link', { name: 'TEST BLUEBERRY KIT' }).click();
  await expect(page).toHaveURL('https://bccs-dev-b2b.myshopify.com/collections/vape-kits-cartridges/products/blueberry-kit?variant=31149808060236');
  await page.locator('main[role="main"]:has-text("Home Vape kits & Cartridges TEST BLUEBERRY KIT Hybrid TEST BLUEBERRY KIT by PHYT")').isVisible()
  
  // Check sections from the PDP
  await page.getByRole('navigation', { name: 'Breadcrumbs' }).isVisible()
  await page.getByText('Hybrid TEST BLUEBERRY KIT by PHYTO THC 700.0-800.0mg/g CBD 0.0mg/g Current price').click();
  await page.getByText('by PHYTO').isVisible()
  await page.getByText('THC 700.0-800.0mg/g').isVisible()
  await page.getByText('CBD 0.0mg/g').isVisible()
  await page.locator('.product-pricing').isVisible()
  await page.locator('#product_form_4350122264396').getByText('SKU 1017250').isVisible()
  await page.getByText('2g cannabis per unit').isVisible()
  await page.getByText('Product detailsIngredients Phyto Extractions’ complete vape kit includes a stand').isVisible()
  await page.getByText('Related products SATIVA STARTER PACK (STRAWBERRY ICE) by Kolab THC 382.0-518.0mg').isVisible()
  await page.locator('section[role="contentinfo"]:has-text("Main menu Home Catalog Footer menu Account Customer Service Contact Us Customer ")').isVisible()
  await page.getByText('Hybrid').isVisible()

  // Add item and check product selector
  await page.getByRole('spinbutton', { name: 'Quantity' }).click();
  await page.getByRole('spinbutton', { name: 'Quantity' }).fill('5');
  await page.locator('section:has-text("Hybrid TEST BLUEBERRY KIT by PHYTO THC 700.0-800.0mg/g CBD 0.0mg/g Current price")').click();
  await page.getByRole('button', { name: 'Add to order' }).click();
  await page.locator('div:has-text("Item added to order")').isVisible()

});