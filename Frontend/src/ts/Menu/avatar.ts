import { UI } from "../gameData.js";
import { customAlert } from '../Alerts/customAlert.js';

export async function changeAvatar(file: File, playerNr: number) {
	console.log(`File: ${file.name} ${file.size}`);

	const formData = new FormData();
	formData.append('avatar', file);

	const response = await fetch('/api/upload-avatar', {
		method: 'POST',
		body: formData
	});

	if (response.ok) {
		console.log("Upload succeeded!");
		const avatar = document.getElementById(`avatar${playerNr}`) as HTMLImageElement | null;
		if (!avatar) {
			console.warn("No avatar yet");
			return;
		}
		const user = playerNr == 1 ? UI.user1.ID : UI.user2.ID;
		avatar.src = `/api/avatar/${user}?ts=${Date.now()}`
	} else {
		customAlert("Upload failed: " + response.statusText);
		console.error('UPLOAD_ERROR', 'Error with upload avatar', 'changeAvatar'); 
	}
}
