import { test, expect } from '@playwright/test';
import * as U from './utils.spec.js';
import * as Menu from './1_0_menu.spec.js'

/*
Tests:
- Check is ball is moving
- Check if paddle ai is moving
- Check if own paddle can move with arrow up/down
- ?
*/
export async function StartOneVsCom(page, name) {
	console.log('--- ONE VS COM TESTS ---');
	await U.pressBtn(page, "Play game");
	await U.pressBtn(page, "vs AI");
	const playBtn = await page.locator('#settingContainer').getByRole('button', { name: 'Play Game' });
	await expect(playBtn).toBeVisible();
	await playBtn.click();
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
		await page.keyboard.press('ArrowDown');
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
	expect(ballHasMoved).toBeTruthy();
	expect(paddleHasMoved).toBeTruthy;

	await U.pressBtn(page, "QUIT");
	await page.waitForTimeout(1000);

	await U.pressBtn(page, 'BACK TO MENU');
	await Menu.isInMenu(page, false, name, '');
}
