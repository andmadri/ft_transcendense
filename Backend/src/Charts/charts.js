
export function createSvgCanvas() {
	const width = 1000;
	const height = 600;
	const bg = '#363430';

	const open = `<?xml version="1.0" encoding="UTF-8"?>
		<svg xmlns="http://www.w3.org/2000/svg"
			width="${width}"
			height="${height}"
			viewBox="0 0 ${width} ${height}">
		<style>
			text { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
		</style>
		<rect x="0" y="0" width="${width}" height="${height}" fill="${bg}"/>
		`;

	const close = `</svg>`;

	return { width, height, open, close };
}


export function createPlotArea(canvas) {
	const margins = {
		top: 64,
		right: 24,
		bottom: 62,
		left: 80
	};

	const plot = {
		x: margins.left,
		y: margins.top,
		width: Math.max(0, canvas.width  - margins.left - margins.right),
		height: Math.max(0, canvas.height - margins.top  - margins.bottom)
	};

	return { margins, plot };
}


export function drawFrame(plot) {
	const fill = '#363430';
	const stroke = '#ffffff';
	const sw = 3;

	const bottomY = plot.y + plot.height;
	const rightX = plot.x + plot.width;

	return `<!-- plot background -->
			<rect x="${plot.x}" y="${plot.y}" width="${plot.width}" height="${plot.height}"
				fill="${fill}" stroke="none"/>

			<!-- left Y baseline -->
			<line x1="${plot.x}" y1="${plot.y}" x2="${plot.x}" y2="${bottomY}"
				stroke="${stroke}" stroke-width="${sw}"/>

			<!-- bottom X baseline -->
			<line x1="${plot.x}" y1="${bottomY}" x2="${rightX}" y2="${bottomY}"
				stroke="${stroke}" stroke-width="${sw}"/>
			`;
}
