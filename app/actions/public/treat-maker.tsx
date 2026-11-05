import { clientEntry, css, on } from "remix/component";
import type { Handle, RemixNode } from "remix/component";

import { cheer, pop, twinkle } from "../../ui/public/sounds.ts";
import { speak } from "../../ui/public/speak.ts";

type Mode = "cupcake" | "icecream" | "pie";

interface Option {
	id: string;
	label: string;
	colour: string;
}

// ---------- Cupcake options ----------

const CASES: Option[] = [
	{ id: "pink", label: "pink", colour: "#ff8fc1" },
	{ id: "blue", label: "blue", colour: "#6cc4ff" },
	{ id: "yellow", label: "yellow", colour: "#ffd84d" },
	{ id: "purple", label: "purple", colour: "#b28cff" },
	{ id: "green", label: "green", colour: "#6fe0a8" },
];

const CAKES: Option[] = [
	{ id: "vanilla", label: "vanilla", colour: "#f6d58e" },
	{ id: "chocolate", label: "chocolate", colour: "#7a4a2b" },
	{ id: "strawberry", label: "strawberry", colour: "#ff9fb0" },
];

const ICINGS: Option[] = [
	{ id: "pink", label: "pink", colour: "#ffb3d4" },
	{ id: "white", label: "white", colour: "#fffaf3" },
	{ id: "chocolate", label: "chocolate", colour: "#8b5a3c" },
	{ id: "blue", label: "blue", colour: "#9fd9ff" },
	{ id: "mint", label: "mint", colour: "#a8f0cf" },
	{ id: "rainbow", label: "rainbow", colour: "rainbow" },
];

const SPRINKLES = [
	{ id: "none", label: "no", emoji: "🚫" },
	{ id: "rainbow", label: "rainbow", emoji: "🌈" },
	{ id: "hearts", label: "heart", emoji: "💗" },
	{ id: "stars", label: "star", emoji: "⭐" },
];

const TOPPERS = [
	{ id: "none", label: "nothing", emoji: "🚫" },
	{ id: "cherry", label: "a cherry", emoji: "🍒" },
	{ id: "strawberry", label: "a strawberry", emoji: "🍓" },
	{ id: "candle", label: "a birthday candle", emoji: "🕯️" },
	{ id: "crown", label: "a crown", emoji: "👑" },
	{ id: "butterfly", label: "a butterfly", emoji: "🦋" },
];

// ---------- Ice cream options ----------

const FLAVOURS: Option[] = [
	{ id: "strawberry", label: "strawberry", colour: "#ff9fbf" },
	{ id: "chocolate", label: "chocolate", colour: "#8a5a3b" },
	{ id: "vanilla", label: "vanilla", colour: "#fff1c4" },
	{ id: "mint", label: "mint choc chip", colour: "#a6f0cf" },
	{ id: "blueberry", label: "blueberry", colour: "#9fa8ff" },
	{ id: "bubblegum", label: "bubblegum", colour: "#7fe3ff" },
	{ id: "lemon", label: "lemon", colour: "#ffe873" },
];

const HOLDERS = [
	{ id: "cone", label: "cone", emoji: "🍦" },
	{ id: "cup", label: "cup", emoji: "🥤" },
];

const ICE_TOPPINGS = [
	{ id: "none", label: "nothing on top", emoji: "🚫" },
	{ id: "flake", label: "a chocolate flake", emoji: "🍫" },
	{ id: "cherry", label: "a cherry", emoji: "🍒" },
	{ id: "sauce", label: "strawberry sauce", emoji: "🍓" },
	{ id: "sprinkles", label: "sprinkles", emoji: "🌈" },
];

const MAX_SCOOPS = 4;

// ---------- Pie options ----------

type PastryShape = "star" | "heart" | "moon" | "leaf" | "flower";

const PASTRY_SHAPES: { id: PastryShape; label: string; emoji: string }[] = [
	{ id: "star", label: "star", emoji: "⭐" },
	{ id: "heart", label: "heart", emoji: "❤️" },
	{ id: "moon", label: "moon", emoji: "🌙" },
	{ id: "leaf", label: "leaf", emoji: "🍃" },
	{ id: "flower", label: "flower", emoji: "🌼" },
];

// Where each pastry cut-out goes on the lid, in order.
const PIE_SLOTS: [number, number, number][] = [
	[200, 245, 0],
	[140, 215, -20],
	[260, 215, 20],
	[130, 280, 15],
	[270, 280, -15],
	[200, 190, 10],
	[200, 305, -10],
	[90, 248, 30],
	[310, 248, -30],
];

type PieStage = "decorate" | "baking" | "baked";

// ---------- Styles ----------

const styles = css({
	display: "grid",
	gap: "18px",
	"& .tabs": {
		display: "flex",
		flexWrap: "wrap",
		gap: "12px",
	},
	"& .tab": {
		display: "inline-flex",
		alignItems: "center",
		gap: "8px",
		minHeight: "60px",
		padding: "0 22px",
		borderRadius: "999px",
		border: "3px solid var(--rule)",
		background: "var(--surface)",
		fontSize: "22px",
		fontWeight: 600,
		cursor: "pointer",
		boxShadow: "0 4px 0 rgba(59, 37, 84, 0.12)",
		touchAction: "manipulation",
	},
	"& .tab[aria-selected='true']": {
		background: "var(--tone)",
		borderColor: "var(--tone)",
		color: "#fff",
	},
	"& .workbench": {
		display: "grid",
		gap: "18px",
		"@media (min-width: 820px)": { gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", alignItems: "start" },
	},
	"& .stage": {
		position: "relative",
		borderRadius: "var(--radius)",
		background: "linear-gradient(#fff3e3 0 72%, #ffd9b5 72% 100%)",
		border: "6px solid var(--tone)",
		boxShadow: "var(--shadow)",
		overflow: "hidden",
	},
	"& .stage svg": { display: "block", width: "100%", height: "auto" },
	"& .controls": { display: "grid", gap: "16px" },
	"& .group": {
		background: "var(--surface)",
		borderRadius: "20px",
		border: "3px solid var(--rule)",
		padding: "12px 14px",
	},
	"& .group h3": { margin: "0 0 10px", fontSize: "20px", color: "var(--muted)", fontWeight: 600 },
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
		transition: "transform 120ms ease",
	},
	"& .choice[aria-pressed='true']": { boxShadow: "0 0 0 5px var(--text)", transform: "scale(1.1)" },
	"& .buttons": { display: "flex", flexWrap: "wrap", gap: "12px" },
	"& .big": {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		gap: "8px",
		minHeight: "60px",
		padding: "0 24px",
		border: 0,
		borderRadius: "999px",
		background: "var(--tone)",
		color: "#fff",
		fontSize: "22px",
		fontWeight: 600,
		cursor: "pointer",
		boxShadow: "0 5px 0 rgba(0,0,0,0.18)",
		touchAction: "manipulation",
	},
	"& .big.secondary": { background: "var(--surface)", color: "var(--text)", boxShadow: "0 0 0 3px var(--rule), 0 5px 0 rgba(0,0,0,0.08)" },
	"& .big:disabled": { opacity: 0.5, cursor: "default" },
	"& .tada": {
		position: "absolute",
		left: "50%",
		top: "14px",
		transform: "translateX(-50%)",
		padding: "8px 20px",
		borderRadius: "999px",
		background: "var(--tone)",
		color: "#fff",
		fontSize: "24px",
		fontWeight: 700,
		whiteSpace: "nowrap",
		animation: "treat-bounce 600ms ease",
	},
	"& .oven": {
		position: "absolute",
		inset: 0,
		display: "grid",
		placeItems: "center",
		alignContent: "center",
		gap: "8px",
		background: "rgba(80, 40, 20, 0.75)",
		color: "#fff",
		fontSize: "30px",
		fontWeight: 700,
		textAlign: "center",
	},
	"& .oven .fire": { fontSize: "72px", animation: "treat-flicker 400ms ease-in-out infinite alternate" },
	"& .steam path": { animation: "treat-steam 2.4s ease-in-out infinite" },
	"& .steam path:nth-child(2)": { animationDelay: "0.6s" },
	"& .steam path:nth-child(3)": { animationDelay: "1.2s" },
	"& .wobble": { transformBox: "fill-box", transformOrigin: "center bottom", animation: "treat-wobble 2.6s ease-in-out infinite" },
	"@keyframes treat-bounce": {
		"0%": { transform: "translateX(-50%) scale(0.4)" },
		"60%": { transform: "translateX(-50%) scale(1.15)" },
		"100%": { transform: "translateX(-50%) scale(1)" },
	},
	"@keyframes treat-flicker": { from: { transform: "scale(1) rotate(-4deg)" }, to: { transform: "scale(1.12) rotate(4deg)" } },
	"@keyframes treat-steam": {
		"0%": { opacity: 0, transform: "translateY(10px)" },
		"40%": { opacity: 0.8 },
		"100%": { opacity: 0, transform: "translateY(-30px)" },
	},
	"@keyframes treat-wobble": {
		"0%, 100%": { transform: "rotate(-1.5deg)" },
		"50%": { transform: "rotate(1.5deg)" },
	},
});

// ---------- Drawing helpers ----------

const RAINBOW = ["#ff6b6b", "#ffb347", "#ffe066", "#7be495", "#74c0fc", "#b197fc"];

// Fixed, scattered positions so the sprinkles don't jump about between renders.
const SPRINKLE_SPOTS: [number, number, number][] = [
	[130, 222, 20], [165, 238, -30], [205, 230, 60], [245, 240, 10], [272, 220, -45],
	[150, 195, 75], [190, 182, -15], [228, 192, 35], [258, 180, -60], [175, 155, 45],
	[214, 150, -20], [198, 128, 80], [118, 236, -70], [286, 236, 30], [232, 160, 15],
];

function starPath(r: number, inner = r * 0.48): string {
	let points: string[] = [];
	for (let i = 0; i < 10; i++) {
		let radius = i % 2 === 0 ? r : inner;
		let angle = (Math.PI / 5) * i - Math.PI / 2;
		points.push(`${(Math.cos(angle) * radius).toFixed(1)},${(Math.sin(angle) * radius).toFixed(1)}`);
	}
	return `M${points.join("L")}Z`;
}

function Sprinkle(handle: Handle<{ kind: string; x: number; y: number; rotate: number; index: number }>) {
	return () => {
		let { kind, x, y, rotate, index } = handle.props;
		let colour = RAINBOW[index % RAINBOW.length];
		if (kind === "hearts") {
			return (
				<path
					d="M0,5 C-10,-3 -6,-12 0,-6 C6,-12 10,-3 0,5 Z"
					fill="#ff4f9a"
					transform={`translate(${x} ${y}) rotate(${rotate / 3})`}
				/>
			);
		}
		if (kind === "stars") {
			return <path d={starPath(8)} fill="#ffcf33" stroke="#e0a800" stroke-width="1" transform={`translate(${x} ${y}) rotate(${rotate})`} />;
		}
		return <rect x={-7} y={-2.5} width={14} height={5} rx={2.5} fill={colour} transform={`translate(${x} ${y}) rotate(${rotate})`} />;
	};
}

function Cupcake(handle: Handle<{ caseColour: string; cake: string; icing: string; sprinkles: string; topper: string }>) {
	return () => {
		let { caseColour, cake, icing, sprinkles, topper } = handle.props;
		let layer = (i: number) => (icing === "rainbow" ? RAINBOW[i * 2 % RAINBOW.length] : icing);
		let topperEmoji = TOPPERS.find((t) => t.id === topper)?.emoji;
		return (
			<g class="wobble">
				<ellipse cx="200" cy="378" rx="110" ry="12" fill="rgba(0,0,0,0.1)" />
				<path d="M100,250 L300,250 L276,372 L124,372 Z" fill={caseColour} />
				{[0, 1, 2, 3, 4, 5, 6].map((i) => {
					let topX = 115 + i * 28.5;
					let bottomX = 133 + i * 22.5;
					return <line key={`stripe-${i}`} x1={topX} y1={252} x2={bottomX} y2={370} stroke="rgba(255,255,255,0.55)" stroke-width="6" />;
				})}
				<ellipse cx="200" cy="250" rx="102" ry="20" fill={cake} />
				<ellipse cx="200" cy="228" rx="108" ry="38" fill={layer(0)} />
				<ellipse cx="200" cy="190" rx="84" ry="34" fill={layer(1)} />
				<ellipse cx="200" cy="155" rx="58" ry="28" fill={layer(2)} />
				<circle cx="200" cy="128" r="20" fill={layer(0)} />
				<ellipse cx="170" cy="215" rx="30" ry="9" fill="rgba(255,255,255,0.45)" />
				<ellipse cx="182" cy="178" rx="20" ry="7" fill="rgba(255,255,255,0.45)" />
				{sprinkles === "none"
					? null
					: SPRINKLE_SPOTS.map(([x, y, r], i) => <Sprinkle key={`sprinkle-${i}`} kind={sprinkles} x={x} y={y} rotate={r} index={i} />)}
				{topperEmoji && topper !== "none" ? (
					<text x="200" y="118" font-size="64" text-anchor="middle">
						{topperEmoji}
					</text>
				) : null}
			</g>
		);
	};
}

function IceCream(handle: Handle<{ holder: string; scoops: string[]; topping: string }>) {
	return () => {
		let { holder, scoops, topping } = handle.props;
		let base = 236;
		let step = 48;
		let topY = base - (scoops.length - 1) * step;
		let toppingY = scoops.length ? topY - 46 : base - 10;
		return (
			<g>
				<ellipse cx="200" cy="384" rx="70" ry="9" fill="rgba(0,0,0,0.1)" />
				{holder === "cone" ? (
					<g>
						<path d="M138,258 L262,258 L200,382 Z" fill="#e8a854" stroke="#c4822f" stroke-width="4" stroke-linejoin="round" />
						{[0, 1, 2, 3].map((i) => (
							<line key={`a${i}`} x1={150 + i * 28} y1={260} x2={200 + i * 9} y2={370 - i * 18} stroke="#c4822f" stroke-width="3" />
						))}
						{[0, 1, 2, 3].map((i) => (
							<line key={`b${i}`} x1={250 - i * 28} y1={260} x2={200 - i * 9} y2={370 - i * 18} stroke="#c4822f" stroke-width="3" />
						))}
					</g>
				) : (
					<g>
						<path d="M128,262 L272,262 L254,380 L146,380 Z" fill="#ff8fc1" />
						<path d="M128,262 L272,262 L268,288 L132,288 Z" fill="#fff" opacity="0.5" />
						<text x="200" y="345" font-size="34" text-anchor="middle">
							💖
						</text>
					</g>
				)}
				{scoops.length === 0 ? (
					<text x="200" y="200" font-size="22" text-anchor="middle" fill="#7a6690">
						Tap a flavour to add a scoop!
					</text>
				) : null}
				{scoops.map((id, i) => {
					let colour = FLAVOURS.find((f) => f.id === id)?.colour ?? "#fff";
					let cy = base - i * step;
					return (
						<g key={`scoop-${i}`}>
							<circle cx="200" cy={cy} r="58" fill={colour} />
							<path
								d={`M142,${cy + 14} q14,22 28,0 q14,26 30,0 q16,22 30,0 q14,20 28,0 L200,${cy + 4} Z`}
								fill={colour}
							/>
							<ellipse cx="178" cy={cy - 22} rx="18" ry="10" fill="rgba(255,255,255,0.45)" />
							{id === "mint"
								? [[-22, 10], [16, -8], [26, 20], [-6, 26], [-30, -12]].map(([dx, dy], j) => (
										<rect key={j} x={200 + dx} y={cy + dy} width="7" height="5" rx="1.5" fill="#4a2c1a" />
									))
								: null}
						</g>
					);
				})}
				{scoops.length && topping === "sauce" ? (
					<path
						d={`M150,${topY - 30} q25,-30 50,-28 q25,-2 50,28 q-6,26 -12,6 q-8,24 -16,2 q-10,26 -22,2 q-10,22 -18,0 q-10,20 -20,4 q-8,8 -12,-14 Z`}
						fill="#e8174f"
						opacity="0.9"
					/>
				) : null}
				{scoops.length && topping === "sprinkles"
					? SPRINKLE_SPOTS.slice(0, 10).map(([x, y, r], i) => (
							<Sprinkle key={`ice-sprinkle-${i}`} kind="rainbow" x={170 + ((x - 118) / 168) * 60} y={topY - 40 + ((y - 128) / 112) * 50} rotate={r} index={i} />
						))
					: null}
				{scoops.length && topping === "flake" ? (
					<g transform={`translate(232 ${topY - 70}) rotate(20)`}>
						<rect x="-9" y="0" width="18" height="70" rx="6" fill="#6b3d1f" />
						<path d="M-9,10 L9,14 M-9,26 L9,30 M-9,42 L9,46" stroke="#9a6234" stroke-width="3" />
					</g>
				) : null}
				{scoops.length && topping === "cherry" ? (
					<text x="200" y={toppingY + 12} font-size="56" text-anchor="middle">
						🍒
					</text>
				) : null}
			</g>
		);
	};
}

function PastryShapePath(handle: Handle<{ shape: PastryShape; fill: string; x: number; y: number; rotate: number }>) {
	return () => {
		let { shape, fill, x, y, rotate } = handle.props;
		let transform = `translate(${x} ${y}) rotate(${rotate})`;
		let stroke = "rgba(110, 60, 20, 0.45)";
		let common = { fill, stroke, "stroke-width": "3", "stroke-linejoin": "round" as const, transform };
		switch (shape) {
			case "star":
				return <path d={starPath(26)} {...common} />;
			case "heart":
				return <path d="M0,20 C-30,-2 -20,-30 0,-14 C20,-30 30,-2 0,20 Z" {...common} />;
			case "moon":
				return <path d="M8,-24 A24,24 0 1,0 8,24 A18,18 0 1,1 8,-24 Z" {...common} />;
			case "leaf":
				return (
					<g transform={transform}>
						<path d="M-28,0 Q0,-20 28,0 Q0,20 -28,0 Z" fill={fill} stroke={stroke} stroke-width="3" />
						<path d="M-22,0 L22,0 M-8,0 L0,-7 M6,0 L12,-6 M-8,0 L0,7 M6,0 L12,6" stroke={stroke} stroke-width="2.5" fill="none" />
					</g>
				);
			case "flower":
				return (
					<g transform={transform}>
						{[0, 72, 144, 216, 288].map((a) => (
							<ellipse key={a} cx="0" cy="-14" rx="10" ry="14" fill={fill} stroke={stroke} stroke-width="3" transform={`rotate(${a})`} />
						))}
						<circle r="8" fill={fill} stroke={stroke} stroke-width="3" />
					</g>
				);
		}
	};
}

function SteakPie(handle: Handle<{ decorations: PastryShape[]; glazed: boolean; stage: PieStage }>) {
	return () => {
		let { decorations, glazed, stage } = handle.props;
		let baked = stage === "baked";
		let pastry = baked ? (glazed ? "#d98b2b" : "#e0ac5e") : glazed ? "#f6dca0" : "#f8e6bd";
		let pastryEdge = baked ? (glazed ? "#b8681c" : "#c48a3c") : "#e7c98a";
		let crimps = Array.from({ length: 28 }, (_, i) => {
			let a = (Math.PI * 2 * i) / 28;
			return [200 + Math.cos(a) * 158, 248 + Math.sin(a) * 100] as const;
		});
		return (
			<g>
				<ellipse cx="200" cy="300" rx="186" ry="76" fill="rgba(0,0,0,0.1)" />
				{/* the dish */}
				<ellipse cx="200" cy="262" rx="182" ry="112" fill="#4f7fb8" />
				<ellipse cx="200" cy="256" rx="176" ry="106" fill="#e9f1fb" />
				{/* the pastry lid */}
				<ellipse cx="200" cy="248" rx="160" ry="100" fill={pastryEdge} />
				{crimps.map(([x, y], i) => (
					<circle key={`crimp-${i}`} cx={x} cy={y} r="12" fill={pastry} stroke={pastryEdge} stroke-width="2" />
				))}
				<ellipse cx="200" cy="248" rx="148" ry="90" fill={pastry} />
				{glazed ? <ellipse cx="160" cy="210" rx="70" ry="22" fill="rgba(255,255,255,0.35)" /> : null}
				{/* steam hole */}
				<ellipse cx="200" cy="248" rx="6" ry="4" fill="#6b3a1c" />
				{decorations.map((shape, i) => {
					let [x, y, r] = PIE_SLOTS[i % PIE_SLOTS.length];
					return <PastryShapePath key={`deco-${i}`} shape={shape} fill={pastry} x={x} y={y} rotate={r} />;
				})}
				{baked ? (
					<g class="steam" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="6" stroke-linecap="round">
						<path d="M170,130 q-14,-20 0,-40 q14,-20 0,-40" />
						<path d="M200,120 q-14,-20 0,-40 q14,-20 0,-40" />
						<path d="M230,130 q-14,-20 0,-40 q14,-20 0,-40" />
					</g>
				) : null}
			</g>
		);
	};
}

function ChoiceRow(
	handle: Handle<{
		label: string;
		items: { id: string; label: string; colour?: string; emoji?: string }[];
		selected: string;
		onPick: (id: string) => void;
	}>,
) {
	return () => {
		let { label, items, selected, onPick } = handle.props;
		return (
			<div class="group" role="group" aria-label={label}>
				<h3>{label}</h3>
				<div class="row">
					{items.map((item) => (
						<button
							key={item.id}
							type="button"
							class="choice"
							aria-label={item.label}
							aria-pressed={selected === item.id ? "true" : "false"}
							style={
								item.colour
									? {
											background:
												item.colour === "rainbow"
													? `conic-gradient(${RAINBOW.join(", ")}, ${RAINBOW[0]})`
													: item.colour,
										}
									: undefined
							}
							mix={on("click", () => onPick(item.id))}
						>
							{item.emoji ?? ""}
						</button>
					))}
				</div>
			</div>
		);
	};
}

function label(list: { id: string; label: string }[], id: string): string {
	return list.find((item) => item.id === id)?.label ?? id;
}

export const TreatMaker = clientEntry(import.meta.url, function TreatMaker(handle: Handle) {
	let mode: Mode = "cupcake";

	// cupcake
	let caseId = "pink";
	let cakeId = "vanilla";
	let icingId = "pink";
	let sprinkles = "rainbow";
	let topper = "cherry";

	// ice cream
	let holder = "cone";
	let scoops: string[] = ["strawberry"];
	let iceTopping = "none";

	// pie
	let decorations: PastryShape[] = [];
	let glazed = false;
	let pieStage: PieStage = "decorate";
	let bakeTimer: ReturnType<typeof setTimeout> | undefined;

	let tada = false;
	let tadaKey = 0;

	handle.signal.addEventListener("abort", () => clearTimeout(bakeTimer));

	function changed() {
		tada = false;
		pop();
		handle.update();
	}

	function describe(): string {
		if (mode === "cupcake") {
			let parts = [
				`You made a ${label(CAKES, cakeId)} cupcake in a ${label(CASES, caseId)} case`,
				`with ${label(ICINGS, icingId)} icing`,
			];
			if (sprinkles !== "none") parts.push(`${label(SPRINKLES, sprinkles)} sprinkles`);
			if (topper !== "none") parts.push(`and ${label(TOPPERS, topper)} on top`);
			return `${parts.join(", ")}. Yummy!`;
		}
		if (mode === "icecream") {
			if (scoops.length === 0) return "Your ice cream is empty! Tap a flavour to add a scoop.";
			let names = scoops.map((id) => label(FLAVOURS, id));
			let list = names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}` : names[0];
			let count = ["", "one scoop", "two scoops", "three scoops", "four scoops"][scoops.length];
			let topText = iceTopping === "none" ? "" : ` with ${label(ICE_TOPPINGS, iceTopping)}`;
			return `You made an ice cream ${label(HOLDERS, holder)} with ${count}: ${list}${topText}. Don't let it melt!`;
		}
		if (pieStage !== "baked") return "Decorate your pie, then press Bake!";
		let count = decorations.length;
		let shapes = count === 0 ? "" : ` with ${count} pastry ${count === 1 ? "shape" : "shapes"} on top`;
		return `You made a golden Scottish steak pie${shapes}. Perfect for New Year's Day!`;
	}

	function showTada() {
		tada = true;
		tadaKey++;
		cheer();
		speak(describe());
		handle.update();
	}

	let tabs: { id: Mode; label: string; emoji: string }[] = [
		{ id: "cupcake", label: "Cupcake", emoji: "🧁" },
		{ id: "icecream", label: "Ice cream", emoji: "🍦" },
		{ id: "pie", label: "Steak pie", emoji: "🥧" },
	];

	return () => {
		let tadaText = mode === "pie" ? "Delicious! 🥧" : "Ta-da! ✨";
		return (
			<div mix={styles}>
				<div class="tabs" role="tablist" aria-label="What shall we make?">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							type="button"
							role="tab"
							class="tab"
							aria-selected={mode === tab.id ? "true" : "false"}
							mix={on("click", () => {
								mode = tab.id;
								tada = false;
								pop();
								handle.update();
							})}
						>
							<span aria-hidden="true">{tab.emoji}</span>
							{tab.label}
						</button>
					))}
				</div>

				<div class="workbench">
					<div class="stage">
						<svg viewBox="0 0 400 400" role="img" aria-label={describe()}>
							{mode === "cupcake" ? (
								<Cupcake
									caseColour={CASES.find((c) => c.id === caseId)!.colour}
									cake={CAKES.find((c) => c.id === cakeId)!.colour}
									icing={ICINGS.find((c) => c.id === icingId)!.colour}
									sprinkles={sprinkles}
									topper={topper}
								/>
							) : mode === "icecream" ? (
								<IceCream holder={holder} scoops={scoops} topping={iceTopping} />
							) : (
								<SteakPie decorations={decorations} glazed={glazed} stage={pieStage} />
							)}
						</svg>
						{tada ? (
							<div class="tada" key={tadaKey}>
								{tadaText}
							</div>
						) : null}
						{mode === "pie" && pieStage === "baking" ? (
							<div class="oven" role="status">
								<span class="fire" aria-hidden="true">
									🔥
								</span>
								Baking…
							</div>
						) : null}
					</div>

					<div class="controls">
						{mode === "cupcake" ? (
							<CupcakeControls
								caseId={caseId}
								cakeId={cakeId}
								icingId={icingId}
								sprinkles={sprinkles}
								topper={topper}
								onChange={(key, id) => {
									if (key === "case") caseId = id;
									if (key === "cake") cakeId = id;
									if (key === "icing") icingId = id;
									if (key === "sprinkles") sprinkles = id;
									if (key === "topper") topper = id;
									changed();
								}}
							/>
						) : null}

						{mode === "icecream" ? (
							<>
								<ChoiceRow
									label="Cone or cup?"
									items={HOLDERS}
									selected={holder}
									onPick={(id) => {
										holder = id;
										changed();
									}}
								/>
								<div class="group" role="group" aria-label="Add a scoop">
									<h3>
										Add a scoop ({scoops.length} of {MAX_SCOOPS})
									</h3>
									<div class="row">
										{FLAVOURS.map((flavour) => (
											<button
												key={flavour.id}
												type="button"
												class="choice"
												aria-label={`Add ${flavour.label}`}
												disabled={scoops.length >= MAX_SCOOPS}
												style={{ background: flavour.colour }}
												mix={on("click", () => {
													if (scoops.length >= MAX_SCOOPS) return;
													scoops = [...scoops, flavour.id];
													changed();
												})}
											/>
										))}
									</div>
								</div>
								<ChoiceRow
									label="On top"
									items={ICE_TOPPINGS}
									selected={iceTopping}
									onPick={(id) => {
										iceTopping = id;
										changed();
									}}
								/>
								<div class="buttons">
									<button
										type="button"
										class="big secondary"
										disabled={scoops.length === 0}
										mix={on("click", () => {
											scoops = scoops.slice(0, -1);
											changed();
										})}
									>
										👅 Eat a scoop
									</button>
								</div>
							</>
						) : null}

						{mode === "pie" ? (
							<>
								<div class="group" role="group" aria-label="Pastry shapes">
									<h3>{pieStage === "decorate" ? "Add pastry shapes" : pieStage === "baking" ? "In the oven…" : "Your pie is baked!"}</h3>
									<div class="row">
										{PASTRY_SHAPES.map((shape) => (
											<button
												key={shape.id}
												type="button"
												class="choice"
												aria-label={`Add a pastry ${shape.label}`}
												disabled={pieStage !== "decorate" || decorations.length >= PIE_SLOTS.length}
												mix={on("click", () => {
													decorations = [...decorations, shape.id];
													changed();
												})}
											>
												{shape.emoji}
											</button>
										))}
									</div>
								</div>
								<div class="buttons">
									{pieStage === "decorate" ? (
										<>
											<button
												type="button"
												class="big secondary"
												aria-pressed={glazed ? "true" : "false"}
												mix={on("click", () => {
													glazed = !glazed;
													changed();
												})}
											>
												🖌️ {glazed ? "Shiny!" : "Brush with egg"}
											</button>
											<button
												type="button"
												class="big"
												mix={on("click", () => {
													pieStage = "baking";
													tada = false;
													handle.update();
													speak("Into the oven it goes!");
													bakeTimer = setTimeout(() => {
														pieStage = "baked";
														twinkle();
														showTada();
													}, 3000);
												})}
											>
												🔥 Bake it!
											</button>
										</>
									) : null}
									<button
										type="button"
										class="big secondary"
										disabled={pieStage === "baking"}
										mix={on("click", () => {
											decorations = [];
											glazed = false;
											pieStage = "decorate";
											changed();
										})}
									>
										🔄 New pie
									</button>
								</div>
							</>
						) : null}

						{mode !== "pie" || pieStage === "baked" ? (
							<div class="buttons">
								<button type="button" class="big" mix={on("click", showTada)}>
									✨ Ta-da!
								</button>
							</div>
						) : null}
					</div>
				</div>
			</div>
		);
	};
});

function CupcakeControls(
	handle: Handle<{
		caseId: string;
		cakeId: string;
		icingId: string;
		sprinkles: string;
		topper: string;
		onChange: (key: "case" | "cake" | "icing" | "sprinkles" | "topper", id: string) => void;
	}>,
): () => RemixNode {
	return () => {
		let { caseId, cakeId, icingId, sprinkles, topper, onChange } = handle.props;
		return (
			<>
				<ChoiceRow label="Cake" items={CAKES} selected={cakeId} onPick={(id) => onChange("cake", id)} />
				<ChoiceRow label="Case" items={CASES} selected={caseId} onPick={(id) => onChange("case", id)} />
				<ChoiceRow label="Icing" items={ICINGS} selected={icingId} onPick={(id) => onChange("icing", id)} />
				<ChoiceRow label="Sprinkles" items={SPRINKLES} selected={sprinkles} onPick={(id) => onChange("sprinkles", id)} />
				<ChoiceRow label="On top" items={TOPPERS} selected={topper} onPick={(id) => onChange("topper", id)} />
			</>
		);
	};
}
