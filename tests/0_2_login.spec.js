import { expect } from '@playwright/test';
import * as U from './utils.spec.js';
import { switchLoginTab } from './0_0_auth.spec.js';
import * as Menu from './1_0_menu.spec.js';

/*
Tests:
	LOGIN
		+ LoginP1 page v
		+ Email / Password / Login btn / Google img / Sign Up link
		+ No Email -> error v
		+ No password -> error v
		+ wrong password -> alert v
		+ wrong email -> alert v
		+ Login btn -> To menu

		+ Login twice -> You are already logged in!
	
	LOGIN WITH 2FA
		+ Login with 2FA -> To menu
		+ Wrong 2FA code -> alert

	GOOGLE
		+ Google login btn
		+ Login -> To menu
		+ What is email already exists? 500 'OAuth login failed.'
*/

export async function login_player(page, player, Email, Password) {
	await page.locator('#email' + player).clear();
	await page.locator('#password' + player).clear();
	await page.fill('#email' + player, Email);
	await page.fill('#password' + player, Password);
	await U.pressBtn(page, "Login");
}

async function waitForAlert(page, player, Email, Password, expectedMessage) {
	const [dialog] = await Promise.all([
		page.waitForEvent('dialog'),
		await login_player(page, player, Email, Password),
	]);
	expect(dialog.message()).toBe(expectedMessage);
	await dialog.dismiss();
}


export async function login_tests(page, player, Email, Password) {
	console.log('--- LOGIN TESTS ---');

	await switchLoginTab(page, 'Login');
	await U.checkHash(page, '#LoginP1');

	// await waitForAlert(page, player, Email, '', 'Please fill in all fields');
	// await waitForAlert(page, player, '', Password, 'Please fill in all fields');

	// Incorrect Password / email
	await waitForAlert(page, player, Email, Password + '1', 'Incorrect password');
	await waitForAlert(page, player, Email + '1', Password, 'User not found' );

	// Correct Login
	await login_player(page, player, Email, Password);

	// Check if in Menu
	await Menu.isInMenu(page);
}
