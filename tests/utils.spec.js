import { test, expect } from '@playwright/test';

export async function createNewPage(browser) {
	const context = await browser.newContext();
	const page = await context.newPage();
	return (page);
}

export async function pressBtn(page, btnName) {
	await expect(page.locator('button', { hasText: btnName })).toBeVisible();
	console.log(`Press ${btnName} button`);
	await page.locator('button', { hasText: btnName }).click();
}

export async function pressDiv(page, btnName) {
	await expect(page.locator(`text="${btnName}"`).first()).toBeVisible();
	console.log(`Press ${btnName} Div Element`);
	await page.locator(`text="${btnName}"`).click();
}

export async function pressLabel(page, labelName) {
	await expect(page.locator(`label[for=${labelName}]`)).toBeVisible();
	console.log(`Press ${btnName} label`);
	await page.locator(`label[for=${labelName}]`).click();
}

export async function checkHash(page, expectedUrl) {
	const currentUrl = page.url();
	const urlObj = new URL(currentUrl);
	const hash = urlObj.hash; 
	await expect(hash).toContain(expectedUrl);
};