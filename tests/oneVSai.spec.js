import { test, expect } from '@playwright/test';
import * as U from './utils.spec.js';
import * as Menu from './1_0_menu.spec.js'

/*
Tests:
- Check is ball is moving
- Check if paddle ai is moving
- Check if own paddle can move with arrow up/down
- ?
*/
export async function StartOneVsCom(page, name) {
	console.log('--- ONE VS COM TESTS ---');
	await U.pressBtn(page, "Play game");
	await U.pressBtn(page, "vs AI");
	const playBtn = await page.locator('#settingContainer').getByRole('button', { name: 'Play Game' });
	await expect(playBtn).toBeVisible();
	await playBtn.click();
	await page.waitForTimeout(3000);

	await U.pressBtn(page, "QUIT");
	await page.waitForTimeout(1000);

	await U.pressBtn(page, 'BACK TO MENU');
	await Menu.isInMenu(page, false, name, '');
}
