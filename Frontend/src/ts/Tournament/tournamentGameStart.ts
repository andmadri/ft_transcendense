import { Game, UI } from "../gameData.js";
import { navigateTo } from "../history.js";
import { getGameField } from "../Game/gameContent.js";
import { state } from '@shared/enums';

function tournamentGameStart(data: any) {
	Game.match.matchID = data.matchId;
	Game.match.player1.ID = data.player1;
	Game.match.player2.ID = data.player2;
	Game.match.state = state.Init;

	// Optionally set player names if provided
	if (data.player1Name) Game.match.player1.name = data.player1Name;
	if (data.player2Name) Game.match.player2.name = data.player2Name;

	// Transition to game UI
	navigateTo('Game');
	getGameField();
}