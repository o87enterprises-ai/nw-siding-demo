# Handoff — nw-siding-demo

## Status: deployed
The latest build (`master` at 2107af3, bundle `assets/index-DjkIPEmM.js`) is live
at **https://nw-siding-demo.pages.dev** (Cloudflare Pages project
`nw-siding-demo`, deployment `7a1b4d82`, production, success).

An earlier version of this doc named a project `nw-siding-pages` and the branch
`master`. Neither is right: that project does not exist, and the project's
production branch is `main`. See `DEPLOY.md` for the correct commands.

## Project
- Repo: o87enterprises-ai/nw-siding-demo (code lives on `master`)
- Vite + React + framer-motion + react-router. Demo site and proposal deck for
  Northwest Siding Contractors of Eugene, made by o87Enterprises.
- Build: `npm install && node node_modules/vite/bin/vite.js build` → `dist/`
- `dist/` and `node_modules/` are committed. Don't commit further
  `node_modules` or `package-lock.json` changes.

## Hosting
- Cloudflare Pages, project `nw-siding-demo`, **Direct upload** (not git-connected),
  production branch `main`.
- Other Pages projects in the account (leave alone): `nwsiding-preview`, `leana-campaign`,
  `truegle-search`, `o87-portfolio`, `salawn`, `duber`, `duber-tor`, `madhouse-mma`,
  `optimo-dash`.
- Deploy config and commands: `wrangler.toml`, `npm run deploy`, `DEPLOY.md`.

## Open items
1. Rotate the Cloudflare Global API Key, or switch to a scoped Pages-edit API
   token. The Global Key has been used in several sessions.
2. The repo has two diverged branches, `main` (older: initial commit plus a
   wrangler config) and `master` (current code). Decide which is canonical and
   retire the other.

## Credentials
Environment variables only; never print or commit them. See `DEPLOY.md`.

## User preferences
- Explain slowly and thoroughly; give at most 2–3 instructions at a time.
- Do not create extra PRs unless needed; never paste secrets into chat.
