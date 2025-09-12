import { db } from '../index.js';
import { startOnlineMatch } from '../Pending/onlinematch.js';
import { matches } from '../InitGame/match.js';
import { state } from '../SharedBuild/enums.js';

export const tournament = {
	players: [], // [{id, name, socket, ready ...}]
	matches: [], // { matchNumber: 1, matchObj }
	state: 'waiting', // 'in_progress' 'finished'
};

// Helper to format the state for the frontend
function getTournamentStateForFrontend() {
	return {
		players: tournament.players.map(p => ({ id: p.id, name: p.name })),
		matches: tournament.matches,
		state: tournament.state
	};
}

function joinTournament(msg, userId, socket, io) {
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

	if (isTournamentReadyToStart()) {
		console.log('Tournament starting now!');
		tournament.state = 'in_progress';
		startFirstTournamentMatches(io);
	} else {
		console.log('Tournament waiting for more players...');
	}

	// Broadcast updated state to all participants
	io.to('tournament_1').emit('message', {
		action: 'tournament',
		subaction: 'update',
		tournamentState: getTournamentStateForFrontend()
	});
	
	// Print in console for debugging
	console.log('Player joined tournament:', msg.name, userId, getTournamentStateForFrontend());
}


function leaveTournament(msg, userId, socket, io) {
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
	const matchId = startOnlineMatch(db, player1.socket, player2.socket, player1.id, player2.id, io); //probably nice to start using MF.Tournament / MF.singleGame now 
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


export async function reportTournamentMatchResult(tournamentId, matchNumber, match) {
	// Find the match in the tournament
	const tMatch = tournament.matches.find(m => m.matchNumber === matchNumber);
	if (!tMatch) return;

	// Update winner/loser
	const winnerId = match.player1.score > match.player2.score ? match.player1.ID : match.player2.ID;
	const loserId = match.player1.score > match.player2.score ? match.player2.ID : match.player1.ID;
	tMatch.winner = winnerId;
	tMatch.loser = loserId;
	tMatch.finished = true;

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
	console.log('Starting for players: ', tournament.players);
	// Create Match 1: p1 vs p2
	await createTournamentMatch(tournament.players[0], tournament.players[1], 1, io);
	// Create Match 2: p3 vs p4
	await createTournamentMatch(tournament.players[2], tournament.players[3], 2, io);

	const game1 = tournament.matches.find(m => m.matchNumber === 1);
	const game2 = tournament.matches.find(m => m.matchNumber === 2);

	if (game1 && game2) {
		triggerNextTournamentMatch(null, io) //pass tournamentId
	}
}

export async function triggerNextTournamentMatch(tournamentId, io) {
	// Check if both Game 1 and Game 2 are finished
	const game1 = tournament.matches.find(m => m.matchNumber === 1);
	const game2 = tournament.matches.find(m => m.matchNumber === 2);

	if (game1?.match.state !== state.End && game2?.match.state !== state.End) {
		return ;
	}

	// Schedule Game 3 (losers) if not already scheduled and both games finished
	if (!tournament.matches.find(m => m.matchNumber === 3)) {
		const loser1 = game1.loser;
		const loser2 = game2.loser;

		await createTournamentMatch(loser1, loser2, 3, io);
	}

	// Schedule Game 4 (winners) if not already scheduled and both games finished
	if (!tournament.matches.find(m => m.matchNumber === 4)) {
		const winner1 = game1.winner;
		const winner2 = game2.winner;
		
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
	console.log('Tournament message:', JSON.stringify(msg));
	if (msg.subaction === 'join') {
		joinTournament(msg, userId, socket, io);
	} else if (msg.subaction === 'ready') {
		const player = tournament.players.find(p => p.id === userId);
		if (player) {
			player.ready = true;
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
