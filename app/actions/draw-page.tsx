import { Layout } from "../ui/layout.tsx";
import { DrawingPad } from "./public/drawing-pad.tsx";

export function DrawPage() {
	return () => (
		<Layout activity="draw">
			<DrawingPad />
		</Layout>
	);
}
