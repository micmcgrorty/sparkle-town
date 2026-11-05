import { Layout } from "../ui/layout.tsx";
import { CountingGame } from "./public/counting-game.tsx";

export function CountingPage() {
	return () => (
		<Layout activity="counting">
			<CountingGame />
		</Layout>
	);
}
