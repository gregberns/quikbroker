#!/bin/bash

set -e

# cd ./packages/schema/

# ls -la /usr/local/
# ls -la /usr/local/bin/
# ls -la .

# curl -L https://fly.io/install.sh | sh


echo "[DEBUG] DEPLOY_ENV: $DEPLOY_ENV"
echo "[DEBUG] FLY_APP_DB: $FLY_APP_DB"
echo "[DEBUG] FLY_API_TOKEN_DB: $FLY_API_TOKEN_DB"

FLY_API_TOKEN=$FLY_API_TOKEN_DB
# if [ "$DEPLOY_ENV" = "dev" ] || [ "$DEPLOY_ENV" = "DEV" ]; then
#   yarn migrate watch --once || exit 1 # COMMITTED AND CURRENT
# else 
#   yarn migrate migrate || exit 1 # COMITTED ONLY
# fi

# echo "LIST RETRIEVED"

# /root/.fly/bin/flyctl apps list --access-token $FLY_API_TOKEN_DB

echo "LIST RETRIEVED"

/root/.fly/bin/flyctl proxy 5432:5432 -a $FLY_APP_DB --access-token $FLY_API_TOKEN_DB &

echo "AFTER PROXY"

sleep 20  # Wait for proxy to initialize

echo "AFTER SLEEP 2"

# Run the Schema Migration using the local image
# docker run --rm -p 5432:5432 schema-migrations:latest

# yarn schema:migrate

# EXIT_CODE=$?
# if [ $EXIT_CODE -ne 0 ]; then
#   echo "Schema migrations failed with exit code $EXIT_CODE"
#   exit $EXIT_CODE
# fi

