import * as U from './utils.spec.js';
import * as Login from './0_2_login.spec.js';
import * as Game from './oneVSai.spec.js';
import * as Menu from './1_0_menu.spec.js';
import { time } from 'console';

/*
Tests:
- Check is ball is moving
- Check if both paddles can move with arrow up/down
- ?
*/

export async function addRemotePlayer(browser, URL, name, email, password) {
	const page2 = await U.createNewPage(browser);
	await page2.goto(URL);
	await Login.signup_login_byPlayer(page2, 1, name + 'remote', 'remote' + email, password);
	await page2.waitForTimeout(1000);
	await Menu.isInMenu(page2);
	await Menu.playerIsLoggedIn(page2, 1, name + 'remote');
	return (page2)
}

export async function StartOnlineMode(page) {
	await U.pressBtn(page, "Play game");
	await U.pressBtn(page, "Online");
	await U.pressBtn(page, "PLAY");
}

export async function remotePlayer(page, browser, URL, name, name2, email2, password2) {
	const page2 = await addRemotePlayer(browser, URL, name2, email2, password2);

	// await Menu.playerInOnlineMenu(page, name);
	// await Menu.playerInOnlineMenu(page, name2);

	await StartOnlineMode(page);
	await StartOnlineMode(page2);
}