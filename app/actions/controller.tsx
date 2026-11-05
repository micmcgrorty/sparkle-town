import { createController } from "remix/router";

import { assets } from "../assets.ts";
import { getStory } from "../data/stories.ts";
import { routes } from "../routes.ts";
import { BakeryPage } from "./bakery-page.tsx";
import { CountingPage } from "./counting-page.tsx";
import { DollhousePage } from "./dollhouse-page.tsx";
import { DrawPage } from "./draw-page.tsx";
import { FavouritesPage } from "./favourites-page.tsx";
import { HomePage } from "./home-page.tsx";
import { MatchPage } from "./match-page.tsx";
import { NotFoundPage } from "./not-found-page.tsx";
import { SeaPage } from "./sea-page.tsx";
import { StoriesPage } from "./stories-page.tsx";
import { StoryPage } from "./story-page.tsx";
import { UnicornPage } from "./unicorn-page.tsx";
import { WigglePage } from "./wiggle-page.tsx";

export default createController(routes, {
	actions: {
		async assets(context) {
			return (await assets.fetch(context.request)) ?? new Response("Not Found", { status: 404 });
		},

		home(context) {
			return context.render(<HomePage />);
		},

		draw(context) {
			return context.render(<DrawPage />);
		},

		bakery(context) {
			return context.render(<BakeryPage />);
		},

		dollhouse(context) {
			return context.render(<DollhousePage />);
		},

		sea(context) {
			return context.render(<SeaPage />);
		},

		wiggle(context) {
			return context.render(<WigglePage />);
		},

		unicorn(context) {
			return context.render(<UnicornPage />);
		},

		stories(context) {
			return context.render(<StoriesPage />);
		},

		story(context) {
			let story = getStory(context.params.slug);
			if (!story) {
				return context.render(<NotFoundPage message="We couldn't find that story." />, { status: 404 });
			}
			return context.render(<StoryPage story={story} />);
		},

		match(context) {
			return context.render(<MatchPage />);
		},

		counting(context) {
			return context.render(<CountingPage />);
		},

		favourites(context) {
			return context.render(<FavouritesPage />);
		},

		notFound(context) {
			return context.render(<NotFoundPage />, { status: 404 });
		},
	},
});
