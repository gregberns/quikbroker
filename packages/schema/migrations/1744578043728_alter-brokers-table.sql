-- Up Migration

-- 1. Add the new primary_email column
-- ALTER TABLE app.brokers ADD COLUMN primary_email VARCHAR(255);

-- 2. Copy data from email to primary_email
-- UPDATE app.brokers SET primary_email = email;

-- 3. Add NOT NULL constraint and UNIQUE index to primary_email
-- ALTER TABLE app.brokers ALTER COLUMN primary_email SET NOT NULL;
-- ALTER TABLE app.brokers ADD CONSTRAINT brokers_primary_email_key UNIQUE (primary_email);

-- 4. Add the owner_user_id column
-- ALTER TABLE app.brokers ADD COLUMN owner_user_id INTEGER REFERENCES app.users(id);

-- 5. Drop email column and company column
-- ALTER TABLE app.brokers DROP COLUMN email;
-- ALTER TABLE app.brokers DROP COLUMN company;

