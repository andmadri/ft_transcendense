const SVG_NS = "http://www.w3.org/2000/svg";

type PiePart = { label: string; value: number; color?: string; className?: string };

function el<K extends keyof SVGElementTagNameMap>(
	name: K,
	attrs: Record<string, string> = {}
): SVGElementTagNameMap[K] {
	const node = document.createElementNS(SVG_NS, name);
	for (const [k, v] of Object.entries(attrs))
		node.setAttribute(k, String(v));
	return node;
}

function polar(cx: number, cy: number, r: number, angle: number)
{
	return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

function arcPath(cx: number, cy: number, r: number, start: number, end: number )
{
	const s = polar(cx, cy, r, start);
	const e = polar(cx, cy, r, end);
	const sweep = 1;
	const largeArc = (end - start) % (Math.PI * 2) > Math.PI ? 1 : 0;
	return `M ${s.x} ${s.y} A ${r} 0 ${largeArc} ${sweep} ${e.x} ${e.y}`;
}

export function renderPie(
	container: HTMLElement,
	parts: PiePart[],
	opts?: {
		radius?: number;		// donut radius
		thickness?: number;		// stroke width
		startAngleDeg?: number;	// where to start, 0 = 3 o'clock
		ariaLabel?: string;
		totalText?: string;		// shown in the middle
	}
): SVGElement {
	const radius = opts?.radius ?? 36;
	const thickness = opts?.thickness ?? 18;
	const startAngle = ((opts?.startAngleDeg ?? -90) * Math.PI) / 180; // 12 o'clock

	const total = parts.reduce((s, p) => s + Math.max(0, p.value), 0);

	const svg = el("svg", {
		viewBox: "0 0 100 100",
		role: "img",
		"aria-label": opts?.ariaLabel ?? "Pie chart",
	});
	
	const g = el("g", { transform: "translate(50,50)" });

	//Background ring
	const bg = el("circle", { r: String(radius) });
	bg.setAttribute("fill", "none");
	bg.setAttribute("stroke", "#2b2a27");
	bg.setAttribute("stroke-width", String(thickness))
	g.appendChild(bg);

	if (total > 0) {
		let a = startAngle;
		for (const p of parts)
		{
			if (p.value <= 0)
				continue ;

			const slice = (p.value / total) * Math.PI * 2;
			const path = el("path", {
				d: arcPath(0, 0, radius, a, a + slice),
				class: `slice ${p.className ?? ""}`.trim(),
			});

			// fallback inline color so it renders even if CSS isn't wired yet
			if (p.color)
				path.setAttribute("stroke", p.color);
			path.setAttribute("fill", "none");
			path.setAttribute("stroke-width", String(thickness));
			path.setAttribute("stroke-linecap", "round");
			g.appendChild(path);
			a += slice;
		}
	}

	// Center text
	if (opts?.totalText)
	{
		const t = el("text", { class: "total", y: "4" });
		t.textContent = opts.totalText;
		g.appendChild(t);
	}

	svg.appendChild(g);
	container.appendChild(svg);
	return svg;
}
