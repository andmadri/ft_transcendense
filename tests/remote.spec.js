import * as U from './utils.spec.js';
import * as Login from './0_0_auth.spec.js';
import * as Menu from './1_0_menu.spec.js';
import { test, expect } from '@playwright/test';

/*
Tests:
- Check is ball is moving
- Check if both paddles can move with arrow up/down
- ?
*/

export async function addRemotePlayer(browser, URL, name2, email2, password2) {
	const page2 = await U.createNewPage(browser);
	await page2.goto(URL);
	await Login.signup_login_byPlayer(page2, 1, name2 + 're', 're' + email2, password2);
	await Menu.isInMenu(page2, false, name2 + 're', '');
	return (page2)
}

export async function StartOnlineMode(page) {
	await U.pressBtn(page, "Play game");
	await U.pressBtn(page, "vs Online");
	const playBtn = await page.locator('#settingContainer').getByRole('button', { name: 'Play Game' });
	await expect(playBtn).toBeVisible();
	await playBtn.click();
}

async function timeout(page, page2, time) {
	await page.waitForTimeout(time);
	await page2.waitForTimeout(time);
}

export async function remotePlayer(page, browser, URL, name, name2, email2, password2) {
	
	const page2 = await addRemotePlayer(browser, URL, name2, email2, password2);

	await StartOnlineMode(page);
	await StartOnlineMode(page2);
	await timeout(page, page2, 3000);

	// Ball is moving
	const ball = await page.locator('#ball');
	expect(ball).toBeVisible();
	const ballRect = await ball.boundingBox();
	await timeout(page, page2, 200);
	const ball2Rect = await ball.boundingBox();
	expect(ballRect).not.toEqual(ball2Rect);

	// Paddles moves when key is pressed
	const paddle = await page.locator('#lPlayer');
	const paddleRect1 = await paddle.boundingBox();
	const paddle2 = await page.locator('#rPlayer');
	const paddleRect2_1 = await paddle2.boundingBox();
	for(let i = 0; i < 5; i++) {
		await page.keyboard.press('ArrowDown'); 
		await page2.keyboard.press('ArrowDown'); 
		await timeout(page, page2, 100);
	}
	const paddleRect2 = await paddle.boundingBox();
	const paddleRect2_2 = await paddle2.boundingBox();
	await expect(paddleRect1).not.toEqual(paddleRect2);
	await expect(paddleRect2_1).not.toEqual(paddleRect2_2);

	// Quit game
	await U.pressBtn(page, "QUIT");
	await timeout(page, page2, 2000);
	await U.pressBtn(page, 'BACK TO MENU');
	await U.pressBtn(page2, 'BACK TO MENU');
	await timeout(page, page2, 1000);
	await Menu.isInMenu(page, false, name, '');
	await Menu.isInMenu(page2, false, name2, '');
}