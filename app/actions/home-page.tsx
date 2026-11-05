import type { Handle } from "remix/component";
import { css } from "remix/component";

import { ACTIVITIES, SITE_NAME, type Activity } from "../data/activities.ts";
import { Layout } from "../ui/layout.tsx";
import { SpeakButton } from "../ui/public/speak-button.tsx";

const hero = css({
	position: "relative",
	textAlign: "center",
	padding: "28px 8px 20px",
	"& .sun": {
		display: "inline-block",
		fontSize: "64px",
		lineHeight: 1,
		animation: "home-spin 18s linear infinite",
	},
	"& h1": {
		margin: "6px 0 4px",
		fontSize: "clamp(48px, 12vw, 96px)",
		fontWeight: 700,
		lineHeight: 1,
		letterSpacing: "-0.01em",
		background:
			"linear-gradient(90deg, var(--pink), var(--orange), var(--yellow), var(--green), var(--blue), var(--purple))",
		WebkitBackgroundClip: "text",
		backgroundClip: "text",
		color: "transparent",
		filter: "drop-shadow(0 4px 0 rgba(59, 37, 84, 0.12))",
	},
	"& .hello": {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		gap: "12px",
		margin: "8px 0 0",
		fontSize: "24px",
		color: "var(--muted)",
	},
	"@keyframes home-spin": { to: { transform: "rotate(360deg)" } },
});

const grid = css({
	listStyle: "none",
	margin: "16px 0 0",
	padding: 0,
	display: "grid",
	gap: "18px",
	gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
	"@media (min-width: 720px)": { gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "22px" },
	"@media (min-width: 1000px)": { gridTemplateColumns: "repeat(4, minmax(0, 1fr))" },
});

const tile = css({
	position: "relative",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	gap: "6px",
	height: "100%",
	minHeight: "170px",
	padding: "18px 12px",
	borderRadius: "28px",
	background: "var(--tone)",
	color: "#fff",
	textAlign: "center",
	textDecoration: "none",
	boxShadow: "0 8px 0 rgba(59, 37, 84, 0.18)",
	transition: "transform 140ms ease",
	overflow: "hidden",
	// soft shine in the corner
	"&::before": {
		content: '""',
		position: "absolute",
		top: "-30px",
		right: "-30px",
		width: "110px",
		height: "110px",
		borderRadius: "50%",
		background: "rgba(255, 255, 255, 0.18)",
	},
	"& .emoji": {
		fontSize: "64px",
		lineHeight: 1,
		filter: "drop-shadow(0 4px 0 rgba(0, 0, 0, 0.12))",
		transition: "transform 200ms ease",
	},
	"& .title": {
		fontSize: "24px",
		fontWeight: 700,
		lineHeight: 1.1,
		textShadow: "0 2px 0 rgba(0, 0, 0, 0.15)",
	},
	"& .blurb": {
		fontSize: "16px",
		opacity: 0.95,
		lineHeight: 1.25,
	},
	"&:hover": { transform: "translateY(-4px) rotate(-1deg)" },
	"&:hover .emoji": { transform: "scale(1.15) rotate(6deg)" },
	"&:active": { transform: "translateY(4px)", boxShadow: "0 3px 0 rgba(59, 37, 84, 0.18)" },
	"@media (max-width: 480px)": {
		minHeight: "150px",
		"& .emoji": { fontSize: "52px" },
		"& .title": { fontSize: "20px" },
		"& .blurb": { display: "none" },
	},
});

// Yellow tiles need dark text to stay readable.
const lightTile = css({
	color: "var(--text)",
	"& .title": { textShadow: "none" },
});

function Tile(handle: Handle<{ activity: Activity }>) {
	return () => {
		let { activity } = handle.props;
		let isLight = activity.tone === "var(--yellow)";
		return (
			<li>
				<a
					href={activity.href}
					mix={isLight ? [tile, lightTile] : tile}
					style={{ "--tone": activity.tone }}
				>
					<span class="emoji" aria-hidden="true">
						{activity.emoji}
					</span>
					<span class="title">{activity.title}</span>
					<span class="blurb">{activity.blurb}</span>
				</a>
			</li>
		);
	};
}

export function HomePage() {
	return () => (
		<Layout home description="Games, drawing, stories and treats in Sparkle Town.">
			<section mix={hero}>
				<span class="sun" aria-hidden="true">
					🌈
				</span>
				<h1>{SITE_NAME}</h1>
				<p class="hello">
					What shall we do today?
					<SpeakButton text={`Hello! Welcome to ${SITE_NAME}! What shall we do today? Tap a picture to play.`} />
				</p>
			</section>

			<nav aria-label="Things to do">
				<ul mix={grid}>
					{ACTIVITIES.map((activity) => (
						<Tile key={activity.key} activity={activity} />
					))}
				</ul>
			</nav>
		</Layout>
	);
}
