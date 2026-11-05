# Sparkle Town

A little website for a five-year-old, built in Remix 3. Big buttons, bright colours, and a speaker button on every page that reads things aloud, so it works for children who are still learning to read. It's built for a tablet but works on phones and computers too.

## Activities

- `/draw` **Drawing Pad**: finger painting with a rainbow brush, rubber, stickers and undo. Save pictures to a gallery (kept in the browser) or download them.
- `/bakery` **Bake Shop**: build a cupcake or an ice cream, or decorate and bake a Scottish steak pie.
- `/dollhouse` **Dollhouse**: drag family, pets and furniture around a house, turn the lights off for bedtime. The house is remembered between visits.
- `/sea` **Under the Sea**: tap sea creatures to hear a fun fact.
- `/wiggle` **Wiggle Time**: random gymnastics, swimming and silly moves with a countdown timer and stars.
- `/unicorn` **Unicorn Maker**: pick colours, mane, horn, wings and a crown, then get a magic name.
- `/stories` **Story Time**: short picture books that turn their own pages while reading aloud.
- `/match` **Snap Match**: a pairs memory game in three sizes.
- `/counting` **Counting Fun**: tap-to-count questions up to 5, up to 10, and simple adding.
- `/favourites` **My Favourite Things**: a page of favourites, linking to the games that match them.

## Shape

- `app/routes.ts` defines the shared route contract used by server and browser modules for type-safe hrefs.
- `app/router.ts` wires routes to controllers and installs the Remix component renderer, with the asset server so interactive components can hydrate.
- `app/assets.ts` is the asset server. It compiles browser code on request from `public/` folders under `app/`; nothing else in `app/` is reachable from the browser.
- `app/actions/controller.tsx` owns the route actions. Each page lives beside it (`home-page.tsx`, `draw-page.tsx` and so on).
- `app/actions/public/` holds the interactive pieces (`drawing-pad.tsx`, `treat-maker.tsx`, `dollhouse.tsx`…), each a `clientEntry` that hydrates on its own, plus `entry.ts`, the browser runtime. `games-model.ts` holds the game logic for Snap Match and Counting Fun.
- `app/actions/document.tsx` is the HTML shell and holds the design tokens.
- `app/ui/` holds the shared layout and styles. `app/ui/public/` holds browser helpers shared by several activities: the read-aloud button, speech and sound effects.
- `app/data/` holds the content: the activity list, sea creatures, moves, stories and favourites.
- Root `public/` contains static files served unchanged from the app root.

## Commands

```sh
npm i
npm run dev        # watch and restart the server
npm run start      # production mode
npm test           # route and game logic tests
npm run typecheck
```

Requires Node 24.3 or later. The server listens on `PORT` (default 44100). In production (`NODE_ENV=production`) browser code is minified and served at fingerprinted URLs with long cache lifetimes.

## Changing things

- **Site name**: `SITE_NAME` in `app/data/activities.ts`.
- **Favourites**: `app/data/favourites.ts`.
- **Stories**: add one to `app/data/stories.ts`. Each page is a row of emoji and a sentence or two.
- **Moves and sea facts**: `app/data/moves.ts` and `app/data/sea.ts`.
- **Footer**: `app/ui/layout.tsx`.

Read-aloud uses the browser's built-in voice (it prefers a British one) and sounds are made with the Web Audio API, so there are no audio files. The pages ask search engines not to index them.
