#!/bin/bash

# Script to clean all dist and node_modules folders in the project

DOCKER_COMPOSE_CMD=""
if command -v docker-compose >/dev/null 2>&1; then
	DOCKER_COMPOSE_CMD="docker-compose"
elif docker compose version >/dev/null 2>&1; then
	DOCKER_COMPOSE_CMD="docker compose"
else
	DOCKER_COMPOSE_CMD=""
fi

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
if [ -n "$DOCKER_COMPOSE_CMD" ]; then
	$DOCKER_COMPOSE_CMD down -v --remove-orphans
else
	echo "⚠️ Docker Compose not found, skipping containers cleanup"
fi

echo "✅ Cleanup complete!"

