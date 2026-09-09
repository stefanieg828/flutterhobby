# FlutterHobby

A cozy, **ad-free** hobby tracker with a greenhouse-first vibe. Grow what you love — plant hobbies, tend them with gentle nudges, and celebrate proud-shelf wins. No accounts or payments yet; progress lives in your browser.

**GitHub Pages preview:** https://stefanieg828.github.io/flutterhobby/

**Custom domain (later):** flutterhobby.fun (Hostinger) — not wired to this Pages deploy yet.

This is a Progressive Web App (PWA) built with **Vite + React + TypeScript**.

## What you get (early shell)

- **Home** — Greenhouse, Basement, Closet, Desktop, or Workshop room (theme in localStorage), status shelves (In season / Resting / Proud shelf / Archive), create form, progress chooser when tending, **Hyperfocus** (one-hobby focus view from the tend bench)
- **Collections** — switch all five themes (Sprout / Dusty / Mira / Pixel / Rip)
- **Solstice** — season-turn ritual: sort hobbies into In season / Resting / Proud shelf (same localStorage as Home)
- **You** — theme switcher, about / privacy notes (ad-free, local-only for now)

## How to run

Commands (in order):
1. Install dependencies with the package manager.
2. Start the local development server.
3. Open the printed localhost URL (port 5173).
4. Create a production build into the dist folder.
5. Optionally preview the production build locally.
- npm install
- npm run dev
- npm run build
- npm run preview

## GitHub Pages

CI builds the site for the project path and publishes on push to main. Local production builds stay root-relative.

## Notes

- Progress is stored in localStorage on your device.
- PWA support via vite-plugin-pwa.
- Source-only repo for now.

## License

Private project for FlutterHobby.
