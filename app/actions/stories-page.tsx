import { css } from "remix/component";

import { STORIES } from "../data/stories.ts";
import { routes } from "../routes.ts";
import { Layout } from "../ui/layout.tsx";

const shelf = css({
	listStyle: "none",
	margin: 0,
	padding: 0,
	display: "grid",
	gap: "22px",
	gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
	"& a": {
		position: "relative",
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		gap: "12px",
		height: "100%",
		minHeight: "240px",
		padding: "22px 20px 20px 34px",
		borderRadius: "10px 28px 28px 10px",
		background: "var(--book)",
		color: "#fff",
		textDecoration: "none",
		boxShadow: "0 8px 0 rgba(59, 37, 84, 0.2)",
		transition: "transform 160ms ease",
	},
	// the book's spine
	"& a::before": {
		content: '""',
		position: "absolute",
		left: "10px",
		top: 0,
		bottom: 0,
		width: "8px",
		background: "rgba(0,0,0,0.15)",
	},
	"& a:hover": { transform: "translateY(-4px) rotate(-1.5deg)" },
	"& .emoji": { fontSize: "80px", lineHeight: 1, filter: "drop-shadow(0 4px 0 rgba(0,0,0,0.15))" },
	"& .title": { fontSize: "26px", fontWeight: 700, lineHeight: 1.15, textShadow: "0 2px 0 rgba(0,0,0,0.15)" },
	"& .pages": { fontSize: "16px", opacity: 0.9 },
});

export function StoriesPage() {
	return () => (
		<Layout activity="stories">
			<ul mix={shelf}>
				{STORIES.map((story) => (
					<li key={story.slug}>
						<a href={routes.story.href({ slug: story.slug })} style={{ "--book": story.colour }}>
							<span class="emoji" aria-hidden="true">
								{story.emoji}
							</span>
							<span>
								<span class="title">{story.title}</span>
								<br />
								<span class="pages">{story.pages.length} pages</span>
							</span>
						</a>
					</li>
				))}
			</ul>
		</Layout>
	);
}
