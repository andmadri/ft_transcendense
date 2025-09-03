import { Game, UI } from "../gameData.js";
import { OT, state } from '@shared/enums'
import { pauseBallTemporarily } from "./gameLogic.js";

function getKey(keyContent: string) {
	const key = document.createElement('div');
	key.style.width = '10vh';
	key.style.height = '6vh';
	key.style.display = 'flex';
	key.style.justifyContent = 'center';
	key.style.alignItems = 'center';
	key.style.fontFamily = '"Horizon", monospace';
	key.style.fontSize = '2vh';
	key.style.lineHeight = '1';
	key.style.padding = '0';
	key.style.borderRadius = '0.8rem';
	key.style.border = '0.15rem solid black';
	key.style.backgroundColor = '#ededeb';
	key.style.boxShadow = '0.25rem 0.375rem 0.625rem rgba(0,0,0,0.3)';
	key.style.overflow = 'hidden';
	key.style.textOverflow = 'ellipsis';
	key.style.whiteSpace = 'nowrap';
	key.textContent = keyContent;
	return (key);
}

function getPlayerColom(playerNr: number) {
	const player = document.createElement('div');
	player.style.textAlign = 'center';
	player.style.flex = '1';
	player.style.minWidth = '150px';
	player.style.display = 'flex';
	player.style.flexDirection = 'column';
	player.style.alignItems = 'center';
	player.style.border = '';

	const avatar = document.createElement('img');
	avatar.style.width = 'clamp(80px, 20vw, 150px)';
	avatar.style.height = 'clamp(80px, 20vw, 150px)';
	avatar.style.borderRadius = '50%';
	avatar.style.border = '2px solid black';
	avatar.style.marginBottom = '10px';
	avatar.style.objectFit = 'cover';
	avatar.id = 'avatarStart' + playerNr;
	const userId = playerNr === 1 ? Game.match.player1.ID : Game.match.player2.ID;
	avatar.src = `/api/avatar/${userId}?ts=${Date.now()}`;

	const username = document.createElement('div');
	username.style.fontWeight = 'bold';
    username.style.marginBottom = '20px';
	username.id = 'usernameStart' + playerNr;
	username.textContent = playerNr === 1 ?Game.match.player1.name : Game.match.player2.name;

	const keys = document.createElement('div');
    keys.style.display = 'flex';
    keys.style.flexDirection = 'column';
    keys.style.alignItems = 'center';
    keys.style.gap = '15px';

	if (Game.match.mode == OT.ONEvsCOM) {
		if (playerNr == 1) {
			keys.append(getKey('UP'), getKey('DOWN'));
		} else {
			keys.append(getKey(''), getKey(''));
		}
	} else if (playerNr == 1) {
		keys.append(getKey('W'), getKey('S'));
	} else {
		keys.append(getKey('UP'), getKey('DOWN'));
	}

	player.append(avatar, username, keys);
	return (player);
}

export function startGameField(duration : number) {
	const startGame = document.createElement('div');
	startGame.id = 'startGame';
	startGame.style.display = 'flex';
	startGame.style.flexDirection = 'column';
	startGame.style.alignItems = 'center';
	startGame.style.backgroundColor = 'transparent';
	startGame.style.fontFamily = '"Horizon", monospace';
	startGame.style.textAlign = 'center';
	startGame.style.position = 'absolute';
	startGame.style.background = 'linear-gradient(90deg, #ff6117, #ffc433, #ffc433)';
	startGame.style.width = '80%';
	startGame.style.height = '40%';
	startGame.style.zIndex = '1000';
	startGame.style.borderRadius = '0.8rem';
	startGame.style.border = '0.15rem solid black';
	startGame.style.padding = '5%';
	startGame.style.top = '10%';
	startGame.style.left = '50%';
	startGame.style.transform = 'translateX(-50%)';

	const txtstartGame = document.createElement('div');
	txtstartGame.style.width = '100%';
	txtstartGame.style.height = '20%';
	txtstartGame.style.flex = '0 0 20%';
	txtstartGame.textContent = "READY?";
	txtstartGame.style.color = 'transparent';
	txtstartGame.style.fontSize = '6vw'
	txtstartGame.style.justifyContent = "center";
	txtstartGame.style.alignItems = "center";
	txtstartGame.style.webkitTextStroke = '0.2rem #000';

	const style = document.createElement('style');
    style.textContent = `
    @keyframes pulse {
        0% { font-size: 6vw; }
        50% { font-size: 8vw; }
        100% { font-size: 6vw; }
    }`;
    document.head.appendChild(style);
    txtstartGame.style.animation = 'pulse 1s ease-in-out infinite';
	setTimeout(() => {
    	txtstartGame.textContent = "GO!";
	}, duration * 0.75); //3000

	const players = document.createElement('div');
	players.style.display = 'flex';
	players.style.flexDirection = 'row';
	players.style.justifyContent = 'center';
	players.style.alignItems = 'center';
	players.style.gap = '30vw';
	const player1Colum = getPlayerColom(1);
	const player2Colum = getPlayerColom(2);
	players.append(player1Colum, player2Colum);

	startGame.append(txtstartGame, players);

	const body = document.getElementById('body');
	if (!body)
		return ;
	body.style.display = 'flex';
	body.style.justifyContent = 'center';
	body.style.alignItems = 'center';
	body.style.height = '100vh';
	body.appendChild(startGame);

	setTimeout(() => {
		startGame.style.display = "none";
		pauseBallTemporarily(duration * 0.25); //1000
	}, duration); //4000
}
