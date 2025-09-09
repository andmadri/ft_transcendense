import { test, expect } from '@playwright/test';
import * as U from './utils.spec.js';
import { authenticationTests } from './0_auth.spec.js';
import * as Game from './game.spec.js';
import * as Menu from './menu.spec.js';
import * as Remote from './remote.spec.js';
import * as OneVSone from './oneVSone.spec.js';
import * as OneVSai from './oneVSai.spec.js';
import * as Navigation from './navigation.spec.js'


const URL = 'https://localhost:8443';

const name = `User${Math.floor(Math.random() * 1000000)}`;
const email = `${name}@codam.com`;
const password = `Hallo123`;
const name2 = `User${Math.floor(Math.random() * 1000000)}`;
const email2 = `${name2}@codam.com`;
const password2 = `Hallo123`;

// To execute the test in serie instead of all together
test.describe.configure({ mode: 'serial' });

// *************************************************************************** //
//               TESTS TO ACCESS WITH ALL AND SINGLE TEST                      //
// *************************************************************************** // 

async function TestAuthentication(page) {
	await page.goto(URL);

	await authenticationTests(page, 1, name, email, password);
}

async function TestMenu(page, allTests) {
	if (!allTests) {
		await page.goto(URL);
		await Login.signup_login_byPlayer(page, 1, name + 'menu', 'menu' + email, password);
		await Menu.isInMenu(page);
	}
	await Menu.seeCredits(page);
	await Menu.changeAvatar(page, 1, 'avatar1');
	await Menu.playerIsLoggedIn(page, 1, name + 'menu');
}

async function TestOneVSone(page, allTests) {
	if (!allTests) {
		await page.goto(URL);
		await Login.signup_login_byPlayer(page, 1, name + 'onevsone', 'onevsone' + email, password);
		await Menu.isInMenu(page);
	}

	await OneVSone.oneVsOne(page, name2, email2, password2);
	// await Game.quitGame(page);
}

async function TestOneVSai(page, allTests) {
	if (!allTests) {
		await page.goto(URL);
		await Login.signup_login_byPlayer(page, 1, name + 'ai', 'ai' + email, password);
		await Menu.isInMenu(page);
	}

	// PLAY 1 VS COM
	await OneVSai.StartOneVsCom(page);
	await Game.quitGame(page);
}

async function TestRemotePlayer(page, browser, allTests) {
	if (!allTests) {
		await page.goto(URL);
		await Login.signup_login_byPlayer(page, 1, name + 'ai', 'ai' + email, password);
		await Menu.isInMenu(page);
	}
	await Remote.remotePlayer(page, browser, URL, name, name2, email2, password2);
	
	// BACK TO MENU
	await page.goto(URL);
	await Menu.isInMenu(page);
}

async function TestNavigation(page, allTests) {
	if (!allTests) {
		await page.goto(URL);
		await Login.signup_login_byPlayer(page, 1, name + 'ai', 'ai' + email, password);
		await Menu.isInMenu(page);
	}
	await Navigation.navigation(page);
}

// *************************************************************************** //
//                          SINGLE TESTS 			                           //
// *************************************************************************** // 
test('Authentication', async ({ browser }) => {
	const page = await U.createNewPage(browser);
	await TestAuthentication(page);
});

test('Function Menu', async ({ browser }) => {
	const page = await U.createNewPage(browser);
	await TestMenu(page, false);
});

test('One vs One', async ({ browser }) => {
	const page = await U.createNewPage(browser);
	await TestOneVSone(page, false);
});

test('OneVSai', async ({ browser }) => {
	const page = await U.createNewPage(browser);
	await TestOneVSai(page, false);
});

test('Remote Player', async ({ browser }) => {
	const page = await U.createNewPage(browser);
	await TestRemotePlayer(page, browser, false);
});

test('Navigation', async ({browser}) => {
	const page = await U.createNewPage(browser);
	await TestNavigation(page, false);
});


// *************************************************************************** //
//                             ALL TESTS 			                           //
// *************************************************************************** // 
test('All tests', async ({ browser }) => {
	const page = await U.createNewPage(browser);
	await TestSignupAndLogin(page, true);
	await TestMenu(page, true);
	await TestOneVSone(page, true);
	await TestOneVSai(page, true);
	await TestRemotePlayer(page, browser, true);
	await TestNavigation(page, true)
});
