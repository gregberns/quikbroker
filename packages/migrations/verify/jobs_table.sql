-- Verify quikbroker:jobs_table on pg

BEGIN;

-- Verify table exists and has expected columns
SELECT id, queue_name, task_identifier, payload, priority, run_at, attempts, 
       max_attempts, last_error, created_at, updated_at, key, locked_at, 
       locked_by, revision, flags
FROM app_private.jobs
WHERE FALSE;

-- Verify trigger exists
SELECT 1/COUNT(*)
FROM pg_catalog.pg_trigger
WHERE tgname = 'set_updated_at'
  AND tgrelid = 'app_private.jobs'::regclass;

-- Verify indexes exist
SELECT 1/COUNT(*)
FROM pg_catalog.pg_indexes
WHERE schemaname = 'app_private'
  AND tablename = 'jobs'
  AND indexname LIKE '%jobs_%'
  AND indexdef LIKE '%locked_at IS NULL%';

ROLLBACK;