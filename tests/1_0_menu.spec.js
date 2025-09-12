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
	console.log('--- MENU TESTS ---');
	await isInMenu(page, false, name, '');
	// await playerInOnlineMenu(page, name);

	await dashboardTests(page);

	await creditTests(page, name);

	await friendsTests(page, name, name2);

	await avatarTests(page, 1, name, 'avatar1');
}

export async function playerInOnlineMenu(page, playerName) {
	await expect(
		page.locator('#listPlayers', { hasText: playerName })
	 ).toBeVisible();
}

export async function switchPlayerTab(page, player) {
	await U.pressBtn(page, player);
	await page.waitForTimeout(1000);
}


export async function isInMenu(page, player2, name, name2) {
	// blocks
	await expect(page.locator('#menu')).toBeVisible();
	// await expect(page.locator('#players')).toBeVisible();
	// await expect(page.locator('#friends_list')).toBeVisible();

	// player 1
	await expect(page.locator(`#userNameMenu1`, { hasText: name })).toBeVisible();
	await expect(page.locator('#dashboardBtn1')).toBeVisible();
	await expect(page.locator('#notificationBtn')).toBeVisible();
	await expect(page.locator('#userStats1', {hasText: 'W: '})).toBeVisible();
	await expect(page.locator('button', { hasText: 'Set Up 2FA' })).toBeVisible();	
	await expect(page.locator('button', { hasText: 'Change Avatar' })).toBeVisible();
	await expect(page.locator('#LogoutBtn1', { hasText: 'Logout' })).toBeVisible();
	await expect(page.locator('#avatar1')).toBeVisible();

	// player2
	await expect(page.locator('#avatar2')).toBeVisible();
	if (player2 == false) {
		await expect(page.locator(`#userNameMenu2`, { hasText: 'Guest' })).toBeVisible();
		await expect(page.locator('button', { hasText: 'Login' })).toBeVisible();
	} else {
		await expect(page.locator(`#userNameMenu2`, { hasText: name2 })).toBeVisible();
		await expect(page.locator('#userStats2', {hasText: 'W: '})).toBeVisible();
		await expect(page.locator('#LogoutBtn2', { hasText: 'Logout' })).toBeVisible();
	}

	// bts bottom
	await expect(page.locator('button', { hasText: 'Credits' })).toBeVisible();
	await expect(page.locator('button', { hasText: 'Play Game' })).toBeVisible();
	await expect(page.locator('button', { hasText: 'Tournament' })).toBeVisible();
}

export async function playerIsLoggedIn(page, player, name) {
	await switchPlayerTab(page, player)
	await expect(page.locator('#playerNameMenu' + player)).toBeVisible();
	const playerNameElement = page.locator('#playerNameMenu' + player);
	await expect(playerNameElement).toHaveText(name);
}
