import { THEME_ID, B2B_DEV_URL, STORE_PASSWORD } from '../../utilities/constants';
import { test, expect } from '@playwright/test';
import {
  generateThemeRoute,
  loginAsCustomer,
  visitTheme,
  waitForPageToFullyRender,
} from "../../utilities/utils";

/*
Feature: Checking the PLP filter
  I want the functionality of the PLP filters

  Scenario: Visiting as a logged in customer
    Given I am on the PLP and all the products display correctly,
    apply different filters and verify top item values.
    Then navigate back using breadcrumbs and action the sorting options.
    Verify the items' order changes.
*/

const route = generateThemeRoute(
  '',
  true,
  B2B_DEV_URL,
  THEME_ID
);

const filterPairs = [
  [{param: 'Brand', value: 'Aurora'}, {param: 'Species', value: 'Indica-Dominant'}],
  [{param: 'Produced in', value: 'Alberta'}, {param: 'Consumption method', value: 'Ingestion'}],
]

let page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await visitTheme(page);
  await loginAsCustomer(page, '', route, STORE_PASSWORD);
  await navigateUsingMenu(page);
});

test.afterAll(async () => await page.close());

filterPairs.forEach(pair => {
  const [first, second] = pair;

  test(`Checking combination of "${first.param}" and "${second.param}":`, async () => {
    await test.step('Select filters', async () => {
      await actionFilters(page, first, second);
    });

    await test.step('Access item full page view and verify values', async () => {
      await page.locator('[data-product-item-trigger]').first().click();
      await readFilteredItem(page, first, second);
    });

    await test.step('Navigate back through breadcrumbs', async () => {
      await navigateUsingBreadcrumbs(page);
    });
  });
});

test('Check sorting tools', async () => {
  let topListItem = '';

  await actionSorting(page, 'title-ascending');
  topListItem = await page.locator('[data-product-item-trigger]').first().textContent();

  await actionSorting(page, 'title-descending');
  expect(page.locator('[data-product-item-trigger]').first()).not.toHaveText(topListItem);
});

const navigateUsingMenu = async (page) => {
  expect(page.getByRole('link', { name: 'Dried', exact: true })).toBeVisible(true);
  await page.getByRole('link', { name: 'Dried', exact: true }).click();

  expect(page.getByRole('link', { name: 'Flower', exact: true })).toBeVisible(true);
  await page.getByRole('link', { name: 'Flower', exact: true }).click();

  expect(page.locator('.collection--title')).toBeVisible(true);
  expect(page.locator('.collection--title')).toContainText('Flower');
}

const actionFilters = async (page, firstFilter, secondFilter) => {
  await page.getByRole('link', { name: firstFilter.value }).click();
  await waitForPageToFullyRender(page, 1000);
  await page.getByRole('link', { name: secondFilter.value }).click();
}

const readFilteredItem = async (page, firstFilter, secondFilter) => {
  expect(page.getByRole('listitem').filter({ hasText: firstFilter.param }))
    .toContainText(firstFilter.value);

  expect(page.getByRole('listitem').filter({ hasText: secondFilter.param }))
    .toContainText(secondFilter.value);
}

const navigateUsingBreadcrumbs = async (page) => {
  const destinationURL = new RegExp('collections/flower');
  const breadcrumb = await page.getByRole('navigation', { name: 'Breadcrumbs' })
    .getByRole('link', { name: 'Flower' });

  expect(breadcrumb).toBeVisible();
  await breadcrumb.click();

  expect(page).toHaveURL(destinationURL);
  expect(page.locator('.collection--title')).toBeVisible(true);
  expect(page.locator('.collection--title')).toContainText('Flower');
}

const actionSorting = async (page, sortValue) => {
  await page.locator('[data-productgrid-sort-open]').click();
  expect(page.locator('[data-productgrid-sort-options]')).toBeVisible();

  await page.locator(`[data-productgrid-sort-value="${sortValue}"]`).click();
  await waitForPageToFullyRender(page, 500);
}
