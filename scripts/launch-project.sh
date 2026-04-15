#!/bin/bash

# Exit on error, undefined variables, and pipe failures
set -e
set -u
set -o pipefail

# Error handler
trap 'echo "❌ Error: Script failed at line $LINENO"; exit 1' ERR

DOCKER_COMPOSE_CMD=""
if command -v docker-compose >/dev/null 2>&1; then
  DOCKER_COMPOSE_CMD="docker-compose"
elif docker compose version >/dev/null 2>&1; then
  DOCKER_COMPOSE_CMD="docker compose"
else
  echo "❌ Docker Compose is required but was not found"
  exit 1
fi

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
if ! $DOCKER_COMPOSE_CMD up -d --build; then
  echo "❌ Failed to start Docker containers"
  exit 1
fi
echo "✓ Docker containers started successfully"

echo ""
echo "✅ Project launched successfully!"
echo "📍 Access the application at http://localhost:5173"
