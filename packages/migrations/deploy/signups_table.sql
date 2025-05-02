-- Deploy quikbroker:signups_table to pg
-- requires: appschema
-- requires: updated_at_function

BEGIN;

-- Create the signups table in the app schema
CREATE TABLE IF NOT EXISTS app.signups (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- User details
    email TEXT NOT NULL UNIQUE,
    contact_name TEXT,
    brokerage_name TEXT,
    phone_number TEXT,

    -- UTM Tracking Data
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    utm_content VARCHAR(255),
    utm_term VARCHAR(255)
);

-- Add comments to the table and columns
COMMENT ON TABLE app.signups IS 'Stores initial signup information, including leads from the landing page.';
COMMENT ON COLUMN app.signups.email IS 'Unique email address provided during signup.';
COMMENT ON COLUMN app.signups.contact_name IS 'Full name of the contact.';
COMMENT ON COLUMN app.signups.brokerage_name IS 'Name of the brokerage company, if applicable.';
COMMENT ON COLUMN app.signups.phone_number IS 'Contact phone number.';
COMMENT ON COLUMN app.signups.utm_source IS 'UTM source parameter from tracking URL.';
COMMENT ON COLUMN app.signups.utm_medium IS 'UTM medium parameter from tracking URL.';
COMMENT ON COLUMN app.signups.utm_campaign IS 'UTM campaign parameter from tracking URL.';
COMMENT ON COLUMN app.signups.utm_content IS 'UTM content parameter from tracking URL.';
COMMENT ON COLUMN app.signups.utm_term IS 'UTM term parameter from tracking URL.';

-- Create the trigger for updating the updated_at column
DROP TRIGGER IF EXISTS signups_updated_at ON app.signups;
CREATE TRIGGER signups_updated_at BEFORE INSERT OR UPDATE
  ON app.signups FOR EACH ROW EXECUTE PROCEDURE app.set_updated_at();

-- Add index on email for faster lookups
DROP INDEX IF EXISTS app.idx_signups_email;
CREATE INDEX idx_signups_email ON app.signups(email);

COMMIT;