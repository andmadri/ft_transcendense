import { Game, UI } from "../gameData.js";
import { navigateTo } from "../history.js";
import { getGameField } from "../Game/gameContent.js";
import { state } from '@shared/enums';

export function tournamentGameStart(data: any) {
	Game.match.matchID = data.matchId;

	Game.match.player1.ID = data.player1;
	Game.match.player1.name = data.player1Name;

	Game.match.player2.ID = data.player2;
	Game.match.player2.name = data.player2Name;

	Game.match.state = state.Init;


	alert('Your tournament match is starting!');
	// Transition to game UI
	getGameField();
	navigateTo('Game');
}

