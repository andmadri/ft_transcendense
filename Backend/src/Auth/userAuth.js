import * as dbFunctions from '../Database/database.js';
import { db } from '../index.js';
import bcrypt from 'bcrypt';

function sendBackToFrontend(actionable, socket, accessible, reasonMsg) {
	const msg = {
		action: actionable,
		access: accessible,
		reason: reasonMsg
	}
	socket.send(JSON.stringify(msg));
}

function checkName(name) {
	const nameRegex = /^[a-zA-Z0-9_-]+$/;
	if (!name.length || name.length > 30)
		return false;
	return nameRegex.test(name);
}

function checkEmail(email) {
	const emailRegex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.[a-zA-Z]{2,}$/;
	if (email.length < 3 || email.length > 254)
		return false;
	return emailRegex.test(email);
}

function checkPassword(password) {
	const passwordRegex = /^\S+$/; // No whitespace allowed
	if (!password.length || password.length < 8 || password.length > 64)
		return false;
	return passwordRegex.test(password);
}

async function addUser(msg, socket) {
	if (!checkName(msg.name))
		return sendBackToFrontend('signUpCheck', socket, "no", "No valid name");
	if (!checkEmail(msg.email))
		return sendBackToFrontend('signUpCheck', socket, "no", "No valid email");
	if (!checkPassword(msg.password))
		return sendBackToFrontend('signUpCheck', socket, "no", "No valid password");
	dbFunctions.userAlreadyExist(msg.email, (exists) => {
		if (exists)
			return sendBackToFrontend('signUpCheck', socket, "no", "User allready exist");
	});
		
	try {
		dbFunctions.addUserToDB(msg);
		return sendBackToFrontend('signUpCheck', socket, "no", "User created");
	} catch (err) {
		console.error(err);
		return sendBackToFrontend('error', socket, "no", "Error while inserting new user");
	}
}

function validateLogin(msg, socket) {
	dbFunctions.getUserByEmail(msg.email, (user) => {
		if (!user)
			return sendBackToFrontend('loginCheck', socket, "no", "User not found");
		const isValidPassword = bcrypt.compare(msg.password, user.password);
		if (!isValidPassword)
			return sendBackToFrontend('loginCheck', socket, "no", "Incorrect password");
	});

	dbFunctions.isOnline(msg.email, (online) => {
		dbFunctions.updateOnlineStatus(msg.email, !online);
	});
	return sendBackToFrontend('loginCheck', socket, "yes", "Login successful")
}

export async function handleUserAuth(msg, socket) {
	console.log("handleUserAuth function...", msg.action);
	if (msg.action == "signUpUser")
		return addUser(msg, socket);
	else if (msg.action == "loginUser")
		return validateLogin(msg, socket);
	return sendBackToFrontend('error', socket, "no", "Unkown action");
}


