import { Layout } from "../ui/layout.tsx";
import { MemoryGame } from "./public/memory-game.tsx";

export function MatchPage() {
	return () => (
		<Layout activity="match">
			<MemoryGame />
		</Layout>
	);
}
