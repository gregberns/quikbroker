# QuikBroker Database Migrations

This package manages database migrations for the QuikBroker application using Sqitch, a database change management system that uses SQL for migrations and plain scripts for deployment.

## Getting Started

### Prerequisites

To work with the migrations locally, you need:

1. [Sqitch](https://sqitch.org/download/) installed on your machine
2. PostgreSQL client tools (psql)
3. Database access credentials

### Installation

If you're using the Docker-based workflow, no local installation is needed. Otherwise, install Sqitch by following the [official installation guide](https://sqitch.org/download/).

## Usage

### Running Migrations with Docker

The simplest way to run migrations is using Docker:

```bash
# Build the migrations image
docker build -t quikbroker/migrations ./packages/migrations

# Run migrations
docker run --rm \
  -e DB_HOST=your-db-host \
  -e DB_PORT=5432 \
  -e DB_NAME=your-db-name \
  -e DB_USER=your-db-user \
  -e DB_PASSWORD=your-db-password \
  quikbroker/migrations deploy
```

### Running Migrations Locally

```bash
# Navigate to the migrations package
cd packages/migrations

# Deploy all pending changes
./sqitch deploy db:pg://username:password@hostname:port/database_name

# Verify all deployed changes
./sqitch verify db:pg://username:password@hostname:port/database_name

# Use the deploy script (uses environment variables)
export DB_HOST=your-db-host
export DB_PORT=5432
export DB_NAME=your-db-name
export DB_USER=your-db-user
export DB_PASSWORD=your-db-password
yarn deploy-script
```

### Testing Migrations

Before pushing changes, test your migrations in a dedicated testing environment:

```bash
# Run the test script which creates a temporary database
yarn test-migrations
```

## Adding New Migrations

### Create a New Change

```bash
# Add a new migration (from the packages/migrations directory)
./sqitch add new_feature --requires dependency_name -n "Description of the change"
```

This will:
1. Create `deploy/new_feature.sql` for your SQL changes
2. Create `verify/new_feature.sql` for verification logic
3. Create an empty `revert/new_feature.sql` file (not used in our workflow)
4. Update `sqitch.plan` with the new change

### Writing Migration Files

1. **Deploy script** (`deploy/new_feature.sql`):
   - Write your SQL changes (CREATE TABLE, ALTER TABLE, etc.)
   - Always wrap in BEGIN/COMMIT blocks for transactions
   - Include proper schema references (app, app_private, app_hidden)

2. **Verify script** (`verify/new_feature.sql`):
   - Include queries that will fail if the migration was not applied correctly
   - Typically SELECT statements with WHERE FALSE to validate schema
   - For functions, use has_function_privilege() checks

3. **Dependencies**:
   - In `sqitch.plan`, ensure proper dependencies are listed

## CI/CD Integration

This package is automatically built and deployed as part of the main QuikBroker CI/CD pipeline in GitHub Actions:

1. The workflow is triggered on:
   - Push to `main` branch
   - Any tag with format `v*` (e.g., v1.0.0)
   - Pull requests to `main` (build only, no deployment)
   - Manual workflow dispatch

2. Pipeline Stages:
   - **Build**: The migrations Docker image is built and pushed to GitHub Container Registry
   - **Test**: Runs any configured tests (currently a placeholder)
   - **Migrate**: Runs database migrations before application deployment
   - **Deploy**: Deploys the application to Railway

3. Dependencies:
   - Migrations always run before application deployment
   - Migrations only run on pushes to main, version tags, or manual triggers
   - All stages must succeed for deployment to proceed

## Directory Structure

```
migrations/
├── deploy/             # SQL scripts for deploying changes
├── verify/             # SQL scripts for verifying changes
├── revert/             # Empty placeholder files (not used)
├── sqitch.conf         # Sqitch configuration
├── sqitch.plan         # Deployment plan
├── sqitch              # Sqitch binary (in the Docker container)
├── scripts/            # Helper scripts
└── Dockerfile          # Docker image definition
```

## Best Practices

1. **Idempotent Scripts**: Write deploy scripts that can be run multiple times without side effects.
2. **Explicit Dependencies**: Always specify dependencies between changes.
3. **Verification**: Include thorough verification scripts that will fail if migrations didn't work.
4. **Transactional DDL**: Wrap changes in transactions where possible.
5. **Incremental Changes**: Make smaller, focused changes rather than massive alterations.
6. **Testing**: Always test migrations before submitting PRs.

## Troubleshooting

- **Connection Issues**: Check your database credentials and network connectivity
- **Permission Errors**: Verify your database user has sufficient privileges
- **Conflict Errors**: If objects already exist, consider using IF NOT EXISTS clauses