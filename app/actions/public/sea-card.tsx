import { clientEntry, css, on } from "remix/component";
import type { Handle } from "remix/component";

import { pop } from "../../ui/public/sounds.ts";
import { speak } from "../../ui/public/speak.ts";

export interface SeaCardCreature {
	id: string;
	name: string;
	emoji: string;
	colour: string;
	fact: string;
}

const card = css({
	position: "relative",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	gap: "6px",
	width: "100%",
	minHeight: "190px",
	padding: "16px 12px",
	border: "4px solid rgba(255,255,255,0.85)",
	borderRadius: "28px",
	background: "var(--card)",
	color: "#fff",
	textAlign: "center",
	cursor: "pointer",
	boxShadow: "0 8px 0 rgba(0, 20, 60, 0.25)",
	touchAction: "manipulation",
	transition: "transform 160ms ease",
	"& .emoji": {
		fontSize: "72px",
		lineHeight: 1,
		animation: "sea-bob 3s ease-in-out infinite",
		animationDelay: "var(--delay)",
	},
	"& .name": { fontSize: "22px", fontWeight: 700, textShadow: "0 2px 0 rgba(0,0,0,0.2)" },
	"& .fact": { fontSize: "18px", lineHeight: 1.3, fontWeight: 500, textShadow: "0 1px 0 rgba(0,0,0,0.2)" },
	"& .hint": { fontSize: "15px", opacity: 0.9 },
	"&:hover": { transform: "translateY(-3px) rotate(-1deg)" },
	"&[aria-expanded='true']": { background: "#fff", color: "var(--text)", borderColor: "var(--card)" },
	"&[aria-expanded='true'] .name, &[aria-expanded='true'] .fact": { textShadow: "none" },
	"&[aria-expanded='true'] .emoji": { fontSize: "48px", animation: "sea-spin 600ms ease" },
	"@keyframes sea-bob": {
		"0%, 100%": { transform: "translateY(0) rotate(-3deg)" },
		"50%": { transform: "translateY(-8px) rotate(3deg)" },
	},
	"@keyframes sea-spin": { from: { transform: "rotate(-30deg) scale(0.6)" }, to: { transform: "rotate(0) scale(1)" } },
});

/** A sea creature that flips over to show (and say) a fun fact when tapped. */
export const SeaCard = clientEntry(
	import.meta.url,
	function SeaCard(handle: Handle<{ creature: SeaCardCreature }>) {
		let open = false;

		return () => {
			let { creature } = handle.props;
			let delay = `${(creature.id.length % 5) * 0.4}s`;
			return (
				<button
					type="button"
					mix={[
						card,
						on("click", () => {
							open = !open;
							pop();
							if (open) speak(`${creature.name}! ${creature.fact}`);
							handle.update();
						}),
					]}
					style={{ "--card": creature.colour, "--delay": delay }}
					aria-expanded={open ? "true" : "false"}
				>
					<span class="emoji" aria-hidden="true">
						{creature.emoji}
					</span>
					<span class="name">{creature.name}</span>
					{open ? <span class="fact">{creature.fact}</span> : <span class="hint">Tap me!</span>}
				</button>
			);
		};
	},
);
