import { test, expect } from '@playwright/test';

const name = `User${Math.floor(Math.random() * 1000000)}`;
const email = `${name}@codam.com`;
const password = `Hallo123`;
const name2 = `User${Math.floor(Math.random() * 1000000)}`;
const email2 = `${name2}@codam.com`;
const password2 = `Hallo123`;

async function pressBtn(page, btnName) {
	await expect(page.locator('button', { hasText: btnName })).toBeVisible();
	await page.locator('button', { hasText: btnName }).click();
}

async function signup_login_byPlayer(page, player, Name, Email, Password) {
	await page.fill(`#name${player}`, Name);
	await page.fill(`#email${player}`, Email);
	await page.fill(`#password${player}`, Password);
	await pressBtn(page, "Sign Up");
	await page.waitForTimeout(1000);
	await page.fill(`#email${player}`, Email);
	await page.fill(`#password${player}`, Password);
	await pressBtn(page, "Login");
	await page.waitForTimeout(1000);
}

async function OneVsComAndQuit(page) {
	await pressBtn(page, "Play game");
	await pressBtn(page, "1 VS COM");
	await pressBtn(page, "PLAY");
	await pressBtn(page, "QUIT");
}

async function OneVsOne(page) {
	await pressBtn(page, "Play game");
	await pressBtn(page, "1 VS 1");
	await pressBtn(page, "PLAY");
	await signup_login_byPlayer(page, 2, name2, email2, password2);
}

async function onlineMode(page) {
	await pressBtn(page, "Play game");
	await pressBtn(page, "Online");
	await pressBtn(page, "PLAY");
}

test('Pong tester', async ({ browser }) => {
	const context1 = await browser.newContext();
	const page = await context1.newPage();

	// OPEN SITE
	await page.goto('https://localhost:8443');

	// SIGN UP + LOGIN 
	await signup_login_byPlayer(page, 1, name, email, password);
	await page.locator('h2', { hasText: 'Menu' }).isVisible();

	await page.goto('https://localhost:8443');

	await OneVsComAndQuit(page);

	await page.goto('https://localhost:8443');
	
	await OneVsOne(page);

	await page.goto('https://localhost:8443');

	// CREATE NEW PAGE FOR REMOTE PLAYER
	const context2 = await browser.newContext();
	const page2 = await context2.newPage();

	await page2.goto('https://localhost:8443');
	await signup_login_byPlayer(page2, 1, name + 'remote', 'remote' + email, password);
	await page2.locator('h2', { hasText: 'Menu' }).isVisible();
	
	await onlineMode(page);
	await onlineMode(page2);

	// BACK TO MENU
	await page.goto('https://localhost:8443');
	await expect(page.locator('h2', { hasText: 'Menu' })).toBeVisible();
});
