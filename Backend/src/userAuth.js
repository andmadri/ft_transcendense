import * as dbFunctions from './database.js';
import { db } from './index.js';
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
	if (dbFunctions.userAlreadyExist(msg.email)) {
		//we are not stopped here
		return sendBackToFrontend('signUpCheck', socket, "no", "User allready exist");
	}
	const hashedPassword = await bcrypt.hash(msg.password, 10);
	try {
		const insert = db.prepare(`
			INSERT INTO Users (name, email, password)
			VALUES (?, ?, ?)
		`);
		insert.run(msg.name, msg.email, hashedPassword);
		return sendBackToFrontend('signUpCheck', socket, "yes", "User created");
	} catch (err) {
		console.error(err);
		return sendBackToFrontend('error', socket, "no", "Error while inserting new user");
	}
}

async function validateLogin(msg, socket) {
	const user = dbFunctions.getUserRowByEmail(msg.email);
	if (!user || !user.name)
		return sendBackToFrontend('loginCheck', socket, "no", "User not found");
	console.log(`user password: ${msg.password}, encrypted password: ${user.password}`);
	const isValidPassword = await bcrypt.compare(msg.password, user.password);
	if (!isValidPassword)
		return sendBackToFrontend('loginCheck', socket, "no", "Incorrect password");
	dbFunctions.updateStatus(msg.email, !dbFunctions.isOnline(msg.email))
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


