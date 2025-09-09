import { test, expect } from '@playwright/test';
import * as U from './utils.spec.js';
import * as Menu from './1_0_menu.spec.js';
/**
Tests:

	DASHBOARD
	- dashboard page
	- all elements there
	- update after match
	- close btn
	- back btn
	- Click match

*/

export async function dashboardTests(page) {
	
	await U.checkHash(page, '#Dashboard');
	await expect(page.locator('h2', { hasText: 'Dashboard' })).toBeVisible();
	await expect(page.locator('#playerStats1')).toBeVisible();
	await expect(page.locator('#playerStats2')).toBeVisible();
	await expect(page.locator('#matchHistory')).toBeVisible();
	await expect(page.locator('#closeDashboard')).toBeVisible();
	await expect(page.locator('#backToMenuFromDashboard')).toBeVisible();
	await expect(page.locator('#match1')).toBeVisible();

	// Click match if mathc...
	await U.pressDiv(page, "match1");
	await page.waitForTimeout(1000);
	await U.checkHash(page, '#Match/1');

	// Go back to dashboard
	await U.pressBtn(page, "CLOSE");
	await page.waitForTimeout(1000);
	await U.checkHash(page, '#Dashboard');

	// Close dashboard
	await U.pressBtn(page, "CLOSE");
	await page.waitForTimeout(1000);
	await U.checkHash(page, '#Menu');
}