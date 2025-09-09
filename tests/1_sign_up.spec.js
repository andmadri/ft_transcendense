import { test, expect } from '@playwright/test';
import * as U from './utils.spec.js';
import { switchLoginTab } from './0_auth.spec.js';
import * as Login from './2_login.spec.js';
import * as Game from './game.spec.js';
import * as Menu from './menu.spec.js';
import * as Remote from './remote.spec.js';
import * as OneVSone from './oneVSone.spec.js';
import * as OneVSai from './oneVSai.spec.js';
import * as Navigation from './navigation.spec.js'
/*
Tests:
	SIGNUP
		+ LoginP1 page v
		+ Username / Email / Password / Sign Up btn / Google img / Login link (Everything visible)
		+ No username v
		+ No Email v
		+ No password v
		+ wrong username v
		+ wrong password v
		+ wrong email v
		+ already exist username v
		+ already exist email v
		+ Sign up btn -> To login

	GOOGLE
		+ Google login btn
		+ Login -> To menu
		+ What is email already exists?
*/

async function isInSignup(page, player) {
	await expect(page.locator('#header1TextAuth', { hasText: 'SIGN UP' })).toBeVisible();
	await expect(page.locator('#name' + player)).toBeVisible();
	await expect(page.locator('#email' + player)).toBeVisible();
	await expect(page.locator('#password' + player)).toBeVisible();
	await expect(page.getByRole('button', { name: 'Sign Up' })).toBeVisible();
	await expect(page.locator('img[alt="GoogleLogin"]')).toBeVisible();
	await expect(page.getByText('Login')).toBeVisible();
}

export async function signup_player(page, player, Name, Email, Password) {
	console.log(`Sign Up ${Name} with ${Email} and ${Password}`);
	await page.locator('#name' + player).clear();
	await page.locator('#email' + player).clear();
	await page.locator('#password' + player).clear();
	await page.fill('#name' + player, Name);
	await page.fill('#email' + player, Email);
	await page.fill('#password' + player, Password);

	await U.pressBtn(page, "Sign Up");
	await page.waitForTimeout(1000);
}

async function waitForAlert(page, player, Name, Email, Password, expectedMessage) {
	const [dialog] = await Promise.all([
		page.waitForEvent('dialog'),
		await signup_player(page, player, Name, Email, Password)
	]);
	expect(dialog.message()).toBe(expectedMessage);
	await dialog.dismiss();
}

// Sign up, go back to sign up and do it again
export async function sign_in_tests(page, player, Name, Email, Password) {
	console.log('--- SIGN UP TESTS ---');

	await U.checkHash(page, '#LoginP1');
	await isInSignup(page, player);

	// Missing fields
	// await waitForAlert(page, player, '', Email, Password, 'Please fill in all required fields');
	// await waitForAlert(page, player, Name, '', Password, 'Please fill in all required fields');
	// await waitForAlert(page, player, Name, Email, '', 'Please fill in all required fields');

	// Wrong name inputs
	await waitForAlert(page, player, 'ARealyLongNameIsNotAllowedWhenLongerThan30', Email, Password, 'Name is too long (min 30 characters)');
	// await waitForAlert(page, player, '    ', Email, Password, 'Name can not be empty');
	await waitForAlert(page, player, Name + '*', Email, Password, "Only letters, numbers, spaces, '-' and '_' are allowed.");
	
	// Wrong email inputs
	// await waitForAlert(page, player, Name, '   ', Password, 'Email can not be empty');
	// await waitForAlert(page, player, Name, 'NoValidMail', Password, 'Email has no @ and dot or forbidden characters');
	await waitForAlert(page, player, Name, 'a@b', Password, 'Email has no @ and dot or forbidden characters');
	// await waitForAlert(page, player, Name, 'a@.', Password, 'Email is too short');
	await waitForAlert(page, player, Name, 'a'.repeat(255) + '@example.com', Password, 'Email is too long');

	// Wrong password inputs
	await waitForAlert(page, player, Name, Email, '123', 'Password has less than 8 characters');
	// await waitForAlert(page, player, Name, Email, '    ', 'Password can not be empty');
	await waitForAlert(page, player, Name, Email, 'p'.repeat(65), 'Password is too long');	
	await waitForAlert(page, player, Name, Email, 'pass word', 'Password contains whitespace');

	// Sign Up successfully
	await signup_player(page, player, Name, Email, Password);

	// Go back to Sign Up
	await switchLoginTab(page, 'Sign Up');

	// Sign up with existing email / username
	await waitForAlert(page, player, Name, Email, Password, 'That email is already registered.');
	await waitForAlert(page, player, Name, 'extra' + Email, Password, 'That username is already taken.');
}