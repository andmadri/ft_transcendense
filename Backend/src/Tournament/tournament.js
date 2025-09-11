import { createMatch } from '../InitGame/match.js';
import { db } from '../index.js';

export const tournament = {
	players: [], // [{id, name, socketId, ...}]
	matches: [], // { matchNumber: 1, player1, player2, winner, loser, matchId }
	state: 'waiting', // 'in_progress' 'finished'
};

// Helper to format the state for the frontend
function getTournamentStateForFrontend() {
	return {
		players: tournament.players.map(p => ({ id: p.id, name: p.name })),
		matches: tournament.matches.map(m => ({
			matchNumber: m.matchNumber,
			player1: m.player1,
			player2: m.player2,
			player1Name: tournament.players.find(p => p.id === m.player1)?.name || 'TBD',
			player2Name: tournament.players.find(p => p.id === m.player2)?.name || 'TBD',
			winner: m.winner,
			winnerName: tournament.players.find(p => p.id === m.winner)?.name || '',
			finished: m.finished || false
		})),
		state: tournament.state
	};
}

export function handleTournament(db, msg, socket, io, userId) {
	console.log('Tournament message:', msg);
	if (msg.subaction === 'join') {
		socket.join('tournament_1');
		// Add player to the tournament if not already present
		if (!tournament.players.find(p => p.id === userId)) {
			tournament.players.push({ id: userId, name: msg.name, socketId: socket.id });
		}

		// Broadcast updated state to all participants
		io.to('tournament_1').emit('message', {
			action: 'tournament',
			subaction: 'update',
			tournamentState: getTournamentStateForFrontend()
		});
	} else if (msg.subaction === 'getState') {
		socket.emit('message', {
			action: 'tournament',
			subaction: 'update',
			tournamentState: getTournamentStateForFrontend()
		});
	}
}

async function createTournamentMatch(player1Id, player2Id, matchNumber, io) {
	const matchId = await createMatch(
		db,
		'tournament',
		io,
		player1Id,
		player2Id,
		{ tournamentId: 1, matchNumber }
	);
	
	// Notify all tournament participants in the room
	io.to('tournament_1').emit('tournamentMatchStart', {
		matchId,
		matchNumber,
		player1: player1Id,
		player2: player2Id
	});
	return (matchId);
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

export async function triggerNextTournamentMatch(tournamentId, io) {
	// Check if both Game 1 and Game 2 are finished
	const game1 = tournament.matches.find(m => m.matchNumber === 1);
	const game2 = tournament.matches.find(m => m.matchNumber === 2);

	// Schedule Game 3 (losers) if not already scheduled and both games finished
	if (game1?.finished && game2?.finished && !tournament.matches.find(m => m.matchNumber === 3)) {
		const loser1 = game1.loser;
		const loser2 = game2.loser;
		const matchId = await createTournamentMatch(loser1, loser2, 3, io);
		tournament.matches.push({ matchNumber: 3, player1: loser1, player2: loser2, matchId });
	}

	// Schedule Game 4 (winners) if not already scheduled and both games finished
	if (game1?.finished && game2?.finished && !tournament.matches.find(m => m.matchNumber === 4)) {
		const winner1 = game1.winner;
		const winner2 = game2.winner;
		const matchId = await createTournamentMatch(winner1, winner2, 4, io);
		tournament.matches.push({ matchNumber: 4, player1: winner1, player2: winner2, matchId });
	}

	// Set tournament.state = 'finished' when all matches are done
	if (tournament.matches.length === 4 && tournament.matches.every(m => m.finished)) {
		tournament.state = 'finished';
	}
	
	// After scheduling or finishing, broadcast state
	io.to('tournament_1').emit('message', {
		action: 'tournament',
		subaction: 'update',
		tournamentState: getTournamentStateForFrontend()
	});
}
