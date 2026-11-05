import { css } from "remix/component";

import { FAVOURITES } from "../data/favourites.ts";
import { Layout } from "../ui/layout.tsx";

const grid = css({
	listStyle: "none",
	margin: 0,
	padding: 0,
	display: "grid",
	gap: "16px",
	gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
	"& li > *": {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		gap: "8px",
		height: "100%",
		minHeight: "150px",
		padding: "16px 10px",
		borderRadius: "26px",
		background: "var(--surface)",
		border: "5px solid var(--fav)",
		boxShadow: "var(--shadow)",
		textAlign: "center",
		textDecoration: "none",
	},
	"& li:nth-child(odd) > *": { transform: "rotate(-2deg)" },
	"& li:nth-child(even) > *": { transform: "rotate(2deg)" },
	"& a:hover": { transform: "rotate(0) scale(1.04)" },
	"& .emoji": { fontSize: "56px", lineHeight: 1 },
	"& .label": { fontSize: "21px", fontWeight: 600, lineHeight: 1.15 },
	"& .play": { fontSize: "15px", color: "var(--muted)" },
});

export function FavouritesPage() {
	let say = `These are some of my very favourite things! ${FAVOURITES.map((f) => f.label).join(", ")}.`;
	return () => (
		<Layout activity="favourites" say={say}>
			<ul mix={grid}>
				{FAVOURITES.map((fav) => (
					<li key={fav.label}>
						{fav.href ? (
							<a href={fav.href} style={{ "--fav": fav.colour }}>
								<span class="emoji" aria-hidden="true">
									{fav.emoji}
								</span>
								<span class="label">{fav.label}</span>
								<span class="play">Play ▶</span>
							</a>
						) : (
							<div style={{ "--fav": fav.colour }}>
								<span class="emoji" aria-hidden="true">
									{fav.emoji}
								</span>
								<span class="label">{fav.label}</span>
							</div>
						)}
					</li>
				))}
			</ul>
		</Layout>
	);
}
