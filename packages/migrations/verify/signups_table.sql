-- Verify quikbroker:signups_table on pg

BEGIN;

-- Verify table exists and has expected columns
SELECT id, created_at, updated_at, email, contact_name, brokerage_name, phone_number, 
       utm_source, utm_medium, utm_campaign, utm_content, utm_term
FROM app.signups
WHERE FALSE;

-- Verify trigger exists
SELECT 1/COUNT(*)
FROM pg_catalog.pg_trigger
WHERE tgname = 'signups_updated_at'
  AND tgrelid = 'app.signups'::regclass;

-- Verify index exists
SELECT 1/COUNT(*)
FROM pg_catalog.pg_indexes
WHERE schemaname = 'app'
  AND tablename = 'signups'
  AND indexname = 'idx_signups_email';

ROLLBACK;