import { db } from '../index.js';
import { startOnlineMatch } from '../Pending/onlinematch.js';
import { matches } from '../InitGame/match.js';
import { createMatch } from '../InitGame/match.js';
import { saveMatch } from '../End/endGame.js';
import { leaveRoom } from '../rooms.js';
import { OT, state, MF } from '../SharedBuild/enums.js'

export const tournament = {
	players: [],		// [{id, name, socket, ready ...}]
	matches: [],		// { matchNumber: 1, match: matchObj }
	state: 'waiting',	// 'in_progress' 'finished'
	io: null			// will be set when handleTournament is first called
};

// Helper to format the state for the frontend
function getTournamentStateForFrontend() {
	// console.log(`tournament matches:`, tournament.matches);
	return {
		players: tournament.players.map(p => ({ id: p.id, name: p.name, ready: p.ready })),
		matches: tournament.matches.map(m => ({
			matchNumber: m.matchNumber,
			state: m.match.state,
			player1: m.match.player1.ID,
			player2: m.match.player2.ID,
			winnerID: m.match.winnerID
		})),
		state: tournament.state
	};
}

function joinTournament(msg, userId, socket, io) {
	if (tournament.state !== 'waiting' && !tournament.players.find(p => p.id === userId)) {
		console.log('Tournament already in progress, cannot join');
		socket.emit('message', {
			action: 'tournament',
			subaction: 'joinRejected',
			reason: 'Tournament already in progress'
		});
		return;
	} else if (tournament.players.find(p => p.id === userId)) {
		const player = tournament.players.find(p => p.id === userId);
		if (!player.socket) {
			player.socket = socket; // Reassign socket if player was disconnected
			player.ready = false;
			console.log('Player re-joined tournament:', msg.name, userId);
		}
	}

	socket.join('tournament_1');
	// Add player to the tournament if not already present
	if (!tournament.players.find(p => p.id === userId)) {
		tournament.players.push({ id: userId, name: msg.name, socket: socket, ready: false });
	}

	// Broadcast updated state to all participants
	io.to('tournament_1').emit('message', {
		action: 'tournament',
		subaction: 'update',
		tournamentState: getTournamentStateForFrontend()
	});

	// Print in console for debugging
	console.log('Player joined tournament:', msg.name, userId, getTournamentStateForFrontend());

	if (isTournamentReadyToStart()) {
		console.log('Tournament starting now!');
		tournament.state = 'in_progress';
	} else {
		console.log('Tournament waiting for more players...');
	}
}


export function leaveTournament(msg, userId, socket, io) {
	if (tournament.state === 'waiting') {
		leaveRoom(socket, 'tournament_1');
		tournament.players = tournament.players.filter(p => p.id !== userId);
		// Broadcast updated state to all participants
		io.to('tournament_1').emit('message', {
			action: 'tournament',
			subaction: 'update',
			tournamentState: getTournamentStateForFrontend()
		});
		socket.emit('message', {
			action: 'tournament',
			subaction: 'left'
		});
		// Confirm leaving and trigger frontend navigation

		// Print in console for debugging
		console.log('Player left tournament:', msg.name, userId, getTournamentStateForFrontend());
	} else if (tournament.state === 'in_progress') {
		// Player tries to leave during an ongoing tournament
		// Option 1: Forfeit the tournament (set them as lost)
		const player = tournament.players.find(p => p.id === userId);
		if (player) {
			player.ready = true;	// Mark as ready to create matches
			player.socket = null;	// Mark as disconnected
			leaveRoom(socket, 'tournament_1');
		}
		socket.emit('message', {
			action: 'tournament',
			subaction: 'left'
		});
		let allLeft = true;
		tournament.players.forEach(p => {
			if (p.socket) {
				allLeft = false;
			}
		});
		if (allLeft) {
			// Reset tournament if all players have left
			tournament.matches = [];
			tournament.state = 'waiting';
			console.log('All players left, resetting tournament.');
		}
		// Print in console for debugging
		console.log('Player left tournament (forfeit):', msg.name, userId, getTournamentStateForFrontend());
	} else if (tournament.state === 'finished') {
		// Allow leaving after tournament is finished
		leaveRoom(socket, 'tournament_1');
		tournament.players = tournament.players.filter(p => p.id !== userId);
		// Broadcast updated state to all participants
		if (tournament.players.length === 0) {
			// Reset tournament if all players have left
			tournament.matches = [];
			tournament.state = 'waiting';
			console.log('All players left, resetting tournament.');
		}
		socket.emit('message', {
			action: 'tournament',
			subaction: 'left'
		});
		// Print in console for debugging
		console.log('Player left tournament:', msg.name, userId, getTournamentStateForFrontend());
	} else {
		// -> customAlert player they can't leave / lose the tournament
		console.log('Tournament already in progress, cannot leave');

	}
}



async function createTournamentMatch(player1, player2, matchNumber, io) {
	if (!player1 || !player2) {
		console.error("Tournament error => player(s) not found");
	}
	if (!player1.ready || !player2.ready) {
		console.log("Tournament: players not ready");
		return;
	}
	if (tournament.matches.find(m => m.matchNumber === matchNumber)) {
		console.log("Tournament: match already created");
		return;
	}

	let matchId = null;
	let match = null;

	if (!player1.socket) {
		console.log(`Player ${player1.name} disconnected, cannot start match.`);
		matchId = await createMatch(db, OT.Online, player2.socket, player1.id, player2.id, null, MF.Tournament);
		if (matchId === -1) {
			console.log("createTournamentMatch (!player1.socket) - Error in CreateMatch");
			return ;
		}
		match = matches.get(matchId);
		match.winnerID = player2.id;
		match.state = state.End;
		player1.ready = true;
		player2.ready = false;
		saveMatch(matchId);
	} else if (!player2.socket) {
		console.log(`Player ${player2.name} disconnected, cannot start match.`);
		matchId = await createMatch(db, OT.Online, player1.socket, player1.id, player2.id, null, MF.Tournament);
		if (matchId === -1) {
			console.log("createTournamentMatch (!player2.socket) - Error in CreateMatch");
			return ;
		}
		match = matches.get(matchId);
		match.winnerID = player1.id;
		match.state = state.End;
		player1.ready = false;
		player2.ready = true;
		saveMatch(matchId);
	} else {
		console.log(`Creating Tournament Match ${matchNumber}: ${player1.name} socket: ${player1.socket.id} vs ${player2.name} socket: ${player2.socket.id}`);
		matchId = await startOnlineMatch(db, player1.socket, player2.socket, player1.id, player2.id, io, null, MF.Tournament);
		player1.ready = false;
		player2.ready = false;
	}

	tournament.matches.push({ matchNumber: matchNumber, match: matches.get(matchId) });

	// Notify all tournament participants in the room
	io.to('tournament_1').emit('message', {
		action: 'tournament',
		subaction: 'update',
		tournamentState: getTournamentStateForFrontend(),
	});
}


export function reportTournamentMatchResult(match) {
	try {
		// console.log('reportTournamentMatchResult called!');

		// console.log('MatchOnline: ', match);
		// console.log('Match[0]: ', tournament.matches[0]);

		const matchIndex = tournament.matches.findIndex(m => m.match.player1.ID === match.player1.ID && m.match.player2.ID === match.player2.ID);
		if (matchIndex === -1) {
			console.error(`No tournament match found..`);
			return;
		}
		console.log('MatchIndex: ', matchIndex, ' MatchObj: ', tournament.matches[matchIndex]);
		tournament.matches[matchIndex].match.state = state.End;

		console.log('Tournament Matches length :', tournament.matches.length);
		// Set tournament.state = 'finished' when all matches are done
		let allFinished = true;
		tournament.matches.forEach(m => {
			console.log(`Match ${m.matchNumber} state: ${m.match.state}`);
			if (!m.match.winnerID) {
				allFinished = false;
			}
		});
		if (allFinished && tournament.matches.length === 4) {
			console.log("Tournament finished!");
			setTimeout(() => {
				tournament.state = 'finished';
				tournament.io.to('tournament_1').emit('message', {
					action: 'tournament',
					subaction: 'update',
					tournamentState: getTournamentStateForFrontend()
				});
			}, 4000);

		}
		// if (tournament.matches.length === 4 && tournament.matches.every(m => m.match.state === state.End)) {
		// 	console.log("Tournament finished!");
		// 	tournament.state = 'finished';
		// }

		// Broadcast updated state to frontend
		tournament.io.to('tournament_1').emit('message', {
			action: 'tournament',
			subaction: 'update',
			tournamentState: getTournamentStateForFrontend()
		});
	} catch (error) {
		console.error('Error in reportTournamentMatchResult:', error);
	}
}

export function isTournamentReadyToStart() {
	if (tournament.players.length === 4) {
		return true;
	}
	return false;
}

async function startFirstTournamentMatches(io) {
	// console.log('Starting for players: ', tournament.players.id, tournament.players.name);
	// Create Match 1: p1 vs p2
	await createTournamentMatch(tournament.players[0], tournament.players[1], 1, io);
	// Create Match 2: p3 vs p4
	await createTournamentMatch(tournament.players[2], tournament.players[3], 2, io);
}

export async function triggerNextTournamentMatch(tournamentId, io) {
	// Check if both Game 1 and Game 2 are finished

	if (!tournament.matches[0].match.winnerID || !tournament.matches[1].match.winnerID) {
		console.log("Both initial matches not finished yet.");
		console.log("match 1 state:", tournament.matches[0].match.state, "match 2 state:", tournament.matches[1].match.state);
		console.log('enum state.End:', state.End);
		return;
	} else {
		console.log("Both initial matches finished.");
		tournament.matches[0].match.state = state.End;
		tournament.matches[1].match.state = state.End;
	}

	const game1 = tournament.matches.find(m => m.matchNumber === 1);
	const game2 = tournament.matches.find(m => m.matchNumber === 2);

	// Schedule Game 3 (losers) if not already scheduled and both games finished
	if (!tournament.matches.find(m => m.matchNumber === 3)) {
		const loser1ID = game1.match.winnerID === game1.match.player1.ID ? game1.match.player2.ID : game1.match.player1.ID;
		const loser2ID = game2.match.winnerID === game2.match.player1.ID ? game2.match.player2.ID : game2.match.player1.ID;

		const player1 = tournament.players.find(p => p.id === loser1ID);
		const player2 = tournament.players.find(p => p.id === loser2ID);

		console.log('Scheduling Game 3 (losers):', player1.name, 'vs', player2.name);
		await createTournamentMatch(player1, player2, 3, io);
	}

	// Schedule Game 4 (winners) if not already scheduled and both games finished
	if (!tournament.matches.find(m => m.matchNumber === 4)) {
		const winner1ID = game1.match.winnerID;
		const winner2ID = game2.match.winnerID;

		const player1 = tournament.players.find(p => p.id === winner1ID);
		const player2 = tournament.players.find(p => p.id === winner2ID);

		await createTournamentMatch(player1, player2, 4, io);
	}

	// After scheduling, broadcast updated state
	io.to('tournament_1').emit('message', {
		action: 'tournament',
		subaction: 'update',
		tournamentState: getTournamentStateForFrontend()
	});
}

export function handleTournament(db, msg, socket, io, userId) {
	if (!tournament.io)
		tournament.io = io;
	console.log('Tournament message:', JSON.stringify(msg));
	if (msg.subaction === 'join') {
		joinTournament(msg, userId, socket, io);
	} else if (msg.subaction === 'ready') {
		const player = tournament.players.find(p => p.id === userId);
		if (player) {
			player.ready = true;
			if (tournament.matches.length < 2) {
				startFirstTournamentMatches(io);
			}
			else {
				triggerNextTournamentMatch(null, io) //pass tournamentId
			}
		}
	} else if (msg.subaction === 'notReady') {
		const player = tournament.players.find(p => p.id === userId);
		if (player) {
			player.ready = false;
		}
	} else if (msg.subaction === 'getState') {
		socket.emit('message', {
			action: 'tournament',
			subaction: 'update',
			tournamentState: getTournamentStateForFrontend()
		});

		// Print in console for debugging
		console.log('Player updated tournament:', msg.name, userId, getTournamentStateForFrontend());
	} else if (msg.subaction === 'leave') {
		leaveTournament(msg, userId, socket, io);
	}
}
