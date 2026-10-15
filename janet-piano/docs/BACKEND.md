# Connecting payments and scheduling

The front end is complete, but **payments and live availability are not wired up**.
Without a backend, checkout runs in demo mode and the calendar shows deterministic
sample slots. Nothing is charged.

## Flow
```
React app -> POST /checkout (server) -> Stripe Checkout -> webhook -> Supabase
```

## 1. Checkout endpoint (built)
`functions/api/checkout.js` is a Cloudflare Pages Function served at `POST /api/checkout`.
It takes `{ items: [{ id, slot? }] }`, looks each `id` up in `src/lib/catalog.js` (client prices are
ignored), creates a Stripe Checkout Session, and returns `{ url }`. Apple Pay / Google Pay show up
in Checkout automatically when enabled in your Stripe dashboard.

- Single lessons use `mode: payment` and need a `slot` like `2026-10-20T09:00`.
- Monthly programs use `mode: subscription` (recurring monthly).
- Stripe can't mix the two in one session, so a mixed cart gets a clear 400 error.
- Without `STRIPE_SECRET_KEY` the endpoint returns 503 and the site stays in demo mode.

**Try it locally (Stripe test mode):**
1. Create a free Stripe account and copy the **test** secret key (`sk_test_...`) from the dashboard.
2. Create `janet-piano/.dev.vars` (git-ignored) containing `STRIPE_SECRET_KEY=sk_test_...`
3. `npm run dev:pages`, open the printed URL, add a lesson, click Checkout, and pay with card `4242 4242 4242 4242`.

**Deploy:** create a Cloudflare Pages project for `janet-piano`, then add `STRIPE_SECRET_KEY` as a
secret (Settings -> Variables and Secrets). Optionally set `SITE_URL` to your public URL.
Use the live key only when you're ready to take real payments.

## 2. Webhook
Handle `checkout.session.completed`, `invoice.paid` and `customer.subscription.updated/deleted`.
Verify the signature, then write to `students`, `bookings`, `subscriptions`, `payments`
(see `supabase/schema.sql`) and mark the booked `availability` row closed.

## 3. Availability
Replace `sampleOpen()` in `src/components/Booking.jsx` with a fetch of open rows from the
`availability` table for the visible week.

## Other placeholders
- Janet's photo: replace the placeholder in `src/components/About.jsx`.
- Prices are examples only: `src/lib/catalog.js`.
- Piano samples load from `tonejs.github.io`; set `VITE_SAMPLE_BASE` to self-host the Salamander
  MP3s. If they fail to load, a built-in synth voice plays instead.

## Deploying to Cloudflare Pages
One-time setup, then deploy (run from `janet-piano/`):
```sh
npx wrangler@3 login                 # or set CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID
npm install
npm run pages:create                 # creates the "janet-piano" Pages project (Direct upload)
npm run deploy                       # builds, then uploads dist/ and functions/
npx wrangler@3 pages secret put STRIPE_SECRET_KEY --project-name janet-piano
```
The site is served at `https://janet-piano.pages.dev` (the name may get a suffix if taken). `--branch main`
makes it the production deployment; any other branch name creates a preview. Use a **test** Stripe key
until you are ready for real payments. A scoped API token with *Cloudflare Pages: Edit* is safer than
the Global API Key.
