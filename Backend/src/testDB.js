import { updateMatchInDB } from './Database/match.js'
import { addUserToDB, updateUserInDB, getOnlineUsers } from './Database/users.js';
import { handleMatchStart, handleMatchEvent } from './Services/matchService.js';
import { onUserLogin } from './Services/sessionsService.js';
import { getAllUserStateDurations, getUserStateDurations, getUserMatchStats } from './Database/online.js';
import { addUserSessionToDB } from './Database/sessions.js';

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export async function testDB(db) {
	// const guest_id = await addUserToDB(db, {
	// 	name: 'Guest',
	// 	email: 'guest@guest.guest',
	// 	password: 'secretguest',
	// 	avatar_url: null
	// });

	// await onUserLogin(db, guest_id);

	// const ai_id = await addUserToDB(db, {
	// 	name: 'AI',
	// 	email: 'ai@ai.ai',
	// 	password: 'secretai',
	// 	avatar_url: null
	// });

	// await onUserLogin(db, ai_id);

	// wait 1 seconds
	// await sleep(5000);

	// const match_1 = await handleMatchStart(db, {
	// 	player_1_id: guest_id,
	// 	player_2_id: ai_id,
	// 	match_type: 'vs_ai',
	// });

	// await handleMatchEvent(db, {
	// 	match_id: match_1,
	// 	user_id: ai_id,
	// 	event_type: 'serve',
	// });

	// // wait 1 second
	// await sleep(1000);

	// await handleMatchEvent(db, {
	// 	match_id: match_1,
	// 	user_id: ai_id,
	// 	event_type: 'hit',
	// });

	// // wait 1 second
	// await sleep(1000);

	// await handleMatchEvent(db, {
	// 	match_id: match_1,
	// 	user_id: guest_id,
	// 	event_type: 'hit',
	// });

	// // wait 1 second
	// await sleep(1000);

	// await handleMatchEvent(db, {
	// 	match_id: match_1,
	// 	user_id: ai_id,
	// 	event_type: 'hit',
	// });

	// // wait 1 second
	// await sleep(1000);

	// await handleMatchEvent(db, {
	// 	match_id: match_1,
	// 	user_id: guest_id,
	// 	event_type: 'goal',
	// });

	console.log('--- Online users ---');
	console.table(await getOnlineUsers(db));

	// await updateMatchInDB(db, {
	// 	match_id:       match_1,
	// 	player_1_score: 0,
	// 	player_2_score: 1,
	// 	winner_id:      ai_id,
	// 	end_time:       new Date().toISOString()
	// });

	// await addUserSessionToDB(db, {
	// 	user_id: guest_id,
	// 	state: 'in_menu'
	// });

	// await addUserSessionToDB(db, {
	// 	user_id: ai_id,
	// 	state: 'in_menu'
	// });

	// await sleep(1000);

	// console.log('--- All user durations ---');
	// console.table(await getAllUserStateDurations(db));

	// console.log(`--- Durations for user 1 ---`);
	// console.log(await getUserStateDurations(db, 1));

	// // wait 5 seconds
	// await sleep(5000);

	// // DELETE THIS LATER
	// await addUserSessionToDB(db, {
	// 	user_id: ai_id,
	// 	state: 'logout'
	// });

	// console.log(`--- Durations for user 2 ---`);
	// console.log(await getUserStateDurations(db, 2));

	// await updateUserInDB(db, {
	// 	user_id: guest_id,
	// 	name: 'Guest new name!',
	// });

	// console.log('--- Online users ---');
	// console.table(await getOnlineUsers(db));

	// console.log('--- Guest MATCH STATS ---');
	// console.log(await getUserMatchStats(db, 1));


	// // ───── Additional users for dashboard testing ─────
	// const alice_id = await addUserToDB(db, {
	// 	name:       'Alice',
	// 	email:      'alice@example.com',
	// 	password:   'alicepw',
	// 	avatar_url: null
	// });
	// await onUserLogin(db, alice_id);

	// const bob_id = await addUserToDB(db, {
	// 	name:       'Bob',
	// 	email:      'bob@example.com',
	// 	password:   'bobpw',
	// 	avatar_url: null
	// });
	// await onUserLogin(db, bob_id);

	// // ───── Finished 1v1 match: Alice vs Bob ─────
	// const matchId2 = await handleMatchStart(db, {
	// 	player_1_id: alice_id,
	// 	player_2_id: bob_id,
	// 	match_type:  '1v1'
	// });
	// // simulate a quick rally
	// await sleep(1000);
	// await handleMatchEvent(db, { match_id: matchId2, user_id: bob_id, event_type: 'hit' });
	// await sleep(1000);
	// await handleMatchEvent(db, { match_id: matchId2, user_id: alice_id, event_type: 'goal' });
	// // finalize scores and winner
	// await updateMatchInDB(db, {
	// 	match_id:       matchId2,
	// 	player_1_score: 0,
	// 	player_2_score: 1,
	// 	winner_id:      bob_id,
	// 	end_time:       new Date().toISOString()
	// });

	// // ───── Finished tournament match: Bob vs Guest ─────
	// await sleep(1000);
	// const matchId3 = await handleMatchStart(db, {
	// 	player_1_id: bob_id,
	// 	player_2_id: guest_id,
	// 	match_type:  'vs_guest'
	// });

	// await sleep(3000);
	// await handleMatchEvent(db, { match_id: matchId3, user_id: guest_id, event_type: 'goal' });
	// await updateMatchInDB(db, {
	// 	match_id:       matchId3,
	// 	player_1_score: 1,
	// 	player_2_score: 0,
	// 	winner_id:      bob_id,
	// 	end_time:       new Date().toISOString()
	// });

	// // ───── Check new stats ─────
	// console.log('--- Guest MATCH STATS ---');
	// console.log(await getUserMatchStats(db, guest_id));

	// console.log('--- AI MATCH STATS ---');
	// console.log(await getUserMatchStats(db, ai_id));

	// console.log('--- Alice MATCH STATS ---');
	// console.log(await getUserMatchStats(db, alice_id));

	// console.log('--- Bob MATCH STATS ---');
	// console.log(await getUserMatchStats(db, bob_id));
}
