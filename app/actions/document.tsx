import type { Handle, RemixNode } from "remix/component";
import { css } from "remix/component";
import { ImportMap } from "remix/component/server";

import { scriptEntry } from "../assets.ts";

export interface DocumentProps {
	children?: RemixNode;
	head?: RemixNode;
	title?: string;
}

const FONT_STACK = "'Fredoka', 'Comic Sans MS', ui-rounded, system-ui, sans-serif";

// Design tokens live on <body> so every page and component shares them.
// Each activity also has its own colour, set as --tone on the page.
const bodyStyles = css({
	"--bg": "#fff7ef",
	"--surface": "#ffffff",
	"--text": "#3b2554",
	"--muted": "#7a6690",
	"--rule": "#f0e2f4",
	"--pink": "#ff5fa2",
	"--purple": "#9b6bff",
	"--blue": "#2bb5e8",
	"--sea": "#1677c9",
	"--green": "#2fc48d",
	"--yellow": "#ffc93c",
	"--orange": "#ff8a3d",
	"--red": "#ff5a5f",
	"--tone": "var(--purple)",
	"--shadow": "0 6px 0 rgba(59, 37, 84, 0.12)",
	"--radius": "24px",
	"& *, & *::before, & *::after": { boxSizing: "border-box" },
	margin: 0,
	minHeight: "100vh",
	background:
		"radial-gradient(circle at 8% 12%, #ffe1ef 0 70px, transparent 71px), radial-gradient(circle at 92% 30%, #e3f6ff 0 90px, transparent 91px), radial-gradient(circle at 15% 85%, #fff1c9 0 80px, transparent 81px), var(--bg)",
	backgroundAttachment: "fixed",
	color: "var(--text)",
	fontFamily: FONT_STACK,
	fontSize: "20px",
	lineHeight: 1.45,
	WebkitFontSmoothing: "antialiased",
	WebkitTapHighlightColor: "transparent",
	"& a": { color: "inherit" },
	"& button": { fontFamily: "inherit" },
	"& :focus-visible": {
		outline: "4px solid var(--blue)",
		outlineOffset: "3px",
		borderRadius: "12px",
	},
	"@media (prefers-reduced-motion: reduce)": {
		"& *, & *::before, & *::after": {
			animationDuration: "0.01ms !important",
			animationIterationCount: "1 !important",
			transitionDuration: "0.01ms !important",
		},
	},
});

export function Document(handle: Handle<DocumentProps>) {
	return () => {
		let { children, head, title } = handle.props;
		let { href, importMap, preloads } = scriptEntry;

		return (
			<html lang="en-GB">
				<head>
					<meta charSet="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<meta name="color-scheme" content="light" />
					<meta name="theme-color" content="#fff7ef" />
					<meta name="robots" content="noindex" />
					<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400..700&display=swap"
					/>
					<title>{title}</title>
					{head}
					<ImportMap value={importMap} />
					{preloads.map((preloadHref) => (
						<link key={preloadHref} rel="modulepreload" href={preloadHref} />
					))}
					<script type="module" src={href}></script>
				</head>
				<body mix={bodyStyles}>{children}</body>
			</html>
		);
	};
}
