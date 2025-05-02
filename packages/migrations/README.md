# QuikBroker Database Migrations

This package manages database migrations for the QuikBroker application using Sqitch.

## Getting Started

1. Install Sqitch following the [official installation guide](https://sqitch.org/download/)
2. Configure your database connection in sqitch.conf or use environment variables

## Usage

### Development

```bash
# Deploy all pending changes
sqitch deploy

# Revert the last change
sqitch revert --to @HEAD^

# Verify all deployed changes
sqitch verify

# Add a new change
sqitch add change_name --requires dependency_name -n "Description of the change"
```

### Adding a New Migration

```bash
# Create a new migration for a table
sqitch add users --requires appschema -n "Creates users table"

# This creates:
# - deploy/users.sql (the SQL to create the table)
# - revert/users.sql (the SQL to revert the change)
# - verify/users.sql (SQL to verify the change was applied)
```

### Running in Docker

```bash
# Build the Docker image
docker build -t quikbroker/migrations .

# Run migrations
docker run --rm \
  -e SQITCH_TARGET=db:pg://user:password@host:port/database \
  quikbroker/migrations
```

### CI Integration

The `scripts/deploy.sh` script can be used in CI environments:

```bash
# Run migrations in CI
./scripts/deploy.sh
```

Required environment variables:
- DB_USER
- DB_PASSWORD
- DB_HOST
- DB_NAME
- DB_PORT (defaults to 5432 if not specified)

## Best Practices

1. Always include proper dependencies between changes
2. Write idempotent deployment scripts when possible
3. Thoroughly test changes before deploying to production
4. Test both deployment and reversion of changes
5. Use transactions when appropriate

## Directory Structure

- `deploy/` - SQL scripts for deploying changes
- `revert/` - SQL scripts for reverting changes
- `verify/` - SQL scripts for verifying changes
- `scripts/` - Helper scripts for CI/CD