import { Layout } from "../ui/layout.tsx";
import { TreatMaker } from "./public/treat-maker.tsx";

export function BakeryPage() {
	return () => (
		<Layout activity="bakery">
			<TreatMaker />
		</Layout>
	);
}
