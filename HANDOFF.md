# Handoff — nw-siding-demo deploy

## Goal
Deploy the latest `master` build to Cloudflare Pages project **nw-siding-pages** (https://nw-siding-pages.dev). The live site is still the OLD version.

## Project
- Repo: o87enterprises-ai/nw-siding-demo (default branch `master`)
- Vite + React + framer-motion + react-router. Demo site and proposal deck for Northwest Siding Contractors of Eugene, made by o87Enterprises ("oh eighty seven", a freelance dev company).
- Build: `npm install && node node_modules/vite/bin/vite.js build` → `dist/`
- `dist/` is committed and is already rebuilt at `master` (commit 2107af3). Uploading it as-is is enough.
- `node_modules/` is committed in the repo (odd; ignore it, don't commit more). Linux build binaries may be missing, so run `npm install` before building. Do not commit the resulting node_modules/package-lock changes.

## Work already done (merged via PR #1)
- Official o87 logo (transparent PNG, `src/assets/o87-logo.png`) on the NDA disclaimer, landing footer, and proposal cover.
- Very faint tiled o87 watermark across the landing page (`src/components/O87.jsx`, `O87Watermark`, ~4.5% opacity).
- "Property of o87Enterprises" line with logo at the bottom of the disclaimer, landing footer, and every proposal slide.
- Legal/proposal text renamed from "o87 Dev" to "o87Enterprises".
- Verified visually on desktop and phone widths with Playwright screenshots.

## What is NOT done: deploy
- The previous session had no Cloudflare credentials (env vars are only read by sessions started AFTER they are saved), and the network proxy returned 502 for nw-siding-pages.dev.
- Unknown whether Pages is git-connected or "Direct upload". The committed `dist` suggests Direct upload.

## Credentials (in this environment's env vars — never print or commit them)
- `ACCOUNT_ID` = the Cloudflare **login email** (used as `X-Auth-Email`), NOT the 32-char account id.
- `CLOUDFLARE_GLOBAL_TOKEN` = Cloudflare **Global API Key** (used as `X-Auth-Key`).
- First check: `env | grep -E "^(ACCOUNT_ID|CLOUDFLARE_GLOBAL_TOKEN)=" | sed 's/=.*/=<set>/'` and confirm the key length is non-zero.

## Next steps
1. Confirm the env vars are present (see above). If not, tell the user to check they were saved on this same environment, and stop.
2. Look up the real 32-char account id: `GET https://api.cloudflare.com/client/v4/accounts` with headers `X-Auth-Email` / `X-Auth-Key`.
3. `GET /accounts/{id}/pages/projects/nw-siding-pages` — check `source` (git-connected vs null = direct upload), production branch, and latest deployment status/errors.
4. If git-connected and the build failed: read the deployment logs and fix (likely the committed node_modules or build command). Retry the deployment.
5. If direct upload: `npx wrangler pages deploy dist --project-name nw-siding-pages --branch master` (wrangler can use CLOUDFLARE_EMAIL + CLOUDFLARE_API_KEY, so export those from the two vars above).
6. Verify: fetch https://nw-siding-pages.dev and confirm the served JS bundle matches `dist/index.html` (currently `assets/index-DjkIPEmM.js`). If the proxy blocks the site, check the deployment URL/status through the API instead.
7. Tell the user the result. Suggest rotating the Global Key (or using a scoped Pages-edit API token) afterwards.

## User preferences
- Explain slowly and thoroughly; give at most 2–3 instructions at a time.
- Do not create extra PRs unless needed; never paste secrets into chat.
