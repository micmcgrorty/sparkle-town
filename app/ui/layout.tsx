import type { Handle, RemixNode } from "remix/component";
import { css } from "remix/component";

import { Document } from "../actions/document.tsx";
import { SITE_NAME, getActivity, type ActivityKey } from "../data/activities.ts";
import { routes } from "../routes.ts";
import { SpeakButton } from "./public/speak-button.tsx";
import { container } from "./theme.ts";

export interface LayoutProps {
	/** Activity this page belongs to. Supplies the heading, colour and read-aloud text. */
	activity?: ActivityKey;
	/** Page title when the page isn't an activity, or to override the activity's. */
	title?: string;
	description?: string;
	/** Extra read-aloud text, overriding the activity's. */
	say?: string;
	/** The home page has its own header. */
	home?: boolean;
	children?: RemixNode;
}

const headerStyles = css({
	paddingBlock: "14px",
});

const headerInner = css({
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	gap: "12px",
});

const homeButton = css({
	display: "inline-flex",
	alignItems: "center",
	gap: "8px",
	minHeight: "56px",
	padding: "0 20px 0 14px",
	borderRadius: "999px",
	background: "var(--surface)",
	border: "3px solid var(--rule)",
	boxShadow: "0 4px 0 rgba(59, 37, 84, 0.12)",
	fontSize: "20px",
	fontWeight: 600,
	textDecoration: "none",
	"& .icon": { fontSize: "28px", lineHeight: 1 },
	"&:hover": { borderColor: "var(--pink)" },
});

const brand = css({
	margin: 0,
	fontSize: "20px",
	fontWeight: 700,
	textDecoration: "none",
	letterSpacing: "0.01em",
	background: "linear-gradient(90deg, var(--pink), var(--orange), var(--yellow), var(--green), var(--blue), var(--purple))",
	WebkitBackgroundClip: "text",
	backgroundClip: "text",
	color: "transparent",
	"@media (max-width: 420px)": { display: "none" },
});

const pageHeading = css({
	display: "flex",
	alignItems: "center",
	gap: "14px",
	margin: "6px 0 20px",
	"& h1": {
		margin: 0,
		fontSize: "clamp(32px, 7vw, 52px)",
		fontWeight: 700,
		lineHeight: 1.05,
		letterSpacing: "-0.01em",
	},
	"& .emoji": {
		display: "grid",
		placeItems: "center",
		flexShrink: 0,
		width: "clamp(64px, 14vw, 86px)",
		aspectRatio: "1",
		borderRadius: "28px",
		background: "var(--tone)",
		fontSize: "clamp(38px, 8vw, 52px)",
		boxShadow: "var(--shadow)",
		transform: "rotate(-6deg)",
	},
	"& .blurb": { margin: "4px 0 0", color: "var(--muted)", fontSize: "20px" },
	"& .text": { flex: 1, minWidth: 0 },
});

const mainStyles = css({
	paddingBlock: "4px 48px",
});

const footerStyles = css({
	paddingBlock: "8px 32px",
	textAlign: "center",
	color: "var(--muted)",
	fontSize: "16px",
	"& p": { margin: 0 },
});

export function Layout(handle: Handle<LayoutProps>) {
	return () => {
		let { activity: key, title, description, say, home, children } = handle.props;
		let activity = key ? getActivity(key) : undefined;
		let heading = title ?? activity?.title ?? SITE_NAME;
		let fullTitle = home ? SITE_NAME : `${heading} – ${SITE_NAME}`;
		let readAloud = say ?? activity?.say;

		return (
			<Document
				title={fullTitle}
				head={
					<>
						<meta name="description" content={description ?? activity?.blurb ?? SITE_NAME} />
						<meta property="og:title" content={fullTitle} />
					</>
				}
			>
				<div style={activity ? { "--tone": activity.tone } : undefined}>
					{home ? null : (
						<header mix={headerStyles}>
							<div mix={[container, headerInner]}>
								<a href={routes.home.href()} mix={homeButton}>
									<span class="icon" aria-hidden="true">
										🏠
									</span>
									Home
								</a>
								<a href={routes.home.href()} mix={brand}>
									{SITE_NAME}
								</a>
							</div>
						</header>
					)}

					<main mix={[container, mainStyles]}>
						{home ? null : (
							<div mix={pageHeading}>
								{activity ? (
									<span class="emoji" aria-hidden="true">
										{activity.emoji}
									</span>
								) : null}
								<div class="text">
									<h1>{heading}</h1>
									{activity && !title ? <p class="blurb">{activity.blurb}</p> : null}
								</div>
								{readAloud ? <SpeakButton text={readAloud} /> : null}
							</div>
						)}
						{children}
					</main>

					<footer mix={[container, footerStyles]}>
						<p>Made with lots of love by Dad 💛</p>
					</footer>
				</div>
			</Document>
		);
	};
}
