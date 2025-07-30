import React, { useState } from 'react';
import './LoginSignup.css';
import user_icon from '../Assets/login-avatar.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/padlock.png';


function LoginSignUp() {
	const [action, setAction] = useState("Sign Up");
	return(
		// <div className="container">
		// 	<div className="header">
		// 		<div className="text">{action}</div>
		// 		<div className="underline"></div>
		// 	</div>
		// 	<div className="inputs">
		// 		{action==="Login"?<div></div>:<div className="input">
		// 			<img src={user_icon} alt="" />
		// 			<input type="text" placeholder="Name"/>
		// 		</div>}
		// 		<div className="input">
		// 			<img src={email_icon} alt="" />
		// 			<input type="email" placeholder="Email id"/>
		// 		</div>
		// 		<div className="input">
		// 			<img src={password_icon} alt="" />
		// 			<input type="password" placeholder="Password"/>
		// 		</div>
		// 	</div>
		// 	<div className="submitContainer">
		// 		<div className={action==="Login"?"submit gray":"submit"} onClick={()=>{setAction("Sign Up")}}>SignUp</div>
		// 		<div className={action==="Sign Up"?"submit gray":"submit"} onClick={()=>{setAction("Login")}}>Login</div>
		// 	</div>
		// </div>

	<div className="mainContainer">
		<div className="loginSignUpContainer">
			<div className="header">
				<div className="header1Text">{action}</div>
			</div>
			<div className="inputMultiple">
				{action==='Login'? null : (
				<div className="inputSingle">
					<label htmlFor="username">Username</label>
					<div className="inputWithIcon">
						{/* <img src={user_icon} alt="" /> */}
						<input type="text" placeholder=""/>
					</div>
				</div>
				)}
			<div className='inputSingle'>
				<label htmlFor="email">Email</label>
				<div className="inputWithIcon">
					{/* <img src={email_icon} alt="" /> */}
					<input type="email" placeholder="" />
				</div>
			</div>
			<div className='inputSingle'>
				<label htmlFor="password">Password</label>
				<div className="inputWithIcon">
					{/* <img src={password_icon} alt="" /> */}
					<input type="password" placeholder="" />
				</div>
			</div>
			<div className="submitButtonContainer">
				<div className="submitButton">Sign Up</div>
			</div>
			{/* <p className="GooglePrompt">or via social network</p> */}
			<p className="loginSignUpPrompt">
				Have an account? <span className="loginSignUpLink">Login</span>
			</p>
			</div>
		</div>
		<div className="animationContainer">
			{Array.from({length: 8}).map((_, index: number) => (
				<div className="pongText" key={index}>Pong</div>
			))}
			<div className="ball"></div>
		</div>
	</div>
	)
}

export default LoginSignUp;