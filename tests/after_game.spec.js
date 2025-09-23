import { test, expect } from '@playwright/test';
import * as U from './utils.spec.js';

async function afterGameToGameStats(page) {
	await U.pressBtn(page, "Play game");
	await U.pressBtn(page, "vs AI");
	const playBtn = await page.locator('#settingContainer').getByRole('button', { name: 'Play Game' });
	await expect(playBtn).toBeVisible();
	await playBtn.click();

	// Play game
	await page.waitForTimeout(5000);
	await U.pressBtn(page, "QUIT");
	await expect(page.locator('#statsButton')).toBeVisible();
	await page.locator('#statsButton').click();
	await gameStats(page);
}

async function goFromDashboardToGameStats(page) {
	await expect(page.locator('#dashboardBtn1')).toBeVisible();
	await page.locator('#dashboardBtn1').click()
	await page.waitForTimeout(1000);
	let found = false;

	// Not sure how many matches there already are
	for (let i = 1; i <= 100; i++) {
		const locator = page.locator(`#matchInfoFor${i}`);
		if (await locator.count() > 0 && await locator.isVisible()) {
			await locator.click();
			await gameStats(page);
			found = true;
			break;
		}
	}
	expect(found).toBe(true);
}

async function gameStats(page) {
	await expect(page.locator('#statsChart1')).toBeVisible();
	await expect(page.locator('#statsChart2')).toBeVisible();
	await expect(page.locator('#statsChart3')).toBeVisible();
	await expect(page.locator('#statsChart4')).toBeVisible();
	await expect(page.locator('#exitButton')).toBeVisible();
	await page.locator('#exitButton').click();
}

export async function afterGame(page) {
	await afterGameToGameStats(page);
	await goFromDashboardToGameStats(page);
}