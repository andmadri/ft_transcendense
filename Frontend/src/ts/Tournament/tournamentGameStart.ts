import { Game, UI } from "../gameData.js";
import { navigateTo } from "../history.js";
import { getGameField } from "../Game/gameContent.js";
import { state } from '@shared/enums';
import { customAlert } from '../Alerts/customAlert.js';

export function tournamentGameStart(data: any) {
	Game.match.matchID = data.matchId;

	Game.match.player1.ID = data.player1;
	Game.match.player1.name = data.player1Name;

	Game.match.player2.ID = data.player2;
	Game.match.player2.name = data.player2Name;

	Game.match.state = state.Init;


	customAlert('Your tournament match is starting!'); //needed customAlert
	// Transition to game UI
	getGameField();
	navigateTo('Game');
}
