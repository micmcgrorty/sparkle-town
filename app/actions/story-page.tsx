import { css } from "remix/component";
import type { Handle } from "remix/component";

import { STORIES, type Story } from "../data/stories.ts";
import { routes } from "../routes.ts";
import { Layout } from "../ui/layout.tsx";
import { StoryBook } from "./public/story-book.tsx";

const more = css({
	marginTop: "28px",
	"& h2": { margin: "0 0 12px", fontSize: "26px" },
	"& ul": { listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", gap: "12px" },
	"& a": {
		display: "inline-flex",
		alignItems: "center",
		gap: "8px",
		minHeight: "56px",
		padding: "0 18px",
		borderRadius: "999px",
		background: "var(--surface)",
		border: "3px solid var(--rule)",
		fontWeight: 600,
		textDecoration: "none",
	},
});

export function StoryPage(handle: Handle<{ story: Story }>) {
	return () => {
		let { story } = handle.props;
		let others = STORIES.filter((s) => s.slug !== story.slug);
		return (
			<Layout activity="stories" title={story.title} say={`${story.title}. ${story.pages[0].text}`}>
				<StoryBook story={story} />
				<nav mix={more} aria-labelledby="more-stories">
					<h2 id="more-stories">More stories</h2>
					<ul>
						{others.map((s) => (
							<li key={s.slug}>
								<a href={routes.story.href({ slug: s.slug })}>
									<span aria-hidden="true">{s.emoji}</span>
									{s.title}
								</a>
							</li>
						))}
					</ul>
				</nav>
			</Layout>
		);
	};
}
