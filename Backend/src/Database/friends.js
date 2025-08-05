import { db } from '../index.js'

export async function getFriendsDB(user_id) {
	return new Promise((resolve, reject) => {
		db.all(
			`
			SELECT Users.name, Users.avatar_url, Users.online_status
			FROM Friends
			JOIN Users ON Friends.friend_id = Users.id
			WHERE Friends.user_id = ?
			`,
			[user_id],
			(err, rows) => {
				if (err)
					reject(err);
				else
					resolve(rows);
			}
		);
	});
}

export async function addFriend(user_id, friend_id) {
	return new Promise((resolve, reject) => {
		db.run(
			`INSERT INTO Friends (user_id, friend_id) VALUES (?, ?)`,
			[user_id, friend_id],
			(err) =>{
				if (err)
					reject(err);
				else
					resolve();
			}
		)
	})
}

export function deleteFriend(user_id, friend_id) {
	return new Promise((resolve, reject) => {
		db.run(
			`DELETE FROM Friends WHERE user_id = ? AND friend_id = ?`,
			[user_id, friend_id],
			function (err) {
				if (err)
					reject(err);
				else
					resolve();
			}
		)
	})
}