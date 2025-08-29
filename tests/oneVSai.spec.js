import { test, expect } from '@playwright/test';
import * as U from './utils.spec.js';

export async function StartOneVsCom(page) {
	await U.pressBtn(page, "Play game");
	await U.pressBtn(page, "1 VS COM");
	await U.pressBtn(page, "single game");
	await U.pressBtn(page, "PLAY");
	await page.waitForTimeout(1000);
}
