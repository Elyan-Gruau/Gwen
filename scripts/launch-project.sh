#!/bin/bash

# Exit on error, undefined variables, and pipe failures
set -e
set -u
set -o pipefail

# Error handler
trap 'echo "❌ Error: Script failed at line $LINENO"; exit 1' ERR

echo "🚀 Launching the project..."

# Installing dependencies, showing only errors
echo "📦 Installing dependencies..."
if ! npm install --loglevel=error; then
  echo "❌ Failed to install dependencies"
  exit 1
fi
echo "✓ Dependencies installed successfully"

# Building the project, showing only errors
echo "🔨 Building the project..."
if ! npm run build --loglevel=error; then
  echo "❌ Failed to build the project"
  exit 1
fi
echo "✓ Build completed successfully"

echo "🐳 Starting Docker containers..."
if ! docker-compose up -d --build; then
  echo "❌ Failed to start Docker containers"
  exit 1
fi
echo "✓ Docker containers started successfully"

echo ""
echo "✅ Project launched successfully!"
echo "📍 Access the application at http://localhost:5173"
