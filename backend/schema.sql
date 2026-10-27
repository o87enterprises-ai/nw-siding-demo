-- Cloudflare D1 schema for the NW Siding lead backend.
-- Apply:  npx wrangler@3 d1 execute nw-siding-leads --local  --file=schema.sql
--         npx wrangler@3 d1 execute nw-siding-leads --remote --file=schema.sql

CREATE TABLE IF NOT EXISTS leads (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  first_name   TEXT NOT NULL,
  last_name    TEXT NOT NULL DEFAULT '',
  phone        TEXT NOT NULL DEFAULT '',
  email        TEXT NOT NULL DEFAULT '',
  address      TEXT NOT NULL DEFAULT '',
  zip          TEXT NOT NULL DEFAULT '',
  service      TEXT NOT NULL DEFAULT '',
  budget       TEXT NOT NULL DEFAULT '',
  timeline     TEXT NOT NULL DEFAULT '',
  message      TEXT NOT NULL DEFAULT '',
  source       TEXT NOT NULL DEFAULT 'website',   -- website, google, referral, ...
  utm_source   TEXT NOT NULL DEFAULT '',
  utm_medium   TEXT NOT NULL DEFAULT '',
  utm_campaign TEXT NOT NULL DEFAULT '',
  referrer     TEXT NOT NULL DEFAULT '',
  page         TEXT NOT NULL DEFAULT '',
  status       TEXT NOT NULL DEFAULT 'new',       -- new, contacted, quoted, booked, lost
  notes        TEXT NOT NULL DEFAULT '',
  ip_hash      TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads (created_at);
CREATE INDEX IF NOT EXISTS idx_leads_status  ON leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_iphash  ON leads (ip_hash, created_at);

-- One row per booked job. Amounts are reported by the owner (honor system).
CREATE TABLE IF NOT EXISTS jobs (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id             INTEGER NOT NULL UNIQUE REFERENCES leads (id),
  status              TEXT NOT NULL DEFAULT 'booked',   -- booked, completed, cancelled
  value_cents         INTEGER NOT NULL DEFAULT 0,
  booked_at           TEXT NOT NULL DEFAULT (datetime('now')),
  completed_at        TEXT,
  review_requested_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_jobs_booked    ON jobs (booked_at);
CREATE INDEX IF NOT EXISTS idx_jobs_completed ON jobs (completed_at);

-- Every email the system sends (or would send, in dry-run mode).
CREATE TABLE IF NOT EXISTS messages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  lead_id    INTEGER REFERENCES leads (id),
  kind       TEXT NOT NULL,        -- owner_alert, auto_reply, review_request
  to_addr    TEXT NOT NULL,
  subject    TEXT NOT NULL,
  status     TEXT NOT NULL,        -- sent, dry-run, skipped, failed
  error      TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_messages_lead ON messages (lead_id);
