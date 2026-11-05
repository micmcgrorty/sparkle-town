import { routes } from "../routes.ts";

export type ActivityKey =
	| "draw"
	| "bakery"
	| "dollhouse"
	| "sea"
	| "wiggle"
	| "unicorn"
	| "stories"
	| "match"
	| "counting"
	| "favourites";

export interface Activity {
	key: ActivityKey;
	title: string;
	emoji: string;
	/** CSS colour token for the activity. */
	tone: string;
	/** Short line shown under the title. */
	blurb: string;
	/** What the read-aloud button says on the activity's page. */
	say: string;
	href: string;
}

export const SITE_NAME = "Sparkle Town";

export const ACTIVITIES: Activity[] = [
	{
		key: "draw",
		title: "Drawing Pad",
		emoji: "🖍️",
		tone: "var(--pink)",
		blurb: "Draw, colour and add stickers",
		say: "Drawing Pad! Pick a colour and draw with your finger. You can add stickers too, and save your picture to your gallery.",
		href: routes.draw.href(),
	},
	{
		key: "bakery",
		title: "Bake Shop",
		emoji: "🧁",
		tone: "var(--orange)",
		blurb: "Cupcakes, ice cream and steak pie",
		say: "Welcome to the Bake Shop! Make a cupcake, build an ice cream, or decorate a Scottish steak pie.",
		href: routes.bakery.href(),
	},
	{
		key: "dollhouse",
		title: "Dollhouse",
		emoji: "🏠",
		tone: "var(--purple)",
		blurb: "Move your family around the house",
		say: "Dollhouse! Drag your family, pets and toys into the rooms. Where is everybody going to be today?",
		href: routes.dollhouse.href(),
	},
	{
		key: "sea",
		title: "Under the Sea",
		emoji: "🐙",
		tone: "var(--sea)",
		blurb: "Dive down and meet sea creatures",
		say: "Under the Sea! Tap a sea creature to find out a fun fact about it.",
		href: routes.sea.href(),
	},
	{
		key: "wiggle",
		title: "Wiggle Time",
		emoji: "🤸",
		tone: "var(--green)",
		blurb: "Gymnastics and swimming moves",
		say: "Wiggle Time! Press the big button and do the move. Ready, steady, wiggle!",
		href: routes.wiggle.href(),
	},
	{
		key: "unicorn",
		title: "Unicorn Maker",
		emoji: "🦄",
		tone: "var(--purple)",
		blurb: "Make a unicorn and give it a name",
		say: "Unicorn Maker! Choose your unicorn's colours, give it a crown, and find out its magic name.",
		href: routes.unicorn.href(),
	},
	{
		key: "stories",
		title: "Story Time",
		emoji: "📚",
		tone: "var(--yellow)",
		blurb: "Little stories to read together",
		say: "Story Time! Pick a story. Press the speaker button and I'll read it to you.",
		href: routes.stories.href(),
	},
	{
		key: "match",
		title: "Snap Match",
		emoji: "🃏",
		tone: "var(--blue)",
		blurb: "Find the matching pairs",
		say: "Snap Match! Turn over two cards. If they match, you keep them. Can you find all the pairs?",
		href: routes.match.href(),
	},
	{
		key: "counting",
		title: "Counting Fun",
		emoji: "🔢",
		tone: "var(--red)",
		blurb: "Count things like at school",
		say: "Counting Fun! Count the things, then tap the right number.",
		href: routes.counting.href(),
	},
	{
		key: "favourites",
		title: "My Favourite Things",
		emoji: "⭐",
		tone: "var(--yellow)",
		blurb: "All the things I love",
		say: "These are some of my very favourite things!",
		href: routes.favourites.href(),
	},
];

export function getActivity(key: ActivityKey): Activity {
	let activity = ACTIVITIES.find((item) => item.key === key);
	if (!activity) throw new Error(`Unknown activity: ${key}`);
	return activity;
}
