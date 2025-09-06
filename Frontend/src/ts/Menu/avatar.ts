import { log } from "../logging.js";
import { Game, UI } from "../gameData.js";

export async function changeAvatar(file: File,  playerNr: number) {
	log("File: " + file.name + " " + file.size);

	const formData = new FormData();
	formData.append('avatar', file);

	const response = await fetch('/api/upload-avatar', {
		method: 'POST',
		body: formData
	});

	if (response.ok) {
		log("Upload succeeded!");
		const avatar = document.getElementById(`avatar${playerNr}`) as HTMLImageElement | null;
		if (!avatar) {
			console.log("No avatar yet");
			return ;
		}
		const user = playerNr == 1 ? UI.user1.ID : UI.user2.ID;
		avatar.src = `/api/avatar/${user}?ts=${Date.now()}`
	} else {
		alert("Upload failed:" + response.statusText);
		log("Error with upload avatar");
	}
}
