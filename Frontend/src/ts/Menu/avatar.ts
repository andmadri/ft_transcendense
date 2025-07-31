import { log } from "../logging.js";

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
	} else {
		alert("Upload failed");
		log("Error with upload avatar");
	}
}
