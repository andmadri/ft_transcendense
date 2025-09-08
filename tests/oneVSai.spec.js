import { test, expect } from '@playwright/test';
import * as U from './utils.spec.js';

/*
Tests:
- Check is ball is moving
- Check if paddle ai is moving
- Check if own paddle can move with arrow up/down
- ?
*/
export async function StartOneVsCom(page) {
	await U.pressBtn(page, "Play game");
	await U.pressBtn(page, "1 VS COM");
	await U.pressBtn(page, "single game");
	await U.pressBtn(page, "PLAY");
	await page.waitForTimeout(1000);
}
