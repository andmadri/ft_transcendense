import * as dbFunctions from '../Database/database.js';
import { db } from '../index.js';
import bcrypt from 'bcrypt';

function sendBackToFrontend(actionable, socket, accessible, reasonMsg, user, player) {
	const msg = {
		action: actionable,
		access: accessible,
		reason: reasonMsg
	}
	if (user) {
		msg.userId = user.id;
		msg.userName = user.name;
	}
	if (player) {
		msg.player = player;
	}
	socket.send(JSON.stringify(msg));
}

function checkName(name) {
	const nameRegex = /^[a-zA-Z0-9_-]+$/;
	if (!name.length)
		return ("Name can not be empty");
	else if (name.length > 30)
		return ("Name is too long");
	else if (!nameRegex.test(name))
		return ("Name has forbidden characters");
	return (null);
}

function checkEmail(email) {
	const emailRegex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.[a-zA-Z]{2,}$/;
	if (!email.length)
		return ("Email can not be empty");
	else if (email.length < 3)
		return ("Email is too short");
	else if (email.length > 254)
		return ("Email is too long");
	else if (!emailRegex.test(email))
		return ("Email has no @ and dot or forbidden characters");
	return (null);
}

function checkPassword(password) {
	const passwordRegex = /^\S+$/;
	if (!password.length)
		return ("Password can not be empty");
	else if (password.length < 8)
		return ("Password has less than 8 characters");
	else if (password.length > 64)
		return ("Password is too long");
	else if (!passwordRegex.test(password))
		return ("Password contains whitespace");
	return (null);
}

async function addUser(msg, socket) {
	let errorMsg;
	
	errorMsg = checkName(msg.name);
	if (errorMsg)
		return sendBackToFrontend('signUpCheck', socket, "no", errorMsg);
	errorMsg = checkEmail(msg.email);
	if (errorMsg)
		return sendBackToFrontend('signUpCheck', socket, "no", errorMsg);
	errorMsg = checkPassword(msg.password);
	if (errorMsg)
		return sendBackToFrontend('signUpCheck', socket, "no", errorMsg);
	try {
		const exists = await dbFunctions.userAlreadyExist(msg.email);
		if (exists)
			return sendBackToFrontend('signUpCheck', socket, "no", "User allready exist");
		await dbFunctions.addUserToDB(msg);
		console.log("User: ", msg.name, " is created");
		return sendBackToFrontend('signUpCheck', socket, "yes", "User created", '', msg.playerLogin);
	}
	catch(err) {
		console.error(err);
		return sendBackToFrontend('error', socket, "no", "Error while inserting new user");
	}
}

async function validateLogin(msg, socket) {
	let user;

	try {
		user = await dbFunctions.getUserByEmail(msg.email);
	}
	catch (err) {
		console.error("Error with getting user by email");
	}
	if (!user || !user.password)
		return sendBackToFrontend('loginCheck', socket, "no", "User not found");

	const isValidPassword = await bcrypt.compare(msg.password, user.password);
	if (!isValidPassword)
		return sendBackToFrontend('loginCheck', socket, "no", "Incorrect password");

	try {
		const online = await dbFunctions.isOnline(msg.email, (online));
		await dbFunctions.updateOnlineStatus(msg.email, !online);
	}
	catch(err) {
		console.error(err.msg);
	}
	return sendBackToFrontend('loginCheck', socket, "yes", "Login successful", user, msg.player)
}

export async function handleUserAuth(msg, socket) {
	console.log("handleUserAuth function...", msg.action);
	if (msg.action == "signUpUser")
		return addUser(msg, socket);
	else if (msg.action == "loginUser")
		return validateLogin(msg, socket);
	return sendBackToFrontend('error', socket, "no", "Unkown action");
}


