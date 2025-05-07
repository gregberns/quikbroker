-- Deploy quikbroker:appschema to pg
-- requires: 

BEGIN;

-- Create the application schemas
CREATE SCHEMA IF NOT EXISTS app;
CREATE SCHEMA IF NOT EXISTS app_private;
CREATE SCHEMA IF NOT EXISTS app_hidden;
CREATE SCHEMA IF NOT EXISTS fmcsa;

COMMIT;
