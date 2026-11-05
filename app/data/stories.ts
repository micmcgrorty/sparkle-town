export interface StoryPage {
	/** A row of emoji that illustrates the page. */
	scene: string;
	text: string;
}

export interface Story {
	slug: string;
	title: string;
	emoji: string;
	colour: string;
	pages: StoryPage[];
}

export const STORIES: Story[] = [
	{
		slug: "steak-pie-surprise",
		title: "The Steak Pie Surprise",
		emoji: "🥧",
		colour: "#ff8a3d",
		pages: [
			{ scene: "🎆 🏠 ❄️", text: "It was New Year's Day, and the whole family was coming for dinner." },
			{ scene: "👵 🥧 👧", text: "\"In Scotland, we always have steak pie on New Year's Day,\" said Granny. \"Will you help me?\"" },
			{ scene: "⭐ 🌙 💛", text: "Poppy rolled the pastry flat. She cut out stars and moons and a big heart for the top of the pie." },
			{ scene: "🔥 ⏰ 👃", text: "Into the oven it went. Soon the whole house smelled warm and yummy." },
			{ scene: "👨 👩 👧 👶 🐶", text: "Everyone squeezed round the table. \"Who made the pastry stars?\" asked Dad." },
			{ scene: "🙋‍♀️ 🥧 🎉", text: "\"Me!\" said Poppy. And it was the best steak pie ever. Happy New Year!" },
		],
	},
	{
		slug: "sprinkles-learns-to-swim",
		title: "Sprinkles Learns to Swim",
		emoji: "🦄",
		colour: "#9b6bff",
		pages: [
			{ scene: "🦄 🌈 🏊", text: "Sprinkles the unicorn loved rainbows and glitter. But she did not love water." },
			{ scene: "🦄 💧 😟", text: "\"It's too splashy,\" said Sprinkles, dipping one hoof in the pool." },
			{ scene: "👧 🛟 🦄", text: "\"Hold my hand,\" said Poppy. \"We'll start with kicky legs.\" Kick, kick, kick!" },
			{ scene: "🫧 🦄 🫧", text: "Next they blew bubbles. Sprinkles' bubbles came out rainbow coloured!" },
			{ scene: "⭐ 🦄 ⭐", text: "Then they did a starfish float, lying on their backs and looking at the sky." },
			{ scene: "🏅 🦄 🎉", text: "\"I can swim!\" cheered Sprinkles. She got a shiny badge, and she wore it all week." },
		],
	},
	{
		slug: "cupcake-ball",
		title: "The Cupcake Ball",
		emoji: "🧁",
		colour: "#ff5fa2",
		pages: [
			{ scene: "🏰 👑 💌", text: "Princess Poppy was having a ball at the castle, and everyone was invited." },
			{ scene: "👑 🧁 🍓", text: "She baked one hundred cupcakes: strawberry, chocolate and lemon." },
			{ scene: "🌈 ✨ 😲", text: "But oh no! The sprinkle jar tipped over. Sprinkles went everywhere!" },
			{ scene: "🐱 🌈 😹", text: "On the cupcakes, on the floor, and all over the castle cat." },
			{ scene: "💃 🌈 🕺", text: "The guests thought the sprinkly castle was magic. They danced and twirled all night." },
			{ scene: "👑 😴 🌙", text: "\"Next time,\" yawned the princess, \"I'll use the sprinkle jar with a lid.\"" },
		],
	},
	{
		slug: "deep-sea-rescue",
		title: "Deep Sea Rescue",
		emoji: "🐢",
		colour: "#1677c9",
		pages: [
			{ scene: "🟡 🌊 👧", text: "Captain Poppy climbed into her little yellow submarine. Down, down, down she went." },
			{ scene: "🐠 🪸 🐙", text: "She waved at the fish and the coral and a friendly octopus." },
			{ scene: "🐢 🕸️ 😢", text: "Then she heard a sad sound. A baby turtle was stuck in an old fishing net!" },
			{ scene: "🦾 ✂️ 🐢", text: "Poppy used the submarine's grabber arm to snip, snip, snip the net." },
			{ scene: "🐢 💨 💙", text: "The turtle was free! It swam a happy loop around the submarine." },
			{ scene: "🗑️ 🌊 ⭐", text: "Poppy took the net home to the bin, so it couldn't catch anyone else. Mission complete!" },
		],
	},
	{
		slug: "cartwheel-day",
		title: "Cartwheel Day",
		emoji: "🤸",
		colour: "#2fc48d",
		pages: [
			{ scene: "🏫 🎒 👧", text: "On Monday, Poppy's teacher said, \"On Friday it's our gymnastics show!\"" },
			{ scene: "🤸 💥 🌱", text: "Poppy practised her cartwheel in the garden. She wobbled and fell in a bush!" },
			{ scene: "👨 👍 🤸", text: "\"Hands down, legs up, look at your hands,\" said Dad. \"Try again!\"" },
			{ scene: "📅 🤸 🤸", text: "Every day she tried again. It got a little bit better each time." },
			{ scene: "🏫 👀 🤸", text: "On Friday, everyone was watching. Poppy took a big breath…" },
			{ scene: "🌟 🤸 👏", text: "…and did the best cartwheel ever! \"Keep trying,\" she told her friends. \"That's the magic.\"" },
		],
	},
];

export function getStory(slug: string): Story | undefined {
	return STORIES.find((story) => story.slug === slug);
}
