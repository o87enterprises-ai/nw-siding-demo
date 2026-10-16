# Handoff: deploy janet-piano to Cloudflare Pages

**Task:** create the Pages project `janet-piano` and deploy it. Everything is built and tested; only the deploy is left.

- Branch: `o87/confident-hopper-2dbq4k` (PR: o87enterprises-ai/nw-siding-demo#3). Check it out first.
- App lives in `janet-piano/` (Vite + React). The root of the repo is an unrelated siding demo; don't touch it.
- Never print or commit credentials.

## Credentials (already stored in the cloud environment)
Same mapping as the repo's root `DEPLOY.md`. The variable names are misleading, so map them:
```sh
export CLOUDFLARE_EMAIL="$ACCOUNT_ID"                 # ACCOUNT_ID holds the login EMAIL, not an account id
export CLOUDFLARE_API_KEY="$CLOUDFLARE_GLOBAL_TOKEN"  # Global API Key
export CLOUDFLARE_ACCOUNT_ID=1052be08b0c9382768667a9254936f9c
```
Check they're set with `[ -n "$VAR" ] && echo set` (don't echo values). If unset, stop and tell the user to start a fresh session.

## Steps
```sh
cd janet-piano
npm install
npx --yes wrangler@3 pages project list          # confirm auth works and "janet-piano" doesn't exist yet
npm run pages:create                              # creates project, production branch main
npm run deploy                                    # build + upload dist/ and functions/ (--branch main)
```
Then verify: `curl -s https://janet-piano.pages.dev | head -c 300` and
`curl -s -XPOST https://janet-piano.pages.dev/api/checkout -d '{"items":[]}'` should return `{"error":"Payments are not configured yet."}` (503, since no Stripe key yet).
The URL may have a suffix if the name is taken; use whatever wrangler prints.

## After deploying
- Tell the user the live URL. Add the URL and the date to `janet-piano/README.md`, commit, push.
- **Stripe is not set up.** Checkout stays in demo mode (charges nothing) until the user adds a **test** key:
  `npx wrangler@3 pages secret put STRIPE_SECRET_KEY --project-name janet-piano` (the user should enter the key themselves; never ask them to paste it in chat).

## Open items the user may want next
1. Stripe webhook + Supabase (bookings, live availability). See `janet-piano/docs/BACKEND.md`.
2. Real photo of Janet (placeholder in `src/components/About.jsx`), and real prices (`src/lib/catalog.js`).
3. User wanted to clone locally; unresolved whether to keep this repo or split `janet-piano` into its own GitHub repo.
