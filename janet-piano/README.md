# Janet Holmes Piano

Interactive landing page: a flat, top-down playable piano across the top of the screen above a huge wax-seal logo, on white, a falling-note tutorial,
a one-line about, and a separate `/book` page with a month calendar, time slots and cart.

**Live:** https://janet-piano.pages.dev (deployed 2026-10-15, Cloudflare Pages). Checkout is in demo mode until a Stripe test key is set.


**Stack:** React 19, Vite, three.js via React Three Fiber + Drei, Framer Motion, Tone.js.

```sh
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Pages (all mock for the preview)
- `/` hero with the free demo piano, the official logo, and three feature links.
- `/plans` Free, **Lessons $19/mo** and **Premium $79/mo** (mock pricing). Demo checkout "unlocks" the plan in this browser only.
- `/lessons` (Lessons+): full-screen piano, four songs, light-up lessons (rising notes; the right key turns red with a burst).
- `/live` (Premium): mock video call of Janet directly above the piano, with **key match**: keys Janet plays light up on the student's keys. No camera, microphone or network is used.
- `/book` live sessions: month calendar and time slots. Pay per session, or included with Premium.

Piano input: mouse, **multi-touch**, drag glissando, and the computer keyboard (`Z`–`M`, `Q`–`I`). That is how lessons work without owning a piano.

## Logo
`src/assets/logo.webp` is the official JH wax seal (background cut out). Replace with any `logo.*`.

## Design
White background, one red accent (`--accent` in `src/index.css`).

## Not included yet
Real payments, real access control (the plan unlock is a local mock), real video calls, and live availability. See `docs/BACKEND.md`.
