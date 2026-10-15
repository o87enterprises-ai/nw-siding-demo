# Janet Holmes Piano

Interactive landing page: a flat, top-down playable piano across the top of the screen above a huge wax-seal logo, on white, a falling-note tutorial,
an about section, a learning path, and a lesson booking flow with cart.

**Live:** https://janet-piano.pages.dev (deployed 2026-10-15, Cloudflare Pages). Checkout is in demo mode until a Stripe test key is set.


**Stack:** React 19, Vite, three.js via React Three Fiber + Drei, Framer Motion, Tone.js.

```sh
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Piano
- Mouse, **multi-touch** and glissando (drag across keys), plus the computer keyboard (`Z`–`M`, `Q`–`I`).
- **Learn:** the next note rises from below toward its key; the right key turns red with a particle burst.
- **Play along:** Janet plays Mary Had a Little Lamb and the keys light up while you join in.

## Design
White background, one red accent (`--accent` in `src/index.css`), about 50 words on the whole page.

## Not included yet
Real payments and live availability (see `docs/BACKEND.md`), and Janet's photo.
