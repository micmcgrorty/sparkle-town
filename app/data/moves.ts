export type MoveKind = "gym" | "swim" | "dance";

export interface Move {
	id: string;
	kind: MoveKind;
	emoji: string;
	/** What's shown in big letters. */
	title: string;
	/** What's read aloud. */
	say: string;
	/** How long the timer runs, in seconds. */
	seconds: number;
}

export const MOVE_KINDS: { id: MoveKind | "all"; label: string; emoji: string }[] = [
	{ id: "all", label: "Everything", emoji: "🌈" },
	{ id: "gym", label: "Gymnastics", emoji: "🤸" },
	{ id: "swim", label: "Swimming", emoji: "🏊" },
	{ id: "dance", label: "Silly", emoji: "💃" },
];

export const MOVES: Move[] = [
	{ id: "star-jumps", kind: "gym", emoji: "⭐", title: "5 star jumps", say: "Do five star jumps! Arms and legs out like a big star.", seconds: 10 },
	{ id: "flamingo", kind: "gym", emoji: "🦩", title: "Flamingo balance", say: "Stand on one leg like a flamingo. Can you balance until the timer ends?", seconds: 10 },
	{ id: "bridge", kind: "gym", emoji: "🌉", title: "Make a bridge", say: "Lie on your back and push your tummy up to make a bridge.", seconds: 8 },
	{ id: "pencil", kind: "gym", emoji: "✏️", title: "Pencil roll", say: "Lie down straight like a pencil and roll over. Then roll back!", seconds: 10 },
	{ id: "tuck-jumps", kind: "gym", emoji: "🐸", title: "3 frog jumps", say: "Crouch down low like a frog, then jump up high! Do it three times.", seconds: 10 },
	{ id: "pointy-toes", kind: "gym", emoji: "🩰", title: "Pointy toes", say: "Sit down with straight legs and point your toes like a gymnast. Now flex them. Point, flex, point!", seconds: 10 },
	{ id: "tiptoe", kind: "gym", emoji: "🧚", title: "Tiptoe walk", say: "Walk on your tiptoes with your arms up high, like a fairy.", seconds: 10 },
	{ id: "front-crawl", kind: "swim", emoji: "🏊", title: "Front crawl arms", say: "Do front crawl arms! Big circles, one arm then the other.", seconds: 10 },
	{ id: "breaststroke", kind: "swim", emoji: "🐸", title: "Breaststroke arms", say: "Breaststroke arms! Hands together, push forward, then sweep round like you're opening curtains.", seconds: 10 },
	{ id: "kicks", kind: "swim", emoji: "🦵", title: "Kicky legs", say: "Sit down and do fast kicky legs, like you're swimming with a float!", seconds: 10 },
	{ id: "starfish-float", kind: "swim", emoji: "🌟", title: "Starfish float", say: "Lie on your back like a starfish floating in the pool. Arms and legs out wide. Nice and still.", seconds: 8 },
	{ id: "bubbles", kind: "swim", emoji: "🫧", title: "Blow bubbles", say: "Pretend you're in the pool and blow big bubbles. Breathe in, and blow out slowly!", seconds: 8 },
	{ id: "backstroke", kind: "swim", emoji: "🔄", title: "Backstroke arms", say: "Backstroke arms! Reach up to the sky and round behind you, one arm at a time.", seconds: 10 },
	{ id: "freeze", kind: "dance", emoji: "🧊", title: "Wiggle and freeze", say: "Wiggle wiggle wiggle! When I say freeze, stop like a statue! Freeze!", seconds: 8 },
	{ id: "unicorn-gallop", kind: "dance", emoji: "🦄", title: "Unicorn gallop", say: "Gallop around the room like a magical unicorn!", seconds: 10 },
	{ id: "octopus-arms", kind: "dance", emoji: "🐙", title: "Octopus arms", say: "Wave your arms all wiggly like an octopus under the sea.", seconds: 10 },
	{ id: "princess-bow", kind: "dance", emoji: "👑", title: "Royal curtsy", say: "Do your best royal curtsy, like a princess at the ball. Now a twirl!", seconds: 8 },
	{ id: "jelly", kind: "dance", emoji: "🍮", title: "Wobbly jelly", say: "Wobble your whole body like a big jelly on a plate!", seconds: 8 },
];
