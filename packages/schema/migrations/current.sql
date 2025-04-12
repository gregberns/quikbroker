-- Create the app schema
CREATE SCHEMA IF NOT EXISTS app;

-- Create the app_private schema
CREATE SCHEMA IF NOT EXISTS app_private;

-- Create the app_hidden schema
CREATE SCHEMA IF NOT EXISTS app_hidden;

-- Create the updated_at trigger function
CREATE FUNCTION app.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  new.updated_at := transaction_timestamp();
  return new;
END;
$$;
