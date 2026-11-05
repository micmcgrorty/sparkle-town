import { clientEntry, css, on } from "remix/component";
import type { Handle } from "remix/component";

import { pop, twinkle } from "../../ui/public/sounds.ts";
import { speak } from "../../ui/public/speak.ts";

const BODIES = [
	{ id: "white", label: "White", colour: "#ffffff", shade: "#e9e2f2" },
	{ id: "pink", label: "Pink", colour: "#ffd3e6", shade: "#f5b3cf" },
	{ id: "lilac", label: "Lilac", colour: "#e3d4ff", shade: "#c9b2f5" },
	{ id: "mint", label: "Mint", colour: "#cff7e6", shade: "#a8e6cb" },
	{ id: "sky", label: "Sky", colour: "#d3efff", shade: "#a9dbf7" },
	{ id: "gold", label: "Gold", colour: "#ffefb3", shade: "#f2d77a" },
];

const MANES = [
	{ id: "rainbow", label: "Rainbow", colours: ["#ff6b8b", "#ffb347", "#ffe066", "#7be495", "#74c0fc", "#b197fc"] },
	{ id: "candy", label: "Candy", colours: ["#ff5fa2", "#ff9fcf", "#ffd1e8"] },
	{ id: "galaxy", label: "Galaxy", colours: ["#6c4ad6", "#9b6bff", "#4a7bd6", "#c7a4ff"] },
	{ id: "ocean", label: "Ocean", colours: ["#2bb5e8", "#7fe3ff", "#3cc4a8"] },
	{ id: "sunshine", label: "Sunshine", colours: ["#ffc93c", "#ff8a3d", "#ffe58a"] },
];

const HORNS = [
	{ id: "gold", label: "Gold", colours: ["#ffd23f", "#f0a500"] },
	{ id: "silver", label: "Silver", colours: ["#eef2f7", "#a9b4c2"] },
	{ id: "rainbow", label: "Rainbow", colours: ["#ff9fcf", "#9fd9ff"] },
];

const EXTRAS = [
	{ id: "none", label: "Nothing", emoji: "🚫" },
	{ id: "crown", label: "Crown", emoji: "👑" },
	{ id: "flowers", label: "Flowers", emoji: "🌸" },
	{ id: "bow", label: "Bow", emoji: "🎀" },
];

const PLACES = [
	{ id: "castle", label: "Castle", emoji: "🏰" },
	{ id: "clouds", label: "Clouds", emoji: "☁️" },
	{ id: "night", label: "Night sky", emoji: "🌙" },
	{ id: "meadow", label: "Meadow", emoji: "🌷" },
];

const TITLES = ["Princess", "Queen", "Lady", "Captain", "Little", "Sir", "Duchess"];
const FIRST = ["Sparkle", "Twinkle", "Rainbow", "Cupcake", "Glitter", "Moonbeam", "Starlight", "Bubblegum", "Snowflake", "Sprinkles", "Marshmallow", "Lollipop", "Candyfloss", "Shimmer"];
const SECOND = ["Hooves", "Toes", "Mane", "Dream", "Heart", "Shine", "Wings", "Cloud", "Puff", "Sugar", "Sparkle-Bum", "Giggles"];

const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

const styles = css({
	display: "grid",
	gap: "18px",
	"@media (min-width: 860px)": { gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)", alignItems: "start" },
	"& .stage": {
		position: "relative",
		borderRadius: "var(--radius)",
		border: "6px solid var(--tone)",
		boxShadow: "var(--shadow)",
		overflow: "hidden",
	},
	"& .stage svg": { display: "block", width: "100%", height: "auto" },
	"& .unicorn": { animation: "uni-bob 2.6s ease-in-out infinite" },
	"& .tail": { transformBox: "fill-box", transformOrigin: "0% 30%", animation: "uni-tail 2s ease-in-out infinite" },
	"& .sparkle": { animation: "uni-sparkle 1.2s ease-in-out infinite" },
	"& .name": {
		padding: "10px 16px",
		background: "#fff",
		borderTop: "4px solid var(--tone)",
		fontSize: "clamp(20px, 4vw, 28px)",
		fontWeight: 700,
		textAlign: "center",
		color: "var(--tone)",
	},
	"& .controls": { display: "grid", gap: "14px" },
	"& .group": { background: "var(--surface)", borderRadius: "20px", border: "3px solid var(--rule)", padding: "12px 14px" },
	"& .group h2": { margin: "0 0 8px", fontSize: "20px", color: "var(--muted)", fontWeight: 600 },
	"& .row": { display: "flex", flexWrap: "wrap", gap: "12px" },
	"& .choice": {
		display: "grid",
		placeItems: "center",
		minWidth: "54px",
		height: "54px",
		borderRadius: "999px",
		border: "4px solid #fff",
		boxShadow: "0 0 0 3px var(--rule)",
		cursor: "pointer",
		fontSize: "26px",
		lineHeight: 1,
		padding: "0 6px",
		background: "var(--surface)",
		touchAction: "manipulation",
	},
	"& .choice[aria-pressed='true']": { boxShadow: "0 0 0 5px var(--text)", transform: "scale(1.1)" },
	"& .buttons": { display: "flex", flexWrap: "wrap", gap: "12px" },
	"& .big": {
		flex: "1 1 auto",
		minHeight: "64px",
		padding: "0 22px",
		border: 0,
		borderRadius: "999px",
		background: "var(--tone)",
		color: "#fff",
		fontSize: "22px",
		fontWeight: 700,
		cursor: "pointer",
		boxShadow: "0 5px 0 rgba(0,0,0,0.2)",
		touchAction: "manipulation",
	},
	"& .big.alt": { background: "var(--pink)" },
	"@keyframes uni-bob": {
		"0%, 100%": { transform: "translateY(0)" },
		"50%": { transform: "translateY(-8px)" },
	},
	"@keyframes uni-tail": {
		"0%, 100%": { transform: "rotate(-6deg)" },
		"50%": { transform: "rotate(8deg)" },
	},
	"@keyframes uni-sparkle": {
		"0%, 100%": { opacity: 0.2, transform: "scale(0.6)" },
		"50%": { opacity: 1, transform: "scale(1.2)" },
	},
});

function Background(handle: Handle<{ place: string }>) {
	return () => {
		let { place } = handle.props;
		if (place === "night") {
			return (
				<g>
					<rect width="400" height="360" fill="#2d2466" />
					{[[40, 40], [90, 90], [300, 50], [360, 120], [200, 30], [250, 100], [30, 150], [340, 200]].map(([x, y], i) => (
						<circle key={`star-${i}`} cx={x} cy={y} r={i % 3 === 0 ? 3 : 2} fill="#fff8c4" />
					))}
					<text x="340" y="70" font-size="48" text-anchor="middle">🌙</text>
					<ellipse cx="200" cy="350" rx="260" ry="50" fill="#3b2f80" />
				</g>
			);
		}
		if (place === "clouds") {
			return (
				<g>
					<rect width="400" height="360" fill="#bfe6ff" />
					{[[60, 70, 1], [320, 50, 1.2], [200, 120, 0.8]].map(([x, y, s], i) => (
						<g key={`cloud-${i}`} transform={`translate(${x} ${y}) scale(${s})`} fill="#fff">
							<circle cx="-25" cy="0" r="20" />
							<circle cx="0" cy="-10" r="26" />
							<circle cx="25" cy="0" r="20" />
							<rect x="-45" y="0" width="90" height="20" rx="10" />
						</g>
					))}
					<ellipse cx="200" cy="350" rx="260" ry="50" fill="#fff" />
				</g>
			);
		}
		if (place === "meadow") {
			return (
				<g>
					<rect width="400" height="360" fill="#d9f4ff" />
					<circle cx="340" cy="60" r="32" fill="#ffd84d" />
					<ellipse cx="200" cy="360" rx="300" ry="80" fill="#8fdc7a" />
					{[[40, 320], [90, 340], [330, 330], [370, 310], [300, 350]].map(([x, y], i) => (
						<text key={`flower-${i}`} x={x} y={y} font-size="28" text-anchor="middle">
							{["🌷", "🌼", "🌸"][i % 3]}
						</text>
					))}
				</g>
			);
		}
		// castle
		return (
			<g>
				<rect width="400" height="360" fill="#ffe3f1" />
				<g fill="#f7c6e0" transform="translate(280 70)">
					<rect x="0" y="40" width="100" height="140" />
					<rect x="-14" y="10" width="34" height="170" />
					<rect x="80" y="10" width="34" height="170" />
					<path d="M-18,10 L3,-30 L24,10 Z M76,10 L97,-30 L118,10 Z" fill="#c993ff" />
					<rect x="38" y="120" width="26" height="60" rx="13" fill="#c993ff" />
				</g>
				{[[60, 60], [150, 40], [40, 200]].map(([x, y], i) => (
					<path key={`spark-${i}`} d="M0,-10 L3,-3 L10,0 L3,3 L0,10 L-3,3 L-10,0 L-3,-3 Z" fill="#ffc93c" transform={`translate(${x} ${y})`} />
				))}
				<ellipse cx="200" cy="355" rx="260" ry="50" fill="#b9e9a5" />
			</g>
		);
	};
}

function Unicorn(
	handle: Handle<{
		body: (typeof BODIES)[number];
		mane: string[];
		horn: string[];
		extra: string;
		wings: boolean;
	}>,
) {
	return () => {
		let { body, mane, horn, extra, wings } = handle.props;
		let m = (i: number) => mane[i % mane.length];
		let stroke = "#5b4a73";
		let line = { stroke, "stroke-width": "4", "stroke-linejoin": "round" as const, "stroke-linecap": "round" as const };
		return (
			<g class="unicorn">
				<ellipse cx="210" cy="338" rx="120" ry="12" fill="rgba(0,0,0,0.12)" />
				{/* tail */}
				<g class="tail">
					{[0, 1, 2, 3, 4].map((i) => (
						<circle key={`tail-${i}`} cx={318 + i * 9} cy={200 + i * 18} r={22 - i * 2} fill={m(i)} {...line} />
					))}
				</g>
				{/* back legs */}
				<rect x="250" y="250" width="30" height="80" rx="14" fill={body.shade} {...line} />
				<rect x="150" y="250" width="30" height="80" rx="14" fill={body.shade} {...line} />
				{/* body */}
				<ellipse cx="225" cy="225" rx="105" ry="68" fill={body.colour} {...line} />
				{/* front legs */}
				<rect x="280" y="255" width="30" height="80" rx="14" fill={body.colour} {...line} />
				<rect x="175" y="255" width="30" height="80" rx="14" fill={body.colour} {...line} />
				{[175, 280].map((x) => (
					<path key={`hoof-${x}`} d={`M${x + 2},318 h26 v6 a10,10 0 0 1 -10,10 h-6 a10,10 0 0 1 -10,-10 z`} fill={horn[1]} />
				))}
				{wings ? (
					<g>
						<path d="M215,190 C190,120 250,90 300,110 C290,125 300,140 285,150 C295,160 285,180 265,180 C270,195 245,205 215,190 Z" fill="#fff" {...line} />
						<path d="M232,175 C245,150 265,135 290,125 M240,185 C255,170 270,165 282,162" fill="none" stroke={m(1)} stroke-width="4" stroke-linecap="round" />
					</g>
				) : null}
				{/* neck */}
				<path d="M120,150 C140,190 150,215 175,235 L215,190 C190,170 175,140 165,110 Z" fill={body.colour} />
				<path d="M120,150 C140,190 150,215 175,235" fill="none" {...line} />
				{/* head */}
				<ellipse cx="130" cy="120" rx="62" ry="52" fill={body.colour} {...line} />
				<ellipse cx="82" cy="140" rx="34" ry="28" fill={body.colour} {...line} />
				<ellipse cx="72" cy="140" rx="5" ry="3.5" fill={stroke} />
				<path d="M78,158 q10,6 20,0" fill="none" {...line} stroke-width="3" />
				{/* eye */}
				<ellipse cx="128" cy="112" rx="11" ry="14" fill="#3b2554" />
				<circle cx="132" cy="106" r="4.5" fill="#fff" />
				<path d="M120,96 l-6,-8 M128,94 l-2,-9 M136,96 l3,-8" {...line} stroke-width="3" />
				<ellipse cx="112" cy="138" rx="12" ry="7" fill="#ff9fc4" opacity="0.7" />
				{/* ear */}
				<path d="M160,78 L178,48 L184,90 Z" fill={body.colour} {...line} />
				<path d="M168,78 L177,60 L180,84 Z" fill="#ffc2dc" />
				{/* mane */}
				{[
					[168, 72, 18],
					[186, 92, 20],
					[192, 120, 20],
					[198, 148, 19],
					[206, 175, 17],
					[148, 68, 16],
				].map(([x, y, r], i) => (
					<circle key={`mane-${i}`} cx={x} cy={y} r={r} fill={m(i)} {...line} />
				))}
				<circle cx="134" cy="70" r="16" fill={m(2)} {...line} />
				{/* horn */}
				<path d="M128,66 L150,62 L128,4 Z" fill={horn[0]} {...line} />
				<path d="M131,50 L146,47 M134,34 L143,32 M136,20 L140,19" stroke={horn[1]} stroke-width="4" stroke-linecap="round" />
				{extra === "crown" ? (
					<text x="170" y="60" font-size="44" text-anchor="middle" transform="rotate(14 170 60)">
						👑
					</text>
				) : null}
				{extra === "flowers" ? (
					<g font-size="28" text-anchor="middle">
						<text x="112" y="74">🌸</text>
						<text x="152" y="62">🌼</text>
						<text x="178" y="84">🌸</text>
					</g>
				) : null}
				{extra === "bow" ? (
					<text x="230" y="214" font-size="40" text-anchor="middle">
						🎀
					</text>
				) : null}
			</g>
		);
	};
}

function Row(
	handle: Handle<{
		title: string;
		items: { id: string; label: string; colour?: string; colours?: string[]; emoji?: string }[];
		selected: string;
		onPick: (id: string) => void;
	}>,
) {
	return () => {
		let props = handle.props;
		return (
			<div class="group" role="group" aria-label={props.title}>
				<h2>{props.title}</h2>
				<div class="row">
					{props.items.map((item) => (
						<button
							key={item.id}
							type="button"
							class="choice"
							aria-label={item.label}
							aria-pressed={props.selected === item.id ? "true" : "false"}
							style={
								item.colour || item.colours
									? {
											background: item.colours
												? `conic-gradient(${[...item.colours, item.colours[0]].join(", ")})`
												: item.colour,
										}
									: undefined
							}
							mix={on("click", () => props.onPick(item.id))}
						>
							{item.emoji ?? ""}
						</button>
					))}
				</div>
			</div>
		);
	};
}

export const UnicornMaker = clientEntry(import.meta.url, function UnicornMaker(handle: Handle) {
	let bodyId = "white";
	let maneId = "rainbow";
	let hornId = "gold";
	let extra = "crown";
	let place = "castle";
	let wings = false;
	let name = "Princess Sparkle Hooves";
	let sparkles = 0;
	let sparkleTimer: ReturnType<typeof setTimeout> | undefined;

	handle.signal.addEventListener("abort", () => clearTimeout(sparkleTimer));

	function changed() {
		pop();
		handle.update();
	}

	return () => {
		let body = BODIES.find((b) => b.id === bodyId)!;
		let mane = MANES.find((m) => m.id === maneId)!.colours;
		let horn = HORNS.find((h) => h.id === hornId)!.colours;
		return (
			<div mix={styles}>
				<div class="stage">
					<svg viewBox="0 0 400 360" role="img" aria-label={`A unicorn called ${name}`}>
						<Background place={place} />
						<g transform="translate(-10 22) scale(0.94)">
							<Unicorn body={body} mane={mane} horn={horn} extra={extra} wings={wings} />
						</g>
						{sparkles > 0
							? [[60, 80], [330, 160], [120, 260], [260, 60], [360, 280], [40, 220]].map(([x, y], i) => (
									<g key={`sparkle-${sparkles}-${i}`} transform={`translate(${x} ${y})`}>
										<path
											class="sparkle"
											d="M0,-14 L4,-4 L14,0 L4,4 L0,14 L-4,4 L-14,0 L-4,-4 Z"
											fill="#ffd23f"
											stroke="#fff"
											stroke-width="2"
											style={{ animationDelay: `${i * 0.15}s`, transformBox: "fill-box", transformOrigin: "center" }}
										/>
									</g>
								))
							: null}
					</svg>
					<div class="name" aria-live="polite">
						✨ {name} ✨
					</div>
				</div>

				<div class="controls">
					<Row
						title="Colour"
						items={BODIES}
						selected={bodyId}
						onPick={(id) => {
							bodyId = id;
							changed();
						}}
					/>
					<Row
						title="Mane and tail"
						items={MANES}
						selected={maneId}
						onPick={(id) => {
							maneId = id;
							changed();
						}}
					/>
					<Row
						title="Horn"
						items={HORNS}
						selected={hornId}
						onPick={(id) => {
							hornId = id;
							changed();
						}}
					/>
					<Row
						title="Dress up"
						items={EXTRAS}
						selected={extra}
						onPick={(id) => {
							extra = id;
							changed();
						}}
					/>
					<Row
						title="Where?"
						items={PLACES}
						selected={place}
						onPick={(id) => {
							place = id;
							changed();
						}}
					/>
					<div class="buttons">
						<button
							type="button"
							class="big alt"
							aria-pressed={wings ? "true" : "false"}
							mix={on("click", () => {
								wings = !wings;
								twinkle();
								handle.update();
							})}
						>
							{wings ? "🪽 Wings off" : "🪽 Add wings"}
						</button>
						<button
							type="button"
							class="big"
							mix={on("click", () => {
								let next = name;
								while (next === name) next = `${pick(TITLES)} ${pick(FIRST)} ${pick(SECOND)}`;
								name = next;
								sparkles++;
								twinkle();
								speak(`Your unicorn is called ${name}!`);
								handle.update();
								clearTimeout(sparkleTimer);
								let shown = sparkles;
								sparkleTimer = setTimeout(() => {
									if (sparkles !== shown) return;
									sparkles = 0;
									handle.update();
								}, 3000);
							})}
						>
							✨ Magic name
						</button>
					</div>
				</div>
			</div>
		);
	};
});
