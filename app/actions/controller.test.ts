import * as assert from "remix/assert";
import { describe, it } from "remix/test";

import { ACTIVITIES } from "../data/activities.ts";
import { STORIES } from "../data/stories.ts";
import { router } from "../router.ts";

async function get(path: string) {
	let response = await router.fetch(new Request(`http://localhost${path}`));
	return { status: response.status, html: await response.text(), type: response.headers.get("Content-Type") };
}

describe("routes", () => {
	it("renders the home page with a tile for every activity", async () => {
		let { status, html } = await get("/");
		assert.equal(status, 200);
		assert.ok(html.includes("Sparkle Town"));
		for (let activity of ACTIVITIES) {
			assert.ok(html.includes(`href="${activity.href}"`), `missing tile for ${activity.key}`);
		}
	});

	it("renders every activity page", async () => {
		for (let activity of ACTIVITIES) {
			let { status, html } = await get(activity.href);
			assert.equal(status, 200, activity.href);
			assert.ok(html.includes(`<h1>${activity.title}</h1>`), `missing heading on ${activity.href}`);
		}
	});

	it("loads the browser entry and hydrates interactive parts", async () => {
		let { html } = await get("/bakery");
		assert.ok(html.includes('type="importmap"'));
		assert.ok(html.includes("/assets/app/actions/public/entry.ts"));
		assert.ok(html.includes("rmx:h"), "expected a hydration boundary");
	});

	it("renders every story", async () => {
		for (let story of STORIES) {
			let { status, html } = await get(`/stories/${story.slug}`);
			assert.equal(status, 200, story.slug);
			assert.ok(html.includes(story.title));
		}
	});

	it("returns 404 for an unknown story", async () => {
		let { status, html } = await get("/stories/not-a-story");
		assert.equal(status, 404);
		assert.ok(html.includes("couldn&#39;t find that story") || html.includes("couldn't find that story"));
	});

	it("returns a friendly 404 for unknown pages", async () => {
		let { status, html } = await get("/does-not-exist");
		assert.equal(status, 404);
		assert.ok(html.includes("Go home"));
	});

	it("serves browser code from public folders only", async () => {
		let entry = await get("/assets/app/actions/public/entry.ts");
		assert.equal(entry.status, 200);
		assert.ok(entry.type?.includes("javascript"));

		let server = await get("/assets/app/actions/controller.tsx");
		assert.equal(server.status, 404);
	});
});
