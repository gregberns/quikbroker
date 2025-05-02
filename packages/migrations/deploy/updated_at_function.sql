-- Deploy quikbroker:updated_at_function to pg
-- requires: appschema

BEGIN;

-- Create the updated_at trigger function
CREATE OR REPLACE FUNCTION app.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  new.updated_at := transaction_timestamp();
  return new;
END;
$$;

COMMIT;