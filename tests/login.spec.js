import { test, expect } from '@playwright/test';
import * as U from './utils.spec.js';

// 2FA test

export async function switchLoginTab(page, tabName) { // Sign Up or Login
	// await U.pressBtn(page, tabName);
	await page.getByText(tabName).click();
	// await page.waitForTimeout(1000);
}

export async function signup_player(page, player, Name, Email, Password) {
	console.log(`Sign Up ${Name} with ${Email} and ${Password}`);
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
	// await page.waitForTimeout(1000);
}

export async function signup_login_byPlayer(page, player, Name, Email, Password) {
	await signup_player(page, player, Name, Email, Password);
	await login_player(page, player, Email, Password);
}

export async function logoutPlayer(page, player) {
	await switchPlayerTab(page, player);
	await U.pressBtn(page, "logout");
	// await page.waitForTimeout(1000);
	await expect(page.locator('h2', { hasText: 'Login' })).toBeVisible();
}

// Sign up, go back to sign up and do it again
export async function sign_in_tests(page, player, Name, Email, Password) {
	console.log("Sign in player")
	await signup_player(page, player, Name, Email, Password);

	console.log("Switch back to Sign Up")
	await switchLoginTab(page, 'Sign Up');

	// Sign Up again with same email
	const [dialog1] = await Promise.all([
		page.waitForEvent('dialog'),
		await signup_player(page, player, Name, Email, Password),
	]);
	expect(dialog1.message()).toBe('That email is already registered.');
	await dialog1.dismiss()	
	
	// Sign Up with same username
	const [dialog2] = await Promise.all([
	 	page.waitForEvent('dialog'),
	 	await signup_player(page, player, Name, Email + 'extra', Password),
	]);
	expect(dialog2.message()).toBe('That username is already taken.');
	await dialog2.dismiss();
}

export async function login_tests(page, player, Email, Password) {
	console.log("Switch to Login")
	await switchLoginTab(page, 'Login');

	// Incorrect Password
	const [dialog1] = await Promise.all([
		page.waitForEvent('dialog'),
		await login_player(page, player, Email, Password + '1'),
	]);
	expect(dialog1.message()).toBe('Incorrect password');
	await dialog1.dismiss()

	await login_player(page, player, Email, Password)
}
