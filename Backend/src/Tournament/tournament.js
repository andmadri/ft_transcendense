import { db } from '../index.js';
import { startOnlineMatch } from '../Pending/onlinematch.js';
import { matches } from '../InitGame/match.js';
import { state, MF } from '../SharedBuild/enums.js';

export const tournament = {
	players: [],		// [{id, name, socket, ready ...}]
	matches: [],		// { matchNumber: 1, matchObj }
	state: 'waiting',	// 'in_progress' 'finished'
	io: null			// will be set when handleTournament is first called
};

// Helper to format the state for the frontend
function getTournamentStateForFrontend() {
	return {
		players: tournament.players.map(p => ({ id: p.id, name: p.name })),
		matches: tournament.matches.filter(m => m.match.state === state.End).map(m => ({
			matchNumber: m.matchNumber,
			player1: m.match.player1.ID,
			player2: m.match.player2.ID,
			winnerID: m.match.winnerID
		})),
		state: tournament.state
	};
}

function sendTournamentMatchResult() {
	return {

	}
}

function joinTournament(msg, userId, socket, io) {
	if (tournament.players.find(p => p.id === userId)) {
		socket.emit('message', {
		action: 'tournament',
		subaction: 'update',
		tournamentState: getTournamentStateForFrontend()
	});
	}
	if (tournament.state !== 'waiting') {
		console.log('Tournament already in progress, cannot join');
		socket.emit('message', {
			action: 'tournament',
			subaction: 'joinRejected',
			reason: 'Tournament already in progress'
		});
		return ;
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
		socket.leave('tournament_1');
		tournament.players = tournament.players.filter(p => p.id !== userId);
		// Broadcast updated state to all participants
		io.to('tournament_1').emit('message', {
			action: 'tournament',
			subaction: 'update',
			tournamentState: getTournamentStateForFrontend()
		});
	} else {
		console.log('Tournament already in progress, cannot leave');

	}

	// Confirm leaving and trigger frontend navigation
	socket.emit('message', {
		action: 'tournament',
		subaction: 'left'
	});

	// Print in console for debugging
	console.log('Player left tournament:', msg.name, userId, getTournamentStateForFrontend());
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

	console.log(`Creating Tournament Match ${matchNumber}: ${player1.name} socket: ${player1.socket.id} vs ${player2.name} socket: ${player2.socket.id}`);

	const matchId = await startOnlineMatch(db, player1.socket, player2.socket, player1.id, player2.id, io, null, MF.Tournament); //probably nice to start using MF.Tournament / MF.singleGame now

	tournament.matches.push({ matchNumber: matchNumber, match: matches.get(matchId)});

	// Notify all tournament participants in the room
	io.to('tournament_1').emit('message', {
		action: 'tournament',
		subaction: 'matchStart',
		matchId,
		matchNumber,
		player1: player1.id,
		player2: player2.id
	});
}


export function reportTournamentMatchResult(match, io) {
	// Update winner/loser

	// Broadcast updated state
	io.to('tournament_1').emit('message', {
		action: 'tournament',
		subaction: 'update',
		tournamentState: getTournamentStateForFrontend()
	});
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

	const game1 = tournament.matches.find(m => m.matchNumber === 1);
	const game2 = tournament.matches.find(m => m.matchNumber === 2);

	if (game1 && game2) {
		tournament.players.forEach(player => {
			player.ready = false;
		})
		triggerNextTournamentMatch(null, io) //pass tournamentId
	}
}

export async function triggerNextTournamentMatch(tournamentId, io) {
	// Check if both Game 1 and Game 2 are finished
	const game1 = tournament.matches.find(m => m.matchNumber === 1);
	const game2 = tournament.matches.find(m => m.matchNumber === 2);

	if (game1?.match.state !== state.End || game2?.match.state !== state.End) {
		return ;
	}

	// Schedule Game 3 (losers) if not already scheduled and both games finished
	if (!tournament.matches.find(m => m.matchNumber === 3)) {
		const loser1 = game1.winnerID === game1.player1.ID ? game1.player2.ID : game1.player1.ID;
		const loser2 = game2.winnerID === game2.player1.ID ? game2.player2.ID : game2.player1.ID;

		await createTournamentMatch(loser1, loser2, 3, io);
	}

	// Schedule Game 4 (winners) if not already scheduled and both games finished
	if (!tournament.matches.find(m => m.matchNumber === 4)) {
		const winner1 = game1.winnerID;
		const winner2 = game2.winnerID;

		await createTournamentMatch(winner1, winner2, 4, io);
	}

	// Set tournament.state = 'finished' when all matches are done
	if (tournament.matches.length === 4 && tournament.matches.every(m => m.match.state.End)) {
		tournament.state = 'finished';
	}

	// After scheduling or finishing, broadcast state
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
			startFirstTournamentMatches(io);
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
