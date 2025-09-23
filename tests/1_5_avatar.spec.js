import { isInMenu } from './1_0_menu.spec';
import { test, expect } from '@playwright/test';
import * as U from './utils.spec.js';
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
	await page.waitForTimeout(1000);
	// await page.setInputFiles('#avatarUpload1', avatarPath);
	await page.waitForTimeout(1000);
	// await page.locator('#playerAvatar' + player).waitFor({ state: 'visible' });
}

export async function avatarTests(page, player, name) {
	await changeAvatar(page, 1, name, 'avatar1');
}