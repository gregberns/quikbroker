-- Deploy quikbroker:carriers_table to pg
-- requires: appschema
-- requires: updated_at_function

BEGIN;

-- Create the carriers table with standard column order (id, created_at, updated_at)
CREATE TABLE IF NOT EXISTS app.carriers (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    company VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    invitation_sent_at TIMESTAMP
);

-- Add trigger to update the updated_at column for carriers (drop first if exists)
DROP TRIGGER IF EXISTS set_updated_at ON app.carriers;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON app.carriers
FOR EACH ROW
EXECUTE FUNCTION app.set_updated_at();

COMMIT;