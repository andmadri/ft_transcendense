import { test, expect } from '@playwright/test';
import * as U from './utils.spec.js';

// 2FA test
// Sign up with an existing email
// Login in when player is already logged in
// ?


export async function switchLoginTab(page, tabName) { // Sign Up or Login
	await U.pressBtn(page, tabName);
	await page.waitForTimeout(1000);
}

export async function signup_player(page, player, Name, Email, Password) {
	await page.fill('#name' + player, Name);
	await page.fill('#email' + player, Email);
	await page.fill('#password' + player, Password);
	await U.pressBtn(page, "Sign Up");
	await page.waitForTimeout(1000);
}

export async function login_player(page, player, Email, Password) {
	await page.fill('#email' + player, Email);
	await page.fill('#password' + player, Password);
	await U.pressBtn(page, "Login");
	await page.waitForTimeout(1000);
}

export async function signup_login_byPlayer(page, player, Name, Email, Password) {
	await signup_player(page, player, Name, Email, Password);
	await login_player(page, player, Email, Password);
}

export async function logoutPlayer(page, player) {
	await switchPlayerTab(page, player);
	await U.pressBtn(page, "logout");
	await page.waitForTimeout(1000);
	await expect(page.locator('h2', { hasText: 'Login' })).toBeVisible();
}
