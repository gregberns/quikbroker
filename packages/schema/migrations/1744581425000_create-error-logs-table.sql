-- Up Migration

-- Create error_logs table to track client-side and server-side errors
CREATE TABLE IF NOT EXISTS app_private.error_logs (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  error_type VARCHAR(50) NOT NULL,
  message TEXT,
  stack TEXT,
  component_stack TEXT,
  url TEXT,
  user_agent TEXT,
  client_timestamp TIMESTAMP,
  metadata JSONB
);

-- Create an index on error_type for faster filtering
CREATE INDEX error_logs_error_type_idx ON app_private.error_logs(error_type);

-- Create an index on created_at for time-based queries
CREATE INDEX error_logs_created_at_idx ON app_private.error_logs(created_at);

-- Down Migration
DROP TABLE IF EXISTS app_private.error_logs;