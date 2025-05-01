-- Up Migration

-- Add brokerage_name column to brokers table with NULL allowed initially
ALTER TABLE app.brokers ADD COLUMN brokerage_name VARCHAR(255);

-- Down Migration

-- Remove brokerage_name column from brokers table
-- ALTER TABLE app.brokers DROP COLUMN brokerage_name;