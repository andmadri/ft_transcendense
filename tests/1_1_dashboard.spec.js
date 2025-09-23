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

export async function isOnDashboardPage(page) {
	await expect(page.locator('#dashboardBtn1')).toBeVisible();
	await page.locator('#dashboardBtn1').click()
	await page.waitForTimeout(1000);
	await U.checkHash(page, '#Dashboard?userId=');
	await expect(page.locator('#userInfoCard')).toBeVisible();
	await expect(page.locator('#statsCard')).toBeVisible();
	await expect(page.locator('#dashboardTitle')).toBeVisible();
	await expect(page.locator('#PlayerGameTime')).toBeVisible();
	await expect(page.locator('#PlayerGameTime')).toBeVisible();
	await expect(page.locator('#exitButton')).toBeVisible();
	await page.locator('#exitButton').click();
}

export async function dashboardTests(page) {
	await isOnDashboardPage(page);
}