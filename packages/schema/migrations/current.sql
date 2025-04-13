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

-- Create the users table
CREATE TABLE IF NOT EXISTS app.users (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'broker', 'carrier'))
);

-- Add trigger to update the updated_at column
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON app.users
FOR EACH ROW
EXECUTE FUNCTION app.set_updated_at();

-- Create the brokers table
CREATE TABLE IF NOT EXISTS app.brokers (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name TEXT NOT NULL,
    company TEXT NOT NULL
);

-- Add trigger to update the updated_at column
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON app.brokers
FOR EACH ROW
EXECUTE FUNCTION app.set_updated_at();
