-- Update carriers table schema to have only carrier_name, owner_user_id, and address
-- This replaces the previous schema which had name, email, company, phone fields

-- First drop any existing data and constraints if they exist
-- Since this is a schema restructure, existing data will be lost
TRUNCATE TABLE app.carriers CASCADE;

-- Drop columns that we no longer need
ALTER TABLE app.carriers 
DROP COLUMN IF EXISTS name,
DROP COLUMN IF EXISTS email,
DROP COLUMN IF EXISTS company,
DROP COLUMN IF EXISTS phone,
DROP COLUMN IF EXISTS invitation_sent_at;

-- Add the new carrier_name column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='app' AND table_name='carriers' AND column_name='carrier_name') THEN
        ALTER TABLE app.carriers ADD COLUMN carrier_name VARCHAR(255) NOT NULL;
    END IF;
END $$;

-- Ensure address column exists and is the right type
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='app' AND table_name='carriers' AND column_name='address') THEN
        ALTER TABLE app.carriers ADD COLUMN address TEXT;
    END IF;
END $$;

-- Ensure owner_user_id exists with proper foreign key constraint
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='app' AND table_name='carriers' AND column_name='owner_user_id') THEN
        ALTER TABLE app.carriers ADD COLUMN owner_user_id INTEGER REFERENCES app.users(id);
    END IF;
END $$;