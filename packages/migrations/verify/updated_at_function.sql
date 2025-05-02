-- Verify quikbroker:updated_at_function on pg

BEGIN;

-- Verify the function exists and has the expected signature
SELECT pg_catalog.has_function_privilege('app.set_updated_at()', 'execute');

-- Verify function returns trigger type
SELECT 1/COUNT(*)
FROM pg_catalog.pg_proc
WHERE proname = 'set_updated_at'
  AND pronamespace = (SELECT oid FROM pg_catalog.pg_namespace WHERE nspname = 'app')
  AND prorettype = (SELECT oid FROM pg_catalog.pg_type WHERE typname = 'trigger');

ROLLBACK;