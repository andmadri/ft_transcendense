import * as U from './utils.spec.js';
import * as Login from './0_0_auth.spec.js';
import * as Game from './oneVSai.spec.js';
import * as Menu from './1_0_menu.spec.js';
import { time } from 'console';

/*
Tests:
- Check is ball is moving
- Check if both paddles can move with arrow up/down
- ?
*/

export async function addRemotePlayer(browser, URL, name2, email2, password2) {
	const page2 = await U.createNewPage(browser);
	await page2.goto(URL);
	await Login.signup_login_byPlayer(page2, 1, name2 + 're', 're' + email2, password2);
	await Menu.isInMenu(page2, false, name2 + 're', '');
	return (page2)
}

export async function StartOnlineMode(page) {
	await U.pressBtn(page, "Play game");
	await U.pressBtn(page, "vs Online");
	const playBtn = await page.locator('#settingContainer').getByRole('button', { name: 'Play Game' });
	await expect(playBtn).toBeVisible();
	await playBtn.click();
}

export async function remotePlayer(page, browser, URL, name, name2, email2, password2) {
	
	const page2 = await addRemotePlayer(browser, URL, name2, email2, password2);

	await StartOnlineMode(page);
	await StartOnlineMode(page2);
}