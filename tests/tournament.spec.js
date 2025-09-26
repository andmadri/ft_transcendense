import { test, expect } from '@playwright/test';
import * as U from './utils.spec.js';

async function timeoutForPages(pages, time) {
	for (let i = 0; i < 4; i++) {
		await pages[i].waitForTimeout(time);
	}
}

async function pressBtnPages(pages, btnTxt) {
	for (let i = 0; i < 4; i++) {
		await U.pressBtn(pages[i], btnTxt);
	}	
}

async function clickQuitIfExist(pages) {
	for (let i = 0; i < 4; i++) {
		const quitBtn = pages[i].locator('button', { hasText: 'QUIT' });
		const count = await quitBtn.count();
		if (count > 0) {
			if (await quitBtn.isVisible()) {
				await quitBtn.click();
			}
		}
	}
}

export async function tournament(p1, p2, p3, p4, name) {
	const pages = [p1, p2, p3, p4];

	await pressBtnPages(pages, 'Join Tournament');
	await timeoutForPages(pages, 2000);

	await pressBtnPages(pages, 'Ready');
	await timeoutForPages(pages, 3000);

	await clickQuitIfExist(pages);
	await timeoutForPages(pages, 1000);
	await pressBtnPages(pages, `BACK TO TOURNAMENT`);
	await timeoutForPages(pages, 2000);

	await pressBtnPages(pages, 'Ready');
	await timeoutForPages(pages, 3000);

	await clickQuitIfExist(pages);
	await timeoutForPages(pages, 1000);

	for (const p of pages) {
  		await expect(p.locator('#playerPodium').first()).toBeVisible();
	}

	for (const p of pages) {
		const btn = p.locator('#exitButton').nth(1);
		await btn.click();
	}
}