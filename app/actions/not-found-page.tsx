import type { Handle } from "remix/component";
import { css } from "remix/component";

import { routes } from "../routes.ts";
import { Layout } from "../ui/layout.tsx";
import { bigButton } from "../ui/theme.ts";

export function NotFoundPage(handle: Handle<{ message?: string }>) {
	return () => (
		<Layout
			title="Oops! We got lost"
			say="Oops! We got lost. Let's go back home."
			description="This page doesn't exist."
		>
			<div
				mix={css({
					display: "grid",
					justifyItems: "center",
					gap: "18px",
					paddingBlock: "24px",
					textAlign: "center",
					"& .big": { fontSize: "110px", lineHeight: 1 },
					"& p": { margin: 0, fontSize: "24px", color: "var(--muted)" },
				})}
			>
				<span class="big" aria-hidden="true">
					🙈
				</span>
				<p>{handle.props.message ?? "There's nothing here."}</p>
				<a href={routes.home.href()} mix={bigButton}>
					🏠 Go home
				</a>
			</div>
		</Layout>
	);
}
