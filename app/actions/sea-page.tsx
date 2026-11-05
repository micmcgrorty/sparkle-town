import { css } from "remix/component";

import { SEA_CREATURES } from "../data/sea.ts";
import { Layout } from "../ui/layout.tsx";
import { SeaCard } from "./public/sea-card.tsx";

const ocean = css({
	position: "relative",
	borderRadius: "var(--radius)",
	padding: "24px 16px 120px",
	background: "linear-gradient(#7fd3ff 0%, #2b9be0 35%, #1564b3 70%, #0d3f7a 100%)",
	boxShadow: "var(--shadow)",
	overflow: "hidden",
	"@media (min-width: 640px)": { padding: "32px 28px 130px" },
	// sandy floor with seaweed
	"&::after": {
		content: '""',
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
		height: "70px",
		background: "radial-gradient(ellipse at 50% 0, #f6d79a 0 60%, #e8bf72 61%)",
	},
	"& .weed": {
		position: "absolute",
		bottom: "40px",
		fontSize: "64px",
		zIndex: 1,
		transformOrigin: "bottom center",
		animation: "sea-sway 4s ease-in-out infinite",
	},
	"& .bubble": {
		position: "absolute",
		bottom: "-20px",
		width: "18px",
		height: "18px",
		borderRadius: "50%",
		border: "2px solid rgba(255,255,255,0.7)",
		background: "rgba(255,255,255,0.15)",
		animation: "sea-rise 7s linear infinite",
		pointerEvents: "none",
	},
	"& ul": {
		position: "relative",
		zIndex: 2,
		listStyle: "none",
		margin: 0,
		padding: 0,
		display: "grid",
		gap: "18px",
		gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
		"@media (min-width: 720px)": { gridTemplateColumns: "repeat(3, minmax(0, 1fr))" },
		"@media (min-width: 1000px)": { gridTemplateColumns: "repeat(4, minmax(0, 1fr))" },
	},
	"@keyframes sea-sway": {
		"0%, 100%": { transform: "rotate(-6deg)" },
		"50%": { transform: "rotate(6deg)" },
	},
	"@keyframes sea-rise": {
		"0%": { transform: "translateY(0)", opacity: 0 },
		"10%": { opacity: 1 },
		"100%": { transform: "translateY(-900px)", opacity: 0 },
	},
});

const BUBBLES = [
	{ left: "6%", delay: "0s", size: 14 },
	{ left: "22%", delay: "2.5s", size: 22 },
	{ left: "41%", delay: "1.2s", size: 12 },
	{ left: "63%", delay: "3.8s", size: 18 },
	{ left: "78%", delay: "0.6s", size: 26 },
	{ left: "92%", delay: "4.6s", size: 14 },
];

export function SeaPage() {
	return () => (
		<Layout activity="sea">
			<div mix={ocean}>
				{BUBBLES.map((b, i) => (
					<span
						key={i}
						class="bubble"
						aria-hidden="true"
						style={{ left: b.left, animationDelay: b.delay, width: `${b.size}px`, height: `${b.size}px` }}
					/>
				))}
				<span class="weed" aria-hidden="true" style={{ left: "4%" }}>
					🌿
				</span>
				<span class="weed" aria-hidden="true" style={{ left: "46%", animationDelay: "1s" }}>
					🪸
				</span>
				<span class="weed" aria-hidden="true" style={{ right: "5%", animationDelay: "2s" }}>
					🌿
				</span>
				<ul>
					{SEA_CREATURES.map((creature) => (
						<li key={creature.id}>
							<SeaCard creature={creature} />
						</li>
					))}
				</ul>
			</div>
		</Layout>
	);
}
