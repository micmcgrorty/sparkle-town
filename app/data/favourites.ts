import { routes } from "../routes.ts";

export interface Favourite {
	label: string;
	emoji: string;
	colour: string;
	/** Where to play with it on this site, if anywhere. */
	href?: string;
}

/** Edit this list as favourites change. */
export const FAVOURITES: Favourite[] = [
	{ label: "Pokémon", emoji: "⚡", colour: "#ffc93c" },
	{ label: "Toca Boca World", emoji: "🏙️", colour: "#2fc48d", href: routes.dollhouse.href() },
	{ label: "Octonauts", emoji: "🐙", colour: "#1677c9", href: routes.sea.href() },
	{ label: "Gabby's Dollhouse", emoji: "🐱", colour: "#ff5fa2", href: routes.dollhouse.href() },
	{ label: "Sweet treats", emoji: "🍭", colour: "#ff8a3d", href: routes.bakery.href() },
	{ label: "Gymnastics", emoji: "🤸", colour: "#9b6bff", href: routes.wiggle.href() },
	{ label: "Swimming", emoji: "🏊", colour: "#2bb5e8", href: routes.wiggle.href() },
	{ label: "Drawing", emoji: "🖍️", colour: "#ff5a5f", href: routes.draw.href() },
	{ label: "Reading", emoji: "📚", colour: "#2fc48d", href: routes.stories.href() },
	{ label: "SpongeBob", emoji: "🧽", colour: "#ffc93c" },
	{ label: "Unicorns", emoji: "🦄", colour: "#b48cff", href: routes.unicorn.href() },
	{ label: "Princesses", emoji: "👑", colour: "#ff5fa2", href: routes.unicorn.href() },
	{ label: "Disney", emoji: "🏰", colour: "#4aa3ff" },
	{ label: "School", emoji: "🏫", colour: "#ff8a3d", href: routes.counting.href() },
	{ label: "My family", emoji: "👨‍👩‍👧", colour: "#ff5a5f", href: routes.dollhouse.href() },
	{ label: "Scottish steak pie", emoji: "🥧", colour: "#c47a3a", href: routes.bakery.href() },
];
