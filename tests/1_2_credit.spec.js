import { test, expect } from '@playwright/test';
import * as U from './utils.spec.js';
/**
TESTS
	CREDIT PAGE
	- credit page btn -> to credit page
	- close btn
	- back btn -> to menu
	- img visible
*/

import { isInMenu } from "./1_0_menu.spec";

async function isOnCreditpage(page) {
	await expect(page.locator('img[src*="Credits.png"]')).toBeVisible();
}

async function goToCredits(page) {
	await U.pressBtn(page, "Credits");
	await page.waitForTimeout(1000);
	await isOnCreditpage(page);
}

export async function creditTests(page, name) {
	console.log('--- CREDITS TESTS ---');
	await goToCredits(page);
	await U.pressBtn(page, "CLOSE");
	await goToCredits(page);

	// back/forward
	await page.goBack();
	await isInMenu(page, false, name, '');
	await page.goForward();
	await isOnCreditpage(page);
	await U.pressBtn(page, "CLOSE");
}
