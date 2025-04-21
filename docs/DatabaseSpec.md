# Database Table Format

## Database

Use the Postgres database.

## Environmental Variables

Add all needed environmental variables to an `.env` file.

## Migrations

Migration scripts need to be written so they can be run multiple times.

So `CREATE TABLE` needs to be `CREATE TABLE IF NOT EXISTS`.

Triggers need to be created with a `DROP TRIGGER IF EXISTS` before the create statement.

Indexes need to be dropped with `DROP INDEX IF EXISTS ` before they're created.

## Database Name

The database should be called `quikbroker`

## Schema

All tables, functions, views, and application resources must be created in an `app` schema.
There should also be two more schemas added: `app_private` and `app_hidden`, for data used in backend processes only.

## Required Columns

All tables should be created 

```
id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL,
```

### Updated_At Trigger

A trigger function needs to be created once. This function will update the `updated_at` column any time a row is updated.

```
CREATE FUNCTION app.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  new.updated_at := transaction_timestamp();
  return new;
END;
$$;
```

The `set_updated_at()` function must be added to every table, on the `updated_at` column.

```
CREATE TRIGGER {{TABLE_NAME}}_updated_at BEFORE INSERT OR UPDATE
  ON app.{{TABLE_NAME}} FOR EACH ROW EXECUTE PROCEDURE app.set_updated_at();
```
