import { css } from "remix/component";

/** Centred page column. */
export const container = css({
	width: "100%",
	maxWidth: "1100px",
	marginInline: "auto",
	paddingInline: "16px",
	"@media (min-width: 640px)": { paddingInline: "28px" },
});

/** Hide visually but keep for screen readers. */
export const srOnly = css({
	position: "absolute",
	width: "1px",
	height: "1px",
	padding: 0,
	margin: "-1px",
	overflow: "hidden",
	clip: "rect(0, 0, 0, 0)",
	whiteSpace: "nowrap",
	border: 0,
});

/** White rounded panel that most activities sit on. */
export const panel = css({
	background: "var(--surface)",
	borderRadius: "var(--radius)",
	border: "3px solid var(--rule)",
	boxShadow: "var(--shadow)",
	padding: "16px",
	"@media (min-width: 640px)": { padding: "24px" },
});

/**
 * Big chunky button. Uses the page's --tone colour unless the button sets
 * its own with `style={{ "--tone": … }}`.
 */
export const bigButton = css({
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	gap: "10px",
	minHeight: "60px",
	padding: "0 26px",
	border: 0,
	borderRadius: "999px",
	background: "var(--tone)",
	color: "#fff",
	fontSize: "22px",
	fontWeight: 600,
	textDecoration: "none",
	cursor: "pointer",
	boxShadow: "0 5px 0 rgba(0, 0, 0, 0.18)",
	transition: "transform 120ms ease, box-shadow 120ms ease",
	touchAction: "manipulation",
	"&:hover": { transform: "translateY(-2px)" },
	"&:active": { transform: "translateY(3px)", boxShadow: "0 2px 0 rgba(0, 0, 0, 0.18)" },
	"&:disabled": { opacity: 0.5, cursor: "default", transform: "none" },
});

/** Round choice swatch/button used for colour and option pickers. */
export const choiceButton = css({
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	minWidth: "56px",
	minHeight: "56px",
	padding: "4px 12px",
	border: "4px solid #fff",
	borderRadius: "999px",
	background: "var(--surface)",
	fontSize: "26px",
	lineHeight: 1,
	cursor: "pointer",
	boxShadow: "0 0 0 3px var(--rule), 0 4px 0 rgba(59, 37, 84, 0.12)",
	transition: "transform 120ms ease",
	touchAction: "manipulation",
	"&:hover": { transform: "scale(1.06)" },
	"&[aria-pressed='true']": {
		boxShadow: "0 0 0 5px var(--text), 0 4px 0 rgba(59, 37, 84, 0.2)",
		transform: "scale(1.08)",
	},
});

/** Row of choice buttons that wraps. */
export const choiceRow = css({
	display: "flex",
	flexWrap: "wrap",
	gap: "14px",
	padding: "6px",
	margin: 0,
});

/** Small heading above a group of choices. */
export const groupLabel = css({
	margin: "0 0 8px",
	fontSize: "20px",
	fontWeight: 600,
	color: "var(--muted)",
});
