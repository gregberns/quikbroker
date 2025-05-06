#!/bin/bash

# Exit on error
set -e

echo "🏗️  Building UI components package..."
cd "$(dirname "$0")/../packages/ui-components"
yarn build

echo "🏗️  Building MC Lookup project..."
cd ../mclookup
yarn build

echo "🏗️  Building App project..."
cd ../app
yarn build

echo "✅ All projects built successfully"
echo "🚀 You can now start the MC Lookup project with 'cd packages/mclookup && yarn dev'"
echo "🚀 Or start the App project with 'cd packages/app && yarn dev'"