import * as assert from "remix/assert";
import { describe, it } from "remix/test";

import { checkPair, isComplete, makeChoices, makeDeck, makeQuestion, shuffle } from "./games-model.ts";

/** Repeatable "random" numbers so tests don't flake. */
function seeded(seed = 42) {
	return () => {
		seed = (seed * 16807) % 2147483647;
		return (seed - 1) / 2147483646;
	};
}

describe("shuffle", () => {
	it("keeps every item", () => {
		let items = [1, 2, 3, 4, 5, 6];
		assert.deepEqual([...shuffle(items, seeded())].sort(), items);
	});
});

describe("Snap Match", () => {
	it("deals each chosen face exactly twice", () => {
		let deck = makeDeck(["a", "b", "c", "d", "e"], 3, seeded());
		assert.equal(deck.length, 6);
		let counts = new Map<string, number>();
		for (let card of deck) counts.set(card.face, (counts.get(card.face) ?? 0) + 1);
		assert.equal(counts.size, 3);
		for (let count of counts.values()) assert.equal(count, 2);
	});

	it("matches pairs and spots a finished game", () => {
		let deck = makeDeck(["a", "b"], 2, seeded());
		let [first] = deck;
		let twin = deck.find((card) => card.face === first.face && card.id !== first.id)!;
		let other = deck.find((card) => card.face !== first.face)!;

		assert.equal(checkPair(deck, first.id, other.id), false);
		assert.equal(checkPair(deck, first.id, first.id), false);
		assert.equal(checkPair(deck, first.id, twin.id), true);
		assert.equal(isComplete(deck), false);

		let rest = deck.filter((card) => !card.matched);
		assert.equal(checkPair(deck, rest[0].id, rest[1].id), true);
		assert.equal(isComplete(deck), true);
	});
});

describe("Counting Fun", () => {
	it("always offers three different choices including the answer", () => {
		let random = seeded(7);
		for (let answer = 1; answer <= 10; answer++) {
			let choices = makeChoices(answer, 10, random);
			assert.equal(choices.length, 3);
			assert.equal(new Set(choices).size, 3);
			assert.ok(choices.includes(answer));
			assert.ok(choices.every((n) => n >= 1 && n <= 10));
		}
	});

	it("keeps numbers within each level", () => {
		let random = seeded(3);
		for (let i = 0; i < 50; i++) {
			let five = makeQuestion("five", random);
			assert.ok(five.answer >= 1 && five.answer <= 5);
			assert.ok(five.choices.every((n) => n <= 5));

			let adding = makeQuestion("adding", random);
			assert.equal(adding.groups.length, 2);
			assert.equal(adding.groups[0] + adding.groups[1], adding.answer);
			assert.ok(adding.choices.includes(adding.answer));
		}
	});
});
