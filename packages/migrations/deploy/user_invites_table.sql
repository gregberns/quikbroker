-- Deploy quikbroker:user_invites_table to pg
-- requires: appschema
-- requires: updated_at_function
-- requires: users_table

BEGIN;

-- Create user_invites table to track user invitations
CREATE TABLE IF NOT EXISTS app.user_invites (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER NOT NULL REFERENCES app.users(id) ON DELETE CASCADE,
    token VARCHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    email_sent_at TIMESTAMP,
    used_at TIMESTAMP,
    sent_at TIMESTAMP  -- Added in a later migration
);

-- Add trigger to update the updated_at column
DROP TRIGGER IF EXISTS set_updated_at ON app.user_invites;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON app.user_invites
FOR EACH ROW
EXECUTE FUNCTION app.set_updated_at();

-- Create an index on the token for fast lookups
CREATE INDEX user_invites_token_idx ON app.user_invites(token);

COMMIT;