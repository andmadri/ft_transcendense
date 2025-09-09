import { sign_in_tests, signup_player } from "./0_1_sign_up.spec.js";
import { login_tests, login_player } from "./0_2_login.spec.js";
import * as U from './utils.spec.js';

/*
Tests:
	Sign up
	Login in
	Google
	2FA login
*/

export async function authenticationTests(page, player, Name, Email, Password) {
	// SIGN UP TESTS
	await sign_in_tests(page, player, Name, Email, Password);
	
	// LOGIN TESTS
	await login_tests(page, player, Email, Password);

	// GOOGLE TESTS
	
	// 2FA TESTS

}


// Switch between login tabs (Sign Up / Login)
export async function switchLoginTab(page, tabName) {
	await page.getByText(tabName).click();
}

export async function signup_login_byPlayer(page, player, Name, Email, Password) {
	await signup_player(page, player, Name, Email, Password);
	await login_player(page, player, Email, Password);
}

export async function logoutPlayer(page, player) {
	await switchPlayerTab(page, player);
	await U.pressBtn(page, "logout");
	await expect(page.locator('h2', { hasText: 'Login' })).toBeVisible();
}

export async function waitForAlertDuringAuth(page, player, Name, Email, Password, expectedMessage) {
	const [dialog] = await Promise.all([
		page.waitForEvent('dialog'),
		await signup_player(page, player, Name, Email, Password),
	]);
	expect(dialog.message()).toBe(expectedMessage);
	await dialog.dismiss();
}