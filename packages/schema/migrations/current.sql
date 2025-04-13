-- Create the app schema
CREATE SCHEMA IF NOT EXISTS app;

-- Create the app_private schema
CREATE SCHEMA IF NOT EXISTS app_private;

-- Create the app_hidden schema
CREATE SCHEMA IF NOT EXISTS app_hidden;

-- Create the updated_at trigger function
CREATE OR REPLACE FUNCTION app.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  new.updated_at := transaction_timestamp();
  return new;
END;
$$;

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

-- Create the brokers table with standard column order (id, created_at, updated_at)
CREATE TABLE IF NOT EXISTS app.brokers (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    company VARCHAR(255) NOT NULL
);

-- Add invitation_sent_at column to brokers table
ALTER TABLE app.brokers ADD COLUMN IF NOT EXISTS invitation_sent_at TIMESTAMP;

-- Add trigger to update the updated_at column (drop first if exists)
DROP TRIGGER IF EXISTS set_updated_at ON app.brokers;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON app.brokers
FOR EACH ROW
EXECUTE FUNCTION app.set_updated_at();

-- Create the carriers table with standard column order (id, created_at, updated_at)
CREATE TABLE IF NOT EXISTS app.carriers (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    company VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT
);

-- Add invitation_sent_at column to carriers table
ALTER TABLE app.carriers ADD COLUMN IF NOT EXISTS invitation_sent_at TIMESTAMP;

-- Add trigger to update the updated_at column for carriers (drop first if exists)
DROP TRIGGER IF EXISTS set_updated_at ON app.carriers;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON app.carriers
FOR EACH ROW
EXECUTE FUNCTION app.set_updated_at();

select 1;
