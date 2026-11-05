import { get, route } from "remix/routes";

export const routes = route({
	assets: get("/assets/*path"),
	home: get("/"),
	draw: get("/draw"),
	bakery: get("/bakery"),
	dollhouse: get("/dollhouse"),
	sea: get("/sea"),
	wiggle: get("/wiggle"),
	unicorn: get("/unicorn"),
	stories: get("/stories"),
	story: get("/stories/:slug"),
	match: get("/match"),
	counting: get("/counting"),
	favourites: get("/favourites"),
	notFound: get("/*path"),
});
