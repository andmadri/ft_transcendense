import { test, expect } from '@playwright/test';
import * as Login from './login.spec.js';
import * as Game from './oneVSai.spec.js';
import * as Menu from './menu.spec.js';
import * as U from './utils.spec.js';

export async function StartOneVsOne(page) {
	await U.pressBtn(page, "Play game");
	await U.pressBtn(page, "1 VS 1");
	await U.pressBtn(page, "single game");
	await U.pressBtn(page, "PLAY");
}

export async function oneVsOne(page, name2, email2, password2) {
	await StartOneVsOne(page);
	await Login.signup_login_byPlayer(page, 1, name2, email2, password2);
	await StartOneVsOne(page);
	await page.waitForTimeout(1000);
	await Game.quitGame(page);
}