import { clientEntry, css, on } from "remix/component";
import type { Handle } from "remix/component";

import { speak, stopSpeaking } from "./speak.ts";

export interface SpeakButtonProps {
	text: string;
	/** Visible label. Leave out for an icon-only round button. */
	label?: string;
}

const buttonStyles = css({
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	gap: "8px",
	flexShrink: 0,
	minWidth: "56px",
	minHeight: "56px",
	padding: "0 14px",
	border: "3px solid var(--rule)",
	borderRadius: "999px",
	background: "var(--surface)",
	color: "var(--text)",
	fontSize: "20px",
	fontWeight: 600,
	cursor: "pointer",
	boxShadow: "0 4px 0 rgba(59, 37, 84, 0.12)",
	touchAction: "manipulation",
	"& .icon": { fontSize: "26px", lineHeight: 1 },
	"&[aria-pressed='true'] .icon": { animation: "speak-wiggle 500ms ease-in-out infinite" },
	"@keyframes speak-wiggle": {
		"0%, 100%": { transform: "rotate(-8deg)" },
		"50%": { transform: "rotate(8deg) scale(1.15)" },
	},
});

/** Speaker button that reads text aloud for children who can't read yet. */
export const SpeakButton = clientEntry(
	import.meta.url,
	function SpeakButton(handle: Handle<SpeakButtonProps>) {
		let speaking = false;

		handle.signal.addEventListener("abort", () => {
			if (speaking) stopSpeaking();
		});

		return () => {
			let { text, label } = handle.props;
			return (
				<button
					type="button"
					mix={[
						buttonStyles,
						on("click", () => {
							if (speaking) {
								stopSpeaking();
								speaking = false;
								handle.update();
								return;
							}
							speaking = true;
							handle.update();
							speak(text, {
								onEnd: () => {
									speaking = false;
									handle.update();
								},
							});
						}),
					]}
					aria-pressed={speaking ? "true" : "false"}
					aria-label={label ? undefined : speaking ? "Stop reading" : "Read this to me"}
					title={speaking ? "Stop" : "Read to me"}
				>
					<span class="icon" aria-hidden="true">
						{speaking ? "🔊" : "🔈"}
					</span>
					{label ? <span>{speaking ? "Stop" : label}</span> : null}
				</button>
			);
		};
	},
);
