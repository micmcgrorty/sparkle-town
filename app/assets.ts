import { createAssetServer } from "remix/assets";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Compiles browser code on request. Only `public/` folders under `app/`, the
 * route contract and the remix package are reachable from the browser.
 *
 * `npm run dev` restarts the whole server when a file changes, so the asset
 * server doesn't need its own watcher.
 */
export const assets = createAssetServer({
	basePath: "/assets",
	rootDir: process.cwd(),
	allowFiles: ["app/routes.ts", "app/**/public/**"],
	allowPackages: ["remix"],
	denyFiles: ["app/**/*.test.*"],
	watch: false,
	minify: isProduction,
	fingerprint: isProduction,
	sourceMaps: isProduction ? undefined : "external",
	target: { chrome: "109", firefox: "115", safari: "16" },
	scripts: {
		define: { "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV ?? "development") },
	},
	onError(error) {
		console.error("Asset compilation failed", error);
		return new Response("Internal Server Error", { status: 500 });
	},
});

/** The browser entry that hydrates every interactive component. */
export const scriptEntry = await assets.getScriptEntry("app/actions/public/entry.ts");
