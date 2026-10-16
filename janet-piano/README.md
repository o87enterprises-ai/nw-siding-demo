# Janet Holmes Piano

Vocal and piano lessons landing page: a flat, top-down playable piano across the top of the screen above a huge wax-seal logo, on white, a falling-note tutorial,
a one-line about, and a separate `/book` page with a month calendar, time slots and cart.

**Live:** https://janet-piano.pages.dev (deployed 2026-10-15, Cloudflare Pages). Checkout is in demo mode until a Stripe test key is set.


**Stack:** React 19, Vite, three.js via React Three Fiber + Drei, Framer Motion, Tone.js.

```sh
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Pages (all mock for the preview)
- `/` **the full singing demo, no sign-up or plan needed.** A flashing "Sing along" cue sits at the very top. Below it, a holographic console: lyrics, one big centered **Play** button (one tap asks for the microphone and starts the song by itself), the pitch tuner, and two small drop-downs (song, mode). The **Piano** tab drops the piano down with the upcoming notes below it, and the rest of the page steps aside while it is open.
- Modes: **Sing along** (piano guide plays), **Sing solo**, **Hear it**, **Play piano** (press the glowing key), **Tuner** (free pitch tuner).
- Tuner: real microphone pitch detection (local only). Red (off) to yellow to green (in tune); the only green on the site.
- `/sing` and `/lessons`: the same console full screen. Members can add songs from a YouTube link (mock analysis, see `docs/VOCAL.md`).
- `/live` (Premium): the same room with a mock video call of Janet directly above the piano. Keys Janet plays light up on the student's keys (key match). No camera, microphone or network is used by the video tile.
- `/plans`: Free (piano, tuner, starter songs), Lessons $19/mo (add your own songs), Premium $79/mo (live with key match). Mock pricing. Demo checkout unlocks a plan in this browser only.
- `/book`: live sessions, month calendar and time slots. Pay per session, or included with Premium.
- A small menu (top-right) replaces the nav links.

Piano input: mouse, **multi-touch**, drag glissando, and the computer keyboard (`Z`–`M`, `Q`–`I`).

## Logo
`src/assets/logo.webp` is the official JH wax seal (background cut out). Replace with any `logo.*`.

## Design
A lit cyclorama stage on every page (grey ceiling, burgundy wall wash, glossy floor with a faint holo grid and a soft projector beam; `body::before` / `body::after` in `src/index.css`). The piano and upcoming notes are drawn as a burgundy-edged holographic projection (`Piano3D.jsx`, `.holo` styles). Accent is the logo burgundy; green is used only for the tuner's "in tune" signal.

White soundstage backdrop (soft grey ceiling and corners, a faint magenta wash on the walls and floor curve; `body::before` in `src/index.css`) with one red accent (`--accent`).

## Not included yet
Real payments, real access control (the plan unlock is a local mock), real video calls, and live availability. See `docs/BACKEND.md`.

## Ambient background
`src/components/Ambient.jsx`: about 20 faint 3D music notes (greys plus the logo red) tumbling at different orientations behind the page. They flare and drift when keys are played, when you scroll, and when you click buttons. Respects `prefers-reduced-motion`.
