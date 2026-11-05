import { clientEntry, css, on } from "remix/component";
import type { Handle } from "remix/component";

import { boop, cheer, pop, twinkle } from "../../ui/public/sounds.ts";
import { speak } from "../../ui/public/speak.ts";
import {
	COUNTING_LEVELS,
	NUMBER_WORDS,
	makeQuestion,
	type CountingLevel,
	type CountingQuestion,
} from "./games-model.ts";

const GOAL = 5;

const styles = css({
	display: "grid",
	gap: "18px",
	"& .levels": { display: "flex", flexWrap: "wrap", gap: "12px" },
	"& .level": {
		display: "inline-flex",
		alignItems: "center",
		gap: "10px",
		minHeight: "72px",
		padding: "0 28px",
		borderRadius: "999px",
		border: 0,
		background: "var(--tone)",
		color: "#fff",
		fontSize: "26px",
		fontWeight: 700,
		cursor: "pointer",
		boxShadow: "0 6px 0 rgba(0,0,0,0.2)",
		touchAction: "manipulation",
	},
	"& .intro": { margin: 0, fontSize: "22px", color: "var(--muted)" },
	"& .top": { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px" },
	"& .progress": { display: "flex", gap: "6px", fontSize: "34px" },
	"& .progress .off": { filter: "grayscale(1)", opacity: 0.3 },
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
		gap: "18px",
		justifyItems: "center",
		padding: "22px 16px",
		borderRadius: "var(--radius)",
		background: "var(--surface)",
		border: "6px solid var(--tone)",
		boxShadow: "var(--shadow)",
	},
	"& .prompt": { margin: 0, fontSize: "clamp(24px, 4.5vw, 32px)", fontWeight: 600, textAlign: "center" },
	"& .things": { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "16px" },
	"& .group": {
		display: "flex",
		flexWrap: "wrap",
		justifyContent: "center",
		gap: "10px",
		maxWidth: "420px",
		padding: "10px",
		borderRadius: "22px",
		background: "#fff4f4",
	},
	"& .set": { display: "flex", alignItems: "center", gap: "16px" },
	"& .plus": { fontSize: "56px", fontWeight: 700, color: "var(--tone)" },
	"& .thing": {
		position: "relative",
		width: "74px",
		height: "74px",
		border: 0,
		borderRadius: "20px",
		background: "transparent",
		fontSize: "54px",
		lineHeight: 1,
		cursor: "pointer",
		touchAction: "manipulation",
		transition: "transform 140ms ease",
	},
	"& .thing[data-counted='true']": { transform: "scale(0.9)", background: "#ffe3e3" },
	"& .badge": {
		position: "absolute",
		top: "-6px",
		right: "-6px",
		display: "grid",
		placeItems: "center",
		width: "32px",
		height: "32px",
		borderRadius: "50%",
		background: "var(--tone)",
		color: "#fff",
		fontSize: "18px",
		fontWeight: 700,
		animation: "count-pop 300ms ease",
	},
	"& .hint": { margin: 0, color: "var(--muted)", fontSize: "18px" },
	"& .choices": { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "18px" },
	"& .choice": {
		width: "104px",
		height: "104px",
		border: 0,
		borderRadius: "30px",
		background: "var(--tone)",
		color: "#fff",
		fontSize: "56px",
		fontWeight: 700,
		cursor: "pointer",
		boxShadow: "0 7px 0 rgba(0,0,0,0.2)",
		touchAction: "manipulation",
		"&:active": { transform: "translateY(5px)", boxShadow: "0 2px 0 rgba(0,0,0,0.2)" },
	},
	"& .choice[data-state='right']": { background: "var(--green)", animation: "count-pop 400ms ease" },
	"& .choice[data-state='wrong']": { background: "#c9bcd6", animation: "count-shake 400ms ease" },
	"& .feedback": { margin: 0, minHeight: "36px", fontSize: "28px", fontWeight: 700, textAlign: "center" },
	"& .win": { display: "grid", justifyItems: "center", gap: "14px", textAlign: "center" },
	"& .win .trophy": { fontSize: "110px", lineHeight: 1, animation: "count-pop 600ms ease" },
	"& .win p": { margin: 0, fontSize: "28px", fontWeight: 700 },
	"@keyframes count-pop": { "0%": { transform: "scale(0.4)" }, "70%": { transform: "scale(1.2)" }, "100%": { transform: "scale(1)" } },
	"@keyframes count-shake": {
		"0%, 100%": { transform: "translateX(0)" },
		"25%": { transform: "translateX(-10px)" },
		"75%": { transform: "translateX(10px)" },
	},
});

export const CountingGame = clientEntry(import.meta.url, function CountingGame(handle: Handle) {
	let level: CountingLevel | null = null;
	let question: CountingQuestion | null = null;
	let counted: number[] = [];
	let wrong: number[] = [];
	let right = false;
	let score = 0;
	let timer: ReturnType<typeof setTimeout> | undefined;

	handle.signal.addEventListener("abort", () => clearTimeout(timer));

	function next() {
		if (!level) return;
		question = makeQuestion(level, Math.random, question?.answer);
		counted = [];
		wrong = [];
		right = false;
		speak(question.prompt);
		handle.update();
	}

	function begin(id: CountingLevel) {
		level = id;
		score = 0;
		pop();
		next();
	}

	function answer(n: number) {
		if (!question || right) return;
		if (n === question.answer) {
			right = true;
			score++;
			cheer();
			if (score >= GOAL) {
				speak(`Yes, ${NUMBER_WORDS[n]}! You're a counting champion!`);
			} else {
				speak(`Yes! ${NUMBER_WORDS[n]}! Well done!`);
				timer = setTimeout(next, 2200);
			}
		} else {
			wrong = [...wrong, n];
			boop();
			speak("Not quite. Try counting again!");
		}
		handle.update();
	}

	return () => {
		if (!level || !question) {
			return (
				<div mix={styles}>
					<p class="intro">Choose a game:</p>
					<div class="levels">
						{COUNTING_LEVELS.map((l) => (
							<button key={l.id} type="button" class="level" mix={on("click", () => begin(l.id))}>
								<span aria-hidden="true">{l.emoji}</span>
								{l.label}
							</button>
						))}
					</div>
				</div>
			);
		}

		let q = question;
		let won = score >= GOAL;
		let offset = 0;

		return (
			<div mix={styles}>
				<div class="top">
					<div class="progress" aria-label={`${score} of ${GOAL} stars`}>
						{Array.from({ length: GOAL }, (_, i) => (
							<span key={i} class={i < score ? "" : "off"} aria-hidden="true">
								⭐
							</span>
						))}
					</div>
					<button
						type="button"
						class="small"
						mix={on("click", () => {
							clearTimeout(timer);
							level = null;
							question = null;
							handle.update();
						})}
					>
						⚙️ Change game
					</button>
				</div>

				<div class="board" aria-live="polite">
					{won ? (
						<div class="win" role="status">
							<span class="trophy" aria-hidden="true">
								🏆
							</span>
							<p>You're a counting champion!</p>
							<button type="button" class="level" mix={on("click", () => begin(level!))}>
								🔁 Play again
							</button>
						</div>
					) : (
						<>
							<p class="prompt">{q.prompt}</p>
							<div class="things">
								{q.groups.map((size, groupIndex) => {
									let start = offset;
									offset += size;
									return (
										<div class="set" key={`set-${groupIndex}`}>
											{groupIndex > 0 ? (
												<span class="plus" aria-hidden="true">
													+
												</span>
											) : null}
											<div class="group">
												{Array.from({ length: size }, (_, i) => {
													let id = start + i;
													let position = counted.indexOf(id);
													return (
														<button
															key={id}
															type="button"
															class="thing"
															data-counted={position >= 0 ? "true" : "false"}
															aria-label={position >= 0 ? `Counted ${position + 1}` : "Tap to count"}
															mix={on("click", () => {
																if (counted.includes(id)) return;
																counted = [...counted, id];
																pop();
																speak(NUMBER_WORDS[counted.length] ?? String(counted.length));
																if (counted.length === q.answer) twinkle();
																handle.update();
															})}
														>
															{q.emoji}
															{position >= 0 ? <span class="badge">{position + 1}</span> : null}
														</button>
													);
												})}
											</div>
										</div>
									);
								})}
							</div>
							<p class="hint">Tip: tap each one to count it!</p>
							<div class="choices" role="group" aria-label="Answers">
								{q.choices.map((n) => (
									<button
										key={n}
										type="button"
										class="choice"
										data-state={right && n === q.answer ? "right" : wrong.includes(n) ? "wrong" : undefined}
										disabled={wrong.includes(n)}
										mix={on("click", () => answer(n))}
									>
										{n}
									</button>
								))}
							</div>
							<p class="feedback">{right ? "🎉 Yes! Well done!" : wrong.length ? "Try again! 💪" : ""}</p>
						</>
					)}
				</div>
			</div>
		);
	};
});
