// import { db } from '../index.js' // DELETE THIS LATER

export async function addFriend(db, user_id, friend_id) {
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

export function deleteFriend(db, user_id, friend_id) {
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