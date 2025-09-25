import { test, expect } from '@playwright/test';
import * as U from './utils.spec.js';
import { authenticationTests, signup_login_byPlayer } from './0_0_auth.spec.js';
import { menuTests, isInMenu } from './1_0_menu.spec.js';
import { afterGame } from './after_game.spec.js';
import { tournament } from './tournament.spec.js'
import * as Game from './game.spec.js';
import * as Remote from './remote.spec.js';
import * as OneVSone from './oneVSone.spec.js';
import * as OneVSai from './oneVSai.spec.js';
import * as Navigation from './navigation.spec.js'
import { tournamentHelper } from './tournamentHelper.spec.js';

// TESTER:
// npx install --save-dev @playwright/test
// npx playwright install
// npx playwright test --ui (IN VSC)

export const URL = 'https://localhost:8443';

const name = `U${Math.floor(Math.random() * 1000000)}`;
const email = `${name}@codam.com`;
const password = `Hallo123`;
const name2 = `U${Math.floor(Math.random() * 1000000)}`;
const email2 = `${name2}@codam.com`;
const password2 = `Hallo123`;

// To execute the test in serie instead of all together
test.describe.configure({ mode: 'serial' });

async function pageLogin(browser, add) {
	const page = await U.createNewPage(browser);
	await page.goto(URL);
	await signup_login_byPlayer(page, 1, name + add, add + email, password);
	return (page);
}

test('Authentication', async ({ browser }) => {
	const page = await U.createNewPage(browser);
	await page.goto(URL);
	await authenticationTests(browser, page, 1, name, email, password);
});

test('Menu', async ({ browser }) => {
	const page = await pageLogin(browser, 'm');
	await menuTests(page, name + 'm', email, password, name2 + 'm', email2, password2);
});

test('One vs One', async ({ browser }) => {
	const page = await pageLogin(browser, 'o');
	await isInMenu(page, false, name + 'o', '');
	await OneVSone.oneVsOne(page, name + 'o', name2, email2, password2);
});

test('OneVSai', async ({ browser }) => {
	const page = await pageLogin(browser, 'a');
	await isInMenu(page, false, name + 'a', '');
	await OneVSai.StartOneVsCom(page, name + 'a');
});

test('Remote Player', async ({ browser }) => {
	const page = await pageLogin(browser, 'r');
	await isInMenu(page, false, name + 'r', '');
	await Remote.remotePlayer(page, browser, URL, name + 'r', name2, email2, password2);
});

test('Navigation', async ({browser}) => {
	const page = await pageLogin(browser, 'n');
	await isInMenu(page, false, name, '');
	await Navigation.navigation(page, name);
});

test('After Game', async ({browser}) => {
	const page =  await pageLogin(browser, 'g');
	await isInMenu(page, false, name, '');
	await afterGame(page);
});

test('Tournament', async ({browser}) => {
	const page1 =  await pageLogin(browser, '1');
	const page2 =  await pageLogin(browser, '2');
	const page3 =  await pageLogin(browser, '3');
	const page4 =  await pageLogin(browser, '4');
	await tournament(page1, page2, page3, page4, name);
});

test('TournamentHelper', async({browser}) => {
	const page1 =  await pageLogin(browser, '1');
	const page2 =  await pageLogin(browser, '2');
	const page3 =  await pageLogin(browser, '3');
	await tournamentHelper(page1, page2, page3, )
})