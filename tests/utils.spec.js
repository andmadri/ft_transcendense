import { test, expect } from '@playwright/test';

export async function createNewPage(browser) {
	const context = await browser.newContext();
	const page = await context.newPage();
	return (page);
}

export async function pressBtn(page, btnName) {
	await expect(page.locator('button', { hasText: btnName })).toBeVisible();
	await page.locator('button', { hasText: btnName }).click();
}



