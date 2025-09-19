
export function drawTitle(canvas, margins, text) {
	const x = canvas.width / 2;
	const y = Math.max(48, margins.top * 0.62);

	return `<text x="${x}" y="${y}"
			text-anchor="middle"
			font-family="Horizon"
			font-size="48"
			fill="none"
			stroke="#ffffff"
			stroke-width="1.6"
			paint-order="stroke"
			>${escapeXML(text)}
			</text>`;
}

export function drawXAxisTitle(plot, label) {
	// const x = plot.x + (plot.width / 5 * 4);
	const x = 925;
	const y = plot.y + plot.height + 30;

	return `<text
			x="${x}" y="${y}"
			text-anchor="end"
			dominant-baseline="hanging"
			font-family="RobotoCondensed, sans-serif"
			font-size="26"
			fill="#ffffff"
			>${escapeXML(label)}
			</text>`;
}

export function drawYAxisTitle(plot, label) {
	const tx = plot.x - 55;
	// const ty = plot.y + (plot.height / 20 * 3);
	const ty = 110;

	return `<g transform="translate(${tx}, ${ty}) rotate(-90)">
			<text
			text-anchor="end"
			dominant-baseline="middle"
			font-family="RobotoCondensed, sans-serif"
			font-size="26"
			fill="#ffffff"
			>${escapeXML(label)}
			</text>
			</g>`;
}

function escapeXML(s) {
	return String(s)
		.replace(/&/g,'&amp;').replace(/</g,'&lt;')
		.replace(/>/g,'&gt;').replace(/"/g,'&quot;')
		.replace(/'/g,'&apos;');
}
