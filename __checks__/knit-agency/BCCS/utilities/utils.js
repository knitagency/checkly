import { expect } from "@playwright/test";
import { PASSWORD, USER, STORE_PASSWORD } from "./constants";
/*
  Insert a query Param into URL
  {param} string key to append to url
  {param} string value value of appended key
  {param} string url to append string to
  {return} string
*/
const insertParam = (key, value, url) => {
	const newUrl = new URL(url);
	newUrl.searchParams.append(key, value);
	return newUrl.href;
};

/*
  Generate URL string for Cypress
  {param} string path to visit for cypress
  {param} boolean viewPreviewTheme adds preview params
  {return} string
*/

// currently passing in baseurl
const generateThemeRoute = (path = "", viewPreviewTheme, baseUrl, themeID) => {
	// let baseURL = `${Cypress.config('baseUrl') + path}`;

	if (viewPreviewTheme) {
		baseUrl = insertParam("preview_theme_id", themeID, baseUrl);
	}

	return baseUrl;
};

const redirect404Check = async (page, url) => {
	// Visit a collection page
	const route = generateThemeRoute(
		"",
		true,
		"https://bccs-dev-b2b.myshopify.com/",
		"124589967180"
	);
	await enterStorePassword(page, route, STORE_PASSWORD);
	await visitTheme(page, url);

	// Ensure 404 is visible
	await expect(page.locator(".site-main .fourohfour-title")).toBeVisible();
};

// Visit Theme
const visitTheme = async (page, path = "", bypassPassword = false) => {
	const route = generateThemeRoute(
		"",
		false,
		"https://bccs-dev-b2b.myshopify.com"
	);

	if (bypassPassword) {
		await enterStorePassword(page, route, STORE_PASSWORD);
	} else {
		await page.goto(`${route}${path}`);
	}
};

const enterStorePassword = async (page, url) => {
	await page.goto(url);
	await page.getByLabel("Password").click();
	await page.getByLabel("Password").fill(STORE_PASSWORD);
	await page.getByRole("button", { name: "Submit" }).click();
};

// login as customer (hard coded at the moment) need to figure out best way to get email & password
const loginAsCustomer = async (page, path = "", url, storePassword) => {
	if (storePassword) {
		await enterStorePassword(page, url, storePassword);
	}

	await page.getByRole("link", { name: "Sign in" }).click();
	await page.getByRole("button", { name: "Advanced" }).click();
	await page.locator("#proceed-link").click();
	await page.getByPlaceholder("Email address").fill(USER);
	await page.waitForTimeout(2000);
	await page.getByPlaceholder("Password").fill(PASSWORD);
	await page.getByRole("button", { name: "Login" }).click();
};

/*
  Preform a product search from the Header.
*/

const headerSearch = async (page, query) => {
	await page.getByPlaceholder("What are you looking for?").click();
	await page.getByPlaceholder("What are you looking for?").fill(query);
	await page.getByRole("link", { name: "View all results" }).click();
};

/**
 * A command that accepts a list and adds all the items in the list to the cart by navigating to the PDP from the header search
 *
 * @param {Object[]} cartList - Accepts an array of objects containing query and quantity
 * @param {string} cartList[].query - Accepts any string for header search.
 * @param {number} cartList[].quantity - number you want added to cart.
 */

const AddProductsFromHeaderSearch = async (page, cartList = []) => {
	/**
	 * Loops through cartList array and enters the query into the search bar
	 * Click the first available item that matches query, navigate to PDP, update quantity and add to cart
	 */
	for (let index = 0; index < cartList.length; index++) {
		await page.getByPlaceholder("What are you looking for?").click();
		await page.waitForTimeout(1500);
		await page
			.getByPlaceholder("What are you looking for?")
			.fill(cartList[index].query);
		await page.waitForSelector(".search-flydown", { timeout: 5000 });
		await expect(page.locator(".search-flydown").first()).toBeVisible(true);
		await page.waitForSelector(".search-flydown--results", { timeout: 5000 });
		await expect(page.locator(".search-flydown--results")).toBeVisible(true);
		await page.locator(".productlist--item a").first().click();
		await page
			.locator(".form-field--qty-input input")
			.fill(cartList[index].quantity);
		await page
			.getByRole("button", { name: "Add to order" })
			.click({ timeout: 5000 });
	}
};

const proceedToCart = async (page) => {
	await page.locator(".site-navigation .site-header-cart--button").click();
};

const proceedToCheckout = async (page) => {
	await page.locator(".site-navigation .site-header-cart--button").click();
	// Wait for checkout button to be enabled
	await page.waitForSelector('.button-primary[name="checkout"]', {
		timeout: 5000,
	});
	await page.getByRole("button", { name: "Proceed to checkout" }).click();
};

const informationStep = async (page) => {
	// Wait for page for load before doing any further checks
	await page.waitForSelector('.step[data-step="contact_information"]', {
		timeout: 20000,
	});
	// check if shipping address is not empty
	const shippingInformation = await page.locator(
		'.step[data-step="contact_information"] .section[data-checkout-address] .field__input'
	);
	const shippingValue = await shippingInformation.getAttribute("value");
	await expect(shippingValue).not.toBe("");
	await page.locator("#continue_button").first().click();
};

const shippingStep = async (page) => {
	// Wait for page for load before doing any further checks
	await page.waitForSelector('.step[data-step="shipping_method"]', {
		timeout: 20000,
	});
	const shippingMethod = await page.locator(
		".step__sections .radio__input .input-radio"
	);
	await expect(
		page.locator(".step__sections .radio__input .input-radio")
	).toBeVisible(true);
	const shippingMethodValue = await shippingMethod.getAttribute("value");
	await expect(shippingMethodValue).not.toBe("");
	await page.locator("#continue_button").first().click();
};

const paymentStep = async (page) => {
	// Wait for page for load before doing any further checks
	await page.waitForSelector('.step[data-step="payment_method"]', {
		timeout: 20000,
	});
	const paymentInputs = await page.$$(
		".step__sections .ldb__billing-confirmation .field__input"
	);
	await expect(paymentInputs.length).toBeGreaterThan(0);
	for (const input of paymentInputs) {
		const inputValue = await input.getAttribute("value");
		await expect(inputValue).not.toBe("");
	}
	await page.locator("#continue_button").first().click();
};

const checkThankYouStep = async (page) => {
	// Wait for page for load before doing any further checks
	await page.waitForSelector('.step[data-step="thank_you"]', {
		timeout: 20000,
	});
	await expect(page.locator(".step[data-step='thank_you']")).toBeVisible(true);
};

const removeDollarSign = (string) => {
	return string.replace("$", "");
};

/**
 * Returns local storage
 */
const getLocalStorage = async (page) => {
	return await page.evaluate(() => window.localStorage);
};

const clearLocalStorage = async (page) => {
	await page.evaluate(() => window.localStorage.clear());
}

// B2C functions that need to be converted
// Cypress.Commands.add('fillOutShippingStep', () => {
//   const actions = [
//     ['#checkout_email', chance.email({ domain: 'gmail.com' })],
//     ['#checkout_shipping_address_first_name', chance.first()],
//     ['#checkout_shipping_address_last_name', chance.last()],
//     ['#checkout_shipping_address_address1', chance.address()],
//     ['#checkout_shipping_address_city', chance.city()],
//     ['#checkout_shipping_address_zip', 'V1A 2B3'] // Requires BC Postal. Not an option from Chance
//   ];

//   actions.map(([id, value]) => {
//     console.log(value, 'VALUE');
//     cy.get(id).type(value, { force: true });
//   });
// });

// Cypress.Commands.add('fillOutPaymentStep', () => {
//   const actions = [
//     ['[data-card-fields="number"] iframe', '#number', '4030000010001234'],
//     ['[data-card-fields="name"] iframe', '#name', chance.name()],
//     ['[data-card-fields="expiry"] iframe', '#expiry', '0130'],
//     [
//       '[data-card-fields="verification_value"] iframe',
//       '#verification_value',
//       '123'
//     ]
//   ];

//   actions.map(([iframe, id, value]) => {
//     getIframeBody(iframe).find(id).type(value);
//   });
// });

const waitForPageToFullyRender = async (page, timeout, message = '') => {
	return page.waitForTimeout(timeout);
}

export {
	insertParam,
	generateThemeRoute,
	visitTheme,
	loginAsCustomer,
	headerSearch,
	AddProductsFromHeaderSearch,
	proceedToCheckout,
	informationStep,
	shippingStep,
	paymentStep,
	checkThankYouStep,
	enterStorePassword,
	redirect404Check,
	removeDollarSign,
	proceedToCart,
	getLocalStorage,
	clearLocalStorage,
	waitForPageToFullyRender
};
