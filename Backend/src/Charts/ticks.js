import { linearScale } from './scales.js';

// Evenly-spaced numeric ticks (e.g., 0, 0.25, 0.5, 0.75, 1)
export function ticksLinear(domainMin, domainMax, count = 5) {
	if (count < 2)
		return [domainMin, domainMax];
	const step = (domainMax - domainMin) / (count - 1);
	const out = [];
	for (let i = 0; i < count; i++) {
		out.push(domainMin + i * step);
	}
	return out;
}

// Evenly-spaced numeric ticks (e.g., 0, 0.25, 0.5, 0.75, 1)
export function ticksStep(domainMin, domainMax, count = 5) {
	if (count < 2)
		return [domainMin, domainMax];
	const step = (domainMax - domainMin) / (count - 1);
	const center = step / 2;
	const out = [];
	for (let i = 0; i < count; i++) {
		if (i === 0) {
			// out.push(domainMin + i * step);
			;
		} else {
			out.push(domainMin - center + i * step);
		}
	}
	return out;
}

// Number formatter (removes trailing zeros)
export function formatNumber(n, decimals = 2) {
	const s = Number(n).toFixed(decimals);
	return s.replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
}

export function drawGridLines(plot, ticks, scale, orientation) {
	const stroke = '#ffffff';
	const opacity = 0.12;

	const x1 = plot.x;
	const x2 = plot.x + plot.width;
	const y1 = plot.y;
	const y2 = plot.y + plot.height;

	const items = ticks.map((t, i) => {
		if (i === 0) {
			return '';
		}

		if (orientation === 'x') {
			const x = scale(t);
			return `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}"
				stroke="${stroke}" stroke-opacity="${opacity}"
				stroke-width="3" />`;
		} else {
			const y = scale(t);
			return `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}"
				stroke="${stroke}" stroke-opacity="${opacity}"
				stroke-width="3" />`;
		}
	}).join('');

	return `<g class="grid-${orientation}">${items}</g>`;
}

export function drawXAxisTicks(plot, domainMin, domainMax, numberOfTicks, gridLines = false, linear = true, decimals = 2) {
	const labelFormat = (v) => formatNumber(v, decimals);

	const xScale = linearScale(domainMin, domainMax, plot.x, plot.x + plot.width - 1);
	const ticks = (linear === true)
		? ticksLinear(domainMin, domainMax, numberOfTicks)
		: ticksStep(domainMin, domainMax, numberOfTicks);
	const baseY  = plot.y + plot.height;

	let grid = '';
	if (gridLines === true) {
		grid = drawGridLines(plot, ticks, xScale, 'x');
	}

	const parts = ticks.map((t) => {
		const x = xScale(t);
		return `
		<g transform="translate(${x}, ${baseY})">
			<line x1="0" y1="0" x2="0" y2="6" stroke="#ffffff" stroke-width="3"/>
			<text y="21"
				text-anchor="middle"
				dominant-baseline="middle"
				font-family="RobotoCondensed, sans-serif"
				font-size="14"
				fill="#ffffff">${labelFormat(t)}</text>
		</g>`;
	}).join('');

	return `<g class="axis-x">${grid}<g class="axis-x-ticks">${parts}</g></g>`;
}

export function drawYAxisTicks(plot, domainMin, domainMax, numberOfTicks, gridLines = false, linear = true, decimals = 2) {
	const labelFormat  = (v) => formatNumber(v, decimals);

	const yScale = linearScale(domainMin, domainMax, plot.y + plot.height, plot.y + 1);
	const ticks = (linear === true)
		? ticksLinear(domainMin, domainMax, numberOfTicks)
		: ticksStep(domainMin, domainMax, numberOfTicks);
	const baseX  = plot.x;

	let grid = '';
	if (gridLines === true) {
		grid = drawGridLines(plot, ticks, yScale, 'y');
	}

	const parts = ticks.map((t) => {
		const y = yScale(t);
		return `
		<g transform="translate(${baseX}, ${y})">
			<line x1="0" y1="0" x2="-6" y2="0" stroke="#ffffff" stroke-width="3"/>
			<text x="-16"
				text-anchor="end"
				dominant-baseline="middle"
				font-family="RobotoCondensed, sans-serif"
				font-size="14"
				fill="#ffffff">${labelFormat(t)}</text>
		</g>`;
	});

	return `<g class="axis-y">${grid}<g class="axis-y-ticks">${parts}</g></g>`;
}
