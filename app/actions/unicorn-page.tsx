import { Layout } from "../ui/layout.tsx";
import { UnicornMaker } from "./public/unicorn-maker.tsx";

export function UnicornPage() {
	return () => (
		<Layout activity="unicorn">
			<UnicornMaker />
		</Layout>
	);
}
