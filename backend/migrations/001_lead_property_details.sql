-- Adds the optional qualifying fields from the estimate form to existing databases.
-- Apply once:  npx wrangler@3 d1 execute nw-siding-leads --remote --file=backend/migrations/001_lead_property_details.sql
-- (New databases get these columns from schema.sql.)

ALTER TABLE leads ADD COLUMN address  TEXT NOT NULL DEFAULT '';
ALTER TABLE leads ADD COLUMN budget   TEXT NOT NULL DEFAULT '';
ALTER TABLE leads ADD COLUMN timeline TEXT NOT NULL DEFAULT '';
