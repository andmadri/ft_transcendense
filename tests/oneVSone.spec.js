import { test, expect } from '@playwright/test';
import * as Login from './login.spec.js';
import * as Game from './game.spec.js';
import * as Menu from './menu.spec.js';
import * as U from './utils.spec.js';

export async function StartOneVsOne(page) {
	await U.pressBtn(page, "Play game");
	await U.pressBtn(page, "1 VS 1");
	await U.pressBtn(page, "single game");
	await U.pressBtn(page, "PLAY");
}

export async function oneVsOne(page, name2, email2, password2) {
	await Menu.switchPlayerTab(page, 2);
	await page.getByRole('button', { name: 'login', exact: true }).filter({ hasText: 'login', visible: true }).click();
	
	// BUG
	await page.getByText('Sign Up').click();
	await page.getByText('Sign Up').click();

	await Login.signup_login_byPlayer(page, 2, name2, email2, password2);
	
	await StartOneVsOne(page);
	await page.waitForTimeout(10000);
	await Game.quitGame(page);
}