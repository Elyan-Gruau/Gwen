#!/bin/bash

# Script to clean all dist and node_modules folders in the project

echo "🧹 Cleaning dist and node_modules folders..."

# Find and remove all dist folders
echo "Removing dist folders..."
find . -type d -name "dist" -exec rm -rf {} + 2>/dev/null || true

# Find and remove all node_modules folders
echo "Removing node_modules folders..."
find . -type d -name "node_modules" -exec rm -rf {} + 2>/dev/null || true

# Find and remove all node_modules folders
echo "Removing tsconfig.tsbuildinfo ..."
find . -type f -name "tsconfig.tsbuildinfo" -exec rm -rf {} + 2>/dev/null || true

# Remove all docker images with volumes
echo "Removing docker images/volumes ..."
docker-compose down -v --remove-orphans

echo "✅ Cleanup complete!"

