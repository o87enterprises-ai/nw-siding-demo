# Janet Holmes Piano

Interactive landing page: a flat, top-down playable piano across the top of the screen above a huge wax-seal logo, a falling-note tutorial,

**Live:** https://janet-piano.pages.dev (deployed 2026-10-15, Cloudflare Pages). Checkout is in demo mode until a Stripe test key is set.
an about section, a learning path, and a lesson booking flow with cart.

**Stack:** React 19, Vite, three.js via React Three Fiber + Drei, Framer Motion, Tone.js.

```sh
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Piano
- Mouse, **multi-touch** and glissando (drag across keys); computer keyboard (`Z`–`M`, `Q`–`I`); optional **Web MIDI**.
- **Learn the song:** the next note rises from below toward its key; the right key glows gold with a particle burst.
- **Play along with Janet:** Janet plays the song and the keys light up while you join in.

## Not included yet
Real payments and live availability (see `docs/BACKEND.md`), and Janet's photo.
