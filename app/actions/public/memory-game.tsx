import { clientEntry, css, on } from "remix/component";
import type { Handle } from "remix/component";

import { boop, cheer, pop, twinkle } from "../../ui/public/sounds.ts";
import { speak } from "../../ui/public/speak.ts";
import { MATCH_SIZES, MATCH_THEMES, checkPair, isComplete, makeDeck, type MatchCard } from "./games-model.ts";

const styles = css({
	display: "grid",
	gap: "18px",
	"& .setup": { display: "grid", gap: "18px" },
	"& .group": { background: "var(--surface)", borderRadius: "22px", border: "3px solid var(--rule)", padding: "14px" },
	"& .group h2": { margin: "0 0 10px", fontSize: "22px", color: "var(--muted)", fontWeight: 600 },
	"& .row": { display: "flex", flexWrap: "wrap", gap: "12px" },
	"& .pick": {
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
		touchAction: "manipulation",
	},
	"& .pick[aria-pressed='true']": { background: "var(--tone)", borderColor: "var(--tone)", color: "#fff" },
	"& .go": {
		justifySelf: "start",
		minHeight: "72px",
		padding: "0 36px",
		border: 0,
		borderRadius: "999px",
		background: "var(--tone)",
		color: "#fff",
		fontSize: "28px",
		fontWeight: 700,
		cursor: "pointer",
		boxShadow: "0 6px 0 rgba(0,0,0,0.2)",
		touchAction: "manipulation",
	},
	"& .status": {
		display: "flex",
		flexWrap: "wrap",
		alignItems: "center",
		justifyContent: "space-between",
		gap: "12px",
		fontSize: "22px",
		fontWeight: 600,
	},
	"& .small": {
		minHeight: "52px",
		padding: "0 18px",
		borderRadius: "999px",
		border: "3px solid var(--rule)",
		background: "var(--surface)",
		fontSize: "18px",
		fontWeight: 600,
		cursor: "pointer",
	},
	"& .board": {
		display: "grid",
		gap: "12px",
		gridTemplateColumns: "repeat(var(--cols), minmax(0, 1fr))",
		maxWidth: "min(760px, calc(var(--cols) * 150px))",
		width: "100%",
		marginInline: "auto",
	},
	"& .card": {
		position: "relative",
		aspectRatio: "3 / 4",
		padding: 0,
		border: 0,
		background: "none",
		cursor: "pointer",
		perspective: "800px",
		touchAction: "manipulation",
	},
	"& .inner": {
		position: "absolute",
		inset: 0,
		transformStyle: "preserve-3d",
		transition: "transform 380ms ease",
	},
	"& .card[data-up='true'] .inner": { transform: "rotateY(180deg)" },
	"& .side": {
		position: "absolute",
		inset: 0,
		display: "grid",
		placeItems: "center",
		borderRadius: "18px",
		backfaceVisibility: "hidden",
		WebkitBackfaceVisibility: "hidden",
		boxShadow: "0 5px 0 rgba(59, 37, 84, 0.18)",
	},
	"& .back": {
		background: "repeating-linear-gradient(45deg, var(--tone) 0 14px, #5fcaf0 14px 28px)",
		border: "4px solid #fff",
		fontSize: "clamp(26px, 6vw, 40px)",
		color: "#fff",
	},
	"& .front": {
		background: "#fff",
		border: "4px solid var(--tone)",
		transform: "rotateY(180deg)",
		fontSize: "clamp(40px, 9vw, 72px)",
	},
	"& .card[data-matched='true'] .front": {
		borderColor: "var(--green)",
		background: "#eafff5",
		animation: "match-bounce 500ms ease",
	},
	"& .win": {
		display: "grid",
		justifyItems: "center",
		gap: "12px",
		padding: "28px",
		borderRadius: "var(--radius)",
		background: "var(--surface)",
		border: "6px solid var(--tone)",
		textAlign: "center",
	},
	"& .win .trophy": { fontSize: "100px", lineHeight: 1, animation: "match-bounce 700ms ease" },
	"& .win p": { margin: 0, fontSize: "26px", fontWeight: 600 },
	"@keyframes match-bounce": {
		"0%": { transform: "rotateY(180deg) scale(1)" },
		"50%": { transform: "rotateY(180deg) scale(1.12)" },
		"100%": { transform: "rotateY(180deg) scale(1)" },
	},
});

export const MemoryGame = clientEntry(import.meta.url, function MemoryGame(handle: Handle) {
	let themeId: string = MATCH_THEMES[0].id;
	let pairs: number = MATCH_SIZES[0].pairs;
	let deck: MatchCard[] = [];
	let playing = false;
	let up: number[] = [];
	let turns = 0;
	let locked = false;
	let timer: ReturnType<typeof setTimeout> | undefined;

	handle.signal.addEventListener("abort", () => clearTimeout(timer));

	function start() {
		let theme = MATCH_THEMES.find((t) => t.id === themeId) ?? MATCH_THEMES[0];
		deck = makeDeck(theme.faces, pairs);
		up = [];
		turns = 0;
		locked = false;
		playing = true;
		pop();
		handle.update();
	}

	function flip(card: MatchCard) {
		if (locked || card.matched || up.includes(card.id)) return;
		pop();
		up = [...up, card.id];
		if (up.length < 2) {
			handle.update();
			return;
		}
		turns++;
		let [a, b] = up;
		if (checkPair(deck, a, b)) {
			up = [];
			if (isComplete(deck)) {
				cheer();
				speak(`Hooray! You found all the pairs in ${turns} goes!`);
			} else {
				twinkle();
			}
			handle.update();
			return;
		}
		locked = true;
		handle.update();
		timer = setTimeout(() => {
			boop();
			up = [];
			locked = false;
			handle.update();
		}, 1100);
	}

	return () => {
		if (!playing) {
			return (
				<div mix={styles}>
					<div class="setup">
						<div class="group" role="group" aria-label="Pictures">
							<h2>Pick your pictures</h2>
							<div class="row">
								{MATCH_THEMES.map((theme) => (
									<button
										key={theme.id}
										type="button"
										class="pick"
										aria-pressed={themeId === theme.id ? "true" : "false"}
										mix={on("click", () => {
											themeId = theme.id;
											pop();
											handle.update();
										})}
									>
										<span aria-hidden="true">{theme.emoji}</span>
										{theme.label}
									</button>
								))}
							</div>
						</div>
						<div class="group" role="group" aria-label="How many cards">
							<h2>How many cards?</h2>
							<div class="row">
								{MATCH_SIZES.map((size) => (
									<button
										key={size.pairs}
										type="button"
										class="pick"
										aria-pressed={pairs === size.pairs ? "true" : "false"}
										mix={on("click", () => {
											pairs = size.pairs;
											pop();
											handle.update();
										})}
									>
										<span aria-hidden="true">{size.emoji}</span>
										{size.label} ({size.pairs * 2})
									</button>
								))}
							</div>
						</div>
						<button type="button" class="go" mix={on("click", start)}>
							▶️ Let's play!
						</button>
					</div>
				</div>
			);
		}

		let done = isComplete(deck);
		let cols = deck.length <= 6 ? 3 : 4;
		let matchedPairs = deck.filter((c) => c.matched).length / 2;

		return (
			<div mix={styles}>
				<div class="status">
					<span>
						⭐ {matchedPairs} of {deck.length / 2} pairs · {turns} {turns === 1 ? "go" : "goes"}
					</span>
					<span class="row">
						<button type="button" class="small" mix={on("click", start)}>
							🔀 Shuffle again
						</button>
						<button
							type="button"
							class="small"
							mix={on("click", () => {
								playing = false;
								handle.update();
							})}
						>
							⚙️ Change game
						</button>
					</span>
				</div>

				{done ? (
					<div class="win" role="status">
						<span class="trophy" aria-hidden="true">
							🏆
						</span>
						<p>You found them all in {turns} goes!</p>
						<button type="button" class="go" mix={on("click", start)}>
							🔁 Play again
						</button>
					</div>
				) : (
					<div class="board" style={{ "--cols": String(cols) }}>
						{deck.map((card, index) => {
							let isUp = card.matched || up.includes(card.id);
							return (
								<button
									key={card.id}
									type="button"
									class="card"
									data-up={isUp ? "true" : "false"}
									data-matched={card.matched ? "true" : "false"}
									aria-label={isUp ? card.face : `Card ${index + 1}`}
									mix={on("click", () => flip(card))}
								>
									<span class="inner">
										<span class="side back" aria-hidden="true">
											?
										</span>
										<span class="side front" aria-hidden="true">
											{card.face}
										</span>
									</span>
								</button>
							);
						})}
					</div>
				)}
			</div>
		);
	};
});
