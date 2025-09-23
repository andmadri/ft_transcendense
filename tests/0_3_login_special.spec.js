import { test, expect } from '@playwright/test';
import * as U from './utils.spec.js';
import { signup_login_byPlayer } from './0_0_auth.spec.js';
import { URL } from './tester.spec.js';

const name = `P${Math.floor(Math.random() * 1000000)}`;
const email = `${name}@codam.com`;
const password = `Hallo123`;

export async function sign_up_specials(browser) {
		const page = await U.createNewPage(browser);
		await page.goto(URL);
		const page2 = await U.createNewPage(browser);
		await page2.goto(URL);
		await Promise.all([
			signup_login_byPlayer(page, 1, 'p' + name, 'p' + email, password),
			signup_login_byPlayer(page2, 2, 'p' + name, 'p' + email, password),
		]);
}
