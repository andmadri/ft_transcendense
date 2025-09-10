
import path from 'path';

/**
TESTS

	AVATAR
	- changeAvatar
	- player avatar changed
*/

const avatarPath = path.resolve('./Frontend/src/images/avatar.png');

// DOES NOT WORK YET
async function changeAvatar(page, player, name, avatar) {
	await isInMenu(page, false, name, '');
	await switchPlayerTab(page, player);
	await U.pressLabel(page, 'avatarUpload' + player);
	await page.waitForTimeout(1000);
	await page.setInputFiles('#avatarUpload1', avatarPath);
	await page.waitForTimeout(1000);
	// await page.locator('#playerAvatar' + player).waitFor({ state: 'visible' });
}

export async function avatarTests(page, player, name) {
	await changeAvatar(page, 1, 'avatar1', name);
	await Menu.playerIsLoggedIn(page, 1, name + 'menu');
}