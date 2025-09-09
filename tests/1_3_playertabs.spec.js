
/**
Tests

	PLAYER TABS
	- player stats btn visible
	- player btn logout
	- player logout -> to login
	- player login again
	- player switch tab
	- player 2 sign up / login
	- player 1 and 2 in playerlist (online)
	- player 2 logout
	- player 2 in playerlist (offline)
	- player 2 login again
	- player 1 and 2 in menu
 */

export async function playerTabsTests(page, player1, name1, email1, password1, player2, name2, email2, password2) {
	await test.step('Player 1 stats visible', async () => {
		await Menu.isInMenu(page);
		await expect(page.locator('#playerStatsBtn' + player1)).toBeVisible();
	});

	await test.step('Player 1 logout', async () => {
		await Menu.switchPlayerTab(page, player1);
		await U.pressBtn(page, "logout");
		await expect(page.locator('h2', { hasText: 'Login' })).toBeVisible();
	});

	await test.step('Player 1 login again', async () => {
		await Login.login_player(page, player1, email1, password1);
		await Menu.isInMenu(page);
		await Menu.playerIsLoggedIn(page, player1, name1);
	});

	await test.step('Player 1 switch tab', async () => {
		await Menu.switchPlayerTab(page, player1);
		await page.waitForTimeout(1000);
	});

	await test.step('Player 2 sign up / login', async () => {
		await Login.signup_login_byPlayer(page, player2, name2, email2, password2);
		await Menu.isInMenu(page);
		await Menu.playerIsLoggedIn(page, player2, name2);
	});

	await test.step('Player 1 and 2 in playerlist (online)', async () => {
		await Menu.playerInOnlineMenu(page, name1);
		await Menu.playerInOnlineMenu(page, name2);
	});

	await test.step('Player 2 logout', async () => {
		await Menu.switchPlayerTab(page, player2);
		await U.pressBtn(page, "logout");
		await expect(page.locator('h2', { hasText: 'Login' })).toBeVisible();
	});

	await test.step('Player 2 in playerlist (offline)', async () => {
		await Menu.switchPlayerTab(page, player1);
		await Menu.playerInOnlineMenu(page, name1);
		await expect(
			page.locator('#listPlayers', { hasText: name2 })
		  ).not.toBeVisible();
	});

	await test.step('Player 2 login again', async () => {
		await Login.login_player(page, player2, email2, password2);
		await Menu.isInMenu(page);
		await Menu.playerIsLoggedIn(page, player2, name2);
	});

	await test.step('Player 1 and 2 in menu', async () => {
		await Menu.playerInOnlineMenu(page, name1);
		await Menu.playerInOnlineMenu(page, name2);
	});
}