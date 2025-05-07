#!/bin/bash
set -e

echo "Building MC Lookup static site..."
yarn build

# Check if the output directory exists and contains the expected files
if [ -d "./out" ]; then
  echo "✅ Static site built successfully!"
  
  # Check for index.html
  if [ -f "./out/index.html" ]; then
    echo "✅ index.html found"
  else
    echo "❌ Error: index.html not found in the output directory"
    exit 1
  fi
  
  # Check for CSS files
  if ls ./out/_next/static/css/*.css 1> /dev/null 2>&1; then
    echo "✅ CSS files found"
  else
    echo "❌ Error: No CSS files found in the output directory"
    exit 1
  fi
  
  # Check for JS files
  if ls ./out/_next/static/chunks/*.js 1> /dev/null 2>&1; then
    echo "✅ JavaScript files found"
  else
    echo "❌ Error: No JavaScript files found in the output directory"
    exit 1
  fi
  
  echo "✨ Static site verification complete. Ready for deployment."
else
  echo "❌ Error: Output directory not found. Build may have failed."
  exit 1
fi