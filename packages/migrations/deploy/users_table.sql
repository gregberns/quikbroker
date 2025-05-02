-- Deploy quikbroker:users_table to pg
-- requires: appschema
-- requires: updated_at_function

BEGIN;

-- Create the users table with standard column order (id, created_at, updated_at)
CREATE TABLE IF NOT EXISTS app.users (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'broker', 'carrier'))
);

-- Add trigger to update the updated_at column (drop first if exists)
DROP TRIGGER IF EXISTS set_updated_at ON app.users;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON app.users
FOR EACH ROW
EXECUTE FUNCTION app.set_updated_at();

COMMIT;