import { test, expect } from '@playwright/test';
import * as U from './utils.spec.js';
import { authenticationTests, signup_login_byPlayer } from './0_0_auth.spec.js';
import { menuTests, isInMenu } from './1_0_menu.spec.js';
import * as Game from './game.spec.js';
import * as Remote from './remote.spec.js';
import * as OneVSone from './oneVSone.spec.js';
import * as OneVSai from './oneVSai.spec.js';
import * as Navigation from './navigation.spec.js'


const URL = 'https://localhost:8443';

const name = `U${Math.floor(Math.random() * 1000000)}`;
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
		await signup_login_byPlayer(page, 1, name + 'm', 'm' + email, password);
		await isInMenu(page, false, name, '');
	}
	menuTests(page, 1, name + 'menu');
}

async function TestOneVSone(page, allTests) {
	if (!allTests) {
		await page.goto(URL);
		await signup_login_byPlayer(page, 1, name + 'o', 'o' + email, password);
		// await isInMenu(page, false, name + 'o', '');
	}
	console.log("Tests one vs one");
	await OneVSone.oneVsOne(page, name2, email2, password2);
	// await Game.quitGame(page);
}

async function TestOneVSai(page, allTests) {
	if (!allTests) {
		await page.goto(URL);
		await signup_login_byPlayer(page, 1, name + 'a', 'a' + email, password);
		await isInMenu(page, false, name, '');
	}

	// PLAY 1 VS COM
	await OneVSai.StartOneVsCom(page);
	await Game.quitGame(page);
}

async function TestRemotePlayer(page, browser, allTests) {
	if (!allTests) {
		await page.goto(URL);
		await signup_login_byPlayer(page, 1, name + 'a', 'a' + email, password);
		await isInMenu(page, false, name, '');
	}
	await Remote.remotePlayer(page, browser, URL, name, name2, email2, password2);
	
	// BACK TO MENU
	await page.goto(URL);
	await isInMenu(page, false, name, '');
}

async function TestNavigation(page, allTests) {
	if (!allTests) {
		await page.goto(URL);
		await signup_login_byPlayer(page, 1, name + 'a', 'ai' + email, password);
		await isInMenu(page, false, name, '');
	}
	await Navigation.navigation(page, name);
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
	await TestAuthentication(page, true);
	await TestMenu(page, true);
	await TestOneVSone(page, true);
	await TestOneVSai(page, true);
	await TestRemotePlayer(page, browser, true);
	await TestNavigation(page, true)
});
