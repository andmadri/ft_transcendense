import React from 'react';

interface LoginProps {
	player: number;
	mandatory: boolean;
}

export default function LoginComponent({ player, mandatory }: LoginProps) {
	return (
		<div
			id={`auth${player}`}
			style={{
				backgroundColor: player === 2 ? 'lightgreen' : 'lightblue',
				width: '50%',
				height: '100%',
				position: 'relative',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				zIndex: 999,
			}}
		>
		<h2 id={`authTitle${player}`}>Sign Up Player {player}</h2>
		<form id={`authForm${player}`}>
			<div className="formInput">
				<label htmlFor="name">Username: </label>
				<input type="text" id={`name${player}`} name="name" />
			</div>

			<div className="formInput">
				<label htmlFor="email">Email: </label>
				<input type="email" id={`email${player}`} name="email" />
			</div>

			<div id={`submitBtnDiv${player}`}>
				<button type="submit" id={`submitBtn${player}`}>
				Sign Up Player {player}
					</button>
					{!mandatory && (
						<button type="button" id={`guestBtn${player}`}>
							Guest
						</button>
					)}
				</div>
			</form>

			<p id={`modelabel${player}`}>Sign Up mode</p>

			<button type="button" id={`toggle-mode${player}`}>
				Switch to Login
			</button>

			<button
				type="button"
				id={`google-login-btn${player}`}
				onClick={() =>
					(window.location.href = `https://localhost:8443/api/auth/google?player=${player}`)
				}
			>
				Login with Google
			</button>
		</div>
	);
}
