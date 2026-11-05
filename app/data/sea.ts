export interface SeaCreature {
	id: string;
	name: string;
	emoji: string;
	/** Background colour for the card. */
	colour: string;
	fact: string;
}

export const SEA_CREATURES: SeaCreature[] = [
	{
		id: "octopus",
		name: "Octopus",
		emoji: "🐙",
		colour: "#ff7aa8",
		fact: "An octopus has eight arms and three hearts! It can change colour to hide on the sea floor.",
	},
	{
		id: "whale",
		name: "Blue Whale",
		emoji: "🐳",
		colour: "#4aa3ff",
		fact: "The blue whale is the biggest animal that has ever lived. It is longer than two buses!",
	},
	{
		id: "turtle",
		name: "Sea Turtle",
		emoji: "🐢",
		colour: "#3cc48a",
		fact: "Sea turtles swim all the way across the ocean, then come back to the very beach where they hatched.",
	},
	{
		id: "clownfish",
		name: "Clownfish",
		emoji: "🐠",
		colour: "#ff9d3c",
		fact: "Clownfish live inside stingy sea anemones. The stings don't hurt them because they have a special slimy coat.",
	},
	{
		id: "jellyfish",
		name: "Jellyfish",
		emoji: "🪼",
		colour: "#b48cff",
		fact: "Jellyfish have no brain, no heart and no bones. Some of them glow in the dark!",
	},
	{
		id: "shark",
		name: "Shark",
		emoji: "🦈",
		colour: "#7f9bb5",
		fact: "Sharks keep growing new teeth all their lives. Some sharks have thousands of teeth!",
	},
	{
		id: "crab",
		name: "Crab",
		emoji: "🦀",
		colour: "#ff6b5e",
		fact: "Crabs walk sideways! They wear their skeleton on the outside, like a suit of armour.",
	},
	{
		id: "dolphin",
		name: "Dolphin",
		emoji: "🐬",
		colour: "#38b9d9",
		fact: "Dolphins talk to each other with clicks and whistles, and each dolphin has its own special whistle, like a name.",
	},
	{
		id: "seal",
		name: "Seal",
		emoji: "🦭",
		colour: "#9a8f86",
		fact: "Seals live all around Scotland! They can hold their breath for a long time when they dive for fish.",
	},
	{
		id: "puffer",
		name: "Pufferfish",
		emoji: "🐡",
		colour: "#e8b830",
		fact: "When a pufferfish gets a fright, it gulps water and puffs up into a big spiky ball.",
	},
	{
		id: "shrimp",
		name: "Shrimp",
		emoji: "🦐",
		colour: "#ff8f8f",
		fact: "Some shrimps are cleaners! Big fish let them in their mouths to clean their teeth.",
	},
	{
		id: "squid",
		name: "Squid",
		emoji: "🦑",
		colour: "#e27cc2",
		fact: "When a squid wants to escape, it squirts a cloud of ink and zooms away.",
	},
];
