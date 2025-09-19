import { test, expect } from '@playwright/test';
import * as U from './utils.spec.js';

export async function tournament(p1, p2, p3, p4, name) {
	// await U.pressBtn(p1, 'Join Tournament');
	await U.pressBtn(p2, 'Join Tournament');
	await U.pressBtn(p3, 'Join Tournament');
	await U.pressBtn(p4, 'Join Tournament');

	// await U.pressBtn(p1, 'Ready?');
	await U.pressBtn(p2, 'Ready?');
	await U.pressBtn(p3, 'Ready?');
	await U.pressBtn(p4, 'Ready?');

	// await p1.waitForTimeout(15000);
	await p2.waitForTimeout(10000);
	await p3.waitForTimeout(10000);
	await p4.waitForTimeout(10000);

	// await p1.waitForTimeout(15000);
	await p2.waitForTimeout(10000);
	await p3.waitForTimeout(10000);
	await p4.waitForTimeout(10000);

	// await U.pressBtn(p1, `#menuBtn`);
	await U.pressBtn(p2, `#menuBtn`);
	await U.pressBtn(p3, `#menuBtn`);
	await U.pressBtn(p4, `#menuBtn`);

	// await p1.waitForTimeout(10000);
	await p2.waitForTimeout(10000);
	await p3.waitForTimeout(10000);
	await p4.waitForTimeout(10000);

	// await U.pressBtn(p1, 'Ready?');
	await U.pressBtn(p2, 'Ready?');
	await U.pressBtn(p3, 'Ready?');
	await U.pressBtn(p4, 'Ready?');	

}