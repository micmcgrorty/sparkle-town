import { clientEntry, css, on } from "remix/component";
import type { Handle } from "remix/component";

import { cheer, pop } from "../../ui/public/sounds.ts";
import { speak, stopSpeaking } from "../../ui/public/speak.ts";

export interface StoryBookStory {
	slug: string;
	title: string;
	emoji: string;
	colour: string;
	pages: { scene: string; text: string }[];
}

const styles = css({
	display: "grid",
	gap: "16px",
	"& .page": {
		position: "relative",
		display: "grid",
		gap: "18px",
		alignContent: "center",
		minHeight: "380px",
		padding: "28px 22px",
		borderRadius: "var(--radius)",
		background: "var(--surface)",
		border: "6px solid var(--book)",
		boxShadow: "var(--shadow)",
		textAlign: "center",
		"@media (min-width: 640px)": { padding: "40px 48px", minHeight: "440px" },
	},
	"& .scene": {
		fontSize: "clamp(56px, 14vw, 104px)",
		lineHeight: 1.1,
		letterSpacing: "0.08em",
		animation: "book-in 450ms ease",
	},
	"& .text": {
		margin: 0,
		fontSize: "clamp(24px, 4.4vw, 34px)",
		lineHeight: 1.4,
		fontWeight: 500,
		maxWidth: "30ch",
		marginInline: "auto",
	},
	"& .number": {
		position: "absolute",
		bottom: "12px",
		right: "18px",
		fontSize: "18px",
		color: "var(--muted)",
	},
	"& .dots": { display: "flex", justifyContent: "center", gap: "8px" },
	"& .dot": {
		width: "16px",
		height: "16px",
		borderRadius: "50%",
		background: "var(--rule)",
		border: 0,
		padding: 0,
		cursor: "pointer",
	},
	"& .dot[aria-current='step']": { background: "var(--book)", transform: "scale(1.3)" },
	"& .controls": {
		display: "flex",
		flexWrap: "wrap",
		justifyContent: "center",
		gap: "12px",
	},
	"& .btn": {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		gap: "8px",
		minHeight: "64px",
		minWidth: "64px",
		padding: "0 24px",
		border: 0,
		borderRadius: "999px",
		background: "var(--book)",
		color: "#fff",
		fontSize: "22px",
		fontWeight: 600,
		cursor: "pointer",
		boxShadow: "0 5px 0 rgba(0,0,0,0.18)",
		touchAction: "manipulation",
	},
	"@media (max-width: 420px)": { "& .btn": { padding: "0 16px", fontSize: "19px" }, "& .controls": { gap: "8px" } },
	"& .btn.secondary": { background: "var(--surface)", color: "var(--text)", boxShadow: "0 0 0 3px var(--rule), 0 5px 0 rgba(0,0,0,0.08)" },
	"& .btn:disabled": { opacity: 0.4, cursor: "default" },
	"& .btn[aria-pressed='true']": { background: "var(--text)" },
	"& .end": { fontSize: "clamp(40px, 8vw, 64px)", fontWeight: 700, color: "var(--book)", margin: 0 },
	"@keyframes book-in": {
		from: { opacity: 0, transform: "scale(0.85) rotate(-3deg)" },
		to: { opacity: 1, transform: "scale(1) rotate(0)" },
	},
});

/** A picture book that turns pages and can read itself aloud. */
export const StoryBook = clientEntry(
	import.meta.url,
	function StoryBook(handle: Handle<{ story: StoryBookStory }>) {
		let index = 0;
		// Reading the whole story turns the pages by itself.
		let reading = false;

		handle.signal.addEventListener("abort", () => stopSpeaking());

		function total() {
			return handle.props.story.pages.length;
		}

		function goTo(next: number) {
			index = Math.max(0, Math.min(total(), next));
			pop();
			if (reading) readCurrent();
			handle.update();
		}

		function readCurrent() {
			let { story } = handle.props;
			if (index >= total()) {
				reading = false;
				speak("The end!");
				cheer();
				handle.update();
				return;
			}
			let text = story.pages[index].text;
			if (index === 0) text = `${story.title}. ${text}`;
			let readingIndex = index;
			speak(text, {
				onEnd: () => {
					// Only move on if nobody turned the page or stopped in the meantime.
					if (!reading || index !== readingIndex) return;
					setTimeout(() => {
						if (!reading || index !== readingIndex || handle.signal.aborted) return;
						index++;
						if (index >= total()) {
							reading = false;
							cheer();
							speak("The end!");
						} else {
							readCurrent();
						}
						handle.update();
					}, 700);
				},
			});
		}

		return () => {
			let { story } = handle.props;
			let atEnd = index >= story.pages.length;
			let page = story.pages[Math.min(index, story.pages.length - 1)];

			return (
				<div mix={styles} style={{ "--book": story.colour }}>
					<div class="page" aria-live="polite">
						{atEnd ? (
							<>
								<div class="scene" key="end" aria-hidden="true">
									{story.emoji} 🌟
								</div>
								<p class="end">The End</p>
							</>
						) : (
							<>
								<div class="scene" key={`scene-${index}`} aria-hidden="true">
									{page.scene}
								</div>
								<p class="text">{page.text}</p>
								<span class="number">
									{index + 1} / {story.pages.length}
								</span>
							</>
						)}
					</div>

					<div class="dots" role="group" aria-label="Pages">
						{story.pages.map((_, i) => (
							<button
								key={i}
								type="button"
								class="dot"
								aria-label={`Page ${i + 1}`}
								aria-current={i === index ? "step" : undefined}
								mix={on("click", () => goTo(i))}
							/>
						))}
					</div>

					<div class="controls">
						<button
							type="button"
							class="btn secondary"
							aria-label="Back a page"
							disabled={index === 0}
							mix={on("click", () => goTo(index - 1))}
						>
							◀️
						</button>
						<button
							type="button"
							class="btn"
							aria-pressed={reading ? "true" : "false"}
							mix={on("click", () => {
								if (reading) {
									reading = false;
									stopSpeaking();
								} else {
									reading = true;
									if (atEnd) index = 0;
									readCurrent();
								}
								handle.update();
							})}
						>
							{reading ? "⏹️ Stop" : "🔊 Read to me"}
						</button>
						{atEnd ? (
							<button type="button" class="btn secondary" mix={on("click", () => goTo(0))}>
								🔁 Again
							</button>
						) : (
							<button
								type="button"
								class="btn secondary"
								aria-label="Next page"
								mix={on("click", () => goTo(index + 1))}
							>
								▶️
							</button>
						)}
					</div>
				</div>
			);
		};
	},
);
