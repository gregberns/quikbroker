#!/bin/bash
# Test script for verifying migrations in a development environment

set -e

# Navigate to the migrations directory
cd "$(dirname "$0")/.."

echo "Setting up test database..."

# Create a test database
TEST_DB="quikbroker_test_$(date +%s)"
export PGPASSWORD=${PGPASSWORD:-postgres}

# Check if PostgreSQL is available
if ! command -v psql &> /dev/null; then
  echo "Error: psql command not found. Please install PostgreSQL client tools."
  exit 1
fi

# Create test database
psql -h ${PGHOST:-localhost} -p ${PGPORT:-5432} -U ${PGUSER:-postgres} -c "CREATE DATABASE ${TEST_DB};" postgres

echo "Created test database: ${TEST_DB}"
echo "Running migrations..."

echo $PWD

# Deploy using Sqitch
./sqitch deploy "db:pg://${PGUSER:-postgres}:${PGPASSWORD}@${PGHOST:-localhost}:${PGPORT:-5432}/${TEST_DB}"

echo "Verifying migrations..."

# Verify using Sqitch
./sqitch verify "db:pg://${PGUSER:-postgres}:${PGPASSWORD}@${PGHOST:-localhost}:${PGPORT:-5432}/${TEST_DB}"

echo "All migrations deployed and verified successfully!"

# Optionally clean up
read -p "Do you want to drop the test database? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Cleaning up test database..."
  psql -h ${PGHOST:-localhost} -p ${PGPORT:-5432} -U ${PGUSER:-postgres} -c "DROP DATABASE ${TEST_DB};" postgres
  echo "Test database dropped."
else
  echo "Test database '${TEST_DB}' kept for inspection."
fi

echo "Test complete!"
