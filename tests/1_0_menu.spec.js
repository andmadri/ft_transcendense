import { test, expect } from '@playwright/test';
import * as U from './utils.spec.js';
import { dashboardTests } from './1_1_dashboard.spec.js';
import { creditTests } from './1_2_credit.spec.js';
import { playerTabsTests } from './1_3_playertabs.spec.js';
import { friendsTests } from './1_4_friends.spec.js';
import { avatarTests } from './1_5_avatar.spec.js';
/*
Tests:
	MENU
	- All elements are there
*/

export async function menuTests(page, name, email, password, name2, email2, password2) {
	await isInMenu(page);
	await playerInOnlineMenu(page, name);


	await U.pressBtn(page, "Dashboard");
	await dashboardTests(page);

	await U.pressBtn(page, "Credits");
	await creditTests(page);

	await playerTabsTests(page, 1, name, email, password, 2, name2, email2, password2);
	await friendsTests(page, name, name2);

	await avatarTests(page, player, 'avatar1');
}

export async function playerInOnlineMenu(page, playerName) {
	await expect(
		page.locator('#listPlayers', { hasText: playerName })
	  ).toBeVisible();
}

export async function switchPlayerTab(page, player) {
	await U.pressBtn(page, "Player " + player);
	await page.waitForTimeout(1000);
}


export async function isInMenu(page) {
	await expect(page.locator('h2', { hasText: 'Menu' })).toBeVisible();
	await expect(page.locator('#menu')).toBeVisible();
	await expect(page.locator('#creditDiv', { hasText: 'Credtis' })).toBeVisible();
	await expect(page.locator('button', { hasText: 'Play Game' })).toBeVisible();
	await expect(page.locator('button', { hasText: 'Tournament' })).toBeVisible();
	await expect(page.locator('button', { hasText: 'Dashboard' })).toBeVisible();

}

export async function playerIsLoggedIn(page, player, name) {
	switchPlayerTab(page, player)
	await expect(page.locator('#playerNameMenu' + player)).toBeVisible();
	const playerNameElement = page.locator('#playerNameMenu' + player);
	await expect(playerNameElement).toHaveText(name);
}
