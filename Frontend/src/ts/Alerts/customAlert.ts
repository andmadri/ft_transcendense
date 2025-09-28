export function customAlert(message: string, duration: number = 3000) {
	// Create container
	let container = document.getElementById("custom-customAlert-container");
	if (!container) {
		container = document.createElement("div");
		container.id = "custom-customAlert-container";
		container.style.position = "fixed";
		container.style.top = "20px";
		container.style.right = "20px";
		container.style.display = "flex";
		container.style.flexDirection = "column";
		container.style.gap = "10px";
		container.style.zIndex = "9999";
		document.body.appendChild(container);
	}

	// Create the customAlert box
	const alertBox = document.createElement("div");
	alertBox.textContent = message;
	alertBox.style.background = "#333";
	alertBox.style.color = "white";
	alertBox.style.padding = "12px 20px";
	alertBox.style.borderRadius = "8px";
	alertBox.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
	alertBox.style.fontSize = "14px";
	alertBox.style.opacity = "0";
	alertBox.style.transition = "opacity 0.3s ease-in-out";

	container.appendChild(alertBox);

	// Fade in
	requestAnimationFrame(() => {
		alertBox.style.opacity = "1";
	});

	// Auto-remove after duration
	setTimeout(() => {
		alertBox.style.opacity = "0";
		alertBox.addEventListener("transitionend", () => {
			alertBox.remove();
			if (container && container.children.length === 0) {
				container.remove();
			}
		});
	}, duration);
}
