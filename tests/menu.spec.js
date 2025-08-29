import { test, expect } from '@playwright/test';
import * as U from './utils.spec.js';
import path from 'path';

const avatarPath = path.resolve('./Frontend/src/images/avatar.png');

// DOES NOT WORK YET
export async function changeAvatar(page, player, avatar) {
	await isInMenu(page);
	await switchPlayerTab(page, player);
	await U.pressLabel(page, 'avatarUpload' + player);
	await page.waitForTimeout(1000);
	await page.setInputFiles('#avatarUpload1', avatarPath);
	await page.waitForTimeout(1000);
	// await page.locator('#playerAvatar' + player).waitFor({ state: 'visible' });
}

export async function seeCredits(page) {
	await U.pressDiv(page, "Credits");
	await page.waitForTimeout(1000);
	await expect(page.locator('img[src*="Credits.png"]')).toBeVisible();
	await U.pressBtn(page, "CLOSE");
}

export async function playerInOnlineMenu(page, playerName) {
	await expect(
		page.locator('#listOnlinePlayers', { hasText: playerName })
	  ).toBeVisible();
}

export async function switchPlayerTab(page, player) {
	await U.pressBtn(page, "Player " + player);
	await page.waitForTimeout(1000);
}

export async function isInMenu(page) {
	await expect(page.locator('h2', { hasText: 'Menu' })).toBeVisible();
}

export async function playerIsLoggedIn(page, player, name) {
	switchPlayerTab(page, player)
	await expect(page.locator('#playerNameMenu' + player)).toBeVisible();
	const playerNameElement = page.locator('#playerNameMenu' + player);
	await expect(playerNameElement).toHaveText(name);
}
