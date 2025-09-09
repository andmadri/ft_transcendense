import * as U from './utils.spec.js';
import * as Login from './0_2_login.spec.js';
import * as Game from './oneVSai.spec.js';
import * as Menu from './1_0_menu.spec.js';

/*
Tests:
- if quit btn is working
- ?

*/

export async function quitGame(page) {
	await U.pressBtn(page, "QUIT");
	await page.waitForTimeout(1000);

	// GO TO GAME OVER PAGE OR MENU?
	// await expect(page.locator('div', { hasText: 'Game Over' })).toBeVisible();
	// await Menu.isInMenu(page);
}