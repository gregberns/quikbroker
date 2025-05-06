-- Verify quikbroker:fmcsa_view on pg

BEGIN;

-- Check that the view exists
SELECT
    dot_number,
    legal_name,
    dba_name,
    carrier_operation,
    phy_state,
    nbr_power_unit,
    driver_total
FROM app.fmcsa_carrier_view
WHERE false;

-- Check that the indexes exist (will error if they don't)
-- SELECT 1/count(*) FROM pg_indexes 
-- WHERE indexname = 'idx_fmcsa_dot_number' AND tablename = 'fmcsa_2025Mar';

-- SELECT 1/count(*) FROM pg_indexes 
-- WHERE indexname = 'idx_fmcsa_legal_name' AND tablename = 'fmcsa_2025Mar';

-- SELECT 1/count(*) FROM pg_indexes 
-- WHERE indexname = 'idx_fmcsa_dba_name' AND tablename = 'fmcsa_2025Mar';

ROLLBACK;
