import { log } from "../logging.js";

export async function changeAvatar(file: File,  playerNr: number) {
	log("File: " + file.name + " " + file.size);
	if (file.size > 5000) {
		alert("File is to big");
		return ;
	}

	const formData = new FormData();
	formData.append('avatar', file);

	const response = await fetch('/api/upload-avatar', {
		method: 'POST',
		body: formData
	});

	if (response.ok) {
		console.log("Upload successed!");
	} else {
		alert("Upload failed");
		console.error("Error with upload avatar");
	}
}
