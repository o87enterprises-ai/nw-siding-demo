# Deploying nw-siding-demo

The site is hosted on **Cloudflare Pages**, project **`nw-siding-demo`**
(https://nw-siding-demo.pages.dev). The project is **Direct upload** (not
git-connected), and its production branch is **`main`**. Pushing to GitHub does
not deploy anything; you deploy by uploading `dist/` with wrangler.

## Config in this repo
- `wrangler.toml` — project name and build output directory (`dist`).
- `package.json` — `npm run deploy` builds and uploads to the project.

## Credentials (never commit or print these)
Set these environment variables before deploying:

| Variable | Value |
|---|---|
| `CLOUDFLARE_EMAIL` | Cloudflare login email |
| `CLOUDFLARE_API_KEY` | Global API Key (or use `CLOUDFLARE_API_TOKEN` with a scoped Pages-edit token instead, which is safer) |
| `CLOUDFLARE_ACCOUNT_ID` | 32-character account id (`1052be08b0c9382768667a9254936f9c`) |

In the cloud-session environment the email and key are stored as `ACCOUNT_ID`
(the **email**, not an account id) and `CLOUDFLARE_GLOBAL_TOKEN` (the Global API
Key). Map them first:

```sh
export CLOUDFLARE_EMAIL="$ACCOUNT_ID"
export CLOUDFLARE_API_KEY="$CLOUDFLARE_GLOBAL_TOKEN"
export CLOUDFLARE_ACCOUNT_ID=1052be08b0c9382768667a9254936f9c
```

## Deploy
```sh
npm install
npm run deploy
```

`dist/` is committed and may already be current. To upload it without rebuilding:

```sh
npx --yes wrangler@3 pages deploy dist --project-name nw-siding-demo --branch main
```

Use `--branch main`. Any other branch name creates a preview deployment, not
production.

## Verify
```sh
curl -s https://nw-siding-demo.pages.dev | grep -o 'assets/index-[^"]*\.js'
```
The bundle name must match the one in `dist/index.html`. Deployment status is
also visible through the API:
`GET /accounts/{id}/pages/projects/nw-siding-demo` (headers `X-Auth-Email`,
`X-Auth-Key`).

## Notes
- `node_modules/` is committed in this repo. Do not commit further changes to it
  or to `package-lock.json`.
- Last deployment: `7a1b4d82` (production, success), bundle `index-DjkIPEmM.js`.
