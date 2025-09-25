import { test, expect } from '@playwright/test';
import * as Login from './0_2_login.spec.js';
import * as Game from './game.spec.js';
import * as Menu from './1_0_menu.spec.js';
import * as U from './utils.spec.js';

/*
Tests:
- Check is ball is moving
- Check if paddle can move with arrow up/down
- Check if paddle can move with arrow w/s
- ?
*/

export async function StartOneVsOne(page) {
	await U.pressBtn(page, "Play Game");
	await U.pressBtn(page, "vs Guest");
	const playBtn = await page.locator('#settingContainer').getByRole('button', { name: 'Play Game' });
	await expect(playBtn).toBeVisible();
	await playBtn.click();
}

export async function oneVsOne(page, name, name2, email2, password2) {
	console.log('--- ONE VS ONE TESTS ---');
	// await Login.signup_login_byPlayer(page, 2, name2, email2, password2);
	
	await StartOneVsOne(page);
	await page.waitForTimeout(5000);

	// Ball is moving
	const ball = await page.locator('#ball');
	expect(await ball.isVisible()).toBeTruthy();
	const ballRect = await ball.boundingBox();
	let ballHasMoved = false;
	
	const paddle = await page.locator('#lPlayer');
	expect(await paddle.isVisible()).toBeTruthy();
	let paddleHasMoved = false;

	const startTime = Date.now();
	const paddleRect = await paddle.boundingBox();

	while (Date.now() - startTime < 10000) {
		await page.keyboard.down('KeyW');
		await page.waitForTimeout(200);
		const newRectBall = await ball.boundingBox();
		if (newRectBall && ballRect && (newRectBall.x !== ballRect.x || newRectBall.y !== ballRect.y)) {
			ballHasMoved = true;
		}
		const newRectPaddle = await paddle.boundingBox();
		if (newRectPaddle && paddleRect && (newRectPaddle.x !== paddleRect.x || newRectPaddle.y !== paddleRect.y)) {
			paddleHasMoved = true;
		}

	}
	await page.keyboard.up('KeyW');
	
	expect(ballHasMoved).toBeTruthy();
	expect(paddleHasMoved).toBeTruthy;

	await page.waitForTimeout(10000);
	await Game.quitGame(page);
	await U.pressBtn(page, 'BACK TO MENU');
	await Menu.isInMenu(page, false, name, '');
}