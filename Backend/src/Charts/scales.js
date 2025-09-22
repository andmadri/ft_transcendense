
// Map a numeric domain to a pixel range (linear interpolation)
export function linearScale(domainMin, domainMax, rangeMin, rangeMax) {
	const d = (domainMax - domainMin) || 1; // avoid divide-by-zero
	const r = (rangeMax - rangeMin);
	return (value) => rangeMin + ((value - domainMin) / d) * r;
}
