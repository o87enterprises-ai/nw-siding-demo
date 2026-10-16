# Lead backend

**Status: switched off for the preview.** The code lives in `backend/` (not `functions/`) so `wrangler pages deploy`
does not bundle it, and the contact form only calls the API when the site is built with `VITE_LEAD_API=on`.
To turn it on:
1. `git mv backend/functions functions` (Pages deploys the `functions/` folder at the project root).
2. Create the database and add the D1 block to `wrangler.toml` (see One-time setup below).
3. Set the secrets and variables, then `VITE_LEAD_API=on npm run build` and deploy.

Cloudflare Pages Functions plus a D1 database, all on free tiers. Email goes out through Resend's free plan.
Nothing here sends a real email until `RESEND_API_KEY` and `FROM_EMAIL` are set; until then every message is
recorded in the `messages` table with status `dry-run`.

## What it does
| Piece | Route | Notes |
|---|---|---|
| Lead capture | `POST /api/lead` | Used by the contact form. Validates, stores the lead (with source and UTM tags), alerts the owner, auto-replies to the customer if they gave an email. Honeypot field and a 5-per-10-minutes-per-IP limit. |
| Simple CRM | `GET/PATCH /api/admin/leads` | List leads (filter by status), set status (`new`, `contacted`, `quoted`, `booked`, `lost`) and notes. |
| Jobs and auto review | `POST /api/admin/jobs` | Book a job with a dollar value, mark it `completed`. Completing sends one review request (once per job) if the lead has an email and `GOOGLE_REVIEW_URL` is set. |
| 30-day report | `GET /api/admin/report?month=YYYY-MM` | Leads, jobs booked, completed value, top ZIPs and sources, compared with the previous month. Job values are owner-reported (honor system). |

All `/api/admin/*` routes need `Authorization: Bearer <ADMIN_TOKEN>` (token at least 16 characters).
There is no SMS: no free SMS service exists. Email only.

## Settings
Secrets (set with `wrangler pages secret put NAME --project-name nw-siding-demo`):
- `ADMIN_TOKEN` - long random string for the admin routes
- `RESEND_API_KEY` - Resend API key

Plain variables (`wrangler.toml` `[vars]` or the dashboard):
- `OWNER_EMAIL` - where new-lead alerts go, also used as reply-to
- `FROM_EMAIL` - sender, for example `Northwest Siding <leads@northwestsiding.com>` (the domain must be verified in Resend)
- `GOOGLE_REVIEW_URL` - the business's Google review link
- `BUSINESS_NAME`, `BUSINESS_PHONE` - optional, used in email text
- `IP_SALT` - optional random string for hashing IPs

## One-time setup
```sh
npx wrangler@3 d1 create nw-siding-leads        # prints a database_id
# add to wrangler.toml:
#   [[d1_databases]]
#   binding = "DB"
#   database_name = "nw-siding-leads"
#   database_id = "<id from above>"
npx wrangler@3 d1 execute nw-siding-leads --remote --file=backend/schema.sql
```
Then set the secrets and variables above and deploy (see `DEPLOY.md`).

## Using it
```sh
TOKEN=...   # the ADMIN_TOKEN
curl -H "Authorization: Bearer $TOKEN" https://<site>/api/admin/leads?status=new
curl -X PATCH -H "Authorization: Bearer $TOKEN" -H 'content-type: application/json' \
  https://<site>/api/admin/leads -d '{"id":1,"status":"quoted","notes":"Quote sent"}'
curl -X POST -H "Authorization: Bearer $TOKEN" -H 'content-type: application/json' \
  https://<site>/api/admin/jobs -d '{"lead_id":1,"status":"booked","value":18500}'
curl -X POST -H "Authorization: Bearer $TOKEN" -H 'content-type: application/json' \
  https://<site>/api/admin/jobs -d '{"lead_id":1,"status":"completed"}'
curl -H "Authorization: Bearer $TOKEN" https://<site>/api/admin/report
```

## Local testing
```sh
npm run build
npx wrangler@3 d1 execute nw-siding-leads --local --file=backend/schema.sql   # needs the d1 block in wrangler.toml
npx wrangler@3 pages dev dist --d1=DB=<database_id> \
  --binding OWNER_EMAIL=you@example.com ADMIN_TOKEN=some-long-test-token
```

## Free-tier limits (from Cloudflare and Resend docs, check current pages)
- D1 free: 5 million rows read and 100,000 rows written per day, 5 GB storage.
- Resend free: 3,000 emails a month and 100 a day. The free plan allows one sending domain per Resend's announcement; other sources say more, so check.
- Sending to arbitrary recipients from Cloudflare's own email service needs the paid Workers plan, which is why Resend is used.
