/**
 * Pure game logic for Snap Match and Counting Fun, kept apart from the
 * components so it can be tested without a browser.
 */

export type Random = () => number;

export function shuffle<T>(items: readonly T[], random: Random = Math.random): T[] {
	let result = [...items];
	for (let i = result.length - 1; i > 0; i--) {
		let j = Math.floor(random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}

// ---------- Snap Match ----------

export interface MatchCard {
	id: number;
	face: string;
	matched: boolean;
}

export const MATCH_THEMES = [
	{ id: "treats", label: "Treats", emoji: "🧁", faces: ["🧁", "🍩", "🍭", "🍦", "🍪", "🎂", "🍓", "🍫"] },
	{ id: "sea", label: "Sea", emoji: "🐙", faces: ["🐙", "🐳", "🐢", "🐠", "🦀", "🐬", "🦭", "🐡"] },
	{ id: "magic", label: "Magic", emoji: "🦄", faces: ["🦄", "👑", "🏰", "🌈", "⭐", "🧚", "💎", "🦋"] },
	{ id: "pets", label: "Pets", emoji: "🐱", faces: ["🐱", "🐶", "🐰", "🐹", "🐢", "🐦", "🐠", "🐴"] },
] as const;

export const MATCH_SIZES = [
	{ pairs: 3, label: "Easy", emoji: "🐣" },
	{ pairs: 6, label: "Medium", emoji: "🐥" },
	{ pairs: 8, label: "Tricky", emoji: "🦅" },
] as const;

export function makeDeck(faces: readonly string[], pairs: number, random: Random = Math.random): MatchCard[] {
	let chosen = shuffle(faces, random).slice(0, pairs);
	let doubled = [...chosen, ...chosen];
	return shuffle(doubled, random).map((face, id) => ({ id, face, matched: false }));
}

export function isComplete(deck: readonly MatchCard[]): boolean {
	return deck.length > 0 && deck.every((card) => card.matched);
}

/** Marks a pair as matched if the two cards have the same face. Returns whether they matched. */
export function checkPair(deck: MatchCard[], a: number, b: number): boolean {
	let first = deck.find((card) => card.id === a);
	let second = deck.find((card) => card.id === b);
	if (!first || !second || a === b || first.face !== second.face) return false;
	first.matched = true;
	second.matched = true;
	return true;
}

// ---------- Counting Fun ----------

export type CountingLevel = "five" | "ten" | "adding";

export const COUNTING_LEVELS: { id: CountingLevel; label: string; emoji: string }[] = [
	{ id: "five", label: "Up to 5", emoji: "🖐️" },
	{ id: "ten", label: "Up to 10", emoji: "🔟" },
	{ id: "adding", label: "Adding", emoji: "➕" },
];

export const COUNTING_THINGS = [
	{ emoji: "🧁", one: "cupcake", many: "cupcakes" },
	{ emoji: "🐙", one: "octopus", many: "octopuses" },
	{ emoji: "🦄", one: "unicorn", many: "unicorns" },
	{ emoji: "⭐", one: "star", many: "stars" },
	{ emoji: "🍓", one: "strawberry", many: "strawberries" },
	{ emoji: "🐠", one: "fish", many: "fish" },
	{ emoji: "👑", one: "crown", many: "crowns" },
	{ emoji: "🎈", one: "balloon", many: "balloons" },
	{ emoji: "🐱", one: "cat", many: "cats" },
	{ emoji: "🌸", one: "flower", many: "flowers" },
];

export interface CountingQuestion {
	level: CountingLevel;
	emoji: string;
	/** For counting: one group. For adding: two groups. */
	groups: number[];
	answer: number;
	choices: number[];
	prompt: string;
}

function randomInt(min: number, max: number, random: Random): number {
	return min + Math.floor(random() * (max - min + 1));
}

export function makeChoices(answer: number, max: number, random: Random = Math.random): number[] {
	let options = new Set([answer]);
	let nearby = [answer - 1, answer + 1, answer - 2, answer + 2].filter((n) => n >= 1 && n <= max);
	for (let n of shuffle(nearby, random)) {
		if (options.size >= 3) break;
		options.add(n);
	}
	while (options.size < 3) options.add(randomInt(1, max, random));
	return [...options].sort((a, b) => a - b);
}

export function makeQuestion(level: CountingLevel, random: Random = Math.random, previous?: number): CountingQuestion {
	let thing = COUNTING_THINGS[Math.floor(random() * COUNTING_THINGS.length)];
	if (level === "adding") {
		let a = randomInt(1, 4, random);
		let b = randomInt(1, 4, random);
		let answer = a + b;
		return {
			level,
			emoji: thing.emoji,
			groups: [a, b],
			answer,
			choices: makeChoices(answer, 10, random),
			prompt: `${a} ${a === 1 ? thing.one : thing.many} and ${b} more. How many ${thing.many} altogether?`,
		};
	}
	let max = level === "five" ? 5 : 10;
	let answer = randomInt(1, max, random);
	// Try not to ask the same number twice in a row.
	if (answer === previous) answer = (answer % max) + 1;
	return {
		level,
		emoji: thing.emoji,
		groups: [answer],
		answer,
		choices: makeChoices(answer, max, random),
		prompt: `How many ${thing.many} can you count?`,
	};
}

export const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
