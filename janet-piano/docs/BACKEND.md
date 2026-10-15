# Connecting payments and scheduling

The front end is complete, but **payments and live availability are not wired up**.
Without a backend, checkout runs in demo mode and the calendar shows deterministic
sample slots. Nothing is charged.

## Flow
```
React app -> POST /checkout (server) -> Stripe Checkout -> webhook -> Supabase
```

## 1. Checkout endpoint
Set `VITE_CHECKOUT_URL` to a server endpoint (Next.js route, Cloudflare Pages Function, etc.).
The app POSTs `{ items: [{ id, slot? }] }`. The server must:
1. Look up each `id` in its **own** catalog (never trust prices from the browser).
2. Create a Stripe Checkout Session: `mode: 'subscription'` for `plan-*` items,
   `mode: 'payment'` for single lessons. (Stripe does not allow mixing in one session;
   split the cart or reject mixed carts.)
3. Return `{ url: session.url }`. Apple Pay / Google Pay appear automatically in Checkout.

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
