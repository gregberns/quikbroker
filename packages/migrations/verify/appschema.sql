-- Verify quikbroker:appschema on pg

BEGIN;

-- Verify schemas exist by selecting from information_schema
SELECT 1/COUNT(*)
FROM information_schema.schemata
WHERE schema_name = 'app';

SELECT 1/COUNT(*)
FROM information_schema.schemata
WHERE schema_name = 'app_private';

SELECT 1/COUNT(*)
FROM information_schema.schemata
WHERE schema_name = 'app_hidden';

ROLLBACK;