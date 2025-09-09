
/**
TESTS
	CREDIT PAGE
	- credit page btn -> to credit page
	- close btn
	- back btn -> to menu
	- img visible
*/

async function seeCredits(page) {
	await U.pressDiv(page, "Credits");
	await page.waitForTimeout(1000);
	await expect(page.locator('img[src*="Credits.png"]')).toBeVisible();
	await U.pressBtn(page, "CLOSE");
}

export async function creditTests(page) {
	await seeCredits(page);
}
