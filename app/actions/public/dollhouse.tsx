import { clientEntry, css, on, ref } from "remix/component";
import type { Handle } from "remix/component";

import { pop, twinkle } from "../../ui/public/sounds.ts";

const STORAGE_KEY = "sparkle-town:dollhouse";
const MAX_ITEMS = 60;

interface Item {
	id: number;
	emoji: string;
	/** Centre of the item, as a percentage of the house's width and height. */
	x: number;
	y: number;
	/** Stacking order; whatever was touched last sits on top. */
	z?: number;
}

const TRAY: { label: string; items: string[] }[] = [
	{ label: "Family", items: ["👩", "👨", "👧", "👦", "👶", "👵", "👴", "🧑"] },
	{ label: "Pets", items: ["🐱", "🐶", "🐰", "🐹", "🐠", "🦜"] },
	{ label: "Things", items: ["🛏️", "🛋️", "🛁", "🚽", "📺", "🧸", "🪴", "🍳", "🎂", "🧁", "🎨", "📚", "🎈", "🦄", "🛝", "⛄"] },
];

const ROOMS = [
	{ id: "bedroom", label: "Bedroom", left: 6, top: 30, width: 44, height: 27, wall: "#ffd6ea", floor: "#d9a7c7" },
	{ id: "bathroom", label: "Bathroom", left: 50, top: 30, width: 44, height: 27, wall: "#d4f1ff", floor: "#9fd0e6" },
	{ id: "kitchen", label: "Kitchen", left: 6, top: 57, width: 44, height: 27, wall: "#fff2c2", floor: "#e7c77b" },
	{ id: "living", label: "Living room", left: 50, top: 57, width: 44, height: 27, wall: "#e2ffd9", floor: "#b5d98f" },
];

const DEFAULT_ITEMS: Omit<Item, "id">[] = [
	{ emoji: "🛏️", x: 18, y: 50 },
	{ emoji: "🧸", x: 36, y: 51 },
	{ emoji: "🛁", x: 66, y: 50 },
	{ emoji: "🍳", x: 16, y: 77 },
	{ emoji: "🐱", x: 34, y: 79 },
	{ emoji: "🛋️", x: 68, y: 77 },
	{ emoji: "📺", x: 86, y: 74 },
	{ emoji: "👩", x: 60, y: 76 },
	{ emoji: "👧", x: 77, y: 79 },
	{ emoji: "🐶", x: 24, y: 93 },
	{ emoji: "🪴", x: 88, y: 93 },
];

function defaults(): Item[] {
	return DEFAULT_ITEMS.map((item, id) => ({ ...item, id }));
}

function load(): Item[] | null {
	try {
		let stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return null;
		let parsed: unknown = JSON.parse(stored);
		if (!Array.isArray(parsed)) return null;
		return parsed
			.filter(
				(item): item is Item =>
					typeof item?.id === "number" &&
					typeof item?.emoji === "string" &&
					typeof item?.x === "number" &&
					typeof item?.y === "number",
			)
			.slice(0, MAX_ITEMS);
	} catch {
		return null;
	}
}

function save(items: Item[]) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
	} catch {
		// Storage can be full or blocked; the house still works for this visit.
	}
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const styles = css({
	display: "grid",
	gap: "16px",
	"@media (min-width: 900px)": { gridTemplateColumns: "minmax(0, 1fr) 300px", alignItems: "start" },
	"& .house": {
		position: "relative",
		width: "100%",
		aspectRatio: "1 / 0.92",
		borderRadius: "var(--radius)",
		background: "linear-gradient(#bfe9ff, #e9f8ff 70%)",
		boxShadow: "var(--shadow)",
		overflow: "hidden",
		userSelect: "none",
		WebkitUserSelect: "none",
		touchAction: "none",
	},
	"& .sun": { position: "absolute", top: "3%", left: "4%", fontSize: "clamp(32px, 7vw, 56px)", lineHeight: 1 },
	"& .roof": {
		position: "absolute",
		left: "2%",
		right: "2%",
		top: "4%",
		height: "27%",
		background: "var(--tone)",
		clipPath: "polygon(50% 0, 100% 100%, 0 100%)",
	},
	"& .roof::after": {
		content: '""',
		position: "absolute",
		left: "44%",
		top: "45%",
		width: "12%",
		aspectRatio: "1",
		borderRadius: "50%",
		background: "#fff6c8",
		border: "5px solid #fff",
	},
	"& .walls": {
		position: "absolute",
		left: "5%",
		width: "90%",
		top: "29%",
		height: "56%",
		background: "#fff",
		borderRadius: "6px",
	},
	"& .room": {
		position: "absolute",
		borderRight: "6px solid #fff",
		borderBottom: "6px solid #fff",
		overflow: "hidden",
	},
	"& .room::after": {
		content: '""',
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
		height: "18%",
		background: "var(--floor)",
	},
	"& .room .label": {
		position: "absolute",
		top: "6px",
		left: "8px",
		fontSize: "clamp(11px, 2vw, 16px)",
		fontWeight: 600,
		color: "rgba(59, 37, 84, 0.55)",
	},
	"& .grass": {
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
		height: "16%",
		background: "#7ed87a",
		borderTop: "6px solid #5cc35a",
	},
	"& .night": {
		position: "absolute",
		inset: 0,
		background: "rgba(20, 16, 60, 0.6)",
		zIndex: 100000,
		pointerEvents: "none",
	},
	"& .night .moon": { position: "absolute", top: "3%", right: "5%", fontSize: "clamp(30px, 6vw, 52px)" },
	"& .item": {
		position: "absolute",
		transform: "translate(-50%, -50%)",
		fontSize: "clamp(30px, 6.5vw, 54px)",
		lineHeight: 1,
		padding: "4px",
		border: 0,
		background: "none",
		cursor: "grab",
		touchAction: "none",
		filter: "drop-shadow(0 3px 0 rgba(0,0,0,0.15))",
		transition: "filter 120ms ease",
	},
	"& .item[data-dragging='true']": {
		cursor: "grabbing",
		transform: "translate(-50%, -50%) scale(1.25)",
		filter: "drop-shadow(0 10px 6px rgba(0,0,0,0.25))",
	},
	"& .bin": {
		position: "absolute",
		right: "2%",
		bottom: "2%",
		display: "grid",
		placeItems: "center",
		width: "clamp(48px, 10vw, 72px)",
		aspectRatio: "1",
		borderRadius: "50%",
		background: "rgba(255,255,255,0.85)",
		fontSize: "clamp(24px, 5vw, 36px)",
		border: "3px dashed var(--muted)",
		zIndex: 100001,
		pointerEvents: "none",
		transition: "transform 120ms ease",
	},
	"& .bin[data-hot='true']": { transform: "scale(1.25)", background: "#ffe1e1", borderColor: "var(--red)" },
	"& .side": { display: "grid", gap: "14px" },
	"& .tray": { background: "var(--surface)", borderRadius: "20px", border: "3px solid var(--rule)", padding: "12px" },
	"& .tray h2": { margin: "0 0 8px", fontSize: "20px", color: "var(--muted)", fontWeight: 600 },
	"& .tray .row": { display: "flex", flexWrap: "wrap", gap: "8px" },
	"& .add": {
		width: "56px",
		height: "56px",
		borderRadius: "16px",
		border: "3px solid var(--rule)",
		background: "#fff",
		fontSize: "32px",
		lineHeight: 1,
		cursor: "pointer",
		padding: 0,
		touchAction: "manipulation",
		"&:active": { transform: "scale(0.92)" },
	},
	"& .tip": { margin: 0, fontSize: "18px", color: "var(--muted)" },
	"& .buttons": { display: "flex", flexWrap: "wrap", gap: "10px" },
	"& .btn": {
		flex: "1 1 auto",
		minHeight: "56px",
		padding: "0 16px",
		borderRadius: "999px",
		border: "3px solid var(--rule)",
		background: "var(--surface)",
		fontSize: "18px",
		fontWeight: 600,
		cursor: "pointer",
	},
});

export const Dollhouse = clientEntry(import.meta.url, function Dollhouse(handle: Handle) {
	let items: Item[] = defaults();
	let nextId = items.length;
	let night = false;
	let house: HTMLElement | undefined;
	let bin: HTMLElement | undefined;
	let dragging: { id: number; pointerId: number; dx: number; dy: number } | null = null;
	let overBin = false;
	let topZ = 1;

	handle.queueTask(() => {
		let stored = load();
		if (stored) {
			items = stored;
			nextId = Math.max(0, ...items.map((i) => i.id)) + 1;
			topZ = Math.max(1, ...items.map((i) => i.z ?? 1));
			handle.update();
		}
	});

	function update(persist = false) {
		if (persist) save(items);
		handle.update();
	}

	function percentPoint(event: PointerEvent) {
		let rect = house!.getBoundingClientRect();
		return {
			x: ((event.clientX - rect.left) / rect.width) * 100,
			y: ((event.clientY - rect.top) / rect.height) * 100,
		};
	}

	function isOverBin(event: PointerEvent) {
		if (!bin) return false;
		let r = bin.getBoundingClientRect();
		let pad = 10;
		return (
			event.clientX >= r.left - pad &&
			event.clientX <= r.right + pad &&
			event.clientY >= r.top - pad &&
			event.clientY <= r.bottom + pad
		);
	}

	function add(emoji: string) {
		if (items.length >= MAX_ITEMS) return;
		// Drop new things in the middle of the house, slightly scattered.
		let jitter = () => (Math.random() - 0.5) * 16;
		items = [...items, { id: nextId++, emoji, x: 50 + jitter(), y: 60 + jitter() }];
		pop();
		update(true);
	}

	return () => (
		<div mix={styles}>
			<div
				class="house"
				mix={ref((node) => {
					house = node;
				})}
			>
				<span class="sun" aria-hidden="true">
					☀️
				</span>
				<div class="roof" aria-hidden="true" />
				<div class="walls" aria-hidden="true" />
				{ROOMS.map((room) => (
					<div
						key={room.id}
						class="room"
						style={{
							left: `${room.left}%`,
							top: `${room.top}%`,
							width: `${room.width}%`,
							height: `${room.height}%`,
							background: room.wall,
							"--floor": room.floor,
						}}
					>
						<span class="label">{room.label}</span>
					</div>
				))}
				<div class="grass" aria-hidden="true" />

				{items.map((item) => (
					<button
						key={item.id}
						type="button"
						class="item"
						aria-label={`Move ${item.emoji}`}
						data-dragging={dragging?.id === item.id ? "true" : "false"}
						style={{ left: `${item.x}%`, top: `${item.y}%`, zIndex: item.z ?? 1 }}
						mix={[
							on("pointerdown", (event) => {
								if (!house) return;
								event.preventDefault();
								event.currentTarget.setPointerCapture(event.pointerId);
								let p = percentPoint(event);
								dragging = { id: item.id, pointerId: event.pointerId, dx: item.x - p.x, dy: item.y - p.y };
								// Bring to the front without moving the element, which would drop the pointer capture.
								item.z = ++topZ;
								pop();
								update();
							}),
							on("pointermove", (event) => {
								if (!dragging || dragging.id !== item.id || dragging.pointerId !== event.pointerId) return;
								let p = percentPoint(event);
								let moved = items.find((i) => i.id === item.id);
								if (!moved) return;
								moved.x = clamp(p.x + dragging.dx, 3, 97);
								moved.y = clamp(p.y + dragging.dy, 3, 97);
								overBin = isOverBin(event);
								update();
							}),
							on("pointerup", (event) => {
								if (!dragging || dragging.id !== item.id) return;
								if (isOverBin(event)) {
									items = items.filter((i) => i.id !== item.id);
									pop();
								}
								dragging = null;
								overBin = false;
								update(true);
							}),
							on("pointercancel", () => {
								dragging = null;
								overBin = false;
								update(true);
							}),
						]}
					>
						{item.emoji}
					</button>
				))}

				{night ? (
					<div class="night" aria-hidden="true">
						<span class="moon">🌙</span>
					</div>
				) : null}

				<span
					class="bin"
					aria-hidden="true"
					data-hot={overBin ? "true" : "false"}
					mix={ref((node) => {
						bin = node;
					})}
				>
					🗑️
				</span>
			</div>

			<div class="side">
				<p class="tip">Tap to add. Drag things around. Drag to the bin to tidy away!</p>
				{TRAY.map((group) => (
					<div key={group.label} class="tray" role="group" aria-label={group.label}>
						<h2>{group.label}</h2>
						<div class="row">
							{group.items.map((emoji) => (
								<button
									key={emoji}
									type="button"
									class="add"
									aria-label={`Add ${emoji}`}
									mix={on("click", () => add(emoji))}
								>
									{emoji}
								</button>
							))}
						</div>
					</div>
				))}
				<div class="buttons">
					<button
						type="button"
						class="btn"
						aria-pressed={night ? "true" : "false"}
						mix={on("click", () => {
							night = !night;
							twinkle();
							update();
						})}
					>
						{night ? "☀️ Good morning!" : "🌙 Bedtime"}
					</button>
					<button
						type="button"
						class="btn"
						mix={on("click", () => {
							items = defaults();
							nextId = items.length;
							pop();
							update(true);
						})}
					>
						🔄 Tidy up
					</button>
				</div>
			</div>
		</div>
	);
});
