import { MOVES, MOVE_KINDS } from "../data/moves.ts";
import { Layout } from "../ui/layout.tsx";
import { WiggleGame } from "./public/wiggle-game.tsx";

export function WigglePage() {
	return () => (
		<Layout activity="wiggle">
			<WiggleGame moves={MOVES} kinds={MOVE_KINDS} />
		</Layout>
	);
}
