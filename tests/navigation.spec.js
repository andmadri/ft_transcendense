import { test, expect } from '@playwright/test';
import * as U from './utils.spec.js';
import * as Login from './0_2_login.spec.js';
import * as Game from './game.spec.js';
import * as Menu from './1_0_menu.spec.js';
import * as Remote from './remote.spec.js';
import * as OneVSone from './oneVSone.spec.js';
import * as OneVSai from './oneVSai.spec.js';
import * as Navigation from './navigation.spec.js'

/*
Tests:
V Forward btn works
V Backward btn works
- Insert also forbdden combinations
- Insert refresh
- ?
*/
export async function navigation(page, name) {
	// we are logged in and in the menu

	await page.goBack(); // should not be possible so stay in menu
	await Menu.isInMenu(page, false, name, '');

	// Go to credit page
	await U.pressDiv(page, "Credits");
	await page.waitForTimeout(1000);

	// Go back to menu
	await page.goBack();
	await Menu.isInMenu(page, false, name, '');

	// Go forward to Credits
	await page.goForward();
	await page.waitForTimeout(1000);
	await expect(page.locator('img[src*="Credits.png"]')).toBeVisible();


	// Go back to menu
	await page.goBack();
	await Menu.isInMenu(page, false, name, '');

	// Start Game
	await U.pressBtn(page, "Play game");
	await U.pressBtn(page, "vs AI");
	const playBtn = await page.locator('#settingContainer').getByRole('button', { name: 'Play Game' });
	await expect(playBtn).toBeVisible();
	await playBtn.click();
	await page.waitForTimeout(3000);

	await U.pressBtn(page, "QUIT");
	await page.waitForTimeout(1000);

	// Go back to menu
	await page.goBack();
	await Menu.isInMenu(page, false, name, '');	

	await page.goForward(); // Should not be possible
	await Menu.isInMenu(page, false, name, '');	
}