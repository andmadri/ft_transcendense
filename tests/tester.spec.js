import { test, expect } from '@playwright/test';
import * as U from './utils.spec.js';
import * as Login from './login.spec.js';
import * as Game from './game.spec.js';
import * as Menu from './menu.spec.js';
import * as Remote from './remote.spec.js';
import * as OneVSone from './oneVSone.spec.js';
import * as OneVSai from './oneVSai.spec.js';

const URL = 'https://localhost:8443';

const name = `User${Math.floor(Math.random() * 1000000)}`;
const email = `${name}@codam.com`;
const password = `Hallo123`;
const name2 = `User${Math.floor(Math.random() * 1000000)}`;
const email2 = `${name2}@codam.com`;
const password2 = `Hallo123`;


test('Pong tester', async ({ browser }) => {
	const page = await U.createNewPage(browser);

	// OPEN SITE
	await page.goto(URL);

	// SIGN UP + LOGIN PLAYER 1
	await Login.signup_login_byPlayer(page, 1, name, email, password);
	await Menu.isInMenu(page);
	
	// NAME PLAYER 1 IS VISIBLE IN MENU
	await Menu.playerIsLoggedIn(page, 1, name);

	// await page.waitForTimeout(1000);
	// await Menu.playerInOnlineMenu(page, name);

	// PLAY 1 VS COM AND QUIT
	await OneVSai.StartOneVsCom(page);
	await Game.quitGame(page);

	// await OneVSone.oneVsOne(page, name2, email2, password2);

	// Online Game
	await Remote.remotePlayer(page, browser, URL, name, name2, email2, password2);
	
	// BACK TO MENU
	await page.goto(URL);
	await Menu.isInMenu(page);
});
