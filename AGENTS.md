# Sparkle Town Agent Guide

This app follows the `remix new` starter conventions. Use them when continuing to build it out.

## Commands

```sh
npm i
npm run dev
npm run start
npm test
npm run typecheck
```

`npm run dev` watches and restarts the server. `npm run start` runs in production mode without a separate build step.

## Building Features

Refer to ./.agents/skills/remix/SKILL.md for the Remix mental model and how to find guides and API READMEs through `node_modules/remix/INDEX.md`. The Interactivity and Files and Assets guides cover `clientEntry` and the asset server.

## Layout

- `app/routes.ts` defines the shared route contract used by server and browser modules for type-safe hrefs
- `app/router.ts` wires routes to controllers and installs `render({ assets })` so client entries resolve to script URLs
- `app/assets.ts` creates the asset server and resolves the browser entry (`scriptEntry`) that `document.tsx` loads
- Put top-level route actions in `app/actions/controller.tsx`; add `app/actions/<route-key>/controller.tsx` for nested route maps. `app/actions/controller.test.ts` is the router smoke test
- Route-owned pages live beside the controller in `app/actions/`; `document.tsx` is the HTML shell and owns the design tokens as CSS custom properties
- `app/actions/public/` holds the browser runtime entry (`entry.ts`) and the activity widgets, each wrapped in `clientEntry(import.meta.url, …)`; `games-model.ts` is pure game logic with tests beside it
- `app/ui/` holds the shared layout and style mixins; `app/ui/public/` holds browser helpers used by several widgets (read-aloud button, speech, sounds)
- `app/data/` holds the content (activities, sea creatures, moves, stories, favourites)
- Root `public/` contains static files served unchanged from the app root

## Conventions

- Everything under a `public/` folder is downloadable by anyone. Keep server-only code out of it, and keep a browser module's local imports inside `public/` folders too.
- Client-entry props are serialised into the page: pass plain data, never functions or class instances.
- Anything random (shuffled decks, questions) must be created in an event handler or queued task, not in setup, or server and browser renders won't match. Same for `localStorage`.
- In SVG, a CSS animation that uses `transform` replaces the element's `transform` attribute, so wrap positioned shapes in a `<g transform>` and animate the inner element.
- Style with `css()` mixins and the tokens in `document.tsx` (`var(--tone)`, `var(--pink)` and so on). Each activity sets `--tone` to its colour via `Layout`.
- Write for a five-year-old: big tap targets (at least 52px), few words, and a read-aloud option for any instructions.
