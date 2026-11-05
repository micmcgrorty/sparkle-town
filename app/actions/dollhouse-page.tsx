import { Layout } from "../ui/layout.tsx";
import { Dollhouse } from "./public/dollhouse.tsx";

export function DollhousePage() {
	return () => (
		<Layout activity="dollhouse">
			<Dollhouse />
		</Layout>
	);
}
