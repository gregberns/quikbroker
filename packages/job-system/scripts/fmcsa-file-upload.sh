
#!/bin/bash
# Database migration script for CI environments

set -e

# Navigate to the migrations directory
# cd "$(dirname "$0")/.."

# Check if we have required environment variables
if [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ] || [ -z "$DB_HOST" ] || [ -z "$DB_NAME" ]; then
  echo "Error: Missing required database environment variables"
  echo "Required: DB_USER, DB_PASSWORD, DB_HOST, DB_NAME"
  exit 1
fi

# Set default port if not specified
DB_PORT=${DB_PORT:-5432}

echo "Running file load to $DB_HOST:$DB_PORT/$DB_NAME..."

# Deploy all pending changes to the target database
# ./sqitch deploy "db:pg://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"

TABLE_NAME="FMCSA_CENSUS1_2025Mar"

export PGPASSWORD=$DB_PASSWORD

# psql -U "$DB_USER" -d "$DB_NAME"
# \copy table_name FROM './files/FMCSA_CENSUS1_2025Mar/FMCSA_CENSUS1_2025Mar.txt' WITH (FORMAT CSV, HEADER true, DELIMITER ',')

psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME \
  -c "\copy $TABLE_NAME FROM './files/FMCSA_CENSUS1_2025Mar/FMCSA_CENSUS1_2025Mar.txt' WITH (FORMAT CSV, HEADER true, DELIMITER ',')"


echo "File load completed successfully"





