-- Revert quikbroker:fmcsa_view from pg

BEGIN;

-- Drop the view
DROP VIEW IF EXISTS app.fmcsa_carrier_view;

-- Drop the indexes
DROP INDEX IF EXISTS fmcsa.idx_fmcsa_dot_number;
DROP INDEX IF EXISTS fmcsa.idx_fmcsa_legal_name;
DROP INDEX IF EXISTS fmcsa.idx_fmcsa_dba_name;

COMMIT;