import { clientEntry, css, on } from "remix/component";
import type { Handle } from "remix/component";

import { cheer, pop } from "../../ui/public/sounds.ts";
import { speak, stopSpeaking } from "../../ui/public/speak.ts";

interface Move {
	id: string;
	kind: string;
	emoji: string;
	title: string;
	say: string;
	seconds: number;
}

interface Kind {
	id: string;
	label: string;
	emoji: string;
}

type Phase = "idle" | "shuffling" | "ready" | "go" | "done";

const styles = css({
	display: "grid",
	gap: "18px",
	justifyItems: "center",
	"& .kinds": { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px" },
	"& .kind": {
		display: "inline-flex",
		alignItems: "center",
		gap: "8px",
		minHeight: "56px",
		padding: "0 20px",
		borderRadius: "999px",
		border: "3px solid var(--rule)",
		background: "var(--surface)",
		fontSize: "20px",
		fontWeight: 600,
		cursor: "pointer",
		touchAction: "manipulation",
	},
	"& .kind[aria-pressed='true']": { background: "var(--tone)", borderColor: "var(--tone)", color: "#fff" },
	"& .card": {
		position: "relative",
		display: "grid",
		justifyItems: "center",
		alignContent: "center",
		gap: "10px",
		width: "100%",
		maxWidth: "620px",
		minHeight: "380px",
		padding: "24px",
		borderRadius: "36px",
		background: "var(--surface)",
		border: "6px solid var(--tone)",
		boxShadow: "var(--shadow)",
		textAlign: "center",
	},
	"& .emoji": { fontSize: "120px", lineHeight: 1 },
	"& .shuffling .emoji": { animation: "wiggle-shake 160ms linear infinite" },
	"& .go .emoji": { animation: "wiggle-dance 900ms ease-in-out infinite" },
	"& .done .emoji": { animation: "wiggle-pop 500ms ease" },
	"& .title": { margin: 0, fontSize: "clamp(30px, 6vw, 44px)", fontWeight: 700, lineHeight: 1.1 },
	"& .say": { margin: 0, fontSize: "20px", color: "var(--muted)", maxWidth: "32ch" },
	"& .timer": { position: "relative", width: "120px", height: "120px" },
	"& .timer svg": { width: "100%", height: "100%", transform: "rotate(-90deg)" },
	"& .timer circle": { transition: "stroke-dashoffset 1s linear" },
	"& .timer .num": {
		position: "absolute",
		inset: 0,
		display: "grid",
		placeItems: "center",
		fontSize: "48px",
		fontWeight: 700,
	},
	"& .spin": {
		display: "inline-flex",
		alignItems: "center",
		gap: "10px",
		minHeight: "84px",
		padding: "0 42px",
		border: 0,
		borderRadius: "999px",
		background: "var(--tone)",
		color: "#fff",
		fontSize: "30px",
		fontWeight: 700,
		cursor: "pointer",
		boxShadow: "0 7px 0 rgba(0,0,0,0.2)",
		touchAction: "manipulation",
		"&:active": { transform: "translateY(5px)", boxShadow: "0 2px 0 rgba(0,0,0,0.2)" },
		"&:disabled": { opacity: 0.5, cursor: "default" },
	},
	"& .stars": {
		display: "flex",
		flexWrap: "wrap",
		justifyContent: "center",
		gap: "4px",
		minHeight: "40px",
		fontSize: "32px",
		margin: 0,
	},
	"& .stars span": { animation: "wiggle-pop 400ms ease" },
	"& .count": { margin: 0, fontSize: "20px", color: "var(--muted)" },
	"@keyframes wiggle-shake": {
		"0%": { transform: "rotate(-10deg)" },
		"50%": { transform: "rotate(10deg)" },
		"100%": { transform: "rotate(-10deg)" },
	},
	"@keyframes wiggle-dance": {
		"0%, 100%": { transform: "translateY(0) rotate(-6deg)" },
		"50%": { transform: "translateY(-14px) rotate(6deg)" },
	},
	"@keyframes wiggle-pop": {
		"0%": { transform: "scale(0.3)" },
		"70%": { transform: "scale(1.25)" },
		"100%": { transform: "scale(1)" },
	},
});

const RING = 2 * Math.PI * 52;

export const WiggleGame = clientEntry(
	import.meta.url,
	function WiggleGame(handle: Handle<{ moves: Move[]; kinds: Kind[] }>) {
		let kind = "all";
		let phase: Phase = "idle";
		let current: Move | null = null;
		let shuffleEmoji = "🤸";
		let remaining = 0;
		let stars = 0;
		let timers: ReturnType<typeof setTimeout>[] = [];

		function clearTimers() {
			timers.forEach((t) => clearTimeout(t));
			timers = [];
		}

		handle.signal.addEventListener("abort", () => {
			clearTimers();
			stopSpeaking();
		});

		function pool(): Move[] {
			let moves = handle.props.moves;
			let filtered = kind === "all" ? moves : moves.filter((m) => m.kind === kind);
			return filtered.length ? filtered : moves;
		}

		function startTimer() {
			if (!current || phase !== "ready") return;
			phase = "go";
			remaining = current.seconds;
			handle.update();
			let tick = () => {
				remaining--;
				if (remaining <= 0) {
					phase = "done";
					stars++;
					cheer();
					speak(["Well done!", "Brilliant!", "Super star!", "Amazing!", "You did it!"][stars % 5]);
				}
				handle.update();
				if (remaining > 0) timers.push(setTimeout(tick, 1000));
			};
			timers.push(setTimeout(tick, 1000));
		}

		function spin() {
			clearTimers();
			stopSpeaking();
			let options = pool();
			let next = options[Math.floor(Math.random() * options.length)];
			// Avoid the same move twice in a row.
			if (options.length > 1 && current && next.id === current.id) {
				next = options[(options.indexOf(next) + 1) % options.length];
			}
			phase = "shuffling";
			handle.update();

			let flips = 0;
			let flip = () => {
				shuffleEmoji = options[Math.floor(Math.random() * options.length)].emoji;
				pop();
				flips++;
				handle.update();
				if (flips < 8) {
					timers.push(setTimeout(flip, 110));
					return;
				}
				current = next;
				phase = "ready";
				handle.update();
				let started = false;
				let begin = () => {
					if (started) return;
					started = true;
					startTimer();
				};
				speak(next.say, { onEnd: begin });
				// In case the browser never reports the end of speech.
				timers.push(setTimeout(begin, 9000));
			};
			flip();
		}

		return () => {
			let { kinds } = handle.props;
			let showing = phase === "shuffling" ? null : current;
			let progress = showing && phase === "go" ? remaining / showing.seconds : phase === "done" ? 0 : 1;

			return (
				<div mix={styles}>
					<div class="kinds" role="group" aria-label="What kind of moves?">
						{kinds.map((k) => (
							<button
								key={k.id}
								type="button"
								class="kind"
								aria-pressed={kind === k.id ? "true" : "false"}
								mix={on("click", () => {
									kind = k.id;
									pop();
									handle.update();
								})}
							>
								<span aria-hidden="true">{k.emoji}</span>
								{k.label}
							</button>
						))}
					</div>

					<div class={`card ${phase}`} aria-live="polite">
						{phase === "idle" ? (
							<>
								<span class="emoji" aria-hidden="true">
									🤸
								</span>
								<p class="title">Ready to wiggle?</p>
								<p class="say">Press the big button to get a move!</p>
							</>
						) : phase === "shuffling" ? (
							<>
								<span class="emoji" aria-hidden="true">
									{shuffleEmoji}
								</span>
								<p class="title">Ready, steady…</p>
							</>
						) : showing ? (
							<>
								<span class="emoji" aria-hidden="true">
									{phase === "done" ? "🌟" : showing.emoji}
								</span>
								<p class="title">{phase === "done" ? "Well done!" : showing.title}</p>
								{phase === "done" ? null : <p class="say">{showing.say}</p>}
								{phase === "go" ? (
									<div class="timer" role="timer" aria-label={`${remaining} seconds left`}>
										<svg viewBox="0 0 120 120" aria-hidden="true">
											<circle cx="60" cy="60" r="52" fill="none" stroke="var(--rule)" stroke-width="12" />
											<circle
												cx="60"
												cy="60"
												r="52"
												fill="none"
												stroke="var(--tone)"
												stroke-width="12"
												stroke-linecap="round"
												stroke-dasharray={`${RING}`}
												stroke-dashoffset={`${RING * (1 - progress)}`}
											/>
										</svg>
										<span class="num">{remaining}</span>
									</div>
								) : null}
							</>
						) : null}
					</div>

					<button
						type="button"
						class="spin"
						disabled={phase === "shuffling"}
						mix={on("click", spin)}
					>
						{phase === "idle" ? "🎲 Give me a move!" : "🎲 Next move!"}
					</button>

					<p class="stars" aria-label={`${stars} stars`}>
						{Array.from({ length: stars }, (_, i) => (
							<span key={i} aria-hidden="true">
								⭐
							</span>
						))}
					</p>
					{stars > 0 ? <p class="count">{stars} {stars === 1 ? "move" : "moves"} done!</p> : null}
				</div>
			);
		};
	},
);
