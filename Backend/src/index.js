import { handlePlayers } from './DBrequests/getPlayers.js';
import { handlePlayerInfo } from './DBrequests/getPlayerInfo.js';
import { handleUserDataMenu } from './DBrequests/getUserDataMenu.js';
import { handleDashboardMaking } from './DBrequests/getDashboardInfo.js';
import { handleFriends } from './DBrequests/getFriends.js';
import { createDatabase } from './Database/database.js';
import { handleGame } from './Game/game.js';
import { handleInitGame } from './InitGame/initGame.js';
import { handleMatchmaking } from './Pending/matchmaking.js';
import { parseAuthTokenFromCookies } from './Auth/authToken.js';
import { addUserToRoom } from './rooms.js';
import { onUserLogout } from './Services/sessionsService.js';
import { handleError } from './errors.js';
import { performCleanupDB } from './Database/cleanup.js';
import { handleTournament, leaveTournament } from './Tournament/tournament.js';
import { initFastify } from './fastify.js';
import { USERLOGIN_TIMEOUT } from './structs.js';
import { checkChallengeFriendsInvites } from './Pending/matchmaking.js'
import { generateAllChartsForMatch } from './Charts/createGameStats.js';
import { stopMatchAfterRefresh } from './End/endGame.js';
import { tournament } from './Tournament/tournament.js';
import { removeFromWaitinglist } from './Pending/onlinematch.js';
import { onUserLogin } from './Services/sessionsService.js';

export const db = await createDatabase();

const fastify = await initFastify();

// Map to track last seen timestamps for users
export const usersLastSeen = new Map();

function installShutdownHandlers(fastify, db) {
	const shutdown = async (signal) => {
		console.log(`[graceful] Caught ${signal}. Starting cleanup…`);
		try {
			fastify.log.info({msg: `Received ${signal}, starting cleanup...`});
			await performCleanupDB(db);
			await fastify.close();
			fastify.log.info({ msg: `Cleanup done. Exiting.` });
			process.exit(0);
		} catch (err) {
			fastify.log.error(err.message || err, `Error during shutdown after ${signal}`);
			process.exit(1);
		}
	};

	process.on('SIGTERM', () => shutdown('SIGTERM'));
	process.on('SIGINT', () => shutdown('SIGINT'));
}

installShutdownHandlers(fastify, db);

fastify.ready().then(() => {
	fastify.io.on('connection', (socket) => {
		const cookies = socket.handshake.headers.cookie || '';
		const authTokens = parseAuthTokenFromCookies(cookies);

		let decoded;
		let userId1 = null;
		let userId2 = null;
		if (authTokens && authTokens.jwtAuthToken1) {
			const unsigned = fastify.unsignCookie(authTokens.jwtAuthToken1);
			if (unsigned.valid) {
				try {
					decoded = fastify.jwt.verify(unsigned.value);
					userId1 = decoded.userId;
					if (userId1) {
						onUserLogin(db, userId1);
					}
				} catch (err) {
					console.error('AUTH_JWT_INVALID', 'JWT1 verification failed: Invalid cookie', err.message || err, 'index');
				}
			} else {
				console.error('AUTH_JWT_INVALID', 'JWT1 verification failed: Invalid cookie', 'index');
			}
		}
		if (authTokens && authTokens.jwtAuthToken2) {
			const unsigned = fastify.unsignCookie(authTokens.jwtAuthToken2);
			if (unsigned.valid) {
				try {
					decoded = fastify.jwt.verify(unsigned.value);
					userId2 = decoded.userId;
					if (userId2) {
						onUserLogin(db, userId2);
					}
					// Use userId or decoded as needed for player 2
				} catch (err) {
					console.error('AUTH_JWT_INVALID', 'JWT2 verification failed: Invalid cookie', err.message || err, 'index');
				}
			} else {
				console.error('AUTH_JWT_INVALID', 'JWT2 verification failed: Invalid cookie', 'index');
			}
		}
		if (!userId1) {
			handleError(socket, 'AUTH_NO_TOKEN', 'Unauthorized: No authentication token provided.', '', '', 'index');
			return ;
		}
		// add user to main room
		addUserToRoom(socket, 'main');

		// Socket that listens to incomming msg from frontend
		socket.on('message', (msg) => {
			try {
				const action = msg.action;
				if (!action) {
					handleError(socket, 'MSG_MISSING_ACTION', 'Invalid message format', 'missing action', msg, 'index');
					return ;
				}

				switch (action) {
					case 'playerInfo':
						return handlePlayerInfo(msg, socket, userId1, userId2);
					case 'matchmaking':
						return handleMatchmaking(db, msg, socket, userId1, fastify.io);
					case 'userDataMenu':
						return handleUserDataMenu(msg, socket, userId1, userId2);
					case 'players':
						return handlePlayers(db, msg, socket, userId1);
					case 'friends':
						return handleFriends(msg, socket, userId1);
					case 'dashboard': {
					//if there is no player id it is specify whether to use userID1 or userID2
						if (!msg.playerId) {
							msg.playerId = (msg.playerNr === 1 ? userId1 : userId2);
						}
						return handleDashboardMaking(msg, socket, msg.playerId);
					}
					case 'gameStats':
						return generateAllChartsForMatch(db, socket, msg);
					case 'init':
						return handleInitGame(db, msg, socket);
					case 'game':
						return handleGame(db, msg, socket, fastify.io);
					case 'tournament':
						return handleTournament(db, msg, socket, fastify.io, userId1);
					case 'error':
						console.error('FRONTEND_ERROR:', msg);
						return ;
					default:
						handleError(socket, 'MSG_UNKNOWN_ACTION', 'Invalid message format', 'Unknown:', action, 'index');
						return ;
				}
			} catch (err) {
				console.error('Error during receiving msg', err);
			}
		});

		socket.on('heartbeat', (msg) => {
			try {
				if (userId1) {
					usersLastSeen.set(userId1, {
						userId2,
						lastSeen: Date.now()
					});
					if (msg.menu === true) {
						handleFriends({ subaction: 'initMenu' }, socket, userId1);
					}
				}
			} catch (err) {
				console.error('Error during heartbeat', err);
			}
		});

		socket.on('disconnect', async () => {
			try {
				console.log(`User ${userId1} disconnected`);
				checkChallengeFriendsInvites(socket, userId1);
				removeFromWaitinglist(userId1);
				await stopMatchAfterRefresh(fastify.io, userId1);
				const player = tournament.players.find(p => p.id === userId1);
				if (player) {
					leaveTournament({name: player.name}, userId1, socket, fastify.io);
				}
			} catch (err) {
				console.error(`Error during disconnecting`, err);
			}
		});
	});
});

setInterval(async () => {
	try {
		const now = Date.now();
		for (const [userId1, data] of usersLastSeen.entries()) {
			const { userId2, lastSeen } = data;
			if (now - lastSeen > (USERLOGIN_TIMEOUT * 1000)) { // * 1000 to convert sec to ms
				// Mark user offline in DB
				try {
					await onUserLogout(db, userId1);
					usersLastSeen.delete(userId1);
					console.log(`User ${userId1} marked offline due to missed heartbeat`);
					if (userId2 && userId2 > 2) {
						await onUserLogout(db, userId2);
						usersLastSeen.delete(userId2);
						console.log(`User (player2) ${userId2} marked offline due to missed heartbeat`);
					}
					usersLastSeen.delete(userId1);
				} catch (err) {
					console.error(`Error setting user1 (${userId1}) and/or user2 (${userId2}) offline: `, err);
				}
			}
		}
	} catch (err) {
		console.error(`HEARTBEAT_INTERVAL Error during user session cleanup`, err.message || err , "setInterval");
	}
}, 5000); // check every 5 seconds

try {
	await fastify.listen({ port: 3000, host: '0.0.0.0' });
	console.log('Server listening on port 3000');
} catch (err) {
	fastify.log.error(err.message || err);
	process.exit(1);
}