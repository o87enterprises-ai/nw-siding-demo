-- Stores the county property lookup (JSON) alongside each lead.
-- Apply once:  npx wrangler@3 d1 execute nw-siding-leads --remote --file=backend/migrations/002_lead_property_lookup.sql
-- (New databases get this column from schema.sql.)

ALTER TABLE leads ADD COLUMN property TEXT NOT NULL DEFAULT '';
