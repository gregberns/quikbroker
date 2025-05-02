-- Verify quikbroker:brokers_table on pg

BEGIN;

-- Verify table exists and has expected columns
SELECT id, created_at, updated_at, brokerage_name, owner_user_id, invitation_sent_at
FROM app.brokers
WHERE FALSE;

-- Verify trigger exists
SELECT 1/COUNT(*)
FROM pg_catalog.pg_trigger
WHERE tgname = 'set_updated_at'
  AND tgrelid = 'app.brokers'::regclass;

ROLLBACK;
