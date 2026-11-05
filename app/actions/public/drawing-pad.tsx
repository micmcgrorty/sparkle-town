import { clientEntry, css, on, ref } from "remix/component";
import type { Handle } from "remix/component";

import { pop, twinkle } from "../../ui/public/sounds.ts";

const WIDTH = 1200;
const HEIGHT = 900;
const GALLERY_KEY = "sparkle-town:gallery";
const GALLERY_LIMIT = 8;
const UNDO_LIMIT = 20;

const COLOURS = [
	{ id: "black", label: "Black", value: "#2b2233" },
	{ id: "red", label: "Red", value: "#ff3b4a" },
	{ id: "orange", label: "Orange", value: "#ff8a1f" },
	{ id: "yellow", label: "Yellow", value: "#ffd21f" },
	{ id: "green", label: "Green", value: "#22c46e" },
	{ id: "blue", label: "Blue", value: "#2b8cff" },
	{ id: "purple", label: "Purple", value: "#8b5cf6" },
	{ id: "pink", label: "Pink", value: "#ff6fb5" },
	{ id: "brown", label: "Brown", value: "#9a5b2e" },
	{ id: "rainbow", label: "Rainbow", value: "rainbow" },
];

const SIZES = [
	{ id: "small", label: "Thin", px: 8 },
	{ id: "medium", label: "Medium", px: 20 },
	{ id: "large", label: "Fat", px: 44 },
];

const STICKERS = ["⭐", "❤️", "🦄", "🧁", "🌸", "🐙", "🌈", "👑", "🐱", "🦋", "🍭", "☀️"];

type Tool = { kind: "brush" } | { kind: "eraser" } | { kind: "sticker"; emoji: string };

const styles = css({
	display: "grid",
	gap: "16px",
	"@media (min-width: 900px)": {
		gridTemplateColumns: "1fr 220px",
		alignItems: "start",
	},
	"& .board": {
		position: "relative",
		borderRadius: "var(--radius)",
		border: "6px solid var(--tone)",
		background: "#fff",
		boxShadow: "var(--shadow)",
		overflow: "hidden",
	},
	"& canvas": {
		display: "block",
		width: "100%",
		height: "auto",
		aspectRatio: `${WIDTH} / ${HEIGHT}`,
		touchAction: "none",
		cursor: "crosshair",
	},
	"& .tools": {
		display: "flex",
		flexDirection: "column",
		gap: "16px",
	},
	"& .group": {
		background: "var(--surface)",
		borderRadius: "20px",
		border: "3px solid var(--rule)",
		padding: "10px",
	},
	"& .row": {
		display: "flex",
		flexWrap: "wrap",
		gap: "10px",
	},
	"& .swatch, & .tool": {
		display: "grid",
		placeItems: "center",
		width: "52px",
		height: "52px",
		borderRadius: "50%",
		border: "4px solid #fff",
		boxShadow: "0 0 0 3px var(--rule)",
		cursor: "pointer",
		fontSize: "26px",
		lineHeight: 1,
		padding: 0,
		background: "var(--surface)",
		touchAction: "manipulation",
		transition: "transform 120ms ease",
	},
	"& .swatch[aria-pressed='true'], & .tool[aria-pressed='true']": {
		boxShadow: "0 0 0 5px var(--text)",
		transform: "scale(1.1)",
	},
	"& .size span": {
		display: "block",
		borderRadius: "50%",
		background: "var(--text)",
	},
	"& .actions": {
		display: "flex",
		flexWrap: "wrap",
		gap: "10px",
	},
	"& .action": {
		flex: "1 1 auto",
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		gap: "6px",
		minHeight: "52px",
		padding: "0 14px",
		border: 0,
		borderRadius: "999px",
		background: "var(--tone)",
		color: "#fff",
		fontSize: "18px",
		fontWeight: 600,
		cursor: "pointer",
		boxShadow: "0 4px 0 rgba(0,0,0,0.15)",
		touchAction: "manipulation",
	},
	"& .action.secondary": { background: "var(--surface)", color: "var(--text)", boxShadow: "0 0 0 3px var(--rule), 0 4px 0 rgba(0,0,0,0.08)" },
	"& .action.danger": { background: "var(--red)" },
	"& .action:disabled": { opacity: 0.45, cursor: "default" },
	"& .gallery": { gridColumn: "1 / -1" },
	"& .gallery h2": { margin: "8px 0 12px", fontSize: "26px" },
	"& .gallery ul": {
		listStyle: "none",
		margin: 0,
		padding: 0,
		display: "grid",
		gap: "14px",
		gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
	},
	"& .gallery li": {
		position: "relative",
		borderRadius: "18px",
		overflow: "hidden",
		border: "4px solid #fff",
		boxShadow: "0 0 0 3px var(--rule), var(--shadow)",
		background: "#fff",
	},
	"& .gallery img": { display: "block", width: "100%", height: "auto" },
	"& .gallery .open": { display: "block", padding: 0, border: 0, background: "none", cursor: "pointer", width: "100%" },
	"& .gallery .delete": {
		position: "absolute",
		top: "6px",
		right: "6px",
		width: "40px",
		height: "40px",
		borderRadius: "50%",
		border: 0,
		background: "rgba(255,255,255,0.9)",
		fontSize: "20px",
		cursor: "pointer",
	},
	"& .empty": { color: "var(--muted)", margin: 0 },
	"& .flash": {
		position: "absolute",
		inset: 0,
		display: "grid",
		placeItems: "center",
		fontSize: "48px",
		fontWeight: 700,
		color: "var(--tone)",
		background: "rgba(255,255,255,0.7)",
		pointerEvents: "none",
		animation: "draw-flash 1.2s ease forwards",
	},
	"@keyframes draw-flash": {
		"0%": { opacity: 0, transform: "scale(0.8)" },
		"20%": { opacity: 1, transform: "scale(1)" },
		"80%": { opacity: 1 },
		"100%": { opacity: 0 },
	},
});

function readGallery(): string[] {
	try {
		let stored = localStorage.getItem(GALLERY_KEY);
		let parsed: unknown = stored ? JSON.parse(stored) : [];
		return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
	} catch {
		return [];
	}
}

function writeGallery(pictures: string[]): boolean {
	try {
		localStorage.setItem(GALLERY_KEY, JSON.stringify(pictures));
		return true;
	} catch {
		return false;
	}
}

export const DrawingPad = clientEntry(import.meta.url, function DrawingPad(handle: Handle) {
	let canvas: HTMLCanvasElement | undefined;
	let ctx: CanvasRenderingContext2D | null = null;

	let colour = COLOURS[5].value;
	let size = SIZES[1].px;
	let tool: Tool = { kind: "brush" };
	let hue = 0;

	let undoStack: ImageData[] = [];
	let gallery: string[] = [];
	let confirmClear = false;
	let flash: string | null = null;
	let flashKey = 0;

	let drawing = false;
	let lastX = 0;
	let lastY = 0;

	handle.queueTask(() => {
		gallery = readGallery();
		handle.update();
	});

	function fillWhite() {
		if (!ctx) return;
		ctx.save();
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(0, 0, WIDTH, HEIGHT);
		ctx.restore();
	}

	function snapshot() {
		if (!ctx) return;
		undoStack.push(ctx.getImageData(0, 0, WIDTH, HEIGHT));
		if (undoStack.length > UNDO_LIMIT) undoStack.shift();
	}

	function point(event: PointerEvent) {
		let rect = canvas!.getBoundingClientRect();
		return {
			x: ((event.clientX - rect.left) / rect.width) * WIDTH,
			y: ((event.clientY - rect.top) / rect.height) * HEIGHT,
		};
	}

	function strokeColour(): string {
		if (tool.kind === "eraser") return "#ffffff";
		if (colour === "rainbow") {
			hue = (hue + 4) % 360;
			return `hsl(${hue} 90% 55%)`;
		}
		return colour;
	}

	function line(x1: number, y1: number, x2: number, y2: number) {
		if (!ctx) return;
		ctx.strokeStyle = strokeColour();
		ctx.lineWidth = tool.kind === "eraser" ? size * 1.8 : size;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	}

	function stamp(x: number, y: number, emoji: string) {
		if (!ctx) return;
		let px = size * 4 + 40;
		ctx.save();
		ctx.font = `${px}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(emoji, x, y);
		ctx.restore();
		pop();
	}

	function showFlash(text: string) {
		flash = text;
		flashKey++;
		handle.update();
		let key = flashKey;
		setTimeout(() => {
			if (key !== flashKey) return;
			flash = null;
			handle.update();
		}, 1300);
	}

	function setTool(next: Tool) {
		tool = next;
		confirmClear = false;
		handle.update();
	}

	return () => (
		<div mix={styles}>
			<div class="board">
				<canvas
					width={WIDTH}
					height={HEIGHT}
					aria-label="Drawing canvas"
					mix={[
						ref((node, signal) => {
							canvas = node;
							ctx = node.getContext("2d", { willReadFrequently: true });
							fillWhite();
							signal.addEventListener("abort", () => {
								canvas = undefined;
								ctx = null;
							});
						}),
						on("pointerdown", (event) => {
							if (!canvas || !ctx) return;
							event.preventDefault();
							snapshot();
							confirmClear = false;
							let { x, y } = point(event);
							if (tool.kind === "sticker") {
								stamp(x, y, tool.emoji);
								handle.update();
								return;
							}
							canvas.setPointerCapture(event.pointerId);
							drawing = true;
							lastX = x;
							lastY = y;
							line(x, y, x + 0.01, y + 0.01);
							handle.update();
						}),
						on("pointermove", (event) => {
							if (!drawing) return;
							// Use coalesced events for smoother lines on fast fingers.
							let events = event.getCoalescedEvents?.() ?? [event];
							for (let e of events.length ? events : [event]) {
								let { x, y } = point(e);
								line(lastX, lastY, x, y);
								lastX = x;
								lastY = y;
							}
						}),
						on("pointerup", () => {
							drawing = false;
						}),
						on("pointercancel", () => {
							drawing = false;
						}),
					]}
				/>
				{flash ? (
					<div class="flash" key={flashKey} role="status">
						{flash}
					</div>
				) : null}
			</div>

			<div class="tools">
				<div class="group" role="group" aria-label="Colours">
					<div class="row">
						{COLOURS.map((c) => (
							<button
								key={c.id}
								type="button"
								class="swatch"
								aria-label={c.label}
								aria-pressed={tool.kind === "brush" && colour === c.value ? "true" : "false"}
								style={{
									background:
										c.value === "rainbow"
											? "conic-gradient(#ff3b4a, #ff8a1f, #ffd21f, #22c46e, #2b8cff, #8b5cf6, #ff3b4a)"
											: c.value,
								}}
								mix={on("click", () => {
									colour = c.value;
									setTool({ kind: "brush" });
								})}
							/>
						))}
						<button
							type="button"
							class="tool"
							aria-label="Rubber"
							title="Rubber"
							aria-pressed={tool.kind === "eraser" ? "true" : "false"}
							mix={on("click", () => setTool({ kind: "eraser" }))}
						>
							🧽
						</button>
					</div>
				</div>

				<div class="group" role="group" aria-label="Brush size">
					<div class="row">
						{SIZES.map((s) => (
							<button
								key={s.id}
								type="button"
								class="tool size"
								aria-label={s.label}
								aria-pressed={size === s.px ? "true" : "false"}
								mix={on("click", () => {
									size = s.px;
									handle.update();
								})}
							>
								<span style={{ width: `${Math.max(6, s.px / 1.4)}px`, height: `${Math.max(6, s.px / 1.4)}px` }} />
							</button>
						))}
					</div>
				</div>

				<div class="group" role="group" aria-label="Stickers">
					<div class="row">
						{STICKERS.map((emoji) => (
							<button
								key={emoji}
								type="button"
								class="tool"
								aria-label={`${emoji} sticker`}
								aria-pressed={tool.kind === "sticker" && tool.emoji === emoji ? "true" : "false"}
								mix={on("click", () => setTool({ kind: "sticker", emoji }))}
							>
								{emoji}
							</button>
						))}
					</div>
				</div>

				<div class="actions">
					<button
						type="button"
						class="action secondary"
						disabled={undoStack.length === 0}
						mix={on("click", () => {
							let previous = undoStack.pop();
							if (previous && ctx) ctx.putImageData(previous, 0, 0);
							confirmClear = false;
							handle.update();
						})}
					>
						↩️ Undo
					</button>
					<button
						type="button"
						class={confirmClear ? "action danger" : "action secondary"}
						mix={on("click", () => {
							if (!confirmClear) {
								confirmClear = true;
								handle.update();
								return;
							}
							snapshot();
							fillWhite();
							confirmClear = false;
							handle.update();
						})}
					>
						{confirmClear ? "🗑️ Sure?" : "🗑️ Clear"}
					</button>
					<button
						type="button"
						class="action"
						mix={on("click", () => {
							if (!canvas) return;
							let picture = canvas.toDataURL("image/jpeg", 0.7);
							let next = [picture, ...gallery].slice(0, GALLERY_LIMIT);
							// If storage is full, drop the oldest pictures until it fits.
							while (!writeGallery(next) && next.length > 1) next = next.slice(0, -1);
							gallery = readGallery();
							twinkle();
							showFlash("Saved! ⭐");
						})}
					>
						💾 Save
					</button>
					<button
						type="button"
						class="action secondary"
						mix={on("click", () => {
							if (!canvas) return;
							let link = document.createElement("a");
							link.download = `my-drawing-${new Date().toISOString().slice(0, 10)}.png`;
							link.href = canvas.toDataURL("image/png");
							link.click();
						})}
					>
						⬇️ Download
					</button>
				</div>
			</div>

			<section class="gallery" aria-labelledby={`${handle.id}-gallery`}>
				<h2 id={`${handle.id}-gallery`}>🖼️ My gallery</h2>
				{gallery.length === 0 ? (
					<p class="empty">Press Save and your pictures will go here.</p>
				) : (
					<ul>
						{gallery.map((picture, index) => (
							<li key={picture.slice(-40) + index}>
								<button
									type="button"
									class="open"
									aria-label={`Open picture ${index + 1}`}
									mix={on("click", () => {
										let image = new Image();
										image.onload = () => {
											if (!ctx) return;
											snapshot();
											ctx.drawImage(image, 0, 0, WIDTH, HEIGHT);
											handle.update();
											window.scrollTo({ top: 0, behavior: "smooth" });
										};
										image.src = picture;
									})}
								>
									<img src={picture} alt={`My picture ${index + 1}`} />
								</button>
								<button
									type="button"
									class="delete"
									aria-label={`Delete picture ${index + 1}`}
									mix={on("click", () => {
										gallery = gallery.filter((_, i) => i !== index);
										writeGallery(gallery);
										handle.update();
									})}
								>
									❌
								</button>
							</li>
						))}
					</ul>
				)}
			</section>
		</div>
	);
});
