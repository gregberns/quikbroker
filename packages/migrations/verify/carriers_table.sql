-- Verify quikbroker:carriers_table on pg

BEGIN;

-- Verify table exists and has expected columns
SELECT id, created_at, updated_at, name, email, company, phone, address, invitation_sent_at
FROM app.carriers
WHERE FALSE;

-- Verify trigger exists
SELECT 1/COUNT(*)
FROM pg_catalog.pg_trigger
WHERE tgname = 'set_updated_at'
  AND tgrelid = 'app.carriers'::regclass;

ROLLBACK;