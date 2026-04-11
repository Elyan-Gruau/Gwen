# Install dependencies, build the project, and start the Docker containers
echo "🚀 Launching the project..."

# Installing dependencies, showing only errors
echo "Installing dependencies..."
npm install --loglevel=error

# Building the project, showing only errors
echo "Building the project..."
npm run build --loglevel=error

echo "Starting Docker containers..."
docker compose up -d

echo "Project launched successfully! \n Access the application at http://localhost:5173"