
// Map a numeric domain to a pixel range (linear interpolation)
export function linearScale(domainMin, domainMax, rangeMin, rangeMax) {
	const d = (domainMax - domainMin) || 1; // avoid divide-by-zero
	const r = (rangeMax - rangeMin);
	return (value) => rangeMin + ((value - domainMin) / d) * r;
}

export function stepScale(indexMin, indexMaxExclusive, rangeMin, rangeMax) {
	// domain is [indexMin, indexMaxExclusive) — i.e., 0..N-1 when indexMin=0, indexMaxExclusive=N
	if (indexMaxExclusive <= indexMin) {
		throw new Error('stepScale: empty domain');
	}

	const n  = indexMaxExclusive - indexMin;             // number of bars
	const bw = (rangeMax - rangeMin) / n;                // bar width in pixels

	const scale = (i) => rangeMin + ((i - indexMin) + 0.5) * bw; // center of bar i
	scale.bandwidth    = bw;    // optional: expose bar width
	scale.centerOffset = bw/2;  // optional: expose center offset
	return scale;
}
