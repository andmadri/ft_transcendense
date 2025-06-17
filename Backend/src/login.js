import { db } from './database.js'

function checkName(name) {
	if (name.length > 30)
		return false;
	return true;
}

function checkEmail(email) {
	if (email.length > 50)
		return false;
	return true;
}

function checkPassword(password) {
	if (password.length > 50)
		return false;
	return true;
}

function sendBackToFrontend(connection, accessLogin, reasonMsg) {
	const msg = {
		action: "loginCheck",
		access: accessLogin,
		reason: reasonMsg
	}
	connection.socket.send(JSON.stringify(msg));
}

function addUser(msg) {
	const insert = db.prepare(`
		INSERT INTO Users (name, email)
		VALUES (?, ?)
	`);
	insert.run(msg.name, msg.email);
}

function existInDB(msg) {
	const dbinfo = db.prepare(`
		SELECT name, email
		FROM Users
		WHERE email = ?
	`);

	const user = dbinfo.get(msg.email);
	if (user)
		return true;
	else
		return false;
}

export function loginCheck(msg, connection) {
	if (!checkName(msg.name))
		return sendBackToFrontend(connection, "no", "No valid name");
	if (!checkEmail(msg.email))
		return sendBackToFrontend(connection, "no", "No valid email");
	if (!checkPassword(msg.password))
		return sendBackToFrontend(connection, "no", "No valid password");
	
	if (existInDB(msg)) {
		return sendBackToFrontend(connection, "ok", "User allready exist");
	} else {
		addUser(msg);
		return sendBackToFrontend(connection, "ok", "User created");
	}
}