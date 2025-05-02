-- Deploy quikbroker:brokers_table to pg
-- requires: appschema
-- requires: updated_at_function
-- requires: users_table

BEGIN;

-- Create the brokers table with standard column order (id, created_at, updated_at)
CREATE TABLE IF NOT EXISTS app.brokers (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(255) NOT NULL,
    primary_email VARCHAR(255) NOT NULL UNIQUE,
    owner_user_id INTEGER REFERENCES app.users(id),
    invitation_sent_at TIMESTAMP,
    brokerage_name VARCHAR(255)
);

-- Add trigger to update the updated_at column (drop first if exists)
DROP TRIGGER IF EXISTS set_updated_at ON app.brokers;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON app.brokers
FOR EACH ROW
EXECUTE FUNCTION app.set_updated_at();

COMMIT;