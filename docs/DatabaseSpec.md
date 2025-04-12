# Database Table Format

## Database

Use the Postgres database.

## Environmental Variables

Add all needed environmental variables to an `.env` file.

## Migrations

[Graphile Migrate](https://github.com/graphile/migrate) should be used to migrate the database forward.

IMPORTANT: Read the [Configuration Section](https://github.com/graphile/migrate?tab=readme-ov-file#configuration) to understand how to configure the `.gmrc` file.

## Database Name

The database should be called `quikbroker`

## Schema

All tables, functions, views, and application resources must be created in an `app_public` schema.
There should also be two more schemas added: `app_private` and `app_hidden`.

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
