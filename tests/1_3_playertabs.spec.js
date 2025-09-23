import { test, expect } from '@playwright/test';
import * as U from './utils.spec.js';
import { signup_login_byPlayer } from './0_0_auth.spec.js';
import { isInSignup, sign_in_tests } from './0_1_sign_up.spec.js';
import { login_tests } from './0_2_login.spec.js';

/**
Tests

	PLAYER TABS
	- player stats btn visible
	- player btn logout
	- player logout -> to login
	- player login again
	- player switch tab
	- player 2 sign up / login
	- player 1 and 2 in playerlist (online)
	- player 2 logout
	- player 2 in playerlist (offline)
	- player 2 login again
	- player 1 and 2 in menu
*/



export async function playerTabsTests(page, player1, name1, email1, password1, player2, name2, email2, password2) {
	// LOGIN PLAYER 2:
	await U.pressBtn(page, 'Login');
	await switchLoginTab(page, 'Sign Up');
	await isInSignup(page, 2);
	await signup_player(page, 2, name2, email2, password2);
	await login_player(page, 2, email2, password2);
	await expect(page.locator('#LogoutBtn2')).toBeVisible();
	await expect(page.locator('#dashboardBtn2')).toBeVisible();


}