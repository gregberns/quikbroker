-- Verify quikbroker:user_invites_table on pg

BEGIN;

-- Verify table exists and has expected columns
SELECT id, created_at, updated_at, user_id, token, expires_at, email_sent_at, used_at, sent_at
FROM app.user_invites
WHERE FALSE;

-- Verify trigger exists
SELECT 1/COUNT(*)
FROM pg_catalog.pg_trigger
WHERE tgname = 'set_updated_at'
  AND tgrelid = 'app.user_invites'::regclass;

-- Verify index exists
SELECT 1/COUNT(*)
FROM pg_catalog.pg_index i
JOIN pg_catalog.pg_class c ON c.oid = i.indexrelid
WHERE c.relname = 'user_invites_token_idx';

ROLLBACK;