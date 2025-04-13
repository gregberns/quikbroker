-- Up Migration

-- Create the jobs table in app_private schema
CREATE TABLE IF NOT EXISTS app_private.jobs (
    id SERIAL PRIMARY KEY,
    queue_name text,
    task_identifier text NOT NULL,
    payload json NOT NULL DEFAULT '{}'::json,
    priority int4 NOT NULL DEFAULT 0,
    run_at timestamptz NOT NULL DEFAULT now(),
    attempts int4 NOT NULL DEFAULT 0,
    max_attempts int4 NOT NULL DEFAULT 25,
    last_error text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    key text CHECK (length(key) > 0),
    locked_at timestamptz,
    locked_by text,
    revision int4 NOT NULL DEFAULT 0,
    flags jsonb
);

-- Add trigger to update the updated_at column
DROP TRIGGER IF EXISTS set_updated_at ON app_private.jobs;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON app_private.jobs
FOR EACH ROW
EXECUTE FUNCTION app.set_updated_at();

-- Create indexes for common query patterns
CREATE INDEX ON app_private.jobs (queue_name, run_at, id) WHERE locked_at IS NULL;
CREATE INDEX ON app_private.jobs (queue_name, priority DESC, run_at, id) WHERE locked_at IS NULL;
CREATE INDEX ON app_private.jobs (key) WHERE key IS NOT NULL;

-- Down Migration
DROP TABLE IF EXISTS app_private.jobs;
