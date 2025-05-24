-- Deploy quikbroker:carriers_table to pg
-- requires: appschema
-- requires: updated_at_function

BEGIN;

-- Create the carriers table with standard column order (id, created_at, updated_at)
CREATE TABLE IF NOT EXISTS app.carriers (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drop columns that we no longer need
ALTER TABLE app.carriers 
DROP COLUMN IF EXISTS name,
DROP COLUMN IF EXISTS email,
DROP COLUMN IF EXISTS company,
DROP COLUMN IF EXISTS phone,
DROP COLUMN IF EXISTS invitation_sent_at;

ALTER TABLE app.carriers 
    ADD COLUMN IF NOT EXISTS carrier_name VARCHAR(255) NOT NULL;
ALTER TABLE app.carriers
    ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE app.carriers
    ADD COLUMN IF NOT EXISTS owner_user_id INTEGER REFERENCES app.users(id);

-- Add trigger to update the updated_at column for carriers (drop first if exists)
DROP TRIGGER IF EXISTS set_updated_at ON app.carriers;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON app.carriers
FOR EACH ROW
EXECUTE FUNCTION app.set_updated_at();

COMMIT;
