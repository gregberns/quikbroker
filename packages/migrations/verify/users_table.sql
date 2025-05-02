-- Verify quikbroker:users_table on pg

BEGIN;

-- Verify table exists and has expected columns
SELECT id, created_at, updated_at, email, password_hash, role
FROM app.users
WHERE FALSE;

-- Verify trigger exists
SELECT 1/COUNT(*)
FROM pg_catalog.pg_trigger
WHERE tgname = 'set_updated_at'
  AND tgrelid = 'app.users'::regclass;

ROLLBACK;