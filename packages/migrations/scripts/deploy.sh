#!/bin/bash
# Database migration script for CI environments

set -e

# Navigate to the migrations directory
cd "$(dirname "$0")/.."

# Check if we have required environment variables
if [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ] || [ -z "$DB_HOST" ] || [ -z "$DB_NAME" ]; then
  echo "Error: Missing required database environment variables"
  echo "Required: DB_USER, DB_PASSWORD, DB_HOST, DB_NAME"
  exit 1
fi

# Set default port if not specified
DB_PORT=${DB_PORT:-5432}

echo "Deploying database migrations to $DB_HOST:$DB_PORT/$DB_NAME..."

# Deploy all pending changes to the target database
./sqitch deploy "db:pg://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"

# Verify all changes
./sqitch verify "db:pg://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"

echo "Database migration completed successfully"
