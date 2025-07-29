import Fastify from 'fastify';
import websocket from '@fastify/websocket';
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import fastifyCors from '@fastify/cors';
// import { validateLogin, addUser } from './Auth/userAuth.js';
import { handleOnlinePlayers } from './DBrequests/getOnlinePlayers.js';
import { handlePlayerInfo } from './DBrequests/getPlayerInfo.js';
import { createDatabase } from './Database/database.js'
import { handleGame } from './Game/game.js'
import googleAuthRoutes from './routes/googleAuth.js';
import userAuthRoutes from './routes/userAuth.js';
import { parseAuthTokenFromCookies } from './Auth/authToken.js';
import { addUserToDB, updateUserInDB, getOnlineUsers } from './Database/users.js'; // DELETE THIS LATER
import { handleMatchStart, handleMatchEvent } from './Services/matchService.js'; // DELETE THIS LATER
import { onUserLogin } from './Services/sessionsService.js'; // DELETE THIS LATER
import { getAllUserStateDurations, getUserStateDurations } from './Database/online.js';
import { addUserSessionToDB } from './Database/sessions.js';


// import { updateOnlineStatus } from './Database/database.js';


const fastify = Fastify();
await fastify.register(websocket);

//change how you create database
export const db = await createDatabase();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// DELETE THIS LATER
await addUserToDB(db, {
	name: 'Guest',
	email: 'guest@guest.guest',
	password: 'secretguest',
	avatar_url: null
});

// DELETE THIS LATER
await onUserLogin(db, 1);

// DELETE THIS LATER
await addUserToDB(db, {
	name: 'AI',
	email: 'ai@ai.ai',
	password: 'secretai',
	avatar_url: null
});

// DELETE THIS LATER
await onUserLogin(db, 2);

// wait 5 seconds
await sleep(5000);

// DELETE THIS LATER
await handleMatchStart(db, {
	player_1_id: 1,
	player_2_id: 2,
	match_type: 'vs_ai',
});

// DELETE THIS LATER
await handleMatchEvent(db, {
	match_id: 1,
	user_id: 2,
	event_type: 'serve',
});

// wait 1 second
await sleep(1000);

// DELETE THIS LATER
await handleMatchEvent(db, {
	match_id: 1,
	user_id: 2,
	event_type: 'hit',
});

// wait 1 second
await sleep(1000);

// DELETE THIS LATER
await handleMatchEvent(db, {
	match_id: 1,
	user_id: 1,
	event_type: 'hit',
});

// wait 1 second
await sleep(1000);

// DELETE THIS LATER
await handleMatchEvent(db, {
	match_id: 1,
	user_id: 2,
	event_type: 'hit',
});

// wait 1 second
await sleep(1000);

// DELETE THIS LATER
await handleMatchEvent(db, {
	match_id: 1,
	user_id: 1,
	event_type: 'goal',
});

// DELETE THIS LATER
console.log('--- Online users ---');
console.table(await getOnlineUsers(db));

await addUserSessionToDB(db, {
	user_id: 1,
	state: 'in_menu'
});

console.log('--- All user durations ---');
console.table(await getAllUserStateDurations(db));

console.log(`--- Durations for user 1 ---`);
console.log(await getUserStateDurations(db, 1));

// wait 5 seconds
await sleep(5000);

// DELETE THIS LATER
await addUserSessionToDB(db, {
	user_id: 2,
	state: 'logout'
});

console.log(`--- Durations for user 2 ---`);
console.log(await getUserStateDurations(db, 2));

await updateUserInDB(db, {
	user_id: 1,
	name: 'Guest new name!',
});

console.log('--- Online users ---');
console.table(await getOnlineUsers(db));

// Register the cookie plugin
fastify.register(fastifyCookie, { secret: process.env.COOKIE_SECRET });

// Register the JWT plugin
fastify.register(fastifyJwt, { secret: process.env.JWT_SECRET });

// Register the auth route plugins for HTTPS API Auth endpoints:
// POST /api/signup - Sign up a new user
// POST /api/login - Log in an existing user
// POST /api/logout - Log out a user
// GET /api/auth/google - Redirect to Google OAuth
// GET /api/auth/google/callback - Handle Google OAuth callback
await fastify.register(googleAuthRoutes);
await fastify.register(userAuthRoutes);


/*
FROM frontend TO backend				
• login => loginUpser / signUpUser / logout				
• playerInfo => changeName / addAvatar / delAvatar / getPlayerData
• chat => outgoing										
• online => getOnlinePlayers / getOnlinePlayersWaiting	
• friends => getFriends / addFriend / deleteFriend		
• pending => addToWaitlist / acceptGame					
• game => init / ballUpdate / padelUpdate / scoreUpdate	
• error => crash		
*/

fastify.get('/wss', { websocket: true }, (connection, req) => {

	// Check if the request has a valid JWT token in cookies
	const cookies = req.headers.cookie;
	const authTokens = parseAuthTokenFromCookies(cookies);

	let decoded;
	let userId1 = null;
	let userId2 = null;
	if (authTokens && authTokens.jwtAuthToken1) {
		try {
			decoded = fastify.jwt.verify(authTokens.jwtAuthToken1);
			userId1 = decoded.userId;
			// Use userId or decoded as needed for player 1
		} catch (err) {
			console.error('JWT1 verification failed:', err);
		}
	}
	if (authTokens && authTokens.jwtAuthToken2) {
		try {
			decoded = fastify.jwt.verify(authTokens.jwtAuthToken2);
			userId2 = decoded.userId;
			// Use userId or decoded as needed for player 2
		} catch (err) {
			console.error('JWT2 verification failed:', err);
		}
	}
	if (!userId1 && !userId2) {
		console.error('No valid auth tokens found in cookies');
		connection.socket.send(JSON.stringify({ action: "error", reason: "Unauthorized: No auth tokens found" }));
		return ;
	}


	connection.socket.on('message', (message) => {
		const msg = JSON.parse(message.toString());
		const action = msg.action;
		// console.log('Received from frontend: ' + message);
		if (!action) {
			const returnMsg = { action: "Error" }
			connection.socket.send(JSON.stringify(returnMsg));
			return ;
		}

		// ADD HERE FUNCTIONS THAT MATCH WITH THE RIGHT ACTION
		switch (action) {
			// case 'login':
			// 	return handleUserAuth(msg, connection.socket, fastify);
			case 'playerInfo':
				return handlePlayerInfo(msg, connection.socket, userId1, userId2);
			case 'online':
				return handleOnlinePlayers(msg, connection.socket);
			case 'friends':
				break ;
			case 'pending':
				break ;
			case 'game':
				return handleGame(msg, connection.socket);
			case 'error':
				console.log('Error from frontend..');
				connection.socket.send(JSON.stringify(msg));
				break ;
			default:
				console.log('No valid action: ' + action);
				connection.socket.send(JSON.stringify(msg));
				return ;
		}			
	});
});

fastify.setNotFoundHandler(function (request, reply) {
  reply.status(404).send({ error: 'Not Found' });
});

fastify.listen({ port: 3000, host: '0.0.0.0' });

